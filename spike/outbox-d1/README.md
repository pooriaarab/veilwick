# Spike: Transactional Outbox on D1 + Queue

**Status: PASSED** (2026-07-10). Throwaway spike validating the riskiest architectural piece of the Cloudflare migration: the pattern that replaces the legacy Firestore `onMessageCreated` trigger.

## What it validates

The opus advisory review flagged that "enqueue-after-commit can't be made atomic." This spike proves the fix: a **transactional outbox** where the message row and its outbox row are written in a single D1 `batch()` (one transaction). If the worker crashes before the drain runs, the outbox row is still committed and the next drain picks it up — no dual-write drift.

## Pattern

```
POST /messages
  -> db.batch([
       INSERT message,
       INSERT outbox(status='pending'),
     ])                       // atomic: both commit together

drain (cron every 1m, or POST /__drain)
  -> SELECT pending outbox rows
  -> for each: env.OUTBOX_QUEUE.send(payload)
  -> UPDATE outbox SET status='sent' WHERE id IN (...)
                              // at-least-once; consumer must dedupe

queue consumer
  -> INSERT OR IGNORE INTO delivered(message_id)
  -> if changes>0: dispatch side effect (e.g. webhook)
  -> ack() / retry()          // re-delivery is a no-op
```

## Result

End-to-end run against `wrangler dev --local` (miniflare D1 + Queue, zero credentials):

| Step | Check | Result |
|---|---|---|
| POST /messages | message + outbox both written in one batch | ✅ |
| GET /outbox | new row status=pending | ✅ |
| POST /__drain | drained N, enqueued N | ✅ |
| GET /outbox after drain | status=sent | ✅ |
| GET /delivered | consumer processed via queue | ✅ |
| second drain | drained 0 (no stuck rows) | ✅ |
| re-delivery | delivered count unchanged (INSERT OR IGNORE dedup) | ✅ |

## Bug found by the spike

The first run revealed the drain's "mark sent" `UPDATE` was prepared and bound but **never executed** (missing `.run()`). The row stayed pending and re-drained forever; only the consumer-side idempotency table hid the symptom. Fixed in `src/index.ts`. This is exactly the class of bug the spike exists to catch before it reaches the template scaffold.

## Run it

```bash
cd spike/outbox-d1
bun install
bunx wrangler d1 migrations apply outbox-spike --local
bun run dev    # http://localhost:8787
# in another shell:
curl -X POST localhost:8787/messages -H 'content-type: application/json' \
  -d '{"workspaceId":"ws_1","threadId":"th_1","role":"user","content":"hi"}'
curl -X POST localhost:8787/__drain
curl localhost:8787/outbox
curl localhost:8787/delivered
```

## What this does NOT validate (deferred)

- Better Auth on D1 — well-trodden Workers path; validate when porting a real auth route.
- Vercel AI SDK streaming — needs a provider API key to truly stream; opus review noted I/O wait doesn't count against CPU time so the risk is low.
- OpenNext / Next.js on Workers (the 48-route Node-compat risk) — validate when scaffolding the real template app, not in this standalone worker.

## Decision

The transactional-outbox-on-D1 pattern is sound. Carry it into the template's message-creation path verbatim.
