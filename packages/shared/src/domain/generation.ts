/**
 * Generation routing: H3 fast path vs Wan fallback.
 *
 * H3 (Minimax Hailuo 33B): 5s generation, DreamBooth per-user LoRA.
 * Wan 2.4 14B: 2-3min, high quality fallback.
 *
 * Rule: if user's top-category affinity > 0.6 → H3 DreamBooth.
 * Else → Wan. H3 failure falls back to Wan.
 */

export const H3_AFFINITY_THRESHOLD = 0.6;

export type FeedCategory =
  // wellness / fashion (non-explicit)
  | "yoga"
  | "fitness"
  | "activewear"
  | "breathwork"
  | "wellness"
  // non-explicit H3 image-to-video-lora feed categories (clothed fashion/wellness)
  | "market-stall-fashion"
  | "beach-lifestyle"
  | "studio-portrait"
  | "studio"
  | "bedroom-lifestyle-clothed"
  | "bedroom-lifestyle"
  | "cafe"
  | "street-style"
  | "gym-activewear"
  | "rooftop-golden-hour"
  | "boutique-fitting"
  // legacy
  | "cowgirl"
  | "blowjob"
  | "missionary"
  | "titfuck"
  | "nsfw"
  | "feed"
  | "doggy"
  | "anal"
  | "cumshot"
  | "boobs"
  | "series"
  | string;

export interface UserAffinity {
  category: FeedCategory;
  score: number; // 0..1
}

/** Return top category and score from affinity map. */
export function getTopAffinity(affinities: UserAffinity[]): UserAffinity | null {
  if (affinities.length === 0) return null;
  return affinities.reduce((a, b) => (b.score > a.score ? b : a));
}

/** True when H3 DreamBooth should be attempted. */
export function shouldUseH3(affinities: UserAffinity[]): boolean {
  const top = getTopAffinity(affinities);
  return top !== null && top.score > H3_AFFINITY_THRESHOLD;
}

export type GenerationBackend = "h3" | "wan";

/** Pick backend given affinity state. */
export function pickBackend(affinities: UserAffinity[]): GenerationBackend {
  return shouldUseH3(affinities) ? "h3" : "wan";
}

/** H3 vs Wan comparison (for docs / UI). */
export const BACKEND_COMPARISON = {
  h3: { model: "Minimax H3/Hailuo 33B", time: "5s", quality: "fast, DreamBooth personalized" },
  wan: { model: "Wan 2.4 14B", time: "2-3min", quality: "high, general LoRA" },
} as const;
