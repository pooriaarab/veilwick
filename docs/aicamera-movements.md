# AI Camera Movements — VeilWick H3/Wan Prompt Pack

> **Source:** https://aicameramovements.com — *Camera movement prompts for AI filmmakers* (Dan Kieft). Visual companion to [ALL Camera Movement Prompts for AI Filmmaking Explained](https://www.youtube.com/watch?v=7GWd4PV3hoA).
> **Verified:** 2026-09-01 — `curl -s https://aicameramovements.com/` → 200, 46 cards × 7 categories, each with looping preview + copy prompt. Singular `https://aicameramovement.com` → DNS NXDOMAIN (no redirect — **plural is canonical**).
> **Scope:** local only, synthetic adults 18+ clothed, Heat 2–3 (fade-to-black / intentional touch, no nudity). Heat 4 placeholders untouched. Complements `docs/oss-prompts-mmh3-wan.md` and `docs/candy-ai-analysis.md`.
> **Models:** MiniMax H3 / Hailuo via Wavespeed `wavespeed-ai/minimax-h3/image-to-video-lora` (768p 9:16 5s, `$0.25/5s`) and Wan 2.1/2.7 `image-to-video` / `reference-to-video` / `flf2v` (720×1280 `num_frames 4n+1`).

---

## 0. How aicameramovements.com structures a prompt

Every card keeps **camera instruction separate from scene idea** so the prompt stays reusable when you swap the first frame. Copy-prompt grammar (from `data-copy` / `<pre>`):

```
Camera: <move name>. Movement: <physical description>. Speed: <pace>. Framing: <composition rule>. End: <landing frame>.
```

Builder flow (`/prompt-builder/`): upload first frame → pick move (46) → fill Subject / Location / Scene action / Mood → emits `Generated prompt` = camera sentence + image context + actor action separated.

7 categories: **Pan/Tilt (7) · Zoom/Lens (6) · Dolly/Track (9) · Physical Moves (11) · Human Camera (2) · Drone/Crane (5) · Specials (6)** = 46.

Site covers Kling, Seedance, Higgsfield, Runway, Sora-style tools — phrasing ports directly to H3/Wan (see §1).

---

## 1. Distilled taxonomy → VeilWick H3/Wan (curated 18 of 46)

> Full 46 in §4 Appendix. This table picks moves that **actually fit a 720×1280 5s vertical hallway/bedroom** and survive H3/Wan's motion model. Drone/helicopter, vehicle tracking, tilt-shift, infinite/earth zoom, Snorricam, time-lapse are omitted or marked avoid — see §4 notes.

