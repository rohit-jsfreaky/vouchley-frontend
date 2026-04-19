"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { MARKETING_NAV } from "@/config/nav";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const onDocs = pathname.startsWith("/docs");

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-canvas/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-serif text-2xl italic font-semibold text-brand"
            aria-label={`${SITE.name} — home`}
          >
            {SITE.name}
          </Link>
          {onDocs && (
            <span className="rounded bg-subtle px-2 py-1 font-mono text-xs text-ink">
              Docs
            </span>
          )}
        </div>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {MARKETING_NAV.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-serif text-lg tracking-tight transition-colors duration-200",
                  active
                    ? "border-b-2 border-brand pb-1 font-semibold text-brand"
                    : "text-ink-muted hover:text-brand",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="font-serif text-lg tracking-tight text-ink-muted transition-colors hover:text-brand"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className={buttonStyles({ variant: "primary", size: "sm" })}
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 text-ink-muted transition-colors hover:text-brand md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-canvas md:hidden">
          <nav
            className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4"
            aria-label="Mobile"
          >
            {MARKETING_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 font-serif text-lg text-ink-muted transition-colors hover:bg-subtle hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 font-serif text-lg text-ink-muted transition-colors hover:bg-subtle hover:text-brand"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className={cn(
                buttonStyles({ variant: "primary", size: "md" }),
                "mt-1 w-full",
              )}
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
