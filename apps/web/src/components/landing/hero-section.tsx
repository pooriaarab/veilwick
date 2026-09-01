import Link from "next/link";
import { Button } from "@template/ui/primitives/button";
import { Badge } from "@template/ui/primitives/badge";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-5">
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="secondary" className="mb-6 font-normal gap-1.5">
          <Sparkles className="size-3.5" />
          Synthetic · Wan 2.4-14B · 18+ only
        </Badge>

        <h1 className="text-fluid-2xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-foreground mb-5">
          Spicy wellness,{" "}
          <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
            synthetic & private
          </span>
        </h1>

        <p className="text-fluid-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-2">
          VeilWick is a vertical video feed + livestream for yoga, fitness,
          activewear & breathwork — entirely AI-generated, fictional adults 18+.
        </p>

        <p className="text-fluid-sm sm:text-base font-medium text-foreground/70 mb-8">
          No real persons depicted. Wan 2.4-14B on Vast · Civitai LoRAs · local D1 + R2.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/feed">
              <Play className="size-4" />
              Browse Feed
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/live/yoga">Watch Live</Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Open at <code className="rounded bg-muted px-1.5 py-0.5">http://localhost:8788</code> · Feed: <code className="rounded bg-muted px-1.5 py-0.5">/feed</code> · Live: <code className="rounded bg-muted px-1.5 py-0.5">/live/yoga</code>
        </p>
      </div>
    </section>
  );
}
