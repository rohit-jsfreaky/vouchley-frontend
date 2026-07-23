import type { Metadata } from "next";

import { CompareTable } from "@/components/marketing/compare-table";
import { PricingGrid } from "@/components/marketing/pricing/pricing-grid";
import { PricingHeader } from "@/components/marketing/pricing/pricing-header";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE } from "@/config/site";
import { breadcrumbJsonLd, buildMetadata, softwareAppJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Signup Verification API Pricing (From $19/mo)",
  description:
    "Signup verification from $19/mo for 15,000 checks. Credits roll over and never expire, cached checks are always free. Start with 100 free credits — no card required.",
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
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "Pricing", url: `${SITE.url}/pricing` },
        ])}
      />
      <PricingHeader />
      <PricingGrid />
      <CompareTable />
    </>
  );
}
