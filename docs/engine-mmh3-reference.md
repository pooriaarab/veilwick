# VeilWick Engine — MMH3 Image Reference LoRA (VeilWick Heat 4)

> **Scope:** Codified image-reference LoRA engine for **VeilWick Heat 4** — explicit, first/last frame controlled, local-only.
> 6 scenes × 5s = 30s (S1 Setup → S6 Afterglow, beat spine B1→B3→B5→B6→B7→B8+12). Heat 2–3 prompts live in `docs/storyboard-heat2-4.md` §2–§3 (clothed, non-explicit). **Heat 4 is placeholder only** — you fill via **Anubis Mini 8B** locally; this doc never stores explicit prompt text.
> Engine: Wavespeed H3 `reference-to-video-lora` (`$0.30 / 5s 768p`) + Wan 2.7/2.1 `text-to-image` for bookends. Resolution `720×1280 9:16` vertical — request `768p 768×1344` then `ffmpeg scale=720:1280:flags=lanczos`.

---

## 0. Invariants

| Field | Value |
|---|---|
| **Episode** | `your-new-stepsister-e1` — *Your New Stepsister E1 — Unpacking* (30s nominal → ~31.08s actual with H3 5.166667s padding) |
| **Resolution** | `720×1280 9:16 vertical` — request `768p 768×1344` (H3 native), deliver `720×1280` via lanczos (`generation-log.md` §11) |
| **Models** | `alibaba/wan-2.7/text-to-image` (or `wavespeed-ai/wan-2.1/text-to-image`) for Stills · `wavespeed-ai/minimax-h3/reference-to-video-lora` for Clips |
| **LoRA** | `/tmp/MysticXXX_MMH3-V4.safetensors` — Civitai `2856467` v `3266628`, `148 MB`, scale `1` (`WAVESPEED_LORA_PATH`, `wavespeed.ts:MMH3_*`) |
| **Stitch rule** | `S(n).lastFrame → S(n+1).firstFrame` via H3 `reference_images` continuity — same rule as `generation-log.md` §10 (`image+last_image`) but now via `reference-to-video-lora` multi-image reference pack |
| **Heat** | Heat 4 = explicit placeholder — stored only in gitignored `docs/storyboard-heat4.local.md` / `~/.secrets/storyboard-heat4.md` (see `storyboard-heat2-4.md` §4a) |
| **Cost** | `$0.30 / 5s 768p` per H3 R2V-LoRA clip (`wavespeed.ts:H3_REFERENCE_TO_VIDEO_LORA_PRICE`); T2I stills billed at Wan T2I rate (separate, ~$0.02–0.03 each) |
| **Time** | ~80s wall per 5s H3 R2V clip (range 73–127s measured `generation-log.md` §12); T2I stills ~10–20s each |
| **Auth** | `WAVESPEED_API_KEY` only (`wavespeed.ts:getWavespeedApiKey`); Anubis via `ANUBIS_BASE_URL=http://localhost:8080/v1` (tunnel) |
| **Local-only guard** | `wrangler dev --local`, never `wrangler deploy --remote`; Heat 4 never leaves the machine (`*.local.md` gitignored) |

Source beats: `docs/prompts.md` §2a/§2b/§2c/§5b/§5c, `docs/storyboard-heat2-4.md`, `docs/oss-prompts-mmh3-wan.md` §1 (MMH3 reference-to-video-lora row), `docs/generation-log.md`, `apps/web/src/lib/wavespeed.ts`, `docs/vast-anubis-rental.md`.

---

## 1. Pipeline — 5 Steps

```
[1] Anubis Mini 8B  ──t2i prompts──▶  [2] Wan T2I  ──first.jpg/last.jpg──▶  [3] Anubis Mini 8B  ──i2v prompts──▶  [4] H3 R2V-LoRA  ──6×5s 720×1280──▶  [5] ffmpeg concat ──30s
       12 prompts              720*1280 12 stills               6 prompts              reference_images=first,last,poster
       720×1280 seed            + LoRA                                    + LoRA       $0.30/5s · ~80s each
```

Verified stills for stitch validation (pre-existing, `storyboard-heat2-4.md` §0): `public/storyboard/pick-your-new-stepsister-e1-first.jpg` (50 KB 720×1280), `pick-your-new-stepsister-e1-last.jpg` (50 KB), `pick-your-new-stepsister-e1-poster.jpg` (179 KB). The Heat 4 engine generates **new per-scene first/last stills** via Wan T2I (step 2) — those verified stills remain as reference for scale checks (`sips -g pixelWidth/pixelHeight → 720×1280`).

---

## 2. Step 1 — Anubis Mini 8B generates Heat 4 T2I prompts (12 prompts)

**What:** 12 text-to-image prompts (2 per scene × 6 scenes) — one for each **first frame** and **last frame** still at `720×1280`. These drive Wan T2I to produce photorealistic bookend images before any video.

**Why 12:** Each 5s H3 clip is bounded by a first/last still for deterministic continuity. `storyboard-heat2-4.md` §4a already defines per-scene `firstFrame → lastFrame` tokens; Step 1 makes them explicit and image-anchored.

**Heat 4 placeholders stay empty here — you fill via Anubis.** Keep `synthetic adult woman 18+`, `vertical 9:16 720×1280`, camera/lighting tokens, and do not store explicit output in this repo.

