---
title: "Disposable Email Detection: What Works, What Doesn't, and Why It Matters"
excerpt: "Disposable emails are the #1 indicator of low-intent signups. Here's a practical guide to detecting them — what works in 2026, what doesn't, and how to integrate detection into any stack."
metaTitle: "Disposable Email Detection: What Works in 2026"
metaDescription: "How to detect and block disposable emails — Mailinator, 10minutemail, temp-mail — at signup in 2026. What works, what fails, and how to add it to any stack."
date: "2026-04-18T09:00:00.000Z"
updatedAt: "2026-07-11T09:00:00.000Z"
category: "Engineering"
author: "Rohit Kashyap"
image: "/blog/disposable-email-guide.jpg"
tags: ["disposable email", "email validation", "signup verification"]
keywords:
  - "disposable email detection"
  - "temporary email detection"
  - "email validation API"
  - "block disposable emails"
  - "mailinator detection"
  - "temp mail that is not detected"
  - "is guerrilla mail safe"
  - "who owns mailinator"
  - "block temporary email"
readingTime: 12
featured: false
faq:
  - question: "Who owns Mailinator and is it safe?"
    answer: "Mailinator is a long-running public disposable email service (online since 2003). It is safe in the sense that it is a legitimate, well-known service, but it offers no privacy: anyone can read the mail sent to any Mailinator address by visiting the public inbox. For a business receiving a Mailinator signup, treat it as a throwaway address and block it, because the person has no intention of receiving ongoing email."
  - question: "Is Guerrilla Mail safe to use?"
    answer: "For the person using it, Guerrilla Mail is safe and anonymous — it is a legitimate disposable email service with hourly-expiring inboxes. For a business receiving a signup from a Guerrilla Mail address, it is a clear block signal, because the address is throwaway by design and will not be checked again after the confirmation email."
  - question: "How do you detect temp mail that is not on a blocklist?"
    answer: "Temp-mail services rotate through many alias domains to evade static blocklists, so a fixed list misses a large share of active domains. Catch the rest with a feed that updates daily, MX and domain-age checks (freshly-registered domains and dead MX records are strong signals), and behavioral corroboration such as a datacenter IP or a sub-second form submit. Combining these catches the rotating domains a static list misses."
  - question: "What is the best way to block disposable emails at signup?"
    answer: "Combine four checks rather than relying on one: a maintained blocklist that updates daily, an MX record lookup, a domain-age check, and a weighted score that folds in IP and behavioral signals. Hard-block obvious throwaway providers like Mailinator and 10 Minute Mail, flag privacy-forwarding aliases for review, and allow clean free-provider signups. A verification API does all of this in a single call."
  - question: "Should you block Gmail or other free email providers?"
    answer: "No. Gmail, Outlook, and Yahoo are legitimate providers used by real customers — blocking them costs you enormous legitimate volume. They are not disposable. The right move is to normalize free-provider addresses for uniqueness (Gmail dot and plus aliases) and apply slightly tighter scoring, not to block the domain."
  - question: "How often do new disposable email domains appear?"
    answer: "Roughly 20 to 50 new disposable domains per week as of 2026, with launches concentrated in Asia-Pacific timezones. A blocklist built six months ago will already miss about 25 to 40 percent of currently-active disposable services, which is why a daily-updated feed or a verification API that maintains the list is necessary to keep detection current."
---

If you run a SaaS with a free tier, disposable emails are quietly draining you. Every Mailinator address that signs up and never returns means wasted onboarding emails, inflated activation funnel metrics, and in the worst case, coordinated abuse that gets your sending domain blacklisted.

This post is a practical guide: what counts as a disposable email, why simple blocklist approaches fail, and what actually works in 2026.

## What is a disposable email?

A disposable email (also called a temporary email, throwaway email, or DEA — disposable email address) is an inbox that exists just long enough to receive a single confirmation email. Users get an address, grab the confirmation, and the inbox disappears — often within minutes.

Popular providers include:

- **Mailinator** — the OG, running since 2003
- **10 Minute Mail** — self-explanatory
- **Guerrilla Mail** — one of the largest, with millions of active addresses
- **Temp Mail / Temp-Mail.org** — the current market leader by volume
- **DropMail / FakeMail / EmailOnDeck** — dozens of smaller services

Collectively, these services process tens of millions of disposable addresses per day.

## Why disposable emails matter for your SaaS

At small scale, a few disposable signups are no big deal. At scale, the costs compound:

