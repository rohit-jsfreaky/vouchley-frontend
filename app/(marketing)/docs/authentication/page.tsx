import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/docs/breadcrumbs";
import {
  DocCallout,
  DocCode,
  DocH1,
  DocH2,
  DocLead,
  DocLink,
  DocP,
} from "@/components/docs/doc-typography";
import { MobileTocFab } from "@/components/docs/mobile-toc-fab";
import { DocsToc } from "@/components/docs/toc";
import { CodeBlock } from "@/components/ui/code-block";
import type { TocItem } from "@/config/docs";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Authentication — ${SITE.name} Docs`,
  description:
    "Secure your Vouchley integration with Bearer tokens. Test vs live keys, rotation, and security best practices.",
};

const TOC: TocItem[] = [
  { id: "generating", title: "Generating API keys", level: 2 },
  { id: "key-types", title: "Key types", level: 2 },
  { id: "rotating", title: "Rotating keys", level: 2 },
  { id: "security", title: "Security best practices", level: 2 },
];

export default function DocsAuthenticationPage() {
  return (
    <>
      <article className="min-w-0 flex-1 py-12">
        <Breadcrumbs
          items={[
            { label: "Docs", href: "/docs" },
            { label: "Getting Started", href: "/docs" },
            { label: "Authentication" },
          ]}
        />

        <DocH1>Authentication</DocH1>
        <DocLead>
          Every request to the Vouchley API must carry a Bearer token. Keys are
          scoped to your account and live in two environments — test and live —
          so you can develop safely without touching real credit balances.
        </DocLead>

        <DocH2 id="generating">Generating API keys</DocH2>
        <DocP>
          Open the{" "}
          <DocLink href="/dashboard/keys">API Keys</DocLink> page in your
          dashboard and click <DocCode>Create new key</DocCode>. Pick a label
          (visible only to you) and an environment. The plaintext key is shown{" "}
          <strong>exactly once</strong> — copy it into your server-side
          secrets manager before closing the modal.
        </DocP>
        <CodeBlock
          code={`curl -X POST https://api.vouchley.io/v1/verify \\
  -H "Authorization: Bearer vch_live_abc123def456..." \\
  -H "Content-Type: application/json" \\
  -d '{"email": "john@acme.com"}'`}
          lang="bash"
          filename="Example request"
        />

        <DocH2 id="key-types">Key types</DocH2>
        <DocP>
          Vouchley provides two environments to support your development
          lifecycle. Always use test keys during development. Test requests do
          not deduct from your credit balance and do not surface in production
          analytics.
        </DocP>
        <div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <KeyCard
            label="Test keys"
            prefix="vch_test_"
            description="Used for development and staging. Isolated from live data."
            badge="Safe"
            tone="accent"
          />
          <KeyCard
            label="Live keys"
            prefix="vch_live_"
            description="Used for production. Every call deducts 1 credit from your balance."
            badge="Sensitive"
            tone="danger"
          />
        </div>

        <DocH2 id="rotating">Rotating keys</DocH2>
        <DocP>
          Revoke a key from the dashboard to take it offline immediately. Past
          requests stay logged but any new call with that key returns{" "}
          <DocCode>401 Unauthorized</DocCode>. Best practice: generate the new
          key first, deploy it everywhere, verify traffic is flowing, then
          revoke the old one.
        </DocP>

        <DocH2 id="security">Security best practices</DocH2>
        <DocCallout tone="warning" title="Never expose live keys in the browser">
          API keys belong in server-side environment variables only. A key
          committed to a public repo or shipped in a client bundle is
          effectively leaked — rotate it immediately from the dashboard.
        </DocCallout>
        <ul className="mb-6 list-disc space-y-2 pl-6 text-base leading-relaxed text-ink-muted">
          <li>Keep one key per deployment environment (staging, production).</li>
          <li>Rotate keys at least quarterly, and immediately on any suspected leak.</li>
          <li>Use environment-specific labels so the dashboard stays scannable.</li>
          <li>
            Enable email alerts on <DocCode>usage_threshold</DocCode> events to
            catch abuse early.
          </li>
        </ul>
      </article>

      <DocsToc items={TOC} />
      <MobileTocFab items={TOC} />
    </>
  );
}

function KeyCard({
  label,
  prefix,
  description,
  badge,
  tone,
}: {
  label: string;
  prefix: string;
  description: string;
  badge: string;
  tone: "accent" | "danger";
}) {
  const badgeStyle =
    tone === "accent"
      ? "bg-accent-soft text-accent"
      : "bg-danger-bg text-danger";
  return (
    <div className="rounded-xl border border-border/50 bg-surface p-6">
      <h3 className="mb-2 font-semibold text-ink">{label}</h3>
      <p className="mb-4 text-sm text-ink-muted">
        {description} Prefix:{" "}
        <code className="rounded bg-subtle px-1.5 py-0.5 font-mono text-xs text-ink">
          {prefix}
        </code>
      </p>
      <span
        className={`inline-flex items-center rounded px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${badgeStyle}`}
      >
        {badge}
      </span>
    </div>
  );
}
