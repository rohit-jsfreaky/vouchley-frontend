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
import type { TocItem } from "@/config/docs";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Error Handling — ${SITE.name} Docs`,
  alternates: { canonical: "/docs/errors" },
};

const TOC: TocItem[] = [
  { id: "error-format", title: "Error format", level: 2 },
  { id: "status-codes", title: "Status codes", level: 2 },
  { id: "common-errors", title: "Common errors", level: 2 },
];

export default function ErrorsPage() {
  return (
    <>
      <article className="min-w-0 flex-1 py-12">
        <Breadcrumbs
          items={[
            { label: "Docs", href: "/docs" },
            { label: "Core Concepts", href: "/docs" },
            { label: "Error Handling" },
          ]}
        />

        <DocH1>Error Handling</DocH1>
        <DocLead>
          Every Vouchley API error returns a consistent JSON body with an HTTP
          status code you can branch on.
        </DocLead>

        <DocH2 id="error-format">Error format</DocH2>
        <DocP>
          All error responses have the same shape — a JSON object with a{" "}
          <DocCode>detail</DocCode> field containing a human-readable message:
        </DocP>
        <pre className="my-6 overflow-x-auto rounded-lg border border-border/40 bg-subtle/70 p-4 font-mono text-sm leading-relaxed">
{`{
  "detail": "Insufficient credits. Purchase a credit pack to continue."
}`}
        </pre>

        <DocH2 id="status-codes">Status codes</DocH2>
        <div className="my-8 overflow-hidden rounded-xl border border-border/40">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-subtle/60">
                <th className="px-6 py-3 font-semibold text-ink">Code</th>
                <th className="px-6 py-3 font-semibold text-ink">Meaning</th>
                <th className="px-6 py-3 font-semibold text-ink">
                  What to do
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-ink-muted">
              <tr>
                <td className="px-6 py-3 font-mono">200</td>
                <td className="px-6 py-3">Success</td>
                <td className="px-6 py-3">Process the response normally.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono">202</td>
                <td className="px-6 py-3">Accepted (bulk only)</td>
                <td className="px-6 py-3">
                  Job queued. Poll <DocCode>GET /v1/jobs/:id</DocCode> for
                  results.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono">400</td>
                <td className="px-6 py-3">Bad request</td>
                <td className="px-6 py-3">
                  Check your request body — missing or invalid fields.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono">401</td>
                <td className="px-6 py-3">Unauthorized</td>
                <td className="px-6 py-3">
                  API key is missing, invalid, or revoked.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono">402</td>
                <td className="px-6 py-3">Payment required</td>
                <td className="px-6 py-3">
                  Credit balance is zero. Purchase a plan.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono">404</td>
                <td className="px-6 py-3">Not found</td>
                <td className="px-6 py-3">
                  The requested resource (check, job) doesn&apos;t exist.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono">422</td>
                <td className="px-6 py-3">Validation error</td>
                <td className="px-6 py-3">
                  Request body failed schema validation (e.g. invalid email
                  format).
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono">429</td>
                <td className="px-6 py-3">Rate limited</td>
                <td className="px-6 py-3">
                  Back off and retry. See{" "}
                  <a
                    href="/docs/rate-limits"
                    className="text-brand underline decoration-brand/40 hover:decoration-brand"
                  >
                    Rate Limits
                  </a>
                  .
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono">500</td>
                <td className="px-6 py-3">Server error</td>
                <td className="px-6 py-3">
                  Retry with backoff. If persistent, contact support.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <DocH2 id="common-errors">Common errors</DocH2>
        <DocP>
          <strong>Missing Authorization header</strong> — Every request must
          include <DocCode>Authorization: Bearer vch_...</DocCode>. Double-check
          your key is set in the environment.
        </DocP>
        <DocP>
          <strong>Invalid API key</strong> — The key may have been revoked. Check
          the{" "}
          <a
            href="/dashboard/keys"
            className="text-brand underline decoration-brand/40 hover:decoration-brand"
          >
            API Keys
          </a>{" "}
          page in your dashboard.
        </DocP>
        <DocP>
          <strong>Insufficient credits</strong> — Your balance is zero. Subscribe
          to a plan or wait for your next billing cycle if you already have an
          active subscription.
        </DocP>
      </article>

      <DocsToc items={TOC} />
      <MobileTocFab items={TOC} />
    </>
  );
}
