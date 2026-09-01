/**
 * VeilWick series catalogue — 5 episodes per series, 5-15s each via H3 (candy.ai playlist).
 *
 * - Each series is a playlist: E1-2 free, E3-5 locked Upgrade to Premium (cliffhanger at E2).
 * - Each episode 5-15s via wavespeed-ai/minimax-h3/image-to-video-lora (768p 9:16, $0.25/5s)
 *   with image (first_frame) + last_image (last_frame) stitch for continuity.
 * - Posters: LOCAL public 720x1280 (preferred) — /series-posters/{seriesId}.jpg
 *   Files live in apps/web/public/series-posters/ (copied from /tmp/poster-*.jpg).
 *   Plain <img> with unoptimized — no R2, no picsum.photos, no remotePatterns.
 *   Each series cover is a distinct movie poster style (boss-noir, staycation-serif,
 *   stepmom-bold, yuna-neon, hotshot-camo via @/lib/poster-styles). Episode thumbs
 *   reuse series cover locally until per-episode thumbs exist.
 * - Stitch metadata stored in D1 episodes.first_frame_url / last_frame_url (see schema/series.ts).
 * - Remote R2 pipeline remains for production generation but local generation via
 *   scripts/generate-series-local.ts writes to R2 local + D1 local (--local) only.
 */

import { localEpisodePosterUrl, localSeriesCoverUrl } from "@/lib/posters";

export type SeriesCategory =
  | "All"
  | "Stepsister"
  | "Milf"
  | "Cuckold"
  | "Roommate"
  | "Teacher"
  | "Boss"
  | "Massage";

export const SERIES_CATEGORIES: SeriesCategory[] = [
  "All",
  "Stepsister",
  "Milf",
  "Cuckold",
  "Roommate",
  "Teacher",
  "Boss",
  "Massage",
];

export interface SeriesEpisode {
  id: string;
  number: number;
  title: string;
  duration: string;
  locked: boolean;
  isNew: boolean;
  thumbnailUrl?: string;
  videoUrl: string;
}

export interface Series {
  id: string;
  title: string;
  category: Exclude<SeriesCategory, "All">;
  posterUrl: string; // 720x1280 — local /series-posters/{seriesId}.jpg (no R2/picsum)
  videoUrl: string;
  description: string;
  episodes: SeriesEpisode[];
}

function mkEpisodes(seriesId: string, videoBase: string): SeriesEpisode[] {
  const titles = [
    "First Encounter",
    "Late Night Confession",
    "Forbidden Temptation",
    "Secret Desires",
    "Final Seduction",
  ];
  return titles.map((title, i) => {
    const n = i + 1;
    return {
      id: `${seriesId}-e${n}`,
      number: n,
      title,
      duration: "0:05",
      locked: n >= 3,
      isNew: n >= 3,
      thumbnailUrl: localEpisodePosterUrl(seriesId),
      videoUrl: `${videoBase}/ep${n}.mp4`,
    };
  });
}

function mkSeries(
  id: string,
  title: string,
  category: Exclude<SeriesCategory, "All">,
  slug: string,
): Series {
  return {
    id,
    title,
    category,
    posterUrl: localSeriesCoverUrl(slug),
    videoUrl: `videos/series/${slug}/ep1.mp4`,
    description: "Synthetic series · 18+ · AI-generated · H3 768p 9:16 5-15s $0.25/5s · E1-2 free, E3-5 Premium (cliffhanger)",
    episodes: mkEpisodes(slug, `videos/series/${slug}`),
  };
}

export const SERIES_DATA: Series[] = [
  mkSeries("s1", "Stepsister's Secret Lessons", "Stepsister", "series_s1"),
  mkSeries("s2", "Milf Next Door", "Milf", "series_s2"),
  mkSeries("s3", "Cuckold Confessions", "Cuckold", "series_s3"),
  mkSeries("s4", "Roommate With Benefits", "Roommate", "series_s4"),
  mkSeries("s5", "Teacher's After Hours", "Teacher", "series_s5"),
  mkSeries("s6", "Boss's Private Meeting", "Boss", "series_s6"),
  mkSeries("s7", "Massage Parlor Secrets", "Massage", "series_s7"),
  mkSeries("s8", "Stepsister's Midnight Visit", "Stepsister", "series_s8"),
  mkSeries("s9", "Milf Yoga Instructor", "Milf", "series_s9"),
  mkSeries("s10", "Cuckold Hotel Night", "Cuckold", "series_s10"),
  mkSeries("s11", "Teacher's Detention", "Teacher", "series_s11"),
  mkSeries("s12", "Boss's Late Night Overtime", "Boss", "series_s12"),
];

export function getSeriesById(id: string): Series | undefined {
  return SERIES_DATA.find((s) => s.id === id);
}
