---
title: "VPN and Proxy Detection for Signups: A Practical Guide for SaaS Teams"
excerpt: "VPN signups aren't always bad — but they're disproportionately risky. Here's how to detect and risk-rank VPN, proxy, and Tor traffic on signup without losing legitimate privacy-conscious users."
metaTitle: "VPN & Proxy Detection for Signup Fraud (2026)"
metaDescription: "Detect and risk-score VPN, proxy, and Tor traffic at signup to stop fraud — without blocking legitimate privacy-conscious users. A practical 2026 guide."
date: "2026-04-23T09:00:00.000Z"
updatedAt: "2026-07-11T09:00:00.000Z"
category: "Engineering"
author: "Rohit Kashyap"
image: "/blog/vpn-proxy-detection.jpg"
tags: ["VPN detection", "proxy detection", "signup verification"]
keywords:
  - "VPN detection signup"
  - "block VPN signups"
  - "proxy detection API"
  - "Tor detection SaaS"
  - "IP reputation signup"
  - "proxy detection for signup fraud"
  - "vpn detection for login risk"
  - "proxy detection for saas"
  - "proxy detection false positives"
  - "proxy-backed account registration"
readingTime: 14
featured: false
faq:
  - question: "What is proxy detection for signup fraud?"
    answer: "Proxy detection for signup fraud checks, at the moment of signup, whether the user's IP is a VPN, proxy, datacenter host, residential proxy, or Tor exit, and uses that as a risk signal. Fraudulent signups disproportionately hide behind proxies to bypass IP rate limits and appear as many distinct users. Detecting the proxy lets you risk-tier the signup (allow, email-verify, or block) instead of trusting it blindly."
  - question: "Can VPN and proxy detection reduce login and account-takeover risk?"
    answer: "Yes. The same IP signals used at signup apply at login. A login from a residential proxy or a datacenter IP the account has never used before is a strong account-takeover signal. Most teams reuse their signup verification call on risky logins: step up to email or 2FA when the IP is a proxy, Tor exit, or known-fraud address, and allow silently when it is clean residential or corporate traffic."
  - question: "How do companies detect proxy-backed account registration?"
    answer: "By combining three checks: resolving the signup IP to its ASN and network type (residential, corporate, datacenter, hosting, or mobile), cross-referencing live VPN, proxy, and Tor feeds, and measuring velocity and reputation (how many accounts that IP or subnet created recently, and whether it has a history of blocked signups). No single check is decisive; the score comes from combining all three. Most companies use a verification API rather than maintaining the feeds themselves."
  - question: "How do you handle proxy and VPN detection false positives?"
    answer: "Treat detection as a risk score, not a hard gate. Legitimate users on consumer VPNs like NordVPN, Mullvad, and Proton, and on corporate VPNs, will trigger detection, so allow them through an email-verification step rather than a silent block. Reserve hard blocks for the near-zero-legitimate categories: datacenter IPs on known-fraud ASNs, residential proxies, and Tor exits. Always give a flagged user a frictionless path to recover."
  - question: "Should you block all VPN signups?"
    answer: "No. VPN traffic is a signal, not a verdict. Corporate-VPN users are often your best buyers, and millions of privacy-conscious people use consumer VPNs legitimately. Blocking every VPN signup costs you real customers. Weight VPN traffic lower instead, and escalate to verification only when it stacks with other risk signals like a disposable email or a brand-new domain."
  - question: "What is the best proxy detection API for SaaS?"
    answer: "The best proxy detection API for a SaaS returns a composite risk score (VPN, proxy, Tor, datacenter, and IP reputation together) in a single low-latency call, updates its data multiple times a day, and stays affordable at early-stage volume. Vouchley bundles proxy, VPN, and Tor detection with email, disposable, and domain signals from $19/month, so you get one score instead of wiring up separate feeds."
---

Ask ten SaaS founders whether VPN signups are bad and you'll get ten different answers. That's because VPN traffic is a signal, not a verdict. A corporate VPN carrying a Fortune 500 employee to your dashboard is exactly who you want as a customer. A datacenter proxy running an automated trial-spinner is exactly who you don't.

