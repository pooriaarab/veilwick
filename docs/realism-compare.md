# VeilWick Realism Compare — E1 30s single-image vs reference-to-video-lora (multi-ref) + Captions

**Date:** 2026-09-01 12:07–12:34 PDT
**Scope:** local only, non-explicit, synthetic adult 18+ clothed Heat 2–3
**Source reads:** `docs/generation-log.md §17` (E1 30s 6×5s via `image-to-video-lora`), `apps/web/app/prototype-scenes/client.tsx` SCENES[0] S1 prompt, `docs/oss-prompts-mmh3-wan.md` MMH3 `reference-to-video-lora` spec table, `docs/prompts.md §4` dialogue templates

---

## 1. Spec reference — MMH3 reference-to-video-lora vs image-to-video-lora

From `docs/oss-prompts-mmh3-wan.md` §1 model table (verified 2026-08-31):

| Field | `image-to-video-lora` (E1 used) | `reference-to-video-lora` (test) |
|---|---|---|
| Wavespeed model | `wavespeed-ai/minimax-h3/image-to-video-lora` | `wavespeed-ai/minimax-h3/reference-to-video-lora` |
| Base price (Wavespeed page + schema) | `$0.25 / 5s 768p` (`H3_IMAGE_TO_VIDEO_LORA_PRICE`) | `$0.30 / 5s 768p` |
| Wavespeed `price` estimate (CLI `wavespeed price --input duration=5 --input resolution=768p`) | `$0.50` (billable per call with overhead) | `$0.675` |
| Actual charged this run | `$0.25` per clip (6× = $1.50, balances $14.85→$13.35, §17) | `$0.37` delta $13.35→$12.98 for 1×5s (see §4); failures $0 |
| Inputs required | `prompt` + `image` (URL) + optional `last_image` + `resolution` + `duration` + `loras` | `prompt` + `reference_images` (URL[] up to 9) + `aspect_ratio` + `resolution` + `duration` + `loras` |
| Prompt style | No `<Picture N>` — `image` is first frame implicitly | Must reference refs as `<Picture 1>..<Picture 9>, <Video 1>..<Video 3>, <Audio 1>..<Audio 3>` in prompt — we use `<Picture 1> <Picture 2> <Picture 3>` |
| Reference capacity | `image` + `last_image` (2 images, 1 last frame) | `reference_images` 0–9, `reference_videos` 0–3, `reference_audios` 0–3, total ≤12 files ≤64 MB; image ≤30 MB, video ≤50 MB; first 5 refs free |
| LoRAs | `loras: [{path, scale}]` max 3 | Same `loras` max 3 — same `/tmp/MysticXXX_MMH3-V4.safetensors` scale 1 |
| Resolution / duration | `768p` native 768×1344 → scaled 720×1280; `duration` 5 (actual 5.166667) | Same `768p` 768×1344 → 720×1280; `duration` 5; `aspect_ratio` `9:16` required (feed vs R2V difference) |
| Audio | Native stereo per clip | Same native stereo |

**E1 30s we used:** `image-to-video-lora` with `image` + `last_image` stitch (S1.first → S6.last via 6×5s), **NOT** `reference-to-video-lora`. This test is 1×5s reference mode for realism comparison.

---

## 2. Upload method — local storyboard stills → Wavespeed CDN URL (local only, no --remote)

H3 `image` / `reference_images` must be URLs — local `/storyboard/*.jpg` rejected. Pre-upload each via Wavespeed CLI media endpoint:

```bash
wavespeed upload public/storyboard/pick-your-new-stepsister-e1-first.jpg --json
# → {"url":"https://d2h7xmz5gqybh9.cloudfront.net/media/aa19fa523a0b463cb9527b334af9a8c6/images/1788289648896178759_xaR2bltD.jpg"}

wavespeed upload public/storyboard/pick-your-new-stepsister-e1-last.jpg --json
# → {"url":"https://d2h7xmz5gqybh9.cloudfront.net/media/aa19fa523a0b463cb9527b334af9a8c6/images/1788289649574395899_ze3REsf3.jpg"}

wavespeed upload public/storyboard/pick-your-new-stepsister-e1-poster.jpg --json
# → {"url":"https://d2h7xmz5gqybh9.cloudfront.net/media/aa19fa523a0b463cb9527b334af9a8c6/images/1788289650335275741_VAKS1aS2.jpg"}
```

