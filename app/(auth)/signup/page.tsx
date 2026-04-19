import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Sign up — ${SITE.name}`,
};

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Start with 100 free credits. No card required."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand hover:text-brand-hover">
            Log in →
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
    </AuthCard>
  );
}
