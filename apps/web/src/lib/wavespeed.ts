/**
 * VeilWick Wavespeed integration — Wan 2.4-14B 720x1280 (library) + H3 feed pipeline.
 *
 * Feed defaults to H3 via Wavespeed-only (no Vast fallback), local D1/R2 miniflare --local only:
 *  - wavespeed-ai/minimax-h3/image-to-video-lora  ($0.25 / 5s, 768p 9:16) with image+last_image+loras
 *  - wavespeed-ai/minimax-h3/reference-to-video-lora ($0.30 / 5s)
 *  - Enqueued via /api/feed?personalized=true or POST /api/feed/prefetch when buffer<2 / sentinel near end
 *    -> queue h3.generate { image, last_image, loras, prompt, duration:5, resolution:"768p" } -> OUTBOX_QUEUE local
 *  - Infinite scroll auto-generates without manual generate; loading spinner silent, fallback 8 videos cold start
 *
 * Wan 2.4-14B kept for later candy.ai-style short library (curated, non-personalized).
 * Custom LoRAs (Civitai) remain registered for library batches.
 *
 * Auth: WAVESPEED_API_KEY only (Vast fallback removed from feed path). No --remote, local only.
 *
 * CLI equivalents (local):
 *  wavespeed run wavespeed-ai/minimax-h3/image-to-video-lora --image <url> --last-image <url> --prompt "..." --loras <path> --resolution 768p --duration 5
 *  wavespeed run wavespeed-ai/minimax-h3/reference-to-video-lora --reference-image <url> --prompt "..." --loras <path>
 *  wavespeed run wan2.4-14b --prompt "<prompt>" --lora 1333923 --resolution 720x1280 --duration 60 (library only)
 *
 * Realism gate: /prototype-scenes (public/prototype-scenes/index.html) — generate ONE H3 video first
 *   to validate photorealism/lighting/768p, then storyboard prompts expand feed. All prompts non-explicit clothed only.
 *
 * Cliffhanger series: 5 episodes per series, E1-2 free, E3-5 locked (paywall).
 */

const WAVESPEED_API_BASE = "https://api.wavespeed.ai/api/v3";
const WAN_MODEL = "Wan-AI/Wan2.4-14B";

// H3 Wavespeed models — feed pipeline
export const H3_IMAGE_TO_VIDEO_LORA_MODEL = "wavespeed-ai/minimax-h3/image-to-video-lora";
export const H3_REFERENCE_TO_VIDEO_LORA_MODEL = "wavespeed-ai/minimax-h3/reference-to-video-lora";

// Pricing (USD per 5s clip, 768p 9:16)
export const H3_IMAGE_TO_VIDEO_LORA_PRICE = 0.25;
export const H3_REFERENCE_TO_VIDEO_LORA_PRICE = 0.30;

// H3 feed defaults
export const H3_DEFAULT_DURATION = 5 as const; // seconds
export const H3_DEFAULT_RESOLUTION = "768p" as const; // 768p 9:16 (432x768 or 768p vertical)
export const H3_DEFAULT_ASPECT = "9:16" as const;

// ---------------------------------------------------------------------------
// LoRA registry — VeilWick custom set (720x1280 Wan 2.4-14B) — library only
// ---------------------------------------------------------------------------
export const CUSTOM_LORAS = {
  1333923: {
    modelId: 1333923,
    versionId: 2021242,
    name: "Wan POV Blowjob",
    baseModel: "Wan Video 14B t2v",
    resolution: "720x1280" as const,
  },
  1428098: {
    modelId: 1428098,
    versionId: 1700002,
    name: "COWGIRL + REVERSE COWGIRL",
    baseModel: "Wan Video 14B t2v",
    resolution: "720x1280" as const,
  },
} as const;

export type CustomLoraId = keyof typeof CUSTOM_LORAS;

// ---------------------------------------------------------------------------
// H3 prompt categories — non-explicit fashion/wellness/lifestyle clothed only
// Tags are by angle / POV / lighting (not explicit acts).
// Prompts sourced from docs/prompts.md §5 Feed categories.
// ---------------------------------------------------------------------------
export const FEED_CATEGORIES = [
  "market-stall-fashion",
  "beach-lifestyle",
  "studio",
  "bedroom-lifestyle",
  "wellness",
  "fitness",
  "activewear",
  "breathwork",
] as const;

