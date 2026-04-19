import type { Metadata } from "next";

import { AboutFounder } from "@/components/marketing/about/founder";
import { AboutHero } from "@/components/marketing/about/hero";
import { AboutStory } from "@/components/marketing/about/story";
import { AboutTenets } from "@/components/marketing/about/tenets";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `About — ${SITE.name}`,
  description:
    "Vouchley is built by a solo founder who believes in boring tech, fair pricing, and tools worth paying for.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutFounder />
      <AboutTenets />
    </>
  );
}