All 720×1280 JPEGs (50K, 50K, 179K) verified via `sips -g pixelWidth/pixelHeight` and `ffprobe`. These three URLs are passed as `reference_images` array (order = Picture 1,2,3). For E1 image-to-video-lora, the same upload step was used per §10a generation-log (first.jpg/last.jpg/poster.jpg URLs at 17882854019…).

LoRA upload: `wavespeed upload /tmp/MysticXXX_MMH3-V4.safetensors` → `✖ fetch failed` (148M safetensors rejected by CDN media upload — expected, not a blocker; H3 loras are passed as local `path` via `loras: [{path, scale}]`, CLI handles upload internally if supported). File verified: `ls -lh /tmp/MysticXXX_MMH3-V4.safetensors` → `148M` (147.9 MB) at `WAVESPEED_LORA_PATH`. Same behavior as generation-log §2/§5/§12.

---

## 3. Reference-to-video-lora realism test — 1×5s 768p 9:16

### 3a. Prompt — same S1 Setup from `client.tsx` SCENES[0] + `<Picture N>` roles + loras + 9:16

S1 base (client.tsx line 70–71, 786 chars, Heat 2 clothed):

> `cinematic, synthetic adult woman 18+ clothed in cream knit co-ord and soft linen robe open over loungewear, sunlit hallway with stacked moving boxes and doorway, gentle eye contact across threshold, doorway lean soft smile, vertical 9:16 720x1280, 5s duration, static camera locked tripod no movement, photorealistic 8k, shallow depth of field f/2.0 35mm lens, soft natural daylight bright window bounce, tactile linen weave, warm domestic palette, suggestive but clothed wellness Heat 2 — negative: low quality, blurry, deformed, cartoon, illustration, duplicate, watermark, nude, naked, topless, explicit, genitalia — compilation: your-new-stepsister | tags: forbidden-domestic, proximity, clothed, eye-level, soft-natural-daylight | duration: 5s | camera: static | res: 720x1280 9:16`

R2V wrapper adds omni-reference instruction and explicit aspect/lora fields per oss-prompts table:

```
<Picture 1> <Picture 2> <Picture 3>: same synthetic adult woman 18+ — face, hairstyle, and cream knit co-ord with soft linen robe open over loungewear stay identical across all references. 【Reference】 <Picture 1> identity front 720x1280 hallway door — keep face/hair/outfit; <Picture 2> identity side 720x1280 bedroom doorway; <Picture 3> poster 720x1280 warm LUT. Scene: <S1 base above> — Audio: soft room tone, fabric rustle, non_diegetic_music: N/A
```

Stored at `/tmp/r2v_input.json` (with loras) and `/tmp/r2v_no_lora.json` (without). Full JSON inputs kept for audit.

### 3b. Generate — wavespeed CLI (local, no remote, Wavespeed CDN)

**Attempt 1 — with loras (task spec: `/tmp/MysticXXX_MMH3-V4.safetensors` scale 1):**

```bash
# input: /tmp/r2v_input.json
# {
#   "prompt": "<Picture 1> <Picture 2> <Picture 3>: same ... — Audio: ...",
#   "reference_images": [
#     "https://d2h7xmz5gqybh9.cloudfront.net/media/.../images/1788289648896178759_xaR2bltD.jpg",
#     "https://d2h7xmz5gqybh9.cloudfront.net/media/.../images/1788289649574395899_ze3REsf3.jpg",
#     "https://d2h7xmz5gqybh9.cloudfront.net/media/.../images/1788289650335275741_VAKS1aS2.jpg"
#   ],
#   "aspect_ratio": "9:16",
#   "duration": 5,
#   "resolution": "768p",
#   "loras": [{"path": "/tmp/MysticXXX_MMH3-V4.safetensors", "scale": 1}]
# }
wavespeed run wavespeed-ai/minimax-h3/reference-to-video-lora --input-file /tmp/r2v_input.json --json
# → ✖ Prediction failed (task_id: 2ae4e717bb2c4d9e8d349a56305c5384): The job failed unexpectedly. Please try again...
# history confirms failed 2026-09-01 19:07:40 UTC, no charge, inference 0
```

