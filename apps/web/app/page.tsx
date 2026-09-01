import { LandingHeader } from "@/components/landing/landing-header";
import { HeroSection } from "@/components/landing/hero-section";
import { IntegrationMarquee } from "@/components/landing/integration-marquee";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQSection } from "@/components/landing/faq-section";
import { Footer } from "@/components/landing/footer";
import { Button } from "@template/ui/primitives/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "VeilWick — Spicy wellness, synthetic & adults only",
  description:
    "VeilWick is a synthetic wellness feed + livestream. Yoga, fitness, breathwork — AI-generated, fictional adults 18+ only. Watch the feed or go live.",
};

function CTAFooter() {
  return (
    <section className="py-16 sm:py-24 px-5">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-fluid-xl sm:text-3xl font-bold tracking-tight mb-3">
          Spicy wellness — synthetic, adults only
        </h2>
        <p className="text-muted-foreground mb-2">
          AI-generated wellness content for the discerning viewer.
        </p>
        <p className="text-xs text-muted-foreground/70 mb-6">
          18+ only · Fictional demo · No real persons depicted · Wan 2.4-14B synthetic
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/feed">
              Browse Feed
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/live/yoga">
              Live Yoga
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main>
        <HeroSection />
        <IntegrationMarquee />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <FAQSection />
        <CTAFooter />
      </main>
      <Footer />
      <div className="border-t border-border bg-muted/30 px-5 py-3 text-center text-[10px] leading-relaxed text-muted-foreground">
        <p>
          <strong>18 U.S.C. \u00A7 2257 Compliance Notice — Fictional Demo:</strong>{" "}
          This is a fictional demo environment. All visual depictions displayed on this
          site, whether of actual persons or otherwise, are performed by consenting
          adults who were at least 18 years of age at the time of depiction, or are
          entirely synthetic/AI-generated content that does not depict real persons.
          The site operator maintains all required records for content produced by its
          employees. For third-party content, this site relies on the producers{" "}
          compliance with 2257. No real persons are depicted in any adult content. — VeilWick {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
