import type { Metadata } from "next";

import { AboutFounder } from "@/components/marketing/about/founder";
import { AboutHero } from "@/components/marketing/about/hero";
import { AboutStory } from "@/components/marketing/about/story";
import { AboutTenets } from "@/components/marketing/about/tenets";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE } from "@/config/site";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Vouchley — Signup verification, built right",
  description:
    "Vouchley is built by a solo founder who believes in boring tech, fair pricing, and tools worth paying for. The story behind the editorial architect.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "About", url: `${SITE.url}/about` },
        ])}
      />
      <AboutHero />
      <AboutStory />
      <AboutFounder />
      <AboutTenets />
    </>
  );
}
