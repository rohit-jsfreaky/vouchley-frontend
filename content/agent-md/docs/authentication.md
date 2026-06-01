# Authentication — Vouchley Docs

> Every request to the Vouchley API must carry a Bearer token. Keys are scoped to your account and live in two environments — test and live — so you can develop safely without touching real credit balances.

**Canonical URL:** https://vouchley.getrevlio.com/docs/authentication

---

## Generating API keys

Open the [API Keys](https://vouchley.getrevlio.com/dashboard/keys) page in your dashboard and click **Create new key**. Pick a label (visible only to you) and an environment. The plaintext key is shown **exactly once** — copy it into your server-side secrets manager before closing the modal.

```bash
curl -X POST https://api.vouchley.getrevlio.com/v1/verify \
  -H "Authorization: Bearer vch_live_abc123def456..." \
  -H "Content-Type: application/json" \
  -d '{"email": "john@acme.com"}'
```

## Key types

Vouchley provides two environments to support your development lifecycle. Always use test keys during development. Test requests do not deduct from your credit balance and do not surface in production analytics.

### Test keys — `vch_test_`
- Used for development and staging
- Isolated from live data
- Zero credit cost on every call
- Marked **Safe**

### Live keys — `vch_live_`
- Used for production
- Every call deducts 1 credit from your balance (cache hits are free)
- Marked **Sensitive**

## Rotating keys

Revoke a key from the dashboard to take it offline immediately. Past requests stay logged but any new call with that key returns `401 Unauthorized`.

**Best practice for zero-downtime rotation:**

1. Generate the new key.
2. Deploy it everywhere that needs it.
3. Verify traffic is flowing on the new key in your dashboard.
4. Revoke the old one.

## Security best practices

> **Never expose live keys in the browser.** API keys belong in server-side environment variables only. A key committed to a public repo or shipped in a client bundle is effectively leaked — rotate it immediately from the dashboard.

- Keep one key per deployment environment (staging, production).
- Rotate keys at least quarterly, and immediately on any suspected leak.
- Use environment-specific labels so the dashboard stays scannable.
- Store keys in your platform's secrets manager (AWS Secrets Manager, Doppler, Vercel env vars, GitHub Actions secrets) — never in source control.

## What's stored server-side

Vouchley stores only a SHA-256 hash of each key. The plaintext is never written to disk after the initial creation modal. If you lose a plaintext key, you must generate a new one — there is no recovery flow.

[Next: Caching & Credits →](https://vouchley.getrevlio.com/docs/caching-credits)
