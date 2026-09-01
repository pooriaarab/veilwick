"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AgeGate } from "@/components/age-gate";

/**
 * Route-group layout for app pages (feed, content, etc.).
 * Checks the veilwick_age_verified cookie and the KV-backed age-gate flag.
 * /legal/2257 is public and must not show the blocking age gate.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [ageGateEnabled, setAgeGateEnabled] = useState(true);

  const isPublicLegal = pathname === "/legal/2257" || pathname?.startsWith("/legal/2257/");

  useEffect(() => {
    if (isPublicLegal) {
      setAgeGateEnabled(false);
      return;
    }
    // Fetch KV-backed flag — public endpoint, no auth required
    fetch("/api/flags/age-gate")
      .then((res) => (res.ok ? res.json() : { enabled: true }))
      .then((data: unknown) => {
        const enabled =
          typeof data === "object" && data !== null && "enabled" in data
            ? Boolean((data as { enabled?: unknown }).enabled)
            : true;
        setAgeGateEnabled(enabled);
      })
      .catch(() => {
        /* default to enabled */
      });
  }, [isPublicLegal]);

  return (
    <>
      <AgeGate enabled={ageGateEnabled && !isPublicLegal} />
      {children}
    </>
  );
}
