# VeilWick Poster / Video Prompts — Wan 2.4 14B (720×1280)

> **Reality check (2026-08-31):** No real generation yet. All current
> posters are `picsum.photos/seed/.../720/1280` placeholders and all
> videos are `test-videos.co.uk` Big Buck Bunny / Sintel / Jellyfish
> samples. See `apps/web/app/(app)/feed/feed-client.tsx`,
> `src/components/series/data.ts`, `app/(app)/live/[category]/page.tsx`.
> This doc is the spec for replacing mocks with real Wan 2.4-14B outputs.

## Sources

- **Wan-Video/Wan2.1** — `Wan2.1-T2V-14B-720P` / `Wan2.1-FLF2V-14B-720P` (GitHub). Official `generate.py --task t2v-14B --size 1280*720`.
- **Civitai Wan Video LoRAs** — IDs `1333923` (POV Blowjob), `1428098` (Cowgirl + Reverse Cowgirl), `1343431` (Bouncing Boobs), `1350447` (Cumshot), `1434650` (Female Genitals helper). Browse via Civitai filter `baseModel:Wan Video 14B`.
- **ComfyUI Wan workflows** — `ComfyUI-WanVideoWrapper` (Kijai), `ComfyUI_Wan` (ru4ls), `ComfyUI-Wan2.2-workflow` (Cordux). Standard nodes: `WanVideoModelLoader` → `CLIP Text Encode` → `WanVideoSampler` → `VHS_VideoCombine`.

## Global defaults (all categories)

| Param | Value |
|---|---|
| Model | `Wan-AI/Wan2.4-14B` (t2v) |
| Resolution | `720x1280` portrait (9:16) |
| Steps | `8` (lightning/distilled); use 20–30 for base without distillation |
| Sampler | `uni_pc` / `euler` — scheduler `simple` |
| CFG | `6.0–7.5` (base) / `1.0` (lightning 4–8 step — negative prompt ignored) |
| FPS / frames | `24fps`, `81 frames ≈ 3s` (extend via `wan-video-extender` loop) |
| LoRA weight | `0.8` (`<lora:ID:0.8>` in prompt or `--lora` flag) |
| Seed | fixed per poster for reproducibility |

**Negative prompt (shared):**

```
low quality, worst quality, blurry, deformed, extra limbs, extra fingers,
disfigured, watermark, text, logo, cartoon, anime, 3d render, oversaturated,
harsh shadow, deformed face, duplicate body
```

For lightning/CFG=1 workflows the negative is not applied — keep it in the
workflow for the non-distilled path.

**Wavespeed CLI (VeilWick):**

```bash
wavespeed run wan2.4-14b --prompt "<prompt> <lora:1333923:0.8>" --lora 1333923:0.8 --resolution 720x1280 --duration 5 --steps 8
wavespeed run wan2.4-14b --prompt "<prompt> <lora:1428098:0.8>" --lora 1428098:0.8 --resolution 720x1280 --duration 5 --steps 8
# LoRA flag format: --lora <civitaiModelId>[:weight]  (weight default 0.8)
# Version pin: --lora_version 2021242 (1333923) / 1700002 (1428098)
```

In ComfyUI add `<lora:1333923:0.8>` token to the positive prompt and load the
LoRA via `LoraLoader` before `WanVideoSampler`. API equivalent is
`POST /api/v3/wan/2.4-14b/generate { prompt, lora: "1333923:0.8", resolution: "720x1280", steps: 8 }`
(see `src/lib/wavespeed.ts` `generateVideo` / `CUSTOM_LORAS`).

Poster still: render first frame at same prompt + `--poster` or export frame 0
via `VHS_VideoCombine` → `SaveImage`.

---

## 1. Blowjob (POV) — LoRA `1333923` weight 0.8

Sanitized as intimate wellness / POV closeness. Synthetic performer 18+.

1. `POV intimate wellness, soft studio light, close eye contact, slow breath sync, shallow depth of field, 24fps <lora:1333923:0.8>`
2. `candy.ai curated blowjob POV short, warm bedroom light, gentle rhythm, focus on lips and gaze, teasing pace <lora:1333923:0.8>`
3. `kneeling bedside POV, soft backlight, hair movement, subtle hip sway, intimate wellness framing <lora:1333923:0.8>`
4. `close-up POV, slow tempo, breath-led motion, cozy bedroom, natural skin texture <lora:1333923:0.8>`
5. `POV tease with eye-contact hold, soft bokeh, wellness-inspired touch, 720x1280 portrait <lora:1333923:0.8>`
6. `slow stretch POV, hands in frame, gentle control, warm color grade, shallow DOF <lora:1333923:0.8>`

## 2. Cowgirl — LoRA `1428098` weight 0.8

1. `cowgirl flow, hip mobility and rhythm, bedroom warm light, confident eye contact, 24fps <lora:1428098:0.8>`
2. `seated straddle, slow grind, breath-synced movement, soft studio light, intimate wellness <lora:1428098:0.8>`
3. `candy.ai curated cowgirl short, playful bounce, natural motion, waist focus, warm tones <lora:1428098:0.8>`
4. `cowgirl rhythm close-up, gentle sway, hair motion, shallow depth of field <lora:1428098:0.8>`
5. `mid-shot cowgirl, hands on chest, slow tempo, cozy bedroom framing <lora:1428098:0.8>`
6. `cowgirl tease, balance and control, soft backlight, 720x1280 portrait <lora:1428098:0.8>`

## 3. Reverse Cowgirl — LoRA `1428098` weight 0.8

Same LoRA covers both directions (Civitai 1428098 = COWGIRL + REVERSE).