export type FeedCategory = (typeof FEED_CATEGORIES)[number];

export const FEED_PROMPTS: Record<FeedCategory, string> = {
  "market-stall-fashion":
    "cinematic vertical 768p 9:16, market stall fashion lifestyle, linen resort wear, soft natural daylight, photorealistic 8k, shallow depth of field, subtle handheld breathing, eye-level POV, warm cinematic LUT, clothed, wellness mood",
  "beach-lifestyle":
    "cinematic vertical 768p 9:16, beach lifestyle wellness, breezy linen outfit, golden-hour soft light, photorealistic, gentle dolly push-in, over-shoulder POV, teal shadows orange highlights, clothed, calm wellness",
  studio:
    "cinematic vertical 768p 9:16, studio fashion portrait, soft studio lighting, photorealistic 8k, locked tripod centred, eye contact, shallow depth, lifted blacks S-curve, clothed, wellness",
  "bedroom-lifestyle":
    "cinematic vertical 768p 9:16, bedroom lifestyle clothed, cozy morning light through window, linen loungewear, soft fill light, photorealistic, handheld micro-shake, 35mm lens, warm tones, clothed wellness",
  wellness:
    "cinematic vertical 768p 9:16, wellness mindfulness, soft daylight, photorealistic, steady cam, eye-level angle, natural breathing, calm palette, clothed",
  fitness:
    "cinematic vertical 768p 9:16, fitness activewear, dynamic soft studio light, photorealistic, low-angle dolly, energetic wellness, clothed, shallow depth",
  activewear:
    "cinematic vertical 768p 9:16, activewear fashion, studio soft key + teal fill, photorealistic, mid-shot eye-level, handheld subtle, clothed lifestyle",
  breathwork:
    "cinematic vertical 768p 9:16, breathwork wellness, serene daylight, photorealistic, slow push-in, eye contact, shallow depth, warm LUT, clothed",
};

export const FEED_TAGS: Record<FeedCategory, string[]> = {
  "market-stall-fashion": ["angle:eye-level", "pov:over-shoulder", "lighting:soft-natural-daylight"],
  "beach-lifestyle": ["angle:eye-level", "pov:walking-approach", "lighting:golden-hour"],
  studio: ["angle:centred-tripod", "pov:eye-contact", "lighting:soft-studio"],
  "bedroom-lifestyle": ["angle:eye-level", "pov:handheld-breathing", "lighting:window-soft-fill"],
  wellness: ["angle:eye-level", "pov:steadicam", "lighting:soft-daylight"],
  fitness: ["angle:low-dolly", "pov:handheld-tracking", "lighting:soft-studio-key"],
  activewear: ["angle:mid-shot", "pov:eye-level", "lighting:teal-fill"],
  breathwork: ["angle:push-in", "pov:eye-contact", "lighting:serene-daylight"],
};

export function getFeedPrompt(category: string): string {
  const cat = category as FeedCategory;
  return FEED_PROMPTS[cat] ?? FEED_PROMPTS.wellness;
}

export function getFeedTags(category: string): string[] {
  const cat = category as FeedCategory;
  return FEED_TAGS[cat] ?? FEED_TAGS.wellness;
}

// ---------------------------------------------------------------------------
// Cliffhanger series — 5 episodes per series, E1-2 free, E3-5 locked
// ---------------------------------------------------------------------------
export const EPISODES_PER_SERIES = 5 as const;
export const FREE_EPISODES = 2 as const;
export const LOCKED_EPISODES = 3 as const; // E3, E4, E5

export type EpisodeNumber = 1 | 2 | 3 | 4 | 5;

export interface CliffhangerEpisode {
  seriesId: string;
  episodeNumber: EpisodeNumber;
  locked: boolean;
  title: string;
}

export interface SeriesAccess {
  episodeNumber: number;
  locked: boolean;
  requiresSubscription: boolean;
}

/**
 * Returns true if the episode is paywalled.
 * E1-2 free, E3-5 locked.
 */
export function isEpisodeLocked(episodeNumber: number): boolean {
  if (episodeNumber < 1 || episodeNumber > EPISODES_PER_SERIES) {
    throw new Error(
      `[wavespeed] episodeNumber must be 1-${EPISODES_PER_SERIES}, got ${episodeNumber}`,
    );
  }
  return episodeNumber > FREE_EPISODES;
}

