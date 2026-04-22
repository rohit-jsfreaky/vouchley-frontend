export const HERO = {
  headline: "Know which signups are",
  headlineAccent: "real.",
  subheadline:
    "Vouchley provides high-fidelity editorial verification for your user base. We block bots, temporary emails, and sophisticated fraudsters before they hit your database.",
  primaryCta: { label: "Start free — no card", href: "/signup" },
  secondaryCta: { label: "View docs", href: "/docs" },
} as const;

/**
 * cURL sample shown in the hero code block. Any language talks HTTP —
 * we deliberately don't advertise "SDKs" because we don't ship any yet.
 */
export const HERO_CODE_SAMPLE = {
  filename: "verify.sh",
  language: "bash",
  code: `curl -X POST https://api.vouchley.getrevlio.com/v1/verify \\
  -H "Authorization: Bearer vch_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john.doe@example.com",
    "ip_address": "192.168.1.1"
  }'`,
};

export const HERO_RESPONSE_SAMPLE = {
  status: "200 OK",
  body: `{
  "score": 92,
  "recommendation": "approve",
  "reasoning": "Valid corporate email at established domain."
}`,
};

export type FeatureItem = {
  icon: "code" | "zap" | "shield";
  title: string;
  body: string;
};

export const FEATURES: FeatureItem[] = [
  {
    icon: "code",
    title: "Simple Integration",
    body: "One HTTP endpoint. Any language, from cURL to your favorite client. Running in under 5 minutes.",
  },
  {
    icon: "zap",
    title: "Sub-second Verification",
    body: "Cache hits return in under 100ms. Fresh checks run every signal in parallel — under 1.5s p95.",
  },
  {
    icon: "shield",
    title: "Private by Default",
    body: "Signup data is never sold or shared. We cache scores, not identities. EU residency available on Pro.",
  },
];

export const FINAL_CTA = {
  title: "Stop paying for fake signups.",
  primaryCta: { label: "Start free — no card", href: "/signup" },
} as const;
