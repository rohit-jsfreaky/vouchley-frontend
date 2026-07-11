import type { Metadata } from "next";

import { CompareTable } from "@/components/marketing/compare-table";
import { Bento } from "@/components/marketing/home/bento";
import { FinalCta } from "@/components/marketing/home/cta";
import { Faq } from "@/components/marketing/home/faq";
import { Founder } from "@/components/marketing/home/founder";
import { Hero } from "@/components/marketing/home/hero";
import { HowItWorks } from "@/components/marketing/home/how-it-works";
import { Metrics } from "@/components/marketing/home/metrics";
import { StackSection } from "@/components/marketing/home/stack-section";
import { TechStrip } from "@/components/marketing/home/tech-strip";
import { WhatWeDetect } from "@/components/marketing/home/what-we-detect";
import { JsonLd } from "@/components/seo/json-ld";
import { FAQ } from "@/config/home";
import { SITE } from "@/config/site";
import { getSessionServer } from "@/lib/auth-client";
import { buildMetadata, faqJsonLd, softwareAppJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: SITE.title,
    description: SITE.description,
    path: "/",
    keywords: ["signup verification API", "fake signup detection", "email validation"],
  }),
  // Brand-first document title so we win our own "vouchley" brand SERP (was ~pos 19).
  // The keyword phrase still follows immediately, so intent terms stay covered.
  title: { absolute: `${SITE.name} — ${SITE.title}` },
};

export default async function HomePage() {
  const user = await getSessionServer();

  return (
    <>
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <Hero user={user} />
      <TechStrip />
      <Bento />
      <HowItWorks />
      <WhatWeDetect />
      <CompareTable />
      <StackSection />
      <Metrics />
      <Faq />
      <Founder />
      <FinalCta user={user} />
    </>
  );
}
