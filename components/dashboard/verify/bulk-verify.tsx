"use client";

import { Download, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { RecommendationBadge } from "@/components/dashboard/shared/status-badges";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";
import {
  type BulkJobStatus,
  fetchBulkVerifyJob,
  submitBulkVerify,
} from "@/lib/api-verify";

const MAX_EMAILS = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Split pasted / uploaded text into a deduped list of email-looking tokens. */
function parseEmails(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const token of raw.split(/[\s,;]+/)) {
    const email = token.trim().replace(/^["']|["']$/g, "");
    if (!email) continue;
    const key = email.toLowerCase();
    if (EMAIL_RE.test(email) && !seen.has(key)) {
      seen.add(key);
      out.push(email);
    }
  }
  return out;
}

function toCsv(job: BulkJobStatus): string {
  const rows = [["email", "score", "recommendation", "status", "error"]];
  for (const item of job.items) {
    rows.push([
      item.email ?? "",
      item.score != null ? String(item.score) : "",
      item.recommendation ?? "",
      item.status ?? "",
      (item.error ?? "").replace(/"/g, "'"),
    ]);
  }
  return rows
    .map((r) => r.map((c) => `"${c}"`).join(","))
    .join("\n");
}

export function BulkVerify({
  balance,
  onBalanceChanged,
}: {
  balance: number | null;
  onBalanceChanged: () => void;
}) {
  const [raw, setRaw] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState<BulkJobStatus | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const emails = useMemo(() => parseEmails(raw), [raw]);
  const overCap = emails.length > MAX_EMAILS;
  const toSend = emails.slice(0, MAX_EMAILS);
  const noCredits = balance !== null && balance <= 0;
  const running = job?.status === "queued" || job?.status === "running";

  // Poll the job while it's in flight.
  useEffect(() => {
    if (!job || (job.status !== "queued" && job.status !== "running")) return;
    let alive = true;
    const timer = setInterval(async () => {
      try {
        const next = await fetchBulkVerifyJob(job.job_id);
        if (!alive) return;
        setJob(next);
        if (next.status === "completed" || next.status === "failed") {
          onBalanceChanged();
        }
      } catch {
        /* transient — keep polling */
      }
    }, 1500);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [job, onBalanceChanged]);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRaw((prev) => (prev ? prev + "\n" : "") + String(reader.result ?? ""));
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  async function startJob() {
    setConfirmOpen(false);
    setSubmitting(true);
    setJob(null);
    try {
      const submitted = await submitBulkVerify(
        toSend.map((email) => ({ email })),
      );
      // Seed a local status object so polling can begin immediately.
      setJob({
        job_id: submitted.job_id,
        user_id: "",
        status: submitted.status,
        total: submitted.total,
        processed: 0,
        succeeded: 0,
        failed: 0,
        credits_used: 0,
        created_at: new Date().toISOString(),
        completed_at: null,
        items: [],
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 402) {
        toast.error("You're out of credits. Add credits to run a bulk job.");
      } else {
        toast.error(err instanceof Error ? err.message : "Couldn't start job.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function downloadCsv() {
    if (!job) return;
    const blob = new Blob([toCsv(job)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vouchley-bulk-${job.job_id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const pct = job && job.total ? Math.round((job.processed / job.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="bulk-input" className="text-sm font-medium text-ink">
            Paste emails
          </label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            <Upload className="size-4" /> Upload CSV / TXT
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.txt,text/csv,text/plain"
            className="hidden"
            onChange={handleFile}
          />
        </div>
        <Textarea
          id="bulk-input"
          rows={8}
          placeholder={"one@example.com\ntwo@example.com\nthree@example.com"}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className="font-mono text-sm"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-ink-muted">
            <strong className="text-ink">{emails.length}</strong> valid unique
            {emails.length === 1 ? " email" : " emails"} · uses up to{" "}
            <strong className="text-ink">{toSend.length}</strong> credits
            {balance !== null && (
              <>
                {" "}
                · balance{" "}
                <strong className="text-ink">{balance.toLocaleString()}</strong>
              </>
            )}
          </div>
          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={
              submitting || running || toSend.length === 0 || noCredits
            }
            onClick={() => setConfirmOpen(true)}
          >
            {submitting || running ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Running
              </>
            ) : (
              `Verify ${toSend.length || ""} ${toSend.length === 1 ? "email" : "emails"}`.trim()
            )}
          </Button>
        </div>

        {overCap && (
          <p className="mt-2 text-sm text-warning">
            {emails.length.toLocaleString()} emails found — only the first{" "}
            {MAX_EMAILS.toLocaleString()} will be sent (per-job cap). Split the
            rest into another batch.
          </p>
        )}
        {noCredits && (
          <p className="mt-2 text-sm text-danger">
            You&apos;re out of credits.{" "}
            <Link href="/dashboard/billing" className="font-medium underline">
              Add credits
            </Link>{" "}
            to run a bulk job.
          </p>
        )}
      </Card>

      {job && (
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink">
                {job.status === "completed"
                  ? "Done"
                  : job.status === "failed"
                    ? "Failed"
                    : "Verifying…"}{" "}
                <span className="font-normal text-ink-muted">
                  {job.processed}/{job.total} · {job.credits_used} credits used
                </span>
              </p>
            </div>
            {job.items.length > 0 && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={downloadCsv}
              >
                <Download className="size-4" /> CSV
              </Button>
            )}
          </div>

          <Progress value={pct} className="mb-4" />

          {job.items.length > 0 && (
            <div className="max-h-[420px] overflow-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-20 text-right">Score</TableHead>
                    <TableHead className="w-28">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {job.items.map((item, i) => (
                    <TableRow key={`${item.email}-${i}`}>
                      <TableCell className="font-mono text-xs">
                        {item.email}
                        {item.error && (
                          <span className="ml-2 text-danger">{item.error}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {item.score ?? "—"}
                      </TableCell>
                      <TableCell>
                        {item.recommendation ? (
                          <RecommendationBadge value={item.recommendation} />
                        ) : (
                          <span className="text-xs text-ink-soft">
                            {item.status ?? "…"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Run bulk verification?</AlertDialogTitle>
            <AlertDialogDescription>
              This will verify <strong>{toSend.length}</strong> email
              {toSend.length === 1 ? "" : "s"} and use up to{" "}
              <strong>{toSend.length}</strong> credits from your balance
              {balance !== null ? ` of ${balance.toLocaleString()}` : ""}.
              Cached results (emails you&apos;ve checked before) are free.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={startJob}>
              Verify {toSend.length}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
