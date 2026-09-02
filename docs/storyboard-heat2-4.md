# VeilWick Storyboard — Your New Stepsister E1 · Heat 2 / Heat 3 / Heat 4

> **Scope:** 6 scenes × 3 heat variants for **Your New Stepsister E1 — Unpacking** (30s, 6×5s). All characters synthetic adult woman 18+ consensual, fictional, no real persons. Heat 2–3 are **fully clothed, non-explicit, local only** (Wavespeed H3 768p → 720×1280) — 12 prompts fully written. **Heat 4 is T2I placeholder only — 12 prompts (6 scenes × first_frame + last_frame)** — you fill via **Anubis Mini 8B on Vast/Dell** (see §4a) and generate stills via `alibaba/wan-2.7/text-to-image --size 720*1280` (see §4c), not generated here. Source beats: `docs/prompts.md` §2a/§2b/§2c/§5b/§5c, `docs/e2-prompts.md` §2–§3, `apps/web/app/prototype-scenes/client.tsx` SCENES[0–5] (+ `heat4FirstFrameT2iPrompt`/`heat4LastFrameT2iPrompt`), `docs/oss-prompts-mmh3-wan.md` §1, `docs/nsfw-foundation.md` §3.
> Engine: `apps/web/src/lib/wavespeed.ts` `H3_IMAGE_TO_VIDEO_LORA 768p 5s $0.25` `image + last_image + loras` + `FEED_CATEGORIES` mapping (see §5).

---

## 0. Episode metadata (mirrors prototype-scenes/client.tsx)

| Field | Value |
|---|---|
| **Episode** | `your-new-stepsister-e1` — *Your New Stepsister E1 — Unpacking* |
| **Logline** | First day in a blended house. Boxes in the hall, a doorway shared, and a look that lingers a second too long. Heat 2–3, fully clothed, wellness/fashion — tension through proximity, not nudity. |
| **Tagline** | `Some house rules are meant to be broken.` |
| **Duration** | 30s nominal (6×5s) → 31.08s actual with H3 padding (5.166667s per clip) |
| **Resolution** | `720×1280 9:16 vertical` — request `768p 768×1344` then `ffmpeg scale=720:1280:flags=lanczos` (generation-log §11) |
| **Model** | `wavespeed-ai/minimax-h3/image-to-video-lora` — `duration:5` `resolution:768p` `image`+`last_image` stitch + optional `loras: [{path,scale:1}]` |
| **Heat** | Heat 2 = fade-to-black clothed (suggestive, proximity/gaze/light), Heat 3 = intentional touch clothed (shoulder, hair tuck, breath sync — no nudity), Heat 4 = explicit **T2I placeholder** 12 prompts (6× first_frame + last_frame) `PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280` → `alibaba/wan-2.7/text-to-image --size 720*1280` → H3 `image+last_image` (you fill via Anubis Mini 8B, §4a/§4c) |
| **Stills (verified 720×1280)** | `public/storyboard/pick-your-new-stepsister-e1-first.jpg` (50 KB), `pick-your-new-stepsister-e1-last.jpg` (50 KB), `pick-your-new-stepsister-e1-poster.jpg` (179 KB) — `sips -g pixelWidth/pixelHeight → 720×1280` + `apps/web/public/storyboard/` mirror |
| **Negative (Heat 2–3)** | `low quality, blurry, deformed, cartoon, illustration, anime, 3d render, cgi, plastic skin, oversaturated, duplicate, watermark, nude, naked, topless, explicit, genitalia, nsfw act, jpeg artifacts` |
| **Style** | `photorealistic 8k, shallow DOF f/2.0 35mm, soft studio + teal fill + lifted blacks S-curve cinematic_warm LUT` — `docs/prompts.md` §5c |

Stitch rule (all heats): `S(n).lastFrame → S(n+1).firstFrame` via H3 `image` + `last_image`. Beat spine: `setup (B1) → tension (B3) → temptation (B5) → leap (B6) → retreat (B7) → afterglow (B8+12)` — `docs/prompts.md` §2a compressed to 6×5s, one variable shifts per scene (location OR light OR distance, not all three).

---

## 1. Overview table — 6 scenes × 3 heats

| Scene | Time | Beat / Phase | Heat 2 — fade-to-black clothed (this file, full prompt) | Heat 3 — intentional touch clothed (this file, full prompt) | Heat 4 — explicit T2I placeholder (you fill via Anubis Mini 8B → `wan-2.7/text-to-image 720*1280`) |
|---|---|---|---|---|---|
| **S1 Setup** | 0:00–0:05 | B1 Adoration / P1 Exposition | ✅ `cream knit co-ord + linen robe` doorway lean, **no touch**, eye contact holds one beat then soft smile — light carries tension | ✅ same frame, **hand hovers near tote handle, sleeve half-slipped** — mutual gaze, consent-neutral proximity | Heat 4 T2I — `first_frame` + `last_frame` placeholders — see §4a S1 first/last |
| **S2 Tension** | 0:05–0:10 | B3 No-way / P2 Tease | ✅ folded laundry as buffer, doorway hesitation, breathy stillness — **shared frame, no touch** | ✅ laundry held closer, **fingers brush tote strap**, hesitant glance holds longer | Heat 4 T2I — `first_frame` + `last_frame` — see §4a S2 first/last |
| **S3 Temptation** | 0:10–0:15 | B5 Temptation / P2→3 Tease→Escalation | ✅ closer frame, soft smile, **proximity without touch** — vulnerability disclosure | ✅ **hand on shoulder → hair tuck**, eye contact, consent line "Is this okay? Tell me if you want to pause." | Heat 4 T2I — `first_frame` + `last_frame` — see §4a S3 first/last |
| **S4 Leap** | 0:15–0:20 | B6 Leap — Choose risk / P3 Escalation | ✅ lean-in across counter, breath sync whisper "stay — just a minute longer" — **close but no embrace** | ✅ **lean-in closer + viewer hands soft foreground**, whisper "Breathe with me — slow. Don't look away." — intentional proximity | Heat 4 T2I — `first_frame` + `last_frame` — see §4a S4 first/last |
| **S5 Retreat** | 0:20–0:25 | B7 Retreat / P4 Climax proxy (emotional) | ✅ pull-back, look away, phone buzz / window flare — **consent reset** | ✅ same pull-back but **lingering hand release**, window light shift — "We go at your pace." | Heat 4 T2I — `first_frame` + `last_frame` — see §4a S5 first/last |
| **S6 Afterglow** | 0:25–0:30 | B8 Fall + B12 HEA / P5 Afterglow/Tag | ✅ soft sheets, **clothed embrace laugh**, pull wide, tagline moment | ✅ **clothed embrace + gentle hair-tuck callback**, laugh, warm LUT — "You're still here. Good." | Heat 4 T2I — `first_frame` + `last_frame` — see §4a S6 first/last |

> Verify per scene — **Heat 2/3 fully written, Heat 4 T2I placeholders**: 6 Heat 2 prompts in §2 + 6 Heat 3 prompts in §3 (all `720x1280 5s` clothed, 12 total) + 12 Heat 4 T2I placeholders in §4a (6 scenes × first_frame + last_frame, each `PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280`). Mirrors `client.tsx` `SCENES[n].heat4FirstFrameT2iPrompt` / `heat4LastFrameT2iPrompt`.

---

## 2. Heat 2 — fade-to-black clothed (6 full prompts, 720×1280 5s vertical)

> Heat 2 discipline: suggestive but fully clothed, no intentional touch beyond shared frame, no embrace. Light/gaze/proximity carry charge. `fade-to-black` ceiling per `docs/prompts.md` §4. One variable shifts per scene vs S1.

### S1 — Setup · Heat 2

| Field | Value |
|---|---|
| **Beat / Phase** | B1 Adoration / P1 Exposition |
| **Erotic escalator** | Proximity: distance → shared frame (hallway threshold) — no touch |
| **Camera** | `waist-height medium shot, eye level, static camera locked tripod no movement` |
| **POV** | `over-shoulder (viewer as new housemate, eye-level)` |
| **Lighting** | `bright daylight — clean natural window bounce, soft shadows, high key` + `teal shadows lifted cinematic_warm LUT` |
| **Duration / Res** | `5s · 720×1280 9:16 vertical` · `slow bob: no` · `static` |
| **Tags** | `forbidden-domestic, eye-contact, linen loungewear, clothed, Heat 2, eye-level, soft-natural-daylight` |
| **firstFrame → lastFrame** | `/storyboard/pick-your-new-stepsister-e1-first.jpg` → `/storyboard/pick-your-new-stepsister-e1-first.jpg` |
| **Compilation** | `your-new-stepsister-e1-heat2` |

**Prompt (Heat 2, copy/paste H3):**
```
cinematic, synthetic adult woman 18+ clothed in cream knit co-ord and soft linen robe open over loungewear, sunlit hallway with stacked moving boxes and doorway, gentle eye contact across threshold, doorway lean soft smile one beat held then soft glance away, warm domestic palette, tactile linen weave, vertical 9:16 720x1280, 5s duration, static camera locked tripod no movement, photorealistic 8k, shallow depth of field f/2.0 35mm lens, soft natural daylight bright window bounce, teal shadows lifted cinematic_warm LUT, natural skin texture detailed pores, volumetric dust motes, shallow DOF bokeh, suggestive but clothed wellness Heat 2 fade-to-black — negative: low quality, blurry, deformed, cartoon, illustration, anime, 3d render, cgi, plastic skin, oversaturated, duplicate, watermark, nude, naked, topless, explicit, genitalia, nsfw act, jpeg artifacts — steps 28, CFG 6.5, sampler dpmpp_2m, LUT cinematic_warm.cube — compilation: your-new-stepsister-e1-heat2 | tags: forbidden-domestic, eye-contact, clothed, Heat 2, eye-level, soft-natural-daylight | duration: 5s | camera: static | res: 720x1280 9:16 | Audio: soft room tone, hallway ambient, non_diegetic_music: N/A
```

