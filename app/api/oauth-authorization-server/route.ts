/**
 * RFC 8414 — OAuth 2.0 Authorization Server Metadata.
 * Served at `/.well-known/oauth-authorization-server` via a rewrite in
 * `next.config.ts`.
 *
 * Honest framing: Vouchley's API is protected by long-lived Bearer
 * **API keys**, not by OAuth 2.0 authorization flows. There is no
 * authorization-code dance, no refresh tokens, no PKCE. Keys are minted
 * manually by users from the dashboard.
 *
 * This metadata document exists for two reasons:
 *   1. Agent-discoverability tools (per RFC 8414 / RFC 9728 / Anthropic
 *      MCP) expect to find a well-known auth document on any API host
 *      that accepts Bearer tokens.
 *   2. We want to tell agents the truth: "We accept Bearer tokens,
 *      humans mint them at /dashboard/keys, here are the docs."
 *
 * The `grant_types_supported` array is intentionally empty — we do not
 * support any standard OAuth grant. The `x-vouchley-auth-model` field
 * advertises the actual mechanism so an agent that understands it can
 * skip the OAuth dance and look up our docs instead.
 */
import { SITE } from "@/config/site";

export const runtime = "nodejs";

export async function GET() {
  const body = {
    issuer: SITE.url,
    authorization_endpoint: `${SITE.url}/dashboard/keys`,
    token_endpoint: `${SITE.url}/dashboard/keys`,
    registration_endpoint: `${SITE.url}/signup`,
    revocation_endpoint: `${SITE.url}/dashboard/keys`,
    service_documentation: `${SITE.url}/docs/authentication`,
    op_policy_uri: `${SITE.url}/privacy`,
    op_tos_uri: `${SITE.url}/terms`,
    response_types_supported: [],
    grant_types_supported: [],
    token_endpoint_auth_methods_supported: ["bearer"],
    code_challenge_methods_supported: [],
    scopes_supported: ["verify", "read", "write"],
    ui_locales_supported: ["en-US"],

    // Non-standard extensions that describe what Vouchley actually does.
    // Per RFC 8414 §2, extension fields are allowed and SHOULD be
    // namespaced; we prefix with `x-vouchley-`.
    "x-vouchley-auth-model": "api-key",
    "x-vouchley-key-prefix-live": "vch_live_",
    "x-vouchley-key-prefix-test": "vch_test_",
    "x-vouchley-key-minting-url": `${SITE.url}/dashboard/keys`,
    "x-vouchley-key-minting-instructions": `${SITE.url}/docs/authentication`,
    "x-vouchley-note":
      "Vouchley is protected by long-lived Bearer API keys. No standard OAuth grants are supported. Users mint keys manually from the dashboard.",
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
