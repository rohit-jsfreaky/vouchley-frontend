"use client";

import { LogOut, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { buttonStyles } from "@/components/ui/button";
import { DASHBOARD_NAV, DASHBOARD_NAV_FOOTER } from "@/config/dashboard-nav";
import { logout } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border/30 bg-subtle/70 md:flex">
      <div className="flex h-screen flex-col gap-6 p-6 sticky top-0">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-brand font-serif text-lg font-semibold text-ink-inverse">
            V
          </span>
          <div className="leading-tight">
            <div className="font-serif text-xl italic text-ink">Vouchley</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              Editorial Verification
            </div>
          </div>
        </Link>

        <Link
          href="/docs"
          className={cn(
            buttonStyles({ variant: "primary", size: "md" }),
            "w-full",
          )}
        >
          <Plus className="size-4" strokeWidth={2} />
          New Verification
        </Link>

        <nav className="flex-1 space-y-1" aria-label="Dashboard">
          {DASHBOARD_NAV.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
        </nav>

        <div className="space-y-1 border-t border-border/30 pt-4">
          {DASHBOARD_NAV_FOOTER.map((item) => (
            <NavLink key={item.href} item={item} active={false} small />
          ))}
          <LogoutLink />
        </div>
      </div>
    </aside>
  );
}

function LogoutLink() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    if (pending) return;
    setPending(true);
    try {
      await logout();
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not log you out. Try again.");
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 font-sans text-[11px] font-semibold uppercase tracking-widest text-ink-muted transition-colors hover:bg-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut className="size-[18px]" strokeWidth={1.75} aria-hidden />
      <span className="flex-1 text-left">
        {pending ? "Logging out..." : "Log out"}
      </span>
    </button>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({
  item,
  active,
  small = false,
}: {
  item: { label: string; href: string; icon: React.ElementType; comingSoon?: boolean };
  active: boolean;
  small?: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest transition-colors",
        small && "py-2 text-[11px]",
        active
          ? "bg-surface text-brand shadow-[var(--shadow-soft)]"
          : "text-ink-muted hover:bg-muted hover:text-ink",
      )}
    >
      <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
      <span className="flex-1">{item.label}</span>
      {item.comingSoon && (
        <span className="font-mono text-[9px] text-ink-soft/70">SOON</span>
      )}
    </Link>
  );
}
