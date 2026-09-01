/**
 * VeilWick lightweight personalization — affinity scoring.
 *
 * No ML. On every read of user_interactions we aggregate per-category
 * and persist a normalized affinity map to user.user_profile_json (D1).
 * Feed ordering consumes the ranked list.
 *
 * Algorithm
 *   weighted = watch_ms + 5 * likes + 3 * saves     (per category)
 *   affinity[cat] = weighted[cat] / sum(weighted)    (0–1, sums to 1)
 *
 * Cold start: no interactions → use onboarding picks (equal weight).
 * If neither exists → uniform 0 across known categories (caller falls back
 * to recency/popularity ordering).
 *
 * Future: replace with vector embeddings (prompt + watch history → kNN).
 */
import { eq, sql } from "drizzle-orm";

import { getDB } from "@/db";
import { userInteractionsTable } from "@/db/schema/veilwick";
import { userTable } from "@/db/schema/user";

// Back-compat alias: older code imported userInteractionTable (singular).
const userInteractionTable = userInteractionsTable;

// ── Tunable weights ────────────────────────────────────────────────
export const WEIGHTS = {
  /** Per-millisecond watch weight. Keep 1 so seconds ≈ likes*5000. */
  watchMs: 1,
  like: 5_000, // tuned so 1 like ≈ 5s of watch
  save: 3_000, // 1 save ≈ 3s
} as const;

// For cold-start fallback and feed ordering when affinity is zero — H3 non-explicit fashion/wellness
export const DEFAULT_CATEGORIES = [
  "market-stall-fashion",
  "beach-lifestyle",
  "studio",
  "bedroom-lifestyle",
  "wellness",
  "fitness",
  "activewear",
  "breathwork",
] as const;

export type AffinityMap = Record<string, number>; // category → 0–1
export type RankedCategory = { category: string; score: number };

export interface UserProfile {
  affinity: AffinityMap;
  onboardingPicks?: string[];
  updatedAt: string;
}

/** Pure function: interactions → normalized affinity. */
export function computeAffinity(
  rows: Array<{ category: string; watchMs: number; likes: number; saves: number }>,
): AffinityMap {
  const weighted = new Map<string, number>();
  let total = 0;
  for (const r of rows) {
    const w = r.watchMs * WEIGHTS.watchMs + r.likes * WEIGHTS.like + r.saves * WEIGHTS.save;
    weighted.set(r.category, (weighted.get(r.category) ?? 0) + w);
    total += w;
  }
  if (total === 0) return {};
  const out: AffinityMap = {};
  for (const [cat, w] of weighted) out[cat] = w / total;
  return out;
}

/** Rank map descending — e.g. blowjob 0.8 > cowgirl 0.2 */
export function rankAffinity(affinity: AffinityMap): RankedCategory[] {
  return Object.entries(affinity)
    .map(([category, score]) => ({ category, score }))
    .sort((a, b) => b.score - a.score);
}

function parseProfile(raw: string | null): UserProfile | null {
  if (!raw) return null;
  try {
    const p = JSON.parse(raw) as UserProfile;
    if (p && typeof p.affinity === "object") return p;
    return null;
  } catch {
    return null;
  }
}

/**
 * Read user_interactions, compute affinity, persist to user.user_profile_json,
 * and return ranked categories. Handles cold start via onboarding picks or
 * stored profile.
 *
 * Call on feed fetch (or after write) — lightweight, single D1 round-trip
 * for aggregation + one UPDATE.
 */
export async function getRankedCategoriesForUser(
  userId: string,
  opts?: { onboardingPicks?: string[] },
): Promise<RankedCategory[]> {
  const db = await getDB();

  // 1) Aggregate interactions per category directly in D1 (cheap)
  const agg = (await db
    .select({
      category: userInteractionTable.category,
      watchMs: sql<number>`coalesce(sum(${userInteractionTable.watchMs}),0)`,
      likes: sql<number>`coalesce(sum(case when ${userInteractionTable.liked} then 1 else 0 end),0)`,
      saves: sql<number>`coalesce(sum(case when ${userInteractionTable.bookmarked} then 1 else 0 end),0)`,
    })
    .from(userInteractionTable)
    .where(eq(userInteractionTable.userId, userId))
    .groupBy(userInteractionTable.category)) as Array<{
    category: string;
    watchMs: number;
    likes: number;
    saves: number;
  }>;

  let affinity: AffinityMap = {};

  if (agg.length > 0) {
    affinity = computeAffinity(agg);
  } else {
    // Cold start — try onboarding picks (arg → stored profile)
    const picks = opts?.onboardingPicks ?? (await getOnboardingPicks(userId));
    if (picks && picks.length > 0) {
      const w = 1 / picks.length;
      for (const cat of picks) affinity[cat] = w;
    } else {
      // Still cold: check stored affinity (from previous session)
      const stored = await getStoredAffinity(userId);
      if (stored && Object.keys(stored).length > 0) affinity = stored;
    }
  }

  // Persist computed affinity for fast feed reads / debugging
  if (Object.keys(affinity).length > 0) {
    await persistProfile(userId, affinity, opts?.onboardingPicks);
  }

  return rankAffinity(affinity);
}

async function getOnboardingPicks(userId: string): Promise<string[] | null> {
  const db = await getDB();
  const row = await db
    .select({ profile: userTable.userProfileJson })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1);
  if (!row[0]) return null;
  const p = parseProfile(row[0].profile);
  return p?.onboardingPicks ?? null;
}

async function getStoredAffinity(userId: string): Promise<AffinityMap | null> {
  const db = await getDB();
  const row = await db
    .select({ profile: userTable.userProfileJson })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1);
  if (!row[0]) return null;
  return parseProfile(row[0].profile)?.affinity ?? null;
}

async function persistProfile(userId: string, affinity: AffinityMap, onboardingPicks?: string[]): Promise<void> {
  const db = await getDB();
  const existing = await db
    .select({ profile: userTable.userProfileJson })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1);
  const prev = existing[0] ? parseProfile(existing[0].profile) : null;
  const profile: UserProfile = {
    affinity,
    onboardingPicks: onboardingPicks ?? prev?.onboardingPicks,
    updatedAt: new Date().toISOString(),
  };
  await db
    .update(userTable)
    .set({ userProfileJson: JSON.stringify(profile) })
    .where(eq(userTable.id, userId));
}

/** Helper for onboarding: save picks so cold-start has signal before any watches. */
export async function saveOnboardingPicks(userId: string, picks: string[]): Promise<void> {
  const db = await getDB();
  const normalized = picks.map((p) => p.toLowerCase().trim()).filter(Boolean);
  const affinity: AffinityMap = {};
  if (normalized.length > 0) {
    const w = 1 / normalized.length;
    for (const cat of normalized) affinity[cat] = w;
  }
  const profile: UserProfile = { affinity, onboardingPicks: normalized, updatedAt: new Date().toISOString() };
  await db.update(userTable).set({ userProfileJson: JSON.stringify(profile) }).where(eq(userTable.id, userId));
}
