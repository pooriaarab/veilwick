# VeilWick Prompts & Scene Guide — Wan 2.4-14B + LoRA + Wavespeed

> Synthetic 18+ wellness, vertical 720x1280, 60s episodes (4–6 shots). All characters fictional, consenting adults 18+. No real persons. Sanitized — suggestive, not explicit. Title typography is hero; intimacy is implied through lighting, gaze, proximity.

Source doc — expanded from research: NSFW story beats, porn-script beats, candy.ai patterns, Wan FLF duration, handheld/POV, LoRA + reference consistency, color LUT.

---

## 1. Base prompt template (Wan 720x1280)

```
cinematic, synthetic adult woman 18+, {category_mood}, soft studio lighting, photorealistic, 8k, shallow depth of field, vertical 720x1280, detailed skin, natural pose
```

Negative: `low quality, blurry, deformed, cartoon, illustration, duplicate, watermark`

Defaults: steps 28, CFG 6.5, sampler dpmpp_2m, LoRA weight 0.8. Resolution locked to `720x1280` (portrait 9:16). For t2i posters use Wavespeed `alibaba/wan-2.7/text-to-image` with `size="720*1280"` (see `docs/poster-styles.md`).

---

## 2. Story beats — NSFW / erotic romance (sanitized)

### 2a. 12-beat romance spine (adapted — use for 60s series arc)

Distilled from romance-novel 12-beat structure. Map one series (5 eps) onto it; each beat = 10–15s shot.

| Beat | Function | VeilWick translation (sanitized) |
|---|---|---|
| 1. Adoration/setup | Introduce lead + world | Solo wellness portrait, warm daylight, soft smile |
| 2. Meet-cute | First proximity | Glance across room, shared object (mug, book), eye contact |
| 3. No-way / tension | Why not now | Doorway hesitation, folded laundry, office blinds shadow |
| 4. Adhesion | Forced proximity | Lake house couch, kitchen counter, car passenger seat |
| 5. Temptation | Intentional touch | Hand on shoulder, hair tuck, towel drape — no nudity |
| 6. Leap | Choose risk | Lean-in, breath sync, whisper — cut before kiss if S2 ceiling |
| 7. Retreat | Pull back | Look away, phone buzz, window light shift, solo beat |
| 8. Fall | Surrender | Soft sheets, embrace, eye contact, warm LUT |
| 9. Crisis | External threat | Intrusion, misunderstanding — handheld shake up |
| 10. Plan | Active choice | Packing, note, doorway decision |
| 11. Execution | Return + proof | Arrival, open door, gift, dialogue callback |
| 12. HEA/afterglow | Resolution | Cuddle, laugh, golden-hour dock — tagline on poster |

For **single 60s episode** compress to 4–6 shots: `setup → tension → temptation → leap → retreat/afterglow`.

### 2b. Erotic tension escalators (non-explicit)

From erotic-story craft: every intimate beat must shift emotion or plot. Use 3 levers:

- **Proximity:** distance → shared frame → touch-point (shoulder, waist) → embrace. Never jump stages.
- **Vulnerability:** reveal flaw/fear → receive softness → reciprocal disclosure.
- **Power play:** one leads, one follows, then swap. Boss/mentee, host/guest, guide/novice — roles flip at beat 8.

Pacing rule: alternate slow (gaze, breath) and charged (lean, whisper) beats. Keep 1–2 breaths of stillness between each escalation.

### 2c. Porn-script 5-phase (sanitized for VeilWick)

Adult-film scripting consistently hits 5 phases — mirror them without explicit act:

1. **Exposition (0–8s):** place, wardrobe, motive in one line. `warm lake house kitchen, morning, linen robe, making coffee`
2. **Tease (8–20s):** dialogue + micro-touches, camera lingers on hands/eyes not body. Use POV or over-shoulder.
3. **Escalation (20–38s):** music drops, lighting warms, movement syncs. Add handheld micro-shake for urgency.
4. **Climax proxy (38–50s):** emotional peak — laugh, embrace, spin, dip, not explicit act. Slow-mo friendly.
5. **Afterglow/tag (50–60s):** pull wide, soft focus, tagline moment. Poster frame lives here (extract at 1.2s for cold open, or 52s for afterglow).

Each phase should change **one** variable: location, lighting, or camera distance. Changing all three at once reads as a cut.

### 2d. 5 high-recall arcs — sanitized, 18+ consensual, clothed

Distilled from marketplace rank (forced proximity / forbidden boss / enemies-to-lovers dominate romance + adult-film tag frequency) and companion-platform roleplay popularity (candy.ai / Joyland top premises). All arcs are **synthetic adults 18+, consensual, clothed, Heat 2–3, fade-to-black** — VeilWick never stages non-consensual or underage framing; every arc inserts a consent beat before escalation (see §4).

| Arc | Core tension (sanitized) | Escalator used | VeilWick series example | Prompt cue (Heat 2–3, clothed) |
|---|---|---|---|---|
| 1. Forced proximity | One room / stranded / lake house — must share space | Proximity (distance → shared frame) | `private-lessons` E1–2: lake house couch | `shared couch, linen loungewear, soft daylight, folded blanket between them — polite distance` |
| 2. Forbidden / power-gap (consensual) | Boss / mentor / host–guest — role gap, mutual check-in, roles flip at beat 8 | Power play + Vulnerability | `midnight-overtime` / `private-lessons`: boss-mentee, guide-novice | `office blinds shadow, tailored blazer over soft blouse, eye contact + nod — "is this okay?"` |
| 3. Enemies / rivals → lovers | Banter → respect → softness; competence makes them attractive | Vulnerability (flaw reveal → softness) + Power swap | Rotation slot — rival coworkers / debate partners | `kitchen counter opposite sides, mugs, sharp smile softens — she listens first` |
| 4. Second chance / reunion | Past hurt, now mature — nostalgia + proof they changed | Vulnerability + Afterglow | Rotation slot — ex, former best friend returns | `doorway decision, note in hand, doorway light warm — "you came back"` |
| 5. Stranger / fated encounter | Wrong door, missed train, one night that should be nothing | Proximity + Vulnerability (instant disclosure) | Rotation slot — `your-new-stepsister` AU as fated-household proximity (consensual adults, no blood relation implied — chosen-family framing) | `hallway hesitation, tote bag, linen dress, soft gaze — "you're early"` |

Use rule: one series = one arc for 5 eps. Map arcs onto the 12-beat spine (adhesion = proximity peak, leap = power flip, fall = vulnerability surrender). Keep Heat 2–3 — clothed, lighting/gaze carry the charge; never costume as nudity proxy.

### 2e. Single-episode scene map — 5–6 shots → beats + template → prompt snippet (Heat 2–3, clothed, sensual)

