#!/usr/bin/env bun
/**
 * VeilWick — generate series episodes locally via H3 image-to-video-lora.
 *
 * - 2-3 series, each 5 episodes E1-2 free, E3-5 locked (Upgrade to Premium).
 * - Each episode 5-15s via wavespeed-ai/minimax-h3/image-to-video-lora
 *   with image (first_frame) + last_image (last_frame) stitch for continuity.
 *   Pricing: $0.25 / 5s, 768p 9:16. Local only — no remote.
 * - Writes to R2 local and D1 local via wrangler --local. No --remote.
 * - Prompts are non-explicit fashion/wellness/lifestyle clothed only.
 *
 * Usage:
 *   bun scripts/generate-series-local.ts <slug> [1 2 3 4 5] [--duration 5] [--resolution 768p] [--dry-run]
 *   bun scripts/generate-series-local.ts private-lessons 1 2 3 4 5
 *   bun scripts/generate-series-local.ts your-new-stepsister 1 --dry-run
 *   bun scripts/generate-series-local.ts --help
 *
 * Env:
 *   WAVESPEED_API_KEY required for wavespeed CLI; WAVESPEED_LORA_PATH optional.
 *   Script passes --local to every wrangler command; never uses --remote.
 */

import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const H3_MODEL = "wavespeed-ai/minimax-h3/image-to-video-lora";
const H3_PRICE = 0.25; // per 5s
const DEFAULT_DURATION = 5;
const DEFAULT_RESOLUTION = "768p";
const WRANGLER_CONFIG = "cloudflare/app-worker/wrangler.jsonc";
const R2_BUCKET = "template-uploads";
const D1_DB = "template-db";

// Non-explicit series prompts — clothed fashion/wellness only (see docs/prompts.md §5).
// Each series maps to a base look; episode beat appends tension but stays clothed.
const SERIES_CATALOG: Record<string, { title: string; basePrompt: string; category: string }> = {
  "private-lessons": {
    title: "Private Lessons",
    basePrompt:
      "cinematic vertical 768p 9:16, private lessons wellness lifestyle, linen studio soft daylight, photorealistic 8k, shallow depth, subtle handheld breathing, eye-level POV, warm cinematic LUT, clothed, wellness mood",
    category: "series",
  },
  "your-new-stepsister": {
    title: "Your New Stepsister",
    basePrompt:
      "cinematic vertical 768p 9:16, cozy home lifestyle clothed, morning window light, soft knit loungewear, photorealistic, handheld micro-shake 35mm, warm tones, clothed wellness",
    category: "series",
  },
  "midnight-overtime": {
    title: "Midnight Overtime",
    basePrompt:
      "cinematic vertical 768p 9:16, office lifestyle clothed, soft studio key light, photorealistic, slow push-in, eye-level, shallow depth, warm LUT, clothed",
    category: "series",
  },
};

const EPISODE_BEATS: Record<number, string> = {
  1: "setup, warm daylight, soft smile, introduction",
  2: "tension, glance across room, shared object, eye contact",
  3: "temptation, intentional proximity, hand on shoulder, breath sync — cliffhanger",
  4: "crisis, doorway hesitation, look away, phone buzz, light shift",
  5: "afterglow, soft embrace, golden-hour warmth, tagline moment",
};

const EPISODE_TITLES: Record<number, string> = {
  1: "Episode 1 — First Lesson",
  2: "Episode 2 — After Class",
  3: "Episode 3 — Private Tutoring",
  4: "Episode 4 — Study Hall",
  5: "Episode 5 — Final Exam",
};