**Anubis host:** `TheDrummer/Anubis-Mini-8B-GGUF` `Anubis-Mini-8B-Q4_K_M.gguf` (~4.9 GB, fits single 24 GB 4090 Dell box) or same GGUF on Vast `49584552` `ssh6.vast.ai:24552`. Setup per `docs/storyboard-heat2-4.md` §4b and `docs/vast-anubis-rental.md` §2–§4.

**Tunnel (either host):**

```bash
# Vast tunnel (70B host can also run Mini 8B)
ssh -p 24552 root@ssh6.vast.ai -L 8080:localhost:8080
curl -s http://localhost:8080/health | jq .

# Dell local — no tunnel needed, same port
# huggingface-cli download TheDrummer/Anubis-Mini-8B-GGUF Anubis-Mini-8B-Q4_K_M.gguf --local-dir /workspace
# llama-server --model /workspace/Anubis-Mini-8B-Q4_K_M.gguf --alias Anubis-Mini-8B-Q4_K_M --host 0.0.0.0 --port 8080 --ctx-size 8192 --n-gpu-layers 99

# .dev.vars (local only, never commit)
# ANUBIS_BASE_URL=http://localhost:8080/v1
# ANUBIS_MODEL=Anubis-Mini-8B-Q4_K_M
# ANUBIS_API_KEY=dummy
```

**Generate T2I prompts (12, one per still):**

```bash
# Template — run per still S{1..6} first/last (12 total)
# Save to gitignored file; paste into Heat 4 placeholders only on your machine

curl -s http://localhost:8080/v1/chat/completions -H "Content-Type: application/json" -d '{
  "model": "Anubis-Mini-8B-Q4_K_M",
  "messages": [
    {"role": "system", "content": "You are a VeilWick prompt assistant. Output ONLY a single Wan text-to-image prompt string for a photorealistic 720*1280 still (vertical 9:16, explicit Heat 4). Keep tokens: synthetic adult woman 18+, vertical 9:16, photorealistic 8k, shallow DOF f/2.0 35mm, soft natural daylight, teal shadows lifted cinematic_warm LUT, natural skin texture detailed pores, tactile fabric weave. Do not add commentary or markdown. One prompt per response."},
    {"role": "user", "content": "Write ONE Wan text-to-image prompt for VeilWick Heat 4 scene S1 Setup first frame (B1/P1): start from Heat 3 S1 baseline \"cream knit co-ord and soft linen robe open over loungewear, sunlit hallway with stacked moving boxes and doorway, doorway lean\" and escalate to explicit Heat 4 for a single 720*1280 still. Keep vertical 9:16 720*1280, static camera locked tripod no movement, bright daylight. Output one line starting with \"cinematic, synthetic adult woman 18+\". Reference Civitai Wan example style: photorealistic 8k, shallow DOF, 35mm, cinematic_warm LUT. Keep 720*1280."}
  ],
  "temperature": 0.85,
  "max_tokens": 512
}' | jq -r '.choices[0].message.content' | tee /tmp/anubis-heat4-t2i-s1-first.txt

# Repeat for s1-last, s2-first, s2-last, ... s6-first, s6-last (12 prompts)
# Collect — never commit:
cat /tmp/anubis-heat4-t2i-s*.txt > docs/storyboard-heat4.local.md
# also: cat /tmp/anubis-heat4-t2i-s*.txt > /tmp/heat4-t2i-prompts.txt  # audit
```

**Prompt discipline (from `oss-prompts-mmh3-wan.md` §1 Wan rows):**

- One still = one sentence set: subject + setting + lighting + lens + style, present tense, vertical. Keep `synthetic adult woman 18+`.
- Wan T2I negative is appended separately: `low quality, blurry, deformed, watermark, cartoon, illustration, anime, 3d render, cgi, plastic skin, duplicate, jpeg artifacts` — extended per Wan canonical line (§6). For explicit Heat 4 stills, append your safety tail after Anubis output locally; do not commit.
- Keep `720*1280` token verbatim for Wan T2I `size` param (not `720x1280`).
- One variable shifts per scene vs S1 (location OR light OR distance), same rule as `storyboard-heat2-4.md` §0 spine.

---

## 3. Step 2 — Wan T2I generates first.jpg / last.jpg per scene (Wavespeed, LoRA, 720*1280)

**What:** Run Wan text-to-image for each of the 12 prompts → 12 stills `720×1280` JPEG/PNG. These are the **frame-accurate bookends** that Step 4 will reference.

**Models:** `alibaba/wan-2.7/text-to-image` (preferred, newer) or `wavespeed-ai/wan-2.1/text-to-image` (fallback). Both via Wavespeed CLI (`wavespeed run ...`). Verify which slug is live with `wavespeed models` if 2.7 is not yet listed — fall back to 2.1 without changing prompt shape.

**LoRA:** `/tmp/MysticXXX_MMH3-V4.safetensors` (`2856467:3266628`) scale `1` — same file as H3 feed (`wavespeed.ts:MMH3_DEFAULT_LORA_PATH`). Passed as `--lora` for Wan T2I.

**CLI — per still (repeat 12×, one per first/last):**

