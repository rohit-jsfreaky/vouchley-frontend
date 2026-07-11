"use client";

import { LogOut, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { BrandMark } from "@/components/layout/brand-mark";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DASHBOARD_NAV,
  DASHBOARD_NAV_FOOTER,
  type DashboardNavItem,
} from "@/config/dashboard-nav";
import { logout, type User } from "@/lib/auth-client";

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppSidebar({ user }: { user?: User | null }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-border">
      <SidebarHeader className="gap-3 p-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-1 py-1"
        >
          <BrandMark size={28} />
          <span className="text-2xl font-bold tracking-tight text-ink group-data-[collapsible=icon]:hidden">
            Vouchley
          </span>
        </Link>

        <Button
          asChild
          variant="primary"
          size="md"
          className="w-full justify-center gap-2 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:px-0"
        >
          <Link href="/docs">
            <Plus className="size-4" strokeWidth={2.25} />
            <span className="group-data-[collapsible=icon]:hidden">
              New Verification
            </span>
          </Link>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-ink-soft">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {DASHBOARD_NAV.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  active={isActive(pathname, item.href)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {DASHBOARD_NAV_FOOTER.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              active={isActive(pathname, item.href)}
            />
          ))}
          <LogoutItem />
        </SidebarMenu>
        {user && <UserCard user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}

function NavItem({
  item,
  active,
}: {
  item: DashboardNavItem;
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={item.label}
        className="gap-3 font-medium text-ink-muted data-[active=true]:font-semibold"
      >
        <Link href={item.href}>
          <Icon strokeWidth={1.75} aria-hidden />
          <span>{item.label}</span>
          {item.comingSoon && (
            <span className="ml-auto text-[9px] font-medium uppercase tracking-wide text-ink-soft group-data-[collapsible=icon]:hidden">
              Soon
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function UserCard({ user }: { user: User }) {
  const initial = (user.name || user.email).charAt(0).toUpperCase();
  return (
    <div className="mt-1 flex items-center gap-2.5 rounded-xl border border-border bg-canvas/70 p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-[#6d83ff] text-sm font-bold text-white"
      >
        {initial}
      </span>
      <div className="min-w-0 group-data-[collapsible=icon]:hidden">
        {user.name && (
          <p className="truncate text-[13px] font-semibold leading-tight text-ink">
            {user.name}
          </p>
        )}
        <p className="truncate text-xs leading-tight text-ink-muted">
          {user.email}
        </p>
      </div>
    </div>
  );
}

function LogoutItem() {
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    if (pending) return;
    setPending(true);
    try {
      await logout();
      if (isMobile) setOpenMobile(false);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not log you out. Try again.");
      setPending(false);
    }
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={handleLogout}
        disabled={pending}
        tooltip="Log out"
        className="gap-3 font-medium text-ink-muted"
      >
        <LogOut strokeWidth={1.75} aria-hidden />
        <span>{pending ? "Logging out…" : "Log out"}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
