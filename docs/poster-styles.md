# VeilWick Poster Styles — Movie Poster Pipeline (Wavespeed Wan 2.7)

> Synthetic series posters · 720x1280 vertical (9:16) · Movie-poster typography
> All characters fictional, consenting adults 18+. No real persons. Sanitized.

## Pipeline

```
title + style template -> buildPosterPrompt() -> Wavespeed alibaba/wan-2.7/text-to-image
-> 720x1280 JPG -> R2 posters/series/{seriesId}/cover.jpg (and ep posters)
-> D1 series.thumbnail / episodes.posterUrl -> Next <Image> via cdn.veilwick.com
```

- **Model:** `alibaba/wan-2.7/text-to-image` (or `alibaba/wan-2.7/text-to-image-pro` for pro)
- **Size:** `720x1280` vertical 9:16 — pass as `size: "720*1280"` or `aspect_ratio: "9:16"` + `resolution: "720x1280"`
- **Prompt must include:** `movie poster style, title typography "<TITLE>" prominently displayed, vertical 720x1280`
- **R2 upload:** `posters/series/{seriesId}/cover.jpg` and `posters/series/{seriesId}/ep{num}.jpg` via `@/lib/posters` `putPoster()` (contentType `image/jpeg`)
- **Next.js:** `next.config.ts` `images.remotePatterns` must allow `cdn.veilwick.com` (R2 public base) — see `apps/web/next.config.ts`
- **Sanitized:** no explicit act, no nudity in prompt; use "intimate wellness series", "romantic tension", "soft cinematic lighting"

### Wavespeed CLI

```bash
wavespeed run alibaba/wan-2.7/text-to-image \
  --prompt "movie poster style, title typography 'STAYCATION' serif white with drop shadow, warm lake house at golden hour, vertical 720x1280, romantic tension, soft cinematic lighting, photorealistic, 8k" \
  --input size="720*1280" \
  -o poster-720x1280.jpg

# pro variant
wavespeed run alibaba/wan-2.7/text-to-image-pro \
  --prompt "movie poster style, title typography 'Y.U.N.A.' neon pink cyber" \
  --input size="720*1280"
```

### Wavespeed API

```ts
POST https://api.wavespeed.ai/api/v3/alibaba/wan-2.7/text-to-image
Headers: Authorization: Bearer $WAVESPEED_API_KEY
Body: { prompt, size: "720*1280", enable_prompt_expansion: true }
-> { output: "<image_url>", request_id }
# download then R2 put: await putPoster(UPLOADS, seriesCoverKey(seriesId), jpegBytes)
```

See `apps/web/src/lib/poster-styles.ts` for typed templates and `buildPosterPrompt()`, and `apps/web/src/lib/posters.ts` for `generatePosterImage()` + R2 upload.

---

## Style templates (5)

Each template maps a candy.ai series vibe to a distinct movie-poster treatment. Use `posterStyles.ts` `POSTER_STYLES` as source of truth.

### 1. boss-noir — Under the Boss

- **Vibe:** noir office, newspaper on floor, blinds shadows, power tension
- **Palette:** charcoal, cream, gold accent, deep shadow
- **Title font:** elegant condensed serif, tall tracking, gold foil on dark
- **Layout:** title top-third, tagline small caps, floor newspaper detail bottom
- **Prompt suffix:** `noir office movie poster, dramatic blinds shadows, newspaper on floor foreground, charcoal and cream with gold accent title, elegant condensed serif typography, vertical 720x1280`
- **Example title:** `UNDER THE BOSS`

### 2. staycation-serif — Staycation with My Fiancee's Mother

- **Vibe:** warm lake house, golden hour dock, cozy luxury
- **Palette:** warm cream, soft teal, sunset gold
- **Title font:** large warm serif STAYCATION, white with soft drop shadow, subtitle in light sans
- **Layout:** big serif title centered, subtitle smaller beneath, lake horizon middle, soft vignette
- **Prompt suffix:** `warm lake house movie poster, golden hour dock, cozy luxury, large serif title typography white with soft drop shadow, vertical 720x1280`
- **Example title:** `STAYCATION`

### 3. stepmom-bold — My Girlfriend's Stepmom

- **Vibe:** modern domestic, soft kitchen daylight, approachable tension
- **Palette:** coral/salmon, warm white, soft gray
- **Title font:** bold condensed sans, tight leading, white on coral block
- **Layout:** bold sans title stacked two lines, tagline small center, clean domestic background
- **Prompt suffix:** `modern domestic movie poster, soft kitchen daylight, bold condensed sans title typography white on coral, vertical 720x1280`
- **Example title:** `MY GIRLFRIEND'S STEPMOM`

### 4. yuna-neon — Y.U.N.A.

- **Vibe:** cyber neon, Tokyo night, holographic glow
- **Palette:** neon pink, electric cyan, deep purple/black
- **Title font:** spaced neon pink Y.U.N.A., tech mono, outer glow
- **Layout:** neon title top, city bokeh bottom, vertical light streaks
- **Prompt suffix:** `cyber neon movie poster, Tokyo night bokeh, neon pink holographic title typography with outer glow, cyan accents, vertical 720x1280`
- **Example title:** `Y.U.N.A.`

### 5. hotshot-camo — Hot Shot

- **Vibe:** military camo, hangar daylight, confident action
- **Palette:** olive drab, khaki, stenciled black, warm highlight
- **Title font:** stenciled military sans, distressed, large HOT SHOT
- **Layout:** stencil title diagonal, camo texture overlay, dog-tag/tagline detail
- **Prompt suffix:** `military camo movie poster, hangar daylight, olive drab and khaki, stenciled military title typography, action poster layout, vertical 720x1280`
- **Example title:** `HOT SHOT`

---

## Usage (code)

```ts
import { buildPosterPrompt, getPosterStyle } from "@/lib/poster-styles";
import { generatePosterImage, putPoster, seriesCoverKey } from "@/lib/posters";

const style = getPosterStyle("staycation-serif");
const prompt = buildPosterPrompt({ title: "STAYCATION", styleId: "staycation-serif" });
// -> "movie poster style, title typography 'STAYCATION' serif white with drop shadow, warm lake house ... vertical 720x1280 ..."

const { imageUrl } = await generatePosterImage({ title: "STAYCATION", styleId: "staycation-serif" });
// download, then upload:
const jpeg = await fetch(imageUrl).then(r => r.arrayBuffer());
await putPoster(env.UPLOADS, seriesCoverKey("series_s1"), jpeg);
```

## Verification

```bash
# generate one style dry-run
bun run scripts/generate-posters.ts --style staycation-serif --dry-run
# verify dimensions
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv poster.jpg
# must be 720,1280
```

## Sanitization

- Keep prompts suggestive, not explicit: "romantic tension", "cozy intimacy", "soft cinematic lighting"
- Never include explicit acts, nudity, or real person names in prompts
- Title typography is the hero; character is secondary and fully clothed styled
