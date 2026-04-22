import type { Metadata } from "next";

import { CheckDetailClient } from "@/components/dashboard/checks/check-detail-client";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Check Detail — ${SITE.name}`,
};

export default async function CheckDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CheckDetailClient checkId={id} />;
}
