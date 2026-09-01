import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeriesById, SERIES_DATA } from "@/components/series/data";
import { SeriesDetailClient } from "./series-detail-client";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return SERIES_DATA.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const series = getSeriesById(id);
  if (!series) return { title: "Series not found — VeilWick" };
  return {
    title: `${series.title} — VeilWick Series`,
    description: `${series.category} · 5 episodes · Synthetic 18+ — ${series.title}`,
    robots: { index: false, follow: false },
  };
}

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const series = getSeriesById(id);

  if (!series) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-950 px-6 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold">Series not found</h1>
          <p className="mt-2 text-sm text-white/60">No series matches “{id}”.</p>
          <Link href="/series" className="mt-6 inline-flex rounded-full bg-white px-6 py-2 text-sm font-bold text-black">
            Back to Series
          </Link>
        </div>
      </div>
    );
  }

  return <SeriesDetailClient series={series} />;
}
