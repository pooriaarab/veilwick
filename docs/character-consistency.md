# VeilWick Character Consistency — MMH3 + Wan NSFW Pipeline

> E1 prototype: `pick-your-new-stepsister` — 6 scenes × 5s = 30s episode, 720×1280 9:16 source stills, H3 768p 9:16 output scaled to 720×1280. All prompts non-explicit clothed, local only (`wrangler dev --local`, Wavespeed-only feed, no Vast fallback).

## 1. Strategy

**Single reference per series** — `public/storyboard/pick-your-new-stepsister-e1-first.jpg` reused across 6 scenes as `firstFrame` anchor. Per-scene `lastFrame` chains to next scene's `firstFrame` for H3 stitch. Extra `last.jpg` / `poster.jpg` variants provide mid/epilogue anchors without new identity.

| Layer | Artifact | Where |
|---|---|---|
| Reference anchor | `pick-your-new-stepsister-e1-first.jpg` (S1 first+last, S2 first) | `apps/web/app/prototype-scenes/client.tsx:68-69` |
| Continuity stills | `pick-your-new-stepsister-e1-last.jpg` (S2 last → S3–S5 first), `poster.jpg` (S5 last → S6 first+last) | `client.tsx:90,110,131,152-153,173` |
| Seg last-frames | `seg0-last.jpg`, `seg1-last.jpg`, `seg2-last.jpg` — segment outputs for FLF extension | `public/storyboard/` |
| MMH3 face/body lock | `MysticXXX_MMH3-V4.safetensors` Civitai 2856467/3266628, `loras: [{path, scale:1}]` | `apps/web/src/lib/wavespeed.ts:215-235` |
| Wan NSFW library LoRAs | `1333923` (POV Blowjob, v2021242), `1428098` (Cowgirl, v1700002) — library only, not feed | `wavespeed.ts:46-60` |
| Prompt discipline | `synthetic adult woman 18+ clothed` verbatim + `CREAM knit / linen robe` tokens repeated; negative suppresses `nude, cartoon, plastic skin` | `client.tsx:13-17`, `docs/prompts.md §5b, §6d` |

Per `docs/prompts.md §6d`: one portrait per series + DreamBooth LoRA + repeated outfit/hair tokens = strongest lock. Wan NSFW LoRAs kept for later nightly library batch (`wan2.4-14B` 720×1280 60s) — feed stays H3 clothed-only.

## 2. Verification (2026-09-01)

### Stills — 720×1280

```
file public/storyboard/pick-your-new-stepsister-e1-*.jpg → 720x1280 JPEG
sips -g pixelWidth/Height → 720 / 1280
ffprobe stream → width=720 height=1280 codec=mjpeg
```

| File | `file` | sips/ffprobe | Size |
|---|---|---|---|
| `pick-your-new-stepsister-e1-first.jpg` | `JPEG 720x1280 baseline` | 720×1280 | 50K |
| `pick-your-new-stepsister-e1-last.jpg` | `JPEG 720x1280 baseline` | 720×1280 | 50K |
| `pick-your-new-stepsister-e1-poster.jpg` | `JFIF 720x1280 baseline` | 720×1280 | 179K |
| `seg0-last.jpg` | `JPEG 720x1280` | — | 55K |
| `seg1-last.jpg` | `JPEG 720x1280` | — | 40K |
| `seg2-last.jpg` | `JPEG 720x1280` | — | 48K |

All 6 stills pass 720×1280. `file` ≡ `sips` ≡ `ffprobe`.

### LoRA — MMH3

| Check | Result |
|---|---|
| `WAVESPEED_LORA_PATH` in `.dev.vars` | `/tmp/MysticXXX_MMH3-V4.safetensors` |
| `ls -lh /tmp/MysticXXX_MMH3-V4.safetensors` | `148M` (exists, non-empty) |
| `file /tmp/...` | `data` (safetensors) |
| `MMH3_LORA_MODEL_ID / VERSION_ID` | `2856467 / 3266628` `MysticXXX_MMH3-V4.safetensors` (`wavespeed.ts:215-218`) |
| Download path if missing | `bun run scripts/download-mmh3-lora.ts` — reads `CIVITAI_API_KEY` from `~/.secrets/civitai.env` or `.dev.vars`, fetches `https://civitai.com/api/v1/model-versions/3266628` then `https://civitai.com/api/download/models/3266628` → `/tmp/MysticXXX_MMH3-V4.safetensors` |