function help(): void {
  console.log(`VeilWick generate-series-local — H3 local only ($${H3_PRICE}/5s, 768p 9:16)
Usage: bun scripts/generate-series-local.ts <slug> [episodes...] [options]
  slug: private-lessons | your-new-stepsister | midnight-overtime (or any custom slug)
  episodes: 1 2 3 4 5  (default: 1 2 3 4 5)
Options:
  --duration <5|10|15>    per-episode seconds (default ${DEFAULT_DURATION})
  --resolution <768p|720p> (default ${DEFAULT_RESOLUTION})
  --image <path>          first-frame override for E1
  --last-image <path>     last-frame override
  --dry-run               print commands without executing
  --help

Examples:
  bun scripts/generate-series-local.ts private-lessons 1 2 3 4 5
  bun scripts/generate-series-local.ts your-new-stepsister 1 --duration 5 --dry-run
Local only: every wrangler call uses --local; no --remote. Wavespeed CLI runs locally.`);
}

function run(cmd: string, dryRun: boolean): string {
  console.log(`> ${cmd}`);
  if (dryRun) return "";
  return execSync(cmd, { encoding: "utf8", stdio: "pipe" });
}

function escapeSql(s: string): string {
  return s.replace(/'/g, "''");
}

function buildPrompt(slug: string, ep: number): string {
  const entry = SERIES_CATALOG[slug];
  const base = entry?.basePrompt ??
    "cinematic vertical 768p 9:16, wellness mindfulness, soft daylight, photorealistic, steady cam, eye-level, clothed";
  const beat = EPISODE_BEATS[ep] ?? `episode ${ep}`;
  // Keep non-explicit: clothed, wellness, soft lighting, no nudity tokens.
  return `${base}, ${beat}, vertical 768p 9:16, 5s duration, clothed, synthetic adult 18+ wellness`;
}

function parseArgs(argv: string[]) {
  const args = argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) return { help: true } as const;
  let slug = args[0];
  if (!slug || slug.startsWith("--")) slug = "";
  const episodes: number[] = [];
  let duration = DEFAULT_DURATION;
  let resolution = DEFAULT_RESOLUTION;
  let imageOverride: string | undefined;
  let lastImageOverride: string | undefined;
  let dryRun = false;
  for (let i = 1; i < args.length; i++) {
    const a = args[i];
    if (a === "--duration") duration = Number(args[++i]);
    else if (a === "--resolution") resolution = args[++i];
    else if (a === "--image") imageOverride = args[++i];
    else if (a === "--last-image") lastImageOverride = args[++i];
    else if (a === "--dry-run") dryRun = true;
    else if (a.startsWith("--")) throw new Error(`Unknown flag ${a}`);
    else {
      const n = Number(a);
      if (!Number.isInteger(n) || n < 1 || n > 5) throw new Error(`Episode must be 1-5, got ${a}`);
      episodes.push(n);
    }
  }
  if (!slug) throw new Error("slug is required. Example: bun scripts/generate-series-local.ts private-lessons 1 2");
  if (![5, 10, 15].includes(duration)) throw new Error(`duration must be 5|10|15, got ${duration}`);
  if (episodes.length === 0) episodes.push(1, 2, 3, 4, 5);
  return { help: false as const, slug, episodes, duration, resolution, imageOverride, lastImageOverride, dryRun };
}

function ensureSeriesRow(slug: string, dryRun: boolean): string {
  const entry = SERIES_CATALOG[slug];
  const title = entry?.title ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const category = entry?.category ?? "series";
  const id = `ser_${slug.replace(/[^a-z0-9]/g, "_")}`;
  const thumbnail = `videos/series/${slug}/cover.jpg`;
  const desc = `Candy.ai-style playlist · 5 episodes 5-15s each · H3 ${DEFAULT_RESOLUTION} $0.25/5s · E1-2 free, E3-5 Premium`;
  const creator = "VeilWick Studio";
  // Use wrangler d1 execute --local
  const sql = `INSERT OR IGNORE INTO series (id, title, slug, category, thumbnail, description, creator, tags_json, is_new, vip_required, created_at, updated_at, update_counter) VALUES ('${escapeSql(id)}','${escapeSql(title)}','${escapeSql(slug)}','${escapeSql(category)}','${escapeSql(thumbnail)}','${escapeSql(desc)}','${escapeSql(creator)}','[\"series\",\"playlist\",\"h3\"]',1,0,${Date.now()},${Date.now()},0);`;
  run(`npx wrangler d1 execute ${D1_DB} --local --config ${WRANGLER_CONFIG} --command "${sql.replace(/"/g, '\\"')}"`, dryRun);
  return id;
}