One 60s vertical episode (720x1280 / 768x1360, 5–6 shots). All rows are **synthetic 18+ clothed, Heat 2–3 (fade-to-black / suggestive, no explicit act), sensual via light/gaze/proximity**. Chain FLF / H3 stitch: last frame of scene N = first frame of N+1.

| Scene | Time | Beat(s) from §2a | Erotic template (escalator + 5-phase) | Prompt snippet (copy/paste tail — append to base §1 / §5b) |
|---|---|---|---|---|
| S1 — Setup / exposition | 0–8s | 1 Adoration + 2 Meet-cute | Proximity start + Phase 1 Exposition; Arc probe | `warm lake house kitchen morning, linen robe over loungewear clothed, making coffee, soft window light, eye-level over-shoulder, shallow DOF, photorealistic 8k — calm curiosity` |
| S2 — Tension / no-way | 8–20s | 3 No-way + 4 Adhesion | Proximity (shared frame) + Phase 2 Tease; Forced-proximity arc | `doorway hesitation shared hallway, folded laundry foreground, soft bokeh, gaze holds — "stay — just a minute longer" — clothed` |
| S3 — Tease / temptation | 20–32s | 5 Temptation | Vulnerability (soft disclosure) + Power play setup | `couch close, hand on shoulder light, hair tuck consent check — "is this okay? nod if you're with me" — linen dress clothed, warm LUT` |
| S4 — Leap / escalation | 32–44s | 6 Leap → 8 Fall | Power flip + Phase 3 Escalation | `lean-in breath sync, whisper "breathe with me — slow", subtle handheld breathing, eye contact, clothed, 35mm shallow` |
| S5 — Climax proxy | 44–52s | 8 Fall / 11 Execution peak | Vulnerability surrender + Phase 4 Climax proxy (emotional, not explicit) | `soft embrace laugh spin, golden-hour dock light, warm teal shadows, locked tripod — joy not act — clothed` |
| S6 — Afterglow / tag | 52–60s | 12 HEA afterglow (poster frame) | Afterglow + Phase 5 Tag; pull wide | `pull wide soft focus, cuddle blanket, tagline overlay moment — "some house rules are meant to be broken" — clothed, lifted blacks` |

**5-shot cut:** merge S4+S5 into one 12s Escalation→proxy (`lean-in → embrace laugh`, beats 6+8, phases 3+4). Keep 6 rows when you need a handheld crisis beat (beat 9) between S4 and S5.

Verify per row: includes `clothed`, no explicit anatomy/act verb, Heat 2–3 language (gaze, breath, light, proximity), matches one escalator + one 5-phase shift (location OR light OR distance changes, not all three).

---

## 3. Candy.ai storyline patterns — what to borrow (sanitized analysis)

Candy.ai is a companion platform where users chat/roleplay with synthetic characters across long arcs (50+ messages) with phone-call and image extensions.

Key patterns relevant to VeilWick:

- **Persistent memory wins:** Story Mode remembers names, relationships, prior beats without prompting. VeilWick analogue: `user_interactions` + `user_profile_json` affinity (see `veilwick-personalization.md`). Persist top-2 categories and last tagline so episode 3 callbacks feel remembered.
- **Distinct personalities, not generic flirt:** Each of 5 tracked characters keeps voice, boundary, quirk. Borrow by assigning each series its own **voice card** — 3 adjectives + 1 taboo + 1 catchphrase. E.g. `staycation: warm, teasing, grounded; taboo: no office talk; line: "you're early"`.
- **Multi-character interjection:** In group scenes, secondary characters chime in unprompted but stay in character. For VeilWick, if a series has 2 leads, let the non-POV lead have 1 line per episode that references ep1.
- **Phone-call cadence:** Calls are slow, breathy, with pauses. Dialogue templates mirror this — short sentences, 1 instruction per sentence, present tense.
- **Visual + text coupling:** Every 4–6 message beats triggers a new image; image reuses same LoRA + reference. VeilWick does same: one reference portrait per series, reused across all 5 episodes.
- **Monetization beat:** Free beats 1–2, paywall 3–5 (VeilWick cliffhanger matches: `FREE_EPISODES=2` in `wavespeed.ts`). Design cliffhanger at end of ep2 explicitly.

Avoid copying explicit copy; keep Candy.ai research as structural reference only.

---

## 4. Dialogue templates — intimate but sanitized

Principles from romance heat-level guides (levels 2–4) and erotic-dialogue craft:

- Heat 2 = fade-to-black (suggestive), Heat 4 = explicit but emotionally driven. VeilWick targets **Heat 2–3** in prompts/dialogue — romantic tension, soft cinematic lighting, no explicit act naming.
- One sentence = one action or feeling. Active voice, present tense. Max 20 words per line.
- After any intimate line, include **emotional stake** (trust, relief, play, reassurance) so the scene changes the relationship.

### Starter lines (copy/paste, swap pronouns)

**Tease / proximity:**
- `You’re closer than I expected.`
- `Stay — just a minute longer.`
- `You don’t have to be so careful with me.`
- `I’ve been thinking about this since the kitchen.`

**Consent / check-in (required before any escalation):**
- `Is this okay? Tell me if you want to pause.`
- `Only if you want to — say yes.`
- `We go at your pace. Nod if you’re with me.`

**Escalation (soft, non-explicit):**
- `Breathe with me — slow.`
- `Look at me when you say that.`
- `You feel that? That’s us, not just — this.`
- `Don’t look away. I want to remember how you look right now.`

**Afterglow / tag:**
- `You’re still here. Good.`
- `That was — yeah. That was us.`
- `Next time, I’ll be the one who’s nervous.`

**Tagline seeds for posters:**
- `Some house rules are meant to be broken.`
- `One summer, one dock, one look too long.`
- `She wasn’t supposed to stay.`

Avoid: explicit anatomy, act verbs, real-person names, non-consensual framing. Every series bible should include a `consent_beat` before escalation.

---

## 5. Feed category prompts — H3 image-to-video-lora (non-explicit fashion/wellness, 768p 9:16)

Feed defaults to H3 `wavespeed-ai/minimax-h3/image-to-video-lora` ($0.25 / 5s, 768p 9:16, `image` + `last_image` + `loras` + `prompt` + `duration:5` + `resolution:768p`) and `reference-to-video-lora` ($0.30). All prompts below are **non-explicit fashion/wellness/lifestyle clothed** — sourced via `apps/web/src/lib/wavespeed.ts:FEED_PROMPTS` / `getFeedPrompt(category)` and tags by angle/POV/lighting via `FEED_TAGS`. No explicit porn prompts. Wan library prompts (Civitai LoRAs) retained for later nightly batch only — not feed.

