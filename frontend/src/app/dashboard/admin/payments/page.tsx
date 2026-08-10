"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IndianRupee, Loader2, RefreshCw } from "lucide-react";
import clsx from "clsx";
import { AdminShell } from "@/components/admin-shell";
import {
  AdminFilterPills,
  AdminFlash,
  AdminStatRow,
  AdminTableCard,
  AdminToolbar,
} from "@/components/admin-crud-chrome";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { moneyOf } from "@/lib/labels";

type PaymentStatus = "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED" | "REFUNDED" | "CANCELLED" | string;

type Payment = {
  id: string;
  amount?: number | string;
  currency?: string;
  status?: PaymentStatus;
  purpose?: string | null;
  reference?: string | null;
  user?: { id?: string; name?: string | null; email?: string | null } | null;
};

const STATUS_OPTIONS = ["PENDING", "SUCCESS", "FAILED", "REFUNDED"] as const;

function statusTone(status?: string) {
  const s = (status || "").toUpperCase();
  if (s === "SUCCESS") return "bg-emerald-50 text-emerald-700";
  if (s === "PENDING" || s === "PROCESSING") return "bg-amber-50 text-amber-700";
  if (s === "REFUNDED") return "bg-slate-100 text-slate-600";
  if (s === "FAILED" || s === "CANCELLED") return "bg-rose-50 text-rose-700";
  return "bg-slate-100 text-slate-600";
}

function shortId(p: Payment) {
  if (p.reference) return p.reference;
  return p.id.length > 10 ? `${p.id.slice(0, 8)}…` : p.id;
}

function AdminPaymentsPageInner() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED">("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const list = await api<Payment[]>("/admin/payments", { token });
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  void searchParams;

  const stats = useMemo(() => {
    const revenue = items
      .filter((p) => (p.status || "").toUpperCase() === "SUCCESS")
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const received = items.filter((p) => (p.status || "").toUpperCase() === "SUCCESS").length;
    const pending = items.filter((p) => {
      const s = (p.status || "").toUpperCase();
      return s === "PENDING" || s === "PROCESSING";
    }).length;
    const refunds = items.filter((p) => (p.status || "").toUpperCase() === "REFUNDED").length;
    return { revenue, received, pending, refunds };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      const hay = `${p.id} ${p.reference || ""} ${p.purpose || ""} ${p.user?.name || ""} ${p.user?.email || ""} ${p.status || ""}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (statusFilter !== "all" && (p.status || "").toUpperCase() !== statusFilter) return false;
      return true;
    });
  }, [items, q, statusFilter]);

  async function updateStatus(p: Payment, status: string) {
    if (!token) return;
    if ((p.status || "").toUpperCase() === status.toUpperCase()) return;
    setBusyId(p.id);
    setError("");
    try {
      await api(`/admin/payments/${p.id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ status }),
      });
      setMsg(`Payment marked ${status}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-[#0B1F3A] lg:text-[28px]">Payments</h1>
            <p className="mt-1 text-sm text-slate-500">
              Platform payments — revenue, pending orders, and refunds.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(15,61,222,0.25)]"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        <AdminStatRow
          stats={[
            {
              label: "Total Revenue",
              value: `₹${moneyOf(stats.revenue, "0")}`,
              sub: "SUCCESS amounts",
              tint: "text-[#0F3DDE] bg-blue-50",
            },
            {
              label: "Received",
              value: stats.received,
              sub: "Successful",
              tint: "text-emerald-700 bg-emerald-50",
            },
            {
              label: "Pending",
              value: stats.pending,
              sub: "Awaiting",
              tint: "text-amber-700 bg-amber-50",
            },
            {
              label: "Refunds",
              value: stats.refunds,
              sub: "Refunded",
              tint: "text-slate-600 bg-slate-100",
            },
          ]}
        />

        <AdminToolbar
          q={q}
          onQ={setQ}
          placeholder="Search payments…"
          filters={
            <AdminFilterPills
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { id: "all", label: "All" },
                { id: "PENDING", label: "Pending" },
                { id: "SUCCESS", label: "Success" },
                { id: "FAILED", label: "Failed" },
                { id: "REFUNDED", label: "Refunded" },
              ]}
            />
          }
        />

        <AdminFlash loading={loading} error={error} msg={msg} loadingLabel="Loading payments…" />

        <AdminTableCard>
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Invoice / ID</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Purpose</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-800 font-mono text-xs">{shortId(p)}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <div className="font-medium text-slate-800">{p.user?.name || "—"}</div>
                    <div className="text-xs text-slate-400">{p.user?.email || ""}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">₹{moneyOf(p.amount, "0")}</td>
                  <td className="px-4 py-3 text-slate-600">{p.purpose || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={clsx("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold", statusTone(p.status))}>
                      {p.status || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <select
                        className="input py-1.5 text-xs"
                        disabled={busyId === p.id}
                        value={(p.status || "PENDING").toUpperCase()}
                        onChange={(e) => void updateStatus(p, e.target.value)}
                      >
                        {Array.from(
                          new Set([...(STATUS_OPTIONS as unknown as string[]), (p.status || "").toUpperCase()].filter(Boolean)),
                        ).map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {(p.status || "").toUpperCase() !== "SUCCESS" && (
                        <button
                          type="button"
                          disabled={busyId === p.id}
                          onClick={() => void updateStatus(p, "SUCCESS")}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                        >
                          Mark paid
                        </button>
                      )}
                      {(p.status || "").toUpperCase() !== "REFUNDED" && (
                        <button
                          type="button"
                          disabled={busyId === p.id}
                          onClick={() => void updateStatus(p, "REFUNDED")}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                        >
                          Refund
                        </button>
                      )}
                      {busyId === p.id && <Loader2 size={14} className="animate-spin text-slate-400" />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center py-12 text-slate-400">
              <IndianRupee size={32} />
              <p className="mt-2 text-sm">No payments match your filters.</p>
              <button
                type="button"
                onClick={() => void load()}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0F3DDE]"
              >
                <RefreshCw size={12} /> Refresh
              </button>
            </div>
          )}
        </AdminTableCard>
      </div>
    </AdminShell>
  );
}

export default function AdminPaymentsPage() {
  return (
    <Suspense
      fallback={
        <AdminShell>
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Loading…
          </p>
        </AdminShell>
      }
    >
      <AdminPaymentsPageInner />
    </Suspense>
  );
}
