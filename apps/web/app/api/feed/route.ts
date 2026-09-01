import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { getDB } from "@/db";
import { videoTable } from "@/db/schema/veilwick";
import { getRankedCategoriesForUser } from "@/lib/personalization";
import {
  FEED_CATEGORIES,
  MMH3_DEFAULT_LORA_PATH,
  getFeedPrompt,
  type WavespeedLora,
} from "@/lib/wavespeed";
import type { FeedVideo } from "@/types/feed";

function buildFeedLoras(): WavespeedLora[] {
  const raw = process.env.WAVESPEED_LORA_PATH || MMH3_DEFAULT_LORA_PATH;
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.map((path) => ({ path, scale: 1 }));
}

export const dynamic = "force-dynamic";

/**
 * GET /api/feed?personalized=true&offset=0&limit=10
 *
 * H3 delivery — Wavespeed-only (no Vast, no remote), local D1/R2 miniflare --local only:
 *  - Model: wavespeed-ai/minimax-h3/image-to-video-lora ($0.25 / 5s, 768p 9:16)
 *  - Inputs: image (first frame) + last_image (optional stitch) + loras [{path, scale:1}] (WAVESPEED_LORA_PATH or /tmp/MysticXXX_MMH3-V4.safetensors) + prompt + duration 5 + resolution 768p
 *  - LoRA: MysticXXX_MMH3-V4.safetensors model 2856467 version 3266628 — scale 1, wired for realism test (prompts stay non-explicit clothed)
 *  - Reference fallback: wavespeed-ai/minimax-h3/reference-to-video-lora ($0.30, same loras)
 *  - Prompts from docs/prompts.md §5 feed categories — non-explicit fashion/wellness/lifestyle clothed only
 *  - Tags by angle/POV/lighting
 *  - R2 key: videos/{category}/{userId}/{id}.mp4 (5s H3 clips) — R2 UPLOADS preview_bucket local
 *  - D1 videos ordered by affinity when personalized=true (local template-db, wrangler --local, never --remote)
 *  - KV session cache (SESSION_CACHE or FLAGS) keyed by user
 *  - Workers Queue (OUTBOX_QUEUE) local only for H3 generation when buffer low (h3.generate image+last_image+loras)
 *  - Pagination: ?offset=&limit= for infinite scroll (sentinel IntersectionObserver + buffer<2 prefetch)
 *  - Auto-generate: when buffer < 10 enqueues H3; client infinite scroll requires no manual generate
 *  - No Wan fallback for scroll feed — Wan reserved for candy.ai short library
 *  - Realism gate: /prototype-scenes — generate ONE H3 video first, validate 720x1280 photorealism, then expand to storyboard
 */

function kvForSession(env: any): KVNamespace | null {
  return env.SESSION_CACHE ?? env.FLAGS ?? env.SESSION ?? null;
}

