/**
 * Comparison data for /vs/{competitor} pages.
 *
 * Pricing and feature claims are based on publicly published vendor pages
 * as of "lastVerified". Re-verify before each major content update — vendor
 * pricing changes 2–4 times per year.
 *
 * Honesty rules:
 *   - Don't claim Vouchley does X if it doesn't.
 *   - When the competitor is genuinely better for a use case, say so under
 *     `whenCompetitorWins`. Buyers can smell pure marketing pages.
 *   - Cite specific dollar amounts, not "expensive" / "cheap".
 */

export type ComparisonRow = {
  feature: string;
  vouchley: string;
  competitor: string;
};

export type ComparisonFaq = {
  question: string;
  answer: string;
};

export type Comparison = {
  /** URL slug — `/vs/{slug}` */
  slug: string;
  /** Competitor display name */
  name: string;
  /** Competitor public URL (used in citations, not as backlink) */
  url: string;
  /** What category they market themselves as */
  category: string;
  /** One-line summary used in the hero */
  pitch: string;
  /** Last time the data was verified against the vendor's public pages */
  lastVerified: string;

  /** SEO metadata */
  metaTitle: string;
  metaDescription: string;

  /** Hero copy */
  heroBody: string;
  /** Verdict box: who is each tool actually for? */
  verdict: {
    pickVouchleyIf: string[];
    pickCompetitorIf: string[];
  };
  /** Side-by-side feature table */
  features: ComparisonRow[];
  /** Pricing analysis with real numbers */
  pricing: {
    competitorSummary: string;
    vouchleySummary: string;
    sampleScenario: {
      label: string;
      vouchleyCost: string;
      competitorCost: string;
    };
  };
  /** When the competitor is honestly the better pick */
  whenCompetitorWins: string;
  /** When Vouchley is the better pick */
  whenVouchleyWins: string;
  /** 3–4 page-specific FAQs */
  faqs: ComparisonFaq[];
};

