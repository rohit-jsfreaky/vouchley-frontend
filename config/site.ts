export const SITE = {
  name: "Vouchley",
  // Keyword-first, brand-free. The Next.js title template appends `— Vouchley`
  // so we don't want it duplicated inside SITE.title itself.
  title: "Real-time signup verification API for SaaS",
  description:
    "Vouchley scores every new signup in real time. Block bots, filter disposable emails, detect VPN/Tor abuse, and route qualified leads to sales. One API call.",
  tagline: "The Editorial Architect",
  year: new Date().getFullYear(),
  url: "https://vouchley.getrevlio.com",
  apiUrl: "https://api.vouchley.getrevlio.com",
  twitter: "@vouchley",
  // Trimmed to the high-intent terms we actually want to rank for.
  // The `keywords` meta tag is ignored by Google but a short list still
  // gets used by Bing/DuckDuckGo and shows up in some social previews.
  keywords: [
    "signup verification API",
    "fake signup detection",
    "disposable email detection",
    "VPN detection API",
    "fraud prevention API",
  ],
  defaultOgImage: "/og-default.png",
} as const;
