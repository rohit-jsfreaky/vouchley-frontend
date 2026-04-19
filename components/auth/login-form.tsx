"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { AuthDivider } from "@/components/auth/auth-card";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { loginWithPassword } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await loginWithPassword({ email, password });
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        toast.error("Email not verified. Check your inbox for the code.");
        router.push(`/signup?verify=${encodeURIComponent(email)}`);
        return;
      }
      const message =
        err instanceof ApiError ? err.message : "Couldn't sign you in.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <GoogleButton />
      <AuthDivider />

      <Field label="Email" htmlFor="email">
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass()}
          disabled={submitting}
        />
      </Field>

      <Field
        label="Password"
        htmlFor="password"
        action={
          <Link
            href="/forgot-password"
            className="text-xs text-brand hover:text-brand-hover"
          >
            Forgot?
          </Link>
        }
      >
        <PasswordInput
          id="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
        />
      </Field>

      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={submitting}
        className="w-full"
      >
        {submitting ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}

function inputClass() {
  return "w-full rounded-lg border border-border bg-canvas px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft disabled:opacity-60";
}

function Field({
  label,
  htmlFor,
  action,
  children,
}: {
  label: string;
  htmlFor: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="text-xs font-medium text-ink-muted"
        >
          {label}
        </label>
        {action}
      </div>
      {children}
    </div>
  );
}