| Movement (site Shot) | Category | Prompt phrase for H3 / Wan (paste-ready fragment) | When to use in VeilWick 6-scene E1 (B1→B8) | Example 720×1280 5s snippet — clothed Heat 2–3 (copy/paste tail) |
|---|---|---|---|---|
| **Static shot** `01` | Pan/Tilt | H3: `locked-off static shot, tripod, no camera movement, still and steady` · Wan: same (Wan `- negative: static` — **remove `static` from negative when you actually want static**; see oss-prompts gap 1) | **S1 Setup (B1) + S4 Leap + S5 Retreat** — VeilWick's default for consent beats. Candy.ai confirms static wins for doorway/line delivery. | `locked-off static shot, waist-height medium shot eye level, synthetic adult woman 18+ clothed in cream knit co-ord and linen robe, sunlit hallway doorway lean, soft smile one beat held, vertical 9:16 720x1280 5s, photorealistic 8k shallow DOF f/2.0 35mm, soft natural daylight, teal shadows lifted cinematic_warm LUT, Audio: soft room tone non_diegetic_music: N/A` |
| **Dolly in** `08` | Dolly/Track | H3: `dolly in, smooth controlled push forward in a straight line toward subject, keep height and lens direction consistent, finish tighter` · Wan: `slow dolly in, gentle push-in` | **S6 Afterglow (B8/12)** — canonical afterglow; also S2 Tension tightening. Prefer over `slow zoom in` when you want parallax (hallway boxes slide). | `dolly in smooth controlled push forward, high-angle close-up 35mm + pull wide at end, synthetic adult woman 18+ clothed in soft knit co-ord, soft sheets bedroom clothed embrace laugh golden-hour, vertical 720x1280 5s, slow push-in with breathing lifted blacks, Audio: soft laugh sheets rustle non_diegetic_music: N/A` |
| **Dolly out** `09` | Dolly/Track | `dolly out, smooth controlled retreat backward, more environment enters frame, finish wider` | **S5 Retreat (B7)** — literal step-back; reveals window/phone buzz. Pair with `pedestal` note if revealing counter. | `dolly out smooth controlled retreat, waist-height medium shot eye level window flare, synthetic adult woman 18+ clothed in cream loungewear, pull-back looking toward window soft pause "We go at your pace.", vertical 720x1280 5s, bright daylight, Audio: phone buzz soft non_diegetic_music: N/A` |
| **Slow zoom in** `05` | Zoom/Lens | `slow zoom in, gradual even focal length increase toward tighter frame, keep target readable, finish stable tighter` | **S3 Temptation (B5)** — intimacy without moving camera; good when H3 `image+last_image` would fight a dolly. Use zoom when set is tight (bedside). | `slow zoom in gradual even, high-angle close-up face + shoulders 35mm, synthetic adult woman 18+ clothed in sage linen shirt wide trousers, bedroom plant background soft smile closer frame hands on folded linen no touch, vertical 720x1280 5s, soft warm diffused window cinematic_warm LUT, Audio: soft room tone non_diegetic_music: N/A` |
| **Slow zoom out** `05B` | Zoom/Lens | `slow zoom out, gradual even focal decrease toward wider frame` | **S6 tagline pull** — alternative to dolly out when you want poster frame at 1.2s to breathe. | `slow zoom out gradual even, soft sheets bedroom clothed embrace, vertical 720x1280 5s, finish stable wider golden-hour vignette tagline "Some house rules are meant to be broken.", photorealistic 8k` |
| **Tilt up / Tilt down** `04 / 04B` | Pan/Tilt | `tilt up: rotate upward from fixed point, keep vertical subject centered, land on upper target` / `tilt down: mirror` | **Tilt up:** reveal from folded laundry → face (S2→S3). **Tilt down:** doorway header → eye contact (S1 alt). | `tilt up smooth constant from folded laundry foreground to face, medium shot eye level, synthetic adult woman 18+ clothed in ecru knit holding folded tee doorway, vertical 720x1280 5s, shallow DOF, Audio: fabric rustle non_diegetic_music: N/A` |
| **Pan right / Pan left** `02 / 02B` | Pan/Tilt | `pan right: rotate horizontally left→right from fixed point, keep horizon level` (and reverse) | Rare in vertical 9:16 intimate — use **once** for hallway reveal (S1 boxes entering) or kitchen counter scan. Keep subtle. | `pan right smooth constant rotation from stacked boxes left to doorway right, keep horizon level, synthetic adult woman 18+ clothed doorway lean, vertical 720x1280 5s, soft daylight, Audio: hallway ambient non_diegetic_music: N/A` |
| **Truck right / Truck left** `10 / 10B` | Physical | `truck right: move camera physically right on straight horizontal path, lens faces same direction, scene slides across frame` | **Horizontal parallax across hallway/bedroom** — stronger than slider. Use when hallway has depth layers (boxes→doorway). | `truck right smooth constant lateral, waist-height medium shot, synthetic adult woman 18+ clothed hallway doorway folded laundry foreground parallax, vertical 720x1280 5s, soft bokeh foreground, Audio: soft footsteps hall non_diegetic_music: N/A` |
| **Slider right / Slider left** `12 / 12B` | Physical | `slider right: slide small distance right, slow controlled, keep foreground/subject/background parallax readable, finish refined right-side angle` | **Micro-parallax for S2 tension** — smaller than truck; ideal when you want H3 to keep face locked but shift bokeh. | `slider right slow controlled small distance, soft bokeh foreground boxes parallax, synthetic adult woman 18+ clothed ecru knit, over-shoulder POV handheld breathing micro head bob, vertical 720x1280 5s, 35mm shallow DOF` |
| **Pedestal up / Pedestal down** `11A / 11B` | Physical | `pedestal up: move entire camera vertically upward in straight line, lens level same direction` (not a tilt — whole camera lifts) | **Pedestal up:** low → waist height for S2 doorway (boxes at feet → face). **Down:** high window → face for S5. Distinct from `crane` (crane travels through open space; pedestal stays on axis). | `pedestal up smooth constant lift from folded laundry low to eye level, keep lens level, synthetic adult woman 18+ clothed doorway hesitation, vertical 720x1280 5s, soft warm diffused window` |
| **Arc right / Arc left** `14 / 14B` | Physical | `arc right: move on shallow curved path around subject toward right side, keep distance/height consistent, finish new right-side angle` | **Soft angle change around S3/S4** — cheaper than full orbit, fits 5s. Keep ≤30° so H3 doesn't warp linen. | `arc right shallow curved path around subject toward right side 25°, keep distance and height consistent, high-angle close-up 35mm face + shoulders, synthetic adult woman 18+ clothed sage linen, vertical 720x1280 5s, slow bob handheld breathing` |
| **Orbit clockwise / Counterclockwise** `15 / 15B` | Physical | `clockwise orbit: circle clockwise around subject at consistent radius, keep subject centered while background rotates, smooth controlled orbit` | **Use sparingly: S4 Leap or S6 cuddle** — 30–60° arc only in 5s; full 360° will break H3 stitch. Site shows background rotation. | `clockwise orbit 30° smooth controlled radius, keep subject centered background rotates, synthetic adult woman 18+ clothed cotton shirt linen trousers leaning across counter eye contact "stay — just a minute longer" close but no embrace, vertical 720x1280 5s, static height, golden-hour` |
| **Tracking / Follow / Reverse / Side / Low** `16–20` | Dolly/Track | `tracking shot: move with subject matching pace` · `follow shot from behind at shoulder height` · `reverse tracking: move backward in front of walking subject` · `side tracking: parallel beside subject side profile` · `low tracking: ground/below-waist height alongside movement` | **S2 Tension hallway walk, S3→S4 approach.** Pick one: `reverse tracking` = H3 `true first-person POV` walking toward subject (VeilWick feed POV); `side tracking` = hallway passing; `low tracking` = laundry at feet. | `reverse tracking shot move backward in front of walking subject matching pace, true first-person POV eye level viewer hands soft foreground no HUD, synthetic adult woman 18+ clothed hallway approaching doorway, vertical 720x1280 5s, handheld breathing micro head bob 35mm` |
| **Crane up / Crane down** `25 / 25B` | Drone/Crane | `crane up: travel smoothly upward through open space, slow controlled vertical lift, keep subject readable as camera rises, finish higher scale visible` | **S1→S6 vertical reveal** — crane rises above boxes to window; crane down settles on bedside. More airy than pedestal; keep subtle in bedroom. | `crane up slow controlled vertical lift through open hallway, synthetic adult woman 18+ clothed doorway lean reveal, vertical 720x1280 5s, bright daylight window bounce, Audio: soft ambient non_diegetic_music: N/A` |
| **Drone push in / Drone pull back** `26 / 26B` | Drone/Crane | `drone push in: fly smoothly forward through open space toward subject, controlled aerial glide` | **Avoid for intimate S1–S6** — scale too aerial. Only for E1 establishing exterior (lake house dock) if you add a 7th wide. | — (not used in 6-scene E1; for poster/wide only) |
| **Push past / Pass-by** `13` | Physical | `push past: move forward past visible foreground object/edge/opening, smooth forward glide, let foreground pass close to lens while space beyond becomes clearer, arrive inside/beyond foreground layer` | **★ Best new doorway move for VeilWick** — hall boxes/doorframe pass close to lens then reveal subject. Perfect S1 Setup and S5→S6 transition. | `push past smooth forward glide past stacked boxes foreground close to lens, arrive inside doorway beyond, synthetic adult woman 18+ clothed cream knit robe doorway lean, vertical 720x1280 5s, shallow DOF bokeh foreground pass, soft daylight, Audio: soft tote rustle non_diegetic_music: N/A` |
| **Pass-through objects** `S6` | Specials | `pass-through: move forward toward visible object/surface/barrier and continue into space beyond, keep opening centered` | **Doorway/window object variant of push past** — use when foreground is a defined opening (doorframe, window). Slightly more literal than push past. | `pass-through centered glide through doorway opening, synthetic adult woman 18+ clothed bedroom soft sheets background, vertical 720x1280 5s, keep opening centered transition, Audio: room tone non_diegetic_music: N/A` |
| **Handheld shot** `23` | Human Camera | H3/Wan: `handheld shot at human operator height with natural body movement, responsive organic, subtle sway and micro-adjustments, keep subject readable` · Merge with oss-prompts phrasing: `subtle handheld with breathing, micro head bob from footsteps` | **S2 Tension + S3 Temptation + S6 Afterglow** — VeilWick's `slow bob` is this. Add only when beat needs candid intimacy; keep static for consent beats. | `handheld shot natural body movement responsive organic subtle sway micro head bob, over-shoulder POV eye level medium shot, synthetic adult woman 18+ clothed ecru knit holding laundry doorway hesitation, vertical 720x1280 5s, soft warm window + teal LUT, Audio: fabric rustle soft breath non_diegetic_music: N/A` |
| **First-person view** `S1` | Specials | `first-person view: move forward at human eye height from character's perspective, natural walking/reaching pace, use visible hands/arms/body edges as viewer's physical reference, arrive at next point of action` | **★ Primary POV for VeilWick** — maps directly to H3 `true first-person POV, eye level, viewer's hands soft foreground no HUD, 35mm, shallow depth`. Use S2, S4, S6. | `first-person view move forward at human eye height natural walking pace, viewer hands soft foreground no HUD, synthetic adult woman 18+ clothed soft cotton shirt leaning across counter eye contact whisper "Breathe with me — slow.", vertical 720x1280 5s, handheld breathing shallow DOF, Audio: soft whisper room tone non_diegetic_music: N/A` |