---

### S2 — Tension · Heat 2

| Field | Value |
|---|---|
| Beat / Phase | B3 No-way / P2 Tease |
| Escalator | Proximity: shared frame, no touch (folded laundry buffer) — hesitation |
| Camera | `waist-height medium shot, eye level, soft bokeh foreground, slow bob subtle handheld with breathing micro head bob` |
| POV | `handheld breathing, over-shoulder` |
| Lighting | `soft warm — diffused window golden + coral domestic, teal shadows lifted` |
| Duration / Res | `5s · 720×1280 9:16` · `camera: slow bob` |
| Tags | `tension, folded-laundry, doorway-hesitation, clothed, Heat 2, soft-warm, handheld-breathing` |
| firstFrame → lastFrame | `/storyboard/pick-your-new-stepsister-e1-first.jpg` → `/storyboard/pick-your-new-stepsister-e1-last.jpg` |
| Compilation | `your-new-stepsister-e1-heat2` |

**Prompt (Heat 2):**
```
cinematic, synthetic adult woman 18+ clothed in ecru knit co-ord holding folded laundry by bedroom doorway, hesitant glance holding folded tee doorway hesitation, soft sheets bedroom background, breathy stillness one breath between beats "You're closer than I expected.", no touch laundry as buffer, vertical 9:16 720x1280, 5s duration, slow bob subtle handheld with breathing micro head bob, photorealistic 8k, shallow depth of field f/2.0 35mm, soft warm light diffused window golden + teal shadows lifted cinematic_warm LUT, over-shoulder POV eye level, tactile linen weave, clothed wellness Heat 2 fade-to-black — negative: low quality, blurry, deformed, cartoon, illustration, anime, 3d render, cgi, plastic skin, oversaturated, duplicate, watermark, nude, naked, topless, explicit, genitalia, nsfw act, jpeg artifacts — steps 28, CFG 6.5 — compilation: your-new-stepsister-e1-heat2 | tags: tension, folded-laundry, doorway-hesitation, clothed, Heat 2 | duration: 5s | camera: slow bob | res: 720x1280 9:16 | Audio: soft fabric rustle, room tone, non_diegetic_music: N/A
```

---

### S3 — Temptation · Heat 2

| Field | Value |
|---|---|
| Beat / Phase | B5 Temptation / P2→3 Tease→Escalation |
| Escalator | Vulnerability: reciprocal softness without touch (offers help unpacking) |
| Camera | `high-angle close-up 35mm, face + shoulders, slow bob subtle handheld with breathing` |
| POV | `eye-contact, intimate wellness` |
| Lighting | `soft warm — diffused window + cinematic_warm LUT teal shadows, orange highlights, lifted blacks` |
| Duration / Res | `5s · 720×1280 9:16` · `camera: slow bob` |
| Tags | `temptation, soft-smile, clothed, Heat 2, close-up, warm-LUT` |
| firstFrame → lastFrame | `/storyboard/pick-your-new-stepsister-e1-last.jpg` → `/storyboard/pick-your-new-stepsister-e1-last.jpg` |
| Compilation | `your-new-stepsister-e1-heat2` |

**Prompt (Heat 2 — no touch, gaze only):**
```
cinematic, synthetic adult woman 18+ clothed in sage linen shirt and wide ecru trousers, bedroom with plant and folded linens, gentle eye contact soft smile closer frame, hands resting lightly on folded linen no touch-point, intentional gaze not touch, soft disclosure moment, vertical 9:16 720x1280, 5s duration, slow bob subtle handheld with breathing, photorealistic 8k, shallow depth f/2.0 35mm, soft warm light diffused window golden cinematic_warm LUT teal shadows lifted, tactile fabric weave detail, clothed sensual tension Heat 2 fade-to-black — negative: low quality, blurry, deformed, cartoon, illustration, anime, 3d render, cgi, plastic skin, oversaturated, duplicate, watermark, nude, naked, topless, explicit, genitalia, nsfw act, jpeg artifacts — compilation: your-new-stepsister-e1-heat2 | tags: temptation, soft-smile, clothed, Heat 2, eye-contact | duration: 5s | camera: slow bob | res: 720x1280 9:16 | Audio: soft room tone, plant rustle ambient, non_diegetic_music: N/A
```

---

### S4 — Leap · Heat 2

| Field | Value |
|---|---|
| Beat / Phase | B6 Leap — Choose risk / P3 Escalation |
| Escalator | Proximity: embrace-threshold but **no embrace**, breath sync — mutual choice |
| Camera | `high-angle close-up 35mm, face + shoulders, warm catchlight, static camera locked tripod no movement` |
| POV | `eye-level over-shoulder, intimate wellness` |
| Lighting | `soft warm golden-hour glow, dust motes, S-curve lifted blacks, cinematic_warm LUT` |
| Duration / Res | `5s · 720×1280 9:16` · `camera: static` |
| Tags | `leap, lean-in, breath-sync, clothed, Heat 2, eye-contact, golden-glow` |
| firstFrame → lastFrame | `/storyboard/pick-your-new-stepsister-e1-last.jpg` → `/storyboard/pick-your-new-stepsister-e1-last.jpg` |
| Compilation | `your-new-stepsister-e1-heat2` |

**Prompt (Heat 2 — lean without embrace):**
```
cinematic, synthetic adult woman 18+ clothed in soft cotton shirt and linen trousers, leaning across kitchen counter hallway soft lean-in eye contact "stay — just a minute longer" whisper breath sync, no embrace distance holds one hand width, vertical 9:16 720x1280, 5s duration, static camera locked tripod no movement, photorealistic 8k, shallow depth of field f/2.0 35mm, soft warm light golden glow diffused, volumetric dust motes, tactile fabric weave, clothed Heat 2 fade-to-black — negative: low quality, blurry, deformed, cartoon, illustration, anime, 3d render, cgi, plastic skin, oversaturated, duplicate, watermark, nude, naked, topless, explicit, genitalia, nsfw act, jpeg artifacts — compilation: your-new-stepsister-e1-heat2 | tags: leap, lean-in, breath-sync, clothed, Heat 2 | duration: 5s | camera: static | res: 720x1280 9:16 | Audio: soft breath sync, room tone, non_diegetic_music: N/A
```

---

### S5 — Retreat · Heat 2

| Field | Value |
|---|---|
| Beat / Phase | B7 Retreat — Pull back / P4 Climax proxy (emotional, not explicit) |
| Escalator | Proximity: step back (distance reintroduced) — consent reset |
| Camera | `waist-height medium shot, eye level, static camera locked tripod no movement, window flare` |
| POV | `eye-level over-shoulder` |
| Lighting | `bright daylight — clean natural light soft shadows, window light shift, high key` |
| Duration / Res | `5s · 720×1280 9:16` · `camera: static` |
| Tags | `retreat, pull-back, consent-beat, clothed, Heat 2, window-flare, bright-daylight` |
| firstFrame → lastFrame | `/storyboard/pick-your-new-stepsister-e1-last.jpg` → `/storyboard/pick-your-new-stepsister-e1-poster.jpg` |
| Compilation | `your-new-stepsister-e1-heat2` |

**Prompt (Heat 2):**
```
cinematic, synthetic adult woman 18+ clothed in cream knit loungewear, looking away toward window light shift phone buzz on counter door knock off-screen, pull-back solo beat single breath pause "We go at your pace. Nod if you're with me.", waist-height camera medium shot eye level, vertical 9:16 720x1280, 5s duration, static camera locked tripod no movement, photorealistic 8k, shallow depth soft bokeh, bright daylight clean natural light soft shadows, window flare soft, clothed wellness Heat 2 fade-to-black — negative: low quality, blurry, deformed, cartoon, illustration, anime, 3d render, cgi, plastic skin, oversaturated, duplicate, watermark, nude, naked, topless, explicit, genitalia, nsfw act, jpeg artifacts — compilation: your-new-stepsister-e1-heat2 | tags: retreat, pull-back, consent-beat, clothed, Heat 2 | duration: 5s | camera: static | res: 720x1280 9:16 | Audio: phone buzz soft, window ambient, non_diegetic_music: N/A
```

---

### S6 — Afterglow · Heat 2

| Field | Value |
|---|---|
| Beat / Phase | B8 Fall + B12 HEA — Surrender + Afterglow / P5 Afterglow/Tag |
| Escalator | Vulnerability: laugh, relief, pull wide — tagline on poster |
| Camera | `high-angle close-up 35mm + pull wide, slow bob gentle push-in with breathing` |
| POV | `eye-contact / soft gaze off-camera, serene` |
| Lighting | `soft warm golden-hour, diffused window, teal shadows lifted cinematic_warm LUT boosted golds cinematic_warm.cube, poster frame at 1.2s` |
| Duration / Res | `5s · 720×1280 9:16` · `camera: slow bob` |
| Tags | `afterglow, cuddle-laugh, tagline, clothed, Heat 2, golden-hour, pull-wide` |
| firstFrame → lastFrame | `/storyboard/pick-your-new-stepsister-e1-poster.jpg` → `/storyboard/pick-your-new-stepsister-e1-poster.jpg` |
| Compilation | `your-new-stepsister-e1-heat2` |

**Prompt (Heat 2):**
```
cinematic, synthetic adult woman 18+ clothed in soft knit co-ord, soft sheets bedroom clothed embrace laugh eye contact warm LUT cuddle, golden-hour soft light pull wide soft focus tagline moment "Some house rules are meant to be broken.", no nudity blanket layers visible, vertical 9:16 720x1280, 5s duration, slow bob gentle push-in with breathing, photorealistic 8k, shallow depth f/2.0 35mm, soft warm light golden hour boosted golds cinematic_warm.cube, shallow DOF bokeh, lifted blacks S-curve, poster frame extract at 1.2s, clothed wellness Heat 2 fade-to-black — negative: low quality, blurry, deformed, cartoon, illustration, anime, 3d render, cgi, plastic skin, oversaturated, duplicate, watermark, nude, naked, topless, explicit, genitalia, nsfw act, jpeg artifacts — compilation: your-new-stepsister-e1-heat2 | tags: afterglow, embrace, tagline, clothed, Heat 2, golden-hour | duration: 5s | camera: slow bob | res: 720x1280 9:16 | Audio: soft laugh, sheets rustle, room tone, non_diegetic_music: N/A
```

