#!/usr/bin/env bun
/**
 * VeilWick — Pick Your New Stepsister E1 Unpacking (60s) — SINGLE REALISM PIPELINE
 *
 * Focus on ONE veilwick video to get super realistic, not cartoonish like candy.ai.
 * Uses Wavespeed:
 *   - posters: wavespeed-ai/wan-2.2/text-to-image-realism ($0.025) 720*1280
 *   - video:   alibaba/wan-2.7/text-to-video (task asks text-to-video-spicy — maps to
 *              alibaba/wan-2.7/text-to-video + alibaba/wan-2.7/image-to-video-spicy fallback;
 *              standalone spicy t2v id not in catalog as of 2026-08-31)
 *              60s via 4x15s stitch with first_frame/last_frame (video-extend → image-to-video).
 *
 * Prompts: from docs/prompts.md base template + LoRA 1333923:0.8
 *   cinematic, synthetic adult woman 18+, {category_mood}, soft studio lighting,
 *   photorealistic, 8k, shallow depth of field, vertical 720x1280, detailed skin, natural pose
 * Added realism tail: photorealistic 8k, shallow DOF, cinematic, ultra-realistic, not cartoonish
 * Negative: cartoon, illustration, anime, painting, blurry (plus base negatives)
 *
 * Flow: poster → 15s test → verify realism → extend to 60s → copy to public/storyboard
 * Outputs: /tmp/single-real/*.jpg/*.mp4 and apps/web/public/storyboard/
 * Keep docs: docs/prompts.md, docs/poster-styles.md, docs/tasks.md untouched (only tasks status updated).
 *
 * Usage:
 *   bun scripts/generate-single-real.ts --poster-only
 *   bun scripts/generate-single-real.ts --test-15s
 *   bun scripts/generate-single-real.ts           # full: poster + 15s verify + 60s
 *   bun scripts/generate-single-real.ts --extend  # only extend from existing seg0
 */

