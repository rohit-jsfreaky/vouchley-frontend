import Link from "next/link";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/dashboard/shell/app-sidebar";
import { BrandMark } from "@/components/layout/brand-mark";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSessionServer } from "@/lib/auth-client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionServer();
  if (!user) redirect("/login");

  return (
    <SidebarProvider>
      <TooltipProvider delayDuration={0}>
        <AppSidebar user={user} />
        <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-canvas/80 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1 text-ink-muted" />
          <Separator orientation="vertical" className="mr-1 h-5 md:hidden" />
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-base font-semibold text-ink md:hidden"
          >
            <BrandMark size={24} />
            Vouchley
          </Link>
        </header>

          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-6">
              {children}
            </div>
          </div>
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}