```bash
# Pre-flight
ls -lh /tmp/MysticXXX_MMH3-V4.safetensors || bun scripts/download-mmh3-lora.ts
# sips -g pixelWidth -g pixelHeight public/storyboard/pick-your-new-stepsister-e1-first.jpg  # reference: 720×1280

# Wan 2.7 T2I — one still
# Note: Wan T2I uses --size "720*1280" (asterisk, not x) per oss-prompts-mmh3-wan.md:30

wavespeed run alibaba/wan-2.7/text-to-image \
  --prompt "$(cat /tmp/anubis-heat4-t2i-s1-first.txt)" \
  --lora /tmp/MysticXXX_MMH3-V4.safetensors \
  --size "720*1280" \
  --download output/heat4/s1-first.jpg \
  --json | tee /tmp/heat4-t2i-s1-first.json

# Fallback if 2.7 not live — same flags, different slug:
# wavespeed run wavespeed-ai/wan-2.1/text-to-image \
#   --prompt "$(cat /tmp/anubis-heat4-t2i-s1-first.txt)" \
#   --lora /tmp/MysticXXX_MMH3-V4.safetensors \
#   --size "720*1280" \
#   --download output/heat4/s1-first.jpg

# v0.2.3 long-flag vs -i variance (generation-log.md §5.1): if --prompt/--lora/--size is rejected,
# use the -i key=value form that was canonical for H3:
# wavespeed run alibaba/wan-2.7/text-to-image \
#   -i prompt="$(cat /tmp/anubis-heat4-t2i-s1-first.txt)" \
#   -i lora=/tmp/MysticXXX_MMH3-V4.safetensors \
#   -i size="720*1280" \
#   --download output/heat4/s1-first.jpg

# Repeat for s1-last, s2-first, s2-last, s3-first, s3-last, s4-first, s4-last, s5-first, s5-last, s6-first, s6-last
# Outputs:
#   output/heat4/s1-first.jpg  output/heat4/s1-last.jpg
#   output/heat4/s2-first.jpg  output/heat4/s2-last.jpg
#   output/heat4/s3-first.jpg  output/heat4/s3-last.jpg
#   output/heat4/s4-first.jpg  output/heat4/s4-last.jpg
#   output/heat4/s5-first.jpg  output/heat4/s5-last.jpg
#   output/heat4/s6-first.jpg  output/heat4/s6-last.jpg
# Also: /tmp/heat4-t2i-*.json (request ids)

# Verify each still
for f in output/heat4/s*-*.jpg; do echo "== $f"; sips -g pixelWidth -g pixelHeight "$f"; ls -lh "$f"; done
# expect 720×1280 each, ~100–400 KB JPEG

# Upload for H3 step (Wavespeed needs URLs for reference_images — generation-log.md §10a)
for f in output/heat4/s*-*.jpg; do wavespeed upload "$f" --json | jq -r .url; done | tee /tmp/heat4-stills-urls.txt
# Also upload poster reference if used as identity anchor:
# wavespeed upload public/storyboard/pick-your-new-stepsister-e1-poster.jpg --json | jq -r .url | tee -a /tmp/heat4-stills-urls.txt
```

**Stills naming → scene mapping (stitch-continuity):**

| Scene | first still | last still | Stitch continuity |
|---|---|---|---|
| S1 Setup | `s1-first.jpg` | `s1-last.jpg` | S1.last → S2.first |
| S2 Tension | `s2-first.jpg` | `s2-last.jpg` | S2.last → S3.first |
| S3 Temptation | `s3-first.jpg` | `s3-last.jpg` | S3.last → S4.first |
| S4 Leap | `s4-first.jpg` | `s4-last.jpg` | S4.last → S5.first |
| S5 Retreat | `s5-first.jpg` | `s5-last.jpg` | S5.last → S6.first |
| S6 Afterglow | `s6-first.jpg` | `s6-last.jpg` | terminal |

For strongest continuity, enforce `S(n)-last prompt ≈ S(n+1)-first prompt` in tone/light/wardrobe — only one variable shifts (same rule as storyboard §0). If stills drift, re-run the downstream still with Anubis + Wan before proceeding to video.

---

## 4. Step 3 — Anubis generates I2V prompts (image-grounded, Civitai-aware)

**What:** For each scene, Anubis writes one **H3 reference-to-video** prompt conditioned on the two stills you just generated (first.jpg + last.jpg) plus Civitai example style. 6 prompts total (one per 5s clip).

**Inputs to Anubis per scene:**

- The two still URLs or local paths (describe what is visible — do not re-upload to Anubis, just describe).
- The Wan T2I prompt that produced each still (for context).
- Civitai reference: Wan/H3 examples from `oss-prompts-mmh3-wan.md` §1 — especially the **MMH3 reference-to-video-lora row** (角色/场景 roles, `慢推近 + 微手持呼吸`, `non_diegetic_music: N/A`) and **market-stall / bedroom lifestyle** still templates.
- Scene spine: B1/P1 Setup, B3/P2 Tension, B5 Tease→Escalation, B6/P3 Leap, B7/P4 Retreat, B8+12/P5 Afterglow (`storyboard-heat2-4.md` §1).

**Prompt discipline for H3 I2V (oss-prompts-mmh3-wan.md:27 — MMH3 reference-to-video-lora):**

