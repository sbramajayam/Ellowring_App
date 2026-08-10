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

type Job = {
  id: string;
  title: string;
  location?: string | null;
  type?: string | null;
  mode?: string | null;
  salaryMin?: number | string | null;
  salaryMax?: number | string | null;
  experience?: string | null;
  skills?: string | null;
  description?: string | null;
  isActive?: boolean;
  company?: { name?: string; industry?: string; city?: string; logoUrl?: string } | null;
};

const emptyForm = {
  title: "",
  location: "",
  type: "FULL_TIME",
  mode: "HYBRID",
  salaryMin: "",
  salaryMax: "",
  experience: "",
  skills: "",
  description: "",
  isActive: true,
};

const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
];

const MODES = [
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "On-site" },
];

function salaryLabel(job: Job): string {
  const min = job.salaryMin != null ? moneyOf(job.salaryMin) : null;
  const max = job.salaryMax != null ? moneyOf(job.salaryMax) : null;
  if (min && max) return `₹${min} – ₹${max}`;
  if (min) return `₹${min}+`;
  if (max) return `Up to ₹${max}`;
  return "Competitive";
}

export default function JobsPage() {
  const { token, user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "COMPANY" || user?.role === "TRAINING";
  const [items, setItems] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await api<Job[]>("/jobs?all=1", { token });
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load jobs");
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
      if (typeFilter !== "all" && String(item.type || "") !== typeFilter) return false;
      return true;
    });
  }, [items, q, typeFilter]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  function openEdit(item: Job) {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      location: item.location || "",
      type: item.type || "FULL_TIME",
      mode: item.mode || "HYBRID",
      salaryMin: item.salaryMin != null ? String(item.salaryMin) : "",
      salaryMax: item.salaryMax != null ? String(item.salaryMax) : "",
      experience: item.experience || "",
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
        type: form.type,
        mode: form.mode,
        salaryMin: form.salaryMin !== "" ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax !== "" ? Number(form.salaryMax) : null,
        experience: form.experience.trim() || null,
        skills: form.skills.trim() || null,
        description: form.description.trim() || null,
        isActive: form.isActive,
      };
      if (editingId) {
        await api(`/jobs/${editingId}`, { method: "PATCH", token, body: JSON.stringify(payload) });
        setMsg("Job updated.");
      } else {
        await api("/jobs", { method: "POST", token, body: JSON.stringify(payload) });
        setMsg("Job created.");
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

  async function onDelete(item: Job) {
    if (!token) return setError("Sign in required.");
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    setBusyId(item.id);
    try {
      await api(`/jobs/${item.id}`, { method: "DELETE", token });
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
    try {
      await api("/applications", { method: "POST", token, body: JSON.stringify({ jobId: id }) });
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
        title="Jobs"
        description="Partner placement drives, full-time roles and internship-to-hire paths."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard/student" }, { label: "Opportunities" }]}
        actions={
          canManage ? (
            <PrimaryButton onClick={openCreate}>
              <Plus size={16} /> Add Job
            </PrimaryButton>
          ) : undefined
        }
        filters={
          <>
            <ModuleSearchInput value={q} onChange={setQ} placeholder="Search title, company, skills…" />
            <ModuleSelect
              value={typeFilter}
              onChange={setTypeFilter}
              label="Type"
              options={[{ value: "all", label: "All types" }, ...JOB_TYPES]}
            />
          </>
        }
      >
        {loading && (
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Loading jobs…
          </p>
        )}
        {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">{error}</p>}
        {msg && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">{msg}</p>}

        {canManage && formOpen ? (
          <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 lg:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0B1F3A]">{editingId ? "Edit Job" : "New Job"}</h2>
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
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Type</span>
                <select className="input" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                  {JOB_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
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
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Experience</span>
                <input className="input" value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} placeholder="e.g. 0–2 years" />
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Salary Min (₹)</span>
                <input className="input" type="number" min={0} value={form.salaryMin} onChange={(e) => setForm((f) => ({ ...f, salaryMin: e.target.value }))} />
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Salary Max (₹)</span>
                <input className="input" type="number" min={0} value={form.salaryMax} onChange={(e) => setForm((f) => ({ ...f, salaryMax: e.target.value }))} />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Skills (comma-separated)</span>
                <input className="input" value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} />
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
            {filtered.map((item) => (
              <article key={item.id} className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Briefcase size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#0F3DDE]">{labelOf(item.company, "Company")}</p>
                    <h2 className="mt-0.5 font-bold text-slate-900">{item.title}</h2>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} /> {labelOf(item.location, "Location TBD")}
                  </span>
                  <StatusPill tone="blue">{labelOf(item.type, "Full-time")}</StatusPill>
                </div>
                <div className="mt-3 space-y-1 text-sm">
                  <p className="text-slate-600">
                    <span className="font-semibold text-slate-700">Experience:</span> {labelOf(item.experience, "Not specified")}
                  </p>
                  <p className="font-bold text-slate-800">{salaryLabel(item)}</p>
                </div>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <PrimaryButton onClick={() => onApply(item.id, item.title)} disabled={busyId === item.id}>
                    {busyId === item.id ? "Applying…" : "Apply"}
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
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-slate-100">
            <p className="text-sm text-slate-500">No jobs found.</p>
            {canManage ? (
              <PrimaryButton onClick={openCreate}>
                <Plus size={16} /> Add Job
              </PrimaryButton>
            ) : null}
          </div>
        )}
      </StudentModuleChrome>
    </StudentShell>
  );
}
