"use client";

/**
 * VeilWick feed — TikTok vertical 9:16 768p snap-scroll.
 * Fullscreen vertical 9:16 768p (432x768 / 720x1280 / 768x1360), CSS scroll-snap-type y mandatory, 100vh per clip.
 * Autoplay muted loop 5s H3 clips from wavespeed-ai/minimax-h3/image-to-video-lora ($0.25 / 5s, 768p 9:16)
 *   with poster fallback, captions toggle, like/share overlay minimal TikTok style,
 *   infinite scroll with IntersectionObserver sentinel, categories pills top (8 FEED_CATEGORIES).
 * Videos load from local R2 via /api/feed (D1 videoTable, status=ready, r2Key -> videoUrl), posterUrl local.
 * Responsive portrait centered shell (360-420px), no extra pages.
 * All prompts non-explicit clothed only — FEED_PROMPTS / FEED_TAGS from @/lib/wavespeed (docs/prompts.md §5 / §5b).
 *
 * Auto-generate on scroll (H3 local only):
 *   - Buffer < 2 OR sentinel intersection near end => silent POST /api/feed/prefetch { buffer, activeIndex, category }
 *     OR GET /api/feed?personalized=true?offset=... enqueues h3.generate (image+last_image+loras) via OUTBOX_QUEUE.
 *   - Wavespeed model: wavespeed-ai/minimax-h3/image-to-video-lora with image+last_image+loras, duration 5, 768p 9:16.
 *   - No --remote, no Vast — D1/R2 miniflare --local only (wrangler d1 ... --local, R2 UPLOADS preview_bucket).
 *   - Loading indicator + silent generation: spinner at sentinel, fetch failures swallowed, fallback 8 videos cold start.
 *
 * Realism gate — /prototype-scenes (public/prototype-scenes/index.html):
 *   - Single-video realism proof before feed scales. Generate ONE 5s H3 clip first via Wavespeed H3,
 *     validate photorealism/lighting/720x1280, then storyboard prompts (docs/prompts.md §5) expand feed to
 *     continuous personalized scroll. Feed never fabricates explicit prompts — clothed fashion/wellness only.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useFeedInstrumentation } from "@/hooks/useFeedInstrumentation";
import { FEED_CATEGORIES } from "@/lib/wavespeed";
import {
  Bookmark,
  Crown,
  Heart,
  ListVideo,
  Lock,
  MessageCircle,
  MoreHorizontal,
  Music2,
  Play,
  Search,
  Share2,
  Volume2,
  VolumeX,
  X,
  Captions,
  CaptionsOff,
} from "lucide-react";
import { Button } from "@template/ui/primitives/button";
import type { FeedVideo } from "@/types/feed";
import { SERIES_DATA, type Series } from "@/components/series/data";
import { SeriesModal } from "@/components/series/SeriesModal";

// Cold-start fallback: 8 videos (H3 5s placeholders). Kept non-explicit 8 FEED_CATEGORIES, clothed wellness only.
// Used when D1/R2 local miniflare has no ready rows yet (--local only, no --remote, no Vast).
const FALLBACK_VIDEOS: FeedVideo[] = [
  { id: "fb1", category: "market-stall-fashion", creator: { handle: "flowstate.mara", displayName: "Mara Sol", avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Mara" }, caption: "Market stall fashion — linen resort wear, soft daylight, slow handheld breathing. Synthetic 18+ fashion wellness.", hashtags: ["#market-stall-fashion", "#wellness", "#synthetic"], music: "original audio — h3 fashion wellness", videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4", posterUrl: "https://picsum.photos/seed/fb1/720/1280", likes: 128400, comments: 1842, shares: 9600 },
  { id: "fb2", category: "beach-lifestyle", creator: { handle: "luna.bliss", displayName: "Luna Bliss", avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Luna" }, caption: "Beach lifestyle — breezy linen, golden-hour soft light, gentle dolly push-in. 18+ synthetic wellness.", hashtags: ["#beach-lifestyle", "#wellness", "#synthetic"], music: "original audio — h3 fashion wellness", videoUrl: "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4", posterUrl: "https://picsum.photos/seed/fb2/720/1280", likes: 214900, comments: 3733, shares: 15218 },
  { id: "fb3", category: "activewear", creator: { handle: "kai.athome", displayName: "Kai Mercer", avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Kai" }, caption: "Activewear studio — mid-shot eye-level, handheld subtle, teal fill wellness. 18+ synthetic.", hashtags: ["#activewear", "#fitness", "#synthetic"], music: "original audio — h3 fashion wellness", videoUrl: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4", posterUrl: "https://picsum.photos/seed/fb3/720/1280", likes: 201800, comments: 3105, shares: 41300 },
  { id: "fb4", category: "breathwork", creator: { handle: "solactive.kit", displayName: "Sol Kit", avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Sol" }, caption: "Box breathing for the 3pm reset. In 4, hold 4, out 4, rest 4. 18+ synthetic wellness.", hashtags: ["#breathwork", "#calm", "#wellness"], music: "original audio — h3 fashion wellness", videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4", posterUrl: "https://picsum.photos/seed/fb4/720/1280", likes: 44200, comments: 512, shares: 22900 },
  { id: "fb5", category: "studio", creator: { handle: "muse.studio", displayName: "Muse Studio", avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=MuseStudio" }, caption: "Studio fashion — soft key light, centred tripod, eye contact portrait. 18+ synthetic wellness.", hashtags: ["#studio", "#fashion", "#synthetic"], music: "original audio — h3 fashion wellness", videoUrl: "https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4", posterUrl: "https://picsum.photos/seed/fb5/720/1280", likes: 98400, comments: 1820, shares: 12100 },
  { id: "fb6", category: "wellness", creator: { handle: "aisha.rise", displayName: "Aisha Ren", avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Aisha" }, caption: "Wellness mindfulness — soft daylight, steady cam, calm palette. 18+ synthetic.", hashtags: ["#wellness", "#mindfulness", "#synthetic"], music: "original audio — h3 fashion wellness", videoUrl: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4", posterUrl: "https://picsum.photos/seed/fb6/720/1280", likes: 167300, comments: 2901, shares: 18700 },
  { id: "fb7", category: "fitness", creator: { handle: "kai.athome", displayName: "Kai Mercer", avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Kai2" }, caption: "Core burn — no equipment, just wellness. Synthetic 18+, activewear.", hashtags: ["#fitness", "#homeworkout", "#wellness"], music: "original audio — h3 fashion wellness", videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_2MB.mp4", posterUrl: "https://picsum.photos/seed/fb7/720/1280", likes: 112800, comments: 2105, shares: 22300 },
  { id: "fb8", category: "bedroom-lifestyle", creator: { handle: "veil.studio", displayName: "Veil Studio", avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=VeilStudio" }, caption: "Bedroom lifestyle — cozy morning light, linen loungewear, handheld micro-shake 35mm. 18+ synthetic clothed.", hashtags: ["#bedroom-lifestyle", "#wellness", "#lifestyle"], music: "original audio — h3 fashion wellness", videoUrl: "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4", posterUrl: "https://picsum.photos/seed/fb8/720/1280", likes: 189400, comments: 3210, shares: 27800 },
];

// 8 FEED_CATEGORIES pills — exact 8 from wavespeed.ts (non-explicit clothed fashion/wellness)
const CATEGORY_PILLS: string[] = ["For You", ...FEED_CATEGORIES];

function resolveVideoSrc(videoUrl: string): string {
  if (!videoUrl) return videoUrl;
  if (videoUrl.startsWith("http://") || videoUrl.startsWith("https://") || videoUrl.startsWith("blob:")) return videoUrl;
  // local R2 key like videos/{category}/{userId}/{id}.mp4 -> resolve via CDN base (local R2 public)
  if (videoUrl.startsWith("videos/") || videoUrl.startsWith("posters/")) {
    const base = typeof window !== "undefined" && (window as unknown as { __R2_BASE?: string }).__R2_BASE ? (window as unknown as { __R2_BASE: string }).__R2_BASE : "https://cdn.veilwick.com";
    return `${base.replace(/\/$/, "")}/${videoUrl.replace(/^\//, "")}`;
  }
  return videoUrl;
}

function getSeriesForHandle(handle: string): Series | null {
  const privateLessonsFromData = SERIES_DATA.find((s) => s.title === "Private Lessons" || s.id === "ser_private_lessons") ?? null;
  const map: Record<string, Series | null> = {
    "luna.bliss": privateLessonsFromData ?? {
      id: "ser_private_lessons",
      title: "Private Lessons",
      category: "Teacher",
      posterUrl: "https://picsum.photos/seed/private_lessons/720/1280",
      videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
      description: "Intimate one-on-one lessons — 60s vertical episodes, 720x1280. E1-2 free, E3-5 premium.",
      episodes: [
        { id: "ep_private_lessons_1", number: 1, title: "First Lesson", duration: "1:00", locked: false, isNew: false, thumbnailUrl: "https://picsum.photos/seed/private_lessons_e1/320/180", videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4" },
        { id: "ep_private_lessons_2", number: 2, title: "After Class", duration: "1:00", locked: false, isNew: false, thumbnailUrl: "https://picsum.photos/seed/private_lessons_e2/320/180", videoUrl: "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4" },
        { id: "ep_private_lessons_3", number: 3, title: "Private Tutoring", duration: "1:00", locked: true, isNew: true, thumbnailUrl: "https://picsum.photos/seed/private_lessons_e3/320/180", videoUrl: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4" },
        { id: "ep_private_lessons_4", number: 4, title: "Study Hall", duration: "1:00", locked: true, isNew: true, thumbnailUrl: "https://picsum.photos/seed/private_lessons_e4/320/180", videoUrl: "https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4" },
        { id: "ep_private_lessons_5", number: 5, title: "Final Exam", duration: "1:00", locked: true, isNew: true, thumbnailUrl: "https://picsum.photos/seed/private_lessons_e5/320/180", videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4" },
      ],
    },
    "flowstate.mara": SERIES_DATA.find((s) => s.id === "s1") ?? null,
    "kai.athome": SERIES_DATA.find((s) => s.id === "s3") ?? null,
    "nadi.flows": SERIES_DATA.find((s) => s.id === "s10") ?? null,
  };
  return map[handle] ?? null;
}

function seriesEpisodesToFeedVideos(series: Series): FeedVideo[] {
  const creatorHandle = series.id === "ser_private_lessons" ? "luna.bliss" : series.id === "s1" ? "flowstate.mara" : series.id === "s3" ? "kai.athome" : "nadi.flows";
  const creatorMap: Record<string, { handle: string; displayName: string; avatarUrl: string }> = {
    "luna.bliss": { handle: "luna.bliss", displayName: "Luna Bliss", avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Luna" },
    "flowstate.mara": { handle: "flowstate.mara", displayName: "Mara Sol", avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Mara" },
    "kai.athome": { handle: "kai.athome", displayName: "Kai Mercer", avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Kai" },
    "nadi.flows": { handle: "nadi.flows", displayName: "Nadi Tease", avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=NadiTease" },
  };
  const creator = creatorMap[creatorHandle] ?? { handle: creatorHandle, displayName: creatorHandle, avatarUrl: `https://api.dicebear.com/9.x/adventurer/svg?seed=${creatorHandle}` };
  return series.episodes.map((ep) => ({
    id: ep.id,
    category: series.category.toLowerCase() as FeedVideo["category"],
    creator,
    caption: `${series.title} — Episode ${ep.number}: ${ep.title}. ${series.description} Synthetic 18+.`,
    hashtags: [`#${series.category.toLowerCase()}`, "#playlist", "#synthetic"],
    music: "original audio — synthetic lo-fi",
    videoUrl: ep.videoUrl || series.videoUrl,
    posterUrl: ep.thumbnailUrl ?? series.posterUrl,
    likes: 80000 + ep.number * 12000,
    comments: 900 + ep.number * 300,
    shares: 4000 + ep.number * 800,
    seriesId: series.id,
    seriesTitle: series.title,
    episodeNumber: ep.number,
    locked: ep.locked,
    isNew: ep.isNew,
  }));
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

interface SlideProps {
  video: FeedVideo;
  active: boolean;
  muted: boolean;
  showCaptions: boolean;
  playlistSeries?: Series | null;
  onPlaylistClick?: (s: Series) => void;
  onLockedClick?: (s: Series) => void;
  onLike?: (video: FeedVideo) => void;
  onBookmark?: (video: FeedVideo) => void;
  onShare?: (video: FeedVideo) => void;
  onPlayingChange?: (playing: boolean) => void;
}

function Slide({ video, active, muted, showCaptions, playlistSeries, onPlaylistClick, onLockedClick, onLike, onBookmark, onShare, onPlayingChange }: SlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [liked, setLiked] = useState(false);
  const [posterError, setPosterError] = useState(false);
  const isLocked = !!video.locked;
  const resolvedSrc = useMemo(() => resolveVideoSrc(video.videoUrl), [video.videoUrl]);
  const hasPoster = !!video.posterUrl && !posterError;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = muted;
    if (isLocked) {
      el.pause();
      onPlayingChange?.(false);
      return;
    }
    if (active && playing) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
    onPlayingChange?.(playing && active && !isLocked);
  }, [active, playing, muted, onPlayingChange, isLocked]);

  useEffect(() => {
    if (active) onPlayingChange?.(playing && !isLocked);
  }, [playing, active, onPlayingChange, isLocked]);

  const togglePlay = () => {
    if (isLocked && playlistSeries) {
      onLockedClick?.(playlistSeries);
      return;
    }
    setPlaying((p) => !p);
  };

  return (
    <section
      data-slide
      data-category={video.category}
      style={{ scrollSnapAlign: "start", height: "100vh" } as React.CSSProperties}
      className="relative h-[100vh] h-[100dvh] w-full shrink-0 snap-start snap-always overflow-hidden bg-black"
    >
      {/* poster fallback layer — local posterUrl or gradient */}
      {!hasPoster ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">{video.category}</p>
            <p className="mt-1 text-sm font-bold text-white/70">768p 9:16 — H3 5s</p>
          </div>
        </div>
      ) : null}
      {hasPoster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={video.posterUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setPosterError(true)}
        />
      )}

      <video
        ref={videoRef}
        src={resolvedSrc}
        poster={hasPoster ? video.posterUrl : undefined}
        muted={muted}
        loop={!isLocked}
        playsInline
        autoPlay={!isLocked}
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ aspectRatio: "9 / 16" }}
        onClick={togglePlay}
        onError={() => setPosterError(false)}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 p-6 text-center backdrop-blur-[1px]">
          <div className="rounded-2xl border border-white/10 bg-black/70 px-5 py-4 backdrop-blur-md">
            <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
              <Lock className="size-5" />
            </div>
            <p className="text-sm font-bold text-white">
              Episode {video.episodeNumber ?? 3} <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-fuchsia-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">New <Lock className="size-3" /></span>
            </p>
            <p className="mt-1 text-xs font-medium text-white/80">Locked — Upgrade to Premium to unlock</p>
            <Button
              size="sm"
              className="mt-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 text-xs font-bold text-white hover:from-violet-500 hover:to-fuchsia-500"
              onClick={() => playlistSeries && onLockedClick?.(playlistSeries)}
            >
              <Crown className="size-3.5" />
              Upgrade to Premium
            </Button>
          </div>
        </div>
      )}

      {!playing && !isLocked && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-black/50 p-5 backdrop-blur-sm">
            <Play className="size-10 fill-white text-white" />
          </span>
        </div>
      )}

      <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
        {video.seriesTitle ? `${video.seriesTitle} · Ep ${video.episodeNumber}` : video.category}
        {isLocked ? " · 🔒" : ""} · 768p 5s
      </span>

      {/* right action rail — minimal TikTok style */}
      <div className="absolute bottom-24 right-2 flex flex-col items-center gap-4 sm:right-3">
        <Link href={`/live/${video.category}`} aria-label="Open live">
          <div className="flex flex-col items-center gap-1">
            <span className="block size-12 overflow-hidden rounded-full border-2 border-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={video.creator.avatarUrl} alt={video.creator.displayName} className="h-full w-full object-cover" />
            </span>
            <span className="flex size-5 items-center justify-center rounded-full bg-rose-500 text-white -mt-2 border-2 border-black">
              <span className="block size-2 rounded-full bg-white" />
            </span>
          </div>
        </Link>

        <button
          type="button"
          className="flex flex-col items-center gap-1 text-white drop-shadow-lg"
          onClick={() => {
            const next = !liked;
            setLiked(next);
            if (next) onLike?.(video);
          }}
          aria-label="Like"
        >
          <Heart className={`size-8 transition-colors sm:size-9 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
          <span className="text-xs font-semibold">{formatCount(video.likes + (liked ? 1 : 0))}</span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1 text-white drop-shadow-lg" aria-label="Comments">
          <MessageCircle className="size-8 sm:size-9" />
          <span className="text-xs font-semibold">{formatCount(video.comments)}</span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1 text-white drop-shadow-lg" onClick={() => onBookmark?.(video)} aria-label="Save">
          <Bookmark className="size-8 sm:size-9" />
          <span className="text-xs font-semibold">Save</span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1 text-white drop-shadow-lg" onClick={() => onShare?.(video)} aria-label="Share">
          <Share2 className="size-8 sm:size-9" />
          <span className="text-xs font-semibold">{formatCount(video.shares)}</span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1 text-white drop-shadow-lg" aria-label="More">
          <MoreHorizontal className="size-8 sm:size-9" />
        </button>
      </div>

      {/* bottom-left caption — toggleable */}
      {showCaptions && (
        <div className="absolute bottom-6 left-3 right-20 space-y-2 sm:left-4 sm:right-20">
          <Link href={`/live/${video.category}`} className="block w-fit text-[15px] font-bold text-white drop-shadow-lg">
            @{video.creator.handle}
          </Link>

          {playlistSeries && onPlaylistClick && !video.seriesId && (
            <button
              type="button"
              onClick={() => onPlaylistClick(playlistSeries)}
              className="flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm ring-1 ring-white/15 hover:bg-white/20"
              aria-label={`Open playlist ${playlistSeries.title}`}
            >
              <ListVideo className="size-4" />
              Playlist: {playlistSeries.title} ({playlistSeries.episodes.length})
            </button>
          )}

          {video.seriesId && (
            <p className="flex items-center gap-2 text-xs font-semibold text-white/90">
              <ListVideo className="size-3.5" />
              Playlist: {video.seriesTitle} ({video.seriesId ? 5 : 0}) · Episode {video.episodeNumber}
              {isLocked && <span className="inline-flex items-center gap-1 rounded-full bg-fuchsia-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">New <Lock className="size-3" /></span>}
            </p>
          )}

          <div className="space-y-1">
            <p className="line-clamp-2 text-sm leading-snug text-white/95 drop-shadow">{video.caption}</p>
            <p className="text-sm font-semibold text-white/90">{video.hashtags.join(" ")}</p>
          </div>
          <p className="flex items-center gap-2 text-xs text-white/85 drop-shadow">
            <Music2 className="size-3.5" />
            {video.music}
          </p>
        </div>
      )}
    </section>
  );
}

export function FeedClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<FeedVideo[]>(FALLBACK_VIDEOS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("For You");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const prefetchFired = useRef(0);

  const [activePlaylist, setActivePlaylist] = useState<Series | null>(null);
  const [paywallSeries, setPaywallSeries] = useState<Series | null>(null);

  const playlistVideos = useMemo(() => (activePlaylist ? seriesEpisodesToFeedVideos(activePlaylist) : null), [activePlaylist]);

  const baseVideos = playlistVideos ?? videos;
  const displayVideos = useMemo(() => {
    if (activePlaylist) return baseVideos;
    if (selectedCategory === "For You") return baseVideos;
    const filtered = baseVideos.filter((v) => v.category === selectedCategory);
    return filtered.length > 0 ? filtered : baseVideos;
  }, [baseVideos, selectedCategory, activePlaylist]);

  const { trackAction, setPlaying } = useFeedInstrumentation(containerRef, displayVideos, activeIndex);

  useEffect(() => {
    setActiveIndex(0);
    containerRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [activePlaylist, selectedCategory]);

  // Load local R2 feed — /api/feed?personalized=true (D1 videoTable ready, r2Key -> videoUrl, local posterUrl)
  useEffect(() => {
    let cancelled = false;
    fetch("/api/feed?personalized=true")
      .then((res) => {
        if (!res.ok) throw new Error(`feed request failed: ${res.status}`);
        return res.json() as Promise<{ videos: FeedVideo[] }>;
      })
      .then((data) => {
        if (!cancelled && Array.isArray(data.videos) && data.videos.length > 0) {
          // Ensure videoUrl and posterUrl are local R2 resolved; keep fallback if r2Key missing
          const mapped = data.videos.map((v) => ({
            ...v,
            videoUrl: resolveVideoSrc(v.videoUrl),
            posterUrl: v.posterUrl ?? undefined,
          }));
          setVideos(mapped);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Prefetch next 2 slides and trigger H3 queue if buffer low — auto-generate on scroll
  // Silent generation: POST /api/feed/prefetch enqueues wavespeed-ai/minimax-h3/image-to-video-lora (image+last_image+loras)
  // H3 5s 768p 9:16, local D1/R2 miniflare --local only, no --remote, no Vast. Failures swallowed.
  useEffect(() => {
    const next = displayVideos.slice(activeIndex + 1, activeIndex + 3);
    for (const v of next) {
      const href = resolveVideoSrc(v.videoUrl);
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "video";
      link.href = href;
      document.head.appendChild(link);
      const preload = document.createElement("link");
      preload.rel = "preload";
      preload.as = "video";
      preload.href = href;
      document.head.appendChild(preload);
    }
    const buffer = displayVideos.length - activeIndex - 1;
    if (!activePlaylist && buffer < 2 && Date.now() - prefetchFired.current > 3000) {
      prefetchFired.current = Date.now();
      setIsPrefetching(true);
      fetch("/api/feed/prefetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activeIndex, buffer, category: displayVideos[activeIndex]?.category }),
      })
        .catch(() => {})
        .finally(() => setIsPrefetching(false));
    }
  }, [activeIndex, displayVideos, activePlaylist]);

  // Active slide tracking — IntersectionObserver threshold 0.6, autoplay only active
  const trackActive = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const slides = Array.from(container.querySelectorAll<HTMLElement>("[data-slide]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const index = slides.indexOf(entry.target as HTMLElement);
            if (index >= 0) setActiveIndex(index);
          }
        }
      },
      { root: container, threshold: [0.6] }
    );
    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [displayVideos]);

  useEffect(() => trackActive(), [trackActive]);

  // Infinite scroll — sentinel at bottom triggers loadMore via IntersectionObserver
  // Auto-generate: when sentinel intersects (near end, rootMargin 200px) we silently
  // request more H3 via /api/feed?personalized=true&offset=... OR fallback to tail rotate.
  // Also fires prefetch if buffer <2 so h3.generate (image+last_image+loras) queues without manual generate.
  const loadMore = useCallback(async () => {
    if (isLoadingMore || activePlaylist) return;
    setIsLoadingMore(true);
    try {
      // Silent prefetch fallback when buffer <2 — ensures H3 queue even if D1 empty (local miniflare --local)
      const buffer = displayVideos.length - activeIndex - 1;
      if (buffer < 2 && Date.now() - prefetchFired.current > 2000) {
        prefetchFired.current = Date.now();
        setIsPrefetching(true);
        fetch("/api/feed/prefetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ activeIndex, buffer, category: displayVideos[activeIndex]?.category }),
        })
          .catch(() => {})
          .finally(() => setIsPrefetching(false));
      }
      // Try local feed pagination (D1 videoTable, status=ready, local R2 r2Key -> videoUrl)
      // Supports /api/feed?personalized=true&offset=&limit= (local D1 --local only)
      const res = await fetch(`/api/feed?personalized=true&offset=${videos.length}&limit=10`);
      if (res.ok) {
        const data = (await res.json()) as { videos?: FeedVideo[] };
        if (Array.isArray(data.videos) && data.videos.length > 0) {
          const mapped = data.videos.map((v) => ({ ...v, videoUrl: resolveVideoSrc(v.videoUrl) }));
          setVideos((prev) => [...prev, ...mapped]);
          return;
        }
      }
      // Fallback infinite: rotate existing tail so scroll never ends (cold start 8 videos)
      setVideos((prev) => {
        const tail = prev.slice(-5).map((v, i) => ({ ...v, id: `${v.id}-more-${Date.now()}-${i}` }));
        return [...prev, ...tail];
      });
    } catch {
      setVideos((prev) => {
        const tail = prev.slice(-3).map((v, i) => ({ ...v, id: `${v.id}-more-${Date.now()}-${i}` }));
        return [...prev, ...tail];
      });
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, activePlaylist, videos.length, displayVideos.length, activeIndex]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = containerRef.current;
    if (!sentinel || !container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            loadMore();
          }
        }
      },
      { root: container, threshold: 0.1, rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, displayVideos.length]);

  useEffect(() => {
    const v = displayVideos[activeIndex];
    if (v?.locked && activePlaylist) {
      const t = setTimeout(() => setPaywallSeries(activePlaylist), 300);
      return () => clearTimeout(t);
    }
  }, [activeIndex, displayVideos, activePlaylist]);

  return (
    <div className="fixed inset-0 flex justify-center bg-black text-white overflow-hidden">
      <div className="relative flex h-[100vh] h-[100dvh] w-full max-w-[360px] flex-col bg-black md:max-w-[420px] lg:max-w-[360px] xl:max-w-[380px] portrait:w-full">
        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-3 pt-3 sm:px-4 sm:pt-4 text-white">
          <span className="text-lg font-black tracking-tight">
            Veil<span className="text-amber-400">W</span>ick
          </span>
          <nav className="flex items-center gap-4 text-sm font-semibold sm:gap-5">
            <button type="button" className="text-white/80 hover:text-white">Following</button>
            <button type="button" className="border-b-2 border-white pb-0.5 text-white">For You</button>
            <Search className="size-5" />
          </nav>
        </header>

        {!activePlaylist && (
          <div className="absolute inset-x-0 top-12 z-20 flex gap-2 overflow-x-auto overscroll-x-contain px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory touch-pan-x">
            {CATEGORY_PILLS.map((cat) => {
              const active = cat === selectedCategory;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 snap-start rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${active ? "bg-white text-black" : "bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/10 hover:bg-white/20"}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {activePlaylist && (
          <div className="absolute inset-x-0 top-[52px] z-20 mx-3 flex items-center justify-between gap-3 rounded-full border border-white/15 bg-black/60 px-3 py-2 backdrop-blur-md">
            <span className="flex min-w-0 items-center gap-2 text-xs font-semibold">
              <ListVideo className="size-4 shrink-0" />
              <span className="truncate">Playlist: {activePlaylist.title} ({activePlaylist.episodes.length})</span>
              <span className="hidden shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-black sm:inline">5 Episodes</span>
            </span>
            <button type="button" onClick={() => setActivePlaylist(null)} className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-black hover:bg-white/90" aria-label="Exit playlist, back to For You">
              <X className="size-3.5" />
              Exit
            </button>
          </div>
        )}

        {/* vertical snap feed — 9:16 portrait, full 100vh, scroll-snap-type y mandatory, touch-pan-y */}
        <div
          ref={containerRef}
          style={{ scrollSnapType: "y mandatory", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          className="h-[100vh] h-[100dvh] w-full snap-y snap-mandatory overflow-y-scroll overscroll-contain scroll-smooth touch-pan-y [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {displayVideos.map((video, index) => {
            const playlistSeries = !activePlaylist ? getSeriesForHandle(video.creator.handle) : null;
            return (
              <Slide
                key={video.id}
                video={video}
                active={index === activeIndex}
                muted={muted}
                showCaptions={captionsOn}
                playlistSeries={playlistSeries ?? activePlaylist}
                onPlaylistClick={(s) => setActivePlaylist(s)}
                onLockedClick={(s) => setPaywallSeries(s)}
                onLike={(v) => trackAction(v, "like")}
                onBookmark={(v) => trackAction(v, "bookmark")}
                onShare={(v) => trackAction(v, "share")}
                onPlayingChange={setPlaying}
              />
            );
          })}

          {/* infinite scroll sentinel — IntersectionObserver triggers loadMore + silent H3 prefetch */}
          <div ref={sentinelRef} className="flex h-[30vh] w-full shrink-0 snap-start flex-col items-center justify-center gap-2 bg-black">
            {(isLoadingMore || isPrefetching) ? (
              <>
                <span className="inline-block size-5 animate-spin rounded-full border-2 border-white/20 border-t-white" aria-label="Loading" role="status" />
                <p className="text-xs font-medium text-white/60">{isLoadingMore ? "Loading more — generating H3 5s..." : "Generating next clips… H3 768p 9:16"}</p>
              </>
            ) : (
              <p className="text-xs font-medium text-white/40">Scroll for more — H3 768p 9:16 · silent auto-generate</p>
            )}
            <Link href="/prototype-scenes" className="text-[10px] text-white/30 underline underline-offset-4 hover:text-white/50">Realism gate: /prototype-scenes</Link>
          </div>

          <section style={{ scrollSnapAlign: "start" } as React.CSSProperties} className="flex h-[100vh] h-[100dvh] w-full shrink-0 snap-start snap-always items-center justify-center bg-black px-6">
            <div className="w-full max-w-sm space-y-4 text-center">
              <p className="text-2xl font-bold">More coming — H3 queue</p>
              <p className="text-sm text-white/60">Synthetic wellness only. 5s H3 clips (wavespeed-ai/minimax-h3/image-to-video-lora, 768p 9:16). Single feed — series are playlists.</p>
              <div className="flex justify-center gap-3">
                <Button asChild variant="outline"><Link href="/live/yoga">Watch a live</Link></Button>
                <Button asChild><Link href="/">Back home</Link></Button>
              </div>
              <p className="pt-2 text-[11px] text-white/30">Series deep links: <Link href="/series" className="underline underline-offset-4 hover:text-white/60">/series</Link></p>
            </div>
          </section>
        </div>

        <div className="absolute bottom-6 right-2 z-20 flex items-center gap-2 sm:right-3">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
            onClick={() => setCaptionsOn((c) => !c)}
            aria-label={captionsOn ? "Hide captions" : "Show captions"}
            title={captionsOn ? "Hide captions" : "Show captions"}
          >
            {captionsOn ? <Captions className="size-5" /> : <CaptionsOff className="size-5" />}
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </Button>
        </div>

        <SeriesModal series={paywallSeries} open={!!paywallSeries} onClose={() => setPaywallSeries(null)} />
      </div>
    </div>
  );
}