/**
 * Describe access for a given episode number.
 */
export function getEpisodeAccess(episodeNumber: number): SeriesAccess {
  const locked = isEpisodeLocked(episodeNumber);
  return {
    episodeNumber,
    locked,
    requiresSubscription: locked,
  };
}

/**
 * Assert caller has access to an episode — throws if locked and not subscribed.
 */
export function assertEpisodeAccess(
  episodeNumber: number,
  opts: { isSubscribed: boolean },
): void {
  if (isEpisodeLocked(episodeNumber) && !opts.isSubscribed) {
    throw new Error(
      `[wavespeed] Episode E${episodeNumber} is locked (E3-5 require subscription). E1-2 are free.`,
    );
  }
}

/**
 * Build 5-episode series metadata from a series id/prefix.
 */
export function buildCliffhangerSeries(seriesId: string, titles?: string[]): CliffhangerEpisode[] {
  return Array.from({ length: EPISODES_PER_SERIES }, (_, i) => {
    const n = (i + 1) as EpisodeNumber;
    return {
      seriesId,
      episodeNumber: n,
      locked: isEpisodeLocked(n),
      title: titles?.[i] ?? `${seriesId} — Episode ${n}${isEpisodeLocked(n) ? " (Locked)" : ""}`,
    };
  });
}

// ---------------------------------------------------------------------------
// Auth — WAVESPEED_API_KEY only (Vast fallback removed)
// ---------------------------------------------------------------------------
function getWavespeedApiKey(): string {
  const wavespeedKey = process.env.WAVESPEED_API_KEY;
  if (wavespeedKey) return wavespeedKey;

  throw new Error(
    "[wavespeed] WAVESPEED_API_KEY is not set. Set it in .dev.vars (or wrangler secret). Vast fallback has been removed from feed path — feed is Wavespeed-only.",
  );
}

// MMH3 Mystic XXX LoRA — Civitai model 2856467 version 3266628
// File: MysticXXX_MMH3-V4.safetensors — local path /tmp/MysticXXX_MMH3-V4.safetensors
// Env: WAVESPEED_LORA_PATH (or default /tmp path). Scale fixed at 1 for realism test.
// Download: bun run scripts/download-mmh3-lora.ts (reads CIVITAI_API_KEY from ~/.secrets/civitai.env or .dev.vars)
export const MMH3_LORA_MODEL_ID = 2856467;
export const MMH3_LORA_VERSION_ID = 3266628;
export const MMH3_LORA_FILENAME = "MysticXXX_MMH3-V4.safetensors";
export const MMH3_DEFAULT_LORA_PATH = "/tmp/MysticXXX_MMH3-V4.safetensors";

export interface WavespeedLora {
  path: string;
  scale: number;
}

function getWavespeedLoras(): WavespeedLora[] | undefined {
  // Prefer env; fallback to /tmp default so local dev works without env set.
  // Supports comma-separated list of paths in WAVESPEED_LORA_PATH.
  const raw = process.env.WAVESPEED_LORA_PATH || MMH3_DEFAULT_LORA_PATH;
  if (!raw) return undefined;
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return undefined;
  return parts.map((path) => ({ path, scale: 1 }));
}

