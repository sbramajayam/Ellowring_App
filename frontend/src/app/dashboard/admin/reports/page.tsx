"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  FileBarChart2,
  GraduationCap,
  IndianRupee,
  Loader2,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import {
  AdminFlash,
  AdminPageHeader,
  AdminStatRow,
  AdminTableCard,
} from "@/components/admin-crud-chrome";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type Report = {
  id: string;
  title: string;
  reportType: string;
  fileUrl?: string | null;
  generatedAt?: string;
  createdAt?: string;
};

const TEMPLATES: {
  type: "USER" | "REVENUE" | "STUDENT" | "ADMISSION";
  title: string;
  blurb: string;
  icon: typeof Users;
  tint: string;
}[] = [
  {
    type: "USER",
    title: "User Report",
    blurb: "Registrations, roles, and activity snapshot.",
    icon: Users,
    tint: "bg-blue-50 text-[#0F3DDE]",
  },
  {
    type: "REVENUE",
    title: "Revenue Report",
    blurb: "Payments and transaction totals.",
    icon: IndianRupee,
    tint: "bg-emerald-50 text-emerald-700",
  },
  {
    type: "STUDENT",
    title: "Student Report",
    blurb: "Student profiles and enrollment signals.",
    icon: GraduationCap,
    tint: "bg-sky-50 text-sky-700",
  },
  {
    type: "ADMISSION",
    title: "Admission Report",
    blurb: "Application funnel and admission status.",
    icon: UserRound,
    tint: "bg-amber-50 text-amber-700",
  },
];

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function AdminReportsPage() {
  const { token } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [creating, setCreating] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const list = await api<Report[]>("/admin/reports", { token });
      setReports(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => {
    const byType = (t: string) => reports.filter((r) => r.reportType === t).length;
    return {
      total: reports.length,
      withFile: reports.filter((r) => Boolean(r.fileUrl)).length,
      user: byType("USER"),
      revenue: byType("REVENUE"),
    };
  }, [reports]);

  async function createReport(type: (typeof TEMPLATES)[number]["type"], title: string) {
    if (!token) return;
    setCreating(type);
    setError("");
    try {
      await api("/admin/reports", {
        method: "POST",
        token,
        body: JSON.stringify({ title, reportType: type }),
      });
      setMsg(`${title} queued.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create report");
    } finally {
      setCreating(null);
    }
  }

  async function onDelete(r: Report) {
    if (!token) return;
    if (!window.confirm(`Delete report "${r.title}"?`)) return;
    setBusyId(r.id);
    setError("");
    try {
      await api(`/admin/reports/${r.id}`, { method: "DELETE", token });
      setMsg("Report deleted.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminShell>
      <div className="space-y-5">
        <AdminPageHeader
          title="Reports"
          description="Generate platform reports from templates and download recent exports."
        />

        <AdminStatRow
          stats={[
            { label: "Total Reports", value: stats.total, sub: "All time", tint: "text-[#0F3DDE] bg-blue-50" },
            { label: "Downloadable", value: stats.withFile, sub: "Has file", tint: "text-emerald-700 bg-emerald-50" },
            { label: "User Reports", value: stats.user, sub: "Type USER", tint: "text-sky-700 bg-sky-50" },
            { label: "Revenue Reports", value: stats.revenue, sub: "Type REVENUE", tint: "text-amber-700 bg-amber-50" },
          ]}
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((t) => {
            const Icon = t.icon;
            const busy = creating === t.type;
            return (
              <button
                key={t.type}
                type="button"
                disabled={Boolean(creating)}
                onClick={() => void createReport(t.type, t.title)}
                className="rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-100 transition hover:ring-[#0F3DDE]/40 disabled:opacity-60"
              >
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${t.tint}`}>
                  {busy ? <Loader2 size={18} className="animate-spin" /> : <Icon size={18} />}
                </div>
                <p className="font-display text-base font-bold text-[#0B1F3A]">{t.title}</p>
                <p className="mt-1 text-xs text-slate-500">{t.blurb}</p>
                <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-[#0F3DDE]">
                  {busy ? "Generating…" : "Generate"}
                </p>
              </button>
            );
          })}
        </div>

        <AdminFlash loading={loading} error={error} msg={msg} loadingLabel="Loading reports…" />

        <div>
          <h2 className="mb-3 font-display text-lg font-bold text-[#0B1F3A]">Recent Reports</h2>
          <AdminTableCard>
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-800">{r.title}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                        {r.reportType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(r.generatedAt || r.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {r.fileUrl ? (
                          <a
                            href={r.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#0F3DDE] hover:bg-blue-50"
                          >
                            <Download size={14} /> Download
                          </a>
                        ) : (
                          <button
                            type="button"
                            disabled={Boolean(creating)}
                            onClick={() =>
                              void createReport(
                                r.reportType as "USER" | "REVENUE" | "STUDENT" | "ADMISSION",
                                r.title,
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#0F3DDE] hover:bg-blue-50 disabled:opacity-50"
                          >
                            <FileBarChart2 size={14} /> Generate
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={busyId === r.id}
                          onClick={() => void onDelete(r)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                        >
                          {busyId === r.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}{" "}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && reports.length === 0 && (
              <div className="flex flex-col items-center py-12 text-slate-400">
                <FileBarChart2 size={32} />
                <p className="mt-2 text-sm">No reports yet — generate one from a template above.</p>
              </div>
            )}
          </AdminTableCard>
        </div>
      </div>
    </AdminShell>
  );
}