> **Whip pan** `03/03B` and **Crash zoom** `07A/07B` / **Fast zoom** `06/06B` exist but read as **comedy/action** in vertical intimate — use only for S5 crisis/phone-buzz transition if you want a “snap” (add `brief motion blur, settle sharp`). Otherwise avoid.
> **Chase shot** `22`, **Vehicle tracking** `21`, **Helicopter** `27`, **Tilt-shift** `S2`, **Infinite/Earth zoom** `S3/S4`, **Time-lapse** `S5`, **Snorricam** `24` → not for Heat 2–3 hallway/bedroom; keep for E2 exterior or montage only.

---

## 2. VeilWick 6-scene preset — which move per heat (recommended)

Keep **one move per 5s clip** (H3 Golden Formula rule: 2–3 actions max, one motion token per Shot). Map below upgrades `storyboard-heat2-4.md` §2–§3 `slow bob / static` into the aicameramovements vocabulary without breaking `image+last_image` stitch.

| Scene | Beat | Heat 2 preset (clothed fade-to-black) | Heat 3 preset (intentional touch) | Why this move vs oss-prompts default |
|---|---|---|---|---|
| **S1 Setup** 0:00–0:05 B1 | Adoration | **`Static shot` → `Push past` alt** — start static, or push past boxes foreground to reveal doorway | Same, with hand hovers tote (add `linen sleeve half-slipped`) | `push past` is the new doorway grammar candy.ai posters imply but oss-prompts didn't name; stronger than plain static |
| **S2 Tension** 0:05–0:10 B3 | No-way | **`Slider right` + `Handheld`** — micro-parallax + breathing | `Truck right` if hallway deeper | Replaces generic `slow bob` with named lateral parallax; keeps face locked but shifts bokeh |
| **S3 Temptation** 0:10–0:15 B5 | Temptation | **`Slow zoom in` or `Arc right 25°`** — tighten without moving through set | `Arc right` + hair-tuck consent line | `arc` gives new angle without orbit risk; `slow zoom` when set too tight to move |
| **S4 Leap** 0:15–0:20 B6 | Leap | **`Static shot` (close-up) or `Orbit 30°` alt** — consent is static; orbit only if you want lean-in orbit | `First-person view` + `Reverse tracking` hybrid — viewer leans in | `first-person view` is the site's name for our H3 POV; `reverse tracking` is walking-toward POV |
| **S5 Retreat** 0:20–0:25 B7 | Retreat | **`Dolly out` + `Pedestal up`** — widen + lift to window flare | `Dolly out` with `lingering hand release` | Oss-prompts had only static; dolly-out literally reintroduces distance |
| **S6 Afterglow** 0:25–0:30 B8/12 | Afterglow | **`Dolly in` (pull wide at end) + `Handheld` gentle** | Same + hair-tuck callback | `dolly in` is the site-verified afterglow move; `slow zoom out` alt for poster tagline breath |