export function getWavespeedLoraObjects(): WavespeedLora[] | undefined {
  return getWavespeedLoras();
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface TrainLoRAResult {
  loraId: string;
  modelId?: string;
  status: string;
  dataset: string;
}

export interface GenerateVideoParams {
  prompt: string;
  loraId?: number | string;
  duration?: number; // seconds, default 60
  resolution?: string; // default "720x1280"
  /** Optional series context — enforces cliffhanger paywall when set */
  seriesId?: string;
  episodeNumber?: number;
  isSubscribed?: boolean;
}

export interface GenerateVideoResult {
  videoUrl?: string;
  r2Key?: string;
  requestId?: string;
  status: string;
  duration: number;
  resolution: string;
  loraId?: number | string;
  model: string;
}

// H3 image-to-video-lora types (feed pipeline)
export interface H3ImageToVideoLoraParams {
  /** First-frame image URL (required) — stitch start */
  image: string;
  /** Last image URL (optional) — stitch end for seamless 5s segment */
  lastImage?: string;
  prompt: string;
  /** Optional LoRA objects — defaults to WAVESPEED_LORA_PATH env or /tmp/MysticXXX_MMH3-V4.safetensors, scale 1 */
  loras?: WavespeedLora[];
  duration?: number; // default 5
  resolution?: string; // default 768p
}

export interface H3ReferenceToVideoLoraParams {
  /** Reference image URL (character / style anchor) */
  referenceImage: string;
  prompt: string;
  loras?: WavespeedLora[];
  duration?: number; // default 5
  resolution?: string; // default 768p
}

export interface H3GenerateResult {
  videoUrl?: string;
  requestId?: string;
  r2Key?: string;
  status: string;
  duration: number;
  resolution: string;
  model: string;
  price: number;
}

// ---------------------------------------------------------------------------
// trainLoRA — dataset -> LoRA via Wavespeed (library path)
// ---------------------------------------------------------------------------
/**
 * Train a custom LoRA on Wavespeed using a dataset (URL or local path uploaded).
 *
 * Maps to Wavespeed CLI: `wavespeed train lora --dataset <dataset> --base-model Wan-AI/Wan2.4-14B`
 * API: POST {WAVESPEED_API_BASE}/lora/train
 */
export async function trainLoRA(dataset: string): Promise<TrainLoRAResult> {
  if (!dataset || typeof dataset !== "string") {
    throw new Error("[wavespeed] trainLoRA: dataset is required (string URL or path)");
  }

  const apiKey = getWavespeedApiKey();

  const body = {
    base_model: WAN_MODEL,
    dataset,
    // Wavespeed LoRA training params tuned for Wan 2.4-14B 720x1280
    trigger_word: "veilwick_style",
    resolution: "720x1280",
  };

  const res = await fetch(`${WAVESPEED_API_BASE}/lora/train`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "unknown");
    throw new Error(`[wavespeed] trainLoRA failed (${res.status}): ${errText}`);
  }

  const data = (await res.json()) as Record<string, unknown>;
  // Wavespeed returns { id, lora_id, status, ... } depending on API version
  const loraId =
    (data.lora_id as string) ?? (data.id as string) ?? (data.request_id as string) ?? "unknown";
  console.log(`[wavespeed] trainLoRA started dataset=${dataset} loraId=${loraId}`);

  return {
    loraId,
    modelId: data.model_id as string | undefined,
    status: (data.status as string) ?? "queued",
    dataset,
  };
}

// ---------------------------------------------------------------------------
// H3 wrappers — feed pipeline (Wavespeed-only, 768p 9:16, 5s)
// ---------------------------------------------------------------------------
/**
 * Generate a 5s clip via wavespeed-ai/minimax-h3/image-to-video-lora.
 *
 * Price: $0.25 per 5s (768p 9:16).
 * Inputs: image (first frame) + last_image (optional stitch end) + loras [{path, scale:1}] (env WAVESPEED_LORA_PATH or /tmp/MysticXXX_MMH3-V4.safetensors) + prompt + duration 5 + resolution 768p.
 * LoRA: MysticXXX_MMH3-V4.safetensors model 2856467 version 3266628 — scale 1, wired for realism test (prompts stay non-explicit clothed).
 * Endpoint: POST {WAVESPEED_API_BASE}/wavespeed-ai/minimax-h3/image-to-video-lora
 */
