# VeilWick Per-Scene Specialized LoRAs — Your New Stepsister E1 (S1–S6)

> **Scope:** Maps **per-scene specialized LoRAs** for **Your New Stepsister E1 — Unpacking** (6 scenes × 5s = 30s, `720×1280 9:16` → `768p 768×1344` via Wavespeed H3). Source beats `docs/storyboard-heat2-4.md` §2 (Heat 2 — 6 full prompts) + §3 (Heat 3 — 6 full prompts) + §4a (Heat 4 — 12 T2I placeholders `PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280`, you fill via **Anubis Mini 8B** locally). Engine `apps/web/src/lib/wavespeed.ts` (`H3_IMAGE_TO_VIDEO_LORA` + `H3_REFERENCE_TO_VIDEO_LORA` + `CUSTOM_LORAS` + `getLorasForScene`). All characters synthetic adult woman 18+ consensual, fictional. **Keep local — no explicit generation here.**

## 0. Base LoRA — MMH3 general face lock

| LoRA | Civitai | File | Scale | When | Cost |
|------|---------|------|-------|------|------|
| **MysticXXX MMH3 V4** | `2856467 → 3266628` | `/tmp/MysticXXX_MMH3-V4.safetensors` (`148 MB`) | `1.0` solo, `0.8–1.0` when stacked (see §1) | **Always** — face/hair/linen identity lock for S1–S6, all heats. Heat 2–3 stay MMH3-only. | H3 I2V-LoRA `$0.25 / 5s` (`H3_IMAGE_TO_VIDEO_LORA_PRICE`), H3 R2V-LoRA `$0.30 / 5s` (`H3_REFERENCE_TO_VIDEO_LORA_PRICE`). T2I stills `~$0.02–0.03` each (Wan 2.7/2.1 `text-to-image 720*1280`). |

Per-scene you can add **1–2 extra specialized Wan LoRAs** via H3 `loras: [{path, scale:0.8}]` — **max 3 total** (`MMH3 + up to 2 extras`). Do not stack 3 extras. Prefer `scale:0.8` for specialized (motion/act) LoRAs, keep MMH3 at `1.0` (or `0.8` when stacked if H3 rejects strength — retry `scale:0.8` per `docs/engine-mmh3-reference.md` §8).

```
S1–S6 Heat 2/3:  loras = [{path: "/tmp/MysticXXX_MMH3-V4.safetensors", scale: 1.0}]                 // 1 total
S3–S4 Heat 4:    loras = [{MMH3, scale:0.8–1.0}, {cowgirl, scale:0.8}, {pov, scale:0.8}]           // 2–3 total, max 3
S5 Heat 4:       loras = [{MMH3, scale:1.0}]  // consent reset — no extra
```

Implementation: `apps/web/src/lib/wavespeed.ts` `getLorasForScene(sceneId, heat): WavespeedLora[]` — see §4 and code docs.

**Registered VeilWick CUSTOM_LORAS** (`wavespeed.ts:46`):

| Civitai id → version | Name | Base | Res | File hint |
|----------------------|------|------|-----|-----------|
| `1333923 → 2021242` | Wan POV Blowjob | `Wan Video 14B t2v` (+ `i2v 480p v2021249`) | `720x1280` | `/tmp/Wan_POV_Blowjob_1333923.safetensors` |
| `1428098 → 2156392` (High Noise) / `2156435` (Low Noise) — `wavespeed.ts` pins `1700002` (legacy) | WAN COWGIRL + REVERSE COWGIRL T2V & I2V | `Wan Video 2.2 I2V-A14B / T2V-A14B` | `720x1280` | `/tmp/WAN_COWGIRL_1428098.safetensors` — triggers `r3v3rs3_c0wg1rl, c0wg1rl` |

Source: `docs/civitai-wan-examples.md` §0b scrape `2026-09-01` (`GET /api/v1/models?types=LORA&baseModel=Wan Video 14B t2v` + `query=wan&nsfw=true`). Key at `~/.secrets/civitai.env` (`CIVITAI_API_KEY=fe8256…`, 49B). Do not move key into repo.

---

## 1. Master table — 6 scenes × Heat 2 / Heat 3 / specialized LoRA per act

**Heat 2–3 fully written** (copy/paste from `storyboard-heat2-4.md` §2–§3, each `720x1280 5s` clothed, `negative: low quality, blurry, deformed, cartoon, illustration, anime, 3d render, cgi, plastic skin, oversaturated, duplicate, watermark, nude, naked, topless, explicit, genitalia, nsfw act, jpeg artifacts`). **Heat 4 placeholders you fill** (12 prompts `6× first_frame + last_frame` via Anubis Mini 8B — `storyboard-heat2-4.md` §4a/§4b). Keep `720x1280 5s`, `768p 768×1344` for H3, `720*1280` for Wan T2I `size`.

