"use client";

import { useCallback, useEffect, useRef } from "react";
import type { FeedVideo } from "@/types/feed";

export interface InteractionPayload {
  videoId: string;
  category: string;
  watchMs?: number;
  liked?: boolean;
  bookmarked?: boolean;
  shared?: boolean;
  action?: "view" | "like" | "bookmark" | "share" | "dwell" | "scroll";
  scrollDepth?: number; // 0..1
}

/**
 * useFeedInstrumentation — addictive feed telemetry.
 *
 * Wires:
 *  - visible video ID via IntersectionObserver 60% (re-uses feed container)
 *  - watch time per slide via play/pause timestamps (active + playing)
 *  - scroll depth (scrollTop / scrollHeight, throttled)
 *  - likes / shares / bookmarks (call trackAction)
 *  - category dwells aggregated server-side from watch_ms by category
 *
 * Fire-and-forget POST to /api/interaction (keepalive + anon-allowed).
 * No PII. Failures are silent — telemetry must not break feed UX.
 */
export function useFeedInstrumentation(
  containerRef: React.RefObject<HTMLDivElement | null>,
  videos: FeedVideo[],
  activeIndex: number,
) {
  const watchStartRef = useRef<number | null>(null);
  const activeVideoRef = useRef<FeedVideo | null>(null);
  const scrollDepthRef = useRef(0);

  const send = useCallback((p: InteractionPayload) => {
    const body = JSON.stringify(p);
    // keepalive so dwell flush survives page hide / nav
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/interaction", new Blob([body], { type: "application/json" }));
        return;
      }
    } catch {
      // fall through
    }
    fetch("/api/interaction", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }, []);

  const flushWatch = useCallback(
    (video: FeedVideo | null) => {
      if (!video || watchStartRef.current == null) return;
      const watchMs = Date.now() - watchStartRef.current;
      if (watchMs < 300) {
        watchStartRef.current = null;
        return;
      }
      send({
        videoId: video.id,
        category: video.category,
        watchMs,
        action: "dwell",
        scrollDepth: scrollDepthRef.current,
      });
      watchStartRef.current = null;
    },
    [send],
  );

  // Track active slide change — flush previous, start new
  useEffect(() => {
    const next = videos[activeIndex] ?? null;
    flushWatch(activeVideoRef.current);
    activeVideoRef.current = next;
    watchStartRef.current = next ? Date.now() : null;
  }, [activeIndex, videos, flushWatch]);

  // Flush on hide / unmount (sendBeacon)
  useEffect(() => {
    const onHide = () => flushWatch(activeVideoRef.current);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    window.addEventListener("beforeunload", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("beforeunload", onHide);
      flushWatch(activeVideoRef.current);
    };
  }, [flushWatch]);

  // Scroll depth — throttled via rAF
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = el.scrollHeight - el.clientHeight;
        scrollDepthRef.current = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, [containerRef]);

  // Public: fire explicit actions (like/bookmark/share)
  const trackAction = useCallback(
    (video: FeedVideo, action: InteractionPayload["action"], extra?: Partial<InteractionPayload>) => {
      send({
        videoId: video.id,
        category: video.category,
        action,
        liked: action === "like" ? true : undefined,
        bookmarked: action === "bookmark" ? true : undefined,
        shared: action === "share" ? true : undefined,
        scrollDepth: scrollDepthRef.current,
        ...extra,
      });
    },
    [send],
  );

  // Pause/resume watch tracking (e.g. user taps pause)
  const setPlaying = useCallback(
    (playing: boolean) => {
      const v = activeVideoRef.current;
      if (!v) return;
      if (playing) {
        if (watchStartRef.current == null) watchStartRef.current = Date.now();
      } else {
        flushWatch(v);
      }
    },
    [flushWatch],
  );

  return { trackAction, setPlaying, send, flushWatch };
}
