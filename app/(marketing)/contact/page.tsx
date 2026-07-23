import type { Metadata } from "next";

import { ContactCards } from "@/components/marketing/contact/contact-cards";
import { ContactForm } from "@/components/marketing/contact/contact-form";
import { ContactHero } from "@/components/marketing/contact/hero";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE } from "@/config/site";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact — Talk to the Vouchley team",
  description:
    "Get in touch with the Vouchley team. Support, security disclosures, press requests, and partnership inquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "Contact", url: `${SITE.url}/contact` },
        ])}
      />
      <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
        <aside className="space-y-12 lg:col-span-5">
          <ContactHero />
          <ContactCards />
        </aside>

        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
