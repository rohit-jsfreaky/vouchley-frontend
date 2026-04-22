/**
 * Typed fetchers for every session-authenticated dashboard endpoint.
 * All use credentials: "include" via apiGet / apiPost.
 */
import { apiGet, apiPatch, apiPost } from "./api";

export type Period = "7d" | "30d" | "mtd" | "all";

export interface DashboardDateRange {
  startDate: string;
  endDate: string;
}

function buildDashboardQuery(params: {
  period?: Period;
  range?: DashboardDateRange;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params.range) {
    query.set("start_date", params.range.startDate);
    query.set("end_date", params.range.endDate);
  } else if (params.period) {
    query.set("period", params.period);
  }
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  return query.toString();
}

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

export function fetchKpis(range: DashboardDateRange) {
  return apiGet<DashboardKpis>(`/dashboard/kpis?${buildDashboardQuery({ range })}`);
}

export function fetchChecksOverTime(range: DashboardDateRange) {
  return apiGet<{ points: ChecksOverTimePoint[] }>(
    `/dashboard/checks-over-time?${buildDashboardQuery({ range })}`,
  );
}

export function fetchScoreDistribution(range: DashboardDateRange) {
  return apiGet<ScoreDistribution>(
    `/dashboard/score-distribution?${buildDashboardQuery({ range })}`,
  );
}

export function fetchRecentChecks(limit = 10, range?: DashboardDateRange, period?: Period) {
  return apiGet<{ checks: RecentCheckItem[] }>(
    `/dashboard/recent-checks?${buildDashboardQuery({ limit, range, period })}`,
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

// ---------- Profile ----------
export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export function fetchProfile() {
  return apiGet<UserProfile>("/dashboard/profile");
}

export function updateProfile(data: { name?: string | null }) {
  return apiPatch<UserProfile>("/dashboard/profile", data);
}

// ---------- Check detail ----------
export interface CheckDetail {
  id: string;
  email: string | null;
  name: string | null;
  company_name: string | null;
  ip_address: string | null;
  score: number | null;
  recommendation: string | null;
  full_response: Record<string, unknown> | null;
  processed_in_ms: number | null;
  cached: boolean;
  credits_charged: number;
  api_key_prefix: string | null;
  api_key_label: string | null;
  created_at: string;
}

export function fetchCheckDetail(checkId: string) {
  return apiGet<CheckDetail>(`/dashboard/checks/${checkId}`);
}
