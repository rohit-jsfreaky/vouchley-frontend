/**
 * Agent skills published at `/.well-known/agent-skills/index.json`
 * (Cloudflare Agent Skills Discovery RFC v0.2.0).
 *
 * Each skill has a slug (the URL fragment), a name, a type, a short
 * description for the index, and the SKILL.md body served at
 * `/.well-known/agent-skills/<slug>/SKILL.md`.
 *
 * SHA-256 digests are computed at request time over the served SKILL.md
 * body — the index and the file content are always in sync.
 */
import { SITE } from "@/config/site";

export type SkillType = "tool" | "data" | "workflow";

export type AgentSkill = {
  slug: string;
  name: string;
  type: SkillType;
  description: string;
  body: string;
};

const VERIFY_SIGNUP_BODY = `# verify-signup — Vouchley

> Score a single signup in real time. Returns a 0–100 trust score plus an approve / review / block recommendation, with a breakdown of every signal that fired.

**Type:** \`tool\`
**Endpoint:** \`POST ${SITE.apiUrl}/v1/verify\`
**Auth:** \`Authorization: Bearer vch_live_...\`

---

## When to invoke

Call this when the user (or your code) creates a new account on a SaaS, marketplace, or developer-tool signup form. The signal you want is "is this signup real, low-quality, or fraudulent?" — answered in under 1.5 seconds.

## Input

\`\`\`json
{
  "email": "john.doe@acme.com",
  "name": "John Doe",
  "company_name": "Acme Inc.",
  "ip_address": "203.0.113.42"
}
\`\`\`

Only \`email\` is required. Each optional field unlocks more signals.

## Output

\`\`\`json
{
  "request_id": "req_8f3a0c921b",
  "score": 82,
  "recommendation": "approve",
  "email": { "valid": true, "disposable": false, "free_provider": false, "role_based": false, "mx_record": true },
  "company": { "domain": "acme.com", "domain_alive": true, "domain_age_days": 2847, "has_website": true },
  "person": { "name_matches_email": true, "confidence": 0.82 },
  "ip": { "country": "IN", "is_vpn": false, "is_tor": false, "risk_score": 12 },
  "flags": [],
  "reasoning": "Valid corporate email at a 7-year-old company domain. IP clean.",
  "cached": false,
  "processed_in_ms": 847
}
\`\`\`

## Branching on \`recommendation\`

| Value | Suggested action |
| --- | --- |
| \`approve\` | Auto-create the account |
| \`review\` | Queue for manual review or require additional verification |
| \`block\` | Reject the signup outright |

## Errors

- \`401\` — key invalid / revoked. Cannot self-recover; surface to operator.
- \`402\` — credit balance zero. Stop calling, alert operator.
- \`429\` — rate-limited; exponential backoff (1s → 2s → ... → 30s).
- \`5xx\` — retry with backoff, then surface.

## Documentation

- Full reference: ${SITE.url}/docs/api/verify
- Authentication: ${SITE.url}/docs/authentication
- Errors: ${SITE.url}/docs/errors
`;

const VERIFY_BULK_BODY = `# verify-bulk — Vouchley

> Submit up to 1,000 emails for asynchronous batch verification. Returns a job_id; poll for results.

**Type:** \`tool\`
**Submit endpoint:** \`POST ${SITE.apiUrl}/v1/verify/bulk\`
**Poll endpoint:** \`GET ${SITE.apiUrl}/v1/jobs/:job_id\`
**Auth:** \`Authorization: Bearer vch_live_...\`

---

## When to invoke

Use this when you have a known list of 100+ emails to verify in one pass — list cleaning before a marketing send, importing a CSV into a CRM, or auditing an existing user base for fake accounts.

For single real-time signup checks, use \`verify-signup\` instead.

## Submit

\`\`\`json
{
  "items": [
    { "email": "alice@acme.com", "name": "Alice Smith" },
    { "email": "bob@example.org" },
    { "email": "carol@startup.io", "ip_address": "198.51.100.7" }
  ]
}
\`\`\`

Response (\`202 Accepted\`):

\`\`\`json
{ "job_id": "job_a1b2c3d4e5f6", "status": "queued", "total": 3 }
\`\`\`

## Poll for results

Poll every 2–5 seconds. Statuses cycle \`queued → running → completed\` (or \`failed\`). When completed, the response contains an \`items\` array with one verification per submitted email, in the same order.

## Credits

Each item deducts 1 credit (cache hits are free). Your balance must be greater than zero to submit a bulk job.

## Documentation

${SITE.url}/docs/api/verify-bulk
`;

