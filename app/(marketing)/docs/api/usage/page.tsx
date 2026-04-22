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
  title: `GET /v1/usage — ${SITE.name} Docs`,
  alternates: { canonical: "/docs/api/usage" },
};

const TOC: TocItem[] = [
  { id: "request", title: "Request", level: 2 },
  { id: "response", title: "Response", level: 2 },
  { id: "example", title: "Example", level: 2 },
];

export default function UsageApiPage() {
  return (
    <>
      <article className="min-w-0 flex-1 py-12">
        <Breadcrumbs
          items={[
            { label: "Docs", href: "/docs" },
            { label: "API Reference", href: "/docs" },
            { label: "GET /v1/usage" },
          ]}
        />

        <DocH1>GET /v1/usage</DocH1>
        <DocLead>
          Retrieve your current-month usage statistics and credit balance.
        </DocLead>

        <DocH2 id="request">Request</DocH2>
        <DocP>
          <DocCode>GET /v1/usage</DocCode>
        </DocP>
        <DocP>
          Requires <DocCode>Authorization: Bearer vch_...</DocCode> header. No
          request body or query parameters.
        </DocP>

        <DocH2 id="response">Response</DocH2>
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
                <td className="px-6 py-3 font-mono text-xs">period</td>
                <td className="px-6 py-3">object</td>
                <td className="px-6 py-3">
                  <DocCode>start</DocCode> and <DocCode>end</DocCode> ISO
                  timestamps for the current month.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">total_checks</td>
                <td className="px-6 py-3">integer</td>
                <td className="px-6 py-3">
                  Total checks this month.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">cached_checks</td>
                <td className="px-6 py-3">integer</td>
                <td className="px-6 py-3">
                  Checks served from cache (free).
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">
                  billable_checks
                </td>
                <td className="px-6 py-3">integer</td>
                <td className="px-6 py-3">
                  Checks that deducted credits.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">credits_used</td>
                <td className="px-6 py-3">integer</td>
                <td className="px-6 py-3">
                  Credits consumed this month.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">
                  credits_balance
                </td>
                <td className="px-6 py-3">integer</td>
                <td className="px-6 py-3">
                  Current credit balance.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <DocH2 id="example">Example</DocH2>
        <CodeBlock
          code={`curl https://api.vouchley.getrevlio.com/v1/usage \\
  -H "Authorization: Bearer $VOUCHLEY_API_KEY"`}
          lang="bash"
          filename="Request"
        />
        <CodeBlock
          code={`{
  "period": {
    "start": "2026-04-01T00:00:00+00:00",
    "end": "2026-04-20T14:30:00+00:00"
  },
  "total_checks": 1247,
  "cached_checks": 312,
  "billable_checks": 935,
  "credits_used": 935,
  "credits_balance": 2065
}`}
          lang="json"
          filename="Response 200"
        />
      </article>

      <DocsToc items={TOC} />
      <MobileTocFab items={TOC} />
    </>
  );
}
