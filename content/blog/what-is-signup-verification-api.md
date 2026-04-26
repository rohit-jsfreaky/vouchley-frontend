---
title: "What Is a Signup Verification API? A Practical Guide for Product Teams"
excerpt: "Signup verification APIs sit between your signup form and your database, scoring every new account in real time. Here's what they actually do, what they don't do, and how to evaluate one for your SaaS."
date: "2026-04-24T18:00:00.000Z"
category: "Product"
author: "Rohit"
image: "/blog/what-is-signup-verification-api.jpg"
tags: ["signup verification API", "product", "fraud prevention"]
keywords:
  - "what is signup verification API"
  - "signup verification API"
  - "signup fraud API"
  - "user verification API"
  - "real-time signup verification"
readingTime: 7
featured: false
---

If you've been researching how to stop fake signups, you've run into the term "signup verification API" — and you've probably also seen "email validation API," "fraud detection API," "identity verification API," and a dozen other adjacent categories. They overlap, but they aren't the same thing, and picking the wrong one for your problem wastes money on the wrong defense.

This guide explains what a signup verification API actually does, what it doesn't, and the criteria your team should use to evaluate one.

## The 30-second definition

A signup verification API is a hosted service you call once per new user, at the moment of signup, that returns a risk score plus a recommended action. The input is the signal you have at signup — typically email, IP address, and sometimes name or phone. The output is a score (e.g. 0–100) and a verdict like `approve`, `review`, or `block`.

It's a thin, opinionated layer with one job: tell you, before you create the account, whether this signup is likely a real user.

That's the entire product. Everything else (dashboards, analytics, billing) is decoration. The thing that matters is the score and how good it is.

## What it actually checks

A signup verification API stacks dozens of cheap signals into one composite score. The categories that matter:

### Email signals

- Syntactic validity (RFC 5322)
- MX record present and resolving
- Disposable / temporary provider detection (Mailinator, 10MinuteMail, hundreds of others)
- Free-provider classification (Gmail, Yahoo, ProtonMail)
- Role-based detection (`info@`, `admin@`, `support@`)
- SMTP-level verification (does the inbox actually exist) — sometimes; this is rate-limited and risky to do live
- Gmail alias normalization (treating `me+x@gmail.com` and `me@gmail.com` as the same person)

### Domain signals (for non-free email)

- Domain age
- Live website
- Registrar reputation
- DMARC presence

### IP signals

- Geographic origin
- ASN classification (residential, corporate, datacenter)
- VPN / proxy / Tor detection
- Reputation / known fraud history
- Recent abuse activity

### Behavioral signals (when available)

- User agent and device fingerprint
- Time-on-page before submit
- Mouse movement entropy
- Honeypot field interactions

A good signup verification API runs all of these in parallel and combines them into a score in under 1.5 seconds. A bad one runs three checks and calls it a day.

## What it does NOT do

This is where most evaluation goes wrong. Signup verification APIs are not:

- **Identity verification.** They don't check government IDs, take a selfie, or confirm legal identity. That's a different category (KYC / IDV — Persona, Onfido, Stripe Identity).
- **Payment fraud detection.** They don't watch transactions, score chargeback risk, or run rules over checkout behavior. That's Stripe Radar, Sift, Kount.
- **Account takeover prevention.** They don't watch login patterns, detect compromised credentials, or score MFA bypasses. That's a session-and-login problem.
- **Email validation only.** Email validation APIs (NeverBounce, ZeroBounce, Hunter) are a strict subset — they check email validity but not IP, domain, or behavior. They're cheaper but they catch a fraction of what signup verification catches.
- **Generic bot detection.** Bot detection products (Cloudflare Turnstile, hCaptcha, Datadome) protect endpoints from automated traffic. They overlap with signup verification on the bot signal but don't include email or domain context.

The clearest mental model: signup verification is the moment between "user submitted a form" and "you committed an account to your database." Anything before is acquisition. Anything after is account lifecycle. Signup verification owns that one boundary.

