# Quickstart — Vouchley Docs

> Get your first Vouchley verification response in under five minutes. One API key, one POST request.

**Canonical URL:** https://vouchley.getrevlio.com/docs
**API base URL:** https://api.vouchley.getrevlio.com

---

## 1. Create an API key

Sign in to the dashboard, open **API Keys**, and click **Create new key**. Keys are prefixed with:

- `vch_live_` for production
- `vch_test_` for sandbox

You will see the full key **exactly once** — copy it into your server-side environment immediately.

```bash
# .env
export VOUCHLEY_API_KEY=vch_live_abc123...
```

## 2. Make your first request

Every verification is a single `POST /v1/verify` call. Pass the email you want to score — and optionally the signer name, company name, and source IP for richer signals.

```bash
curl -X POST https://api.vouchley.getrevlio.com/v1/verify \
  -H "Authorization: Bearer $VOUCHLEY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@acme.com",
    "name": "John Doe",
    "company_name": "Acme Inc.",
    "ip_address": "203.0.113.42"
  }'
```

## 3. Understand the response

Vouchley responds with a score (0–100), a plain-English `recommendation` — `approve`, `review`, or `block` — plus the raw signal breakdown your team can audit.

```json
{
  "request_id": "req_8f3a0c921b",
  "score": 82,
  "recommendation": "approve",
  "email": {
    "valid": true,
    "disposable": false,
    "free_provider": false,
    "role_based": false,
    "mx_record": true
  },
  "company": {
    "domain": "acme.com",
    "domain_alive": true,
    "domain_age_days": 2847,
    "has_website": true
  },
  "person": {
    "name_matches_email": true,
    "confidence": 0.82
  },
  "ip": {
    "country": "IN",
    "is_vpn": false,
    "is_tor": false,
    "risk_score": 12
  },
  "flags": [],
  "reasoning": "Valid corporate email at a 7-year-old company domain. IP clean.",
  "cached": false,
  "processed_in_ms": 847
}
```

> **Cache hits are free.** The same email + IP combination checked within 30 days returns the cached response and charges zero credits. Repeated sign-up attempts from the same visitor do not drain your balance.

## 4. Wire it into your signup flow

Call Vouchley inside your signup handler, then branch on `recommendation`. A common pattern: auto-approve on `approve`, queue for manual review on `review`, reject outright on `block`.

```typescript
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

  if (recommendation === "block") throw new Error("Signup rejected");
  if (recommendation === "review") await flagForManualReview(signup);

  return await db.users.insert({ ...signup, trust_score: score });
}
```

## Next steps

- [Authentication](https://vouchley.getrevlio.com/docs/authentication) — rotate keys safely, test vs live keys
- [Caching & Credits](https://vouchley.getrevlio.com/docs/caching-credits) — how billing works
- [Rate Limits](https://vouchley.getrevlio.com/docs/rate-limits) — per-key limits and 429 handling
- [Error Handling](https://vouchley.getrevlio.com/docs/errors) — every status code and what to do
- [API Reference: POST /v1/verify](https://vouchley.getrevlio.com/docs/api/verify) — full request/response shape
- [API Reference: Bulk verification](https://vouchley.getrevlio.com/docs/api/verify-bulk) — process up to 1,000 emails per job
