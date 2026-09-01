# VeilWick Tasks — Series Playlists · H3 Local Only (Vast scrapped)

## Status: Vast scrapped — H3 local only ($0.25 / 5s)

Vast.ai self-hosted path removed. No `VAST_API_KEY` / `VAST_INSTANCE_IP` fallback in feed or series code.
All generation is `wavespeed-ai/minimax-h3/image-to-video-lora` ($0.25 / 5s, 768p 9:16) via `apps/web/src/lib/wavespeed.ts` with `WAVESPEED_API_KEY` only.
Local only: `scripts/generate-series-local.ts` generates via `wavespeed` CLI and writes to R2 + D1 via `wrangler --local`. No `--remote`. No production writes from script.

## Series — Playlist (candy.ai style) 5-episode cliffhanger

Series are TikTok-style playlists (not separate navigation). 2-3 curated series, each 5 episodes.

| Series (slug) | Episodes | Paywall | Duration | Stitch |
|---|---|---|---|---|
| `private-lessons` — Private Lessons | E1-5 | E1-2 free, E3-5 locked Upgrade to Premium | 5-15s each (default 5s, H3 768p) | `image` (first_frame) + `last_image` (last_frame) seamless; E(n).lastFrame → E(n+1).firstFrame |
| `your-new-stepsister` — Your New Stepsister | E1-5 | E1-2 free, E3-5 locked Upgrade to Premium | 5-15s each (default 5s) | same H3 stitch |
| `midnight-overtime` — Midnight Overtime (optional 3rd) | E1-5 | E1-2 free, E3-5 locked | 5-15s | same |

UI: `/series` grid (secondary deep link) + `/series/[id]` detail + feed playlist filter.
Wiring: `apps/web/src/components/series/data.ts` (5 episodes per series, E3-5 `locked:true` + `New` badge), `apps/web/app/(app)/series/page.tsx` + `series-client.tsx`, `apps/web/app/(app)/series/[id]/page.tsx` + `series-detail-client.tsx` (Locked → Upgrade to Premium paywall with `Crown` + `Upgrade to Premium` CTA).
Access helper: `apps/web/src/lib/wavespeed.ts` — `FREE_EPISODES=2`, `EPISODES_PER_SERIES=5`, `isEpisodeLocked(n)`, `getEpisodeAccess(n)`, `assertEpisodeAccess(n, {isSubscribed})`, `buildCliffhangerSeries(id)`.
Schema: `apps/web/src/db/schema/series.ts` — `series` + `episodes` (duration 5 default, `prompt`, `firstFrameUrl`, `lastFrameUrl`, `h3Model`, `resolution`). Stitch metadata persisted per episode. Migration `0011_series_h3_stitch.sql` (+ snapshot).

Episode defaults:
- duration: 5 (also supports 10, 15 via `--duration`)
- resolution: 768p 9:16 (also 720p)
- model: `wavespeed-ai/minimax-h3/image-to-video-lora` ($0.25/5s)
- pricing: $0.25 per 5s; 10s = $0.50, 15s = $0.75. Cost logged per episode.
- prompts: non-explicit fashion/wellness/lifestyle clothed only (see `docs/prompts.md` §5 + `wavespeed.ts:FEED_PROMPTS`). No nudity/explicit act tokens. Verified via `grep -r "nude\|naked"`.

## Feed — H3 image-to-video-lora (Wavespeed-only, 768p 9:16, 5s, local)

| Item | Detail |
|------|--------|
| Model (primary) | `wavespeed-ai/minimax-h3/image-to-video-lora` — $0.25 per 5s, 768p 9:16 |
| Model (reference) | `wavespeed-ai/minimax-h3/reference-to-video-lora` — $0.30 per 5s, 768p 9:16 |
| Inputs | `image` (first frame) + `last_image` (optional stitch end) + `loras` (optional, `WAVESPEED_LORA_PATH`) + `prompt` + `duration: 5` + `resolution: 768p` |
| Aspect | 9:16 portrait |
| Prompts | Non-explicit fashion/wellness/lifestyle clothed only — `docs/prompts.md` §5 via `FEED_PROMPTS` / `getFeedPrompt(category)` |
| Tags | By angle / POV / lighting — `FEED_TAGS` |
| Env | `WAVESPEED_LORA_PATH` optional comma-separated LoRA paths; `WAVESPEED_API_KEY` required |
| CLI | `wavespeed run wavespeed-ai/minimax-h3/image-to-video-lora --image <first.jpg> --last-image <last.jpg> --loras "$WAVESPEED_LORA_PATH" --prompt "<prompt>" --duration 5 --resolution 768p` |

Feed route: `apps/web/app/api/feed/route.ts` enqueues `h3.generate` with `image`/`last_image`/`loras`/`prompt`/`duration`/`resolution` (Wavespeed-only, no Vast).
Prefetch: `apps/web/app/api/feed/prefetch/route.ts` same payload (buffer < 2 triggers).
Client: `apps/web/app/(app)/feed/feed-client.tsx` loads `GET /api/feed?personalized=true` (H3 only).

## Generation Pipeline — scripts/generate-series-local.ts (local only)

