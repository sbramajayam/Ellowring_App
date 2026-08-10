"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Layers, Loader2, Pencil, Plus, Save, Star, Trash2, X } from "lucide-react";
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

type Project = {
  id: string;
  title: string;
  domain?: string | null;
  description?: string | null;
  duration?: string | null;
  stipend?: number | string | null;
  skills?: string | null;
  isActive?: boolean;
  technologies?: { technology?: string; name?: string }[];
  company?: { name?: string; industry?: string } | null;
};

const emptyForm = {
  title: "",
  domain: "",
  description: "",
  duration: "",
  stipend: "",
  skills: "",
  isActive: true,
};

function techTags(p: Project): string[] {
  if (p.technologies?.length) {
    return p.technologies.map((t) => labelOf(t.technology ?? t.name ?? t)).filter(Boolean);
  }
  if (p.skills) return p.skills.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

export default function ProjectsPage() {
  const { token, user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "COMPANY" || user?.role === "TRAINING";
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await api<Project[]>("/projects?all=1", { token });
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const hay = `${item.title} ${item.description || ""} ${item.domain || ""} ${techTags(item).join(" ")}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (statusFilter === "active" && item.isActive === false) return false;
      if (statusFilter === "completed" && item.isActive !== false) return false;
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

  function openEdit(item: Project) {
    const skills =
      item.skills ||
      (item.technologies?.length
        ? item.technologies.map((t) => labelOf(t.technology ?? t.name ?? t)).join(", ")
        : "");
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      domain: item.domain || "",
      description: item.description || "",
      duration: item.duration || "",
      stipend: item.stipend != null ? String(item.stipend) : "",
      skills,
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
        domain: form.domain.trim() || null,
        description: form.description.trim() || null,
        duration: form.duration.trim() || null,
        stipend: form.stipend !== "" ? Number(form.stipend) : null,
        skills: form.skills.trim() || null,
        isActive: form.isActive,
      };
      if (editingId) {
        await api(`/projects/${editingId}`, { method: "PATCH", token, body: JSON.stringify(payload) });
        setMsg("Project updated.");
      } else {
        await api("/projects", { method: "POST", token, body: JSON.stringify(payload) });
        setMsg("Project created.");
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

  async function onDelete(item: Project) {
    if (!token) return setError("Sign in required.");
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    setBusyId(item.id);
    try {
      await api(`/projects/${item.id}`, { method: "DELETE", token });
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
      await api("/applications", { method: "POST", token, body: JSON.stringify({ projectId: id }) });
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
        title="Live Projects"
        description="Mentor-supervised industry projects with sprint delivery and portfolio output."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard/student" }, { label: "Opportunities" }]}
        actions={
          canManage ? (
            <PrimaryButton onClick={openCreate}>
              <Plus size={16} /> Add Project
            </PrimaryButton>
          ) : undefined
        }
        filters={
          <>
            <ModuleSearchInput value={q} onChange={setQ} placeholder="Search projects, tech stack…" />
            <ModuleSelect
              value={statusFilter}
              onChange={setStatusFilter}
              label="Status"
              options={[
                { value: "all", label: "All" },
                { value: "active", label: "In-Progress" },
                { value: "completed", label: "Completed" },
              ]}
            />
          </>
        }
      >
        {loading && (
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Loading projects…
          </p>
        )}
        {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">{error}</p>}
        {msg && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">{msg}</p>}

        {canManage && formOpen ? (
          <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 lg:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0B1F3A]">{editingId ? "Edit Project" : "New Project"}</h2>
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
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Domain</span>
                <input className="input" value={form.domain} onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))} />
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Duration</span>
                <input className="input" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="e.g. 6 weeks" />
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Stipend (₹)</span>
                <input className="input" type="number" min={0} value={form.stipend} onChange={(e) => setForm((f) => ({ ...f, stipend: e.target.value }))} />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Tech stack (comma-separated)</span>
                <input className="input" value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} placeholder="React, NestJS, SQL" />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Description</span>
                <textarea className="input min-h-[100px] resize-y" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </label>
              <label className="flex items-center gap-2 sm:col-span-2">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-[#0F3DDE]" />
                <span className="text-sm font-semibold text-slate-700">In-Progress (uncheck for Completed)</span>
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
              const tags = techTags(item);
              const completed = item.isActive === false;
              return (
                <article key={item.id} className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                        <Layers size={20} />
                      </span>
                      <div>
                        <h2 className="font-bold text-slate-900">{item.title}</h2>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {labelOf(item.description, "Industry live project with mentor reviews.")}
                        </p>
                      </div>
                    </div>
                    <StatusPill tone={completed ? "green" : "amber"}>
                      {completed ? "Completed" : "In-Progress"}
                    </StatusPill>
                  </div>
                  {tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tags.map((t) => (
                        <span key={t} className="rounded-lg bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-100">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-0.5 font-semibold text-amber-600">
                      <Star size={12} fill="currentColor" /> 4.5
                    </span>
                    {item.duration ? <span>{item.duration}</span> : null}
                    {item.stipend != null ? <span>₹{moneyOf(item.stipend)} stipend</span> : null}
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
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-slate-100">
            <p className="text-sm text-slate-500">No projects found.</p>
            {canManage ? (
              <PrimaryButton onClick={openCreate}>
                <Plus size={16} /> Add Project
              </PrimaryButton>
            ) : null}
          </div>
        )}
      </StudentModuleChrome>
    </StudentShell>
  );
}
