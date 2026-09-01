import { createId } from "@paralleldrive/cuid2";
import type { InferSelectModel } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { userTable } from "./user";

/**
 * Videos: generated AI video content for the feed (local D1/R2 miniflare --local only).
 * Each video is a synthetic realistic scene in a category, rendered to R2 UPLOADS bucket.
 * Primary model: wavespeed-ai/minimax-h3/image-to-video-lora (768p 9:16, 5s, $0.25) with
 *   image (first frame) + last_image (optional stitch) + loras [{path, scale:1}] + prompt.
 * Wan 2.4-14B kept only for candy.ai short library (non-feed). No Vast, no --remote.
 * Auto-generate on scroll: /api/feed/prefetch when buffer<2 enqueues h3.generate (image+last_image+loras).
 * Realism gate: /prototype-scenes — generate ONE video first, then storyboard prompts expand feed.
 */
export const videoTable = sqliteTable(
  "videos",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `vid_${createId()}`)
      .notNull(),
    category: text("category", { length: 80 }).notNull(),
    prompt: text("prompt").notNull(),
    r2Key: text("r2_key", { length: 1024 }).notNull(),
    status: text("status", { enum: ["pending", "ready", "failed"] })
      .default("pending")
      .notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("videos_category_idx").on(table.category),
    index("videos_status_idx").on(table.status),
    index("videos_created_idx").on(table.createdAt),
  ],
);

export type Video = InferSelectModel<typeof videoTable>;

/**
 * Streams: live-streaming sessions playing videos per category.
 * A stream is a playlist-like entity — when isLive, it serves the
 * currentVideoId. No video playing when offline.
 */
export const streamTable = sqliteTable(
  "streams",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `str_${createId()}`)
      .notNull(),
    category: text("category", { length: 80 }).notNull(),
    isLive: integer("is_live", { mode: "boolean" }).default(false).notNull(),
    currentVideoId: text("current_video_id").references(() => videoTable.id, { onDelete: "set null" }),
  },
  (table) => [
    index("streams_category_idx").on(table.category),
    index("streams_current_video_idx").on(table.currentVideoId),
  ],
);

export type Stream = InferSelectModel<typeof streamTable>;

/**
 * Instrumentation checkpoint — personalized addictive feed.
 *
 * Captures per-slide signals for future ranking:
 *  - scroll depth (container scrollTop / scrollHeight)
 *  - visible video ID via IntersectionObserver 60% (client hook)
 *  - watch time per slide (play/pause timestamps -> watch_ms)
 *  - likes / shares / bookmarks
 *  - category dwells (cowgirl/blowjob/titfuck etc aggregated from watch_ms by category)
 *
 * Spec-required columns: user_id, video_id, category, watch_ms, liked.
 * Extra columns (action, scroll_depth, bookmarked/shared, dwell) keep the
 * table additive without breaking the minimal contract.
 */
export const userInteractionsTable = sqliteTable(
  "user_interactions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `ui_${createId()}`)
      .notNull(),
    userId: text("user_id").references(() => userTable.id, { onDelete: "set null" }),
    videoId: text("video_id").notNull(),
    category: text("category", { length: 80 }).notNull(),
    // accumulated watch time for this impression (ms)
    watchMs: integer("watch_ms").default(0).notNull(),
    liked: integer("liked", { mode: "boolean" }).default(false).notNull(),
    bookmarked: integer("bookmarked", { mode: "boolean" }).default(false).notNull(),
    shared: integer("shared", { mode: "boolean" }).default(false).notNull(),
    // what triggered the row: view | like | bookmark | share | dwell
    action: text("action", { enum: ["view", "like", "bookmark", "share", "dwell", "scroll"] })
      .default("view")
      .notNull(),
    // 0..1 fraction of feed scrolled when event fired
    scrollDepth: integer("scroll_depth"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("user_interactions_user_idx").on(table.userId),
    index("user_interactions_video_idx").on(table.videoId),
    index("user_interactions_category_idx").on(table.category),
    index("user_interactions_created_idx").on(table.createdAt),
  ],
);

export type UserInteraction = InferSelectModel<typeof userInteractionsTable>;