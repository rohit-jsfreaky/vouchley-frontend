# POST /v1/verify/bulk — Vouchley API Reference

> Submit up to 1,000 emails for asynchronous batch verification. Results are available by polling the job status endpoint.

**Canonical URL:** https://vouchley.getrevlio.com/docs/api/verify-bulk
**Endpoint:** `POST https://api.vouchley.getrevlio.com/v1/verify/bulk`

---

## Overview

Bulk verification is a two-step process:

1. **Submit** — `POST /v1/verify/bulk` with an array of items. Returns immediately with a `job_id` and status `202 Accepted`.
2. **Poll** — `GET /v1/jobs/:job_id` until `status` is `completed` or `failed`. The response includes all individual results.

> **Credits are deducted per item.** Each item in the batch deducts 1 credit (cached hits are free, same as single verify). Your balance must be greater than zero to submit a bulk job.

## Submit a bulk job

`POST /v1/verify/bulk`

### Request body

| Field | Type | Description |
| --- | --- | --- |
| `items` | array (1–1000) | Array of verification objects. Each has the same shape as a single verify request: `email` (required), `name`, `company_name`, `ip_address` (all optional). |

### Response (202 Accepted)

| Field | Type | Description |
| --- | --- | --- |
| `job_id` | string | Unique job identifier. |
| `status` | string | Initially `queued`. |
| `total` | integer | Number of items submitted. |

## Poll for results

`GET /v1/jobs/:job_id`

Poll this endpoint to check progress. The job transitions through statuses:

```
queued → running → completed (or failed)
```

### Job status response

| Field | Type | Description |
| --- | --- | --- |
| `job_id` | string | Job identifier. |
| `status` | string | `queued`, `running`, `completed`, or `failed`. |
| `total` | integer | Total items in the batch. |
| `processed` | integer | Items processed so far. |
| `succeeded` | integer | Successfully verified items. |
| `failed` | integer | Items that failed verification. |
| `credits_used` | integer | Total credits consumed. |
| `items` | array | Individual results (same shape as single verify response). Populated when completed. |

## Full example

### 1. Submit the batch

```bash
curl -X POST https://api.vouchley.getrevlio.com/v1/verify/bulk \
  -H "Authorization: Bearer $VOUCHLEY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "email": "alice@acme.com", "name": "Alice Smith" },
      { "email": "bob@example.org" },
      { "email": "carol@startup.io", "ip_address": "198.51.100.7" }
    ]
  }'
```

Response:

```json
{
  "job_id": "job_a1b2c3d4e5f6",
  "status": "queued",
  "total": 3
}
```

### 2. Poll until complete

```bash
curl https://api.vouchley.getrevlio.com/v1/jobs/job_a1b2c3d4e5f6 \
  -H "Authorization: Bearer $VOUCHLEY_API_KEY"
```

> **Poll responsibly.** Poll every 2–5 seconds. Do not poll more than once per second — aggressive polling may trigger rate limits.

### 3. Read results

When `status` is `completed`, the response includes an `items` array with one result per submitted email, in the same order:

```json
{
  "job_id": "job_a1b2c3d4e5f6",
  "status": "completed",
  "total": 3,
  "processed": 3,
  "succeeded": 3,
  "failed": 0,
  "credits_used": 3,
  "items": [
    { "email": "alice@acme.com", "score": 88, "recommendation": "approve", "...": "..." },
    { "email": "bob@example.org", "score": 42, "recommendation": "review", "...": "..." },
    { "email": "carol@startup.io", "score": 73, "recommendation": "approve", "...": "..." }
  ]
}
```

[Next: GET /v1/verify/:id →](https://vouchley.getrevlio.com/docs/api/verify-get)
