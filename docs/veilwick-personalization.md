# VeilWick Preference Learning — Checkpoint

Lightweight, no ML. Future: vector embeddings (prompt + history → kNN).

## Tables

- `user_interactions` — one row per view/like/bookmark/share/dwell. Columns: `user_id`, `video_id`, `category`, `watch_ms`, `liked`, `bookmarked`, `shared`, `action`, `scroll_depth`.
- `user.user_profile_json` — cached `{ affinity, onboardingPicks, updatedAt }`.

## Algorithm

On read of `user_interactions`:

```
weighted[cat] = sum(watch_ms) + 5_000*likes + 3_000*saves    // per category
affinity[cat] = weighted[cat] / sum(weighted)               // 0–1 normalized
ranked = sort(affinity, desc)                               // e.g. blowjob 0.8 > cowgirl 0.2
```

- `5_000 ≈ 5s watch`, `3_000 ≈ 3s` — explicit signals outweigh passive watch.
- Single D1 `GROUP BY category` aggregation, then persist JSON to `user_profile_json` for fast feed reads.
- Pure functions `computeAffinity` / `rankAffinity` are unit-tested.

## Cold start

No interactions → use onboarding picks (equal weight: `1/N` each). No picks → fall back to stored affinity or recency/popularity ordering. `saveOnboardingPicks()` writes picks to profile at signup.

## Feed ordering

```ts
const ranked = await getRankedCategoriesForUser(userId);
 // ranked = [{category:"blowjob",score:0.8}, {category:"cowgirl",score:0.3}, ...]
 // feed query: ORDER BY affinity weight, then recency
```

## Files

- `apps/web/src/lib/personalization.ts` — engine
- `apps/web/src/db/schema/veilwick.ts` — `user_interactions` table
- `apps/web/src/db/schema/user.ts` — `user_profile_json`
- `apps/web/src/db/migrations/0008_overjoyed_bromley.sql`

## Future

Replace weighted sum with embeddings: encode prompt/category + user k-history into vector, cosine similarity ranking. Current affinity becomes a baseline feature.