function generateEpisode(
  slug: string,
  seriesId: string,
  ep: number,
  duration: number,
  resolution: string,
  imageOverride: string | undefined,
  lastImageOverride: string | undefined,
  prevLastFrame: string | null,
  dryRun: boolean,
): string | null {
  const locked = ep >= 3;
  const prompt = buildPrompt(slug, ep);
  const title = EPISODE_TITLES[ep] ?? `Episode ${ep}`;
  // Resolve first/last frame paths for stitch
  // Priority: override > previous episode last frame > local poster > none
  let image = imageOverride ?? prevLastFrame ?? undefined;
  if (!image) {
    const candidates = [
      `posters/series/${slug}/ep${ep}-first.jpg`,
      `apps/web/public/series-posters/${slug}.jpg`,
      `posters/feed/market-stall-fashion/first.jpg`,
    ];
    image = candidates.find((p) => existsSync(p));
  }
  let lastImage = lastImageOverride;
  if (!lastImage) {
    const cand = `posters/series/${slug}/ep${ep}-last.jpg`;
    if (existsSync(cand)) lastImage = cand;
  }
  if (!image) {
    console.warn(`[generate-series-local] no first-frame image found for ${slug} E${ep}; H3 will use prompt-only (continuity reduced)`);
  }
  const outDir = join("output", "series", slug);
  mkdirSync(outDir, { recursive: true });
  const outVideo = join(outDir, `ep${ep}.mp4`);
  // Build wavespeed CLI — local only
  const loras = process.env.WAVESPEED_LORA_PATH ? ` --loras "${process.env.WAVESPEED_LORA_PATH}"` : "";
  const lastArg = lastImage ? ` --last-image "${lastImage}"` : "";
  const imageArg = image ? ` --image "${image}"` : "";
  // wavespeed CLI writes to output; we use -o if supported, else default
  const wavCmd = `wavespeed run ${H3_MODEL}${imageArg}${lastArg} --prompt "${prompt.replace(/"/g, '\\"')}" --duration ${duration} --resolution ${resolution}${loras} -o "${outVideo}"`;
  const price = (duration / 5) * H3_PRICE;
  console.log(`[generate-series-local] ${slug} E${ep} ${locked ? "🔒 Premium" : "free"} ${duration}s ${resolution} $${price.toFixed(2)} stitch image=${image ?? "none"} last_image=${lastImage ?? "none"}`);
  try {
    run(wavCmd, dryRun);
  } catch (e) {
    console.error(`[generate-series-local] wavespeed failed for ${slug} E${ep}: ${String(e)}`);
    if (!dryRun) throw e;
  }
  if (!dryRun && !existsSync(outVideo)) {
    console.warn(`[generate-series-local] expected output missing ${outVideo} (dry-run or wavespeed output path differs)`);
  }
  // Extract poster at 1.2s
  const poster = join(outDir, `ep${ep}.jpg`);
  if (!dryRun && existsSync(outVideo)) {
    try {
      run(`ffmpeg -y -ss 1.2 -i "${outVideo}" -vframes 1 -s 720x1280 -q:v 2 "${poster}"`, dryRun);
    } catch {
      console.warn(`[generate-series-local] ffmpeg poster failed for E${ep}`);
    }
  }
  // Upload to R2 local and D1 local — never remote
  const r2VideoKey = `videos/series/${slug}/ep${ep}.mp4`;
  const r2PosterKey = `posters/series/${slug}/ep${ep}.jpg`;
  if (!dryRun && existsSync(outVideo)) {
    run(`npx wrangler r2 object put ${R2_BUCKET}/${r2VideoKey} --file "${outVideo}" --local --config ${WRANGLER_CONFIG}`, dryRun);
  }
  if (!dryRun && existsSync(poster)) {
    run(`npx wrangler r2 object put ${R2_BUCKET}/${r2PosterKey} --file "${poster}" --local --config ${WRANGLER_CONFIG}`, dryRun);
  }
  // D1 upsert episode with stitch metadata
  const epId = `ep_${slug.replace(/[^a-z0-9]/g, "_")}_${ep}`;
  const videoUrl = r2VideoKey;
  const posterUrl = r2PosterKey;
  const now = Date.now();
  const unlockPrice = locked ? 99 : 0;
  const firstFrameUrl = image ?? "";
  const lastFrameUrl = lastImage ?? "";
  const sql = `INSERT OR REPLACE INTO episodes (id, series_id, num, title, duration, poster_url, video_url, locked, unlock_price, prompt, first_frame_url, last_frame_url, h3_model, resolution, created_at, updated_at, update_counter) VALUES ('${escapeSql(epId)}','${escapeSql(seriesId)}',${ep},'${escapeSql(title)}',${duration},'${escapeSql(posterUrl)}','${escapeSql(videoUrl)}',${locked ? 1 : 0},${unlockPrice},'${escapeSql(prompt)}','${escapeSql(firstFrameUrl)}','${escapeSql(lastFrameUrl)}','${escapeSql(H3_MODEL)}','${escapeSql(resolution)}',${now},${now},0);`;
  run(`npx wrangler d1 execute ${D1_DB} --local --config ${WRANGLER_CONFIG} --command "${sql.replace(/"/g, '\\"')}"`, dryRun);
  // Return poster or last frame path for next episode stitch (extract last frame for continuity)
  if (!dryRun && existsSync(outVideo)) {
    const lastFrameExtract = join(outDir, `ep${ep}-last.jpg`);
    try {
      run(`ffmpeg -y -sseof -0.5 -i "${outVideo}" -vframes 1 -s 720x1280 -q:v 2 "${lastFrameExtract}"`, dryRun);
      if (existsSync(lastFrameExtract)) return lastFrameExtract;
    } catch {}
  }
  return lastImage ?? image ?? null;
}

