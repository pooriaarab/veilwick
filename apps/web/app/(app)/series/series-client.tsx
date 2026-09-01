"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SeriesGrid } from "@/components/series/SeriesGrid";
import { SeriesModal } from "@/components/series/SeriesModal";
import { SERIES_DATA, type Series } from "@/components/series/data";

export function SeriesPageClient() {
  const [selected, setSelected] = useState<Series | null>(null);

  return (
    <div className="min-h-dvh bg-zinc-950 text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/feed"
              className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/15"
              aria-label="Back to feed"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <h1 className="text-lg font-black tracking-tight">
                Veil<span className="text-amber-400">W</span>ick Series
              </h1>
              <p className="text-xs text-white/50">Secondary · TikTok-style playlists live in feed · Synthetic 18+</p>
            </div>
          </div>
          <Link href="/feed" className="hidden text-sm font-semibold text-white/70 hover:text-white sm:block">
            ← Back to feed
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
          <p className="text-xs font-semibold text-amber-200">Series are now playlists in the feed</p>
          <p className="mt-1 text-xs leading-relaxed text-white/60">
            No extra navigation needed. In <Link href="/feed" className="underline underline-offset-4 hover:text-white">/feed</Link> look under a creator (e.g. <span className="font-semibold text-white">@luna.bliss</span>) for <span className="font-semibold text-white">Playlist: Private Lessons (5)</span> — tap it to filter the feed to those 5 episodes (vertical swipe). E3–5 show <span className="rounded-full bg-fuchsia-600 px-1 py-0.5 text-[10px] font-bold text-white">New 🔒</span> and open the Upgrade to Premium paywall. This grid is kept as a secondary deep link only.
          </p>
        </div>
        <div className="mb-2">
          <h2 className="text-xl font-bold">Series (secondary)</h2>
          <p className="mt-1 text-sm text-white/50">
            Browse by fantasy · Tap a poster to watch. Episodes 1-2 free, 3-5 premium.
          </p>
        </div>

        <SeriesGrid series={SERIES_DATA} onSelect={setSelected} />

        <p className="mt-8 text-center text-[10px] leading-relaxed text-white/30">
          18+ only · All series are synthetic/AI-generated · No real persons depicted · Fictional demo
        </p>
      </main>

      <SeriesModal series={selected} open={!!selected} onClose={() => setSelected(null)} />

      {/* deep-link support: also allow direct navigation via /series/[id] */}
      <div className="sr-only">
        {SERIES_DATA.map((s) => (
          <Link key={s.id} href={`/series/${s.id}`}>
            {s.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
