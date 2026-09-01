import { NextResponse } from "next/server";
import { getDB } from "@/db";
import { streamTable, videoTable } from "@/db/schema/veilwick";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export interface LiveStatusResponse {
  isLive: boolean;
  currentVideo: {
    id: string;
    r2Key: string;
    prompt: string;
  } | null;
  viewerCount: number;
  category: string;
}

const MOCK: Record<string, LiveStatusResponse> = {
  yoga: {
    isLive: true,
    currentVideo: { id: "vid_mock_yoga", r2Key: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", prompt: "Evening wind-down flow" },
    viewerCount: 1_248,
    category: "yoga",
  },
  fitness: {
    isLive: true,
    currentVideo: { id: "vid_mock_fit", r2Key: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", prompt: "Lunch-break strength circuits" },
    viewerCount: 2_015,
    category: "fitness",
  },
  activewear: {
    isLive: true,
    currentVideo: { id: "vid_mock_aw", r2Key: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", prompt: "Fabric test — 200 squats" },
    viewerCount: 890,
    category: "activewear",
  },
  breathwork: {
    isLive: true,
    currentVideo: { id: "vid_mock_br", r2Key: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", prompt: "Box breathing session" },
    viewerCount: 642,
    category: "breathwork",
  },
};

/**
 * GET /api/live/[category]
 *
 * Returns livestream status for the given wellness category.
 * Queries D1 (streams + videos tables) if available, otherwise falls
 * back to mock data for the MVP demo.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string }> },
) {
  const { category } = await params;

  try {
    const db = await getDB();

    const stream = await db
      .select()
      .from(streamTable)
      .where(eq(streamTable.category, category))
      .get();

    if (stream) {
      let currentVideo: LiveStatusResponse["currentVideo"] = null;
      if (stream.currentVideoId && stream.isLive) {
        const video = await db
          .select({ id: videoTable.id, r2Key: videoTable.r2Key, prompt: videoTable.prompt })
          .from(videoTable)
          .where(eq(videoTable.id, stream.currentVideoId))
          .get();
        if (video) {
          currentVideo = { id: video.id, r2Key: video.r2Key, prompt: video.prompt };
        }
      }

      return NextResponse.json({
        isLive: stream.isLive,
        currentVideo,
        viewerCount: MOCK[category]?.viewerCount ?? 0,
        category,
      } satisfies LiveStatusResponse);
    }
  } catch {
    // D1 unavailable — fall through to mock
  }

  const mock = MOCK[category];
  if (!mock) {
    return NextResponse.json(
      { error: `Unknown category "${category}". Valid: ${Object.keys(MOCK).join(", ")}` },
      { status: 404 },
    );
  }

  return NextResponse.json(mock);
}