# VeilWick E2 Prompts — Your New Stepsister E2: The Next Morning (30s, 6×5s)

> Continuation of **Your New Stepsister E1 — Unpacking** (E1: Beats 1,3,5,6,7,8+12). E2 escalates via **adhesion → temptation → leap** (Beats 4→5→6) with candy.ai doorway/bedroom soft-daylight camera grammar. Same synthetic adult woman 18+ clothed, same house, same 720×1280 stills. Heat 2–3, fully clothed, fade-to-black before any explicit act. Local only, no generation yet — prompts and stitch plan only.

- **Episode:** `your-new-stepsister-e2` — *The Next Morning*
- **Logline:** The morning after E1. Boxes still in the hall, but the polite distance is gone. Six beats move from shared threshold to chosen proximity, interrupted once — then a decision.
- **Tagline:** "You stayed. Now what do we do with the hallway?"
- **Duration:** 30s nominal (6×5s) → 31.08s actual with H3 padding (5.166667s per clip, same as E1 §11–12)
- **Resolution:** 720×1280 9:16 vertical — request 768p native (768×1344 raw) then `ffmpeg scale=720:1280:flags=lanczos` (generation-log §11)
- **Model:** `wavespeed-ai/minimax-h3/image-to-video-lora` — `duration:5` `resolution:768p` `image`+`last_image` stitch + optional `loras: [{path, scale:0.8}]` (E1 fallback was prompt-only; see cost §4)
- **Heat:** 2–3 clothed wellness/fashion, non-explicit (see `docs/prompts.md` §2, §4, §5b). Every prompt includes `synthetic adult woman 18+ clothed` + embedded negative tail.
- **Stills (reused, verified 720×1280):** `public/storyboard/pick-your-new-stepsister-e1-first.jpg` (50 KB), `pick-your-new-stepsister-e1-last.jpg` (51 KB), `pick-your-new-stepsister-e1-poster.jpg` (179 KB) — `sips -g pixelWidth/pixelHeight → 720×1280` (character-consistency.md §2)
- **Source beats:** `docs/prompts.md` §2a 12-beat spine (E1 used 1,3,5,6,7,8+12 → E2 picks up Beat 4 adhesion next), §2b escalators, §2c 5-phase, §2d arc 5 (fated-household proximity, consensual chosen-family framing), §4 dialogue templates; `docs/candy-ai-analysis.md` §4 camera pattern; `docs/oss-prompts-mmh3-wan.md` §1 H3 structure; `apps/web/app/prototype-scenes/client.tsx` SCENES continuity; `docs/generation-log.md` §17 cost/stitch baseline.

---

## 1. 12-beat placement — E1 → E2 arc

| Episode | S1 | S2 | S3 | S4 | S5 | S6 |
|---|---|---|---|---|---|---|
| **E1 Unpacking** (shipped, 30s) | B1 Adoration/setup | B3 No-way/tension | B5 Temptation | B6 Leap | B7 Retreat | B8 Fall + B12 HEA |
| **E2 The Next Morning** (this doc, not yet generated) | **B4 Adhesion** (forced proximity, next morning) + B2 callback | **B3 tension revisited** (higher stakes) | **B5 Temptation intensified** (reciprocal + consent) | **B6 Leap escalated** (closer/longer than E1 S4) | **B9 Crisis** (interruption) | **B10 Plan + B11 Execution + B12 HEA afterglow** (choose to stay, tagline callback, E3 cliffhanger) |

E2's core escalation is **adhesion (S1) → temptation (S3, consent) → leap (S4)** per task. S2 re-primes tension at higher stakes (they now know yesterday's look), S5 tests the leap (Beat 9 crisis), S6 resolves into plan/HEA. One variable shifts per scene (E1 rule: location OR light OR distance, not all three — `docs/prompts.md` §2c).

---

## 2. Camera grammar — candy.ai doorway/bedroom soft daylight (sanitized)

Borrowed from `docs/candy-ai-analysis.md` §4.3 + §7 and `docs/oss-prompts-mmh3-wan.md` §1. Four angled presets, applied per beat:

