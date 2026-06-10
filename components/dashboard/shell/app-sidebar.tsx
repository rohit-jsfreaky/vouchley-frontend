"use client";

import { LogOut, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
import { logout } from "@/lib/auth-client";

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-border">
      <SidebarHeader className="gap-3 p-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-2">
        <Link
          href="/dashboard"
          className="px-1 py-1 group-data-[collapsible=icon]:hidden"
        >
          <span className="text-2xl font-bold tracking-tight text-ink">
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
