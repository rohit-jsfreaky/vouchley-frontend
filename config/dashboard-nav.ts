import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CreditCard,
  FileSearch,
  HelpCircle,
  Home,
  KeyRound,
  Radio,
  Settings,
} from "lucide-react";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  comingSoon?: boolean;
}

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "API Keys", href: "/dashboard/keys", icon: KeyRound },
  { label: "Usage", href: "/dashboard/usage", icon: BarChart3 },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, comingSoon: true },
  { label: "Check Inspector", href: "/dashboard/inspector", icon: FileSearch, comingSoon: true },
];

export const DASHBOARD_NAV_FOOTER: DashboardNavItem[] = [
  { label: "Support", href: "/contact", icon: HelpCircle },
  { label: "Status", href: "/status", icon: Radio },
];

export const DASHBOARD_BOTTOM_NAV: DashboardNavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Keys", href: "/dashboard/keys", icon: KeyRound },
  { label: "Usage", href: "/dashboard/usage", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, comingSoon: true },
];
