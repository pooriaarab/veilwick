"use client";

import Link from "next/link";
import { Button } from "@template/ui/primitives/button";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Feed", href: "/feed" },
  { label: "Live", href: "/live/yoga" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-subtle"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-5 h-14 sm:h-16">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="size-7 rounded-lg bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center">
            <span className="text-white text-sm font-black leading-none">V</span>
          </div>
          <span className="text-base font-black tracking-tight">
            Veil<span className="text-amber-500">W</span>ick
          </span>
          <span className="hidden sm:inline text-[10px] font-medium text-muted-foreground border border-border rounded-full px-1.5 py-0.5">
            18+ SYNTHETIC
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/feed">
              Open Feed
              <ArrowRight />
            </Link>
          </Button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-5 pb-4">
          <nav className="flex flex-col gap-1 mb-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="flex-1">
              <Link href="/feed">
                Open Feed
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
