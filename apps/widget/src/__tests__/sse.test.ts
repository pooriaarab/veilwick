import { describe, it, expect } from "vitest";
import { parseSseRecord, streamSseEvents } from "../sse";

describe("parseSseRecord", () => {
  it("parses a default-event record", () => {
    expect(parseSseRecord("data: hello")).toEqual({
      event: "message",
      data: "hello",
    });
  });

  it("respects the optional space after the colon", () => {
    expect(parseSseRecord("data:no-space")).toEqual({
      event: "message",
      data: "no-space",
    });
  });

  it("uses the named event when provided", () => {
    expect(parseSseRecord("event: done\ndata: {}")).toEqual({
      event: "done",
      data: "{}",
    });
  });

  it("concatenates multiple data lines with a newline", () => {
    expect(parseSseRecord("data: first\ndata: second")).toEqual({
      event: "message",
      data: "first\nsecond",
    });
  });

  it("returns null for blank or comment-only records", () => {
    expect(parseSseRecord("")).toBeNull();
    expect(parseSseRecord(":heartbeat")).toBeNull();
  });
});

function makeStream(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  let i = 0;
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      if (i >= chunks.length) {
        controller.close();
        return;
      }
      controller.enqueue(encoder.encode(chunks[i++]));
    },
  });
}

describe("streamSseEvents", () => {
  it("yields events split across multiple chunks", async () => {
    const stream = makeStream([
      "data: hel",
      "lo\n\nevent: done\nd",
      "ata: {}\n\n",
    ]);
    const events = [];
    for await (const evt of streamSseEvents(stream)) events.push(evt);
    expect(events).toEqual([
      { event: "message", data: "hello" },
      { event: "done", data: "{}" },
    ]);
  });

  it("flushes a trailing record without a final delimiter", async () => {
    const stream = makeStream(["data: late"]);
    const events = [];
    for await (const evt of streamSseEvents(stream)) events.push(evt);
    expect(events).toEqual([{ event: "message", data: "late" }]);
  });

  it("tolerates CRLF delimiters", async () => {
    const stream = makeStream(["event: a\r\ndata: 1\r\n\r\n"]);
    const events = [];
    for await (const evt of streamSseEvents(stream)) events.push(evt);
    expect(events).toEqual([{ event: "a", data: "1" }]);
  });
});