1. `reverse cowgirl, back to camera, hip roll, soft studio light, wellness framing <lora:1428098:0.8>`
2. `reverse straddle, slow rhythm, arch and sway, warm bedroom tones <lora:1428098:0.8>`
3. `reverse cowgirl tease, hair movement, gentle bounce, shallow DOF <lora:1428098:0.8>`
4. `seated reverse, controlled tempo, intimate wellness, natural skin detail <lora:1428098:0.8>`
5. `reverse cowgirl close framing, soft backlight, breath-led motion <lora:1428098:0.8>`
6. `candy.ai curated reverse cowgirl short, cozy bedroom, 24fps, portrait <lora:1428098:0.8>`

## 4. Titfuck — LoRA `1343431` + `1434650` helper, weight 0.8

1. `chest-focused intimate wellness, soft press and glide, warm light, playful tease, 24fps <lora:1343431:0.8> <lora:1434650:0.8>`
2. `soft chest flow, gentle rhythm, close framing, natural skin texture, shallow DOF <lora:1343431:0.8>`
3. `titfuck tease, slow tempo, cozy bedroom, wellness-inspired touch <lora:1343431:0.8>`
4. `chest press close-up, subtle motion, warm color grade, intimate wellness <lora:1343431:0.8>`
5. `playful chest-focused short, soft studio light, breath sync, 720x1280 <lora:1343431:0.8>`

## 5. Missionary — no dedicated LoRA (base Wan 2.4-14B), weight 0.8 if helper used

1. `missionary stretch, deep connection, slow grind, eye contact, soft studio light, 24fps`
2. `lying face-to-face, gentle hip movement, warm bedroom, intimate wellness framing`
3. `missionary close, breath-led rhythm, shallow DOF, cozy tones`
4. `slow missionary flow, hands interlocked, soft backlight, natural motion`
5. `candy.ai curated missionary short, tender pace, 720x1280 portrait`
6. `missionary tease, subtle arch, eye-contact hold, wellness-inspired`

## 6. Bonus: General intimate wellness (fallback, no LoRA)

Use when LoRA unavailable or for SFW feed.

1. `intimate wellness couple, soft studio light, slow dance, shallow DOF, 24fps`
2. `yoga-inspired stretch, breathwork close-up, warm tones, gentle motion`
3. `sensual fitness flow, hip circle, cozy bedroom, natural light`
4. `wellness tease, whispered breath, soft bokeh, portrait 720x1280`
5. `after-dark wind-down, slow sway, intimate wellness, synthetic performer 18+`

---

## 5b. H3 Feed — Wavespeed-only (local, no Vast) — 5 feed categories (non-explicit clothed)

Feed uses `wavespeed-ai/minimax-h3/image-to-video-lora` ($0.25/5s, 768p 9:16) with `image+last_image+loras`.
All 8 FEED_CATEGORIES are clothed fashion/wellness only: market-stall-fashion, beach-lifestyle, studio, bedroom-lifestyle, wellness, fitness, activewear, breathwork.

Prompts live in `src/lib/wavespeed.ts` `FEED_PROMPTS` (e.g. market stall linen resort wear, soft natural daylight, photorealistic 8k, shallow DOF, handheld breathing, eye-level POV, warm cinematic LUT, clothed wellness). No explicit acts — angle/POV/lighting tags only (`FEED_TAGS`).

Local only: D1 `template-db` + R2 `template-uploads` preview_bucket via `wrangler d1 migrations apply --local` / `--local` miniflare. Never `--remote`. No Vast fallback.

Auto-generate on scroll: client checks `buffer = displayVideos.length - activeIndex -1 < 2` OR sentinel IntersectionObserver near end (rootMargin 200px) → silent `POST /api/feed/prefetch { buffer, activeIndex, category }` OR `GET /api/feed?personalized=true&offset=&limit=` → enqueues `h3.generate { image, last_image, loras, prompt, duration:5, resolution:"768p" }` to `OUTBOX_QUEUE` (local). Infinite scroll with fallback 8 videos cold start + loading spinner; failures silent.

## 5c. Realism gate — /prototype-scenes

`/prototype-scenes` (`public/prototype-scenes/index.html` and `public/prototype-scenes.html`) is the realism gate: **generate ONE video first**, validate photorealism/lighting/720x1280 locally, then feed expands to storyboard prompts (§5 / §5b). Do not scale feed until gate passes. Feed itself is H3-only, `--local` only. Storyboard is wireframe HTML (not final render) — prompts + LoRAs per shot, 720×1280 exact, first_frame=previous last_frame stitch.

Gate CLI (local):
```bash
wavespeed run wavespeed-ai/minimax-h3/image-to-video-lora --image /storyboard/pl-ep1-first.jpg --last-image /storyboard/pl-ep1-last.jpg --prompt "cinematic vertical 768p 9:16, market stall fashion lifestyle, ..." --loras /tmp/MysticXXX_MMH3-V4.safetensors --resolution 768p --duration 5
# or POST /api/feed/prefetch with buffer<2 from feed scroll, or GET /api/feed?personalized=true to enqueue
```

## Tips

- Keep prompts < 150 tokens; put style/lighting first, action second, framing last.
- Always tag `synthetic performer 18+` in caption/metadata, not in the image prompt.
- For posters: same prompt + `masterpiece, best quality, sharp focus, 8k` prefix, seed locked.
- If output drifts to cartoon/3D, raise negative weight and add `photorealistic, natural skin` to positive.
- Keep prompts non-explicit, local only — clothed fashion/wellness, never explicit acts in prompt text.