| Preset | When | Candy.ai evidence | VeilWick prompt fragment |
|---|---|---|---|
| **POV handheld medium-close, eye-level, micro-shake** | Tension / doorway / first proximity | Dormitory ep, Staircase ep — eye-height micro-shake posters | `over-shoulder POV eye level, subtle handheld with breathing micro head bob` |
| **Static close-up, shallow DOF, direct gaze** | Line delivery / consent / power-play | Yes Professor desk — direct gaze, static tripod | `static camera locked tripod, high-angle close-up 35mm face + shoulders, warm catchlight, direct gaze` |
| **Static medium doorway/wide, warm practical** | Geography / exposition / crisis rule reveal | Mom hallway, Harlow gym doorway | `waist-height medium shot eye level, doorway frame, warm practical, bright daylight` |
| **Slow push-in afterglow, golden practical, soft gaze** | Afterglow / resolution | Same-room light shift in all series | `slow bob gentle push-in with breathing, golden-hour soft light, pull wide soft focus` |

**Lighting for E2:** All six scenes use **doorway / bedroom soft daylight** — `soft natural daylight bright window bounce` (S1,S5) → `diffused window golden` (S2–S4,S6) with `teal shadows lifted cinematic_warm LUT` (intensity lifts across S3→S4→S6). No overhead fluorescent or tungsten shift — keeps E2 as morning continuation vs E1's evening afterglow. Shallow DOF f/2.0 35mm throughout (realism expansion `docs/prompts.md` §5c).

---

## 3. E2 scene table — 6 scenes, H3 image+last_image stitch (copy/paste prompts)

> Each row = one 5s H3 clip. **FirstFrame/LastFrame** = local 720×1280 JPEGs uploaded to Wavespeed CDN first (`wavespeed upload … --json` → URL), then passed as `image` + `last_image`. Stitch: `S(n).lastFrame → S(n+1).firstFrame` (generation-log §10–12). Prompts are non-explicit clothed, include `vertical 9:16 720x1280, 5s duration, {static|slow bob}` + `photorealistic 8k shallow DOF f/2.0 35mm` + embedded negative + `compilation: your-new-stepsister-e2`. Same character tokens verbatim as E1 for identity lock.

