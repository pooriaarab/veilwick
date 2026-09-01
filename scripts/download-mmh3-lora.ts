#!/usr/bin/env bun
/**
 * Download MMH3 Mystic XXX LoRA — MysticXXX_MMH3-V4.safetensors
 * Civitai model 2856467 version 3266628 -> /tmp/MysticXXX_MMH3-V4.safetensors
 *
 * Reads CIVITAI_API_KEY from (priority):
 *  1. process.env.CIVITAI_API_KEY
 *  2. ~/.secrets/civitai.env  (or $HOME/.secrets/civitai.env)
 *  3. /Users/parab/.secrets/civitai.env (legacy)
 *  4. .dev.vars (CIVITAI_API_KEY=...)
 *
 * Skips download if /tmp/MysticXXX_MMH3-V4.safetensors already exists and is non-empty.
 * Uses Civitai API: GET https://civitai.com/api/v1/model-versions/3266628 to resolve file,
 * then downloads via authenticated https://civitai.com/api/download/models/3266628
 *
 * Env: WAVESPEED_LORA_PATH should point to /tmp/MysticXXX_MMH3-V4.safetensors (or set in .dev.vars)
 * Example .dev.vars:
 *   CIVITAI_API_KEY=...
 *   WAVESPEED_LORA_PATH=/tmp/MysticXXX_MMH3-V4.safetensors
 *
 * Run: bun run scripts/download-mmh3-lora.ts
 *      or: bun scripts/download-mmh3-lora.ts
 */

import { existsSync, readFileSync } from "node:fs";
import { stat, mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const MODEL_ID = 2856467;
const VERSION_ID = 3266628;
const FILENAME = "MysticXXX_MMH3-V4.safetensors";
const DEST = "/tmp/MysticXXX_MMH3-V4.safetensors";

function parseEnvFile(content: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const k = trimmed.slice(0, eq).trim();
    const v = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    out[k] = v;
  }
  return out;
}

function readCivitaiKey(): string | undefined {
  if (process.env.CIVITAI_API_KEY) return process.env.CIVITAI_API_KEY;

  // Try ~/.secrets/civitai.env
  const candidates = [
    join(homedir(), ".secrets", "civitai.env"),
    "/Users/parab/.secrets/civitai.env",
    join(process.cwd(), ".dev.vars"),
  ];
  for (const p of candidates) {
    try {
      if (!existsSync(p)) continue;
      const raw = readFileSync(p, "utf-8");
      const env = parseEnvFile(raw);
      if (env.CIVITAI_API_KEY) {
        console.log(`[mmh3] read CIVITAI_API_KEY from ${p}`);
        return env.CIVITAI_API_KEY;
      }
      // Also support plain token file (no key= prefix)
      if (raw.trim() && !raw.includes("=") && raw.trim().length > 20) {
        console.log(`[mmh3] read CIVITAI_API_KEY (bare token) from ${p}`);
        return raw.trim();
      }
    } catch {}
  }
  return undefined;
}

async function alreadyExists(): Promise<boolean> {
  try {
    const s = await stat(DEST);
    if (s.size > 0) {
      console.log(`[mmh3] exists: ${DEST} (${(s.size / 1024 / 1024).toFixed(1)} MB) — skipping download`);
      console.log(`[mmh3] ensure WAVESPEED_LORA_PATH=${DEST} in .dev.vars`);
      return true;
    }
  } catch {}
  return false;
}

async function fetchVersionInfo(apiKey: string) {
  const url = `https://civitai.com/api/v1/model-versions/${VERSION_ID}`;
  console.log(`[mmh3] fetching version info: ${url}`);
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Civitai version fetch failed ${res.status}: ${txt.slice(0, 500)}`);
  }
  const data = (await res.json()) as any;
  console.log(`[mmh3] version ${data.id} model ${data.modelId} files=${data.files?.length}`);
  return data;
}

async function downloadFile(apiKey: string): Promise<void> {
  // Primary: authenticated download endpoint (handles auth + redirect)
  const downloadUrl = `https://civitai.com/api/download/models/${VERSION_ID}?type=Model&format=SafeTensor`;
  console.log(`[mmh3] downloading model ${MODEL_ID} version ${VERSION_ID} -> ${DEST}`);
  console.log(`[mmh3] GET ${downloadUrl}`);

  const res = await fetch(downloadUrl, {
    headers: { Authorization: `Bearer ${apiKey}` },
    redirect: "follow",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Download failed ${res.status}: ${txt.slice(0, 500)}`);
  }

  const contentLength = res.headers.get("content-length");
  if (contentLength) console.log(`[mmh3] content-length: ${(Number(contentLength) / 1024 / 1024).toFixed(1)} MB`);

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1024) {
    throw new Error(`Download too small (${buf.length} bytes) — likely auth error: ${buf.toString("utf-8").slice(0, 500)}`);
  }

  await writeFile(DEST, buf);
  console.log(`[mmh3] saved ${DEST} (${(buf.length / 1024 / 1024).toFixed(1)} MB)`);
  console.log(`[mmh3] set WAVESPEED_LORA_PATH=${DEST} in .dev.vars for local Wavespeed H3 feed`);
  console.log(`[mmh3] wavespeed loras payload: [{path: "${DEST}", scale: 1}]`);
}

async function main() {
  console.log(`[mmh3] MysticXXX_MMH3-V4.safetensors model ${MODEL_ID} version ${VERSION_ID}`);
  console.log(`[mmh3] dest: ${DEST}`);

  if (await alreadyExists()) return;

  const apiKey = readCivitaiKey();
  if (!apiKey) {
    console.error("[mmh3] CIVITAI_API_KEY not found.");
    console.error("  Set it in one of:");
    console.error("    - env CIVITAI_API_KEY");
    console.error("    - ~/.secrets/civitai.env  (CIVITAI_API_KEY=...)");
    console.error("    - .dev.vars  (CIVITAI_API_KEY=...)");
    console.error(`  Then re-run: bun run scripts/download-mmh3-lora.ts`);
    console.error(`  Manual: curl -H "Authorization: Bearer $CIVITAI_API_KEY" -L "https://civitai.com/api/download/models/${VERSION_ID}" -o ${DEST}`);
    process.exit(1);
  }

  // Verify version exists (optional, helps debug 404 vs auth)
  try {
    await fetchVersionInfo(apiKey);
  } catch (e) {
    console.warn(`[mmh3] version info fetch warning: ${(e as Error).message} — trying direct download anyway`);
  }

  await downloadFile(apiKey);
  console.log(`[mmh3] done. Verify: ls -lh ${DEST} && file ${DEST}`);
}

main().catch((e) => {
  console.error(`[mmh3] fatal: ${(e as Error).message}`);
  process.exit(1);
});
