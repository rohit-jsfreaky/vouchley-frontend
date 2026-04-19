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
      { title: "Installation", href: "/docs/installation", status: "coming-soon" },
    ],
  },
  {
    title: "Core Concepts",
    pages: [
      { title: "Verification Flow", href: "/docs/verification-flow", status: "coming-soon" },
      { title: "Caching & Credits", href: "/docs/caching-credits", status: "coming-soon" },
      { title: "Webhooks", href: "/docs/webhooks", status: "coming-soon" },
      { title: "Error Handling", href: "/docs/errors", status: "coming-soon" },
    ],
  },
  {
    title: "API Reference",
    pages: [
      { title: "POST /v1/verify", href: "/docs/api/verify", status: "coming-soon" },
      { title: "POST /v1/verify/bulk", href: "/docs/api/verify-bulk", status: "coming-soon" },
      { title: "GET /v1/usage", href: "/docs/api/usage", status: "coming-soon" },
      { title: "GET /v1/account", href: "/docs/api/account", status: "coming-soon" },
    ],
  },
];

export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
}
