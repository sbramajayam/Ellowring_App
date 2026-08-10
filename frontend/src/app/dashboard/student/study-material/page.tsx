"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import {
  ModuleSearchInput,
  ModuleSelect,
  PrimaryButton,
  StatusPill,
  StudentDataTable,
  StudentModuleChrome,
} from "@/components/student-home/module-chrome";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type CourseOption = { id: string; title: string };
type Material = {
  id: string;
  title: string;
  fileUrl: string;
  fileSize?: number | null;
  createdAt?: string;
  courseId?: string;
  course?: { id?: string; title?: string } | null;
};

const emptyForm = { title: "", fileUrl: "", courseId: "", fileSize: "" };

function fileType(url: string) {
  const u = url.toLowerCase();
  if (u.endsWith(".pdf")) return "PDF";
  if (u.endsWith(".doc") || u.endsWith(".docx")) return "DOC";
  if (u.endsWith(".ppt") || u.endsWith(".pptx")) return "PPT";
  return "FILE";
}

export default function StudyMaterialPage() {
  const { token, user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "TRAINING";
  const [items, setItems] = useState<Material[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("all");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, courseList] = await Promise.all([
        api<Material[]>("/courses/materials", { token }),
        api<CourseOption[]>("/courses?all=1", { token }).catch(() => [] as CourseOption[]),
      ]);
      setItems(Array.isArray(list) ? list : []);
      setCourses(Array.isArray(courseList) ? courseList.map((c) => ({ id: c.id, title: c.title })) : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const courseOptions = useMemo(
    () => [{ value: "all", label: "All subjects" }, ...courses.map((c) => ({ value: c.id, label: c.title }))],
    [courses],
  );

  const filtered = items.filter((m) => {
    const hay = `${m.title} ${m.course?.title || ""}`.toLowerCase();
    if (q && !hay.includes(q.toLowerCase())) return false;
    if (subject !== "all" && (m.courseId || m.course?.id) !== subject) return false;
    return true;
  });

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!token) return setError("Sign in required.");
    if (!form.title.trim() || !form.fileUrl.trim()) return setError("Title and file URL required.");
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        fileUrl: form.fileUrl.trim(),
        courseId: form.courseId || undefined,
        fileSize: form.fileSize ? Number(form.fileSize) : null,
      };
      if (editingId) {
        await api(`/courses/materials/${editingId}`, { method: "PATCH", token, body: JSON.stringify(payload) });
        setMsg("Material updated.");
      } else {
        await api("/courses/materials", { method: "POST", token, body: JSON.stringify(payload) });
        setMsg("Material saved.");
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

  return (
    <StudentShell>
      <StudentModuleChrome
        title="Study Material"
        description={
          canManage
            ? "Notes, PDFs and downloads — table view with search, filters, and CRUD."
            : "Notes, PDFs and downloads — browse and view materials for your courses."
        }
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard/student" }, { label: "Academics" }]}
        actions={
          canManage ? (
            <PrimaryButton
              onClick={() => {
                setEditingId(null);
                setForm({ ...emptyForm, courseId: courses[0]?.id || "" });
                setFormOpen(true);
              }}
            >
              <Plus size={16} /> Add Material
            </PrimaryButton>
          ) : undefined
        }
        filters={
          <>
            <ModuleSearchInput value={q} onChange={setQ} placeholder="Search materials…" />
            <ModuleSelect value={subject} onChange={setSubject} options={courseOptions} label="Subject" />
          </>
        }
      >
        {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">{error}</p>}
        {msg && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">{msg}</p>}

        {canManage && formOpen ? (
          <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 lg:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">{editingId ? "Edit Material" : "New Material"}</h2>
              <button type="button" className="rounded-full p-2 text-slate-400 hover:bg-slate-50" onClick={() => setFormOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Title *</span>
                <input className="input" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">File URL *</span>
                <input className="input" required value={form.fileUrl} onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))} />
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Subject / Course</span>
                <select className="input" value={form.courseId} onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}>
                  <option value="">Auto</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">File size (bytes)</span>
                <input className="input" type="number" value={form.fileSize} onChange={(e) => setForm((f) => ({ ...f, fileSize: e.target.value }))} />
              </label>
              <div className="flex gap-2 sm:col-span-2">
                <PrimaryButton type="submit" disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save
                </PrimaryButton>
                <button type="button" onClick={() => setFormOpen(false)} className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold">
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {loading ? (
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Loading…
          </p>
        ) : (
          <StudentDataTable
            columns={["Title", "Subject", "Type", "Uploaded", "Actions"]}
            empty={
              filtered.length === 0 ? (
                <p className="p-8 text-center text-sm text-slate-500">No materials match your filters.</p>
              ) : null
            }
          >
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                      <FileText size={16} />
                    </span>
                    <span className="font-semibold text-slate-900">{m.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-600">{m.course?.title || "—"}</td>
                <td className="px-4 py-3.5">
                  <StatusPill tone="blue">{fileType(m.fileUrl)}</StatusPill>
                </td>
                <td className="px-4 py-3.5 text-slate-500">
                  {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-[#EFF6FF] px-2.5 py-1.5 text-xs font-bold text-[#0F3DDE]"
                    >
                      View <ExternalLink size={12} />
                    </a>
                    {canManage ? (
                      <>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-700"
                          onClick={() => {
                            setEditingId(m.id);
                            setForm({
                              title: m.title,
                              fileUrl: m.fileUrl,
                              courseId: m.courseId || m.course?.id || "",
                              fileSize: m.fileSize ? String(m.fileSize) : "",
                            });
                            setFormOpen(true);
                          }}
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          type="button"
                          disabled={!!busyId}
                          className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-600"
                          onClick={async () => {
                            if (!token || !window.confirm(`Delete “${m.title}”?`)) return;
                            setBusyId(m.id);
                            try {
                              await api(`/courses/materials/${m.id}`, { method: "DELETE", token });
                              setMsg("Deleted.");
                              await load();
                            } catch (err) {
                              setError(err instanceof Error ? err.message : "Delete failed");
                            } finally {
                              setBusyId(null);
                            }
                          }}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </StudentDataTable>
        )}
      </StudentModuleChrome>
    </StudentShell>
  );
}