---

## 3. Heat 3 — intentional touch clothed (6 full prompts, 720×1280 5s vertical)

> Heat 3 discipline: **intentional touch without nudity** (shoulder, hair tuck, towel drape, breath-sync lean) + **consent check-in beat** before escalation (`docs/prompts.md` §4). Still fully clothed, no explicit act, lighting/gaze carry escalation. Matches `client.tsx` Heat 3 rows (S3, S4) plus expanded to all six for the heat-variant matrix.

### S1 — Setup · Heat 3

| Field | Value |
|---|---|
| Beat / Phase | B1 Adoration / P1 Exposition (Heat 3 foreshadows touch) |
| Camera | `waist-height medium shot, eye level, static camera locked tripod no movement` |
| POV | `over-shoulder, eye-level, viewer tote soft foreground` |
| Lighting | `bright daylight — clean natural window bounce, high key, teal shadows lifted` |
| Duration / Res | `5s · 720×1280 9:16` · `camera: static` |
| Tags | `forbidden-domestic, eye-contact, linen loungewear, clothed, Heat 3, eye-level, intentional-proximity` |
| firstFrame → lastFrame | `/storyboard/pick-your-new-stepsister-e1-first.jpg` → `/storyboard/pick-your-new-stepsister-e1-first.jpg` |
| Compilation | `your-new-stepsister-e1-heat3` |

**Prompt (Heat 3):**
```
cinematic, synthetic adult woman 18+ clothed in cream knit co-ord and soft linen robe open over loungewear, sunlit hallway with stacked moving boxes doorway, gentle eye contact across threshold doorway lean, hand lightly touches doorway frame intentional proximity ask "you're early — you stayed?", linen sleeve half-slipped from adjusting tote candid imperfection, vertical 9:16 720x1280, 5s duration, static camera locked tripod no movement, photorealistic 8k, shallow depth of field f/2.0 35mm, soft natural daylight bright window bounce, teal shadows lifted cinematic_warm LUT, natural skin pores, tactile linen weave, clothed sensual Heat 3 intentional touch without nudity — negative: low quality, blurry, deformed, cartoon, illustration, anime, 3d render, cgi, plastic skin, oversaturated, duplicate, watermark, nude, naked, topless, explicit, genitalia, nsfw act, jpeg artifacts — compilation: your-new-stepsister-e1-heat3 | tags: setup, intentional-touch, clothed, Heat 3, eye-level | duration: 5s | camera: static | res: 720x1280 9:16 | Audio: soft tote rustle, hallway ambient, non_diegetic_music: N/A
```

---

### S2 — Tension · Heat 3

