"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Building2, ExternalLink, Loader2, MapPin, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import {
  ModuleSearchInput,
  ModuleSelect,
  PrimaryButton,
  StatusPill,
  StudentModuleChrome,
} from "@/components/student-home/module-chrome";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf } from "@/lib/labels";

type Ranking = { source?: string; rank?: number; year?: number; category?: string };
type College = {
  id: string;
  name: string;
  city?: string | null;
  state?: string | null;
  type?: string | null;
  website?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  isVerified?: boolean;
  rankings?: Ranking[];
};

const emptyForm = {
  name: "",
  city: "",
  state: "",
  type: "",
  website: "",
  description: "",
  nirfRank: "",
  logoUrl: "",
};

function nirfRank(college: College): string | null {
  const nirf = college.rankings?.find((r) => String(r.source || "").toUpperCase() === "NIRF");
  return nirf?.rank != null ? String(nirf.rank) : null;
}

export default function CollegesPage() {
  const { token, user } = useAuth();
  const canManage = user?.role === "COLLEGE" || user?.role === "ADMIN" || user?.role === "TRAINING";
  const [items, setItems] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await api<College[]>("/colleges", { token });
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load colleges");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const stateOptions = useMemo(() => {
    const set = new Set<string>();
    items.forEach((c) => {
      if (c.state) set.add(c.state);
    });
    return [{ value: "all", label: "All states" }, ...[...set].sort().map((s) => ({ value: s, label: s }))];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const hay = `${item.name} ${item.city || ""} ${item.state || ""} ${item.type || ""}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (stateFilter !== "all" && String(item.state || "") !== stateFilter) return false;
      return true;
    });
  }, [items, q, stateFilter]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  function openEdit(item: College) {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      city: item.city || "",
      state: item.state || "",
      type: item.type || "",
      website: item.website || "",
      description: item.description || "",
      nirfRank: nirfRank(item) || "",
      logoUrl: item.logoUrl || "",
    });
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!token) return setError("Sign in required.");
    if (!form.name.trim()) return setError("Name is required.");
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        type: form.type.trim() || null,
        website: form.website.trim() || null,
        description: form.description.trim() || null,
        logoUrl: form.logoUrl.trim() || null,
        nirfRank: form.nirfRank !== "" ? Number(form.nirfRank) : undefined,
      };
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

  async function onDelete(item: College) {
    if (!token) return setError("Sign in required.");
    if (!window.confirm(`Delete “${item.name}”?`)) return;
    setBusyId(item.id);
    try {
      await api(`/colleges/${item.id}`, { method: "DELETE", token });
      setMsg(`Deleted “${item.name}”.`);
      if (editingId === item.id) setFormOpen(false);
      if (detailId === item.id) setDetailId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  const detail = detailId ? items.find((c) => c.id === detailId) : null;

  return (
    <StudentShell>
      <StudentModuleChrome
        title="Colleges"
        description="Discover colleges, compare programmes, and prepare applications."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard/student" }, { label: "Career" }]}
        actions={
          canManage ? (
            <PrimaryButton onClick={openCreate}>
              <Plus size={16} /> Add College
            </PrimaryButton>
          ) : undefined
        }
        filters={
          <>
            <ModuleSearchInput value={q} onChange={setQ} placeholder="Search college name, city…" />
            <ModuleSelect value={stateFilter} onChange={setStateFilter} options={stateOptions} label="State" />
          </>
        }
      >
        {loading && (
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Loading colleges…
          </p>
        )}
        {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">{error}</p>}
        {msg && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">{msg}</p>}

        {canManage && formOpen ? (
          <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 lg:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0B1F3A]">{editingId ? "Edit College" : "New College"}</h2>
              <button type="button" className="rounded-full p-2 text-slate-400 hover:bg-slate-50" onClick={() => setFormOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Name *</span>
                <input className="input" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">City</span>
                <input className="input" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">State</span>
                <input className="input" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} />
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Type</span>
                <input className="input" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} placeholder="e.g. Engineering" />
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">NIRF Rank</span>
                <input className="input" type="number" min={1} value={form.nirfRank} onChange={(e) => setForm((f) => ({ ...f, nirfRank: e.target.value }))} />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Website</span>
                <input className="input" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="https://…" />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Logo URL</span>
                <input className="input" value={form.logoUrl} onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))} />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Description</span>
                <textarea className="input min-h-[100px] resize-y" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </label>
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <PrimaryButton type="submit" disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? "Saving…" : "Save"}
                </PrimaryButton>
                <button type="button" onClick={() => setFormOpen(false)} className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {detail ? (
          <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 lg:p-6">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0F3DDE]">
                  {detail.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={detail.logoUrl} alt="" className="h-10 w-10 rounded-lg object-contain" />
                  ) : (
                    <Building2 size={24} />
                  )}
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold text-[#0B1F3A]">{detail.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {[detail.city, detail.state].filter(Boolean).join(", ") || "India"}
                    {nirfRank(detail) ? ` · NIRF #${nirfRank(detail)}` : ""}
                  </p>
                </div>
              </div>
              <button type="button" className="rounded-full p-2 text-slate-400 hover:bg-slate-50" onClick={() => setDetailId(null)}>
                <X size={18} />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              {labelOf(detail.description, "Explore courses, rankings and admissions.")}
            </p>
          </section>
        ) : null}

        {!loading && (
          <div className="space-y-3">
            {filtered.map((item) => {
              const rank = nirfRank(item);
              const location = [item.city, item.state].filter(Boolean).join(", ") || "India";
              return (
                <article
                  key={item.id}
                  className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0F3DDE]">
                    {item.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.logoUrl} alt="" className="h-10 w-10 rounded-lg object-contain" />
                    ) : (
                      <Building2 size={24} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-slate-900">{item.name}</h2>
                      {item.isVerified ? <StatusPill tone="green">Verified</StatusPill> : null}
                      {rank ? <StatusPill tone="blue">NIRF #{rank}</StatusPill> : null}
                    </div>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-sm text-slate-500">
                      <MapPin size={13} /> {location}
                      {item.type ? ` · ${item.type}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {item.website ? (
                      <a
                        href={item.website.startsWith("http") ? item.website : `https://${item.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <ExternalLink size={13} /> View Website
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setDetailId(item.id)}
                      className="rounded-xl bg-[#EFF6FF] px-3 py-2 text-xs font-bold text-[#0F3DDE] hover:bg-blue-100"
                    >
                      View Details
                    </button>
                    {canManage ? (
                      <>
                        <button type="button" onClick={() => openEdit(item)} className="inline-flex items-center gap-1 rounded-xl bg-[#EFF6FF] px-3 py-2 text-xs font-bold text-[#0F3DDE] hover:bg-blue-100">
                          <Pencil size={13} /> Edit
                        </button>
                        <button type="button" disabled={!!busyId} onClick={() => void onDelete(item)} className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 disabled:opacity-60">
                          <Trash2 size={13} /> Delete
                        </button>
                      </>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-slate-100">
            <p className="text-sm text-slate-500">No colleges found.</p>
            {canManage ? (
              <PrimaryButton onClick={openCreate}>
                <Plus size={16} /> Add College
              </PrimaryButton>
            ) : null}
          </div>
        )}
      </StudentModuleChrome>
    </StudentShell>
  );
}