Scale in code: `scale: 1` (`getWavespeedLoras()` line 235, `generateH3ImageToVideoLora` line 366). For realism test. Prompt docs default is `0.8` (`docs/prompts.md §1` line 17).

### Movement continuity — H3 stitch

Model: `wavespeed-ai/minimax-h3/image-to-video-lora` (`$0.25 / 5s, 768p 9:16`, `H3_DEFAULT_DURATION=5`, `H3_DEFAULT_RESOLUTION="768p"`).

```
S1 lastFrame (= first.jpg) → S2 firstFrame (= first.jpg)   // S1→S2 seam = identical still
S2 lastFrame (= last.jpg)  → S3 firstFrame (= last.jpg)
S3 lastFrame (= last.jpg)  → S4 firstFrame (= last.jpg)
S4 lastFrame (= last.jpg)  → S5 firstFrame (= last.jpg)
S5 lastFrame (= poster.jpg) → S6 firstFrame (= poster.jpg) // pull-wide afterglow
```

Params per clip: `{ image: S(n).firstFrame, last_image: S(n).lastFrame, loras, prompt, duration:5, resolution:"768p" }` (`wavespeed.ts:275-284`, `client.tsx:315`). Output `768p 9:16` → `ffmpeg scale=720:1280:flags=lanczos` to `720×1280` for storage / R2 `videos/series/{slug}/ep{num}.mp4`.

Feed pipeline: `generateH3ImageToVideoLora` via `POST /api/v3/wavespeed-ai/minimax-h3/image-to-video-lora` with `last_image` optional stitch end (line 399).

## 3. Face drift risk & fix

**Risk:** 6 sequential H3 generations without identity anchor drift on eyes/hair/skin after 15–20s (S3–S4), especially with hairstyle or outfit token variation. H3 attention decays across `image→last_image` interpolation; reusing only first.jpg as S1 anchor leaves S3–S6 under-constrained.

**Mitigations already in place:**
- Reused `first.jpg` + `last.jpg` + `poster.jpg` narrow palette (3 stills, not 6 unique faces) — less variance.
- MMH3 LoRA `MysticXXX_MMH3-V4.safetensors` on every clip via `WAVESPEED_LORA_PATH`.
- Verbatim prompt tokens (`cream knit co-ord`, `linen robe`, `synthetic adult woman 18+ clothed`).
- 768p → 720 clamp keeps aspect 9:16 consistent; no resolution drift.

**Recommended fix — LoRA weight 0.8:**
- Current `scale: 1` is realism-test max. Prompt spec (§1, §5b, §6d) prescribes `0.7–0.8`. Lowering to `0.8` reduces plastic-skin overfit while keeping identity lock; raise overlap or add second reference if drift persists.
- Action: `getWavespeedLoras()` → `scale: 0.8` for production (keep `1` behind `REALISM_TEST=true` flag if needed). Alternative: pass explicit `loras: [{path: WAVESPEED_LORA_PATH, scale: 0.8}]` per call.
- Validation: generate E1 S1 + S3, compare face embeddings; if L2 > threshold → bump `0.05` or add `reference-to-video-lora` ($0.30) for mid-episode re-anchor.

## 4. Local-only guardrails

- All prompts Heat 2–3 clothed, `negative: low quality, blurry, deformed, cartoon, ... nude, naked, topless, explicit, genitalia` (`client.tsx:13-14`, `prompts.md §5b`).
- Feed is Wavespeed-only (`WAVESPEED_API_KEY` only, Vast removed — `wavespeed.ts:202-209`), `wrangler dev --local` only, no `--remote`.
- Stills are local JPEGs at `public/storyboard/` — no `picsum.photos`, no remote fetch in prototype.

## 5. Re-verify commands

```bash
file public/storyboard/pick-your-new-stepsister-e1-*.jpg  # → 720x1280
sips -g pixelWidth -g pixelHeight public/storyboard/pick-your-new-stepsister-e1-first.jpg
ls -lh /tmp/MysticXXX_MMH3-V4.safetensors && file /tmp/MysticXXX_MMH3-V4.safetensors
# missing → bun run scripts/download-mmh3-lora.ts  (needs CIVITAI_API_KEY in .dev.vars)
grep -n "MMH3\|WAVESPEED_LORA_PATH\|scale" apps/web/src/lib/wavespeed.ts
grep -n "firstFrame\|lastFrame" apps/web/app/prototype-scenes/client.tsx
bun run typecheck && bun run build
```
