/**
 * Admin console API client. Uses its own fetch wrapper (not lib/api.ts) so a
 * 401 surfaces the admin login form instead of redirecting to the customer
 * /login page. Session is a separate HttpOnly admin cookie set by the backend.
 */
import { PUBLIC_API_BASE } from "./api";

export class AdminAuthError extends Error {}

async function adminFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const resp = await fetch(`${PUBLIC_API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    credentials: "include",
  });
  if (resp.status === 401) {
    throw new AdminAuthError("Not authenticated");
  }
  if (!resp.ok) {
    let message = resp.statusText;
    try {
      const body = await resp.json();
      message = body?.detail ?? message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  const text = await resp.text();
  return (text ? JSON.parse(text) : {}) as T;
}

export interface AdminStats {
  total_users: number;
  verified_users: number;
  new_users_7d: number;
  active_subscriptions: number;
  total_credits_balance: number;
  total_credits_granted: number;
  total_credits_used: number;
  total_checks: number;
  checks_30d: number;
}

export interface AdminUserRow {
  id: string;
  email: string;
  name: string | null;
  verified: boolean;
  credits_balance: number;
  credits_used: number;
  credits_granted: number;
  total_checks: number;
  plan: string | null;
  plan_status: string | null;
  last_activity_at: string | null;
  created_at: string;
}

export interface AdminUsersResponse {
  users: AdminUserRow[];
  total: number;
  limit: number;
  offset: number;
}

export function adminMe() {
  return adminFetch<{ email: string }>("/admin/me");
}

export function adminLogin(email: string, password: string) {
  return adminFetch<{ email: string }>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function adminLogout() {
  return adminFetch<{ ok: boolean }>("/admin/logout", { method: "POST" });
}

export function adminStats() {
  return adminFetch<AdminStats>("/admin/stats");
}

export function adminUsers(params: {
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const q = new URLSearchParams();
  if (params.search) q.set("search", params.search);
  if (params.limit != null) q.set("limit", String(params.limit));
  if (params.offset != null) q.set("offset", String(params.offset));
  return adminFetch<AdminUsersResponse>(`/admin/users?${q.toString()}`);
}
