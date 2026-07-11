"use client";

import { Check, ExternalLink, Loader2 } from "lucide-react";
import { forwardRef, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    price: "$19",
    credits: "15,000 credits / month",
    perCredit: "$0.00127 per credit · credits roll over",
    features: [
      "15,000 credits added every month",
      "Unused credits roll over forever",
      "Email support",
    ],
  },
  {
    slug: "pro",
    name: "Pro",
    price: "$49",
    credits: "50,000 credits / month",
    perCredit: "$0.00098 per credit · save 23%",
    features: [
      "50,000 credits added every month",
      "Unused credits roll over forever",
      "Priority email support",
    ],
    highlighted: true,
    badge: "Most popular",
  },
  {
    slug: "scale",
    name: "Scale",
    price: "$99",
    credits: "200,000 credits / month",
    perCredit: "$0.0005 per credit · best rate",
    features: [
      "200,000 credits added every month",
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
      className="rounded-2xl border border-border/20 bg-surface p-6 shadow-[var(--shadow-soft)] md:p-8"
    >
      <div className="mb-8 max-w-2xl">
        <h3 className="text-xl font-semibold tracking-tight text-ink">
          {activePlan ? "Plans" : "Choose a plan"}
        </h3>
        <p className="mt-1.5 text-sm leading-6 text-ink-muted">
          {activePlan
            ? "Change or cancel your plan anytime from the customer portal."
            : "Monthly subscription. Credits roll over and never expire."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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
    ? "border border-accent/50 ring-1 ring-accent/50 shadow-[0_16px_40px_-26px_rgba(22,163,74,0.35)]"
    : pack.highlighted
      ? "border border-brand/50 ring-1 ring-brand/50 shadow-[0_18px_42px_-26px_rgba(61,90,254,0.4)]"
      : "border border-border/60 shadow-[var(--shadow-soft)]";

  return (
    <Card
      className={cn(
        "relative rounded-2xl bg-canvas/50 transition-shadow duration-200 hover:shadow-[var(--shadow-editorial)]",
        ringClass,
      )}
    >
      <CardContent className="flex h-full flex-col p-6 md:p-7">
        {isCurrent ? (
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-transparent bg-accent px-3 py-1 text-[11px] font-semibold text-white">
            Current plan
          </Badge>
        ) : pack.badge ? (
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-transparent bg-brand px-3 py-1 text-[11px] font-semibold text-white">
            {pack.badge}
          </Badge>
        ) : null}

        <h4
          className={cn(
            "mb-1 text-base font-semibold",
            isCurrent
              ? "text-accent"
              : pack.highlighted
                ? "text-brand"
                : "text-ink",
          )}
        >
          {pack.name}
        </h4>
        <p className="mb-5 text-sm leading-6 text-ink-muted">{pack.credits}</p>

        <div className="mb-1.5">
          <span className="text-4xl font-bold tabular-nums tracking-tight text-ink">
            {pack.price}
          </span>
          <span className="ml-1.5 text-sm text-ink-muted">/ month</span>
        </div>
        <p className="mb-7 text-[13px] leading-6 text-ink-soft">{pack.perCredit}</p>

        {isCurrent ? (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onOpenPortal}
            disabled={anyBusy}
            className="mb-6 w-full"
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
          </Button>
        ) : hasActivePlan ? (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onOpenPortal}
            disabled={anyBusy}
            className="mb-6 w-full"
          >
            Change via portal
            <ExternalLink className="size-4" strokeWidth={1.75} />
          </Button>
        ) : (
          <Button
            type="button"
            variant={pack.highlighted ? "primary" : "secondary"}
            size="md"
            onClick={onSubscribe}
            disabled={anyBusy}
            className="mb-6 w-full"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" strokeWidth={1.75} />
                Redirecting…
              </>
            ) : (
              `Subscribe to ${pack.name}`
            )}
          </Button>
        )}

        <ul className="mt-auto space-y-2.5 border-t border-border/60 pt-5 text-sm leading-6 text-ink-muted">
          {pack.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <span
                className={cn(
                  "mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full",
                  isCurrent
                    ? "bg-accent-soft text-accent"
                    : "bg-brand-soft text-brand",
                )}
              >
                <Check className="size-3" strokeWidth={2.5} aria-hidden />
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
