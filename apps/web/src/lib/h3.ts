import { createId } from "@paralleldrive/cuid2";

/**
 * H3 — VeilWick addictive feed delivery (5s clips, personalized).
 *
 * - R2 key: videos/{category}/{userId}/{id}.mp4 (5s H3 clip)
 * - Delivered via Workers Queue + KV session cache
 * - No Wan fallback for scroll — Wan is reserved for the candy.ai-style
 *   short library (curated, non-personalized, batch nightly via
 *   Wan 2.4-14B + Civitai LoRAs 1333923/1428098).
 */

export const H3_DURATION_S = 5;
export const H3_R2_PREFIX = "videos";

export function h3R2Key(category: string, userId: string, id?: string): string {
  const vid = id ?? createId();
  const cat = category.toLowerCase().replace(/[^a-z0-9_-]/g, "");
  const uid = userId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32) || "anon";
  return `${H3_R2_PREFIX}/${cat}/${uid}/${vid}.mp4`;
}

export interface H3Result {
  r2Key: string;
  duration: number;
  model: "h3";
}

/**
 * Generate a 5s H3 clip. In production this calls the H3 inference endpoint;
 * in MVP it returns a deterministic R2 key immediately (queue consumer uploads mock).
 * No Wan fallback — caller must handle pending buffer via queue.
 */
export async function generateH3Video(
  prompt: string,
  category: string,
  userId: string,
): Promise<H3Result> {
  const r2Key = h3R2Key(category, userId);
  console.log(`[h3] queue 5s clip category=${category} user=${userId} -> ${r2Key} prompt="${prompt.slice(0, 80)}..."`);
  // Real H3 inference would happen in Workers queue consumer; here we just allocate the key.
  return { r2Key, duration: H3_DURATION_S, model: "h3" };
}
