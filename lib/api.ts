/**
 * Tiny fetch wrappers. The frontend has no DB, no auth lib, no secrets —
 * everything goes through FastAPI.
 *
 * `apiGet` / `apiPost` run in the browser (auto-attaches session cookie
 * because of credentials: "include").
 *
 * `apiGetServer` runs in React Server Components — forwards the session
 * cookie from the incoming request.
 */

const PUBLIC_API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const SERVER_API_BASE =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(public status: number, public body: string) {
    super(body || `Request failed (${status})`);
  }
}

async function parseError(resp: Response): Promise<never> {
  let message: string;
  try {
    const body = await resp.json();
    message = body?.detail ?? body?.error ?? JSON.stringify(body);
  } catch {
    message = (await resp.text().catch(() => "")) || resp.statusText;
  }
  throw new ApiError(resp.status, message);
}

// ---------------- Client-side (runs in browser) ----------------
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const resp = await fetch(`${PUBLIC_API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "include",
  });
  if (!resp.ok) await parseError(resp);
  const text = await resp.text();
  return (text ? JSON.parse(text) : {}) as T;
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const resp = await fetch(`${PUBLIC_API_BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "include",
  });
  if (!resp.ok) await parseError(resp);
  const text = await resp.text();
  return (text ? JSON.parse(text) : {}) as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const resp = await fetch(`${PUBLIC_API_BASE}${path}`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!resp.ok) await parseError(resp);
  return (await resp.json()) as T;
}

// ---------------- Server-side (RSC, routes) ----------------
export async function apiGetServer<T>(path: string): Promise<T | null> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  const cookieHeader = store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const resp = await fetch(`${SERVER_API_BASE}${path}`, {
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    cache: "no-store",
  });
  if (!resp.ok) return null;
  return (await resp.json()) as T;
}
