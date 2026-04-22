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
  title: `GET /v1/account — ${SITE.name} Docs`,
  alternates: { canonical: "/docs/api/account" },
};

const TOC: TocItem[] = [
  { id: "request", title: "Request", level: 2 },
  { id: "response", title: "Response", level: 2 },
  { id: "example", title: "Example", level: 2 },
];

export default function AccountApiPage() {
  return (
    <>
      <article className="min-w-0 flex-1 py-12">
        <Breadcrumbs
          items={[
            { label: "Docs", href: "/docs" },
            { label: "API Reference", href: "/docs" },
            { label: "GET /v1/account" },
          ]}
        />

        <DocH1>GET /v1/account</DocH1>
        <DocLead>
          Retrieve your account profile, credit balance, and active subscription
          info.
        </DocLead>

        <DocH2 id="request">Request</DocH2>
        <DocP>
          <DocCode>GET /v1/account</DocCode>
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
                <td className="px-6 py-3 font-mono text-xs">user_id</td>
                <td className="px-6 py-3">string</td>
                <td className="px-6 py-3">Your account ID.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">email</td>
                <td className="px-6 py-3">string</td>
                <td className="px-6 py-3">Account email.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">name</td>
                <td className="px-6 py-3">string | null</td>
                <td className="px-6 py-3">Account display name.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">created_at</td>
                <td className="px-6 py-3">string (ISO 8601)</td>
                <td className="px-6 py-3">
                  When the account was created.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">
                  credits_balance
                </td>
                <td className="px-6 py-3">integer</td>
                <td className="px-6 py-3">Current credit balance.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">api_key</td>
                <td className="px-6 py-3">object</td>
                <td className="px-6 py-3">
                  <DocCode>id</DocCode> and <DocCode>environment</DocCode> of the
                  key used to authenticate this request.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">subscription</td>
                <td className="px-6 py-3">object | null</td>
                <td className="px-6 py-3">
                  Active subscription details (<DocCode>id</DocCode>,{" "}
                  <DocCode>plan</DocCode>, <DocCode>status</DocCode>,{" "}
                  <DocCode>current_period_end</DocCode>), or null if no active
                  plan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <DocH2 id="example">Example</DocH2>
        <CodeBlock
          code={`curl https://api.vouchley.getrevlio.com/v1/account \\
  -H "Authorization: Bearer $VOUCHLEY_API_KEY"`}
          lang="bash"
          filename="Request"
        />
        <CodeBlock
          code={`{
  "user_id": "usr_abc123",
  "email": "dev@acme.com",
  "name": "Alice Smith",
  "created_at": "2026-03-15T10:00:00+00:00",
  "credits_balance": 2065,
  "api_key": {
    "id": "key_xyz789",
    "environment": "live"
  },
  "subscription": {
    "id": "sub_def456",
    "plan": "pro",
    "status": "active",
    "current_period_end": "2026-05-15T00:00:00+00:00"
  }
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
