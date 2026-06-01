# 10minutemail.com — 10MinuteMail

> 10MinuteMail issues a temporary email address that self-destructs after ten minutes. The inbox is browser-anonymous: anyone visiting the page gets a fresh address, and the address disappears when the timer runs out.

**Domain:** `10minutemail.com`
**Service:** 10MinuteMail
**Type:** Disposable / throwaway
**Launched:** 2007
**Block at signup:** Yes
**Canonical URL:** https://vouchley.getrevlio.com/disposable-emails/10minutemail-com

---

## About the service

10MinuteMail issues a temporary email address that self-destructs after ten minutes. The inbox is browser-anonymous: anyone visiting the page gets a fresh address, and the address disappears when the timer runs out.

## Typical use

Quick, single-use email confirmations where the user wants to avoid spam follow-up. Common on signup forms requiring email verification before granting access.

## Why block at signup

Any signup with a 10MinuteMail address will fail to be reachable within minutes. The user has explicitly opted out of any follow-up — there is no value in onboarding them.

## Aliases

- `10minutemail.net`
- `10minutemail.org`

## How Vouchley detects it

```bash
curl -X POST https://api.vouchley.getrevlio.com/v1/verify \
  -H "Authorization: Bearer $VOUCHLEY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@10minutemail.com"}'
```

The response includes `disposable: true` and a `block` recommendation.

## Related disposable services

- [mailinator.com](https://vouchley.getrevlio.com/disposable-emails/mailinator-com)
- [guerrillamail.com](https://vouchley.getrevlio.com/disposable-emails/guerrillamail-com)
- [tempmail.org](https://vouchley.getrevlio.com/disposable-emails/tempmail-org)
- [throwawaymail.com](https://vouchley.getrevlio.com/disposable-emails/throwawaymail-com)

[Back to disposable email index →](https://vouchley.getrevlio.com/disposable-emails)