- OSS H3 structure: `[参考素材说明]` role line per image → `[核心创意]` = duration+ratio+subject+place+event+style+lens → `[画面过程]` = `Shot 1 [0-5s]` with 1 motion token → `[贯穿要求]` (consistency) → `[限制]` (safety).
- **Do not repeat what is already visible in the stills** — describe only motion + what stays still (Viddo I2V tip, `oss-prompts-mmh3-wan.md` gap 4). Lock identity in 贯穿要求 via verbatim tokens (`同人同装`), not by re-describing still contents.
- One motion token per Shot: `slow push-in`, `handheld with breathing micro head bob`, `dolly forward`, `orbit right 30°` etc. Keep `slow bob` only when the storyboard says `slow bob`; otherwise `static locked tripod`.
- Audio tail mandatory: `Audio: {ambient + sfx}, non_diegetic_music: N/A` unless music intended (`oss-prompts-mmh3-wan.md` gap 3).
- Negative appended in 限制: `low quality, blurry, deformed, cartoon, illustration, duplicate, watermark, extra fingers, poorly drawn hands` + your Heat 4 safety tail locally.
- Keep ≤7000 chars, ≤12 files / 64 MB body (H3 spec) — 3 images per scene (first, last, poster) is well within.

**Generate I2V prompts (6 scenes):**

```bash
# Example S3 Temptation — image-grounded expansion
curl -s http://localhost:8080/v1/chat/completions -H "Content-Type: application/json" -d '{
  "model": "Anubis-Mini-8B-Q4_K_M",
  "messages": [
    {"role": "system", "content": "You are a VeilWick prompt assistant for MMH3 reference-to-video-lora. Output ONLY a single H3 prompt string (5s, 9:16, 768p) with structure: 参考素材说明 + 核心创意 + 画面过程 [0-5s] + 贯穿要求 + 限制. Describe motion only, not still contents. Keep tokens: synthetic adult woman 18+, vertical 9:16 768p 5s, photorealistic. One prompt per response."},
    {"role": "user", "content": "Write the H3 reference-to-video prompt for VeilWick Heat 4 S3 Temptation (B5, 5s, 9:16, 768p, slow bob). References: @图片1=s3-first.jpg (sage linen shirt, bedroom plant background), @图片2=s3-last.jpg (same outfit, closer frame), @图片3=poster.jpg (identity anchor). Civitai style: OSS MMH3 reference-to-video-lora row — soft warm light diffused window golden cinematic_warm LUT teal shadows lifted, shallow DOF f/2.0 35mm, tactile fabric weave. Camera: high-angle close-up 35mm + slow bob subtle handheld with breathing. Motion: hair-tuck gesture, eye contact holds one beat. Keep 720x1280 delivery, firstFrame s3-first.jpg -> lastFrame s3-last.jpg. Output one line starting with 【参考素材说明】."}
  ],
  "temperature": 0.85,
  "max_tokens": 700
}' | jq -r '.choices[0].message.content' | tee /tmp/anubis-heat4-i2v-s3.txt

# Repeat for S1,S2,S4,S5,S6 (change scene context — camera/lighting per storyboard-heat2-4.md §2-§3)
# S1 static / bright daylight, S2 slow bob / soft warm, S4 static / golden-hour, S5 static / window flare, S6 slow bob / golden-hour pull wide
cat /tmp/anubis-heat4-i2v-s*.txt >> docs/storyboard-heat4.local.md
# docs/storyboard-heat4.local.md is gitignored (*.local.md) — never commit
# Also keep audit: cat /tmp/anubis-heat4-i2v-s*.txt > /tmp/heat4-i2v-prompts.txt
```

**Per-scene camera/lighting cheat sheet (from storyboard-heat2-4.md §2–§3):**

| Scene | Camera | Lighting | Motion budget |
|---|---|---|---|
| S1 Setup | `static locked tripod` | `bright daylight — clean natural window bounce, high key` | 1 motion: eye contact hold → soft smile |
| S2 Tension | `slow bob handheld with breathing micro head bob` | `soft warm — diffused window golden + coral` | 1 motion: hesitant glance + tote strap brush |
| S3 Temptation | `slow bob` / `high-angle close-up 35mm` | `soft warm golden + cinematic_warm LUT` | 1 motion: hand-on-shoulder → hair tuck |
| S4 Leap | `static locked tripod` / `high-angle close-up` | `soft warm golden-hour glow, dust motes` | 1 motion: lean-in + breath sync whisper |
| S5 Retreat | `static locked tripod` / `waist-height medium` | `bright daylight window flare, high key` | 1 motion: pull-back + look away |
| S6 Afterglow | `slow bob gentle push-in + pull wide` | `soft warm golden-hour boosted golds` | 1 motion: soft embrace laugh + pull wide |

---

## 5. Step 4 — H3 reference-to-video-lora (Wavespeed, bookends → 5s clip)

**What:** For each scene, run `wavespeed-ai/minimax-h3/reference-to-video-lora` with **3 reference images** (first.jpg, last.jpg, poster.jpg identity anchor), the I2V prompt from Step 3, the MMH3 LoRA, `duration 5`, `resolution 768p`, `aspect-ratio 9:16`. Output is `768×1344` native, scaled to `720×1280`.

**Model:** `wavespeed-ai/minimax-h3/reference-to-video-lora` — `wavespeed.ts:H3_REFERENCE_TO_VIDEO_LORA_MODEL`. Code wrapper: `generateH3ReferenceToVideoLora()` (`wavespeed.ts:448`).