## When to use one

You probably need a signup verification API if any of these are true:

- You offer a free trial or freemium tier
- You give signups any usable resource (LLM credits, API requests, storage, compute)
- You send transactional email to new users (and care about deliverability)
- You pay for referrals or affiliates
- Your trial-to-paid conversion looks suspiciously high or suspiciously low (both are red flags — abuse can pad either side)
- Your support team handles "fake account" tickets more than once a quarter

You probably don't need one (yet) if:

- Your only signup gate is "submit your email and we'll add you to the waitlist" with no resource consumption
- You charge a credit card on signup (payment fraud detection covers most of the abuse vectors)
- You operate in a strictly invite-only mode

## How to evaluate one

If you've decided you need one, here's the eval shape that actually matters. Skip the marketing pages.

### 1. Run a real shadow test

Don't trust vendor benchmarks. Sign up for the API on a free or trial plan, integrate it in *shadow mode* (call the API but don't act on the result), and let it run for 7–14 days against your real signup traffic. Then compare:

- What did it flag as block?
- What did it flag as review?
- Of those, which actually converted to paying customers?
- Of the ones it approved, which turned out to be obvious abuse?

A 14-day shadow test will tell you more about real performance than any vendor demo.

### 2. Latency matters more than you think

Your signup form already feels slow to users. Adding 800ms is fine. Adding 4 seconds is a conversion drop. Test latency from your actual production region, not from the vendor's marketing site.

P50 should be under 600ms. P95 should be under 1.5s. P99 over 3s is a problem.

### 3. False positive rate is the metric to negotiate over

Every fraud product has both false positives (real users blocked) and false negatives (fake users approved). The cost asymmetry is huge: blocking a real customer can cost you $200 in lifetime value; letting one fake account through usually costs you a few cents in compute.

Demand the false-positive rate in writing. Anything above 1% is too high for most SaaS. Below 0.5% is excellent.

### 4. The reasoning matters

A score of 17 is meaningless without context. The API should return a `reasoning` field explaining *why* — disposable email, Tor IP, new domain, etc. This is what lets you debug edge cases and explain blocks to support.

If the API only returns a number, walk away.

### 5. Pricing should be predictable

Most signup verification APIs price per-check, with a free tier. Watch out for:

- Hidden minimum monthly commits
- Per-region surcharges
- "Premium" reputation data behind a higher tier

A clean pricing model is per-check, with a generous free tier (so you can actually shadow test), and a clear monthly cap. Anything more complicated is a sales tactic.

## The minimal integration

Once you've picked a vendor, the integration is genuinely small. Here's the shape, in case the vendor demos make it look more complex than it is:

```typescript
// At the moment of signup
const verify = await fetch("https://api.vouchley.getrevlio.com/v1/verify", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.VOUCHLEY_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: form.email,
    ip_address: req.ip,
    name: form.name,
  }),
});

const { score, recommendation, reasoning } = await verify.json();

if (recommendation === "block") {
  // Silent reject — don't tell them why
  return { ok: true };
}

if (recommendation === "review") {
  // Create the account but require email verification first
  return await createUserPendingVerification(form);
}

return await createUser(form);
```

Total integration effort: 1–2 hours including environment setup and testing. The leverage is enormous because every future signup goes through it.

## The TL;DR

A signup verification API is a one-call, in-line service that scores new signups before they become accounts. It bundles email, domain, IP, and behavioral checks into a single decision. It's not identity verification, payment fraud, or account takeover defense — it owns the boundary between form submit and account creation.

Evaluate vendors with a real shadow test against your traffic. Watch P95 latency, false positive rate, and pricing transparency. The integration is small; the leverage is large.

[Vouchley](/) is a signup verification API built for SaaS teams who want exactly this and nothing more. [See the API reference](/docs/api/verify) or [start free with 100 credits](/signup) — no card required.
