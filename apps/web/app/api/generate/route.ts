import { NextResponse } from "next/server";
import { getDB } from "@/db";
import { videoTable } from "@/db/schema/veilwick";
import { generateWanVideo } from "@/lib/wan";
import { generateH3ImageToVideoLora } from "@/lib/wavespeed";
import { createId } from "@paralleldrive/cuid2";

export const dynamic = "force-dynamic";

interface GenerateBody {
  prompt?: string;
  category?: string;
  loraId?: number;
  // H3 image-to-video-lora fields (prototype realism test)
  image?: string;
  last_image?: string;
  lastImage?: string;
  duration?: number;
  resolution?: string;
  negative_prompt?: string;
  negativePrompt?: string;
  steps?: number;
  cfg?: number;
}

/**
 * POST /api/generate
 *
 * Body: { prompt: string, category: string, loraId?: number }
 * -> calls generateWanVideo -> inserts into videoTable with status ready and r2Key -> returns video.
 *
 * For local MVP the HF call is mocked (wan.ts fallback) so this powers
 * /feed live data immediately without real inference.
 */
export async function POST(request: Request) {
  let body: GenerateBody;
  try {
    body = (await request.json()) as GenerateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const loraId = typeof body.loraId === "number" ? body.loraId : undefined;
  const image = typeof body.image === "string" ? body.image.trim() : "";
  const lastImage = typeof (body.lastImage ?? body.last_image) === "string" ? String(body.lastImage ?? body.last_image).trim() : undefined;
  const duration = typeof body.duration === "number" ? body.duration : 5;
  const resolution = typeof body.resolution === "string" ? body.resolution.trim() : "768p";

  if (!prompt) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }
  if (!category) {
    return NextResponse.json({ error: "category is required" }, { status: 400 });
  }
  if (body.loraId !== undefined && typeof body.loraId !== "number") {
    return NextResponse.json({ error: "loraId must be a number" }, { status: 400 });
  }

  // H3 image-to-video-lora path — prototype realism test (image + prompt + duration 5)
  // Uses wavespeed-ai/minimax-h3/image-to-video-lora with local WAVESPEED_API_KEY.
  // If image is provided and WAVESPEED_API_KEY is set, try H3 first; fall back to Wan mock on failure.
  if (image) {
    // Resolve relative /storyboard/* to absolute URL for Wavespeed API (requires http)
    let resolvedImage = image;
    if (image.startsWith("/")) {
      const host = request.headers.get("host") ?? "localhost:3000";
      const proto = request.headers.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
      resolvedImage = `${proto}://${host}${image}`;
    }
    let resolvedLastImage: string | undefined = lastImage;
    if (lastImage && lastImage.startsWith("/")) {
      const host = request.headers.get("host") ?? "localhost:3000";
      const proto = request.headers.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
      resolvedLastImage = `${proto}://${host}${lastImage}`;
    }
    try {
      const h3 = await generateH3ImageToVideoLora({
        image: resolvedImage,
        lastImage: resolvedLastImage,
        prompt,
        duration,
        resolution,
      });
      // Persist H3 result as video row (best effort)
      try {
        const db = await getDB();
        const id = `vid_${createId()}`;
        const row = { id, prompt, category, r2Key: h3.r2Key ?? h3.videoUrl ?? `videos/${category}/${id}.mp4`, status: "ready" as const };
        try {
          const inserted = await db.insert(videoTable).values(row).returning();
          const video = inserted[0] ?? row;
          return NextResponse.json({ video, h3, wan: { r2Key: row.r2Key, duration: h3.duration } });
        } catch {
          await db.insert(videoTable).values(row);
          return NextResponse.json({ video: row, h3, wan: { r2Key: row.r2Key, duration: h3.duration } });
        }
      } catch {
        const video = { id: `vid_${createId()}`, prompt, category, r2Key: h3.r2Key ?? h3.videoUrl ?? `videos/${category}/${createId()}.mp4`, status: "ready" as const, createdAt: new Date() };
        return NextResponse.json({ video, h3, wan: { r2Key: video.r2Key, duration: h3.duration } });
      }
    } catch (err) {
      console.warn("[generate] H3 failed, falling back to Wan mock:", err);
      // fall through to Wan path
    }
  }

  // Supports nsfw prompts verbatim — generateWanVideo logs loraId for traceability
  const result = await generateWanVideo(prompt, category, loraId);

  try {
    const db = await getDB();
    const id = `vid_${createId()}`;
    const row = {
      id,
      prompt,
      category,
      r2Key: result.r2Key,
      status: "ready" as const,
    };

    // D1 insert — best effort; if returning() is unsupported fall back to synthetic row
    try {
      const inserted = await db.insert(videoTable).values(row).returning();
      const video = inserted[0] ?? row;
      return NextResponse.json({ video, wan: result });
    } catch {
      // Some D1 drivers do not support returning() — insert without it
      await db.insert(videoTable).values(row);
      return NextResponse.json({ video: row, wan: result });
    }
  } catch (err) {
    // D1 unavailable (e.g. preview without binding) — return mock video so /feed fallback still benefits from the generated r2Key
    console.warn("[generate] D1 unavailable, returning mock video:", err);
    const video = {
      id: `vid_${createId()}`,
      prompt,
      category,
      r2Key: result.r2Key,
      status: "ready" as const,
      createdAt: new Date(),
    };
    return NextResponse.json({ video, wan: result });
  }
}