**Price & time:** `$0.30 / 5s 768p` (`H3_REFERENCE_TO_VIDEO_LORA_PRICE`) per clip. Wall ~80s avg (measured 73–127s in `generation-log.md` §12 for the sibling `image-to-video-lora` at $0.25 — R2V-LoRA is costlier but similar latency; budget 90s/clip).

**CLI — per scene (6×):**

```bash
# Pre-flight
ls -lh /tmp/MysticXXX_MMH3-V4.safetensors  # 148M MysticXXX_MMH3-V4.safetensors (2856467:3266628)
# Uploads from Step 2 — need CDN URLs (Wavespeed requires URLs, not local paths — generation-log.md §10a)
FIRST_URL=$(wavespeed upload output/heat4/s1-first.jpg --json | jq -r .url)   # or .data.url depending on CLI
LAST_URL=$(wavespeed upload output/heat4/s1-last.jpg --json  | jq -r .url)
POSTER_URL=$(wavespeed upload public/storyboard/pick-your-new-stepsister-e1-poster.jpg --json | jq -r .url)
# For S2..S6 repeat with s{N}-first/last

# Canonical task CLI (local, no --remote):
wavespeed run wavespeed-ai/minimax-h3/reference-to-video-lora \
  --reference-images "$FIRST_URL,$LAST_URL,$POSTER_URL" \
  --prompt "$(cat /tmp/anubis-heat4-i2v-s1.txt)" \
  --loras /tmp/MysticXXX_MMH3-V4.safetensors \
  --duration 5 \
  --resolution 768p \
  --aspect-ratio 9:16 \
  --download output/heat4/s1-5s-raw.mp4 \
  --json | tee /tmp/heat4-r2v-s1.json

# If CLI rejects --reference-images / --loras / --aspect-ratio long flags (cf. generation-log.md §5.1),
# use the v0.2.3 -i key=value form + --input-file JSON fallback that was canonical for H3:

# --input-file JSON form (most reliable for loras + multi-image):
cat > /tmp/s1_r2v_input.json << JSON
{
  "prompt": "__PASTE_FROM_/tmp/anubis-heat4-i2v-s1.txt__",
  "reference_images": ["$FIRST_URL", "$LAST_URL", "$POSTER_URL"],
  "loras": [{"path": "/tmp/MysticXXX_MMH3-V4.safetensors", "scale": 1}],
  "duration": 5,
  "resolution": "768p",
  "aspect_ratio": "9:16"
}
JSON
wavespeed run wavespeed-ai/minimax-h3/reference-to-video-lora \
  --input-file /tmp/s1_r2v_input.json \
  --download output/heat4/s1-5s-raw.mp4 \
  --json | tee /tmp/heat4-r2v-s1.json

# -i form alternative (reference_image vs reference_images — try both; wavespeed.ts uses referenceImage singular for API):
# wavespeed run wavespeed-ai/minimax-h3/reference-to-video-lora \
#   -i prompt="$(cat /tmp/anubis-heat4-i2v-s1.txt)" \
#   -i reference_images="$FIRST_URL,$LAST_URL,$POSTER_URL" \
#   -i loras='[{"path":"/tmp/MysticXXX_MMH3-V4.safetensors","scale":1}]' \
#   -i duration=5 -i resolution=768p -i aspect_ratio=9:16 \
#   --download output/heat4/s1-5s-raw.mp4

# Repeat for S2..S6 (swap FIRST/LAST/POSTER + prompt per scene):
# S2: s2-first.jpg, s2-last.jpg, poster.jpg + /tmp/anubis-heat4-i2v-s2.txt  -> output/heat4/s2-5s-raw.mp4
# S3: s3-first.jpg, s3-last.jpg, poster.jpg + /tmp/anubis-heat4-i2v-s3.txt  -> output/heat4/s3-5s-raw.mp4
# S4: s4-first.jpg, s4-last.jpg, poster.jpg + /tmp/anubis-heat4-i2v-s4.txt  -> output/heat4/s4-5s-raw.mp4
# S5: s5-first.jpg, s5-last.jpg, poster.jpg + /tmp/anubis-heat4-i2v-s5.txt  -> output/heat4/s5-5s-raw.mp4
# S6: s6-first.jpg, s6-last.jpg, poster.jpg + /tmp/anubis-heat4-i2v-s6.txt  -> output/heat4/s6-5s-raw.mp4
# Poster is the persistent identity anchor (oss-prompts-mmh3-wan.md:27 — cross-video consistency: reuse 2-4 image refs).

# Check status if async
# wavespeed show <id> --json
# wavespeed history | head

# Scale 768×1344 -> 720×1280 (generation-log.md §11) — keep raw + scaled
for n in 1 2 3 4 5 6; do
  ffmpeg -y -i output/heat4/s${n}-5s-raw.mp4 -vf "scale=720:1280:flags=lanczos" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k output/heat4/s${n}-5s.mp4
  ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration,codec_name,avg_frame_rate -of default=noprint_wrappers=1 output/heat4/s${n}-5s.mp4
done
# expect each: width=720 height=1280 duration=5.166667 (H3 pads 4 frames @24fps) ✅
```

**API wrapper (TypeScript, `wavespeed.ts:448`):**

