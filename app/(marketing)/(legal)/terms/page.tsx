import type { Metadata } from "next";

import { DocCode, DocH2, DocLink, DocP } from "@/components/docs/doc-typography";
import { LegalDocHeader } from "@/components/legal/doc-header";
import { LegalTocCard, type LegalTocItem } from "@/components/legal/toc-card";
import { LEGAL_CONTACT_EMAIL } from "@/config/legal";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Terms of Service — ${SITE.name}`,
  description:
    "The agreement between you and Vouchley for using the signup-verification API.",
  alternates: { canonical: "/terms" },
};

const TOC: LegalTocItem[] = [
  { id: "acceptance", title: "Acceptance" },
  { id: "service", title: "The service" },
  { id: "account", title: "Your account" },
  { id: "credits", title: "Credits and billing" },
  { id: "acceptable-use", title: "Acceptable use" },
  { id: "api-keys", title: "API keys" },
  { id: "ip", title: "Intellectual property" },
  { id: "warranty", title: "Warranty disclaimer" },
  { id: "liability", title: "Limitation of liability" },
  { id: "termination", title: "Termination" },
  { id: "law", title: "Governing law" },
  { id: "changes", title: "Changes" },
];

export default function TermsPage() {
  return (
    <>
      <LegalDocHeader
        docId="TOS-2026-04"
        title="Terms of Service"
        effective="April 19, 2026"
        updated="April 19, 2026"
      />

      <LegalTocCard items={TOC} />

      <div className="space-y-2 text-[15px] leading-relaxed text-ink-muted">
        <DocH2 id="acceptance">Acceptance</DocH2>
        <DocP>
          By creating a Vouchley account or calling our API, you agree to these
          Terms and to our Privacy Policy. If you&rsquo;re agreeing on behalf of
          a company, you represent that you have authority to bind that company.
        </DocP>

        <DocH2 id="service">The service</DocH2>
        <DocP>
          Vouchley is a real-time signup-verification API. Given an email
          address and optional metadata, we return a score and a recommendation
          so you can decide whether to approve, review, or block a signup.
          Availability and features may evolve; we&rsquo;ll give reasonable
          notice before removing anything you depend on.
        </DocP>

        <DocH2 id="account">Your account</DocH2>
        <DocP>
          You need a verified email to use the service. One person or
          organisation may create only one primary account. You are responsible
          for everything that happens under your account and must keep your
          credentials secure.
        </DocP>

        <DocH2 id="credits">Credits and billing</DocH2>
        <DocP>
          Vouchley is sold in one-time credit packs and, optionally, as a
          monthly auto-refill plan. Credits never expire while your account is
          active. One verification costs one credit; cache hits cost zero.
          Purchases are processed by Dodo Payments, our Merchant of Record, who
          also handles VAT, GST, and sales tax depending on your location.
        </DocP>
        <DocP>
          Credit packs are{" "}
          <strong>non-refundable once the credits have been used</strong>, except
          where required by law. If you purchased a pack by mistake and have
          not consumed any credits, email{" "}
          <DocLink href="mailto:hello@getrevlio.com">hello@getrevlio.com</DocLink>
          {" "}within 14 days and we&rsquo;ll reverse the charge through Dodo.
        </DocP>
        <DocP>
          When your balance hits zero, our API returns{" "}
          <DocCode>402 Payment Required</DocCode>. No overages are charged
          automatically. Top up another pack or enable auto-refill to continue.
        </DocP>

        <DocH2 id="acceptable-use">Acceptable use</DocH2>
        <DocP>You agree not to:</DocP>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-base leading-relaxed text-ink-muted">
          <li>
            Use Vouchley to verify datasets obtained unlawfully, or to profile
            individuals in violation of privacy laws applicable to you.
          </li>
          <li>
            Resell raw verification responses as a competing product, or
            otherwise use Vouchley to build a directly-competing dataset.
          </li>
          <li>Reverse-engineer, scrape, or stress-test our infrastructure.</li>
          <li>Attempt to exceed rate limits or share API keys across unrelated businesses.</li>
          <li>
            Use the service for anything illegal, for harassment, or to process
            sensitive data that our service wasn&rsquo;t designed for (for
            example, HIPAA-regulated health data).
          </li>
        </ul>

        <DocH2 id="api-keys">API keys</DocH2>
        <DocP>
          API keys are yours to safeguard. Keep them server-side only. If a key
          is leaked, rotate it from the dashboard immediately. We hash keys on
          the server and cannot recover a plaintext once it has been created.
        </DocP>

        <DocH2 id="ip">Intellectual property</DocH2>
        <DocP>
          Vouchley owns the service, its scoring logic, dashboard, and
          documentation. You own the data you send us and the verification
          results returned for your account. Nothing in these Terms transfers
          ownership either way.
        </DocP>

        <DocH2 id="warranty">Warranty disclaimer</DocH2>
        <DocP>
          The service is provided &ldquo;as is.&rdquo; We work hard to keep
          scores accurate, but no fraud-detection system is perfect. You are
          responsible for the final decision to approve, review, or block a
          signup, and for complying with any laws that apply to your business.
        </DocP>

        <DocH2 id="liability">Limitation of liability</DocH2>
        <DocP>
          To the maximum extent permitted by law, Vouchley&rsquo;s total
          liability to you under these Terms — across all claims in any
          12-month period — is capped at the total amount you paid us during
          the three months preceding the event giving rise to the claim. We
          are not liable for lost profits, lost data, or indirect damages.
        </DocP>

        <DocH2 id="termination">Termination</DocH2>
        <DocP>
          You can close your account at any time from Settings. We may suspend
          or terminate an account that violates these Terms, engages in abuse,
          or poses a security risk. Accounts inactive for 24 consecutive months
          may be archived; archived data is restorable on request.
        </DocP>

        <DocH2 id="law">Governing law</DocH2>
        <DocP>
          These Terms are governed by the laws of India. Disputes will be
          resolved in the courts of India, unless mandatory consumer-protection
          law in your country provides otherwise.
        </DocP>

        <DocH2 id="changes">Changes</DocH2>
        <DocP>
          We&rsquo;ll update the &ldquo;Last Updated&rdquo; date above whenever
          these Terms change. For material changes we&rsquo;ll email every
          account holder at least 14 days before they take effect. Continued
          use of the service after that date means you accept the new Terms.
        </DocP>
      </div>
    </>
  );
}
