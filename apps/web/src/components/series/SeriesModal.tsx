"use client";

import { useEffect, useRef, useState } from "react";
import { Clock3, Lock, Play, Sparkles, Crown, X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@template/ui/primitives/button";
import { cn } from "@template/ui";
import type { Series, SeriesEpisode } from "./data";

interface SeriesModalProps {
  series: Series | null;
  open: boolean;
  onClose: () => void;
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function PremiumPaywall({
  episode,
  onClose,
}: {
  episode: SeriesEpisode;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 p-6 backdrop-blur-[2px] text-center animate-in fade-in">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg">
          <Crown className="size-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Unlock Next Episodes</h3>
        <p className="mt-1 text-sm font-medium text-white/80">
          Episode {episode.number} - Unlock all premium episodes
        </p>
        <ul className="mt-4 space-y-2 text-left text-sm text-white/70">
          <li className="flex items-center gap-2">
            <Sparkles className="size-4 shrink-0 text-violet-400" />
            AI generates most spicy moments
          </li>
          <li className="flex items-center gap-2">
            <Play className="size-4 shrink-0 text-violet-400" />
            Watch in HD
          </li>
        </ul>
        <Button
          className="mt-5 w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-6 text-base font-bold text-white hover:from-violet-500 hover:to-fuchsia-500"
          onClick={() => {
            // demo: close paywall (in real app, redirect to checkout)
            onClose();
          }}
        >
          <Crown className="size-4" />
          Upgrade to Premium
        </Button>
        <p className="mt-2 text-[11px] text-white/40">
          Synthetic content · 18+ only · No real persons depicted
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 text-xs text-white/50 underline underline-offset-4 hover:text-white/80"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

export function SeriesModal({ series, open, onClose }: SeriesModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeEpisode, setActiveEpisode] = useState<SeriesEpisode | null>(null);
  const [showPaywall, setShowPaywall] = useState<SeriesEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(70); // 1:10 = 70s default

  // reset when series changes / modal opens
  useEffect(() => {
    if (open && series) {
      setActiveEpisode(series.episodes[0] ?? null);
      setShowPaywall(null);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [open, series]);

  // lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // close on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showPaywall) setShowPaywall(null);
        else onClose();
      }
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, showPaywall, onClose]);

  const handleEpisodeClick = (ep: SeriesEpisode) => {
    if (ep.locked) {
      setShowPaywall(ep);
      return;
    }
    setActiveEpisode(ep);
    setCurrentTime(0);
    setIsPlaying(true);
    // reset video
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
    } else {
      el.play().catch(() => {});
    }
  };

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  if (!open || !series) return null;

  const episodeForPlayer = activeEpisode ?? series.episodes[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal container */}
      <div className="relative flex max-h-dvh w-full max-w-[920px] flex-col overflow-hidden bg-zinc-950 text-white shadow-2xl sm:max-h-[90dvh] sm:rounded-2xl sm:border sm:border-white/10">
        {/* close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-30 flex size-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <div className="flex flex-col overflow-hidden lg:flex-row">
          {/* left: player */}
          <div className="relative w-full shrink-0 bg-black lg:w-[58%]">
            <div className="relative aspect-[9/16] w-full overflow-hidden bg-zinc-900 sm:aspect-video lg:aspect-[9/16] lg:max-h-[78dvh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <video
                ref={videoRef}
                key={episodeForPlayer?.id}
                src={series.videoUrl}
                poster={series.posterUrl}
                playsInline
                muted={muted}
                loop={!episodeForPlayer?.locked}
                preload="metadata"
                className="h-full w-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => {
                  const d = e.currentTarget.duration;
                  if (!Number.isNaN(d) && Number.isFinite(d) && d > 0) setDuration(d);
                  else setDuration(70);
                }}
                onClick={togglePlay}
              />

              {/* center play button when paused */}
              {!isPlaying && !showPaywall && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/20"
                  aria-label="Play"
                >
                  <span className="flex size-16 items-center justify-center rounded-full bg-white/90 text-black shadow-xl backdrop-blur-sm transition hover:bg-white">
                    <Play className="ml-1 size-7 fill-black" />
                  </span>
                </button>
              )}

              {/* gradient for controls */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* timeline bar */}
              <div className="absolute inset-x-0 bottom-0 p-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-black"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <span className="block h-3 w-3 rounded-[1px] bg-black" /> : <Play className="size-4 fill-black ml-0.5" />}
                  </button>

                  <div className="flex flex-1 items-center gap-2">
                    <span className="text-xs font-medium tabular-nums text-white">
                      {formatTime(currentTime)}
                    </span>
                    <div className="relative flex-1 h-1.5 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="absolute inset-y-0 left-0 bg-white"
                        style={{ width: `${Math.min(100, (currentTime / (duration || 70)) * 100)}%` }}
                      />
                      <div
                        className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-white shadow"
                        style={{ left: `calc(${Math.min(100, (currentTime / (duration || 70)) * 100)}% - 6px)` }}
                      />
                    </div>
                    <span className="text-xs font-medium tabular-nums text-white/70">
                      {formatTime(duration)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMuted((m) => !m)}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
                    aria-label={muted ? "Unmute" : "Mute"}
                  >
                    {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                  </button>
                </div>
              </div>

              {/* paywall overlay anchored to player */}
              {showPaywall && <PremiumPaywall episode={showPaywall} onClose={() => setShowPaywall(null)} />}
            </div>

            {/* title under player on mobile */}
            <div className="border-t border-white/10 p-4 lg:hidden">
              <h2 className="text-base font-bold leading-tight">{series.title}</h2>
              <p className="mt-1 text-xs text-white/50">{series.category} · 5 Episodes · Synthetic 18+</p>
            </div>
          </div>

          {/* right: episode list */}
          <div className="flex min-h-0 flex-1 flex-col bg-zinc-950">
            <div className="hidden border-b border-white/10 p-5 lg:block">
              <h2 className="pr-8 text-lg font-bold leading-tight">{series.title}</h2>
              <p className="mt-1 text-xs text-white/50">
                {series.category} · 5 Episodes · Synthetic 18+ · AI-generated
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-3 sm:p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
                  Episodes
                </p>
                <ul className="space-y-2">
                  {series.episodes.map((ep) => {
                    const isActive = activeEpisode?.id === ep.id && !ep.locked;
                    return (
                      <li key={ep.id}>
                        <button
                          type="button"
                          onClick={() => handleEpisodeClick(ep)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition",
                            isActive
                              ? "border-violet-500/50 bg-violet-500/10"
                              : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                            ep.locked && "opacity-100"
                          )}
                        >
                          {/* thumb */}
                          <span className="relative flex h-[52px] w-[88px] shrink-0 overflow-hidden rounded-lg bg-zinc-900">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={ep.thumbnailUrl ?? series.posterUrl}
                              alt=""
                              className={cn("h-full w-full object-cover", ep.locked && "opacity-60")}
                            />
                            {ep.locked ? (
                              <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <Lock className="size-5 text-white" />
                              </span>
                            ) : (
                              <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100">
                                <Play className="size-5 fill-white text-white" />
                              </span>
                            )}
                            <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[10px] font-medium tabular-nums text-white">
                              {ep.duration}
                            </span>
                          </span>

                          {/* meta */}
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2">
                              <span className="text-sm font-semibold">Episode {ep.number}</span>
                              {ep.isNew && (
                                <span className="rounded-full bg-fuchsia-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                  New
                                </span>
                              )}
                              {ep.locked && <Lock className="size-3.5 text-white/40" />}
                            </span>
                            <span className="mt-0.5 line-clamp-1 block text-xs text-white/50">
                              {ep.title}
                            </span>
                            <span className="mt-1 flex items-center gap-1 text-[11px] text-white/30">
                              <Clock3 className="size-3" />
                              {ep.duration}
                            </span>
                          </span>

                          {/* action */}
                          <span className="shrink-0">
                            {ep.locked ? (
                              <span className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white">
                                <Lock className="size-4" />
                              </span>
                            ) : (
                              <span
                                className={cn(
                                  "flex size-8 items-center justify-center rounded-full",
                                  isActive ? "bg-white text-black" : "bg-white/10 text-white"
                                )}
                              >
                                <Play className={cn("size-4", isActive ? "fill-black" : "fill-white")} />
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* footer paywall hint */}
            <div className="border-t border-white/10 bg-zinc-900/50 p-3">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 px-3 py-2.5 ring-1 ring-violet-500/20">
                <span className="text-xs font-medium text-white/80">
                  2 free episodes · 3 premium locked
                </span>
                <Crown className="size-4 text-violet-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
