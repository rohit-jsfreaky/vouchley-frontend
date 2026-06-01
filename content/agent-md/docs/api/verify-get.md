# GET /v1/verify/:id — Vouchley API Reference

> Retrieve a previously completed verification check by its request ID.

**Canonical URL:** https://vouchley.getrevlio.com/docs/api/verify-get
**Endpoint:** `GET https://api.vouchley.getrevlio.com/v1/verify/:request_id`

---

## Request

`GET /v1/verify/:request_id`

Requires `Authorization: Bearer vch_...` header. Only checks belonging to the authenticated account are returned.

Returns `404 Not Found` if the check does not exist or belongs to a different account.

## Response

The response body is the same shape as the original `POST /v1/verify` response, plus a `created_at` timestamp.

| Field | Type | Description |
| --- | --- | --- |
| `request_id` | string | The check ID. |
| `score` | integer | Trust score (0–100). |
| `recommendation` | string | `approve`, `review`, or `block`. |
| `cached` | boolean | Whether the original was cached. |
| `processed_in_ms` | integer | Original processing time. |
| `created_at` | string (ISO 8601) | When the check was created. |

Plus all signal objects (`email`, `company`, `person`, `ip`, `flags`, `reasoning`).

## Example

```bash
curl https://api.vouchley.getrevlio.com/v1/verify/req_8f3a0c921b \
  -H "Authorization: Bearer $VOUCHLEY_API_KEY"
```

## Use cases

- **Audit logging.** Pull the original verification result months after the signup happened.
- **Decision review.** When a customer disputes being blocked, look up the request ID from your logs and see exactly which signals fired.
- **Webhook re-fetching.** If you fire-and-forget the original verify call and pick up the result asynchronously, this endpoint is how you retrieve it.

## Limits

The `created_at` timestamp is permanent, but there is no separate retrieval rate limit beyond the standard per-key rate limit. This endpoint does NOT deduct credits — it only reads previously paid-for results.

[Next: GET /v1/usage →](https://vouchley.getrevlio.com/docs/api/usage)
