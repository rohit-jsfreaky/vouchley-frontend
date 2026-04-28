import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DomainPage } from "@/components/marketing/disposable/domain-page";
import { JsonLd } from "@/components/seo/json-ld";
import {
  DISPOSABLE_DOMAINS,
  getDomain,
} from "@/config/disposable-domains";
import { buildMetadata, faqJsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return DISPOSABLE_DOMAINS.map((d) => ({ domain: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  const data = getDomain(domain);
  if (!data) return {};

  const isDisposable = data.kind === "disposable";
  const title = isDisposable
    ? `Is ${data.domain} a Disposable Email? (${data.serviceName})`
    : `Is ${data.domain} a Disposable Email? (Spoiler: No)`;

  const description = isDisposable
    ? `${data.domain} is operated by ${data.serviceName}, a disposable / temporary email service. Block at signup. Includes alias domains, code example, and related services.`
    : `${data.domain} (${data.serviceName}) is a legitimate free email provider — not disposable. Do not block. Here's how to score these signups correctly.`;

  return buildMetadata({
    title,
    description,
    path: `/disposable-emails/${data.slug}`,
    keywords: [
      `is ${data.domain} disposable`,
      `${data.domain} disposable email`,
      `${data.serviceName.toLowerCase()} email`,
      "disposable email detection",
      "block disposable emails",
    ],
    type: "article",
  });
}

export default async function DisposableDomainDetailPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const data = getDomain(domain);
  if (!data) notFound();

  // FAQ schema — synthetic but accurate Q&As derived from the page content.
  const faqs = [
    {
      question: `Is ${data.domain} a disposable email service?`,
      answer:
        data.kind === "disposable"
          ? `Yes. ${data.domain} is operated by ${data.serviceName}, a disposable / temporary email service. ${data.description}`
          : `No. ${data.domain} is operated by ${data.serviceName}, a legitimate free email provider. ${data.description}`,
    },
    {
      question: `Should I block ${data.domain} on my signup form?`,
      answer: data.blockRationale,
    },
    {
      question: `What is ${data.domain} typically used for?`,
      answer: data.typicalUse,
    },
  ];

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <DomainPage data={data} />
    </>
  );
}
