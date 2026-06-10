/**
 * DEV-ONLY backend proxy.
 *
 * When you run the frontend locally (`localhost:3000`) against the deployed
 * backend (`api.vouchley.getrevlio.com`), the session cookie the backend sets
 * is scoped to `Domain=.vouchley.getrevlio.com` — which a `localhost` browser
 * can never store or send back. Result: login succeeds but every subsequent
 * request (incl. the server-side dashboard auth check) sees no cookie and
 * bounces you to /login.
 *
 * This route makes the browser talk only to the SAME ORIGIN (`/api/be/*`).
 * It forwards each request to the real backend and rewrites the response
 * `Set-Cookie` headers — stripping `Domain=...` and `Secure` — so the cookie
 * binds to `localhost`. From then on the cookie is first-party and auth works.
 *
 * Hard-disabled outside development, so production behaviour is untouched
 * (the prod client calls the backend directly; this route 404s).
 */
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPSTREAM = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.vouchley.getrevlio.com"
).replace(/\/$/, "");

const HOP_BY_HOP = new Set([
  "host",
  "connection",
  "content-length",
  "accept-encoding",
  "transfer-encoding",
]);

async function proxy(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 });
  }

  const { path } = await ctx.params;
  const target = `${UPSTREAM}/${(path ?? []).join("/")}${req.nextUrl.search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) headers.set(key, value);
  });

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstream = await fetch(target, {
    method: req.method,
    headers,
    body: body && body.byteLength > 0 ? body : undefined,
    redirect: "manual",
    cache: "no-store",
  });

  const resHeaders = new Headers();
  for (const h of ["content-type", "cache-control", "location"]) {
    const v = upstream.headers.get(h);
    if (v) resHeaders.set(h, v);
  }

  // Rewrite Set-Cookie so the session cookie binds to localhost (http).
  const setCookies = upstream.headers.getSetCookie?.() ?? [];
  for (const cookie of setCookies) {
    const rewritten = cookie
      .replace(/;\s*Domain=[^;]*/i, "")
      .replace(/;\s*Secure\b/i, "");
    resHeaders.append("set-cookie", rewritten);
  }

  const respBody = await upstream.arrayBuffer();
  return new Response(respBody, {
    status: upstream.status,
    headers: resHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
