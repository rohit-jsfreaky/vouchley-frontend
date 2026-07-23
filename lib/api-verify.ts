/**
 * Dashboard verifier — session-authed calls to the backend. Runs against the
 * signed-in user's own credit balance (1 credit per non-cached check). These
 * hit the same verification engine as the API, so results are identical to
 * what a customer would get through /v1/verify.
 */
import { apiGet, apiPost } from "./api";

export interface VerifyInput {
  email: string;
  name?: string | null;
  company_name?: string | null;
  ip_address?: string | null;
}

export interface EmailSignals {
  valid: boolean;
  disposable: boolean;
  free_provider: boolean;
  role_based: boolean;
  mx_record: boolean;
}

export interface CompanySignals {
  domain: string | null;
  domain_alive: boolean;
  domain_age_days: number | null;
  has_website: boolean;
  industry_guess: string | null;
  size_estimate: string | null;
}

export interface PersonSignals {
  name_matches_email: boolean;
  likely_at_company: boolean | null;
  confidence: number;
}

export interface IpSignals {
  country: string | null;
  region: string | null;
  asn: number | null;
  asn_org: string | null;
  is_datacenter: boolean | null;
  is_vpn: boolean | null;
  is_proxy: boolean | null;
  is_tor: boolean | null;
  is_abuser: boolean | null;
  connection_type: string | null;
  risk_score: number | null;
  risk_reasons: string[];
}

export type Recommendation = "approve" | "review" | "block";

export interface VerifyResult {
  request_id: string;
  score: number;
  recommendation: Recommendation;
  email: EmailSignals;
  company: CompanySignals;
  person: PersonSignals;
  ip: IpSignals;
  flags: string[];
  reasoning: string;
  cached: boolean;
  processed_in_ms: number;
}

export interface BulkJobSubmitted {
  job_id: string;
  status: "queued" | "running" | "completed" | "failed";
  total: number;
}

export interface BulkJobItem {
  email?: string;
  score?: number | null;
  recommendation?: Recommendation | null;
  status?: string;
  error?: string | null;
  [key: string]: unknown;
}

export interface BulkJobStatus {
  job_id: string;
  user_id: string;
  status: "queued" | "running" | "completed" | "failed";
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
  credits_used: number;
  created_at: string;
  completed_at: string | null;
  items: BulkJobItem[];
}

export function verifySingle(input: VerifyInput) {
  return apiPost<VerifyResult>("/dashboard/verify", input);
}

export function submitBulkVerify(items: VerifyInput[]) {
  return apiPost<BulkJobSubmitted>("/dashboard/verify/bulk", { items });
}

export function fetchBulkVerifyJob(jobId: string) {
  return apiGet<BulkJobStatus>(`/dashboard/verify/jobs/${jobId}`);
}
