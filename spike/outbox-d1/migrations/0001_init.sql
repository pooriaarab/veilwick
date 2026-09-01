-- Spike schema: messages + outbox to validate transactional-outbox on D1.
-- Mirrors the planned pattern for the Firestore onMessageCreated -> Queue replacement.

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  thread_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);

-- Outbox row is written in the SAME D1 batch() as the message -> atomic.
-- status: pending -> sent. A crash between commit and drain leaves a pending row
-- that the next drain picks up, so there is no dual-write drift.
CREATE TABLE IF NOT EXISTS outbox (
  id TEXT PRIMARY KEY,
  message_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  sent_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_outbox_status ON outbox(status);

CREATE TABLE IF NOT EXISTS delivered (
  -- consumer-side idempotency log: dedupe re-delivery from at-least-once queue
  message_id TEXT PRIMARY KEY,
  delivered_at TEXT NOT NULL
);
