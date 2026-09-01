#!/usr/bin/env bun
/**
 * Generate 720x1280 posters for every episode + series cover.
 *
 * For each series/episode:
 *   1. Ensure video exists (Wan generate or existing R2 key).
 *   2. ffmpeg -ss 1.2 -i video.mp4 -vframes 1 -s 720x1280 -q:v 2 poster.jpg
 *   3. Upload to R2: posters/series/{slug}/ep{num}.jpg and cover.jpg
 *
 * Usage:
 *   bun run scripts/generate-posters.ts [--dry-run]
 */

import { $ } from "bun";
import { posterKey, seriesCoverKey, ffmpegPosterCommand } from "../apps/web/src/lib/posters";
import { SERIES_DATA } from "../apps/web/src/components/series/data";

const DRY = process.argv.includes("--dry-run");

async function posterFor(seriesSlug: string, ep: number, videoPath: string, outPath: string) {
  const cmd = ffmpegPosterCommand(videoPath, outPath);
  console.log(`[poster] ${seriesSlug} ep${ep}: ${cmd}`);
  if (DRY) return;
  await $`ffmpeg -ss 1.2 -i ${videoPath} -vframes 1 -s 720x1280 -q:v 2 -y ${outPath}`.quiet();
  const key = posterKey(seriesSlug, ep);
  console.log(`[poster] -> upload R2 ${key}`);
  // wrangler r2 object put template-uploads/${key} --file=${outPath}
  await $`wrangler r2 object put template-uploads/${key} --file=${outPath} --content-type=image/jpeg`.quiet();
}

async function coverFor(seriesSlug: string, ep1Poster: string) {
  const key = seriesCoverKey(seriesSlug);
  console.log(`[cover] ${seriesSlug}: ep1 -> ${key}`);
  if (DRY) return;
  await $`wrangler r2 object put template-uploads/${key} --file=${ep1Poster} --content-type=image/jpeg`.quiet();
}

for (const s of SERIES_DATA) {
  const slug = s.id.startsWith("s") ? `series_${s.id}` : s.id;
  // derive slug from posterUrl: posters/series/{slug}/cover.jpg
  const slugFromPoster = s.posterUrl.split("/").at(-2) ?? slug;
  for (const ep of s.episodes) {
    const videoPath = ep.videoUrl; // R2 key videos/series/{slug}/ep{num}.mp4 — download first if needed
    const tmpVideo = `/tmp/${slugFromPoster}-ep${ep.number}.mp4`;
    const tmpPoster = `/tmp/${slugFromPoster}-ep${ep.number}.jpg`;
    if (DRY) {
      await posterFor(slugFromPoster, ep.number, tmpVideo, tmpPoster);
    } else {
      // best-effort download; skip if missing (Wan not yet generated)
      try {
        await $`wrangler r2 object get template-uploads/${videoPath} --file=${tmpVideo}`.quiet();
        await posterFor(slugFromPoster, ep.number, tmpVideo, tmpPoster);
      } catch {
        console.warn(`[poster] skip ${slugFromPoster} ep${ep.number}: video not in R2 yet (${videoPath})`);
      }
    }
  }
  await coverFor(slugFromPoster, `/tmp/${slugFromPoster}-ep1.jpg`);
}

console.log("[poster] done. Verify 720x1280: ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv poster.jpg");
