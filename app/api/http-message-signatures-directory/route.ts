/**
 * Web Bot Auth — RFC 9421 (HTTP Message Signatures) + IETF webbotauth draft.
 * Served at `/.well-known/http-message-signatures-directory` via a rewrite
 * in `next.config.ts`.
 *
 * The directory is a JWKS that publishes the public keys we use to sign
 * outbound HTTP requests when Vouchley acts as a bot/agent against other
 * sites. Receiving sites can fetch this directory to verify our signatures
 * and decide whether to allow our traffic.
 *
 * Honest framing: Vouchley does not yet sign outbound requests, so the
 * `keys` array is intentionally empty. The directory still exists so that
 * (a) the well-known URL works for any agent that probes it, and (b) we
 * can add Ed25519 / RSA public keys here later without further routing
 * changes — just append the JWK and ship.
 *
 * Per the Cloudflare Web Bot Auth docs, keys should be Ed25519 with kid,
 * kty=OKP, crv=Ed25519, x=<base64url-encoded public key>.
 */
export const runtime = "nodejs";

export async function GET() {
  const body = {
    keys: [],
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/jwk-set+json",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
