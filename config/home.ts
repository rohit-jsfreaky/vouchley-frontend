export const HERO = {
  badge: "100 free credits · no card required",
  headline: "Know which signups are",
  headlineAccent: "real.",
  subheadline:
    "Vouchley scores every new signup in real time — blocking bots, disposable emails, VPN abuse, and AI-driven fraud before they touch your database. One API call, under 1.5 seconds.",
  primaryCta: { label: "Start free — no card", href: "/signup" },
  secondaryCta: { label: "View docs", href: "/docs" },
} as const;

/**
 * Animated product demo scenarios shown in the hero terminal. These mirror
 * real verification responses (same shape, realistic scores) so the demo is
 * honest about what the API returns.
 */
export type DemoScenario = {
  email: string;
  ip: string;
  score: number;
  recommendation: "approve" | "review" | "block";
  reasoning: string;
  ms: number;
};

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    email: "sarah.chen@stripe.com",
    ip: "24.6.44.100",
    score: 86,
    recommendation: "approve",
    reasoning: "Valid corporate email at established domain. IP clean.",
    ms: 412,
  },
  {
    email: "temp9981@10minutemail.com",
    ip: "104.16.0.1",
    score: 0,
    recommendation: "block",
    reasoning: "Disposable email provider. Datacenter IP range.",
    ms: 388,
  },
  {
    email: "quickreg@yopmail.com",
    ip: "198.98.51.20",
    score: 40,
    recommendation: "review",
    reasoning: "Disposable provider (YOPmail). IP flagged as exit node.",
    ms: 405,
  },
];

/** Animated count-up stats under the hero. Every number is real. */
export type HeroStat = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
};

export const HERO_STATS: HeroStat[] = [
  { value: 6, label: "Fraud signals per call" },
  { value: 1.5, prefix: "<", suffix: "s", decimals: 1, label: "p95 response time" },
  { value: 5000, suffix: "+", label: "Disposable domains tracked" },
  { value: 100, label: "Free credits to start" },
];

/** Marquee of verification events — mirrors real scoring behaviour. */
export type TickerEvent = {
  email: string;
  verdict: "approve" | "review" | "block";
};

export const TICKER_EVENTS: TickerEvent[] = [
  { email: "sarah.chen@stripe.com", verdict: "approve" },
  { email: "temp9981@10minutemail.com", verdict: "block" },
  { email: "james.wilson@linear.app", verdict: "approve" },
  { email: "quickreg@yopmail.com", verdict: "review" },
  { email: "priya.patel@figma.com", verdict: "approve" },
  { email: "admin@newshellco.xyz", verdict: "block" },
  { email: "hans.mueller@gmail.com", verdict: "approve" },
  { email: "throwaway@guerrillamail.com", verdict: "review" },
  { email: "emma.brown@vercel.com", verdict: "approve" },
  { email: "info@randomstore12345.tk", verdict: "block" },
  { email: "yuki.tanaka@gmail.com", verdict: "approve" },
  { email: "tester@mailinator.com", verdict: "review" },
];

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
    title: "Simple integration",
    body: "One HTTP endpoint. Any language, from cURL to your favorite client. Running in under 5 minutes — no SDK required.",
  },
  {
    icon: "zap",
    title: "Sub-second verification",
    body: "Cache hits return in under 100ms. Fresh checks run every signal in parallel — under 1.5s at the p95.",
  },
  {
    icon: "shield",
    title: "Private by default",
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
  /** Optional deep-dive guide — renders a "Learn more" link on the card. */
  href?: string;
  hrefLabel?: string;
};

export const WHAT_WE_DETECT: DetectionItem[] = [
  {
    title: "Disposable & temporary emails",
    body:
      "Mailinator, 10MinuteMail, Guerrilla Mail, and 2,000+ throwaway providers — caught at the syntax + MX layer.",
    href: "/blog/disposable-email-detection-guide",
    hrefLabel: "Disposable email detection guide",
  },
  {
    title: "VPN, proxy & Tor exits",
    body:
      "Live IP reputation feeds flag VPNs, residential proxies, and Tor exit nodes used to mask abusive signups.",
    href: "/blog/vpn-proxy-detection-signups",
    hrefLabel: "VPN & proxy detection guide",
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
    href: "/blog/ai-bot-signups-2026",
    hrefLabel: "AI bot signups in 2026",
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
      "Monthly plans starting at $19 for 15,000 verifications a month. New accounts get 100 free credits — no card required. Unused credits roll over and never expire.",
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
  subtitle:
    "Score your first signup in the next five minutes. 100 free credits, no card, no sales call.",
  primaryCta: { label: "Start free — no card", href: "/signup" },
} as const;
