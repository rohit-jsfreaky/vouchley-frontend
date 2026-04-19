"use client";

import { List, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { TocItem } from "@/config/docs";

export function MobileTocFab({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold text-ink shadow-[var(--shadow-editorial)] xl:hidden"
        aria-label="Open page contents"
      >
        <List className="size-4" strokeWidth={1.75} />
        <span>Contents</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end xl:hidden">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
            aria-label="Close"
          />
          <div className="relative w-full rounded-t-2xl border-t border-border bg-surface p-6 pb-10">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-ink">On this page</h4>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-ink-muted hover:text-brand"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-ink-muted">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className={
                      item.level === 3
                        ? "block pl-4 text-ink-soft"
                        : "block text-ink"
                    }
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
