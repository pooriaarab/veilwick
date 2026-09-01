/**
 * Spike: transactional outbox on D1 + Queue drain.
 *
 * Validates the pattern that replaces the legacy Firestore
 * onMessageCreated trigger in the Cloudflare migration.
 *
 * Key invariant: a message row and its outbox row are written in ONE
 * D1 batch() (a single transaction). If the worker crashes before the
 * drain runs, the outbox row is still committed and the next drain
 * picks it up. This is the fix for the "enqueue-after-commit can't be
 * made atomic" bug that an enqueue-after-insert approach has.
 *
 * The queue consumer is at-least-once, so it dedupes via the
 * `delivered` table keyed by message_id.
 */

interface Env {
  DB: D1Database;
  OUTBOX_QUEUE: Queue<OutboxPayload>;
}

interface OutboxPayload {
  messageId: string;
  workspaceId: string;
  content: string;
}

const json = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });

// --- helpers --------------------------------------------------------------

function uuid(): string {
  // Workers runtime crypto.randomUUID
  return crypto.randomUUID();
}

async function createMessageWithOutbox(
  db: D1Database,
  input: { workspaceId: string; threadId: string; role: string; content: string },
): Promise<{ messageId: string; outboxId: string }> {
  const messageId = uuid();
  const outboxId = uuid();
  const now = new Date().toISOString();

  // THE spike: both inserts in a single batch() = one transaction.
  // If this isn't atomic, the whole pattern is invalid.
  const results = await db.batch([
    db
      .prepare(
        "INSERT INTO messages (id, workspace_id, thread_id, role, content, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .bind(messageId, input.workspaceId, input.threadId, input.role, input.content, now),
    db
      .prepare(
        "INSERT INTO outbox (id, message_id, payload, status, attempts, created_at) VALUES (?, ?, ?, 'pending', 0, ?)",
      )
      .bind(
        outboxId,
        messageId,
        JSON.stringify({
          messageId,
          workspaceId: input.workspaceId,
          content: input.content,
        } satisfies OutboxPayload),
        now,
      ),
  ]);

  const wrote = results.every((r) => r.meta.changes > 0);
  if (!wrote) {
    throw new Error("batch did not write all rows; atomicity assumption broken");
  }
  return { messageId, outboxId };
}

// Drain pending outbox rows: enqueue each, then mark sent.
// At-least-once: if send succeeds but the UPDATE fails, the next drain
// re-sends; the consumer dedupes via the `delivered` table.
async function drainOutbox(env: Env, limit = 50): Promise<{ drained: number; enqueued: number }> {
  const pending = await env.DB.prepare(
    "SELECT id, message_id, payload, attempts FROM outbox WHERE status = 'pending' LIMIT ?",
  ).bind(limit);

  const rows = (await pending.all<{
    id: string;
    message_id: string;
    payload: string;
    attempts: number;
  }>()).results;

  if (rows.length === 0) return { drained: 0, enqueued: 0 };

  let enqueued = 0;
  const sentIds: string[] = [];

  for (const row of rows) {
    try {
      const payload = JSON.parse(row.payload) as OutboxPayload;
      await env.OUTBOX_QUEUE.send(payload);
      enqueued += 1;
      sentIds.push(row.id);
    } catch (err) {
      console.error("enqueue failed for outbox row", row.id, err);
      // bump attempts; the row stays pending for the next drain
      await env.DB.prepare(
        "UPDATE outbox SET attempts = attempts + 1 WHERE id = ?",
      ).bind(row.id);
    }
  }

  if (sentIds.length > 0) {
    const placeholders = sentIds.map(() => "?").join(",");
    await env.DB.prepare(
      `UPDATE outbox SET status = 'sent', sent_at = ? WHERE id IN (${placeholders})`,
    ).bind(new Date().toISOString(), ...sentIds).run();
  }

  return { drained: rows.length, enqueued };
}

// --- fetch handler --------------------------------------------------------

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // POST /messages { workspaceId, threadId, role, content }
    // -> writes message + outbox atomically (the core validation).
    if (url.pathname === "/messages" && request.method === "POST") {
      const body = (await request.json()) as {
        workspaceId: string;
        threadId: string;
        role: string;
        content: string;
      };
      const created = await createMessageWithOutbox(env.DB, body);
      return json({ ok: true, ...created }, { status: 201 });
    }

    // GET /messages -> list (proves the message row landed)
    if (url.pathname === "/messages" && request.method === "GET") {
      const res = await env.DB.prepare(
        "SELECT id, workspace_id, thread_id, role, content, created_at FROM messages ORDER BY created_at DESC LIMIT 50",
      ).all();
      return json({ messages: res.results });
    }

    // GET /outbox -> outbox state (pending vs sent) to observe drain
    if (url.pathname === "/outbox" && request.method === "GET") {
      const res = await env.DB.prepare(
        "SELECT id, message_id, status, attempts, created_at, sent_at FROM outbox ORDER BY created_at DESC LIMIT 50",
      ).all();
      return json({ outbox: res.results });
    }

    // POST /__drain -> manually trigger the drain (simulates cron early)
    if (url.pathname === "/__drain" && request.method === "POST") {
      const result = await drainOutbox(env);
      return json({ drained: result });
    }

    // GET /delivered -> idempotent-delivery log
    if (url.pathname === "/delivered" && request.method === "GET") {
      const res = await env.DB.prepare(
        "SELECT message_id, delivered_at FROM delivered ORDER BY delivered_at DESC LIMIT 50",
      ).all();
      return json({ delivered: res.results });
    }

    return json({
      routes: [
        "POST /messages",
        "GET /messages",
        "GET /outbox",
        "POST /__drain",
        "GET /delivered",
      ],
    });
  },

  // Cron drain: runs every minute via `triggers.crons`. In local dev we can
  // also hit POST /__drain to drain without waiting.
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    const result = await drainOutbox(env);
    console.log("scheduled drain", result);
    ctx.waitUntil(Promise.resolve());
  },

  // Queue consumer: idempotent delivery via the `delivered` table.
  async queue(
    batch: MessageBatch<OutboxPayload>,
    env: Env,
  ): Promise<void> {
    for (const msg of batch.messages) {
      const payload = msg.body;
      try {
        // idempotency: INSERT OR IGNORE; a re-delivery of the same messageId
        // is a no-op.
        const ins = await env.DB.prepare(
          "INSERT OR IGNORE INTO delivered (message_id, delivered_at) VALUES (?, ?)",
        ).bind(payload.messageId, new Date().toISOString()).run();

        if (ins.meta.changes > 0) {
          // simulate the real side effect (e.g. dispatch webhook)
          console.log("[delivered] dispatching for message", payload.messageId);
        } else {
          console.log("[dedup] already delivered", payload.messageId);
        }
        msg.ack();
      } catch (err) {
        console.error("consumer error", payload.messageId, err);
        msg.retry();
      }
    }
  },
};
