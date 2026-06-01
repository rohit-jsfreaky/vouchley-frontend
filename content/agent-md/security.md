# Security Overview — Vouchley

> How we secure your data and API keys, and how to disclose a vulnerability to us.

**Document ID:** SEC-2026-04
**Effective:** April 19, 2026
**Last updated:** April 19, 2026
**Canonical URL:** https://vouchley.getrevlio.com/security

---

We run Vouchley as a small, focused operation. Our approach to security is to rely on proven primitives, minimise attack surface, and be honest about what we have and haven't implemented yet.

## Data in transit

All traffic to `vouchley.getrevlio.com` and `api.vouchley.getrevlio.com` is served over TLS 1.2+ with modern cipher suites. HTTP is redirected to HTTPS, and HSTS is enabled. Our reverse proxy automatically provisions and renews certificates from Let's Encrypt.

## Data at rest

The Postgres database and Redis cache live on our VPS, which runs full-disk encryption provided by the hosting layer. Database backups are encrypted before upload to object storage.

## API key handling

API keys are shown to you exactly once at creation. On our side we store only a SHA-256 hash of the key; the plaintext is never written to disk. A leaked key can be revoked immediately from the dashboard — revocation takes effect on the next request.

## Session management

Dashboard sessions are managed by better-auth. Session cookies are HTTP-only, `Secure` in production, and `SameSite=Lax`. Signing in with Google uses OAuth 2.0; we never see your Google password. Email-and-password sign-ups require email verification before the account can make API calls.

## Infrastructure

Vouchley runs on a self-managed VPS fronted by Cloudflare for edge protection. Application deployments are managed by Coolify, which runs each service in an isolated container with least-privilege access to the database. Secrets live in environment variables, not in the repository.

## Access controls

Production access is limited to the founder. SSH uses key-based authentication only (no passwords). Database access from outside the VPS is blocked at the firewall level. Logs and observability are piped to Sentry (errors) and PostHog (analytics) with PII scrubbing.

## Responsible disclosure

If you believe you've found a security vulnerability, please email `security@getrevlio.com` with details. We'll acknowledge within two business days, keep you updated as we investigate, and credit you in the release notes once the issue is fixed (unless you prefer to stay anonymous). Please don't publicly disclose until we've had a chance to patch.

## What we don't have yet

Honesty matters. Vouchley is **not**:

- SOC 2 certified
- HIPAA compliant
- ISO 27001 audited
- Capable of SSO (SAML)
- Available with custom data-residency agreements

If your organisation needs any of these before adopting a vendor, we're probably not the right fit yet — and we'll tell you that honestly. These items are on the roadmap for when we scale past the founder phase.
