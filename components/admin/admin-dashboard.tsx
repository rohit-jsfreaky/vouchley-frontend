"use client";

import { format } from "date-fns";
import {
  CreditCard,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type AdminStats,
  type AdminUserRow,
  adminLogout,
  adminStats,
  adminUsers,
} from "@/lib/api-admin";

const PAGE_SIZE = 50;

function fmtDate(value: string | null): string {
  if (!value) return "—";
  try {
    return format(new Date(value), "MMM d, yyyy");
  } catch {
    return "—";
  }
}

function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-ink-soft">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold tabular-nums text-ink">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-ink-muted">{sub}</div>}
    </Card>
  );
}

export function AdminDashboard({ onSignedOut }: { onSignedOut: () => void }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(""); // debounced
  const [loading, setLoading] = useState(true);

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search);
      setOffset(0);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, u] = await Promise.all([
        adminStats(),
        adminUsers({ search: query, limit: PAGE_SIZE, offset }),
      ]);
      setStats(s);
      setRows(u.users);
      setTotal(u.total);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't load data.");
    } finally {
      setLoading(false);
    }
  }, [query, offset]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleLogout() {
    try {
      await adminLogout();
    } catch {
      /* ignore */
    }
    onSignedOut();
  }

  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Admin console
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Users, credits, plans, and activity across Vouchley.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={load}>
            <RefreshCw className="size-4" /> Refresh
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </header>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Users"
          value={stats ? stats.total_users.toLocaleString() : "—"}
          sub={
            stats
              ? `${stats.verified_users} verified · ${stats.new_users_7d} new this week`
              : undefined
          }
          icon={<Users className="size-3.5" />}
        />
        <StatCard
          label="Active plans"
          value={stats ? stats.active_subscriptions.toLocaleString() : "—"}
          sub="paying subscriptions"
          icon={<CreditCard className="size-3.5" />}
        />
        <StatCard
          label="Credits outstanding"
          value={stats ? stats.total_credits_balance.toLocaleString() : "—"}
          sub={
            stats
              ? `${stats.total_credits_granted.toLocaleString()} granted all-time`
              : undefined
          }
        />
        <StatCard
          label="Credits used"
          value={stats ? stats.total_credits_used.toLocaleString() : "—"}
          sub={
            stats
              ? `${stats.total_checks.toLocaleString()} checks · ${stats.checks_30d.toLocaleString()} in 30d`
              : undefined
          }
        />
      </div>

      {/* Users */}
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between gap-3 border-b border-border p-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
            <Input
              placeholder="Search email or name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <span className="shrink-0 text-sm text-ink-muted">
            {total.toLocaleString()} {total === 1 ? "user" : "users"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Used</TableHead>
                <TableHead className="text-right">Granted</TableHead>
                <TableHead className="text-right">Checks</TableHead>
                <TableHead>Last activity</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center">
                    <Loader2 className="mx-auto size-5 animate-spin text-ink-soft" />
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-sm text-ink-muted"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="font-medium text-ink">{u.email}</div>
                      <div className="flex items-center gap-2 text-xs text-ink-muted">
                        {u.name || "—"}
                        {u.verified ? (
                          <span className="text-accent">verified</span>
                        ) : (
                          <span className="text-warning">unverified</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {u.plan ? (
                        <Badge variant="secondary" className="capitalize">
                          {u.plan}
                        </Badge>
                      ) : (
                        <span className="text-xs text-ink-soft">free</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums text-ink">
                      {u.credits_balance.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-ink-muted">
                      {u.credits_used.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-ink-muted">
                      {u.credits_granted.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-ink-muted">
                      {u.total_checks.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-ink-muted">
                      {fmtDate(u.last_activity_at)}
                    </TableCell>
                    <TableCell className="text-sm text-ink-muted">
                      {fmtDate(u.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pageCount > 1 && (
          <div className="flex items-center justify-between border-t border-border p-3">
            <span className="text-sm text-ink-muted">
              Page {page} of {pageCount}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={offset === 0 || loading}
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={offset + PAGE_SIZE >= total || loading}
                onClick={() => setOffset(offset + PAGE_SIZE)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
