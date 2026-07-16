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
    metaTitle: "Kickbox Alternative: Verify the Whole Signup",
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
    metaTitle: "ZeroBounce Alternative for Signup Verification",
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
    metaTitle: "Sift Alternative: Signup Verification from $19/mo",
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

  // -------------------------------------------------------------------------
  // IPQualityScore — closest direct competitor; fraud/IP intelligence platform
  // Pricing verified live on ipqualityscore.com/plans, 2026-07-16.
  // -------------------------------------------------------------------------
  {
    slug: "ipqualityscore",
    name: "IPQualityScore",
    url: "https://www.ipqualityscore.com",
    category: "Fraud detection & IP intelligence platform",
    pitch:
      "IPQualityScore is a full fraud-intelligence platform priced for fraud teams. Vouchley delivers the signup-verification core — email, IP, VPN, and bot signals — at developer pricing.",
    lastVerified: "2026-07-16",
    metaTitle: "IPQualityScore Alternative: From $19/mo",
    metaDescription:
      "IPQS starts at $99/month for 5,000 lookups. Vouchley scores 15,000 signups for $19/month — email, IP, VPN, and bot signals in one call. An honest comparison.",

    heroBody:
      "IPQualityScore is the most direct comparison on this site. It's a serious fraud-intelligence vendor: IP reputation, proxy and VPN detection, email validation, phone validation, URL scanning, and device fingerprinting, backed by a cross-customer fraud network. The catch is who it's priced for: plans start at $99/month for 5,000 lookups (~$0.02 each), and the headline features — residential proxy detection, device fingerprinting — sit in the $999/month and Enterprise tiers. Vouchley covers the signup-verification core of that stack at $19/month for 15,000 checks.",

    verdict: {
      pickVouchleyIf: [
        "You need signup verification specifically — not phone validation, URL scanning, or transaction scoring.",
        "You're paying (or being quoted) $99+/month for lookup volume that a $19 plan covers three times over.",
        "You want one score and one recommendation per signup instead of assembling verdicts from separate tool endpoints.",
      ],
      pickCompetitorIf: [
        "You need the full fraud stack: phone validation, URL scanning, device fingerprinting, transaction scoring.",
        "You're an enterprise fraud team that benefits from IPQS's cross-customer fraud network (Fraud Fusion™).",
        "You need honeypot-backed residential-proxy detection and can justify the $999/month SMB+ tier where it lives.",
      ],
    },

    features: [
      { feature: "Email validation (syntax, MX, disposable)", vouchley: "Yes", competitor: "Yes" },
      { feature: "IP reputation / VPN / Tor", vouchley: "Yes", competitor: "Yes" },
      { feature: "Datacenter IP detection", vouchley: "Yes", competitor: "Yes" },
      { feature: "Residential proxy detection", vouchley: "Velocity + behavioral heuristics", competitor: "Yes — honeypot-backed (SMB+ tier, $999/mo)" },
      { feature: "Domain age / freshness signal", vouchley: "Yes", competitor: "Yes" },
      { feature: "AI-bot signup detection", vouchley: "Yes", competitor: "Enterprise tier (Bot Killer™)" },
      { feature: "Phone number validation", vouchley: "No", competitor: "Yes" },
      { feature: "URL / link scanning", vouchley: "No", competitor: "Yes" },
      { feature: "Device fingerprinting SDK", vouchley: "No", competitor: "Enterprise tier only" },
      { feature: "Single trust score + recommendation", vouchley: "Yes (0–100 + approve/review/block)", competitor: "Per-tool fraud scores" },
      { feature: "Free tier", vouchley: "100 credits, no card", competitor: "1,000 lookups/mo (35/day cap)" },
      { feature: "Entry pricing", vouchley: "$19/mo — 15,000 checks", competitor: "$99/mo — 5,000 lookups" },
    ],

    pricing: {
      competitorSummary:
        "IPQS publishes tiered plans (verified 2026-07-16): Free at 1,000 lookups/month capped to 35/day; Startup at $99/month for 5,000 lookups (~$0.02 each); SMB Basic at $499/month for 10,000; SMB+ at $999/month for 75,000. Residential proxy detection arrives at SMB+; device fingerprinting and Bot Killer™ are Enterprise-only.",
      vouchleySummary:
        "Vouchley is $19/month for 15,000 verifications (~$0.00127 each) with email + IP + VPN + domain + bot signals on every check. Credits roll over and never expire.",
      sampleScenario: {
        label: "5,000 signups verified per month",
        vouchleyCost: "$19/mo Starter — 15,000 credits, 3× headroom",
        competitorCost: "$99/mo Startup — exactly 5,000 lookups, capped at 250/day",
      },
    },

    whenCompetitorWins:
      "If you're running a fraud program rather than protecting a signup form, IPQS earns its price. Phone validation, URL scanning, transaction scoring, device fingerprinting, and a fraud network fed by Fortune 500 reporting are things Vouchley simply doesn't have. Enterprise fraud teams fighting multi-surface abuse should shortlist IPQS.",
    whenVouchleyWins:
      "If the question you actually need answered is \"is this signup real?\", IPQS charges ~$0.02 per answer for a platform you'll mostly leave unused. Vouchley answers exactly that question — email, IP, VPN/proxy, datacenter, domain age, and bot behavior folded into one score — at ~$0.0013 per check. That's roughly 15× cheaper per verification, with published self-serve pricing and no daily caps.",

    faqs: [
      {
        question: "Why is Vouchley so much cheaper than IPQualityScore?",
        answer:
          "Scope. IPQS sells a multi-tool fraud platform with enterprise features (device fingerprinting, phone validation, URL scanning) priced into every tier. Vouchley does one job — signup verification — on self-hosted IP intelligence rather than resold per-lookup data, so the unit economics allow $19/month for 15,000 checks.",
      },
      {
        question: "Does Vouchley detect VPNs and proxies like IPQS does?",
        answer:
          "Yes — VPN, Tor, datacenter, and known-proxy detection ship on every plan, built from live feeds refreshed multiple times a day. The honest gap: IPQS's residential-proxy detection is backed by a honeypot network and sits in their $999/month tier. Vouchley catches residential proxies through velocity and behavioral corroboration instead — effective, but not identical.",
      },
      {
        question: "Can I migrate from IPQualityScore to Vouchley?",
        answer:
          "Yes, and the field mapping is direct: IPQS fraud_score maps to Vouchley's score, proxy/vpn/tor flags map to the ip block of the verify response, and email validity flags map to the email block. Sign up for 100 free credits and run both side by side on live traffic before switching.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // DeBounce — budget email validation; cheapest bulk rates at huge volume
  // Pricing verified live on debounce.com/pricing, 2026-07-16.
  // -------------------------------------------------------------------------
  {
    slug: "debounce",
    name: "DeBounce",
    url: "https://debounce.com",
    category: "Budget email validation",
    pitch:
      "DeBounce is one of the cheapest email validators on the market. Vouchley is still cheaper per check at typical volumes — and scores the whole signup, not just the inbox.",
    lastVerified: "2026-07-16",
    metaTitle: "DeBounce Alternative for Signup Verification",
    metaDescription:
      "DeBounce validates emails from $15 per 5,000 checks. Vouchley verifies 15,000 whole signups — email + IP + VPN + bot signals — for $19/month. Honest comparison.",

    heroBody:
      "DeBounce competes on price, and fairly: $15 for 5,000 validations at entry (~$0.003 each), sliding to ~$0.00045 per check at five-million volume, credits that never expire, and 100 free credits to start. For pure email list cleaning it's one of the best-value tools around. The real comparison with Vouchley is a comparison of jobs: DeBounce tells you whether an address can receive mail; Vouchley tells you whether the signup behind that address is real.",

    verdict: {
      pickVouchleyIf: [
        "You're verifying signups in real time and want fraud signals — VPN, datacenter IPs, bots — attached to the email check.",
        "Your volume fits a plan: $19 buys 15,000 checks (~$0.00127 each), below DeBounce's ~$0.003 entry rate.",
        "You want an approve / review / block recommendation, not just deliverable / undeliverable.",
      ],
      pickCompetitorIf: [
        "You clean marketing lists in the millions — DeBounce's ~$0.00045 top-tier bulk rate is nearly unbeatable.",
        "You want their data-enrichment add-on alongside validation.",
        "Email deliverability is your only problem and you'll never need fraud signals.",
      ],
    },

    features: [
      { feature: "Email syntax + MX validation", vouchley: "Yes", competitor: "Yes" },
      { feature: "Disposable email detection", vouchley: "Yes", competitor: "Yes" },
      { feature: "Role-based detection", vouchley: "Yes", competitor: "Yes" },
      { feature: "Catch-all domain handling", vouchley: "Included in score", competitor: "Deep catch-all costs 10 credits/check" },
      { feature: "IP reputation / VPN / Tor", vouchley: "Yes", competitor: "No" },
      { feature: "Datacenter IP detection", vouchley: "Yes", competitor: "No" },
      { feature: "Domain age / freshness", vouchley: "Yes", competitor: "No" },
      { feature: "AI-bot signup detection", vouchley: "Yes", competitor: "No" },
      { feature: "Single trust score + recommendation", vouchley: "Yes", competitor: "No" },
      { feature: "Data enrichment add-on", vouchley: "No", competitor: "Yes (20 credits per hit)" },
      { feature: "Free tier", vouchley: "100 credits, no card", competitor: "100 credits, no card" },
      { feature: "Credits expire?", vouchley: "Never (roll over monthly)", competitor: "Never" },
      { feature: "Entry pricing", vouchley: "$19/mo — 15,000 checks (~$0.00127)", competitor: "$15 — 5,000 checks (~$0.003)" },
    ],

    pricing: {
      competitorSummary:
        "DeBounce is pay-as-you-go (verified 2026-07-16): $15 for 5,000 validations (~$0.003 each) at entry, $450 for 500,000 (~$0.0009), sliding to ~$0.00045 per check at 5 million. 100 free credits, no card required, credits never expire. Extras cost extra: deep catch-all validation is 10 credits per check, data enrichment 20 credits per successful hit.",
      vouchleySummary:
        "Vouchley is $19/month for 15,000 full signup verifications (~$0.00127 each) — email, IP, VPN, domain, and bot signals included on every check, catch-all handling included. Credits roll over.",
      sampleScenario: {
        label: "5,000 signup checks per month",
        vouchleyCost: "$19/mo — 15,000 credits, 3× headroom, full fraud signals",
        competitorCost: "$15 PAYG — 5,000 email-only validations",
      },
    },

    whenCompetitorWins:
      "One-off bulk cleans at serious scale. If you're deduplicating and validating a two-million-address marketing list once a quarter, DeBounce's volume pricing (down to ~$0.00045 per check) and purpose-built bulk workflow make it the sensible choice. Vouchley's bulk endpoint works, but bulk hygiene at that scale is DeBounce's home turf.",
    whenVouchleyWins:
      "Real-time signups. At typical SaaS volumes Vouchley is cheaper per check than DeBounce's entry rate, and every check carries the signals an email-only tool can't see: a perfectly deliverable mailbox signing up from a datacenter IP behind a VPN is still a fake signup. DeBounce passes it; Vouchley blocks it.",

    faqs: [
      {
        question: "Isn't DeBounce cheaper than Vouchley?",
        answer:
          "At multi-million bulk volume, yes — around $0.00045 per check. At typical monthly volumes, no: Vouchley's $19 buys 15,000 checks (~$0.00127 each) versus DeBounce's $15 for 5,000 (~$0.003 each). And a Vouchley check covers the whole signup, not only the email.",
      },
      {
        question: "Does Vouchley handle catch-all domains?",
        answer:
          "Yes, and it's included: catch-all status is detected and folded into the trust score at no extra credit cost. DeBounce charges 10 credits per address for deep catch-all validation.",
      },
      {
        question: "Can Vouchley clean an existing email list like DeBounce?",
        answer:
          "Yes — the /v1/verify/bulk endpoint takes up to 1,000 addresses per request. For occasional list hygiene that's plenty. For one-off multi-million-address cleans, DeBounce's bulk tooling and volume pricing are the better fit.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // NeverBounce — established email verification, ZoomInfo-owned
  // Pricing verified live on neverbounce.com/pricing, 2026-07-16.
  // -------------------------------------------------------------------------
  {
    slug: "neverbounce",
    name: "NeverBounce",
    url: "https://www.neverbounce.com",
    category: "Email verification (ZoomInfo)",
    pitch:
      "NeverBounce is ZoomInfo's email-verification arm with 80+ integrations. Vouchley verifies the whole signup at roughly a sixth of the per-check price — and its credits never expire.",
    lastVerified: "2026-07-16",
    metaTitle: "NeverBounce Alternative for Signup Verification",
    metaDescription:
      "NeverBounce charges $8 per 1,000 checks and credits expire in 12 months. Vouchley verifies 15,000 signups for $19/month and credits never expire. Compared honestly.",

    heroBody:
      "NeverBounce has been a fixture of email verification for a decade and is now part of ZoomInfo. Pricing (verified 2026-07-16): pay-as-you-go at $8 per 1,000 credits (~$0.008 per check) with credits expiring 12 months after purchase, and a Growth plan at $49/month covering up to 10,000 emails with AI lead-generation features bundled in. It's a solid list-cleaning product with 80+ integrations. Vouchley plays a different position: real-time signup verification with fraud signals, at $19 for 15,000 checks that never expire.",

    verdict: {
      pickVouchleyIf: [
        "You're scoring signups in real time and need IP, VPN, datacenter, and bot signals with the email check.",
        "Per-check cost matters: ~$0.00127 versus NeverBounce's ~$0.008, and Vouchley credits never expire.",
        "You're engineering-led and want one API call, not a marketing-suite workflow.",
      ],
      pickCompetitorIf: [
        "You live in marketing tools — 80+ integrations with HubSpot, Mailchimp, Zapier, and n8n matter to you.",
        "You're a ZoomInfo customer and want verification inside that ecosystem.",
        "You want the Growth plan's bundled AI lead sourcing and CRM auto-sync alongside verification.",
      ],
    },

    features: [
      { feature: "Email syntax + MX validation", vouchley: "Yes", competitor: "Yes" },
      { feature: "Disposable email detection", vouchley: "Yes", competitor: "Yes" },
      { feature: "Typo correction (gmai → gmail)", vouchley: "No", competitor: "Yes" },
      { feature: "IP reputation / VPN / Tor", vouchley: "Yes", competitor: "No" },
      { feature: "Datacenter IP detection", vouchley: "Yes", competitor: "No" },
      { feature: "Domain age / freshness", vouchley: "Yes", competitor: "No" },
      { feature: "AI-bot signup detection", vouchley: "Yes", competitor: "No" },
      { feature: "Single trust score + recommendation", vouchley: "Yes", competitor: "No" },
      { feature: "Marketing integrations", vouchley: "API only", competitor: "80+ (HubSpot, Mailchimp, Zapier, n8n)" },
      { feature: "AI lead sourcing / CRM sync", vouchley: "No", competitor: "Yes (Growth plan)" },
      { feature: "Credits expire?", vouchley: "Never (roll over monthly)", competitor: "12 months after purchase" },
      { feature: "Free tier", vouchley: "100 credits, no card", competitor: "First list verified free" },
      { feature: "Entry pricing", vouchley: "$19/mo — 15,000 checks", competitor: "$8 per 1,000 PAYG; $49/mo Growth (10k cap)" },
    ],

    pricing: {
      competitorSummary:
        "NeverBounce pay-as-you-go is $8 per 1,000 credits (~$0.008 per check), and credits expire 12 months after purchase. The Growth plan is $49/month for up to 10,000 emails with AI lead features and CRM auto-sync. Enterprise is custom, typically 250,000+ emails/month. Verified 2026-07-16.",
      vouchleySummary:
        "Vouchley is $19/month for 15,000 verifications (~$0.00127 each) with the full signup score on every check. Credits roll over and never expire.",
      sampleScenario: {
        label: "10,000 signups verified per month",
        vouchleyCost: "$19/mo Starter — 15,000 credits, unused roll over",
        competitorCost: "$80 PAYG (expiring credits), or $49/mo Growth at its 10,000 ceiling",
      },
    },

    whenCompetitorWins:
      "Marketing-led teams cleaning lists inside their existing stack. If your workflow is \"validate this HubSpot segment before the campaign\" and you want one-click integrations, NeverBounce is built exactly for that — and the Growth plan's AI lead sourcing is a genuine bundle if you'd buy those features anyway.",
    whenVouchleyWins:
      "Signup protection. NeverBounce tells you an address is deliverable; it says nothing about the VPN, the datacenter IP, or the bot behind the form. Vouchley returns all of it in one call at roughly a sixth of the per-check price, with credits that don't quietly expire on you after a year.",

    faqs: [
      {
        question: "Is NeverBounce or Vouchley cheaper?",
        answer:
          "Vouchley, at typical volumes: ~$0.00127 per check on the $19 plan versus NeverBounce's ~$0.008 pay-as-you-go. There's also an expiry difference — NeverBounce credits die 12 months after purchase, while Vouchley credits roll over indefinitely.",
      },
      {
        question: "Does Vouchley integrate with HubSpot or Mailchimp like NeverBounce?",
        answer:
          "Not with pre-built one-click integrations — Vouchley is an API you call at signup time (or from any tool that can make an HTTP request, including Zapier and n8n webhooks). If one-click marketing integrations are a hard requirement, NeverBounce wins that point.",
      },
      {
        question: "Why does Vouchley check IPs when NeverBounce doesn't?",
        answer:
          "Different jobs. NeverBounce is list hygiene: is this address deliverable? Vouchley is signup verification: is this account creation legitimate? Answering the second question requires IP, domain, and behavioral signals on top of email validity — a deliverable Gmail address on a Tor exit node is still a signup you probably want to review.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Emailable — modern, well-liked email verification + deliverability extras
  // Pricing verified live on emailable.com/pricing, 2026-07-16.
  // -------------------------------------------------------------------------
  {
    slug: "emailable",
    name: "Emailable",
    url: "https://emailable.com",
    category: "Email verification + deliverability",
    pitch:
      "Emailable is a polished, fast email-verification service with deliverability extras. Vouchley checks the whole signup for roughly a sixth of the per-check price.",
    lastVerified: "2026-07-16",
    metaTitle: "Emailable Alternative for Signup Verification",
    metaDescription:
      "Emailable starts at $38 per 5,000 checks. Vouchley verifies 15,000 whole signups — email, IP, VPN, and bot signals — for $19/month. An honest side-by-side.",

    heroBody:
      "Emailable is one of the better-liked modern email verifiers: fast bulk verification, a clean dashboard, deliverability extras like inbox reports and blacklist monitors, and 250 free credits to start. Entry pricing (verified 2026-07-16) is $38 for 5,000 credits (~$0.0076 each), 15% cheaper if you subscribe monthly, credits never expire, minimum purchase 5,000. Like every tool on this page except Vouchley, it answers one question: can this address receive mail? Vouchley answers a bigger one: is this signup real?",

    verdict: {
      pickVouchleyIf: [
        "You need fraud signals at signup — VPN, proxy, datacenter, bot behavior — not just deliverability.",
        "Cost per check matters: ~$0.00127 versus Emailable's ~$0.0076 entry rate.",
        "You want a decision (approve / review / block), not a deliverability state you have to map to an action.",
      ],
      pickCompetitorIf: [
        "You want deliverability tooling around validation — inbox placement reports and blacklist monitoring.",
        "Your use case is bulk list cleaning with a polished team dashboard.",
        "You verify occasional lists and prefer pay-as-you-go credits with a subscription discount when needed.",
      ],
    },

    features: [
      { feature: "Email syntax + MX validation", vouchley: "Yes", competitor: "Yes" },
      { feature: "Disposable email detection", vouchley: "Yes", competitor: "Yes" },
      { feature: "Role-based detection", vouchley: "Yes", competitor: "Yes" },
      { feature: "IP reputation / VPN / Tor", vouchley: "Yes", competitor: "No" },
      { feature: "Datacenter IP detection", vouchley: "Yes", competitor: "No" },
      { feature: "Domain age / freshness", vouchley: "Yes", competitor: "No" },
      { feature: "AI-bot signup detection", vouchley: "Yes", competitor: "No" },
      { feature: "Single trust score + recommendation", vouchley: "Yes", competitor: "No" },
      { feature: "Inbox placement reports", vouchley: "No", competitor: "Yes (100 credits/report)" },
      { feature: "Blacklist monitoring", vouchley: "No", competitor: "Yes (5 credits/check)" },
      { feature: "Free credits", vouchley: "100, no card", competitor: "250" },
      { feature: "Credits expire?", vouchley: "Never (roll over monthly)", competitor: "Never" },
      { feature: "Entry pricing", vouchley: "$19/mo — 15,000 checks", competitor: "$38 — 5,000 credits (min purchase)" },
    ],

    pricing: {
      competitorSummary:
        "Emailable is credit-based (verified 2026-07-16): $38 for 5,000 credits (~$0.0076 per verification) at entry — or $32.30/month with the 15% subscription discount — cheaper at higher volumes, minimum purchase 5,000 credits. 250 free trial credits; credits never expire. Deliverability extras consume credits: inbox reports 100 each, blacklist checks 5 each.",
      vouchleySummary:
        "Vouchley is $19/month for 15,000 verifications (~$0.00127 each), each carrying the full signup score — email, IP, VPN, domain, bot. Credits roll over and never expire.",
      sampleScenario: {
        label: "5,000 signup checks per month",
        vouchleyCost: "$19/mo — 15,000 credits with full fraud signals",
        competitorCost: "$38 PAYG (or $32.30/mo subscribed) — 5,000 email-only credits",
      },
    },

    whenCompetitorWins:
      "Email marketing operations. If your team lives in campaign land — cleaning lists before sends, watching blacklists, checking inbox placement — Emailable bundles those workflows in a genuinely nice product, and 250 free trial credits beats Vouchley's 100 for kicking tires on a list-cleaning job.",
    whenVouchleyWins:
      "Protecting a signup form. Emailable can't see the VPN, the datacenter ASN, the day-old domain, or the bot cadence behind a signup — a deliverable address from all four is still fraud. Vouchley returns those signals plus the email check in one call, at about a sixth of Emailable's entry cost per check.",

    faqs: [
      {
        question: "Is Emailable more accurate than Vouchley on email checks?",
        answer:
          "Both run maintained disposable lists plus SMTP-level validation and land in the same industry accuracy range. The difference isn't email accuracy — it's that a Vouchley check also scores IP, domain, and behavioral signals that Emailable doesn't collect at all.",
      },
      {
        question: "Emailable gives 250 free credits — Vouchley only gives 100?",
        answer:
          "Correct, and worth knowing. Two things cut the other way: a Vouchley credit covers the entire signup check (email + IP + domain + bot), and paid entry is $19 for 15,000 credits versus Emailable's $38 minimum for 5,000.",
      },
      {
        question: "Can I use Emailable and Vouchley together?",
        answer:
          "Yes, and it's a sensible split: Emailable for campaign list hygiene and deliverability monitoring, Vouchley at the signup gate for fraud screening. They solve different problems and don't overlap in spend.",
      },
    ],
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}