| Category | Prompt (clothed) | Tags (angle / POV / lighting) |
|---|---|---|
| `market-stall-fashion` | cinematic vertical 768p 9:16, market stall fashion lifestyle, linen resort wear, soft natural daylight, photorealistic 8k, shallow depth, subtle handheld breathing, eye-level POV, warm cinematic LUT, clothed | angle:eye-level, pov:over-shoulder, lighting:soft-natural-daylight |
| `beach-lifestyle` | cinematic vertical 768p 9:16, beach lifestyle wellness, breezy linen outfit, golden-hour soft light, photorealistic, gentle dolly push-in, over-shoulder POV, teal shadows orange highlights, clothed | angle:eye-level, pov:walking-approach, lighting:golden-hour |
| `studio` | cinematic vertical 768p 9:16, studio fashion portrait, soft studio lighting, photorealistic 8k, locked tripod centred, eye contact, shallow depth, lifted blacks S-curve, clothed | angle:centred-tripod, pov:eye-contact, lighting:soft-studio |
| `bedroom-lifestyle` | cinematic vertical 768p 9:16, bedroom lifestyle clothed, cozy morning light, linen loungewear, soft fill light, photorealistic, handheld micro-shake 35mm, warm tones, clothed wellness | angle:eye-level, pov:handheld-breathing, lighting:window-soft-fill |
| `wellness` | cinematic vertical 768p 9:16, wellness mindfulness, soft daylight, photorealistic, steady cam, eye-level angle, natural breathing, calm palette, clothed | angle:eye-level, pov:steadicam, lighting:soft-daylight |
| `fitness` | cinematic vertical 768p 9:16, fitness activewear, dynamic soft studio light, photorealistic, low-angle dolly, energetic wellness, clothed, shallow depth | angle:low-dolly, pov:handheld-tracking, lighting:soft-studio-key |
| `activewear` | cinematic vertical 768p 9:16, activewear fashion, studio soft key + teal fill, photorealistic, mid-shot eye-level, handheld subtle, clothed lifestyle | angle:mid-shot, pov:eye-level, lighting:teal-fill |
| `breathwork` | cinematic vertical 768p 9:16, breathwork wellness, serene daylight, photorealistic, slow push-in, eye contact, shallow depth, warm LUT, clothed | angle:push-in, pov:eye-contact, lighting:serene-daylight |

H3 call: `generateH3ImageToVideoLora({ image, lastImage, prompt: getFeedPrompt(category), loras: WAVESPEED_LORA_PATH?.split(","), duration: 5, resolution: "768p" })` — `last_image` enables seamless stitch, `loras` optional via `WAVESPEED_LORA_PATH` env.

Tip: for vertical, always append `vertical 768p 9:16, portrait` — H3 respects aspect tokens. Keep LoRA trigger exact (`veilwick_style` if trained via `wavespeed.ts:trainLoRA`). Library Wan prompts retained in §5b archive below.

---

## 5b. H3 Non-Explicit Prompt Library — image-to-video-lora (9:16, 720p/768p, 5s)

> **Scope:** Clothed fashion / wellness only. Synthetic adult woman 18+, fully clothed. No explicit sexual acts, no nudity, no genitalia, no fluids, no exposed chest. For H3 image-to-video-lora feed (addictive 5s clips, personalized via DreamBooth per user × category).
>
> **H3 pipeline:** `reference_image (720x1280 or 768x1360) + prompt + LoRA → 5s vertical video`. All prompts below are H3-native: one reference still per generation, DreamBooth LoRA weight 0.6–0.8 (`veilwick_style` trigger), compilation-tagged for veilwick feed.

### Common spec — every prompt in this library includes

```
vertical 9:16, 720p 720x1280 (or 768p 768x1360), 5s duration, static camera or slow bob,
photorealistic 8k, synthetic adult woman 18+ clothed, shallow depth of field
```

- **Resolution tokens:** always append `vertical 9:16, 720x1280, portrait` (720p) or `vertical 9:16, 768x1360, portrait` (768p). H3 and Wan both respect aspect tokens. Use 768p when source still is 768-wide; otherwise 720p default.
- **Duration token:** include `5s duration, 5 second clip` in prompt. Ensures H3 truncates to exactly 5.06s (81 frames @16fps) / 5s.
- **Camera token:** one of `static camera, locked tripod, no movement` OR `slow bob, subtle handheld with breathing, micro head bob, gentle push-in` — never both. No shake, no whip-pan, no zoom.
- **Negative (append for all):** `low quality, blurry, deformed, cartoon, illustration, duplicate, watermark, nude, naked, topless, explicit, genitalia, nsfw act`
- **Compilation metadata (required tail):** `compilation: {category}, tags: {tags}` — e.g. `compilation: market-stall-fashion, tags: fashion, wellness, clothed`
- **LoRA:** H3 DreamBooth per-category (`veilwick_style:0.7`) + reference image. No Civitai NSFW LoRA here; this library is clothed-only.

### Base H3 prompt template (copy/paste)

```
cinematic, synthetic adult woman 18+ clothed, {outfit + setting}, {angle}, {lighting}, vertical 9:16 720x1280, 5s duration, {camera}, photorealistic 8k, shallow depth of field, natural pose, soft skin detail, {mood}
— negative: low quality, blurry, deformed, cartoon, illustration, duplicate, watermark, nude, naked, topless, explicit
— compilation: {category} | tags: {tags} | duration: 5s | camera: {camera_token} | res: 720x1280 9:16
```

### Angle vocabulary (pick one per variant)

| Angle | Prompt token | Use |
|---|---|---|
| POV | `true first-person POV, eye level, viewer's hands soft foreground, no HUD, eye contact, intimate wellness` | Market, cafe — viewer as shopper/guest |
| Waist-height | `waist-height camera, medium shot, eye level, soft bokeh foreground, natural framing` | Fashion walk, beach, street — shows outfit full |
| High-angle close-up | `high-angle close-up, 35mm, eye level slightly above, face + shoulders, shallow depth, warm catchlight` | Studio, bedroom, rooftop — portrait, gaze |

Always add `looking directly at viewer, gentle smile` or `soft gaze off-camera` to anchor synthetic gaze. For POV add `no HUD no UI, natural breathing`.

### Lighting vocabulary (pick one per variant)

| Lighting | Prompt token | Use |
|---|---|---|
| Soft warm | `soft warm light, golden hour glow, diffused window, teal shadows lifted, cinematic_warm LUT` | Studio, bedroom, cafe, rooftop |
| Bright daylight | `bright daylight, clean natural light, soft shadows, high key, crisp white balance` | Beach, street, gym, boutique |
| Market sun stripes | `market sun stripes, dappled sunlight through canvas awning, warm stripes on fabric, dust motes, high contrast soft` | Market-stall-fashion — signature look |

### Categories (8) — each with 3 angle variations

---

#### 1) market-stall-fashion

