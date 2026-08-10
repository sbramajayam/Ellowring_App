"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Compass, Loader2, Pencil, Plus, Save, Sparkles, Trash2, TrendingUp, X } from "lucide-react";
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

type Pathway = {
  id: string;
  title: string;
  summary?: string | null;
  description?: string | null;
  category?: string | null;
  growth?: string | null;
  source?: string | null;
  metadata?: { category?: string; growth?: string } | null;
  careerInterest?: { title?: string; category?: string } | null;
};

const emptyForm = {
  title: "",
  summary: "",
  category: "general",
  growth: "Medium",
};

const GROWTH_OPTIONS = [
  { value: "Very High", label: "Very High" },
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Stable", label: "Stable" },
  { value: "Low", label: "Low" },
];

function growthOf(p: Pathway): string {
  if (p.metadata?.growth) return p.metadata.growth;
  if (p.growth) return p.growth;
  return "Medium";
}

function categoryOf(p: Pathway): string {
  if (p.metadata?.category) return p.metadata.category;
  if (p.category) return p.category;
  if (p.careerInterest?.category) return p.careerInterest.category;
  return "Career";
}

function growthTone(growth: string): "green" | "amber" | "blue" | "slate" {
  const g = growth.toLowerCase();
  if (g.includes("very high") || g === "high") return "green";
  if (g.includes("stable") || g.includes("medium")) return "amber";
  if (g.includes("low")) return "slate";
  return "blue";
}

function isFallback(id: string): boolean {
  return id.startsWith("fallback-");
}

export default function CareerPage() {
  const { token, user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "TRAINING";
  const [items, setItems] = useState<Pathway[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await api<Pathway[]>("/career", { token });
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load pathways");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const catOptions = useMemo(() => {
    const set = new Set<string>();
    items.forEach((p) => set.add(categoryOf(p)));
    return [{ value: "all", label: "All categories" }, ...[...set].map((c) => ({ value: c, label: c }))];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const hay = `${item.title} ${item.summary || ""} ${categoryOf(item)}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (catFilter !== "all" && categoryOf(item) !== catFilter) return false;
      return true;
    });
  }, [items, q, catFilter]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  function openEdit(item: Pathway) {
    if (isFallback(item.id)) return;
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      summary: item.summary || item.description || "",
      category: categoryOf(item),
      growth: growthOf(item),
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
        summary: form.summary.trim() || null,
        category: form.category,
        growth: form.growth,
      };
      if (editingId) {
        await api(`/career/${editingId}`, { method: "PATCH", token, body: JSON.stringify(payload) });
        setMsg("Pathway updated.");
      } else {
        await api("/career", { method: "POST", token, body: JSON.stringify(payload) });
        setMsg("Pathway created.");
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

  async function onDelete(item: Pathway) {
    if (isFallback(item.id)) return;
    if (!token) return setError("Sign in required.");
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    setBusyId(item.id);
    try {
      await api(`/career/${item.id}`, { method: "DELETE", token });
      setMsg(`Deleted “${item.title}”.`);
      if (editingId === item.id) setFormOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <StudentShell>
      <StudentModuleChrome
        title="Career Guidance"
        description="Structured pathways from school streams to first-job playbooks."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard/student" }, { label: "Career" }]}
        actions={
          canManage ? (
            <PrimaryButton onClick={openCreate}>
              <Plus size={16} /> Add Pathway
            </PrimaryButton>
          ) : undefined
        }
        filters={
          <>
            <ModuleSearchInput value={q} onChange={setQ} placeholder="Search pathways…" />
            <ModuleSelect value={catFilter} onChange={setCatFilter} options={catOptions} label="Category" />
          </>
        }
      >
        <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F3DDE] to-[#2563EB] p-6 text-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-100">
                <Sparkles size={14} /> Career Assessment
              </p>
              <h2 className="mt-1 font-display text-xl font-bold">Discover your ideal career path</h2>
              <p className="mt-1 max-w-xl text-sm text-blue-50">
                Take our AI-powered assessment to get personalized recommendations based on your interests and skills.
              </p>
            </div>
            <Link
              href="/dashboard/student/ai-assistant"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0F3DDE] shadow-lg hover:bg-blue-50"
            >
              <Compass size={16} /> Career Assessment
            </Link>
          </div>
        </section>

        {loading && (
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Loading pathways…
          </p>
        )}
        {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">{error}</p>}
        {msg && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">{msg}</p>}

        {canManage && formOpen ? (
          <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 lg:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0B1F3A]">{editingId ? "Edit Pathway" : "New Pathway"}</h2>
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
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Category</span>
                <input className="input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Growth</span>
                <select className="input" value={form.growth} onChange={(e) => setForm((f) => ({ ...f, growth: e.target.value }))}>
                  {GROWTH_OPTIONS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Summary</span>
                <textarea className="input min-h-[100px] resize-y" value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} />
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
              const growth = growthOf(item);
              const fallback = isFallback(item.id);
              return (
                <article key={item.id} className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Compass size={20} />
                    </span>
                    <StatusPill tone={growthTone(growth)}>
                      <TrendingUp size={10} className="mr-0.5 inline" />
                      {growth}
                    </StatusPill>
                  </div>
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">{categoryOf(item)}</p>
                  <h2 className="mt-1 font-bold text-slate-900">{item.title}</h2>
                  <p className="mt-2 flex-1 text-sm text-slate-500">
                    {labelOf(item.summary ?? item.description, "Career guidance pathway.")}
                  </p>
                  {!fallback && canManage && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" onClick={() => openEdit(item)} className="inline-flex items-center gap-1 rounded-xl bg-[#EFF6FF] px-3 py-2 text-xs font-bold text-[#0F3DDE] hover:bg-blue-100">
                        <Pencil size={13} /> Edit
                      </button>
                      <button type="button" disabled={!!busyId} onClick={() => void onDelete(item)} className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 disabled:opacity-60">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-slate-100">
            <p className="text-sm text-slate-500">No pathways found.</p>
            {canManage ? (
              <PrimaryButton onClick={openCreate}>
                <Plus size={16} /> Add Pathway
              </PrimaryButton>
            ) : null}
          </div>
        )}
      </StudentModuleChrome>
    </StudentShell>
  );
}
