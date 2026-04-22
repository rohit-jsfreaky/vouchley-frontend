export interface LegalDoc {
  slug: string;
  title: string;
  shortTitle: string;
  href: string;
  docId: string;
}

export const LEGAL_DOCS: LegalDoc[] = [
  { slug: "privacy", shortTitle: "Privacy Policy", title: "Privacy Policy", href: "/privacy", docId: "PRV-2026-04" },
  { slug: "terms", shortTitle: "Terms of Service", title: "Terms of Service", href: "/terms", docId: "TOS-2026-04" },
  { slug: "security", shortTitle: "Security Overview", title: "Security Overview", href: "/security", docId: "SEC-2026-04" },
  { slug: "cookies", shortTitle: "Cookie Policy", title: "Cookie Policy", href: "/cookies", docId: "COK-2026-04" },
  { slug: "dpa", shortTitle: "Data Processing Addendum", title: "Data Processing Addendum", href: "/dpa", docId: "DPA-2026-04" },
];

export const LEGAL_CONTACT_EMAIL = "privacy@getrevlio.com";
