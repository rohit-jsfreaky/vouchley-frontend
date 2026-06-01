/**
 * RFC 9728 — OAuth 2.0 Protected Resource Metadata.
 * Served at `/.well-known/oauth-protected-resource` via a rewrite in
 * `next.config.ts`.
 *
 * This document tells agents how to obtain tokens that work against
 * `api.vouchley.getrevlio.com`:
 *   - `resource`              — the resource identifier (the API base URL)
 *   - `authorization_servers` — issuers that can mint tokens for it
 *   - `scopes_supported`      — what scopes the resource understands
 *   - `bearer_methods_supported` — how to present the token
 *
 * Honest framing (same as oauth-authorization-server): Vouchley uses
 * long-lived Bearer **API keys** rather than OAuth-issued access
 * tokens. The `x-vouchley-*` extension fields describe the real
 * mechanism for agents that understand them.
 */
import { SITE } from "@/config/site";

export const runtime = "nodejs";

export async function GET() {
  const body = {
    resource: SITE.apiUrl,
    authorization_servers: [SITE.url],
    scopes_supported: ["verify", "read", "write"],
    bearer_methods_supported: ["header"],
    resource_documentation: `${SITE.url}/docs/authentication`,
    resource_policy_uri: `${SITE.url}/privacy`,
    resource_tos_uri: `${SITE.url}/terms`,
    resource_signing_alg_values_supported: [],
    resource_name: "Vouchley API",

    // Non-standard extensions describing the real authentication model.
    "x-vouchley-auth-model": "api-key",
    "x-vouchley-key-prefix-live": "vch_live_",
    "x-vouchley-key-prefix-test": "vch_test_",
    "x-vouchley-key-minting-url": `${SITE.url}/dashboard/keys`,
    "x-vouchley-key-header": "Authorization: Bearer <key>",
    "x-vouchley-note":
      "Vouchley is protected by long-lived Bearer API keys, not OAuth-issued tokens. Mint a key from the dashboard and pass it as `Authorization: Bearer vch_...` on every request.",
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
