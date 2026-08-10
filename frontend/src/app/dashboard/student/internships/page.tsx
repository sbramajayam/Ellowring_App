"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Briefcase, Loader2, MapPin, Pencil, Plus, Save, Trash2, X } from "lucide-react";
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
import { labelOf, moneyOf } from "@/lib/labels";

type Internship = {
  id: string;
  title: string;
  location?: string | null;
  mode?: string | null;
  stipend?: number | string | null;
  duration?: string | null;
  skills?: string | null;
  description?: string | null;
  isActive?: boolean;
  company?: { name?: string; city?: string; industry?: string; logoUrl?: string } | null;
};

const emptyForm = {
  title: "",
  location: "",
  mode: "REMOTE",
  stipend: "",
  duration: "",
  skills: "",
  description: "",
  isActive: true,
};

const MODES = [
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "On-site" },
];

function skillTags(skills?: string | null): string[] {
  if (!skills) return [];
  return skills.split(",").map((s) => s.trim()).filter(Boolean);
}

export default function InternshipsPage() {
  const { token, user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "COMPANY" || user?.role === "TRAINING";
  const [items, setItems] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await api<Internship[]>("/internships?all=1", { token });
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load internships");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const hay = `${item.title} ${labelOf(item.company)} ${item.location || ""} ${item.skills || ""}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (modeFilter !== "all" && String(item.mode || "") !== modeFilter) return false;
      return true;
    });
  }, [items, q, modeFilter]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  function openEdit(item: Internship) {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      location: item.location || "",
      mode: item.mode || "REMOTE",
      stipend: item.stipend != null ? String(item.stipend) : "",
      duration: item.duration || "",
      skills: item.skills || "",
      description: item.description || "",
      isActive: item.isActive !== false,
    });
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!token) return setError("Sign in required.");
    if (!form.title.trim()) return setError("Title is required.");
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        location: form.location.trim() || null,
        mode: form.mode,
        stipend: form.stipend !== "" ? Number(form.stipend) : null,
        duration: form.duration.trim() || null,
        skills: form.skills.trim() || null,
        description: form.description.trim() || null,
        isActive: form.isActive,
      };
      if (editingId) {
        await api(`/internships/${editingId}`, { method: "PATCH", token, body: JSON.stringify(payload) });
        setMsg("Internship updated.");
      } else {
        await api("/internships", { method: "POST", token, body: JSON.stringify(payload) });
        setMsg("Internship created.");
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

  async function onDelete(item: Internship) {
    if (!token) return setError("Sign in required.");
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    setBusyId(item.id);
    setError("");
    try {
      await api(`/internships/${item.id}`, { method: "DELETE", token });
      setMsg(`Deleted “${item.title}”.`);
      if (editingId === item.id) setFormOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  async function onApply(id: string, title: string) {
    if (!token) return setError("Sign in required.");
    setBusyId(id);
    setError("");
    try {
      await api("/applications", { method: "POST", token, body: JSON.stringify({ internshipId: id }) });
      setMsg(`Applied to ${title}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Apply failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <StudentShell>
      <StudentModuleChrome
        title="Internships"
        description="Company-backed internships with mentor reviews and completion certificates."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard/student" }, { label: "Opportunities" }]}
        actions={
          canManage ? (
            <PrimaryButton onClick={openCreate}>
              <Plus size={16} /> Add Internship
            </PrimaryButton>
          ) : undefined
        }
        filters={
          <>
            <ModuleSearchInput value={q} onChange={setQ} placeholder="Search role, company, skills…" />
            <ModuleSelect
              value={modeFilter}
              onChange={setModeFilter}
              label="Mode"
              options={[{ value: "all", label: "All modes" }, ...MODES]}
            />
          </>
        }
      >
        {loading && (
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Loading internships…
          </p>
        )}
        {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">{error}</p>}
        {msg && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">{msg}</p>}

        {canManage && formOpen ? (
          <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 lg:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0B1F3A]">
                {editingId ? "Edit Internship" : "New Internship"}
              </h2>
              <button type="button" className="rounded-full p-2 text-slate-400 hover:bg-slate-50" onClick={() => setFormOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Title *</span>
                <input className="input" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Location</span>
                <input className="input" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Mode</span>
                <select className="input" value={form.mode} onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value }))}>
                  {MODES.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Stipend (₹)</span>
                <input className="input" type="number" min={0} value={form.stipend} onChange={(e) => setForm((f) => ({ ...f, stipend: e.target.value }))} />
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Duration</span>
                <input className="input" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="e.g. 3 months" />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Skills (comma-separated)</span>
                <input className="input" value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} placeholder="React, Node.js, SQL" />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Description</span>
                <textarea className="input min-h-[100px] resize-y" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </label>
              <label className="flex items-center gap-2 sm:col-span-2">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-[#0F3DDE]" />
                <span className="text-sm font-semibold text-slate-700">Active listing</span>
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

        {!loading && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => {
              const tags = skillTags(item.skills);
              const stipendLabel = item.stipend != null ? `₹${moneyOf(item.stipend)}/mo` : "Unpaid / negotiable";
              return (
                <article key={item.id} className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0F3DDE]">
                      <Briefcase size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-slate-900">{item.title}</h2>
                      <p className="mt-0.5 text-sm font-semibold text-[#0F3DDE]">{labelOf(item.company, "Company")}</p>
                    </div>
                    {item.isActive === false ? <StatusPill tone="slate">Inactive</StatusPill> : null}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} /> {labelOf(item.location, "Flexible")}
                    </span>
                    <StatusPill tone="blue">{labelOf(item.mode, "Remote")}</StatusPill>
                    {item.duration ? <span>{item.duration}</span> : null}
                  </div>
                  <p className="mt-2 text-sm font-bold text-slate-800">{stipendLabel}</p>
                  {tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tags.map((t) => (
                        <span key={t} className="rounded-lg bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-100">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    <PrimaryButton onClick={() => onApply(item.id, item.title)} disabled={busyId === item.id}>
                      {busyId === item.id ? "Applying…" : "Apply Now"}
                    </PrimaryButton>
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
            <p className="text-sm text-slate-500">No internships found.</p>
            {canManage ? (
              <PrimaryButton onClick={openCreate}>
                <Plus size={16} /> Add Internship
              </PrimaryButton>
            ) : null}
          </div>
        )}
      </StudentModuleChrome>
    </StudentShell>
  );
}
