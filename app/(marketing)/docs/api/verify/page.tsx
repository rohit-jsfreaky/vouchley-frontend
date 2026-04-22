import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/docs/breadcrumbs";
import {
  DocCallout,
  DocCode,
  DocH1,
  DocH2,
  DocH3,
  DocLead,
  DocP,
} from "@/components/docs/doc-typography";
import { MobileTocFab } from "@/components/docs/mobile-toc-fab";
import { DocsToc } from "@/components/docs/toc";
import { CodeBlock } from "@/components/ui/code-block";
import type { TocItem } from "@/config/docs";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `POST /v1/verify — ${SITE.name} Docs`,
  alternates: { canonical: "/docs/api/verify" },
};

const TOC: TocItem[] = [
  { id: "request", title: "Request", level: 2 },
  { id: "request-body", title: "Request body", level: 3 },
  { id: "response", title: "Response", level: 2 },
  { id: "signals", title: "Signal objects", level: 2 },
  { id: "example", title: "Example", level: 2 },
];

export default function VerifyApiPage() {
  return (
    <>
      <article className="min-w-0 flex-1 py-12">
        <Breadcrumbs
          items={[
            { label: "Docs", href: "/docs" },
            { label: "API Reference", href: "/docs" },
            { label: "POST /v1/verify" },
          ]}
        />

        <DocH1>POST /v1/verify</DocH1>
        <DocLead>
          Run a single email verification. Returns a score, recommendation, and
          signal breakdown.
        </DocLead>

        <DocH2 id="request">Request</DocH2>
        <DocP>
          <DocCode>POST /v1/verify</DocCode>
        </DocP>
        <DocP>
          Requires <DocCode>Authorization: Bearer vch_...</DocCode> header. Each
          non-cached call deducts 1 credit.
        </DocP>

        <DocH3 id="request-body">Request body</DocH3>
        <div className="my-6 overflow-hidden rounded-xl border border-border/40">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-subtle/60">
                <th className="px-6 py-3 font-semibold text-ink">Field</th>
                <th className="px-6 py-3 font-semibold text-ink">Type</th>
                <th className="px-6 py-3 font-semibold text-ink">Required</th>
                <th className="px-6 py-3 font-semibold text-ink">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-ink-muted">
              <tr>
                <td className="px-6 py-3 font-mono text-xs">email</td>
                <td className="px-6 py-3">string</td>
                <td className="px-6 py-3">Yes</td>
                <td className="px-6 py-3">Email address to verify.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">name</td>
                <td className="px-6 py-3">string</td>
                <td className="px-6 py-3">No</td>
                <td className="px-6 py-3">
                  Full name of the person. Improves person-match signals.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">company_name</td>
                <td className="px-6 py-3">string</td>
                <td className="px-6 py-3">No</td>
                <td className="px-6 py-3">
                  Company name. Enables domain age and company signals.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">ip_address</td>
                <td className="px-6 py-3">string</td>
                <td className="px-6 py-3">No</td>
                <td className="px-6 py-3">
                  Source IP (v4 or v6). Enables VPN/Tor/geo signals.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <DocH2 id="response">Response</DocH2>
        <DocP>
          Returns <DocCode>200 OK</DocCode> with the verification result:
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
                <td className="px-6 py-3">
                  Unique ID for this check (e.g.{" "}
                  <DocCode>req_8f3a0c921b...</DocCode>).
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">score</td>
                <td className="px-6 py-3">integer (0-100)</td>
                <td className="px-6 py-3">
                  Trust score. Higher is better.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">recommendation</td>
                <td className="px-6 py-3">string</td>
                <td className="px-6 py-3">
                  One of <DocCode>approve</DocCode>,{" "}
                  <DocCode>review</DocCode>, or <DocCode>block</DocCode>.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">email</td>
                <td className="px-6 py-3">object</td>
                <td className="px-6 py-3">Email signal breakdown.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">company</td>
                <td className="px-6 py-3">object</td>
                <td className="px-6 py-3">Company/domain signals.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">person</td>
                <td className="px-6 py-3">object</td>
                <td className="px-6 py-3">Person-match signals.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">ip</td>
                <td className="px-6 py-3">object</td>
                <td className="px-6 py-3">IP reputation signals.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">flags</td>
                <td className="px-6 py-3">string[]</td>
                <td className="px-6 py-3">Risk flags (if any).</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">reasoning</td>
                <td className="px-6 py-3">string</td>
                <td className="px-6 py-3">
                  Human-readable explanation of the score.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">cached</td>
                <td className="px-6 py-3">boolean</td>
                <td className="px-6 py-3">
                  Whether this was served from cache.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">
                  processed_in_ms
                </td>
                <td className="px-6 py-3">integer</td>
                <td className="px-6 py-3">Processing time in milliseconds.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <DocH2 id="signals">Signal objects</DocH2>
        <DocP>
          <strong>email</strong> — <DocCode>valid</DocCode> (bool),{" "}
          <DocCode>disposable</DocCode> (bool),{" "}
          <DocCode>free_provider</DocCode> (bool),{" "}
          <DocCode>role_based</DocCode> (bool), <DocCode>mx_record</DocCode>{" "}
          (bool).
        </DocP>
        <DocP>
          <strong>company</strong> — <DocCode>domain</DocCode> (string),{" "}
          <DocCode>domain_alive</DocCode> (bool),{" "}
          <DocCode>domain_age_days</DocCode> (int),{" "}
          <DocCode>has_website</DocCode> (bool),{" "}
          <DocCode>industry_guess</DocCode> (string),{" "}
          <DocCode>size_estimate</DocCode> (string).
        </DocP>
        <DocP>
          <strong>person</strong> — <DocCode>name_matches_email</DocCode>{" "}
          (bool), <DocCode>likely_at_company</DocCode> (bool),{" "}
          <DocCode>confidence</DocCode> (float 0-1).
        </DocP>
        <DocP>
          <strong>ip</strong> — <DocCode>country</DocCode> (string),{" "}
          <DocCode>is_vpn</DocCode> (bool), <DocCode>is_tor</DocCode> (bool),{" "}
          <DocCode>risk_score</DocCode> (int 0-100).
        </DocP>

        <DocH2 id="example">Example</DocH2>
        <CodeBlock
          code={`curl -X POST https://api.vouchley.getrevlio.com/v1/verify \\
  -H "Authorization: Bearer $VOUCHLEY_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john.doe@acme.com",
    "name": "John Doe",
    "company_name": "Acme Inc.",
    "ip_address": "203.0.113.42"
  }'`}
          lang="bash"
          filename="Request"
        />

        <DocCallout tone="info" title="402 on zero balance">
          If your credit balance is zero, this endpoint returns{" "}
          <DocCode>402 Payment Required</DocCode> instead of running the check.
        </DocCallout>
      </article>

      <DocsToc items={TOC} />
      <MobileTocFab items={TOC} />
    </>
  );
}
