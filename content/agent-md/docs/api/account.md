# GET /v1/account — Vouchley API Reference

> Retrieve your account profile, credit balance, and active subscription info.

**Canonical URL:** https://vouchley.getrevlio.com/docs/api/account
**Endpoint:** `GET https://api.vouchley.getrevlio.com/v1/account`

---

## Request

`GET /v1/account`

Requires `Authorization: Bearer vch_...` header. No request body or query parameters.

## Response

| Field | Type | Description |
| --- | --- | --- |
| `user_id` | string | Your account ID. |
| `email` | string | Account email. |
| `name` | string \| null | Account display name. |
| `created_at` | string (ISO 8601) | When the account was created. |
| `credits_balance` | integer | Current credit balance. |
| `api_key` | object | `id` and `environment` of the key used to authenticate this request. |
| `subscription` | object \| null | Active subscription details (`id`, `plan`, `status`, `current_period_end`), or null if no active plan. |

## Example

```bash
curl https://api.vouchley.getrevlio.com/v1/account \
  -H "Authorization: Bearer $VOUCHLEY_API_KEY"
```

### Sample response

```json
{
  "user_id": "usr_abc123",
  "email": "dev@acme.com",
  "name": "Alice Smith",
  "created_at": "2026-03-15T10:00:00+00:00",
  "credits_balance": 2065,
  "api_key": {
    "id": "key_xyz789",
    "environment": "live"
  },
  "subscription": {
    "id": "sub_def456",
    "plan": "pro",
    "status": "active",
    "current_period_end": "2026-05-15T00:00:00+00:00"
  }
}
```

## Use cases

- **Sanity check on integration.** Verify your API key is wired up correctly before running real verifications.
- **Sync billing state.** Mirror Vouchley's subscription state into your own admin UI.
- **Identify the key in use.** When you have multiple keys (staging, production), `api_key.environment` confirms which one is making the call.

## Privacy

The data returned is scoped to the account that owns the API key. You cannot enumerate other accounts via this endpoint.

[Back to Quickstart →](https://vouchley.getrevlio.com/docs)
