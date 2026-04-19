import type { Metadata } from "next";

import { DocCode, DocH2, DocH3, DocLink, DocP } from "@/components/docs/doc-typography";
import { LegalDocHeader } from "@/components/legal/doc-header";
import { LegalTocCard, type LegalTocItem } from "@/components/legal/toc-card";
import { LEGAL_CONTACT_EMAIL } from "@/config/legal";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Privacy Policy — ${SITE.name}`,
  description:
    "What data Vouchley collects, why, who processes it, and how long we keep it.",
};

const TOC: LegalTocItem[] = [
  { id: "who-we-are", title: "Who we are" },
  { id: "what-we-collect", title: "What we collect" },
  { id: "how-we-use", title: "How we use your data" },
  { id: "processors", title: "Third-party processors" },
  { id: "retention", title: "Data retention" },
  { id: "your-rights", title: "Your rights" },
  { id: "transfers", title: "International transfers" },
  { id: "changes", title: "Changes to this policy" },
  { id: "contact", title: "Contact" },
];

export default function PrivacyPage() {
  return (
    <>
      <LegalDocHeader
        docId="PRV-2026-04"
        title="Privacy Policy"
        effective="April 19, 2026"
        updated="April 19, 2026"
      />

      <LegalTocCard items={TOC} />

      <div className="space-y-2 text-[15px] leading-relaxed text-ink-muted">
        <DocH2 id="who-we-are">Who we are</DocH2>
        <DocP>
          Vouchley is a signup-verification API operated by its founder, based
          in India. When this policy says &ldquo;we&rdquo; or
          &ldquo;Vouchley,&rdquo; it refers to that business. If you need to
          reach the data controller directly, email{" "}
          <DocLink href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
            {LEGAL_CONTACT_EMAIL}
          </DocLink>
          .
        </DocP>

        <DocH2 id="what-we-collect">What we collect</DocH2>
        <DocP>
          We collect three distinct categories of data. Each one is only kept
          for the purposes described below.
        </DocP>

        <DocH3 id="collect-account">Account data</DocH3>
        <DocP>
          When you sign up, we store your name, email address, and a securely
          hashed authentication credential. If you sign in with Google, we
          receive your name, email, and Google account identifier — we do not
          receive any other Google profile data.
        </DocP>

        <DocH3 id="collect-verifications">Verification request data</DocH3>
        <DocP>
          When you call <DocCode>POST /v1/verify</DocCode>, the fields you send
          us — typically an email address, optional name, optional company
          name, and optional IP address of the signup — are processed in real
          time and logged to your account. This is data about{" "}
          <em>your</em> signups, not about you. You are the controller for this
          data; we are a processor acting on your instructions.
        </DocP>

        <DocH3 id="collect-billing">Billing data</DocH3>
        <DocP>
          Payments are processed by Dodo Payments, our Merchant of Record. Dodo
          stores your payment method; we only receive a customer identifier,
          the plan you purchased, the amount, and the invoice reference. We
          never see card numbers or bank details.
        </DocP>

        <DocH3 id="collect-telemetry">Telemetry</DocH3>
        <DocP>
          We log request metadata — timestamp, endpoint, IP address, response
          code, and latency — to operate the service, detect abuse, and
          monitor uptime. If you opt into product analytics, interaction events
          (e.g., page views inside the dashboard) are sent to PostHog.
        </DocP>

        <DocH2 id="how-we-use">How we use your data</DocH2>
        <DocP>We use the data above only for the following purposes:</DocP>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-base leading-relaxed text-ink-muted">
          <li>Authenticating you and authorising API calls made with your keys.</li>
          <li>
            Running the verification signals you requested (email checks,
            domain checks, IP reputation, LLM scoring) and returning the result.
          </li>
          <li>Tracking credit balance and billing.</li>
          <li>
            Detecting abuse and protecting other customers (rate limiting, fraud
            detection).
          </li>
          <li>
            Sending transactional email you expect — account verification,
            password resets, receipts, critical service notices.
          </li>
        </ul>
        <DocP>
          We do <strong>not</strong> sell your data, use it to train public
          models, or share it with advertisers.
        </DocP>

        <DocH2 id="processors">Third-party processors</DocH2>
        <DocP>
          We use a small number of sub-processors to deliver the service. Each
          processes only what it needs and is bound by its own privacy terms.
        </DocP>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-base leading-relaxed text-ink-muted">
          <li>
            <strong>Dodo Payments</strong> — payments and tax compliance
            (Merchant of Record). Receives billing-only data.
          </li>
          <li>
            <strong>OpenRouter</strong> — LLM scoring. Receives the structured
            signal payload (booleans, counts, country codes). Does{" "}
            <em>not</em> receive the raw email address or name unless you
            explicitly include them in the fields we score.
          </li>
          <li>
            <strong>IPQualityScore</strong> — IP reputation. Receives the IP
            address only.
          </li>
          <li>
            <strong>RDAP.org</strong> — domain registration lookup. Receives
            the domain name only.
          </li>
          <li>
            <strong>Resend</strong> — transactional email delivery. Receives
            the recipient address and email body.
          </li>
          <li>
            <strong>PostHog</strong> — optional product analytics. Receives
            dashboard interaction events if enabled.
          </li>
          <li>
            <strong>Cloudflare</strong> — DDoS protection and CDN for the
            marketing site. Sees request metadata at the edge.
          </li>
          <li>
            <strong>Our VPS provider</strong> — hosts our Postgres database,
            Redis cache, and application servers.
          </li>
        </ul>

        <DocH2 id="retention">Data retention</DocH2>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-base leading-relaxed text-ink-muted">
          <li>
            <strong>Verification cache</strong>: 30 days. Repeat requests in this
            window return the cached result at zero cost to you and are not
            re-processed by our sub-processors.
          </li>
          <li>
            <strong>Check history</strong> (your audit log): retained for the
            lifetime of your account so you can inspect past verifications from
            the dashboard. Deleted on account closure.
          </li>
          <li>
            <strong>Credit ledger</strong>: retained indefinitely as a financial
            record (tax and accounting obligations).
          </li>
          <li>
            <strong>Bulk job state</strong>: 7 days after the job completes.
          </li>
          <li>
            <strong>Webhook events</strong> (Dodo delivery audit): retained for
            the lifetime of your account for billing dispute resolution.
          </li>
          <li>
            <strong>Archived accounts</strong>: accounts with no login activity
            for 24 consecutive months may be archived. Archived data can be
            restored on request.
          </li>
        </ul>

        <DocH2 id="your-rights">Your rights</DocH2>
        <DocP>
          Regardless of where you live, you can exercise the following rights.
          Email <DocLink href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</DocLink>
          {" "}and we&rsquo;ll respond within 30 days.
        </DocP>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-base leading-relaxed text-ink-muted">
          <li><strong>Access</strong>: a copy of what we hold about you.</li>
          <li><strong>Correction</strong>: fix inaccuracies via the dashboard or by writing to us.</li>
          <li><strong>Deletion</strong>: close your account and erase personal data (financial records we are required to keep are excepted).</li>
          <li><strong>Export</strong>: your check history as JSON or CSV.</li>
          <li><strong>Objection / restriction</strong>: pause specific processing activities where GDPR applies.</li>
        </ul>

        <DocH2 id="transfers">International transfers</DocH2>
        <DocP>
          Our infrastructure currently runs on a VPS in the European region; we
          may move or add regions as we scale. Dodo Payments and OpenRouter
          process data in the United States. By using Vouchley, you acknowledge
          these transfers. Where the GDPR applies we rely on Standard
          Contractual Clauses with each sub-processor.
        </DocP>

        <DocH2 id="changes">Changes to this policy</DocH2>
        <DocP>
          We&rsquo;ll update the &ldquo;Last Updated&rdquo; date above whenever
          this policy changes. For material changes we&rsquo;ll email every
          account holder at least 14 days before the new policy takes effect.
        </DocP>

        <DocH2 id="contact">Contact</DocH2>
        <DocP>
          Questions about this policy go to{" "}
          <DocLink href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
            {LEGAL_CONTACT_EMAIL}
          </DocLink>
          . Abuse or security reports go to{" "}
          <DocLink href="mailto:security@vouchley.io">
            security@vouchley.io
          </DocLink>
          .
        </DocP>
      </div>
    </>
  );
}
