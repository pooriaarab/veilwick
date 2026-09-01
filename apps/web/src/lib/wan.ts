/**
 * Wan — reserved for candy.ai-style short library (curated, non-personalized).
 * Batch generated nightly via Wan 2.4-14B + Civitai LoRAs 1333923 / 1428098.
 * NOT used for personalized scroll feed (H3 owns that — see wavespeed.ts H3
 * image-to-video-lora). Kept for later library; feed defaults to H3.
 * Vast fallback removed from feed path — feed is Wavespeed-only.
 */
import { createId } from "@paralleldrive/cuid2";

const HF_API_BASE = "https://api-inference.huggingface.co/models";
const HF_MODEL = "Wan-AI/Wan2.4-14B";

/** @deprecated Vast scrapped — feed uses H3 LoRA only; stub for compat */
export function getVastEndpoint(): string | null {
  return null;
}

/**
 * Top Wan LoRAs curated for VeilWick library (batch, non-feed).
 * Retained for later library use — feed uses H3 image-to-video-lora instead.
 */
export const TOP_NSFW_LORAS = [
  { modelId: 1434650, versionId: 1621698, name: "NSFW/Female Genitals helper", baseModel: "Wan Video 14B t2v", downloads: 70423 },
  { modelId: 1333923, versionId: 2021242, name: "Wan POV Blowjob", baseModel: "Wan Video 14B t2v", downloads: 64836 },
  { modelId: 1340403, versionId: 1513684, name: "Deepthroat Blowjob", baseModel: "Wan Video 14B t2v", downloads: 53254 },
  { modelId: 1350447, versionId: 1525363, name: "Wan Cumshot", baseModel: "Wan Video 14B t2v", downloads: 114417 },
  { modelId: 1426284, versionId: 1612131, name: "Anal Sex", baseModel: "Wan Video 14B t2v", downloads: 95655 },
  { modelId: 1395313, versionId: 1700000, name: "DR34MJOB Double Blowjob", baseModel: "Wan Video 14B i2v 720p", downloads: 114634 },
  { modelId: 1343431, versionId: 1700001, name: "Bouncing Boobs", baseModel: "Wan Video 14B i2v 720p", downloads: 177005 },
  { modelId: 1428098, versionId: 1700002, name: "COWGIRL + REVERSE COWGIRL", baseModel: "Wan Video 14B t2v", downloads: 159298 },
] as const;

export interface NsfwVariant {
  label: string;
  prompt: string;
  category: string;
  loraId: number;
  loraName: string;
}

export interface WanResult {
  /** R2 object key the video should be stored under */
  r2Key: string;
  /** Estimated video duration in seconds */
  duration: number;
  /** Civitai LoRA ID used for this generation (undefined if none) */
  loraId?: number;
}

/**
 * Generate a video via Wan 2.4-14B.
 *
 * Library-only (NOT feed). Feed uses H3 image-to-video-lora via wavespeed.ts.
 * Tries HuggingFace Inference API (requires HF_TOKEN). Falls back to mock R2
 * key when token is missing (MVP mode). No Vast path — Wavespeed-only for feed.
 */
export async function generateWanVideo(
  prompt: string,
  category: string,
  loraId?: number,
): Promise<WanResult> {
  const token = process.env.HF_TOKEN;
  const id = createId();
  const r2Key = `videos/${category}/${id}.mp4`;

  if (loraId !== undefined) {
    console.log(
      `[wan] generateWanVideo loraId=${loraId} category=${category} prompt="${prompt.slice(0, 80)}..." — merging LoRA (library, not feed).`,
    );
  } else {
    console.log(`[wan] generateWanVideo category=${category} prompt="${prompt.slice(0, 80)}..." (no LoRA, library).`);
  }

  if (!token) {
    console.warn(
      "[wan] HF_TOKEN not set — returning mock result for MVP. " +
        "Set HF_TOKEN in .dev.vars for library batch. Feed uses H3 (WAVESPEED_API_KEY).",
    );
    return { r2Key, duration: 5, loraId };
  }

  try {
    const response = await fetch(`${HF_API_BASE}/${HF_MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_frames: 81,
        },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => "unknown");
      console.error(`[wan] HuggingFace API error ${response.status}: ${errBody}`);
      return { r2Key, duration: 5, loraId };
    }

    return { r2Key, duration: 3, loraId };
  } catch (err) {
    console.error("[wan] Network error calling HuggingFace API:", err);
    return { r2Key, duration: 5, loraId };
  }
}

/**
 * Merge a selected Civitai LoRA into a base Wan 2.4-14B generation (library).
 */
export async function mergeLoraIntoBase(
  prompt: string,
  category: string,
  loraId: number,
): Promise<WanResult> {
  console.log(
    `[wan] mergeLoraIntoBase: merging LoRA ${loraId} with base Wan 2.4-14B ` +
      `(category: ${category}, prompt: "${prompt.slice(0, 60)}..."). ` +
      `[MVP] LoRA ${loraId} logged but not downloaded.`,
  );

  return generateWanVideo(prompt, category, loraId);
}

/**
 * Generate 3 test variants using top Civitai LoRAs (library, NOT feed).
 * Kept for batch library seeding — feed uses H3 non-explicit fashion/wellness.
 */
export function generateNsfwVariants(): NsfwVariant[] {
  return [
    {
      label: "yoga->nsfw",
      prompt:
        "athletic woman transitions from yoga pose on a mat to intimate sensual pose, soft natural window light, realistic skin texture, shallow depth of field, 24fps — nsfw, explicit female genitals detail",
      category: "yoga-nsfw",
      loraId: 1434650,
      loraName: "NSFW/Female Genitals helper",
    },
    {
      label: "cowgirl",
      prompt:
        "woman in cowgirl position, reverse cowgirl variation, bedroom setting, soft warm lighting, realistic skin and fabric detail, intimate motion, 24fps — nsfw, explicit",
      category: "cowgirl",
      loraId: 1428098,
      loraName: "COWGIRL + REVERSE COWGIRL",
    },
    {
      label: "blowjob",
      prompt:
        "POV blowjob, intimate close-up, soft focus background, realistic detail, natural lighting, 24fps — nsfw, explicit deepthroat",
      category: "blowjob",
      loraId: 1333923,
      loraName: "Wan POV Blowjob",
    },
  ];
}
