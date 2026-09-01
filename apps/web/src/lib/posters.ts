/**
 * VeilWick poster pipeline — 720x1280 vertical (9:16).
 *
 * Every episode video is 720x1280, 60s. Poster is a single JPG
 * extracted at 1.2s and uploaded to R2:
 *   posters/series/{seriesId}/ep{num}.jpg
 *   posters/series/{seriesId}/cover.jpg  (series cover, from ep1 or dedicated render)
 *
 * Extraction (local or Vast):
 *   ffmpeg -ss 1.2 -i <video.mp4> -vframes 1 -s 720x1280 -q:v 2 poster.jpg
 *
 * Validation: sharp / ffprobe must report width==720 && height==1280.
 */

import { buildPosterPrompt, POSTER_NEGATIVE, POSTER_SIZE_WAVESPEED, POSTER_MODEL, POSTER_MODEL_PRO } from "./poster-styles";

export const POSTER_SIZE = "720x1280" as const;
export const POSTER_WIDTH = 720;
export const POSTER_HEIGHT = 1280;
export const POSTER_EXTRACT_AT = 1.2; // seconds

/** Wavespeed text-to-image models for poster generation (vertical 720x1280). */
export const POSTER_T2I_MODEL = POSTER_MODEL;
export const POSTER_T2I_MODEL_PRO = POSTER_MODEL_PRO;
export const POSTER_T2I_SIZE = POSTER_SIZE_WAVESPEED; // "720*1280" for Wavespeed API
export const POSTER_T2I_ASPECT = "9:16" as const;

export function posterKey(seriesId: string, episodeNum: number): string {
  return `posters/series/${seriesId}/ep${episodeNum}.jpg`;
}

export function seriesCoverKey(seriesId: string): string {
  return `posters/series/${seriesId}/cover.jpg`;
}

export function posterCdnUrl(key: string): string {
  const base = process.env.R2_PUBLIC_BASE ?? "https://cdn.veilwick.com";
  return `${base.replace(/\/$/, "")}/${key}`;
}

export function episodePosterUrl(seriesId: string, episodeNum: number): string {
  return posterCdnUrl(posterKey(seriesId, episodeNum));
}

export function seriesCoverUrl(seriesId: string): string {
  return posterCdnUrl(seriesCoverKey(seriesId));
}

// --- Local public fallback (preferred for /series grid; no R2 required) ---
// Files live in apps/web/public/series-posters/{seriesId}.jpg (720x1280)
// Copied from /tmp/poster-*.jpg. Using plain <img> (no Next optimization) so
// no remotePatterns needed. Episode thumbs reuse series cover locally.

export function localSeriesCoverUrl(seriesId: string): string {
  return `/series-posters/${seriesId}.jpg`;
}

export function localEpisodePosterUrl(seriesId: string): string {
  // episode thumbs fall back to series cover locally until per-ep thumbs exist
  return `/series-posters/${seriesId}.jpg`;
}

export function ffmpegPosterArgs(inputPath: string, outputPath: string): string[] {
  return [
    "-ss",
    String(POSTER_EXTRACT_AT),
    "-i",
    inputPath,
    "-vframes",
    "1",
    "-s",
    POSTER_SIZE,
    "-q:v",
    "2",
    "-y",
    outputPath,
  ];
}

export function ffmpegPosterCommand(inputPath: string, outputPath: string): string {
  return `ffmpeg -ss ${POSTER_EXTRACT_AT} -i ${inputPath} -vframes 1 -s ${POSTER_SIZE} -q:v 2 ${outputPath}`;
}

/**
 * Upload a poster buffer to R2 with correct content-type.
 * Caller is responsible for having extracted the JPG via ffmpeg or downloaded from Wavespeed.
 */
export async function putPoster(
  bucket: R2Bucket,
  key: string,
  jpegBytes: ArrayBuffer | Uint8Array,
): Promise<R2Object> {
  const obj = await bucket.put(key, jpegBytes, {
    httpMetadata: { contentType: "image/jpeg" },
  });
  if (!obj) throw new Error(`[posters] R2 put failed for ${key}`);
  return obj;
}

// ---------------------------------------------------------------------------
// Wavespeed alibaba/wan-2.7/text-to-image poster generation (movie poster style)
// ---------------------------------------------------------------------------

const WAVESPEED_API_BASE = "https://api.wavespeed.ai/api/v3";

function getWavespeedKey(): string {
  const k = process.env.WAVESPEED_API_KEY;
  if (!k) throw new Error("[posters] WAVESPEED_API_KEY not set — set in .dev.vars or wrangler secret");
  return k;
}

