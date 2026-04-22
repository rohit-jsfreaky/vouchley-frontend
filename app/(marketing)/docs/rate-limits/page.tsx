import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/docs/breadcrumbs";
import {
  DocCallout,
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
  title: `Rate Limits — ${SITE.name} Docs`,
  alternates: { canonical: "/docs/rate-limits" },
};

const TOC: TocItem[] = [
  { id: "limits", title: "Rate limits by plan", level: 2 },
  { id: "how-it-works", title: "How it works", level: 2 },
  { id: "handling-429", title: "Handling 429 responses", level: 2 },
];

export default function RateLimitsPage() {
  return (
    <>
      <article className="min-w-0 flex-1 py-12">
        <Breadcrumbs
          items={[
            { label: "Docs", href: "/docs" },
            { label: "Core Concepts", href: "/docs" },
            { label: "Rate Limits" },
          ]}
        />

        <DocH1>Rate Limits</DocH1>
        <DocLead>
          Vouchley applies per-key rate limits to protect the service and ensure
          fair usage across all customers.
        </DocLead>

        <DocH2 id="limits">Rate limits by plan</DocH2>
        <DocP>
          Limits are enforced per API key, per minute. The tier is determined by
          your current credit balance:
        </DocP>

        <div className="my-8 overflow-hidden rounded-xl border border-border/40">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-subtle/60">
                <th className="px-6 py-3 font-semibold text-ink">Tier</th>
                <th className="px-6 py-3 font-semibold text-ink">
                  Requests / minute
                </th>
                <th className="px-6 py-3 font-semibold text-ink">Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-ink-muted">
              <tr>
                <td className="px-6 py-3">Free</td>
                <td className="px-6 py-3 font-mono">100</td>
                <td className="px-6 py-3">Credit balance &le; 100</td>
              </tr>
              <tr>
                <td className="px-6 py-3">Paid</td>
                <td className="px-6 py-3 font-mono">600</td>
                <td className="px-6 py-3">Credit balance &gt; 100</td>
              </tr>
            </tbody>
          </table>
        </div>

        <DocH2 id="how-it-works">How it works</DocH2>
        <DocP>
          Vouchley uses a fixed-window rate limiter. Each API key gets a
          per-minute counter that resets at the start of every calendar minute.
          If you exceed the limit, subsequent requests in that window receive a{" "}
          <DocCode>429 Too Many Requests</DocCode> response.
        </DocP>

        <DocCallout tone="info" title="Limits are per key, not per account">
          If you have multiple API keys, each key has its own independent rate
          limit counter. This means you can distribute load across keys if
          needed.
        </DocCallout>

        <DocH2 id="handling-429">Handling 429 responses</DocH2>
        <DocP>
          When you receive a <DocCode>429</DocCode> response, back off and retry
          after a short delay. The simplest strategy is exponential backoff:
        </DocP>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-base leading-relaxed text-ink-muted">
          <li>Wait 1 second, then retry.</li>
          <li>If still 429, wait 2 seconds, then retry.</li>
          <li>Continue doubling up to a maximum of 30 seconds.</li>
        </ul>
        <DocP>
          The <DocCode>429</DocCode> response body contains:{" "}
          <DocCode>
            {`{"detail": "Rate limit exceeded. Slow down and try again."}`}
          </DocCode>
        </DocP>
      </article>

      <DocsToc items={TOC} />
      <MobileTocFab items={TOC} />
    </>
  );
}
