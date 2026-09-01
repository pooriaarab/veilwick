import Link from "next/link";

const footerLinks = [
  { label: "Feed", href: "/feed" },
  { label: "Live", href: "/live/yoga" },
  { label: "Login", href: "/login" },
  { label: "Docs", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border pt-8 px-5 pb-4">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="size-6 rounded-md bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center">
            <span className="text-white text-xs font-black leading-none">V</span>
          </div>
          <span className="text-sm text-muted-foreground">
            VeilWick — Spicy wellness · Synthetic · 18+ only
          </span>
        </div>
        <nav className="hidden sm:flex items-center gap-4">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} VeilWick. Synthetic demo.
        </p>
      </div>
      <div className="mx-auto max-w-6xl mt-6 pt-4 border-t border-border/40 text-center">
        <p className="text-[10px] leading-relaxed text-muted-foreground/60">
          <strong>18 U.S.C. § 2257 — Fictional Demo:</strong> All persons depicted
          are AI-generated fictional adults 18+ — no real persons. Wan 2.4-14B synthetic wellness only.
        </p>
      </div>
    </footer>
  );
}
