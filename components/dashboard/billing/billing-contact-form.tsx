"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type BillingProfile,
  updateBillingProfile,
} from "@/lib/api-billing";

interface Props {
  profile: BillingProfile | null;
  loading: boolean;
}

export function BillingContactForm({ profile, loading }: Props) {
  const [form, setForm] = useState<BillingProfile>({
    billing_organization: "",
    billing_email: "",
    tax_id: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        billing_organization: profile.billing_organization ?? "",
        billing_email: profile.billing_email ?? "",
        tax_id: profile.tax_id ?? "",
      });
    }
  }, [profile]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await updateBillingProfile({
        billing_organization: form.billing_organization || null,
        billing_email: form.billing_email || null,
        tax_id: form.tax_id || null,
      });
      toast.success("Billing details saved.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Couldn't save details.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="sticky top-8 rounded-xl bg-surface p-8 shadow-[var(--shadow-soft)]">
      <h3 className="mb-6 font-serif text-2xl text-ink">Billing contact</h3>

      {loading && !profile ? (
        <div className="space-y-5">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Field label="Organization" htmlFor="org">
            <input
              id="org"
              type="text"
              value={form.billing_organization ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, billing_organization: e.target.value }))
              }
              placeholder="Company name"
              disabled={saving}
              className={inputClass()}
            />
          </Field>

          <Field label="Billing email" htmlFor="email">
            <input
              id="email"
              type="email"
              value={form.billing_email ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, billing_email: e.target.value }))
              }
              placeholder="accounting@company.com"
              disabled={saving}
              className={inputClass() + " font-mono text-sm"}
            />
          </Field>

          <Field label="Tax ID (optional)" htmlFor="tax">
            <input
              id="tax"
              type="text"
              value={form.tax_id ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, tax_id: e.target.value }))}
              placeholder="VAT / GSTIN / EIN"
              disabled={saving}
              className={inputClass() + " font-mono text-sm"}
            />
          </Field>

          <div className="pt-2">
            <Button
              type="submit"
              variant="secondary"
              size="md"
              disabled={saving}
              className="w-full"
            >
              {saving ? "Saving…" : "Save details"}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}

function inputClass() {
  return "w-full rounded-lg border border-border bg-canvas px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft disabled:opacity-60";
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}
