import type { Metadata } from "next";
import Link from "next/link";
import { AgeGate } from "@/components/age-gate";
import { Button } from "@template/ui/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "@template/ui/primitives/card";
import { LiveClient, type LiveStream } from "../live-client";

export const dynamic = "force-dynamic";

const STREAMS: Record<string, LiveStream> = {
  yoga: {
    category: "yoga",
    categoryLabel: "Yoga",
    title: "Evening wind-down flow — 20 min of slow stretching",
    hostName: "Mara Sol",
    hostHandle: "flowstate.mara",
    hostAvatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Mara",
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    posterUrl: "https://picsum.photos/seed/live_yoga/720/1280",
    viewers: 1_248,
    tags: ["#yoga", "#winddown", "#stretch"],
  },
  fitness: {
    category: "fitness",
    categoryLabel: "Fitness",
    title: "Lunch-break strength: 3 circuits, zero equipment",
    hostName: "Kai Mercer",
    hostHandle: "kai.athome",
    hostAvatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Kai",
    videoUrl: "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4",
    posterUrl: "https://picsum.photos/seed/live_fitness/720/1280",
    viewers: 2_015,
    tags: ["#strength", "#homeworkout"],
  },
  activewear: {
    category: "activewear",
    categoryLabel: "Activewear",
    title: "Fabric test: 200 squats in the new hemp-blend set",
    hostName: "Mara Moves",
    hostHandle: "mara.popup",
    hostAvatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=MaraMoves",
    videoUrl: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4",
    posterUrl: "https://picsum.photos/seed/live_activewear/720/1280",
    viewers: 890,
    tags: ["#activewear", "#fabrictest"],
  },
  breathwork: {
    category: "breathwork",
    categoryLabel: "Breathwork",
    title: "Box breathing session — calm your nervous system live",
    hostName: "Sol Kit",
    hostHandle: "solactive.kit",
    hostAvatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Sol",
    videoUrl: "https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4",
    posterUrl: "https://picsum.photos/seed/live_breathwork/720/1280",
    viewers: 642,
    tags: ["#breathwork", "#calm"],
  },
  nsfw: {
    category: "nsfw",
    categoryLabel: "NSFW",
    title: "After dark wellness — whispered touch + breathwork. 18+ synthetic.",
    hostName: "Veil After Dark",
    hostHandle: "veil.afterdark",
    hostAvatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=VeilAfter",
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_2MB.mp4",
    posterUrl: "https://picsum.photos/seed/live_nsfw/720/1280",
    viewers: 3_412,
    tags: ["#nsfw", "#wellness", "#afterdark"],
  },
  blowjob: {
    category: "blowjob",
    categoryLabel: "Blowjob",
    title: "Slow tease workshop — breath control + soft focus. 18+ synthetic.",
    hostName: "Luna Bliss",
    hostHandle: "luna.bliss",
    hostAvatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Luna",
    videoUrl: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4",
    posterUrl: "https://picsum.photos/seed/live_blowjob/720/1280",
    viewers: 4_102,
    tags: ["#blowjob", "#nsfw", "#wellness"],
  },
  cowgirl: {
    category: "cowgirl",
    categoryLabel: "Cowgirl",
    title: "Cowgirl rhythm live — hip flow + confidence. 18+ synthetic.",
    hostName: "Nadi Tease",
    hostHandle: "nadi.tease",
    hostAvatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=NadiTease",
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    posterUrl: "https://picsum.photos/seed/live_cowgirl/720/1280",
    viewers: 2_987,
    tags: ["#cowgirl", "#nsfw", "#fitness"],
  },
  missionary: {
    category: "missionary",
    categoryLabel: "Missionary",
    title: "Missionary intimacy — slow, connected, eye-contact flow. 18+ synthetic.",
    hostName: "Aisha Ren",
    hostHandle: "aisha.rise",
    hostAvatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Aisha",
    videoUrl: "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4",
    posterUrl: "https://picsum.photos/seed/live_missionary/720/1280",
    viewers: 2_654,
    tags: ["#missionary", "#nsfw", "#intimacy"],
  },
  titfuck: {
    category: "titfuck",
    categoryLabel: "Titfuck",
    title: "Sensual chest flow — playful wellness touch. 18+ synthetic.",
    hostName: "Muse Tease",
    hostHandle: "muse.tease",
    hostAvatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=MuseTease",
    videoUrl: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4",
    posterUrl: "https://picsum.photos/seed/live_titfuck/720/1280",
    viewers: 3_201,
    tags: ["#titfuck", "#nsfw", "#sensual"],
  },
  feed: {
    category: "feed",
    categoryLabel: "Feed",
    title: "VeilWick Feed Live — mixed NSFW wellness preview. 18+ synthetic.",
    hostName: "VeilWick Live",
    hostHandle: "veilwick.live",
    hostAvatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=VeilWickLive",
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_2MB.mp4",
    posterUrl: "https://picsum.photos/seed/live_feed/720/1280",
    viewers: 5_120,
    tags: ["#feed", "#nsfw", "#live"],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const stream = STREAMS[category];
  return {
    title: stream ? `${stream.categoryLabel} Live — VeilWick` : "Live — VeilWick",
    description: stream
      ? `${stream.title} — Synthetic fictional adult content. 18+ only.`
      : "Livestream not found.",
    robots: { index: false, follow: false },
  };
}

function UnknownCategory({ category }: { category: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-zinc-950 px-6 text-white">
      <Card className="w-full max-w-md border-white/10 bg-zinc-900 text-center">
        <CardHeader>
          <CardTitle className="text-xl">Unknown live category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-white/60">
            &quot;{category}&quot; isn&apos;t a live room here (wellness only). Pick one of these
            demo rooms instead:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.values(STREAMS).map((stream) => (
              <Button key={stream.category} asChild variant="outline" size="sm">
                <Link href={`/live/${stream.category}`}>{stream.categoryLabel}</Link>
              </Button>
            ))}
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/feed">Back to feed</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function LivePage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const stream = STREAMS[category];

  if (!stream) {
    return (
      <>
        <AgeGate />
        <UnknownCategory category={category} />
      </>
    );
  }

  return (
    <>
      <AgeGate description="Live rooms on VeilWick are adults-only (18+). Synthetic fictional adult content — no real persons are depicted." />
      <LiveClient stream={stream} />
    </>
  );
}