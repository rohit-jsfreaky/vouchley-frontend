import type { Metadata } from "next";

import { FinalCta } from "@/components/marketing/home/cta";
import { Faq } from "@/components/marketing/home/faq";
import { Features } from "@/components/marketing/home/features";
import { Founder } from "@/components/marketing/home/founder";
import { Hero } from "@/components/marketing/home/hero";
import { HowItWorks } from "@/components/marketing/home/how-it-works";
import { WhatWeDetect } from "@/components/marketing/home/what-we-detect";
import { JsonLd } from "@/components/seo/json-ld";
import { FAQ } from "@/config/home";
import { SITE } from "@/config/site";
import { getSessionServer } from "@/lib/auth-client";
import { buildMetadata, faqJsonLd, softwareAppJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: SITE.title,
  description: SITE.description,
  path: "/",
  keywords: ["signup verification API", "fake signup detection", "email validation"],
});

export default async function HomePage() {
  const user = await getSessionServer();

  return (
    <>
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <Hero user={user} />
      <Features />
      <HowItWorks />
      <WhatWeDetect />
      <Faq />
      <Founder />
      <FinalCta user={user} />
    </>
  );
}
