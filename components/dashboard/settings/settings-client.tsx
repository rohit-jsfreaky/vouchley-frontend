"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/shell/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { type UserProfile, fetchProfile, updateProfile } from "@/lib/api-dashboard";

export function SettingsClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const p = await fetchProfile();
        setProfile(p);
        setName(p.name ?? "");
      } catch (err) {
        toast.error(
          err instanceof ApiError ? err.message : "Couldn't load profile.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    try {
      const updated = await updateProfile({ name: name.trim() || null });
      setProfile(updated);
      setName(updated.name ?? "");
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't save changes.",
      );
    } finally {
      setSaving(false);
    }
  }

  const dirty = profile !== null && name !== (profile.name ?? "");

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage your account preferences."
      />

      {loading ? (
        <SettingsSkeleton />
      ) : profile ? (
        <section className="rounded-2xl border border-border/20 bg-surface p-8 shadow-[var(--shadow-soft)] md:p-10">
          <h3 className="mb-8 font-serif text-2xl text-ink">Your Profile</h3>

          <div className="max-w-2xl space-y-6">
            <div>
              <label
                htmlFor="settings-name"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted"
              >
                Name
              </label>
              <input
                id="settings-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saving}
                placeholder="Your name"
                className="w-full rounded-lg border border-border bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft disabled:opacity-60"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full rounded-lg border border-border bg-muted/40 px-4 py-2.5 text-sm text-ink-muted"
              />
              <p className="mt-1.5 text-xs text-ink-soft">
                This email will be used for verification notifications.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleSave}
                disabled={saving || !dirty}
                className="cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2
                      className="mr-2 size-4 animate-spin"
                      strokeWidth={1.75}
                    />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <section className="rounded-2xl border border-border/20 bg-surface p-8 shadow-[var(--shadow-soft)] md:p-10">
      <Skeleton className="mb-8 h-7 w-36" />
      <div className="max-w-2xl space-y-6">
        <div>
          <Skeleton className="mb-1.5 h-3 w-16" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div>
          <Skeleton className="mb-1.5 h-3 w-28" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </section>
  );
}
