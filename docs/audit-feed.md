# VeilWick Feed Audit — 2026-09-01

> Scope: `app/(app)/feed/*`, `app/api/feed/*`, `src/lib/wavespeed.ts`, `src/lib/h3.ts`, `src/db/schema/veilwick.ts`, `src/types/feed.ts`, `src/hooks/useFeedInstrumentation.ts`, `src/lib/personalization.ts`, `workers/queue-consumer`.

## Summary

Core TikTok-style vertical feed shell is implemented. H3 5s contract (768p 9:16), 8-video cold start, 100vh snap, buffer/prefetch/infinite-scroll scaffolding, and instrumentation wiring all exist. Data path from D1 `videos` through R2 `UPLOADS` and Wavespeed is stubbed: consumer writes 4-byte mock blobs, fallback URLs are public placeholders, likes/comments and personalized ordering are instrumented but not surfaced.

---

## 1. Implemented

| Claim | Evidence | File |
|---|---|---|
| **H3 5s 768p 9:16 contract** | `H3_IMAGE_TO_VIDEO_LORA_MODEL = wavespeed-ai/minimax-h3/image-to-video-lora`, `H3_DEFAULT_DURATION=5`, `H3_DEFAULT_RESOLUTION=768p`, `H3_DEFAULT_ASPECT=9:16`, pricing $0.25/$0.30, prompts non-explicit | `src/lib/wavespeed.ts:30-41,84-100` |
| **8 categories + prompts/tags** | `FEED_CATEGORIES` 8 entries, `FEED_PROMPTS`/`FEED_TAGS` (angle/POV/lighting), `getFeedPrompt()` fallback to wellness | `src/lib/wavespeed.ts:70-121` |
| **8-video cold-start fallback** | `FALLBACK_VIDEOS: FeedVideo[]` 8 entries, one per category, 5s captions, hashtags, avatar | `app/(app)/feed/feed-client.tsx:55-64` |
| **100vh snap-scroll** | Container `scrollSnapType: "y mandatory"` + `overflow-y-scroll snap-y snap-mandatory`, each `<section>` `scrollSnapAlign:start` `height:100vh`/`100dvh` `snap-start snap-always`, `aspectRatio 9/16`, centered shell `max-w-[360-420px]` | `app/(app)/feed/feed-client.tsx:194-197,591-594` |
| **Autoplay muted loop + poster fallback** | `<video muted loop playsInline autoPlay preload=metadata>` + `poster` + gradient/`<img>` fallback, `IntersectionObserver 0.6` drives `active` autoplay | `app/(app)/feed/feed-client.tsx:154-232,449-467` |
| **Buffer < 2 triggers prefetch** | `buffer = displayVideos.length - activeIndex -1; if buffer<2 && now-prefetchFired>3000 POST /api/feed/prefetch` + duplicate guard in `loadMore` | `app/(app)/feed/feed-client.tsx:435-446,482-491` |
| **Prefetch next 2** | `displayVideos.slice(activeIndex+1, activeIndex+3)` inserts `<link rel=prefetch as=video>` + `<link rel=preload>` via `resolveVideoSrc()` | `app/(app)/feed/feed-client.tsx:420-434` |
| **Infinite scroll sentinel** | `sentinelRef` `IntersectionObserver {threshold:0.1, rootMargin:200px, root:container}` -> `loadMore()`, sentinel `h-[30vh] snap-start`, spinner `isLoadingMore||isPrefetching` | `app/(app)/feed/feed-client.tsx:475-534,617-627` |
| **Pagination params** | `GET /api/feed?personalized=true&offset=&limit=` parsed `limit min20 max20`, `offset max0`, `rows.limit(20).offset(offset).slice(0,limit)` | `app/api/feed/route.ts:63-64,101,109` |
| **D1+R2+KV+Queue bindings** | `wrangler.jsonc` `DB template-db`, `UPLOADS template-uploads R2`, `OUTBOX_QUEUE template-outbox`, `SESSION_CACHE/FLAGS KV`, `local` preview bindings | `cloudflare/app-worker/wrangler.jsonc:14-44` |
| **DB schema** | `videoTable` (id, category 80, prompt, r2Key 1024, status pending/ready/failed, indexes), `userInteractionsTable` (watchMs, liked/bookmarked/shared, action, scrollDepth 0..1000), `streamTable` | `src/db/schema/veilwick.ts:16-111` |
| **Types** | `FeedCategory` (8 + legacy), `Creator`, `FeedVideo` (videoUrl, posterUrl, likes/comments/shares, seriesId/locked) | `src/types/feed.ts` |
| **R2 key helper** | `h3R2Key(cat,userId,id)= videos/{cat}/{userId}/{id}.mp4` | `src/lib/h3.ts:16-21` |
| **Wavespeed wrappers** | `generateH3ImageToVideoLora({image,lastImage,prompt,loras,duration,resolution})` + `generateH3ReferenceToVideoLora` POST to `api.wavespeed.ai/api/v3/...`, loras from `WAVESPEED_LORA_PATH` or `/tmp/MysticXXX_MMH3-V4.safetensors` | `src/lib/wavespeed.ts:370-516` |
| **Queue producer** | `POST /api/feed` enqueues `h3.generate {image,last_image,loras,prompt,duration:5,resolution:768p,model}` when `videos.length<10` + `POST /api/feed/prefetch` enqueues `need=max(2-buffer,2)` | `app/api/feed/route.ts:124-161`, `app/api/feed/prefetch/route.ts:65-99` |
| **Instrumentation hook** | `useFeedInstrumentation` tracks watchMs via play/pause timestamps, scrollDepth via rAF, flush on hide/pagehide/sendBeacon, `trackAction(like/bookmark/share)` -> `POST /api/interaction` keepalive | `src/hooks/useFeedInstrumentation.ts` |
| **Personalization lib** | `WEIGHTS watchMs1/like5000/save3000`, `computeAffinity` normalized 0..1, `rankAffinity` desc, `getRankedCategoriesForUser` aggregates D1 + cold-start from `userProfileJson.onboardingPicks` | `src/lib/personalization.ts` |
| **KV cache + affinity ordering** | `GET /api/feed` checks `SESSION_CACHE`/`FLAGS` `feed:{userId}:p:{0|1}:o:{n}:l:{n}` TTL30s, `orderByAffinity(rows, ranked)` when personalized | `app/api/feed/route.ts:46-58,80-87,103-104` |
| **Interaction endpoint** | `POST /api/interaction` zod-validated, anon allowed, inserts `userInteractionsTable`, `GET` last 20 for auth user | `app/api/interaction/route.ts` |
| **Category pills + playlist shim** | 8 `FEED_CATEGORIES` pills + `For You`, `seriesEpisodesToFeedVideos()` maps 5-episode series to FeedVideo with lock | `app/(app)/feed/feed-client.tsx:66-132,558-573` |

