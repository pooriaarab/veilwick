# Short Drama Production — Study for VeilWick

> **Source:** [`suihe1/short-drama-production`](https://github.com/suihe1/short-drama-production) — cloned to `/tmp/short-drama-production` (2026-09-02, `main`, 2 commits, 69 stars, Apache-2.0). Codex skill that turns AI video generation into a traceable, approvable, reworkable short-drama production pipeline. Default `16:9` horizontal. Node `18+` + Python `3.10+` + FFmpeg. 21 deterministic tests.

---

## 1. What it does

Not a prompt pack. It is a **production control plane** (`production.json`) that wires outline → cast → art → script → director → tech storyboard → H3 generation → sound → rough cut → QC → delivery into one stateful chain with dependency hashes, stale propagation, and pay-boundary gates. Content lives in per-stage JSON; `production.json` stores only paths, hashes, dependencies, approvals, and job state.

Key claim: the hard part is not one shot, but keeping dozens of shots coherent across ongoing revisions.

---

## 2. Pipeline — 10 stages + gates

```
ingest → outline → cast → art → script → director → storyboard → generate → post → qc → delivery
```

| Stage | Owner skill | Hard input | Output | Human gate |
|---|---|---|---|---|
| `ingest` | control plane | source / brief | `production.json` (format `16:9 1920×1080 24fps landscape-ensemble`) | scope confirm |
| `outline` | `novel-outline` | source | `outline.json` | adaptation direction |
| `cast` | `novel-characters` | outline | `cast.json` + char images + voice assets | cast & style |
| `art` | `novel-art` | outline+cast | `art.json` + scene/prop refs | visual bible |
| `script` | `novel-script` | outline+cast+art | `script.json` (flow per scene) | batch scripts |
| `director` | `short-drama-director` | script+bible | `director-package.json` (beats, blocking, size/angle/lens/camera, axis, coverage) | director lock |
| `storyboard` | `storyboard-bridge` **or** `novel-storyboard` + `h3-prompt-writing` | script+director+assets | `storyboard.json` or H3 package `manifest.json` | tech storyboard |
| `generate` | `h3-official.mjs` or `compshare-h3.py` | storyboard + refs + voice + provider | `video/*.mp4` jobs | **sample clip first**, then batch |
| `post` | `post-kit.mjs` + manual | clips + audio + subs | rough-cut `edit-plan.json` → `E##-roughcut.mp4` | working cut |
| `qc` | control + manual director | working cut + all upstream | QC sheet, rework tickets, master | delivery |

### Recommended order (from `references/pipeline.md`)

1. Full outline first (cut lines, merge characters, paywall). Approve before mass asset work.
2. Cast + base art in parallel after outline lock.
3. Reality gate before art if functional spaces (station/office/hospital) — see §7.
4. Art → first script batch (1–3 eps) → art re-lock (prop/lighting per actual script).
5. Director (blocking before camera) → tech storyboard (one route only).
6. **Generate:** lock 1 clip → candidate frame prompts → approve frames → final H3 prompts → **one high-exposure pilot** → 1 scene/ep → full batch. Never bulk before pilot passes.

### Approval semantics (hash-bound)

- `review` — file exists, not approved or changed after approval.
- `approved` — file + all dependency hashes match approval snapshot.
- `stale` — upstream changed.
- `missing` / `blocked` / `skipped` / `failed` — explicit.

Only `approved` artifacts may support paid generation. `refresh` marks `stale`/`review`; `approve` captures current hashes. Aspect change invalidates all non-source artifacts.

### Rework propagation

```
outline change → cast/art/script/director/storyboard/video/edit stale
art change     → script check + director/storyboard/frames/video/edit stale
script change  → director/storyboard/voice/video/sub/edit stale
director change→ storyboard/frames/video/edit stale
voice master   → H3 jobs + video/edit stale that reference it
```

Fix from the highest true cause, not downstream patches.

---

## 3. How it handles scenes, prompts, stitching, LoRAs, duration

### Scenes — director → tech storyboard

**Two exclusive routes** (not sequential):

| Route | When | Command |
|---|---|---|
| Director bridge | Have `director-package.json` | `node scripts/storyboard-bridge.mjs build <director.json> --script <script.json> --out <storyboard.json> --aspect 16:9` then `validate` then `production-kit.mjs jobs-sync` |
| Standard package | Have `novel-storyboard export/manifest.json` | `production-kit.mjs jobs-sync-package --manifest <manifest.json>` |

Bridge deterministically maps `clip → H3 segment`, `shot → cut`, `beatId → script flow range`, size/camera enums, reference/voice binding, prompt docs, `sourceShotId` + director intent snapshot + `16:9` composition. Never re-import the same batch through both routes.

**Splitting a director clip** into multiple H3 jobs is allowed (duration overflow, ref count overflow, complex crowd/occlusion, different audio routes) but must preserve `sourceShotId`, total duration, head/tail framing, and not double-claim a primary beat.

**Deviation log** required when size/order/camera/axis/dialogue/duration>15%/voice/reaction/info changes — records `fields, reason, original, change, dramaticImpact, approvedBy, status`. Only `approved` deviations pass the board gate.

### Prompts — strict ordering

- **Board prompt first, candidate frames second, final H3 prompt last.** Board text → generate candidate reference stills → human QC → final H3 prompt via official `h3-prompt-writing` skill. Never freeze H3 prompt before frame QC.
- Bad pose / hand side / support point / unreadable info graphic → delete from reference list, re-drive via semantic assets + prompt; do not prompt-hack a broken image.
- Official H3 prompt is **English 6-section Ref2VA** (`subject_definitions / summary / retention_analysis / detailed_description / overall_soundscape / non_diegetic_music`) — Chinese only in upstream brief/dialogue/visible text. Chinese free brief + Context-IR is a valid experiment, not default.
- Camera vs in-frame motion described separately. Pace changes via re-timing shots, never blanket speed-up of master.
- Failed frame QC includes pose continuity (`lay/sit/stand, support, holding hand`), info plan coverage (screen content ≥50% via insert/fullscreen, not small diegetic screen).

### Stitching — sequence + crude cut

- `sequence` field on every job = global rough-cut order (sorted by episode then sequence). `post-kit.mjs buildEditPlan` collects only `status=succeeded` jobs, groups by `episode`, orders by `sequence`.
- Rough cut: `contain-pad` (letterbox, no stretch) to `deliveryWidth×Height 1920×1080 24fps 48kHz stereo`, sequential concat via FFmpeg filter graph. `plan` → `preflight` (ffprobe decode/AR/fps) → `assemble` (dry-run prints command) → `assemble --execute` → `qc`. Missing FFmpeg → plan still generates, checks degrade gracefully.
- Cross-segment continuity is a director/board concern (framing, phase, eyeline, audio crossfade); the tool only stitches in declared order — no auto cross-dissolve/JL-cut (manual post).
- Output `SHA-256` + `inputHashes` per clip bound to `edit-plan.json` for rework trace.

### LoRAs

No native LoRA concept. Character/scene/prop consistency comes from **reference assets + prompt discipline**, not model weights:

- `reference_image` (≤9), `reference_video` (≤3, each 2–15s, total ≤15s), `reference_audio` (≤3, each 2–15s, total ≤15s), total ≤12 files, prompt ≤7000 chars, body ≤64 MB (official H3 limits).
- H3 modes: `h3-t2va` (text only), `h3-i2va` (first_frame), `h3-fl2va` (first+last), `h3-ref2va` (semantic refs). **Ref2VA vs FL2VA/L2VA/I2VA are exclusive** — `reference_image/audio` and `first_frame/last_frame` never mixed in one job. Multi semantic refs ≠ keyframe pinning; `first/last_frame` are the keyframe mechanism.
- When a diffuser LoRA is needed, it is an **external adapter** — add a `ComfyUI API` adapter per README/references; no built-in LoRA loader.

### Duration

- H3 single job: **4–15s integer** only. Decimal storyboard durations are quantized (`nearest`/`ceil`/`floor`, default `nearest`) with `sourceDurationSeconds / durationAdjustmentSeconds / durationPolicy` audit so rounding is never silent.
- Episode length is sum of job `duration`s. Whole-film speed-up forbidden — re-time per shot.
- Delivery `fps 24` enforced at rough-cut transcode; generation `generationResolution` is `768P` (pilot cost control) or `2K` after approval — not the delivery size.

### Voice

- Discovery → audition (same line, 1–4 public Fish voices, WAV 44.1k PCM, header-fixed) → `evaluation-only` + `humanApproval=pending` + `productionExportAllowed=false`.
- Private clone from owned/licensed sample → `master` (6–12s dry mono, one person).
- Fixed-character default: `h3-native-reference` (H3 generates dialogue from reference audio + image/video, `retention_analysis: reference` with explicit `Audio N → Subject N (Sx)` binding). Alternatives: `tts-guided-h3` (TTS first, then H3 `partially_copy/fully_copy`) for exact amounts/names/incantations, `tts-post` (post dub), `h3-native-free` (pilot only).
- Voice budget: ≤3 audio refs per job, each needs an image/video companion, Ref2VA-only; >3 speakers → split into duo/trio, off-camera, or crowd.

### Reality grounding (optional gate, triggered by functional spaces or user request)

Five-layer checklist before art frames: function identity, must-have devices, topology, people/logistics flow, running state. Sources: ≥1 `authoritative` + optional `visual` with URL/title/date; `reality-audit.json` with `peoplePolicy.assetSheet=empty`, production shots per `peoplePolicy`. Validator `reality-audit.mjs` checks structure; human checks the image. Failing audit blocks paid generation.

### Cost & safety rails

- Dry-run / preflight / pilot first. No paid submit without `costApproved` + job `approve` + user’s explicit `--confirm-submit <jobId>` per job.
- Existing `taskId` → query before resubmit; failures never auto-retry as paid.
- Secrets only from env or `~/.codex/secrets/*.key`, never in JSON/logs/repo. Free/unauthorized voices stay `evaluation-only`; upgrade requires re-recording + re-approval + downstream refresh.

---

## 4. How VeilWick can borrow

### VeilWick today (E1 `your-new-stepsister-e1` — distilled from `docs/tasks.md`, `per-scene-loras.md`, `storyboard-heat2-4.md`, `engine-mmh3-reference.md`, `wavespeed.ts`, `generate-series-local.ts`)

- **Episode shape:** `6 scenes × 5s = 30s` nominal (~31s actual with H3 5.166667s padding), **720×1280 9:16 vertical** (request `768p 768×1344` then `ffmpeg lanczos` downscale). Feed 8 categories (market-stall-fashion, beach-lifestyle, …), clothed wellness.
- **Engine:** Wavespeed `minimax-h3/image-to-video-lora` `$0.25/5s 768p 9:16` with `image` + `last_image` stitch (`S(n).last → S(n+1).first`) + `MysticXXX_MMH3-V4.safetensors` `148 MB` `scale 1.0` (or `0.8` when stacked) on every clip via `WAVESPEED_LORA_PATH` / `getLorasForScene`. Library Wan 2.4-14B 720×1280 kept for nightly batch (FLF/FLF2V 60s via 4×15s). `generate-series-local.ts` local-only (`--local` only, no `--remote`), writes R2 + D1.
- **Scene graph:** `Heat 2` (fade-to-black, no touch) + `Heat 3` (intentional touch — shoulder/hair-tuck/breath-sync, consent line) are 12 fully-written `720×1280 5s` prompts (`slow bob` vs `static` per scene, LUT `cinematic_warm`). `Heat 4` is **12 T2I placeholders** (`PASTE YOUR HEAT 4 T2I PROMPT HERE 720x1280`, `first_frame` + `last_frame` per scene) filled via Anubis Mini 8B locally → Wan `text-to-image 720*1280` → H3 `image+last_image+loras` (see `per-scene-loras.md` §§1–4, `engine-mmh3-reference.md` steps 1–5, `vast-anubis-rental.md`).
- **Per-scene specialized LoRAs:** Civitai Wan 2.1/2.2 — `1333923 POV Blowjob` `2021242`, `1428098 Cowgirl/Reverse` `2156392/1700002`, etc. Max `MMH3 + 2 extras ≤3`. S5 retreat stays MMH3-only by design. Wired in `wavespeed.ts` `CUSTOM_LORAS` + `getLorasForScene`.
- **Prompt style:** OSS MMH3 6-section + Viddo Golden Formula + Wan realism (8k, f/2.0 35mm, teal/orange LUT, lifted blacks, `non_diegetic_music: N/A`, one motion token per shot, `Audio: {ambient+sfx}`). Well vetted in `oss-prompts-mmh3-wan.md`.
- **Audio:** Clothed dialogue via H3 native or TTS-guided; no separate Fish Audio in VeilWick feed (music is `post` per H3 convention).
- **State:** No `production.json`-like control plane — series/episodes live in D1 `series`/`episodes` + local `output/series/{slug}/`.

### Feature comparison — short-drama-production vs VeilWick E1

| Feature | short-drama-production | VeilWick E1 (6 × 5 s, 30 s, **H3 720×1280 9:16**) | Adopt? |
|---|---|---|---|
| **Production control plane** | `production.json` — single source of truth: artifacts, voiceAssets, jobs, approvals, risks, dependency hashes, stale propagation, `refresh/validate/render/status` CLI | D1 `series` + `episodes` + local files — no dependency graph, no stale marking | **Yes — adapt.** Add `production.json` per series (or per seasonal pack) to track `cast/art/script/storyboard` stages feeding the 6 H3 jobs. Keep VeilWick’s 9:16 presets, do not adopt `16:9` default. |
| **Aspect & delivery** | Default `16:9 1920×1080 24fps landscape-ensemble`, `safeArea`, `generationResolution 768P→2K`. Aspect change invalidates downstream. | `9:16 720×1280 24fps`, request `768p 768×1344` then lanczos downscale (`generation-log.md` §11). Portrait everywhere. | **No wholesale.** Keep VeilWick’s `9:16` preset. Borrow the **invalidation idea**: portrait↔landscape switch should stale all boards/jobs/edits. Add `aspectRatio: "9:16"` contract to VeilWick production file. |
| **Pipeline stages & gates** | 10 stages with hard inputs + human gates; canonical scripts per stage (`novel-outline/characters/art/script/director/storyboard/h3-prompt-writing` + control) | Outline/beats implicit in `prompts.md` + `storyboard-heat2-4.md` Heat 2/3; no cast/art/script JSON split; prototype stills are hand-picked, not stage-gated | **Partial — staged.** Keep current 30s probe flow; add lightweight `cast.json` (Wardrobe `cream knit / sage linen`) + `art.json` (hallway/bedroom/kitchen) + `script.json` (flow B1→B12 line per scene) behind VeilWick production file. Do not force 6 external skills — `producer: manual` fallback exists. |
| **Board / scene graph** | `director-package.json: clips → shots` with beatRefs, size/angle/lens/camera, blocking, axis, poseContinuity, informationPlan, coverage; tech storyboard maps to H3 segments/cuts with `sourceShotId` + `directorIntent` snapshot + `deviations` + QC gates (no silent axis/pose/info loss) | `storyboard-heat2-4.md` §1–3 per-scene table (camera/POV/lighting/tags/firstFrame→lastFrame/compilation) + `per-scene-loras.md` act map; `prototype-scenes/client.tsx SCENES[0–5]` is the board. No sourceShotId lineage. | **Yes — lineage.** Borrow `sourceShotId` + deviation log + `coverageOf` for VeilWick’s 6 cuts. S3 hair-tuck, S4 lean-in → S5 retreat are exactly the cases `deviation` tracks. |
| **Prompts — write order** | Board text **before** candidate frames, **final H3 prompt after** frame QC; QC rejects bad hands/pose/support/info before Ref2VA; official English 6-section Ref2VA via `h3-prompt-writing`. Prompt vs camera motion separated; tempo via re-timing | OSS MMH3/Wan prompts well-crafted (`oss-prompts-mmh3-wan.md` verified), motion rule correct; but frame QC before prompt freeze is informal | **Yes — enforce.** Keep VeilWick H3 6-section grammar; adopt the strict order: `board/clip prompt → candidate Heat 4 stills (Wan T2I) → QC hands/pose → final H3 Ref2VA prompt`. Delete bad stills, do not prompt-hack. |
| **Stitching / rough cut** | Global `sequence` ordering + `post-kit.mjs` FFmpeg `contain-pad` 1920×1080 concat (preflight/assemble/qc), SHA tracking | Per-scene `image + last_image` H3 stitch (`first_frame/last_frame` per `generate-series-local.ts`), `S(n).last → S(n+1).first`; output stitched via `ffmpeg concat` for 30s — works, but no edit plan | **Yes.** Borrow `edit-plan.json` idea (even portrait): generate `buildEditPlan` over the 6 succeeded jobs → one-command rough-cut assembly + duration/pad verification. Keep H3 first/last-frame stitch; add the plan for 5-episode playlists. |
| **LoRAs / consistency** | No LoRA — H3 reference discipline: `Ref2VA ≤9 images`, `I2VA/FL2VA ≤2 frames`, modes exclusive, total ≤12 files ≤64 MB, prompt ≤7000, audios paired with images | H3 I2V-LoRA `MysticXXX_MMH3-V4` mandatory on every clip (`scale 1.0` → `0.8` stacked) + optional 1–2 Wan act LoRAs max 3 via `getLorasForScene` — stronger than ref-only | **Keep VeilWick’s LoRA stack.** Adopt short-drama’s **mode gate**: Ref2VA (`reference_image`/`reference_audio`) and FL2VA (`first_frame`/`last_frame`) never mixed in one job — VeilWick’s H3 I2V-LoRA uses `image+last_image+loras` (first/last mode) — do not add `reference_image` to same job. |
| **Duration handling** | Quantized `4–15s` integer with audit (`sourceDurationSeconds / durationAdjustmentSeconds / durationPolicy`); forbidden to silently round; master never sped up | Fixed `5s` per scene (`H3_DEFAULT_DURATION=5`); H3 actually returns `5.1667s` (noted as ~31s pack); no decimal chaining | **Yes — audit the padding.** Start recording `sourceDurationSeconds=5, duration=5, adjustment=+0.1667` per clip; sum to 31s and let edit plan trim/pad to 30s. Adopt `nearest` policy for any future 8s/10s cuts. |
| **Voice / audio routing** | 4-route separation (dialogue/ambience/foley/music), Fish Audio discovery→audition→clone→master pipeline, `evaluation-only` vs `commercial`, ≤3 audio refs | Implicit (ambient `non_diegetic_music: N/A`); VeilWick series has no locked character voices | **Borrow routing.** For a talking version of E1, keep Fish-style 4-route doc: dialogue=`h3-native-reference` (with `V-C01-MASTER`-like asset), ambience=`h3-native`, music=`post`. Clothed, soft whisper lines already in Heat 3 map cleanly. |
| **Reality grounding** | `reality-audit.json` + `reality-audit.mjs validate` (authoritative + visual sources, 5 layers) before art for functional spaces; blocks paid gen | Not used — domestic (bedroom/kitchen/hallway) is low-risk | **No for this episode.** Keep for future office/station/hospital locations only. Domestic hallway stills do not need the audit gate. |
| **Context-IR / prompt opt** | Project policy `off/pilot/selective/on` (default `pilot`), per-job `useContextIr` + A/B `experiment.changedVariables` with single-variable discipline | Not wired — VeilWick uses Anubis Mini 8B for T2I/I2V prompt synthesis, not CompShare `use_context_ir` | **Optional experiment harness.** Treat Anubis prompt variant vs Context-IR as A/B under the same `experiment` envelope: one variable per job pair, new jobId + output path. Do not mix prompt-language + ref-set changes in one comparison. |
| **Pay / safety rails** | `costApproved + approve + --confirm-submit <jobId>` triple gate, query-before-resubmit, dry-run + preflight, secrets from env/file only | Wavespeed local-only guard (`--local`, `WAVESPEED_API_KEY` only), but no per-job cost gate | **Yes.** Add per-job `costApproved` (e.g. `$0.25 × 6 = $1.50` pack) + `--confirm-submit` before bulk E1. Keep `--local` guard; add the missing pay gate. |
| **ComfyUI extensibility** | Documented adapter seam — `ComfyUI API` is per-project extension via task contract | VeilWick uses Wavespeed (H3 + Wan Diffusers); no ComfyUI | **Not now.** VeilWick’s next seam is `Wan FLF2V` + `reference-to-video-lora ($0.30)` for S4 Leap POV — add as a VeilWick adapter with same contract shape, not ComfyUI. |
| **Tests** | `scripts/selftest.mjs` 21 tests (deps, staleness, approval, board routes, H3/CompShare/voice/edit/reality) | `bun run typecheck && bun run build`, ad-hoc generation log | **Borrow test shape.** Add one deterministic `validate` test over VeilWick production file (hashes, mode exclusivity, LORA count ≤3, 4–15s, sequence uniqueness) — no mocks of H3 itself. |

### Concrete next steps for VeilWick (do not adopt verbatim)

1. **Add `veilwick-production.json`** beside `MANIFEST.json` (one per series or seasonal pack) seeded with VeilWick presets: `aspectRatio 9:16`, `delivery 720×1280 24fps`, `portrait-subject-priority`, `generationResolution 768p`, `videoProvider wavespeed-h3`, `contextIrPolicy off` (VeilWick uses Anubis, not CompShare). `init` + `register` `outline/cast/art/script/director/storyboard` artifacts pointing at existing `docs/storyboard-heat2-4.md` + `public/storyboard/*.jpg`; `validate/refresh/render` wired to `scripts/production-kit.mjs` (copy or vendor the ~1218-line script to `scripts/vendor/production-kit.mjs`). No 16:9 default.

2. **Stage the 6 E1 jobs off the board** — run `storyboard-bridge build` against a thin `director-package.json` derived from `storyboard-heat2-4.md` §0 spine (or directly `jobs-sync-package` if VeilWick keeps its own `client.tsx` board), so each of the 6×5s jobs carries `sourceShotId = S1–S6`, `sequence 1–6`, `dependsOn: [cast, art, storyboard, frames-pilot]`, `duration 5` + `sourceDurationSeconds 5` audit. Pilot = S3 Temptation (highest exposure: consent + hairstyle + linen) before full pack.

3. **Enforce the prompt→frame→prompt order** for Heat 4: Anubis T2I prompts → 12 `720*1280` stills → QC delete bad hands/pose/support/info (`poseContinuity`, `informationPlan ≥50% insert` for any phone-screen beat) → official H3 Ref2VA prompts. Keep the OSS 6-section + `non_diegetic_music: N/A` discipline already in `oss-prompts-mmh3-wan.md`.

4. **Rough-cut harness** — generate `edit-plan.json` over the 6 succeeded H3 outputs and run `post-kit.mjs preflight/assemble/qc` with VeilWick’s portrait dims (`contain-pad 720×1280`), for the 30s master and for 5-episode playlist packs. Check SHA + expected-vs-actual duration.

5. **Pay gate** — mirror `costApproved + job-approve + --confirm-submit` for any non-dry-run H3 submit; keep existing local-only (`--local`) enforcement. Pack cost: `6 × $0.25 = $1.50` (I2V-LoRA) or `$1.80` (R2V-LoRA) + ~$0.30 T2I stills.

6. **Do not adopt** — `16:9` default, `reality-audit` for domestic bedroom, ComfyUI seam, or CompShare provider unless VeilWick explicitly opts into CompShare (`COMPSHARE_H3_API_KEY`) or office/hospital location shoots.

---

## 5. Repo map (short-drama-production)

```
short-drama-production/
├── SKILL.md                       # control-plane rules (reads root-owned per stage)
├── references/
│   ├── pipeline.md                # 10 stages, order, parallel rules, rework map
│   ├── schema.md                  # production.json contract (artifacts/voiceAssets/jobs/approvals/risks)
│   ├── director-storyboard-handoff.md  # clip/shot mapping, split rules, deviations, 11 QC gates
│   ├── h3-execution.md            # MiniMax official V2 API contract (create/query, preflight→dry-run→approve→submit→wait)
│   ├── compshare-execution.md     # CompShare variant (5000-char limit, useContextIr, A/B discipline)
│   ├── sound-production.md        # H3 4-route + voiceAsset 6–12s dry master
│   ├── fish-voice.md              # Fish Audio adapter (discover/audition/clone/master)
│   ├── landscape-16x9.md          # 16:9 contract, horizontal directing grammar
│   ├── post-and-qc.md             # pilot strategy, 5-class QC, edit plan harness
│   └── reality-grounding.md       # 5-layer audit before art
├── scripts/
│   ├── production-kit.mjs         # init/status/validate/register/approve/refresh/render + job lifecycle
│   ├── storyboard-bridge.mjs      # director → tech storyboard deterministic bridge
│   ├── h3-official.mjs            # MiniMax H3 adapter (preflight/dry-run/submit/wait, DataURL ≤64 MB)
│   ├── compshare-h3.py            # CompShare H3 adapter (prompt≤5000, DataURL, use_context_ir)
│   ├── fish-voice.mjs             # Fish Audio (curl, WAV header fix)
│   ├── post-kit.mjs               # edit plan → FFmpeg rough cut
│   ├── reality-audit.mjs          # reality-audit.json validator
│   └── selftest.mjs               # 21 deterministic tests (fixture temps)
└── agents/openai.yaml             # Codex skill UI
```

`SKILL.md` core rules: `production.json` is status source, stage JSON is content source; `refresh` on upstream hash change; pay actions need per-call user approval; pilot first; 16:9 by default; reality before art; board prompt before frames before H3 prompt; Ref2VA vs FL2VA exclusive; camera vs in-frame motion separated; Context-IR `pilot` default; English 6-section H3 prompt.

---

## 6. Files to read in `/tmp/short-drama-production`

- `README.md` / `SKILL.md` — overview + control-plane rules.
- `references/pipeline.md` — stage order, what may/may not parallelize.
- `references/schema.md` — exact `production.json` contract to adapt (VeilWick: swap 16:9 → 9:16).
- `references/director-storyboard-handoff.md` — deviation log + board→H3 split rules.
- `references/h3-execution.md` + `references/compshare-execution.md` — job lifecycle + preflight limits (≤7000 vs ≤5000 chars).
- `references/landscape-16x9.md` — keep only the invalidation idea, not the 16:9 defaults.
- `references/post-and-qc.md` — pilot choice (high-exposure first) + rough-cut harness.
- `scripts/production-kit.mjs` / `scripts/storyboard-bridge.mjs` / `scripts/h3-official.mjs` / `scripts/compshare-h3.py` / `scripts/post-kit.mjs` — vendor candidates.

---

## 7. Keep local — no explicit

VeilWick Heat 2–3 prompts in this doc are clothed only. Heat 4 placeholders (`paste your heat 4 t2i prompt here 720x1280`) live in `per-scene-loras.md` / `storyboard-heat2-4.md` §4a and `engine-mmh3-reference.md` and must not be copied into committed docs. Generate Heat 4 only into gitignored `docs/storyboard-heat4.local.md` / `~/.secrets/storyboard-heat4.md` via Anubis Mini 8B on a local box (`1024×8192`, `llama-server --port 8080`). No explicit text, stills, or `nsfw` artifacts are committed.

---

*Generated 2026-09-02 from `/tmp/short-drama-production` + VeilWick `docs/tasks.md`, `per-scene-loras.md`, `storyboard-heat2-4.md`, `engine-mmh3-reference.md`, `oss-prompts-mmh3-wan.md`, `wavespeed.ts:FEED_*`.*
