/**
 * Docs sidebar structure. Add a new doc page:
 *   1. Add a file at `app/(marketing)/docs/<slug>/page.tsx`
 *   2. Add an entry to the matching section here
 * The sidebar renders directly from this config.
 */
export interface DocPage {
  title: string;
  href: string;
  status?: "coming-soon";
}

export interface DocSection {
  title: string;
  pages: DocPage[];
}

export const DOC_SECTIONS: DocSection[] = [
  {
    title: "Getting Started",
    pages: [
      { title: "Quickstart", href: "/docs" },
      { title: "Authentication", href: "/docs/authentication" },
    ],
  },
  {
    title: "Core Concepts",
    pages: [
      { title: "Caching & Credits", href: "/docs/caching-credits" },
      { title: "Rate Limits", href: "/docs/rate-limits" },
      { title: "Error Handling", href: "/docs/errors" },
    ],
  },
  {
    title: "API Reference",
    pages: [
      { title: "POST /v1/verify", href: "/docs/api/verify" },
      { title: "POST /v1/verify/bulk", href: "/docs/api/verify-bulk" },
      { title: "GET /v1/verify/:id", href: "/docs/api/verify-get" },
      { title: "GET /v1/usage", href: "/docs/api/usage" },
      { title: "GET /v1/account", href: "/docs/api/account" },
    ],
  },
];

export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
}
