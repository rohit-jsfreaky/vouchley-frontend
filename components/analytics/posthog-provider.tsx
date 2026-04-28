"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHJsProvider } from "posthog-js/react";
import { Suspense, useEffect } from "react";

/**
 * Initializes PostHog on first client render and tracks page views as the
 * user navigates the App Router. No-op if NEXT_PUBLIC_POSTHOG_KEY is unset
 * (e.g. local dev), so analytics doesn't pollute logs in development.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    // Guard against re-init in React strict-mode dev double-render
    if ((posthog as unknown as { __loaded?: boolean }).__loaded) return;

    posthog.init(key, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: false, // we track manually below for App Router
      capture_pageleave: true,
      autocapture: true,
    });
  }, []);

  return (
    <PHJsProvider client={posthog}>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </PHJsProvider>
  );
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    if (!(posthog as unknown as { __loaded?: boolean }).__loaded) return;

    let url = window.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}