**Mood:** curated fashion, approachable luxury, tactile fabrics. Always clothed: linen dress, knit co-ord, light jacket.
**Compilation:** `market-stall-fashion` | **Tags:** `fashion, market, linen, clothed, wellness`

**A) POV / market sun stripes / slow bob**
```
cinematic, synthetic adult woman 18+ clothed in breathable linen midi dress and light overshirt, browsing sunlit market stall with folded fabrics, true first-person POV eye level, viewer's hands soft foreground holding tote, no HUD, eye contact gentle smile, market sun stripes through canvas awning, dappled light on fabric, vertical 9:16 720x1280, 5s duration, slow bob subtle handheld with breathing micro head bob, photorealistic 8k, shallow depth, natural pose
— compilation: market-stall-fashion | tags: fashion, market, linen, clothed | duration: 5s | camera: slow bob | res: 720x1280 9:16
```

**B) Waist-height / bright daylight / static camera**
```
cinematic, synthetic adult woman 18+ clothed in cream knit co-ord and straw bag, standing at market stall with ceramics and textiles, waist-height camera medium shot eye level, soft bokeh foreground of market goods, bright daylight clean natural light soft shadows, vertical 9:16 720x1280, 5s duration, static camera locked tripod no movement, photorealistic 8k, gentle smile, street market depth
— compilation: market-stall-fashion | tags: fashion, market, knit, clothed | duration: 5s | camera: static | res: 720x1280 9:16
```

**C) High-angle close-up / soft warm / static camera (768p variant)**
```
cinematic, synthetic adult woman 18+ clothed in sage linen shirt, market stall background soft blur, high-angle close-up 35mm face + shoulders, warm catchlight, soft warm light diffused golden, vertical 9:16 768x1360, 5s duration, static camera locked tripod, photorealistic 8k, shallow depth, natural makeup, relaxed gaze
— compilation: market-stall-fashion | tags: fashion, market, portrait, clothed | duration: 5s | camera: static | res: 768x1360 9:16
```

---

#### 2) beach-lifestyle

**Mood:** relaxed, sun-kissed, active wellness. Outfits: linen cover-up over swim top (fully clothed framing), wide-leg trousers, straw hat — cropped at waist or above, no swim nudity.
**Compilation:** `beach-lifestyle` | **Tags:** `beach, wellness, lifestyle, clothed, daylight`

**A) POV / bright daylight / slow bob**
```
cinematic, synthetic adult woman 18+ clothed in white linen cover-up over soft tank and wide-leg trousers, beach promenade boardwalk, true first-person POV eye level, eye contact, bright daylight clean natural light high key, sea breeze hair, vertical 9:16 720x1280, 5s duration, slow bob subtle handheld with breathing, photorealistic 8k, shallow depth, easy smile
— compilation: beach-lifestyle | tags: beach, wellness, linen, clothed | duration: 5s | camera: slow bob | res: 720x1280 9:16
```

**B) Waist-height / bright daylight / static camera**
```
cinematic, synthetic adult woman 18+ clothed in striped linen shirt and ecru trousers, walking beach path with tote, waist-height camera medium shot eye level, bright daylight soft shadows, ocean soft blur background, vertical 9:16 720x1280, 5s duration, static camera locked tripod, photorealistic 8k, natural pose, wind-kissed
— compilation: beach-lifestyle | tags: beach, lifestyle, linen, clothed | duration: 5s | camera: static | res: 720x1280 9:16
```

**C) High-angle close-up / soft warm / slow bob (768p)**
```
cinematic, synthetic adult woman 18+ clothed in soft knit, beach dunes sunset behind, high-angle close-up 35mm face + shoulders, soft warm light golden hour glow diffused, vertical 9:16 768x1360, 5s duration, slow bob gentle push-in, photorealistic 8k, shallow depth, sun flare soft, calm gaze
— compilation: beach-lifestyle | tags: beach, portrait, golden-hour, clothed | duration: 5s | camera: slow bob | res: 768x1360 9:16
```

---

#### 3) studio-portrait

**Mood:** clean, premium, editorial. Outfits: tailored blazer, silk blouse, knit — studio backdrop, no bedroom context.
**Compilation:** `studio-portrait` | **Tags:** `studio, portrait, fashion, editorial, clothed`

**A) POV / soft warm / static camera**
```
cinematic, synthetic adult woman 18+ clothed in tailored cream blazer and silk blouse, soft studio backdrop seamless, true first-person POV eye level, eye contact direct, soft warm light diffused window + teal shadows lifted cinematic_warm LUT, vertical 9:16 720x1280, 5s duration, static camera locked tripod, photorealistic 8k, shallow depth, editorial pose hands soft
— compilation: studio-portrait | tags: studio, portrait, editorial, clothed | duration: 5s | camera: static | res: 720x1280 9:16
```

**B) Waist-height / soft warm / slow bob**
```
cinematic, synthetic adult woman 18+ clothed in charcoal knit and wide trousers, studio seamless, waist-height camera medium shot eye level, soft warm light S-curve lifted blacks, vertical 9:16 720x1280, 5s duration, slow bob subtle handheld with breathing, photorealistic 8k, relaxed shoulders, natural pose
— compilation: studio-portrait | tags: studio, fashion, knit, clothed | duration: 5s | camera: slow bob | res: 720x1280 9:16
```

**C) High-angle close-up / bright daylight / static camera (768p)**
```
cinematic, synthetic adult woman 18+ clothed in white shirt, studio grey backdrop, high-angle close-up 35mm face + shoulders, bright daylight clean high key crisp white balance, vertical 9:16 768x1360, 5s duration, static camera locked tripod, photorealistic 8k, shallow depth, soft catchlight, gentle smile
— compilation: studio-portrait | tags: studio, portrait, daylight, clothed | duration: 5s | camera: static | res: 768x1360 9:16
```

---

#### 4) bedroom-lifestyle-clothed

**Mood:** cozy, morning light, fully clothed wellness (robe over loungewear, knit co-ord, no lingerie, no sheets-nude). Must read as lifestyle, not intimate act.
**Compilation:** `bedroom-lifestyle-clothed` | **Tags:** `bedroom, lifestyle, loungewear, cozy, clothed, wellness`

**A) POV / soft warm / static camera**
```
cinematic, synthetic adult woman 18+ clothed in soft knit loungewear and open linen robe, bright bedroom morning, sitting at vanity with mug, true first-person POV eye level, eye contact soft, soft warm light diffused window golden, vertical 9:16 720x1280, 5s duration, static camera locked tripod, photorealistic 8k, shallow depth, cozy textures, calm
— compilation: bedroom-lifestyle-clothed | tags: bedroom, loungewear, cozy, clothed | duration: 5s | camera: static | res: 720x1280 9:16
```

