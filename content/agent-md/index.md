# Vouchley — Real-time signup verification API for SaaS

> Vouchley scores every new signup in real time. Block bots, filter disposable emails, detect VPN/Tor abuse, and route qualified leads — all in one API call.

**Canonical URL:** https://vouchley.getrevlio.com/
**API base URL:** https://api.vouchley.getrevlio.com
**Pricing:** From $29 for 3,000 verifications. 100 free credits on signup, no card required. Credits never expire.

---

## What Vouchley does

Vouchley is a single HTTP endpoint that takes a signup (email plus optional name, company, and IP address) and returns a 0–100 trust score with a recommendation — `approve`, `review`, or `block` — in under 1.5 seconds at the p95.

Built for B2B SaaS, marketplaces, and developer tools that need to keep fake signups out of their database without adding friction for legitimate users.

## Quick example

```bash
curl -X POST https://api.vouchley.getrevlio.com/v1/verify \
  -H "Authorization: Bearer vch_live_..." \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "ip_address": "192.168.1.1"
  }'
```

Response:

```json
{
  "score": 92,
  "recommendation": "approve",
  "reasoning": "Valid corporate email at established domain."
}
```

## Three things Vouchley does well

1. **Simple integration.** One HTTP endpoint. Any language, from cURL to your favourite client. Running in under five minutes.
2. **Sub-second verification.** Cache hits return in under 100ms. Fresh checks run every signal in parallel — under 1.5s at the p95.
3. **Private by default.** Signup data is never sold or shared. Scores are cached, identities are not. EU data residency available on Pro.

## How it works

1. **Send the signup.** POST the email and IP to `/v1/verify` the moment a user submits your signup form. Bearer-token auth, no SDK required.
2. **Get a score in <1.5s.** Vouchley checks email validity, domain reputation, IP risk, VPN/Tor presence, and bot patterns in parallel. You get a 0–100 trust score plus a plain-English reasoning string.
3. **Decide the next step.** Use the recommendation — approve, review, or block — to gate account creation, trigger email verification, or silently drop the bad ones.

## What Vouchley detects

- **Disposable & temporary emails.** Mailinator, 10MinuteMail, Guerrilla Mail, and 2,000+ throwaway providers — caught at the syntax + MX layer.
- **VPN, proxy & Tor exits.** Live IP reputation feeds flag VPNs, residential proxies, and Tor exit nodes used to mask abusive signups.
- **Datacenter & hosting IPs.** Signups from AWS, GCP, Hetzner, OVH, and other ASNs that legitimate consumers almost never use.
- **AI-driven bot signups.** Catches the new wave of agentic bots that mimic human typing patterns and pass legacy CAPTCHA challenges.
- **New & suspicious domains.** Flags shell domains registered in the last 30 days, dead MX records, and domains without a live website.
- **Gmail alias & role-based tricks.** Normalises `+tags` and dots in Gmail addresses; flags `info@`, `admin@`, and `sales@` addresses that rarely belong to one real user.

## How Vouchley compares

| Service | Checks per call | 10K verifications | Credits expire? |
| --- | --- | --- | --- |
| **Vouchley** | Email + IP + VPN + domain + bot | **$99** | **Never** |
| Kickbox | Email only | ~$100 PAYG | Never |
| ZeroBounce | Email + AI scoring | ~$100 PAYG | Subscription tiers expire |
| NeverBounce | Email only | ~$80 PAYG | 12 months |
| DeBounce | Email only | ~$20 PAYG | Never |
| Sift | Full fraud platform | Enterprise quote | Annual contract |

Pricing verified from vendor public pricing pages on 2026-04-28. Vouchley is not the cheapest per check — email-only validators like DeBounce undercut us. The Vouchley win is multi-signal coverage in one call.

## Frequently asked questions

### What is Vouchley?
Vouchley is a real-time signup verification API for SaaS companies. You send an email and an IP address, and Vouchley returns a 0–100 trust score with a recommendation — approve, review, or block — in under 1.5 seconds.

### How is this different from email validation?
Email validation only checks whether an inbox exists. Vouchley combines email checks with IP reputation, VPN/Tor detection, domain age, and behavioural signals to score the entire signup, not just the address. You get a single decision instead of a pile of raw signals.

### What does Vouchley actually detect?
Disposable emails, VPN/proxy/Tor traffic, datacenter IPs (AWS, GCP, Hetzner), AI-driven bot signups, brand-new shell domains, Gmail alias tricks, and role-based addresses. Each call returns a breakdown so you can see exactly which signals fired.

### How fast is the API?
Cache hits return in under 100 ms. Fresh checks run every signal in parallel and complete in under 1.5 seconds at the p95. Latency is measured continuously and published in your dashboard.

### How much does it cost?
Pay-as-you-go credit packs starting at $29 for 3,000 verifications. New accounts get 100 free credits — no card required. Credits never expire.

### Do you store user data?
IPs are hashed and only what's needed to compute the score and let you audit the call later is stored. Signup data is never sold, shared, or used to train models. EU data residency is available on the Pro plan.

### Can I integrate without writing custom code?
Yes — Vouchley is a single HTTP endpoint that any language can call. Most teams ship the integration in under 30 minutes. The docs include drop-in examples for Node, Python, Go, Ruby, and PHP.

## Who builds Vouchley

Built and maintained by Rohit, a solo founder shipping from India. No fundraising, no growth team, no upsell calls — just an API designed to be cheap, fast, and easy to drop into your signup flow. Feedback and feature requests go directly to the founder.

## Get started

- [Sign up for 100 free credits](https://vouchley.getrevlio.com/signup) — no card required
- [Read the docs](https://vouchley.getrevlio.com/docs) — quickstart in under 5 minutes
- [See pricing](https://vouchley.getrevlio.com/pricing) — credit packs from $29
- [Compare alternatives](https://vouchley.getrevlio.com/vs/kickbox) — honest side-by-side with Kickbox, ZeroBounce, Sift
