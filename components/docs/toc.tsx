import Link from "next/link";

import type { TocItem } from "@/config/docs";
import { cn } from "@/lib/utils";

export function DocsToc({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;
  return (
    <aside className="hidden w-60 shrink-0 xl:block">
      <nav
        className="sticky top-28 max-h-[calc(100vh-7rem)] overflow-y-auto pl-8"
        aria-label="On this page"
      >
        <h4 className="mb-4 text-sm font-semibold text-ink">On this page</h4>
        <ul className="space-y-3 border-l border-border text-sm text-ink-muted">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`#${item.id}`}
                className={cn(
                  "-ml-px block border-l border-transparent pl-4 transition-colors hover:text-brand",
                  item.level === 3 && "pl-6 text-ink-soft",
                )}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
