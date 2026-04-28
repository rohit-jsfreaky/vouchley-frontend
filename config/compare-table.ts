/**
 * Data for the "How we compare" table used on the homepage and pricing page.
 *
 * Honest framing: Vouchley is NOT the cheapest per email check on the market —
 * email-only validators like DeBounce undercut us at ~$0.002/check. The honest
 * win is on what each check covers: Vouchley scores email + IP + VPN + domain +
 * bot signals in one call, while everyone else listed below only validates the
 * email itself. The "Checks per call" column makes that visible.
 *
 * Re-verify prices each quarter — vendor pricing pages change 2–4 times/year.
 */

export type ComparisonVendor = {
  name: string;
  /** Public website (used for citation, not as backlink). */
  url: string;
  /** Optional /vs/{slug} link for the in-depth comparison page. */
  versusSlug?: string;
  /** What this tool checks per API call. */
  checks: string;
  /** Approximate cost for 10,000 verifications. */
  cost10k: string;
  /** Credit-expiry policy. */
  expiry: string;
  /** Color hint for the expiry cell. */
  expiryTone: "good" | "warn" | "bad";
};

export const COMPARE_TABLE = {
  title: "How we compare",
  subtitle:
    "More signals per check, credits that never expire. Pricing verified from each vendor's public pricing page on April 28, 2026.",
  vouchley: {
    name: "Vouchley",
    checks: "Email + IP + VPN + domain + bot",
    cost10k: "$99",
    expiry: "Never",
    expiryTone: "good" as const,
  },
  competitors: [
    {
      name: "Kickbox",
      url: "https://kickbox.com",
      versusSlug: "kickbox",
      checks: "Email only",
      cost10k: "~$100 PAYG",
      expiry: "Never",
      expiryTone: "good" as const,
    },
    {
      name: "ZeroBounce",
      url: "https://zerobounce.net",
      versusSlug: "zerobounce",
      checks: "Email + AI scoring",
      cost10k: "~$100 PAYG",
      expiry: "Subscription tiers expire",
      expiryTone: "warn" as const,
    },
    {
      name: "NeverBounce",
      url: "https://neverbounce.com",
      checks: "Email only",
      cost10k: "~$80 PAYG",
      expiry: "12 months",
      expiryTone: "bad" as const,
    },
    {
      name: "DeBounce",
      url: "https://debounce.com",
      checks: "Email only",
      cost10k: "~$20 PAYG",
      expiry: "Never",
      expiryTone: "good" as const,
    },
    {
      name: "Sift",
      url: "https://sift.com",
      versusSlug: "sift",
      checks: "Full fraud platform",
      cost10k: "Enterprise quote",
      expiry: "Annual contract",
      expiryTone: "warn" as const,
    },
  ] satisfies ComparisonVendor[],
  /** Footnote rendered below the table. */
  footnote:
    "Vouchley's per-check cost reflects multi-signal coverage. Email-only validators like DeBounce are cheaper per check but won't catch bot signups, datacenter IPs, VPN abuse, or AI-driven fraud.",
} as const;
