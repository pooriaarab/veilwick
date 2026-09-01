/**
 * VeilWick poster styles — movie poster pipeline (Wavespeed alibaba/wan-2.7/text-to-image).
 *
 * Each series gets a distinct movie-poster treatment (font, vibe, palette, layout).
 * Inspired by candy.ai series: Under the Boss (newspaper/noir), Staycation (serif lake house),
 * My Girlfriend's Stepmom (bold sans), Y.U.N.A. (neon pink cyber), Hot Shot (camo military).
 *
 * All prompts sanitized: no explicit acts, no nudity, romantic tension / soft cinematic light.
 * Model: alibaba/wan-2.7/text-to-image (or text-to-image-pro) @ 720x1280 vertical 9:16.
 * Prompt must include: movie poster style, title typography, vertical 720x1280.
 */

export const POSTER_MODEL = "alibaba/wan-2.7/text-to-image" as const;
export const POSTER_MODEL_PRO = "alibaba/wan-2.7/text-to-image-pro" as const;
export const POSTER_SIZE = "720x1280" as const;
export const POSTER_SIZE_WAVESPEED = "720*1280" as const;
export const POSTER_ASPECT = "9:16" as const;

export type PosterStyleId =
  | "boss-noir"
  | "staycation-serif"
  | "stepmom-bold"
  | "yuna-neon"
  | "hotshot-camo";

export interface PosterStyleTemplate {
  id: PosterStyleId;
  name: string;
  exampleTitle: string;
  vibe: string;
  palette: string;
  titleFont: string;
  layout: string;
  promptSuffix: string;
  negative?: string;
}

export const POSTER_STYLES: PosterStyleTemplate[] = [
  {
    id: "boss-noir",
    name: "Boss — Noir Office",
    exampleTitle: "UNDER THE BOSS",
    vibe: "noir office, blinds shadows, newspaper on floor foreground, power tension",
    palette: "charcoal, cream, gold accent, deep shadow",
    titleFont: "elegant condensed serif, tall tracking, gold foil on dark",
    layout: "title top-third, tagline small caps, floor newspaper detail bottom, dramatic shadows",
    promptSuffix:
      "noir office movie poster, dramatic blinds shadows, newspaper on floor foreground, charcoal and cream with gold accent title, elegant condensed serif typography, vertical 720x1280",
  },
  {
    id: "staycation-serif",
    name: "Staycation — Warm Lake House Serif",
    exampleTitle: "STAYCATION",
    vibe: "warm lake house, golden hour dock, cozy luxury, soft bokeh",
    palette: "warm cream, soft teal, sunset gold",
    titleFont: "large warm serif STAYCATION, white with soft drop shadow, subtitle in light sans",
    layout: "big serif title centered, subtitle smaller beneath, lake horizon middle, soft vignette",
    promptSuffix:
      "warm lake house movie poster, golden hour dock, cozy luxury, large serif title typography white with soft drop shadow, vertical 720x1280",
  },
  {
    id: "stepmom-bold",
    name: "Stepmom — Bold Sans Domestic",
    exampleTitle: "MY GIRLFRIEND'S STEPMOM",
    vibe: "modern domestic, soft kitchen daylight, approachable tension",
    palette: "coral/salmon, warm white, soft gray",
    titleFont: "bold condensed sans, tight leading, white on coral block",
    layout: "bold sans title stacked two lines, tagline small center, clean domestic background",
    promptSuffix:
      "modern domestic movie poster, soft kitchen daylight, bold condensed sans title typography white on coral, vertical 720x1280",
  },
  {
    id: "yuna-neon",
    name: "YUNA — Cyber Neon",
    exampleTitle: "Y.U.N.A.",
    vibe: "cyber neon, Tokyo night, holographic glow, futuristic",
    palette: "neon pink, electric cyan, deep purple/black",
    titleFont: "spaced neon pink Y.U.N.A., tech mono, outer glow",
    layout: "neon title top, city bokeh bottom, vertical light streaks",
    promptSuffix:
      "cyber neon movie poster, Tokyo night bokeh, neon pink holographic title typography with outer glow, cyan accents, vertical 720x1280",
  },
  {
    id: "hotshot-camo",
    name: "Hot Shot — Camo Military",
    exampleTitle: "HOT SHOT",
    vibe: "military camo, hangar daylight, confident action",
    palette: "olive drab, khaki, stenciled black, warm highlight",
    titleFont: "stenciled military sans, distressed, large HOT SHOT",
    layout: "stencil title diagonal, camo texture overlay, dog-tag tagline detail",
    promptSuffix:
      "military camo movie poster, hangar daylight, olive drab and khaki, stenciled military title typography, action poster layout, vertical 720x1280",
  },
];

const STYLE_MAP: Record<PosterStyleId, PosterStyleTemplate> = Object.fromEntries(
  POSTER_STYLES.map((s) => [s.id, s]),
) as Record<PosterStyleId, PosterStyleTemplate>;

export function getPosterStyle(id: string): PosterStyleTemplate {
  const found = (STYLE_MAP as Record<string, PosterStyleTemplate>)[id];
  if (!found) throw new Error(`[poster-styles] unknown style id: ${id} (valid: ${POSTER_STYLES.map((s) => s.id).join(", ")})`);
  return found;
}

export function listPosterStyleIds(): PosterStyleId[] {
  return POSTER_STYLES.map((s) => s.id);
}

/**
 * Build a Wavespeed prompt for alibaba/wan-2.7/text-to-image.
 * Always includes: movie poster style, title typography "<TITLE>", vertical 720x1280, sanitized wellness tone.
 */
export function buildPosterPrompt(params: {
  title: string;
  styleId: PosterStyleId | string;
  tagline?: string;
  extra?: string;
}): string {
  const { title, tagline, extra } = params;
  if (!title || !title.trim()) throw new Error("[poster-styles] buildPosterPrompt: title is required");
  const style = getPosterStyle(params.styleId);
  const cleanTitle = title.trim().replace(/"/g, "'");
  const parts = [
    `movie poster style, title typography "${cleanTitle}" ${style.titleFont} prominently displayed`,
    style.promptSuffix,
    "soft cinematic lighting, photorealistic, sharp focus, 8k, shallow depth of field",
    "vertical 720x1280, 9:16 portrait, centered composition",
    "sanitized, romantic tension, cozy intimacy, fully clothed styled, synthetic adult 18+ wellness series",
  ];
  if (tagline) parts.push(`tagline "${tagline.replace(/"/g, "'")}" small caps`);
  if (extra) parts.push(extra);
  return parts.join(", ");
}

/** Negative prompt for poster generation (shared). */
export const POSTER_NEGATIVE = [
  "low quality",
  "blurry",
  "deformed",
  "extra limbs",
  "watermark",
  "text error",
  "logo",
  "cartoon",
  "anime",
  "3d render",
  "oversaturated",
  "harsh shadow",
  "duplicate body",
].join(", ");

/** Map a series category/slug to a default poster style (fallback: boss-noir). */
export function defaultStyleForSeries(seriesIdOrCategory: string): PosterStyleId {
  const key = seriesIdOrCategory.toLowerCase();
  if (key.includes("boss")) return "boss-noir";
  if (key.includes("staycation") || key.includes("lake")) return "staycation-serif";
  if (key.includes("stepmom") || key.includes("milf")) return "stepmom-bold";
  if (key.includes("yuna") || key.includes("y.u") || key.includes("cyber")) return "yuna-neon";
  if (key.includes("hotshot") || key.includes("hot") || key.includes("military") || key.includes("camo")) return "hotshot-camo";
  return "boss-noir";
}
