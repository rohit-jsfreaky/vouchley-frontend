"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ApiError } from "@/lib/api";
import { type ApiKeyItem, createApiKey } from "@/lib/api-dashboard";
import { cn } from "@/lib/utils";

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
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent showCloseButton={!submitting}>
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-normal text-ink">
            Create new key
          </DialogTitle>
          <DialogDescription className="text-ink-muted">
            Create a new API credential for your application environment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <Label
              htmlFor="key-label"
              className="font-mono text-xs uppercase tracking-wider text-ink-muted"
            >
              Label
            </Label>
            <Input
              id="key-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Production server"
              disabled={submitting}
              className="h-11 rounded-lg border-border bg-canvas px-4 text-sm text-ink placeholder:text-ink-soft focus-visible:border-brand focus-visible:ring-brand-soft"
            />
            <p className="text-xs text-ink-soft">A short name, visible only to you.</p>
          </div>

          <div>
            <Label className="mb-2 font-mono text-xs uppercase tracking-wider text-ink-muted">
              Environment
            </Label>
            <RadioGroup
              value={environment}
              onValueChange={(v) => setEnvironment(v as "live" | "test")}
              disabled={submitting}
              className="grid-cols-2 gap-3"
            >
              {(["test", "live"] as const).map((env) => (
                <Label
                  key={env}
                  htmlFor={`env-${env}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium capitalize transition-colors",
                    environment === env
                      ? "border-brand bg-brand-soft text-ink"
                      : "border-border bg-canvas text-ink-muted hover:bg-subtle",
                  )}
                >
                  <RadioGroupItem id={`env-${env}`} value={env} />
                  <span>{env}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <DialogFooter>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
