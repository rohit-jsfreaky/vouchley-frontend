"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
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
    <Modal
      open={open}
      onClose={onClose}
      title="Create new key"
      description="Create a new API credential for your application environment."
      size="sm"
      dismissible={!submitting}
    >
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
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-muted">
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
            className="flex-1 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={submitting}
            className="flex-1 cursor-pointer"
          >
            {submitting ? "Creating…" : "Create key"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
