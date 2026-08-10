"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Info,
  Loader2,
  Plus,
  X,
  Save,
} from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import {
  ModuleSearchInput,
  ModuleSelect,
  PrimaryButton,
  StudentModuleChrome,
} from "@/components/student-home/module-chrome";
import { MarketplaceCard, trackCoverImage } from "@/components/ui/marketplace-card";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf, moneyOf } from "@/lib/labels";

type Category = { id: string; name: string; slug: string };

type Course = {
  id: string;
  title: string;
  slug?: string;
  categoryId?: string;
  category?: string | { id?: string; name?: string; slug?: string } | null;
  level?: string | null;
  duration?: string | null;
  price: number | string;
  currency?: string;
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
  currency: "INR",
  description: "",
  thumbnail: "",
  isPublished: true,
};

const LEVELS = ["Beginner", "Intermediate", "Advanced", "All levels"];

export default function StudentCoursesPage() {
  const { token, user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "TRAINING";
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
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

  const catOptions = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => set.add(labelOf(c.category, "General")));
    return [{ value: "all", label: "All categories" }, ...[...set].map((v) => ({ value: v, label: v }))];
  }, [courses]);

  const levelOptions = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.level) set.add(c.level);
    });
    return [{ value: "all", label: "All levels" }, ...[...set].map((v) => ({ value: v, label: v }))];
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const hay = `${c.title} ${c.description || ""} ${labelOf(c.category)} ${c.level || ""}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (catFilter !== "all" && labelOf(c.category, "General") !== catFilter) return false;
      if (levelFilter !== "all" && String(c.level || "") !== levelFilter) return false;
      return true;
    });
  }, [courses, q, catFilter, levelFilter]);

  function openCreate() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id || "",
    });
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  function openEdit(c: Course) {
    const catId =
      c.categoryId ||
      (typeof c.category === "object" && c.category?.id ? c.category.id : "") ||
      categories[0]?.id ||
      "";
    setEditingId(c.id);
    setForm({
      title: c.title || "",
      categoryId: catId,
      level: c.level || "Beginner",
      duration: c.duration || "",
      price: String(c.price ?? 0),
      currency: c.currency || "INR",
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
    if (!token) {
      setError("Sign in required to save courses.");
      return;
    }
    if (!form.title.trim()) {
      setError("Course title is required.");
      return;
    }
    setSaving(true);
    setError("");
    setMsg("");
    try {
      const payload = {
        title: form.title.trim(),
        categoryId: form.categoryId || undefined,
        level: form.level,
        duration: form.duration.trim() || null,
        price: Number(form.price) || 0,
        currency: form.currency || "INR",
        description: form.description.trim() || null,
        thumbnail: form.thumbnail.trim() || null,
        isPublished: form.isPublished,
      };
      if (editingId) {
        await api(`/courses/${editingId}`, { method: "PATCH", token, body: JSON.stringify(payload) });
        setMsg("Course updated successfully.");
      } else {
        await api("/courses", { method: "POST", token, body: JSON.stringify(payload) });
        setMsg("Course created successfully.");
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
    if (!token) {
      setError("Sign in required.");
      return;
    }
    if (!window.confirm(`Delete course “${c.title}”?`)) return;
    setBusyId(c.id);
    setError("");
    try {
      await api(`/courses/${c.id}`, { method: "DELETE", token });
      setMsg(`Deleted “${c.title}”.`);
      if (editingId === c.id) {
        setFormOpen(false);
        setEditingId(null);
      }
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
        title="Courses"
        description={
          canManage
            ? "Create, edit, and manage skill courses — full CRUD with save."
            : "Browse skill courses and enroll to start learning."
        }
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard/student" }, { label: "Academics" }]}
        actions={
          canManage ? (
            <PrimaryButton onClick={openCreate}>
              <Plus size={16} /> Add Course
            </PrimaryButton>
          ) : undefined
        }
        filters={
          <>
            <ModuleSearchInput value={q} onChange={setQ} placeholder="Search courses…" />
            <ModuleSelect value={catFilter} onChange={setCatFilter} options={catOptions} label="Category" />
            <ModuleSelect value={levelFilter} onChange={setLevelFilter} options={levelOptions} label="Level" />
          </>
        }
      >
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

        {!canManage && (
          <div className="flex items-start gap-3 rounded-xl bg-blue-50 px-4 py-3 ring-1 ring-blue-100">
            <Info size={18} className="mt-0.5 shrink-0 text-[#0F3DDE]" />
            <p className="text-sm text-slate-700">
              Students can enroll in courses. Only Admins can add or manage courses.{" "}
              <Link
                href="/dashboard/student/courses/access"
                className="font-semibold text-[#0F3DDE] underline decoration-[#0F3DDE]/30 underline-offset-2 hover:decoration-[#0F3DDE]"
              >
                Learn more
              </Link>
            </p>
          </div>
        )}

        {/* Create / Edit form */}
        {canManage && formOpen ? (
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 lg:p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold text-[#0B1F3A]">
                {editingId ? "Edit Course" : "New Course"}
              </h2>
              <button
                type="button"
                className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                onClick={() => setFormOpen(false)}
                aria-label="Close form"
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
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Full Stack Web Development"
                  required
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
                  <option value="">Auto (General)</option>
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
                  placeholder="e.g. 12 weeks"
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
                  step={1}
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Currency
                </span>
                <input
                  className="input"
                  value={form.currency}
                  onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
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
                  className="input min-h-[110px] resize-y"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="What students will learn…"
                />
              </label>

              <label className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-[#0F3DDE]"
                />
                <span className="text-sm font-semibold text-slate-700">Published (visible in catalogue)</span>
              </label>

              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? "Saving…" : editingId ? "Update Course" : "Save Course"}
                </button>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {/* Course cards — marketplace collage style */}
        {!loading && !error && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => (
              <MarketplaceCard
                key={c.id}
                title={c.title}
                eyebrow={`${labelOf(c.category, "Course")} • ${labelOf(c.level, "Skill")}`.toUpperCase()}
                imageUrl={c.thumbnail || trackCoverImage("course", c.id)}
                imageGradient="from-[#0F3DDE] via-[#2563EB] to-[#60A5FA]"
                rating="4.8"
                students="50+"
                duration={c.duration || "Self-paced"}
                price={Number(c.price) > 0 ? `₹${moneyOf(Number(c.price))}` : "Free"}
                cta={busyId === c.id ? "Working…" : "Enroll →"}
                onCtaClick={async () => {
                  if (!token) {
                    setError("Sign in required.");
                    return;
                  }
                  try {
                    setBusyId(c.id);
                    setError("");
                    await api(`/courses/${c.id}/enroll`, { method: "POST", token });
                    setMsg(`Enrolled in ${c.title}`);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Enroll failed");
                  } finally {
                    setBusyId(null);
                  }
                }}
                {...(canManage
                  ? {
                      onEdit: () => openEdit(c),
                      deleteBusy: busyId === c.id,
                      onDelete: () => void onDelete(c),
                    }
                  : {})}
              />
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-slate-100">
            <p className="text-sm text-slate-500">No courses match your filters.</p>
            {canManage ? (
              <PrimaryButton onClick={openCreate}>
                <Plus size={16} /> Add Course
              </PrimaryButton>
            ) : null}
          </div>
        )}
      </StudentModuleChrome>
    </StudentShell>
  );
}
