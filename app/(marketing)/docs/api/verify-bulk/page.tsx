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
  title: `POST /v1/verify/bulk — ${SITE.name} Docs`,
  alternates: { canonical: "/docs/api/verify-bulk" },
};

const TOC: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "submit", title: "Submit a bulk job", level: 2 },
  { id: "request-body", title: "Request body", level: 3 },
  { id: "poll", title: "Poll for results", level: 2 },
  { id: "job-response", title: "Job status response", level: 3 },
  { id: "example", title: "Full example", level: 2 },
];

export default function VerifyBulkApiPage() {
  return (
    <>
      <article className="min-w-0 flex-1 py-12">
        <Breadcrumbs
          items={[
            { label: "Docs", href: "/docs" },
            { label: "API Reference", href: "/docs" },
            { label: "POST /v1/verify/bulk" },
          ]}
        />

        <DocH1>POST /v1/verify/bulk</DocH1>
        <DocLead>
          Submit up to 1,000 emails for asynchronous batch verification. Results
          are available by polling the job status endpoint.
        </DocLead>

        <DocH2 id="overview">Overview</DocH2>
        <DocP>
          Bulk verification is a two-step process:
        </DocP>
        <ol className="mb-6 list-decimal space-y-2 pl-6 text-base leading-relaxed text-ink-muted">
          <li>
            <strong>Submit</strong> — <DocCode>POST /v1/verify/bulk</DocCode>{" "}
            with an array of items. Returns immediately with a{" "}
            <DocCode>job_id</DocCode> and status <DocCode>202 Accepted</DocCode>.
          </li>
          <li>
            <strong>Poll</strong> — <DocCode>GET /v1/jobs/:job_id</DocCode>{" "}
            until <DocCode>status</DocCode> is <DocCode>completed</DocCode> or{" "}
            <DocCode>failed</DocCode>. The response includes all individual
            results.
          </li>
        </ol>

        <DocCallout tone="info" title="Credits are deducted per item">
          Each item in the batch deducts 1 credit (cached hits are free, same as
          single verify). Your balance must be greater than zero to submit a bulk
          job.
        </DocCallout>

        <DocH2 id="submit">Submit a bulk job</DocH2>
        <DocP>
          <DocCode>POST /v1/verify/bulk</DocCode>
        </DocP>

        <DocH3 id="request-body">Request body</DocH3>
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
                <td className="px-6 py-3 font-mono text-xs">items</td>
                <td className="px-6 py-3">array (1-1000)</td>
                <td className="px-6 py-3">
                  Array of verification objects. Each has the same shape as a
                  single verify request:{" "}
                  <DocCode>email</DocCode> (required),{" "}
                  <DocCode>name</DocCode>, <DocCode>company_name</DocCode>,{" "}
                  <DocCode>ip_address</DocCode> (all optional).
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <DocP>Response (<DocCode>202 Accepted</DocCode>):</DocP>
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
                <td className="px-6 py-3 font-mono text-xs">job_id</td>
                <td className="px-6 py-3">string</td>
                <td className="px-6 py-3">Unique job identifier.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">status</td>
                <td className="px-6 py-3">string</td>
                <td className="px-6 py-3">
                  Initially <DocCode>queued</DocCode>.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">total</td>
                <td className="px-6 py-3">integer</td>
                <td className="px-6 py-3">
                  Number of items submitted.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <DocH2 id="poll">Poll for results</DocH2>
        <DocP>
          <DocCode>GET /v1/jobs/:job_id</DocCode>
        </DocP>
        <DocP>
          Poll this endpoint to check progress. The job transitions through
          statuses: <DocCode>queued</DocCode> &rarr;{" "}
          <DocCode>running</DocCode> &rarr; <DocCode>completed</DocCode> (or{" "}
          <DocCode>failed</DocCode>).
        </DocP>

        <DocH3 id="job-response">Job status response</DocH3>
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
                <td className="px-6 py-3 font-mono text-xs">job_id</td>
                <td className="px-6 py-3">string</td>
                <td className="px-6 py-3">Job identifier.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">status</td>
                <td className="px-6 py-3">string</td>
                <td className="px-6 py-3">
                  <DocCode>queued</DocCode>, <DocCode>running</DocCode>,{" "}
                  <DocCode>completed</DocCode>, or <DocCode>failed</DocCode>.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">total</td>
                <td className="px-6 py-3">integer</td>
                <td className="px-6 py-3">Total items in the batch.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">processed</td>
                <td className="px-6 py-3">integer</td>
                <td className="px-6 py-3">Items processed so far.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">succeeded</td>
                <td className="px-6 py-3">integer</td>
                <td className="px-6 py-3">Successfully verified items.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">failed</td>
                <td className="px-6 py-3">integer</td>
                <td className="px-6 py-3">Items that failed verification.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">credits_used</td>
                <td className="px-6 py-3">integer</td>
                <td className="px-6 py-3">Total credits consumed.</td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-mono text-xs">items</td>
                <td className="px-6 py-3">array</td>
                <td className="px-6 py-3">
                  Individual results (same shape as single verify response).
                  Populated when completed.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <DocH2 id="example">Full example</DocH2>
        <DocP>
          <strong>1. Submit the batch:</strong>
        </DocP>
        <CodeBlock
          code={`curl -X POST https://api.vouchley.getrevlio.com/v1/verify/bulk \\
  -H "Authorization: Bearer $VOUCHLEY_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "items": [
      { "email": "alice@acme.com", "name": "Alice Smith" },
      { "email": "bob@example.org" },
      { "email": "carol@startup.io", "ip_address": "198.51.100.7" }
    ]
  }'`}
          lang="bash"
          filename="Submit"
        />
        <CodeBlock
          code={`{
  "job_id": "job_a1b2c3d4e5f6",
  "status": "queued",
  "total": 3
}`}
          lang="json"
          filename="Response 202"
        />

        <DocP>
          <strong>2. Poll until complete:</strong>
        </DocP>
        <CodeBlock
          code={`curl https://api.vouchley.getrevlio.com/v1/jobs/job_a1b2c3d4e5f6 \\
  -H "Authorization: Bearer $VOUCHLEY_API_KEY"`}
          lang="bash"
          filename="Poll"
        />

        <DocCallout tone="warning" title="Poll responsibly">
          We recommend polling every 2-5 seconds. Do not poll more than once per
          second — aggressive polling may trigger rate limits.
        </DocCallout>
      </article>

      <DocsToc items={TOC} />
      <MobileTocFab items={TOC} />
    </>
  );
}
