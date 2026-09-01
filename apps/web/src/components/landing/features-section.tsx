import { Film, Radio, ShieldCheck, Sparkles, Users, Zap } from "lucide-react";

const features = [
  {
    icon: Film,
    title: "Vertical Feed",
    description:
      "TikTok-style swipe feed — yoga, fitness, activewear, breathwork. All synthetic, all fictional adults 18+.",
  },
  {
    icon: Radio,
    title: "Mock Live (HLS-ready)",
    description:
      "Live rooms per category (/live/yoga etc) with live badge, chat mock, and HLS slot for Vast/Wan output.",
  },
  {
    icon: Sparkles,
    title: "Wan 2.4-14B",
    description:
      "24GB VRAM on 4090 ($0.30/hr Vast) — 200+ Civitai wellness LoRAs, no custom training needed.",
  },
  {
    icon: ShieldCheck,
    title: "18+ Gate + 2257 Footer",
    description:
      "Age gate (localStorage + KV flag) + 2257 compliance footer on feed, live, and landing.",
  },
  {
    icon: Zap,
    title: "Edge-native Stack",
    description:
      "Next 15 + OpenNext on Cloudflare Workers, D1 (videos/streams), R2 mock, KV FLAGS, Queue OUTBOX.",
  },
  {
    icon: Users,
    title: "Better Auth + Login",
    description:
      "Email/password login today, org-ready. Create an account or use the demo login below.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-24 px-5 scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl mb-12 sm:mb-16">
          <p className="text-sm font-medium text-muted-foreground mb-2 tracking-wide uppercase">
            Capabilities
          </p>
          <h2 className="text-fluid-xl sm:text-3xl font-bold tracking-tight mb-3">
            Synthetic wellness, edge-native
          </h2>
          <p className="text-muted-foreground text-fluid-sm sm:text-base">
            Feed + livestream demo built on the Cloudflare master template — re-skinned for VeilWick.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-fade-in">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative p-5 sm:p-6 rounded-xl border border-border bg-card hover:border-foreground/10 transition-colors"
            >
              <div className="size-9 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:bg-foreground/[0.06] transition-colors">
                <f.icon className="size-[18px] text-foreground" />
              </div>
              <h3 className="text-sm font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