The trick is treating VPN/proxy detection as a risk score, not a hard gate. This guide walks through the detection categories, what each tells you, and how to build a signup flow that stays strict on fraud without alienating legitimate privacy-conscious users.

## Why VPN detection matters on signup

Signup is the cheapest place to intercept fraud. Every fake account you let through costs you for months: compute, support time, email deliverability damage, and polluted conversion metrics. Catching abuse at signup prevents all of that downstream cost.

IP reputation is the highest-signal check available at the moment of signup. Before the user has done anything, their IP already tells you:

- Whether the traffic is residential, commercial, or datacenter
- Whether the IP has been flagged for past fraud
- Whether it's currently hosting a VPN, proxy, or Tor exit
- The ASN and geographic origin
- How fresh the IP reputation is

That's a lot of context for free, on every request.

## The five categories of non-residential traffic

Lumping all VPN/proxy traffic together is the mistake most teams make. There are five distinct categories, each with very different abuse rates:

### 1. Consumer VPN services (NordVPN, ExpressVPN, Mullvad, Proton)

Abuse rate: **medium**. These are used by millions of legitimate privacy-conscious users, especially in regions with heavy surveillance or content restrictions. A privacy-conscious developer signing up for your dev tool from Mullvad is a legitimate customer — don't block them.

Action: **allow, but weight lower in your trust score**. Combined with disposable email or new domain signals, escalate to email verification.

### 2. Corporate VPNs

Abuse rate: **very low**. These are the VPNs inside companies that route employee traffic through the corporate network. Employees of Microsoft, Stripe, or Shopify often appear as coming from the company's egress IP.

Action: **allow without penalty**. Often a strong positive signal — corporate IPs mean real buyers.

### 3. Datacenter / hosting IPs (AWS, GCP, Hetzner, DigitalOcean)

Abuse rate: **high**. Legitimate users don't sign up from AWS. Servers sign up from AWS. These are automated signups 95% of the time.

Action: **block or require email verification + behavioral check**. Unless you're a dev tool where someone might be testing from a workstation on a VPS, assume automation.

### 4. Residential proxies

Abuse rate: **very high**. These are the most dangerous category — compromised home routers or IoT devices sold as proxy bandwidth. They look like legitimate residential traffic but are used specifically to bypass IP-based defenses.

Action: **block silently**. No legitimate user is paying for residential proxy access.

### 5. Tor exit nodes

Abuse rate: **extremely high for B2B SaaS**. Tor has legitimate uses (journalism, activism, whistleblowing), but those users are almost never signing up for a B2B SaaS trial. Block hard.

Action: **block silently**.

## Building the risk-tier decision table

Once you categorize the IP, the decision becomes simple. Here's the exact table [Vouchley](/) uses internally, modified for your use:

| IP category | Action | Rationale |
|-------------|--------|-----------|
| Residential (clean) | Allow | Normal user |
| Corporate VPN | Allow | Real buyer likely |
| Consumer VPN | Allow + soft verify | Real user possible |
| Datacenter (trusted dev clouds) | Require email verify | Possibly dev testing |
| Datacenter (known fraud ASNs) | Block | Almost always abuse |
| Residential proxy | Block silently | Near-zero legit use |
| Tor exit | Block silently | Near-zero B2B use |
| Known fraud IP | Block silently | Direct signal |

Notice only three hard-block categories. Every other decision gives the user a path forward — because the cost of a false positive (blocking a real customer) is much higher than the cost of a false negative (letting one bad signup through that gets caught by a later layer).

## What "detection" actually means technically

Under the hood, VPN/proxy detection is a mix of:

1. **ASN blocklists** — public lists of AWS, Azure, GCP, Hetzner, OVH, etc. Easy to maintain, catches category 3.
2. **Tor consensus feed** — the Tor Project publishes live exit node IPs. Easy to ingest.
3. **Commercial feeds** — companies like IPQualityScore, IPinfo, and Spur run active fingerprinting and honeypots to detect categories 1, 4, and 5. These are paid but affordable (often $20–$100/month for early-stage usage).
4. **Behavioral corroboration** — even if you think an IP is clean, a signup with five other risk signals (disposable email, new domain, weird timing) is probably fraud regardless.

