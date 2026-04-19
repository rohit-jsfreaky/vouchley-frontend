export interface NavLink {
  label: string;
  href: string;
}

export const MARKETING_NAV: NavLink[] = [
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export const FOOTER_LINKS: NavLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/contact" },
  { label: "Status", href: "/status" },
];
