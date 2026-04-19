/**
 * Typed fetchers for every session-authenticated dashboard endpoint.
 * All use credentials: "include" via apiGet / apiPost.
 */
import { apiGet, apiPost } from "./api";

export type Period = "7d" | "30d" | "mtd" | "all";

// ---------- Dashboard home ----------
export interface KpiValue {
  value: number | null;
  delta_pct: number | null;
}
export interface DashboardKpis {
  total_checks: KpiValue;
  avg_score: KpiValue;
  block_rate: KpiValue;
  avg_latency_ms: KpiValue;
}
export interface ChecksOverTimePoint {
  date: string;
  count: number;
}
export interface ScoreDistribution {
  total: number;
  excellent: number;
  good: number;
  fair: number;
  poor: number;
}
export interface RecentCheckItem {
  id: string;
  email: string | null;
  score: number | null;
  recommendation: string | null;
  ip_country: string | null;
  api_key_label: string | null;
  created_at: string;
}

export function fetchKpis(period: Period) {
  return apiGet<DashboardKpis>(`/dashboard/kpis?period=${period}`);
}

export function fetchChecksOverTime(period: Period) {
  return apiGet<{ points: ChecksOverTimePoint[] }>(
    `/dashboard/checks-over-time?period=${period}`,
  );
}

export function fetchScoreDistribution(period: Period) {
  return apiGet<ScoreDistribution>(
    `/dashboard/score-distribution?period=${period}`,
  );
}

export function fetchRecentChecks(limit = 10) {
  return apiGet<{ checks: RecentCheckItem[] }>(
    `/dashboard/recent-checks?limit=${limit}`,
  );
}

// ---------- API keys ----------
export interface ApiKeyItem {
  id: string;
  label: string | null;
  key_prefix: string;
  environment: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
}

export function fetchApiKeys() {
  return apiGet<{ keys: ApiKeyItem[] }>("/dashboard/api-keys");
}

export function createApiKey(input: { label?: string; environment: "live" | "test" }) {
  return apiPost<{ key: ApiKeyItem; plaintext: string }>(
    "/dashboard/api-keys",
    input,
  );
}

export async function revokeApiKey(id: string) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const resp = await fetch(`${base}/dashboard/api-keys/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    throw new Error(body || `Request failed (${resp.status})`);
  }
}

// ---------- Usage ----------
export interface UsageSummary {
  total_checks: number;
  cached_checks: number;
  billable_checks: number;
  estimated_cost_usd: number;
  credits_used: number;
}

export interface UsageDailyPoint {
  date: string;
  count: number;
}

export interface UsageByKeyItem {
  key_id: string;
  label: string | null;
  key_prefix: string;
  count: number;
}

export interface CacheHitRate {
  total: number;
  hit: number;
  miss: number;
  hit_rate_pct: number;
}

export interface UsageByEndpointItem {
  endpoint: string;
  count: number;
  avg_latency_ms: number | null;
  error_rate_pct: number;
}

export function fetchUsageSummary(period: Period) {
  return apiGet<UsageSummary>(`/dashboard/usage/summary?period=${period}`);
}
export function fetchUsageDaily(period: Period) {
  return apiGet<{ points: UsageDailyPoint[] }>(
    `/dashboard/usage/daily?period=${period}`,
  );
}
export function fetchUsageByKey(period: Period) {
  return apiGet<{ items: UsageByKeyItem[]; total: number }>(
    `/dashboard/usage/by-key?period=${period}`,
  );
}
export function fetchCacheHitRate(period: Period) {
  return apiGet<CacheHitRate>(`/dashboard/usage/cache-hit-rate?period=${period}`);
}
export function fetchUsageByEndpoint(period: Period) {
  return apiGet<{ items: UsageByEndpointItem[] }>(
    `/dashboard/usage/by-endpoint?period=${period}`,
  );
}