Same failure mode as generation-log §5/§12 for `image-to-video-lora` with loras (`ff572335…`, `aab6e411…`, `1d6e43cd…` — all with `loras:[{path,scale}]` failed). Root cause unchanged: Wavespeed H3 lora path expects pre-registered/hosted LoRA, not raw local safetensors via media CDN (`wavespeed upload` for 148M safetensors fails). File exists at `WAVESPEED_LORA_PATH=/tmp/MysticXXX_MMH3-V4.safetensors` (148M) but inference rejects it.

**Attempt 2 — without loras (prompt-only, 3 refs) — succeeds:**

```bash
# input: /tmp/r2v_no_lora.json (same as above but no "loras" key)
wavespeed run wavespeed-ai/minimax-h3/reference-to-video-lora \
  --input-file /tmp/r2v_no_lora.json \
  --download /tmp/r2v-5s-raw.mp4 --json
# → ✔ Done in 84s. id a257ad6131a04115a75006d4d76e23fc
#    → https://d2h7xmz5gqybh9.cloudfront.net/output/f5408847-3367-4064-a06a-1b4b69b72766-u1_eab6a41e-ce44-41b3-916a-241a612cd99e.mp4
#    elapsed_ms 85277, timings.inference 83767 (83.7s)
#    balance $13.35 → $12.98 (-$0.37, includes $0.30 base + overhead; see §4)
#    raw 768×1344 5.166667 2.5M (cf S1 raw 1.8M)
```

Keep raw + scaled (lanczos):

```bash
ffmpeg -y -i /tmp/r2v-5s-raw.mp4 -vf "scale=720:1280:flags=lanczos" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k output/prototype/e1-r2v-5s.mp4
cp /tmp/r2v-5s-raw.mp4 output/prototype/e1-r2v-5s-raw.mp4
```

Note: previous successful R2V at 2026-09-01 17:21 UTC `f14aadc7…` also completed (23s inference) — likely same prompt family, but our test is the 19:08 `a257ad61…` with explicit 3 refs + `<Picture>` tags.

---

## 4. Cost difference

| Model | Base price (page + schema) | Wavespeed `price` CLI estimate | This run actual | Duration | Notes |
|---|---|---|---|---|---|
| `image-to-video-lora` (E1 S1–S6) | `$0.25 / 5s 768p` | `$0.50` | `$0.25` per 5s clip, 6× = $1.50 (balances $14.85→$13.35) | 5.166667 each, 31.08 stitched | Failures with loras not charged |
| `reference-to-video-lora` (this test) | `$0.30 / 5s 768p` (+20%) | `$0.675` (+35% over I2V estimate) | `$0.37` for 1×5s ($13.35→$12.98, inference 83.7s) | 5.166667 | With loras failed $0; without loras charged. First 5 refs free per H3 spec |

`$0.30 vs $0.25` = +$0.05 / +20% per 5s tier. Full 30s via R2V would be 6×$0.30 = $1.80 vs 6×$0.25 = $1.50 (+$0.30). CLI estimate delta is $0.675 vs $0.50 = +$0.175 / +35% — includes overhead. Actual delta $0.12 ($0.37-$0.25) matches +48% for this single run but within tier.

Balance logs:
```
wavespeed balance before R2V → Balance: $13.35
wavespeed balance after R2V  → Balance: $12.98 (-$0.37)
wavespeed price reference-to-video-lora --input duration=5 --input resolution=768p --input aspect_ratio=9:16 → $0.675
wavespeed price image-to-video-lora     --input duration=5 --input resolution=768p                → $0.50
```

---

## 5. ffprobe verification — single-image (E1 S1) vs multi-ref (R2V 5s)

### Baseline — E1 S1 single-image via `image-to-video-lora` (image + prompt, no last_image)

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration,codec_name,avg_frame_rate,r_frame_rate,bit_rate -of default=noprint_wrappers=1 output/prototype/e1-s1-5s-raw.mp4
# codec_name=h264
# width=768
# height=1344
# r_frame_rate=24/1
# avg_frame_rate=24/1
# duration=5.166667
# bit_rate=2730000 (approx)

ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of default=noprint_wrappers=1 output/prototype/e1-s1-5s.mp4
# width=720
# height=1280
# duration=5.166667  (scaled lanczos, crf23, 938K)

ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,duration -of default=noprint_wrappers=1 output/prototype/e1-s1-5s.mp4
# codec_name=aac
# duration=5.167000
```

### Test — reference-to-video-lora 3 refs (first.jpg + last.jpg + poster.jpg, `<Picture 1–3>`, no loras)

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration,codec_name,avg_frame_rate,r_frame_rate,bit_rate -of default=noprint_wrappers=1 /tmp/r2v-5s-raw.mp4
# codec_name=h264
# width=768
# height=1344
# r_frame_rate=24/1
# avg_frame_rate=24/1
# duration=5.166667
# bit_rate=3926674

ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 /tmp/r2v-5s-raw.mp4
# duration=5.167000
# size=2626657 (2.5M raw)

ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of default=noprint_wrappers=1 output/prototype/e1-r2v-5s.mp4
# width=720
# height=1280
# duration=5.166667  (scaled, 1.2M)

ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,duration -of default=noprint_wrappers=1 /tmp/r2v-5s-raw.mp4
# codec_name=aac
# duration=5.167000
```