| Scene | Beat | Camera | Prompt | Duration | Tags | firstFrame/lastFrame |
|---|---|---|---|---|---|---|
| **S1 — Morning After / Adhesion**<br>`0:00–0:05` | **B4 Adhesion** + B2 callback · Phase 1 Exposition reprise (same hallway, morning) · escalator: proximity tightens to shared frame | Static medium doorway/wide, eye-level, doorway frame warm practical | `cinematic, synthetic adult woman 18+ clothed in cream knit co-ord and soft linen robe open over loungewear, morning hallway with moving boxes pushed aside and doorway threshold, gentle eye contact across threshold next-morning soft smile "you stayed", warm domestic palette tactile linen weave, vertical 9:16 720x1280, 5s duration, static camera locked tripod no movement, photorealistic 8k, shallow depth of field f/2.0 35mm lens, soft natural daylight bright window bounce, teal shadows lifted cinematic_warm LUT, natural skin texture detailed pores, volumetric dust motes, shallow DOF bokeh, suggestive but clothed wellness Heat 2 — negative: low quality, blurry, deformed, cartoon, illustration, duplicate, watermark, nude, naked, topless, explicit, genitalia — compilation: your-new-stepsister-e2 \| tags: adhesion, morning-after, clothed, eye-level, soft-natural-daylight \| duration: 5s \| camera: static \| res: 720x1280 9:16` | 5s (5.166667 actual) | `adhesion, morning-after, doorway, clothed, Heat 2, eye-level, soft-natural-daylight` | `poster.jpg` → `first.jpg`<br>`/storyboard/pick-your-new-stepsister-e1-poster.jpg` → `/storyboard/pick-your-new-stepsister-e1-first.jpg` |
| **S2 — Closer Tension**<br>`0:05–0:10` | **B3 No-way / Tension revisited** (stakes up) · Phase 2 Tease (dialogue + micro-hold) · escalator: proximity shared frame, laundry buffer thinner | POV handheld medium-close, eye-level, micro-shake, soft bokeh foreground | `cinematic, synthetic adult woman 18+ clothed in ecru knit co-ord holding folded laundry closer to chest hallway doorway, hesitant glance that holds a second longer, soft sheets bedroom background, breathy stillness one breath between beats "You're closer than I expected.", vertical 9:16 720x1280, 5s duration, slow bob subtle handheld with breathing micro head bob, photorealistic 8k, shallow depth of field f/2.0, soft warm light diffused window golden, over-shoulder POV eye level, clothed wellness Heat 2 — negative: low quality, blurry, deformed, cartoon, illustration, duplicate, watermark, nude, naked, topless, explicit — compilation: your-new-stepsister-e2 \| tags: tension-escalated, folded-laundry, clothed \| duration: 5s \| camera: slow bob \| res: 720x1280 9:16` | 5s | `tension-escalated, folded-laundry, doorway, clothed, Heat 2, handheld-breathing` | `first.jpg` → `last.jpg`<br>`/storyboard/pick-your-new-stepsister-e1-first.jpg` → `/storyboard/pick-your-new-stepsister-e1-last.jpg` |
| **S3 — Temptation Reciprocal**<br>`0:10–0:15` | **B5 Temptation intensified** (reciprocal touch, consent check) · Phase 2→3 Tease→Escalation · escalator: touch-point → vulnerability disclosure, power begins swap | Static close-up → slow bob, high-angle 35mm face+shoulders, direct gaze | `cinematic, synthetic adult woman 18+ clothed in sage linen shirt and wide ecru trousers, bedroom with plant and folded linens closer frame, soft hand-on-shoulder then hair-tuck gesture gentle eye contact "Is this okay? Tell me if you want to pause. Only if you want to — say yes.", intentional touch without nudity reciprocal softness, vertical 9:16 720x1280, 5s duration, slow bob subtle handheld with breathing, photorealistic 8k, shallow depth f/2.0 35mm, soft warm light diffused window golden cinematic_warm LUT teal shadows lifted, tactile fabric weave detail, clothed sensual tension Heat 3 — negative: low quality, blurry, deformed, cartoon, illustration, duplicate, watermark, nude, naked, topless, explicit, genitalia — compilation: your-new-stepsister-e2 \| tags: temptation, reciprocal-touch, consent-beat, clothed \| duration: 5s \| camera: slow bob \| res: 720x1280 9:16` | 5s | `temptation, reciprocal-touch, consent-beat, clothed, Heat 3, eye-contact, warm-LUT` | `last.jpg` → `last.jpg`<br>`/storyboard/pick-your-new-stepsister-e1-last.jpg` → same |
| **S4 — Leap (closer than E1)**<br>`0:15–0:20` | **B6 Leap — Choose risk escalated** · Phase 3 Escalation peak (music drops, light warms, breath sync) · escalator: embrace-threshold but clothed, mutual choice | Static close-up, true first-person POV eye-level, viewer hands soft foreground no HUD | `cinematic, synthetic adult woman 18+ clothed in soft cotton shirt and linen trousers, leaning in closer than before across kitchen counter hallway breath sync whisper "Breathe with me — slow. Don't look away. I want to remember how you look right now.", true first-person POV eye level viewer hands soft foreground no HUD, vertical 9:16 720x1280, 5s duration, static camera locked tripod no movement, photorealistic 8k, shallow depth of field f/2.0 35mm, soft warm light golden glow diffused, tactile fabric weave, clothed Heat 3 — negative: low quality, blurry, deformed, cartoon, illustration, duplicate, watermark, nude, naked, topless, explicit, genitalia — compilation: your-new-stepsister-e2 \| tags: leap, proximity-escalated, breath-sync, clothed \| duration: 5s \| camera: static \| res: 720x1280 9:16` | 5s | `leap, lean-in-escalated, breath-sync, clothed, Heat 3, first-person-POV` | `last.jpg` → `last.jpg`<br>`/storyboard/pick-your-new-stepsister-e1-last.jpg` → same |
| **S5 — Crisis / Interruption**<br>`0:20–0:25` | **B9 Crisis** (external threat — knock/phone/off-screen voice) · Phase 4 Climax proxy interrupted · escalator: step back, power resets | Static medium doorway/wide, eye-level over-shoulder, window flare | `cinematic, synthetic adult woman 18+ clothed in cream knit loungewear, looking away toward window light shift phone buzz on counter door knock off-screen, pull-back solo beat window flare single breath pause "We go at your pace. Nod if you're with me.", waist-height camera medium shot eye level, vertical 9:16 720x1280, 5s duration, static camera locked tripod no movement, photorealistic 8k, shallow depth soft bokeh, bright daylight clean natural light soft shadows, clothed wellness Heat 2 — negative: low quality, blurry, deformed, cartoon, illustration, duplicate, watermark, nude, naked, topless, explicit — compilation: your-new-stepsister-e2 \| tags: crisis, interruption, pull-back, clothed \| duration: 5s \| camera: static \| res: 720x1280 9:16` | 5s | `crisis, interruption, pull-back, consent-beat, clothed, Heat 2, window-flare` | `last.jpg` → `poster.jpg`<br>`/storyboard/pick-your-new-stepsister-e1-last.jpg` → `/storyboard/pick-your-new-stepsister-e1-poster.jpg` |
| **S6 — Plan & Afterglow**<br>`0:25–0:30` | **B10 Plan + B11 Execution + B12 HEA** (she chooses to stay, E3 cliffhanger) · Phase 5 Afterglow/Tag — pull wide soft focus poster frame | Slow push-in afterglow, high-angle close-up + pull wide, golden practical | `cinematic, synthetic adult woman 18+ clothed in soft knit co-ord, soft sheets bedroom embrace laugh eye contact warm LUT cuddle "Next time, I'll be the one who's nervous. You're still here. Good.", golden-hour soft light pull wide soft focus tagline moment "Some house rules are meant to be broken — again tomorrow.", vertical 9:16 720x1280, 5s duration, slow bob gentle push-in with breathing, photorealistic 8k, shallow depth f/2.0 35mm, soft warm light golden hour boosted golds cinematic_warm.cube, shallow DOF bokeh, poster frame extract at 1.2s, clothed wellness Heat 2 — negative: low quality, blurry, deformed, cartoon, illustration, duplicate, watermark, nude, naked, topless, explicit — compilation: your-new-stepsister-e2 \| tags: afterglow, plan, tagline, clothed, golden-hour \| duration: 5s \| camera: slow bob \| res: 720x1280 9:16` | 5s | `afterglow, plan, execution, tagline, clothed, Heat 2, golden-hour` | `poster.jpg` → `poster.jpg`<br>`/storyboard/pick-your-new-stepsister-e1-poster.jpg` → same |

