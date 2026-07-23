---
title: "VPN Detection API for SaaS: A 2026 Implementation Guide"
excerpt: "A VPN signup is not a fraud signal on its own — plenty of real, privacy-conscious users arrive over a VPN. Here's how to add a VPN detection API to your signup flow the right way: what it returns, VPN vs proxy vs datacenter vs Tor, scoring instead of blocking, and the false positives to plan for."
metaTitle: "VPN Detection API for SaaS (2026 Guide)"
metaDescription: "How to add a VPN detection API to SaaS signups in 2026 — response fields, VPN vs proxy vs datacenter vs Tor, scoring not blocking, and false positives to avoid."
date: "2026-07-23T11:00:00.000Z"
updatedAt: "2026-07-23T11:00:00.000Z"
category: "Engineering"
author: "Rohit Kashyap"
image: "/blog/vpn-proxy-detection.jpg"
tags: ["VPN detection", "IP intelligence", "API"]
keywords:
  - "VPN detection API"
  - "VPN detection API for SaaS"
  - "detect VPN signups"
  - "proxy detection API"
  - "IP reputation API"
  - "block VPN signups"
readingTime: 10
featured: false
faq:
  - question: "What is a VPN detection API?"
    answer: "A VPN detection API takes an IP address and returns whether it belongs to a commercial VPN, an anonymizing proxy, a Tor exit node, or a datacenter / hosting provider, usually with a risk score and the network's ASN and country. You call it at signup or login and use the signals to risk-tier the user rather than to hard-block them."
  - question: "Should I block all VPN signups?"
    answer: "No. Many legitimate, privacy-conscious users sign up over a VPN, and corporate networks route through VPNs by default. Blocking every VPN signup throws away real customers. The fraud signal is not VPN alone — it is VPN or datacenter IP combined with a brand-new email domain, a mismatched geolocation, and rapid consumption of expensive features. Score it; do not gate on it."
  - question: "What is the difference between VPN, proxy, datacenter, and Tor detection?"
    answer: "VPN means a commercial VPN service (NordVPN, Mullvad, etc.) — common and often benign. Proxy means an anonymizing or residential-proxy relay, more strongly associated with automated abuse. Datacenter / hosting means the IP belongs to AWS, GCP, Hetzner, and similar — a strong red flag for consumer signups since humans rarely browse from a server. Tor means the connection exited the Tor network — rare and high-risk for most SaaS. A good API returns all four as separate flags because they carry different weights."
  - question: "How accurate is VPN detection, and what are the false positives?"
    answer: "Commercial VPN and datacenter ranges are well-mapped and reliably detected. The hard cases are Apple iCloud Private Relay and corporate VPNs, which can look proxy-like but carry real users, and residential proxies, which are designed to look like home connections and are the genuine gap. That is exactly why you score rather than block — a false positive costs you a customer, so no single IP flag should reject a signup by itself."
  - question: "Can I build VPN detection myself instead of using an API?"
    answer: "Partly. You can block datacenter ASNs and Tor exit lists with public data. What is hard to maintain in-house is fresh commercial-VPN range mapping and IP reputation, both of which change hourly. Most teams build the cheap parts (datacenter ASN and Tor lists) and buy the parts that need constant data freshness."
howTo:
  name: "How to add VPN detection to your signup flow"
  description: "Risk-tier signups by IP intelligence without blocking legitimate VPN users."
  totalTime: "PT30M"
  steps:
    - name: "Capture the real client IP at signup"
      text: "Read the client IP server-side from your proxy headers (X-Forwarded-For, the leftmost trusted hop). Pass it to the verification call along with the email."
      url: "https://vouchley.getrevlio.com/docs/api/verify"
    - name: "Read the IP signals from the response"
      text: "The ip object returns is_vpn, is_proxy, is_tor, is_datacenter, country, asn, and risk_score. Treat is_tor and is_datacenter as strong negatives, is_proxy as a moderate negative, and is_vpn as a light one."
    - name: "Score, don't block"
      text: "Feed the IP signals into the combined recommendation instead of rejecting on is_vpn alone. Block only when several signals stack — for example a datacenter IP plus a brand-new email domain plus an immediate high-cost action."
    - name: "Add async enforcement for the gray zone"
      text: "For medium-risk signups, create the account in a limited state and lift the limits after the user verifies their email and shows stable, human behavior over the first 24–48 hours."
---

Here is the mistake most teams make the first time they add IP intelligence to a signup form: they detect VPN traffic, see that a chunk of it correlates with abuse, and start blocking every VPN signup. Two weeks later, support tickets pile up from real customers on Mullvad, corporate laptops behind a company VPN, and iPhone users with iCloud Private Relay turned on.