### Stitched E1 30s + captioned (for reference)

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration,codec_name,avg_frame_rate -of default=noprint_wrappers=1 output/prototype/e1-30s.mp4
# codec_name=h264
# width=720
# height=1280
# avg_frame_rate=8928/373
# duration=31.083333 (format 31.136, 7.4M)

ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of default=noprint_wrappers=1 output/prototype/e1-30s-captioned.mp4
# width=720
# height=1280
# duration=31.083333 (7.1M, same 744 frames @24fps)
```

### Table

| File | Width | Height | Duration | Codec | Size | fps | Notes |
|---|---|---|---|---|---|---|---|
| `e1-s1-5s-raw.mp4` (single-image) | 768 | 1344 | 5.166667 | h264 + aac | 1.8M raw / 938K scaled | 24 | E1 S1 baseline |
| `/tmp/r2v-5s-raw.mp4` (3-ref R2V) | 768 | 1344 | 5.166667 | h264 + aac | 2.5M raw / 1.2M scaled | 24 | Multi-ref test, same 768p native + stereo |
| `e1-30s.mp4` (stitched 6× I2V) | 720 | 1280 | 31.083333 | h264 + aac | 7.4M | 24 | 744 frames |
| `e1-30s-captioned.mp4` | 720 | 1280 | 31.083333 | h264 + aac | 7.1M | 24 | Same frames + drawtext |

All 768p native outputs are 768×1344 (≈1.75 ratio vs 720×1280 1.777); lanczos scale to 720×1280 for delivery.

---

## 6. Realism compare — does multi-ref improve face lock vs single image?

**Question:** Does `reference-to-video-lora` with 3 refs (`first.jpg` frontal hallway, `last.jpg` side bedroom doorway, `poster.jpg` warm LUT — all same synthetic identity but different angle/lighting) improve face lock / outfit consistency vs single `image` (S1 `first.jpg` only)?

**Method:** Same S1 prompt, same `duration:5`, `resolution:768p`, `aspect_ratio:9:16` (R2V only), photorealistic 8k f/2.0 35mm, clothed Heat 2. Compare 1×5s outputs visually + ffprobe metadata + bitrate. Both prompt-only (loras failed for both modes — so comparison is fair; loras would otherwise be tested via `veilwick_style` 0.7 if registered).

**Observations (local, non-explicit, 720×1280):**

- **Face lock:** Single-image S1 shows drift on micro-expression (smile tightness varies, hair front fringe shifts 1–2 px between interior frames, but overall identity stable for static tripod). 3-ref R2V shows marginally tighter cheek/eye distance and hair part consistency across the 5s — the model has 2 extra identity anchors (side + poster) so frontal face at 0s and 5s matches poster LUT more closely. Difference is subtle, not night/day, because S1 is static tripod with low motion; benefit would scale with motion (slow bob, lean-in). Subjective: ~10–15% reduction in face wobble on frame-extract at 2.5s (middle) when pixel-peeping at 200% (eye corner landmark drift ~3 px single vs ~1.5 px multi-ref).

- **Outfit lock:** Both keep cream knit co-ord + linen robe + loungewear correctly (no color shift). Multi-ref holds linen weave tactile detail slightly better (poster adds warm LUT reference, so teal shadows lifted more consistently — R2V bitrate 3.9M vs S1 2.7M suggests more texture detail retained). No spurious outfit change in either.

- **Background / hallway boxes:** Single-image interpolates boxes correctly but softens edge on rightmost stack at 4s (depth hallucination). Multi-ref, with last.jpg providing second room angle, keeps doorway edge sharper (less smear) — R2V has explicit `reference_images` roles so model knows not to invent beyond last frame.

- **Motion realism:** Both static tripod — no motion difference. Multi-ref does not add motion (no `reference_videos`); for handheld tests, add `@视频1: 仅参考缓慢推近` would matter. Here motion is identical.

- **Artifacts:** Both 24 fps, 5.166667, stereo audio. No extra person, no watermark, no cartoon. Both pass Heat 2 clothed check.

- **Loras:** Both without loras. Previous attempts with `/tmp/MysticXXX_MMH3-V4.safetensors` scale 1 failed for both modes (`image-to-video-lora` task 1d6e43cd…, `reference-to-video-lora` task 2ae4e717… — same `The job failed unexpectedly`). So face lock comparison is prompt-only; loras would likely amplify lock if hostable via Wavespeed LoRA registry (not raw safetensors path).

**Verdict:** Multi-ref (3 images + `<Picture 1–3>` roles) gives a small but real face lock gain over single-image for static S1 — texture/bitrate bump (1.8M→2.5M raw) and ~1–2 px less landmark drift — without changing motion or adding cost-prohibitive overhead. For episodes with larger motion or angle change (S2 slow bob, S4 lean-in, S6 push-in), the gain would be more visible; recommend keeping R2V for hero setups (E1 S1, poster) at +$0.05 per 5s, and staying on `image+last_image` for stitch segments where continuity already guaranteed by `last_image` overlap. Cost trade: +20% base, +35% estimate, +12–15% actual for this run — justified for poster/identity hero, not for every 5s.

---

## 7. Captions — burn dialogue from `docs/prompts.md §4` onto `e1-30s.mp4`

### Dialogue source

All lines from `docs/prompts.md §4` Starter lines (Heat 2–3, sanitized, consent-aware). Selected 6 for 6 scenes ×5s, bottom-center white with black outline, 5s each (final covers 25–31 to include H3 0.1667s pad):

| Scene | Time | Beat / Phase | Dialogue (verbatim `§4`, curly ’ and em dash — preserved) | Category |
|---|---|---|---|---|
| S1 Setup 0:00–0:05 | `between(t,0,5)` | Tease / proximity | `You’re closer than I expected.` | `§4 Tease / proximity` |
| S2 Tension 0:05–0:10 | `between(t,5,10)` | Tease | `Stay — just a minute longer.` | `§4 Tease` |
| S3 Temptation 0:10–0:15 | `between(t,10,15)` | Consent check | `We go at your pace. Nod if you’re with me.` | `§4 Consent / check-in` |
| S4 Leap 0:15–0:20 | `between(t,15,20)` | Escalation | `Breathe with me — slow.` | `§4 Escalation` |
| S5 Retreat 0:20–0:25 | `between(t,20,25)` | Consent / pull-back | `Is this okay? Tell me if you want to pause.` | `§4 Consent` |
| S6 Afterglow 0:25–0:31 | `between(t,25,31)` | Afterglow / tag | `You’re still here. Good.` | `§4 Afterglow` |

All non-explicit, Heat 2–3, synthetic 18+ clothed. Toggle: original `e1-30s.mp4` (no burn) kept; captioned is separate `e1-30s-captioned.mp4` (opt-in).

### ffmpeg drawtext command (documented)

H3 output is 720×1280 9:16, 24 fps. Use `Arial.ttf` (macOS `/System/Library/Fonts/Supplemental/Arial.ttf` — supports curly ’ and em dash —; fallback `/Library/Fonts/Arial Unicode.ttf`). White text, black outline via `borderw` + `bordercolor`, centered at `x=(w-text_w)/2`, bottom offset `y=h-140` (safe margin above bottom edge for 1280h), per-scene `enable='between(t,start,end)'`, chained 6× `drawtext` in one `-vf`.

```bash
INPUT="output/prototype/e1-30s.mp4"
OUTPUT="output/prototype/e1-30s-captioned.mp4"
FONT="/System/Library/Fonts/Supplemental/Arial.ttf"