You don't have to build this stack yourself. A signup verification API does all of it in a single call — see [how to add a VPN detection API to your signup flow](/blog/vpn-detection-api-saas) for the step-by-step build.

## Real-world integration

Here's a minimal, risk-tiered signup handler:

```python
# FastAPI example
from fastapi import APIRouter, HTTPException, Request
import httpx, os

router = APIRouter()

@router.post("/signup")
async def signup(request: Request, payload: dict):
    email = payload["email"]
    ip = request.headers.get("x-forwarded-for", "").split(",")[0].strip()

    async with httpx.AsyncClient(timeout=5.0) as client:
        r = await client.post(
            "https://api.vouchley.getrevlio.com/v1/verify",
            headers={"Authorization": f"Bearer {os.environ['VOUCHLEY_API_KEY']}"},
            json={"email": email, "ip_address": ip},
        )
    data = r.json()

    # Tier the action based on score
    if data["recommendation"] == "block":
        # Silent 202 — don't reveal the block
        return {"status": "pending_review"}

    if data["recommendation"] == "review":
        user = await create_user(email, verified=False)
        await send_verification_email(user)
        return {"status": "verify_your_email"}

    user = await create_user(email, verified=True)
    return {"status": "ok", "user_id": user.id}
```

The key is not hard-coding a VPN check — you're passing the IP to the verifier, which returns a composite score that already factors in VPN, proxy, Tor, and reputation signals together.

## Handling false positives gracefully

Some legitimate users will get flagged. Every fraud defense has this trade-off. Make the recovery path frictionless:

- **Show a neutral message** like "We need to verify your email before activating your account." Never say "we think you're a bot."
- **Send a verification email immediately**. If they complete it, flip them to allowed. This single step recovers 70%+ of legitimate false positives.
- **Provide a contact link** for the remaining edge cases. You'll get maybe 1–2 emails a month. Respond to them fast.

Under no circumstances should you silently block a paying customer's IP and leave them staring at an error page. That's how you lose real revenue to a heuristic.

## What to log

Every verification decision should be logged with:

- The IP address (hashed for privacy)
- The email domain (not the full email)
- The returned score and reasoning
- Your application's action (allow / review / block)
- A timestamp

This log is what lets you tune. After 30 days, pull the logs and answer:

- What score threshold catches 95% of actual fraud?
- What score threshold blocks fewer than 1% of legitimate customers?

The overlap of those answers is your production threshold.

## The common mistake: building your own VPN list

Teams often try to maintain their own blocklist of VPN IPs. Don't. Three reasons:

1. The list is stale in 48 hours. VPN providers rotate IPs constantly.
2. You won't catch residential proxies, the highest-abuse category.
3. You're solving a problem someone else has solved at scale — use their data, focus on your product.

A commercial verification API updates multiple times per day, covers all five categories above, and costs less per month than one engineer's afternoon.

## Measuring the impact

Two weeks after enabling VPN-aware verification, you should see:

- **Bot signup rate** drop by 60–90%
- **Trial-to-paid conversion** increase measurably (cleaner top of funnel)
- **Support tickets about locked accounts** stay flat or rise slightly — this is where your false-positive recovery path matters

If support tickets spike, your thresholds are too strict. Loosen the "review" tier first before touching "block."

## Proxy detection for signup fraud, specifically

Everything above applies to VPNs, but **proxy detection for signup fraud** deserves its own focus — because proxies, not consumer VPNs, are where most automated signup abuse actually hides. A fraudster spinning up hundreds of trial accounts needs to look like hundreds of different users, and the cheapest way to do that is a rotating proxy pool.

The proxy categories that matter for signup fraud, in order of risk:

