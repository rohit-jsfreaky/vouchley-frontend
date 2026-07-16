/**
 * Curated database of disposable / temporary / throwaway email services.
 *
 * Only well-known, publicly documented services are included. Every entry
 * names the operator, what the service offers, and whether it should be
 * blocked at signup. Don't add generic fly-by-night domains here — those
 * belong in the live disposable list inside the verifier, not on a public
 * SEO page.
 *
 * The "kind" field distinguishes the SEO answer:
 *   - "disposable"     → throwaway / temp inboxes designed to bypass signup
 *   - "free_provider"  → real, legitimate provider (Gmail, Outlook). Pages
 *                        exist mostly to clear up search-intent confusion
 *                        ("is gmail disposable?") rather than to recommend
 *                        a block.
 */

export type DomainKind = "disposable" | "free_provider";

export type DisposableDomain = {
  /** Slug used in URL: `/disposable-emails/{slug}`. Lowercase, no dots. */
  slug: string;
  /** The actual domain (e.g. "mailinator.com"). */
  domain: string;
  /** Service or operator display name. */
  serviceName: string;
  /** Disposable vs legitimate free provider. */
  kind: DomainKind;
  /** First public launch year, only when verifiable. Leave undefined otherwise. */
  launchYear?: number;
  /** One-paragraph factual description of the service. */
  description: string;
  /** What this address is typically used for, in plain English. */
  typicalUse: string;
  /** Quick block recommendation explanation. */
  blockRationale: string;
  /** Other domain aliases run by the same service (if any). */
  aliases?: string[];
  /** 3–4 related services to cross-link. Use slugs. */
  related: string[];
  /**
   * SEO <title> override for high-traffic domains (e.g. Mailinator). Lets the
   * SERP title match real query demand ("what is X", "who owns X", "is X safe")
   * instead of only the generated "Is X a disposable email?". Falls back to the
   * generated title.
   */
  metaTitle?: string;
  /** SEO meta-description override. Falls back to the generated description. */
  metaDescription?: string;
};

