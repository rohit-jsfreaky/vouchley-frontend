import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComparisonPage } from "@/components/marketing/comparison/comparison-page";
import { JsonLd } from "@/components/seo/json-ld";
import { COMPARISONS, getComparison } from "@/config/comparisons";
import { buildMetadata, faqJsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ competitor: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ competitor: string }>;
}): Promise<Metadata> {
  const { competitor } = await params;
  const data = getComparison(competitor);
  if (!data) return {};

  return buildMetadata({
    title: data.metaTitle,
    description: data.metaDescription,
    path: `/vs/${data.slug}`,
    keywords: [
      `vouchley vs ${data.name.toLowerCase()}`,
      `${data.name.toLowerCase()} alternative`,
      `${data.name.toLowerCase()} vs vouchley`,
      "signup verification API",
    ],
    type: "article",
  });
}

export default async function VsCompetitorPage({
  params,
}: {
  params: Promise<{ competitor: string }>;
}) {
  const { competitor } = await params;
  const data = getComparison(competitor);
  if (!data) notFound();

  return (
    <>
      <JsonLd data={faqJsonLd(data.faqs)} />
      <ComparisonPage data={data} />
    </>
  );
}
