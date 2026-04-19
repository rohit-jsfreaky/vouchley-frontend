import type { Metadata } from "next";

import { DashboardHomeClient } from "@/components/dashboard/home/home-client";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Dashboard — ${SITE.name}`,
};

export default function DashboardPage() {
  return <DashboardHomeClient />;
}
