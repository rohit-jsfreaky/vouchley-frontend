import { apiGet, apiPost, PUBLIC_API_BASE } from "./api";

export type PackSlug = "starter" | "pro" | "scale";

export interface BillingProfile {
  billing_organization: string | null;
  billing_email: string | null;
  tax_id: string | null;
}

export interface SubscriptionInfo {
  id: string;
  plan: string;
  plan_display_name: string;
  status: string;
  current_period_end: string | null;
  monthly_price_usd: number;
  monthly_credits: number;
}

export interface BillingOverview {
  credits_balance: number;
  has_dodo_customer: boolean;
  credits_used_this_month: number;
  subscription: SubscriptionInfo | null;
  profile: BillingProfile;
}

export interface InvoiceItem {
  id: string;
  payment_id: string | null;
  reason: string;
  pack_slug: string | null;
  pack_name: string | null;
  amount_usd: number;
  credits_added: number;
  created_at: string;
  status: "paid";
}

export function fetchBillingOverview() {
  return apiGet<BillingOverview>("/billing/overview");
}

export function fetchInvoices() {
  return apiGet<{ items: InvoiceItem[] }>("/billing/invoices");
}

export function updateBillingProfile(input: BillingProfile) {
  const body = {
    billing_organization: input.billing_organization || null,
    billing_email: input.billing_email || null,
    tax_id: input.tax_id || null,
  };
  return fetch(`${PUBLIC_API_BASE}/billing/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  }).then(async (r) => {
    if (!r.ok) throw new Error((await r.text()) || r.statusText);
    return (await r.json()) as BillingProfile;
  });
}

export function startCheckout(pack: PackSlug) {
  return apiPost<{ url: string }>("/billing/checkout", { pack });
}

export function openCustomerPortal() {
  return apiPost<{ url: string }>("/billing/portal", {});
}
