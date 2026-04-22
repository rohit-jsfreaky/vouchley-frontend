---
title: "How to Detect Fake Signups in Real Time: A Complete Guide for SaaS Teams"
excerpt: "Fake signups are the silent tax on every growing SaaS. Here's how to detect and block them in real time — without adding friction for legitimate users."
date: "2026-04-21T09:00:00.000Z"
category: "Engineering"
author: "Rohit"
image: "/blog/fake-signup-detection.jpg"
tags: ["fake signup detection", "signup verification", "SaaS fraud"]
keywords:
  - "detect fake signups"
  - "fake signup detection"
  - "signup verification API"
  - "SaaS fraud prevention"
  - "block fake accounts"
readingTime: 9
featured: true
---

Every growing SaaS product hits the same wall at some point: your signup funnel fills up with accounts that never convert, never log in twice, and occasionally wreck your free tier with abuse. These are fake signups, and they quietly tax every metric you care about — conversion rates, email deliverability, compute costs, and even your fundraising narrative.

In this guide, we'll walk through exactly how to detect fake signups in real time, what signals actually matter, and how to wire it into your onboarding flow without adding friction for legitimate users.

## Why fake signups happen

Before we dig into detection, it helps to understand the motivation. Fake signups fall into four buckets:

1. **Free-tier abuse** — someone wants to use your product for free, so they create dozens of accounts with disposable emails.
2. **Content farming** — scrapers or LLM-training bots hitting signup-gated features.
3. **Affiliate fraud** — if you pay referrals, attackers sign up fake accounts to collect.
4. **Testing / reconnaissance** — competitors probing your product, or attackers mapping your API before an actual attack.

Each of these leaves slightly different fingerprints, but the detection strategy is the same: combine multiple weak signals to produce a strong verdict.

## The signals that actually matter

Forget CAPTCHA-only approaches — they punish real users and barely slow down modern scrapers. Here's what actually works in 2026.

### 1. Email validity signals

Start at the email layer. For every signup, you want answers to these questions:

- **Does the email syntactically parse?** A surprising number of fake signups fail basic RFC 5322 validation.
- **Does the domain have an MX record?** No MX means no inbox. No inbox means no real user.
- **Is it a disposable email?** Mailinator, 10MinuteMail, Guerrilla Mail, and hundreds of others churn out addresses by the second.
- **Is it a free provider?** Gmail, Yahoo, ProtonMail, etc. Not a red flag on its own — but combined with other signals, weight it accordingly.
- **Is it role-based?** `info@`, `sales@`, `admin@` are rarely tied to a single real user.

These five checks alone will block a meaningful fraction of low-effort signup spam.

### 2. Company domain signals

If the email domain isn't a free provider, check the company:

- **Does the domain resolve?** A live domain suggests an operating company.
- **How old is the domain?** Domains less than 30 days old correlate strongly with throwaway infrastructure.
- **Does the domain have a live website?** Real companies have websites.

A signup from `ceo@newcompany-2026.com` where the domain was registered yesterday is almost always fraudulent.

### 3. IP reputation signals

The source IP carries a wealth of signal:

- **Country** — if 99% of your users are in North America and this signup is from a small Eastern European country, weight accordingly.
- **VPN/Proxy flags** — signups through VPN services are disproportionately low-quality.
- **Tor exit nodes** — almost never a legitimate user of a B2B SaaS.
- **IP risk score** — commercial fraud APIs maintain running risk scores on every IP address globally.

At [Vouchley](/), we combine all three pillars — email, company, and IP — into a single trust score on every signup. More on how below.

### 4. Behavioral signals (bonus)

Once you're tracking basic behavior, you get a second layer:

- **Time from page-load to signup submission** — a legitimate user spends at least 20–30 seconds. A bot submits in 1.2 seconds.
- **Mouse movement entropy** — real users have jittery, imperfect mouse paths. Bots move in straight lines or skip mouse events entirely.
- **Typing cadence** — humans have variable intervals between keystrokes.

These are powerful but require client-side instrumentation. For many SaaS products, the email + company + IP signals alone are enough.

## Turning signals into decisions

