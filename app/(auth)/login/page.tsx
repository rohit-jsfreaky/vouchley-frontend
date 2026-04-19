import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Log in — ${SITE.name}`,
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to your Vouchley account."
      footer={
        <>
          Don&rsquo;t have an account?{" "}
          <Link href="/signup" className="font-medium text-brand hover:text-brand-hover">
            Sign up →
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
