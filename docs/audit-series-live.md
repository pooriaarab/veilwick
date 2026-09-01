# VeilWick Audit — Series / Live / Prototype / Posters

**Date:** 2026-09-01
**Root:** `/Users/parab/Documents/Personal/veilwick` (actual app at `apps/web/`)
**Scope:** `app/(app)/series/*`, `app/live/*`, `app/prototype-scenes/*`, `src/db/schema/series.ts`, `components/series/data.ts`, `public/series-posters`, `public/storyboard`, `output/prototype/*.mp4`, `docs/generation-log.md`
**Requested verdicts to verify:** Implemented — Your New Stepsister E1 6×5s=30s 7.4M, 5-ep schema E1-2 free E3-5 locked, TikTok 100vh — vs Stubs — live not wired to H3, series not seeded D1, posters black-frame fix done but some 403.

---

## 1. Executive Summary

| Area | Verdict | Detail |
|---|---|---|
| **Your New Stepsister E1 — 6 scenes → 30s** | **IMPLEMENTED — verified** | `output/prototype/e1-30s.mp4` 7.4M 720×1280 31.08s (31.136 container) stitched from 6×5.17s segments via H3 `image+last_image` + ffmpeg lanczos scale + concat re-encode. Captioned variant `e1-30s-captioned.mp4` 7.1M. Fully logged in `docs/generation-log.md` §10–17. |
| **Series schema 5-ep, E1-2 free E3-5 locked** | **IMPLEMENTED — verified** | `apps/web/src/db/schema/series.ts` defines `seriesTable` + `episodesTable` (num 1–5 unique per series, `locked` bool, `unlockPrice`, `posterUrl`/`videoUrl` 720×1280 at 1.2s, stitch `firstFrameUrl`/`lastFrameUrl`, `h3Model`/`resolution`). `components/series/data.ts` builds 12 series ×5 ep (`locked: n>=3`). UI paywall in both `SeriesModal` and `series-detail-client.tsx`. |
| **TikTok 100vh vertical** | **IMPLEMENTED — verified** | `apps/web/app/(app)/feed/feed-client.tsx` uses `h-[100vh] h-[100dvh]` + `style={{height:"100vh"}}` + `snap-y snap-mandatory` + `snap-start snap-always` per slide, `overscroll-contain touch-pan-y`. |
| **Live feed wired to H3** | **STUB — not wired** | `app/(app)/live/*` is hardcoded demo (test-videos.co.uk + simulated chat/viewers + `picsum.photos` posters). API `app/api/live/[category]/route.ts` does query D1 `streamTable`/`videoTable` but MOCK covers only `yoga|fitness|activewear|breathwork`; `nsfw`, `feed`, etc return 404 from API. No `live` category uses H3 generation or queue. |
| **Series seeded in D1** | **PARTIAL — 2 seeded, 10 not** | Prompt says "not seeded D1" but `.open-next/.../12f1b0...sqlite` now has **2 series** (`ser_private_lessons`, `ser_new_stepsister`) with **10 episodes** (E1-2 free, E3-5 locked) — `scripts/generate-series-local.ts` INSERT OR IGNORE did run for those two. Remaining 10 static series in `data.ts` (`s2,s3…s12`) have **no D1 rows**; production `apps/web/cloudflare/app-worker/.wrangler/.../12f1b0...sqlite` also only 2. |
| **Posters — black frame fix + 403** | **FIX DONE, local OK; remote risk remains** | Local posters `apps/web/public/series-posters/*.jpg` all 720×1280 (6 `poster-*.jpg` 1.5–2.0M + 12 `series_s*.jpg` 1.5–2.0M verified via ffprobe 720×1280). Extraction rule `ffmpeg -ss 1.2 -s 720x1280` avoids black leading frame. `localSeriesCoverUrl()` → `/series-posters/{id}.jpg` with plain `<img unoptimized>` — no R2/picsum. No 403 on local; legacy `public/series-posters` does not exist (canonical is `apps/web/public/series-posters`). Remote paths (`R2_PUBLIC_BASE cdn.veilwick.com` / `picsum.photos`) would 403 if still referenced — `SeriesGrid`/`data.ts` no longer reference them for covers. |

