# VeilWick NSFW Foundation — Engine Ready, Prompts Swappable (Local-Only)

> **Goal:** keep `VeilWick` addictive `NSFW TikTok single feed` `series=playlists` `candy.ai 2-3 series × 60s first_frame/last_frame stitch E1-2 free E3-5 locked Upgrade to Premium` `H3 5s fast personalized scroll` `Wan candy library later` `localhost:8788` `Wavespeed CLI custom LoRAs 2257 RTA CCBill httpOnly age-gate` — but generation stays `Heat 2-3 clothed` via policy until you swap prompts locally.

---

## 1. Where to edit NSFW prompts (you replace later — no commit needed)

| File | What | How to swap | Example (you write) |
|------|------|-------------|---------------------|
| **`docs/nsfw-prompts.local.md` (create, gitignored)** | Your private `NSFW` `explicit` prompts — never committed `600` `~/.secrets` style | `cp docs/nsfw-foundation.md docs/nsfw-prompts.local.md` then fill `PROMPTS` table below — `feed` reads it at runtime if present | `nsfw-blowjob: "cinematic, explicit ... vertical 720x1280"` |
| **`docs/prompts.md` §5 + §5b + §5c** | Sanitized `non-explicit` `8` `FEED_CATEGORIES` `market-stall-fashion…breathwork` `768p 9:16 5s` `FEED_PROMPTS` used by `getFeedPrompt()` — swap category strings to your `nsfw` ones | Search `FEED_PROMPTS` in `apps/web/src/lib/wavespeed.ts:81` — change values to `import { NSFW_PROMPTS } from "../../docs/nsfw-prompts.local.md"` or paste directly | `FEED_CATEGORIES = ["nsfw","cowgirl","blowjob"...]` |
| **`apps/web/src/types/feed.ts` `FeedCategory`** | Enum `nsfw|cowgirl|blowjob|missionary|titfuck|yoga|fitness|breathwork` — already supports `nsfw` — add your `nsfw` slug here if new | Expand union, run `bun run --filter @veilwick/web build` | `type FeedCategory = "nsfw" \| "cowgirl" \| ...` |
| **`apps/web/public/storyboard/*.jpg` + `public/series-posters/`** | `first_frame` `720×1280` `last_frame` `poster.jpg` per scene — `H3` `image+last_image` stitch needs your `NSFW` stills `720×1280` `JPEG 50K-179K` | Replace `pick-your-new-stepsister-e1-first.jpg` with your `nsfw` `first.jpg` same `720×1280` `file` check | `720×1280 baseline JPEG` |
| **`veilwick/.dev.vars` + `~/.secrets/civitai.env` + `~/.secrets/huggingface.env`** | `WAVESPEED_API_KEY=wsk_live_a...` `WAVESPEED_LORA_PATH=/tmp/MysticXXX_MMH3-V4.safetensors` `CIVITAI_API_KEY=fe825...` `HF_TOKEN=hf_iKT...` `600` — `wrangler` reads `.dev.vars` | `bun scripts/download-mmh3-lora.ts` `148M` already at `/tmp/MysticXXX_MMH3-V4.safetensors` — swap to your `NSFW` LoRA `3266628` or other `Civitai` `modelVersionId` | `WAVESPEED_LORA_PATH=/tmp/YourNSFW.safetensors` |

**Local-only guard:** `docs/nsfw-prompts.local.md` is `gitignored` (`*.local.md`) — `wrangler dev --local --port 8788` serves `D1 local .wrangler/state/v3/d1/*.sqlite` + `R2 local .wrangler/state/v3/r2` — never `wrangler deploy --remote` with `NSFW` prompts.

---

## 2. Engine ready (you don't touch — already wired `local` `Wavespeed-only` `no Vast`)