- **Residential proxies** — the highest-abuse category by far. Compromised home routers and IoT devices resold as "clean" residential bandwidth. They defeat naive IP-based rate limits because each request looks like a different home user. Near-zero legitimate signup use.
- **Datacenter proxies** — cheap, high-volume, easy to detect via ASN. Real users don't sign up from AWS or a bulletproof host in bulk.
- **Mobile proxies** — real carrier IPs rented out; harder to detect and increasingly common in 2026. Weight by velocity rather than blocking the carrier ASN outright.

For account-signup proxy detection, the rule is the same risk-tier table from earlier: residential proxy or Tor exit → silent block; datacenter on a known-fraud ASN → block; everything else → allow with an email-verification step when other signals stack. For the attacker economics behind this, see [how AI bot signups work in 2026](/blog/ai-bot-signups-2026) and the broader [SaaS signup fraud report](/blog/2026-saas-signup-fraud-report).

## VPN and proxy detection for login and account-takeover risk

Signup is the highest-value place to check IP reputation, but it is not the only one. The same VPN and proxy detection reduces **login risk** too. A login from a datacenter IP or a residential proxy that the account has never used before is one of the strongest account-takeover signals available.

The pattern most teams use: reuse the same verification call on risky login events. When the login IP is a proxy, Tor exit, or known-fraud address that does not match the account's history, step up to email confirmation or 2FA. When it is clean residential or corporate traffic, let it through silently. This keeps friction off legitimate logins while catching the credential-stuffing and takeover attempts that ride proxies to distribute their traffic.

## How companies detect proxy-backed account registration

If you have ever wondered how companies detect proxy-backed account registration, the mechanism is not magic — it is three cheap checks combined:

1. **Network classification** — resolve the IP to its ASN and connection type (residential, corporate, datacenter, hosting, mobile). Datacenter or hosting on a consumer signup is the first red flag.
2. **Live proxy/VPN/Tor membership** — cross-reference the IP against feeds that update multiple times a day: cloud-provider ranges, published VPN lists, the Tor consensus, and abuse blocklists.
3. **Velocity and reputation** — count how many accounts that IP and its /24 subnet created in the last hour and day, and whether the IP has a history of blocked signups across other customers.

Any one of these is weak. All three together produce a score that is genuinely hard to fake — which is why proxy-backed registration attacks concentrate on softer targets that only run a static blocklist. This is the exact stack Vouchley runs on every verification; you can [see the signals in the verify response](/docs/api/verify), included on [every plan from $19/month](/pricing).

## Proxy and VPN detection false positives (and how to avoid them)

The number one reason teams hesitate to turn on proxy and VPN detection is **false positives** — blocking a real customer who happened to be on a VPN. The fix is architectural, not a matter of finding a "perfect" list:

- **Never hard-block a soft signal.** Consumer-VPN and corporate-VPN traffic should escalate to email verification, never a silent block.
- **Reserve hard blocks for near-zero-legitimate categories** — residential proxies, Tor exits, and datacenter IPs on known-fraud ASNs.
- **Dampen mobile and CGNAT.** Carrier-grade NAT means thousands of real users share one IP; whitelist major mobile-carrier ASNs so you don't punish an entire cell network for one bad actor.
- **Always give a recovery path.** A flagged user who completes email verification should flip to allowed automatically. That single step recovers the large majority of false positives.

Tuned this way, proxy and VPN detection false positives on legitimate signups stay well under 1% while still catching the bulk of proxy-backed fraud. Pair it with [disposable-email detection](/blog/disposable-email-detection-guide) and [bot-signup prevention](/blog/bot-signup-prevention) so no single signal has to carry the whole decision.

## TL;DR

Don't treat VPN signups as binary. Categorize IPs into five buckets (residential, corporate VPN, consumer VPN, datacenter, residential proxy/Tor), tier actions from allow → email verify → silent block, and use a commercial verification API to keep the data fresh. Always give false positives a path to recover.

[Vouchley](/) bundles all five categories plus email and company signals into one API call. [Try it free](/signup) or [read the verify endpoint docs](/docs/api/verify).
