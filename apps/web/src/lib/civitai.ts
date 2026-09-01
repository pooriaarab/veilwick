/**
 * Civitai API client for discovering Wan NSFW LoRAs.
 *
 * Cache lives at /tmp/civitai-loras.json for 5 minutes to avoid
 * slamming the API during dev / hot-reload cycles.
 */
import "server-only";

const CIVITAI_API = "https://civitai.com/api/v1/models";
const CACHE_PATH = "/tmp/civitai-loras.json";
const CACHE_TTL_MS = 5 * 60 * 1000;

export interface CivitaiLora {
  id: number;
  name: string;
  description: string;
  modelVersions: Array<{
    id: number;
    name: string;
    baseModel: string;
    files: Array<{
      id: number;
      name: string;
      downloadUrl: string;
    }>;
  }>;
  stats: {
    thumbsUpCount: number;
    downloadCount: number;
  };
}

export interface CivitaiResponse {
  items: CivitaiLora[];
  metadata: { totalItems: number; currentPage: number; pageSize: number };
}

function readCache(): CivitaiLora[] | null {
  try {
    const raw = require("fs").readFileSync(CACHE_PATH, "utf-8");
    const entry = JSON.parse(raw) as { ts: number; data: CivitaiLora[] };
    if (Date.now() - entry.ts < CACHE_TTL_MS) return entry.data;
  } catch {
    /* no cache or stale */
  }
  return null;
}

function writeCache(data: CivitaiLora[]): void {
  try {
    require("fs").writeFileSync(CACHE_PATH, JSON.stringify({ ts: Date.now(), data }), "utf-8");
  } catch (err) {
    console.warn("[civitai] failed to write cache:", err);
  }
}

/**
 * Fetch Wan 2.2 / 2.4 NSFW LoRAs from Civitai.
 *
 * Requires `CIVITAI_API_KEY` in `.dev.vars` or `wrangler secret`.
 * Caches to `/tmp` for 5 minutes.
 */
export async function fetchWanLoras(): Promise<CivitaiLora[]> {
  const cached = readCache();
  if (cached) return cached;

  const apiKey = process.env.CIVITAI_API_KEY;
  if (!apiKey) {
    console.warn(
      "[civitai] CIVITAI_API_KEY not set — returning empty. " +
        "Add it to .dev.vars or wrangler secret.",
    );
    return [];
  }

  const url =
    `${CIVITAI_API}?types=LORA&baseModels=Wan%20Video%2014B%20t2v&nsfw=true&limit=10`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      console.error(`[civitai] API error ${res.status}`, await res.text().catch(() => ""));
      return [];
    }

    const body = (await res.json()) as CivitaiResponse;
    writeCache(body.items);
    return body.items;
  } catch (err) {
    console.error("[civitai] network error:", err);
    return [];
  }
}