1. **Inflated signup metrics** — your "300 new signups this week" number looks great until you realize half of them will never log in twice.
2. **Wasted sending quota** — Resend, Postmark, SendGrid all charge per email. Sending to disposable addresses is burning budget.
3. **Deliverability damage** — sending to mailboxes with no MX records, or getting bounces from expired disposable inboxes, hurts your sender reputation.
4. **Free-tier abuse** — the attacker's recipe: sign up with disposable email, use the free tier, repeat with a new address.
5. **Referral/affiliate fraud** — if you pay for referrals, disposable emails are how attackers farm.

One SaaS we talked to estimated that 23% of their free signups were disposable. Blocking them reclaimed about $400/month of Resend quota and raised their 7-day activation rate from 11% to 14%.

## Approach 1: The blocklist (and why it alone is not enough)

The obvious approach: maintain a list of known disposable email domains and block them at signup.

Public blocklists do exist — there are open-source lists on GitHub with 3,000 to 100,000+ domains. A typical implementation:

```javascript
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  // ... thousands more
]);

function isDisposable(email) {
  const domain = email.split("@")[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.has(domain);
}
```

This is fine as a first line, and it's better than nothing. But it has two big weaknesses:

### Weakness 1: Disposable services add new domains constantly

Mailinator alone uses hundreds of rotating domains. Temp-Mail rotates through thousands. Your static blocklist is out of date the moment you commit it.

### Weakness 2: "Catch-all" subdomains

Some services let users generate addresses on arbitrary subdomains. You'd need wildcard matching, and even then attackers can register brand-new domains and point them at open-relay SMTP servers.

So blocklists help — but they're a floor, not a ceiling.

## Approach 2: MX and DNS-based checks

The next layer: verify that the email domain actually resolves and has mail infrastructure.

Every legitimate email domain needs:

1. **An A or AAAA record** — the domain exists.
2. **An MX record** — the domain can receive email.
3. **SMTP reachability** — the mail server actually responds.

Many disposable providers skip steps 2 and 3 on "used" addresses — once the confirmation email is delivered, the MX record stops responding. If you check at signup time, you'll see the live record. But if you re-check 24 hours later, about 15% of disposable addresses fail MX lookup.

This gives you a second detection strategy: **re-verify suspected addresses asynchronously**. Store a list of low-confidence addresses and re-check MX records a day later. Any that fail can be flagged retroactively.

## Approach 3: Behavioral signals from the disposable service

Here's something most developers miss: disposable email services leave behavioral fingerprints that aren't on any blocklist.

For example:

- **Inbox access patterns** — disposable addresses are checked from a small pool of AWS/DigitalOcean IPs that belong to the disposable service's scraping backend, not the "user's" claimed location.
- **Send-time distribution** — confirmation emails to disposable addresses are opened within 10–90 seconds. Real inboxes show a much broader distribution (minutes to days).
- **Link-click velocity** — disposable services often auto-click all links in the confirmation email, producing super-fast click-through rates that are statistically impossible for humans.

If you're running your own email sending, you can capture these signals from Resend/Postmark webhooks. For most teams, this is overkill — the first two approaches get you 90% of the way.

## Approach 4: Combining signals (what Vouchley does)

A single signal is weak. Combined signals are strong. The detection stack we run on every Vouchley verification:

1. Syntactic email validation (RFC 5322)
2. Disposable blocklist (curated + updated weekly from open sources)
3. MX record lookup (with 2s timeout)
4. Domain age check (very new domains are suspicious)
5. Free-provider classification (not a block signal, but a weight)
6. Role-based detection (info@, admin@, etc.)

The output is a boolean `disposable` flag plus a weighted contribution to the overall trust score. Even when a specific disposable domain slips past our blocklist, the missing MX record or very-new domain age usually catches it.

Here's what it looks like in the API response:

```json
{
  "score": 22,
  "recommendation": "block",
  "email": {
    "valid": true,
    "disposable": true,
    "free_provider": false,
    "role_based": false,
    "mx_record": true
  },
  "reasoning": "Disposable email provider (tempmail domain)."
}
```

## When to block vs. when to warn

Hard-blocking disposable emails at signup is usually the right call for B2B SaaS. For consumer products, the decision is more nuanced — some legitimate users really do value privacy and use services like SimpleLogin or ProtonMail aliases.

A sensible middle ground:

- **Hard block** obvious disposable providers (Mailinator, 10MinuteMail) that exist solely for throwaway use.
- **Flag for review** privacy-forwarding services (SimpleLogin, AnonAddy, Firefox Relay) — they're technically email aliases but real users use them.
- **Approve but throttle** signups from free providers (Gmail/Yahoo) that otherwise look clean.

