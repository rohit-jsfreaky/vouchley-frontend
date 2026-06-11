"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { MARKETING_NAV } from "@/config/nav";
import { SITE } from "@/config/site";
import type { User } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/** Glossy primary CTA: vertical gradient, inner top shine, blue glow. */
const GLOSSY_CTA = cn(
  "bg-[linear-gradient(180deg,#5b74ff,#3d5afe_55%,#3450f0)]",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-1px_0_rgba(0,0,0,0.12),0_8px_20px_-8px_rgba(61,90,254,0.65)]",
  "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_10px_26px_-8px_rgba(61,90,254,0.8)]",
);

/**
 * Floating glass island nav: a centered rounded pill that floats below the
 * top edge, glassy over the hero mesh, gaining contrast + shadow on scroll.
 */
export function TopNav({ user }: { user: User | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const onDocs = pathname.startsWith("/docs");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div
        className={cn(
          "relative mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border border-white/60 pl-6 pr-2.5 backdrop-blur-2xl transition-all duration-300",
          // Glossy capsule: gradient glass body + inner top highlight + tinted glow
          "bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(255,255,255,0.38))]",
          scrolled
            ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(255,255,255,0.2),0_16px_44px_-16px_rgba(61,90,254,0.35),0_2px_10px_rgba(17,19,28,0.08)]"
            : "shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(255,255,255,0.2),0_10px_36px_-16px_rgba(61,90,254,0.28),0_1px_6px_rgba(17,19,28,0.05)]",
        )}
      >
        {/* Light hitting the top of the capsule */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.6),rgba(255,255,255,0)_55%)]"
        />
        {/* Specular streak sweeping the left side */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(105deg,transparent_8%,rgba(255,255,255,0.5)_18%,transparent_32%)] opacity-70"
        />
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-ink"
            aria-label={`${SITE.name} — home`}
          >
            {SITE.name}
          </Link>
          {onDocs && (
            <span className="rounded-full bg-subtle px-2.5 py-0.5 text-xs font-medium text-ink-muted">
              Docs
            </span>
          )}
        </div>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 md:flex"
          aria-label="Primary"
        >
          {MARKETING_NAV.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200",
                  active
                    ? "bg-ink/[0.06] text-ink"
                    : "text-ink-muted hover:bg-ink/[0.04] hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-1.5 md:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full px-3.5 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/keys"
                className={cn(
                  buttonStyles({ variant: "primary", size: "sm" }),
                  GLOSSY_CTA,
                )}
              >
                Open App
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3.5 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className={cn(
                  buttonStyles({ variant: "primary", size: "sm" }),
                  GLOSSY_CTA,
                )}
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-full p-2 text-ink-muted transition-colors hover:text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu: floating card under the pill */}
      {open && (
        <div className="mx-auto mt-2 max-w-5xl rounded-2xl border border-border bg-surface p-3 shadow-[0_20px_50px_-20px_rgba(17,19,28,0.3)] md:hidden">
          <nav className="flex flex-col gap-0.5" aria-label="Mobile">
            {MARKETING_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3.5 py-2.5 text-base font-medium text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3.5 py-2.5 text-base font-medium text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/keys"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonStyles({ variant: "primary", size: "md" }),
                    GLOSSY_CTA,
                    "mt-1 w-full",
                  )}
                >
                  Open App
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3.5 py-2.5 text-base font-medium text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonStyles({ variant: "primary", size: "md" }),
                    GLOSSY_CTA,
                    "mt-1 w-full",
                  )}
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
