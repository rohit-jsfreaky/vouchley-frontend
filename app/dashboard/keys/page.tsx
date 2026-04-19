import type { Metadata } from "next";

import { ApiKeysClient } from "@/components/dashboard/keys/keys-client";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `API Keys — ${SITE.name}`,
};

export default function ApiKeysPage() {
  return <ApiKeysClient />;
}
