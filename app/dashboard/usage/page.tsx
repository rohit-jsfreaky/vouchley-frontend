import type { Metadata } from "next";

import { UsageClient } from "@/components/dashboard/usage/usage-client";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Usage — ${SITE.name}`,
};

export default function UsagePage() {
  return <UsageClient />;
}
