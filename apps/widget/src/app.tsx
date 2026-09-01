import { useState } from "preact/hooks";
import {
  appendVisitorMessage,
  createVisitorThread,
  streamVisitorReply,
  VisitorApiError,
  type ClientConfig,
} from "./api";

interface UiMessage {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
}

interface AppProps {
  config: ClientConfig;
}

let nextId = 1;
const localId = () => `local_${nextId++}`;

export function App({ config }: AppProps) {
  const [open, setOpen] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  const ensureThread = async (): Promise<string> => {
    if (threadId) return threadId;
    const t = await createVisitorThread(config);
    setThreadId(t.id);
    return t.id;
  };

  const appendUi = (m: UiMessage) =>
    setMessages((prev) => [...prev, m]);
  const updateLastAssistant = (text: string) =>
    setMessages((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].role === "assistant") {
          next[i] = { ...next[i], content: text };
          break;
        }
      }
      return next;
    });

  const handleSend = async (e: Event) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content || busy) return;
    setBusy(true);
    setDraft("");
    appendUi({ id: localId(), role: "user", content });

    try {
      const tid = await ensureThread();
      await appendVisitorMessage(config, tid, content);

      // Placeholder assistant bubble that streams in.
      const assistantId = localId();
      appendUi({ id: assistantId, role: "assistant", content: "" });
      let acc = "";
      for await (const evt of streamVisitorReply(config, tid)) {
        if (evt.event === "done") break;
        if (evt.event === "error") {
          let detail = "We didn't get a reply.";
          try {
            const parsed = JSON.parse(evt.data) as { detail?: string };
            if (parsed.detail) detail = parsed.detail;
          } catch {
            /* ignore */
          }
          appendUi({ id: localId(), role: "error", content: detail });
          break;
        }
        try {
          const data = JSON.parse(evt.data) as {
            type?: string;
            delta?: { text?: string; type?: string };
          };
          if (
            data.type === "content_block_delta" &&
            data.delta?.type === "text_delta" &&
            typeof data.delta.text === "string"
          ) {
            acc += data.delta.text;
            updateLastAssistant(acc);
          }
        } catch {
          /* skip non-JSON events */
        }
      }
    } catch (err) {
      const envelope =
        err instanceof VisitorApiError
          ? err.envelope
          : {
              code: "VISITOR_REQUEST_FAILED",
              title: "We couldn't send your message",
              detail: "The chat server didn't respond.",
              action: "Try again in a moment.",
            };
      const message = `${envelope.title}. ${envelope.detail}${envelope.action ? ` ${envelope.action}` : ""}`;
      appendUi({ id: localId(), role: "error", content: message });
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        class="mt-vw-bubble"
        aria-label="Open chat"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
          />
        </svg>
      </button>
    );
  }

  return (
    <div class="mt-vw-panel" role="dialog" aria-label="Chat">
      <div class="mt-vw-header">
        <h3>Chat</h3>
        <button
          type="button"
          class="mt-vw-close"
          aria-label="Close chat"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
      </div>
      <div class="mt-vw-messages">
        {messages.length === 0 ? (
          <div class="mt-vw-empty">Send a message to start the conversation.</div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              class={`mt-vw-msg mt-vw-msg-${m.role}`}
              data-testid={`mt-vw-msg-${m.role}`}
            >
              {m.content}
            </div>
          ))
        )}
      </div>
      <form class="mt-vw-input-row" onSubmit={handleSend}>
        <input
          class="mt-vw-input"
          type="text"
          value={draft}
          placeholder="Type a message..."
          aria-label="Message"
          onInput={(e) =>
            setDraft((e.currentTarget as HTMLInputElement).value)
          }
          disabled={busy}
        />
        <button type="submit" class="mt-vw-send" disabled={busy || !draft.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