## The disposable email services people ask about most

A handful of services account for the bulk of disposable-email signups. Here is how the most-searched ones compare, and whether to block them at signup:

| Service | Launched | Inbox lifetime | Block at signup? |
|---------|----------|----------------|------------------|
| [Mailinator](/disposable-emails/mailinator-com) | 2003 | Public, persistent | Yes |
| [10 Minute Mail](/disposable-emails/10minutemail-com) | 2007 | ~10 minutes | Yes |
| [Guerrilla Mail](/disposable-emails/guerrillamail-com) | 2006 | ~1 hour | Yes |
| [Temp-Mail](/disposable-emails/tempmail-org) | 2013 | Until refreshed | Yes |

**Mailinator** is the oldest and most recognizable. It runs as a public service — anyone can read the mail sent to any Mailinator address by visiting the public inbox, with no password. That is exactly why a Mailinator signup has zero intent behind it: the "user" never expects to receive anything private. See the [full breakdown of Mailinator](/disposable-emails/mailinator-com).

**10 Minute Mail** hands out an address that self-destructs after ten minutes. Any signup using it is unreachable within minutes, so there is no value in onboarding it. [More on 10 Minute Mail](/disposable-emails/10minutemail-com).

**Guerrilla Mail** is one of the largest providers, with hourly-expiring inboxes and a rotating set of alias domains. Is Guerrilla Mail safe? For the person using it, yes — it is anonymous and disposable by design. For you receiving the signup, it is a clear block signal. [More on Guerrilla Mail](/disposable-emails/guerrillamail-com).

**Temp-Mail** is the current market leader by volume, and the reason people search for "temp mail that is not detected" (covered next). [More on Temp-Mail](/disposable-emails/tempmail-org).

You can browse every service in the full [disposable email domain reference](/disposable-emails).

## Why some temp mail "isn't detected" (and how to catch it)

If you have searched for temp mail that is not detected, here is what is actually happening: the large temp-mail services rotate through hundreds or thousands of alias domains specifically to slip past static blocklists. A list you committed six months ago will miss 25–40% of the domains currently in rotation.

Three things catch the ones a static list misses:

1. **A feed that updates daily.** New disposable domains appear at roughly 20–50 per week. Either subscribe to a maintained feed or use an API that maintains the list as a service. For the step-by-step API build, see [how to block temp mail with a disposable email API](/blog/disposable-email-api).
2. **MX and domain-age checks.** Freshly-registered throwaway domains, and addresses whose MX record stops responding shortly after the confirmation email, are strong signals even when the domain is not yet on any list.
3. **Behavioral corroboration.** A brand-new domain plus a datacenter IP plus a sub-second form submit is disposable-adjacent behavior regardless of whether the domain is catalogued yet.

This is the gap between a DIY blocklist and a maintained detector: the maintained one keeps catching the rotation you would otherwise miss.

## Integration in one API call

The whole point of an email validation API is that you don't have to build any of this yourself:

```bash
curl -X POST https://api.vouchley.getrevlio.com/v1/verify \
  -H "Authorization: Bearer $VOUCHLEY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@mailinator.com"}'
```

Response:

```json
{
  "score": 15,
  "recommendation": "block",
  "email": {
    "valid": true,
    "disposable": true,
    "free_provider": false,
    "role_based": false,
    "mx_record": true
  },
  "reasoning": "Disposable email provider detected."
}
```

Cache hits are free, so repeated attempts with the same address cost you zero credits.

## What NOT to do

A few common anti-patterns we see:

1. **Don't regex-match for "temp" or "throwaway" in email addresses.** Real users have addresses like `temp-testing@realcompany.com`. Use proper domain-level matching.
2. **Don't block every new domain.** Legitimate startups register domains daily.
3. **Don't show the user exactly why they were blocked.** Attackers will tune around it. Show a generic "this email can't be used" message.
4. **Don't forget to log.** Every rejected signup is a data point. If your support inbox fills up with false-positive complaints, you need the logs to tune thresholds.

## Conclusion

Disposable email detection isn't a one-off feature — it's an ongoing arms race against services that add new domains weekly. The right approach combines a maintained blocklist, MX validation, domain-age checks, and a weighted scoring system.

You can build all this in-house. Most teams shouldn't. [Vouchley](/)'s `/v1/verify` endpoint does every check above plus IP reputation, company validation, and person-match scoring in a single ~200ms call. The first 100 verifications are free.

Your free tier will thank you.