**Per-clip copy/paste rule:** prepend one `Camera: … Movement: … Speed: … Framing: … End: …` sentence, then the scene tokens, then `vertical 9:16 720x1280 5s, photorealistic 8k shallow DOF f/2.0 35mm, soft … LUT, natural skin pores + fabric weave, Audio: …, non_diegetic_music: N/A` + VeilWick negative (append `nude, naked…` per `storyboard-heat2-4.md` §0).

---

## 3. Compare to `docs/oss-prompts-mmh3-wan.md` and `docs/candy-ai-analysis.md` — what is new

### 3a. vs oss-prompts-mmh3-wan.md (your H3/Wan bible)

| Area | oss-prompts-mmh3-wan already covers | aicameramovements.com adds (new inspiration) |
|---|---|---|
| **Motion vocabulary size** | Graded vocab via Golden Formula + camera grammar: `shot_scale` (7) / `camera_angle` (6) / `viewpoint` (3) / `focal-length` (4); plus `dolly/tracking/crane/handheld/orbit`, `tilt`, `truck left+pan right`, `micro head bob`, `slow bob`, `push-in`. · Warns one motion token per Shot. | **46 named moves vs ~12 mentioned.** Now every move has a canonical 4-clause sentence (Movement/Speed/Framing/End). That lets you swap moves without rewriting the scene half. |
| **Optical vs physical motion** | Mentions `dolly forward` vs `slow push-in` but doesn't contrast parallax. | **Explicit: `dolly in` (physical camera moves, parallax) vs `slow zoom in` (lens only, no parallax) vs `crash zoom`.** For hallway boxes, dolly gives real parallax; zoom keeps `image+last_image` stable when H3 would warp. Choose per risk. |
| **Lateral moves** | Only `truck left + pan right` orbit pattern (one line). | **Five grades:** `truck` (full lateral) → `slider` (small parallax) → `arc` (curved) → `orbit` (centered circle) → `push past` (foreground occlusion). Lets you grade S2/S3 laterals instead of binary `static / slow bob`. |
| **Vertical: pedestal vs tilt vs crane** | `tilt down`, `crane up`, but `pedestal` unnamed. | **Pedestal (whole camera lifts, lens stays level) vs Tilt (rotate on axis) vs Crane (fly through open space).** Use pedestal for low→eye-level laundry reveal, tilt for header→face, crane for airy exterior. |
| **Doorway grammar** | Doorway as location token only. | **`Push past / pass-by` + `Pass-through objects` — camera moves past foreground object/edge/opening and arrives inside.** This is the literal doorway shot candy.ai uses; it was missing from oss-prompts. Add as S1/S5 preset. |
| **Tracking family** | `dolly/tracking/crane/handheld/orbit` plus `walking-approach` POV tag. | **Six tracking flavors:** `tracking` (with subject) / `follow (OTS)` / `reverse tracking (walk-and-talk)` / `side` / `low` / `chase`. Maps to VeilWick POV: `reverse tracking` = walking toward subject (S2), `side tracking` = hallway passing, `low tracking` = feet/ground. |
| **Handheld / First-person** | `handheld with breathing`, `micro head bob`, `true first-person POV eye level viewer hands soft foreground no HUD` (well documented). | **Site confirms `Handheld shot` and `First-person view` as standalone moves with same phrasing.** No new token needed — but site's copy prompt validates your `handheld breathing micro head bob` as the canonical human-camera language. |
| **Speed discipline** | `visual→audio order, 2–3 actions /15s`, `Amplitude+speed fused`. | **Every move names Speed explicitly** (`still / smooth constant / gradual even / fast snap / brief motion blur / responsive organic`). Copy that Speed token into H3 `[画面过程]` for predictable 5s pacing. |
| **When not to use a move** | Noise Trap (ISO <800), don't combine `RAW iPhone` + `cinematic masterpiece`. | **Site makes the exclusion list easy:** helicopter/vehicle/infinite/earth zoom/tilt-shift/time-lapse/Snorricam read as non-intimate in 9:16 hallway — mark avoid for E1, reserve for E2 exterior/montage. |

