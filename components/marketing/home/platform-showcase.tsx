"use client";

import {
  CreditCard,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  Lock,
  Settings,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Verdict = "approve" | "review" | "block";

type LiveRow = {
  id: number;
  email: string;
  score: number;
  verdict: Verdict;
  ms: number;
};

/** Scored events the showcase streams through — mirrors real API behaviour. */
const EVENTS: Omit<LiveRow, "id">[] = [
  { email: "sarah.chen@stripe.com", score: 86, verdict: "approve", ms: 412 },
  { email: "temp9981@10minutemail.com", score: 0, verdict: "block", ms: 388 },
  { email: "james.wilson@linear.app", score: 91, verdict: "approve", ms: 367 },
  { email: "quickreg@yopmail.com", score: 40, verdict: "review", ms: 405 },
  { email: "priya.patel@figma.com", score: 88, verdict: "approve", ms: 393 },
  { email: "admin@newshellco.xyz", score: 12, verdict: "block", ms: 421 },
  { email: "hans.mueller@gmail.com", score: 82, verdict: "approve", ms: 84 },
  { email: "throwaway@guerrillamail.com", score: 35, verdict: "review", ms: 398 },
  { email: "emma.brown@vercel.com", score: 93, verdict: "approve", ms: 91 },
  { email: "info@randomstore12345.tk", score: 8, verdict: "block", ms: 416 },
  { email: "yuki.tanaka@gmail.com", score: 79, verdict: "approve", ms: 88 },
  { email: "tester@mailinator.com", score: 38, verdict: "review", ms: 402 },
];

const VERDICT_PILL: Record<Verdict, string> = {
  approve: "bg-accent-soft text-accent",
  review: "bg-warning-bg text-warning",
  block: "bg-danger-bg text-danger",
};

const SCORE_BAR: Record<Verdict, string> = {
  approve: "bg-accent",
  review: "bg-warning",
  block: "bg-danger",
};

const SIDEBAR = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ListChecks, label: "Checks", active: false },
  { icon: KeyRound, label: "API Keys", active: false },
  { icon: CreditCard, label: "Billing", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const VISIBLE_ROWS = 6;
const STREAM_INTERVAL_MS = 2400;

/**
 * Hero showcase: a browser window framing a live recreation of the Vouchley
 * dashboard, with verification rows streaming in and stats ticking up.
 * Purely decorative — built from the same data shapes the real product uses.
 */
export function PlatformShowcase() {
  const idRef = useRef(0);
  const cursorRef = useRef(0);

  const [rows, setRows] = useState<LiveRow[]>(() =>
    EVENTS.slice(0, VISIBLE_ROWS).map((e, i) => ({ ...e, id: i })),
  );
  const [total, setTotal] = useState(1248);
  const [blocked, setBlocked] = useState(57);

  useEffect(() => {
    idRef.current = VISIBLE_ROWS;
    cursorRef.current = VISIBLE_ROWS % EVENTS.length;

    const timer = setInterval(() => {
      const next = EVENTS[cursorRef.current];
      cursorRef.current = (cursorRef.current + 1) % EVENTS.length;

      setRows((prev) =>
        [{ ...next, id: idRef.current++ }, ...prev].slice(0, VISIBLE_ROWS),
      );
      setTotal((t) => t + 1);
      if (next.verdict === "block") setBlocked((b) => b + 1);
    }, STREAM_INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-6xl select-none">
      {/* Colorful glow emanating from behind the window */}
      <div
        aria-hidden
        className="absolute -inset-x-10 -inset-y-8 rounded-[3rem] bg-[radial-gradient(closest-side,rgba(61,90,254,0.28),rgba(156,139,255,0.16),transparent)] blur-2xl"
      />

      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_40px_90px_-30px_rgba(17,19,28,0.35)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-border bg-subtle/70 px-4 py-2.5">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="size-3 rounded-full bg-[#f5655b]" />
            <span className="size-3 rounded-full bg-[#f6bd3a]" />
            <span className="size-3 rounded-full bg-[#43c645]" />
          </div>
          <div className="mx-auto flex h-7 w-full max-w-sm items-center justify-center gap-1.5 rounded-full border border-border bg-surface px-3 text-xs text-ink-muted">
            <Lock className="size-3" strokeWidth={2} />
            vouchley.getrevlio.com/dashboard
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent sm:flex">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
            </span>
            Live
          </span>
        </div>

        <div className="flex">
          {/* Mini sidebar */}
          <aside className="hidden w-44 shrink-0 border-r border-border bg-canvas/60 p-3 md:block">
            <p className="px-2.5 pb-3 pt-1 text-base font-bold tracking-tight text-ink">
              Vouchley
            </p>
            <nav className="flex flex-col gap-0.5">
              {SIDEBAR.map(({ icon: Icon, label, active }) => (
                <span
                  key={label}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium",
                    active
                      ? "bg-brand-soft text-brand"
                      : "text-ink-muted",
                  )}
                >
                  <Icon className="size-3.5" strokeWidth={1.75} />
                  {label}
                </span>
              ))}
            </nav>
          </aside>

          {/* Main panel */}
          <div className="min-w-0 flex-1 p-4 md:p-5">
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard label="Total checks" value={total.toLocaleString()} live />
              <StatCard label="Approval rate" value="78.4%" />
              <StatCard label="Blocked today" value={String(blocked)} live />
              <StatCard label="p95 latency" value="412ms" />
            </div>

            {/* Live verifications table */}
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <div className="flex items-center justify-between border-b border-border bg-subtle/50 px-4 py-2.5">
                <span className="text-[13px] font-semibold text-ink">
                  Recent verifications
                </span>
                <span className="font-mono text-[11px] text-ink-soft">
                  streaming
                </span>
              </div>

              <ul>
                {rows.map((row, i) => (
                  <li
                    key={row.id}
                    className={cn(
                      "flex items-center gap-3 border-b border-border/70 px-4 py-2.5 last:border-b-0",
                      i === 0 &&
                        "animate-in fade-in slide-in-from-top-2 bg-brand-soft/40 duration-500",
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-ink">
                      {row.email}
                    </span>

                    <span className="hidden w-28 items-center gap-2 sm:flex">
                      <span className="w-6 text-right text-[12.5px] font-semibold tabular-nums text-ink">
                        {row.score}
                      </span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <span
                          className={cn("block h-1.5 rounded-full", SCORE_BAR[row.verdict])}
                          style={{ width: `${Math.max(row.score, 4)}%` }}
                        />
                      </span>
                    </span>

                    <span
                      className={cn(
                        "w-[4.5rem] rounded-full px-2 py-0.5 text-center text-[10px] font-bold uppercase tracking-wider",
                        VERDICT_PILL[row.verdict],
                      )}
                    >
                      {row.verdict}
                    </span>

                    <span className="hidden w-14 text-right font-mono text-[11px] text-ink-soft lg:block">
                      {row.ms}ms
                    </span>

                    <span className="hidden w-16 text-right text-[11px] text-ink-soft sm:block">
                      {i === 0 ? "just now" : `${i * 24}s ago`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  live,
}: {
  label: string;
  value: string;
  live?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-canvas/60 px-3.5 py-3">
      <p className="flex items-center gap-1.5 text-[11px] font-medium text-ink-muted">
        {label}
        {live && <span className="size-1.5 rounded-full bg-accent" />}
      </p>
      <p className="mt-1 text-xl font-bold tabular-nums tracking-tight text-ink">
        {value}
      </p>
    </div>
  );
}