A VPN signup is not fraud. It is a *weak* signal that becomes strong only in combination. This guide is about adding a VPN detection API the right way — what it returns, the distinctions that actually matter, and how to score it without torching legitimate users. It is the API-integration companion to the conceptual [VPN and proxy detection guide](/blog/vpn-proxy-detection-signups); if you want the proxy-specific build, see [proxy detection for SaaS](/blog/proxy-detection-for-saas).

## What a VPN detection API returns

Give it an IP, get back a small object of network signals:

- **`is_vpn`** — commercial VPN service (NordVPN, Mullvad, Proton VPN, …). Common and often benign.
- **`is_proxy`** — anonymizing or residential-proxy relay. More strongly tied to automated abuse.
- **`is_tor`** — the connection exited the Tor network. Rare, and high-risk for most SaaS.
- **`is_datacenter`** — the IP belongs to AWS, GCP, Hetzner, DigitalOcean, and similar. A real person almost never browses from a server, so this is a strong red flag for consumer signups.
- **`country`, `asn`, `asn_org`** — geolocation and the owning network, for consistency checks.
- **`risk_score`** — a 0–100 roll-up of the above.

The reason these are separate flags instead of one "anonymous IP" boolean is that they carry very different weights. Tor and datacenter are loud; VPN is a whisper.

## VPN vs proxy vs datacenter vs Tor

The four get lumped together and they should not be:

| Signal | Who it usually is | Weight for consumer SaaS |
| --- | --- | --- |
| **VPN** | Privacy-conscious real users, remote workers | Light |
| **Proxy** | Scrapers, automation, residential-proxy abuse | Moderate |
| **Datacenter** | Scripts and bots (humans don't browse from servers) | Strong |
| **Tor** | Rare; privacy extremists and some abuse | Strong |

A developer-tools product will see more legitimate datacenter traffic than a consumer app; a fintech will weight Tor harder than a blog. The weights are yours to tune — but the four signals need to arrive separately for you to tune them at all.

## The one call

Capture the client IP server-side and pass it with the email:

```typescript
const resp = await fetch("https://api.vouchley.getrevlio.com/v1/verify", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.VOUCHLEY_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, ip_address: clientIp }),
});

const { score, recommendation, ip } = await resp.json();

// Strong negatives: stack them, don't gate on one
const highRiskIp = ip.is_tor || ip.is_datacenter;

if (recommendation === "block" || (highRiskIp && ip.risk_score > 80)) {
  return reject();
}
if (recommendation === "review" || ip.is_vpn || ip.is_proxy) {
  return createLimitedAccount({ email }); // verify + gate expensive features
}
return createAccount({ email, trustScore: score });
```

Getting the **real** client IP matters more than the API call. Behind a load balancer or CDN, read the leftmost trusted hop of `X-Forwarded-For` — not the socket address, which is your proxy, and not the rightmost value, which a client can spoof.

## Score, don't block

The single rule that keeps you out of trouble: **no individual IP flag should reject a signup by itself.**

The actual fraud fingerprint is a combination — a datacenter or flagged IP **plus** a brand-new email domain **plus** a geolocation that disagrees with the declared country **plus** an account that immediately reaches for an expensive feature. Any one of those is noise; together they are signal. That is why VPN detection belongs in a combined score, not a firewall rule.

For the gray zone — VPN or proxy but nothing else damning — the right move is async enforcement: create the account in a limited state, then lift the limits once the user verifies their email and behaves like a human for a day or two.

## Build vs buy

You can build the cheap half: block Tor exit lists and datacenter ASNs from public data. What is hard to run in-house is fresh commercial-VPN range mapping and IP reputation — both change hourly, and stale data means both false positives (blocking a moved-on IP) and false negatives (missing a new VPN range). Most teams build the datacenter/Tor lists and buy the parts that need constant freshness. If you are comparing vendors, the [IPQualityScore alternatives roundup](/blog/best-ipqualityscore-alternatives-2026) and the [Vouchley vs IPQualityScore](/vs/ipqualityscore) page lay out the trade-offs.

## The honest gap: residential proxies

VPN and datacenter ranges are well-mapped. Residential proxies — real home IPs rented out by the gigabyte — are designed to look exactly like legitimate consumer traffic, and no IP-only signal reliably catches them. This is the documented limit of IP intelligence, and it is why the combined score leans on email, domain-age, and behavioral signals too rather than IP alone.

## Wire it in

- **Full response shape:** the [`/v1/verify` docs](/docs/api/verify) show every `ip` field.
- **Why VPN/proxy matters at signup:** the [conceptual guide](/blog/vpn-proxy-detection-signups).
- **Proxy-specific build:** [proxy detection for SaaS](/blog/proxy-detection-for-saas).

Add the one call, read the four IP flags, and score instead of block. You get the fraud-fighting value of VPN detection without the support tickets that come from treating every privacy-conscious user like an attacker.

[Start free with 100 Vouchley credits →](/signup) — IP, email, and domain signals in one call.