```ts
import { generateH3ReferenceToVideoLora } from "@/lib/wavespeed";

// Note: wavespeed.ts currently exposes referenceImage (singular); for 3-image Heat 4
// the CLI path above is canonical. If calling the API wrapper with multiple refs,
// pass the primary still as referenceImage and append the other two URLs in prompt
// 贯穿要求, or extend the wrapper to accept reference_images: string[].
// Single-image wrapper usage:
await generateH3ReferenceToVideoLora({
  referenceImage: FIRST_URL, // CDN URL from wavespeed upload
  prompt: await Bun.file("/tmp/anubis-heat4-i2v-s1.txt").text(),
  loras: [{ path: "/tmp/MysticXXX_MMH3-V4.safetensors", scale: 1 }],
  duration: 5,
  resolution: "768p",
});
// For 3-image CLI path, prefer wavespeed run ... --reference-images first,last,poster as above.
```

**Reference image count:** Task says `--reference-images first.jpg,last.jpg,poster.jpg` (3). H3 spec allows ≤9 images (`oss-prompts-mmh3-wan.md:27`). Delivery uses `poster.jpg` as the persistent identity anchor across all 6 scenes — this gives cross-video consistency for free (reuse same 2–4 refs, first 5 free per HF blog).

---

## 6. Step 5 — Stitch 6×5s → 30s episode

```bash
# Concat demuxer (generation-log.md §12) — re-encode for clean timestamps + stereo audio continuity
cat > /tmp/heat4_concat.txt << 'TXT'
file '/Users/parab/Documents/Personal/veilwick/output/heat4/s1-5s.mp4'
file '/Users/parab/Documents/Personal/veilwick/output/heat4/s2-5s.mp4'
file '/Users/parab/Documents/Personal/veilwick/output/heat4/s3-5s.mp4'
file '/Users/parab/Documents/Personal/veilwick/output/heat4/s4-5s.mp4'
file '/Users/parab/Documents/Personal/veilwick/output/heat4/s5-5s.mp4'
file '/Users/parab/Documents/Personal/veilwick/output/heat4/s6-5s.mp4'
TXT

ffmpeg -y -f concat -safe 0 -i /tmp/heat4_concat.txt -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k output/heat4/e1-30s.mp4

ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration,codec_name,avg_frame_rate,r_frame_rate -of default=noprint_wrappers=1 output/heat4/e1-30s.mp4
# expect 720×1280, duration ~31.08 (6×5.166667, H3 padding), 744 frames @24fps h264+aac ✅

ls -lh output/heat4/e1-30s.mp4
# Preview mirrors (local only):
mkdir -p apps/web/public/prototype .open-next/assets/prototype public/prototype
cp output/heat4/e1-30s.mp4 apps/web/public/prototype/heat4-e1-30s.mp4
cp output/heat4/e1-30s.mp4 public/prototype/heat4-e1-30s.mp4
# served at /prototype/heat4-e1-30s.mp4 when dev server serves public/
```

**Duration math:** Request 5.00s → actual `5.166667` per clip (124 frames @24fps, H3 pads ~4 frames). 6× → `31.083333` stream / `31.136` format. This is nominal 30s (`duration:5` tier), within spec (`generation-log.md` §12).

**Batch time/cost:**

| Item | Time | Cost | Notes |
|---|---|---|---|
| Step 2 — 12× Wan T2I stills | ~10–20s each, ~2–4 min total | Wan T2I rate (separate from H3) | sequential OK; parallel if rate limit allows |
| Step 4 — 6× H3 R2V-LoRA 5s | ~80s each (73–127s range) | `$0.30 × 6 = $1.80` | 5-step stitch total; full run ~8–9 min sequential, ~2 min parallel |
| Step 5 — ffmpeg concat | ~3s | $0 | local re-encode |
| Balance check | — | — | `wavespeed balance` before/after; expect `-$1.80` for 6 clips |

Wan 2.1/2.7 T2I cost is additional; check `wavespeed prices` or dashboard before launch (distinct from H3 $0.30).

---

## 7. Cost, time, and budget

```bash
wavespeed balance          # before
# run steps 2 and 4
wavespeed balance          # after — delta = 12× T2I + 6× $0.30
wavespeed history | head -20  # task_ids + elapsed_ms per clip
```

- **H3 R2V-LoRA:** `$0.30 / 5s 768p` (`wavespeed.ts:H3_REFERENCE_TO_VIDEO_LORA_PRICE`). Image-to-video-lora is `$0.25`; do not confuse — Heat 4 image-reference path is the $0.30 tier.
- **Measured wall:** 73–127s per clip (`generation-log.md` §12 table). Budget **90s/clip** mean, so **6 clips ≈ 9 min wall sequential** (+ T2I). Parallel 5-concurrent can cut to ~130s wall (slowest clip) if Wavespeed rate limit permits (`generation-log.md` §14).
- **Full E1 Heat 4 (this engine):** 12 stills + 6×5s R2V + stitch. Dollar budget is `T2I(12) + $1.80`; time budget ~12–15 min sequential end-to-end.

---

## 8. Failure handling

