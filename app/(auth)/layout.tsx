import Link from "next/link";

import { SITE } from "@/config/site";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-8">
        <Link
          href="/"
          className="font-serif text-2xl italic font-semibold text-brand"
          aria-label={`${SITE.name} — home`}
        >
          {SITE.name}
        </Link>
      </div>
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        {children}
      </main>
    </div>
  );
}
