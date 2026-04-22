import type { Metadata } from "next";

import { ChecksListClient } from "@/components/dashboard/checks/checks-list-client";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Check Inspector — ${SITE.name}`,
};

export default function ChecksListPage() {
  return <ChecksListClient />;
}
