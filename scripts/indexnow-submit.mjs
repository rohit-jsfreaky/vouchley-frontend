/**
 * IndexNow submitter — pings Bing/Yandex/Seznam to instantly (re)crawl URLs.
 *
 * Setup: the key file `public/<KEY>.txt` must be live at
 *   https://vouchley.getrevlio.com/<KEY>.txt
 * (search engines fetch it to verify ownership before accepting submissions).
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs                      # submit the default key-page list
 *   node scripts/indexnow-submit.mjs /pricing /blog/foo   # submit specific paths
 *   node scripts/indexnow-submit.mjs https://vouchley.getrevlio.com/pricing
 *
 * Google does NOT use IndexNow — use GSC "Request indexing" for Google.
 */

const KEY = "06381717a7c84403a0ad98cc0dc1bd8a";
const HOST = "vouchley.getrevlio.com";
const ORIGIN = `https://${HOST}`;
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;

// Default: the highest-value pages. Override by passing paths/URLs as args.
const DEFAULT_PATHS = [
  "/",
  "/pricing",
  "/blog/vpn-proxy-detection-signups",
  "/blog/disposable-email-detection-guide",
  "/blog/2026-saas-signup-fraud-report",
  "/blog/bot-signup-prevention",
  "/blog/ai-bot-signups-2026",
  "/blog/how-to-detect-fake-signups",
  "/disposable-emails",
  "/vs/kickbox",
  "/vs/zerobounce",
  "/vs/sift",
  "/docs",
];

const args = process.argv.slice(2);
const paths = args.length ? args : DEFAULT_PATHS;
const urlList = paths.map((p) =>
  p.startsWith("http") ? p : `${ORIGIN}${p.startsWith("/") ? p : `/${p}`}`,
);

const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

console.log(`IndexNow: submitted ${urlList.length} URL(s) -> HTTP ${res.status}`);
if (res.status !== 200 && res.status !== 202) {
  console.log("Response:", await res.text());
  console.log(
    "If 403/422: confirm the key file is live at",
    KEY_LOCATION,
    "(needs a deploy first).",
  );
}