## 2. Stubs / Mocks

| Area | What exists | Why it's a stub |
|---|---|---|
| **Real video URLs** | `FALLBACK_VIDEOS` use `test-videos.co.uk/vids/{bigbuckbunny,sintel,jellyfish}` + `picsum.photos/seed` + `dicebear` avatar. `resolveVideoSrc` maps `videos/*` to `https://cdn.veilwick.com` placeholder. | No H3 output; every clip is a public sample. D1 `videoTable` empty on cold start => fallback always renders. |
| **R2 upload (real video)** | `workers/queue-consumer/src/index.ts:55-58` `h3.generate` does `new Uint8Array([0,0,0,0])` + `UPLOADS.put(key, mockBlob)` then `UPDATE videos SET status='ready'`. `wan.generate` same mock. | 4-byte blob is not a video. Poster extraction (ffmpeg at 1.2s) not executed. No Wavespeed API call from consumer; `generateH3ImageToVideoLora` in `wavespeed.ts` is never invoked by the consumer. |
| **`src/lib/h3.ts:generateH3Video`** | Returns `h3R2Key` immediately, logs, no fetch. Comment: "Real H3 inference would happen in Workers queue consumer; here we just allocate the key." | Key allocation only; no inference. |
| **Personalized ranking** | `getRankedCategoriesForUser` is real, but `app/api/feed/route.ts:68-73` sets `userId=null` from `getCloudflareContext` then only `x-user-id` header can populate it. Anon feed (default) gets `rankedCats=[]` -> falls through to recency sort (`createdAt desc`). Client always fetches `personalized=true` but server treats anon as unpersonalized. KV key `feed:anon:...` is shared. | Ordering not personalized in practice; anon path ignores affinity. Cold-start onboarding picks only apply if `userId` present. |
| **Likes / comments / shares** | Slide shows `likes/comments/shares` with `formatCount`, heart toggles `liked` local state + `trackAction(v,"like")`. Comments/bookmark/share buttons fire `trackAction` but no server counter. `videoTable` has no like/comment columns; counts in API are hardcoded `likes:0 comments:0 shares:0`. LoadMore tail rotation copies `likes` from fallback. | No `likes` table, no optimistic persistence, no `POST /api/feed/like`. Refresh loses like. Comments UI is icon + count only (no thread). Shares `Share2` is no-op. |
| **Pagination correctness** | Client `loadMore` calls `offset=videos.length`; server does `.limit(20).offset(offset).slice(0,limit)` (limit 20 hardcoded vs param 10). If D1 has < `offset` ready rows, returns 0 and client fabricates tail: `prev.slice(-5).map(v=>({…id:`${v.id}-more-${Date.now()}-${i}`}))`. | Infinite scroll never hits real pagination; duplicates with synthetic IDs. No cursor, no total count, no `hasMore`. |
| **Prefetch idempotency** | `prefetchFired` 3000ms throttle + server `buffer>=2 => {queued:0, buffer_ok}` early return. Queue `send` silently swallowed on failure, `insert videoTable pending` also `.catch(()=>{})`. | Silent failures hide queue/KV/D1 unavailability (miniflare not running). No retry, no `needsH3` surfaced to UI except spinner text. |
| **Image stitch (last_image)** | `h3.generate` payload includes `image: https://cdn.veilwick.com/{r2Key}` and `last_image: undefined` always. `firstFrameUrl/lastFrameUrl` on `episodes` schema exists but not populated by feed. | No frame extraction; stitch continuity (`E(n).lastFrame = E(n+1).firstFrame`) not exercised. |
| **Poster URLs** | Feed `videoTable` rows map to `posterUrl: undefined`; `Slide` falls back to gradient or `video.posterUrl`. Series posters are `picsum`. | No poster generation pipeline (ffmpeg 720x1280 at 1.2s) in feed path. |
| **Series as playlist** | `SERIES_DATA` is static mock in `src/components/series/data.ts`; `getSeriesForHandle` hardcodes 3 handles. | Not D1-driven for feed; playlist `activePlaylist` is client-only state. |

