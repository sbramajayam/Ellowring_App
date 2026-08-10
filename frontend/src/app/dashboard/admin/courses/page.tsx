"use client";

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import clsx from "clsx";
import { AdminShell } from "@/components/admin-shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf, moneyOf } from "@/lib/labels";

type Category = { id: string; name: string; slug: string };

type Course = {
  id: string;
  title: string;
  categoryId?: string;
  category?: { id?: string; name?: string; slug?: string } | string | null;
  level?: string | null;
  duration?: string | null;
  price: number | string;
  description?: string | null;
  thumbnail?: string | null;
  isPublished?: boolean;
};

const emptyForm = {
  title: "",
  categoryId: "",
  level: "Beginner",
  duration: "",
  price: "0",
  description: "",
  thumbnail: "",
  isPublished: true,
};

const LEVELS = ["Beginner", "Intermediate", "Advanced", "All levels"];

function AdminCoursesPageInner() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
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
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const [list, cats] = await Promise.all([
        api<Course[]>("/courses?all=1", { token }),
        api<Category[]>("/courses/meta/categories", { token }).catch(() => [] as Category[]),
      ]);
      setCourses(Array.isArray(list) ? list : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load courses");
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
    const published = courses.filter((c) => c.isPublished !== false).length;
    return { total: courses.length, published, draft: courses.length - published };
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const hay = `${c.title} ${c.description || ""} ${labelOf(c.category)} ${c.level || ""}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (pubFilter === "published" && c.isPublished === false) return false;
      if (pubFilter === "draft" && c.isPublished !== false) return false;
      return true;
    });
  }, [courses, q, pubFilter]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  function openEdit(c: Course) {
    setEditingId(c.id);
    setForm({
      title: c.title || "",
      categoryId:
        c.categoryId ||
        (typeof c.category === "object" && c.category?.id ? c.category.id : "") ||
        categories[0]?.id ||
        "",
      level: c.level || "Beginner",
      duration: c.duration || "",
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
        categoryId: form.categoryId || undefined,
        level: form.level,
        duration: form.duration.trim() || null,
        price: Number(form.price) || 0,
        description: form.description.trim() || null,
        thumbnail: form.thumbnail.trim() || null,
        isPublished: form.isPublished,
      };
      if (editingId) {
        await api(`/courses/${editingId}`, { method: "PATCH", token, body: JSON.stringify(payload) });
        setMsg("Course updated.");
      } else {
        await api("/courses", { method: "POST", token, body: JSON.stringify(payload) });
        setMsg("Course created.");
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

  async function onDelete(c: Course) {
    if (!token) return;
    if (!window.confirm(`Delete course "${c.title}"?`)) return;
    setBusyId(c.id);
    setError("");
    try {
      await api(`/courses/${c.id}`, { method: "DELETE", token });
      setMsg("Course removed.");
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
              Course Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create and publish courses — categories, pricing, and visibility.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(15,61,222,0.25)]"
          >
            <Plus size={16} /> Add Course
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Total", value: stats.total, sub: "All courses", tint: "text-[#0F3DDE] bg-blue-50" },
            { label: "Published", value: stats.published, sub: "Live on platform", tint: "text-emerald-700 bg-emerald-50" },
            { label: "Draft", value: stats.draft, sub: "Unpublished", tint: "text-amber-700 bg-amber-50" },
          ].map((k) => (
            <div key={k.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{k.label}</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-[#0B1F3A]">{k.value}</p>
              <p className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${k.tint}`}>
                {k.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              className="input w-full pl-10"
              placeholder="Search courses…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "all", label: "All" },
                { id: "published", label: "Published" },
                { id: "draft", label: "Draft" },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setPubFilter(f.id)}
                className={clsx(
                  "rounded-full px-3 py-1.5 text-xs font-bold transition",
                  pubFilter === f.id
                    ? "bg-[#0F3DDE] text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Loading courses…
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
                {editingId ? "Edit Course" : "New Course"}
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
                  Title *
                </span>
                <input
                  className="input"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Full Stack Web Development"
                />
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
                  Level
                </span>
                <select
                  className="input"
                  value={form.level}
                  onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
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
                  placeholder="8 weeks"
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
                {form.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.thumbnail} alt="" className="mt-2 h-28 w-full rounded-xl object-cover ring-1 ring-slate-100" />
                ) : null}
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
                  {editingId ? "Update Course" : "Save Course"}
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
                <th className="px-4 py-3 font-semibold">Course</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Level</th>
                <th className="px-4 py-3 font-semibold">Duration</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-800">{c.title}</td>
                  <td className="px-4 py-3 text-slate-600">{labelOf(c.category, "General")}</td>
                  <td className="px-4 py-3 text-slate-600">{c.level || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{c.duration || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">₹{moneyOf(c.price, "0")}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        c.isPublished !== false
                          ? "rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"
                          : "rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700"
                      }
                    >
                      {c.isPublished !== false ? "Published" : "Draft"}
                    </span>
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
              <BookOpen size={32} />
              <p className="mt-2 text-sm">No courses match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

export default function AdminCoursesPage() {
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
      <AdminCoursesPageInner />
    </Suspense>
  );
}
