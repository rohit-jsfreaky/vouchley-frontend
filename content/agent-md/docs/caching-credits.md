# Caching & Credits — Vouchley Docs

> Understand how Vouchley caches verification results and how credits are consumed.

**Canonical URL:** https://vouchley.getrevlio.com/docs/caching-credits

---

## How caching works

Every verification result is cached using a deterministic key derived from the combination of `email`, `ip_address`, `name`, and `company_name`. When the same combination is submitted again, Vouchley returns the cached result instantly.

Cached responses include `"cached": true` in the response body so your code can distinguish fresh runs from cached hits.

> **Cache hits are free.** Cached responses charge zero credits. This means repeated sign-up attempts from the same visitor do not drain your balance.

### Cache TTL

Verification results are cached for **30 days**. After 30 days, the next call with the same key combination triggers a fresh verification (and deducts 1 credit).

### Cache scope

Caches are **per-account**. Your verification results are not shared with other Vouchley customers, and you do not get cache hits from other customers' lookups.

## Credit deduction

Each non-cached verification deducts **1 credit** from your account balance. If your balance reaches zero, subsequent calls return `402 Payment Required` until you purchase more credits.

The `credits_charged` field in every response tells you exactly how many credits were consumed (0 for cache hits, 1 for fresh verifications).

## Plans & pricing

Vouchley sells one-time credit packs. Credits never expire.

- **Free** — $0 on signup, 100 credits
- **Starter** — $29 one-time, 3,000 credits ($0.0097/credit)
- **Pro** — $99 one-time, 12,000 credits ($0.00825/credit, 15% savings)
- **Scale** — $299 one-time, 40,000 credits ($0.00748/credit, best rate)

New accounts start with 100 free credits to test the API. After these are used, purchase a pack from the [Billing](https://vouchley.getrevlio.com/dashboard/billing) page.

## Credit rollover

Unused credits roll over indefinitely. Each pack purchase adds to your existing balance. There is no expiration date on credits.

If you have 500 credits remaining when you buy a 3,000-credit Starter pack, your new balance is 3,500. The credits are fungible — no FIFO or LIFO accounting.

## Auto-refill (Pro plan)

On the Pro plan, you can enable auto-refill at $89/month. When your balance drops below a threshold you configure, a fresh batch of credits is added automatically. Disable any time from Billing.

[Next: Rate Limits →](https://vouchley.getrevlio.com/docs/rate-limits)
