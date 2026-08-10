"use client";

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GraduationCap, Loader2, Plus, Save, X } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { MarketplaceCard, trackCoverImage } from "@/components/ui/marketplace-card";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf, moneyOf } from "@/lib/labels";
import clsx from "clsx";

type Category = { id: string; name: string; slug: string };

type Program = {
  id: string;
  title: string;
  examType?: string;
  categoryId?: string;
  category?: { id?: string; name?: string; slug?: string } | string | null;
  description?: string | null;
  price?: number | string;
  duration?: string | null;
  batchSize?: number | null;
  thumbnail?: string | null;
  isPublished?: boolean;
};

const TRACK_META: Record<
  string,
  { title: string; description: string; defaultExam: string; gradient: string; tag: string }
> = {
  neet: {
    title: "NEET Coaching",
    description: "Medical entrance programmes — Physics, Chemistry, Biology and full-length mocks.",
    defaultExam: "NEET",
    gradient: "from-[#059669] via-[#10B981] to-[#6EE7B7]",
    tag: "NEET • Entrance Exams",
  },
  jee: {
    title: "JEE Coaching",
    description: "JEE Main & Advanced programmes — concept mastery and timed practice.",
    defaultExam: "JEE",
    gradient: "from-[#0F3DDE] via-[#2563EB] to-[#60A5FA]",
    tag: "JEE • Entrance Exams",
  },
  competitive: {
    title: "Competitive Exams",
    description: "TNPSC, UPSC, SSC, Banking, Railway and other government exam coaching.",
    defaultExam: "TNPSC",
    gradient: "from-[#7C3AED] via-[#6366F1] to-[#A5B4FC]",
    tag: "Competitive • Govt Exams",
  },
};

const emptyForm = {
  title: "",
  categoryId: "",
  examType: "NEET",
  duration: "",
  price: "0",
  batchSize: "",
  thumbnail: "",
  description: "",
  isPublished: true,
};

