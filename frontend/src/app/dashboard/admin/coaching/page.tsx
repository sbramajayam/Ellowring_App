"use client";

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GraduationCap, Loader2, Pencil, Save, Trash2 } from "lucide-react";
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

type Category = { id: string; name: string; slug: string };

type Coaching = {
  id: string;
  title: string;
  examType?: string | null;
  categoryId?: string;
  category?: { id?: string; name?: string; slug?: string } | string | null;
  duration?: string | null;
  batchSize?: number | null;
  price?: number | string;
  description?: string | null;
  thumbnail?: string | null;
  isPublished?: boolean;
};

const emptyForm = {
  title: "",
  examType: "NEET",
  categoryId: "",
  duration: "",
  batchSize: "",
  price: "0",
  description: "",
  thumbnail: "",
  isPublished: true,
};

const EXAM_TYPES = ["NEET", "JEE", "CUET", "UPSC", "Other"];

function AdminCoachingPageInner() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Coaching[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [pubFilter, setPubFilter] = useState<"all" | "published" | "draft">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, cats] = await Promise.all([
        api<Coaching[]>("/coaching?all=1", { token }),
        api<Category[]>("/coaching/meta/categories", { token }).catch(() => [] as Category[]),
      ]);
      setItems(Array.isArray(list) ? list : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load coaching");
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
      setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
      setFormOpen(true);
    }
  }, [searchParams, categories]);

  const stats = useMemo(() => {
    const active = items.filter((c) => c.isPublished !== false).length;
    const draft = items.length - active;
    return { total: items.length, active, draft, cancelled: draft };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((c) => {
      const hay = `${c.title} ${c.examType || ""} ${labelOf(c.category)} ${c.description || ""}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (pubFilter === "published" && c.isPublished === false) return false;
      if (pubFilter === "draft" && c.isPublished !== false) return false;
      return true;
    });
  }, [items, q, pubFilter]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  function openEdit(c: Coaching) {
    setEditingId(c.id);
    setForm({
      title: c.title || "",
      examType: c.examType || "NEET",
      categoryId:
        c.categoryId ||
        (typeof c.category === "object" && c.category?.id ? c.category.id : "") ||
        categories[0]?.id ||
        "",
      duration: c.duration || "",
      batchSize: c.batchSize != null ? String(c.batchSize) : "",
      price: String(c.price ?? 0),
      description: c.description || "",
      thumbnail: c.thumbnail || "",
      isPublished: c.isPublished !== false,
    });
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        examType: form.examType || "NEET",
        categoryId: form.categoryId || undefined,
        duration: form.duration.trim() || null,
        batchSize: form.batchSize.trim() ? Number(form.batchSize) : null,
        price: Number(form.price) || 0,
        description: form.description.trim() || null,
        thumbnail: form.thumbnail.trim() || null,
        isPublished: form.isPublished,
      };
      if (editingId) {
        await api(`/coaching/${editingId}`, { method: "PATCH", token, body: JSON.stringify(payload) });
        setMsg("Batch updated.");
      } else {
        await api("/coaching", { method: "POST", token, body: JSON.stringify(payload) });
        setMsg("Batch created.");
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

  async function onDelete(c: Coaching) {
    if (!token) return;
    if (!window.confirm(`Delete batch "${c.title}"?`)) return;
    setBusyId(c.id);
    setError("");
    try {
      await api(`/coaching/${c.id}`, { method: "DELETE", token });
      setMsg("Batch removed.");
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
          title="Coaching Management"
          description="Manage coaching batches and programmes — exams, pricing, and publish status."
          actionLabel="Add Batch"
          onAction={openCreate}
        />

        <AdminStatRow
          stats={[
            { label: "Total Batches", value: stats.total, sub: "All programmes", tint: "text-[#0F3DDE] bg-blue-50" },
            { label: "Active", value: stats.active, sub: "Published", tint: "text-emerald-700 bg-emerald-50" },
            { label: "Draft", value: stats.draft, sub: "Unpublished", tint: "text-amber-700 bg-amber-50" },
            { label: "Cancelled", value: stats.cancelled, sub: "Unpublished count", tint: "text-slate-600 bg-slate-100" },
          ]}
        />

        <AdminToolbar
          q={q}
          onQ={setQ}
          placeholder="Search batches…"
          filters={
            <AdminFilterPills
              value={pubFilter}
              onChange={setPubFilter}
              options={[
                { id: "all", label: "All" },
                { id: "published", label: "Published" },
                { id: "draft", label: "Draft" },
              ]}
            />
          }
        />

        <AdminFlash loading={loading} error={error} msg={msg} loadingLabel="Loading coaching…" />

        {formOpen && (
          <AdminFormPanel
            title={editingId ? "Edit Batch" : "New Batch"}
            onClose={() => {
              setFormOpen(false);
              setEditingId(null);
            }}
          >
            <form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Title *
                </span>
                <input
                  className="input"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. NEET Crash Course 2026"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Exam Type
                </span>
                <select
                  className="input"
                  value={form.examType}
                  onChange={(e) => setForm((f) => ({ ...f, examType: e.target.value }))}
                >
                  {EXAM_TYPES.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Category
                </span>
                <select
                  className="input"
                  value={form.categoryId}
                  onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                >
                  <option value="">Auto</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Duration
                </span>
                <input
                  className="input"
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                  placeholder="6 months"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Batch Size
                </span>
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={form.batchSize}
                  onChange={(e) => setForm((f) => ({ ...f, batchSize: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Price (₹)
                </span>
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Thumbnail URL
                </span>
                <input
                  className="input"
                  value={form.thumbnail}
                  onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))}
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
              <label className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                />
                <span className="text-sm font-semibold text-slate-700">Published</span>
              </label>
              <div className="flex gap-2 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingId ? "Update Batch" : "Save Batch"}
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
                <th className="px-4 py-3 font-semibold">Batch/Programme Name</th>
                <th className="px-4 py-3 font-semibold">Exam</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-800">{c.title}</td>
                  <td className="px-4 py-3 text-slate-600">{c.examType || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{labelOf(c.category, "—")}</td>
                  <td className="px-4 py-3 text-slate-600">₹{moneyOf(c.price, "0")}</td>
                  <td className="px-4 py-3">
                    {statusPill(c.isPublished !== false, { on: "Published", off: "Draft" })}
                  </td>
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
                        {busyId === c.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}{" "}
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
              <GraduationCap size={32} />
              <p className="mt-2 text-sm">No batches match your filters.</p>
            </div>
          )}
        </AdminTableCard>
      </div>
    </AdminShell>
  );
}

export default function AdminCoachingPage() {
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
      <AdminCoachingPageInner />
    </Suspense>
  );
}
