"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Heart,
  Send,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@template/ui/primitives/button";
import { Input } from "@template/ui/primitives/input";
import { cn } from "@template/ui";

export interface LiveStream {
  category: string;
  categoryLabel: string;
  title: string;
  hostName: string;
  hostHandle: string;
  hostAvatar: string;
  videoUrl: string;
  posterUrl?: string;
  viewers: number;
  tags: string[];
}

interface ChatMessage {
  id: string;
  handle: string;
  text: string;
  isHost?: boolean;
  isCommand?: boolean;
}

const CHAT_COLORS = [
  "text-sky-300",
  "text-emerald-300",
  "text-amber-300",
  "text-violet-300",
  "text-rose-300",
];

const HOST_MESSAGES: Array<Omit<ChatMessage, "id">> = [
  { handle: "flowstate.mara", text: "Welcome in — grab a mat and breathe with me 🤍" },
  { handle: "kai.athome", text: "Drop a 🧘 if this stretch is hitting" },
  { handle: "veil.athleisure", text: "Code STILL10 saves 10% on the new set" },
  { handle: "solactive.kit", text: "Next segment: box breathing for the camera-shy" },
  { handle: "mara.popup", text: "Modifications on screen for tight hips" },
];

let messageSeq = 0;
const nextId = () => `m${++messageSeq}`;

function SeedChat(): ChatMessage[] {
  return [
    { id: nextId(), handle: "wellness.ria", text: "this flow fixed my neck, thank you" },
    { id: nextId(), handle: "matsandcats", text: "trying this during lunch break 🕐" },
    { id: nextId(), handle: "flowstate.mara", text: "Welcome in — grab a mat and breathe with me 🤍", isHost: true },
  ];
}

export function LiveClient({ stream }: { stream: LiveStream }) {
  const [messages, setMessages] = useState<ChatMessage[]>(SeedChat);
  const [draft, setDraft] = useState("");
  const [muted, setMuted] = useState(true);
  const [followed, setFollowed] = useState(false);
  const [viewers, setViewers] = useState(stream.viewers);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulated live viewer creep.
  useEffect(() => {
    const timer = setInterval(() => {
      setViewers((v) => v + Math.floor(Math.random() * 3));
    }, 5_000);
    return () => clearInterval(timer);
  }, []);

  // Simulated host chit-chat keeps the demo alive.
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      const msg = HOST_MESSAGES[index % HOST_MESSAGES.length];
      setMessages((prev) => [...prev.slice(-60), { ...msg, id: nextId() }]);
      index += 1;
    }, 12_000);
    return () => clearInterval(timer);
  }, []);

  // Keep the chat pinned to the newest message.
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = muted;
  }, [muted]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;

    // Command handling — commands start with !
    if (text.startsWith("!")) {
      console.log("[veilwick:command]", text);
      setMessages((prev) => [
        ...prev,
        { id: nextId(), handle: "you", text, isCommand: true },
      ]);
      setDraft("");

      // Parse !outfit <color> for demo feedback
      const outfitMatch = text.match(/^!outfit\s+(.+)/i);
      if (outfitMatch) {
        const color = outfitMatch[1];
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: nextId(),
              handle: "system",
              text: `🎭 outfit color set to "${color}" — synthetic preview applied`,
              isHost: true,
            },
          ]);
        }, 300);
      }
      return;
    }

    setMessages((prev) => [...prev, { id: nextId(), handle: "you", text }]);
    setDraft("");
  };

  return (
    <div className="min-h-dvh bg-zinc-950 text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Link href="/feed" aria-label="Back to feed">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <div className="leading-tight">
            <p className="text-sm font-bold">
              Veil<span className="text-amber-400">W</span>ick Live
            </p>
            <p className="text-xs text-white/50">{stream.categoryLabel}</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
          <Users className="size-3.5" />
          {viewers.toLocaleString()} watching
        </span>
      </header>

      <main className="mx-auto flex min-h-0 max-w-[1320px] flex-col gap-0 lg:h-[calc(100dvh-53px)] lg:flex-row">
        {/* stage */}
        <div className="relative h-[58dvh] w-full overflow-hidden bg-black lg:h-full lg:flex-1">
          <video
            ref={videoRef}
            src={stream.videoUrl}
            poster={stream.posterUrl}
            muted={muted}
            loop
            playsInline
            autoPlay
            preload="metadata"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

          {/* live badge */}
          <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-md bg-rose-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wide shadow-lg">
            <span className="size-2 animate-pulse rounded-full bg-white" />
            LIVE
          </span>
          <span className="absolute right-4 top-4 rounded-md bg-black/50 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
            {stream.categoryLabel}
          </span>

          {/* host panel */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={stream.hostAvatar}
                alt={stream.hostName}
                className="size-11 rounded-full border-2 border-white/70 object-cover"
              />
              <div className="leading-tight">
                <p className="flex items-center gap-1 text-sm font-bold drop-shadow">
                  {stream.hostName}
                  <BadgeCheck className="size-4 fill-sky-400 text-white" />
                  <span className="text-xs font-medium text-white/60">@{stream.hostHandle}</span>
                </p>
                <p className="text-xs text-white/80 drop-shadow">{stream.title}</p>
                <p className="mt-0.5 text-xs text-amber-300">{stream.tags.join(" · ")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
                size="icon"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
              </Button>
              <Button
                className="rounded-full"
                variant={followed ? "secondary" : "default"}
                onClick={() => setFollowed((f) => !f)}
              >
                <Heart className={cn("size-4", followed && "fill-rose-500 text-rose-500")} />
                {followed ? "Following" : "Follow"}
              </Button>
            </div>
          </div>
        </div>

        {/* chat panel */}
        <aside className="flex h-[360px] w-full flex-col border-t border-white/10 bg-zinc-950 lg:h-auto lg:w-[340px] lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <p className="text-sm font-bold">Live chat</p>
            <span className="text-xs text-white/50">{stream.categoryLabel}</span>
          </div>

          <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-4 py-3">
            {messages.map((msg, i) => (
              <p key={msg.id} className="text-sm leading-snug">
                <span
                  className={cn(
                    "font-semibold",
                    msg.isHost ? "text-amber-300" : CHAT_COLORS[i % CHAT_COLORS.length]
                  )}
                >
                  {msg.handle}
                </span>{" "}
                <span
                  className={cn(
                    msg.isCommand ? "text-amber-300 font-mono" : "text-white/85",
                    msg.handle === "you" && !msg.isCommand && "text-sky-200"
                  )}
                >
                  {msg.text}
                </span>
              </p>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form
            className="flex items-center gap-2 border-t border-white/10 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Say something kind… or try !outfit red"
              className="h-9 border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-amber-400/60 focus-visible:ring-amber-400/30"
            />
            <Button type="submit" size="icon" aria-label="Send" disabled={!draft.trim()}>
              <Send className="size-4" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  );
}