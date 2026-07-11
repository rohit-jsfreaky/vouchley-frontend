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
];

export interface FooterSection {
  title: string;
  links: NavLink[];
}

/**
 * Grouped footer links. Rendered on every page, so this is the primary
 * site-wide internal-linking surface — it gives every content hub (pricing,
 * docs, blog, the disposable-email database, and each /vs comparison) a link
 * from all ~50 pages, which is why the comparison pages live here rather than
 * being reachable only from the on-page compare table.
 */
export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Documentation", href: "/docs" },
      { label: "Verify API", href: "/docs/api/verify" },
      { label: "Rate limits", href: "/docs/rate-limits" },
    ],
  },
  {
    title: "Compare",
    links: [
      { label: "vs Kickbox", href: "/vs/kickbox" },
      { label: "vs ZeroBounce", href: "/vs/zerobounce" },
      { label: "vs Sift", href: "/vs/sift" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Disposable emails", href: "/disposable-emails" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];
