/**
 * Re-export the canonical `user_interactions` table from veilwick.ts.
 *
 * Historically this file defined a separate `user_interaction` (singular)
 * table without video_id. The instrumentation checkpoint canonicalizes on
 * `user_interactions` (plural) per spec: (user_id, video_id, category,
 * watch_ms, liked) plus bookmark/shared/action/scroll_depth.
 *
 * This module re-exports the canonical table under the legacy name so
 * existing personalization code (`@/db/schema/personalization`) keeps
 * importing without a breaking change. Drizzle sees only one table
 * definition (in veilwick.ts), so migrations stay single-source.
 */
export { userInteractionsTable, userInteractionsTable as userInteractionTable } from "./veilwick";
export type { UserInteraction } from "./veilwick";

// Back-compat: personalization lib references `saved` but canonical column is `bookmarked`.
// Consumers should read `bookmarked`; this alias is for query helpers that still
// project `saved` — map it at query time (see src/lib/personalization.ts).