**B) Waist-height / soft warm / slow bob**
```
cinematic, synthetic adult woman 18+ clothed in ecru knit co-ord, bedroom with folded linens and plant, waist-height camera medium shot eye level, soft warm light morning diffused, vertical 9:16 720x1280, 5s duration, slow bob subtle handheld with breathing, photorealistic 8k, natural pose, gentle smile, shallow depth
— compilation: bedroom-lifestyle-clothed | tags: bedroom, knit, wellness, clothed | duration: 5s | camera: slow bob | res: 720x1280 9:16
```

**C) High-angle close-up / bright daylight / static camera (768p)**
```
cinematic, synthetic adult woman 18+ clothed in soft cotton shirt, bedroom window light, high-angle close-up 35mm face + shoulders pillow-soft background, bright daylight clean natural light, vertical 9:16 768x1360, 5s duration, static camera locked tripod, photorealistic 8k, shallow depth, relaxed gaze off-camera, serene
— compilation: bedroom-lifestyle-clothed | tags: bedroom, portrait, daylight, clothed | duration: 5s | camera: static | res: 768x1360 9:16
```

---

#### 5) cafe

**Mood:** warm, candid, urban wellness. Outfits: trench, knit, jeans, shirt.
**Compilation:** `cafe` | **Tags:** `cafe, lifestyle, urban, fashion, clothed`

**A) POV / soft warm / slow bob**
```
cinematic, synthetic adult woman 18+ clothed in camel trench over white shirt and jeans, cafe window seat with latte, true first-person POV eye level across table, eye contact over mug, soft warm light diffused window + wood tones cinematic_warm LUT, vertical 9:16 720x1280, 5s duration, slow bob subtle handheld with breathing, photorealistic 8k, shallow depth, candid smile
— compilation: cafe | tags: cafe, lifestyle, urban, clothed | duration: 5s | camera: slow bob | res: 720x1280 9:16
```

**B) Waist-height / bright daylight / static camera**
```
cinematic, synthetic adult woman 18+ clothed in soft knit and straight jeans, cafe interior plants and ceramics, waist-height camera medium shot eye level, bright daylight clean natural light soft shadows, vertical 9:16 720x1280, 5s duration, static camera locked tripod, photorealistic 8k, natural pose, tote on chair
— compilation: cafe | tags: cafe, fashion, knit, clothed | duration: 5s | camera: static | res: 720x1280 9:16
```

**C) High-angle close-up / market sun stripes / static camera (768p)**
```
cinematic, synthetic adult woman 18+ clothed in linen shirt, cafe awning outside, high-angle close-up 35mm face + shoulders, market sun stripes dappled through awning on skin soft, vertical 9:16 768x1360, 5s duration, static camera locked tripod, photorealistic 8k, shallow depth, warm catchlight, soft gaze
— compilation: cafe | tags: cafe, portrait, sun-stripes, clothed | duration: 5s | camera: static | res: 768x1360 9:16
```

---

#### 6) street-style

**Mood:** editorial street fashion, movement, city backdrop.
**Compilation:** `street-style` | **Tags:** `street, fashion, urban, editorial, clothed`

**A) POV / bright daylight / slow bob**
```
cinematic, synthetic adult woman 18+ clothed in oversized blazer and straight trousers with sneakers, city sidewalk, true first-person POV eye level walking approach, eye contact, bright daylight high key crisp, vertical 9:16 720x1280, 5s duration, slow bob micro head bob from footsteps with breathing, photorealistic 8k, shallow depth, confident smile
— compilation: street-style | tags: street, fashion, urban, clothed | duration: 5s | camera: slow bob | res: 720x1280 9:16
```

**B) Waist-height / bright daylight / static camera**
```
cinematic, synthetic adult woman 18+ clothed in striped shirt and wide trousers with tote, urban crosswalk soft blur, waist-height camera medium shot eye level, bright daylight soft shadows, vertical 9:16 720x1280, 5s duration, static camera locked tripod, photorealistic 8k, natural stride pose
— compilation: street-style | tags: street, fashion, trousers, clothed | duration: 5s | camera: static | res: 720x1280 9:16
```

**C) High-angle close-up / soft warm / static camera (768p)**
```
cinematic, synthetic adult woman 18+ clothed in soft knit turtleneck, city bokeh behind, high-angle close-up 35mm face + shoulders, soft warm light golden hour glow, vertical 9:16 768x1360, 5s duration, static camera locked tripod, photorealistic 8k, shallow depth, gentle gaze off-camera
— compilation: street-style | tags: street, portrait, golden-hour, clothed | duration: 5s | camera: static | res: 768x1360 9:16
```

---

#### 7) gym-activewear

**Mood:** wellness, movement, premium activewear. Fully clothed: leggings + oversized tee/zip, sports bra only under layer, never isolated.
**Compilation:** `gym-activewear` | **Tags:** `gym, activewear, fitness, wellness, clothed`

**A) POV / bright daylight / slow bob**
```
cinematic, synthetic adult woman 18+ clothed in slate leggings and oversized soft tee with zip layer, bright gym with plants and wood, true first-person POV eye level, eye contact, bright daylight clean high key, vertical 9:16 720x1280, 5s duration, slow bob subtle handheld with breathing, photorealistic 8k, shallow depth, healthy glow, water bottle foreground soft
— compilation: gym-activewear | tags: gym, activewear, fitness, clothed | duration: 5s | camera: slow bob | res: 720x1280 9:16
```

**B) Waist-height / bright daylight / static camera**
```
cinematic, synthetic adult woman 18+ clothed in charcoal activewear set with light jacket tied at waist, gym mat area, waist-height camera medium shot eye level, bright daylight soft shadows, vertical 9:16 720x1280, 5s duration, static camera locked tripod, photorealistic 8k, natural pose stretching arms, wellness mood
— compilation: gym-activewear | tags: gym, activewear, wellness, clothed | duration: 5s | camera: static | res: 720x1280 9:16
```

**C) High-angle close-up / soft warm / static camera (768p)**
```
cinematic, synthetic adult woman 18+ clothed in soft active top, gym window light, high-angle close-up 35mm face + shoulders, soft warm light diffused, vertical 9:16 768x1360, 5s duration, static camera locked tripod, photorealistic 8k, shallow depth, breathy wellness, gentle smile
— compilation: gym-activewear | tags: gym, portrait, wellness, clothed | duration: 5s | camera: static | res: 768x1360 9:16
```

---

#### 8) rooftop-golden-hour

**Mood:** golden hour glow, skyline soft, elevated lifestyle.
**Compilation:** `rooftop-golden-hour` | **Tags:** `rooftop, golden-hour, lifestyle, fashion, clothed`

