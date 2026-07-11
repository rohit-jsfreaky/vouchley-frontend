import type { Metadata } from "next";

import { CompareTable } from "@/components/marketing/compare-table";
import { PricingGrid } from "@/components/marketing/pricing/pricing-grid";
import { PricingHeader } from "@/components/marketing/pricing/pricing-header";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pricing — Simple monthly plans for signup verification",
  description:
    "Monthly credit plans from $19 for 15,000 verifications. Credits roll over every month and never expire, and cached checks are always free. Start with 100 free credits — no card required.",
  path: "/pricing",
  keywords: [
    "signup verification pricing",
    "email validation API pricing",
    "fraud detection API cost",
  ],
});

export default function PricingPage() {
  return (
    <>
      <PricingHeader />
      <PricingGrid />
      <CompareTable />
    </>
  );
}
