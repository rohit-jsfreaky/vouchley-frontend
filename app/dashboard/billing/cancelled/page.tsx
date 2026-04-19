import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { XCircle } from "lucide-react";

import { buttonStyles } from "@/components/ui/button";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";
import { getSessionServer } from "@/lib/auth-client";

export const metadata: Metadata = {
  title: `Payment cancelled — ${SITE.name}`,
};

export default async function BillingCancelledPage() {
  const user = await getSessionServer();
  if (!user) redirect("/login");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-[520px] rounded-xl bg-surface p-10 shadow-[var(--shadow-editorial)] md:p-14 text-center">
        <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-full bg-subtle">
          <XCircle className="size-10 text-ink-muted" strokeWidth={1.75} />
        </div>
        <h1 className="mb-4 font-serif text-4xl tracking-tight text-ink">
          Payment cancelled
        </h1>
        <p className="mb-10 text-lg text-ink-muted">
          No charge was made. Your credit balance is unchanged. Try again whenever
          you&rsquo;re ready.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/billing"
            className={cn(buttonStyles({ variant: "primary", size: "md" }))}
          >
            Back to billing
          </Link>
          <Link
            href="/dashboard"
            className={cn(buttonStyles({ variant: "secondary", size: "md" }))}
          >
            Dashboard home
          </Link>
        </div>
      </div>
    </main>
  );
}
