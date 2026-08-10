"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import {
  AdminFlash,
  AdminPageHeader,
  AdminStatRow,
  AdminTableCard,
  statusPill,
} from "@/components/admin-crud-chrome";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type Overview = {
  users?: number;
  activeUsers?: number;
  students?: number;
  colleges?: number;
  collegeProfiles?: number;
  companies?: number;
  training?: number;
  partners?: number;
  courses?: number;
  coaching?: number;
  revenue?: number | string;
  transactions?: number;
  openTickets?: number;
  recentUsers?: { id: string; name: string; email: string; role: string; createdAt: string }[];
  topCourses?: {
    id: string;
    title: string;
    category: string;
    enrollments: number;
    price: number | string;
    isPublished: boolean;
  }[];
};

function moneyOf(v: number | string | undefined) {
  const n = typeof v === "string" ? Number(v) : v ?? 0;
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("en-IN");
}

export default function AdminAnalyticsPage() {
  const { token } = useAuth();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await api<Overview>("/admin/overview", { token });
      setOverview(data || null);
    } catch (e) {
      setOverview(null);
      setError(
        e instanceof Error
          ? e.message
          : "Could not load analytics overview. Please try again shortly.",
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const roleBars = useMemo(() => {
    if (!overview) return [];
    const items = [
      { label: "Students", value: overview.students ?? 0 },
      { label: "Colleges", value: overview.colleges ?? 0 },
      { label: "Companies", value: overview.companies ?? 0 },
      { label: "Training", value: overview.training ?? 0 },
      { label: "Partners", value: overview.partners ?? 0 },
    ];
    const max = Math.max(...items.map((i) => i.value), 1);
    return items.map((i) => ({ ...i, pct: Math.round((i.value / max) * 100) }));
  }, [overview]);

  const recentBars = useMemo(() => {
    const list = overview?.recentUsers || [];
    // Simple day buckets from recent users for a line-style placeholder
    const buckets = new Map<string, number>();
    for (const u of list) {
      const d = u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "?";
      buckets.set(d, (buckets.get(d) || 0) + 1);
    }
    const arr = Array.from(buckets.entries()).slice(0, 6);
    const max = Math.max(...arr.map(([, v]) => v), 1);
    return arr.map(([label, value]) => ({ label, value, pct: Math.round((value / max) * 100) }));
  }, [overview]);

  const topCourses = overview?.topCourses || [];

  return (
    <AdminShell>
      <div className="space-y-5">
        <AdminPageHeader
          title="Analytics"
          description="Platform KPIs, role mix, and top courses from the admin overview."
        />

        <AdminFlash loading={loading} error={error} loadingLabel="Loading overview…" />

        {!error && overview && (
          <>
            <AdminStatRow
              stats={[
                {
                  label: "Users",
                  value: overview.users ?? 0,
                  sub: `${overview.activeUsers ?? 0} active`,
                  tint: "text-[#0F3DDE] bg-blue-50",
                },
                {
                  label: "Revenue",
                  value: `₹${moneyOf(overview.revenue)}`,
                  sub: `${overview.transactions ?? 0} txn`,
                  tint: "text-emerald-700 bg-emerald-50",
                },
                {
                  label: "Partners",
                  value: overview.partners ?? 0,
                  sub: "Partner accounts",
                  tint: "text-sky-700 bg-sky-50",
                },
                {
                  label: "Courses",
                  value: overview.courses ?? 0,
                  sub: `${overview.coaching ?? 0} coaching`,
                  tint: "text-amber-700 bg-amber-50",
                },
              ]}
            />

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <h2 className="font-display text-lg font-bold text-[#0B1F3A]">Role Mix</h2>
                <p className="mt-1 text-sm text-slate-500">Account counts by platform role.</p>
                <div className="mt-5 space-y-3">
                  {roleBars.map((b) => (
                    <div key={b.label}>
                      <div className="mb-1 flex justify-between text-xs font-semibold text-slate-600">
                        <span>{b.label}</span>
                        <span>{b.value}</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#0F3DDE] transition-all"
                          style={{ width: `${b.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1F3A] to-[#0F3DDE] p-5 text-white shadow-sm">
                <h2 className="font-display text-lg font-bold">Recent Signups</h2>
                <p className="mt-1 text-sm text-white/70">From the latest users in overview.</p>
                <div className="mt-6 flex h-36 items-end gap-2">
                  {(recentBars.length
                    ? recentBars
                    : [
                        { label: "—", value: 0, pct: 8 },
                        { label: "—", value: 0, pct: 16 },
                        { label: "—", value: 0, pct: 12 },
                        { label: "—", value: 0, pct: 24 },
                      ]
                  ).map((b, i) => (
                    <div key={`${b.label}-${i}`} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-md bg-white/90"
                        style={{ height: `${Math.max(b.pct, 8)}%`, minHeight: 8 }}
                      />
                      <span className="text-[10px] font-semibold text-white/80">{b.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-white/10 px-2 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-white/60">Students</p>
                    <p className="font-display text-lg font-bold">{overview.students ?? 0}</p>
                  </div>
                  <div className="rounded-xl bg-white/10 px-2 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-white/60">Tickets</p>
                    <p className="font-display text-lg font-bold">{overview.openTickets ?? 0}</p>
                  </div>
                  <div className="rounded-xl bg-white/10 px-2 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-white/60">Colleges</p>
                    <p className="font-display text-lg font-bold">
                      {overview.collegeProfiles ?? overview.colleges ?? 0}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div>
              <h2 className="mb-3 font-display text-lg font-bold text-[#0B1F3A]">Top Courses</h2>
              <AdminTableCard>
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Course</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Enrollments</th>
                      <th className="px-4 py-3 font-semibold">Price</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCourses.map((c) => (
                      <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-medium text-slate-800">{c.title}</td>
                        <td className="px-4 py-3 text-slate-600">{c.category}</td>
                        <td className="px-4 py-3 text-slate-600">{c.enrollments}</td>
                        <td className="px-4 py-3 text-slate-600">₹{moneyOf(c.price)}</td>
                        <td className="px-4 py-3">
                          {statusPill(c.isPublished !== false, { on: "Published", off: "Draft" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!loading && topCourses.length === 0 && (
                  <div className="flex flex-col items-center py-12 text-slate-400">
                    <BarChart3 size={32} />
                    <p className="mt-2 text-sm">No course data in overview yet.</p>
                  </div>
                )}
              </AdminTableCard>
            </div>
          </>
        )}

        {!loading && error && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
            <BarChart3 className="mx-auto text-slate-300" size={40} />
            <p className="mt-3 font-display text-lg font-bold text-[#0B1F3A]">Analytics unavailable</p>
            <p className="mt-1 text-sm text-slate-500">
              We could not load the admin overview. Check your connection or try again.
            </p>
            <button
              type="button"
              onClick={() => void load()}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-4 py-2.5 text-sm font-bold text-white"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Retry
            </button>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
