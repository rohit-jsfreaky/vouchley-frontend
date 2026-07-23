import type { Metadata } from "next";

import { VerifyClient } from "@/components/dashboard/verify/verify-client";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Verify — ${SITE.name}`,
};

export default function VerifyPage() {
  return <VerifyClient />;
}
