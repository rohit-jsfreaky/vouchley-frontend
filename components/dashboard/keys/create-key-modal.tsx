"use client";

import { X } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { type ApiKeyItem, createApiKey } from "@/lib/api-dashboard";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (result: { key: ApiKeyItem; plaintext: string }) => void;
}

export function CreateKeyModal({ open, onClose, onCreated }: Props) {
  const [label, setLabel] = useState("");
  const [environment, setEnvironment] = useState<"live" | "test">("test");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await createApiKey({
        label: label.trim() || undefined,
        environment,
      });
      onCreated(result);
      setLabel("");
      setEnvironment("test");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't create key.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border/30 bg-surface p-8 shadow-[var(--shadow-editorial)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-md p-1 text-ink-muted hover:text-ink"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
        <h2 className="mb-6 font-serif text-3xl text-ink">Create new key</h2>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <label
              htmlFor="key-label"
              className="block text-xs font-semibold uppercase tracking-wider text-ink-muted"
            >
              Label
            </label>
            <input
              id="key-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Production server"
              disabled={submitting}
              className="w-full rounded-lg border border-border bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft"
            />
            <p className="text-xs text-ink-soft">A short name, visible only to you.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
              Environment
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["test", "live"] as const).map((env) => (
                <label
                  key={env}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                    environment === env
                      ? "border-brand bg-brand-soft text-ink"
                      : "border-border bg-canvas text-ink-muted hover:bg-subtle"
                  }`}
                >
                  <input
                    type="radio"
                    name="env"
                    value={env}
                    checked={environment === env}
                    onChange={() => setEnvironment(env)}
                    className="accent-brand"
                    disabled={submitting}
                  />
                  <span className="capitalize">{env}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={submitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? "Creating…" : "Create key"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