> Verify per row: `grep "compilation: your-new-stepsister-e2"` → 6, `grep "photorealistic 8k"` → 6, every prompt has `vertical 9:16`, `720x1280`, `5s duration`, `static camera` or `slow bob`, `clothed`, negative tail with `nude`, no explicit anatomy/act verb outside negative (generation-log §5 guard).

---

## 4. Generation plan — H3 image+last_image stitch for 30s (do not run yet)

**Status: PREPARED. Do not generate video until user approves. Local only, non-explicit.**

### 4a. Pre-flight (one-time, before any S1–S6)

```bash
cd /Users/parab/Documents/Personal/veilwick
ls -lh /tmp/MysticXXX_MMH3-V4.safetensors || bun scripts/download-mmh3-lora.ts
# Verify 3 stills are 720×1280 (character-consistency.md §2)
sips -g pixelWidth -g pixelHeight public/storyboard/pick-your-new-stepsister-e1-first.jpg
sips -g pixelWidth -g pixelHeight public/storyboard/pick-your-new-stepsister-e1-last.jpg
sips -g pixelWidth -g pixelHeight public/storyboard/pick-your-new-stepsister-e1-poster.jpg
# LoRA realism note: E1 inference fell back to prompt-only (generation-log §5/§13:
# H3 loras upload rejected — fetch failed, prediction failed ff572335…/1d6e43cd…).
# For E2, try loras once at scale 0.8 via --input-file, fall back to prompt-only on failure.
```

### 4b. Upload stills → CDN URLs (H3 `image`/`last_image` must be URLs, never local paths)

```bash
wavespeed upload public/storyboard/pick-your-new-stepsister-e1-first.jpg --json
# → {"url":"https://d2h7xmz5gqybh9.cloudfront.net/media/.../images/...first...jpg"}  save as FIRST_URL
wavespeed upload public/storyboard/pick-your-new-stepsister-e1-last.jpg --json
# → LAST_URL
wavespeed upload public/storyboard/pick-your-new-stepsister-e1-poster.jpg --json
# → POSTER_URL
# E1 run used identical flow: §10a produced 3 URLs, then S2–S6 reused them verbatim.
```

### 4c. Per-scene generation (template — adapt `prompt` + `image`/`last_image` per row §3)

