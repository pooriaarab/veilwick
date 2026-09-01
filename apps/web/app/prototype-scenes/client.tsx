"use client";

import { useState } from "react";

// ---------------------------------------------------------------------------
// Single-episode focus: Your New Stepsister E1 — Unpacking
// 6 scenes = setup → tension → temptation → leap → retreat → afterglow
// Each 5s → 30s episode. All prompts Heat 2–3, clothed, non-explicit,
// sourced from docs/prompts.md §2 (12-beat, 5-phase) + §5b/§5c (H3 720x1280)
// Uses local 720×1280 stills at /storyboard/pick-your-new-stepsister-e1-*
// ---------------------------------------------------------------------------

const NEGATIVE_PROMPT =
  "low quality, blurry, deformed, cartoon, illustration, anime, 3d render, cgi, plastic skin, oversaturated, duplicate, watermark, nude, naked, topless, explicit, genitalia, nsfw act, jpeg artifacts";

// Realism tail appended for Generate-One (H3)
const REALISM_EXPANDED_S1 = `cinematic, synthetic adult woman 18+ clothed in cream knit co-ord and soft linen robe open over loungewear, sunlit hallway with stacked moving boxes and doorway, gentle eye contact across threshold, doorway lean soft smile, warm domestic palette, tactile linen weave, vertical 9:16 720x1280, 5s duration, static camera locked tripod no movement, photorealistic 8k, shallow depth of field f/2.0, 35mm lens, soft natural daylight bright window bounce, teal shadows lifted cinematic_warm LUT, natural skin texture detailed pores, volumetric dust motes, shallow DOF bokeh — gentle intimacy Heat 2, detailed textures, negative: ${NEGATIVE_PROMPT} — steps 28, CFG 6.5, sampler dpmpp_2m, LUT cinematic_warm.cube`;

type Scene = {
  id: string;
  n: number;
  title: string;
  time: string;
  beat: string;
  phase: string;
  heat: string;
  erotic: string;
  angle: string;
  pov: string;
  lighting: string;
  duration: string;
  resolution: string;
  tags: string[];
  firstFrame: string;
  lastFrame: string;
  prompt: string;
};

const EPISODE = {
  id: "your-new-stepsister-e1",
  title: "Your New Stepsister E1 — Unpacking",
  tagline: "Some house rules are meant to be broken.",
  logline:
    "First day in a blended house. Boxes in the hall, a doorway shared, and a look that lingers a second too long. Heat 2–3, fully clothed, wellness/fashion — tension through proximity, not nudity.",
  duration: "30s (6 × 5s)",
  resolution: "720×1280 9:16 vertical",
  poster: "/storyboard/pick-your-new-stepsister-e1-poster.jpg",
  styleId: "stepmom-bold",
};