| Field | Value |
|---|---|
| Beat / Phase | B3 No-way / P2 Tease (stakes up — stakes know yesterday's look) |
| Camera | `waist-height medium shot, eye level, soft bokeh foreground, slow bob subtle handheld with breathing micro head bob` |
| POV | `over-shoulder POV eye level, handheld breathing` |
| Lighting | `soft warm — diffused window golden, coral domestic, teal shadows lifted` |
| Duration / Res | `5s · 720×1280 9:16` · `camera: slow bob` |
| Tags | `tension-escalated, folded-laundry, doorway-hesitation, clothed, Heat 3, intentional-touch` |
| firstFrame → lastFrame | `/storyboard/pick-your-new-stepsister-e1-first.jpg` → `/storyboard/pick-your-new-stepsister-e1-last.jpg` |
| Compilation | `your-new-stepsister-e1-heat3` |

**Prompt (Heat 3):**
```
cinematic, synthetic adult woman 18+ clothed in ecru knit co-ord holding folded laundry closer to chest hallway doorway, hesitant glance that holds a second longer fingers brush tote strap intentional touch without nudity, soft sheets bedroom background, breathy stillness one breath between beats "You're closer than I expected. — Stay — just a minute longer.", vertical 9:16 720x1280, 5s duration, slow bob subtle handheld with breathing micro head bob, photorealistic 8k, shallow depth f/2.0 35mm, soft warm light diffused window golden cinematic_warm LUT, over-shoulder POV eye level, clothed Heat 3 — negative: low quality, blurry, deformed, cartoon, illustration, anime, 3d render, cgi, plastic skin, oversaturated, duplicate, watermark, nude, naked, topless, explicit, genitalia, nsfw act, jpeg artifacts — compilation: your-new-stepsister-e1-heat3 | tags: tension, intentional-touch, folded-laundry, clothed, Heat 3 | duration: 5s | camera: slow bob | res: 720x1280 9:16 | Audio: fabric rustle, soft breath, non_diegetic_music: N/A
```

---

### S3 — Temptation · Heat 3

| Field | Value |
|---|---|
| Beat / Phase | B5 Temptation — intentional touch beat |
| Camera | `high-angle close-up 35mm, face + shoulders, slow bob subtle handheld with breathing` |
| POV | `eye-contact direct, intimate wellness` |
| Lighting | `soft warm — diffused window golden + cinematic_warm LUT teal shadows, orange highlights, lifted blacks, warm catchlight` |
| Duration / Res | `5s · 720×1280 9:16` · `camera: slow bob` |
| Tags | `temptation, touch-point, hair-tuck, consent-beat, clothed, Heat 3, close-up` |
| firstFrame → lastFrame | `/storyboard/pick-your-new-stepsister-e1-last.jpg` → `/storyboard/pick-your-new-stepsister-e1-last.jpg` |
| Compilation | `your-new-stepsister-e1-heat3` |

**Prompt (Heat 3 — matches client.tsx S3 verbatim with consent line):**
```
cinematic, synthetic adult woman 18+ clothed in sage linen shirt and wide ecru trousers, bedroom with plant and folded linens, soft hand-on-shoulder hair-tuck gesture gentle eye contact intentional touch without nudity "Is this okay? Tell me if you want to pause. Only if you want to — say yes.", consent check-in nod, vertical 9:16 720x1280, 5s duration, slow bob subtle handheld with breathing, photorealistic 8k, shallow depth f/2.0 35mm, soft warm light diffused window golden cinematic_warm LUT teal shadows lifted, tactile fabric weave detail, clothed sensual tension Heat 3 — negative: low quality, blurry, deformed, cartoon, illustration, anime, 3d render, cgi, plastic skin, oversaturated, duplicate, watermark, nude, naked, topless, explicit, genitalia, nsfw act, jpeg artifacts — compilation: your-new-stepsister-e1-heat3 | tags: temptation, touch-point, hair-tuck, consent-beat, clothed, Heat 3 | duration: 5s | camera: slow bob | res: 720x1280 9:16 | Audio: soft room tone, breath sync light, non_diegetic_music: N/A
```

---

### S4 — Leap · Heat 3

| Field | Value |
|---|---|
| Beat / Phase | B6 Leap — Choose risk / P3 Escalation peak (music drops, light warms, breath sync) |
| Camera | `high-angle close-up 35mm, face + shoulders, warm catchlight, static camera locked tripod no movement` |
| POV | `true first-person POV eye level, viewer hands soft foreground no HUD, intimate wellness, 35mm lens feel` |
| Lighting | `soft warm golden-hour glow, dust motes, S-curve lifted blacks, cinematic_warm LUT` |
| Duration / Res | `5s · 720×1280 9:16` · `camera: static` |
| Tags | `leap, lean-in, breath-sync, clothed, Heat 3, first-person-POV, intentional-proximity` |
| firstFrame → lastFrame | `/storyboard/pick-your-new-stepsister-e1-last.jpg` → `/storyboard/pick-your-new-stepsister-e1-last.jpg` |
| Compilation | `your-new-stepsister-e1-heat3` |

**Prompt (Heat 3 — matches client.tsx S4):**
```
cinematic, synthetic adult woman 18+ clothed in soft cotton shirt and linen trousers, leaning in closer across kitchen counter hallway breath sync whisper "Breathe with me — slow. Don't look away. I want to remember how you look right now.", true first-person POV eye level viewer hands soft foreground no HUD, intentional proximity not yet embrace, vertical 9:16 720x1280, 5s duration, static camera locked tripod no movement, photorealistic 8k, shallow depth of field f/2.0 35mm, soft warm light golden glow diffused, tactile fabric weave, clothed Heat 3 intentional touch — negative: low quality, blurry, deformed, cartoon, illustration, anime, 3d render, cgi, plastic skin, oversaturated, duplicate, watermark, nude, naked, topless, explicit, genitalia, nsfw act, jpeg artifacts — compilation: your-new-stepsister-e1-heat3 | tags: leap, lean-in, breath-sync, clothed, Heat 3, first-person-POV | duration: 5s | camera: static | res: 720x1280 9:16 | Audio: soft whisper breath, room tone, non_diegetic_music: N/A
```

---

### S5 — Retreat · Heat 3

| Field | Value |
|---|---|
| Beat / Phase | B7 Retreat — Pull back / P4 Climax proxy interrupted — consent reset |
| Camera | `waist-height medium shot, eye level, static camera locked tripod no movement, window flare` |
| POV | `eye-level over-shoulder, window flare` |
| Lighting | `bright daylight — clean natural light soft shadows, window light shift, high key` |
| Duration / Res | `5s · 720×1280 9:16` · `camera: static` |
| Tags | `retreat, pull-back, consent-beat, lingering-touch, clothed, Heat 3` |
| firstFrame → lastFrame | `/storyboard/pick-your-new-stepsister-e1-last.jpg` → `/storyboard/pick-your-new-stepsister-e1-poster.jpg` |
| Compilation | `your-new-stepsister-e1-heat3` |

**Prompt (Heat 3 — lingering release):**
```
cinematic, synthetic adult woman 18+ clothed in cream knit loungewear, looking away toward window light shift phone buzz on counter, pull-back solo beat lingering hand release from shared frame one breath pause "We go at your pace. Nod if you're with me.", waist-height camera medium shot eye level, vertical 9:16 720x1280, 5s duration, static camera locked tripod no movement, photorealistic 8k, shallow depth soft bokeh, bright daylight clean natural light soft shadows, window flare, clothed wellness Heat 3 intentional touch release — negative: low quality, blurry, deformed, cartoon, illustration, anime, 3d render, cgi, plastic skin, oversaturated, duplicate, watermark, nude, naked, topless, explicit, genitalia, nsfw act, jpeg artifacts — compilation: your-new-stepsister-e1-heat3 | tags: retreat, pull-back, consent-beat, clothed, Heat 3 | duration: 5s | camera: static | res: 720x1280 9:16 | Audio: phone buzz soft, window flare ambient, non_diegetic_music: N/A
```

---

### S6 — Afterglow · Heat 3

| Field | Value |
|---|---|
| Beat / Phase | B8 Fall + B12 HEA — Surrender + Afterglow / P5 Afterglow/Tag |
| Camera | `high-angle close-up 35mm + pull wide, slow bob gentle push-in with breathing` |
| POV | `eye-contact / soft gaze, gentle hair-tuck callback` |
| Lighting | `soft warm golden-hour, diffused window, teal shadows lifted cinematic_warm LUT boosted golds cinematic_warm.cube, poster frame at 1.2s` |
| Duration / Res | `5s · 720×1280 9:16` · `camera: slow bob` |
| Tags | `afterglow, cuddle-laugh, tagline, hair-tuck-callback, clothed, Heat 3, golden-hour` |
| firstFrame → lastFrame | `/storyboard/pick-your-new-stepsister-e1-poster.jpg` → `/storyboard/pick-your-new-stepsister-e1-poster.jpg` |
| Compilation | `your-new-stepsister-e1-heat3` |

**Prompt (Heat 3 — clothed embrace + hair-tuck callback):**
```
cinematic, synthetic adult woman 18+ clothed in soft knit co-ord, soft sheets bedroom clothed embrace laugh eye contact gentle hair-tuck callback "You're still here. Good. That was — yeah. That was us. Next time, I'll be the one who's nervous.", golden-hour soft light pull wide soft focus tagline moment "Some house rules are meant to be broken — again tomorrow.", vertical 9:16 720x1280, 5s duration, slow bob gentle push-in with breathing, photorealistic 8k, shallow depth f/2.0 35mm, soft warm light golden hour boosted golds cinematic_warm.cube, shallow DOF bokeh, poster frame extract at 1.2s, clothed wellness Heat 3 intentional touch — negative: low quality, blurry, deformed, cartoon, illustration, anime, 3d render, cgi, plastic skin, oversaturated, duplicate, watermark, nude, naked, topless, explicit, genitalia, nsfw act, jpeg artifacts — compilation: your-new-stepsister-e1-heat3 | tags: afterglow, embrace, hair-tuck-callback, clothed, Heat 3, golden-hour | duration: 5s | camera: slow bob | res: 720x1280 9:16 | Audio: soft laugh, sheets rustle, room tone warm, non_diegetic_music: N/A
```

---

## 4. Heat 4 — explicit placeholder (12 T2I templates, you fill via Anubis Mini 8B on Vast/Dell)

> **Not generated here. Keep local, never commit.** Fill each placeholder below via **Anubis Mini 8B** (uncensored local LLM) and keep the result in a gitignored file. See `docs/vast-anubis-rental.md` for Vast SSH tunnel setup (Anubis 70B Q4 host `183.169.252.151:24552`); **Anubis Mini 8B** is the lighter Dell-local variant (fits 24 GB single 4090, 8B Q4_K_M ~4.9 GB). Keep prompts local — engine is VeilWick local `wan-2.7 text-to-image 720*1280` stills → H3 `image+last_image+loras+prompt` video. **Heat 2-3 stay fully written in §2-§3; Heat 4 is T2I placeholder only — 12 prompts (6 scenes × first_frame + last_frame).**

### 4a. Heat 4 T2I placeholders — 12 prompts (6 scenes × first_frame + last_frame)

> Instructions: replace **only** the placeholder token inside each code block (the `PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280` line) with your Anubis Mini 8B-generated explicit **text-to-image** prompt. Each scene has **two T2I prompts** — one for `first_frame` and one for `last_frame` (12 total). First generate stills via `alibaba/wan-2.7/text-to-image --size 720*1280` (see §4c), then animate the pair via H3 `image+last_image` stitch (see §6). Keep `720x1280 vertical 9:16`, camera/lighting/tags tokens, and do not remove `synthetic adult woman 18+`. Store the filled file as `docs/storyboard-heat4.local.md` (gitignored) or `~/.secrets/storyboard-heat4.md` — never commit. Mirrors `apps/web/app/prototype-scenes/client.tsx` `SCENES[n].heat4FirstFrameT2iPrompt` / `heat4LastFrameT2iPrompt`.

**S1 — Setup · Heat 4 T2I — first_frame (B1/P1)**

```
PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — S1 first_frame T2I placeholder (B1/P1): text-to-image still for first_frame /storyboard/pick-your-new-stepsister-e1-first.jpg — start from Heat 3 S1 prompt in §3, append your explicit detail after Anubis Mini 8B generation. Keep vertical 9:16 720x1280, photorealistic 8k, shallow DOF f/2.0 35mm, soft natural daylight, static camera locked tripod eye level, tags: setup, Heat 4, first_frame, 720x1280 — compilation: your-new-stepsister-e1-heat4 | frame: first | camera: static | res: 720x1280 9:16 | T2I: alibaba/wan-2.7/text-to-image --size 720*1280
```

**S1 — Setup · Heat 4 T2I — last_frame (B1/P1)**

```
PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — S1 last_frame T2I placeholder (B1/P1): text-to-image still for last_frame /storyboard/pick-your-new-stepsister-e1-first.jpg — same seed as first_frame, vary gaze beat (smile hold → glance away). Keep vertical 9:16 720x1280, photorealistic 8k, shallow DOF, soft daylight, static, tags: setup, Heat 4, last_frame, 720x1280 — compilation: your-new-stepsister-e1-heat4 | frame: last | camera: static | res: 720x1280 9:16 | T2I: alibaba/wan-2.7/text-to-image --size 720*1280
```

**S2 — Tension · Heat 4 T2I — first_frame (B3/P2)**

```
PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — S2 first_frame T2I placeholder (B3/P2): text-to-image still for first_frame /storyboard/pick-your-new-stepsister-e1-first.jpg — start from Heat 3 S2, append explicit detail. Keep vertical 9:16 720x1280, photorealistic 8k, shallow DOF f/2.0 35mm, over-shoulder POV eye level, soft warm window golden, slow bob, tags: tension, Heat 4, first_frame — compilation: your-new-stepsister-e1-heat4 | frame: first | camera: slow bob | res: 720x1280 9:16 | T2I: alibaba/wan-2.7/text-to-image --size 720*1280
```

**S2 — Tension · Heat 4 T2I — last_frame (B3/P2)**

```
PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — S2 last_frame T2I placeholder (B3/P2): text-to-image still for last_frame /storyboard/pick-your-new-stepsister-e1-last.jpg — one breath later, laundry held closer, gaze holds longer. Keep vertical 9:16 720x1280, photorealistic 8k, over-shoulder, soft warm, slow bob, tags: tension, Heat 4, last_frame — compilation: your-new-stepsister-e1-heat4 | frame: last | camera: slow bob | res: 720x1280 9:16 | T2I: alibaba/wan-2.7/text-to-image --size 720*1280
```

**S3 — Temptation · Heat 4 T2I — first_frame (B5)**

```
PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — S3 first_frame T2I placeholder (B5): text-to-image still for first_frame /storyboard/pick-your-new-stepsister-e1-last.jpg — start from Heat 3 S3, append explicit detail. Keep vertical 9:16 720x1280, photorealistic 8k, high-angle close-up 35mm, direct gaze, soft warm diffused window golden cinematic_warm LUT, slow bob, tags: temptation, Heat 4, first_frame — compilation: your-new-stepsister-e1-heat4 | frame: first | camera: slow bob | res: 720x1280 9:16 | T2I: alibaba/wan-2.7/text-to-image --size 720*1280
```

**S3 — Temptation · Heat 4 T2I — last_frame (B5)**

```
PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — S3 last_frame T2I placeholder (B5): text-to-image still for last_frame /storyboard/pick-your-new-stepsister-e1-last.jpg — hair-tuck beat, consent check-in “Is this okay?” micro-expression shift. Keep vertical 9:16 720x1280, high-angle close-up 35mm, slow bob, tags: temptation, Heat 4, last_frame — compilation: your-new-stepsister-e1-heat4 | frame: last | camera: slow bob | res: 720x1280 9:16 | T2I: alibaba/wan-2.7/text-to-image --size 720*1280
```

**S4 — Leap · Heat 4 T2I — first_frame (B6/P3)**

```
PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — S4 first_frame T2I placeholder (B6/P3): text-to-image still for first_frame /storyboard/pick-your-new-stepsister-e1-last.jpg — start from Heat 3 S4, append explicit detail. Keep vertical 9:16 720x1280, photorealistic 8k, true first-person POV eye level viewer hands soft foreground no HUD, static camera locked tripod, soft warm golden-hour, tags: leap, Heat 4, first_frame — compilation: your-new-stepsister-e1-heat4 | frame: first | camera: static | res: 720x1280 9:16 | T2I: alibaba/wan-2.7/text-to-image --size 720*1280
```

**S4 — Leap · Heat 4 T2I — last_frame (B6/P3)**

```
PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — S4 last_frame T2I placeholder (B6/P3): text-to-image still for last_frame /storyboard/pick-your-new-stepsister-e1-last.jpg — breath-sync whisper “Breathe with me — slow” lean-in closer, catchlight. Keep vertical 9:16 720x1280, first-person POV, static, soft warm golden-hour, tags: leap, Heat 4, last_frame — compilation: your-new-stepsister-e1-heat4 | frame: last | camera: static | res: 720x1280 9:16 | T2I: alibaba/wan-2.7/text-to-image --size 720*1280
```

**S5 — Retreat · Heat 4 T2I — first_frame (B7/P4)**

```
PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — S5 first_frame T2I placeholder (B7/P4): text-to-image still for first_frame /storyboard/pick-your-new-stepsister-e1-last.jpg — start from Heat 3 S5, append explicit detail. Keep vertical 9:16 720x1280, photorealistic 8k, waist-height medium shot eye level, window flare, bright daylight, static, tags: retreat, Heat 4, first_frame — compilation: your-new-stepsister-e1-heat4 | frame: first | camera: static | res: 720x1280 9:16 | T2I: alibaba/wan-2.7/text-to-image --size 720*1280
```

**S5 — Retreat · Heat 4 T2I — last_frame (B7/P4)**

```
PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — S5 last_frame T2I placeholder (B7/P4): text-to-image still for last_frame /storyboard/pick-your-new-stepsister-e1-poster.jpg — pull-back, gaze to window, phone buzz, lingering hand release consent reset. Keep vertical 9:16 720x1280, waist-height medium, window flare, bright daylight, static, tags: retreat, Heat 4, last_frame — compilation: your-new-stepsister-e1-heat4 | frame: last | camera: static | res: 720x1280 9:16 | T2I: alibaba/wan-2.7/text-to-image --size 720*1280
```

**S6 — Afterglow · Heat 4 T2I — first_frame (B8+12/P5)**

```
PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — S6 first_frame T2I placeholder (B8+12/P5): text-to-image still for first_frame /storyboard/pick-your-new-stepsister-e1-poster.jpg — start from Heat 3 S6, append explicit detail. Keep vertical 9:16 720x1280, photorealistic 8k, high-angle close-up + pull wide, soft warm golden-hour cinematic_warm.cube, slow bob gentle push-in, tags: afterglow, Heat 4, first_frame, golden-hour — compilation: your-new-stepsister-e1-heat4 | frame: first | camera: slow bob | res: 720x1280 9:16 | T2I: alibaba/wan-2.7/text-to-image --size 720*1280
```

**S6 — Afterglow · Heat 4 T2I — last_frame (B8+12/P5)**

```
PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — S6 last_frame T2I placeholder (B8+12/P5): text-to-image still for last_frame /storyboard/pick-your-new-stepsister-e1-poster.jpg — tagline moment “Some house rules are meant to be broken” pull wide soft focus laugh. Keep vertical 9:16 720x1280, pull wide, slow bob, golden-hour, tags: afterglow, Heat 4, last_frame — compilation: your-new-stepsister-e1-heat4 | frame: last | camera: slow bob | res: 720x1280 9:16 | T2I: alibaba/wan-2.7/text-to-image --size 720*1280
```

> Count for §4a only: 12 placeholder blocks in §4a (6 scenes × 2 — one `first_frame` T2I + one `last_frame` T2I per scene; each starts with `PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280`). Mirrors `client.tsx` `SCENES[n].heat4FirstFrameT2iPrompt` / `heat4LastFrameT2iPrompt` (12 total).

---

### 4b. How to fill Heat 4 via Anubis Mini 8B (Vast or Dell box)

> The project rents **Anubis 70B Q4** on Vast (2×4090, `vast-anubis-rental.md` instance `49584552` `ssh6.vast.ai:24552`). **Anubis Mini 8B** (`TheDrummer/Anubis-Mini-8B-GGUF` or `Anubis-8B` Q4_K_M ~4.9 GB) is the Dell-local alternative — same API, smaller VRAM, runs on a single 4090. Use whichever tunnel is up; API is OpenAI-compatible via `llama-server`. Keep Heat 4 generation **local only** (`wrangler dev --local`, never `wrangler deploy --remote`).

**Host docs:** `docs/vast-anubis-rental.md` (70B) — Mini 8B uses same `llama-server` flags with the 8B GGUF. If `docs/anubis-interface.md` is not yet at repo root, treat `docs/vast-anubis-rental.md` §3–§4 as the interface spec — same `curl http://localhost:8080/v1/chat/completions`.

#### Option A — Vast tunnel (70B host, Mini 8B GGUF may also run there)

```bash
# 1. Open SSH tunnel to Vast instance (keeps 8080 local)
ssh -p 24552 root@ssh6.vast.ai -L 8080:localhost:8080
# In another shell, verify tunnel
curl -s http://localhost:8080/health | jq .

# 2. On Vast instance: Mini 8B GGUF (~4.9 GB) + llama-server
# (if you prefer the rented 70B, skip download and use Anubis-70B-Q4_K_M as model)
ssh -p 24552 root@ssh6.vast.ai
pip install -U "huggingface_hub[hf_transfer]" && export HF_HUB_ENABLE_HF_TRANSFER=1
huggingface-cli download TheDrummer/Anubis-Mini-8B-GGUF Anubis-Mini-8B-Q4_K_M.gguf --local-dir /workspace --local-dir-use-symlinks False
ls -lh /workspace/*.gguf
# run server (single 4090 is enough for 8B; row-split not needed)
/opt/llama.cpp/build/bin/llama-server --model /workspace/Anubis-Mini-8B-Q4_K_M.gguf --alias Anubis-Mini-8B-Q4_K_M --host 0.0.0.0 --port 8080 --ctx-size 8192 --n-gpu-layers 99 --threads $(nproc) --parallel 2 --cont-batching --flash-attn on
```

#### Option B — Dell box local (Mini 8B fits 24 GB VRAM)

```bash
# Same build as §2 of vast-anubis-rental.md, but 8B GGUF
huggingface-cli download TheDrummer/Anubis-Mini-8B-GGUF Anubis-Mini-8B-Q4_K_M.gguf --local-dir /workspace
llama-server --model /workspace/Anubis-Mini-8B-Q4_K_M.gguf --alias Anubis-Mini-8B-Q4_K_M --host 0.0.0.0 --port 8080 --ctx-size 8192 --n-gpu-layers 99

# Health check (both hosts)
curl -s http://localhost:8080/health | jq .
curl -s http://localhost:8080/v1/models | jq .data[0].id
```

#### Generate Heat 4 T2I prompts (12 prompts — 6 scenes × first_frame + last_frame, keep local)

```bash
# From local machine with tunnel open (localhost:8080)
# Each scene needs TWO T2I prompts: first_frame + last_frame (12 total).
# Copy per-scene Heat 3 context into Anubis and ask to escalate to explicit T2I — save to gitignored file.

# Example S3 (temptation) — explicit T2I expansion — first_frame + last_frame
# — S3 first_frame (same setup, gaze before hair-tuck)
curl -s http://localhost:8080/v1/chat/completions -H "Content-Type: application/json" -d '{
  "model": "Anubis-Mini-8B-Q4_K_M",
  "messages": [
    {"role": "system", "content": "You are a VeilWick prompt assistant. Output ONLY a single text-to-image prompt string (720x1280 vertical 9:16). Keep tokens: synthetic adult woman 18+, vertical 9:16 720x1280, photorealistic 8k, shallow DOF f/2.0 35mm. Do not add commentary or markdown."},
    {"role": "user", "content": "Write a VeilWick Heat 4 text-to-image prompt (720x1280 vertical 9:16) for S3 Temptation B5 first_frame: \"cinematic, synthetic adult woman 18+ clothed in sage linen shirt and wide ecru trousers, bedroom with plant and folded linens, soft hand-on-shoulder hair-tuck gesture gentle eye contact intentional touch without nudity, vertical 9:16 720x1280, photorealistic 8k, shallow depth f/2.0 35mm, soft warm light diffused window golden cinematic_warm LUT, tags: temptation Heat4 first_frame\". Output ONE line starting with \"cinematic, synthetic adult woman 18+\" and containing \"720x1280\" and \"first_frame\". Keep photorealistic 8k, slow bob, high-angle close-up 35mm."}
  ],
  "temperature": 0.85,
  "max_tokens": 512
}' | jq -r '.choices[0].message.content' | tee /tmp/anubis-heat4-s3-first.txt

# — S3 last_frame (micro-shift: hair-tuck consent check)
curl -s http://localhost:8080/v1/chat/completions -H "Content-Type: application/json" -d '{
  "model": "Anubis-Mini-8B-Q4_K_M",
  "messages": [
    {"role": "system", "content": "You are a VeilWick prompt assistant. Output ONLY a single text-to-image prompt string (720x1280 vertical 9:16). Keep tokens: synthetic adult woman 18+, vertical 9:16 720x1280, photorealistic 8k, shallow DOF f/2.0 35mm. Do not add commentary or markdown."},
    {"role": "user", "content": "Write a VeilWick Heat 4 text-to-image prompt (720x1280 vertical 9:16) for S3 Temptation B5 last_frame: same scene as first_frame but hair-tuck completed, consent line \"Is this okay?\" micro-expression. Output ONE line starting with \"cinematic, synthetic adult woman 18+\" and containing \"720x1280\" and \"last_frame\". Keep photorealistic 8k, slow bob, high-angle close-up 35mm."}
  ],
  "temperature": 0.85,
  "max_tokens": 512
}' | jq -r '.choices[0].message.content' | tee /tmp/anubis-heat4-s3-last.txt

# Repeat for S1,S2,S4,S5,S6 — each scene 2 calls (first_frame + last_frame) → 12 files total.
# Collect:
cat /tmp/anubis-heat4-s*-first.txt /tmp/anubis-heat4-s*-last.txt > docs/storyboard-heat4.local.md
# docs/storyboard-heat4.local.md is gitignored (*.local.md) — never commit (12 lines)
# Paste each line into the corresponding placeholder block in §4a (replace the PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 token)
# Also paste into client.tsx SCENES[n].heat4FirstFrameT2iPrompt / heat4LastFrameT2iPrompt if you mirror locally (also gitignored via *.local override — keep placeholder in committed file).
```

### 4c. Wavespeed text-to-image CLI — Heat 4 stills (first_frame + last_frame → H3)

> Heat 4 stills are **text-to-image first**, then animated via H3 `image+last_image`. Use Wan T2I at `720*1280` (star delimiter). Optional Mystic LoRA reuse for photorealism一致性.

**Primary — Wan 2.7 T2I at 720*1280 with optional LoRA (recommended):**

```bash
# Env — same as H3 video (no new key)
export WAVESPEED_API_KEY="wsk_live_..."
export WAVESPEED_LORA_PATH="/tmp/MysticXXX_MMH3-V4.safetensors"  # 148M, already at /tmp after bun scripts/download-mmh3-lora.ts
ls -lh "$WAVESPEED_LORA_PATH"  # verify

# Per-still generation — replace <t2i prompt> with the filled line from §4a (one call per frame, 12 total)
# S1 first_frame example (fill the placeholder first in docs/storyboard-heat4.local.md, then paste)
wavespeed run alibaba/wan-2.7/text-to-image \
  --prompt "$(sed -n '1p' docs/storyboard-heat4.local.md)" \
  --size "720*1280" \
  --lora "$WAVESPEED_LORA_PATH" \
  -o output/heat4/s1-first-720x1280.jpg

# S1 last_frame
wavespeed run alibaba/wan-2.7/text-to-image \
  --prompt "$(sed -n '2p' docs/storyboard-heat4.local.md)" \
  --size "720*1280" \
  --lora "$WAVESPEED_LORA_PATH" \
  -o output/heat4/s1-last-720x1280.jpg

# Repeat for S2..S6 (12 files):
# wavespeed run alibaba/wan-2.7/text-to-image --prompt "<t2i prompt: S2 first_frame>" --size "720*1280" --lora "$WAVESPEED_LORA_PATH" -o output/heat4/s2-first-720x1280.jpg
# wavespeed run alibaba/wan-2.7/text-to-image --prompt "<t2i prompt: S2 last_frame>"  --size "720*1280" --lora "$WAVESPEED_LORA_PATH" -o output/heat4/s2-last-720x1280.jpg
# … s3-first, s3-last, s4-first, s4-last, s5-first, s5-last, s6-first, s6-last (12)

# Verify each is 720×1280
sips -g pixelWidth -g pixelHeight output/heat4/s1-first-720x1280.jpg  # → 720 1280
file output/heat4/*.jpg  # all JPEG 720x1280

# Copy to storyboard paths for H3 stitch (or keep in output/heat4/ and pass as --image URLs after upload)
cp output/heat4/s1-first-720x1280.jpg public/storyboard/heat4-s1-first.jpg
cp output/heat4/s1-last-720x1280.jpg  public/storyboard/heat4-s1-last.jpg
# wavespeed upload public/storyboard/heat4-s1-first.jpg --json  # → HEAT4_S1_FIRST_URL

# Then animate each pair via H3 (same as §6 but with Heat 4 stills + Heat 4 I2V prompt tail)
# wavespeed run wavespeed-ai/minimax-h3/image-to-video-lora --image "$HEAT4_S1_FIRST_URL" --last-image "$HEAT4_S1_LAST_URL" --prompt "$(cat docs/storyboard-heat4.local.md | head -n 1) + H3 tail" --duration 5 --resolution 768p --loras "$WAVESPEED_LORA_PATH" -o output/heat4/s1-5s-raw.mp4
```

**Flags — canonical (Wavespeed OpenAPI):**

| Flag | Value for Heat 4 T2I | Notes |
|---|---|---|
| `--prompt` | `"<t2i prompt>"` — the filled `PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280` line from §4a | Single line, keep `synthetic adult woman 18+`, `720x1280`, `photorealistic 8k` |
| `--size` | `"720*1280"` | **Star**, not `x`; Wan expects `WIDTH*HEIGHT` |
| `--lora` | `/tmp/MysticXXX_MMH3-V4.safetensors` (optional) | Same LoRA as H3 video — `--lora` on T2I adds skin/fabric realism; omit to test base |
| `-o` | `output/heat4/s{n}-{first,last}-720x1280.jpg` | Local JPEG, verify `sips` 720×1280 |

**Fallback model IDs (if 2.7 unavailable in your CLI version):**

```bash
# Alt 1 — Wan 2.1 T2I (older, same size flag)
wavespeed run wavespeed-ai/wan-2.1/text-to-image --prompt "<t2i prompt>" --size "720*1280" -o output/heat4/s1-first-720x1280.jpg
# with LoRA via HuggingFace ID instead of path (Wan 2.1 style):
wavespeed run wavespeed-ai/wan-2.1/text-to-image --prompt "<t2i prompt>" --size "720*1280" --lora /tmp/MysticXXX_MMH3-V4.safetensors -o out.jpg

# Alt 2 — raw alibaba path without prefix (some CLIs)
wavespeed run alibaba/wan-2.7/text-to-image --prompt "<t2i prompt>" --size 720*1280 -o out.jpg

# Alt 3 — API direct (if CLI wrapper differs) — POST https://api.wavespeed.ai/api/v3/alibaba/wan-2.7/text-to-image {prompt, size:"720*1280", lora:"/tmp/..."}
curl -s https://api.wavespeed.ai/api/v3/alibaba/wan-2.7/text-to-image -H "Authorization: Bearer $WAVESPEED_API_KEY" -H "Content-Type: application/json" -d '{"prompt":"<t2i prompt>","size":"720*1280"}' | jq .
```

> Keep `720*1280` (**star**) for T2I size. H3 video stays `--resolution 768p` then `ffmpeg scale=720:1280:flags=lanczos` (see §6). All 12 Heat 4 T2I outputs are **local only** — never `wavespeed deploy`/R2 public until age-gate + 2257 + RTA (§nsfw-foundation.md §5).

**Env for code callers (`.dev.vars`, local only, never commit):**
```
ANUBIS_BASE_URL=http://localhost:8080/v1
ANUBIS_MODEL=Anubis-Mini-8B-Q4_K_M
ANUBIS_API_KEY=dummy
WAVESPEED_API_KEY=wsk_live_...
WAVESPEED_LORA_PATH=/tmp/MysticXXX_MMH3-V4.safetensors
```

**Reference interface doc:** `docs/vast-anubis-rental.md` §2–§4 (tunnel, `llama-server` flags, `curl /v1/chat/completions`). If `docs/anubis-interface.md` exists locally, it mirrors the `curl` contract above — use that file's endpoint; default is `http://localhost:8080/v1/chat/completions`.

---

## 5. Engine mapping — `wavespeed.ts` FEED_CATEGORIES → storyboard-heat2-4.md

> Task clause 4: verify engine can read this md — `wavespeed.ts:FEED_CATEGORIES` must map to storyboard.

### 5a. Current FEED_CATEGORIES (clothed feed, local)

`apps/web/src/lib/wavespeed.ts:70`

```ts
export const FEED_CATEGORIES = [
  "market-stall-fashion","beach-lifestyle","studio","bedroom-lifestyle",
  "wellness","fitness","activewear","breathwork",
] as const;
export type FeedCategory = typeof FEED_CATEGORIES[number];
export const FEED_PROMPTS: Record<FeedCategory,string> = { /* prompts.md §5 */ };
export const FEED_TAGS: Record<FeedCategory,string[]> = { /* angle/pov/lighting */ };
export function getFeedPrompt(c: string){ return FEED_PROMPTS[c as FeedCategory] ?? FEED_PROMPTS.wellness; }
```

This feed stays **non-explicit, clothed 768p 9:16** (`nsfw-foundation.md` swap is via `nsfw-prompts.local.md` — not this storyboard). The storyboard is the **VeilWick engine** (series playlist) path, not the TikTok feed shuffle — so it reads as a separate catalog, not a FEED_CATEGORIES replacement.

### 5b. Storyboard heat map (how wavespeed.ts reads this md)

Add alongside `FEED_CATEGORIES` without changing the feed shuffle — two options, pick one:

**Option 1 — static map (no parser, zero risk, recommended):**

```ts
// apps/web/src/lib/wavespeed.ts — add below FEED_CATEGORIES
// Mirrors apps/web/app/prototype-scenes/client.tsx SCENES[n].heat4FirstFrameT2iPrompt/heat4LastFrameT2iPrompt — 12 T2I placeholders
export const STORYBOARD_HEAT2_4 = {
  seriesId: "your-new-stepsister-e1",
  duration: 5, resolution: "768p", aspect: "9:16", rawRes: "768x1344", scaledRes: "720x1280",
  t2iSize: "720*1280" as const, // Wan T2I star-delimited
  t2iModel: "alibaba/wan-2.7/text-to-image" as const, // fallback: wavespeed-ai/wan-2.1/text-to-image (see §4c)
  scenes: [
    { n:1, id:"yns-e1-s1-setup",       heat2: "§2 S1 Heat2 prompt", heat3: "§3 S1 Heat3 prompt", heat4FirstT2i: "PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 (fill from §4a S1 first)", heat4LastT2i: "PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 (fill from §4a S1 last)", firstFrame:"/storyboard/pick-your-new-stepsister-e1-first.jpg", lastFrame:"/storyboard/pick-your-new-stepsister-e1-first.jpg", camera:"static", lighting:"bright daylight" },
    { n:2, id:"yns-e1-s2-tension",    heat2: "§2 S2", heat3:"§3 S2", heat4FirstT2i:"PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 (fill from §4a S2 first)", heat4LastT2i:"PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 (fill from §4a S2 last)", firstFrame:"/storyboard/pick-your-new-stepsister-e1-first.jpg", lastFrame:"/storyboard/pick-your-new-stepsister-e1-last.jpg",  camera:"slow bob", lighting:"soft warm" },
    { n:3, id:"yns-e1-s3-temptation", heat2:"§2 S3", heat3:"§3 S3", heat4FirstT2i:"PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 (fill from §4a S3 first)", heat4LastT2i:"PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 (fill from §4a S3 last)", firstFrame:"/storyboard/pick-your-new-stepsister-e1-last.jpg",  lastFrame:"/storyboard/pick-your-new-stepsister-e1-last.jpg",  camera:"slow bob", lighting:"soft warm" },
    { n:4, id:"yns-e1-s4-leap",       heat2:"§2 S4", heat3:"§3 S4", heat4FirstT2i:"PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 (fill from §4a S4 first)", heat4LastT2i:"PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 (fill from §4a S4 last)", firstFrame:"/storyboard/pick-your-new-stepsister-e1-last.jpg",  lastFrame:"/storyboard/pick-your-new-stepsister-e1-last.jpg",  camera:"static", lighting:"soft warm golden-hour" },
    { n:5, id:"yns-e1-s5-retreat",    heat2:"§2 S5", heat3:"§3 S5", heat4FirstT2i:"PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 (fill from §4a S5 first)", heat4LastT2i:"PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 (fill from §4a S5 last)", firstFrame:"/storyboard/pick-your-new-stepsister-e1-last.jpg",  lastFrame:"/storyboard/pick-your-new-stepsister-e1-poster.jpg", camera:"static", lighting:"bright daylight" },
    { n:6, id:"yns-e1-s6-afterglow",  heat2:"§2 S6", heat3:"§3 S6", heat4FirstT2i:"PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 (fill from §4a S6 first)", heat4LastT2i:"PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 (fill from §4a S6 last)", firstFrame:"/storyboard/pick-your-new-stepsister-e1-poster.jpg", lastFrame:"/storyboard/pick-your-new-stepsister-e1-poster.jpg", camera:"slow bob", lighting:"soft warm golden-hour" },
  ],
} as const;
export type StoryboardHeat = "heat2" | "heat3" | "heat4";
export type StoryboardFrame = "first" | "last";
export function getStoryboardPrompt(n: number, heat: StoryboardHeat): string {
  const s = STORYBOARD_HEAT2_4.scenes.find(x=>x.n===n);
  if(!s) throw new Error(`[wavespeed] storyboard scene ${n} not found`);
  if (heat === "heat4") return `${s.heat4FirstT2i} // first_frame | ${s.heat4LastT2i} // last_frame (T2I 720*1280 → H3 image+last_image)`;
  return s[heat];
}
export function getStoryboardT2iPrompt(n: number, frame: StoryboardFrame): string {
  const s = STORYBOARD_HEAT2_4.scenes.find(x=>x.n===n);
  if(!s) throw new Error(`[wavespeed] storyboard scene ${n} not found`);
  return frame === "first" ? s.heat4FirstT2i : s.heat4LastT2i;
}
```

**Option 2 — markdown parser (reads this file at build):**
```ts
// scripts/parse-storyboard-heat2-4.ts — run at build, emits JSON
import { readFileSync } from "fs";
const md = readFileSync("docs/storyboard-heat2-4.md","utf8");
// Heat 2/3 are H3 video prompts (6 each); Heat 4 is T2I (12 = 6×first+last)
const heat2 = [...md.matchAll(/S\d — .*Heat 2[\s\S]*?```\n([\s\S]*?)\n```/g)].map(m=>m[1].trim()); // 6
const heat3 = [...md.matchAll(/S\d — .*Heat 3[\s\S]*?```\n([\s\S]*?)\n```/g)].map(m=>m[1].trim()); // 6
const heat4t2i = [...md.matchAll(/PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280[\s\S]*?```/g)].map(m=>m[0].split("\n")[1]?.trim()); // 12
const prompts = [...md.matchAll(/```\n(cinematic, synthetic adult woman 18\+[\s\S]*?)\n```/g)].map(m=>m[1].trim());
// prompts[0..5]=Heat2 S1..S6, [6..11]=Heat3, [12..23]=Heat4 T2I (6×2)
```

Both keep `FEED_CATEGORIES` intact. `STORYBOARD_HEAT2_4` is the **engine** entry for `scripts/generate-series-local.ts` — pass `--heat heat2|heat3|heat4` to select prompt tail, same `image+last_image` stitch as E2.

### 5c. Verification that FEED_CATEGORIES still resolves (no break)

```bash
bun run typecheck  # TS ok — FEED_CATEGORIES unchanged
grep -E "FEED_CATEGORIES|STORYBOARD_HEAT" apps/web/src/lib/wavespeed.ts
node -e "import('./apps/web/src/lib/wavespeed.ts').then(m=>console.log(Object.keys(m.FEED_PROMPTS)))"
curl -b "veilwick_age_verified=1" http://localhost:8788/api/feed | jq '.videos[0].category'
```

Storyboard heats do **not** inject into `FEED_PROMPTS`; they are a separate `S1–S6 heat2/3/4` catalog for the VeilWick engine (`wrangler dev --local` R2 `template-uploads/videos/storyboard-heat2-4/`).

---

## 6. Generation plan — H3 image+last_image stitch per heat (do not run yet)

**Status: PREPARED. Do not generate video until user approves. Local only, non-explicit for Heat 2–3; Heat 4 requires your Anubis-filled heat4.local.md.**

Same flow as `docs/e2-prompts.md` §4 and `docs/generation-log.md` §3 — H3 feeds `image` + optional `last_image` + `loras` + `prompt` + `duration:5` + `resolution:768p`.

```bash
# Pre-flight
cd /Users/parab/Documents/Personal/veilwick
ls -lh /tmp/MysticXXX_MMH3-V4.safetensors || bun scripts/download-mmh3-lora.ts
sips -g pixelWidth -g pixelHeight public/storyboard/pick-your-new-stepsister-e1-first.jpg
sips -g pixelWidth -g pixelHeight public/storyboard/pick-your-new-stepsister-e1-last.jpg
sips -g pixelWidth -g pixelHeight public/storyboard/pick-your-new-stepsister-e1-poster.jpg

# Upload stills → CDN URLs (H3 image/last_image must be URLs)
wavespeed upload public/storyboard/pick-your-new-stepsister-e1-first.jpg --json  # → FIRST_URL
wavespeed upload public/storyboard/pick-your-new-stepsister-e1-last.jpg --json   # → LAST_URL
wavespeed upload public/storyboard/pick-your-new-stepsister-e1-poster.jpg --json # → POSTER_URL

# Heat 2 — S1 (poster → first), prompt from §2 S1
wavespeed run wavespeed-ai/minimax-h3/image-to-video-lora --image "$POSTER_URL" --last-image "$FIRST_URL" --prompt "$(sed -n '/S1 — Setup · Heat 2/,/```/p' docs/storyboard-heat2-4.md | grep -A999 '```' | head -n 20)" --duration 5 --resolution 768p --loras "$WAVESPEED_LORA_PATH" --download output/prototype/heat2-s1-5s-raw.mp4
# Scale raw 768×1344 → 720×1280
ffmpeg -y -i output/prototype/heat2-s1-5s-raw.mp4 -vf "scale=720:1280:flags=lanczos" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k output/prototype/heat2-s1-5s.mp4
# Repeat S2–S6 with mapping from §2 table:
# S2: image=$FIRST_URL  last_image=$LAST_URL   → heat2-s2
# S3: image=$LAST_URL   last_image=$LAST_URL   → heat2-s3
# S4: image=$LAST_URL   last_image=$LAST_URL   → heat2-s4
# S5: image=$LAST_URL   last_image=$POSTER_URL → heat2-s5
# S6: image=$POSTER_URL last_image=$POSTER_URL → heat2-s6

# Heat 3 — same stitch but prompts from §3 (replace heat2 with heat3 dir)
# for n in 1..6; do wavespeed run ... --prompt "<§3 S${n} Heat 3>" ... -o output/prototype/heat3-s${n}-5s-raw.mp4; done

# Heat 4 — T2I first (12 stills), then H3 stitch — only after you filled docs/storyboard-heat4.local.md via §4b
# Step 1: T2I — 12 calls (see §4c for full CLI; paste each filled PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 line)
# for each line in docs/storyboard-heat4.local.md (12 lines: s1-first, s1-last, s2-first, s2-last … s6-last):
#   wavespeed run alibaba/wan-2.7/text-to-image --prompt "<line>" --size "720*1280" --lora "$WAVESPEED_LORA_PATH" -o output/heat4/s{n}-{first,last}-720x1280.jpg
#   sips -g pixelWidth -g pixelHeight output/heat4/s{n}-{first,last}-720x1280.jpg  # → 720 1280
# wavespeed upload output/heat4/s1-first-720x1280.jpg --json  # → HEAT4_S1_FIRST_URL (repeat 12)
# Step 2: H3 — animate each Heat 4 pair (image=first_frame still, last_image=last_frame still)
# wavespeed run wavespeed-ai/minimax-h3/image-to-video-lora --image "$HEAT4_S1_FIRST_URL" --last-image "$HEAT4_S1_LAST_URL" --prompt "$(sed -n '1p' docs/storyboard-heat4.local.md) — Heat 4 I2V tail 5s" --duration 5 --resolution 768p --loras "$WAVESPEED_LORA_PATH" -o output/heat4/s1-5s-raw.mp4
# Repeat S2–S6; then ffmpeg scale 768×1344 → 720×1280 as above; then concat to heat4-30s.mp4

# Stitch per heat (example Heat 2)
cat > /tmp/heat2_concat.txt <<TXT
file '/Users/parab/Documents/Personal/veilwick/output/prototype/heat2-s1-5s.mp4'
file '/Users/parab/Documents/Personal/veilwick/output/prototype/heat2-s2-5s.mp4'
file '/Users/parab/Documents/Personal/veilwick/output/prototype/heat2-s3-5s.mp4'
file '/Users/parab/Documents/Personal/veilwick/output/prototype/heat2-s4-5s.mp4'
file '/Users/parab/Documents/Personal/veilwick/output/prototype/heat2-s5-5s.mp4'
file '/Users/parab/Documents/Personal/veilwick/output/prototype/heat2-s6-5s.mp4'
TXT
ffmpeg -y -f concat -safe 0 -i /tmp/heat2_concat.txt -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k output/prototype/heat2-30s.mp4
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of default=noprint_wrappers=1 output/prototype/heat2-30s.mp4
# expect 720×1280 ~31.08s, 744 frames @24fps, 7–8M
```

Cost per heat: `6×$0.25 = $1.50` (same as E1/E2). All three heats would be `$4.50` if run sequentially; parallel bottleneck ~130s.

---

## 7. Local LLM test (Anubis / Ollama / parser)

### 7a. Markdown contract (no LLM needed — deterministic)

```bash
# Heat 4 T2I placeholders — §4a only (code-block count = 12) — canonical gate
sed -n '/^### 4a\. Heat 4 T2I/,/^### 4b\./p' docs/storyboard-heat2-4.md | grep -c "^PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280"  # → 12 (6 scenes × first_frame + last_frame, code blocks only — lines starting PASTE)
# Looser §4a range (includes prose mentions) → 14 (12 blocks + instruction line + count line):
sed -n '/^### 4a\. Heat 4 T2I/,/^### 4b\./p' docs/storyboard-heat2-4.md | grep -c "PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280"  # → 14
# Overall doc contains more mentions of the token (episode table, verify line, §4c, §5b example, footer, this block) — total grep is higher, code-block gate is the contract:
grep -c "PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280" docs/storyboard-heat2-4.md    # → 31 (12 in §4a blocks + 19 in prose/example/verification/footer) — do not use as gate
grep -c "PASTE YOUR HEAT 4" docs/storyboard-heat2-4.md                            # → same 31 (no old 6-block token remains)
grep -c "photorealistic 8k" docs/storyboard-heat2-4.md             # → 28 (6 Heat2 + 6 Heat3 + 12 Heat4 T2I placeholders + 4 in §5b/§4 prose)
grep -c "vertical 9:16 720x1280" docs/storyboard-heat2-4.md         # → 29 (12 Heat2/3 prompts + 12 Heat4 T2I + 5 in prose/example)
grep -c "720\*1280" docs/storyboard-heat2-4.md                      # → 37 (T2I --size 720*1280 ×26 + H3 scale mentions + this block)
grep -c "compilation: your-new-stepsister-e1-heat" docs/storyboard-heat2-4.md  # → 24 (12 Heat2/3 + 12 Heat4 T2I)
grep -c "first_frame T2I\|last_frame T2I" docs/storyboard-heat2-4.md  # → 28 (12 placeholders + instruction + §4c + verify lines)
grep -c "alibaba/wan-2.7/text-to-image" docs/storyboard-heat2-4.md  # → 26 (12 placeholders × T2I tag + §4c CLI ×6 + §6 + verify)
grep -c "clothed" docs/storyboard-heat2-4.md                        # → ≥24 (outfit + tags + negative)
! grep -v "negative:" docs/storyboard-heat2-4.md | grep -qi "nude\|naked" | grep -v "PASTE" && echo "clean: only in negative"  # only in negative tail
# client.tsx — 12 logical T2I prompts via constant (literal grep hits the 1 definition; logical count via fields = 12)
grep -c "HEAT4_T2I_PLACEHOLDER" apps/web/app/prototype-scenes/client.tsx      # → 14 (1 def + 12 field assignments + 1 UI prose)
grep -c "PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280" apps/web/app/prototype-scenes/client.tsx  # → 1 (the constant definition; 12 fields reference it — logical 12 via constant)
grep -c "heat4FirstFrameT2iPrompt\|heat4LastFrameT2iPrompt" apps/web/app/prototype-scenes/client.tsx  # → 16+ (12 assignments + 2 type fields + header + UI)
sips -g pixelWidth -g pixelHeight public/storyboard/pick-your-new-stepsister-e1-first.jpg | grep 720
bun run typecheck  # TS still green — FEED_CATEGORIES unchanged, Scene now has heat4FirstFrameT2iPrompt/heat4LastFrameT2iPrompt
```

Expected all green. This is the **VeilWick engine** read test — `STORYBOARD_HEAT2_4` in §5b is the typed contract the engine imports.

### 7b. Local LLM smoke (Ollama if models pulled, else Anubis Vast tunnel)

**If Ollama has a model:**
```bash
ollama list
ollama run qwen2:0.5b "Summarize docs/storyboard-heat2-4.md Heat 2 vs Heat 3 difference in one line." --verbose
# or tiny test:
echo "docs/storyboard-heat2-4.md contains $(grep -c 'Heat 2' docs/storyboard-heat2-4.md) Heat2 rows and $(grep -c 'PASTE YOUR HEAT 4' docs/storyboard-heat2-4.md) Heat4 placeholders" | ollama run qwen2:0.5b
```

**Via Anubis (when Vast/Dell tunnel is up — preferred for this doc):**
```bash
# Anubis Mini 8B health
curl -s http://localhost:8080/health | jq .
curl -s http://localhost:8080/v1/models | jq .
# Prompt-shape check (does it respect 720x1280 5s?)
curl -s http://localhost:8080/v1/chat/completions -H "Content-Type: application/json" -d '{
  "model":"Anubis-Mini-8B-Q4_K_M",
  "messages":[{"role":"user","content":"Read docs/storyboard-heat2-4.md S3 Heat 2 vs Heat 3 — what token was added for Heat 3? Answer in 1 line."}],
  "temperature":0.2,"max_tokens":64
}' | jq -r '.choices[0].message.content'
# Expect: "Heat 3 adds intentional touch: hand-on-shoulder + hair-tuck + consent line Is this okay?"
```

**If no local LLM is running** (Ollama models [] and Vast not tunneled), the `grep` contract in §7a is the gate — the doc is still valid VeilWick engine input; Anubis fill happens when you bring the tunnel up per §4b.

### 7c. Parser demo (engine read without FEED_CATEGORIES break)

```ts
// node --loader ts-node/esm -e '
import { readFileSync } from "fs";
const md = readFileSync("docs/storyboard-heat2-4.md","utf8");
const heat2 = (md.match(/S\d — .*Heat 2[\s\S]*?```/g)||[]).length; // 6
const heat4t2i = (md.match(/PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280/g)||[]).length; // 12 in §4a (6 first + 6 last) — note: regex literal itself contains the token, so grep on file counts 13 total (12 blocks + this line); code-block-only count is 12
console.log({heat2, heat4t2i, hasVertical: md.includes("vertical 9:16 720x1280"), hasStarSize: md.includes("720*1280"), hasStoryboardMap: md.includes("STORYBOARD_HEAT2_4")});
// → { heat2: 6, heat4t2i: 12, hasVertical: true, hasStarSize: true, hasStoryboardMap: true }
```

---

## 8. Sources map

| File | What was used |
|---|---|
| `docs/prompts.md` | §1 base template, §2a 12-beat + §2b escalators + §2c 5-phase + §2d arc 5, §4 dialogue templates, §5b H3 library + §5c realism tail (photorealistic 8k f/2.0 35mm LUT) |
| `docs/e2-prompts.md` | §2 camera grammar (4 presets), §3 scene table stitch `image+last_image`, §4 generation plan, §6 guardrails — E1 heat matrix reuses its S(n).last→S(n+1).first wiring |
| `apps/web/app/prototype-scenes/client.tsx` | SCENES[0–5] (S1 Setup → S6 Afterglow) + `heat4FirstFrameT2iPrompt`/`heat4LastFrameT2iPrompt` per scene (12 placeholders `PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280`), REALISM_EXPANDED_S1, NEGATIVE_PROMPT, firstFrame/lastFrame/angle/pov/lighting/tags — Heat 2 inherits S1,S2,S5,S6 fade; Heat 3 inherits S3,S4 touch; Heat 4 T2I has first/last per scene via Wan 2.7 `720*1280` |
| `docs/oss-prompts-mmh3-wan.md` | §1 H3 structure (参考素材说明 → 核心创意 → 画面过程 → 贯穿要求 → 限制), camera vocab `truck+pan/orbit`, candid imperfection with cause, `non_diegetic_music: N/A`, frame math `81@16fps=5.06s` |
| `docs/nsfw-foundation.md` | §3 swap table (`*.local.md` gitignored, `WAVESPEED_LORA_PATH`), §2 engine wiring (H3 5s $0.25, reference-to-video $0.30) — Heat 4 follows same `*.local.md` isolation |
| `docs/vast-anubis-rental.md` | Vast SSH tunnel `ssh6.vast.ai:24552 -L 8080:localhost:8080`, `llama-server --split-mode row --n-gpu-layers 99`, curl `/v1/chat/completions` — Anubis Mini 8B is same API with smaller GGUF |
| `apps/web/src/lib/wavespeed.ts` | `FEED_CATEGORIES`, `FEED_PROMPTS`, `getFeedPrompt`, `H3_IMAGE_TO_VIDEO_LORA_MODEL`, `MMH3_LORA_PATH`, pricing — §5 mapping keeps feed intact |

---

*Prepared 2026-09-01, updated Heat 4 to 12 T2I placeholders (6 scenes × first_frame + last_frame), local file only. Heat 2–3 prompts are text-only and non-explicit (clothed, 720×1280 5s) — 12 prompts fully written. Heat 4 is T2I placeholder only — `PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280` ×12 — fill via Anubis Mini 8B on Vast/Dell per §4a/§4b, generate stills via `alibaba/wan-2.7/text-to-image --size 720*1280 --lora /tmp/MysticXXX_MMH3-V4.safetensors` (or `wavespeed-ai/wan-2.1/text-to-image`, see §4c), then H3 `image+last_image` — save to `docs/storyboard-heat4.local.md` (gitignored, 12 lines) + `client.tsx` `heat4FirstFrameT2iPrompt`/`heat4LastFrameT2iPrompt`, never commit. No wavespeed call, no upload, no video generated here.*
