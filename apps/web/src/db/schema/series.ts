import { createId } from "@paralleldrive/cuid2";
import type { InferSelectModel } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import { commonColumns } from "./common";

/**
 * VeilWick Series — episodic vertical video collections (playlist, candy.ai style).
 *
 * - 2-3 series, each 5 episodes E1-2 free, E3-5 locked (Upgrade to Premium paywall).
 * - Each episode 5-15s via wavespeed-ai/minimax-h3/image-to-video-lora (768p 9:16, $0.25/5s)
 *   with image (first_frame) + last_image (last_frame) stitch for continuity.
 * - Poster extracted at 1.2s via ffmpeg `-s 720x1280` stored in `episodes.posterUrl`;
 *   `videoUrl` is R2 `videos/series/{slug}/ep{N}.mp4` (local via wrangler --local, no remote).
 * - Category uses extended FeedCategory enum (see @/types/feed).
 * - `isNew` drives "New" badge; `vipRequired` gates VIP-only series.
 * - `tagsJson` stores JSON array string e.g. '["series","private"]'.
 * - Stitch metadata: episodes.firstFrameUrl / lastFrameUrl + prompt/h3Model/resolution
 *   persisted per episode for seamless H3 continuity (E(n).lastFrame = E(n+1).firstFrame).
 */
export const seriesTable = sqliteTable(
  "series",
  {
    ...commonColumns,
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `ser_${createId()}`)
      .notNull(),
    title: text("title", { length: 255 }).notNull(),
    slug: text("slug", { length: 255 }).notNull().unique(),
    category: text("category", { length: 80 }).notNull(),
    thumbnail: text("thumbnail", { length: 1024 }).notNull(),
    description: text("description").notNull().default(""),
    creator: text("creator", { length: 120 }).notNull(),
    tagsJson: text("tags_json").default("[]").notNull(),
    isNew: integer("is_new", { mode: "boolean" }).default(true).notNull(),
    vipRequired: integer("vip_required", { mode: "boolean" }).default(false).notNull(),
  },
  (table) => [
    uniqueIndex("series_slug_unique").on(table.slug),
    index("series_category_idx").on(table.category),
    index("series_is_new_idx").on(table.isNew),
    index("series_created_idx").on(table.createdAt),
  ],
);

export type Series = InferSelectModel<typeof seriesTable>;

/**
 * Episodes — individual 5-15s vertical videos within a series (H3 stitch).
 *
 * - `num` is episode number 1-5 unique per series (E1-2 free, E3-5 locked).
 * - `duration` 5-15s per H3 clip (768p 9:16, $0.25/5s) — default 5.
 * - `locked` + `unlockPrice` gate paywalled episodes (E3-5 Upgrade to Premium).
 * - `posterUrl` is 720x1280 JPG extracted at 1.2s; `videoUrl` is R2 MP4.
 * - Stitch: `firstFrameUrl` (image) + `lastFrameUrl` (last_image) for
 *   wavespeed-ai/minimax-h3/image-to-video-lora continuity. E(n).lastFrame
 *   is expected to equal E(n+1).firstFrame for seamless playlist playback.
 * - `prompt` stores the non-explicit generation prompt (fashion/wellness clothed).
 * - `h3Model` + `resolution` pin generation params for reproducibility.
 */
export const episodesTable = sqliteTable(
  "episodes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `ep_${createId()}`)
      .notNull(),
    seriesId: text("series_id")
      .references(() => seriesTable.id, { onDelete: "cascade" })
      .notNull(),
    num: integer("num").notNull(),
    title: text("title", { length: 255 }).notNull(),
    duration: integer("duration").default(5).notNull(),
    posterUrl: text("poster_url", { length: 1024 }).notNull(),
    videoUrl: text("video_url", { length: 1024 }).notNull(),
    locked: integer("locked", { mode: "boolean" }).default(false).notNull(),
    unlockPrice: integer("unlock_price").default(0).notNull(),
    // H3 stitch metadata — non-explicit fashion/wellness, local only
    prompt: text("prompt", { length: 2048 }).default("").notNull(),
    firstFrameUrl: text("first_frame_url", { length: 1024 }),
    lastFrameUrl: text("last_frame_url", { length: 1024 }),
    h3Model: text("h3_model", { length: 120 })
      .default("wavespeed-ai/minimax-h3/image-to-video-lora")
      .notNull(),
    resolution: text("resolution", { length: 20 }).default("768p").notNull(),
    ...commonColumns,
  },
  (table) => [
    index("episodes_series_idx").on(table.seriesId),
    uniqueIndex("episodes_series_num_unique").on(table.seriesId, table.num),
    index("episodes_locked_idx").on(table.locked),
  ],
);

export type Episode = InferSelectModel<typeof episodesTable>;