```bash
# Example S1 (poster → first), no-loras path (proven in E1 §10b):
cat > /tmp/e2-s1_input.json <<'JSON'
{"prompt":"<S1 prompt from §3>","image":"$POSTER_URL","last_image":"$FIRST_URL","duration":5,"resolution":"768p"}
JSON
wavespeed run wavespeed-ai/minimax-h3/image-to-video-lora \
  --input-file /tmp/e2-s1_input.json \
  --download output/prototype/e2-s1-5s-raw.mp4 --json | tee /tmp/e2-s1_log.json

# Optional loras test (try once, fall back on Prediction failed):
# cat > /tmp/e2-s1-lora_input.json <<'JSON'
# {"prompt":"<S1 prompt>","image":"$POSTER_URL","last_image":"$FIRST_URL","duration":5,"resolution":"768p","loras":[{"path":"/tmp/MysticXXX_MMH3-V4.safetensors","scale":0.8}]}
# JSON

# S2–S6 — repeat with mappings from §3 table:
# S2: image=$FIRST_URL  last_image=$LAST_URL   → e2-s2-5s-raw.mp4
# S3: image=$LAST_URL   last_image=$LAST_URL   → e2-s3-5s-raw.mp4
# S4: image=$LAST_URL   last_image=$LAST_URL   → e2-s4-5s-raw.mp4
# S5: image=$LAST_URL   last_image=$POSTER_URL → e2-s5-5s-raw.mp4
# S6: image=$POSTER_URL last_image=$POSTER_URL → e2-s6-5s-raw.mp4
```

### 4d. Scale each raw 768p → 720×1280 (lanczos, keep raw + scaled)

```bash
for n in 1 2 3 4 5 6; do
  ffmpeg -y -i output/prototype/e2-s${n}-5s-raw.mp4 \
    -vf "scale=720:1280:flags=lanczos" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k \
    output/prototype/e2-s${n}-5s.mp4
  ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of default=noprint_wrappers=1 \
    output/prototype/e2-s${n}-5s.mp4
  # expect width=720 height=1280 duration=5.166667 (same H3 pad as E1 §11)
  cp output/prototype/e2-s${n}-5s.mp4 apps/web/public/prototype/e2-s${n}-5s.mp4 2>/dev/null || true
done
```

### 4e. Stitch 30s episode (concat demuxer, re-encode for timestamp continuity)

```bash
cat > /tmp/e2_concat.txt <<TXT
file '/Users/parab/Documents/Personal/veilwick/output/prototype/e2-s1-5s.mp4'
file '/Users/parab/Documents/Personal/veilwick/output/prototype/e2-s2-5s.mp4'
file '/Users/parab/Documents/Personal/veilwick/output/prototype/e2-s3-5s.mp4'
file '/Users/parab/Documents/Personal/veilwick/output/prototype/e2-s4-5s.mp4'
file '/Users/parab/Documents/Personal/veilwick/output/prototype/e2-s5-5s.mp4'
file '/Users/parab/Documents/Personal/veilwick/output/prototype/e2-s6-5s.mp4'
TXT
ffmpeg -y -f concat -safe 0 -i /tmp/e2_concat.txt \
  -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k output/prototype/e2-30s.mp4
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration,codec_name,avg_frame_rate -of default=noprint_wrappers=1 output/prototype/e2-30s.mp4
# expect 720×1280 ~31.08s (31.13 format), 744 frames @24fps, 7–8M (E1 was 7.4M §12)
mkdir -p apps/web/public/prototype .open-next/assets/prototype public/prototype
cp output/prototype/e2-30s.mp4 apps/web/public/prototype/e2-30s.mp4
cp output/prototype/e2-30s.mp4 .open-next/assets/prototype/e2-30s.mp4
cp output/prototype/e2-30s.mp4 public/prototype/e2-30s.mp4
```

---

## 5. Cost & time budget (documented up front, same as E1 §12/§17)

| Item | Per clip | ×6 | Total |
|---|---|---|---|
| **Model** | `wavespeed-ai/minimax-h3/image-to-video-lora` (768p 9:16, `wavespeed.ts:H3_IMAGE_TO_VIDEO_LORA_PRICE`) | — | — |
| **Price** | $0.25 / 5s clip | 6 clips | **$1.50** |
| **Wall time per clip** | 73–127s measured (E1 avg 88s, S5 slow 126s; generation-log §12 table) | sequential 6× | **~8–9 min** inference sum (515s E1 S1–S6) → **~9 min** with scale+stitch |
| **Parallel alternative** | concurrent 5–6 → | ~130s bottleneck (S5) | ~2.5 min wall, same $1.50 |
| **Encode/scale/stitch** | ffmpeg lanczos scale ~1.5s/clip + concat re-encode ~3s | — | ~12s local, $0 |
| **Resolution actual** | request 768p → raw 768×1344 5.166667s (H3 pad 0.1667s) → scaled 720×1280 5.166667 | ×6 | stitched 31.08s (31.13 format), 744 frames @24fps |
| **Balance delta** | — | — | $1.50 deducted (E1: $14.85→$13.35 for 6×; E2 same tier) |

