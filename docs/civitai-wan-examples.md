# Civitai Wan NSFW Examples — VeilWick Heat 4 image-to-video prompting

> **Local only — do not commit. Do not push to remote.**
> Source: Civitai API `GET /api/v1/models?types=LORA&baseModel=Wan Video 14B t2v&sort=Most Downloaded&limit=10` with `CIVITAI_API_KEY` from `/Users/parab/.secrets/civitai.env` (`~/.secrets/civitai.env`, also `.dev.vars` mirror). Verified 2026-09-01. Key shown redacted `fe8256…`. Keep prompts sanitized Heat 2–3 in this doc; Heat 4 examples use placeholder **"scraped Heat 4 example - you fill via Anubis"** if explicit — fill via Anubis Mini 8B on Vast/Dell per `docs/storyboard-heat2-4.md §4b`.
> Project root `~veilwick`. Custom LoRAs registered: `apps/web/src/lib/wavespeed.ts:46 CUSTOM_LORAS` = `1333923 (Wan POV Blowjob, 720x1280, version 2021242)` + `1428098 (COWGIRL + REVERSE COWGIRL, version 1700002)`; also `MMH3 MysticXXX 2856467` for H3 feed `768p 9:16 5s`.
> Related: `docs/storyboard-heat2-4.md` (VeilWick series S1–S6 Heat 2/3 clothed + Heat 4 placeholders 720x1280 5s), `docs/oss-prompts-mmh3-wan.md` (OSS camera/candid/POV, Wan canonical negative, H3 structure), `docs/prompts.md §5–§6`.

---

## 0. How this doc was scraped

### 0a. API fetch — Wan Video 14B t2v vs broader Wan NSFW

- Request as tasked: `GET https://civitai.com/api/v1/models?types=LORA&baseModel=Wan Video 14B t2v&sort=Most Downloaded&limit=10` + `Authorization: Bearer $CIVITAI_API_KEY`.
- Result 2026-09-01: the `baseModel=Wan Video 14B t2v` filter returns mostly SFW enhancers (Detailz-Wan, Lenovo UltraReal, FusionX, Candid Photography, Smartphone Snapshot, Instagirl, Detailer). NSFW Wan LoRAs live across `Wan Video 14B i2v 480p/720p`, `Wan Video 2.2 I2V-A14B/T2V-A14B/TI2V-5B`, not just the single `14B t2v` base — so a **second broader query** was run to find NSFW examples: `types=LORA + query=wan + nsfw=true + sort=Most Downloaded + limit=20`. That surfaces the NSFW corpus used below.
- Civitai key required: requests without `Bearer` return empty/rate-limited; `~/.secrets/civitai.env` (`CIVITAI_API_KEY=fe8256…`) was used per `.secrets/civitai.env` location (no project `.secrets/` dir).

### 0b. Second query — `query=wan + nsfw=true` top results (2026-09-01 snapshot)

| # | Model id | Name | Downloads | BaseModels |
|---|----------|------|-----------|------------|
| 1 | 1307155 | (wan 2.2 experimental) WAN General NSFW model | 393,238 | Wan Video 2.2 I2V-A14B, Wan Video 14B i2v 480p |
| 2 | 1331682 | Wan 2.2/2.1 POV Missionary | 239,641 | Wan Video 2.2 I2V-A14B/T2V-A14B, 14B i2v 480p, 14B t2v |
| 3 | 1350447 | Wan Cumshot | 114,449 | 14B i2v 480p, 2.2 T2V-A14B, 14B t2v |
| 4 | 1395313 | WAN DR34MJOB - Double/Single/Handy Blowjob | 114,678 | 2.2 I2V-A14B, 14B i2v 720p/t2v/480p |
| 5 | 1428098 | WAN COWGIRL + REVERSE COWGIRL — T2V & I2V LoRa **(registered in `wavespeed.ts`)** | 159,398 | 2.2 I2V-A14B/T2V-A14B/TI2V-5B, 14B i2v 720p/480p/t2v |
| 6 | 1337157 | Wan Cowgirl | 70,011 | 2.2 T2V-A14B, 14B i2v 480p |
| 7 | 1333923 | Wan POV Blowjob **(registered)** | 64,848 | 14B i2v 480p, 14B t2v |
| 8 | 1340403 | Wan 2.1 Deepthroat, Blowjob, Fellatio, Oral, T2V, I2V | 53,263 | 14B t2v |
| 9 | 1566648 | Wan I2V (2.2 & 2.1) - Assertive Cowgirl | 93,501 | 2.2 I2V-A14B, 14B i2v 480p |
| 10 | 1426284 | Wan 2.2 / Wan 2.1 - Anal Sex | 95,717 | 2.2 I2V-A14B, 14B t2v |
| 11 | 1361228 | Wan POV Doggy Style (i2v) | 28,204 | 14B i2v 480p |
| 12 | 1811313 | DR34ML4Y - All-In-One NSFW (WAN/LTX2) | 487,748 | LTXV 2.3 + Wan 2.2 family |

