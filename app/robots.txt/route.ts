/**
 * Dynamic robots.txt that includes Content-Signal directives
 * (https://contentsignals.org, draft-romm-aipref-contentsignals).
 *
 * Policy:
 *   - search=yes       → traditional search engines may index for SERP results
 *   - ai-input=yes     → AI assistants (ChatGPT, Perplexity, Claude, etc.) may
 *                        use this content live to answer queries / cite us
 *   - ai-train=no      → do NOT include this content in LLM training corpora
 *
 * Reasoning: we want AI assistants to cite Vouchley when developers ask
 * "how do I block fake signups" (that drives discovery and traffic), but we
 * don't want our content silently absorbed into model weights without
 * attribution.
 */
import { SITE } from "@/config/site";

export const runtime = "nodejs";

export async function GET() {
  const body = `# robots.txt for ${SITE.name}
# Last updated: 2026-06-01

User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /dashboard/
Disallow: /login
Disallow: /signup
Disallow: /api/
Content-Signal: search=yes, ai-input=yes, ai-train=no

Sitemap: ${SITE.url}/sitemap.xml
Host: ${SITE.url}
`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
