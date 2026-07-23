"use client";

import { ChevronDown, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { VerifyResultCard } from "@/components/dashboard/verify/verify-result-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { type VerifyResult, verifySingle } from "@/lib/api-verify";

export function SingleVerify({
  balance,
  onSpent,
}: {
  balance: number | null;
  onSpent: () => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [ip, setIp] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);

  const noCredits = balance !== null && balance <= 0;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || loading) return;
    if (noCredits) {
      toast.error("You're out of credits.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await verifySingle({
        email: email.trim(),
        name: name.trim() || null,
        company_name: company.trim() || null,
        ip_address: ip.trim() || null,
      });
      setResult(res);
      if (!res.cached) onSpent();
    } catch (err) {
      if (err instanceof ApiError && err.status === 402) {
        toast.error("You're out of credits. Add credits to keep verifying.");
      } else {
        toast.error(err instanceof Error ? err.message : "Verification failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="v-email">Email to verify</Label>
            <Input
              id="v-email"
              type="email"
              inputMode="email"
              autoComplete="off"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowMore((s) => !s)}
            className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-ink"
          >
            <ChevronDown
              className={`size-4 transition-transform ${showMore ? "rotate-180" : ""}`}
            />
            Optional context (name, company, IP)
          </button>

          {showMore && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="v-name">Name</Label>
                <Input
                  id="v-name"
                  autoComplete="off"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="v-company">Company</Label>
                <Input
                  id="v-company"
                  autoComplete="off"
                  placeholder="Acme Inc"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="v-ip">Signup IP</Label>
                <Input
                  id="v-ip"
                  autoComplete="off"
                  placeholder="203.0.113.10"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-xs text-ink-soft">
              Uses <strong className="text-ink-muted">1 credit</strong> per new
              email. Repeat checks of the same input are cached and free.
            </p>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading || !email.trim() || noCredits}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Verifying
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Verify
                </>
              )}
            </Button>
          </div>

          {noCredits && (
            <p className="text-sm text-danger">
              You&apos;re out of credits.{" "}
              <Link href="/dashboard/billing" className="font-medium underline">
                Add credits
              </Link>{" "}
              to run checks.
            </p>
          )}
        </form>
      </Card>

      {result && <VerifyResultCard result={result} />}
    </div>
  );
}
