import { getDB } from "@/db";
import { streamTable, videoTable } from "@/db/schema/veilwick";

const mockVideos = [
  {
    category: "wellness",
    prompt: "yoga flow at sunrise",
    r2Key: "videos/wellness/test001.mp4",
    status: "ready" as const,
  },
  {
    category: "wellness",
    prompt: "gym mirror activewear tryon",
    r2Key: "videos/wellness/test002.mp4",
    status: "ready" as const,
  },
  {
    category: "wellness",
    prompt: "breathwork session on a rainy balcony",
    r2Key: "videos/wellness/test003.mp4",
    status: "ready" as const,
  },
  {
    category: "wellness",
    prompt: "pilates reformer slow controlled movements",
    r2Key: "videos/wellness/test004.mp4",
    status: "ready" as const,
  },
  {
    category: "wellness",
    prompt: "cold plunge then sauna contrast therapy",
    r2Key: "videos/wellness/test005.mp4",
    status: "ready" as const,
  },
];

/**
 * Seed D1 with 5 wellness mock videos + 1 live stream if tables are empty.
 * Safe to call on every startup — skips if already seeded.
 */
export async function seedMockVideos(): Promise<void> {
  const db = await getDB();

  const existing = await db.select({ id: videoTable.id }).from(videoTable).limit(1);
  if (existing.length > 0) return;

  // Insert videos & grab first id for stream
  const ids = await db
    .insert(videoTable)
    .values(mockVideos)
    .returning({ id: videoTable.id });

  // One live stream for the yoga video
  await db.insert(streamTable).values({
    category: "wellness",
    isLive: true,
    currentVideoId: ids[0].id,
  });
}