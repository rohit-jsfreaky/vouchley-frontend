# Cookie Policy — Vouchley

> The small set of cookies Vouchley uses, why each one exists, and how to manage them.

**Document ID:** COK-2026-04
**Effective:** April 19, 2026
**Last updated:** April 19, 2026
**Canonical URL:** https://vouchley.getrevlio.com/cookies

---

## What are cookies

Cookies are small text files that a website stores in your browser. They let the site remember things about you between visits — in our case, mostly whether you're signed in.

## Cookies we use

Vouchley sets a deliberately small number of cookies.

### Session cookie — `better-auth.session_token`
Essential. Tells us you're signed in while you use the dashboard. Set as HTTP-only, `Secure`, and `SameSite=Lax`. Expires when you sign out or after 30 days of inactivity.

### CSRF token — `better-auth.csrf_token`
Essential. Protects form submissions in the dashboard from cross-site request forgery.

### OAuth state — `better-auth.state_*`
Essential, short-lived. Set during Google sign-in to verify the redirect is legitimate; removed as soon as sign-in completes.

None of these cookies are used for advertising or cross-site tracking.

## Third-party cookies

If you've opted into product analytics, PostHog sets a cookie to distinguish one browser session from another inside the dashboard. We do not embed any advertising trackers — no Google Analytics, no Facebook pixel, no TikTok pixel.

Cloudflare may set a lightweight bot-protection cookie at the edge. See [Cloudflare's cookie policy](https://www.cloudflare.com/cookie-policy/) for details.

## Managing cookies

Every browser lets you see and clear cookies in its settings. Blocking our essential cookies will break sign-in; blocking analytics cookies only affects the product-analytics feature.

Questions? Email `privacy@getrevlio.com`.
