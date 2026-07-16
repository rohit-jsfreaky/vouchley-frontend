import type { MetadataRoute } from "next";

import { COMPARISONS } from "@/config/comparisons";
import { DISPOSABLE_DOMAINS } from "@/config/disposable-domains";
import { SITE } from "@/config/site";
import { getAllPosts } from "@/lib/blog";

/**
 * Dynamic sitemap. Regenerated automatically on every `next build` — no
 * separate script needed. Every blog post added to content/blog/index.json
 * is included automatically on the next deploy. Same goes for new
 * comparison entries (config/comparisons.ts) and disposable-domain entries
 * (config/disposable-domains.ts).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    // Docs — getting started
    { url: `${SITE.url}/docs`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/docs/authentication`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // Docs — core concepts
    { url: `${SITE.url}/docs/caching-credits`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/docs/rate-limits`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/docs/errors`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // Docs — API reference
    { url: `${SITE.url}/docs/api/verify`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/docs/api/verify-bulk`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/docs/api/verify-get`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/docs/api/usage`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/docs/api/account`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    // Programmatic SEO — disposable email database index
    { url: `${SITE.url}/disposable-emails`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    // Free tools — link magnets
    { url: `${SITE.url}/tools/disposable-email-checker`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // Legal
    { url: `${SITE.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/security`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/dpa`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Comparison pages — high-intent, mid-funnel SEO targets
  const comparisonRoutes: MetadataRoute.Sitemap = COMPARISONS.map((c) => ({
    url: `${SITE.url}/vs/${c.slug}`,
    lastModified: new Date(c.lastVerified),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Per-domain disposable email pages
  const disposableRoutes: MetadataRoute.Sitemap = DISPOSABLE_DOMAINS.map((d) => ({
    url: `${SITE.url}/disposable-emails/${d.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...comparisonRoutes,
    ...disposableRoutes,
  ];
}