## 3. What's Remaining (ordered)

1. **Real H3 generation on scroll** — wire `workers/queue-consumer` `h3.generate` to call `generateH3ImageToVideoLora({image, last_image, loras, prompt})` (needs `WAVESPEED_API_KEY`), upload real MP4 to `UPLOADS`, generate poster (ffmpeg), then `UPDATE videos status ready`. Currently mock 4-byte blob blocks any realism gate.
2. **Real R2 delivery** — replace fallback `test-videos` URLs with signed/presigned `UPLOADS` URLs or `cdn.veilwick.com` via R2 public bucket. Remove `FALLBACK_VIDEOS` hardcode once D1 has ready rows; keep as empty-state only.
3. **Authenticated personalized feed** — pass real `userId` (auth session) to `GET /api/feed?personalized=true` instead of `x-user-id` header / anon. Fix `app/api/feed/route.ts:70 userId=null` override. Verify `getRankedCategoriesForUser` updates `userProfileJson.affinity` and `orderByAffinity` actually reorders returned rows (currently splits limit after sort; should sort before slice).
4. **Infinite scroll (real pagination)** — fix server `limit(20)` to `limit(limit)`; return `{videos, hasMore, nextOffset}`; make client `loadMore` append only real rows and stop fabricating `tail` clones. Add cursor or `createdAt` pagination to avoid `offset` skip drift.
5. **Likes persistence** — add `video_likes` or increment on `videoTable`, expose `POST /api/feed/{id}/like` (idempotent), return updated counts, make `Slide` heart reflect server state. Wire `trackAction` success to optimistic UI.
6. **Comments & shares** — implement `comments` table + `GET/POST /api/feed/{id}/comments`, share telemetry distinct from like. Currently comment count is static 512..3733 from fallback.
7. **Buffer / prefetch tuning** — after real generation, tune `buffer < 2` threshold vs H3 latency (~30-60s). Current 3s throttle may under-fill; needs `pending` polling or SSE for `status:ready` transition so spinner resolves when clip becomes ready.
8. **Consumer bindings** — `cloudflare/app-worker/wrangler.jsonc` declares `queues.producers` only; add `queues.consumers` for `template-outbox` -> `workers/queue-consumer` (currently separate worker, not bound). Without consumer binding, `OUTBOX_QUEUE.send` is fire-and-forget with no delivery in production.
9. **Stitch continuity** — populate `firstFrameUrl/lastFrameUrl` (extract last frame of ready video) and pass `last_image` on next enqueue for seamless 5s segments / series E2..E5 per `src/lib/wavespeed.ts:399`.

