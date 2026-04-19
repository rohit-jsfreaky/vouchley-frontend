import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-8 flex items-center gap-1 font-mono text-xs text-ink-muted"
    >
      {items.map((item, idx) => {
        const last = idx === items.length - 1;
        return (
          <span key={idx} className="flex items-center gap-1">
            {idx > 0 && (
              <ChevronRight
                className="size-3 text-ink-soft"
                strokeWidth={1.75}
                aria-hidden
              />
            )}
            {item.href && !last ? (
              <Link
                href={item.href}
                className="hover:text-brand transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(last && "font-semibold text-brand")}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
