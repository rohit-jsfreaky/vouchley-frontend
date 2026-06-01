"use client";

import { useEffect } from "react";

/**
 * WebMCP — expose page-level tools to an in-browser AI agent.
 *
 * Calls `navigator.modelContext.provideContext()` on mount with a small,
 * honest set of tools an agent can actually invoke from any Vouchley page.
 * Spec: https://webmachinelearning.github.io/webmcp/
 *
 * Design rules followed here:
 *   - No tool calls Vouchley's authenticated API directly. Agents that
 *     want real verifications must use the REST API with a server-side
 *     API key — not a browser surface that could leak credentials.
 *   - Tools either look up local data (the curated disposable database),
 *     compute pure functions (pricing math), or navigate the user.
 *   - Every tool returns plain JSON so the agent can chain results.
 *
 * Browsers without WebMCP just do nothing — the provider is a no-op.
 */

type ToolResult =
  | { type: "json"; value: unknown }
  | { type: "text"; value: string };

type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<ToolResult> | ToolResult;
};

declare global {
  interface Navigator {
    modelContext?: {
      provideContext: (ctx: { tools: WebMcpTool[] }) => void;
    };
  }
}

const SITE_URL = "https://vouchley.getrevlio.com";

// Mirror of the curated disposable database. Kept in sync with
// `config/disposable-domains.ts` — when that file is updated, update this.
const DISPOSABLE: Record<string, { service: string; block: boolean; slug: string }> = {
  "mailinator.com": { service: "Mailinator", block: true, slug: "mailinator-com" },
  "10minutemail.com": { service: "10MinuteMail", block: true, slug: "10minutemail-com" },
  "guerrillamail.com": { service: "Guerrilla Mail", block: true, slug: "guerrillamail-com" },
  "yopmail.com": { service: "YOPmail", block: true, slug: "yopmail-com" },
  "maildrop.cc": { service: "Maildrop", block: true, slug: "maildrop-cc" },
  "tempmail.org": { service: "Temp Mail", block: true, slug: "tempmail-org" },
  "throwawaymail.com": { service: "ThrowAwayMail", block: true, slug: "throwawaymail-com" },
  "moakt.com": { service: "Moakt", block: true, slug: "moakt-com" },
  "emailondeck.com": { service: "EmailOnDeck", block: true, slug: "emailondeck-com" },
  "sharklasers.com": { service: "Sharklasers (Guerrilla Mail alias)", block: true, slug: "sharklasers-com" },
  "trashmail.com": { service: "TrashMail", block: true, slug: "trashmail-com" },
  "dispostable.com": { service: "Dispostable", block: true, slug: "dispostable-com" },
  "fakemail.net": { service: "FakeMail", block: true, slug: "fakemail-net" },
  "mintemail.com": { service: "MintEmail", block: true, slug: "mintemail-com" },
  "spamgourmet.com": { service: "Spamgourmet", block: true, slug: "spamgourmet-com" },
  "anonaddy.com": { service: "AnonAddy", block: false, slug: "anonaddy-com" },
  "simplelogin.io": { service: "SimpleLogin", block: false, slug: "simplelogin-com" },
  "gmail.com": { service: "Gmail (Google)", block: false, slug: "gmail-com" },
  "proton.me": { service: "Proton Mail", block: false, slug: "proton-me" },
  "outlook.com": { service: "Outlook.com (Microsoft)", block: false, slug: "outlook-com" },
};

const PACKS = [
  { slug: "free",    name: "Free",    credits: 100,    priceUSD: 0,   perCredit: 0 },
  { slug: "starter", name: "Starter", credits: 3_000,  priceUSD: 29,  perCredit: 0.0097 },
  { slug: "pro",     name: "Pro",     credits: 12_000, priceUSD: 99,  perCredit: 0.00825 },
  { slug: "scale",   name: "Scale",   credits: 40_000, priceUSD: 299, perCredit: 0.00748 },
];