**New inspirations to add to `oss-prompts-mmh3-wan.md` §5b Angle vocabulary (1 paragraph):**
> Add alongside `shot_scale / camera_angle / viewpoint / focal-length`: `aicameramovements.com 46-move library — dolly in/out vs slow zoom in/out (parallax vs optical), truck vs slider (full vs micro lateral), arc vs orbit (shallow ≤30° vs centered circle), pedestal vs tilt vs crane (lift vs rotate vs fly), push past / pass-through (foreground occlusion doorway reveal), tracking family (follow/reverse/side/low), handheld + first-person (operator sway + viewer's hands soft foreground). Reference each 5s clip with one `Camera: … Movement: … Speed: … Framing: … End: …` sentence plus `Audio: …, non_diegetic_music: N/A`. For VeilWick E1 prefer push past (S1), slider+handheld (S2), slow zoom or arc 25° (S3), static or orbit 30° / first-person reverse tracking (S4), dolly out (S5), dolly in (S6). Avoid helicopter/vehicle/infinite/earth/tilt-shift/time-lapse in hallway beats.`

### 3b. vs candy-ai-analysis.md (your scene-structure ref)

| Area | candy-ai-analysis gives | aicameramovements adds |
|---|---|---|
| **What it is** | Empirical browse of candy.ai — 4 series × 60s, 720×1280 `cover`, 45–66s median, 5-ep gating, player chrome, poster light, tension vs afterglow distinction, 4-row angle preset + subtitle/speed signals. | **Reusable micro-prompt library.** Candy-ai tells you *what candy.ai actually uses* (dominant: POV handheld medium-close + static close-up + doorway wide); aicameramovements tells you *how to phrase every micro-move you didn't see there* (slider, arc, pedestal, push past, etc.) and *how to vary them without repeating the same POV*. |
| **Camera preset size** | 4 presets: `POV handheld medium-close` (tension) · `Static close-up` (line delivery) · `Static medium doorway/wide` (geography) · `Slow push-in` (afterglow). Correct for 60s. | **Expands 4 → 12 mapped presets.** Keeps the 4 as anchors, but S2 now chooses `slider vs truck`, S3 gets `slow zoom vs arc`, S4 gets `reverse tracking (first-person walk)` vs static, S1 gets `push past` doorway. Gives you per-episode variation without leaving candy.ai's POV grammar. |
| **Doorway** | Notes “doorway/frame-within-frame = tension + geography” but only as location. | **Makes doorway a camera move:** `push past` (boxes/frame passes lens) and `pass-through objects` (centered opening). Use instead of static medium doorway when you want the camera to *arrive* inside the threshold. |
| **Lighting/afterglow** | Tension = `cool + warm rim`, afterglow = `warm tungsten/golden-hour, side-by-side, soft gaze`, crisis = `handheld + contrast bump`. | Keeps it — site's prompts end with `Framing: … End: …` which is where you add the LUT beat (`cinematic_warm` for tension, boosted golds for afterglow). No conflict. |
| **Duration / resolution** | Proves `720×1280 9:16 cover` and `55–60s default` (45s stairway variant). | Validates 5s per shot: every site move is described as “for the full clip” — matches H3 `duration:5` and Wan `81 frames = 5.06s@16fps`. One move per clip is the discipline both sources agree on. |
| **What candy-ai has that aicameramovements lacks** | **Real product data:** gating UX, subtitles (6 langs), speed control 0.5–2×, character reuse across Shorts+chat, `private-cdn` poster path, Featured Characters 600×900 2:3 vs Shorts 720×1280 9:16. | Use candy-ai for **product/chrome** decisions, aicameramovements for **prompt wording** decisions. Together they cover prototype-scenes.html fidelity. |
| **Combined recommendation** | Keep candy-ai's 4-row preset as default; swap in aicameramovements move when you need variation across a 6-scene arc. | **Don't add drone/helicopter** — candy-ai evidence says viewer is always participant, never overhead. That cross-validates marking `S2 tilt-shift / infinite zoom` as avoid for E1. |

