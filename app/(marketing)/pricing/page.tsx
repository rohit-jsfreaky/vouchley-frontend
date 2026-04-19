import type { Metadata } from "next";

import { PricingGrid } from "@/components/marketing/pricing/pricing-grid";
import { PricingHeader } from "@/components/marketing/pricing/pricing-header";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Pricing — ${SITE.name}`,
  description:
    "One-time credit packs. Credits never expire. Cache hits are always free. $0 → $299.",
};

export default function PricingPage() {
  return (
    <>
      <PricingHeader />
      <PricingGrid />
    </>
  );
}
