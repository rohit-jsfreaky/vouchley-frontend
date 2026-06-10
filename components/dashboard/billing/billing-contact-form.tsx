"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <Card className="sticky top-8 border-border/20 p-8 shadow-[var(--shadow-soft)]">
      <CardHeader className="p-0">
        <CardTitle className="mb-6 font-serif text-2xl font-normal text-ink">
          Billing contact
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading && !profile ? (
          <div className="space-y-5">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="org" className="font-semibold text-ink">
                Organization
              </Label>
              <Input
                id="org"
                type="text"
                value={form.billing_organization ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, billing_organization: e.target.value }))
                }
                placeholder="Company name"
                disabled={saving}
                className="h-11 bg-canvas px-4 text-[15px] text-ink placeholder:text-ink-soft"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-semibold text-ink">
                Billing email
              </Label>
              <Input
                id="email"
                type="email"
                value={form.billing_email ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, billing_email: e.target.value }))
                }
                placeholder="accounting@company.com"
                disabled={saving}
                className="h-11 bg-canvas px-4 font-mono text-sm text-ink placeholder:text-ink-soft"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tax" className="font-semibold text-ink">
                Tax ID (optional)
              </Label>
              <Input
                id="tax"
                type="text"
                value={form.tax_id ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tax_id: e.target.value }))
                }
                placeholder="VAT / GSTIN / EIN"
                disabled={saving}
                className="h-11 bg-canvas px-4 font-mono text-sm text-ink placeholder:text-ink-soft"
              />
            </div>

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
      </CardContent>
    </Card>
  );
}
