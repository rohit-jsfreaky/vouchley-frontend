import type { Metadata } from "next";

import { FinalCta } from "@/components/marketing/home/cta";
import { Features } from "@/components/marketing/home/features";
import { Hero } from "@/components/marketing/home/hero";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE } from "@/config/site";
import { getSessionServer } from "@/lib/auth-client";
import { buildMetadata, softwareAppJsonLd } from "@/lib/seo";

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
      <Hero user={user} />
      <Features />
      <FinalCta user={user} />
    </>
  );
}