**Bottom line:** Core series + prototype pipeline is real and reproducible. Live is UI-only demo. D1 seeding is intentionally minimal (2/12). Posters are correct locally; any remaining 403 would come from stale remote references, not local covers.

---

## 2. Path-by-Path Findings

### 2.1 `app/(app)/series/*` — `apps/web/app/(app)/series/*`

| File | Status | Notes |
|---|---|---|
| `page.tsx` | OK | `dynamic=force-dynamic`, renders `SeriesPageClient`, metadata `robots noindex`. |
| `series-client.tsx` | OK | Secondary grid — banner explains series are now **playlists in the feed** (e.g. `@luna.bliss` → `Playlist: Private Lessons (5)`). Uses `SeriesGrid` + `SeriesModal`. Keeps deep-link `sr-only` links to `/series/[id]`. |
| `[id]/page.tsx` | OK | `generateStaticParams` from `SERIES_DATA`, `generateMetadata`, 404 fallback. |
| `[id]/series-detail-client.tsx` | OK | 58% player + episode list. `video src={series.videoUrl}` (`videos/series/{slug}/ep1.mp4`), `poster={series.posterUrl}`. Paywall overlay for `locked` eps (E3-5) → `Upgrade to Premium`. Timeline, mute toggle, `isNew` badge, `duration` display. No D1 fetch — uses static `data.ts`. |

**Gap:** Detail player always plays `series.videoUrl` (ep1) regardless of which free episode is selected (should swap to `activeEpisode.videoUrl`). `thumbnailUrl` falls back to `series.posterUrl` until per-ep thumbs exist — by design (`posters.ts:59`).

### 2.2 `app/live/*` — `apps/web/app/(app)/live/*` + `apps/web/app/api/live/*`

| File | Status | Notes |
|---|---|---|
| `live-client.tsx` | Demo | `LiveStream` type, seeded chat (`wellness.ria` etc), host bot every 12s, viewer `+0–2` every 5s, `!outfit <color>` command parser. `video` uses `stream.videoUrl` from props, `LIVE` badge, host avatar, mute/follow. No H3, no WebSocket, no R2. |
| `[category]/page.tsx` | Demo | `STREAMS` map hardcodes **10 categories** (yoga, fitness, activewear, breathwork, nsfw, blowjob, cowgirl, missionary, titfuck, feed) with `test-videos.co.uk` MP4s + `picsum.photos/seed/live_*` posters + `dicebear` avatars. Unknown category → card with links. Wrapped with `AgeGate`. |
| `feed/page.tsx` | Demo | Single `FEED_STREAM` (feed category, 5120 viewers, same test-videos MP4). Same `LiveClient`. |
| `api/live/[category]/route.ts` | Partial | Tries D1 `streamTable`/`videoTable` (isLive, currentVideoId → r2Key/prompt) then falls back to `MOCK` map. **MOCK only covers 4 keys** (`yoga, fitness, activewear, breathwork`); any other category (including `feed`, `nsfw`, 6 explicit) returns 404 `{error: Unknown category}` even though UI has 10. Viewer count still from MOCK when D1 row exists. No H3 enqueue, no queue, no `last_image`. |

**Stub confirmed:** Live is not wired to `wavespeed-ai/minimax-h3/image-to-video-lora`. No `OUTBOX_QUEUE`, no `h3.generate`, no `videos/series/*` source, no stitch.

### 2.3 `app/prototype-scenes/*` — `apps/web/app/prototype-scenes/*` + `prototype-scenes.html`

| File | Status | Notes |
|---|---|---|
| `app/prototype-scenes/client.tsx` | Implemented | **Your New Stepsister E1 — Unpacking** — 6 scenes S1–S6 (Setup→Afterglow), each 5s 720×1280, Heat 2–3 clothed, beats/phases mapped to `docs/prompts.md §2`. `SCENES[n].firstFrame`/`lastFrame` define H3 stitch chain: `first.jpg→first.jpg`, `first→last`, `last→last`, `last→last`, `last→poster`, `poster→poster`. Full prompts verbatim (730–790 chars) with negative tail. `Generate S1 — H3 5s` button → `POST /api/generate` with `image, duration:5, resolution:768p`. |
| `app/prototype-scenes/page.tsx` | OK | `dynamic=force-static`, renders client. |
| `prototype-scenes.html` | Legacy wireframe | Top-level `prototype-scenes.html` (46K) — storyboard-first wireframe for 2 series ×5 ep ×3–4 shots, Wan 14B lora legend. Superseded by `app/prototype-scenes/client.tsx` single-ep focus but still present at repo root. |