Local-only script. Generates 5-episode series via H3 with stitch, writes to local R2 + local D1. No remote.

```
bun scripts/generate-series-local.ts private-lessons 1 2 3 4 5          # full series (2 free + 3 Premium)
bun scripts/generate-series-local.ts private-lessons 1 --dry-run       # preview commands
bun scripts/generate-series-local.ts your-new-stepsister 3 --duration 10 --resolution 768p
bun scripts/generate-series-local.ts midnight-overtime 1 2 3 4 5 --duration 5
bun scripts/generate-series-local.ts --help
```

Per episode:
1. Build non-explicit prompt: `SERIES_CATALOG[slug].basePrompt + EPISODE_BEATS[n]` (e.g. E1 setup, E3 temptation cliffhanger) — always includes `vertical 768p 9:16, 5s duration, clothed`.
2. Resolve `image` = `--image` override or previous episode `lastFrame` extract or `posters/series/{slug}/ep{N}-first.jpg` or `series-posters/{slug}.jpg`; `last_image` = `--last-image` or `posters/series/{slug}/ep{N}-last.jpg` if exists.
3. `wavespeed run wavespeed-ai/minimax-h3/image-to-video-lora --image <img> [--last-image <last>] --prompt "<prompt>" --duration 5 --resolution 768p [--loras "$WAVESPEED_LORA_PATH"] -o output/series/{slug}/ep{N}.mp4` — local CLI.
4. `ffmpeg -ss 1.2 -i output/series/{slug}/ep{N}.mp4 -vframes 1 -s 720x1280 -q:v 2 output/series/{slug}/ep{N}.jpg` — poster.
5. `npx wrangler r2 object put template-uploads/videos/series/{slug}/ep{N}.mp4 --file output/series/{slug}/ep{N}.mp4 --local --config cloudflare/app-worker/wrangler.jsonc`
6. `npx wrangler r2 object put template-uploads/posters/series/{slug}/ep{N}.jpg --file output/series/{slug}/ep{N}.jpg --local --config cloudflare/app-worker/wrangler.jsonc`
7. `npx wrangler d1 execute template-db --local --config cloudflare/app-worker/wrangler.jsonc --command "INSERT OR REPLACE INTO episodes ... prompt, first_frame_url, last_frame_url, h3_model, resolution, locked (E3-5), duration, poster_url, video_url"`
8. Extract last frame for next stitch: `ffmpeg -sseof -0.5 -i output/series/{slug}/ep{N}.mp4 -vframes 1 -s 720x1280 -q:v 2 output/series/{slug}/ep{N}-last.jpg` → used as `image` for E{N+1}.

All wrangler calls use `--local`; script refuses `--remote`. Pricing logged per episode: `$0.25 × (duration/5)`.

Verify continuity: `npx wrangler d1 execute template-db --local --config cloudflare/app-worker/wrangler.jsonc --command "SELECT num, title, locked, duration, resolution, first_frame_url, last_frame_url FROM episodes WHERE series_id='ser_private_lessons' ORDER BY num"`

Library (Wan 2.4-14B) retained for later nightly batch but feed/series defaults to H3. `scripts/generate-continuous.ts` remains library-only (60s Wan). Do not mix H3 series pipeline with Vast.

## Models & Pricing

- Series / Feed (default): `wavespeed-ai/minimax-h3/image-to-video-lora` — 768p 9:16, 5s $0.25 (10s $0.50, 15s $0.75) + `wavespeed-ai/minimax-h3/reference-to-video-lora` — $0.30/5s
- Library (nightly batch, later): `alibaba/wan-2.7/text-to-video`, `alibaba/wan-2.7/video-extend`, `alibaba/wan-2.7/image-to-video` — 60s via Wan 2.4-14B + Civitai LoRAs 1333923/1428098

## Run (local only)

```bash
# Series generation — local only, no remote
bun scripts/generate-series-local.ts private-lessons 1 2 3 4 5 --duration 5
bun scripts/generate-series-local.ts private-lessons 1 --dry-run

# Feed H3 single clip (local CLI)
wavespeed run wavespeed-ai/minimax-h3/image-to-video-lora --image posters/feed/market-stall-fashion/first.jpg --last-image posters/feed/market-stall-fashion/last.jpg --loras "$WAVESPEED_LORA_PATH" --prompt "$(node -e 'import(\"@veilwick/web/src/lib/wavespeed.js\").then(m=>console.log(m.getFeedPrompt(\"market-stall-fashion\")))')" --duration 5 --resolution 768p

# DB + build verify (local)
bun run --filter @veilwick/web db:migrate:local
bun run typecheck
bun run build
```

## Secrets

Keep in `.dev.vars` (never committed):
- `WAVESPEED_API_KEY` — Wavespeed API (required for H3 local generation)
- `WAVESPEED_LORA_PATH` — optional, comma-separated LoRA paths for H3
- `HF_TOKEN` / `CIVITAI_API_KEY` — retained only for Wan library batch, not feed/series

## Lint

- Cyclomatic ≤10 per function, file ≤120 lines (apps/web/src)
- Keep prompts non-explicit; keep generation local only (`--local`).