export const COMPARISONS: Comparison[] = [
  // -------------------------------------------------------------------------
  // Kickbox — pure email validation, established player
  // -------------------------------------------------------------------------
  {
    slug: "kickbox",
    name: "Kickbox",
    url: "https://kickbox.com",
    category: "Email verification",
    pitch:
      "Kickbox is one of the longest-running email-verification services. Vouchley scores the entire signup — email, IP, domain, and behavior — in one call.",
    lastVerified: "2026-04-28",
    metaTitle: "Vouchley vs Kickbox: Signup Verification vs Email-Only Validation",
    metaDescription:
      "Honest side-by-side comparison: Kickbox validates email addresses; Vouchley scores the whole signup including IP, VPN, and bot signals. Pricing, features, when to pick which.",

    heroBody:
      "Kickbox is built for one job: telling you whether an email address can receive mail. It does that job well and has done it since 2014. Vouchley is built for a different (broader) job: deciding whether an entire signup is real. That difference shapes everything below — pricing, integration, what you get back per call, and the kind of fraud each tool catches.",

    verdict: {
      pickVouchleyIf: [
        "You care about more than email — you also need to catch VPNs, Tor, datacenter IPs, and AI-driven bot signups.",
        "You want a single API call that returns a 0–100 trust score and a recommendation, not raw deliverability flags you have to interpret yourself.",
        "You're a B2B SaaS or marketplace where signup quality directly affects unit economics, not an email marketing team cleaning a list.",
      ],
      pickCompetitorIf: [
        "Your only goal is improving email deliverability for marketing campaigns — no fraud signals needed.",
        "You're cleaning a static list of millions of email addresses (bulk validation is Kickbox's strength).",
        "You're already in the Marketo / Mailchimp / Dotdigital ecosystem and want a one-click integration.",
      ],
    },

    features: [
      { feature: "Email syntax + MX validation", vouchley: "Yes", competitor: "Yes" },
      { feature: "Disposable email detection", vouchley: "Yes (2,000+ providers)", competitor: "Yes" },
      { feature: "Role-based detection (info@, admin@)", vouchley: "Yes", competitor: "Yes" },
      { feature: "IP reputation / VPN / Tor", vouchley: "Yes", competitor: "No" },
      { feature: "Datacenter IP detection (AWS, GCP, etc.)", vouchley: "Yes", competitor: "No" },
      { feature: "Domain age / freshness signal", vouchley: "Yes", competitor: "No" },
      { feature: "AI-bot signup detection", vouchley: "Yes", competitor: "No" },
      { feature: "Single trust score (0–100)", vouchley: "Yes", competitor: "Sendex™ score (email only)" },
      { feature: "Action recommendation (approve/review/block)", vouchley: "Yes", competitor: "No" },
      { feature: "Bulk list validation", vouchley: "Yes", competitor: "Yes (core strength)" },
      { feature: "Marketing platform integrations", vouchley: "API only", competitor: "Marketo, Mailchimp, Zapier, Dotdigital, +" },
      { feature: "Free tier", vouchley: "100 credits, no card", competitor: "100 verifications" },
    ],

    pricing: {
      competitorSummary:
        "Kickbox publishes a pay-as-you-go model starting at $5 for 500 verifications (~$0.01 each), with a $159/month subscription for 50,000 verifications and an enterprise tier at $4,000 for 1 million.",
      vouchleySummary:
        "Vouchley sells monthly plans starting at $19 for 15,000 verifications (~$0.00127 each). Unused credits roll over and never expire.",
      sampleScenario: {
        label: "10,000 signups verified per month",
        vouchleyCost: "$19/mo on Starter — 15,000 credits, unused roll over",
        competitorCost: "~$80–100 on PAYG; $159/mo on the 50k plan if you can absorb the floor",
      },
    },

    whenCompetitorWins:
      "If your problem is purely email deliverability — you have a list of 200,000 contacts and you're trying to clean it before a marketing send — Kickbox is purpose-built for that and integrates with the rest of your email marketing stack out of the box. They've been doing email validation for over a decade and the bulk validation product is genuinely strong.",
    whenVouchleyWins:
      "If your problem is signup quality — fake accounts hitting your free tier, bots burning your LLM credits, fraudsters poisoning your conversion metrics — email validation alone won't catch it. A throwaway disposable email is one signal; the IP, domain age, and behavior tell you the rest of the story. Vouchley returns all of that in a single call with one decision attached.",

    faqs: [
      {
        question: "Can Vouchley do bulk email list cleaning like Kickbox?",
        answer:
          "Yes. The /v1/verify/bulk endpoint accepts up to 1,000 addresses per request and runs them in parallel. That said, if bulk list cleaning is your only use case, Kickbox's UI and integrations are more polished for that workflow.",
      },
      {
        question: "Is Vouchley faster than Kickbox?",
        answer:
          "For a single real-time call, both are sub-second on a warm cache. Vouchley's p95 is under 1.5 seconds for fresh checks because we run email, domain, and IP signals in parallel. Kickbox's published latency for real-time API is similar.",
      },
      {
        question: "Does Vouchley have the same accuracy as Kickbox on disposable emails?",
        answer:
          "Both use actively maintained disposable-domain lists. Vouchley's list is updated daily from public + private feeds. The bigger difference isn't disposable accuracy — it's that Vouchley flags non-email signals (VPN, datacenter, residential proxies) that Kickbox doesn't check at all.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // ZeroBounce — broader email validation + AI scoring; expensive at scale
  // -------------------------------------------------------------------------
  {
    slug: "zerobounce",
    name: "ZeroBounce",
    url: "https://zerobounce.net",
    category: "Email verification + deliverability suite",
    pitch:
      "ZeroBounce bundles email validation with deliverability tooling (inbox placement, blacklist monitoring, warmup). Vouchley is focused on real-time signup verification and skips the deliverability suite entirely.",
    lastVerified: "2026-04-28",
    metaTitle: "Vouchley vs ZeroBounce: Real-Time Signup Verification Compared",
    metaDescription:
      "Vouchley vs ZeroBounce: pricing, features, and use cases compared. ZeroBounce focuses on email deliverability suites; Vouchley scores the full signup with IP, VPN, and bot detection.",

    heroBody:
      "ZeroBounce is the email-marketing operator's tool. They sell email validation alongside inbox placement testing, blacklist monitoring, DMARC analysis, and email warmup — a full deliverability suite. Vouchley is the SaaS engineer's tool. We don't ship deliverability features. We ship one API endpoint that returns a real-time trust score for every signup, with IP and behavioral signals layered on top of email checks.",

    verdict: {
      pickVouchleyIf: [
        "You need to catch fraud and bot signups, not just bouncing emails.",
        "Your team is engineering-led — you want one API, predictable pricing, and no upsell into a deliverability suite.",
        "You're scoring signups in real time at the moment they create an account, not validating a list before a campaign.",
      ],
      pickCompetitorIf: [
        "You run an email marketing program and need the full deliverability stack (inbox placement, blacklist, DMARC, warmup).",
        "You already use ZeroBounce for list validation and don't want a second tool.",
        "You need 60+ pre-built marketing integrations (HubSpot, Mailchimp, Klaviyo, etc.).",
      ],
    },

    features: [
      { feature: "Real-time email validation API", vouchley: "Yes", competitor: "Yes" },
      { feature: "Bulk list validation", vouchley: "Yes (1,000/batch)", competitor: "Yes" },
      { feature: "Disposable email detection", vouchley: "Yes", competitor: "Yes" },
      { feature: "Role-based detection", vouchley: "Yes", competitor: "Yes" },
      { feature: "AI scoring on email", vouchley: "n/a (we score the whole signup)", competitor: "Yes (Activity Data scoring)" },
      { feature: "IP reputation / VPN / Tor", vouchley: "Yes", competitor: "No" },
      { feature: "Datacenter IP detection", vouchley: "Yes", competitor: "No" },
      { feature: "Domain age / freshness", vouchley: "Yes", competitor: "No" },
      { feature: "Inbox placement testing", vouchley: "No", competitor: "Yes" },
      { feature: "Blacklist monitoring", vouchley: "No", competitor: "Yes" },
      { feature: "DMARC monitoring + email warmup", vouchley: "No", competitor: "Yes" },
      { feature: "Single signup trust score", vouchley: "Yes (0–100)", competitor: "No (per-email score)" },
      { feature: "Free tier", vouchley: "100 credits, no card", competitor: "100 validations/month" },
    ],

    pricing: {
      competitorSummary:
        "ZeroBounce starts at $20 for 2,000 PAYG validations (~$0.01 each). Subscription tiers begin at $18/month for 2,000 emails and scale up: Starter $49/mo, Team $99/mo, Pro $249/mo. The bundled deliverability suite (ZeroBounce ONE™) starts at $99/mo.",
      vouchleySummary:
        "Vouchley charges $19/month for 15,000 verifications (~$0.00127 each); unused credits roll over and never expire. Each verification includes the full signup score — email + IP + domain.",
      sampleScenario: {
        label: "5,000 real-time signup checks per month",
        vouchleyCost: "$19/mo on Starter — 15,000 credits covers it with room to spare",
        competitorCost: "~$50 PAYG; $99/mo Team plan if you want predictable pricing",
      },
    },

    whenCompetitorWins:
      "If you're running an email marketing program at any meaningful scale, ZeroBounce gives you list validation plus the deliverability tooling around it (inbox placement, blacklist, DMARC) in one subscription. For that buyer, paying for both ZeroBounce and a separate deliverability tool would be silly.",
    whenVouchleyWins:
      "If you don't run an email marketing program — you just need to know which signups are real — most of ZeroBounce's bundle is wasted on you. Vouchley costs less per check, returns more per check (IP + domain + behavioral signals), and integrates as one HTTP call.",

    faqs: [
      {
        question: "Can Vouchley replace ZeroBounce for email list cleaning?",
        answer:
          "For the validation step, yes — Vouchley's bulk endpoint handles list cleaning. For the broader deliverability suite (inbox placement, DMARC, blacklist monitoring), no. Those are not Vouchley's product.",
      },
      {
        question: "How does Vouchley's pricing work — subscription or pay-as-you-go?",
        answer:
          "Vouchley is a simple monthly plan. Your plan adds its credit allotment each billing cycle, unused credits roll over and never expire, and cache hits within 30 days don't cost a credit. Bursty months just draw down your rollover balance instead of hitting a hard cap.",
      },
      {
        question: "Is ZeroBounce's accuracy better on email-only checks?",
        answer:
          "ZeroBounce publishes 96–99% accuracy on email validation, in line with the industry. Vouchley's email layer hits the same range. The differences show up on the signals ZeroBounce doesn't have — IP, domain, and behavior — where Vouchley is the only one returning a verdict.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Sift — enterprise fraud platform; opaque pricing
  // -------------------------------------------------------------------------
  {
    slug: "sift",
    name: "Sift",
    url: "https://sift.com",
    category: "Enterprise fraud-decisioning platform",
    pitch:
      "Sift is the enterprise-grade fraud platform — payments, signups, content, account takeover, all in one ML system. Vouchley is the focused, developer-priced alternative for teams that just need signup verification.",
    lastVerified: "2026-04-28",
    metaTitle: "Vouchley vs Sift: Signup Verification API for Builders, Not Enterprises",
    metaDescription:
      "Sift is enterprise fraud-decisioning at $30k+/year. Vouchley is real-time signup verification starting at $19/month. When to pick which, and the honest trade-offs.",

    heroBody:
      "Sift is genuinely impressive. It's one of the most capable fraud platforms on the market — payments fraud, account takeover, content abuse, signup fraud, all powered by a shared ML model trained across the entire customer base. It's also priced for buyers with procurement teams. Public reports put typical Sift contracts at $30,000–50,000 per year minimum, and enterprise deployments at $100,000–300,000+. Vouchley starts at $19.",

    verdict: {
      pickVouchleyIf: [
        "You're a startup, indie team, or mid-market SaaS where a five-figure annual contract isn't on the roadmap.",
        "Your fraud surface is signup-only — you don't have payments fraud, content abuse, or ATO problems to solve in the same platform.",
        "You want to ship the integration this afternoon, not after a six-week sales cycle.",
      ],
      pickCompetitorIf: [
        "You're an enterprise with multiple fraud surfaces (signup + payments + content + ATO) and need one ML platform to score them all.",
        "You have a fraud ops team that wants a full investigation UI, case management, and analyst tooling.",
        "Your annual fraud loss is in the seven figures and a $50k+ platform pays for itself.",
      ],
    },

    features: [
      { feature: "Real-time signup scoring API", vouchley: "Yes", competitor: "Yes" },
      { feature: "Email + IP + domain checks", vouchley: "Yes", competitor: "Yes" },
      { feature: "Behavioral / device fingerprinting", vouchley: "Server-side signals only", competitor: "Yes (full SDK)" },
      { feature: "Payments fraud", vouchley: "No", competitor: "Yes" },
      { feature: "Account takeover (ATO) protection", vouchley: "No", competitor: "Yes" },
      { feature: "Content abuse scoring", vouchley: "No", competitor: "Yes" },
      { feature: "Network-effect ML across customers", vouchley: "No", competitor: "Yes (core differentiator)" },
      { feature: "Investigation / case management UI", vouchley: "Inspector + dashboard", competitor: "Full analyst console" },
      { feature: "Published pricing", vouchley: "Yes ($19 starter)", competitor: "No (request quote)" },
      { feature: "Time to integrate", vouchley: "Hours", competitor: "Weeks (with sales cycle)" },
      { feature: "Free tier", vouchley: "100 credits, no card", competitor: "Demo only" },
    ],

    pricing: {
      competitorSummary:
        "Sift doesn't publish pricing. Vendor-research sites report typical contracts at $30k–50k/year minimum, with enterprise deployments at $100k–300k+. Pricing combines per-API-call volume, feature modules, and multi-year commits. Expect a sales cycle.",
      vouchleySummary:
        "Vouchley is priced like a developer tool: $19/month for 15,000 verifications, no contract, sign up with email and start in 5 minutes.",
      sampleScenario: {
        label: "Series A SaaS, 50,000 signups/month",
        vouchleyCost: "$49/mo on the Pro plan (50,000 credits)",
        competitorCost: "Five-figure annual contract; not Sift's target buyer",
      },
    },

    whenCompetitorWins:
      "If you're a marketplace, payments company, or social platform with multiple fraud surfaces and an actual fraud team, Sift's network-effect ML and unified platform are very hard to replicate with point tools. The price tag matches the scope. For that buyer, Sift earns its keep.",
    whenVouchleyWins:
      "Most teams shopping for signup verification don't have a $50k/year fraud budget. They have a signup form that's filling up with disposable emails, and they need to fix it this week. Vouchley fits that buyer: API-first, single use case, predictable pricing, no procurement.",

    faqs: [
      {
        question: "Why is Sift so much more expensive?",
        answer:
          "Different products. Sift is a multi-surface fraud platform — payments, signups, ATO, content abuse — with a network-effect ML model and an analyst UI. Vouchley does only one of those (signup verification) and prices accordingly. If you only need signup verification, you'd be paying for a lot of unused Sift surface area.",
      },
      {
        question: "Will Vouchley scale to enterprise volume?",
        answer:
          "Vouchley handles tens of thousands of verifications per minute on the standard tier and is built on FastAPI + Postgres with horizontal scaling. If you need a custom rate-limit ceiling or EU data residency, that's available on the Pro/Scale plans.",
      },
      {
        question: "Can I use Vouchley alongside Sift?",
        answer:
          "Yes. Some teams use Vouchley as a fast pre-filter at signup to drop obvious abuse cheaply, then send only the harder cases to Sift's fuller decisioning. That cuts Sift's per-call spend significantly.",
      },
    ],
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}