### 2.4 `src/db/schema/series.ts` — `apps/web/src/db/schema/series.ts`

Verified schema (imports `commonColumns`):

- `seriesTable` — `id ser_{cuid}`, `title`, `slug unique`, `category`, `thumbnail` (R2 `videos/series/{slug}/epN.mp4` or `posters/...`), `description`, `creator`, `tagsJson default []`, `isNew bool default true`, `vipRequired bool default false`, indexes on `slug, category, isNew, createdAt`. Comment documents 2–3 series ×5 ep, H3 `image+last_image` stitch, poster at 1.2s 720×1280, `E(n).lastFrame = E(n+1).firstFrame`.
- `episodesTable` — `id ep_{cuid}`, `seriesId FK cascade`, `num` 1–5 unique per series, `title`, `duration default 5`, `posterUrl` 720×1280, `videoUrl` R2 MP4, `locked bool default false`, `unlockPrice`, `prompt`, `firstFrameUrl`, `lastFrameUrl`, `h3Model default wavespeed-ai/minimax-h3/image-to-video-lora`, `resolution default 768p`.

No drift — matches `docs/character-consistency.md` spec and `data.ts` contract.

### 2.5 `components/series/data.ts` — `apps/web/src/components/series/data.ts`

- 8 `SeriesCategory` values + `All`; `SERIES_CATEGORIES` exported.
- `Series` / `SeriesEpisode` types: `posterUrl` comment confirms local `/series-posters/{seriesId}.jpg`, `unoptimized` img, no R2/picsum.
- `mkEpisodes()` — 5 titles (First Encounter→Final Seduction), `duration:"0:05"`, `locked: n>=3`, `isNew: n>=3`, `thumbnailUrl: localEpisodePosterUrl(seriesId)`, `videoUrl: videos/series/{slug}/ep{n}.mp4`.
- `SERIES_DATA` — **12 series** `s1`–`s12` (Stepsister, Milf, Cuckold, Roommate, Teacher, Boss, Massage) with `posterUrl: localSeriesCoverUrl(slug)` → `/series-posters/series_s*.jpg`.

**Gap vs D1:** Static 12-entry catalog is the UI source of truth; D1 only holds 2 of them (see §3). `SeriesGrid` filters by `category` locally — no DB query.

### 2.6 `public/series-posters` — `apps/web/public/series-posters/` (+ legacy `public/`)

- **Canonical:** `apps/web/public/series-posters/` — **18 JPGs verified 720×1280** (ffprobe): `poster-blowjob.jpg` (1.7M), `poster-boss.jpg` (1.7M), `poster-hotshot.jpg` (1.8M), `poster-staycation.jpg` (1.6M), `poster-stepmom.jpg` (1.6M), `poster-yuna.jpg` (2.0M), `series_s1.jpg`–`series_s12.jpg` (1.5–2.0M each, 12 files).
- **Legacy:** `public/series-posters` does **not exist** at repo root; legacy `public/prototype/` holds `e1-*.mp4` mirrors (9 files) and `public/storyboard/` holds the 60s source + seg0–3 splits. `apps/web/public/*` is what `next dev` / `.open-next` serves as `/…`.
- **Pipeline:** `src/lib/posters.ts` — `POSTER_EXTRACT_AT=1.2`, `ffmpeg -ss 1.2 -s 720x1280`, `localSeriesCoverUrl`/`localEpisodePosterUrl` → `/series-posters/{id}.jpg`, `posterKey` → `posters/series/{id}/ep{num}.jpg`, `putPoster` → R2 `image/jpeg`. `src/lib/poster-styles.ts` — 5 styles `boss-noir, staycation-serif, stepmom-bold, yuna-neon, hotshot-camo` with `buildPosterPrompt()` sanitized.
- **Black-frame fix:** Done — extracting at 1.2s (not 0s) avoids all-black first frame. No poster has zero-byte or 0×0. All 18 ffprobes returned `width=720 height=1280`.
- **403 nuance:** Local covers do not 403. Remote `cdn.veilwick.com/posters/series/...` or `picsum.photos` would 403 if fetched without R2 deploy; current code avoids that for covers by using local URLs. Series detail `videoUrl` (`videos/series/…/ep1.mp4`) will 404/403 until R2 local/preview bucket is populated via `scripts/generate-series-local.ts` (only `output/series/private-lessons/` exists, empty). `SeriesModal`/`data.ts` poster 403 is **resolved**; video 403 is **expected until generation**.