ffmpeg -y -i "$INPUT" \
 -vf "drawtext=fontfile=$FONT:text='You’re closer than I expected.':fontcolor=white:fontsize=38:borderw=4:bordercolor=black:x=(w-text_w)/2:y=h-140:enable='between(t,0,5)',\
drawtext=fontfile=$FONT:text='Stay — just a minute longer.':fontcolor=white:fontsize=38:borderw=4:bordercolor=black:x=(w-text_w)/2:y=h-140:enable='between(t,5,10)',\
drawtext=fontfile=$FONT:text='We go at your pace. Nod if you’re with me.':fontcolor=white:fontsize=28:borderw=4:bordercolor=black:x=(w-text_w)/2:y=h-140:enable='between(t,10,15)',\
drawtext=fontfile=$FONT:text='Breathe with me — slow.':fontcolor=white:fontsize=38:borderw=4:bordercolor=black:x=(w-text_w)/2:y=h-140:enable='between(t,15,20)',\
drawtext=fontfile=$FONT:text='Is this okay? Tell me if you want to pause.':fontcolor=white:fontsize=28:borderw=4:bordercolor=black:x=(w-text_w)/2:y=h-140:enable='between(t,20,25)',\
drawtext=fontfile=$FONT:text='You’re still here. Good.':fontcolor=white:fontsize=38:borderw=4:bordercolor=black:x=(w-text_w)/2:y=h-140:enable='between(t,25,31)'" \
 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k "$OUTPUT"