Method for per-model prompts: `GET /api/v1/model-versions/{versionId}` → `images[].meta.prompt / negativePrompt / cfgScale / steps / sampler`. Example pages also expose `trainedWords` (triggers). No web page scrape beyond API; `docs/civitai.md` did not exist — this doc is that artifact.

---

## 1. Table — Model | Example prompt (sanitized) | Camera | Negative | Tags | Use for Heat 4

> **Sanitization rule:** Heat 2–3 rows show sanitized phrasing verbatim. Heat 4 explicit prompts are **not stored** — cell reads **`scraped Heat 4 example - you fill via Anubis`** and notes the camera/POV pattern to reuse. Keep explicit detail in gitignored `docs/storyboard-heat4.local.md` or `~/.secrets/storyboard-heat4.md` via Anubis Mini 8B (`docs/storyboard-heat2-4.md §4b`).
> Resolution column kept as source reported; VeilWick Heat 4 targets `720x1280 9:16 vertical 5s` with H3 `image+last_image+loras` (or Wan FLF2V `first_frame→last_frame`) — adapt camera token verbatim.

| # | Model (Civitai id → version) | Example prompt — sanitized (Heat 2–3 kept, Heat 4 placeholder) | Camera | Negative | Tags | Use for Heat 4 |
|---|------------------------------|-----------------------------------------------------------------|--------|----------|------|----------------|
| **1** | **Wan POV Blowjob** — `1333923 → 2021242` (Wan Video 14B t2v, also i2v 480p v2021249) — **registered `CUSTOM_LORAS[1333923]`** | **Sanitized pattern:** `POV between legs of viewer, woman lying on stomach / kneeling between legs, head moves up/down or back/forth, looking at viewer / up at viewer, legs raised bare feet visible in background, bedroom / public bathroom setting, wearing beanie / yellow sundress + headband`<br><br>**Heat 4 cell:** `scraped Heat 4 example - you fill via Anubis` — source prompt is explicit; reuse only the POV geometry + gaze + setting tokens above and feed your Anubis expansion via `storyboard-heat2-4.md §4b` curl. | `POV true first-person eye level`, between legs / overhead view between legs, eye-level looking at viewer, static / slight head bob. Variants: `waist-height POV looking down`, `overhead POV`. Maps to OSS `camera_viewpoint: first-person, shot_scale: medium-close, focal-length 35mm`. | Wan canonical Zh negative (verbatim): `色调艳丽，过曝，静态，细节模糊不清，字幕，风格，作品，画作，画面，静止，整体发灰，最差质量，低质量，JPEG压缩残留，丑陋的，残缺的，多余的手指，画得不好的手部，画得不好的脸部，畸形的，毁容的，形态畸形的肢体，手指融合，静止不动的画面，杂乱的背景，三条腿，背景人很多，倒着走` (= EN `Bright tones, overexposed, static, blurred details, subtitles, worst quality, low quality, JPEG compression residue, deformed... still picture, messy background, three legs, many people, walking backwards`) | `concept, oral, sex, blowjob` — trainedWords `[]` (no trigger needed; prompt describes action in plain EN) | **Use for Heat 4 S3–S4 POV oral beats.** Take `CUSTOM_LORAS[1333923]` with H3 `image+last_image` stitch. Camera template for Heat 4 S4 Leap: `true first-person POV eye level, viewer hands soft foreground no HUD, subtle handheld breathing micro head bob, 35mm, vertical 720x1280, static or slow bob`. Keep VeilWick clothed tail for Heat 2–3; only in `heat4.local.md` add explicit after Anubis. |
| **2** | **WAN COWGIRL + REVERSE COWGIRL — T2V & I2V** — `1428098 → 2156392 (High Noise) / 2156435 (Low Noise)` — **registered `CUSTOM_LORAS[1428098]`** — Wan 2.2 I2V-A14B | **Sanitized pattern:** `r3v3rs3_c0wg1rl / c0wg1rl trigger + woman light brown / blonde, small breasts navel piercing, straddling position [Heat 4 explicit — scraped Heat 4 example - you fill via Anubis], hands grip hips from below, riding reverse cowgirl facing forward / cowgirl, legs spread wide, slight devilish smile / focused expression`<br><br>**Heat 4 cell:** `scraped Heat 4 example - you fill via Anubis` — source is explicit; keep `c0wg1rl / r3v3rs3_c0wg1rl` triggers + angle tokens, explicit anatomy omitted per sanitization. | **Low angle looking up at woman** — `slightly low angle looking up`, `low angle`. Settings: urban street night with neon (`red/blue NEON sign, parked cars, buildings lit windows`) / dim room fireplace (`warm light, wood shelf`). Lith: bright highlight bodies vs dim street / warm fireplace shadows. **Sampling:** `cfgScale 1, steps 8, sampler Euler` — low CFG is intentional for Wan 2.2 LoRA (keep `cfg 1` in prompt tail when using this LoRA). | None in image meta (empty) — fall back to Wan canonical negative above. OSS note: when using phone-snapshot triggers keep `JPEG compression residue` out of negative if you want grain. | `concept, cowgirl, reverse cowgirl, wan` — **trainedWords:** `r3v3rs3_c0wg1rl, c0wg1rl, straddling him in the reverse cowgirl position` | **Use for Heat 4 S3–S4 straddle variations.** Trigger discipline: include `r3v3rs3_c0wg1rl` OR `c0wg1rl` at prompt start. Camera template: `low-angle medium shot, eye-level or slightly below, vertical 720x1280, slow bob subtle handheld breathing, 35mm shallow DOF`. H3 stitch: `firstFrame = lastFrame of prior scene` keeps identity. Settings reuse Wan: neon street OR warm fireplace as background options. |
| **3** | **Wan 2.2/2.1 POV Missionary** — `1331682 → 2098405` — Wan 2.2 I2V-A14B | **Sanitized pattern:** `woman lying on back legs spread looking up at viewer, man above her between legs, thrust back and forth, movements fast with bouncing breasts, moaning`<br><br>**Heat 4 cell:** `scraped Heat 4 example - you fill via Anubis` | **POV from above** — `view is POV from above`, eye-level above subject. `medium shot eye level` from viewer perspective. Matches VeilWick S4 Leap `true first-person POV eye level, viewer hands soft foreground`. | Wan canonical Zh negative (same as #1). | `concept, pov, missionary, sex` — trainedWords `[]` | **Use for Heat 4 S4 Leap POV missionary.** Camera template: `POV from above / true first-person POV eye level`. Borrow `movements fast with bouncing` as motion token; for Heat 4 keep motion phrasing but generate via Anubis to stay local. |
| **4** | **WAN DR34MJOB - Double/Single/Handy Blowjob** — `1395313 → 2235288` — Wan 2.2 I2V-A14B | **Triggers only:** `bl0wj0b`, `d0ubl3_bj`<br><br>**Heat 4 cell:** `scraped Heat 4 example - you fill via Anubis` — source images store only trigger word as prompt (explicit detail is in LoRA weight, not prompt). | Prompt is trigger-only → camera is whatever `image+last_image` provides in I2V mode. T2V fallback: describe POV between-legs as in #1. | No negative stored in meta (uses Wan canonical). | `action, blowjob, wan, double blowjob` — **trainedWords:** `bl0wj0b, d0ubl3_bj` | **Use for Heat 4 multi-angle oral.** Include `bl0wj0b` (single) or `d0ubl3_bj` (double) at prompt start. Because LoRA is trigger-driven, you can keep the rest of the prompt clothed/cinematic and still get the motion — minimal prompt = more identity lock. |
| **5** | **Wan 2.1 Deepthroat / Blowjob / Fellatio / Oral (T2V, I2V)** — `1340403 → 1513684` — Wan Video 14B t2v | **Sanitized pattern:** `blowjob, deepthroat triggers. beautiful woman ginger hair updo / blonde hair wedding dress cleavage, lower body side-visible [Heat 4 explicit — scraped Heat 4 example - you fill via Anubis], bobbing head motion`<br>**Settings:** `tan highway patrol uniform sunglasses kneeling desert road + car` / `wedding dress kneeling church people + confetti in background` — costume + location do work<br><br>**Heat 4 cell:** `scraped Heat 4 example - you fill via Anubis` | Descriptive side-angle `lower body slightly visible to side`, kneeling eye-level. Uniform / wedding dress as **costume cue** for Heat 4 (see Use column). `handheld breathing` not stated — assume static per prompt. | Wan canonical Zh + `3d 渲染、视频游戏` (= `3d render, video game`) tail. | `concept, oral, fellatio, deepthroat, blowjob, nsfw` — **trainedWords:** `blowjob, deepthroat` | **Use for Heat 4 S3 Temptation costume beats.** The two Civitai example prompts are the clearest candid/realism lesson: **costume + location do the erotic work** — `highway patrol uniform + desert road` vs `wedding dress + church + confetti`. For VeilWick Heat 4, map costume to storyboard linen variants per `storyboard-heat2-4.md §2–§3` rather than explicit nudity. |
| **6** | **Wan POV Doggy Style (i2v)** — `1361228 → 1545040` — Wan Video 14B i2v 480p | **Sanitized pattern:** `POVdog trigger. professionally shot POV video [Heat 4 explicit — scraped Heat 4 example - you fill via Anubis], movement and bounce emphasized, she looks back in pleasure, steady shot / space ship outer space slowly moving background`<br><br>**Heat 4 cell:** `scraped Heat 4 example - you fill via Anubis` | **POV doggy** — `professionally shot POV`, `steady shot` (no shake), `ass movement and bounce emphasized`. Trained for **I2V only** ("not tested on T2V"). Setting shifts: `outer space ship` / minimal. `looking back at man in pleasure` = gaze cue. **Sampling:** `steps 30, cfgScale 6, sampler UniPC` — more steps/higher CFG than cowgirl. | Wan canonical Zh + `3d 渲染、视频游戏`; second image meta lists `Default wan neg prompt`. | `concept, pov, video, wan, doggie style` — **trainedWords:** `POVdog, A POV video showing man having sex doggy style sex with a woman.` | **Use for Heat 4 S3–S4 rear-angle.** Trigger: `POVdog` at start + `A POV video showing…` sentence. Camera: `POV steady shot, ass movement emphasized` → adapt to VeilWick as `handheld breathing + low-angle over-shoulder POV` for clothed Heat 2–3, explicit via `heat4.local.md`. Note artifacts warning from Civitai page: "artifacts on ass due low-res data" — prefer 720p I2V where possible. |
| **7** | **Wan 2.2 / Wan 2.1 - Anal Sex** — `1426284 → 2161023` — Wan 2.2 I2V-A14B | **Sanitized pattern:** `trainedWords: anal sex + [Heat 4 explicit — scraped Heat 4 example - you fill via Anubis], breasts bouncing motion, moaning cue`<br>`nsfwsks, Score_9, score_8_up, masterpiece, sharp, high resolution` tail<br><br>**Heat 4 cell:** `scraped Heat 4 example - you fill via Anubis` | Not stated in prompt (implied medium shot). Add camera explicitly when adapting — use `low-angle medium shot` or `high-angle close-up looking back`. | No negative stored (image meta empty). Use Wan canonical. Tag suffix `nsfwsks, Score_9, score_8_up, masterpiece` is a Civitai quality booster — can reuse as `masterpiece, sharp, high resolution, photorealistic 8k` per `oss-prompts-mmh3-wan.md` Wan path. | `action, anal sex` — **trainedWords:** `anal sex` | **Use for Heat 4 latter half (S5–S6).** Minimal prompt + `nsfwsks + Score_9 + masterpiece` pattern is a reusable quality suffix. For VeilWick, prefer Heat 2–3 `photorealistic 8k, shallow DOF f/2.0 35mm` suffix instead unless testing this LoRA. |
| **8** | **(wan 2.2 experimental) WAN General NSFW model** — `1307155 → 2073605` — Wan 2.2 I2V-A14B | **Sanitized pattern:** `Very high quality 4k drawn animation, nsfwsks, [Heat 4 explicit — scraped Heat 4 example - you fill via Anubis], very seductive behavior, [extra cue] floating hearts near end, ahegao with heavy breathing (animation style — do not use for VeilWick photoreal)`<br>Examples: `doggystyle from behind [explicit — scraped Heat 4 example - you fill via Anubis], hips rocking breasts bounce turns head away, floating hearts, rat tail red tip` / `straddling bouncing [explicit — scraped Heat 4 example - you fill via Anubis], pov hand grabs breasts, ahegao heavy breathing, heart pupils`<br><br>**Heat 4 cell:** `scraped Heat 4 example - you fill via Anubis` — these prompts are animation-leaning, not photorealistic. | Animation-leaning — `4k drawn animation` (not VeilWick photorealistic 8k). Camera: `doggystyle from behind` / `straddling POV hand grabs breasts`. Hearts/pupils are anime effects to omit for VeilWick realism. | No negative stored. | `[]` — no trainedWords; quality cue `nsfwsks` | **Use only as negative lesson for Heat 4 realism.** This LoRA's example prompts are **drawn animation** (`floating hearts, ahegao, heart-shaped pupils`) — opposite of VeilWick `photorealistic 8k, natural skin pores, 35mm`. If using this LoRA, override with `photorealistic 8k, shallow DOF, soft natural daylight, teal shadows lifted, cinematic_warm LUT` tail to steer photoreal. |
| **9** | **Wan I2V (2.2 & 2.1) - Assertive Cowgirl** — `1566648 → 2129122` — Wan 2.2 I2V-A14B | **Sanitized pattern:** `photorealistic image of woman straddling [Heat 4 explicit — scraped Heat 4 example - you fill via Anubis], assertive dominant, moves quickly energetically squatting, hips move quickly [explicit — scraped Heat 4 example - you fill via Anubis], vigorously slams hips down, serious / angry expression looking at camera, leans in, sharp focus [explicit motion — scraped Heat 4 example - you fill via Anubis]`<br>Variants: `takes off hat waves like cowboy hollaring screaming cowboy` / `it is raining`<br><br>**Heat 4 cell:** `scraped Heat 4 example - you fill via Anubis` | Assertive dominant framing — `straddling squatting`, `leans in looking at camera`, `sharp focus`, `quickly moving hips up/down`. Energy adverb heavy: `quickly, energetically, vigorously, slams`. Rain as environmental imperfection (matches OSS candid `env imperfection with cause`). | No negative stored. | Not tagged beyond name; photorealistic trigger via prompt words | **Use for Heat 4 dominant-energy beats.** **Energy lexicon** to borrow: `assertive, dominant, eagerly, quickly, energetically, vigorously slams, squatting`. Borrow `rain` / `hat wave hollaring` as candid imperfections with cause (OSS `one behavioral + one capture + one env`). For VeilWick, replace explicit anatomy with `clothed straddle, hip rhythm subtle` for Heat 3; explicit via Anubis local. |
| **10** | **DR34ML4Y All-In-One NSFW (WAN/LTX2)** — `1811313 → 2950842` — LTXV 2.3 + Wan 2.2 family | **Triggers:** `m15510n4ry, bl0wj0b, d0ubl3_bj, d0gg1e`<br>**Example prompts in meta:** `bl0wj0b` / `m15510n4ry` (single trigger)<br><br>**Heat 4 cell:** `scraped Heat 4 example - you fill via Anubis` | All-in-one multi-trigger — camera per trigger (missionary / blowjob / doggy). No camera in trigger-only prompt; pair with Wan camera tokens at generation time. | No negative stored. | `concept, oral, pov, missionary, sex, blowjob, nsfw, doggy, wan` — **trainedWords:** `m15510n4ry, bl0wj0b, d0ubl3_bj, d0gg1e` | **Use for Heat 4 multi-act series.** If renting one LoRA for full S1–S6 arc, this is the broadest. Triggers are leet-speak: `m15510n4ry` = missionary, `d0gg1e` = doggy — switch trigger per scene `S3→m15510n4ry, S4→bl0wj0b, S5→d0gg1e`. Pair with per-scene camera from table #1–#3, #6. |

---

## 2. What to steal for VeilWick Heat 4 (camera / candid / realism / POV)

> All patterns below are **sanitized** — they describe framing, light, and motion without storing explicit acts. Copy verbatim into Heat 2–3; for Heat 4 append via Anubis.

### 2a. Camera angles — Civitai Wan NSFW vs OSS vocab

| Pattern from Civitai examples | OSS mapping (`oss-prompts-mmh3-wan.md`) | How to write in VeilWick `720x1280 5s` prompt |
|-------------------------------|----------------------------------------|------------------------------------------------|
| `POV between legs / overhead between legs` (#1) | `camera_viewpoint: first-person, shot_scale: medium-close` | `true first-person POV eye level, viewer's hands soft foreground no HUD, natural handheld subtle head bob with breathing, 35mm, vertical 720x1280, shallow depth f/2.0 bokeh` |
| `low angle looking up at woman` (#2, #9) | `camera_angle: low-angle, shot_scale: medium` | `low-angle medium shot looking up, waist-height, vertical 720x1280, slow bob subtle handheld breathing, 35mm` |
| `POV from above` (#3) | `high-angle slightly above, viewpoint first-person` | `POV from above, eye-level above subject, medium shot, vertical 720x1280, static or slow bob` |
| `ass movement bounce emphasized, steady shot` (#6) | `shot_scale MCU, motion cue in prompt + negative Wan still picture` | `medium close-up from behind, ass movement bounce emphasized, steady shot (for I2V) or subtle handheld breathing (for H3)` |
| `kneeling side-visible lower body, desert / church` (#5) | `eye-level medium, location drives story` | `eye-level medium shot kneeling, side-visible lower body cue, vertical 720x1280, soft warm light diffused golden` |
| `straddling squatting, leans in, sharp focus` (#9) | `medium shot, focal-length 35mm sharp` | `medium shot straddling squatting, leans in looking at camera, sharp focus, quick hip rhythm` |
| `handheld 0.7x slow-mo` (not in these LoRAs, OSS §6b crisis motion) | Keep for crisis-only per `prompts.md §6b` | Do not use in these tables — reserve for Heat 4 S5 retreat interruption |

**One variable per scene** (`storyboard-heat2-4.md` rule: location OR light OR distance, not all three) still holds — camera table above is the menu, not a stack.

### 2b. Candid / realism phrasing — what Civitai examples actually do

- **Trigger + setting, not endless adjectives.** Cowgirl (#2) uses `r3v3rs3_c0wg1rl + 1-sentence anatomy + 2-sentence setting (neon street OR fireplace room)`; Deepthroat (#5) uses `blowjob, deepthroat + hair/costume + setting (desert road OR church)`. That is the **OSS "one behavioral + one capture + one env imperfection with cause"** recipe — e.g. `navel piercing + neON sign bokeh + low angle` or `ginger updo + sunglasses + desert road`.
- **Phone-realism is NOT in these NSFW LoRAs** — they are studio 8k / sharp focus. For candid `RAW iPhone 26mm / compression artifacts / low-light grain` use `oss-prompts-mmh3-wan.md §1 Smartphone Snapshot` tags, and **remove `JPEG compression residue` from negative** when you prompt phone grain (per OSS gap #1). These Civitai negatives keep `JPEG压缩残留` because they are studio path.
- **Noise Trap:** do not stack `RAW iPhone + cinematic masterpiece + 8k ultra sharp + heavy grain ISO 3200` — Civitai doggy warning about ass artifacts is literally low-res data + over-sharpening. Prefer `photorealistic 8k, natural skin pores + peach fuzz, fabric weave, volumetric dust motes` + light grain `ISO <800` if candid.
- **Motion verbs beat filter stack:** Civitai prompts repeat `thrust back and forth, bouncing breasts, bobbing head, slams hips, slides in and out from tip to base, moaning` — that is the OSS "event, not arrangement" rule. For Heat 2–3 sanitize to `soft smile held one beat, sleeve half-slipped, hand mid-gesture not yet at handle, breath sync`.

### 2c. POV phrasing — bank to reuse

- `true first-person POV, eye level, viewer's hands soft foreground holding tote / resting on table, no HUD no UI, natural handheld subtle head bob with breathing, 35mm lens feel, vertical 720x1280, shallow depth, eye contact` — Civitai #1, #3, #6 all use this shape; VeilWick S4 Leap already matches (`storyboard-heat2-4.md §3 S4`).
- Variants: `POV from above looking down between legs` (#3) / `POVdog doggy from behind looking back in pleasure` (#6) / `over-shoulder POV, subject looking at viewer, hand extended toward camera` (OSS row) / `POV walking slowly toward subject micro head bob from footsteps` (OSS).
- For H3 R2V: declare role explicitly per `oss-prompts-mmh3-wan.md` — `@图片1: 人物身份参考 — keep face/hair/linen consistent; @图片2: 首帧 door reference` + add `camera_viewpoint: first-person` in 贯穿要求.

### 2d. Negative prompts — Wan canonical vs VeilWick extension

- **Wan canonical (Zh):** `色调艳丽，过曝，静态，细节模糊不清，字幕，风格，作品，画作，画面，静止，整体发灰，最差质量，低质量，JPEG压缩残留，丑陋的，残缺的，多余的手指，画得不好的手部，画得不好的脸部，畸形的，毁容的，形态畸形的肢体，手指融合，静止不动的画面，杂乱的背景，三条腿，背景人很多，倒着走`
- **EN mirror (Diffusers + fal.ai):** `Bright tones, overexposed, static, blurred details, subtitles, style, works, paintings, images, static, overall gray, worst quality, low quality, JPEG compression residue, ugly, incomplete, extra fingers, poorly drawn hands, poorly drawn faces, deformed, disfigured, misshapen limbs, fused fingers, still picture, messy background, three legs, many people in the background, walking backwards`
- **VeilWick appendix (Heat 2–3):** append `nude, naked, topless, explicit, genitalia, cartoon, illustration, anime, 3d render, cgi, plastic skin, duplicate, watermark` — for Heat 4 explicit generation, **remove** `nude/naked/explicit` from negative and keep the rest.
- **Add for I2V sharpness:** `#5` adds `3d 渲染、视频游戏` / `#7` adds `nsfwsks, Score_9, score_8_up, masterpiece, sharp, high resolution` — reuse as `masterpiece, photorealistic 8k, sharp focus` positive instead of negative dilution.

### 2e. Sampling params observed (copy into H3/Wan tails)

| LoRA | cfgScale | steps | sampler | Notes for VeilWick |
|------|----------|-------|---------|--------------------|
| COWGIRL 1428098 | **1** | 8 | Euler | Wan 2.2 LoRA low CFG — keep `cfg 1` in prompt tail; high CFG breaks this LoRA |
| POV Doggy 1361228 | 6 | 30 | UniPC | Higher cfg + steps for detail; use `UniPC 30 / cfg 6` tail with `POVdog` |
| Others (1333923, 1331682, 1340403) | not set / 6 | 28–30 | dpmpp_2m / UniPC | VeilWick house `steps 28, CFG 6.5, sampler dpmpp_2m` per `oss-prompts §3` — compatible default when sampler not locked |

H3 feed uses Wavespeed `steps 28, CFG 6.5, sampler dpmpp_2m, LUT cinematic_warm.cube` (`wavespeed.ts` head comment) — do not copy Wan Euler tails into H3 path; keep per-model tails as noted above only for Wan library path (`Wan 2.7 image-to-video / FLF2V`).

---

## 3. Keep prompts sanitized — Heat 2–3 vs Heat 4 split

- **Heat 2–3 (clothed, non-explicit 720x1280 5s):** prompts in this doc are sanitized patterns (costume + setting + gaze + camera). No explicit anatomy/act verbs stored. They match `storyboard-heat2-4.md §2–§3` style (`synthetic adult woman 18+ clothed in cream knit co-ord / sage linen shirt…`).
- **Heat 4 (explicit 720x1280 5s):** source Civitai prompts that are explicit are **not quoted** — cell reads `scraped Heat 4 example - you fill via Anubis`. To reconstruct, run `docs/storyboard-heat2-4.md §4b` curl against `Anubis Mini 8B` (Vast `ssh6.vast.ai:24552` tunnel `localhost:8080` or Dell local `TheDrummer/Anubis-Mini-8B-GGUF` Q4_K_M ~4.9 GB, `llama-server --ctx-size 8192 --n-gpu-layers 99 --parallel 2 --flash-attn on`, `ANUBIS_BASE_URL=http://localhost:8080/v1`). Save output to gitignored `docs/storyboard-heat4.local.md` or `~/.secrets/storyboard-heat4.md` — **never commit** (ignored via `*.local.md`).
- **Commit hygiene:** this file `docs/civitai-wan-examples.md` itself is local-only by policy (header warns). If you must version it, ensure explicit cells stay as placeholder; extended Heat 4 prompts live only in `*.local.md` / `~/.secrets/`.

---

## 4. How to use with VeilWick Heat 4 storyboard (S1–S6, 720x1280 5s H3 stitch)

Map Civitai camera/trigger patterns to `storyboard-heat2-4.md §4a` placeholders (6 blocks, each `PASTE YOUR HEAT 4 PROMPT HERE 720x1280 5s explicit`):

| Scene | Storyboard beat | Civitai camera/POV to reuse | Trigger if renting LoRA | Prompt skeleton (call via Anubis) |
|-------|-----------------|------------------------------|-------------------------|-----------------------------------|
| S1 Setup | B1 Adoration / P1 | #1 POV between legs overhead variant + doorway lean (static) | none / `CUSTOM_LORAS[1333923]` if oral setup | `cinematic, synthetic adult woman 18+ clothed in cream knit co-ord + linen robe open, sunlit hallway doorway lean, gentle eye contact held one beat, vertical 720x1280 5s static locked tripod, photorealistic 8k shallow DOF f/2.0 35mm soft daylight teal shadows lifted cinematic_warm LUT — Anubis appends explicit after you` |
| S2 Tension | B3 No-way / P2 | #2 low-angle + doorway hesitation, slow bob handheld breathing | `c0wg1rl` (cowgirl tension foreshadow) or none | `... doorway hesitation folded laundry buffer, slow bob subtle handheld breathing micro head bob, over-shoulder eye-level, soft warm diffused window golden` |
| S3 Temptation | B5 | #5 costume (uniform/wedding) + #9 assertive energy `quickly energetically vigorously` | `r3v3rs3_c0wg1rl` / `blowjob, deepthroat` per chosen act | `high-angle close-up 35mm face+shoulders, direct gaze consent line "Is this okay? Tell me if you want to pause.", slow bob handheld breathing` |
| S4 Leap | B6 | #3 POV from above + #6 POVdog steady + #1 true first-person viewer hands foreground | `POVdog` / `m15510n4ry` / `bl0wj0b` | `true first-person POV eye level viewer hands soft foreground no HUD, lean-in breath sync "Breathe with me — slow. Don't look away.", static locked tripod` |
| S5 Retreat | B7 | OSS `handheld 0.7x slow-mo` crisis pull-back (not in Civitai table) + #7 thrust rhythm as contrast | none (consent reset) | `waist-height medium eye-level static, window flare light shift, pull-back solo beat, consent reset "We go at your pace. Nod if you're with me."` |
| S6 Afterglow | B8+12 HEA | #9 rain / hat-wave candid env imperfection + #2 fireplace warm light | `c0wg1rl` callback or none | `pull wide soft focus tagline, gentle push-in slow bob breathing, golden-hour boosted golds cinematic_warm.cube, poster frame 1.2s` |

Stitch rule unchanged: `S(n).lastFrame → S(n+1).firstFrame` via H3 `image + last_image + loras: [{path, scale:1}] + prompt + duration:5 + resolution:768p` (`wavespeed.ts:370 generateH3ImageToVideoLora`). Series metadata: `your-new-stepsister-e1-heat2/3/4` compilations, `wavespeed.ts:446 STORYBOARD_HEAT2_4` map.

**Anubis curl (local, S3 example — repeat for S1,S2,S4,S5,S6, save to `*.local.md`):**

```bash
curl -s http://localhost:8080/v1/chat/completions -H "Content-Type: application/json" -d '{
  "model": "Anubis-Mini-8B-Q4_K_M",
  "messages": [
    {"role": "system", "content": "You are VeilWick prompt assistant. Output ONLY a single H3 image-to-video prompt string (720x1280 5s vertical 9:16). Keep tokens: synthetic adult woman 18+ clothed, vertical 9:16 720x1280, 5s duration, photorealistic 8k, shallow DOF f/2.0 35mm. Do not add commentary."},
    {"role": "user", "content": "Expand this VeilWick Heat 3 prompt to explicit Heat 4 (720x1280 5s) for S3 Temptation (B5): cinematic, synthetic adult woman 18+ clothed in sage linen shirt and wide ecru trousers, bedroom plant folded linens, soft hand-on-shoulder hair-tuck gentle eye contact intentional touch without nudity, vertical 9:16 720x1280, 5s duration, slow bob handheld breathing, photorealistic 8k shallow depth f/2.0 35mm soft warm diffused window golden cinematic_warm LUT, firstFrame /storyboard/pick-your-new-stepsister-e1-last.jpg. Use camera: high-angle close-up 35mm direct gaze. Civitai pattern to reuse: reverse cowgirl trigger r3v3rs3_c0wg1rl low-angle looking up (model 1428098). Output ONE line starting with cinematic, synthetic adult woman 18+ and ending with 720x1280."}
  ],
  "temperature": 0.85,
  "max_tokens": 512
}' | jq -r '.choices[0].message.content' | tee /tmp/anubis-heat4-s3.txt
cat /tmp/anubis-heat4-s*.txt > docs/storyboard-heat4.local.md  # gitignored
```

---

## 5. Sources & verification

- **Civitai API** — `GET /api/v1/models`, `GET /api/v1/models/{id}`, `GET /api/v1/model-versions/{versionId}` with `Authorization: Bearer $CIVITAI_API_KEY`. Responses include `images[].meta.prompt/negativePrompt/cfgScale/steps/sampler` + `modelVersions[].trainedWords/baseModel`. Scraped 2026-09-01; metadata snapshot in §0.
- **Registered VeilWick LoRAs** — `apps/web/src/lib/wavespeed.ts:46 CUSTOM_LORAS 1333923 / 1428098` verified 2026-09-01 (file read). `MMH3 2856467 v3266628 /tmp/MysticXXX_MMH3-V4.safetensors` line 215.
- **Storyboard** — `docs/storyboard-heat2-4.md` read 2026-09-01 (6×5s, Heat 2–3 clothed, Heat 4 6 placeholders `PASTE YOUR HEAT 4 PROMPT HERE 720x1280 5s explicit`, Anubis Mini 8B `vast-anubis-rental.md` pipeline).
- **Secrets** — `CIVITAI_API_KEY` at `~/.secrets/civitai.env` (`CIVITAI_API_KEY=fe8256…`, 49B file), no project `.secrets/` dir — do not move key into repo.
- **`docs/civitai.md`** did not exist at scrape time — this doc is that record.
- **OSS cross-check** — `docs/oss-prompts-mmh3-wan.md` camera grammar (7 shot_scale, 6 angle, 3 viewpoint, 4 focal), H3 Golden Formula, Noise Trap ISO<800, Wan canonical negative, guide `guidance_scale 5.0 / flow_shift 5.0 @720p`.

> **Next:** run `§4` Anubis curls per scene (S1–S6) with tunnel `ssh -p 24552 root@ssh6.vast.ai -L 8080:localhost:8080` + `llama-server` (`vast-anubis-rental.md §2–§4`), collect into `docs/storyboard-heat4.local.md` (gitignored) or `~/.secrets/storyboard-heat4.md`, paste each line into `storyboard-heat2-4.md §4a` placeholder token. Verify engine reads via `wavespeed.ts:446 STORYBOARD_HEAT2_4` map before `generateH3ImageToVideoLora`.