| Scene | Beat / Phase | Heat 2 prompt (fully written, fade-to-black clothed) | Heat 3 prompt (fully written, intentional touch clothed) | Suggested specialized LoRA per act — Civitai Wan 2.1/2.7 id + trigger | When to use | Cost (per 5s clip) | Download via `CIVITAI_API_KEY` |
|-------|--------------|------------------------------------------------------|----------------------------------------------------------|----------------------------------------------------------------------|-------------|------------------|--------------------------------|
| **S1 Setup** `0:00–0:05` B1 Adoration / P1 Exposition — `static locked tripod eye-level doorway lean` | B1/P1 | `cinematic, synthetic adult woman 18+ clothed in cream knit co-ord and soft linen robe open over loungewear, sunlit hallway stacked moving boxes doorway, doorway lean soft smile one beat held then glance away, warm domestic palette linen weave, vertical 9:16 720x1280 5s static locked tripod no movement, photorealistic 8k shallow DOF f/2.0 35mm soft natural daylight teal shadows lifted cinematic_warm LUT — Heat 2` — no touch, bright daylight `teal shadows lifted` | Same frame + `hand lightly touches doorway frame intentional proximity "you're early — you stayed?" linen sleeve half-slipped from adjusting tote candid imperfection, vertical 9:16 720x1280 5s static locked tripod, photorealistic 8k shallow DOF f/2.0 35mm bright window bounce cinematic_warm LUT — Heat 3` | **Heat 2–3: MMH3 only** (`2856467:3266628`, `scale:1`). **Heat 4 placeholder:** `PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — S1 first_frame + last_frame` — optional single act LoRA **1333923 Wan POV Blowjob** (`2021242`, POV between-legs geometry) **OR none**. Keep Heat 4 S1 as **face-lock only** unless arc needs oral-setup foreshadow. Alt: `1307155 WAN General NSFW 2073605` (animation-leaning — override with `photorealistic 8k` tail) if testing multi-trigger. | Heat 2–3: always MMH3 only — clothed wellness, no act LoRA. Heat 4: add `1333923` only if S1 explicitly foreshadows POV act; otherwise keep MMH3 alone to preserve doorway identity for stitch `S1.last → S2.first`. Camera `static locked tripod` (`aicamera-movements.md` §1 — `push past` alt: `push past boxes foreground close to lens, arrive inside doorway beyond`). | H3 I2V-LoRA `$0.25 / 5s`; H3 R2V-LoRA `$0.30 / 5s` if using `reference-to-video-lora` + poster anchor. Wan T2I stills `~$0.02–0.03` each (Heat 4 bookends). S1 adds **no extra LoRA cost** (1 LoRA slot). If stacking `1333923`, still single H3 call — LoRA is file weight, not per-second. | `source ~/.secrets/civitai.env` (or `.dev.vars`) → `CIVITAI_API_KEY=fe8256…` → `curl -H "Authorization: Bearer $CIVITAI_API_KEY" -L "https://civitai.com/api/download/models/3266628" -o /tmp/MysticXXX_MMH3-V4.safetensors` (base, always). Optional Heat 4: `curl -H "Authorization: Bearer $CIVITAI_API_KEY" -L "https://civitai.com/api/download/models/2021242" -o /tmp/Wan_POV_Blowjob_1333923.safetensors` — verify `ls -lh /tmp/*.safetensors` then pass via `WAVESPEED_LORA_PATH` or `getLorasForScene("s1","heat4")`. |
| **S2 Tension** `0:05–0:10` B3 No-way / P2 Tease — `slow bob handheld breathing over-shoulder` | B3/P2 | `cinematic, synthetic adult woman 18+ clothed in ecru knit co-ord holding folded laundry by bedroom doorway, hesitant glance holding folded tee doorway hesitation soft sheets background breathy stillness "You're closer than I expected." no touch laundry buffer, vertical 9:16 720x1280 5s slow bob handheld breathing micro head bob, photorealistic 8k shallow DOF f/2.0 35mm soft warm diffused window golden cinematic_warm LUT over-shoulder POV — Heat 2` | `same but laundry held closer fingers brush tote strap intentional touch without nudity "You're closer than I expected. — Stay — just a minute longer." soft sheets, vertical 9:16 720x1280 5s slow bob handheld breathing, photorealistic 8k shallow DOF soft warm golden — Heat 3` | **Heat 2–3: MMH3 only.** **Heat 4 placeholder:** `PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — S2 first_frame + last_frame` — optional **1428098 COWGIRL** (`2156392 High Noise` / `2156435 Low Noise`, `wavespeed.ts` legacy `1700002`, triggers `c0wg1rl` / `r3v3rs3_c0wg1rl`) as **tension foreshadow** — low angle looking up at woman (`slightly low angle looking up, low angle`, `slow bob`). Use only if S2 foreshadows straddle. Alternative: none — keep tension as proximity, not act. Sampling if used: `cfgScale 1, steps 8, sampler Euler` (Wan 2.2 low CFG). | Heat 2–3: MMH3 only. Heat 4: add `1428098` at `scale:0.8` only when story explicitly foreshadows cowgirl/reverse; otherwise keep S2 clean for `S2.last → S3.first` stitch. Camera `slider right slow controlled small distance` / `handheld` (`aicamera-movements.md` §2 — micro-parallax) or `truck right`; keep one motion token per 5s. | Same H3 pricing `$0.25/$0.30`. `1428098` adds no per-second cost. If used, total loras = 2 (`MMH3 + cowgirl`, `scale:0.8` for cowgirl). | Base: same `3266628` curl above. Optional: `curl -H "Authorization: Bearer $CIVITAI_API_KEY" -L "https://civitai.com/api/download/models/2156392" -o /tmp/WAN_COWGIRL_1428098-High.safetensors` (or `2156435` Low Noise). Also `bun scripts/download-mmh3-lora.ts` reads key from `~/.secrets/civitai.env` → `/tmp/MysticXXX_MMH3-V4.safetensors`. Wire via `getLorasForScene("s2","heat4")` → `[{path:"/tmp/MysticXXX…",scale:1},{path:"/tmp/WAN_COWGIRL…",scale:0.8}]` max 3. |
| **S3 Temptation** `0:10–0:15` B5 Temptation / P2→3 — `high-angle close-up 35mm slow bob hair-tuck consent` | B5 | `cinematic, synthetic adult woman 18+ clothed in sage linen shirt wide ecru trousers bedroom plant folded linens, gentle eye contact soft smile closer frame hands resting on folded linen no touch-point intentional gaze not touch soft disclosure, vertical 9:16 720x1280 5s slow bob handheld breathing, photorealistic 8k shallow DOF f/2.0 35mm soft warm diffused window golden cinematic_warm LUT teal shadows lifted — Heat 2` | `same but soft hand-on-shoulder hair-tuck gesture gentle eye contact intentional touch without nudity "Is this okay? Tell me if you want to pause. Only if you want to — say yes." consent check-in nod, vertical 9:16 720x1280 5s slow bob handheld breathing, photorealistic 8k shallow DOF soft warm cinematic_warm LUT — Heat 3 (matches client.tsx S3 verbatim)` | **Heat 2–3: MMH3 only.** **Heat 4 placeholder:** `PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — S3 first_frame + last_frame` — primary **1428098 COWGIRL + REVERSE COWGIRL** (`2156392`, triggers `r3v3rs3_c0wg1rl` for reverse, `c0wg1rl` for cowgirl, `low angle looking up`, `straddling`, `cfg 1 Euler`). Alt act pair: **1340403 Wan 2.1 Deepthroat/Blowjob** (`1513684`, triggers `blowjob, deepthroat`) — costume+location do erotic work (`ginger updo / wedding dress + desert road / church`). Alt: **1395313 DR34MJOB** (`2235288`, `bl0wj0b, d0ubl3_bj` trigger-driven, minimal prompt). **Pick ONE trigger per generation** (cowgirl OR blowjob, not both) + keep `cfg 1` tail when using `1428098`. | Heat 2–3: MMH3 only — consent beat stays clothed, proximity without act LoRA. Heat 4: add **one** act LoRA at `scale:0.8` (Temptation is first act beat — this is where heat escalates). Use `r3v3rs3_c0wg1rl` at prompt start + `low-angle medium shot, eye-level or slightly below, vertical 720x1280, slow bob subtle handheld breathing, 35mm`. For `blowjob, deepthroat` path, keep `POV between legs` geometry per `civitai-wan-examples.md` §2a. Max 2 extras (`MMH3 + 1428098`) or `MMH3 + 1340403` (max 3 if you keep MMH3 + cowgirl + blowjob for test, but recommend 2). | `$0.25 / $0.30` per clip. Stacking extras does not multiply price — H3 bills `duration × resolution` tier, not LoRA count (≤3 files). 1 extra at `scale:0.8` is the sweet spot. | `curl -H "Authorization: Bearer $CIVITAI_API_KEY" -L "https://civitai.com/api/download/models/2156392" -o /tmp/WAN_COWGIRL_1428098.safetensors` (primary) — or `curl …/1513684 -o /tmp/Wan_Deepthroat_1340403.safetensors` for deepthroat alt. Via helper: `getLorasForScene("s3","heat4")` → `[{path:"/tmp/MysticXXX…",scale:1},{path:"/tmp/WAN_COWGIRL…",scale:0.8}]`. Triggers go in **prompt**, not filename — e.g. prompt starts `r3v3rs3_c0wg1rl, cinematic, synthetic adult woman 18+ …`. |
| **S4 Leap** `0:15–0:20` B6 Leap — Choose risk / P3 Escalation peak | B6/P3 | `cinematic, synthetic adult woman 18+ clothed in soft cotton shirt linen trousers leaning across kitchen counter hallway soft lean-in eye contact "stay — just a minute longer" whisper breath sync no embrace one hand width, vertical 9:16 720x1280 5s static locked tripod no movement, photorealistic 8k shallow DOF f/2.0 35mm soft warm golden-hour dust motes — Heat 2` | `leaning in closer breath sync whisper "Breathe with me — slow. Don't look away. I want to remember how you look right now." true first-person POV eye level viewer hands soft foreground no HUD intentional proximity not yet embrace, vertical 9:16 720x1280 5s static locked tripod, photorealistic 8k shallow DOF soft warm golden-hour — Heat 3 (matches client.tsx S4)` | **Heat 2–3: MMH3 only** (leap consent is still clothed — keep face lock clean). **Heat 4 placeholder:** `PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — S4 first_frame + last_frame` — primary **1333923 Wan POV Blowjob** (`2021242`, `POV true first-person eye level between legs / overhead between legs, eye-level looking at viewer, static / slight head bob, 35mm`) **OR 1331682 Wan 2.2/2.1 POV Missionary** (`2098405`, `POV from above, view is POV from above, thrust back and forth, fast movements bouncing breasts`) **OR 1361228 Wan POV Doggy (i2v)** (`1545040`, `POVdog, A POV video showing…`, `ass movement bounce emphasized, steady shot, looking back in pleasure`, `steps 30 cfg 6 UniPC`, i2v-only). **Pick ONE POV family per S4.** Alt multi-trigger **1811313 DR34ML4Y** (`2950842`, `m15510n4ry, bl0wj0b, d0ubl3_bj, d0gg1e`) if renting single LoRA for full arc — switch trigger per scene `S3→m15510n4ry, S4→bl0wj0b, S5→d0gg1e`. | Heat 2–3: MMH3 only — `static locked tripod` / `first-person view` POV but still clothed; no act LoRA. Heat 4: **add 1 POV act LoRA at `scale:0.8`** (Leap peak). Camera `true first-person POV eye level viewer hands soft foreground no HUD, natural handheld subtle head bob with breathing, 35mm vertical 720x1280, static or slow bob` (reuses `civitai-wan-examples.md` #1+3). Keep `POVdog` for i2v-only path — not tested on T2V. Max `MMH3 + 1333923` (or `MMH3 + 1331682`). Optional 2-extras test: `MMH3 + 1333923 + 1361228` (max 3, but recommend 1 extra). | `$0.25 / $0.30`. POV LoRAs are same price tier; `1361228` wants `cfg 6 steps 30 UniPC` tail (higher CFG than cowgirl's `cfg 1 Euler`) — keep per-LoRA tail per `civitai-wan-examples.md` §2e. | Primary: `curl -H "Authorization: Bearer $CIVITAI_API_KEY" -L "https://civitai.com/api/download/models/2021242" -o /tmp/Wan_POV_Blowjob_1333923.safetensors` (already CUSTOM_LORAS). Alt missionary: `curl …/2098405 -o /tmp/Wan_POV_Missionary_1331682.safetensors`. Alt doggy: `curl …/1545040 -o /tmp/Wan_POV_Doggy_1361228.safetensors` (note I2V-only warning — prefer 720p I2V). Multi: `curl …/2950842 -o /tmp/DR34ML4Y_1811313.safetensors`. Wire: `getLorasForScene("s4","heat4")` → `[{path:"/tmp/MysticXXX…",scale:1},{path:"/tmp/Wan_POV_Blowjob…",scale:0.8}]`. |
| **S5 Retreat** `0:20–0:25` B7 Retreat — Pull back / P4 Climax proxy (emotional) — consent reset | B7/P4 | `cinematic, synthetic adult woman 18+ clothed in cream knit loungewear looking away toward window light shift phone buzz on counter door knock off-screen pull-back solo beat single breath pause "We go at your pace. Nod if you're with me." waist-height medium shot eye level vertical 9:16 720x1280 5s static locked tripod bright daylight clean natural light soft shadows window flare — Heat 2` | `same pull-back but lingering hand release from shared frame one breath pause "We go at your pace. Nod if you're with me." vertical 9:16 720x1280 5s static waist-height medium eye-level window flare — Heat 3 lingering touch release` | **All heats: MMH3 only — no specialized LoRA** (consent reset beat). Heat 4 placeholder: `PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — S5 first_frame + last_frame` — **keep as MMH3-only** even in Heat 4. Room to add **1426284 Wan 2.2/2.1 Anal** (`2161023`, trigger `anal sex`, `nsfwsks Score_9 masterpiece`) or `handheld 0.7x slow-mo` crisis motion only if you intentionally break retreat — not recommended (retreat is distance reintroduced). Stay `bright daylight window flare, high key` to visually reset from S4 golden-hour. | Always — `S5` is the pull-back that reintroduces distance (`storyboard-heat2-4.md` §0 escalator `setup → tension → temptation → leap → retreat → afterglow`). Adding an act LoRA here collapses the beat structure and risks H3 `image+last_image` stitch drift to S6. Keep `loras=[{MMH3, scale:1}]` max. Camera `waist-height medium eye level static locked tripod + window flare` or `dolly out smooth controlled retreat` (`aicamera-movements.md` §2). | `$0.25 / $0.30` (1 LoRA slot). | No extra download — MMH3 base only: same `curl …/3266628 -o /tmp/MysticXXX…` or `bun scripts/download-mmh3-lora.ts`. `getLorasForScene("s5", heat)` returns `[{path:"/tmp/MysticXXX…",scale:1}]` regardless of heat — documented no-op for retreat. |
| **S6 Afterglow** `0:25–0:30` B8 Fall + B12 HEA / P5 Afterglow/Tag — `pull wide soft sheets clothed embrace laugh` | B8+12/P5 | `cinematic, synthetic adult woman 18+ clothed in soft knit co-ord soft sheets bedroom clothed embrace laugh eye contact warm LUT cuddle golden-hour soft light pull wide soft focus tagline "Some house rules are meant to be broken." no nudity blanket layers visible vertical 9:16 720x1280 5s slow bob gentle push-in with breathing photorealistic 8k shallow DOF f/2.0 35mm soft warm golden-hour boosted golds cinematic_warm.cube — Heat 2 poster frame 1.2s` | `same clothed embrace + gentle hair-tuck callback "You're still here. Good. That was — yeah. That was us. Next time, I'll be the one who's nervous." golden-hour pull wide soft focus tagline "Some house rules are meant to be broken — again tomorrow." vertical 9:16 720x1280 5s slow bob gentle push-in — Heat 3` | **Heat 2–3: MMH3 only** (warm LUT cuddle, blanket layers). **Heat 4 placeholder:** `PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — S6 first_frame + last_frame` — optional callback LoRA **1428098 COWGIRL** (`2156392`, `c0wg1rl`) **or 1566648 Assertive Cowgirl** (`2129122`, `photorealistic image of woman straddling, assertive dominant quickly energetically vigorously slams hips, squatting leaning in looking at camera sharp focus`) as afterglow straddle callback. Use only if S6 act explicitly callbacks S3 straddle; otherwise keep MMH3-only and let LUT carry warmth. Alt: light `rain` / `hat wave hollaring` env imperfection per `civitai-wan-examples.md` #9. | Heat 2–3: MMH3 only. Heat 4: add one callback LoRA at `scale:0.8` **only if afterglow act needs straddle**; else keep `MMH3-only` — afterglow is resolution, not escalation. Camera `high-angle close-up 35mm + pull wide, slow bob gentle push-in with breathing` or `dolly in smooth controlled push forward` (`aicamera-movements.md` afterglow move) or `slow zoom out gradual even` for tagline breath. Max `MMH3 + 1428098` (2) or `MMH3 + 1566648` (2). Single LoRA full-arc alt: `1811313 DR34ML4Y` with `c0wg1rl` trigger here. | `$0.25 / $0.30` (1–2 Loras). Assertive cowgirl wants `quickly energetically vigorously slams` motion verbs — keep that adverb stack in prompt tail only via Anubis, not committed. | Optional: `curl -H "Authorization: Bearer $CIVITAI_API_KEY" -L "https://civitai.com/api/download/models/2156392" -o /tmp/WAN_COWGIRL_1428098.safetensors` (same as S2/S3) — or `curl …/2129122 -o /tmp/Assertive_Cowgirl_1566648.safetensors`. `getLorasForScene("s6","heat4")` → `[{MMH3,scale:1},{cowgirl,scale:0.8}]` or MMH3-only when callback omitted. |

**Stitch rule unchanged** (all heats): `S(n).lastFrame → S(n+1).firstFrame` via H3 `image + last_image` (I2V-LoRA) or `reference_images: [first,last,poster]` (R2V-LoRA, poster is persistent identity anchor). One variable shifts per scene (location OR light OR distance, not all three) — `storyboard-heat2-4.md` §0. Camera menu per act from `aicamera-movements.md` §2 — pick **one move per 5s clip** (`static / push past / slider+handheld / slow zoom / arc 25° / first-person view / dolly out / dolly in`).

---

## 2. Specialized LoRA catalog — distilled from Civitai Wan scrape (2026-09-01)

Full table with prompts/camera/negative/tags in `docs/civitai-wan-examples.md` §1. Below is the **per-scene dispatch subset** (Wan 2.1 / 2.2 compatible with H3 — baseModel `Wan Video 14B t2v/i2v 480p/720p` and `Wan Video 2.2 I2V-A14B/T2V-A14B/TI2V-5B`).

| # | Civitai id → version (use) | Name | Triggers to include at prompt start | Camera to reuse per scene | Sampling tail (keep verbatim) | Suggested scene |
|---|---------------------------|------|-------------------------------------|---------------------------|-------------------------------|-----------------|
| 1 | `1333923 → 2021242` (CUSTOM_LORAS) | Wan POV Blowjob | none (plain EN) | `POV true first-person eye level between legs + overhead between legs, eye-level looking at viewer, static / slight head bob, waist-height POV looking down, 35mm` — `handheld breathing micro head bob` | `steps 28 CFG 6.5 dpmpp_2m` (house) | **S4 Leap primary** (S1 optional foreshadow) |
| 2 | `1428098 → 2156392` (High) / `2156435` (Low) — `wavespeed.ts` legacy `1700002` | WAN COWGIRL + REVERSE COWGIRL | `r3v3rs3_c0wg1rl, c0wg1rl, straddling him in the reverse cowgirl position` | `low angle looking up at woman, slightly low angle` — neon street vs fireplace warm light | **`cfg 1 steps 8 Euler` — low CFG is intentional for Wan 2.2** | **S3 Temptation primary, S2 foreshadow, S6 callback** |
| 3 | `1331682 → 2098405` | Wan 2.2/2.1 POV Missionary | none | `POV from above, view is POV from above, medium shot eye level` from viewer perspective | Wan canonical Zh negative (see `civitai-wan-examples.md` §2d) | **S4 alt** (missionary beat) |
| 4 | `1395313 → 2235288` | WAN DR34MJOB Double/Single/Handy | `bl0wj0b, d0ubl3_bj` | Trigger-only — camera is whatever `image+last_image` provides; T2V fallback = describe POV between-legs as in #1 | Wan canonical negative | S3–S4 multi-angle oral (minimal prompt) |
| 5 | `1340403 → 1513684` | Wan 2.1 Deepthroat/Blowjob Fellatio Oral | `blowjob, deepthroat` | `kneeling side-visible lower body, desert road + car / wedding dress + church + confetti` — costume+location do work | Zh `+ 3d 渲染、视频游戏` tail | **S3 alt** (costume beats) |
| 6 | `1361228 → 1545040` | Wan POV Doggy (i2v 480p) | `POVdog, A POV video showing man having sex doggy style sex with a woman.` | `POV steady shot, ass movement bounce emphasized, looking back in pleasure, space ship outer space slowly moving background` — I2V-only warning: artifacts on low-res | `steps 30 cfg 6 UniPC` | **S4 alt** rear-angle (prefer 720p I2V) |
| 7 | `1426284 → 2161023` | Wan 2.2/2.1 Anal Sex | `anal sex` | Not stated — add `low-angle medium shot` or `high-angle close-up looking back` | `nsfwsks, Score_9, masterpiece` booster | S5–S6 latter half (use only via Anubis local) |
| 8 | `1307155 → 2073605` | (wan 2.2 experimental) WAN General NSFW | `nsfwsks` | `4k drawn animation` — **animation-leaning, not photoreal** — override with `photorealistic 8k shallow DOF teal shadows lifted cinematic_warm LUT` | Not set | S1 if testing (override realism tail) |
| 9 | `1566648 → 2129122` | Wan I2V Assertive Cowgirl | none (EN `assertive dominant eagerly quickly energetically vigorously slams squatting`) | `straddling squatting, leans in looking at camera, sharp focus, quickly moving hips up/down` + `rain` env imperfection | Not set | **S6 callback alt** (dominant energy) |
| 10 | `1811313 → 2950842` | DR34ML4Y All-In-One (WAN/LTX2) | `m15510n4ry, bl0wj0b, d0ubl3_bj, d0gg1e` | All-in-one — camera per trigger (missionary / blowjob / doggy) | Not set | **Full-arc single-LoRA**: rent one for S1–S6, switch trigger per scene |

**Wan canonical negative (Zh + EN mirror)** — append per `civitai-wan-examples.md` §2d unless crafting phone-grain (then drop `JPEG compression residue`): `色调艳丽，过曝，静态，细节模糊不清，字幕，风格，作品，画作，画面，静止，整体发灰，最差质量，低质量，JPEG压缩残留，丑陋的，残缺的，多余的手指，画得不好的手部，画得不好的脸部，畸形的，毁容的，形态畸形的肢体，手指融合，静止不动的画面，杂乱的背景，三条腿，背景人很多，倒着走` (= EN `Bright tones, overexposed, static, blurred details, subtitles, worst quality, low quality, JPEG compression residue, deformed… still picture, messy background, three legs, many people, walking backwards`). **VeilWick Heat 2–3 appendix** add `nude, naked, topless, explicit, genitalia, cartoon, illustration, anime, 3d render, cgi, plastic skin, duplicate, watermark`; for Heat 4 explicit generation **remove** `nude/naked/explicit` from negative and keep the rest.

---

## 3. Heat 4 placeholders — you fill via Anubis Mini 8B (local only, 12 prompts)

`storyboard-heat2-4.md` §4a defines **12 T2I placeholders** (6 scenes × `first_frame` + `last_frame`), each starting `PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280` — wired to `720*1280` for Wan `text-to-image` (`alibaba/wan-2.7/text-to-image --size 720*1280`) then animated via H3 `image+last_image+loras` (see `engine-mmh3-reference.md` §§2–5). **Keep local, never commit:** store filled file as `docs/storyboard-heat4.local.md` (gitignored `*.local.md`) or `~/.secrets/storyboard-heat4.md`. Mirrors `apps/web/app/prototype-scenes/client.tsx` `SCENES[n].heat4FirstFrameT2iPrompt` / `heat4LastFrameT2iPrompt`.

```
S1 first_frame  — PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280 — doorway lean, bright daylight, static
S1 last_frame   — same seed, vary gaze beat (smile hold → glance away), static
S2 first_frame  — folded laundry doorway hesitation, slow bob, over-shoulder POV
S2 last_frame   — one breath later, laundry held closer, gaze holds longer, slow bob
S3 first_frame  — sage linen bedroom, plant background, high-angle close-up 35mm, slow bob
S3 last_frame   — hair-tuck consent "Is this okay?" micro-expression shift, slow bob
S4 first_frame  — kitchen counter, true first-person POV viewer hands foreground, static
S4 last_frame   — breath-sync whisper "Breathe with me — slow" lean-in closer, static
S5 first_frame  — window light shift, waist-height medium, bright daylight, static
S5 last_frame   — pull-back gaze to window, phone buzz, lingering hand release, static
S6 first_frame  — soft sheets bedroom, pull wide, golden-hour cinematic_warm.cube, slow bob
S6 last_frame   — tagline "Some house rules are meant to be broken" pull wide laugh, slow bob
```

**Generate via Anubis Mini 8B** (`TheDrummer/Anubis-Mini-8B-GGUF` Q4_K_M `~4.9 GB`, fits single 24 GB 4090 Dell or Vast `49584552` `ssh6.vast.ai:24552`) — tunnel `ssh -p 24552 root@ssh6.vast.ai -L 8080:localhost:8080` + `llama-server --model /workspace/Anubis-Mini-8B-Q4_K_M.gguf --alias Anubis-Mini-8B-Q4_K_M --host 0.0.0.0 --port 8080 --ctx-size 8192 --n-gpu-layers 99 --parallel 2 --flash-attn on` — then `curl -s http://localhost:8080/v1/chat/completions` per `storyboard-heat2-4.md` §4b (12 curls, one per still, `temperature 0.85, max_tokens 512`, `ANUBIS_BASE_URL=http://localhost:8080/v1`). Save → `cat /tmp/anubis-heat4-s*-*.txt > docs/storyboard-heat4.local.md` (gitignored). Per-scene triggers (e.g. `r3v3rs3_c0wg1rl`, `bl0wj0b`, `POVdog`) are injected via Anubis prompt and preserved in that local file — this doc stores only placeholder.

**Prompt skeleton per Heat 4 still** (call via Anubis — reuse also from `civitai-wan-examples.md` §4):

```
cinematic, synthetic adult woman 18+ <Heat 3 wardrobe + setting token>, <camera from table>,
<lighting teal shadows lifted cinematic_warm LUT, soft natural/golden>, vertical 9:16 720x1280,
photorealistic 8k shallow DOF f/2.0 35mm, natural skin pores + fabric weave, <one act trigger
if scene is S3/S4/S6 — r3v3rs3_c0wg1rl OR bl0wj0b OR POVdog — Anubis appends explicit after you>,
<Heat 4 motion not in still — keep T2I still phrase separate from I2V clip motion>
```

---

## 4. Wiring — `apps/web/src/lib/wavespeed.ts:getLorasForScene(sceneId, heat)`

```ts
import { getLorasForScene } from "@/lib/wavespeed";

// Heat 2–3 (clothed) — returns MMH3 only
getLorasForScene("s1", 2)          // → [{path:"/tmp/MysticXXX_MMH3-V4.safetensors", scale:1}]
getLorasForScene("S3", "heat3")    // → same — case-insensitive, accepts 2/3/heat2/heat3/Heat 3

// Heat 4 (explicit, local stills → H3) — returns MMH3 + 1 act LoRA (max 3)
getLorasForScene("s3", 4)          // → [{MMH3,scale:1},{path:"/tmp/WAN_COWGIRL_1428098.safetensors",scale:0.8}]
getLorasForScene("s4", "heat4")    // → [{MMH3,scale:1},{path:"/tmp/Wan_POV_Blowjob_1333923.safetensors",scale:0.8}]
getLorasForScene("s5", 4)          // → [{MMH3,scale:1}]  // retreat stays MMH3-only by design
getLorasForScene("s6", 4)          // → [{MMH3,scale:1},{WAN_COWGIRL,scale:0.8}] (callback optional)

// Pass directly to H3
await generateH3ImageToVideoLora({
  image: FIRST_URL, lastImage: LAST_URL,
  prompt: heat4Prompt, // from docs/storyboard-heat4.local.md
  loras: getLorasForScene("s3", 4), // ≤3, scale:0.8 for extras
  duration: 5, resolution: "768p",
});
await generateH3ReferenceToVideoLora({
  referenceImage: FIRST_URL,
  prompt: i2vPrompt,
  loras: getLorasForScene("s4", "heat4"),
  duration: 5, resolution: "768p",
});
```

**Normalize:** `sceneId` accepts `s1`/`S1`/`1`/`scene1`/`S01` (case-insensitive, extracts trailing digit 1–6). `heat` accepts `2`/`3`/`4`/`heat2`/`heat3`/`heat4` (case-insensitive, string or number). Unknown scene/heat falls back to MMH3-only (fail-safe, never throws). Returns `WavespeedLora[]` (`{path, scale}`) — cap `≤3` via `slice(0,3)`. Scale `1.0` solo / `0.8` stacked is enforced inside the function per spec `loras: [{path, scale:0.8}] max 3`.

**Per-scene dispatch encoded in function** (heat 4 act LoRAs, heat 2–3 = MMH3-only):

| Scene | heat 4 extra (`scale:0.8`) | heat 2/3 |
|-------|----------------------------|----------|
| s1 Setup | none (optional `1333923` POV if foreshadowing) | MMH3 only |
| s2 Tension | `1428098 COWGIRL` (`c0wg1rl`) optional foreshadow | MMH3 only |
| s3 Temptation | `1428098 COWGIRL` (`r3v3rs3_c0wg1rl`) primary / `1340403 Deepthroat` alt | MMH3 only |
| s4 Leap | `1333923 POV Blowjob` primary / `1331682 POV Missionary` alt / `1361228 POVdog` (i2v) alt | MMH3 only |
| s5 Retreat | none — consent reset stays MMH3-only | MMH3 only |
| s6 Afterglow | `1428098` callback or `1566648 Assertive Cowgirl` callback (optional) | MMH3 only |
| full-arc single | `1811313 DR34ML4Y` (`m15510n4ry→S3, bl0wj0b→S4, d0gg1e→S5`) — pick one trigger per scene via Anubis | — |

See code JSDoc for model→version→filename→trigger mapping and download curls.

---

## 5. Cost & time (per-scene, measured `docs/generation-log.md` §12 + `engine-mmh3-reference.md` §7)

| Layer | Price | Time | Notes |
|-------|-------|------|-------|
| MMH3 base always | included in H3 call | — | `148 MB` file, `WAVESPEED_LORA_PATH` or `/tmp` default. `bun scripts/download-mmh3-lora.ts` reads `CIVITAI_API_KEY` from `~/.secrets/civitai.env` or `.dev.vars`. |
| Extra Wan LoRA (per act) | `$0` extra per clip — H3 bills `(duration, resolution)` not LoRA count | ±0s | `loras` array is weight file, not compute add-on. ≤3 limit is file-count, not price. Keep `scale:0.8` to avoid overbearing. |
| H3 image-to-video-lora | `$0.25 / 5s 768p` | `~73–127s` per clip (`generation-log.md` §12 table, budget `80s` mean) | Feed pipeline `generateH3ImageToVideoLora` (`image+last_image+loras`). Failures not charged — retry `scale:0.8` or prompt-only per `engine-mmh3-reference.md` §8. |
| H3 reference-to-video-lora | `$0.30 / 5s 768p` | `~80–90s` per clip | `generateH3ReferenceToVideoLora` (`reference_images: [first,last,poster]`, poster is persistent identity anchor, first 5 refs free). Heat 4 image-reference path. |
| Wan 2.7/2.1 text-to-image (bookend stills) | `~$0.02–0.03 / still` (check `wavespeed prices` / dashboard) | `~10–20s` per still | `--size 720*1280` (star delimiter, not `x`). 12 stills → `~$0.24–0.36` + `6×$0.25–0.30 = $1.50–1.80` → **full E1 Heat 4 ≈ `$1.74–2.16`** (12 T2I + 6×5s H3) + `30s` stitch `ffmpeg scale=720:1280:flags=lanczos` `$0`. |
| Full E1 Heat 2–3 (6×5s, MMH3 only, no T2I bookends) | `6×$0.25 = $1.50` (I2V) or `6×$0.30 = $1.80` (R2V) | `~9 min sequential`, `~2 min parallel` if rate limit permits | `wavespeed balance` before/after; `wavespeed history --json` for `task_id` / `elapsed_ms`. |

**Batch example S3–S4 Heat 4** (2 clips): `2×$0.25 = $0.50` (I2V) or `2×$0.30 = $0.60` (R2V) plus `4×` T2I stills `~$0.08–0.12` if those two scenes need fresh bookends — MMH3 + `1428098`/`1333923` do not add price.

---

## 6. Download — `CIVITAI_API_KEY` via `~/.secrets/civitai.env` (keep local, no remote)

> **Key location (verified):** `~/.secrets/civitai.env` (`CIVITAI_API_KEY=fe8256…`, `49B`, `source ~/.secrets/civitai.env` or read via `bun scripts/download-mmh3-lora.ts` which also checks `.dev.vars` and `~/.secrets/civitai.env`). Project has no `.secrets/` dir — do not create one. `.dev.vars` mirrors `CIVITAI_API_KEY=…` for `wrangler dev --local`. Never commit either.

```bash
# 0. Pre-flight — key + env
source ~/.secrets/civitai.env  # → CIVITAI_API_KEY=fe8256…
echo ${CIVITAI_API_KEY:0:6}…    # → fe8256… (verify redacted)
# Also available via: cat ~/.secrets/civitai.env  # CIVITAI_API_KEY=fe825695fc3ac7f292aa50f57c95c139

# 1. Base LoRA — always (MysticXXX MMH3 V4, 2856467:3266628, 148 MB)
curl -H "Authorization: Bearer $CIVITAI_API_KEY" \
  -L "https://civitai.com/api/download/models/3266628" \
  -o /tmp/MysticXXX_MMH3-V4.safetensors
ls -lh /tmp/MysticXXX_MMH3-V4.safetensors  # 148 MB
# Or via helper (reads key from ~/.secrets/civitai.env or .dev.vars):
bun scripts/download-mmh3-lora.ts  # → /tmp/MysticXXX_MMH3-V4.safetensors

# Verify path for H3 (env or default)
echo ${WAVESPEED_LORA_PATH:-/tmp/MysticXXX_MMH3-V4.safetensors}
sips -g pixelWidth -g pixelHeight public/storyboard/pick-your-new-stepsister-e1-first.jpg  # 720×1280 reference

# 2. Specialized per-scene LoRAs — download only when heat 4 act needs them (≤2 extra, max 3 total)
# S3 Temptation primary — COWGIRL 1428098 (pick High Noise 2156392 or Low Noise 2156435)
curl -H "Authorization: Bearer $CIVITAI_API_KEY" \
  -L "https://civitai.com/api/download/models/2156392" \
  -o /tmp/WAN_COWGIRL_1428098-High.safetensors
# Low Noise alt:
# curl -H "Authorization: Bearer $CIVITAI_API_KEY" -L "https://civitai.com/api/download/models/2156435" -o /tmp/WAN_COWGIRL_1428098-Low.safetensors
ls -lh /tmp/WAN_COWGIRL*.safetensors

# S4 Leap primary — POV Blowjob 1333923 (registered CUSTOM_LORAS, 2021242)
curl -H "Authorization: Bearer $CIVITAI_API_KEY" \
  -L "https://civitai.com/api/download/models/2021242" \
  -o /tmp/Wan_POV_Blowjob_1333923.safetensors

# S4 alt — POV Missionary 1331682 (2098405) — POV from above
curl -H "Authorization: Bearer $CIVITAI_API_KEY" \
  -L "https://civitai.com/api/download/models/2098405" \
  -o /tmp/Wan_POV_Missionary_1331682.safetensors

# S4 alt — POV Doggy 1361228 (1545040) — I2V-only, 720p preferred
curl -H "Authorization: Bearer $CIVITAI_API_KEY" \
  -L "https://civitai.com/api/download/models/1545040" \
  -o /tmp/Wan_POV_Doggy_1361228.safetensors

# S3 alt — Deepthroat 1340403 (1513684) — costume+location cue
curl -H "Authorization: Bearer $CIVITAI_API_KEY" \
  -L "https://civitai.com/api/download/models/1513684" \
  -o /tmp/Wan_Deepthroat_1340403.safetensors

# S3 alt trigger-driven — DR34MJOB 1395313 (2235288) — bl0wj0b / d0ubl3_bj
curl -H "Authorization: Bearer $CIVITAI_API_KEY" \
  -L "https://civitai.com/api/download/models/2235288" \
  -o /tmp/WAN_DR34MJOB_1395313.safetensors

# S6 callback alt — Assertive Cowgirl 1566648 (2129122)
curl -H "Authorization: Bearer $CIVITAI_API_KEY" \
  -L "https://civitai.com/api/download/models/2129122" \
  -o /tmp/Assertive_Cowgirl_1566648.safetensors

# S5/S6 alt Anal 1426284 (2161023) — if needed via Anubis local only
curl -H "Authorization: Bearer $CIVITAI_API_KEY" \
  -L "https://civitai.com/api/download/models/2161023" \
  -o /tmp/Wan_Anal_1426284.safetensors

# Full-arc single — DR34ML4Y All-In-One 1811313 (2950842) — multi-trigger
curl -H "Authorization: Bearer $CIVITAI_API_KEY" \
  -L "https://civitai.com/api/download/models/2950842" \
  -o /tmp/DR34ML4Y_1811313.safetensors
# Trigger per scene: S3→m15510n4ry, S4→bl0wj0b, S6→d0gg1e (prompt start, leet-speak)

# 3. Wire via Wavespeed env (comma-separated, scale set in code to 0.8 for extras)
# Option A — env
WAVESPEED_LORA_PATH=/tmp/MysticXXX_MMH3-V4.safetensors bun run dev  # solo (heat 2–3)
WAVESPEED_LORA_PATH=/tmp/MysticXXX_MMH3-V4.safetensors,/tmp/WAN_COWGIRL_1428098-High.safetensors \
  wavespeed run wavespeed-ai/minimax-h3/image-to-video-lora --image <url> --last-image <url> \
    --prompt "$(cat docs/storyboard-heat4.local.md | head -n1)" --loras "$WAVESPEED_LORA_PATH" \
    --duration 5 --resolution 768p -o output/heat4/s3-5s-raw.mp4

# Option B — code (recommended, per-scene)
# loras: getLorasForScene("s3","heat4") → [{path:"/tmp/MysticXXX…",scale:1},{path:"/tmp/WAN_COWGIRL…",scale:0.8}]
# Max 3 files — H3 spec ≤12 files /64 MB body, loras count toward files. Do not pass gallery zip.

# Verify
ls -lh /tmp/*.safetensors
cat ~/.secrets/civitai.env  # keep local, never commit
wavespeed balance
wavespeed history --json | jq '.[0] | {id, status, elapsed_ms}'
```

**Downloader helper reads key in priority** (`scripts/download-mmh3-lora.ts:readCivitaiKey`): `process.env.CIVITAI_API_KEY` → `~/.secrets/civitai.env` (`$HOME/.secrets/civitai.env`) → `/Users/parab/.secrets/civitai.env` → `.dev.vars`. The `wavespeed CLI upload` media bucket `fetch failed` for `.safetensors` is expected (`engine-mmh3-reference.md` §8) — keep `.safetensors` local and pass as `loras:[{path,scale}]`, do not `wavespeed upload` the binary.

---

## 7. Failure / retry — LoRA fallback (from `engine-mmh3-reference.md` §8)

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Prediction failed (task_id: ff572335…): The job failed unexpectedly.` | H3 `loras` expects hosted/registered LoRA, not raw local path; or CLI flag drift (`--loras` rejected) | Retry once **without** `loras` (prompt-only H3 realism gate, not charged). Then retry with `scale:0.8` via direct API `generateH3ImageToVideoLora({loras:[{path,scale:0.8}]})` bypassing CLI. If still fails, keep prompt-only for realism gate. Keep file at `/tmp/MysticXXX...` via `WAVESPEED_LORA_PATH`. Check `wavespeed show <id> --json`. |
| CLI `unknown flag --image/--loras/--reference-images` | `wavespeed v0.2.3` long-flag drift per `generation-log.md` §5.1 | Use `--input-file /tmp/s*_input.json` (`{image,last_image,prompt,duration,resolution,loras,reference_images,aspect_ratio}`) or `-i key=value` form. Always pre-upload stills to CDN `wavespeed upload <jpg> --json` for URLs. |
| `wavespeed upload /tmp/*.safetensors → fetch failed` | Media bucket expects images, not LoRA binaries — expected not fatal | Keep `.safetensors` local; pass as `loras: [{path, scale}]` per `wavespeed.ts:215`. Do not upload LoRA via media endpoint. |
| Explicit Heat 4 text leak | Filled prompt committed | Store only in `docs/storyboard-heat4.local.md` (`*.local.md` gitignored) or `~/.secrets/storyboard-heat4.md` — never commit. This doc keeps `PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280` placeholders only. |

---

## 8. References

- **Storyboard:** `docs/storyboard-heat2-4.md` (S1–S6 30s 6×5s, §2 Heat 2 6 prompts fully written, §3 Heat 3 6 prompts fully written, §4a 12 Heat 4 T2I placeholders you fill, §4b Anubis Mini 8B `vast-anubis-rental.md` curl, §5 engine mapping)
- **Civitai scrape:** `docs/civitai-wan-examples.md` (Wan Video baseModel `14B t2v/i2v + 2.2 I2V-A14B`, 10 models §0b, table §1 prompts/camera/negative/tags, §2a camera-angle menu, §4 storyboard mapping S1–S6)
- **MMH3 engine:** `docs/engine-mmh3-reference.md` (Invariants, pipeline 5 steps Anubis→Wan T2I→Anubis→H3 R2V-LoRA→ffmpeg, `2856467:3266628`, `720*1280` T2I stills + `image+last_image+loras 768p 5s`, stitch rule, failure §8)
- **Camera grammar:** `docs/aicamera-movements.md` (§1 `Camera: Movement: Speed: Framing: End:` 18 of 46 mapping to S1–S6, §2 preset `push past / slider+handheld / slow zoom / arc 25° / first-person view / dolly out / dolly in`, vs `oss-prompts-mmh3-wan.md` gap fixes)
- **WaveSpeed lib:** `apps/web/src/lib/wavespeed.ts` (`CUSTOM_LORAS 1333923/1428098`, `MMH3_*`, `WavespeedLora`, `getWavespeedLoras()`, `getWavespeedLoraObjects()`, `getLorasForScene(sceneId, heat)` §4 this doc, `H3_IMAGE_TO_VIDEO_LORA_MODEL`, `generateH3ImageToVideoLora` $0.25, `generateH3ReferenceToVideoLora` $0.30)
- **OSS:** `docs/oss-prompts-mmh3-wan.md` (model table §1, Wan canonical negative, H3 Golden Formula, Noise Trap ISO <800, `flow_shift 5.0 @720p`, `num_frames 4n+1`)
- **Secrets:** `~/.secrets/civitai.env` (`CIVITAI_API_KEY=fe8256…`) — also `scripts/download-mmh3-lora.ts` key priority, `.dev.vars` mirror, keep local only (`wrangler dev --local`, never `wrangler deploy --remote`)

> Keep local, no explicit generation. Generate Heat 4 only via Anubis Mini 8B on Vast/Dell → `docs/storyboard-heat4.local.md` (gitignored) → `alibaba/wan-2.7/text-to-image --size 720*1280` stills → H3 `image+last_image` + `loras: getLorasForScene(scene, heat)` video. Heat 2–3 prompts in §1 stay committed as `720x1280 5s` clothed fully written; Heat 4 stays placeholder.