export async function generateH3ImageToVideoLora(
  params: H3ImageToVideoLoraParams,
): Promise<H3GenerateResult> {
  const {
    image,
    lastImage,
    prompt,
    loras: explicitLoras,
    duration = H3_DEFAULT_DURATION,
    resolution = H3_DEFAULT_RESOLUTION,
  } = params;

  if (!image || typeof image !== "string") {
    throw new Error("[wavespeed] generateH3ImageToVideoLora: image (first-frame URL) is required");
  }
  if (!prompt || typeof prompt !== "string") {
    throw new Error("[wavespeed] generateH3ImageToVideoLora: prompt is required");
  }

  const apiKey = getWavespeedApiKey();
  const loras = explicitLoras ?? getWavespeedLoras();

  const body: Record<string, unknown> = {
    model: H3_IMAGE_TO_VIDEO_LORA_MODEL,
    image,
    prompt,
    duration,
    resolution,
  };
  if (lastImage) body.last_image = lastImage;
  if (loras && loras.length > 0) body.loras = loras;

  const endpoint = `${WAVESPEED_API_BASE}/${H3_IMAGE_TO_VIDEO_LORA_MODEL}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "unknown");
    throw new Error(`[wavespeed] generateH3ImageToVideoLora failed (${res.status}): ${errText}`);
  }

  const data = (await res.json()) as Record<string, unknown>;
  const videoUrl =
    (data.video_url as string) ?? (data.url as string) ?? (data.output as string) ?? undefined;
  const requestId =
    (data.request_id as string) ?? (data.id as string) ?? (data.prediction_id as string) ?? undefined;

  console.log(
    `[wavespeed] H3 image-to-video-lora image="${image.slice(0, 60)}..." last_image=${lastImage ? "yes" : "none"} loras=${loras?.length ?? 0} prompt="${prompt.slice(0, 60)}..." -> ${requestId ?? videoUrl ?? "queued"}`,
  );

  return {
    videoUrl,
    requestId,
    r2Key: (data.r2_key as string) ?? undefined,
    status: (data.status as string) ?? "completed",
    duration,
    resolution,
    model: H3_IMAGE_TO_VIDEO_LORA_MODEL,
    price: H3_IMAGE_TO_VIDEO_LORA_PRICE,
  };
}

/**
 * Generate a 5s clip via wavespeed-ai/minimax-h3/reference-to-video-lora.
 *
 * Price: $0.30 per 5s (768p 9:16).
 * Inputs: reference_image + loras [{path, scale:1}] (WAVESPEED_LORA_PATH or /tmp/MysticXXX_MMH3-V4.safetensors) + prompt + duration + resolution.
 * LoRA: MysticXXX_MMH3-V4.safetensors model 2856467 version 3266628 — scale 1.
 * Endpoint: POST {WAVESPEED_API_BASE}/wavespeed-ai/minimax-h3/reference-to-video-lora
 */
export async function generateH3ReferenceToVideoLora(
  params: H3ReferenceToVideoLoraParams,
): Promise<H3GenerateResult> {
  const {
    referenceImage,
    prompt,
    loras: explicitLoras,
    duration = H3_DEFAULT_DURATION,
    resolution = H3_DEFAULT_RESOLUTION,
  } = params;

  if (!referenceImage || typeof referenceImage !== "string") {
    throw new Error(
      "[wavespeed] generateH3ReferenceToVideoLora: referenceImage is required",
    );
  }
  if (!prompt || typeof prompt !== "string") {
    throw new Error("[wavespeed] generateH3ReferenceToVideoLora: prompt is required");
  }

  const apiKey = getWavespeedApiKey();
  const loras = explicitLoras ?? getWavespeedLoras();

  const body: Record<string, unknown> = {
    model: H3_REFERENCE_TO_VIDEO_LORA_MODEL,
    reference_image: referenceImage,
    prompt,
    duration,
    resolution,
  };
  if (loras && loras.length > 0) body.loras = loras;

  const endpoint = `${WAVESPEED_API_BASE}/${H3_REFERENCE_TO_VIDEO_LORA_MODEL}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "unknown");
    throw new Error(`[wavespeed] generateH3ReferenceToVideoLora failed (${res.status}): ${errText}`);
  }

  const data = (await res.json()) as Record<string, unknown>;
  const videoUrl =
    (data.video_url as string) ?? (data.url as string) ?? (data.output as string) ?? undefined;
  const requestId =
    (data.request_id as string) ?? (data.id as string) ?? (data.prediction_id as string) ?? undefined;

  console.log(
    `[wavespeed] H3 reference-to-video-lora ref="${referenceImage.slice(0, 60)}..." loras=${loras?.length ?? 0} prompt="${prompt.slice(0, 60)}..." -> ${requestId ?? videoUrl ?? "queued"}`,
  );

  return {
    videoUrl,
    requestId,
    r2Key: (data.r2_key as string) ?? undefined,
    status: (data.status as string) ?? "completed",
    duration,
    resolution,
    model: H3_REFERENCE_TO_VIDEO_LORA_MODEL,
    price: H3_REFERENCE_TO_VIDEO_LORA_PRICE,
  };
}

