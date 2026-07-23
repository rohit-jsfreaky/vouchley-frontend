import type { Metadata } from "next";
import Link from "next/link";

import { DisposableEmailChecker } from "@/components/tools/disposable-email-checker";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE } from "@/config/site";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Free Disposable Email Checker",
  description:
    "Free tool to check if an email is disposable, temporary, or fake. Instantly detect throwaway addresses (Mailinator, temp-mail, and thousands more) and verify the domain's mail server. No signup.",
  path: "/tools/disposable-email-checker",
  keywords: [
    "disposable email checker",
    "temp mail checker",
    "check if email is disposable",
    "fake email checker",
    "temporary email checker",
  ],
});

const FAQ = [
  {
    question: "Is this disposable email checker free?",
    answer:
      "Yes, completely free with no signup. Enter any email address and the checker tells you whether it's a disposable / throwaway address, whether the domain has a working mail server, and whether it's a role-based or free-provider address.",
  },
  {
    question: "How does the checker detect disposable emails?",
    answer:
      "It matches the email's domain against Vouchley's published list of thousands of known disposable and temporary email providers — Mailinator, 10MinuteMail, Guerrilla Mail, temp-mail, and many more, including their alias domains — and then does a live MX-record lookup to confirm the domain can actually receive mail.",
  },
  {
    question: "Can I check if an email is fake or temporary?",
    answer:
      "Yes. Temporary and throwaway addresses are exactly what this tool flags. A result of \"Block\" with the disposable flag set means the address is a temporary inbox that will stop working shortly after signup — a strong signal the signup is not a real, reachable user.",
  },
  {
    question: "Does this verify that the mailbox actually exists?",
    answer:
      "It verifies the domain has valid MX records (so it can receive mail), but it does not open an SMTP connection to confirm the specific mailbox exists — that requires the full Vouchley API. For most signup-fraud use cases the disposable and MX signals here are what matter most.",
  },
  {
    question: "How do I block disposable emails on my own signup form?",
    answer:
      "Call a verification API at signup and reject addresses flagged as disposable. The Vouchley /v1/verify endpoint does the disposable check plus IP, VPN/proxy, domain-age, and bot signals in one call, returning a score and an approve/review/block recommendation.",
  },
];

export default function DisposableEmailCheckerPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Disposable Email Checker",
          url: `${SITE.url}/tools/disposable-email-checker`,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          description:
            "Free tool to check if an email address is disposable, temporary, or fake.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@id": `${SITE.url}/#organization` },
        }}
      />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "Tools", url: `${SITE.url}/tools/disposable-email-checker` },
          {
            name: "Disposable Email Checker",
            url: `${SITE.url}/tools/disposable-email-checker`,
          },
        ])}
      />

      <section className="bg-canvas px-6 pb-8 pt-20 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Free tool
          </p>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Disposable email checker
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-ink-muted">
            Paste an email to see if it&apos;s disposable, temporary, or fake.
            Checked against 11,000+ known throwaway domains (refreshed daily)
            plus a live mail-server lookup. No signup, no cost.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-8">
        <DisposableEmailChecker />
      </section>

      <section className="border-t border-border bg-surface px-6 py-16 md:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-ink">
            What the checker looks at
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            <li className="rounded-xl border border-border bg-canvas/60 p-5">
              <h3 className="mb-1 font-semibold text-ink">Disposable domains</h3>
              <p className="text-sm leading-relaxed text-ink-muted">
                Matches against thousands of known temporary / throwaway
                providers and their alias domains, refreshed regularly.
              </p>
            </li>
            <li className="rounded-xl border border-border bg-canvas/60 p-5">
              <h3 className="mb-1 font-semibold text-ink">Mail server (MX)</h3>
              <p className="text-sm leading-relaxed text-ink-muted">
                A live DNS lookup confirms the domain can actually receive
                email. No MX means the address is undeliverable.
              </p>
            </li>
            <li className="rounded-xl border border-border bg-canvas/60 p-5">
              <h3 className="mb-1 font-semibold text-ink">Role-based address</h3>
              <p className="text-sm leading-relaxed text-ink-muted">
                Flags <code className="text-brand">info@</code>,{" "}
                <code className="text-brand">admin@</code>, and similar addresses
                that rarely belong to one real person.
              </p>
            </li>
            <li className="rounded-xl border border-border bg-canvas/60 p-5">
              <h3 className="mb-1 font-semibold text-ink">Free provider</h3>
              <p className="text-sm leading-relaxed text-ink-muted">
                Identifies Gmail, Outlook, and other legitimate free providers —
                not blocked, but worth scoring a little tighter.
              </p>
            </li>
          </ul>

          <div className="mt-8 rounded-2xl border border-brand/20 bg-brand-soft/40 p-6">
            <h2 className="mb-2 text-lg font-semibold text-ink">
              Need the full picture at signup?
            </h2>
            <p className="text-sm leading-relaxed text-ink-muted">
              This tool checks the email and its domain. The{" "}
              <Link href="/docs/api/verify" className="font-medium text-brand hover:underline">
                Vouchley API
              </Link>{" "}
              also scores IP reputation, VPN, proxy, Tor, datacenter IPs, and
              AI-bot behavior — everything you need to stop{" "}
              <Link
                href="/blog/prevent-fake-signups-2026"
                className="font-medium text-brand hover:underline"
              >
                fake signups
              </Link>{" "}
              in one API call.{" "}
              <Link href="/pricing" className="font-medium text-brand hover:underline">
                From $19/month
              </Link>{" "}
              with 100 free credits to start.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 md:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-ink">
            Frequently asked questions
          </h2>
          <dl className="divide-y divide-border">
            {FAQ.map((item) => (
              <div key={item.question} className="py-5">
                <dt className="mb-2 font-semibold text-ink">{item.question}</dt>
                <dd className="text-sm leading-relaxed text-ink-muted">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
