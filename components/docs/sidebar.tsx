"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { DOC_SECTIONS } from "@/config/docs";
import { cn } from "@/lib/utils";

export function DocsSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <nav
        className="sticky top-28 max-h-[calc(100vh-7rem)] space-y-8 overflow-y-auto pr-6"
        aria-label="Docs"
      >
        {DOC_SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-ink-soft">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.pages.map((page) => {
                const active = pathname === page.href;
                const disabled = page.status === "coming-soon";
                return (
                  <li key={page.href}>
                    {disabled ? (
                      <span className="flex items-center justify-between rounded-md px-3 py-1.5 text-sm text-ink-soft">
                        {page.title}
                        <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-ink-soft/70">
                          Soon
                        </span>
                      </span>
                    ) : (
                      <Link
                        href={page.href}
                        className={cn(
                          "block rounded-md px-3 py-1.5 text-sm transition-colors",
                          active
                            ? "bg-brand-soft font-medium text-brand"
                            : "text-ink hover:text-brand",
                        )}
                      >
                        {page.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