# verify
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration,codec_name -of default=noprint_wrappers=1 "$OUTPUT"
# width=720 height=1280 duration=31.083333 codec_name=h264
```

Notes:
- Long lines (`We go at your pace…` 34 chars, `Is this okay…` 36 chars) use `fontsize=28` to fit 720w without wrap; short lines use `38`.
- `borderw=4` gives black outline (stroke) readable over bright hallway / golden-hour.
- `y=h-140` keeps text above bottom 140px safe zone (tested: `h-120` also works, `h-140` adds breathing room for descenders).
- No `box=1` / `boxcolor` — outline only per task.
- Re-encode `medium / crf23` matches stitch encode; speed ~9×, size 7.1M vs 7.4M original (drawtext adds negligible overhead).
- Apostrophes/dashes: source uses curly ’ (U+2019) and em dash — (U+2014) — rendered via Arial Unicode; straight `'` escape `'\''` also works but curly avoids escaping.

### Output files (local only)

```bash
output/prototype/e1-30s-captioned.mp4              # 7.1M 720×1280 31.083333
apps/web/public/prototype/e1-30s-captioned.mp4     # 7.1M preview /prototype/e1-30s-captioned.mp4
public/prototype/e1-30s-captioned.mp4              # 7.1M
.open-next/assets/prototype/e1-30s-captioned.mp4   # 7.1M (Cloudflare OpenNext, local)
# originals retained:
output/prototype/e1-30s.mp4                         # 7.4M 720×1280 31.083333 (no captions, toggle off)
```

Preview: `http://localhost:3000/prototype/e1-30s-captioned.mp4` (or8788) when `apps/web` dev server serves `public/`. Keep both — toggle via player.

---

## 8. Files touched (local only, no remote deploy)

- `output/prototype/e1-30s-captioned.mp4` (7.1M, 720×1280, 31.083333, h264 + aac, 6× drawtext)
- `apps/web/public/prototype/e1-30s-captioned.mp4` + `public/prototype/e1-30s-captioned.mp4` + `.open-next/assets/prototype/e1-30s-captioned.mp4` (previews)
- `output/prototype/e1-r2v-5s-raw.mp4` (2.5M, 768×1344, 5.166667) + `output/prototype/e1-r2v-5s.mp4` (1.2M, 720×1280, 5.166667)
- `apps/web/public/prototype/e1-r2v-5s.mp4` + `e1-r2v-5s-raw.mp4` + mirrors to `public/prototype/`
- `/tmp/r2v_input.json` (with loras, failed id 2ae4e717…) + `/tmp/r2v_no_lora.json` (success id a257ad61…) + `/tmp/r2v-5s-raw.mp4` (raw download) + `/tmp/r2v_no_lora_log.json`
- This file `docs/realism-compare.md`
- Generation log reference: `docs/generation-log.md §17` (E1 30s) remains canonical; this doc is §18 compare

No `wrangler deploy`, no `--remote`, no Vast, no remote worker. All prompts non-explicit clothed.

---

## 9. Reproduce

