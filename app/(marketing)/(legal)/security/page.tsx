import type { Metadata } from "next";

import { DocCode, DocH2, DocLink, DocP } from "@/components/docs/doc-typography";
import { LegalDocHeader } from "@/components/legal/doc-header";
import { LegalTocCard, type LegalTocItem } from "@/components/legal/toc-card";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Security Overview — ${SITE.name}`,
  description:
    "How we secure your data and API keys, and how to disclose a vulnerability to us.",
  alternates: { canonical: "/security" },
};

const TOC: LegalTocItem[] = [
  { id: "in-transit", title: "Data in transit" },
  { id: "at-rest", title: "Data at rest" },
  { id: "api-keys", title: "API key handling" },
  { id: "sessions", title: "Session management" },
  { id: "infra", title: "Infrastructure" },
  { id: "access", title: "Access controls" },
  { id: "disclosure", title: "Responsible disclosure" },
  { id: "roadmap", title: "What we don't have yet" },
];

export default function SecurityPage() {
  return (
    <>
      <LegalDocHeader
        docId="SEC-2026-04"
        title="Security Overview"
        effective="April 19, 2026"
        updated="April 19, 2026"
      />

      <LegalTocCard items={TOC} />

      <div className="space-y-2 text-[15px] leading-relaxed text-ink-muted">
        <DocP>
          We run Vouchley as a small, focused operation. Our approach to
          security is to rely on proven primitives, minimise attack surface,
          and be honest about what we have and haven&rsquo;t implemented yet.
        </DocP>

        <DocH2 id="in-transit">Data in transit</DocH2>
        <DocP>
          All traffic to vouchley.getrevlio.com and api.vouchley.getrevlio.com is served over TLS 1.2+
          with modern cipher suites. HTTP is redirected to HTTPS, and HSTS is
          enabled. Our reverse proxy (Caddy) automatically provisions and
          renews certificates from Let&rsquo;s Encrypt.
        </DocP>

        <DocH2 id="at-rest">Data at rest</DocH2>
        <DocP>
          The Postgres database and Redis cache live on our VPS, which runs
          full-disk encryption provided by the hosting layer. Database backups
          are encrypted before upload to object storage.
        </DocP>

        <DocH2 id="api-keys">API key handling</DocH2>
        <DocP>
          API keys are shown to you exactly once at creation. On our side we
          store only a SHA-256 hash of the key; the plaintext is never written
          to disk. A leaked key can be revoked immediately from the dashboard
          — revocation takes effect on the next request.
        </DocP>

        <DocH2 id="sessions">Session management</DocH2>
        <DocP>
          Dashboard sessions are managed by better-auth. Session cookies are
          HTTP-only, <DocCode>Secure</DocCode> in production, and{" "}
          <DocCode>SameSite=Lax</DocCode>. Signing in with Google uses OAuth
          2.0; we never see your Google password. Email-and-password sign-ups
          require email verification before the account can make API calls.
        </DocP>

        <DocH2 id="infra">Infrastructure</DocH2>
        <DocP>
          Vouchley runs on a self-managed VPS fronted by Cloudflare for edge
          protection. Application deployments are managed by Coolify, which
          runs each service in an isolated container with least-privilege
          access to the database. Secrets live in environment variables, not
          in the repository.
        </DocP>

        <DocH2 id="access">Access controls</DocH2>
        <DocP>
          Production access is limited to the founder. SSH uses key-based
          authentication only (no passwords). Database access from outside the
          VPS is blocked at the firewall level. Logs and observability are
          piped to Sentry (errors) and PostHog (analytics) with PII scrubbing.
        </DocP>

        <DocH2 id="disclosure">Responsible disclosure</DocH2>
        <DocP>
          If you believe you&rsquo;ve found a security vulnerability, please
          email{" "}
          <DocLink href="mailto:security@getrevlio.com">
            security@getrevlio.com
          </DocLink>
          {" "}with details. We&rsquo;ll acknowledge within two business days,
          keep you updated as we investigate, and credit you in the release
          notes once the issue is fixed (unless you prefer to stay anonymous).
          Please don&rsquo;t publicly disclose until we&rsquo;ve had a chance
          to patch.
        </DocP>

        <DocH2 id="roadmap">What we don&rsquo;t have yet</DocH2>
        <DocP>
          Honesty matters. Vouchley is not SOC 2 certified, HIPAA compliant, or
          ISO 27001 audited. We do not offer single-sign-on (SAML) or custom
          data-residency agreements. If your organisation needs any of these
          before adopting a vendor, we&rsquo;re probably not the right fit yet
          — and we&rsquo;ll tell you that honestly. These items are on the
          roadmap for when we scale past the founder phase.
        </DocP>
      </div>
    </>
  );
}
