/**
 * Free disposable-email checker API (powers /tools/disposable-email-checker).
 *
 * Runs entirely on our own infrastructure — disposable-list match + a live MX
 * lookup — so it costs no API credits and cannot be abused to drain the paid
 * quota. It intentionally does NOT expose the IP/VPN/bot signals of the full
 * Vouchley API; the tool page CTAs to /docs for those.
 */
import dns from "node:dns";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  FREE_PROVIDERS,
  ROLE_LOCAL_PARTS,
  disposableByMx,
  lookupDisposable,
} from "@/lib/disposable-list";
import { remoteDisposable } from "@/lib/disposable-remote";

export const runtime = "nodejs";

// Basic per-instance rate limit. The check is free (DNS + set lookup), so this
// only exists to stop someone hammering it as a free MX-lookup endpoint.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

async function resolveMxHosts(domain: string): Promise<string[]> {
  try {
    const records = await Promise.race([
      dns.promises.resolveMx(domain),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("mx-timeout")), 3000),
      ),
    ]);
    return Array.isArray(records) ? records.map((r) => r.exchange) : [];
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit reached. Try again in a minute." },
      { status: 429 },
    );
  }

  let email = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: "Enter an email address." }, { status: 400 });
  }
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({
      email,
      valid: false,
      recommendation: "block",
      reason: "Not a valid email address format.",
    });
  }

  const [localPart, domain] = email.toLowerCase().split("@");
  const freeProvider = FREE_PROVIDERS.has(domain);
  const roleBased = ROLE_LOCAL_PARTS.has(localPart);
  const mxHosts = await resolveMxHosts(domain);
  const mxFound = mxHosts.length > 0;

  // Layer 1 — direct list lookup.
  let { disposable, service } = lookupDisposable(domain);
  // Layer 2 — mail-server fingerprint (a rotation domain whose MX is disposable).
  if (!disposable && !freeProvider) {
    const byMx = disposableByMx(mxHosts);
    if (byMx.disposable) ({ disposable, service } = byMx);
  }
  // Layer 3 — free-API fallback for domains our list doesn't know yet
  // (best-effort, cached, fails open). Skip for known free providers.
  if (!disposable && !freeProvider && mxFound) {
    const remote = await remoteDisposable(domain);
    if (remote === true) disposable = true;
  }

  let recommendation: "approve" | "review" | "block";
  let reason: string;

  if (!mxFound) {
    recommendation = "block";
    reason = `${domain} has no mail server (MX) records — it can't receive email.`;
  } else if (disposable) {
    recommendation = "block";
    reason = service
      ? `Disposable email provider (${service}). Block at signup.`
      : "Known disposable / throwaway email domain. Block at signup.";
  } else if (roleBased) {
    recommendation = "review";
    reason = `Role-based address (${localPart}@) — rarely a single real person.`;
  } else if (freeProvider) {
    recommendation = "approve";
    reason = "Legitimate free provider. Approve, and watch for alias abuse.";
  } else {
    recommendation = "approve";
    reason = "No disposable, role-based, or deliverability red flags found.";
  }

  return NextResponse.json({
    email,
    valid: true,
    disposable,
    free_provider: freeProvider,
    role_based: roleBased,
    mx_found: mxFound,
    service,
    recommendation,
    reason,
  });
}