// ---------------------------------------------------------------------------
// generateVideo — Wan 2.4-14B 720x1280 via Wavespeed (library, NOT feed)
// Feed defaults to H3 image-to-video-lora above. Keep Wan for later library.
// ---------------------------------------------------------------------------
/**
 * Generate a video via Wavespeed Wan 2.4-14B.
 *
 * Defaults: duration 60s, resolution 720x1280 (portrait 9:16).
 * Handles cliffhanger paywall when episodeNumber is supplied: E1-2 free, E3-5 locked.
 *
 * Maps to Wavespeed API: POST {WAVESPEED_API_BASE}/wan/2.4-14b/generate
 * CLI: `wavespeed run wan2.4-14b --prompt "..." --lora <id> --resolution 720x1280 --duration 60`
 *
 * Feed path: use generateH3ImageToVideoLora instead (Wavespeed-only, 768p 5s).
 */
export async function generateVideo(params: {
  prompt: string;
  loraId?: number | string;
  duration?: number;
  resolution?: string;
  seriesId?: string;
  episodeNumber?: number;
  isSubscribed?: boolean;
}): Promise<GenerateVideoResult> {
  const {
    prompt,
    loraId,
    duration = 60,
    resolution = "720x1280",
    seriesId,
    episodeNumber,
    isSubscribed = false,
  } = params;

  if (!prompt || typeof prompt !== "string") {
    throw new Error("[wavespeed] generateVideo: prompt is required");
  }

  // Cliffhanger paywall enforcement when episode context is present
  if (episodeNumber !== undefined) {
    assertEpisodeAccess(episodeNumber, { isSubscribed });
  }

  // Validate resolution — Wan 2.4-14B expects 720x1280 portrait for VeilWick library
  const resolvedResolution = resolution || "720x1280";

  // Resolve LoRA — accept custom 1333923 / 1428098 or any string id
  let resolvedLora: string | number | undefined = loraId;
  if (typeof loraId === "number" && loraId in CUSTOM_LORAS) {
    const meta = CUSTOM_LORAS[loraId as CustomLoraId];
    console.log(`[wavespeed] generateVideo using custom LoRA ${loraId} (${meta.name})`);
  }

  const apiKey = getWavespeedApiKey();

  // Derive num_frames from duration (24fps, Wan default). Cap for API.
  const fps = 24;
  const numFrames = Math.min(Math.max(Math.round(duration * fps), 1), 1440); // 60s*24=1440

  const body: Record<string, unknown> = {
    model: WAN_MODEL,
    prompt,
    resolution: resolvedResolution,
    duration,
    num_frames: numFrames,
    fps,
  };

  if (resolvedLora !== undefined) {
    body.lora = String(resolvedLora);
    // Attach Civitai version for traceability when using known LoRAs
    if (typeof loraId === "number" && loraId in CUSTOM_LORAS) {
      body.lora_version_id = CUSTOM_LORAS[loraId as CustomLoraId].versionId;
    }
  }

  if (seriesId) {
    body.series_id = seriesId;
  }
  if (episodeNumber !== undefined) {
    body.episode_number = episodeNumber;
  }

  const endpoint = `${WAVESPEED_API_BASE}/wan/2.4-14b/generate`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "unknown");
    throw new Error(`[wavespeed] generateVideo failed (${res.status}): ${errText}`);
  }

  const data = (await res.json()) as Record<string, unknown>;
  const videoUrl =
    (data.video_url as string) ?? (data.url as string) ?? (data.output as string) ?? undefined;
  const requestId =
    (data.request_id as string) ?? (data.id as string) ?? (data.prediction_id as string) ?? undefined;

  console.log(
    `[wavespeed] generateVideo prompt="${prompt.slice(0, 80)}..." loraId=${String(resolvedLora ?? "none")} duration=${duration}s resolution=${resolvedResolution} -> ${requestId ?? videoUrl ?? "queued"}`,
  );

  return {
    videoUrl,
    requestId,
    r2Key: (data.r2_key as string) ?? undefined,
    status: (data.status as string) ?? "completed",
    duration,
    resolution: resolvedResolution,
    loraId: resolvedLora,
    model: WAN_MODEL,
  };
}
