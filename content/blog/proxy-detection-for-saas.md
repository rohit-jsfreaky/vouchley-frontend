---
title: "Proxy Detection for SaaS Signups: A Practical Build Guide"
excerpt: "Proxy-backed signups are how one attacker becomes a thousand fake accounts. Here's how to detect and score proxy traffic on a SaaS signup — the signals that matter, the code, the thresholds, and whether to build or buy."
metaTitle: "Proxy Detection for SaaS Signups (2026 Guide)"
metaDescription: "How to detect and score proxy-backed signups on a SaaS — residential proxies, datacenter IPs, and velocity — with code, thresholds, and honest build-vs-buy math."
date: "2026-07-16T09:00:00.000Z"
updatedAt: "2026-07-16T09:00:00.000Z"
category: "Engineering"
author: "Rohit Kashyap"
image: "/blog/vpn-proxy-detection.jpg"
tags: ["proxy detection", "signup fraud", "SaaS"]
keywords:
  - "proxy detection for saas"
  - "account signup proxy detection"
  - "proxy-backed account registration"
  - "proxy detection api"
  - "fake account proxy detection"
  - "residential proxy detection"
readingTime: 11
featured: false
faq:
  - question: "What is proxy detection for SaaS signups?"
    answer: "Proxy detection for SaaS signups is checking, at account creation, whether the user's IP is a proxy, VPN, Tor exit, or datacenter host, and folding that into a risk decision. On a SaaS it matters more than on most sites because proxies are how one attacker looks like many distinct users — the mechanism behind free-tier abuse, trial farming, and referral fraud."
  - question: "Should I build proxy detection myself or use an API?"
    answer: "Buy it, unless proxy intelligence is your core product. The detection logic is easy; the data is not. VPN, proxy, and datacenter IP ranges change hourly, residential-proxy networks require honeypots to map, and abuse feeds need daily updates. A maintained API costs less per month than the engineering time to keep one blocklist current, and it catches categories a homegrown list never will."
  - question: "How do you catch proxy-backed account registration at scale?"
    answer: "Combine three signals rather than trusting one: network classification (is the IP residential, datacenter, or hosting?), live proxy/VPN/Tor feed membership, and velocity (how many accounts that IP and its /24 subnet created recently). A single proxy IP is a weak signal; a proxy IP that just created its fifth account this hour is a near-certain block. Velocity is the signal most teams forget to add."
  - question: "What signup score threshold should trigger a proxy block?"
    answer: "Start in shadow mode: log the score and your would-be action for two weeks without blocking anyone. Then set the hard-block threshold where it catches 90%+ of the accounts you can confirm were fraudulent while flagging under 1% of accounts that later converted to paid. For most SaaS that lands around blocking the worst 5–10% and sending an email-verification step to the next 10–20%."
  - question: "Can proxy detection catch residential proxies used for fake accounts?"
    answer: "Partly, and honesty matters here. Datacenter proxies and Tor are easy to catch by ASN and public feeds. Residential proxies — compromised home devices resold as bandwidth — look like real users and can only be caught reliably with a honeypot network (which a few large vendors run) or by behavioral signals like velocity and cross-account reuse. Expect to catch most residential-proxy fraud through behavior, not through the IP alone."
  - question: "How much does proxy detection for a SaaS cost?"
    answer: "It ranges widely. Enterprise fraud platforms start around $99–999/month for lookup volume; a focused signup-verification API can be $19/month for 15,000 checks. Building in-house looks free until you count the engineering time to source, merge, and daily-refresh the feeds — which is why most teams that try it eventually switch to a maintained service."
---

Ask a SaaS founder what their biggest signup problem is and "fake accounts" comes up fast. Dig into the fake accounts and you almost always find the same mechanism underneath: **proxies**. One attacker with a rotating proxy pool looks like a thousand different users, each grabbing a free trial, burning a slice of your LLM credits, or farming a referral bonus. Block the email domains and they switch to fresh ones. Rate-limit by IP and the proxy pool routes around it.

