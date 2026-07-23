import type { Metadata } from "next";

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
import { JsonLd } from "@/components/seo/json-ld";
import { CodeBlock } from "@/components/ui/code-block";
import type { TocItem } from "@/config/docs";
import { SITE } from "@/config/site";
import { breadcrumbJsonLd, buildMetadata, howToJsonLd } from "@/lib/seo";

// Keyword-first, brand added once by the title template (the old inline title
// "Quickstart — Vouchley Docs" double-appended the brand: "… Docs — Vouchley").
export const metadata: Metadata = buildMetadata({
  title: "Signup Verification API Quickstart",
  description:
    "Get your first Vouchley verification response in under five minutes — one API key, one POST request. The signup verification API quickstart with copy-paste code.",
  path: "/docs",
  keywords: [
    "signup verification API docs",
    "verification API quickstart",
    "email verification API integration",
  ],
});

const TOC: TocItem[] = [
  { id: "create-key", title: "1. Create an API key", level: 2 },
  { id: "first-request", title: "2. Make your first request", level: 2 },
  { id: "response", title: "3. Understand the response", level: 2 },
  { id: "wire-in", title: "4. Wire it into your signup flow", level: 2 },
  { id: "next-steps", title: "Next steps", level: 2 },
];

export default function DocsQuickstartPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "Docs", url: `${SITE.url}/docs` },
        ])}
      />
      <JsonLd
        data={howToJsonLd({
          name: "How to verify signups with the Vouchley API",
          description:
            "Integrate the Vouchley signup verification API in under five minutes — create a key, send one POST request, and act on the score.",
          totalTime: "PT5M",
          steps: [
            {
              name: "Create an API key",
              text: "Sign in to the dashboard, open API Keys, and create a new key. Keys are prefixed vch_live_ (production) or vch_test_ (sandbox). Copy it into your server-side environment.",
              url: `${SITE.url}/docs#create-key`,
            },
            {
              name: "Make your first request",
              text: "Send a POST /v1/verify with the email to score, plus optional name, company_name, and ip_address for richer signals.",
              url: `${SITE.url}/docs#first-request`,
            },
            {
              name: "Understand the response",
              text: "Read the 0–100 score and the approve, review, or block recommendation, plus the full signal breakdown your team can audit.",
              url: `${SITE.url}/docs#response`,
            },
            {
              name: "Wire it into your signup flow",
              text: "Call Vouchley inside your signup handler and branch on the recommendation: auto-approve, queue for manual review, or reject.",
              url: `${SITE.url}/docs#wire-in`,
            },
          ],
        })}
      />
      <article className="min-w-0 flex-1 py-12">
        <DocH1>Quickstart</DocH1>
        <DocLead>
          Get your first Vouchley verification response in under five minutes.
          One API key, one POST request.
        </DocLead>

        <DocH2 id="create-key">1. Create an API key</DocH2>
        <DocP>
          Sign in to the dashboard, open <DocCode>API Keys</DocCode>, and click{" "}
          <DocCode>Create new key</DocCode>. Keys are prefixed with{" "}
          <DocCode>vch_live_</DocCode> for production and{" "}
          <DocCode>vch_test_</DocCode> for sandbox. You will see the full key
          exactly once — copy it into your server-side environment immediately.
        </DocP>
        <CodeBlock
          code={`export VOUCHLEY_API_KEY=vch_live_abc123...`}
          lang="bash"
          filename=".env"
        />

        <DocH2 id="first-request">2. Make your first request</DocH2>
        <DocP>
          Every verification is a single <DocCode>POST /v1/verify</DocCode>{" "}
          call. Pass the email you want to score — and optionally the signer
          name, company name, and source IP for richer signals.
        </DocP>
        <CodeBlock
          code={`curl -X POST https://api.vouchley.getrevlio.com/v1/verify \\
  -H "Authorization: Bearer $VOUCHLEY_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john.doe@acme.com",
    "name": "John Doe",
    "company_name": "Acme Inc.",
    "ip_address": "203.0.113.42"
  }'`}
          lang="bash"
          filename="Terminal"
        />

        <DocH2 id="response">3. Understand the response</DocH2>
        <DocP>
          Vouchley responds with a score (0–100), a plain-English{" "}
          <DocCode>recommendation</DocCode> — <DocCode>approve</DocCode>,{" "}
          <DocCode>review</DocCode>, or <DocCode>block</DocCode> — plus the raw
          signal breakdown your team can audit.
        </DocP>
        <CodeBlock
          code={`{
  "request_id": "req_8f3a0c921b",
  "score": 82,
  "recommendation": "approve",
  "email": {
    "valid": true,
    "disposable": false,
    "free_provider": false,
    "role_based": false,
    "mx_record": true
  },
  "company": {
    "domain": "acme.com",
    "domain_alive": true,
    "domain_age_days": 2847,
    "has_website": true
  },
  "person": {
    "name_matches_email": true,
    "confidence": 0.82
  },
  "ip": {
    "country": "IN",
    "is_vpn": false,
    "is_tor": false,
    "risk_score": 12
  },
  "flags": [],
  "reasoning": "Valid corporate email at a 7-year-old company domain. IP clean.",
  "cached": false,
  "processed_in_ms": 847
}`}
          lang="json"
          filename="Response 200 OK"
        />

        <DocCallout tone="info" title="Cache hits are free">
          The same email + IP combination checked within 30 days returns the
          cached response and charges zero credits. Plan accordingly — repeated
          sign-up attempts from the same visitor do not drain your balance.
        </DocCallout>

        <DocH2 id="wire-in">4. Wire it into your signup flow</DocH2>
        <DocP>
          Call Vouchley inside your signup handler, then branch on{" "}
          <DocCode>recommendation</DocCode>. A common pattern: auto-approve on{" "}
          <DocCode>approve</DocCode>, queue for manual review on{" "}
          <DocCode>review</DocCode>, reject outright on <DocCode>block</DocCode>.
        </DocP>
        <CodeBlock
          code={`async function createUser(signup) {
  const resp = await fetch("https://api.vouchley.getrevlio.com/v1/verify", {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${process.env.VOUCHLEY_API_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: signup.email,
      name: signup.name,
      ip_address: signup.ip,
    }),
  });
  const { score, recommendation } = await resp.json();

  if (recommendation === "block") throw new Error("Signup rejected");
  if (recommendation === "review") await flagForManualReview(signup);

  return await db.users.insert({ ...signup, trust_score: score });
}`}
          lang="typescript"
          filename="signup.ts"
        />

        <DocH2 id="next-steps">Next steps</DocH2>
        <DocP>
          You have a working integration. Continue with{" "}
          <a
            href="/docs/authentication"
            className="font-medium text-brand underline decoration-brand/40 hover:decoration-brand"
          >
            Authentication
          </a>{" "}
          to learn how to rotate keys safely, read about{" "}
          <a
            href="/docs/caching-credits"
            className="font-medium text-brand underline decoration-brand/40 hover:decoration-brand"
          >
            Caching &amp; Credits
          </a>{" "}
          to understand how billing works, or jump to the{" "}
          <a
            href="/docs/api/verify"
            className="font-medium text-brand underline decoration-brand/40 hover:decoration-brand"
          >
            API Reference
          </a>{" "}
          for the full shape of every endpoint.
        </DocP>
      </article>

      <DocsToc items={TOC} />
      <MobileTocFab items={TOC} />
    </>
  );
}
