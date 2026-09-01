import type { Metadata } from "next";
import { AgeGate } from "@/components/age-gate";
import { LiveClient, type LiveStream } from "../live-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Feed Live — VeilWick",
  description: "VeilWick Feed Live — mixed NSFW wellness preview. Synthetic fictional adult content. 18+ only.",
  robots: { index: false, follow: false },
};

const FEED_STREAM: LiveStream = {
  category: "feed",
  categoryLabel: "Feed",
  title: "VeilWick Feed Live — mixed NSFW wellness preview. 18+ synthetic.",
  hostName: "VeilWick Live",
  hostHandle: "veilwick.live",
  hostAvatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=VeilWickLive",
  videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_2MB.mp4",
  posterUrl: "https://picsum.photos/seed/live_feed/720/1280",
  viewers: 5120,
  tags: ["#feed", "#nsfw", "#live"],
};

export default function LiveFeedPage() {
  return (
    <>
      <AgeGate description="Live rooms on VeilWick are adults-only (18+). Synthetic fictional adult content — no real persons are depicted." />
      <LiveClient stream={FEED_STREAM} />
    </>
  );
}
