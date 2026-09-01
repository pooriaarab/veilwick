/**
 * Visitor public-API client. All methods require `credentials: "include"`
 * so the `mt_visitor` cookie travels cross-origin.
 */

import { streamSseEvents, type SseEvent } from "./sse";

export interface VisitorThread {
  id: string;
  agentId: string;
  workspaceId: string;
  visibility: "public";
  actor: "visitor";
  title: string;
  status: "open" | "archived";
  messageCount: number;
}

export interface VisitorMessage {
  id: string;
  threadId: string;
  role: "user" | "assistant" | "tool" | "system";
  content: string;
  createdAt: string;
}

export interface ApiErrorEnvelope {
  code: string;
  title: string;
  detail: string;
  action?: string;
}

export class VisitorApiError extends Error {
  status: number;
  envelope: ApiErrorEnvelope;
  constructor(status: number, envelope: ApiErrorEnvelope) {
    super(envelope.title);
    this.status = status;
    this.envelope = envelope;
  }
}

export interface ClientConfig {
  apiBase: string;
  agentId: string;
  publicKey: string;
}

async function parseError(res: Response): Promise<VisitorApiError> {
  let envelope: ApiErrorEnvelope = {
    code: "VISITOR_REQUEST_FAILED",
    title: "We couldn't reach the chat server",
    detail:
      "Your message wasn't sent. The server may be temporarily unavailable.",
    action: "Try again in a moment.",
  };
  try {
    const body = (await res.json()) as { error?: ApiErrorEnvelope };
    if (body.error) envelope = body.error;
  } catch {
    // ignore JSON parse failure — keep default envelope
  }
  return new VisitorApiError(res.status, envelope);
}

export async function createVisitorThread(
  cfg: ClientConfig,
): Promise<VisitorThread> {
  const res = await fetch(`${cfg.apiBase}/api/v1/public/threads`, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      agentId: cfg.agentId,
      publicKey: cfg.publicKey,
    }),
  });
  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function appendVisitorMessage(
  cfg: ClientConfig,
  threadId: string,
  content: string,
  captchaToken: string | null = null,
): Promise<VisitorMessage> {
  const res = await fetch(
    `${cfg.apiBase}/api/v1/public/threads/${encodeURIComponent(threadId)}/messages`,
    {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        content,
        publicKey: cfg.publicKey,
        captchaToken,
      }),
    },
  );
  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function* streamVisitorReply(
  cfg: ClientConfig,
  threadId: string,
): AsyncGenerator<SseEvent> {
  const res = await fetch(
    `${cfg.apiBase}/api/v1/public/threads/${encodeURIComponent(threadId)}/stream`,
    {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ publicKey: cfg.publicKey }),
    },
  );
  if (!res.ok) throw await parseError(res);
  if (!res.body) {
    throw new VisitorApiError(500, {
      code: "VISITOR_STREAM_EMPTY",
      title: "We didn't get a reply",
      detail: "The server didn't return a streamable response.",
      action: "Try sending another message.",
    });
  }
  yield* streamSseEvents(res.body);
}
