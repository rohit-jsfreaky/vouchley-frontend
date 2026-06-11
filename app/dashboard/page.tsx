import type { Metadata } from "next";

import { DashboardHomeClient } from "@/components/dashboard/home/home-client";
import { SITE } from "@/config/site";
import { getSessionServer } from "@/lib/auth-client";

export const metadata: Metadata = {
  title: `Dashboard — ${SITE.name}`,
};

export default async function DashboardPage() {
  const user = await getSessionServer();
  return <DashboardHomeClient user={user} />;
}
