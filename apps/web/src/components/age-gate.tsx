"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@template/ui/primitives/dialog";
import { Button } from "@template/ui/primitives/button";

const STORAGE_KEY = "veilwick:age-verified:v1";
const COOKIE_NAME = "veilwick_age_verified";

/**
 * 18+ gate. Blocks the UI until the visitor confirms they're an adult.
 * Confirmation is persisted in both localStorage and httpOnly cookie (1 year).
 * - localStorage is checked first for immediate UI.
 * - httpOnly cookie veilwick_age_verified is set via POST /api/age-verGate and
 *   verified server-side by middleware for /feed, /series, /live, /api/feed, /api/series.
 * Bypass entirely by passing `enabled={false}` (KV-backed flag).
 */
export function AgeGate({
  title = "Adults only",
  description,
  enabled = true,
}: {
  title?: string;
  description?: string;
  /** KV-backed flag — pass `false` to disable the gate (dev, etc.). */
  enabled?: boolean;
}) {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    try {
      const ls = window.localStorage.getItem(STORAGE_KEY) === "1";
      const hasCookie = document.cookie
        .split("; ")
        .some((c) => c.startsWith(`${COOKIE_NAME}=1`));
      setVerified(ls || hasCookie);
    } catch {
      setVerified(false);
    }
  }, []);

  const confirm = async () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
      const expires = new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000,
      ).toUTCString();
      // Non-httpOnly fallback for client read; server httpOnly is set via POST
      document.cookie = `${COOKIE_NAME}=1; path=/; expires=${expires}; SameSite=Lax`;
    } catch {
      // storage unavailable
    }
    // Set httpOnly cookie via server (required by middleware)
    try {
      await fetch("/api/age-verGate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ verified: true }),
        credentials: "same-origin",
      });
    } catch {
      // fallback: try alias
      try {
        await fetch("/api/age-gate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ verified: true }),
          credentials: "same-origin",
        });
      } catch {
        // ignore
      }
    }
    setVerified(true);
  };

  if (!enabled) return null;

  return (
    <Dialog open={!verified} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="max-w-sm text-center">
        <DialogHeader>
          <ShieldAlert className="mx-auto size-10 text-amber-400" />
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>
            {description ??
              "This area of VeilWick is for adults only. You must be 18 or older to continue."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col">
          <Button className="w-full" onClick={confirm}>
            I am 18 or older — Enter
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Exit to safety</Link>
          </Button>
        </DialogFooter>
        <p className="text-xs text-muted-foreground">
          Fictional demo environment. No real persons are depicted.
        </p>
      </DialogContent>
    </Dialog>
  );
}