const SCENES: Scene[] = [
  {
    id: "yns-e1-s1-setup",
    n: 1,
    title: "S1 — Setup",
    time: "0:00–0:05",
    beat: "Beat 1 Adoration / Setup",
    phase: "Porn-script Phase 1 — Exposition (0–8s)",
    heat: "Heat 2 — fade-to-black suggestive, fully clothed",
    erotic:
      "Proximity: distance → shared frame (hallway threshold) • Vulnerability: reveal nerves (new house, boxes) • Power: host / guest — she guides, he follows",
    angle: "waist-height medium shot, eye level",
    pov: "over-shoulder (viewer as new housemate, eye-level)",
    lighting: "bright daylight — clean natural window bounce, soft shadows, high key",
    duration: "5s",
    resolution: "720×1280 9:16",
    tags: ["forbidden-domestic", "eye-contact", "linen loungewear", "clothed", "Heat 2"],
    firstFrame: "/storyboard/pick-your-new-stepsister-e1-first.jpg",
    lastFrame: "/storyboard/pick-your-new-stepsister-e1-first.jpg",
    prompt:
      "cinematic, synthetic adult woman 18+ clothed in cream knit co-ord and soft linen robe open over loungewear, sunlit hallway with stacked moving boxes and doorway, gentle eye contact across threshold, doorway lean soft smile, vertical 9:16 720x1280, 5s duration, static camera locked tripod no movement, photorealistic 8k, shallow depth of field f/2.0 35mm lens, soft natural daylight bright window bounce, tactile linen weave, warm domestic palette, suggestive but clothed wellness Heat 2 — negative: low quality, blurry, deformed, cartoon, illustration, duplicate, watermark, nude, naked, topless, explicit, genitalia — compilation: your-new-stepsister | tags: forbidden-domestic, proximity, clothed, eye-level, soft-natural-daylight | duration: 5s | camera: static | res: 720x1280 9:16",
  },
  {
    id: "yns-e1-s2-tension",
    n: 2,
    title: "S2 — Tension",
    time: "0:05–0:10",
    beat: "Beat 3 No-way / Tension",
    phase: "Porn-script Phase 2 — Tease (8–20s)",
    heat: "Heat 2 — suggestive, clothed",
    erotic:
      "Proximity: shared frame, no touch yet (folded laundry buffer) • Vulnerability: hesitation / folded laundry as shield • Power: pause — doorway hesitation, she holds space",
    angle: "waist-height medium shot, eye level, soft bokeh foreground",
    pov: "handheld breathing, over-shoulder",
    lighting: "soft warm — diffused window + coral domestic tone, teal shadows lifted",
    duration: "5s",
    resolution: "720×1280 9:16",
    tags: ["tension", "folded-laundry", "doorway-hesitation", "clothed", "Heat 2"],
    firstFrame: "/storyboard/pick-your-new-stepsister-e1-first.jpg",
    lastFrame: "/storyboard/pick-your-new-stepsister-e1-last.jpg",
    prompt:
      "cinematic, synthetic adult woman 18+ clothed in ecru knit co-ord holding folded laundry by bedroom doorway, hesitant glance holding folded tee, doorway hesitation soft sheets background, breathy stillness one breath between beats, vertical 9:16 720x1280, 5s duration, slow bob subtle handheld with breathing micro head bob, photorealistic 8k, shallow depth of field f/2.0, soft warm light diffused window golden, over-shoulder POV eye level, clothed wellness Heat 2 — negative: low quality, blurry, deformed, cartoon, illustration, duplicate, watermark, nude, naked, topless, explicit — compilation: your-new-stepsister | tags: tension, vulnerability, folded-laundry, clothed | duration: 5s | camera: slow bob | res: 720x1280 9:16",
  },
  {
    id: "yns-e1-s3-temptation",
    n: 3,
    title: "S3 — Temptation",
    time: "0:10–0:15",
    beat: "Beat 5 Temptation",
    phase: "Porn-script Phase 2→3 — Tease → Escalation",
    heat: "Heat 3 — intentional touch, clothed",
    erotic:
      "Proximity: shared frame → touch-point (shoulder, hair tuck, towel drape — no nudity) • Vulnerability: reciprocal softness (she offers help unpacking) • Power: she leads briefly, then swaps (trust / guidance)",
    angle: "high-angle close-up 35mm, face + shoulders",
    pov: "eye-contact, intimate wellness",
    lighting: "soft warm — diffused window + cinematic_warm LUT (teal shadows, orange highlights, lifted blacks)",
    duration: "5s",
    resolution: "720×1280 9:16",
    tags: ["temptation", "touch-point", "hair-tuck", "clothed", "Heat 3"],
    firstFrame: "/storyboard/pick-your-new-stepsister-e1-last.jpg",
    lastFrame: "/storyboard/pick-your-new-stepsister-e1-last.jpg",
    prompt:
      "cinematic, synthetic adult woman 18+ clothed in sage linen shirt and wide ecru trousers, bedroom with plant and folded linens, soft hand-on-shoulder hair-tuck gesture gentle eye contact, intentional touch without nudity, vertical 9:16 720x1280, 5s duration, slow bob subtle handheld with breathing, photorealistic 8k, shallow depth f/2.0 35mm, soft warm light diffused window golden cinematic_warm LUT teal shadows lifted, tactile fabric weave detail, clothed sensual tension Heat 3 — negative: low quality, blurry, deformed, cartoon, illustration, duplicate, watermark, nude, naked, topless, explicit, genitalia — compilation: your-new-stepsister | tags: temptation, touch-point, trust, clothed | duration: 5s | camera: slow bob | res: 720x1280 9:16",
  },
  {
    id: "yns-e1-s4-leap",
    n: 4,
    title: "S4 — Leap",
    time: "0:15–0:20",
    beat: "Beat 6 Leap — Choose risk",
    phase: "Porn-script Phase 3 — Escalation (20–38s)",
    heat: "Heat 3 — lean-in, breath sync, clothed",
    erotic:
      "Proximity: embrace-threshold (close but clothed, no embrace) • Vulnerability: breath sync, whisper — emotional stake (trust, relief) • Power: mutual — both choose to stay a minute longer",
    angle: "high-angle close-up 35mm, face + shoulders, warm catchlight",
    pov: "true first-person POV eye level, viewer hands soft foreground no HUD, intimate wellness",
    lighting: "soft warm golden-hour glow, dust motes, S-curve lifted blacks, cinematic_warm LUT",
    duration: "5s",
    resolution: "720×1280 9:16",
    tags: ["leap", "lean-in", "breath-sync", "clothed", "Heat 3"],
    firstFrame: "/storyboard/pick-your-new-stepsister-e1-last.jpg",
    lastFrame: "/storyboard/pick-your-new-stepsister-e1-last.jpg",
    prompt:
      "cinematic, synthetic adult woman 18+ clothed in soft cotton shirt and linen trousers, leaning in across kitchen counter hallway, breath sync whisper lean-in eye contact \"stay — just a minute longer\", true first-person POV eye level viewer hands soft foreground no HUD, vertical 9:16 720x1280, 5s duration, static camera locked tripod no movement, photorealistic 8k, shallow depth of field f/2.0 35mm, soft warm light golden glow diffused, tactile fabric weave, clothed Heat 3 — negative: low quality, blurry, deformed, cartoon, illustration, duplicate, watermark, nude, naked, topless, explicit, genitalia — compilation: your-new-stepsister | tags: leap, proximity, breath-sync, clothed | duration: 5s | camera: static | res: 720x1280 9:16",
  },
  {
    id: "yns-e1-s5-retreat",
    n: 5,
    title: "S5 — Retreat",
    time: "0:20–0:25",
    beat: "Beat 7 Retreat — Pull back",
    phase: "Porn-script Phase 4 — Climax proxy (emotional peak, not explicit)",
    heat: "Heat 2–3 — pull back, solo beat",
    erotic:
      "Proximity: step back (distance reintroduced) • Vulnerability: look-away, phone buzz / window light shift • Power: reset — consent check-in beat (Is this okay? We go at your pace.)",
    angle: "waist-height medium shot, eye level",
    pov: "eye-level over-shoulder, window flare",
    lighting: "bright daylight — clean natural light soft shadows, window light shift, high key",
    duration: "5s",
    resolution: "720×1280 9:16",
    tags: ["retreat", "pull-back", "consent-beat", "clothed", "Heat 2–3"],
    firstFrame: "/storyboard/pick-your-new-stepsister-e1-last.jpg",
    lastFrame: "/storyboard/pick-your-new-stepsister-e1-poster.jpg",
    prompt:
      "cinematic, synthetic adult woman 18+ clothed in cream knit loungewear, looking away toward window light shift phone buzz on counter, pull-back solo beat window flare single breath pause, waist-height camera medium shot eye level, vertical 9:16 720x1280, 5s duration, static camera locked tripod no movement, photorealistic 8k, shallow depth soft bokeh, bright daylight clean natural light soft shadows, clothed wellness Heat 2-3 — negative: low quality, blurry, deformed, cartoon, illustration, duplicate, watermark, nude, naked, topless, explicit — compilation: your-new-stepsister | tags: retreat, pull-back, consent-beat, clothed | duration: 5s | camera: static | res: 720x1280 9:16",
  },
  {
    id: "yns-e1-s6-afterglow",
    n: 6,
    title: "S6 — Afterglow",
    time: "0:25–0:30",
    beat: "Beat 8 Fall + 12 HEA — Surrender / Afterglow",
    phase: "Porn-script Phase 5 — Afterglow / Tag (50–60s)",
    heat: "Heat 2 — soft sheets, embrace (clothed), laugh, tagline",
    erotic:
      "Proximity: embrace (clothed, soft sheets) → pull wide • Vulnerability: laugh, relief, reciprocal disclosure • Power: swap complete — grounded warmth (you're still here. Good.)",
    angle: "high-angle close-up 35mm + pull wide, face + shoulders",
    pov: "eye-contact / soft gaze off-camera, serene",
    lighting: "soft warm golden-hour, diffused window, teal shadows lifted cinematic_warm LUT, poster frame at ~52s",
    duration: "5s",
    resolution: "720×1280 9:16",
    tags: ["afterglow", "cuddle-laugh", "tagline", "clothed", "Heat 2"],
    firstFrame: "/storyboard/pick-your-new-stepsister-e1-poster.jpg",
    lastFrame: "/storyboard/pick-your-new-stepsister-e1-poster.jpg",
    prompt:
      "cinematic, synthetic adult woman 18+ clothed in soft knit co-ord, soft sheets bedroom embrace laugh eye contact warm LUT cuddle, golden-hour soft light pull wide soft focus tagline moment \"Some house rules are meant to be broken.\", vertical 9:16 720x1280, 5s duration, slow bob gentle push-in with breathing, photorealistic 8k, shallow depth f/2.0 35mm, soft warm light golden hour boosted golds cinematic_warm.cube, shallow DOF bokeh, poster frame extract at 1.2s, clothed wellness Heat 2 — negative: low quality, blurry, deformed, cartoon, illustration, duplicate, watermark, nude, naked, topless, explicit — compilation: your-new-stepsister | tags: afterglow, embrace, tagline, clothed, golden-hour | duration: 5s | camera: slow bob | res: 720x1280 9:16",
  },
];

