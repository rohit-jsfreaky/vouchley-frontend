import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { BillingSuccessClient } from "@/components/dashboard/billing/success-client";
import { SITE } from "@/config/site";
import { getSessionServer } from "@/lib/auth-client";

export const metadata: Metadata = {
  title: `Payment received — ${SITE.name}`,
};

export default async function BillingSuccessPage() {
  const user = await getSessionServer();
  if (!user) redirect("/login");

  return <BillingSuccessClient />;
}
