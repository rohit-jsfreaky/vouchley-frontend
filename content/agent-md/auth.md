# Vouchley — Agent Authentication Guide

> Machine-readable registration and credential-acquisition instructions for AI agents that want to call the Vouchley API on behalf of a user.

**Spec:** [auth.md](https://github.com/workos/auth.md) by WorkOS
**Canonical URL:** https://vouchley.getrevlio.com/auth.md
**Last updated:** 2026-06-01

---

## Summary

Vouchley is a real-time signup verification API. Every request must carry a Bearer **API key**. There is no OAuth 2.0 authorization flow, no refresh-token rotation, and no token exchange. Keys are long-lived and minted by an authenticated human user from the Vouchley dashboard.

| Field | Value |
| --- | --- |
| `resource` | `https://api.vouchley.getrevlio.com` |
| `authorization_server` | `https://vouchley.getrevlio.com` |
| `credential_type` | `api_key` |
| `credential_format` | `Bearer vch_live_<32-char-hex>` for production, `vch_test_` for sandbox |
| `credential_lifetime` | Indefinite until revoked |
| `credential_transport` | `Authorization: Bearer <key>` HTTP header |
| `register_uri` | https://vouchley.getrevlio.com/signup |
| `claim_uri` | https://vouchley.getrevlio.com/dashboard/keys |
| `revocation_uri` | https://vouchley.getrevlio.com/dashboard/keys |
| `documentation` | https://vouchley.getrevlio.com/docs/authentication |
| `terms` | https://vouchley.getrevlio.com/terms |
| `privacy` | https://vouchley.getrevlio.com/privacy |

---

## How an agent obtains credentials

Vouchley does not currently support delegated agent registration via a programmatic flow (no `POST /agents/register` endpoint). To obtain credentials, an agent must coordinate with a human user who:

1. **Signs up** at https://vouchley.getrevlio.com/signup (email + password, or Google sign-in). New accounts receive 100 free credits — no card required.
2. **Generates an API key** at https://vouchley.getrevlio.com/dashboard/keys. The user picks a label and an environment (`live` or `test`). The plaintext key is shown exactly once.
3. **Hands the key to the agent** via a secure channel (the user's secrets manager, environment variable, or similar). The key is never exposed in the browser, never logged in URLs, and never committed to source control.

Agents that need fully programmatic registration should treat this as a known limitation and surface it to the human operator.

---

## Credential format

| Environment | Prefix | Example |
| --- | --- | --- |
| Production | `vch_live_` | `vch_live_a1b2c3d4e5f6...` |
| Sandbox / staging | `vch_test_` | `vch_test_x9y8z7w6v5u4...` |

Test keys are isolated from live data, do not deduct credits, and do not appear in production analytics. Use them for development and CI.

## Transport

```http
GET /v1/usage HTTP/1.1
Host: api.vouchley.getrevlio.com
Authorization: Bearer vch_live_a1b2c3d4e5f6...
Content-Type: application/json
```

The key MUST be sent in the `Authorization` header. Vouchley does NOT accept keys via query string, request body, or cookies.

---

## Scopes

Vouchley does not (yet) support fine-grained scopes per key. Every key has full account-level access to:

| Scope | Endpoints |
| --- | --- |
| `verify` | `POST /v1/verify`, `POST /v1/verify/bulk`, `GET /v1/verify/:id`, `GET /v1/jobs/:id` |
| `read` | `GET /v1/account`, `GET /v1/usage` |
| `write` | (reserved — no write endpoints yet) |

Per-scope keys are on the roadmap. Until then, treat every key as full-account.

---

## Rotation and revocation

- **Rotate:** generate a new key, deploy it, verify traffic, then revoke the old one — all from the dashboard.
- **Revoke:** any key can be revoked from https://vouchley.getrevlio.com/dashboard/keys. Revocation takes effect on the next request — past requests stay logged.
- **Compromised key:** revoke immediately. There is no quarantine or "suspended" state.

There is no programmatic key-rotation endpoint. All key management is dashboard-driven.

---

## Errors

| HTTP code | Meaning | What an agent should do |
| --- | --- | --- |
| `401 Unauthorized` | Key missing, malformed, or revoked | Stop. Surface to the human operator — the agent cannot self-recover. |
| `402 Payment Required` | Credit balance is zero | Stop. Operator must subscribe to a plan. |
| `429 Too Many Requests` | Rate limit hit | Back off with exponential delay (1s → 2s → 4s → ... → 30s) |
| `5xx` | Vouchley problem | Retry with backoff. If persistent, surface to operator. |

Full error contract: https://vouchley.getrevlio.com/docs/errors

---

## Security expectations from an agent

Agents calling Vouchley on behalf of a human user MUST:

- Treat the key as a secret. Never log it in URLs, never echo it to the user, never expose it to the model's chat surface.
- Store the key only in the secrets layer the operator provided (env var, secrets manager, OS keychain).
- Surface a clear error to the operator when the key is rejected — do not invent recovery flows.
- Honour rate-limit responses with backoff, not retry storms.
- Not share the key across unrelated agent sessions or users.

---

## Contact

- General support: `hello@getrevlio.com`
- Security disclosures: `security@getrevlio.com`
- Privacy / data requests: `privacy@getrevlio.com`

Vouchley is operated by Rohit, solo, from India. Replies typically arrive Monday–Friday during India working hours.

---

## Machine-readable companions

- RFC 8414 authorization server metadata: https://vouchley.getrevlio.com/.well-known/oauth-authorization-server
- RFC 9728 protected resource metadata: https://vouchley.getrevlio.com/.well-known/oauth-protected-resource
- RFC 9727 API catalog: https://vouchley.getrevlio.com/.well-known/api-catalog
- OpenAPI spec (live): https://api.vouchley.getrevlio.com/openapi.json
