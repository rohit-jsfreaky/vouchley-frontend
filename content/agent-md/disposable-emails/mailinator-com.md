# mailinator.com — Mailinator

> Mailinator is one of the oldest and most widely used disposable email services. Anyone can read mail sent to any Mailinator address by simply visiting the public inbox at mailinator.com — no signup, no password, no privacy.

**Domain:** `mailinator.com`
**Service:** Mailinator
**Type:** Disposable / throwaway
**Launched:** 2003
**Block at signup:** Yes
**Canonical URL:** https://vouchley.getrevlio.com/disposable-emails/mailinator-com

---

## About the service

Mailinator is one of the oldest and most widely used disposable email services. Anyone can read mail sent to any Mailinator address by simply visiting the public inbox at mailinator.com — no signup, no password, no privacy.

## Typical use

Throwaway accounts on signup forms, one-time email confirmations the user never wants to access again, or testing email flows during development.

## Why block at signup

A user signing up with a Mailinator address has no intention of receiving ongoing communication. Block at the signup layer to protect deliverability and prevent free-tier abuse.

## Aliases

Mailinator also operates these alias domains. Block them all:

- `binkmail.com`
- `bobmail.info`
- `chammy.info`
- `mailtothis.com`

## How Vouchley detects it

Every Vouchley `/v1/verify` call returns a `disposable: true` flag on Mailinator addresses, plus all known alias domains. Cache hits return in under 100ms.

```bash
curl -X POST https://api.vouchley.getrevlio.com/v1/verify \
  -H "Authorization: Bearer $VOUCHLEY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@mailinator.com"}'
```

Sample response:

```json
{
  "score": 8,
  "recommendation": "block",
  "email": { "disposable": true, "free_provider": false, "valid": true },
  "flags": ["disposable_email"],
  "reasoning": "Disposable email provider (Mailinator)."
}
```

## Related disposable services

- [10minutemail.com](https://vouchley.getrevlio.com/disposable-emails/10minutemail-com)
- [guerrillamail.com](https://vouchley.getrevlio.com/disposable-emails/guerrillamail-com)
- [yopmail.com](https://vouchley.getrevlio.com/disposable-emails/yopmail-com)
- [maildrop.cc](https://vouchley.getrevlio.com/disposable-emails/maildrop-cc)

[Back to disposable email index →](https://vouchley.getrevlio.com/disposable-emails)
