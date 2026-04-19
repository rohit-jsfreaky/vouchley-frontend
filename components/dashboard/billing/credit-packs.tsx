"use client";

import { Check, ExternalLink, Loader2 } from "lucide-react";
import { forwardRef, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import {
  type PackSlug,
  type SubscriptionInfo,
  openCustomerPortal,
  startCheckout,
} from "@/lib/api-billing";
import { cn } from "@/lib/utils";

interface PackDef {
  slug: PackSlug;
  name: string;
  price: string;
  credits: string;
  perCredit: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

const PACKS: PackDef[] = [
  {
    slug: "starter",
    name: "Starter",
    price: "$29",
    credits: "3,000 credits / month",
    perCredit: "$0.0097 per credit · credits roll over",
    features: [
      "3,000 credits added every month",
      "Unused credits roll over forever",
      "Email support",
    ],
  },
  {
    slug: "pro",
    name: "Pro",
    price: "$99",
    credits: "12,000 credits / month",
    perCredit: "$0.00825 per credit · 15% savings",
    features: [
      "12,000 credits added every month",
      "Unused credits roll over forever",
      "Priority email support",
    ],
    highlighted: true,
    badge: "Most popular",
  },
  {
    slug: "scale",
    name: "Scale",
    price: "$299",
    credits: "40,000 credits / month",
    perCredit: "$0.00748 per credit · best rate",
    features: [
      "40,000 credits added every month",
      "Unused credits roll over forever",
      "Slack shared channel",
    ],
  },
];

interface Props {
  subscription: SubscriptionInfo | null;
}

export const CreditPacks = forwardRef<HTMLElement, Props>(function CreditPacks(
  { subscription },
  ref,
) {
  const [busy, setBusy] = useState<"checkout" | "portal" | null>(null);
  const [busyPack, setBusyPack] = useState<PackSlug | null>(null);

  const activePlan = subscription?.status === "active" ? subscription.plan : null;

  async function handleSubscribe(pack: PackSlug) {
    if (busy) return;
    setBusy("checkout");
    setBusyPack(pack);
    try {
      const { url } = await startCheckout(pack);
      window.location.href = url;
    } catch (err) {
      setBusy(null);
      setBusyPack(null);
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Couldn't open checkout. Try again.",
      );
    }
  }

  async function handleOpenPortal() {
    if (busy) return;
    setBusy("portal");
    try {
      const { url } = await openCustomerPortal();
      window.location.href = url;
    } catch (err) {
      setBusy(null);
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Couldn't open customer portal.",
      );
    }
  }

  return (
    <section
      ref={ref}
      className="rounded-xl bg-surface p-8 shadow-[var(--shadow-soft)]"
    >
      <div className="mb-6">
        <h3 className="font-serif text-2xl text-ink">
          {activePlan ? "Plans" : "Choose a plan"}
        </h3>
        <p className="mt-1 text-sm text-ink-muted">
          {activePlan
            ? "Change or cancel your plan anytime from the customer portal."
            : "Monthly subscription. Credits roll over and never expire."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PACKS.map((pack) => {
          const isCurrent = pack.slug === activePlan;
          return (
            <PackCard
              key={pack.slug}
              pack={pack}
              isCurrent={isCurrent}
              hasActivePlan={!!activePlan}
              loading={busy === "checkout" && busyPack === pack.slug}
              portalLoading={busy === "portal" && isCurrent}
              anyBusy={busy !== null}
              onSubscribe={() => handleSubscribe(pack.slug)}
              onOpenPortal={handleOpenPortal}
            />
          );
        })}
      </div>
    </section>
  );
});

function PackCard({
  pack,
  isCurrent,
  hasActivePlan,
  loading,
  portalLoading,
  anyBusy,
  onSubscribe,
  onOpenPortal,
}: {
  pack: PackDef;
  isCurrent: boolean;
  hasActivePlan: boolean;
  loading: boolean;
  portalLoading: boolean;
  anyBusy: boolean;
  onSubscribe: () => void;
  onOpenPortal: () => void;
}) {
  const ringClass = isCurrent
    ? "border-2 border-accent"
    : pack.highlighted
      ? "border-2 border-brand"
      : "border border-border/40";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl bg-canvas p-6",
        ringClass,
      )}
    >
      {isCurrent ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-inverse">
          Current plan
        </span>
      ) : pack.badge ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-inverse">
          {pack.badge}
        </span>
      ) : null}

      <h4
        className={cn(
          "mb-1 font-serif text-xl font-semibold",
          isCurrent
            ? "text-accent"
            : pack.highlighted
              ? "text-brand"
              : "text-ink",
        )}
      >
        {pack.name}
      </h4>
      <p className="mb-4 text-sm text-ink-muted">{pack.credits}</p>

      <div className="mb-4">
        <span className="font-serif text-4xl font-bold text-ink">
          {pack.price}
        </span>
        <span className="ml-1 text-sm text-ink-muted">/ month</span>
      </div>
      <p className="mb-4 text-xs text-ink-soft">{pack.perCredit}</p>

      {isCurrent ? (
        <button
          type="button"
          onClick={onOpenPortal}
          disabled={anyBusy}
          className="mb-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface text-sm font-semibold text-ink hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-60"
        >
          {portalLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" strokeWidth={1.75} />
              Opening portal…
            </>
          ) : (
            <>
              Manage plan
              <ExternalLink className="size-4" strokeWidth={1.75} />
            </>
          )}
        </button>
      ) : hasActivePlan ? (
        <button
          type="button"
          onClick={onOpenPortal}
          disabled={anyBusy}
          className="mb-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface text-sm font-semibold text-ink hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-60"
        >
          Change via portal
          <ExternalLink className="size-4" strokeWidth={1.75} />
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubscribe}
          disabled={anyBusy}
          className={cn(
            "mb-5 inline-flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
            pack.highlighted
              ? "bg-brand text-ink-inverse hover:bg-brand-hover"
              : "border border-border bg-surface text-ink hover:bg-subtle",
          )}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" strokeWidth={1.75} />
              Redirecting…
            </>
          ) : (
            `Subscribe to ${pack.name}`
          )}
        </button>
      )}

      <ul className="space-y-2 text-sm text-ink-muted">
        {pack.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check
              className="mt-0.5 size-4 shrink-0 text-brand"
              strokeWidth={2.5}
              aria-hidden
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
