"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    if (pending) return;
    setPending(true);
    try {
      await logout();
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not log you out. Try again.");
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="primary"
      size="md"
      onClick={handleLogout}
      disabled={pending}
    >
      <LogOut className="size-4" strokeWidth={1.75} />
      {pending ? "Logging out…" : "Log out"}
    </Button>
  );
}
