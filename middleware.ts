import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Two responsibilities:
 *
 * 1. **Content negotiation for agents (Markdown for Agents).** Requests that
 *    set `Accept: text/markdown` — or that URL-suffix `.md` onto a public
 *    page — are rewritten to `/api/agent-markdown`, which returns the
 *    hand-authored markdown variant of the page.
 *
 * 2. **RFC 8288 Link response headers.** Every HTML response carries
 *    discovery pointers (`service-doc`, `sitemap`, `alternate`) so agents can
 *    walk to documentation, the sitemap, or the markdown variant of the
 *    current page without parsing the body.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const accept = req.headers.get("accept") ?? "";
  const wantsMarkdown =
    pathname.endsWith(".md") || accept.toLowerCase().includes("text/markdown");

  if (wantsMarkdown) {
    const stripped = pathname.endsWith(".md")
      ? pathname.slice(0, -3) || "/"
      : pathname;
    const rewriteTarget = req.nextUrl.clone();
    rewriteTarget.pathname = "/api/agent-markdown";
    rewriteTarget.search = `?path=${encodeURIComponent(stripped)}`;
    const res = NextResponse.rewrite(rewriteTarget);
    res.headers.set("Vary", "Accept");
    return res;
  }

  const res = NextResponse.next();

  res.headers.append(
    "Link",
    '</docs>; rel="service-doc"; type="text/html"; title="Vouchley API documentation"',
  );
  res.headers.append(
    "Link",
    '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  );
  res.headers.append(
    "Link",
    '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  );

  // Alternate markdown variant of this specific page (per Markdown for Agents).
  const mdAlternate = pathname === "/" ? "/index.md" : `${pathname}.md`;
  res.headers.append(
    "Link",
    `<${mdAlternate}>; rel="alternate"; type="text/markdown"`,
  );
  res.headers.set("Vary", "Accept");

  // Ignore the search string in the response Link headers — keeps them stable
  // and cache-friendly. The Vary: Accept above already covers the MD variant.
  void search;

  return res;
}

export const config = {
  matcher: [
    "/((?!api|dashboard|_next|.*\\..*).*)",
    "/((?!api|dashboard|_next).+\\.md)",
  ],
};
