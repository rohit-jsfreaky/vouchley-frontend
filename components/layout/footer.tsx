import Link from "next/link";

import { FOOTER_LINKS } from "@/config/nav";
import { SITE } from "@/config/site";

export function Footer() {
  return (
    <footer className="w-full border-t border-subtle bg-canvas py-12 px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row md:gap-0">
        <Link
          href="/"
          className="font-serif text-lg text-ink"
          aria-label={`${SITE.name} — home`}
        >
          {SITE.name}
        </Link>

        <nav
          className="flex flex-wrap justify-center gap-6"
          aria-label="Footer"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[10px] uppercase tracking-tighter text-ink-muted transition-colors hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="font-mono text-[10px] uppercase tracking-tighter text-brand">
          © {SITE.year} {SITE.name}. {SITE.tagline}.
        </p>
      </div>
    </footer>
  );
}
