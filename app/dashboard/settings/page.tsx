import type { Metadata } from "next";

import { SettingsClient } from "@/components/dashboard/settings/settings-client";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Settings — ${SITE.name}`,
};

export default function SettingsPage() {
  return <SettingsClient />;
}
