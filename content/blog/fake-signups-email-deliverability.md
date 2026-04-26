---
title: "How Fake Signups Quietly Destroy Your Email Deliverability"
excerpt: "Fake signups don't just waste compute — they wreck your sender reputation. Here's how Gmail and Outlook decide whether your transactional email lands in the inbox or the spam folder, and how fake accounts move that needle in the wrong direction."
date: "2026-04-25T09:00:00.000Z"
category: "Engineering"
author: "Rohit"
image: "/blog/fake-signups-email-deliverability.jpg"
tags: ["email deliverability", "fake signups", "sender reputation"]
keywords:
  - "fake signups email deliverability"
  - "sender reputation SaaS"
  - "Gmail deliverability bot signups"
  - "email reputation drop"
  - "transactional email deliverability"
readingTime: 8
featured: false
---

Most SaaS founders track fake signups as an infrastructure cost — wasted compute, polluted analytics, more CSAT noise. That framing is true but incomplete. The biggest hidden cost of fake signups is a metric most teams don't watch until it cracks: **email deliverability**.

When your transactional emails — password resets, invoices, onboarding sequences — start landing in spam, the damage is delayed and self-reinforcing. By the time you notice, you've already lost weeks of conversion. This post breaks down exactly how fake signups poison sender reputation, what mailbox providers actually measure, and what to do before it becomes an outage.

## How mailbox providers think about you

Gmail, Outlook, Apple Mail, and Yahoo all run their own version of the same algorithm: estimate whether the recipient *wants* to see this email. If they do, deliver. If not, route to spam, hide entirely, or in the worst case bounce future mail from your domain.

The algorithm runs on a handful of signals. Most are aggregate signals over your sending domain (the `From:` and `Return-Path:` domain), which means every email you send affects every other email you send.

The signals that matter most:

- **Bounce rate** — how often your mail hits a non-existent inbox. A healthy SaaS sits under 2%. Above 5% triggers warnings.
- **Spam complaint rate** — how often recipients hit "Mark as Spam." Healthy is under 0.1%. Above 0.3% is dangerous.
- **Engagement** — opens, clicks, replies, "Move to Inbox" actions. Strong engagement is the single most positive signal.
- **Volume consistency** — providers prefer steady sending. Sudden spikes look like compromise.
- **Authentication** — SPF, DKIM, DMARC must all align. Misalignment alone can land you in spam.

Notice the first three. **Bounce rate, spam rate, and engagement.** Fake signups directly poison all three.

## How fake signups break each signal

### Bounce rate

When someone signs up with `asdf12345@nonexistentdomain.xyz` — and your service emails them an account verification — that email bounces. Hard bounces from non-existent inboxes count against your domain reputation immediately.

A SaaS that gets 1,000 fake signups per month, each triggering a verification email that bounces, is generating 1,000 negative deliverability events per month. If that's 5% of your total mail volume, your bounce rate just doubled — and you're now in the "we're watching you" zone with Gmail.

### Spam complaint rate

Fake signups also do something more subtle. Some attackers use real email addresses they don't own — typosquats, scraped addresses, or addresses they've harvested from breaches. Those people receive your unsolicited verification email and hit "Mark as Spam."

Even at low volume, this hurts. One spam complaint per thousand legitimate emails is roughly the threshold where Gmail starts deprioritizing. A few hundred fake signups a month using real-stranger addresses can push you over.

### Engagement

Fake accounts never open your emails. Your welcome sequence, onboarding tips, and re-engagement messages all sit unopened. From Gmail's perspective, this looks like you're sending to people who don't want your mail.

The compounding effect is brutal. Low engagement → reduced inbox placement → fewer real users see your mail → real-user engagement also drops because the absolute number of opens fell → reputation drops further. You can spiral from healthy to throttled in a few weeks if the leak is large enough.

## The diagnostic

Before assuming you have a problem, measure. Three signals will tell you if fake signups are hurting your deliverability today.

**1. Bounce rate over the last 30 days, segmented by user-creation cohort.**