import { execSync } from "node:child_process";
import { mkdirSync, existsSync, copyFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { $ } from "bun";

// --- Config ---
const SERIES_SLUG = "pick-your-new-stepsister";
const EPISODE = 1;
const TITLE = "Pick Your New Stepsister E1 Unpacking";
const OUT_TMP = "/tmp/single-real";
const OUT_PUBLIC = "apps/web/public/storyboard";

const MODEL_POSTER = "wavespeed-ai/wan-2.2/text-to-image-realism";
const MODEL_T2V = "alibaba/wan-2.7/text-to-video";
const MODEL_T2V_SPICY_ALIAS = "alibaba/wan-2.7/text-to-video-spicy"; // requested; not in catalog — fallback to MODEL_T2V
const MODEL_EXTEND = "alibaba/wan-2.7/video-extend";
const MODEL_I2V_SPICY = "alibaba/wan-2.7/image-to-video-spicy";
const MODEL_I2V_FALLBACK = "alibaba/wan-2.7/image-to-video";

const DURATION_SEG = 15;
const SEGMENTS = 4;
const RESOLUTION = "720p";
const ASPECT = "9:16";
const SIZE_POSTER = "720*1280";

// Prompt from docs/prompts.md base template + category unpacking + LoRA 1333923:0.8
// Base: cinematic, synthetic adult woman 18+, {category_mood}, soft studio lighting, photorealistic, 8k, shallow depth of field, vertical 720x1280, detailed skin, natural pose
const BASE_PROMPT_CORE =
  "cinematic, synthetic adult woman 18+, Pick Your New Stepsister unpacking boxes in new bedroom, cardboard boxes, folded clothes, soft studio lighting, photorealistic, 8k, shallow depth of field, vertical 720x1280, detailed skin, natural pose";

const REALISM_TAIL =
  "photorealistic 8k, shallow DOF, cinematic, ultra-realistic, not cartoonish, sharp focus, natural skin texture, soft bokeh";

const LORA_TAG = "LoRA 1333923:0.8";

// For video: add motion cues per segment
const VIDEO_MOTION = [
  "unpacking first box, lifting clothes, smiling, natural movement, slow cinematic dolly, warm daylight",
  "folding clothes into closet, gentle hip sway, soft focus, continuous motion from previous frame",
  "sitting on bed with box, playful glance, hair flowing, shallow depth, continuous motion",
  "standing, stretching, looking at camera, cozy bedroom, warm tones, continuous motion",
];

const NEGATIVE_PROMPT = "cartoon, illustration, anime, painting, blurry";

function buildPosterPrompt(): string {
  // docs/prompts.md base + realism tail + lora
  return `${BASE_PROMPT_CORE}, ${REALISM_TAIL}, ${LORA_TAG}, movie poster style title typography "${TITLE}" faint watermark, vertical 720x1280, cozy domestic unpacking`;
}

function buildVideoPrompt(seg: number): string {
  const motion = VIDEO_MOTION[seg] ?? `continuous motion segment ${seg + 1}/${SEGMENTS}`;
  return `${BASE_PROMPT_CORE}, ${motion}, ${REALISM_TAIL}, vertical 720x1280, 9:16 portrait, ${LORA_TAG}`;
}

function run(cmd: string): string {
  console.log(`> ${cmd}`);
  return execSync(cmd, { encoding: "utf8", stdio: "pipe" });
}

async function ensureDirs(): Promise<void> {
  mkdirSync(OUT_TMP, { recursive: true });
  mkdirSync(OUT_PUBLIC, { recursive: true });
}

async function generatePoster(): Promise<string> {
  const out = join(OUT_TMP, `${SERIES_SLUG}-e${EPISODE}-poster.jpg`);
  const prompt = buildPosterPrompt();
  // wavespeed-ai/wan-2.2/text-to-image-realism — schema has no negative_prompt, so embed exclusion in prompt
  const fullPrompt = `${prompt}, avoid cartoon, illustration, anime, painting, blurry, low quality, deformed`;
  console.log(`[poster] model=${MODEL_POSTER} size=${SIZE_POSTER} -> ${out}`);
  console.log(`[poster] prompt: ${fullPrompt.slice(0, 180)}...`);
  console.log(`[poster] negative (embedded): ${NEGATIVE_PROMPT}`);

  // price check
  try {
    await $`wavespeed price ${MODEL_POSTER} --input prompt=${fullPrompt} --input size=${SIZE_POSTER}`.quiet();
  } catch {}

  // generate — wavespeed CLI uses --download <path> (not -o)
  const cmd = `wavespeed run ${MODEL_POSTER} --input prompt="${fullPrompt.replace(/"/g, '\\"')}" --input size="${SIZE_POSTER}" --download "${out}"`;
  run(cmd);

  if (!existsSync(out)) throw new Error(`[poster] output missing: ${out}`);
  const st = statSync(out);
  console.log(`[poster] saved ${out} (${(st.size / 1024).toFixed(0)} KB)`);

  // verify 720x1280
  try {
    const probe = run(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv "${out}" 2>&1 || identify -format "%w,%h" "${out}" 2>&1 || echo "probe-skipped"`);
    console.log(`[poster] probe: ${probe.trim()}`);
    if (probe.includes("720") && probe.includes("1280")) console.log("[poster] ✓ 720x1280 verified");
    else console.log("[poster] ⚠ dimensions not verified via probe — check visually");
  } catch (e) {
    console.log(`[poster] probe skipped: ${String(e).slice(0, 120)}`);
  }

  // also via sharp if available
  try {
    const dim = await $`python3 -c "from PIL import Image; im=Image.open('${out}'); print(f'{im.size[0]}x{im.size[1]}')"` .text();
    console.log(`[poster] PIL dimensions: ${dim.trim()}`);
  } catch {}

  return out;
}

async function generateTest15s(): Promise<string> {
  const out = join(OUT_TMP, `${SERIES_SLUG}-e${EPISODE}-seg0-15s.mp4`);
  const prompt = buildVideoPrompt(0);
  console.log(`[video-test] model=${MODEL_T2V} (requested ${MODEL_T2V_SPICY_ALIAS}) duration=${DURATION_SEG}s aspect=${ASPECT} res=${RESOLUTION} -> ${out}`);
  console.log(`[video-test] prompt: ${prompt.slice(0, 200)}...`);
  console.log(`[video-test] negative: ${NEGATIVE_PROMPT}`);
  console.log(`[video-test] lora: ${LORA_TAG} (via prompt weight; wan-2.7 t2v has no native lora param — lora models are wan-2.2 t2v-lora variants)`);

  const cmd = `wavespeed run ${MODEL_T2V} --input prompt="${prompt.replace(/"/g, '\\"')}" --input negative_prompt="${NEGATIVE_PROMPT}" --input resolution="${RESOLUTION}" --input aspect_ratio="${ASPECT}" --input duration="${DURATION_SEG}" --download "${out}"`;
  run(cmd);

  if (!existsSync(out)) throw new Error(`[video-test] output missing: ${out}`);
  const st = statSync(out);
  console.log(`[video-test] saved ${out} (${(st.size / 1024 / 1024).toFixed(2)} MB)`);

  // verify duration and resolution
  try {
    const dur = run(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${out}" 2>&1 | head -1`);
    console.log(`[video-test] duration: ${dur.trim()}s (expect ~15s)`);
    const res = run(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv "${out}" 2>&1 | head -1`);
    console.log(`[video-test] resolution: ${res.trim()} (expect 720x1280 or 720p 9:16)`);
  } catch (e) {
    console.log(`[video-test] probe skipped: ${String(e).slice(0, 200)}`);
  }

  console.log("[video-test] realism checklist: photorealistic 8k, shallow DOF, cinematic, vertical 720x1280, not cartoonish — verify visually before extending");
  return out;
}

function extractLastFrame(video: string, out: string): void {
  run(`ffmpeg -y -sseof -0.5 -i "${video}" -vframes 1 "${out}"`);
  console.log(`[frame] extracted last frame -> ${out}`);
}

async function uploadAndGetUrl(localPath: string): Promise<string> {
  // wavespeed image/video inputs expect URL — upload to wavespeed CDN via `wavespeed upload`
  const out = run(`wavespeed upload "${localPath}" 2>&1`);
  // parse URL from output: should print CDN URL
  const urlMatch = out.match(/https:\/\/[^\s"]+\.(jpg|jpeg|png|mp4|webp)/i) ?? out.match(/https:\/\/[^\s"]+/);
  const url = urlMatch?.[0]?.trim();
  if (!url) {
    console.log(`[upload] raw output: ${out.slice(0, 500)}`);
    throw new Error(`[upload] failed to parse CDN URL from wavespeed upload for ${localPath}`);
  }
  console.log(`[upload] ${localPath} -> ${url}`);
  return url;
}

async function generateSegmentWithFrame(
  seg: number,
  prevVideo: string,
  outDir: string,
): Promise<string> {
  const out = join(outDir, `${SERIES_SLUG}-e${EPISODE}-seg${seg}.mp4`);
  if (existsSync(out)) {
    console.log(`[seg${seg}] exists, skipping -> ${out}`);
    return out;
  }
  const prompt = buildVideoPrompt(seg);
  const frameJpg = join(outDir, `${SERIES_SLUG}-e${EPISODE}-seg${seg - 1}-last.jpg`);
  extractLastFrame(prevVideo, frameJpg);
  const frameUrl = await uploadAndGetUrl(frameJpg);

  console.log(`[seg${seg}] stitch prompt: ${prompt.slice(0, 160)}... (frame ${frameUrl.slice(0, 60)}...)`);

  // Prefer image-to-video-spicy with first_frame (no large video upload needed).
  // Video-extend requires uploading the full 15s mp4 (~15 MB) which often aborts on wavespeed upload;
  // we try it only if frame-based fallback fails.
  try {
    console.log(`[seg${seg}] trying ${MODEL_I2V_SPICY} (first_frame image)`);
    const cmd2 = `wavespeed run ${MODEL_I2V_SPICY} --input image="${frameUrl}" --input prompt="${prompt.replace(/"/g, '\\"')}" --input negative_prompt="${NEGATIVE_PROMPT}" --input resolution="${RESOLUTION}" --input duration="${DURATION_SEG}" --download "${out}"`;
    run(cmd2);
    if (existsSync(out)) {
      console.log(`[seg${seg}] ✓ ${MODEL_I2V_SPICY} (frame) -> ${out}`);
      return out;
    }
    throw new Error("no output spicy");
  } catch (e) {
    console.warn(`[seg${seg}] ${MODEL_I2V_SPICY} failed: ${String(e).slice(0, 400)} — trying ${MODEL_EXTEND} with video upload`);
    try {
      const prevVideoUrl = await uploadAndGetUrl(prevVideo);
      console.log(`[seg${seg}] extending via ${MODEL_EXTEND} (video -> video) ${prevVideoUrl.slice(0, 60)}...`);
      const cmd = `wavespeed run ${MODEL_EXTEND} --input video="${prevVideoUrl}" --input prompt="${prompt.replace(/"/g, '\\"')}" --input negative_prompt="${NEGATIVE_PROMPT}" --input resolution="${RESOLUTION}" --input duration="${DURATION_SEG}" --download "${out}"`;
      run(cmd);
      if (existsSync(out)) {
        console.log(`[seg${seg}] ✓ ${MODEL_EXTEND} -> ${out}`);
        return out;
      }
      throw new Error("no output extend");
    } catch (e2) {
      console.warn(`[seg${seg}] ${MODEL_EXTEND} also failed: ${String(e2).slice(0, 300)} — trying ${MODEL_I2V_FALLBACK}`);
      const cmd3 = `wavespeed run ${MODEL_I2V_FALLBACK} --input image="${frameUrl}" --input prompt="${prompt.replace(/"/g, '\\"')}" --input duration="${DURATION_SEG}" --download "${out}"`;
      run(cmd3);
      console.log(`[seg${seg}] ✓ ${MODEL_I2V_FALLBACK} -> ${out}`);
      return out;
    }
  }
}

async function extendTo60s(seg0Path: string): Promise<string> {
  const segs: string[] = [seg0Path];
  let prev = seg0Path;
  for (let seg = 1; seg < SEGMENTS; seg++) {
    const segFile = await generateSegmentWithFrame(seg, prev, OUT_TMP);
    segs.push(segFile);
    prev = segFile;
  }

  const final = join(OUT_TMP, `${SERIES_SLUG}-e${EPISODE}-60s.mp4`);
  const listFile = final + ".txt";
  const listContent = segs.map((f) => `file '${f}'`).join("\n");
  await Bun.write(listFile, listContent);
  console.log(`[concat] ${segs.join(" + ")} -> ${final}`);
  // try stream copy first, fallback to re-encode if concat fails (different codecs)
  try {
    run(`ffmpeg -y -f concat -safe 0 -i "${listFile}" -c copy "${final}"`);
  } catch {
    console.log("[concat] copy failed — re-encoding");
    run(`ffmpeg -y -f concat -safe 0 -i "${listFile}" -c:v libx264 -c:a aac "${final}"`);
  }

  const st = statSync(final);
  console.log(`[concat] final 60s -> ${final} (${(st.size / 1024 / 1024).toFixed(2)} MB)`);
  try {
    const dur = run(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${final}" 2>&1 | head -1`);
    console.log(`[concat] final duration: ${dur.trim()}s (expect ~60s)`);
  } catch {}
  return final;
}

function copyToPublic(paths: string[]): void {
  for (const p of paths) {
    if (!existsSync(p)) {
      console.warn(`[public] skip missing ${p}`);
      continue;
    }
    const base = p.split("/").pop()!;
    const dest = join(OUT_PUBLIC, base);
    copyFileSync(p, dest);
    console.log(`[public] copied ${p} -> ${dest}`);
    // also copy poster as canonical names for storyboard grid
    if (p.includes("poster.jpg")) {
      const canonical = join(OUT_PUBLIC, `${SERIES_SLUG}-poster.jpg`);
      copyFileSync(p, canonical);
      console.log(`[public] canonical poster -> ${canonical}`);
    }
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const posterOnly = args.includes("--poster-only");
  const testOnly = args.includes("--test-15s");
  const extendOnly = args.includes("--extend");

  await ensureDirs();
  console.log(`\n=== VeilWick SINGLE REAL — ${TITLE} ===`);
  console.log(`Poster: ${MODEL_POSTER} $0.025 size ${SIZE_POSTER}`);
  console.log(`Video: ${MODEL_T2V} (alias ${MODEL_T2V_SPICY_ALIAS}) ${RESOLUTION} ${ASPECT} ${DURATION_SEG}s x${SEGMENTS}=60s`);
  console.log(`Prompt base: ${BASE_PROMPT_CORE.slice(0, 100)}... + ${REALISM_TAIL}`);
  console.log(`LoRA: ${LORA_TAG} | Negative: ${NEGATIVE_PROMPT}`);
  console.log(`Out: ${OUT_TMP}/ + ${OUT_PUBLIC}/  (docs kept)\n`);

  if (extendOnly) {
    const seg0 = join(OUT_TMP, `${SERIES_SLUG}-e${EPISODE}-seg0-15s.mp4`);
    if (!existsSync(seg0)) throw new Error(`[extend] missing seg0: ${seg0} — run --test-15s first`);
    const final = await extendTo60s(seg0);
    copyToPublic([final]);
    console.log("\n=== extend done ===");
    return;
  }

  // 1. Poster
  const poster = await generatePoster();
  copyToPublic([poster]);
  if (posterOnly) {
    console.log("\n=== poster only done ===");
    return;
  }

  // 2. 15s test
  const seg0 = await generateTest15s();
  // save seg0 as canonical seg0 for extends
  const seg0Canonical = join(OUT_TMP, `${SERIES_SLUG}-e${EPISODE}-seg0.mp4`);
  if (seg0 !== seg0Canonical) copyFileSync(seg0, seg0Canonical);
  copyToPublic([seg0, seg0Canonical]);
  console.log("\n[verify] 15s test saved — verify realism visually:");
  console.log(`  open ${seg0}`);
  console.log(`  ffprobe + visual check: photorealistic 8k, shallow DOF, not cartoonish`);
  console.log(`  if blurry/cartoon -> re-run with stronger negative / prompt tweak`);

  if (testOnly) {
    console.log("\n=== 15s test done — verify then run with --extend or no flag for 60s ===");
    return;
  }

  // 3. Extend to 60s via first_frame/last_frame
  console.log("\n[extend] generating 60s via first_frame/last_frame stitch (3 more segments)...");
  const final = await extendTo60s(seg0);
  copyToPublic([final, seg0]);

  // also copy a first/last frame for storyboard
  try {
    const firstJpg = join(OUT_TMP, `${SERIES_SLUG}-e${EPISODE}-first.jpg`);
    const lastJpg = join(OUT_TMP, `${SERIES_SLUG}-e${EPISODE}-last.jpg`);
    run(`ffmpeg -y -ss 0.5 -i "${seg0}" -vframes 1 "${firstJpg}"`);
    run(`ffmpeg -y -sseof -0.5 -i "${final}" -vframes 1 "${lastJpg}"`);
    copyToPublic([firstJpg, lastJpg]);
  } catch {}

  console.log(`\n=== done ===`);
  console.log(`Poster: ${poster}`);
  console.log(`Test 15s: ${seg0}`);
  console.log(`Final 60s: ${final}`);
  console.log(`Public: ${OUT_PUBLIC}/`);
  console.log(`Docs kept: docs/prompts.md, docs/poster-styles.md, docs/tasks.md`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
