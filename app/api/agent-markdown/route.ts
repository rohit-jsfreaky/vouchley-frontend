/**
 * Serves markdown variants of public pages to agents that request them via
 * `Accept: text/markdown` or by appending `.md` to a URL.
 *
 * Middleware rewrites those requests to `/api/agent-markdown?path=<original>`
 * so this handler is the single point of resolution.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { loadAgentMarkdown } from "@/lib/agent-markdown";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const requestedPath = req.nextUrl.searchParams.get("path") ?? "/";
  const markdown = loadAgentMarkdown(requestedPath);

  if (markdown === null) {
    return new NextResponse(
      `# 404\n\nNo markdown variant is available for \`${requestedPath}\`.\n`,
      {
        status: 404,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      },
    );
  }

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
      "X-Markdown-Variant": "agent-md",
      Vary: "Accept",
    },
  });
}