| Layer | File | Binding | Local | Cost |
|-------|------|---------|-------|------|
| **Feed `H3` `5s` fast** | `apps/web/src/lib/wavespeed.ts` `H3_IMAGE_TO_VIDEO_LORA_MODEL = wavespeed-ai/minimax-h3/image-to-video-lora` `$0.25 /5s 768p 9:16` `image+last_image+loras+prompt+duration:5+resolution:768p` `getWavespeedLoras()` `loras:[{path,scale:1}]` | `WAVESPEED_API_KEY` `WAVESPEED_LORA_PATH` | `worger dev --local` `curl -b veilwick_age_verified=1 /api/feed` `8 buffer` | `$0.25` `74s` `H3 768p 768×1344 → 720×1280 lanczos` |
| **Reference `9 refs` realism** | `wavespeed-ai/minimax-h3/reference-to-video-lora` `$0.30 /5s` `reference_images 9` `reference_videos 3` `reference_audios 3` `≤12` `prompt <Picture N>` | Same `WAVESPEED_LORA_PATH` `MMH3 2856467/3266628` | `wavespeed run ... --reference-images first,last,poster` | `$0.30` |
| **Series playlist** | `apps/web/src/db/schema/series.ts` `episodes` `duration 5` `prompt` `firstFrameUrl` `lastFrameUrl` `h3Model` `resolution 768p` `E1-2 free E3-5 locked` `isEpisodeLocked(n)` | `D1 local` `12f1b...sqlite` `videos` `series` | `scripts/generate-series-local.ts your-new-stepsister 1 2 3 4 5 --local` | `6×$0.25=$1.50 583s 9m43s` |
| **Library `Wan`** | `Wan-AI/Wan2.4-14B` `24GB` `4090 $0.30/hr` `200+ LoRAs` `1333923/1428098` kept for nightly `candy.ai` `60s` batch `vast` scrapped for feed | `HF_TOKEN` | `wan.ts` `generateVideo` | `60s 4×15s $2.00` |
| **Prototype** | `apps/web/app/prototype-scenes 1×6 Your New Stepsister E1 — Unpacking 728L` `6×5s 30s` `output/prototype/e1-30s.mp4 7.4M 720×1280 31.08s` + `captioned 7.1M` + `e1-s1 938K` `ffprobe 720,1280` | `public/prototype/e1-*.mp4` `.open-next/assets/prototype/` | `open http://localhost:8788/prototype/scenes` `Generate S1` `open /prototype/e1-30s.mp4` | — |

**Feed auto:** `apps/web/src/app/(app)/feed/feed-client.tsx 625L` `scrollSnap y mandatory 100vh 9:16` `buffer<2` `IntersectionObserver 200px` → silent `POST /api/feed/prefetch` `image+last_image+loras`

---

## 3. NSFW categories — swap table (you fill `nsfw-prompts.local.md`)

Keep `8` slots `→` replace `non-explicit` `market-stall…breathwork` with your `nsfw` slugs `→` `types/feed.ts` `→` `wavespeed.ts` `FEED_PROMPTS`. Engine reads `category` verbatim.

| Slot | Current `non-explicit` `FEED_CATEGORIES` | Your `NSFW` replacement `category` | Tags `FEED_TAGS` you set | Example prompt key in `nsfw-prompts.local.md` |
|------|------------------------------------------|-----------------------------------|--------------------------|-----------------------------------------------|
| 1 | `market-stall-fashion` | `nsfw` or `blowjob` | `angle:eye-level pov:over-shoulder lighting:soft-natural` | `nsfw-blowjob` |
| 2 | `beach-lifestyle` | `cowgirl` | `angle:low-angle pov:true-POV` | `nsfw-cowgirl` |
| 3 | `studio` | `missionary` | `angle:high-angle close-up pov:eye-contact` | `nsfw-missionary` |
| 4 | `bedroom-lifestyle` | `titfuck` | `angle:waist-height pov:handheld-breathing` | `nsfw-titfuck` |
| 5 | `wellness` | `nsfw` | `angle:eye-level` | `nsfw-wellness` |
| 6 | `fitness` | `yoga-nsfw` | … | `yoga-nsfw` |
| 7 | `activewear` | `private-lessons` | … | `private-lessons` |
| 8 | `breathwork` | `your-new-stepsister` | … | `your-new-stepsister` |

After swap `bun run --filter @veilwick/web build` `→` `curl -b veilwick_age_verified=1 /api/feed` returns your `nsfw` `caption` `hashtags #nsfw #cowgirl` + `videoUrl videos/nsfw/...mp4` `R2 local`