const DISPOSABLE_DATABASE_BODY = `# disposable-email-database — Vouchley

> Reference data: which email domains are disposable / temporary / throwaway, and which are legitimate free providers that should never be blocked.

**Type:** \`data\`
**Source of truth:** Vouchley's live disposable database, updated daily
**Index URL:** ${SITE.url}/disposable-emails
**Index URL (markdown):** ${SITE.url}/disposable-emails.md

---

## What this skill provides

A curated, hand-maintained reference for the most-searched-for disposable email services on the public web. Each entry documents:

- The domain and any aliases
- The operator and launch year (when known)
- What the service is used for
- Whether to block at signup, and why

## Disposable services covered

mailinator.com, 10minutemail.com, guerrillamail.com, yopmail.com, maildrop.cc, tempmail.org, throwawaymail.com, moakt.com, emailondeck.com, sharklasers.com, trashmail.com, dispostable.com, fakemail.net, mintemail.com, spamgourmet.com, anonaddy.com, simplelogin.io

## Free providers explicitly NOT to block

gmail.com, proton.me, outlook.com — these are legitimate. Score them normally; watch for Gmail dot/plus alias tricks at the application layer.

## Per-domain markdown

Each domain has a dedicated markdown page at \`${SITE.url}/disposable-emails/<slug>.md\` with full details. Example: ${SITE.url}/disposable-emails/mailinator-com.md

## Live API

For programmatic lookups beyond the curated 20, call \`verify-signup\` — Vouchley's live blocklist covers thousands of disposable domains, updated daily.
`;

const INTEGRATE_SIGNUP_BODY = `# integrate-signup-verification — Vouchley

> Workflow: wire Vouchley into your signup handler so every new account is scored in real time before it touches your database.

**Type:** \`workflow\`
**Time to ship:** ~30 minutes for the basic integration

---

## Pre-requisites

1. A Vouchley account (sign up free at ${SITE.url}/signup — 100 credits, no card)
2. A live API key (mint at ${SITE.url}/dashboard/keys), stored as \`VOUCHLEY_API_KEY\` in your server-side env

## The pattern

\`\`\`typescript
async function createUser(signup) {
  const resp = await fetch("${SITE.apiUrl}/v1/verify", {
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
}
\`\`\`

## Where to call Vouchley

Inside your signup handler, after schema validation but **before** writing to your database. Doing it after the DB write means you've already committed the bad signup — refunds and cleanups get messy.

## Branching strategy

| Recommendation | Action | UX |
| --- | --- | --- |
| \`approve\` | Create account immediately | Normal flow |
| \`review\` | Create account with \`status = "pending"\` | "We're verifying your account, you'll hear from us in a few minutes" |
| \`block\` | Reject with a generic 4xx | "We weren't able to create your account. Contact support if you think this is wrong." |

Never tell the user *why* they were blocked — fraudsters use that signal to fingerprint your defenses.

## Failing open

If Vouchley returns \`401\` / \`402\` / \`5xx\` your code should NOT block legitimate signups. Log critically (key revoked / balance zero / vendor down) and let the user through. A broken Vouchley should never be worse than no Vouchley.

\`\`\`typescript
try {
  const verdict = await verifyWithVouchley(signup);
  // branch on verdict
} catch (err) {
  logCriticalAlert("Vouchley call failed", err);
  // fail open — create the account anyway
}
\`\`\`

## Operational checks

After deploying:

1. Check the dashboard at ${SITE.url}/dashboard — verify your live key has traffic.
2. Confirm \`processed_in_ms\` is under 1500 at p95 in your own logs.
3. Set up an alert when your credit balance drops below a threshold (call \`GET /v1/usage\` daily).

## Documentation

- Quickstart: ${SITE.url}/docs
- Full API reference: ${SITE.url}/docs/api/verify
- Caching & credits: ${SITE.url}/docs/caching-credits
- Errors: ${SITE.url}/docs/errors
`;

export const AGENT_SKILLS: AgentSkill[] = [
  {
    slug: "verify-signup",
    name: "verify-signup",
    type: "tool",
    description:
      "Score a single signup in real time. Returns a 0–100 trust score plus an approve / review / block recommendation with the full signal breakdown.",
    body: VERIFY_SIGNUP_BODY,
  },
  {
    slug: "verify-bulk",
    name: "verify-bulk",
    type: "tool",
    description:
      "Batch-verify up to 1,000 signups asynchronously. Returns a job_id to poll for the per-item results.",
    body: VERIFY_BULK_BODY,
  },
  {
    slug: "disposable-email-database",
    name: "disposable-email-database",
    type: "data",
    description:
      "Curated reference of well-known disposable email providers (mailinator, 10minutemail, guerrillamail, etc.) and legitimate free providers (gmail, proton, outlook) that should NOT be blocked.",
    body: DISPOSABLE_DATABASE_BODY,
  },
  {
    slug: "integrate-signup-verification",
    name: "integrate-signup-verification",
    type: "workflow",
    description:
      "End-to-end workflow for wiring Vouchley into a signup handler: where to call, how to branch on the recommendation, and how to fail open when Vouchley is down.",
    body: INTEGRATE_SIGNUP_BODY,
  },
];

export function getSkill(slug: string): AgentSkill | undefined {
  return AGENT_SKILLS.find((s) => s.slug === slug);
}