function orderByAffinity<T extends { category: string }>(rows: T[], ranked: string[]): T[] {
  if (ranked.length === 0) return rows;
  const rank = new Map(ranked.map((c, i) => [c, i]));
  return [...rows].sort((a, b) => {
    const ra = rank.get(a.category) ?? 999;
    const rb = rank.get(b.category) ?? 999;
    return ra - rb;
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const personalized = url.searchParams.get("personalized") === "true";
  const offset = Math.max(0, parseInt(url.searchParams.get("offset") ?? "0", 10) || 0);
  const limit = Math.min(20, Math.max(1, parseInt(url.searchParams.get("limit") ?? "10", 10) || 10));

  let userId: string | null = null;
  try {
    const ctx: any = await getCloudflareContext({ async: true }).catch(() => null);
    const env = ctx?.env;
    if (env) userId = null;
  } catch {}
  const headerUser = request.headers.get("x-user-id");
  if (headerUser) userId = headerUser;

  const cacheKey = `feed:${userId ?? "anon"}:p:${personalized ? "1" : "0"}:o:${offset}:l:${limit}`;

  try {
    const ctx: any = await getCloudflareContext({ async: true }).catch(() => null);
    const kv: KVNamespace | null = ctx?.env ? kvForSession(ctx.env) : null;
    if (kv) {
      const cached = await kv.get(cacheKey, "json");
      if (cached && Array.isArray((cached as any).videos)) {
        return NextResponse.json(cached as any, {
          headers: { "X-Cache": "HIT", "X-Feed-Buffer": String((cached as any).videos.length) },
        });
      }
    }
  } catch {}

  try {
    const db = await getDB();
    let rankedCats: string[] = [];
    if (personalized && userId) {
      try {
        const ranked = await getRankedCategoriesForUser(userId);
        rankedCats = ranked.map((r) => r.category);
      } catch {}
    }

    // Local D1 only (wrangler --local, D1 template-db binding). Fetch ready rows with offset/limit for infinite scroll.
    let rows = await db.select().from(videoTable).where(eq(videoTable.status, "ready")).limit(20).offset(offset);

    if (personalized && rankedCats.length > 0) {
      rows = orderByAffinity(rows, rankedCats);
    } else if (personalized) {
      rows.sort((a, b) => (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0));
    }

    const videos: FeedVideo[] = rows.slice(0, limit).map((r) => ({
      id: r.id,
      category: r.category as FeedVideo["category"],
      creator: { handle: "veilwick.ai", displayName: "VeilWick Studio", avatarUrl: "" },
      caption: r.prompt,
      hashtags: [`#${r.category}`, "#h3", "#5s"],
      music: "original audio — h3 5s fashion wellness",
      videoUrl: r.r2Key,
      posterUrl: undefined,
      likes: 0,
      comments: 0,
      shares: 0,
    }));

    // Enqueue H3 image-to-video-lora generation if buffer low
    if (videos.length < 10) {
      try {
        const ctx: any = await getCloudflareContext({ async: true }).catch(() => null);
        const queue: Queue<any> | null = ctx?.env?.OUTBOX_QUEUE ?? null;
        if (queue && userId) {
          const need = 10 - videos.length;
          const { h3R2Key } = await import("@/lib/h3");
          const { createId } = await import("@paralleldrive/cuid2");
          for (let i = 0; i < Math.min(need, 3); i++) {
            const cat = (rankedCats[i] as (typeof FEED_CATEGORIES)[number]) ?? FEED_CATEGORIES[i % FEED_CATEGORIES.length];
            const safeCat = FEED_CATEGORIES.includes(cat as any) ? cat : "wellness";
            const prompt = getFeedPrompt(safeCat);
            const vid = `vid_${createId()}`;
            const r2Key = h3R2Key(safeCat, userId, vid.replace("vid_", ""));
            // first-frame + last_image stitch: use R2 key as placeholder image URLs via cdn domain; queue consumer resolves to signed URLs
            const image = `https://cdn.veilwick.com/${r2Key}`;
            await queue.send({
              type: "h3.generate",
              id: crypto.randomUUID(),
              payload: {
                prompt,
                category: safeCat,
                userId,
                videoId: vid,
                r2Key,
                image,
                last_image: undefined,
                loras: buildFeedLoras(),
                duration: 5,
                resolution: "768p",
                model: "wavespeed-ai/minimax-h3/image-to-video-lora",
              },
              createdAt: new Date().toISOString(),
            });
            await db.insert(videoTable).values({ id: vid, category: safeCat, prompt, r2Key, status: "pending" }).catch(() => {});
          }
        }
      } catch {}
    }

    const body = { videos, meta: { personalized, buffer: videos.length, needsH3: videos.length < 10 } };

    try {
      const ctx: any = await getCloudflareContext({ async: true }).catch(() => null);
      const kv: KVNamespace | null = ctx?.env ? kvForSession(ctx.env) : null;
      if (kv) await kv.put(cacheKey, JSON.stringify(body), { expirationTtl: 30 });
    } catch {}

    return NextResponse.json(body, {
      headers: { "X-Cache": "MISS", "X-Feed-Buffer": String(videos.length) },
    });
  } catch (e) {
    return NextResponse.json(
      { videos: [], meta: { personalized, buffer: 0, needsH3: true, error: "d1_unavailable" } },
      { headers: { "X-Feed-Buffer": "0" } },
    );
  }
}
