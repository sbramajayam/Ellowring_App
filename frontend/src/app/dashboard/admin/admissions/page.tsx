"use client";

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { School, Loader2, Pencil, Save, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import {
  AdminFilterPills,
  AdminFlash,
  AdminFormPanel,
  AdminPageHeader,
  AdminStatRow,
  AdminTableCard,
  AdminToolbar,
  statusPill,
} from "@/components/admin-crud-chrome";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf, moneyOf } from "@/lib/labels";

type College = { id: string; name: string; city?: string | null };

type Admission = {
  id: string;
  collegeId?: string;
  name: string;
  degree?: string | null;
  duration?: string | null;
  fees?: number | string | null;
  seats?: number | null;
  eligibility?: string | null;
  description?: string | null;
  isActive?: boolean;
  college?: { id?: string; name?: string; city?: string | null } | string | null;
};

const emptyForm = {
  collegeId: "",
  name: "",
  degree: "",
  duration: "",
  fees: "",
  seats: "0",
  eligibility: "",
  description: "",
  isActive: true,
};

function AdminAdmissionsPageInner() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Admission[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const [list, collegeList] = await Promise.all([
        api<Admission[]>("/admin/admissions", { token }),
        api<College[]>("/colleges?all=1", { token }).catch(() =>
          api<College[]>("/colleges", { token }).catch(() => [] as College[]),
        ),
      ]);
      setItems(Array.isArray(list) ? list : []);
      setColleges(Array.isArray(collegeList) ? collegeList : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load admissions");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setEditingId(null);
      setForm({ ...emptyForm, collegeId: colleges[0]?.id || "" });
      setFormOpen(true);
    }
  }, [searchParams, colleges]);

  const stats = useMemo(() => {
    const active = items.filter((a) => a.isActive !== false).length;
    const seats = items.reduce((sum, a) => sum + (Number(a.seats) || 0), 0);
    return { total: items.length, active, inactive: items.length - active, seats };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((a) => {
      const hay = `${a.name} ${a.degree || ""} ${labelOf(a.college)} ${a.eligibility || ""}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (statusFilter === "active" && a.isActive === false) return false;
      if (statusFilter === "inactive" && a.isActive !== false) return false;
      return true;
    });
  }, [items, q, statusFilter]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, collegeId: colleges[0]?.id || "" });
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  function openEdit(a: Admission) {
    setEditingId(a.id);
    setForm({
      collegeId:
        a.collegeId ||
        (typeof a.college === "object" && a.college?.id ? a.college.id : "") ||
        colleges[0]?.id ||
        "",
      name: a.name || "",
      degree: a.degree || "",
      duration: a.duration || "",
      fees: a.fees != null ? String(a.fees) : "",
      seats: String(a.seats ?? 0),
      eligibility: a.eligibility || "",
      description: a.description || "",
      isActive: a.isActive !== false,
    });
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (!form.name.trim() || !form.degree.trim() || !form.collegeId) {
      setError("College, name and degree are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        collegeId: form.collegeId,
        name: form.name.trim(),
        degree: form.degree.trim(),
        duration: form.duration.trim() || null,
        fees: form.fees.trim() ? Number(form.fees) : null,
        seats: Number(form.seats) || 0,
        eligibility: form.eligibility.trim() || null,
        description: form.description.trim() || null,
        isActive: form.isActive,
      };
      if (editingId) {
        const patch = {
          name: payload.name,
          degree: payload.degree,
          duration: payload.duration,
          fees: payload.fees,
          seats: payload.seats,
          eligibility: payload.eligibility,
          description: payload.description,
          isActive: payload.isActive,
        };
        await api(`/admin/admissions/${editingId}`, {
          method: "PATCH",
          token,
          body: JSON.stringify(patch),
        });
        setMsg("Admission updated.");
      } else {
        await api("/admin/admissions", { method: "POST", token, body: JSON.stringify(payload) });
        setMsg("Admission created.");
      }
      setFormOpen(false);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(a: Admission) {
    if (!token) return;
    if (!window.confirm(`Delete admission "${a.name}"?`)) return;
    setBusyId(a.id);
    setError("");
    try {
      await api(`/admin/admissions/${a.id}`, { method: "DELETE", token });
      setMsg("Admission removed.");
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
          title="Admissions Management"
          description="College programmes — seats, fees, eligibility, and visibility."
          actionLabel="Add Admission"
          onAction={openCreate}
        />

        <AdminStatRow
          stats={[
            { label: "Total", value: stats.total, sub: "All programmes", tint: "text-[#0F3DDE] bg-blue-50" },
            { label: "Active", value: stats.active, sub: "Open for apply", tint: "text-emerald-700 bg-emerald-50" },
            { label: "Inactive", value: stats.inactive, sub: "Hidden", tint: "text-amber-700 bg-amber-50" },
            { label: "Seats", value: stats.seats, sub: "Total seats", tint: "text-slate-600 bg-slate-100" },
          ]}
        />

        <AdminToolbar
          q={q}
          onQ={setQ}
          placeholder="Search admissions…"
          filters={
            <AdminFilterPills
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { id: "all", label: "All" },
                { id: "active", label: "Active" },
                { id: "inactive", label: "Inactive" },
              ]}
            />
          }
        />

        <AdminFlash loading={loading} error={error} msg={msg} loadingLabel="Loading admissions…" />

        {formOpen && (
          <AdminFormPanel
            title={editingId ? "Edit Admission" : "New Admission"}
            onClose={() => {
              setFormOpen(false);
              setEditingId(null);
            }}
          >
            <form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  College *
                </span>
                <select
                  className="input"
                  required
                  disabled={!!editingId}
                  value={form.collegeId}
                  onChange={(e) => setForm((f) => ({ ...f, collegeId: e.target.value }))}
                >
                  <option value="">Select college</option>
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.city ? ` — ${c.city}` : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Course / Programme *
                </span>
                <input
                  className="input"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Degree *
                </span>
                <input
                  className="input"
                  required
                  value={form.degree}
                  onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value }))}
                  placeholder="B.Tech / MBBS / MBA"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Duration
                </span>
                <input
                  className="input"
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                  placeholder="4 years"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Fees (₹)
                </span>
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={form.fees}
                  onChange={(e) => setForm((f) => ({ ...f, fees: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Seats
                </span>
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={form.seats}
                  onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Eligibility
                </span>
                <input
                  className="input"
                  value={form.eligibility}
                  onChange={(e) => setForm((f) => ({ ...f, eligibility: e.target.value }))}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Description
                </span>
                <textarea
                  className="input min-h-[100px]"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </label>
              <label className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                <span className="text-sm font-semibold text-slate-700">Active</span>
              </label>
              <div className="flex gap-2 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingId ? "Update Admission" : "Save Admission"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    setEditingId(null);
                  }}
                  className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </AdminFormPanel>
        )}

        <AdminTableCard>
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Course/Programme</th>
                <th className="px-4 py-3 font-semibold">College</th>
                <th className="px-4 py-3 font-semibold">Degree</th>
                <th className="px-4 py-3 font-semibold">Fees</th>
                <th className="px-4 py-3 font-semibold">Seats</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-800">{a.name}</td>
                  <td className="px-4 py-3 text-slate-600">{labelOf(a.college, "—")}</td>
                  <td className="px-4 py-3 text-slate-600">{a.degree || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">₹{moneyOf(a.fees, "0")}</td>
                  <td className="px-4 py-3 text-slate-600">{a.seats ?? 0}</td>
                  <td className="px-4 py-3">{statusPill(a.isActive !== false)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(a)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#0F3DDE] hover:bg-blue-50"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        disabled={busyId === a.id}
                        onClick={() => void onDelete(a)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      >
                        {busyId === a.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}{" "}
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center py-12 text-slate-400">
              <School size={32} />
              <p className="mt-2 text-sm">No admissions match your filters.</p>
            </div>
          )}
        </AdminTableCard>
      </div>
    </AdminShell>
  );
}

export default function AdminAdmissionsPage() {
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
      <AdminAdmissionsPageInner />
    </Suspense>
  );
}
