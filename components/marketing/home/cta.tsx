import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { FINAL_CTA } from "@/config/home";
import type { User } from "@/lib/auth-client";

export function FinalCta({ user }: { user: User | null }) {
  return (
    <section className="bg-canvas px-6 py-32 md:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-8 font-serif text-5xl text-ink md:text-6xl">
          {FINAL_CTA.title}
        </h2>
        <div className="mt-12 flex justify-center">
          <Link
            href={user ? "/dashboard" : FINAL_CTA.primaryCta.href}
            className={buttonStyles({ variant: "primary", size: "lg" })}
          >
            {user ? "Go to dashboard" : FINAL_CTA.primaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