**A) POV / soft warm / slow bob**
```
cinematic, synthetic adult woman 18+ clothed in cream knit and wide trousers, rooftop terrace golden hour, true first-person POV eye level, eye contact soft, soft warm light golden hour glow cinematic_warm LUT teal shadows, vertical 9:16 720x1280, 5s duration, slow bob gentle push-in with breathing, photorealistic 8k, shallow depth, skyline bokeh, serene
— compilation: rooftop-golden-hour | tags: rooftop, golden-hour, lifestyle, clothed | duration: 5s | camera: slow bob | res: 720x1280 9:16
```

**B) Waist-height / soft warm / static camera**
```
cinematic, synthetic adult woman 18+ clothed in linen shirt and ecru trousers, rooftop with plants, waist-height camera medium shot eye level, soft warm light golden, vertical 9:16 720x1280, 5s duration, static camera locked tripod, photorealistic 8k, natural pose, wind soft
— compilation: rooftop-golden-hour | tags: rooftop, lifestyle, linen, clothed | duration: 5s | camera: static | res: 720x1280 9:16
```

**C) High-angle close-up / soft warm / static camera (768p)**
```
cinematic, synthetic adult woman 18+ clothed in soft blouse, rooftop sunset, high-angle close-up 35mm face + shoulders, soft warm light golden hour boosted golds golden_hour.cube, vertical 9:16 768x1360, 5s duration, static camera locked tripod, photorealistic 8k, shallow depth, warm catchlight, calm gaze off-camera
— compilation: rooftop-golden-hour | tags: rooftop, portrait, golden-hour, clothed | duration: 5s | camera: static | res: 768x1360 9:16
```

---

#### 9) boutique-fitting

**Mood:** fitting room editorial, soft curtain light, hanger details — clothed try-on only.
**Compilation:** `boutique-fitting` | **Tags:** `boutique, fashion, fitting, editorial, clothed`

**A) POV / soft warm / static camera**
```
cinematic, synthetic adult woman 18+ clothed in tailored trousers and soft blouse holding hanger, boutique fitting area curtain light, true first-person POV eye level, eye contact in mirror soft, soft warm light diffused curtain, vertical 9:16 720x1280, 5s duration, static camera locked tripod, photorealistic 8k, shallow depth, curated racks background
— compilation: boutique-fitting | tags: boutique, fashion, fitting, clothed | duration: 5s | camera: static | res: 720x1280 9:16
```

**B) Waist-height / bright daylight / slow bob**
```
cinematic, synthetic adult woman 18+ clothed in ecru knit and cream trousers, boutique aisle with folded knit stacks, waist-height camera medium shot eye level, bright daylight clean natural light, vertical 9:16 720x1280, 5s duration, slow bob subtle handheld with breathing, photorealistic 8k, natural pose adjusting sleeve
— compilation: boutique-fitting | tags: boutique, fashion, knit, clothed | duration: 5s | camera: slow bob | res: 720x1280 9:16
```

**C) High-angle close-up / soft warm / static camera (768p)**
```
cinematic, synthetic adult woman 18+ clothed in soft knit, boutique mirror soft blur, high-angle close-up 35mm face + shoulders, soft warm light editorial glow, vertical 9:16 768x1360, 5s duration, static camera locked tripod, photorealistic 8k, shallow depth, gentle smile, curated boutique bokeh
— compilation: boutique-fitting | tags: boutique, portrait, editorial, clothed | duration: 5s | camera: static | res: 768x1360 9:16
```

### H3 generation defaults for this library

| Field | Value |
|---|---|
| Pipeline | `image-to-video-lora` (H3 DreamBooth per user × category) |
| Input | Single reference image 720x1280 or 768x1360 + prompt + LoRA `veilwick_style:0.7` |
| Duration | 5s (81 frames @16fps or 5s @ requested fps) — include `5s duration` in every prompt |
| Resolution | `720*1280` (720p) or `768*1360` (768p), vertical 9:16 — pass as `size: "720*1280"` or `size: "768*1360"` |
| Camera | `static camera, locked tripod` OR `slow bob, subtle handheld with breathing` — never handheld shake |
| Negative | `low quality, blurry, deformed, cartoon, illustration, duplicate, watermark, nude, naked, topless, explicit, genitalia` |
| Compilation | Tail `compilation: {category}, tags: ..., duration: 5s, camera: ..., res: ...` for feed indexing |
| R2 key | `videos/{category}/{userId}/{id}.mp4` via `h3R2Key()` (see `apps/web/src/lib/h3.ts`) |
| Fallback | No Wan fallback for this feed — queue consumer handles H3 only; Wan remains for curated short library |

### Quick copy — one-liner per category (waist-height + bright daylight + static)

For batch queue seeding: pick one per category, swap reference image, keep compilation tail.

```
market-stall-fashion: waist-height medium, bright daylight, static 5s 720x1280
beach-lifestyle: waist-height medium, bright daylight, static 5s 720x1280
studio-portrait: waist-height medium, soft warm, slow bob 5s 720x1280
bedroom-lifestyle-clothed: waist-height medium, soft warm, slow bob 5s 720x1280
cafe: waist-height medium, bright daylight, static 5s 720x1280
street-style: waist-height medium, bright daylight, static 5s 720x1280
gym-activewear: waist-height medium, bright daylight, static 5s 720x1280
rooftop-golden-hour: waist-height medium, soft warm, static 5s 720x1280
boutique-fitting: waist-height medium, bright daylight, slow bob 5s 720x1280
```

Verify before commit: `bun run typecheck` passes; `grep -r "compilation:" docs/prompts.md` shows all 9 categories; no prompt contains nudity/explicit act tokens; every prompt includes `vertical 9:16`, `5s`, and `static camera` or `slow bob`.

---

## 5c. Realism Expansion Template — candy.ai photorealistic 8k vs cartoonish (H3 prototype)

> **Goal:** push H3 / Wan storyboard frames from flat cartoonish toward candy.ai-level photorealistic 8k — shallow depth, natural skin, detailed textures — while staying clothed and synthetic 18+.

### When to apply

- Single-video realism test (`/prototype-scenes` Generate-One) and any storyboard shot that reads plasticky / waxy / anime-like.
- Always on top of the base §5b prompt; do not replace category tokens, append realism tail.

### Expansion template (append verbatim)

```
photorealistic 8k, shallow depth of field f/2.0, 35mm lens, soft studio lighting + teal fill + lifted blacks S-curve cinematic_warm LUT, natural skin texture detailed pores subsurface scattering, tactile fabric weave, wood grain / linen detail, volumetric dust motes, shallow DOF bokeh, vertical 720x1280, 5s duration, static camera locked tripod no movement
— negative: low quality, blurry, deformed, cartoon, illustration, anime, 3d render, cgi, plastic skin, oversaturated, duplicate, watermark, nude, naked, topless, explicit, genitalia, jpeg artifacts
— steps 28, CFG 6.5, sampler dpmpp_2m, seed -1, LUT cinematic_warm.cube interp=tetrahedral, camera 35mm, lighting soft studio + teal fill (key 5600K + fill teal 20%), resolution 720x1280 9:16
```

