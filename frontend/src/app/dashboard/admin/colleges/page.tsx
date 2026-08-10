"use client";

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type CollegeRanking = { source?: string; rank?: number; year?: number; category?: string };

type College = {
  id: string;
  name: string;
  city?: string | null;
  state?: string | null;
  type?: string | null;
  website?: string | null;
  description?: string | null;
  isVerified?: boolean;
  rankings?: CollegeRanking[];
};

const emptyForm = {
  name: "",
  city: "",
  state: "",
  type: "",
  website: "",
  description: "",
  nirfRank: "",
};

const COLLEGE_TYPES = ["Government", "Private", "Deemed", "Autonomous", "Other"];

function nirfFrom(college: College): string {
  const r = college.rankings?.find((x) => x.source === "NIRF");
  return r?.rank != null ? String(r.rank) : "";
}

function AdminCollegesPageInner() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await api<College[]>("/colleges", { token });
      setColleges(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load colleges");
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

  const filtered = useMemo(() => {
    if (!q.trim()) return colleges;
    const needle = q.toLowerCase();
    return colleges.filter((c) => {
      const hay = `${c.name} ${c.city || ""} ${c.state || ""} ${c.type || ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [colleges, q]);

  const stats = useMemo(
    () => ({
      total: colleges.length,
      verified: colleges.filter((c) => c.isVerified).length,
    }),
    [colleges],
  );

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  function openEdit(c: College) {
    setEditingId(c.id);
    setForm({
      name: c.name || "",
      city: c.city || "",
      state: c.state || "",
      type: c.type || "",
      website: c.website || "",
      description: c.description || "",
      nirfRank: nirfFrom(c),
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
    setSaving(true);
    setError("");
    try {
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        type: form.type.trim() || null,
        website: form.website.trim() || null,
        description: form.description.trim() || null,
      };
      if (form.nirfRank.trim()) payload.nirfRank = Number(form.nirfRank);
      if (editingId) {
        await api(`/colleges/${editingId}`, { method: "PATCH", token, body: JSON.stringify(payload) });
        setMsg("College updated.");
      } else {
        await api("/colleges", { method: "POST", token, body: JSON.stringify(payload) });
        setMsg("College created.");
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

  async function onDelete(c: College) {
    if (!token) return;
    if (!window.confirm(`Delete college "${c.name}"?`)) return;
    setBusyId(c.id);
    setError("");
    try {
      await api(`/colleges/${c.id}`, { method: "DELETE", token });
      setMsg("College removed.");
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
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-[#0B1F3A] lg:text-[28px]">
              College Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Maintain the college directory — locations, types, and NIRF rankings.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(15,61,222,0.25)]"
          >
            <Plus size={16} /> Add College
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Total Colleges</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-[#0B1F3A]">{stats.total}</p>
            <p className="mt-2 inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
              In directory
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Verified</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-[#0B1F3A]">{stats.verified}</p>
            <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              Verified profiles
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              className="input w-full pl-10"
              placeholder="Search name, city, or state…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Loading colleges…
          </p>
        )}
        {error && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">{error}</p>
        )}
        {msg && (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">{msg}</p>
        )}

        {formOpen && (
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 lg:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0B1F3A]">
                {editingId ? "Edit College" : "New College"}
              </h2>
              <button
                type="button"
                className="rounded-full p-2 text-slate-400 hover:bg-slate-50"
                onClick={() => {
                  setFormOpen(false);
                  setEditingId(null);
                }}
              >
                <X size={18} />
              </button>
            </div>
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
                  placeholder="e.g. Anna University"
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
                  Type
                </span>
                <select
                  className="input"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                >
                  <option value="">Select type</option>
                  {COLLEGE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  NIRF Rank
                </span>
                <input
                  className="input"
                  type="number"
                  min={1}
                  value={form.nirfRank}
                  onChange={(e) => setForm((f) => ({ ...f, nirfRank: e.target.value }))}
                  placeholder="e.g. 42"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Website
                </span>
                <input
                  className="input"
                  type="url"
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
              <div className="flex gap-2 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingId ? "Update College" : "Save College"}
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
          </section>
        )}

        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">College</th>
                <th className="px-4 py-3 font-semibold">City</th>
                <th className="px-4 py-3 font-semibold">State</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">NIRF</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">{c.city || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{c.state || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{c.type || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{nirfFrom(c) || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(c)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#0F3DDE] hover:bg-blue-50"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        disabled={busyId === c.id}
                        onClick={() => void onDelete(c)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      >
                        {busyId === c.id ? (
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
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center py-12 text-slate-400">
              <Building2 size={32} />
              <p className="mt-2 text-sm">No colleges match your search.</p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

export default function AdminCollegesPage() {
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
      <AdminCollegesPageInner />
    </Suspense>
  );
}
