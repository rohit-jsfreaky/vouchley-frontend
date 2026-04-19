"use client";

import { ChevronRight, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LEGAL_CONTACT_EMAIL, LEGAL_DOCS } from "@/config/legal";
import { cn } from "@/lib/utils";

export function LegalSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full md:w-64 md:shrink-0">
      <div className="md:sticky md:top-28">
        <div className="rounded-xl border border-border/30 bg-surface p-6 shadow-[var(--shadow-soft)]">
          <h3 className="mb-6 font-serif text-xl text-brand">
            Legal &amp; Compliance
          </h3>
          <nav className="flex flex-col gap-1" aria-label="Legal documents">
            {LEGAL_DOCS.map((doc) => {
              const active = pathname === doc.href;
              return (
                <Link
                  key={doc.href}
                  href={doc.href}
                  className={cn(
                    "group flex items-center justify-between rounded-lg px-4 py-2 text-sm transition-colors",
                    active
                      ? "bg-canvas font-semibold text-brand"
                      : "text-ink-muted hover:bg-canvas hover:text-ink",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span>{doc.shortTitle}</span>
                  <ChevronRight
                    className={cn(
                      "size-4 transition-opacity",
                      active
                        ? "opacity-60"
                        : "opacity-0 group-hover:opacity-40",
                    )}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-border/40 pt-6">
            <p className="mb-3 text-xs text-ink-muted">
              Need to exercise your rights?
            </p>
            <a
              href={`mailto:${LEGAL_CONTACT_EMAIL}`}
              className="flex items-center gap-2 text-brand hover:text-brand-hover"
            >
              <Mail className="size-4" strokeWidth={1.75} aria-hidden />
              <span className="font-mono text-[11px] tracking-tight">
                {LEGAL_CONTACT_EMAIL}
              </span>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