Collecting signals is easy. Turning them into actions is where teams struggle. Here's the pattern we recommend:

1. **Score every signup from 0–100.** Don't just binary-flag fraud — quantify confidence.
2. **Map the score to an action**:
   - `>= 70` — approve, onboard normally.
   - `40–69` — approve but queue for manual review or require email verification.
   - `< 40` — block and show a polite error.
3. **Log the decision.** Every verdict should be auditable so you can tune thresholds later.

The score-then-branch pattern gives you flexibility. Legitimate edge cases (a real user from Tor) can still sign up after an extra verification step, while obvious abuse gets stopped cold.

## A real-world example

Here's how it looks in practice. A signup arrives with:

```
email:   john.doe@acme-new-company.xyz
name:    John Doe
ip:      185.220.101.45  (known Tor exit)
```

Our scoring engine produces:

```
{
  "score": 8,
  "recommendation": "block",
  "reasoning": "Disposable-looking domain (14 days old), Tor exit IP, very high IP risk (95/100).",
  "signals": {
    "email":   { "valid": true, "disposable": false, "mx_record": true },
    "company": { "domain_alive": true, "domain_age_days": 14 },
    "ip":      { "is_tor": true, "risk_score": 95, "country": "DE" }
  }
}
```

Score 8/100, recommendation block. No legitimate user looks like this.

Compare that to a real signup:

```
email:   alice@stripe.com
name:    Alice Kim
ip:      203.0.113.42  (clean residential IP)
```

```
{
  "score": 94,
  "recommendation": "approve",
  "reasoning": "Valid corporate email at an established domain, clean IP, name aligns with email local-part."
}
```

Score 94/100, approve. Onboard immediately.

## Wiring it into your signup flow

Once you have a verification service running, integration is a single HTTP call. In pseudocode:

```javascript
async function createUser(signup) {
  const resp = await fetch("https://api.vouchley.getrevlio.com/v1/verify", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.VOUCHLEY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: signup.email,
      name: signup.name,
      ip_address: signup.ip,
    }),
  });
  const { score, recommendation } = await resp.json();

  if (recommendation === "block") {
    throw new Error("Signup rejected");
  }
  if (recommendation === "review") {
    await flagForManualReview(signup);
  }
  return await db.users.insert({ ...signup, trust_score: score });
}
```

That's it. One extra API call, at most a few hundred milliseconds of latency, and your signup funnel is suddenly a lot cleaner.

## Common mistakes to avoid

A few traps we see teams fall into:

- **Relying on CAPTCHA alone.** Modern CAPTCHAs are solved by residential-proxy farms for $1 per thousand. They catch the low-effort bots and nothing else.
- **Blocking all free-provider emails.** Gmail is a valid business email for solo founders and consultants. Use it as a signal, not a hard block.
- **Hard-blocking on low-confidence signals.** A 60/100 score is not "definitely fraud." Queue those for review or require a second verification step.
- **Not logging decisions.** When a legitimate user complains about being blocked, you need to see exactly why. Log every score, every reason, every signal.
- **Running signal checks synchronously inside your signup handler with no timeout.** If the verification service hangs, your signup page hangs. Set a hard 2-second timeout with a fallback rule.

## What about the 30% of signups you can't score cleanly?

There will always be a middle band — legitimate users on sketchy networks, real founders at new companies, power users behind work VPNs. For these, don't block. Do one of:

- **Require email verification** (send a magic link or OTP before onboarding completes).
- **Throttle free-tier usage** on the account until their score improves with history.
- **Queue for human review** if your volume is low enough.

The goal isn't to achieve zero false negatives — it's to make fraud expensive enough that attackers move on.

## Conclusion

Fake signup detection doesn't require machine learning PhDs or a ten-person fraud team. It requires: the right signals at the email, company, and IP layers; a scoring system that produces confidence-weighted verdicts; and clean integration into your signup handler.

If you'd rather not build this in-house, [Vouchley](/) gives you all three pillars through a single API call — with caching, so cached results are free, and pricing that doesn't scale with your user base. First 100 verifications are on us.

Stop paying the fake-signup tax. Start scoring every signup.
