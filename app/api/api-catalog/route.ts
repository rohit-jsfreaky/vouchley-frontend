/**
 * RFC 9727 API catalog — served at `/.well-known/api-catalog` via a rewrite
 * in `next.config.ts` (Next dislikes dot-prefixed app-router directories).
 *
 * Response is `application/linkset+json` per RFC 9264. Each entry in the
 * `linkset` array describes one API surface with link relations:
 *   - service-desc: machine-readable OpenAPI document
 *   - service-doc:  human-readable documentation (HTML + Markdown variants)
 *   - status:       health-check endpoint
 *
 * Agents that respect the spec can discover everything they need to call
 * the Vouchley API without scraping marketing pages.
 */
import { SITE } from "@/config/site";

export const runtime = "nodejs";

export async function GET() {
  const body = {
    linkset: [
      {
        anchor: SITE.apiUrl,
        "service-desc": [
          {
            href: `${SITE.apiUrl}/openapi.json`,
            type: "application/vnd.oai.openapi+json;version=3.1",
            title: "Vouchley API — OpenAPI 3.1 specification",
          },
        ],
        "service-doc": [
          {
            href: `${SITE.url}/docs`,
            type: "text/html",
            title: "Vouchley API documentation (HTML)",
          },
          {
            href: `${SITE.url}/docs.md`,
            type: "text/markdown",
            title: "Vouchley API documentation (Markdown for Agents)",
          },
        ],
        status: [
          {
            href: `${SITE.apiUrl}/health`,
            title: "Vouchley API health check",
          },
        ],
        terms: [
          {
            href: `${SITE.url}/terms`,
            type: "text/html",
          },
        ],
        privacy: [
          {
            href: `${SITE.url}/privacy`,
            type: "text/html",
          },
        ],
      },
    ],
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/linkset+json",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
