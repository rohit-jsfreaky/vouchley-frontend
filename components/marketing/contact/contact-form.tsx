"use client";

import { ChevronDown, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { TOPIC_OPTIONS, type ContactTopic } from "@/config/contact";
import { cn } from "@/lib/utils";

interface FormState {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
  /** Honeypot — real humans leave this empty. Bots autofill URLs. */
  website: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  topic: "general",
  message: "",
  website: "",
};

function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
}

export function ContactForm() {
  const [state, setState] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    const promise = fetch(`${apiBase()}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    }).then(async (resp) => {
      if (!resp.ok) {
        const body = await resp.text().catch(() => "");
        throw new Error(body || `Request failed (${resp.status})`);
      }
      return resp.json();
    });

    toast.promise(promise, {
      loading: "Sending your message…",
      success: "Message sent. We'll reply within 24 hours.",
      error: (err) =>
        err instanceof Error && err.message.length < 160
          ? err.message
          : "Could not send right now. Try again in a moment.",
    });

    try {
      await promise;
      setState(EMPTY);
    } catch {
      // Error already surfaced via toast; keep the form values so the user can retry.
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-transparent bg-canvas px-4 py-3 text-sm text-ink placeholder:text-ink-soft transition-shadow focus:border-border focus:outline-none focus:shadow-[0_4px_12px_rgba(0,0,0,0.05)]";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-xl bg-surface p-8 shadow-[var(--shadow-editorial)] md:p-12"
      noValidate
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="Full name" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            required
            value={state.name}
            onChange={(e) => setState({ ...state, name: e.target.value })}
            placeholder="Jane Doe"
            className={cn(inputClass, "font-mono")}
            disabled={submitting}
            autoComplete="name"
          />
        </Field>
        <Field label="Email address" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            value={state.email}
            onChange={(e) => setState({ ...state, email: e.target.value })}
            placeholder="jane@company.com"
            className={cn(inputClass, "font-mono")}
            disabled={submitting}
            autoComplete="email"
          />
        </Field>
      </div>

      <Field label="Inquiry topic" htmlFor="topic">
        <div className="relative">
          <select
            id="topic"
            name="topic"
            value={state.topic}
            onChange={(e) =>
              setState({ ...state, topic: e.target.value as ContactTopic })
            }
            className={cn(inputClass, "appearance-none pr-10")}
            disabled={submitting}
          >
            {TOPIC_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
            strokeWidth={1.75}
            aria-hidden
          />
        </div>
      </Field>

      <Field label="Your message" htmlFor="message">
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          minLength={10}
          maxLength={4000}
          value={state.message}
          onChange={(e) => setState({ ...state, message: e.target.value })}
          placeholder="Detail your inquiry here…"
          className={cn(inputClass, "resize-y")}
          disabled={submitting}
        />
      </Field>

      {/* Honeypot — hidden from real users, visible to naive bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website (leave blank)</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={state.website}
          onChange={(e) => setState({ ...state, website: e.target.value })}
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand px-8 text-sm font-semibold text-ink-inverse shadow-[0_4px_14px_0_rgba(184,96,60,0.2)] transition-all hover:bg-brand-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" strokeWidth={1.75} />
              <span>Sending…</span>
            </>
          ) : (
            <>
              <span>Submit message</span>
              <Send className="size-4" strokeWidth={1.75} />
            </>
          )}
        </button>
      </div>

      <p className="pt-2 font-mono text-[10px] uppercase tracking-tighter text-ink-soft">
        By submitting this form, you agree to our{" "}
        <Link href="/privacy" className="text-brand underline hover:text-brand-hover">
          Privacy Policy
        </Link>
        . Responses typically within 24h.
      </p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block font-mono text-xs uppercase tracking-wider text-ink-muted"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
