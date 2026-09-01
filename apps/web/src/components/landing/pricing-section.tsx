import Link from "next/link";
import { Button } from "@template/ui/primitives/button";
import { Check } from "lucide-react";
import { cn } from "@template/ui/utils";

const plans = [
  {
    name: "Free",
    price: "Free",
    description: "Mock feed — browse synthetic wellness, no generation",
    features: [
      "Vertical feed: yoga, fitness, activewear, breathwork",
      "Mock live rooms (/live/yoga etc) with live badge + chat mock",
      "Age gate (localStorage + KV flag) + 2257 footer",
      "D1 + R2 mock storage — browse only, no Wan calls",
      "Community gallery — fictional adults 18+ only",
    ],
    cta: "Browse feed",
    href: "/feed",
    featured: false,
  },
  {
    name: "Creator",
    price: "$29",
    period: "/month",
    description: "Synthetic — Wan 2.4-14B + 200+ Civitai LoRAs",
    features: [
      "Everything in Free",
      "Wan 2.4-14B synthetic generation (5s clips, HLS-ready)",
      "200+ Civitai wellness LoRAs — merge on demand",
      "R2 video storage + poster pipeline (videos/{category}/{id}.mp4)",
      "Vast 4090 queue priority (24GB VRAM · $0.30/hr passthrough)",
      "Custom prompts per category + creator handles",
      "Prioritized mock-live → HLS ingest slot",
    ],
    cta: "Start creating",
    href: "/login",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Vast — self-host Wan on dedicated Vast.ai",
    features: [
      "Everything in Creator",
      "Self-hosted Vast.ai endpoint (swap HF_API_BASE for VAST_ENDPOINT)",
      "Dedicated 4090 + custom SLA — bring your own HF_TOKEN",
      "SSO/SAML + on-premise R2/D1 option",
      "Advanced security controls + 2257 record-keeping",
      "Dedicated support + private HLS ingest",
      "Queue + Cron Workers for background generation",
    ],
    cta: "Contact sales",
    href: "/contact",
    featured: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 sm:py-24 px-5 scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-sm font-medium text-muted-foreground mb-2 tracking-wide uppercase">
            Pricing
          </p>
          <h2 className="text-fluid-xl sm:text-3xl font-bold tracking-tight mb-3">
            Wellness tiers — mock to Vast
          </h2>
          <p className="text-muted-foreground text-fluid-sm sm:text-base">
            Start free on the mock feed, generate synthetic with Creator, scale on Vast.
            No real persons depicted — Wan 2.4-14B only.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-xl border p-6 sm:p-8 flex flex-col",
                plan.featured
                  ? "border-primary bg-card shadow-keystone"
                  : "border-border bg-card",
              )}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="size-4 text-success shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={plan.featured ? "default" : "outline"}
                className="w-full"
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