### 2.7 `public/storyboard` — `apps/web/public/storyboard/` + `public/storyboard/`

- `apps/web/public/storyboard/` — 14 JPGs: `pick-your-new-stepsister-e1-{first,last,poster}.jpg` 50–179K 720×1280 + `pick-your-new-stepsister-poster.jpg` + `pl-ep{1..3}-*.jpg` + `st-ep{1..2}-*.jpg` (each 160–209K).
- `public/storyboard/` — 13 files: same 3 E1 JPGs + `pick-your-new-stepsister-e1-60s.mp4` (43M, Wan 720×1280 60s continuous prior art) + `seg0..seg3.mp4` 7–15M splits + `*-last.jpg` intermediates. Text file `pick-your-new-stepsister-e1-60s.mp4.txt` present.
- All referenced by `prototype-scenes/client.tsx` SCENES `firstFrame`/`lastFrame` as `/storyboard/pick-your-new-stepsister-e1-*.jpg` — verified via `sips` and `ffprobe` 720×1280.

### 2.8 `output/prototype/*.mp4` — `output/prototype/` + `apps/web/public/prototype/` + `.open-next/assets/prototype/`

| File | ffprobe | Size | Status |
|---|---|---|---|
| `e1-30s.mp4` (stitched) | 720×1280 h264, 24fps, `duration 31.083333` (format 31.136), 744 frames | **7.4M** | **CANONICAL — verified** |
| `e1-30s-captioned.mp4` | 720×1280 h264+aac, same duration, white captions black outline via `drawtext` | **7.1M** | **VERIFIED**, preview `/prototype/e1-30s-captioned.mp4` |
| `e1-s1-5s.mp4` | 720×1280 5.166667 | 938K | S1 Setup — verified |
| `e1-s2-5s.mp4` | 720×1280 5.166667 | 1.4M | S2 Tension — verified |
| `e1-s3-5s.mp4` | 720×1280 5.166667 | 1.5M | S3 Temptation — verified |
| `e1-s4-5s.mp4` | 720×1280 5.166667 | 1.2M | S4 Leap — verified |
| `e1-s5-5s.mp4` | 720×1280 5.166667 | 1.3M | S5 Retreat — verified |
| `e1-s6-5s.mp4` | 720×1280 5.166667 | 1.6M | S6 Afterglow — verified |
| `e1-s{N}-5s-raw.mp4` ×6 | 768×1344 5.166667 (H3 native 768p) | 1.8–3.2M each | Raw kept, lanczos scaled |
| `e1-5s.mp4`, `e1-r2v-5s*.mp4` | 720×1280 | 1.2–3.1M | Prior experiments (private-tutoring prompt, r2v) — superseded but retained for audit |
| Preview mirrors | Same hashes | 7.4M / 7.1M | Copied to `apps/web/public/prototype/` + `.open-next/assets/prototype/` + `public/prototype/` |

Duration note: each 5s request returns **5.166667** (≈4 frames pad @24fps); 6× → **31.08s actual** (31.13 container) ≠ exactly 30.00 — expected H3 behavior, documented `generation-log.md §13.4`. Stitch via `ffmpeg -f concat -safe 0 -c:v libx264 -crf 23 -c:a aac` re-encode (not `-c copy`) to normalize timestamps/audio.

### 2.9 `docs/generation-log.md`

