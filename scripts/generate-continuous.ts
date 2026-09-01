#!/usr/bin/env bun
/**
 * VeilWick 60s continuous generation — candy.ai seamless stitching.
 * Series: "Your New Stepsister" E1-2 | 60s = 4x15s segments.
 * Model: alibaba/wan-2.7/text-to-video + video-extend/image-to-video stitch.
 */
import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const SERIES = "Your New Stepsister";
const EPISODES = [1, 2] as const;
const SEGMENTS = 4;
const DURATION = 15;
const MODEL_T2V = "alibaba/wan-2.7/text-to-video";
const MODEL_EXTEND = "alibaba/wan-2.7/video-extend";
const MODEL_I2V = "alibaba/wan-2.7/image-to-video";
const ASPECT = "9:16";

const PROMPTS: Record<number, string> = {
  1: "goth streamer DarkAngel, pale skin, dark makeup, black crop top, neon bedroom, soft cinematic lighting, photorealistic, vertical 9:16, intimate tease, 18+ synthetic adult",
  2: "goth streamer DarkAngel, after-stream, bedroom doorway, Your New Stepsister tension, soft focus, photorealistic, 18+ synthetic adult",
};

function run(cmd: string): string {
  console.log(`> ${cmd}`);
  return execSync(cmd, { encoding: "utf8", stdio: "pipe" });
}

function extractFrame(video: string, out: string): void {
  run(`ffmpeg -y -sseof -0.5 -i "${video}" -vframes 1 "${out}"`);
}

function segmentPrompt(ep: number, seg: number): string {
  return `${PROMPTS[ep]} — segment ${seg + 1}/${SEGMENTS}, continuous motion`;
}

function generateSegment(ep: number, seg: number, prevFrame: string | null, outDir: string): string {
  const out = join(outDir, `e${ep}-seg${seg}.mp4`);
  const prompt = segmentPrompt(ep, seg);
  if (seg === 0 || !prevFrame) {
    run(`wavespeed run ${MODEL_T2V} --prompt "${prompt}" --input aspect_ratio=${ASPECT} --input duration=${DURATION} -o "${out}"`);
  } else {
    try {
      run(`wavespeed run ${MODEL_EXTEND} --input first_frame="${prevFrame}" --input prompt="${prompt}" --input duration=${DURATION} -o "${out}"`);
    } catch {
      run(`wavespeed run ${MODEL_I2V} --image "${prevFrame}" --prompt "${prompt}" --input duration=${DURATION} --input aspect_ratio=${ASPECT} -o "${out}"`);
    }
  }
  return out;
}

function stitchSegments(files: string[], out: string): void {
  const list = files.map((f) => `file '${f}'`).join("\n");
  const listFile = out + ".txt";
  run(`printf "${list}" > "${listFile}"`);
  run(`ffmpeg -y -f concat -safe 0 -i "${listFile}" -c copy "${out}"`);
}

export function generateEpisode(ep: number): string {
  if (!PROMPTS[ep]) throw new Error(`Unknown episode ${ep}`);
  const dir = join("output", SERIES.replace(/\s+/g, "-").toLowerCase(), `e${ep}`);
  mkdirSync(dir, { recursive: true });
  const segs: string[] = [];
  let prevFrame: string | null = null;
  for (let i = 0; i < SEGMENTS; i++) {
    const segFile = generateSegment(ep, i, prevFrame, dir);
    segs.push(segFile);
    const frame = join(dir, `e${ep}-seg${i}-last.jpg`);
    extractFrame(segFile, frame);
    prevFrame = frame;
  }
  const final = join(dir, `e${ep}-60s.mp4`);
  stitchSegments(segs, final);
  console.log(`[continuous] ${SERIES} E${ep} -> ${final} (60s)`);
  return final;
}

function main(): void {
  const arg = process.argv[2];
  if (arg === "--help" || arg === "-h") {
    console.log(`Usage: bun scripts/generate-continuous.ts [1|2]\n  ${SERIES} — 60s = 4x15s via ${MODEL_T2V} + ${MODEL_EXTEND} stitch`);
    return;
  }
  const targets = arg ? [Number(arg)] : [...EPISODES];
  for (const ep of targets) generateEpisode(ep);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