No `--remote`, no Vast, no R2 upload until preview; inference billing only (failures not charged, see generation-log §13).

---

## 6. Local & safety guardrails

- **Non-explicit, clothed, synthetic 18+ only.** Every prompt repeats `synthetic adult woman 18+ clothed` + fabric-specific loungewear (cream knit co-ord, ecru co-ord, sage linen shirt, soft cotton shirt, cream loungewear, soft knit co-ord — same palette as E1 `client.tsx:68–177`). Heat 2–3 only (fade-to-black, gaze/breath/light carry tension). Negative tail bans `nude, naked, topless, explicit, genitalia`. No new wardrobe introduced; escalation is proximity/lighting/camera (prompts.md §2e rule).
- **Consent beats required:** S3 ships `Is this okay? Tell me if you want to pause. Only if you want to — say yes.` (prompts.md §4), S4 `Breathe with me — slow`, S5 `We go at your pace. Nod if you're with me.` — one check-in per escalation before S4 leap.
- **Local-only guard (E1 §10–13):** `wavespeed upload` + `wavespeed run` with local `WAVESPEED_API_KEY` (`~/.config/wavespeed`), no `wrangler --remote`, no Vast, outputs to `output/prototype/e2-*` + preview mirrors only. CDN URLs are ephemeral `d2h7xmz…cloudfront.net`.
- **Character lock:** Reuse 3 stills only (no new face), verbatim outfit/hair/setting tokens per `docs/character-consistency.md` §3 + `prompts.md` §6d, optional LoRA `MysticXXX_MMH3-V4.safetensors` at `scale 0.8` when H3 loras path works; otherwise prompt-only (E1 fallback).
- **No generation performed in this doc.** Prompts are text-only preparation. Run §4 only after user says "generate E2" / "approve E2".

---

## 7. Verification checklist (before committing or generating)

```bash
# prompts sanity (no generation needed)
grep -c "photorealistic 8k" docs/e2-prompts.md          # → 6
grep -c "compilation: your-new-stepsister-e2" docs/e2-prompts.md  # → 6
grep -c "vertical 9:16" docs/e2-prompts.md              # → 6
grep -c "5s duration" docs/e2-prompts.md                # → 6
grep "clothed" docs/e2-prompts.md | wc -l               # → ≥12 (outfit + tags + negative)
! grep -i "nude\|naked.*explicit" docs/e2-prompts.md | grep -v "negative:" && echo "clean"  # only in negative
# stills 720×1280
sips -g pixelWidth -g pixelHeight public/storyboard/pick-your-new-stepsister-e1-first.jpg | grep 720
sips -g pixelWidth -g pixelHeight public/storyboard/pick-your-new-stepsister-e1-last.jpg | grep 720

# after generation (when approved):
# for f in output/prototype/e2-s*-5s.mp4; do ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of csv "$f"; done  # → 720,1280,5.166667 ×6
# ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of default=noprint_wrappers=1 output/prototype/e2-30s.mp4  # → 720×1280 ~31.08
# wavespeed balance  # → -$1.50 delta
```

---

## 8. Sources map

| File | What was used |
|---|---|
| `docs/prompts.md` | §1 base template, §2a 12-beat spine + §2b escalators + §2c 5-phase + §2d arc 5 + §2e episode map, §4 dialogue templates, §5b H3 library + §5c realism tail |
| `docs/generation-log.md` §17 | Full E1 S1–S6 cost/time/stitch baseline (31.08s, 720×1280, $1.50, 9m43s, `image+last_image` stitch) — E2 budget mirrors it |
| `apps/web/app/prototype-scenes/client.tsx` | SCENES[0–5] continuity: same first/last stills, same tags/cameras, same 720×1280 5s Heat 2–3 non-explicit discipline — reused verbatim mapping for S(n).last→S(n+1).first |
| `docs/candy-ai-analysis.md` | §4.1/4.2 tension vs afterglow + §7 four-angle preset (POV handheld, static close-up, doorway wide, push-in afterglow) + doorway/bedroom soft daylight lighting with warm practical + shallow DOF |
| `docs/oss-prompts-mmh3-wan.md` | §1 H3 structure (reference說明 → core创意 → 画面过程 → 贯穿要求 → 限制), camera vocab graded axes, candid imperfection rule, audio tail `non_diegetic_music: N/A`, frame math `81@16fps=5.06s` |

---

*Prepared 2026-09-01, local file only. No wavespeed call, no upload, no video generated. Awaiting user approval to execute §4.*