42K, 17 sections — reproduces single source of truth for E1. Covers: source reads (`wavespeed.ts`, `client.tsx SCENES[0]`, `.dev.vars`, storyboard still 720×1280), LoRA `/tmp/MysticXXX_MMH3-V4.safetensors` 148M (Civitai 2856467/3266628) — upload via `wavespeed upload` fails (expected, CDN rejects 148M safetensors), inference path `image URL + prompt + duration 5 + resolution 768p` with `--input-file JSON` workaround, per-scene timings (S1 73s, S2 77s, S3 77s, S4 73s, S5 126s slow, S6 83s), costs **$1.50** (6×$0.25, balance $14.85→$13.35), scaling lanczos, stitch demuxer, failure modes (loras `Prediction failed`, `/usr/bin/time` tee break, native 768×1344 vs 720×1280, duration padding), files touched, reproduce script. Local-only, no `--remote`, no Vast.

---

## 3. Deeper Cross-Cuts

### 3.1 D1 Seeding — What Exists Where

`apps/web/cloudflare/app-worker/wrangler.jsonc` is the canonical wrangler config (no `apps/web/wrangler.jsonc`). Two D1 locations were inspected:

- `.open-next/server-functions/default/apps/web/.wrangler/state/d1/.../12f1b0db...sqlite` (**OpenNext dev**): tables include `series`, `episodes`, `videos`, `streams`; rows: `series=2` (`private-lessons`, `your-new-stepsister`), `episodes=10` (5 each, `locked=0` for E1-2, `locked=1` for E3-5 with titles First Lesson…Final Exam / Moving In…New Rules).
- `.open-next/.../state/v3/d1/.../12f1b0db...sqlite` (v3): same 2 series.
- `apps/web/cloudflare/app-worker/.wrangler/state/v3/d1/.../12f1b0...sqlite`: `series=2`.
- Other D1 files (`spike/outbox-d1`, `workers/cron`) do not contain `series` table.

`scripts/generate-series-local.ts` seeds via `INSERT OR IGNORE INTO series ...` + `INSERT ... episodes` with `seriesId ser_{slug}`, `locked ep>=3`, `--local` only. It was run for `private-lessons` and `your-new-stepsister` (verified via sqlite3). No seed for the other 10 `data.ts` slugs.

**Implication:** The task's "series not seeded D1" was true at kickoff; it is now **partially seeded** (2/12). Any code that queries D1 for `series_s1`–`series_s12` (the `data.ts` IDs) will find 0 rows — the seeded slugs are `private-lessons` / `your-new-stepsister`, not `s1`. So even seeded rows do not back the UI's `s1`…`s12`.

### 3.2 TikTok Feed — 100vh Evidence

`feed-client.tsx` line 196–197: `style={{scrollSnapAlign:"start", height:"100vh"}} className="relative h-[100vh] h-[100dvh] ... snap-start snap-always overflow-hidden bg-black"` per slide. Container line 594: `className="h-[100vh] h-[100dvh] ... snap-y snap-mandatory overflow-y-scroll overscroll-contain scroll-smooth touch-pan-y"`. Shell line 546: `className="relative flex h-[100vh] h-[100dvh] ..."` . Comment header explicitly: "100vh per clip" / "100vh" semantics. Falls back to `100dvh` for iOS dynamic viewport.

### 3.3 Live Not Wired — Why

- `live-client.tsx` viewer creep and host messages are `setInterval` locally; no fetch to `/api/live/*`.
- `app/(app)/live/[category]/page.tsx` never calls the API; `LiveClient` receives hardcoded `STREAMS[category]`.
- `api/live/[category]/route.ts` queries `streamTable`/`videoTable` correctly but MOCK gaps cause 404 for 6/10 UI categories.
- No `h3.generate`, no `first_frame`/`last_image`, no `WAVESPEED_LORA_PATH`, no queue.

### 3.4 Poster 403 — Why Task Says Some 403

Local covers do not 403. Residual 403 sources:
- `feed-client.tsx` fallback `picsum.photos/seed/fb{N}/720/1280` and `live` `picsum.photos/seed/live_*` posters would hit browser mixed-content or rate-limit 403 if external fetch is blocked (app does use `posterUrl` fallback when `posterError` but host posters are `picsum`).
- `videos/series/{slug}/ep{N}.mp4` R2 keys (`cdn.veilwick.com`) will 403/404 until `generate-series-local.ts` or `wrangler r2` populates the preview bucket.
- `SeriesGrid` itself does not 403 — it uses `/series-posters/…` local.

---

## 4. Risks & Next Steps

