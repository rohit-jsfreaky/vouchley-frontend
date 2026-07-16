# Free Disposable Email Checker

> Free tool to check if an email is disposable, temporary, or fake. Detects throwaway addresses (Mailinator, temp-mail, and thousands more) and verifies the domain's mail server. No signup.

**Canonical URL:** https://vouchley.getrevlio.com/tools/disposable-email-checker
**Type:** Free web tool
**Cost:** Free, no signup

---

## What it does

Paste an email address and the checker tells you:

- **Disposable / throwaway** — is the domain a known temporary email provider (matched against Vouchley's published list of thousands of disposable domains and their aliases)?
- **Mail server (MX)** — does the domain have valid MX records, i.e. can it actually receive mail? No MX means the address is undeliverable.
- **Role-based** — is it a `info@`, `admin@`, `support@`-style address that rarely belongs to one real person?
- **Free provider** — is it Gmail, Outlook, or another legitimate free provider (not blocked, but worth scoring tighter)?

It returns a plain verdict — approve, review, or block — with the reason.

## What it does NOT do

This free tool covers the email and its domain only. It does not open an SMTP connection to confirm the specific mailbox exists, and it does not check the IP, VPN/proxy, or bot signals behind a signup. Those require the full [Vouchley API](https://vouchley.getrevlio.com/docs/api/verify).

## How to block disposable emails on your own signup form

Call a verification API at signup and reject addresses flagged as disposable. The Vouchley `/v1/verify` endpoint runs the disposable check plus IP reputation, VPN/proxy/Tor, datacenter detection, domain age, and bot signals in one call, returning a 0–100 score and an approve/review/block recommendation. Pricing starts at $19/month for 15,000 checks, with 100 free credits to start.

## FAQ

### Is this disposable email checker free?
Yes, completely free with no signup.

### How does it detect disposable emails?
It matches the email's domain against Vouchley's published list of thousands of known disposable and temporary email providers (Mailinator, 10MinuteMail, Guerrilla Mail, temp-mail, and more, including alias domains), then does a live MX-record lookup.

### Can I check if an email is fake or temporary?
Yes — temporary and throwaway addresses are exactly what this tool flags.

### Does it verify the mailbox exists?
It verifies the domain has valid MX records, but does not open an SMTP connection to confirm the specific mailbox — that requires the full Vouchley API.

## Related

- [Disposable email domain database](https://vouchley.getrevlio.com/disposable-emails)
- [How to prevent fake signups](https://vouchley.getrevlio.com/blog/prevent-fake-signups-2026)
- [Disposable email detection guide](https://vouchley.getrevlio.com/blog/disposable-email-detection-guide)
- [Try the full API free →](https://vouchley.getrevlio.com/signup)
