import type { Metadata } from "next";

import { BillingClient } from "@/components/dashboard/billing/billing-client";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Billing — ${SITE.name}`,
};

export default function BillingPage() {
  return <BillingClient />;
}
