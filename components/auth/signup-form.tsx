"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { AuthDivider } from "@/components/auth/auth-card";
import { GoogleButton } from "@/components/auth/google-button";
import { OtpInput } from "@/components/auth/otp-input";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { resendOtp, signup, verifyEmailOtp } from "@/lib/auth-client";

type Step = "signup" | "otp";

export function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const verifyFor = params.get("verify");

  const [step, setStep] = useState<Step>(verifyFor ? "otp" : "signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(verifyFor ?? "");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await signup({ name: name.trim() || undefined, email, password });
      toast.success("We sent a 6-digit code. Check your email.");
      setStep("otp");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Couldn't create your account.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    if (otp.length !== 6) {
      toast.error("Enter all 6 digits.");
      return;
    }
    setSubmitting(true);
    try {
      await verifyEmailOtp({ email, otp });
      toast.success("Email verified — welcome to Vouchley.");
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Incorrect code. Try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (resending) return;
    setResending(true);
    try {
      await resendOtp(email);
      toast.success("A new code is on its way.");
    } catch {
      toast.error("Could not resend the code. Try again in a moment.");
    } finally {
      setResending(false);
    }
  }

  if (step === "otp") {
    return (
      <form onSubmit={handleVerify} className="space-y-6" noValidate>
        <p className="text-sm text-ink-muted text-center">
          We sent a 6-digit code to{" "}
          <strong className="text-ink">{email}</strong>. Paste or type it
          below.
        </p>

        <OtpInput value={otp} onChange={setOtp} autoFocus disabled={submitting} />

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={submitting || otp.length !== 6}
          className="w-full"
        >
          {submitting ? "Verifying…" : "Verify & continue"}
        </Button>

        <div className="text-center text-sm text-ink-muted">
          Didn&rsquo;t get it?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-brand hover:text-brand-hover disabled:opacity-60"
          >
            {resending ? "Sending…" : "Resend code"}
          </button>
        </div>

        <div className="text-center text-xs text-ink-soft">
          Wrong email?{" "}
          <button
            type="button"
            onClick={() => setStep("signup")}
            className="underline"
          >
            Start over
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSignup} className="space-y-4" noValidate>
      <GoogleButton label="Sign up with Google" />
      <AuthDivider />

      <Field label="Name" htmlFor="name">
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass()}
          disabled={submitting}
        />
      </Field>

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

      <Field label="Password" htmlFor="password">
        <PasswordInput
          id="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
        />
        <p className="text-xs text-ink-soft">At least 8 characters.</p>
      </Field>

      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={submitting}
        className="w-full"
      >
        {submitting ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-xs text-ink-soft">
        By signing up you agree to our{" "}
        <a href="/terms" className="underline">
          Terms
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
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
      <label htmlFor={htmlFor} className="text-xs font-medium text-ink-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
