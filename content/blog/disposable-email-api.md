---
title: "Disposable Email API: How to Block Temp Mail in Your Stack"
excerpt: "A static blocklist you downloaded six months ago already misses a quarter of active temp-mail providers. Here's how to block disposable email with an API instead — the response fields that matter, the one call to wire in, the edge cases, and build-vs-buy."
metaTitle: "Disposable Email API: Block Temp Mail (2026)"
metaDescription: "How to block disposable and temporary email at signup with an API in 2026 — the response fields, one-call integration code, edge cases, and build-vs-buy."
date: "2026-07-23T10:00:00.000Z"
updatedAt: "2026-07-23T10:00:00.000Z"
category: "Engineering"
author: "Rohit Kashyap"
image: "/blog/disposable-email-guide.jpg"
tags: ["disposable email", "email validation", "API"]
keywords:
  - "disposable email API"
  - "block temp mail API"
  - "temporary email detection API"
  - "disposable email checker API"
  - "block disposable emails"
  - "temp mail checker"
readingTime: 10
featured: false
faq:
  - question: "What is a disposable email API?"
    answer: "A disposable email API takes an email address and tells you, in real time, whether its domain belongs to a temporary / throwaway provider (Mailinator, 10MinuteMail, Guerrilla Mail, temp-mail, and thousands more). A good one also confirms the domain has valid MX records and flags role-based and free-provider addresses. You call it at signup and act on the result instead of maintaining your own domain list."
  - question: "Why use an API instead of a static disposable-domain list?"
    answer: "New disposable services spawn at roughly 20–50 new domains per week. A list you downloaded six months ago typically misses 25–40% of currently-active providers, so it silently lets fresh temp-mail domains through while you think you are covered. An API is maintained continuously and adds a live MX check the static list cannot do — a domain can be on no list yet still be undeliverable."
  - question: "How do I block temp mail without blocking Gmail and Outlook?"
    answer: "Distinguish disposable from free-provider. Gmail, Outlook, Proton, and Yahoo are free but legitimate — you should not block them. A verification API returns disposable and free_provider as separate flags, so you block disposable=true while merely scoring free_provider=true a little tighter. Never hard-block free providers; you will lose enormous legitimate volume."
  - question: "Does blocking disposable email stop all fake signups?"
    answer: "No — it stops the laziest 30–40%. Disposable-email blocking is layer one. Determined attackers move to fresh custom domains, Gmail aliases, or real inboxes on residential IPs. Pair disposable detection with IP reputation (VPN / proxy / datacenter) and domain-age signals, combined into one score, to catch the rest."
  - question: "Is there a free disposable email checker?"
    answer: "Yes. Vouchley's disposable email checker is free and needs no signup — paste an address and it returns the disposable, MX, role-based, and free-provider verdict. For programmatic blocking on every signup, the /v1/verify API returns the same email signals plus IP and domain scoring in one call."
howTo:
  name: "How to block disposable email signups with an API"
  description: "Wire real-time temp-mail blocking into a signup flow in under an afternoon."
  totalTime: "PT30M"
  steps:
    - name: "Call the verification API at signup"
      text: "In your signup handler, POST the submitted email to the verification endpoint before you create the account. Do it server-side so the key stays secret and the check cannot be skipped by the client."
      url: "https://vouchley.getrevlio.com/docs/api/verify"
    - name: "Read the disposable and mx_record flags"
      text: "The response returns email.disposable (throwaway provider), email.mx_record (domain can receive mail), email.role_based, and email.free_provider. Treat disposable=true or mx_record=false as hard fails."
    - name: "Branch on the recommendation, not a single flag"
      text: "Block on disposable=true, but for everything else defer to the combined score and recommendation (approve / review / block) so you catch fresh-domain and IP-based abuse the email flag alone misses."
    - name: "Log the verdict and monitor your disposable rate"
      text: "Persist the verdict against each signup. A healthy SaaS sits under 3% disposable; a spike above that signals a launch-day attack or a stale defense worth investigating."
---

You added a disposable-email blocklist once. You downloaded a big `.txt` of throwaway domains, checked the signup email against it, and moved on. That was the right instinct — and it is quietly failing you right now.

New disposable email services launch constantly — roughly **20–50 new domains a week**, concentrated in Asia-Pacific timezones. A static list built six months ago misses **25–40%** of currently-active providers. Worse, a static list can only answer one question ("is this domain on my list?") when the real question is "can this address receive mail, and is the person behind it worth onboarding?"

A disposable email API answers all of that in one call, stays current without your involvement, and adds signals a flat file never can. This post is the practical version: what the API returns, how to wire it in, the edge cases that trip teams up, and when to build versus buy.

## What a disposable email API actually returns

A flat blocklist returns a boolean. A verification API returns a small object of signals you can score:

