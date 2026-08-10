"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  ClipboardCheck,
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

type Program = { id: string; title: string; examType?: string | null };
type MockTest = {
  id: string;
  title: string;
  durationMin: number;
  totalMarks: number;
  passingMarks?: number | null;
  isPublished?: boolean;
  programId?: string | null;
  program?: { title?: string; examType?: string | null } | null;
  _count?: { questions?: number };
};

const emptyForm = {
  title: "",
  programId: "",
  durationMin: "60",
  totalMarks: "100",
  passingMarks: "40",
  isPublished: true,
};

function difficultyOf(m: MockTest): { label: string; tone: "green" | "amber" | "red" } {
  const q = m._count?.questions ?? 0;
  const density = m.durationMin > 0 ? (m.totalMarks || 0) / m.durationMin : 1;
  if (q >= 80 || density >= 2.5) return { label: "Hard", tone: "red" };
  if (q >= 40 || density >= 1.5) return { label: "Medium", tone: "amber" };
  return { label: "Easy", tone: "green" };
}

export default function MockTestsPage() {
  const { token, user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "TRAINING";
  const [items, setItems] = useState<MockTest[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [exam, setExam] = useState("all");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, prog] = await Promise.all([
        api<MockTest[]>("/coaching/mock-tests?all=1", { token }),
        api<Program[]>("/coaching?all=1", { token }).catch(() => [] as Program[]),
      ]);
      setItems(Array.isArray(list) ? list : []);
      setPrograms(Array.isArray(prog) ? prog : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const examOptions = useMemo(() => {
    const set = new Set<string>();
    items.forEach((m) => {
      const t = m.program?.examType;
      if (t) set.add(String(t));
    });
    return [{ value: "all", label: "All exams" }, ...[...set].map((v) => ({ value: v, label: v }))];
  }, [items]);

  const filtered = items.filter((m) => {
    const hay = `${m.title} ${m.program?.title || ""} ${m.program?.examType || ""}`.toLowerCase();
    if (q && !hay.includes(q.toLowerCase())) return false;
    if (exam !== "all" && String(m.program?.examType || "") !== exam) return false;
    return true;
  });

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!token) return setError("Sign in required.");
    if (!form.title.trim()) return setError("Title is required.");
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        programId: form.programId || null,
        durationMin: Number(form.durationMin) || 60,
        totalMarks: Number(form.totalMarks) || 100,
        passingMarks: form.passingMarks !== "" ? Number(form.passingMarks) : null,
        isPublished: form.isPublished,
      };
      if (editingId) {
        await api(`/coaching/mock-tests/${editingId}`, {
          method: "PATCH",
          token,
          body: JSON.stringify(payload),
        });
        setMsg("Mock test updated.");
      } else {
        await api("/coaching/mock-tests", { method: "POST", token, body: JSON.stringify(payload) });
        setMsg("Mock test created.");
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
        title="Mock Tests"
        description={
          canManage
            ? "Timed practice tests — table view with difficulty, status, and CRUD."
            : "Timed practice tests — browse, filter, and start attempts."
        }
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard/student" }, { label: "Academics" }]}
        actions={
          canManage ? (
            <PrimaryButton
              onClick={() => {
                setEditingId(null);
                setForm({ ...emptyForm, programId: programs[0]?.id || "" });
                setFormOpen(true);
                setMsg("");
              }}
            >
              <Plus size={16} /> Add Mock Test
            </PrimaryButton>
          ) : undefined
        }
        filters={
          <>
            <ModuleSearchInput value={q} onChange={setQ} placeholder="Search tests…" />
            <ModuleSelect value={exam} onChange={setExam} options={examOptions} label="Exam" />
          </>
        }
      >
        {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">{error}</p>}
        {msg && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">{msg}</p>}

        {canManage && formOpen ? (
          <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 lg:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">{editingId ? "Edit Mock Test" : "New Mock Test"}</h2>
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
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Programme</span>
                <select className="input" value={form.programId} onChange={(e) => setForm((f) => ({ ...f, programId: e.target.value }))}>
                  <option value="">None</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                      {p.examType ? ` · ${p.examType}` : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Duration (min)</span>
                <input className="input" type="number" min={1} value={form.durationMin} onChange={(e) => setForm((f) => ({ ...f, durationMin: e.target.value }))} />
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Total marks</span>
                <input className="input" type="number" min={1} value={form.totalMarks} onChange={(e) => setForm((f) => ({ ...f, totalMarks: e.target.value }))} />
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Passing marks</span>
                <input className="input" type="number" value={form.passingMarks} onChange={(e) => setForm((f) => ({ ...f, passingMarks: e.target.value }))} />
              </label>
              <label className="flex items-end gap-2 pb-2">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-[#0F3DDE]"
                />
                <span className="text-sm font-semibold text-slate-700">Published</span>
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
            columns={["Test", "Exam", "Questions", "Duration", "Difficulty", "Status", "Actions"]}
            empty={
              filtered.length === 0 ? (
                <p className="p-8 text-center text-sm text-slate-500">No mock tests match your filters.</p>
              ) : null
            }
          >
            {filtered.map((m) => {
              const diff = difficultyOf(m);
              const questions = m._count?.questions ?? 0;
              return (
                <tr key={m.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                        <ClipboardCheck size={16} />
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">{m.title}</p>
                        <p className="text-xs text-slate-400">{m.totalMarks} marks</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{m.program?.examType || m.program?.title || "—"}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">{questions || "—"}</td>
                  <td className="px-4 py-3.5 text-slate-600">{m.durationMin} min</td>
                  <td className="px-4 py-3.5">
                    <StatusPill tone={diff.tone}>{diff.label}</StatusPill>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusPill tone={m.isPublished !== false ? "green" : "slate"}>
                      {m.isPublished !== false ? "Ready" : "Draft"}
                    </StatusPill>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-lg bg-[#0F3DDE] px-2.5 py-1.5 text-xs font-bold text-white"
                        onClick={() => setMsg(questions ? `Starting “${m.title}”…` : `Open “${m.title}” — add questions to start full attempt.`)}
                      >
                        {questions ? "Start Test" : "View Result"}
                      </button>
                      {canManage ? (
                        <>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-700"
                            onClick={() => {
                              setEditingId(m.id);
                              setForm({
                                title: m.title,
                                programId: m.programId || "",
                                durationMin: String(m.durationMin ?? 60),
                                totalMarks: String(m.totalMarks ?? 100),
                                passingMarks: m.passingMarks != null ? String(m.passingMarks) : "",
                                isPublished: m.isPublished !== false,
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
                                await api(`/coaching/mock-tests/${m.id}`, { method: "DELETE", token });
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
              );
            })}
          </StudentDataTable>
        )}
      </StudentModuleChrome>
    </StudentShell>
  );
}