1. **Live API MOCK mismatch** — align `api/live/[category]/route.ts` MOCK keys with `STREAMS` keys (add `nsfw, blowjob, cowgirl, missionary, titfuck, feed`) or make API category-agnostic (return mock for any known feed/series category). Otherwise `fetch /api/live/blowjob` 404s while `/live/blowjob` renders.
2. **D1 vs static drift** — decide source of truth: either (a) seed all 12 `SERIES_DATA` into D1 via `generate-series-local.ts` loop, or (b) move UI to read D1. Current hybrid (static UI + 2-row D1 with different slug scheme `private-lessons` vs `series_s1`) means edits diverge.
3. **Series detail video swap** — `series-detail-client.tsx` line 75 uses `src={series.videoUrl}` always; free episode click should swap `src` to `activeEpisode.videoUrl` or to stitched `output/prototype/e1-30s.mp4` for E1 demo.
4. **Poster per-episode thumbs** — `localEpisodePosterUrl()` currently returns series cover for all 5 eps; per-ep `ffmpeg -ss 1.2` extraction will create `public/series-posters/{slug}-e{1..5}.jpg` distinct thumbs (doc in `posters.ts`).
5. **Prototype vs library** — E1 is 6×5s 30s (31.08s); library spec is 60s continuous (Wan) or 5-ep × 60s (600K params). Keep E1 as realism gate, do not re-render prototype for feed scaling until H3 loras path is resolved (safetensors 148M not accepted by CDN media upload — needs LoRA registry or API-side `loras` path, documented `generation-log.md §12`).

---

## 5. Files Inventoried (Evidence)

- `apps/web/app/(app)/series/page.tsx`, `series-client.tsx`, `[id]/page.tsx`, `[id]/series-detail-client.tsx`
- `apps/web/src/components/series/data.ts`, `SeriesGrid.tsx`, `SeriesModal.tsx`
- `apps/web/src/db/schema/series.ts`, `veilwick.ts`, `schema/index.ts`, `db/index.ts`
- `apps/web/src/lib/posters.ts`, `poster-styles.ts`, `wavespeed.ts` (H3 constants, `MMH3_LORA_PATH`, `getWavespeedLoras()`)
- `apps/web/app/(app)/live/live-client.tsx`, `[category]/page.tsx`, `feed/page.tsx`
- `apps/web/app/api/live/[category]/route.ts`, `app/(app)/feed/feed-client.tsx`, `feed/page.tsx`
- `apps/web/app/prototype-scenes/client.tsx`, `page.tsx`, `prototype-scenes.html` (root)
- `apps/web/public/series-posters/*.jpg` (18), `apps/web/public/storyboard/*.jpg` (14), `apps/web/public/prototype/*.mp4` (12)
- `public/storyboard/*` (13), `public/prototype/*`, `output/prototype/*.mp4` (14 including raw), `output/series/private-lessons/` (empty)
- `docs/generation-log.md` (42K, §1–17), `docs/character-consistency.md`, `docs/realism-compare.md`, `docs/e2-prompts.md`, `scripts/generate-series-local.ts`

No `.git` repo at `/Users/parab/Documents/Personal/veilwick` (no git history to cross-check poster fix commits; `jj` not installed).

---

## 6. Reproduce Checks (one-liners)

```bash
# E1 stitch
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration,avg_frame_rate -of default=noprint_wrappers=1 output/prototype/e1-30s.mp4
# → width=720 height=1280 duration=31.083333 avg_frame_rate=8928/373

# All 6 scaled segments
for f in output/prototype/e1-s*-5s.mp4; do ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of csv "$f"; done
# → 720,1280,5.166667 ×6

# Posters
for f in apps/web/public/series-posters/*.jpg; do ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv "$f"; done
# → 720,1280 ×18

# D1 seeded series
sqlite3 .open-next/server-functions/default/apps/web/.wrangler/state/d1/miniflare-D1DatabaseObject/12f1b0db4d23cb5d0079953baae760b38d2d55c554253b92d9539ed5c2dfe5f7.sqlite "SELECT slug,title FROM series; SELECT series_id,num,locked FROM episodes ORDER BY series_id,num;"

# Generation log
wc -l docs/generation-log.md && head -n 20 docs/generation-log.md
```