- **`disposable`** — the domain belongs to a known temporary / throwaway provider.
- **`mx_record`** — the domain has valid MX records and can actually receive mail. A domain can be on no disposable list and still be undeliverable — this catches that.
- **`role_based`** — the local part is `info@`, `admin@`, `support@`, and similar. Rarely a single real person.
- **`free_provider`** — Gmail, Outlook, Proton, Yahoo. **Not** a block signal — a scoring signal.

The distinction between `disposable` and `free_provider` is the one most home-grown solutions get wrong. Gmail is free but legitimate; Mailinator is free and throwaway. Conflate them and you either let temp mail through or block a third of your real signups. (For the full breakdown of what detection catches and misses, see the [disposable email detection guide](/blog/disposable-email-detection-guide).)

## The one call

Here is the whole integration. One request, server-side, before you create the account:

```javascript
async function handleSignup(req, res) {
  const { email, name } = req.body;

  const resp = await fetch("https://api.vouchley.getrevlio.com/v1/verify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VOUCHLEY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, name, ip_address: req.ip }),
  });

  const { score, recommendation, email: signals } = await resp.json();

  // Hard fail on throwaway or undeliverable addresses
  if (signals.disposable || !signals.mx_record) {
    return res.status(422).json({ error: "Please use a permanent email address." });
  }

  // Everything else: defer to the combined score
  if (recommendation === "block") return res.status(422).json({ error: "Signup rejected." });
  if (recommendation === "review") await flagForReview({ email });

  return createAccount({ email, name, trustScore: score });
}
```

The same shape in Python:

```python
import os, requests

def verify_email(email, ip=None):
    r = requests.post(
        "https://api.vouchley.getrevlio.com/v1/verify",
        headers={"Authorization": f"Bearer {os.environ['VOUCHLEY_API_KEY']}"},
        json={"email": email, "ip_address": ip},
        timeout=3,
    )
    data = r.json()
    email_signals = data["email"]
    if email_signals["disposable"] or not email_signals["mx_record"]:
        raise ValueError("disposable_or_undeliverable")
    return data["score"], data["recommendation"]
```

That is the entire happy path. Cached checks (the same address within the cache window) are free, so retries and repeated signup attempts from the same visitor do not drain your balance.

## Build vs buy: the static-list trap

You *can* build this. Pull one of the open-source disposable-domain lists, load it into a set, check membership. It works on day one and rots from day two.

What you inherit when you build:

- **A maintenance job forever.** Someone has to merge new domains weekly, or the list goes stale at the 20–50/week rate above.
- **No MX truth.** Membership in a list is not the same as deliverability. Fresh throwaway domains and dead custom domains both slip through a list-only check.
- **No alias handling.** `+tag` and dot tricks on Gmail, plus alias services like SimpleLogin and DuckDuckGo Email Protection, need normalization logic a flat list does not have.

Buy makes sense when disposable detection is one signal in a larger score rather than your whole defense — which it should be. The [2026 signup fraud report](/blog/2026-saas-signup-fraud-report) has the full data on how fast blocklists decay.

## Edge cases that trip teams up

**Legit free providers.** Gmail, Outlook, iCloud, Proton, Yahoo — `free_provider: true`, `disposable: false`. Score them slightly tighter; never block them.

**Alias and subaddressing.** `rohit+netflix@gmail.com` and `r.o.h.i.t@gmail.com` normalize to the same inbox. Most are innocent inbox organization; the same *normalized* address signing up repeatedly in a short window is the abuse signal — not the alias itself.

**MX-only failures.** A brand-new custom domain that is on no disposable list but has no working MX is undeliverable. The `mx_record: false` flag catches these where a list cannot.

**Launch days.** Your disposable rate is not constant. It sits at 2–5% day to day and spikes to 15–30% during a Product Hunt or viral moment. Log the verdict so you can see the spike instead of guessing.

## Where to enforce it

Run the check **server-side, before account creation**, and branch on the recommendation rather than any single flag:

- `disposable: true` or `mx_record: false` → reject with a friendly "use a permanent address" message.
- `recommendation: "review"` → create the account but gate expensive features and require email verification.
- `recommendation: "approve"` → onboard with zero friction.

That is the [block/verify/allow policy](/blog/prevent-fake-signups-2026) applied to the email layer specifically.

## Try it before you wire it

- **Free checker:** the [disposable email checker](/tools/disposable-email-checker) verifies any address instantly — no signup.
- **Named domains:** the [disposable email domain reference](/disposable-emails) covers the providers people look up by name.
- **Full API:** the [`/v1/verify` docs](/docs/api/verify) show every field the endpoint returns.

Disposable-email blocking is the cheapest, highest-ROI first move against fake signups — as long as it is an API that stays current, not a file that goes stale. Wire the one call, branch on the recommendation, and you have layer one of a real defense in an afternoon.

[Start free with 100 Vouchley credits →](/signup) — no card required.