This is the practical build guide for stopping that. It's the implementation companion to our broader [VPN and proxy detection overview](/blog/vpn-proxy-detection-signups) — that post covers the taxonomy of non-residential traffic in depth; this one is about what to actually build (or buy) to score proxy-backed signups on a SaaS.

## What proxy detection has to catch on a signup

Four categories do essentially all the damage, in rough order of how hard they are to detect:

- **Datacenter IPs** (AWS, GCP, Hetzner, OVH) — trivial to catch by ASN. Real consumers don't sign up from a server rack.
- **Public VPNs and Tor exits** — easy, published feeds exist.
- **Mobile proxies** — real carrier IPs rented out; harder, weight by velocity rather than blocking the carrier.
- **Residential proxies** — compromised home devices resold as "clean" bandwidth. The dangerous category, because they look exactly like legitimate residential traffic.

The [full taxonomy and risk-tier table lives in the overview post](/blog/vpn-proxy-detection-signups#the-five-categories-of-non-residential-traffic). Here we'll assume you know the categories and focus on turning them into a decision.

## The three signals that actually matter

Proxy detection is not one lookup. It's three cheap signals combined into a score:

1. **Network classification.** Resolve the signup IP to its ASN and connection type — residential, corporate, datacenter, hosting, or mobile. Datacenter or hosting on a consumer signup is your first red flag and catches the laziest half of attacks on its own.
2. **Live feed membership.** Cross-reference the IP against feeds that update multiple times a day: cloud-provider published ranges, VPN lists, the Tor consensus, and abuse blocklists. This is where staleness kills you — a feed from last month misses a large share of what's active today.
3. **Velocity and reputation.** Count how many accounts that IP and its /24 subnet created in the last hour and day, and whether the IP has a history of blocked signups. This is the signal that turns a weak "maybe a proxy" into a confident block.

Any one of these is beatable. All three together produce a score that is genuinely hard to fake — which is exactly why proxy-backed fraud concentrates on the softest target: sites running a single static blocklist.

## The signal most teams miss: velocity

If you only add one thing beyond a blocklist, make it **velocity**. Here's why it's disproportionately powerful for account registration.

A residential proxy IP, viewed in isolation, is indistinguishable from a real home connection. The blocklist can't help you — residential proxies aren't on public lists. But the *behavior* gives it away: a real household creates maybe one account on your product, ever. A proxy IP being used to farm accounts creates five, ten, fifty. The IP looks clean; the pattern does not.

Concretely, track two counters keyed on the signup IP and its /24 subnet:

- Accounts created per IP per hour and per day.
- Accounts created per /24 subnet per day (catches attackers who rotate individual IPs but stay inside one proxy provider's block).

When a signup arrives from an IP that just created its fourth account this hour, you don't need the blocklist to tell you anything. That's proxy-backed account registration whether or not the IP is catalogued. This is how you catch residential proxies that no feed will ever flag.

## Build vs buy: the honest math

The detection logic above is a weekend of code. The problem is never the logic — it's the data. To run proxy detection in-house you have to source, merge, and **daily-refresh**:

- Cloud-provider IP ranges (each publishes its own JSON, formats differ).
- VPN and datacenter ASN lists.
- The Tor exit consensus (changes constantly).
- Abuse and reputation feeds.

And even with all of that, you still can't touch residential proxies without a honeypot network, which is a product in itself. Maintaining this is not a one-time task; it's a standing obligation, because a proxy blocklist is stale within 48 hours.

That's the real comparison. A maintained proxy-detection or [signup-verification API](/docs/api/verify) costs less per month than the engineering time to keep one feed current — and it covers categories a homegrown list never will. If you're weighing it against a dedicated fraud platform, the [IPQualityScore comparison](/vs/ipqualityscore) lays out where the money goes: IPQS starts at $99/month for 5,000 lookups with residential-proxy detection gated to its $999 tier, versus [Vouchley](/pricing) at $19/month for 15,000 full signup checks. Build it yourself only if proxy intelligence *is* the thing you're selling.

## Wiring proxy detection into your signup

Here's a minimal, risk-tiered signup handler in TypeScript. It sends the email and IP to a verification API that returns a composite score already factoring in proxy, VPN, datacenter, and reputation signals, then tiers the action:

```typescript
// Express signup route
import type { Request, Response } from "express";

export async function signup(req: Request, res: Response) {
  const { email } = req.body;
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim();

  const r = await fetch("https://api.vouchley.getrevlio.com/v1/verify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VOUCHLEY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, ip_address: ip }),
  });
  const data = await r.json();

  // Tier the action on the recommendation, not a raw flag.
  if (data.recommendation === "block") {
    // Silent 202 — never reveal the block to the client.
    return res.status(202).json({ status: "pending_review" });
  }

  if (data.recommendation === "review") {
    const user = await createUser(email, { verified: false });
    await sendVerificationEmail(user);
    return res.json({ status: "verify_your_email" });
  }

  const user = await createUser(email, { verified: true });
  return res.json({ status: "ok", userId: user.id });
}
```

The important design choice: you're not writing `if (isProxy) block()`. You're passing the IP to a scorer that weighs proxy signals *alongside* email, domain, and velocity, and you tier the response into approve / verify / block. A clean corporate VPN and a datacenter proxy are both "non-residential," but only one of them should be blocked.

The `ip` block of the response carries the detail if you want to log or branch on it:

```json
{
  "score": 18,
  "recommendation": "block",
  "ip": {
    "is_datacenter": true,
    "is_proxy": true,
    "is_vpn": false,
    "is_tor": false,
    "connection_type": "hosting",
    "risk_reasons": ["datacenter_ip", "velocity_subnet"]
  }
}
```

## Setting the block threshold for account registration

Don't guess the threshold — measure it. Run **shadow mode** for two weeks: compute the score and the action you *would* have taken, log both, but don't actually block anyone. Then pull the logs and answer two questions:

- What threshold catches 90%+ of the accounts you can confirm were fraudulent (hit a free-tier limit in the first hour, never returned, clustered on shared IPs)?
- What threshold flags fewer than 1% of accounts that later converted to paid?

The overlap of those two answers is your production threshold. For most SaaS it lands around hard-blocking the worst 5–10% of signups and routing the next 10–20% through email verification. Tighten "review" before you ever touch "block" — a false block on a paying customer costs far more than a fake account that a later layer catches.

## The residential-proxy problem, honestly

No IP feed reliably catches residential proxies, because they *are* residential IPs. Anyone selling you "100% residential proxy detection" from IP data alone is overselling. Two things actually work:

1. **A honeypot network** — a handful of large vendors run infrastructure that gets abused specifically so they can map which residential IPs are being resold. This is real but expensive, and it's why residential-proxy detection sits in the premium tiers of the platforms that have it.
2. **Behavior** — velocity, cross-account device reuse, and reputation across your own traffic. This is available to everyone and catches the bulk of residential-proxy *fraud* even when it can't identify the proxy itself.

Lean on behavior. A residential proxy running a fraud operation still trips velocity and reputation signals the moment it scales, which is the only moment it matters.

## Monitoring and tuning

Proxy detection is not set-and-forget. Log every decision with the IP (hashed), the score, the reasons that fired, and your action. After 30 days, that log tells you where your thresholds are too loose or too strict, and it's the raw material for tuning. Watch for a rise in support tickets about locked accounts — that's your signal that the "block" tier is too aggressive and should be loosened toward "review."

Pair proxy detection with the rest of the signup-fraud stack rather than asking it to carry the whole decision: [disposable-email detection](/blog/disposable-email-detection-guide), [bot-signup prevention](/blog/bot-signup-prevention), and the broader picture in the [2026 SaaS signup fraud report](/blog/2026-saas-signup-fraud-report). No single signal should decide a signup on its own.

## Where to go next

- The conceptual overview: [VPN and proxy detection for signups](/blog/vpn-proxy-detection-signups).
- How the new wave of bots uses proxies: [AI bot signups in 2026](/blog/ai-bot-signups-2026).
- Score every signup — proxy, VPN, email, and domain signals in one call: [see the verify endpoint](/docs/api/verify) or [start free with 100 credits](/signup). Pricing is [$19/month for 15,000 checks](/pricing).
