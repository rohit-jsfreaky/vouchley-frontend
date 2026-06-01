# GET /v1/usage — Vouchley API Reference

> Retrieve your current-month usage statistics and credit balance.

**Canonical URL:** https://vouchley.getrevlio.com/docs/api/usage
**Endpoint:** `GET https://api.vouchley.getrevlio.com/v1/usage`

---

## Request

`GET /v1/usage`

Requires `Authorization: Bearer vch_...` header. No request body or query parameters.

## Response

| Field | Type | Description |
| --- | --- | --- |
| `period` | object | `start` and `end` ISO timestamps for the current month. |
| `total_checks` | integer | Total checks this month. |
| `cached_checks` | integer | Checks served from cache (free). |
| `billable_checks` | integer | Checks that deducted credits. |
| `credits_used` | integer | Credits consumed this month. |
| `credits_balance` | integer | Current credit balance. |

## Example

```bash
curl https://api.vouchley.getrevlio.com/v1/usage \
  -H "Authorization: Bearer $VOUCHLEY_API_KEY"
```

### Sample response

```json
{
  "period": {
    "start": "2026-04-01T00:00:00+00:00",
    "end": "2026-04-20T14:30:00+00:00"
  },
  "total_checks": 1247,
  "cached_checks": 312,
  "billable_checks": 935,
  "credits_used": 935,
  "credits_balance": 2065
}
```

## Use cases

- **Internal dashboards.** Embed your Vouchley usage stats in your own ops dashboard.
- **Budget alerts.** Set up a daily cron that fetches `/v1/usage` and alerts when `credits_balance` drops below a threshold.
- **Cost attribution.** Use `billable_checks` to attribute Vouchley spend to the products or business units that ran the verifications.

## Frequency

This endpoint does NOT deduct credits and is not subject to the verify-endpoint rate limits. Standard per-key rate limits still apply (100/min on Free, 600/min on Paid).

[Next: GET /v1/account →](https://vouchley.getrevlio.com/docs/api/account)
