"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  DASHBOARD_NAV,
  DASHBOARD_NAV_FOOTER,
} from "@/config/dashboard-nav";
import { cn } from "@/lib/utils";

export function MobileTopBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/30 bg-canvas/80 px-4 py-3 backdrop-blur md:hidden">
      <Link href="/dashboard" className="font-serif text-xl italic text-brand">
        Vouchley
      </Link>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        className="rounded-md p-2 text-ink-muted hover:text-brand"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-[57px] z-40 border-b border-border bg-canvas shadow-lg md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Dashboard mobile">
            {[...DASHBOARD_NAV, ...DASHBOARD_NAV_FOOTER].map((item) => {
              const Icon = item.icon;
              const active = item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                    active ? "bg-subtle text-brand font-semibold" : "text-ink-muted",
                  )}
                >
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                  <span className="flex-1">{item.label}</span>
                  {item.comingSoon && (
                    <span className="font-mono text-[10px] text-ink-soft">Soon</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
