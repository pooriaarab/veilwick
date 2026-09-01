"use client";

import { useState } from "react";
import { cn } from "@template/ui";
import type { Series, SeriesCategory } from "./data";
import { SERIES_CATEGORIES } from "./data";

interface SeriesGridProps {
  series: Series[];
  onSelect: (s: Series) => void;
}

export function SeriesGrid({ series, onSelect }: SeriesGridProps) {
  const [activeFilter, setActiveFilter] = useState<SeriesCategory>("All");

  const filtered =
    activeFilter === "All" ? series : series.filter((s) => s.category === activeFilter);

  return (
    <div>
      {/* filters */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {SERIES_CATEGORIES.map((cat) => {
          const active = cat === activeFilter;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
                active
                  ? "bg-white text-black shadow"
                  : "bg-white/10 text-white/80 hover:bg-white/15 hover:text-white border border-white/10"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s)}
            className="group text-left"
          >
            <span className="relative block overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10 aspect-[9/16] sm:aspect-[720/1280]">
              {/* poster 720x1280 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.posterUrl}
                alt={s.title}
                width={720}
                height={1280}
                loading="lazy"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              />
              {/* gradient */}
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              {/* top badge */}
              <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm ring-1 ring-white/10">
                {s.category}
              </span>
              {/* epis badge */}
              <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-black">
                5 Ep
              </span>
              {/* title */}
              <span className="absolute inset-x-0 bottom-0 p-3">
                <span className="line-clamp-2 text-sm font-bold leading-tight text-white drop-shadow">
                  {s.title}
                </span>
                <span className="mt-1 block text-[11px] font-medium text-white/60">HD · Synthetic 18+</span>
              </span>
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-white/50">No series in this category.</p>
      )}
    </div>
  );
}
