# Error Handling — Vouchley Docs

> Every Vouchley API error returns a consistent JSON body with an HTTP status code you can branch on.

**Canonical URL:** https://vouchley.getrevlio.com/docs/errors

---

## Error format

All error responses have the same shape — a JSON object with a `detail` field containing a human-readable message:

```json
{
  "detail": "Insufficient credits. Subscribe to a plan to continue."
}
```

## Status codes

| Code | Meaning | What to do |
| --- | --- | --- |
| `200` | Success | Process the response normally. |
| `202` | Accepted (bulk only) | Job queued. Poll `GET /v1/jobs/:id` for results. |
| `400` | Bad request | Check your request body — missing or invalid fields. |
| `401` | Unauthorized | API key is missing, invalid, or revoked. |
| `402` | Payment required | Credit balance is zero. Purchase a plan. |
| `404` | Not found | The requested resource (check, job) doesn't exist. |
| `422` | Validation error | Request body failed schema validation (e.g. invalid email format). |
| `429` | Rate limited | Back off and retry. See [Rate Limits](https://vouchley.getrevlio.com/docs/rate-limits). |
| `500` | Server error | Retry with backoff. If persistent, contact support. |

## Common errors

### Missing Authorization header

Every request must include `Authorization: Bearer vch_...`. Double-check your key is set in the environment.

### Invalid API key

The key may have been revoked. Check the [API Keys](https://vouchley.getrevlio.com/dashboard/keys) page in your dashboard.

### Insufficient credits

Your balance is zero. Subscribe to a plan or wait for your next billing cycle if you already have an active subscription.

### Validation error (422)

The request body failed schema validation. Common causes:

- `email` missing or not a string
- `email` doesn't match the `local@domain.tld` shape
- `ip_address` is not a valid v4 or v6 address
- Bulk: `items` is empty or has more than 1,000 entries

The response body will include a `detail` array with field-level errors.

## Reference: handling all error cases

```typescript
async function verifySignup(payload) {
  const resp = await fetch("https://api.vouchley.getrevlio.com/v1/verify", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.VOUCHLEY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (resp.ok) return resp.json();

  switch (resp.status) {
    case 401:
      throw new Error("Vouchley API key invalid or revoked. Rotate the key.");
    case 402:
      // Don't block the user on a billing problem — log and let them through.
      logCriticalAlert("Vouchley balance hit zero");
      return { recommendation: "approve", score: null };
    case 429:
      // See rate-limit docs for the retry-with-jitter pattern.
      await sleep(1000);
      return verifySignup(payload);
    case 422: {
      const { detail } = await resp.json();
      throw new Error(`Validation error: ${JSON.stringify(detail)}`);
    }
    default:
      throw new Error(`Vouchley returned ${resp.status}`);
  }
}
```

[Back to Quickstart →](https://vouchley.getrevlio.com/docs)