export default function PrototypeScenesClient() {
  const [status, setStatus] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleGenerateOne() {
    setBusy(true);
    setStatus(
      "Uploading reference + calling wavespeed-ai/minimax-h3/image-to-video-lora (5s, 720x1280) — S1 Setup realism…",
    );
    setVideoUrl(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: REALISM_EXPANDED_S1,
          negative_prompt: NEGATIVE_PROMPT,
          category: "bedroom-lifestyle",
          image: "/storyboard/pick-your-new-stepsister-e1-first.jpg",
          duration: 5,
          resolution: "768p",
          steps: 28,
          cfg: 6.5,
        }),
      });
      const data = (await res.json()) as Record<string, unknown>;
      if (!res.ok) throw new Error((data as Record<string, unknown>).error as string || `HTTP ${res.status}`);
      const url =
        (data as Record<string, unknown>).h3 &&
        ((data as Record<string, unknown>).h3 as Record<string, unknown>).videoUrl
          ? (((data as Record<string, unknown>).h3 as Record<string, unknown>).videoUrl as string)
          : ((data as Record<string, unknown>).videoUrl as string) ||
            ((data as Record<string, unknown>).wan as Record<string, unknown>)?.r2Key as string ||
            ((data as Record<string, unknown>).video as Record<string, unknown>)?.r2Key as string;
      if (url && typeof url === "string" && url.startsWith("http")) {
        setVideoUrl(url);
        setStatus(`Done — videoUrl: ${url} (also check output/prototype/e1-5s.mp4)`);
      } else if (url) {
        setStatus(`Done — R2 key: ${url} (local mock, no WAVESPEED_API_KEY). Check output/prototype/e1-5s.mp4 for local CLI video.`);
        const probe = await fetch("/prototype/e1-5s.mp4", { method: "HEAD" }).catch(() => null);
        if (probe && probe.ok) setVideoUrl("/prototype/e1-5s.mp4");
      } else {
        setStatus(`Done — ${JSON.stringify(data).slice(0, 300)}`);
      }
    } catch (e) {
      setStatus(`Error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        background: "#0a0a0a",
        color: "#e8e8ea",
        minHeight: "100vh",
        fontFamily: "ui-sans,system-ui,sans-serif",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 20px 60px" }}>
        {/* Single-episode header */}
        <header
          style={{
            border: "1px dashed #2a2a2e",
            borderRadius: 14,
            padding: 18,
            background: "#0f0f10",
          }}
        >
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <span
              style={{
                fontSize: 11,
                padding: "4px 8px",
                borderRadius: 999,
                background: "#27272a",
                border: "1px solid #232326",
              }}
            >
              720×1280 · 9:16 · vertical
            </span>
            <span
              style={{
                fontSize: 11,
                padding: "4px 8px",
                borderRadius: 999,
                background: "#1a1016",
                border: "1px solid #3a2530",
                color: "#f472b6",
              }}
            >
              Single Episode · 1 × 6 scenes
            </span>
            <span
              style={{
                fontSize: 11,
                padding: "4px 8px",
                borderRadius: 999,
                background: "#1f1220",
                border: "1px solid #3a2530",
                color: "#f9a8d4",
              }}
            >
              Heat 2–3 · clothed · non-explicit
            </span>
            <span
              style={{
                fontSize: 11,
                padding: "4px 8px",
                borderRadius: 999,
                background: "#27272a",
                border: "1px solid #232326",
              }}
            >
              {EPISODE.duration} · {EPISODE.resolution}
            </span>
          </div>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 420px", minWidth: 280 }}>
              <h1 style={{ fontSize: 22, margin: "8px 0 6px", lineHeight: 1.2 }}>
                VeilWick — {EPISODE.title}
              </h1>
              <p style={{ color: "#f472b6", fontSize: 12, fontStyle: "italic", margin: "0 0 8px" }}>
                “{EPISODE.tagline}” — tagline on poster
              </p>
              <p style={{ color: "#9a9aa0", fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                {EPISODE.logline}
              </p>
              <p style={{ color: "#9a9aa0", fontSize: 11, lineHeight: 1.5, marginTop: 10 }}>
                Arc: <b style={{ color: "#d8d8de" }}>setup → tension → temptation → leap → retreat → afterglow</b> (12-beat romance + 5-phase
                porn-script, compressed to 6 × 5s). Source: <code>docs/prompts.md §2a/§2b/§2c + §5b/§5c</code>.
                Poster style: <code>stepmom-bold</code> via <code>docs/poster-styles.md</code>. Stitch: H3
                <code>image</code> (first_frame) + <code>last_image</code> (last_frame) seamless — S(n).lastFrame → S(n+1).firstFrame.
              </p>
              <div
                style={{
                  marginTop: 12,
                  padding: 10,
                  borderRadius: 10,
                  background: "#151515",
                  border: "1px solid #2a2a2e",
                  fontSize: 11,
                  lineHeight: 1.6,
                }}
              >
                <b style={{ color: "#fff" }}>Erotic template per scene (non-explicit, clothed wellness/fashion):</b>
                <br />
                <span style={{ color: "#c9c9ce" }}>
                  <b>Proximity</b>: distance → shared frame → touch-point (shoulder/hair tuck) → embrace (clothed) — never jump stages.
                  <br />
                  <b>Vulnerability</b>: reveal nerves → receive softness → reciprocal disclosure → laugh/relief.
                  <br />
                  <b>Power play</b>: host/guest (she guides trust), then swap at Fall — roles flip at beat 8. Heat 2 = fade-to-black
                  suggestive, Heat 3 = intentional touch, no explicit act.
                </span>
              </div>
            </div>
            <div
              style={{
                flex: "0 0 180px",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid #232326",
                background: "#141417",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={EPISODE.poster}
                alt={`${EPISODE.title} poster 720x1280`}
                width={180}
                height={320}
                style={{ width: 180, height: 320, objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "8px 10px", fontSize: 10, color: "#9a9aa0", textAlign: "center" }}>
                Poster 720×1280 · <code>/storyboard/pick-your-new-stepsister-e1-poster.jpg</code>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={handleGenerateOne}
              disabled={busy}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                background: busy ? "#3a2530" : "#f472b6",
                color: "#fff",
                border: "1px solid #ec4899",
                fontWeight: 700,
                cursor: busy ? "not-allowed" : "pointer",
                fontSize: 13,
              }}
            >
              {busy ? "Generating 5s…" : "Generate S1 — H3 5s (realism 720×1280)"}
            </button>
            <a href="/storyboard/pick-your-new-stepsister-e1-first.jpg" style={{ fontSize: 12, color: "#9a9aa0" }}>
              first_frame 720×1280
            </a>
            <a href="/storyboard/pick-your-new-stepsister-e1-last.jpg" style={{ fontSize: 12, color: "#9a9aa0" }}>
              last_frame 720×1280
            </a>
            <a href="/prototype/e1-5s.mp4" style={{ fontSize: 12, color: "#9a9aa0" }}>
              preview mp4
            </a>
          </div>
          {status && (
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                color: "#c8c8cc",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                background: "#0e0e10",
                border: "1px solid #232326",
                borderRadius: 8,
                padding: 8,
              }}
            >
              {status}
            </div>
          )}
          {/* Always-visible local prototype mp4s — S1 5s + full 30s stitched E1 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 12, marginTop: 12 }}>
            <div>
              <video
                src="/prototype/e1-s1-5s.mp4"
                controls
                playsInline
                loop
                muted
                autoPlay
                style={{ width: 360, height: 640, borderRadius: 12, border: "1px solid #232326", background: "#000" }}
              />
              <div style={{ fontSize: 11, color: "#9a9aa0", marginTop: 6 }}>
                Local 5s H3 — 720×1280 5.17s h264 (938K) — /prototype/e1-s1-5s.mp4 · <a href="/prototype/e1-s1-5s.mp4" style={{ color: "#f472b6" }}>download</a> · ffprobe 720×1280 5.17 · $0.25 74s H3 image-to-video-lora + /tmp/MysticXXX
              </div>
            </div>
            <div>
              <video
                src="/prototype/e1-30s.mp4"
                controls
                playsInline
                loop
                muted
                autoPlay
                style={{ width: 360, height: 640, borderRadius: 12, border: "1px solid #ff69b4", background: "#000" }}
              />
              <div style={{ fontSize: 11, color: "#9a9aa0", marginTop: 6 }}>
                Full stitched E1 — 720×1280 31.08s h264 (7.4M) — /prototype/e1-30s.mp4 · <a href="/prototype/e1-30s.mp4" style={{ color: "#f472b6" }}>download</a> · 6×5s S1-S6 image+last_image stitch scaled lanczos · $1.50 583s total · ffprobe 720×1280 duration 31.08
              </div>
            </div>
          </div>

          {videoUrl && videoUrl !== "/prototype/e1-s1-5s.mp4" && (
            <div style={{ marginTop: 12 }}>
              <video
                src={videoUrl}
                controls
                playsInline
                style={{ width: 360, height: 640, borderRadius: 12, border: "1px solid #232326", background: "#000" }}
              />
              <div style={{ fontSize: 11, color: "#9a9aa0", marginTop: 6 }}>
                Generated preview — verify 720×1280 via ffprobe. Source: S1 Setup realism prompt (H3 768p scaled to 720×1280).
              </div>
            </div>
          )}
          <details style={{ marginTop: 12 }}>
            <summary style={{ fontSize: 12, color: "#f472b6", cursor: "pointer" }}>
              Show S1 realism prompt (expanded, Heat 2)
            </summary>
            <pre
              style={{
                marginTop: 8,
                padding: 8,
                background: "#0e0e10",
                border: "1px solid #232326",
                borderRadius: 8,
                fontSize: 11,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {REALISM_EXPANDED_S1}
              {"\n\n"}NEGATIVE: {NEGATIVE_PROMPT}
              {"\n"}steps 28 · CFG 6.5 · sampler dpmpp_2m · 35mm f/2.0 · soft natural daylight + teal fill · LUT cinematic_warm · duration 5 · resolution
              768p (scaled to 720×1280) · prompt source: docs/prompts.md §5b + §5c
            </pre>
          </details>
        </header>

        {/* Episode meta strip */}
        <div
          style={{
            marginTop: 18,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
            fontSize: 11,
            color: "#9a9aa0",
          }}
        >
          <span style={{ padding: "4px 8px", borderRadius: 999, background: "#151515", border: "1px solid #232326" }}>
            Episode: <b style={{ color: "#fff" }}>{EPISODE.id}</b>
          </span>
          <span style={{ padding: "4px 8px", borderRadius: 999, background: "#151515", border: "1px solid #232326" }}>
            {EPISODE.duration} total
          </span>
          <span style={{ padding: "4px 8px", borderRadius: 999, background: "#1f1220", border: "1px solid #3a2530", color: "#f9a8d4" }}>
            6 scenes · each 5s · clothed wellness
          </span>
          <span style={{ color: "#777" }}>
            Continuity: S1.last → S2.first via H3 last_image · Dialogue openers from docs/prompts.md §4
          </span>
        </div>

        <h2 style={{ fontSize: 15, margin: "22px 0 10px", color: "#f472b6" }}>
          {EPISODE.title} — 6 Scenes · storyboard 720×1280 (local stills)
        </h2>
        <p style={{ color: "#9a9aa0", fontSize: 12, marginBottom: 12 }}>
          Each card shows <b>first_frame + last_frame</b> (both 720×1280 at <code>/storyboard/pick-your-new-stepsister-e1-*.jpg</code>), prompt
          (erotic-but-clothed Heat 2–3, clothed, suggestive, sourced from <code>docs/prompts.md §2b/§5b</code>), camera angle / POV / lighting,
          duration 5s, tags, beat + phase, and erotic-template mapping (proximity / vulnerability / power play). Verify:{" "}
          <code>file public/storyboard/pick-your-new-stepsister-e1-*.jpg → 720x1280</code>.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 14 }}>
          {SCENES.map((s) => (
            <div
              key={s.id}
              style={{
                border: "1px solid #232326",
                borderRadius: 14,
                overflow: "hidden",
                background: "#0a0a0b",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Twin frames: first + last */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, background: "#141417" }}>
                {[
                  { label: "first_frame", src: s.firstFrame },
                  { label: "last_frame", src: s.lastFrame },
                ].map((f) => (
                  <div
                    key={f.label}
                    style={{
                      position: "relative",
                      aspectRatio: "9/16",
                      background: "#141417",
                      overflow: "hidden",
                      borderRight: f.label === "first_frame" ? "1px solid #232326" : "none",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={f.src}
                      alt={`${s.id} ${f.label} 720x1280`}
                      loading="lazy"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 1 }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 6,
                        left: 6,
                        fontSize: 9,
                        padding: "2px 6px",
                        borderRadius: 999,
                        background: f.label === "first_frame" ? "#0a0a0a" : "#1a1016",
                        color: f.label === "first_frame" ? "#fff" : "#f9a8d4",
                        border: "1px solid #2a2a2e",
                      }}
                    >
                      {f.label} · 720×1280
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 6,
                        left: 6,
                        right: 6,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <div
                        style={{
                          border: "1.25px dashed #3a3a3e",
                          borderRadius: 8,
                          padding: 6,
                          width: "92%",
                          background: "rgba(10,10,11,.92)",
                          textAlign: "center",
                        }}
                      >
                        <b style={{ fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase", color: "#f472b6" }}>
                          {s.title}
                        </b>
                        <div style={{ fontSize: 10, color: "#9a9aa0", marginTop: 2 }}>{s.time} · 5s</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: "12px 12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                {/* ID + chips */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "3px 7px",
                      borderRadius: 999,
                      background: "#1c1c20",
                      border: "1px solid #2a2a2e",
                      fontWeight: 700,
                      color: "#f472b6",
                    }}
                  >
                    S{s.n} · {s.time} · 5s
                  </span>
                  <span style={{ fontSize: 10, padding: "3px 6px", borderRadius: 999, background: "#1f1220", border: "1px solid #3a2530", color: "#f9a8d4" }}>
                    720×1280
                  </span>
                  <span style={{ fontSize: 10, padding: "3px 6px", borderRadius: 999, background: "#151515", border: "1px solid #232326", color: "#9a9aa0" }}>
                    {s.heat}
                  </span>
                </div>

                {/* Beat + phase */}
                <div
                  style={{
                    fontSize: 11,
                    lineHeight: 1.5,
                    background: "#111113",
                    border: "1px solid #232326",
                    borderRadius: 8,
                    padding: "8px 9px",
                  }}
                >
                  <div>
                    <b style={{ color: "#f9a8d4" }}>{s.beat}</b> · <span style={{ color: "#c9c9ce" }}>{s.phase}</span>
                  </div>
                  <div style={{ color: "#9a9aa0", marginTop: 4 }}>{s.erotic}</div>
                </div>

                {/* Camera block */}
                <div
                  style={{
                    fontSize: 11,
                    lineHeight: 1.5,
                    background: "#0e0e10",
                    border: "1px solid #232326",
                    borderRadius: 8,
                    padding: "8px 9px",
                    color: "#c9c9ce",
                  }}
                >
                  <div>
                    <b style={{ color: "#fff" }}>Camera:</b> {s.angle}
                  </div>
                  <div>
                    <b style={{ color: "#fff" }}>POV:</b> {s.pov}
                  </div>
                  <div>
                    <b style={{ color: "#fff" }}>Lighting:</b> {s.lighting}
                  </div>
                  <div>
                    <b style={{ color: "#fff" }}>Duration:</b> {s.duration} · <b>Resolution:</b> {s.resolution} ·{" "}
                    <b>Model:</b> wavespeed-ai/minimax-h3/image-to-video-lora (768p 5s $0.25)
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 10,
                        padding: "3px 7px",
                        borderRadius: 999,
                        background: "#1a1a1e",
                        border: "1px solid #2a2a2e",
                        color: "#c9c9ce",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                  <span style={{ fontSize: 10, padding: "3px 6px", borderRadius: 999, background: "#1f1220", border: "1px solid #3a2530", color: "#f9a8d4" }}>
                    clothed
                  </span>
                </div>

                {/* Prompt */}
                <code
                  style={{
                    display: "block",
                    padding: 9,
                    background: "#0e0e10",
                    border: "1px solid #232326",
                    borderRadius: 8,
                    color: "#d8d8de",
                    fontSize: 11,
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {s.prompt}
                </code>
                <div style={{ fontSize: 10, color: "#777", lineHeight: 1.4 }}>
                  Source: docs/prompts.md §5b + §5c (H3 720x1280, static vs slow-bob, realism tail) · negative suppresses
                  cartoon/plastic skin · CLI:{" "}
                  <code>wavespeed run wavespeed-ai/minimax-h3/image-to-video-lora --image {s.firstFrame} --prompt &quot;...&quot; --resolution 768p --duration 5</code>{" "}
                  then ffmpeg scale to 720×1280 · wan-2.2 t2i poster: <code>wan-2.2 text-to-image 720*1280</code> via sizing token
                  `720*1280`.
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, border: "1px solid #232326", borderRadius: 14, background: "#111113", padding: 14 }}>
          <b style={{ fontSize: 13 }}>Pipeline — verify locally (no remote, H3 only)</b>
          <pre
            style={{
              marginTop: 8,
              fontSize: 11,
              background: "#0e0e10",
              border: "1px solid #232326",
              borderRadius: 8,
              padding: 10,
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
            }}
          >
            {`# 1. Image dims (must be 720,1280)
file apps/web/public/storyboard/pick-your-new-stepsister-e1-*.jpg  # → 720x1280 JPEG
# 2. Poster dims (wan-2.2 text-to-image 720*1280)
wavespeed run alibaba/wan-2.7/text-to-image --prompt "movie poster style, title typography 'YOUR NEW STEPSISTER' bold condensed sans white on coral, modern domestic, vertical 720x1280" --input size="720*1280" -o poster.jpg
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv poster.jpg  # 720,1280
# 3. Generate one 5s via H3 (local CLI) — S1 Setup prompt
wavespeed run wavespeed-ai/minimax-h3/image-to-video-lora --image apps/web/public/storyboard/pick-your-new-stepsister-e1-first.jpg --prompt "$(cat output/prototype/prompt-s1.txt)" --resolution 768p --duration 5 -o output/prototype/e1-5s-raw.mp4
ffmpeg -i output/prototype/e1-5s-raw.mp4 -vf "scale=720:1280:flags=lanczos" -c:a aac -pix_fmt yuv420p -crf 23 output/prototype/e1-5s.mp4
cp output/prototype/e1-5s.mp4 apps/web/public/prototype/e1-5s.mp4
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of csv output/prototype/e1-5s.mp4  # 720,1280 ~5s
# 4. Build + types
bun run typecheck && bun run build
# 5. Local preview (8788) — single episode only
bun run --filter @veilwick/web build:worker && bunx wrangler dev --local --port 8788 -c apps/web/cloudflare/app-worker/wrangler.jsonc
# curl http://localhost:8788/prototype-scenes → 200, contains "Your New Stepsister E1 — Unpacking" and 6 cards, no 10 random pairs`}
          </pre>
          <div style={{ marginTop: 8, fontSize: 11, color: "#9a9aa0", lineHeight: 1.5 }}>
            Local only: <code>/storyboard/pick-your-new-stepsister-e1-first.jpg + last.jpg + poster.jpg</code> all 720×1280 JPEG at{" "}
            <code>public/storyboard/</code> (no picsum.photos). 6 cards = 1 episode × 6 scenes. Episode poster at{" "}
            <code>/storyboard/pick-your-new-stepsister-e1-poster.jpg</code> (wan-2.2 720*1280). Video preview at{" "}
            <code>/prototype/e1-5s.mp4</code> when generated via H3.
          </div>
        </div>

        <footer style={{ marginTop: 28, color: "#777", fontSize: 11, lineHeight: 1.6 }}>
          Synthetic 18+ wellness — all characters fictional. Generated via docs/prompts.md §2 + §5b + §5c + wavespeed.ts
          generateH3ImageToVideoLora. R2: <code>videos/series/{"{slug}"}/ep{"{num}"}.mp4</code> · Posters:{" "}
          <code>posters/series/{"{seriesId}"}/cover.jpg</code> at 720×1280 via alibaba/wan-2.7/text-to-image <code>720*1280</code>.
        </footer>
      </div>
    </div>
  );
}