async function main(): Promise<void> {
  const parsed = parseArgs(process.argv);
  if (parsed.help) {
    help();
    return;
  }
  const { slug, episodes, duration, resolution, imageOverride, lastImageOverride, dryRun } = parsed;
  // Enforce local only — refuse if any arg suggests remote
  if (process.argv.includes("--remote")) throw new Error("Refusing --remote: script is local only (use --local wrangler flags internally)");
  console.log(`[generate-series-local] slug=${slug} episodes=${episodes.join(",")} duration=${duration}s resolution=${resolution} ${dryRun ? "(dry-run)" : "local only"}`);
  if (!process.env.WAVESPEED_API_KEY && !dryRun) {
    console.warn("[generate-series-local] WAVESPEED_API_KEY not set — wavespeed CLI will fail. Set in .dev.vars or env. Use --dry-run to test.");
  }
  const seriesId = ensureSeriesRow(slug, dryRun);
  let prevLastFrame: string | null = null;
  // For single override, only apply to first episode in list
  let firstImage = imageOverride;
  for (const ep of episodes.sort((a, b) => a - b)) {
    const nextLast = generateEpisode(slug, seriesId, ep, duration, resolution, firstImage, lastImageOverride, prevLastFrame, dryRun);
    prevLastFrame = nextLast;
    firstImage = undefined; // only first episode uses override
  }
  console.log(`[generate-series-local] done ${slug} episodes ${episodes.join(",")} — verify: wrangler d1 execute ${D1_DB} --local --command "SELECT num, title, locked, duration, resolution, first_frame_url, last_frame_url FROM episodes WHERE series_id='${seriesId}' ORDER BY num"`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