### Parameter cheat sheet

| Field | Realism value | Why | Cartoonish failure it fixes |
|---|---|---|---|
| **Negative** | `cartoon, illustration, anime, 3d render, cgi, plastic skin, oversaturated` | suppresses flat shading / waxy skin | removes cel-shading, plastic doll skin |
| **Steps** | `28` | Wan default; H3 respects via guidance — enough detail without over-cooking | too low → blurry, too high → waxy |
| **CFG** | `6.5` | balanced prompt adherence; higher → oversaturated / contrasty | CFG >8 → cartoon contrast; <5 → washy |
| **Sampler** | `dpmpp_2m` | sharp detail, good skin | euler → softer / painterly |
| **Lens** | `35mm, f/2.0, shallow DOF bokeh` | natural perspective, subject isolation | wide phone lens → distorted / flat |
| **Lighting** | `soft studio lighting + teal fill, S-curve lifted blacks, cinematic_warm LUT` | wraps skin, teal/orange separation | flat frontal flash → cartoon |
| **LUT** | `cinematic_warm.cube (teal shadows, orange highlights, lifted blacks 10%)` via `lut3d` | house grade, candy.ai warmth | no LUT → gray / desaturated |
| **Camera** | `static camera locked tripod no movement` OR `slow bob subtle handheld with breathing` | prevents H3 from adding warp | handheld shake → smeary |
| **Resolution** | `720x1280 9:16` (768p source scaled) | exact vertical | wrong aspect → stretched |
| **Duration** | `5s` | H3 5s clip → 81 frames @16fps = 5.06s | — |

### Before / after example (PL E1 S1 — uses one storyboard prompt)

**Before (flat, cartoonish risk):**
```
cinematic, synthetic adult woman 18+, private tutoring desk in wood-paneled library, warm desk-lamp pool, blinds shadows, photorealistic, 8k, shallow DOF, vertical 720x1280, soft studio lighting — gentle intimacy, missionary helper 1434650:0.2
```

**After (realism-expanded, candy.ai 8k):**
```
cinematic, synthetic adult woman 18+, private tutoring desk in wood-paneled library, warm desk-lamp pool 2700K, blinds shadows, photorealistic 8k, shallow depth of field f/2.0, 35mm lens locked tripod, soft studio lighting + teal fill + lifted blacks S-curve cinematic_warm LUT, natural skin texture detailed pores subsurface scattering, tactile fabric weave, wood grain detail, volumetric dust motes, shallow DOF bokeh, vertical 720x1280, 5s duration, static camera locked tripod no movement — gentle intimacy, detailed textures, negative: low quality, blurry, deformed, cartoon, illustration, anime, 3d render, cgi, plastic skin, oversaturated, duplicate, watermark, nude, naked, topless, explicit — steps 28, CFG 6.5, sampler dpmpp_2m, LUT cinematic_warm.cube
```

**Use in code / CLI:**
```ts
// wavespeed.ts generateH3ImageToVideoLora
generateH3ImageToVideoLora({
  image: "https://cdn.veilwick.com/storyboard/pl-ep1-first.jpg", // or local upload URL
  prompt: REALISM_EXPANDED_PL_E1_S1, // after string above
  duration: 5,
  resolution: "768p", // H3 native; ffmpeg scale to 720x1280 after download
})
// CLI local
wavespeed upload apps/web/public/storyboard/pl-ep1-first.jpg
wavespeed run wavespeed-ai/minimax-h3/image-to-video-lora --image <url> --prompt "…realism-expanded…" --resolution 768p --duration 5 -o output/prototype/e1-5s-raw.mp4
ffmpeg -i output/prototype/e1-5s-raw.mp4 -vf "scale=720:1280:flags=lanczos" -c:a aac -pix_fmt yuv420p -crf 23 output/prototype/e1-5s.mp4
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv output/prototype/e1-5s.mp4 # 720,1280
```

Verify: `grep -c "photorealistic 8k" docs/prompts.md` ≥ 10; every H3 prompt in §5b + §5c includes `negative:` tail with `cartoon` + `plastic skin`; steps/CFG documented; LUT + lens + lighting tokens present; ffprobe width==720 height==1280 after scale.

---

## 6. Technical — Wan duration, FLF, camera, consistency, LUT

### 6a. Wan first/last frame (FLF2V) + duration

- **Model:** Wan2.1 FLF2V-14B-720P (`Wan-AI/Wan2.1-FLF2V-14B-720P`) and Wan 2.4-14B FLF. Input is `first_frame_url` + `last_frame_url` + prompt; model interpolates motion between them.
- **Frame math:** Valid `num_frames = 4n+1` (81, 121, 161…). Default in repo is **81 frames**. At 16 fps → 81/16 = **5.06s**; at 24 fps → 81/24 = **3.375s**. For VeilWick 60s episodes, chain 4–6 sequential FLF segments (see extender pattern) or use Wavespeed `duration: 60` which handles chunking.
- **VAE:** causal 3D VAE encodes `1+T` frames → `1+T/4` latent chunks, with rolling cache of last 2 feature frames. First frame is spatial-only anchor — pass a sharp 720x1280 reference for best lock.
- **When to use FLF:**
  - Continuity: end-frame of ep N = first-frame of ep N+1 for seamless series.
  - Control: supply postcard start + afterglow end; let Wan fill camera move.
  - Poster sync: set first frame = desired poster composition so extraction is deterministic.
- **Wavespeed API (Wan 2.7 FLF2V):**
  ```ts
  POST https://api.wavespeed.ai/api/v3/alibaba/wan-2.7/flf2v
  { prompt, first_frame_url: "https://cdn.veilwick.com/start.jpg",
    last_frame_url: "https://cdn.veilwick.com/end.jpg",
    size: "720*1280", num_frames: 81 }
  ```
  CLI: `wavespeed run alibaba/wan-2.7/flf2v --first-frame start.jpg --last-frame end.jpg --prompt "..." --size 720*1280`
- **Loop/extender:** For 10s–4min continuous scenes, use overlap 16–24 frames between segments (see `wan-video-extender` — per-loop prompts + optional LoRA per segment). Higher overlap = better consistency, slower.
- **Gotcha:** If `frame_num` < 81 fails, ensure it satisfies `4n+1`; try 41/81/121.

### 6b. Handheld camera movement prompts

Use sparingly: 1 phrase per shot. VeilWick wants **subtle**, not chaotic.

