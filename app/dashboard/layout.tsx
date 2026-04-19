import { redirect } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/shell/sidebar";
import { MobileBottomNav } from "@/components/dashboard/shell/mobile-bottom-nav";
import { MobileTopBar } from "@/components/dashboard/shell/mobile-top-bar";
import { getSessionServer } from "@/lib/auth-client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionServer();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-canvas">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="mx-auto max-w-6xl px-4 py-8 md:p-12">
            {children}
          </div>
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