| Failure | Symptom | Cause (from `generation-log.md` §5/§13) | Fix |
|---|---|---|---|
| **LoRA loras causes job failure** | `Prediction failed (task_id: ff572335…): The job failed unexpectedly.` (history) | Wavespeed CDN media upload rejects safetensors (`wavespeed upload /tmp/*.safetensors → fetch failed`); H3 `loras` expects pre-registered/hosted LoRA, not raw local path. Two S1/S2 tasks failed this way (§5.2, §13.1). | Retry once **without** `loras` (prompt-only H3 realism gate) — failures not charged. Then retry with `scale:0.8` via direct API (`generateH3ReferenceToVideoLora({loras:[{path,scale:0.8}]})`) bypassing CLI. If still fails, keep prompt-only for realism gate and register LoRA via Wavespeed LoRA training endpoint (future: `wavespeed train lora`). Keep file at `/tmp/MysticXXX...` via `WAVESPEED_LORA_PATH`. Check `wavespeed show <id> --json`. |
| **Task CLI flags rejected** | `unknown flag --image / --loras / --reference-images` | `wavespeed v0.2.3` long flags drift — canonical task `wavespeed run … --image --prompt --loras --duration --resolution` fails; actual is `-i key=value` or `--input-file JSON` (`generation-log.md` §5.1). | Use `--input-file /tmp/*_input.json` with `image/last_image/prompt/duration/resolution/loras/reference_images` (most reliable), or `-i key=value` form. Always pre-upload stills to get CDN URL (`wavespeed upload … --json`). |
| **Generic `wavespeed upload` rejects safetensors** | `✖ fetch failed` for 148 MB `.safetensors` | Media bucket expects images, not LoRA binaries — expected, not fatal (§5.3). | Keep `.safetensors` local; pass as `loras: [{path, scale}]` per `wavespeed.ts:215-235`. Do not upload LoRA via media endpoint. |
| **`/usr/bin/time` breaks --download pipe** | `time: command terminated abnormally, saved: []` but `wavespeed history` shows completed | `tee` pipe break with `time` wrapper (§13.2). | Remove `/usr/bin/time` wrapper for R2V runs; use `elapsed_ms` from JSON + manual `curl -L -o` from history URL if needed. |
| **Resolution mismatch** | Raw `768×1344` vs spec `720×1280` | H3 768p at 9:16 is `768×1344` (1.75 ratio) not `720×1280` (1.777) (§13.3). | Always keep raw + scaled; `ffmpeg scale=720:1280:flags=lanczos` crf23. Check `ffprobe width/height`. |
| **Duration padding** | Each 5s returns `5.166667` → stitched `31.08s` not `30.00` | H3 pads ~4 frames @24fps per 5s tier (§13.4). | Expected — stitched is 30s tier. No fix; concat with re-encode normalizes timestamps. |
| **Slow inference** | S5 took 127s vs 73s normal | Larger scene delta or queue contention (§13.6). | No retry if succeeded; still $0.30. For parallel batches, expect tail latency. |
| **Anubis tunnel down** | `curl http://localhost:8080/health` fails | SSH tunnel dropped or Vast reboot rotated `ssh_port` (`vast-anubis-rental.md` §Instance). | Re-fetch `ssh_port` via `GET /api/v0/instances/49584552/` and re-open `ssh -p <port> root@ssh6.vast.ai -L 8080:localhost:8080`. Health-check before each generation session. For Dell local, check `llama-server` process. |

**Retry policy:** On `The job failed unexpectedly`, retry once without `loras`; if still fails, check `wavespeed show <id>` and `wavespeed history` and contact support with `task_id`. Balance not charged for failures (§5.2, §13.1). For Heat 4 explicit path, keep prompts local — retry never leaks Heat 4 text to remote beyond Wavespeed `prompt` field (which is already per-clip explicit by design).

---

## 9. Local-only & Heat 4 placeholder contract

- **Keep local:** No `wrangler deploy --remote`, no `wrangler deploy`. Dev is `wrangler dev --local` only. All `wavespeed run` invocations are local Wavespeed CDN (no `--remote`, no Vast fallback). See `generation-log.md` §15 and `vast-anubis-rental.md` Operational notes.
- **Heat 4 placeholders only you fill via Anubis:** `docs/storyboard-heat2-4.md` §4a defines 6 placeholder blocks (one per scene, each starting `PASTE YOUR HEAT 4 PROMPT HERE`). Replace only the placeholder token; keep `720x1280 5s`, camera/lighting/tags/firstFrame/lastFrame tokens. **Store the filled file as `docs/storyboard-heat4.local.md` (gitignored via `*.local.md`) or `~/.secrets/storyboard-heat4.md` — never commit.** This engine doc never contains explicit prompt text.
- **`.dev.vars` local only:** `WAVESPEED_API_KEY`, `ANUBIS_BASE_URL`, `ANUBIS_MODEL`, `ANUBIS_API_KEY`, `CIVITAI_API_KEY` stay in `.dev.vars` / `~/.secrets/*.env`, never committed (already `.gitignore`d).
- **LoRA env:** `WAVESPEED_LORA_PATH=/tmp/MysticXXX_MMH3-V4.safetensors` in `.dev.vars` or default. Supports comma-separated list.
- **Never log explicit:** `/tmp/heat4-*.json` and `/tmp/anubis-heat4-*.txt` are ephemeral; `output/heat4/` images/video are local. Do not paste explicit prompts into public docs, PR bodies, or chat beyond your machine.

---

## 10. End-to-end reproduce (local, no remote)