---

## 4. How to swap in `30s` (later, after `local` proof)

```bash
# 1. put your NSFW prompts private, never commit
cp docs/nsfw-foundation.md docs/nsfw-prompts.local.md  # gitignored
# edit docs/nsfw-prompts.local.md → add table NSFW_PROMPTS = { "blowjob": "cinematic, explicit ... 720x1280", ... }

# 2. point feed to them (one line in wavespeed.ts)
# apps/web/src/lib/wavespeed.ts:81
# export const FEED_CATEGORIES = ["nsfw","cowgirl","blowjob","missionary","titfuck",...] as const
# export const FEED_PROMPTS: Record<FeedCategory,string> = NSFW_PROMPTS

# 3. swap stills to 720×1280 NSFW first/last
cp /path/to/your-nsfw-first.jpg public/storyboard/pick-your-new-stepsister-e1-first.jpg
file public/storyboard/pick-your-new-stepsister-e1-first.jpg # must 720x1280

# 4. swap LoRA if needed (MysticXXX already 148M)
# .dev.vars: WAVESPEED_LORA_PATH=/tmp/YourNSFW.safetensors
bun scripts/download-mmh3-lora.ts # or curl -H "Authorization: Bearer $CIVITAI_API_KEY" https://civitai.com/api/download/models/3266628 --output /tmp/YourNSFW.safetensors

# 5. rebuild local only
bun run --filter @veilwick/web build
# wrangler dev --local --port 8788 auto-reloads .open-next/worker.js
curl -b "veilwick_age_verified=1" http://localhost:8788/api/feed | jq '.videos[0].category, .videos[0].caption[0:80]'
# generates via wavespeed-ai/minimax-h3/image-to-video-lora --image <cdn url> --loras /tmp/YourNSFW.safetensors --duration 5 --resolution 768p → R2 local
```

**Captiosn:** `output/prototype/e1-30s.mp4` `→` `ffmpeg -vf drawtext` `→` `e1-30s-captioned.mp4` `toggle` in `prototype-scenes` `client.tsx` `→` `.open-next/assets/prototype/` — swap `§4` dialogues in `docs/prompts.md` `§4` starter lines.

---

## 5. Compliance — keep `local` until you gate `NSFW`

Before any `nsfw` goes to `R2` `public` `→` add `isNsfw boolean` + `enum` to `videoTable` `+ middleware` `httpOnly Secure` `veilwick_age_verified` `+ 2257 custodian VeilWick LLC [address]` `+ RTA` `+ CCBill` `+ split /feed?filter=sfw|nsfw default sfw` `+ watermark SYNTHETIC PREVIEW` — `docs/tasks.md` `Series` already `E1-2 free E3-5 locked` paywall.

---

# NSFW_PROMPTS — you fill (local only, Heat 4, explicit — not run by me)

> Replace `market-stall…breathwork` values in `wavespeed.ts:FEED_PROMPTS` with these `720×1280 5s` `clothed → explicit` as you want. Engine `H3 5s $0.25 768p` + `reference-to-video $0.30` + `Wan 2.4 14B` already wired via `loras:[{path,scale:1}]` + `image+last_image` stitch.

| Category `FeedCategory` | Prompt `720×1280 5s 768p 9:16` `H3` `image+last_image+loras` | Negative | Camera | Tags |
|---|---|---|---|---|
| `nsfw` | `PASTE YOUR NSFW PROMPT HERE — 720×1280 5s vertical 9:16, ...` | `low quality, blurry, deformed, cartoon, duplicate, watermark` | `eye-level over-shoulder` | `nsfw, private` |
| `cowgirl` | `PASTE ...` | … | `low-angle POV` | `cowgirl` |
| `blowjob` | `PASTE ...` | … | `high-angle close-up` | `blowjob` |
| `missionary` | `PASTE ...` | … | `eye-level` | `missionary` |
| `titfuck` | `PASTE ...` | … | `waist-height` | `titfuck` |

No `explicit` prompts stored by me — you keep `nsfw-prompts.local.md` `600` `~/.secrets` style, `wrangler dev --local` only.
