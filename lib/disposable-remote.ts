/**
 * Layer 3 — free-API fallback for domains our list doesn't know yet.
 *
 * validator.pizza (UserCheck's public endpoint) analyzes every domain queried
 * and updates daily, so it catches freshly-rotated temp-mail domains that no
 * static list has. We only call it for domains our own list marks clean, cache
 * the answer per-domain, and FAIL OPEN — if it's slow, down, or rate-limited we
 * silently keep the list's verdict. So it can only ever improve accuracy, never
 * break a check or add latency on repeat domains.
 */
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const TIMEOUT_MS = 2000;
const cache = new Map<string, { disposable: boolean; at: number }>();

export async function remoteDisposable(domain: string): Promise<boolean | null> {
  const d = domain.toLowerCase();
  const hit = cache.get(d);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.disposable;

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const res = await fetch(`https://www.validator.pizza/email/check@${encodeURIComponent(d)}`, {
      headers: { "User-Agent": "vouchley-checker" },
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null; // rate-limited / error → fail open
    const json = (await res.json()) as { disposable?: boolean };
    if (typeof json.disposable !== "boolean") return null;
    cache.set(d, { disposable: json.disposable, at: Date.now() });
    return json.disposable;
  } catch {
    return null; // timeout / network → fail open
  }
}