```bash
cd /Users/parab/Documents/Personal/veilwick

# 0. Pre-flight
ls -lh /tmp/MysticXXX_MMH3-V4.safetensors || bun scripts/download-mmh3-lora.ts
sips -g pixelWidth -g pixelHeight public/storyboard/pick-your-new-stepsister-e1-first.jpg
wavespeed balance
ssh -p 24552 root@ssh6.vast.ai -L 8080:localhost:8080  # or Dell local — keep in another shell
curl -s http://localhost:8080/health | jq .
curl -s http://localhost:8080/v1/models | jq .data[0].id

# 1. Anubis -> 12 T2I prompts (first/last per scene) -> docs/storyboard-heat4.local.md (gitignored)
#    (see §2 curl template — repeat for s1-first through s6-last, 12 prompts)

# 2. Wan T2I -> 12 stills 720*1280 + uploads (see §3)
mkdir -p output/heat4
for sc in s1-first s1-last s2-first s2-last s3-first s3-last s4-first s4-last s5-first s5-last s6-first s6-last; do
  wavespeed run alibaba/wan-2.7/text-to-image \
    --prompt "$(cat /tmp/anubis-heat4-t2i-${sc}.txt)" \
    --lora /tmp/MysticXXX_MMH3-V4.safetensors \
    --size "720*1280" \
    --download output/heat4/${sc}.jpg --json | tee /tmp/heat4-t2i-${sc}.json
  # fallback: wavespeed-ai/wan-2.1/text-to-image if 2.7 not live
done
for f in output/heat4/s*-*.jpg; do sips -g pixelWidth -g pixelHeight "$f"; done
# (uploads in §3 prepare URLs for step 4)

# 3. Anubis -> 6 I2V prompts (image-grounded, see §4)
#    (curl loop for S1..S6 I2V -> /tmp/anubis-heat4-i2v-s{1..6}.txt -> docs/storyboard-heat4.local.md)

# 4. H3 R2V-LoRA -> 6×5s 768p -> scaled 720×1280 (see §5)
for n in 1 2 3 4 5 6; do
  FIRST_URL=$(wavespeed upload output/heat4/s${n}-first.jpg --json | jq -r .url)
  LAST_URL=$(wavespeed upload output/heat4/s${n}-last.jpg --json  | jq -r .url)
  POSTER_URL=$(wavespeed upload public/storyboard/pick-your-new-stepsister-e1-poster.jpg --json | jq -r .url)
  cat > /tmp/s${n}_r2v_input.json << JSON
{
  "prompt": "__PASTE_FROM_/tmp/anubis-heat4-i2v-s${n}.txt__",
  "reference_images": ["$FIRST_URL", "$LAST_URL", "$POSTER_URL"],
  "loras": [{"path": "/tmp/MysticXXX_MMH3-V4.safetensors", "scale": 1}],
  "duration": 5,
  "resolution": "768p",
  "aspect_ratio": "9:16"
}
JSON
  wavespeed run wavespeed-ai/minimax-h3/reference-to-video-lora \
    --input-file /tmp/s${n}_r2v_input.json \
    --download output/heat4/s${n}-5s-raw.mp4 --json | tee /tmp/heat4-r2v-s${n}.json
  ffmpeg -y -i output/heat4/s${n}-5s-raw.mp4 -vf "scale=720:1280:flags=lanczos" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k output/heat4/s${n}-5s.mp4
  ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of default=noprint_wrappers=1 output/heat4/s${n}-5s.mp4
done

# 5. Stitch 30s (see §6)
ffmpeg -y -f concat -safe 0 -i /tmp/heat4_concat.txt -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k output/heat4/e1-30s.mp4
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of default=noprint_wrappers=1 output/heat4/e1-30s.mp4
# => 720×1280 ~31.08s 7–8 MB h264+aac
wavespeed balance
```

No `wrangler deploy`, no `--remote`, no commit of `*.local.md`. All explicit Heat 4 text stays in `/tmp/` and gitignored `docs/storyboard-heat4.local.md`.

---

## 11. References

- Storyboard: `docs/storyboard-heat2-4.md` ( §4a 6 Heat 4 placeholders, §4b Anubis Mini 8B, §5 engine mapping `wavespeed.ts` FEED_CATEGORIES)
- Generation log: `docs/generation-log.md` (§3 H3 `image+last_image` stitch, §10 S2–S6, §11 lanczos, §12 concat, §5/§13 failure modes, cost $0.25 I2V vs $0.30 R2V)
- WaveSpeed lib: `apps/web/src/lib/wavespeed.ts` (`H3_IMAGE_TO_VIDEO_LORA_*`, `H3_REFERENCE_TO_VIDEO_LORA_*`, `MMH3_*`, `getWavespeedLoras`, `generateH3ReferenceToVideoLora`)
- OSS prompts: `docs/oss-prompts-mmh3-wan.md` (§1 MMH3 reference-to-video-lora row, H3 structure, candid tricks, 7000-char / 12-file limits, Wan canonical negative, gap fixes)
- Anubis rental: `docs/vast-anubis-rental.md` (instance `49584552` `ssh6.vast.ai:24552`, 2×4090 Q4 70B, `llama-server --split-mode row --ctx-size 8192`; Mini 8B variant `TheDrummer/Anubis-Mini-8B-GGUF` Q4_K_M ~4.9 GB)
