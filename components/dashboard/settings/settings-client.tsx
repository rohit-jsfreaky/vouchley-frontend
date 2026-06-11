"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/shell/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <Card className="gap-6 border-border/20 p-6 shadow-[var(--shadow-soft)] md:p-8">
          <div>
            <h3 className="text-lg font-semibold text-ink">Profile</h3>
            <p className="mt-0.5 text-sm text-ink-muted">
              How you appear across Vouchley.
            </p>
          </div>

          <div className="max-w-2xl space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="settings-name" className="text-sm font-medium text-ink">
                Name
              </Label>
              <Input
                id="settings-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saving}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="settings-email" className="text-sm font-medium text-ink">
                Email address
              </Label>
              <Input
                id="settings-email"
                type="email"
                value={profile.email}
                disabled
              />
              <p className="text-xs text-ink-soft">
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
                    Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <Card className="gap-8 border-border/20 px-8 py-8 shadow-[var(--shadow-soft)] md:px-10 md:py-10">
      <Skeleton className="h-7 w-36" />
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
    </Card>
  );
}
