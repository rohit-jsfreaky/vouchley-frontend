export const HERO = {
  headline: "Know which signups are",
  headlineAccent: "real.",
  subheadline:
    "Vouchley scores every new signup in real time. Block bots, disposable emails, VPN/Tor abuse, and AI-driven fraud before they hit your database — in one API call.",
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

// ---------------------------------------------------------------------------
// How it works — three-step explainer
// ---------------------------------------------------------------------------
export type HowStep = {
  step: string;
  title: string;
  body: string;
};

export const HOW_IT_WORKS: HowStep[] = [
  {
    step: "01",
    title: "Send the signup",
    body:
      "POST the email and IP address to /v1/verify the moment a user submits your signup form. Authenticate with a Bearer API key — no SDK, no client library required.",
  },
  {
    step: "02",
    title: "Get a score in <1.5s",
    body:
      "Vouchley checks email validity, domain reputation, IP risk, VPN/Tor presence, and bot patterns in parallel. You get a 0–100 trust score plus a plain-English reasoning string.",
  },
  {
    step: "03",
    title: "Decide the next step",
    body:
      "Use the recommendation — approve, review, or block — to gate account creation, trigger email verification, or silently drop the bad ones. Your call, fully under your control.",
  },
];

// ---------------------------------------------------------------------------
// What we detect — the fraud surface
// ---------------------------------------------------------------------------
export type DetectionItem = {
  title: string;
  body: string;
};

export const WHAT_WE_DETECT: DetectionItem[] = [
  {
    title: "Disposable & temporary emails",
    body:
      "Mailinator, 10MinuteMail, Guerrilla Mail, and 2,000+ throwaway providers — caught at the syntax + MX layer.",
  },
  {
    title: "VPN, proxy & Tor exits",
    body:
      "Live IP reputation feeds flag VPNs, residential proxies, and Tor exit nodes used to mask abusive signups.",
  },
  {
    title: "Datacenter & hosting IPs",
    body:
      "Signups from AWS, GCP, Hetzner, OVH, and other ASNs that legitimate consumers almost never use.",
  },
  {
    title: "AI-driven bot signups",
    body:
      "Catches the new wave of agentic bots that mimic human typing patterns and pass legacy CAPTCHA challenges.",
  },
  {
    title: "New & suspicious domains",
    body:
      "Flags shell domains registered in the last 30 days, dead MX records, and domains without a live website.",
  },
  {
    title: "Gmail alias & role-based tricks",
    body:
      "Normalises +tags and dots in Gmail addresses; flags info@, admin@, and sales@ that rarely belong to one real user.",
  },
];

// ---------------------------------------------------------------------------
// FAQ — also drives FAQPage schema for AI / SERP visibility.
// Keep answers tight: 1–3 sentences each, plain English, no marketing fluff.
// ---------------------------------------------------------------------------
export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ: FaqItem[] = [
  {
    question: "What is Vouchley?",
    answer:
      "Vouchley is a real-time signup verification API for SaaS companies. You send an email and an IP address, and Vouchley returns a 0–100 trust score with a recommendation — approve, review, or block — in under 1.5 seconds.",
  },
  {
    question: "How is this different from email validation?",
    answer:
      "Email validation only checks whether an inbox exists. Vouchley combines email checks with IP reputation, VPN/Tor detection, domain age, and behavioural signals to score the entire signup, not just the address. You get a single decision instead of a pile of raw signals.",
  },
  {
    question: "What does Vouchley actually detect?",
    answer:
      "Disposable emails, VPN/proxy/Tor traffic, datacenter IPs (AWS, GCP, Hetzner), AI-driven bot signups, brand-new shell domains, Gmail alias tricks, and role-based addresses. Each call returns a breakdown so you can see exactly which signals fired.",
  },
  {
    question: "How fast is the API?",
    answer:
      "Cache hits return in under 100 ms. Fresh checks run every signal in parallel and complete in under 1.5 seconds at the p95. We measure latency continuously and publish it in your dashboard.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Pay-as-you-go credit packs starting at $29 for 3,000 verifications. New accounts get 100 free credits — no card required. Credits never expire.",
  },
  {
    question: "Do you store my user data?",
    answer:
      "We hash IPs and store only what's needed to compute the score and let you audit the call later. We never sell, share, or train on your signup data. EU data residency is available on the Pro plan.",
  },
  {
    question: "Can I integrate without writing custom code?",
    answer:
      "Yes — Vouchley is a single HTTP endpoint that any language can call. Most teams ship the integration in under 30 minutes. The docs include drop-in examples for Node, Python, Go, Ruby, and PHP.",
  },
];

// ---------------------------------------------------------------------------
// Founder / trust block — humanises the page; matters more than SEO at MVP.
// ---------------------------------------------------------------------------
export const FOUNDER = {
  heading: "Built solo. Run with care.",
  body:
    "Vouchley is built and maintained by Rohit, a solo founder shipping from India. No fundraising, no growth team, no upsell calls — just an API designed to be cheap, fast, and easy to drop into your signup flow. If you have feedback or a feature request, you'll hear back from me directly.",
} as const;

export const FINAL_CTA = {
  title: "Stop paying for fake signups.",
  primaryCta: { label: "Start free — no card", href: "/signup" },
} as const;
