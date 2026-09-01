/**
 * Minimal SSE-over-fetch parser for the visitor widget.
 *
 * Why fetch instead of EventSource: EventSource doesn't support cookies or
 * custom headers cross-origin and only emits string events. Our public
 * stream endpoint is POST + cookie-authenticated + JSON-payload, so we
 * read the body as a stream and split on the SSE delimiter.
 *
 * The parser is decoupled from the actual fetch call so we can unit-test
 * the framing logic without a network round-trip.
 */

export interface SseEvent {
  /** SSE `event:` field. Defaults to "message" per spec. */
  event: string;
  /** Concatenated `data:` field(s). May be JSON or plain text. */
  data: string;
}

/**
 * Parse a single SSE record (between two `\n\n` delimiters) into one event.
 * Empty records are returned as `null` so callers can skip them cleanly.
 */
export function parseSseRecord(record: string): SseEvent | null {
  if (!record.trim()) return null;
  let event = "message";
  const dataLines: string[] = [];
  for (const rawLine of record.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (!line || line.startsWith(":")) continue;
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const field = line.slice(0, colon);
    // SSE allows an optional space after the colon.
    const value = line.slice(colon + 1).replace(/^ /, "");
    if (field === "event") event = value;
    else if (field === "data") dataLines.push(value);
  }
  if (dataLines.length === 0) return null;
  return { event, data: dataLines.join("\n") };
}

/**
 * Async generator over an SSE stream from a fetch Response. Buffers across
 * chunk boundaries; yields one parsed `SseEvent` per `\n\n`-delimited
 * record.
 */
export async function* streamSseEvents(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<SseEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        // Flush any trailing record (server didn't emit a final \n\n).
        if (buffer.trim()) {
          const evt = parseSseRecord(buffer);
          if (evt) yield evt;
        }
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      // Records are separated by `\n\n` (LF) per the SSE spec, but also
      // tolerate `\r\n\r\n` for HTTP/proxy variants.
      while (true) {
        const sep = buffer.search(/\r?\n\r?\n/);
        if (sep === -1) break;
        const record = buffer.slice(0, sep);
        const matched = buffer.slice(sep).match(/^\r?\n\r?\n/);
        const advance = matched ? matched[0].length : 2;
        buffer = buffer.slice(sep + advance);
        const evt = parseSseRecord(record);
        if (evt) yield evt;
      }
    }
  } finally {
    reader.releaseLock();
  }
}
