import type { Metadata } from "next";
import { FeedClient } from "./feed-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Feed — VeilWick",
  description: "Vertical video feed (wellness only, adults only).",
  robots: { index: false, follow: false },
};

export default function FeedPage() {
  return (
    <>
      <FeedClient />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/80 px-4 py-2 text-center text-[10px] leading-relaxed text-white/50 backdrop-blur-sm">
        <p>
          <strong>18 U.S.C. § 2257 — Fictional Demo:</strong> All depictions are
          performed by consenting adults 18+ or are entirely synthetic. No real persons
          are depicted. {new Date().getFullYear()} VeilWick.
        </p>
      </div>
    </>
  );
}