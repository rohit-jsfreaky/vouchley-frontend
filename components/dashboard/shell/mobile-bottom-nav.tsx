"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { DASHBOARD_BOTTOM_NAV } from "@/config/dashboard-nav";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="sticky bottom-0 z-30 flex items-center justify-around border-t border-border/30 bg-canvas/95 px-2 py-2 backdrop-blur md:hidden"
      aria-label="Bottom"
    >
      {DASHBOARD_BOTTOM_NAV.map((item) => {
        const Icon = item.icon;
        const active = item.href === "/dashboard"
          ? pathname === "/dashboard"
          : pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 transition-colors",
              active ? "bg-subtle text-brand" : "text-ink-muted",
            )}
          >
            <Icon
              className="size-5"
              strokeWidth={active ? 2 : 1.75}
              aria-hidden
            />
            <span className="font-mono text-[10px] uppercase tracking-wider">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