If users created in the last 30 days bounce at 10× the rate of users older than 90 days, fake signups are actively eroding your sender reputation. Pull this from your ESP (Resend, SendGrid, Postmark, etc.) — they all surface bounce data per recipient.

**2. Postmaster Tools data.**

Set up [Google Postmaster Tools](https://postmaster.google.com/) and [Microsoft SNDS](https://sendersupport.olc.protection.outlook.com/snds/). Both are free. Both show your actual reputation as Gmail and Outlook see it.

In Postmaster, watch the **Spam rate**, **Domain reputation**, and **Authentication rate** charts. A trend line moving down on any of these is a warning. A drop below "Medium" reputation is a problem you should act on this week.

**3. Inbox placement testing.**

Tools like [GlockApps](https://glockapps.com/) or [Mailtrap](https://mailtrap.io/) send test emails to seed accounts across major providers and report where they land. Run a test before and after shipping a fix — the contrast is what proves the win.

## The fix, in priority order

You can't undo damage to your sender reputation overnight. But you can stop the bleeding immediately, and the reputation will recover over 4–8 weeks if you keep your numbers clean.

### 1. Stop sending to fake signups

The single highest-leverage change. Before you fire any transactional email to a brand-new account, score the signup. If the score is low, do not send mail. Hold the verification email, suspend the account, or silently absorb the signup without any outbound email.

This single rule dramatically lowers your bounce rate — because the addresses that don't accept mail are the ones you've stopped sending to. It's almost cheating in how effective it is.

### 2. Hard-block disposable and role-based addresses at signup

If `info@` or `mailinator.com` cannot create an account, they cannot generate bounces. This is one configuration in your signup verifier away.

### 3. Validate MX records before sending

Even after signup verification, do a final live MX lookup at send time. If the recipient's domain has no MX, don't send. This catches the small remaining slice of fake signups your verifier missed and protects you from the bounce.

Most ESPs (Resend especially) do this for you, but if you're rolling your own SMTP, build it in.

### 4. Implement double opt-in for marketing email

Transactional email (password reset, invoice) doesn't need consent. Marketing email does. A double opt-in flow means the user clicks a confirmation link before getting your newsletter — which dramatically reduces complaints, because everyone on your list actually wanted to be there.

This is the standard advice for marketing email and applies regardless of the fake signup situation.

### 5. Authentication hygiene

Make sure SPF, DKIM, and DMARC are all set up correctly on your sending domain. Tools like [MXToolbox](https://mxtoolbox.com/) can audit this in minutes. Misalignment alone causes spam folder placement even when everything else is healthy.

If you're sending from `mail.yourdomain.com` via Resend, every record on that subdomain matters.

## The compound effect

A SaaS that ships fake-signup blocking sees three things change over 4–8 weeks:

- **Bounce rate drops.** Usually by 50–80% if fake signups were the dominant source.
- **Spam complaint rate drops.** Slower than bounce rate — takes 4–6 weeks of clean sending to recover.
- **Inbox placement improves.** Gmail Postmaster reputation moves from "Low" or "Medium" back to "High" over a similar window.

The improvement compounds. As inbox placement improves, more real users see and engage with your mail. Engagement is the strongest positive signal, so reputation recovers faster the cleaner you stay.

## What this is worth

Run the math for your business. If 5% of your transactional emails currently land in spam, that's 5% of password resets that fail, 5% of onboarding emails that miss, 5% of "your invoice is ready" that never gets seen. That converts directly to support tickets, churn, and lost expansion revenue.

For most SaaS, deliverability is worth more in dollars per month than the AWS bill it would take to host fake accounts. Fix it accordingly.

## TL;DR

Fake signups don't just cost compute — they wreck your sender reputation, which silently breaks every transactional email to your real customers. Score signups before sending the first email, block disposable and role-based addresses, validate MX records at send time, and watch Postmaster Tools weekly. Clean sending recovers reputation in 4–8 weeks.

[Vouchley](/) returns a deliverability-aware verification score so you know which signups will and won't accept mail before you send the first message. [Try it free](/signup) or [see the verify docs](/docs/api/verify).