const TOOLS: WebMcpTool[] = [
  {
    name: "lookup_disposable_email_domain",
    description:
      "Look up a domain in Vouchley's curated disposable-email reference. Returns whether the domain is a known disposable / throwaway provider, the service name, and a URL to the detailed page. Use this when a user asks 'is X disposable?' or 'should I block X@somedomain.com signups?'.",
    inputSchema: {
      type: "object",
      required: ["domain"],
      properties: {
        domain: {
          type: "string",
          description:
            "The email domain to look up. Just the domain part — e.g. 'mailinator.com', not the full address.",
        },
      },
    },
    execute: ({ domain }) => {
      const key = String(domain ?? "").trim().toLowerCase().replace(/^.*@/, "");
      const entry = DISPOSABLE[key];
      if (!entry) {
        return {
          type: "json",
          value: {
            domain: key,
            found_in_curated_db: false,
            recommendation:
              "Not in the curated list. For a live check including 2,000+ disposable providers, IP reputation, and bot signals, call POST https://api.vouchley.getrevlio.com/v1/verify.",
            full_database_url: `${SITE_URL}/disposable-emails`,
          },
        };
      }
      return {
        type: "json",
        value: {
          domain: key,
          found_in_curated_db: true,
          service: entry.service,
          should_block_at_signup: entry.block,
          details_url: `${SITE_URL}/disposable-emails/${entry.slug}`,
          details_markdown_url: `${SITE_URL}/disposable-emails/${entry.slug}.md`,
        },
      };
    },
  },
  {
    name: "recommend_credit_pack",
    description:
      "Given an expected monthly volume of signup verifications, recommend the cheapest Vouchley credit pack that covers it. Returns the recommended pack and the math behind the recommendation. Credits never expire so stacking multiple packs is also a valid strategy.",
    inputSchema: {
      type: "object",
      required: ["monthly_verifications"],
      properties: {
        monthly_verifications: {
          type: "integer",
          minimum: 0,
          description: "Expected verifications per month.",
        },
        cache_hit_rate: {
          type: "number",
          minimum: 0,
          maximum: 1,
          description:
            "Optional. Estimated fraction of requests that will be cache hits (and therefore cost zero credits). Defaults to 0.2 (20%).",
        },
      },
    },
    execute: ({ monthly_verifications, cache_hit_rate }) => {
      const monthly = Math.max(0, Math.floor(Number(monthly_verifications) || 0));
      const hit = Math.min(1, Math.max(0, Number(cache_hit_rate ?? 0.2)));
      const billable = Math.ceil(monthly * (1 - hit));
      const pack = PACKS.find((p) => p.credits >= billable) ?? PACKS[PACKS.length - 1];
      return {
        type: "json",
        value: {
          monthly_verifications: monthly,
          assumed_cache_hit_rate: hit,
          estimated_billable_credits: billable,
          recommended_pack: {
            slug: pack.slug,
            name: pack.name,
            credits: pack.credits,
            price_usd: pack.priceUSD,
            per_credit_usd: pack.perCredit,
            checkout_url:
              pack.slug === "free"
                ? `${SITE_URL}/signup`
                : `${SITE_URL}/signup?pack=${pack.slug}`,
          },
          all_packs: PACKS.map((p) => ({
            slug: p.slug,
            name: p.name,
            credits: p.credits,
            price_usd: p.priceUSD,
          })),
          notes: [
            "Credits never expire — buying a larger pack now is rarely a mistake.",
            "Cache hits are free, so real cost = verifications × (1 - cache_hit_rate).",
          ],
        },
      };
    },
  },
  {
    name: "open_vouchley_docs",
    description:
      "Navigate the current browser tab to a specific Vouchley documentation page. Use this when a user asks to be taken to the docs for a particular topic (e.g. 'show me the auth docs', 'open the bulk endpoint reference').",
    inputSchema: {
      type: "object",
      required: ["topic"],
      properties: {
        topic: {
          type: "string",
          enum: [
            "quickstart",
            "authentication",
            "caching-credits",
            "rate-limits",
            "errors",
            "verify",
            "verify-bulk",
            "verify-get",
            "usage",
            "account",
          ],
          description: "The docs topic to open.",
        },
      },
    },
    execute: ({ topic }) => {
      const map: Record<string, string> = {
        quickstart: "/docs",
        authentication: "/docs/authentication",
        "caching-credits": "/docs/caching-credits",
        "rate-limits": "/docs/rate-limits",
        errors: "/docs/errors",
        verify: "/docs/api/verify",
        "verify-bulk": "/docs/api/verify-bulk",
        "verify-get": "/docs/api/verify-get",
        usage: "/docs/api/usage",
        account: "/docs/api/account",
      };
      const path = map[String(topic)] ?? "/docs";
      if (typeof window !== "undefined") {
        window.location.assign(path);
      }
      return { type: "json", value: { navigated_to: `${SITE_URL}${path}` } };
    },
  },
  {
    name: "start_vouchley_signup",
    description:
      "Open the Vouchley signup page in the current tab. Optionally pre-selects a pricing pack. Use this when the user wants to actually start using Vouchley.",
    inputSchema: {
      type: "object",
      properties: {
        pack: {
          type: "string",
          enum: ["starter", "pro", "scale"],
          description: "Optional pricing pack to pre-select on signup.",
        },
      },
    },
    execute: ({ pack }) => {
      const path = pack ? `/signup?pack=${String(pack)}` : "/signup";
      if (typeof window !== "undefined") {
        window.location.assign(path);
      }
      return {
        type: "json",
        value: {
          navigated_to: `${SITE_URL}${path}`,
          note:
            "New accounts get 100 free credits with no card. Credits never expire.",
        },
      };
    },
  },
];

export function WebMcpProvider() {
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const mc = navigator.modelContext;
    if (!mc || typeof mc.provideContext !== "function") return;
    try {
      mc.provideContext({ tools: TOOLS });
    } catch {
      // Browser implementations are still experimental — failing here is
      // never user-visible, so swallow and move on.
    }
  }, []);

  return null;
}