function CoachingPageInner() {
  const { token, user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "TRAINING";
  const searchParams = useSearchParams();
  const track = (searchParams.get("track") || "neet").toLowerCase();
  const meta = TRACK_META[track] || TRACK_META.competitive;

  const [programs, setPrograms] = useState<Program[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const endpoint = useMemo(() => `/coaching?track=${encodeURIComponent(track)}&all=1`, [track]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, cats] = await Promise.all([
        api<Program[]>(endpoint, { token }),
        api<Category[]>("/coaching/meta/categories", { token }).catch(() => [] as Category[]),
      ]);
      setPrograms(Array.isArray(list) ? list : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load coaching programmes");
    } finally {
      setLoading(false);
    }
  }, [endpoint, token]);

  useEffect(() => {
    void load();
    setFormOpen(false);
    setEditingId(null);
  }, [load]);

  function openCreate() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      examType: meta.defaultExam,
      categoryId: categories[0]?.id || "",
      thumbnail: trackCoverImage(track),
    });
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  function openEdit(p: Program) {
    setEditingId(p.id);
    setForm({
      title: p.title || "",
      categoryId:
        p.categoryId ||
        (typeof p.category === "object" && p.category?.id ? p.category.id : "") ||
        categories[0]?.id ||
        "",
      examType: p.examType || meta.defaultExam,
      duration: p.duration || "",
      price: String(p.price ?? 0),
      batchSize: p.batchSize ? String(p.batchSize) : "",
      thumbnail: p.thumbnail || "",
      description: p.description || "",
      isPublished: p.isPublished !== false,
    });
    setFormOpen(true);
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!token) {
      setError("Sign in required.");
      return;
    }
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
        examType: form.examType,
        duration: form.duration.trim() || null,
        price: Number(form.price) || 0,
        batchSize: form.batchSize ? Number(form.batchSize) : null,
        thumbnail: form.thumbnail.trim() || null,
        description: form.description.trim() || null,
        isPublished: form.isPublished,
      };
      if (editingId) {
        await api(`/coaching/${editingId}`, { method: "PATCH", token, body: JSON.stringify(payload) });
        setMsg("Programme updated.");
      } else {
        await api("/coaching", { method: "POST", token, body: JSON.stringify(payload) });
        setMsg("Programme created.");
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <StudentShell>
      <div className="w-full space-y-5 p-4 lg:p-6 xl:px-10" style={{ maxWidth: "none" }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-[#0B1F3A] lg:text-[28px]">{meta.title}</h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-500">{meta.description}</p>
          </div>
          {canManage ? (
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(15,61,222,0.25)]"
            >
              <Plus size={16} /> Add Programme
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: "neet", label: "NEET", href: "/dashboard/student/coaching?track=neet" },
            { id: "jee", label: "JEE", href: "/dashboard/student/coaching?track=jee" },
            { id: "competitive", label: "Competitive", href: "/dashboard/student/coaching?track=competitive" },
          ].map((t) => (
            <a
              key={t.id}
              href={t.href}
              className={clsx(
                "rounded-full px-4 py-1.5 text-xs font-bold transition",
                track === t.id
                  ? "bg-[#0F3DDE] text-white shadow-sm shadow-blue-600/25"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
              )}
            >
              {t.label}
            </a>
          ))}
        </div>

        {loading && (
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Loading…
          </p>
        )}
        {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">{error}</p>}
        {msg && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">{msg}</p>}

        {canManage && formOpen ? (
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 lg:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0B1F3A]">
                {editingId ? "Edit Programme" : "New Programme"}
              </h2>
              <button type="button" className="rounded-full p-2 text-slate-400 hover:bg-slate-50" onClick={() => setFormOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">Title *</span>
                <input className="input" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. NEET UG Crash Batch" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">Exam type</span>
                <input className="input" value={form.examType} onChange={(e) => setForm((f) => ({ ...f, examType: e.target.value }))} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">Category</span>
                <select className="input" value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
                  <option value="">Auto</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">Duration</span>
                <input className="input" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="6 months" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">Price (₹)</span>
                <input className="input" type="number" min={0} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">Batch size</span>
                <input className="input" type="number" min={0} value={form.batchSize} onChange={(e) => setForm((f) => ({ ...f, batchSize: e.target.value }))} placeholder="50" />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">Cover image URL</span>
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
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">Description</span>
                <textarea className="input min-h-[100px]" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </label>
              <label className="flex items-center gap-2 sm:col-span-2">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} />
                <span className="text-sm font-semibold text-slate-700">Published</span>
              </label>
              <div className="flex gap-2 sm:col-span-2">
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingId ? "Update" : "Save Programme"}
                </button>
                <button type="button" onClick={() => setFormOpen(false)} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600">
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {!loading && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {programs.map((p) => {
              const exam = labelOf(p.examType, meta.defaultExam);
              const eyebrow = `${exam} • Entrance Exams`;
              return (
                <MarketplaceCard
                  key={p.id}
                  title={p.title}
                  eyebrow={eyebrow.toUpperCase()}
                  imageUrl={p.thumbnail || trackCoverImage(track, p.id)}
                  imageGradient={meta.gradient}
                  rating="4.8"
                  students={p.batchSize ? `${p.batchSize}+` : "40+"}
                  duration={p.duration || "12 months"}
                  price={Number(p.price) > 0 ? `₹${moneyOf(Number(p.price))}` : "Free"}
                  cta={busyId === p.id ? "Working…" : "Enroll →"}
                  onCtaClick={async () => {
                    if (!token) {
                      setError("Sign in required.");
                      return;
                    }
                    try {
                      setBusyId(p.id);
                      await api(`/coaching/${p.id}/enroll`, { method: "POST", token });
                      setMsg(`Enrolled in ${p.title}`);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Enroll failed");
                    } finally {
                      setBusyId(null);
                    }
                  }}
                  {...(canManage
                    ? {
                        onEdit: () => openEdit(p),
                        deleteBusy: busyId === p.id,
                        onDelete: async () => {
                          if (!token || !window.confirm(`Delete “${p.title}”?`)) return;
                          try {
                            setBusyId(p.id);
                            await api(`/coaching/${p.id}`, { method: "DELETE", token });
                            setMsg("Deleted.");
                            await load();
                          } catch (err) {
                            setError(err instanceof Error ? err.message : "Delete failed");
                          } finally {
                            setBusyId(null);
                          }
                        },
                      }
                    : {})}
                />
              );
            })}
          </div>
        )}

        {!loading && programs.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-slate-100">
            <GraduationCap className="mx-auto text-slate-300" size={32} />
            <p className="mt-3 text-sm text-slate-500">No programmes in this track yet.</p>
            {canManage ? (
              <button type="button" onClick={openCreate} className="mt-4 rounded-full bg-[#0F3DDE] px-4 py-2.5 text-sm font-bold text-white">
                Add Programme
              </button>
            ) : null}
          </div>
        )}
      </div>
    </StudentShell>
  );
}

export default function CoachingPage() {
  return (
    <Suspense
      fallback={
        <StudentShell>
          <p className="p-6 text-sm text-slate-500">Loading coaching…</p>
        </StudentShell>
      }
    >
      <CoachingPageInner />
    </Suspense>
  );
}
