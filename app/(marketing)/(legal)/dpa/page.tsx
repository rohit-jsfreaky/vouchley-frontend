import type { Metadata } from "next";

import { DocH2, DocLink, DocP } from "@/components/docs/doc-typography";
import { LegalDocHeader } from "@/components/legal/doc-header";
import { LEGAL_CONTACT_EMAIL } from "@/config/legal";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Data Processing Addendum — ${SITE.name}`,
  description:
    "Our DPA is available on request for business customers with GDPR or similar obligations.",
};

export default function DpaPage() {
  return (
    <>
      <LegalDocHeader
        docId="DPA-2026-04"
        title="Data Processing Addendum"
        effective="April 19, 2026"
        updated="April 19, 2026"
      />

      <div className="space-y-2 text-[15px] leading-relaxed text-ink-muted">
        <DocP>
          A Data Processing Addendum (DPA) formalises the roles and
          obligations between you (the data controller) and Vouchley (the data
          processor) when you run verifications on personal data of your own
          users.
        </DocP>

        <DocH2 id="availability">Availability</DocH2>
        <DocP>
          Our DPA covers the commitments in Article 28 of the GDPR, including:
        </DocP>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-base leading-relaxed text-ink-muted">
          <li>Subject matter, nature, and duration of processing</li>
          <li>Categories of data subjects and personal data</li>
          <li>Confidentiality and security of processing</li>
          <li>Sub-processor disclosure and approval (see the list in our Privacy Policy)</li>
          <li>Data-subject rights support (access, deletion, export)</li>
          <li>International transfer mechanisms (Standard Contractual Clauses)</li>
          <li>Breach notification within 72 hours</li>
          <li>Audit rights on reasonable notice</li>
        </ul>

        <DocH2 id="request">How to request it</DocH2>
        <DocP>
          Because we sign DPAs one customer at a time during this early phase,
          we don&rsquo;t yet publish a click-through version. Email{" "}
          <DocLink href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
            {LEGAL_CONTACT_EMAIL}
          </DocLink>
          {" "}from the address on your Vouchley account and we&rsquo;ll send
          the current PDF, pre-signed, within two business days. We&rsquo;re
          also happy to counter-sign your own template if it&rsquo;s
          substantively equivalent.
        </DocP>

        <DocH2 id="future">Self-serve version</DocH2>
        <DocP>
          We&rsquo;ll publish a self-serve, click-to-accept DPA here once we
          have enough business customers to justify the review overhead. Until
          then, thanks for your patience.
        </DocP>
      </div>
    </>
  );
}
