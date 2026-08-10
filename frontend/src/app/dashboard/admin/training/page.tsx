"use client";

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Landmark, Loader2, Pencil, Save, Trash2 } from "lucide-react";
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

type TrainingCenter = {
  id: string;
  name: string;
  specialty?: string | null;
  city?: string | null;
  state?: string | null;
  website?: string | null;
  description?: string | null;
  verified?: boolean;
  user?: { id?: string; email?: string; isActive?: boolean } | null;
};

const emptyForm = {
  name: "",
  email: "",
  password: "",
  specialty: "",
  city: "",
  state: "",
  website: "",
  description: "",
  verified: true,
};

function AdminTrainingPageInner() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<TrainingCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "unverified">("all");
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
      const list = await api<TrainingCenter[]>("/admin/training-centers", { token });
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load training centers");
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
      setForm(emptyForm);
      setFormOpen(true);
    }
  }, [searchParams]);

  const stats = useMemo(() => {
    const verified = items.filter((t) => t.verified).length;
    const cities = new Set(items.map((t) => (t.city || "").trim()).filter(Boolean)).size;
    return { total: items.length, verified, unverified: items.length - verified, cities };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((t) => {
      const hay = `${t.name} ${t.specialty || ""} ${t.city || ""} ${t.state || ""} ${t.user?.email || ""}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (statusFilter === "verified" && !t.verified) return false;
      if (statusFilter === "unverified" && t.verified) return false;
      return true;
    });
  }, [items, q, statusFilter]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  function openEdit(t: TrainingCenter) {
    setEditingId(t.id);
    setForm({
      name: t.name || "",
      email: t.user?.email || "",
      password: "",
      specialty: t.specialty || "",
      city: t.city || "",
      state: t.state || "",
      website: t.website || "",
      description: t.description || "",
      verified: !!t.verified,
    });
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!editingId && !form.email.trim()) {
      setError("Email is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const payload = {
          name: form.name.trim(),
          specialty: form.specialty.trim() || null,
          city: form.city.trim() || null,
          state: form.state.trim() || null,
          website: form.website.trim() || null,
          description: form.description.trim() || null,
          verified: form.verified,
        };
        await api(`/admin/training-centers/${editingId}`, {
          method: "PATCH",
          token,
          body: JSON.stringify(payload),
        });
        setMsg("Training center updated.");
      } else {
        const payload: Record<string, unknown> = {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          specialty: form.specialty.trim() || undefined,
          city: form.city.trim() || undefined,
          state: form.state.trim() || undefined,
          website: form.website.trim() || undefined,
          description: form.description.trim() || undefined,
        };
        if (form.password.trim()) payload.password = form.password.trim();
        await api("/admin/training-centers", {
          method: "POST",
          token,
          body: JSON.stringify(payload),
        });
        setMsg("Training center created.");
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

  async function onDelete(t: TrainingCenter) {
    if (!token) return;
    if (!window.confirm(`Delete training center "${t.name}"?`)) return;
    setBusyId(t.id);
    setError("");
    try {
      await api(`/admin/training-centers/${t.id}`, { method: "DELETE", token });
      setMsg("Training center removed.");
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
          title="Training Centers"
          description="Partner training institutes — specialty, location, and verification."
          actionLabel="Add Training"
          onAction={openCreate}
        />

        <AdminStatRow
          stats={[
            { label: "Total", value: stats.total, sub: "All centers", tint: "text-[#0F3DDE] bg-blue-50" },
            { label: "Verified", value: stats.verified, sub: "Approved", tint: "text-emerald-700 bg-emerald-50" },
            { label: "Unverified", value: stats.unverified, sub: "Pending", tint: "text-amber-700 bg-amber-50" },
            { label: "Cities", value: stats.cities, sub: "Unique cities", tint: "text-slate-600 bg-slate-100" },
          ]}
        />

        <AdminToolbar
          q={q}
          onQ={setQ}
          placeholder="Search training centers…"
          filters={
            <AdminFilterPills
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { id: "all", label: "All" },
                { id: "verified", label: "Verified" },
                { id: "unverified", label: "Unverified" },
              ]}
            />
          }
        />

        <AdminFlash loading={loading} error={error} msg={msg} loadingLabel="Loading training…" />

        {formOpen && (
          <AdminFormPanel
            title={editingId ? "Edit Training" : "New Training"}
            onClose={() => {
              setFormOpen(false);
              setEditingId(null);
            }}
          >
            <form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Name *
                </span>
                <input
                  className="input"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </label>
              {!editingId && (
                <>
                  <label className="block">
                    <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                      Email *
                    </span>
                    <input
                      className="input"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                      Password
                    </span>
                    <input
                      className="input"
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      placeholder="Optional — default applied if empty"
                    />
                  </label>
                </>
              )}
              {editingId && (
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                    Email
                  </span>
                  <input className="input bg-slate-50" disabled value={form.email} />
                </label>
              )}
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Specialty
                </span>
                <input
                  className="input"
                  value={form.specialty}
                  onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  City
                </span>
                <input
                  className="input"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  State
                </span>
                <input
                  className="input"
                  value={form.state}
                  onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Website
                </span>
                <input
                  className="input"
                  value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  placeholder="https://…"
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
              {editingId && (
                <label className="flex items-center gap-2 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={form.verified}
                    onChange={(e) => setForm((f) => ({ ...f, verified: e.target.checked }))}
                  />
                  <span className="text-sm font-semibold text-slate-700">Verified</span>
                </label>
              )}
              <div className="flex gap-2 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingId ? "Update Training" : "Save Training"}
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
                <th className="px-4 py-3 font-semibold">Training Name</th>
                <th className="px-4 py-3 font-semibold">Specialty</th>
                <th className="px-4 py-3 font-semibold">City</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-800">{t.name}</td>
                  <td className="px-4 py-3 text-slate-600">{t.specialty || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{t.city || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{t.user?.email || "—"}</td>
                  <td className="px-4 py-3">
                    {statusPill(!!t.verified, { on: "Verified", off: "Unverified" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(t)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#0F3DDE] hover:bg-blue-50"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        disabled={busyId === t.id}
                        onClick={() => void onDelete(t)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      >
                        {busyId === t.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}{" "}
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
              <Landmark size={32} />
              <p className="mt-2 text-sm">No training centers match your filters.</p>
            </div>
          )}
        </AdminTableCard>
      </div>
    </AdminShell>
  );
}

export default function AdminTrainingPage() {
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
      <AdminTrainingPageInner />
    </Suspense>
  );
}