export interface GeneratePosterParams {
  title: string;
  styleId: string;
  tagline?: string;
  seriesId?: string;
  episodeNum?: number;
  /** Use pro model alibaba/wan-2.7/text-to-image-pro */
  usePro?: boolean;
  /** Optional extra prompt tail */
  extra?: string;
}

export interface GeneratePosterResult {
  imageUrl: string;
  requestId?: string;
  prompt: string;
  model: string;
  size: string;
  /** R2 key where poster should be stored (caller uploads) */
  r2Key?: string;
}

/**
 * Generate a 720x1280 movie poster via Wavespeed alibaba/wan-2.7/text-to-image.
 *
 * Prompt always includes: movie poster style, title typography, vertical 720x1280.
 * Pass through to Wavespeed API; caller downloads imageUrl and uploads to R2 via putPoster().
 *
 * CLI: wavespeed run alibaba/wan-2.7/text-to-image --prompt "<prompt>" --input size="720*1280"
 */
export async function generatePosterImage(params: GeneratePosterParams): Promise<GeneratePosterResult> {
  const { title, styleId, tagline, extra, usePro } = params;
  if (!title?.trim()) throw new Error("[posters] generatePosterImage: title is required");

  const prompt = buildPosterPrompt({ title, styleId, tagline, extra });
  const model = usePro ? POSTER_T2I_MODEL_PRO : POSTER_T2I_MODEL;
  const size = POSTER_T2I_SIZE;

  const apiKey = getWavespeedKey();

  const body: Record<string, unknown> = {
    prompt,
    size,
    enable_prompt_expansion: true,
    negative_prompt: POSTER_NEGATIVE,
  };

  // Wavespeed alibaba/wan-2.7 expects size "720*1280" (or width/height). Keep 9:16 vertical.
  const endpoint = `${WAVESPEED_API_BASE}/${model}/generate`;
  // fallback path used by some Wavespeed deployments:
  const fallbackEndpoint = `${WAVESPEED_API_BASE}/alibaba/wan-2.7/text-to-image`;

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new Error(`[posters] Wavespeed fetch failed for ${model}: ${String(err)}`);
  }

  // Try fallback endpoint if primary 404s (model path variant)
  if (res.status === 404 && endpoint !== fallbackEndpoint) {
    res = await fetch(fallbackEndpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  if (!res.ok) {
    const txt = await res.text().catch(() => "unknown");
    throw new Error(`[posters] generatePosterImage failed (${res.status}) for ${model}: ${txt}`);
  }

  const data = (await res.json()) as Record<string, unknown>;
  const imageUrl =
    (data.output as string) ??
    (data.image_url as string) ??
    (data.url as string) ??
    (Array.isArray(data.outputs) ? (data.outputs[0] as string) : undefined) ??
    (Array.isArray(data.images) ? ((data.images[0] as Record<string, unknown>)?.url as string) : undefined);

  if (!imageUrl) throw new Error(`[posters] Wavespeed response missing image url: ${JSON.stringify(data).slice(0, 400)}`);

  const requestId = (data.request_id as string) ?? (data.id as string) ?? undefined;
  const r2Key =
    params.seriesId != null
      ? params.episodeNum != null
        ? posterKey(params.seriesId, params.episodeNum)
        : seriesCoverKey(params.seriesId)
      : undefined;

  console.log(`[posters] generatePosterImage title="${title}" style=${styleId} model=${model} size=${size} -> ${requestId ?? imageUrl.slice(0, 80)}`);

  return { imageUrl, requestId, prompt, model, size, r2Key };
}

/**
 * Generate + upload poster to R2 in one call (download from Wavespeed then putPoster).
 * Returns the CDN URL for D1.
 */
export async function generateAndUploadPoster(
  bucket: R2Bucket,
  params: GeneratePosterParams,
): Promise<{ cdnUrl: string; r2Key: string; prompt: string }> {
  const gen = await generatePosterImage(params);
  if (!gen.r2Key) throw new Error("[posters] generateAndUploadPoster: seriesId required to derive R2 key");
  const imgRes = await fetch(gen.imageUrl);
  if (!imgRes.ok) throw new Error(`[posters] failed to download Wavespeed image ${imgRes.status}`);
  const bytes = await imgRes.arrayBuffer();
  await putPoster(bucket, gen.r2Key, bytes);
  const cdnUrl = posterCdnUrl(gen.r2Key);
  return { cdnUrl, r2Key: gen.r2Key, prompt: gen.prompt };
}

/** CLI helper string for the poster generation (for logs/docs). */
export function wavespeedPosterCli(prompt: string, usePro = false): string {
  const model = usePro ? POSTER_T2I_MODEL_PRO : POSTER_T2I_MODEL;
  const safe = prompt.replace(/"/g, '\\"');
  return `wavespeed run ${model} --prompt "${safe}" --input size="${POSTER_T2I_SIZE}"`;
}