export const DISPOSABLE_DOMAINS: DisposableDomain[] = [
  {
    slug: "mailinator-com",
    domain: "mailinator.com",
    serviceName: "Mailinator",
    kind: "disposable",
    launchYear: 2003,
    description:
      "Mailinator is one of the oldest and most widely used disposable email services. Anyone can read mail sent to any Mailinator address by simply visiting the public inbox at mailinator.com — no signup, no password, no privacy.",
    typicalUse:
      "Throwaway accounts on signup forms, one-time email confirmations the user never wants to access again, or testing email flows during development.",
    blockRationale:
      "A user signing up with a Mailinator address has no intention of receiving ongoing communication. Block at the signup layer to protect deliverability and prevent free-tier abuse.",
    metaTitle: "What Is Mailinator? Owner, Uses & How to Block It",
    metaDescription:
      "Mailinator is a public disposable email service running since 2003. Who owns it, what it's used for, and how to block Mailinator addresses at signup.",
    aliases: ["binkmail.com", "bobmail.info", "chammy.info", "mailtothis.com"],
    related: ["10minutemail-com", "guerrillamail-com", "yopmail-com", "maildrop-cc"],
  },
  {
    slug: "10minutemail-com",
    domain: "10minutemail.com",
    serviceName: "10MinuteMail",
    kind: "disposable",
    launchYear: 2007,
    description:
      "10MinuteMail issues a temporary email address that self-destructs after ten minutes. The inbox is browser-anonymous: anyone visiting the page gets a fresh address, and the address disappears when the timer runs out.",
    typicalUse:
      "Quick, single-use email confirmations where the user wants to avoid spam follow-up. Common on signup forms requiring email verification before granting access.",
    blockRationale:
      "Any signup with a 10MinuteMail address will fail to be reachable within minutes. The user has explicitly opted out of any follow-up — there is no value in onboarding them.",
    metaTitle: "What Is 10 Minute Mail? Disposable Email Explained",
    metaDescription:
      "10 Minute Mail gives a throwaway inbox that self-destructs in ten minutes. What it is, why people use it, and how to block 10minutemail.com at signup.",
    aliases: ["10minutemail.net", "10minutemail.org"],
    related: ["mailinator-com", "guerrillamail-com", "tempmail-org", "throwawaymail-com"],
  },
  {
    slug: "guerrillamail-com",
    domain: "guerrillamail.com",
    serviceName: "Guerrilla Mail",
    kind: "disposable",
    launchYear: 2006,
    description:
      "Guerrilla Mail is a long-running disposable email provider that issues temporary inboxes which expire after one hour. The service operates a number of alias domains that all forward into the same Guerrilla Mail backend.",
    typicalUse:
      "Anonymous signups, comment submissions, and any throwaway email registration. Guerrilla Mail addresses are sometimes used to bypass IP-based rate limits on signup forms.",
    blockRationale:
      "Block at signup. Guerrilla Mail and its alias domains are pure throwaway providers with no expectation of long-term inbox access.",
    metaTitle: "Guerrilla Mail: Is It Safe & Should You Block It?",
    metaDescription:
      "Guerrilla Mail is a large disposable email service with hourly-expiring inboxes. Is it safe, what it's used for, and how to detect and block it at signup.",
    aliases: [
      "sharklasers.com",
      "guerrillamailblock.com",
      "spam4.me",
      "grr.la",
      "pokemail.net",
    ],
    related: ["mailinator-com", "10minutemail-com", "yopmail-com", "sharklasers-com"],
  },
  {
    slug: "yopmail-com",
    domain: "yopmail.com",
    serviceName: "YOPmail",
    kind: "disposable",
    launchYear: 2004,
    description:
      "YOPmail is a French-origin disposable email service. Any address ending in @yopmail.com works without registration — the inbox already exists and is publicly readable to anyone who knows or guesses the username.",
    typicalUse:
      "Signups that require email confirmation but where the user wants to avoid future communication. Popular in European traffic patterns.",
    blockRationale:
      "Public-inbox model means anything sent to a YOPmail address is readable by anyone who guesses the local part. Block at signup for both spam and basic security reasons.",
    aliases: ["cool.fr.nf", "courriel.fr.nf", "jetable.fr.nf"],
    related: ["mailinator-com", "10minutemail-com", "trashmail-com", "guerrillamail-com"],
  },
  {
    slug: "maildrop-cc",
    domain: "maildrop.cc",
    serviceName: "Maildrop",
    kind: "disposable",
    launchYear: 2013,
    description:
      "Maildrop is a no-signup disposable inbox service operated by Heluna. Anyone can claim any inbox by visiting maildrop.cc and entering an alias — there is no password and no account ownership.",
    typicalUse:
      "Quick signup confirmations, especially for developers testing email flows during integration work.",
    blockRationale:
      "Maildrop addresses are publicly readable by anyone who knows the inbox name. They are designed to be throwaway and should be blocked at signup.",
    related: ["mailinator-com", "10minutemail-com", "throwawaymail-com", "moakt-com"],
  },
  {
    slug: "tempmail-org",
    domain: "tempmail.org",
    serviceName: "Temp Mail",
    kind: "disposable",
    description:
      "Temp Mail and its sibling domains operate a wide network of disposable inbox sites. Addresses rotate frequently and the service publishes mobile apps to make throwaway email creation friction-free on every platform.",
    typicalUse:
      "Mobile-first signups where the user wants a fresh email per app or service. Particularly common on free-tier and trial signups.",
    blockRationale:
      "Active mobile-app distribution makes Temp Mail a primary tool for free-tier abuse. Block all known Temp Mail domains at the signup layer.",
    aliases: [
      "temp-mail.org",
      "temp-mail.io",
      "tempmail.io",
      "temp-mail.com",
      "tempmailaddress.com",
    ],
    related: [
      "mailinator-com",
      "10minutemail-com",
      "guerrillamail-com",
      "throwawaymail-com",
    ],
  },
  {
    slug: "throwawaymail-com",
    domain: "throwawaymail.com",
    serviceName: "ThrowAwayMail",
    kind: "disposable",
    description:
      "ThrowAwayMail issues a one-time email address that self-destructs after 48 hours. The service emphasises minimalism — no signup, no settings, just a fresh inbox on each page load.",
    typicalUse:
      "Email confirmations on signups the user does not intend to keep accessing. Often picked when 10-minute services feel too short.",
    blockRationale:
      "Any address with a 48-hour life span is not a reachable channel for ongoing product communication. Block at signup.",
    related: ["mailinator-com", "10minutemail-com", "tempmail-org", "moakt-com"],
  },
  {
    slug: "moakt-com",
    domain: "moakt.com",
    serviceName: "Moakt",
    kind: "disposable",
    description:
      "Moakt is a disposable email service that lets users create a temporary address with a custom prefix. Addresses last for an hour by default; a paid tier offers longer-lived inboxes.",
    typicalUse:
      "Signup confirmations and one-time verifications. The custom-prefix feature makes Moakt addresses occasionally indistinguishable from real-looking ones at first glance.",
    blockRationale:
      "Even with a custom prefix, the @moakt.com suffix is a clear disposable indicator. Block at signup.",
    related: ["mailinator-com", "tempmail-org", "throwawaymail-com", "emailondeck-com"],
  },
  {
    slug: "emailondeck-com",
    domain: "emailondeck.com",
    serviceName: "EmailOnDeck",
    kind: "disposable",
    description:
      "EmailOnDeck issues disposable email addresses through a two-step CAPTCHA process. The two-step gate makes it slightly harder to script than fully no-signup disposables, but the addresses are still throwaway.",
    typicalUse:
      "Signups where the user wants a small but real barrier between themselves and follow-up email — often used for crypto-related or anonymous account creation.",
    blockRationale:
      "EmailOnDeck addresses are designed to be temporary by definition. Block at signup.",
    related: ["mailinator-com", "tempmail-org", "moakt-com", "throwawaymail-com"],
  },
  {
    slug: "sharklasers-com",
    domain: "sharklasers.com",
    serviceName: "Sharklasers",
    kind: "disposable",
    description:
      "Sharklasers is one of several alias domains operated by Guerrilla Mail. Any address @sharklasers.com is delivered into Guerrilla Mail's public inbox infrastructure.",
    typicalUse:
      "Same as Guerrilla Mail — anonymous, throwaway signups. Picked when a known Guerrilla domain is already blocked.",
    blockRationale:
      "Block alongside the rest of Guerrilla Mail's domains. Treating sharklasers.com as legitimate while blocking guerrillamail.com defeats the purpose.",
    aliases: ["guerrillamail.com", "grr.la", "spam4.me", "pokemail.net"],
    related: ["guerrillamail-com", "mailinator-com", "10minutemail-com", "yopmail-com"],
  },
  {
    slug: "trashmail-com",
    domain: "trashmail.com",
    serviceName: "TrashMail",
    kind: "disposable",
    description:
      "TrashMail is a German-origin disposable email service that has been operating since the early 2000s. Free addresses self-expire; paid plans extend the lifetime and add forwarding to a real inbox.",
    typicalUse:
      "Signups where the user wants disposable email behaviour but with the option to forward important messages back to a real address.",
    blockRationale:
      "Free TrashMail addresses are throwaway by design. The paid forwarding tier still represents a user explicitly hiding their real address — block at signup unless your product caters to that audience.",
    related: ["mailinator-com", "yopmail-com", "spamgourmet-com", "guerrillamail-com"],
  },
  {
    slug: "dispostable-com",
    domain: "dispostable.com",
    serviceName: "Dispostable",
    kind: "disposable",
    description:
      "Dispostable is a minimalist disposable inbox service. Addresses are public — anyone who knows the prefix can read the inbox. There is no signup, no password, and no expiry.",
    typicalUse:
      "Quick one-off signups, particularly common in developer test workflows.",
    blockRationale:
      "Public-inbox model with no expiry is the simplest possible throwaway service. Block at signup.",
    related: ["mailinator-com", "maildrop-cc", "yopmail-com", "10minutemail-com"],
  },
  {
    slug: "fakemail-net",
    domain: "fakemail.net",
    serviceName: "FakeMail",
    kind: "disposable",
    description:
      "FakeMail provides on-demand throwaway email inboxes with no registration. The site emphasises speed — a fresh inbox loads in under a second on the homepage.",
    typicalUse:
      "Single-use signups, particularly for content-gated downloads and trial confirmations.",
    blockRationale:
      "FakeMail is purpose-built for throwaway behaviour. Block at signup.",
    related: ["mailinator-com", "10minutemail-com", "tempmail-org", "moakt-com"],
  },
  {
    slug: "mintemail-com",
    domain: "mintemail.com",
    serviceName: "MintEmail",
    kind: "disposable",
    description:
      "MintEmail is a temporary email service that issues addresses lasting around three hours by default. The service has been in operation since the late 2000s.",
    typicalUse:
      "Signups where 10 minutes is too short but the user still doesn't want a permanent inbox association.",
    blockRationale:
      "Three-hour lifetimes mean any onboarding or password-reset email sent past that window is undeliverable. Block at signup.",
    related: ["mailinator-com", "10minutemail-com", "moakt-com", "tempmail-org"],
  },
  {
    slug: "spamgourmet-com",
    domain: "spamgourmet.com",
    serviceName: "Spamgourmet",
    kind: "disposable",
    launchYear: 2000,
    description:
      "Spamgourmet is one of the original alias-based disposable services. Users register a master account and then create disposable forwarding addresses on the fly using a `word.count.user@spamgourmet.com` syntax.",
    typicalUse:
      "Privacy-conscious users who want disposable per-service email aliases that forward to their real inbox for a fixed number of messages.",
    blockRationale:
      "Spamgourmet addresses are explicitly disposable, even when forwarding works. Block at signup unless your product audience is dominated by privacy-first power users.",
    related: ["mailinator-com", "trashmail-com", "yopmail-com", "anonaddy-com"],
  },
  {
    slug: "anonaddy-com",
    domain: "anonaddy.com",
    serviceName: "AnonAddy",
    kind: "disposable",
    description:
      "AnonAddy (now operating as addy.io) is an open-source email-aliasing service designed for privacy. Users create unlimited per-service aliases that forward to a real inbox, with the ability to deactivate any alias if it starts receiving spam.",
    typicalUse:
      "Privacy-focused users who want to avoid sharing their real email address with every service they sign up for. Particularly popular with developers.",
    blockRationale:
      "More nuanced than pure throwaway services — these users do want long-term contact. Consider risk-tiering rather than hard-blocking unless your product has strict identity requirements.",
    aliases: ["addy.io", "anonaddy.me"],
    related: ["spamgourmet-com", "simplelogin-com", "mailinator-com", "trashmail-com"],
  },
  {
    slug: "simplelogin-com",
    domain: "simplelogin.io",
    serviceName: "SimpleLogin",
    kind: "disposable",
    description:
      "SimpleLogin (acquired by Proton in 2022) is an email-aliasing service that lets users create unlimited per-service aliases forwarding to a real inbox. Acquired and maintained as part of the Proton privacy suite.",
    typicalUse:
      "Privacy-aware users who want a separate alias per signup. Common among Proton Mail users and the broader privacy-first audience.",
    blockRationale:
      "Like AnonAddy, SimpleLogin users are real people with real intent. Risk-tier rather than hard-block — these accounts often convert well in B2B SaaS.",
    aliases: ["aleeas.com", "slmail.me"],
    related: ["anonaddy-com", "spamgourmet-com", "proton-me", "mailinator-com"],
  },
  // -------------------------------------------------------------------------
  // Free providers — included to clear up search-intent confusion
  // -------------------------------------------------------------------------
  {
    slug: "gmail-com",
    domain: "gmail.com",
    serviceName: "Gmail",
    kind: "free_provider",
    launchYear: 2004,
    description:
      "Gmail is Google's free webmail service. It is a legitimate, long-lived provider — not a disposable service — used by over 1.8 billion people worldwide for personal and business email.",
    typicalUse:
      "General personal email. Many small businesses also operate on Gmail addresses before adopting custom domains.",
    blockRationale:
      "Do NOT block @gmail.com signups. Gmail is one of the largest sources of legitimate user signups. The right move is to score Gmail signups normally while watching for the specific abuse patterns it enables (alias tricks like dot-variations and `+` suffixes).",
    related: ["proton-me", "outlook-com", "yahoo-com", "icloud-com"],
  },
  {
    slug: "proton-me",
    domain: "proton.me",
    serviceName: "Proton Mail",
    kind: "free_provider",
    launchYear: 2014,
    description:
      "Proton Mail is a privacy-focused email provider operated by Proton AG, based in Switzerland. End-to-end encryption is the core differentiator. Free and paid tiers are both legitimate, long-lived inboxes.",
    typicalUse:
      "Privacy-conscious personal email and small-business communication. Common among developers, journalists, and EU/Swiss users.",
    blockRationale:
      "Do not block @proton.me signups. They are legitimate users — many of whom are exactly the technical, security-aware buyers most B2B SaaS products want.",
    aliases: ["protonmail.com", "pm.me"],
    related: ["gmail-com", "tutanota-com", "outlook-com", "simplelogin-com"],
  },
  {
    slug: "outlook-com",
    domain: "outlook.com",
    serviceName: "Outlook.com",
    kind: "free_provider",
    description:
      "Outlook.com is Microsoft's consumer webmail service, the successor to Hotmail. It is a legitimate free provider used by hundreds of millions of users for personal email.",
    typicalUse:
      "General personal email, particularly common with Windows users and longtime Hotmail account holders who migrated.",
    blockRationale:
      "Do not block @outlook.com signups. Treat the same as Gmail — score normally and watch for the same alias-style abuse tricks.",
    aliases: ["hotmail.com", "live.com", "msn.com"],
    related: ["gmail-com", "proton-me", "yahoo-com", "icloud-com"],
  },

  // ---------------------------------------------------------------------------
  // Batch 2 (2026-07-16) — added from real search demand in GSC (binkmail,
  // gmailnator queries) + the most-referenced active services not yet covered.
  // ---------------------------------------------------------------------------
  {
    slug: "gmailnator-com",
    domain: "gmailnator.com",
    serviceName: "Gmailnator",
    kind: "disposable",
    description:
      "Gmailnator is a temporary-email service whose hook is Gmail itself: it hands out disposable addresses that include pooled @gmail.com inboxes alongside its own domains. Because the address genuinely ends in gmail.com, it sails past naive filters that only block known disposable domains.",
    typicalUse:
      "Bypassing signup forms that block disposable domains but trust anything ending in @gmail.com. The inboxes are shared and publicly viewable, so users grab a confirmation email and move on.",
    blockRationale:
      "You can block Gmailnator's own domains outright, but the pooled Gmail addresses can't be caught by domain matching at all — they need alias normalization, velocity checks, and IP signals. Treat this service as the reason domain blocklists alone are not enough.",
    related: ["mailinator-com", "emailondeck-com", "10minutemail-com", "tempmail-org"],
    metaTitle: "What Is Gmailnator? Temp Gmail, Explained",
    metaDescription:
      "Gmailnator hands out disposable addresses including pooled real @gmail.com inboxes, which slip past domain blocklists. What it is and how to catch it at signup.",
  },
  {
    slug: "binkmail-com",
    domain: "binkmail.com",
    serviceName: "Binkmail (Mailinator network)",
    kind: "disposable",
    description:
      "Binkmail.com is one of the alternate domains of the Mailinator network. Any address @binkmail.com feeds into the same public, passwordless inbox system as Mailinator itself — the different domain exists largely to slip past blocklists that only list mailinator.com.",
    typicalUse:
      "Throwaway signups by users who found mailinator.com blocked on a form and reached for a lesser-known alias domain of the same service.",
    blockRationale:
      "Identical risk to Mailinator: public inboxes, zero intention of ongoing contact. Block it — and treat its existence as a reminder to use a maintained list that tracks Mailinator's rotating alias domains rather than a single hardcoded domain.",
    related: ["mailinator-com", "sharklasers-com", "yopmail-com", "dispostable-com"],
    metaTitle: "Is Binkmail a Disposable Email? (Mailinator Alias)",
    metaDescription:
      "Binkmail.com is an alias domain of the Mailinator network — same public throwaway inboxes, different name to dodge blocklists. Why and how to block it at signup.",
  },
  {
    slug: "spam4-me",
    domain: "spam4.me",
    serviceName: "Spam4.me (YOPmail network)",
    kind: "disposable",
    description:
      "Spam4.me is an alternate domain operated by the YOPmail network. Mail sent to an @spam4.me address lands in the same public, registration-free YOPmail inbox system, readable by anyone who knows the local part.",
    typicalUse:
      "Throwaway confirmations by users dodging forms that block yopmail.com but haven't caught the network's alias domains.",
    blockRationale:
      "Same public-inbox exposure as YOPmail: anything you send is world-readable and the user will never return. Block at signup along with the rest of the YOPmail alias set.",
    related: ["yopmail-com", "mailinator-com", "binkmail-com", "guerrillamail-com"],
  },
  {
    slug: "mail-tm",
    domain: "mail.tm",
    serviceName: "Mail.tm",
    kind: "disposable",
    description:
      "Mail.tm is a disposable email service with a distinctly developer-facing twist: it exposes a free, documented REST API for creating temporary accounts and reading mail programmatically. That makes it a favorite building block for signup-automation scripts and bot frameworks.",
    typicalUse:
      "Automated account creation at scale — the API means a script can mint an inbox, register on your product, and fetch the confirmation link without a human touching a browser.",
    blockRationale:
      "Block at signup. The programmatic inbox API makes this one of the most automation-friendly disposable services, so addresses here are disproportionately likely to be bots rather than humans.",
    related: ["mailsac-com", "dropmail-me", "tempmail-org", "guerrillamail-com"],
  },
  {
    slug: "dropmail-me",
    domain: "dropmail.me",
    serviceName: "DropMail",
    kind: "disposable",
    description:
      "DropMail.me issues a working disposable inbox the moment the page loads — no signup, no button press — and lets users switch between several alias domains operated by the same service. Inboxes are short-lived and vanish when the session ends.",
    typicalUse:
      "Instant throwaway confirmations. The zero-friction, address-on-page-load design attracts users who want an inbox for exactly one email.",
    blockRationale:
      "Pure throwaway usage with multiple rotating alias domains. Block the whole domain family at signup via a maintained list rather than chasing each alias by hand.",
    related: ["10minutemail-com", "minuteinbox-com", "tempmail-org", "maildrop-cc"],
  },
  {
    slug: "mailnesia-com",
    domain: "mailnesia.com",
    serviceName: "Mailnesia",
    kind: "disposable",
    description:
      "Mailnesia is a public-inbox disposable service with a feature that makes it uniquely dangerous for signup fraud: it automatically clicks the links in incoming email. A confirmation email sent to a Mailnesia address activates itself — no human required.",
    typicalUse:
      "Fully hands-off fake signups: register with a Mailnesia address and the service itself completes your email-verification step by auto-visiting the confirmation link.",
    blockRationale:
      "Block unconditionally. The auto-click behavior defeats email confirmation as a bot check entirely, so a Mailnesia signup that looks 'verified' proves nothing about a human being present.",
    related: ["mailinator-com", "yopmail-com", "mail-tm", "dispostable-com"],
  },
  {
    slug: "minuteinbox-com",
    domain: "minuteinbox.com",
    serviceName: "MinuteInbox",
    kind: "disposable",
    description:
      "MinuteInbox is a timer-based disposable inbox in the 10MinuteMail mold: visitors get an address with a countdown clock and can extend the timer if they need the inbox a little longer. When the clock runs out, the address is gone.",
    typicalUse:
      "One-time email confirmations where the user wants the inbox to disappear immediately afterward.",
    blockRationale:
      "The address is unreachable within minutes of signup, so there is no deliverability value and no ongoing user relationship. Block at signup.",
    related: ["10minutemail-com", "dropmail-me", "tempmail-org", "guerrillamail-com"],
  },
  {
    slug: "mohmal-com",
    domain: "mohmal.com",
    serviceName: "Mohmal",
    kind: "disposable",
    description:
      "Mohmal ('neglected' in Arabic) is a disposable email service especially popular in Arabic-speaking markets, with an interface localized for the region. Inboxes are temporary and are deleted shortly after creation.",
    typicalUse:
      "Throwaway signups and confirmations, with usage concentrated in Middle East and North Africa traffic.",
    blockRationale:
      "Standard throwaway economics: the inbox is designed to disappear, so the signup has no lasting contact value. Block at signup — and note that regionally popular services like this are exactly what a US-centric blocklist tends to miss.",
    related: ["tempmail-org", "yopmail-com", "10minutemail-com", "fakemail-net"],
  },
  {
    slug: "mailsac-com",
    domain: "mailsac.com",
    serviceName: "Mailsac",
    kind: "disposable",
    description:
      "Mailsac is a developer-oriented disposable email platform: public throwaway inboxes plus a full REST API and webhooks for reading mail programmatically. Engineering teams legitimately use it to test their own signup flows in CI — which is exactly what makes it potent for automating signups on someone else's product.",
    typicalUse:
      "Email-flow testing by developers, and automated account creation when pointed at third-party products. Public inboxes also serve ordinary throwaway signups.",
    blockRationale:
      "Block on production signup forms. If your own team uses Mailsac for end-to-end tests, allowlist it in test environments specifically rather than letting it through everywhere.",
    related: ["mail-tm", "mailinator-com", "maildrop-cc", "inboxkitten-com"],
  },
  {
    slug: "inboxkitten-com",
    domain: "inboxkitten.com",
    serviceName: "InboxKitten",
    kind: "disposable",
    description:
      "InboxKitten is an open-source disposable inbox project — the code is public and the hosted instance offers free, registration-less throwaway inboxes. Because it's open source, the same software also runs on domains beyond the original.",
    typicalUse:
      "Throwaway confirmations, plus self-hosted clones used by more technical users to create disposable inboxes on domains no blocklist has seen.",
    blockRationale:
      "Block the known domain, but the open-source angle is the real lesson: static lists can't track self-hosted clones, which is why MX patterns, domain age, and behavioral signals have to carry part of the detection.",
    related: ["mailsac-com", "mail-tm", "maildrop-cc", "dropmail-me"],
  },
  {
    slug: "harakirimail-com",
    domain: "harakirimail.com",
    serviceName: "Harakiri Mail",
    kind: "disposable",
    description:
      "Harakiri Mail is a disposable inbox service whose name describes its model: inboxes exist briefly and then self-destruct. Addresses work without registration and are intended for a single confirmation email.",
    typicalUse:
      "One-shot signups and download-gate confirmations where the user never intends to check the inbox again.",
    blockRationale:
      "Self-destructing inboxes mean guaranteed future bounces and zero user relationship. Block at signup.",
    related: ["10minutemail-com", "minuteinbox-com", "dispostable-com", "fakemail-net"],
  },
  {
    slug: "tempmailo-com",
    domain: "tempmailo.com",
    serviceName: "TempMailo",
    kind: "disposable",
    description:
      "TempMailo is a disposable email service that auto-generates a temporary address on arrival and holds incoming mail for a short window before deleting it. It's one of the wave of interchangeable temp-mail sites that appeared after Temp-Mail popularized the format.",
    typicalUse:
      "Quick throwaway confirmations from users who searched 'temp mail' and clicked whichever service ranked that day.",
    blockRationale:
      "Standard disposable model with no lasting inbox. Block at signup — services in this long tail rotate in and out of popularity, which is why a daily-updated list matters more than any single domain.",
    related: ["tempmail-org", "10minutemail-com", "mohmal-com", "dropmail-me"],
  },
  {
    slug: "emailfake-com",
    domain: "emailfake.com",
    serviceName: "Email Fake",
    kind: "disposable",
    description:
      "Email Fake is a disposable-address generator that lets users compose an address across a large, rotating catalog of domains — including obscure ones added specifically because blocklists haven't caught them yet. The generated inboxes are public and registration-free.",
    typicalUse:
      "Evading disposable-domain blocklists: when a form rejects one domain, the user picks another from the catalog until one passes.",
    blockRationale:
      "Block the core domain, but the rotating catalog is the real threat model — it's a live argument for combining a maintained feed with MX and domain-age checks instead of trusting any static list.",
    related: ["gmailnator-com", "tempmail-org", "fakemail-net", "mintemail-com"],
  },
  {
    slug: "33mail-com",
    domain: "33mail.com",
    serviceName: "33mail",
    kind: "disposable",
    description:
      "33mail is a long-running email-aliasing service: users get unlimited addresses of the form anything@username.33mail.com, all forwarding to their real inbox, with per-alias blocking when one starts attracting spam. It's alias infrastructure rather than a throwaway inbox.",
    typicalUse:
      "Privacy-conscious users creating a unique address per service so they can trace and cut off whoever leaks or sells their email.",
    blockRationale:
      "More nuanced than pure throwaways — mail genuinely reaches a real person who wants it. Risk-tier rather than hard-block, and note the format: matching requires wildcarding *.33mail.com, since every user has their own subdomain.",
    related: ["anonaddy-com", "simplelogin-com", "spamgourmet-com", "burnermail-io"],
  },
  {
    slug: "burnermail-io",
    domain: "burnermail.io",
    serviceName: "Burner Mail",
    kind: "disposable",
    description:
      "Burner Mail is a browser-extension-first email aliasing service: it generates a unique 'burner' address per website at the moment of signup and forwards mail to the user's real inbox, with one-click disabling of any burner that misbehaves.",
    typicalUse:
      "Privacy-focused signups where the user wants real, ongoing email delivery but refuses to expose their actual address to your database.",
    blockRationale:
      "Like other forwarding services, these are usually real users who do want your email. Risk-tier instead of hard-blocking unless your product has strict identity requirements — a burner address plus clean IP and normal behavior is generally a legitimate signup.",
    related: ["anonaddy-com", "simplelogin-com", "33mail-com", "spamgourmet-com"],
  },
];

export function getDomain(slug: string): DisposableDomain | undefined {
  return DISPOSABLE_DOMAINS.find((d) => d.slug === slug);
}

export function getRelatedDomains(slugs: string[]): DisposableDomain[] {
  return slugs
    .map((slug) => DISPOSABLE_DOMAINS.find((d) => d.slug === slug))
    .filter((d): d is DisposableDomain => d !== undefined);
}
