import type { Metadata } from "next";
import { SeriesPageClient } from "./series-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Series — VeilWick",
  description: "Candy.ai-style series grid — synthetic 18+ only.",
  robots: { index: false, follow: false },
};

export default function SeriesPage() {
  return <SeriesPageClient />;
}
