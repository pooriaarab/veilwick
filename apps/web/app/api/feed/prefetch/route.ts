import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createId } from "@paralleldrive/cuid2";
import { getDB } from "@/db";
import { videoTable } from "@/db/schema/veilwick";
import { h3R2Key } from "@/lib/h3";
import { getRankedCategoriesForUser } from "@/lib/personalization";
import {
  FEED_CATEGORIES,
  MMH3_DEFAULT_LORA_PATH,
  getFeedPrompt,
  type WavespeedLora,
} from "@/lib/wavespeed";

function buildPrefetchLoras(): WavespeedLora[] {
  const raw = process.env.WAVESPEED_LORA_PATH || MMH3_DEFAULT_LORA_PATH;
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.map((path) => ({ path, scale: 1 }));
}

export const dynamic = "force-dynamic";

/**
 * POST /api/feed/prefetch — local D1/R2 miniflare --local only, no --remote, no Vast.
 * Body: { userId?: string, activeIndex: number, buffer: number, category?: string }
 * Triggered by client when buffer <2 OR IntersectionObserver sentinel near end (rootMargin 200px):
 *   client checks displayVideos.length - activeIndex -1 < 2, then silent POST here + /api/feed?personalized=true handles buffer.
 * Enqueues H3 image-to-video-lora generation jobs via local OUTBOX_QUEUE only (no Vast, no remote):
 *  - wavespeed-ai/minimax-h3/image-to-video-lora with image+last_image+loras [{path, scale:1}] (WAVESPEED_LORA_PATH or /tmp/MysticXXX_MMH3-V4.safetensors) + prompt + duration:5 + resolution:768p
 *  - model: wavespeed-ai/minimax-h3/image-to-video-lora — LoRA MysticXXX_MMH3-V4.safetensors 2856467:3266628 scale 1
 *  - prompts stay non-explicit clothed fashion/wellness only; loras wired for realism test.
 *  - Silent generation: failures swallowed client-side, loading indicator via isPrefetching spinner, infinite scroll continues on fallback 8.
 * Realism gate: /prototype-scenes — generate ONE video first, then feed expands to storyboard prompts (docs/prompts.md §5).
 */
export async function POST(request: Request) {
  let body: any = {};
  try {
    body = await request.json();
  } catch {}
  const userId: string = body.userId || request.headers.get("x-user-id") || "anon";
  const buffer: number = typeof body.buffer === "number" ? body.buffer : 0;
  const activeIndex: number = typeof body.activeIndex === "number" ? body.activeIndex : 0;

  if (buffer >= 2 && body.buffer !== undefined) {
    return NextResponse.json({ queued: 0, reason: "buffer_ok" });
  }

  let ranked: string[] = [];
  if (userId !== "anon") {
    try {
      const r = await getRankedCategoriesForUser(userId);
      ranked = r.map((x) => x.category);
    } catch {}
  }
  const fallbackCat = (body.category as string) ?? FEED_CATEGORIES[0];
  const categories = ranked.length
    ? ranked.filter((c) => (FEED_CATEGORIES as readonly string[]).includes(c))
    : [fallbackCat, ...FEED_CATEGORIES.slice(0, 3)];
  const safeCategories = categories.filter((c) => (FEED_CATEGORIES as readonly string[]).includes(c));
  const cats = safeCategories.length ? safeCategories : ([...FEED_CATEGORIES] as string[]);

  try {
    const ctx: any = await getCloudflareContext({ async: true }).catch(() => null);
    const queue: Queue<any> | null = ctx?.env?.OUTBOX_QUEUE ?? null;
    const db = await getDB();
    const need = Math.max(2 - buffer, 2);
    let queued = 0;
    for (let i = 0; i < need; i++) {
      const cat = (cats[(activeIndex + i) % cats.length] ?? "wellness") as (typeof FEED_CATEGORIES)[number];
      const safeCat = (FEED_CATEGORIES as readonly string[]).includes(cat) ? cat : "wellness";
      const prompt = getFeedPrompt(safeCat);
      const vid = `vid_${createId()}`;
      const r2Key = h3R2Key(safeCat, userId, vid.replace("vid_", ""));
      const image = `https://cdn.veilwick.com/${r2Key}`;
      if (queue) {
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
            loras: buildPrefetchLoras(),
            duration: 5,
            resolution: "768p",
            model: "wavespeed-ai/minimax-h3/image-to-video-lora",
          },
          createdAt: new Date().toISOString(),
        });
      }
      await db.insert(videoTable).values({ id: vid, category: safeCat, prompt, r2Key, status: "pending" }).catch(() => {});
      queued++;
    }
    return NextResponse.json({ queued, categories: cats.slice(0, 3) });
  } catch (e: any) {
    return NextResponse.json({ queued: 0, error: e?.message ?? "unknown" }, { status: 500 });
  }
}