| Intent | Prompt token |
|---|---|
| Subtle intimacy | `subtle handheld, natural breathing, micro shake, shallow depth` |
| Urgency / crisis | `shaky cam, handheld tracking, slight motion blur` |
| Smooth follow | `steadicam, smooth dolly, gentle push-in` |
| Crisis → calm | `handheld → locked tripod, stabilize` |
| Slow-mo friendly | `slow motion 0.7x, handheld, cinematic 35mm` |

Full example (append to base prompt):
```
... soft studio lighting, subtle handheld with breathing, micro head bob from footsteps, 35mm lens, vertical 720x1280
```
Negative for handheld: avoid `tripod, static, locked off` when you want movement.

Reference: `awesome-seedance` pattern — specify movement + lens + timing together. Keep shake nouns limited to 1–2 per prompt or Wan over-shakes.

### 6c. POV prompts

Dedicated first-person eye-level language. Must include **no HUD** and body presence.

Template:
```
true first-person POV, eye level, viewer's hands visible soft, no HUD no UI, natural handheld with subtle head bob and breathing, 35mm, vertical 720x1280, shallow depth, intimate wellness
```

Variants:
- **Seated POV:** `POV seated eye level, table foreground, hands resting, soft focus background`
- **Standing approach:** `POV walking slowly toward subject, subtle head bob with footsteps, slight autofocus breathing`
- **Over-shoulder hybrid (not pure POV):** `over-shoulder POV, subject looking at viewer, hand extended toward camera, eye contact, soft bokeh`

Always add `looking directly at viewer, eye contact` when eye contact is the beat — it anchors synthetic gaze. Borrowed from `pov-video-prompt` skill structure: subject + movement + lens artifacts + emotional state.

### 6d. Character consistency — LoRA + reference image

Best practice per `wan-video-extender` + Realtime LoRA notes:

1. **One reference portrait per series** (720x1280, neutral pose, soft light). Store in R2 `reference/series/{id}.jpg`.
2. **Reference image input** to Wan I2V/FLF2V (`image` or `reference_image` param) — drastically improves face/hair/outfit lock across loops.
3. **Character LoRA** (DreamBooth via H3 or Civitai LoRA 0.7–0.8) + reference image together = strongest lock. Increase overlap to 24+ when using reference.
4. **Per-loop control:** Assign LoRA per segment if character changes (rare); otherwise keep single LoRA across all 5 episodes.
5. **Training tip:** 10–20 images of same character, varied angles, consistent lighting; trigger word `veilwick_style`. Train via `wavespeed.ts:trainLoRA` or ComfyUI Realtime LoRA node (supports Wan 2.2 video keyframes).
6. **Prompt discipline:** Repeat hair, outfit, setting tokens verbatim across episodes (e.g. always `warm linen robe, soft chestnut hair, lake house`). Wan attends to repeated tokens.

Validation: generate ep1 + ep2 and compare face embeddings (or quick eyeball); drift > threshold → raise LoRA weight 0.05 or add second reference.

### 6e. Color grading — LUT (sanitized, cinematic)

VeilWick house grade: **warm cinematic + teal/orange, lifted blacks, S-curve contrast**. Applied post-render via `ffmpeg` `lut3d` or Wavespeed output.

**Built-in looks:**

| Look | LUT / description |
|---|---|
| Warm cinematic (default) | `cinematic_warm.cube` (17pt 3D LUT) — S-curve, warm cast, teal shadows, orange highlights, lifted blacks (~10%) |
| Teal & orange alt | `teal_orange.cube` — stronger separation for night/cyber (Y.U.N.A.) |
| Vintage warm | `vintage_warm.cube` — faded blacks, reduced saturation, warm highlights |
| Cool Nordic | `cool_nordic.cube` — desaturated, blue shadows for noir (boss-noir) |
| Golden hour | `golden_hour.cube` — boosted golds for lake house (staycation-seriF) |

**ffmpeg apply (16-bit precision, tetrahedral interp):**
```bash
# single file
ffmpeg -i input.mp4 -vf "lut3d=file=cinematic_warm.cube:interp=tetrahedral" \
  -c:a copy -crf 23 -pix_fmt yuv420p graded.mp4

# chain with poster extract
ffmpeg -ss 1.2 -i graded.mp4 -vframes 1 -s 720x1280 -q:v 2 poster.jpg
```

**Wavespeed note:** Prefer generating neutral then grading via LUT rather than baking grade into prompt — keeps series LUT-swappable. If prompt must carry grade, use `teal shadows, orange highlights, lifted blacks, S-curve contrast, cinematic_warm LUT` as tail.

**Presets library** (reference `ai-video-color-grading` skill / `color-grade-studio` — 20 presets, WebGL preview, export `.cube`): generate custom LUT from reference still via `ColorGradingEngine` — 3-way shadow/midtone/highlight balance + export `lut3d`.

Re-check: posters must be 720x1280 after grade (ffprobe width==720 height==1280), video duration 60s matches D1 `episodes.duration`.

---

## 7. Poster extraction & Wavespeed CLI (unchanged)

```bash
ffmpeg -ss 1.2 -i scene.mp4 -vframes 1 -s 720x1280 -q:v 2 poster.jpg
# upload R2 posters/series/{slug}/ep{num}.jpg
# store posterUrl in D1 episodes.posterUrl

wavespeed --model wan2.4-14b --resolution 720x1280 --duration 60 --lora 1333923:0.8 \
  --prompt "cinematic, intimate wellness, 18+ synthetic, soft lighting, vertical 720x1280" \
  --output videos/{category}/{id}.mp4
```

Poster pipeline details: see `docs/poster-styles.md` (Wan 2.7 t2i, 5 style templates, `buildPosterPrompt()`).

---

## 8. Sources

- Civitai: `types=LORA&baseModels=Wan Video 14B t2v&sort=Most Downloaded` — top 15 listed in `wan.ts` `TOP_NSFW_LORAS`
- GitHub: `Wan-Video/Wan2.1` (FLF2V, VAE 1+T→1+T/4, 4n+1 frames), `ComfyUI-WanWrapper`, `wan-video-extender` (overlap 16–24, reference image + LoRA), `comfyui-realtime-lora` (Wan 2.2 keyframes)
- Medium/character analysis: Romance 12-beat structure, candy.ai Story Mode memory + 5-character persistence, Heat Level 2–4 guidance, intimate-scene beat framing
- Camera: `awesome-seedance` handheld/POV vocab, `pov-video-prompt` skill (head bob, breathing, no HUD), `img2vid-prompts` guide (shaky cam, dolly, steadicam)
- Color: `ai-video-color-grading` (teal/orange, lifted blacks S-curve), `color-grade-studio` (20 presets → `.cube` via `lut3d:interp=tetrahedral`), `quantedits` 20-preset engine, `craftbot` `ffmpeg-color-grading` (lut3d tetrahedral)

Verify: posters 720x1280, video 60s metadata matches D1, synthetic 18+ disclaimer present, no explicit act in any stored prompt.

