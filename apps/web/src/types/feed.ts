/** Non-explicit fashion/wellness/lifestyle feed — H3 image-to-video-lora pipeline (5s, 9:16, 720p/768p, clothed) */
export type FeedCategory =
  // non-explicit H3 image-to-video-lora categories (clothed fashion/wellness) — primary
  | "market-stall-fashion"
  | "beach-lifestyle"
  | "studio-portrait"
  | "studio"
  | "bedroom-lifestyle-clothed"
  | "bedroom-lifestyle"
  | "cafe"
  | "street-style"
  | "gym-activewear"
  | "rooftop-golden-hour"
  | "boutique-fitting"
  // wellness / fashion general
  | "yoga"
  | "fitness"
  | "activewear"
  | "breathwork"
  | "wellness"
  // legacy explicit (kept for backward compat, not used in new H3 library)
  | "nsfw"
  | "cowgirl"
  | "blowjob"
  | "missionary"
  | "titfuck"
  | "feed"
  | "doggy"
  | "anal"
  | "cumshot"
  | "boobs"
  | "series"
  | string;

export interface Creator {
  handle: string;
  displayName: string;
  avatarUrl: string;
}

export interface FeedVideo {
  id: string;
  category: FeedCategory;
  creator: Creator;
  caption: string;
  hashtags: string[];
  music: string;
  videoUrl: string;
  posterUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  // TikTok-style playlist fields — feed remains single feed; series are playlists
  seriesId?: string;
  seriesTitle?: string;
  episodeNumber?: number;
  locked?: boolean;
  isNew?: boolean;
}
