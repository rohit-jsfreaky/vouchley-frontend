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

Vouchley runs on monthly credit plans. Unused credits roll over and never expire.

- **Free** — $0 on signup, 100 credits
- **Starter** — $19/month, 15,000 credits ($0.00127/credit)
- **Pro** — $49/month, 50,000 credits ($0.00098/credit, save 23%)
- **Scale** — $99/month, 200,000 credits ($0.0005/credit, best rate)

New accounts start with 100 free credits to test the API. After these are used, subscribe to a plan from the [Billing](https://vouchley.getrevlio.com/dashboard/billing) page.

## Credit rollover

Unused credits roll over indefinitely. Each billing cycle adds your plan's credits to your existing balance. There is no expiration date on credits.

If you have 500 credits remaining when your Starter plan adds 15,000 credits, your new balance is 15,500. The credits are fungible — no FIFO or LIFO accounting.

[Next: Rate Limits →](https://vouchley.getrevlio.com/docs/rate-limits)
