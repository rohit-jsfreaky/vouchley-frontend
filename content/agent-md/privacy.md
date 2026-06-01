# Privacy Policy — Vouchley

> What data Vouchley collects, why, who processes it, and how long we keep it.

**Document ID:** PRV-2026-04
**Effective:** April 19, 2026
**Last updated:** April 19, 2026
**Canonical URL:** https://vouchley.getrevlio.com/privacy

---

## Who we are

Vouchley is a signup-verification API operated by its founder, based in India. When this policy says "we" or "Vouchley," it refers to that business. To reach the data controller directly, email `privacy@getrevlio.com`.

## What we collect

We collect three distinct categories of data. Each one is kept only for the purposes described below.

### Account data

When you sign up we store your name, email address, and a securely hashed authentication credential. If you sign in with Google, we receive your name, email, and Google account identifier — we do not receive any other Google profile data.

### Verification request data

When you call `POST /v1/verify`, the fields you send us — typically an email address, optional name, optional company name, and optional IP address of the signup — are processed in real time and logged to your account. This is data about *your* signups, not about you. You are the controller for this data; we are a processor acting on your instructions.

### Billing data

Payments are processed by Dodo Payments, our Merchant of Record. Dodo stores your payment method; we only receive a customer identifier, the plan you purchased, the amount, and the invoice reference. We never see card numbers or bank details.

### Telemetry

We log request metadata — timestamp, endpoint, IP address, response code, and latency — to operate the service, detect abuse, and monitor uptime. If you opt into product analytics, interaction events (e.g., page views inside the dashboard) are sent to PostHog.

## How we use your data

We use the data above only for the following purposes:

- Authenticating you and authorising API calls made with your keys.
- Running the verification signals you requested (email checks, domain checks, IP reputation, LLM scoring) and returning the result.
- Tracking credit balance and billing.
- Detecting abuse and protecting other customers (rate limiting, fraud detection).
- Sending transactional email you expect — account verification, password resets, receipts, critical service notices.

We do **not** sell your data, use it to train public models, or share it with advertisers.

## Third-party processors

We use a small number of sub-processors to deliver the service. Each processes only what it needs and is bound by its own privacy terms.

- **Dodo Payments** — payments and tax compliance (Merchant of Record). Receives billing-only data.
- **OpenRouter** — LLM scoring. Receives the structured signal payload (booleans, counts, country codes). Does *not* receive the raw email address or name unless you explicitly include them in the fields we score.
- **IPQualityScore** — IP reputation. Receives the IP address only.
- **RDAP.org** — domain registration lookup. Receives the domain name only.
- **Resend** — transactional email delivery. Receives the recipient address and email body.
- **PostHog** — optional product analytics. Receives dashboard interaction events if enabled.
- **Cloudflare** — DDoS protection and CDN for the marketing site. Sees request metadata at the edge.
- **Our VPS provider** — hosts our Postgres database, Redis cache, and application servers.

## Data retention

- **Verification cache**: 30 days. Repeat requests in this window return the cached result at zero cost and are not re-processed by our sub-processors.
- **Check history** (your audit log): retained for the lifetime of your account so you can inspect past verifications from the dashboard. Deleted on account closure.
- **Credit ledger**: retained indefinitely as a financial record (tax and accounting obligations).
- **Bulk job state**: 7 days after the job completes.
- **Webhook events** (Dodo delivery audit): retained for the lifetime of your account for billing dispute resolution.
- **Archived accounts**: accounts with no login activity for 24 consecutive months may be archived. Archived data can be restored on request.

## Your rights

Regardless of where you live, you can exercise the following rights. Email `privacy@getrevlio.com` and we'll respond within 30 days.

- **Access**: a copy of what we hold about you.
- **Correction**: fix inaccuracies via the dashboard or by writing to us.
- **Deletion**: close your account and erase personal data (financial records we are required to keep are excepted).
- **Export**: your check history as JSON or CSV.
- **Objection / restriction**: pause specific processing activities where GDPR applies.

## International transfers

Our infrastructure currently runs on a VPS in the European region; we may move or add regions as we scale. Dodo Payments and OpenRouter process data in the United States. By using Vouchley, you acknowledge these transfers. Where the GDPR applies we rely on Standard Contractual Clauses with each sub-processor.

## Changes to this policy

We'll update the "Last Updated" date above whenever this policy changes. For material changes we'll email every account holder at least 14 days before the new policy takes effect.

## Contact

Questions about this policy go to `privacy@getrevlio.com`. Abuse or security reports go to `security@getrevlio.com`.
