/**
 * IndexNow submitter — pings Bing/Yandex/Seznam to instantly (re)crawl URLs.
 *
 * Setup: the key file `public/<KEY>.txt` must be live at
 *   https://vouchley.getrevlio.com/<KEY>.txt
 * (search engines fetch it to verify ownership before accepting submissions).
 *
 * Usage (any of these forms works — see the Git Bash note below):
 *   node scripts/indexnow-submit.mjs                       # default key-page list
 *   node scripts/indexnow-submit.mjs pricing blog/foo      # relative paths (safest on Git Bash)
 *   node scripts/indexnow-submit.mjs /pricing /vs/kickbox  # leading-slash paths (auto-recovered)
 *   node scripts/indexnow-submit.mjs https://vouchley.getrevlio.com/pricing
 *
 * ⚠️ Git Bash (MSYS) rewrites a leading-slash argument like "/pricing" into an
 * absolute Windows path ("C:/Program Files/Git/pricing") before Node sees it.
 * toUrl() below recovers the real path, and a guard drops anything malformed so
 * we can never again submit "https://.../C:/Program Files/Git/..." to Bing.
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

/**
 * Build a canonical https URL from a path/URL argument. Robust against Git Bash
 * MSYS path conversion (see the header note).
 */
function toUrl(input) {
  let p = String(input).trim().replace(/\\/g, "/");
  if (/^https?:\/\//i.test(p)) return p;
  // Undo MSYS mangling: if it became a drive-letter path, keep the tail after /Git/.
  if (/^[A-Za-z]:\//.test(p)) {
    const m = p.match(/\/Git\/(.*)$/i);
    p = m ? m[1] : "";
  }
  p = "/" + p.replace(/^\/+/, "");
  return ORIGIN + p;
}

const args = process.argv.slice(2);
const inputs = args.length ? args : DEFAULT_PATHS;

const urlList = inputs.map(toUrl).filter((u) => {
  const pathPart = u.slice(ORIGIN.length);
  const ok =
    u.startsWith(`${ORIGIN}/`) &&
    !/[:\\]/.test(pathPart) &&
    !/program files/i.test(u);
  if (!ok) console.log("  ✗ skipping malformed URL (not submitted):", u);
  return ok;
});

if (!urlList.length) {
  console.log("No valid URLs to submit.");
  process.exit(1);
}

console.log("Submitting to IndexNow:");
urlList.forEach((u) => console.log("  " + u));

const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

console.log(`\nIndexNow: submitted ${urlList.length} URL(s) -> HTTP ${res.status}`);
if (res.status !== 200 && res.status !== 202) {
  console.log("Response:", await res.text());
  console.log(
    "If 403/422: confirm the key file is live at",
    KEY_LOCATION,
    "(needs a deploy first).",
  );
}
