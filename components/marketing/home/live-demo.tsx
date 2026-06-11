"use client";

import { useEffect, useRef, useState } from "react";

import { DEMO_SCENARIOS, type DemoScenario } from "@/config/home";
import { cn } from "@/lib/utils";

type Phase = "typing" | "processing" | "result";

const VERDICT_STYLE: Record<DemoScenario["recommendation"], string> = {
  approve: "bg-accent-soft text-accent",
  review: "bg-warning-bg text-warning",
  block: "bg-danger-bg text-danger",
};

const BAR_STYLE: Record<DemoScenario["recommendation"], string> = {
  approve: "bg-accent",
  review: "bg-warning",
  block: "bg-danger",
};

/**
 * Animated product demo: cycles through realistic verify calls — types the
 * request, "processes", then reveals the scored response with a count-up.
 */
export function LiveDemo() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState("");
  const [score, setScore] = useState(0);
  const rafRef = useRef<number>(0);

  const scenario = DEMO_SCENARIOS[scenarioIdx];

  // Phase machine: typing → processing → result → (hold) → next scenario
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (phase === "typing") {
      setTyped("");
      setScore(0);
      const email = scenario.email;
      for (let i = 1; i <= email.length; i++) {
        timers.push(setTimeout(() => setTyped(email.slice(0, i)), 200 + i * 32));
      }
      timers.push(
        setTimeout(() => setPhase("processing"), 200 + email.length * 32 + 350),
      );
    }

    if (phase === "processing") {
      timers.push(setTimeout(() => setPhase("result"), 850));
    }

    if (phase === "result") {
      // Count the score up with rAF
      const start = performance.now();
      const dur = 700;
      const target = scenario.score;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        setScore(Math.round(eased * target));
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

      timers.push(
        setTimeout(() => {
          setScenarioIdx((i) => (i + 1) % DEMO_SCENARIOS.length);
          setPhase("typing");
        }, 3600),
      );
    }

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [phase, scenarioIdx, scenario.email, scenario.score]);

  const showResult = phase === "result";

  return (
    <div className="relative mx-auto w-full max-w-[480px]">
      {/* Glow behind the card */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[2rem] bg-brand/12 blur-3xl"
      />

      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_60px_-24px_rgba(17,19,28,0.18)]">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-border bg-subtle/60 px-5 py-3">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-danger/70" />
            <span className="size-2.5 rounded-full bg-warning/70" />
            <span className="size-2.5 rounded-full bg-accent/70" />
          </div>
          <span className="font-mono text-xs text-ink-muted">
            POST /v1/verify
          </span>
        </div>

        {/* Request */}
        <div className="border-b border-border px-5 py-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
            Request
          </p>
          <pre className="font-mono text-[13px] leading-6 text-ink">
            <span className="text-ink-soft">{"{"}</span>
            {"\n"}
            {"  "}
            <span className="text-brand">&quot;email&quot;</span>
            <span className="text-ink-soft">: </span>
            <span>
              &quot;{typed}
              {phase === "typing" && (
                <span className="ml-px inline-block h-[14px] w-[7px] animate-pulse bg-brand align-middle" />
              )}
              &quot;
            </span>
            <span className="text-ink-soft">,</span>
            {"\n"}
            {"  "}
            <span className="text-brand">&quot;ip_address&quot;</span>
            <span className="text-ink-soft">: </span>
            <span>&quot;{scenario.ip}&quot;</span>
            {"\n"}
            <span className="text-ink-soft">{"}"}</span>
          </pre>
        </div>

        {/* Response */}
        <div className="px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
              Response
            </p>
            <span
              className={cn(
                "font-mono text-[11px] transition-opacity duration-300",
                showResult ? "text-accent opacity-100" : "text-ink-soft opacity-60",
              )}
            >
              {phase === "processing"
                ? "running checks…"
                : showResult
                  ? `200 OK · ${scenario.ms}ms`
                  : "—"}
            </span>
          </div>

          <div
            className={cn(
              "transition-all duration-500",
              showResult ? "translate-y-0 opacity-100" : "translate-y-2 opacity-30",
            )}
          >
            {/* Score row */}
            <div className="mb-3 flex items-center gap-4">
              <span className="text-4xl font-semibold tabular-nums tracking-tight text-ink">
                {score}
              </span>
              <div className="flex-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-[width] duration-700 ease-out",
                      BAR_STYLE[scenario.recommendation],
                    )}
                    style={{ width: showResult ? `${Math.max(scenario.score, 3)}%` : "0%" }}
                  />
                </div>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-transform duration-300",
                  VERDICT_STYLE[scenario.recommendation],
                  showResult ? "scale-100" : "scale-75 opacity-0",
                )}
              >
                {scenario.recommendation}
              </span>
            </div>

            <p className="font-mono text-xs leading-5 text-ink-muted">
              &quot;{scenario.reasoning}&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
