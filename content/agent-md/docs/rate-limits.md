# Rate Limits — Vouchley Docs

> Vouchley applies per-key rate limits to protect the service and ensure fair usage across all customers.

**Canonical URL:** https://vouchley.getrevlio.com/docs/rate-limits

---

## Rate limits by plan

Limits are enforced **per API key, per minute**. The tier is determined by your current credit balance:

| Tier | Requests / minute | Condition |
| --- | --- | --- |
| Free | 100 | Credit balance ≤ 100 |
| Paid | 600 | Credit balance > 100 |

## How it works

Vouchley uses a fixed-window rate limiter. Each API key gets a per-minute counter that resets at the start of every calendar minute. If you exceed the limit, subsequent requests in that window receive a `429 Too Many Requests` response.

> **Limits are per key, not per account.** If you have multiple API keys, each key has its own independent rate limit counter. You can distribute load across keys if needed.

## Handling 429 responses

When you receive a `429` response, back off and retry after a short delay. The simplest strategy is exponential backoff:

- Wait 1 second, then retry.
- If still 429, wait 2 seconds, then retry.
- Continue doubling up to a maximum of 30 seconds.

The `429` response body contains:

```json
{ "detail": "Rate limit exceeded. Slow down and try again." }
```

## Reference implementation (Node)

```typescript
async function verifyWithRetry(payload, attempt = 0) {
  const resp = await fetch("https://api.vouchley.getrevlio.com/v1/verify", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.VOUCHLEY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (resp.status === 429 && attempt < 5) {
    const delay = Math.min(1000 * 2 ** attempt, 30_000);
    await new Promise((r) => setTimeout(r, delay));
    return verifyWithRetry(payload, attempt + 1);
  }

  return resp.json();
}
```

## Tips for staying under limits

- **Use caching wisely.** Vouchley already caches results for 30 days. Don't pre-warm caches with synthetic checks — it just consumes credits.
- **Batch with `/v1/verify/bulk`.** For known lists of >100 emails, the bulk endpoint is more efficient than parallel single calls.
- **Spread retries.** Use jitter on the exponential backoff (`delay * (1 + Math.random())`) to avoid thundering-herd retries when the limit clears.

## Custom limits

If you need a higher ceiling for genuinely high-volume traffic (10,000+ requests/minute), email `hello@getrevlio.com`. Custom rate limit agreements are available on the Pro and Scale plans.

[Next: Error Handling →](https://vouchley.getrevlio.com/docs/errors)