## 4. File Map (requested paths)

```
app/(app)/feed/page.tsx              — server wrapper, exports FeedClient + 2257 footer
app/(app)/feed/feed-client.tsx       — 668 lines, full feed shell (see §1)
app/api/feed/route.ts                — GET with KV cache, D1 ready, affinity, enqueue
app/api/feed/prefetch/route.ts       — POST buffer<2 enqueue
src/lib/wavespeed.ts                 — 637 lines, H3+Wan, FEED_CATEGORIES 8, prompts/tags, LoRA MysticXXX
src/lib/h3.ts                        — h3R2Key + stub generateH3Video
src/db/schema/veilwick.ts            — videoTable / userInteractionsTable / streamTable
src/types/feed.ts                    — FeedVideo / Creator / FeedCategory (8+legacy)
src/hooks/useFeedInstrumentation.ts  — watchMs/scrollDepth/like instrumentation
src/lib/personalization.ts           — WEIGHTS, computeAffinity, getRankedCategoriesForUser
workers/queue-consumer/src/index.ts  — h3.generate mock upload (stub)
packages/jobs/src/h3-jobs.ts         — H3GenerateJob schema + enqueueH3Job
cloudflare/app-worker/wrangler.jsonc — D1/KV/R2/Queue producer bindings
src/db/migrations/0006_veilwick_feed.sql — videos + streams DDL
```

## 5. Verdict

Feed vertical is **UI-complete, data-stubbed**. Ship-readiness blocked on (1) real H3 R2 upload and (2) queue consumer binding. Personalization and engagement (likes/comments) are instrumented but not user-visible. Pagination + infinite scroll scaffold works only because tail duplication masks empty D1.

*Generated from repo read 2026-09-01; no runtime executed. Run `bun run db:migrate:local` + miniflare with `WAVESPEED_API_KEY` and inspect `wrangler d1 execute template-db --local --command "select count(*) from videos where status='ready'"` to confirm stub vs ready state.*
