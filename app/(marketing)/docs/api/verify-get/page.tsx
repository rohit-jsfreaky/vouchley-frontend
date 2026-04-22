import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/docs/breadcrumbs";
import {
  DocCode,
  DocH1,
  DocH2,
  DocLead,
  DocP,
} from "@/components/docs/doc-typography";
import { MobileTocFab } from "@/components/docs/mobile-toc-fab";
import { DocsToc } from "@/components/docs/toc";
import { CodeBlock } from "@/components/ui/code-block";
import type { TocItem } from "@/config/docs";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `GET /v1/verify/:id — ${SITE.name} Docs`,
  alternates: { canonical: "/docs/api/verify-get" },
};

const TOC: TocItem[] = [
  { id: "request", title: "Request", level: 2 },
  { id: "response", title: "Response", level: 2 },
  { id: "example", title: "Example", level: 2 },
];

export default function VerifyGetApiPage() {
  return (
    <>
      <article className="min-w-0 flex-1 py-12">
        <Breadcrumbs
          items={[
            { label: "Docs", href: "/docs" },
            { label: "API Reference", href: "/docs" },
            { label: "GET /v1/verify/:id" },
          ]}
        />

        <DocH1>GET /v1/verify/:id</DocH1>
        <DocLead>
          Retrieve a previously completed verification check by its request ID.
        </DocLead>

        <DocH2 id="request">Request</DocH2>
        <DocP>
          <DocCode>GET /v1/verify/:request_id</DocCode>
        </DocP>
        <DocP>
          Requires <DocCode>Authorization: Bearer vch_...</DocCode> header. Only
          checks belonging to the authenticated account are returned.
        </DocP>
        <DocP>
          Returns <DocCode>404 Not Found</DocCode> if the check does not exist
          or belongs to a different account.
        </DocP>

        <DocH2 id="response">Response</DocH2>
        <DocP>
          The response body is the same shape as the original{" "}
          <DocCode>POST /v1/verify</DocCode> response, plus a{" "}
          <DocCode>created_at</DocCode> timestamp:
        </DocP>
        <div className="my-6 overflow-hidden rounded-xl border border-border/40">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-subtle/60">
                <th className="px-6 py-3 font-semibold text-ink">Field</th>
                <th className="px-6 py-3 font-semibold text-ink">Type</th>
                <th className="px-6 py-3 font-semibold text-ink">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-ink-muted">
              <tr>
                <td className="px-6 py-3 font-mono text-xs">request_id</td>
                <td className="px-6 py-3">string</td>
                <td className="px-6 py-3">The check ID.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">score</td>
                <td className="px-6 py-3">integer</td>
                <td className="px-6 py-3">Trust score (0-100).</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">recommendation</td>
                <td className="px-6 py-3">string</td>
                <td className="px-6 py-3">approve, review, or block.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">cached</td>
                <td className="px-6 py-3">boolean</td>
                <td className="px-6 py-3">Whether the original was cached.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">
                  processed_in_ms
                </td>
                <td className="px-6 py-3">integer</td>
                <td className="px-6 py-3">
                  Original processing time.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">created_at</td>
                <td className="px-6 py-3">string (ISO 8601)</td>
                <td className="px-6 py-3">When the check was created.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <DocP>
          Plus all signal objects (<DocCode>email</DocCode>,{" "}
          <DocCode>company</DocCode>, <DocCode>person</DocCode>,{" "}
          <DocCode>ip</DocCode>, <DocCode>flags</DocCode>,{" "}
          <DocCode>reasoning</DocCode>).
        </DocP>

        <DocH2 id="example">Example</DocH2>
        <CodeBlock
          code={`curl https://api.vouchley.getrevlio.com/v1/verify/req_8f3a0c921b \\
  -H "Authorization: Bearer $VOUCHLEY_API_KEY"`}
          lang="bash"
          filename="Request"
        />
      </article>

      <DocsToc items={TOC} />
      <MobileTocFab items={TOC} />
    </>
  );
}
