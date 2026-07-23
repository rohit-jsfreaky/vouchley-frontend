"use client";

import { Loader2, Lock } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminAuthError, adminLogin, adminMe } from "@/lib/api-admin";

type Status = "loading" | "login" | "authed";

export function AdminConsole() {
  const [status, setStatus] = useState<Status>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    adminMe()
      .then(() => setStatus("authed"))
      .catch((err) => {
        if (err instanceof AdminAuthError) setStatus("login");
        else {
          setStatus("login");
        }
      });
  }, []);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await adminLogin(email.trim(), password);
      setStatus("authed");
      setPassword("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Login failed. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-ink-soft" />
      </div>
    );
  }

  if (status === "login") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-sm p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-border bg-subtle">
              <Lock className="size-5 text-ink-muted" />
            </div>
            <h1 className="text-lg font-semibold text-ink">Vouchley Admin</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Founder access only.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                placeholder="you@getrevlio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              disabled={submitting || !email.trim() || !password}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Signing in
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return <AdminDashboard onSignedOut={() => setStatus("login")} />;
}
