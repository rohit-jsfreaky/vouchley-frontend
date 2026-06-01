# POST /v1/verify — Vouchley API Reference

> Run a single email verification. Returns a score, recommendation, and signal breakdown.

**Canonical URL:** https://vouchley.getrevlio.com/docs/api/verify
**Endpoint:** `POST https://api.vouchley.getrevlio.com/v1/verify`

---

## Request

`POST /v1/verify`

Requires `Authorization: Bearer vch_...` header. Each non-cached call deducts 1 credit.

### Request body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `email` | string | Yes | Email address to verify. |
| `name` | string | No | Full name of the person. Improves person-match signals. |
| `company_name` | string | No | Company name. Enables domain age and company signals. |
| `ip_address` | string | No | Source IP (v4 or v6). Enables VPN/Tor/geo signals. |

### Headers

| Header | Value |
| --- | --- |
| `Authorization` | `Bearer vch_live_...` or `Bearer vch_test_...` |
| `Content-Type` | `application/json` |

## Response

Returns `200 OK` with the verification result.

| Field | Type | Description |
| --- | --- | --- |
| `request_id` | string | Unique ID for this check (e.g. `req_8f3a0c921b...`). |
| `score` | integer (0–100) | Trust score. Higher is better. |
| `recommendation` | string | One of `approve`, `review`, or `block`. |
| `email` | object | Email signal breakdown. |
| `company` | object | Company / domain signals. |
| `person` | object | Person-match signals. |
| `ip` | object | IP reputation signals. |
| `flags` | string[] | Risk flags (if any). |
| `reasoning` | string | Human-readable explanation of the score. |
| `cached` | boolean | Whether this was served from cache. |
| `processed_in_ms` | integer | Processing time in milliseconds. |

## Signal objects

### `email` object

| Field | Type |
| --- | --- |
| `valid` | boolean |
| `disposable` | boolean |
| `free_provider` | boolean |
| `role_based` | boolean |
| `mx_record` | boolean |

### `company` object

| Field | Type |
| --- | --- |
| `domain` | string |
| `domain_alive` | boolean |
| `domain_age_days` | integer |
| `has_website` | boolean |
| `industry_guess` | string |
| `size_estimate` | string |

### `person` object

| Field | Type |
| --- | --- |
| `name_matches_email` | boolean |
| `likely_at_company` | boolean |
| `confidence` | float (0–1) |

### `ip` object

| Field | Type |
| --- | --- |
| `country` | string |
| `is_vpn` | boolean |
| `is_tor` | boolean |
| `risk_score` | integer (0–100) |

## Example

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

### Sample response

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

> **402 on zero balance.** If your credit balance is zero, this endpoint returns `402 Payment Required` instead of running the check.

[Next: POST /v1/verify/bulk →](https://vouchley.getrevlio.com/docs/api/verify-bulk)
