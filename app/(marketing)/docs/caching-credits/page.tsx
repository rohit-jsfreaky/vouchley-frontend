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
  title: `Caching & Credits — ${SITE.name} Docs`,
  alternates: { canonical: "/docs/caching-credits" },
};

const TOC: TocItem[] = [
  { id: "how-caching-works", title: "How caching works", level: 2 },
  { id: "credit-deduction", title: "Credit deduction", level: 2 },
  { id: "plans", title: "Plans & pricing", level: 2 },
  { id: "rollover", title: "Credit rollover", level: 2 },
];

export default function CachingCreditsPage() {
  return (
    <>
      <article className="min-w-0 flex-1 py-12">
        <Breadcrumbs
          items={[
            { label: "Docs", href: "/docs" },
            { label: "Core Concepts", href: "/docs" },
            { label: "Caching & Credits" },
          ]}
        />

        <DocH1>Caching & Credits</DocH1>
        <DocLead>
          Understand how Vouchley caches verification results and how credits are
          consumed.
        </DocLead>

        <DocH2 id="how-caching-works">How caching works</DocH2>
        <DocP>
          Every verification result is cached using a deterministic key derived
          from the combination of <DocCode>email</DocCode>,{" "}
          <DocCode>ip_address</DocCode>, <DocCode>name</DocCode>, and{" "}
          <DocCode>company_name</DocCode>. When the same combination is submitted
          again, Vouchley returns the cached result instantly.
        </DocP>
        <DocP>
          Cached responses include <DocCode>{`"cached": true`}</DocCode> in the
          response body so your code can distinguish fresh runs from cached hits.
        </DocP>

        <DocCallout tone="info" title="Cache hits are free">
          Cached responses charge zero credits. This means repeated sign-up
          attempts from the same visitor do not drain your balance.
        </DocCallout>

        <DocH2 id="credit-deduction">Credit deduction</DocH2>
        <DocP>
          Each non-cached verification deducts <strong>1 credit</strong> from
          your account balance. If your balance reaches zero, subsequent calls
          return <DocCode>402 Payment Required</DocCode> until you purchase more
          credits.
        </DocP>
        <DocP>
          The <DocCode>credits_charged</DocCode> field in every response tells
          you exactly how many credits were consumed (0 for cache hits, 1 for
          fresh verifications).
        </DocP>

        <DocH2 id="plans">Plans & pricing</DocH2>
        <DocP>
          Vouchley offers three monthly subscription plans. All plans are billed
          monthly and credits roll over indefinitely:
        </DocP>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-base leading-relaxed text-ink-muted">
          <li>
            <strong>Starter</strong> — $19/month, 15,000 credits ($0.00127/credit)
          </li>
          <li>
            <strong>Pro</strong> — $49/month, 50,000 credits ($0.00098/credit,
            save 23%)
          </li>
          <li>
            <strong>Scale</strong> — $99/month, 200,000 credits
            ($0.0005/credit, best rate)
          </li>
        </ul>
        <DocP>
          New accounts start with 100 free credits to test the API. After these
          are used, subscribe to a plan from the{" "}
          <a
            href="/dashboard/billing"
            className="font-medium text-brand underline decoration-brand/40 hover:decoration-brand"
          >
            Billing
          </a>{" "}
          page.
        </DocP>

        <DocH2 id="rollover">Credit rollover</DocH2>
        <DocP>
          Unused credits roll over indefinitely. Each billing cycle adds your
          plan&apos;s monthly allocation on top of whatever balance you already
          have. There is no expiration date on credits.
        </DocP>
      </article>

      <DocsToc items={TOC} />
      <MobileTocFab items={TOC} />
    </>
  );
}
