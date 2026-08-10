"use client";

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Handshake, Loader2, Pencil, Save, Trash2 } from "lucide-react";
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

type Partner = {
  id: string;
  name: string;
  region?: string | null;
  commissionPct?: number | string;
  isActive?: boolean;
  user?: { id?: string; email?: string; isActive?: boolean } | null;
};

const emptyForm = {
  name: "",
  email: "",
  password: "",
  region: "",
  commissionPct: "10",
  isActive: true,
};

function AdminPartnersPageInner() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Partner[]>([]);
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
      const list = await api<Partner[]>("/admin/partners", { token });
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load partners");
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
    const active = items.filter((p) => p.isActive !== false).length;
    const inactive = items.length - active;
    const regions = new Set(items.map((p) => (p.region || "").trim()).filter(Boolean)).size;
    return { total: items.length, active, inactive, regions };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      const hay = `${p.name} ${p.user?.email || ""} ${p.region || ""}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (statusFilter === "active" && p.isActive === false) return false;
      if (statusFilter === "inactive" && p.isActive !== false) return false;
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

  function openEdit(p: Partner) {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      email: p.user?.email || "",
      password: "",
      region: p.region || "",
      commissionPct: String(p.commissionPct ?? 10),
      isActive: p.isActive !== false,
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
          region: form.region.trim() || null,
          commissionPct: Number(form.commissionPct) || 0,
          isActive: form.isActive,
        };
        await api(`/admin/partners/${editingId}`, {
          method: "PATCH",
          token,
          body: JSON.stringify(payload),
        });
        setMsg("Partner updated.");
      } else {
        const payload: Record<string, unknown> = {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          region: form.region.trim() || undefined,
          commissionPct: Number(form.commissionPct) || 10,
        };
        if (form.password.trim()) payload.password = form.password.trim();
        await api("/admin/partners", { method: "POST", token, body: JSON.stringify(payload) });
        setMsg("Partner created.");
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

  async function onDelete(p: Partner) {
    if (!token) return;
    if (!window.confirm(`Delete partner "${p.name}"?`)) return;
    setBusyId(p.id);
    setError("");
    try {
      await api(`/admin/partners/${p.id}`, { method: "DELETE", token });
      setMsg("Partner removed.");
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
          title="Partner Management"
          description="Channel partners — region, commission, and account status."
          actionLabel="Add Partner"
          onAction={openCreate}
        />

        <AdminStatRow
          stats={[
            { label: "Total", value: stats.total, sub: "All partners", tint: "text-[#0F3DDE] bg-blue-50" },
            { label: "Active", value: stats.active, sub: "Live accounts", tint: "text-emerald-700 bg-emerald-50" },
            { label: "Inactive", value: stats.inactive, sub: "Disabled", tint: "text-amber-700 bg-amber-50" },
            { label: "Regions", value: stats.regions, sub: "Unique regions", tint: "text-slate-600 bg-slate-100" },
          ]}
        />

        <AdminToolbar
          q={q}
          onQ={setQ}
          placeholder="Search partners…"
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

        <AdminFlash loading={loading} error={error} msg={msg} loadingLabel="Loading partners…" />

        {formOpen && (
          <AdminFormPanel
            title={editingId ? "Edit Partner" : "New Partner"}
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
                  placeholder="Partner organisation"
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
                  Region
                </span>
                <input
                  className="input"
                  value={form.region}
                  onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                  placeholder="North / South / City"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Commission %
                </span>
                <input
                  className="input"
                  type="number"
                  min={0}
                  max={100}
                  step="0.1"
                  value={form.commissionPct}
                  onChange={(e) => setForm((f) => ({ ...f, commissionPct: e.target.value }))}
                />
              </label>
              {editingId && (
                <label className="flex items-center gap-2 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  />
                  <span className="text-sm font-semibold text-slate-700">Active</span>
                </label>
              )}
              <div className="flex gap-2 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingId ? "Update Partner" : "Save Partner"}
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
                <th className="px-4 py-3 font-semibold">Partner Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Region</th>
                <th className="px-4 py-3 font-semibold">Commission %</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                  <td className="px-4 py-3 text-slate-600">{p.user?.email || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{p.region || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{Number(p.commissionPct ?? 0)}</td>
                  <td className="px-4 py-3">{statusPill(p.isActive !== false)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#0F3DDE] hover:bg-blue-50"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        disabled={busyId === p.id}
                        onClick={() => void onDelete(p)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      >
                        {busyId === p.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}{" "}
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
              <Handshake size={32} />
              <p className="mt-2 text-sm">No partners match your filters.</p>
            </div>
          )}
        </AdminTableCard>
      </div>
    </AdminShell>
  );
}

export default function AdminPartnersPage() {
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
      <AdminPartnersPageInner />
    </Suspense>
  );
}
