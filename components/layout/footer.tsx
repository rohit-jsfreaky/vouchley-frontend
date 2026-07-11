import Link from "next/link";

import { BrandMark } from "@/components/layout/brand-mark";
import { FOOTER_SECTIONS } from "@/config/nav";
import { SITE } from "@/config/site";

export function Footer() {
  return (
    <footer className="w-full border-t border-subtle bg-canvas px-8 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand + tagline */}
          <div className="max-w-xs">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink"
              aria-label={`${SITE.name} — home`}
            >
              <BrandMark size={24} />
              {SITE.name}
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Real-time signup verification. Block bots, filter disposable
              emails, and detect VPN/proxy abuse in one API call.
            </p>
          </div>

          {/* Link columns */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink">
                  {section.title}
                </p>
                <ul className="flex flex-col gap-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-muted transition-colors hover:text-brand"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 border-t border-subtle pt-6">
          <p className="text-xs text-ink-soft">
            © {SITE.year} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