---

## 4. Appendix — full 46-move inventory (source: aicameramovements.com)

> Paste-ready `Camera: …` sentences are truncated to first 140 chars for scan; open the site for full text + looping preview. `data-copy` is the canonical prompt. Preview Mp4s live at `previews/hq/<id>-<slug>-hq.mp4` on the site.

| Shot | Title | Category | `data-copy` prompt (truncated) | VeilWick use for E1 6-scene |
|---|---|---|---|---|
| 01 | Static shot | Pan/Tilt | `Camera: locked-off static shot. Movement: hold one fixed camera position for the full clip. Speed: still and steady…` | ✅ S1/S4/S5 anchor |
| 02 | Pan right | Pan/Tilt | `Camera: pan right. Movement: rotate the camera horizontally from left to right…` | △ hallway scan alt |
| 02B | Pan left | Pan/Tilt | `Camera: pan left. Movement: rotate … right to left…` | △ mirror |
| 03 | Whip pan right | Pan/Tilt | `Camera: whip pan right. Movement: rotate rapidly … Speed: fast snap with brief motion blur…` | △ S5 crisis snap only |
| 03B | Whip pan left | Pan/Tilt | `Camera: whip pan left…` | △ mirror |
| 04 | Tilt up | Pan/Tilt | `Camera: tilt up. Movement: rotate the camera upward from one fixed point…` | ✅ S2 laundry→face |
| 04B | Tilt down | Pan/Tilt | `Camera: tilt down…` | △ header→face alt |
| 05 | Slow zoom in | Zoom/Lens | `Camera: slow zoom in. Movement: slowly increase lens focal length toward a tighter frame…` | ✅ S3 tighten without move |
| 05B | Slow zoom out | Zoom/Lens | `Camera: slow zoom out. Movement: slowly decrease lens focal length toward a wider frame…` | ✅ S6 tagline breath |
| 06 | Fast zoom in | Zoom/Lens | `Camera: fast zoom in. Movement: quickly increase lens focal length… Speed: quick decisive zoom…` | △ faster variant — use sparingly |
| 06B | Fast zoom out | Zoom/Lens | `Camera: fast zoom out…` | △ mirror |
| 07A | Crash zoom in | Zoom/Lens | `Camera: crash zoom in. Movement: snap the lens rapidly … Speed: very fast and punchy…` | ✗ avoid intimate (action/comedy feel) |
| 07B | Crash zoom out | Zoom/Lens | `Camera: crash zoom out…` | ✗ avoid |
| 08 | Dolly in | Dolly/Track | `Camera: dolly in. Movement: move the camera physically forward in a straight line toward the main subject…` | ✅ S6 afterglow |
| 09 | Dolly out | Dolly/Track | `Camera: dolly out. Movement: move the camera physically backward … more environment enters frame…` | ✅ S5 retreat |
| 10 | Truck right | Physical | `Camera: truck right. Movement: move the camera physically to the right on a straight horizontal path…` | ✅ S2 hallway parallax |
| 10B | Truck left | Physical | `Camera: truck left…` | ✅ mirror |
| 11A | Pedestal up | Physical | `Camera: pedestal up. Movement: move the entire camera vertically upward in a straight line…` | ✅ S2 low→eye |
| 11B | Pedestal down | Physical | `Camera: pedestal down…` | ✅ S5 high→face |
| 12 | Slider right | Physical | `Camera: slider right. Movement: slide the camera a small distance to the right. Speed: slow controlled… parallax shifts…` | ✅ S2 micro-parallax (preferred) |
| 12B | Slider left | Physical | `Camera: slider left…` | ✅ mirror |
| 13 | Push past / pass-by | Physical | `Camera: push past. Movement: move forward past a visible foreground object, edge or opening… foreground passes close to lens…` | ✅★ S1 doorway reveal |
| 14 | Arc right | Physical | `Camera: arc right. Movement: move on a shallow curved path around the main subject toward the right side…` | ✅ S3 angle change |
| 14B | Arc left | Physical | `Camera: arc left…` | ✅ mirror |
| 15 | Orbit clockwise | Physical | `Camera: clockwise orbit. Movement: circle clockwise around the main subject at a consistent radius… background rotates…` | ✅ S4/S6 30° arc only |
| 15B | Orbit counterclockwise | Physical | `Camera: counterclockwise orbit…` | ✅ mirror |
| 16 | Tracking shot | Dolly/Track | `Camera: tracking shot. Movement: move through the scene with the main subject. Speed: match the subject's pace…` | ✅ hallway walk |
| 17 | Follow shot / OTS | Dolly/Track | `Camera: follow shot from behind. Movement: move behind the subject along their route at shoulder height…` | ✅ OTS walk |
| 18 | Reverse tracking | Dolly/Track | `Camera: reverse tracking shot. Movement: move backward in front of the walking subject. Speed: match the subject's forward pace…` | ✅★ walking-toward POV |
| 19 | Side tracking | Dolly/Track | `Camera: side tracking shot. Movement: move parallel beside the subject along their direction of travel…` | ✅ hallway side pass |
| 20 | Low tracking | Dolly/Track | `Camera: low tracking shot. Movement: move at ground or below-waist height alongside the subject's movement path…` | ✅ feet/ground beat |
| 21 | Vehicle tracking | Dolly/Track | `Camera: vehicle tracking shot…` | ✗ not E1 |
| 22 | Chase shot | Dolly/Track | `Camera: chase shot. Movement: follow a moving subject quickly … Speed: fast, reactive…` | ✗ not intimate |
| 23 | Handheld shot | Human Camera | `Camera: handheld shot. Movement: hold the camera at human operator height with natural body movement. Speed: responsive organic…` | ✅ S2/S3/S6 |
| 24 | Body-mounted / Snorricam | Human Camera | `Camera: body-mounted Snorricam. Movement: keep the camera fixed relative to the subject's torso… background moves…` | ✗ avoid (disorienting 5s) |
| 25 | Crane up | Drone/Crane | `Camera: crane up. Movement: travel smoothly upward through open space. Speed: slow controlled vertical lift…` | △ airy S1 alt |
| 25B | Crane down | Drone/Crane | `Camera: crane down…` | △ mirror |
| 26 | Drone push in | Drone/Crane | `Camera: drone push in. Movement: fly smoothly forward through open space… controlled aerial glide…` | ✗ exterior only |
| 26B | Drone pull back | Drone/Crane | `Camera: drone pull back…` | ✗ exterior only |
| 27 | Helicopter shot | Drone/Crane | `Camera: helicopter-style aerial shot. Movement: move from high altitude along a broad gradual flight path…` | ✗ not intimate |
| S1 | First-person view | Specials | `Camera: first-person view. Movement: move forward at human eye height from the character's perspective… use visible hands…` | ✅★ primary POV |
| S2 | Tilt-shift | Specials | `Camera: tilt-shift miniature view. Movement: hold or glide from a high angled view… narrow band of sharp focus…` | ✗ not E1 |
| S3 | Infinite zoom | Specials | `Camera: infinite zoom. Movement: zoom continuously inward toward the exact center target. Speed: smooth accelerating zoom…` | ✗ exterior/montage only |
| S4 | Earth zoom out | Specials | `Camera: earth zoom out. Movement: pull upward from the starting point through street, city, landscape and planet scale…` | ✗ exterior only |
| S5 | Time-lapse | Specials | `Camera: locked-camera time-lapse. Movement: hold one fixed camera position while time moves rapidly forward…` | ✗ not 5s intimate |
| S6 | Pass-through objects | Specials | `Camera: pass-through movement. Movement: move forward toward a visible object, surface or barrier and continue into the space beyond…` | ✅ doorway/window |

**Key — use column:** ✅ recommended for E1 · △ situational · ✗ avoid for 6-scene hallway/bedroom (reserve for E2 exterior/montage) · ★ new vs oss-prompts

---

## 5. How to apply — one-line patch per storyboard scene

Add to each `storyboard-heat2-4.md` §2/§3 prompt: replace the generic `static camera` / `slow bob subtle handheld with breathing` fragment with the row's `Prompt phrase for H3/Wan` from §1, keep everything after `vertical 9:16 720x1280 5s` unchanged. For H3 structure (`【参考素材说明】→【核心创意】→【画面过程】→【贯穿要求】→【限制】`), place the move inside `【画面过程】 Shot 1 [0-5s]` as the `Camera:` sentence; for Wan just inline it after the subject tokens.

Wan `negative` note: when you pick `Static shot`, **remove `static`** from the canonical Wan negative (`…style, works, paintings, images, static, overall gray…`) — otherwise you suppress your own move.

---

*Source page cached to `/tmp/aicm.html` and `/tmp/aicm.json` (46 moves) during crawl; this doc is the checked-in artifact. No video downloaded.*