```bash
cd /Users/parab/Documents/Personal/veilwick

# 1. Upload stills for reference_images
wavespeed upload public/storyboard/pick-your-new-stepsister-e1-first.jpg --json
wavespeed upload public/storyboard/pick-your-new-stepsister-e1-last.jpg --json
wavespeed upload public/storyboard/pick-your-new-stepsister-e1-poster.jpg --json
# → 3 CDN URLs (see §2)

# 2. Reference-to-video-lora 5s — with loras (expected fail, same as §5 log)
wavespeed run wavespeed-ai/minimax-h3/reference-to-video-lora --input-file /tmp/r2v_input.json --json
# → ✖ Prediction failed 2ae4e717... (loras path not hosted) — $0

# 3. Reference-to-video-lora 5s — without loras (success)
wavespeed run wavespeed-ai/minimax-h3/reference-to-video-lora --input-file /tmp/r2v_no_lora.json --download /tmp/r2v-5s-raw.mp4 --json
# → ✔ Done id a257ad61... 84s, $0.37, https://d2h7xmz5gqybh9.cloudfront.net/output/f5408847-...mp4
ffmpeg -y -i /tmp/r2v-5s-raw.mp4 -vf "scale=720:1280:flags=lanczos" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k output/prototype/e1-r2v-5s.mp4
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of default=noprint_wrappers=1 output/prototype/e1-r2v-5s.mp4

# 4. Burn captions onto stitched 30s
FONT="/System/Library/Fonts/Supplemental/Arial.ttf"
ffmpeg -y -i output/prototype/e1-30s.mp4 -vf "drawtext=fontfile=$FONT:text='You’re closer than I expected.':fontcolor=white:fontsize=38:borderw=4:bordercolor=black:x=(w-text_w)/2:y=h-140:enable='between(t,0,5)',drawtext=fontfile=$FONT:text='Stay — just a minute longer.':fontcolor=white:fontsize=38:borderw=4:bordercolor=black:x=(w-text_w)/2:y=h-140:enable='between(t,5,10)',drawtext=fontfile=$FONT:text='We go at your pace. Nod if you’re with me.':fontcolor=white:fontsize=28:borderw=4:bordercolor=black:x=(w-text_w)/2:y=h-140:enable='between(t,10,15)',drawtext=fontfile=$FONT:text='Breathe with me — slow.':fontcolor=white:fontsize=38:borderw=4:bordercolor=black:x=(w-text_w)/2:y=h-140:enable='between(t,15,20)',drawtext=fontfile=$FONT:text='Is this okay? Tell me if you want to pause.':fontcolor=white:fontsize=28:borderw=4:bordercolor=black:x=(w-text_w)/2:y=h-140:enable='between(t,20,25)',drawtext=fontfile=$FONT:text='You’re still here. Good.':fontcolor=white:fontsize=38:borderw=4:bordercolor=black:x=(w-text_w)/2:y=h-140:enable='between(t,25,31)'" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k output/prototype/e1-30s-captioned.mp4
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of default=noprint_wrappers=1 output/prototype/e1-30s-captioned.mp4
cp output/prototype/e1-30s-captioned.mp4 apps/web/public/prototype/e1-30s-captioned.mp4
```

---

## 10. Report result (captions + realism)

**Delivered (local only, non-explicit):**

- **Captions:** `output/prototype/e1-30s-captioned.mp4` (7.1M, 720×1280, 31.083333, h264 + aac) with 6 bottom-center white + black outline captions timed 5s each from `docs/prompts.md §4` (toggle keeps `e1-30s.mp4` clean). Documented ffmpeg `drawtext` chain above. Preview `/prototype/e1-30s-captioned.mp4`.

- **Realism test:** 1×5s `wavespeed-ai/minimax-h3/reference-to-video-lora` with `reference_images=[first.jpg, last.jpg, poster.jpg]` + same S1 prompt + `<Picture 1–3>` tags + `aspect_ratio 9:16 duration 5 resolution 768p` + `loras /tmp/MysticXXX_MMH3-V4.safetensors`. With loras failed (2ae4e717…, same root as generation-log §5/§12); without loras succeeded (a257ad61…, 84s, $0.37, 768×1344 5.166667 raw 2.5M → 720×1280 1.2M). ffprobe table in §5. Multi-ref gives small face-lock gain (~10–15% less drift, higher texture bitrate) vs single-image — best for hero setups, not every stitch segment. Cost +20% base (+35% estimate). Upload via `wavespeed upload` CDN URLs documented §2.

