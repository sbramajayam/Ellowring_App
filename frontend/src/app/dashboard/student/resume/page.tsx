"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { FileText, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import {
  PrimaryButton,
  StudentModuleChrome,
} from "@/components/student-home/module-chrome";
import { useAuth } from "@/lib/auth-context";

const STORAGE_KEY = "ellowring_resumes";

type Resume = {
  id: string;
  title: string;
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  skills: string;
  experience: string;
  education: string;
  updatedAt: string;
};

const emptyForm: Omit<Resume, "id" | "updatedAt"> = {
  title: "My Resume",
  fullName: "",
  email: "",
  phone: "",
  summary: "",
  skills: "",
  experience: "",
  education: "",
};

function loadResumes(): Resume[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveResumes(list: Resume[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function newId(): string {
  return `resume-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ResumePage() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const list = loadResumes();
    setResumes(list);
    if (list.length > 0) {
      setActiveId(list[0].id);
      setForm({
        title: list[0].title,
        fullName: list[0].fullName,
        email: list[0].email,
        phone: list[0].phone,
        summary: list[0].summary,
        skills: list[0].skills,
        experience: list[0].experience,
        education: list[0].education,
      });
    } else {
      setForm({
        ...emptyForm,
        fullName: user?.name || "",
        email: user?.email || "",
      });
    }
    setHydrated(true);
  }, [user?.name, user?.email]);

  const selectResume = useCallback((r: Resume) => {
    setActiveId(r.id);
    setForm({
      title: r.title,
      fullName: r.fullName,
      email: r.email,
      phone: r.phone,
      summary: r.summary,
      skills: r.skills,
      experience: r.experience,
      education: r.education,
    });
    setMsg("");
  }, []);

  function onNew() {
    setActiveId(null);
    setForm({
      ...emptyForm,
      title: `Resume ${resumes.length + 1}`,
      fullName: user?.name || "",
      email: user?.email || "",
    });
    setMsg("");
  }

  function onSave(e: FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString();
    let list: Resume[];
    if (activeId) {
      list = resumes.map((r) =>
        r.id === activeId ? { ...r, ...form, updatedAt: now } : r,
      );
    } else {
      const created: Resume = { id: newId(), ...form, updatedAt: now };
      list = [created, ...resumes];
      setActiveId(created.id);
    }
    setResumes(list);
    saveResumes(list);
    setMsg("Resume saved locally.");
  }

  function onDelete() {
    if (!activeId) return;
    if (!window.confirm("Delete this resume?")) return;
    const list = resumes.filter((r) => r.id !== activeId);
    setResumes(list);
    saveResumes(list);
    if (list.length > 0) {
      selectResume(list[0]);
    } else {
      setActiveId(null);
      setForm({ ...emptyForm, fullName: user?.name || "", email: user?.email || "" });
    }
    setMsg("Resume deleted.");
  }

  const skillTags = form.skills.split(",").map((s) => s.trim()).filter(Boolean);

  if (!hydrated) {
    return (
      <StudentShell>
        <p className="p-6 text-sm text-slate-500">
          <Loader2 className="mr-2 inline animate-spin" size={16} /> Loading…
        </p>
      </StudentShell>
    );
  }

  return (
    <StudentShell>
      <StudentModuleChrome
        title="Resume Builder"
        description="Create and preview ATS-ready resumes. Saved locally on this device."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard/student" }, { label: "Career" }]}
        actions={
          <PrimaryButton onClick={onNew}>
            <Plus size={16} /> New Resume
          </PrimaryButton>
        }
      >
        {msg && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">{msg}</p>}

        <p className="rounded-xl bg-blue-50 px-4 py-3 text-xs text-blue-700 ring-1 ring-blue-100">
          Resumes are stored in localStorage ({STORAGE_KEY}). You can optionally set a profile resume URL in your profile settings for sync.
        </p>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          {/* Left: My Resumes list */}
          <aside className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
            <h2 className="mb-3 text-sm font-bold text-slate-700">My Resumes</h2>
            {resumes.length === 0 ? (
              <p className="text-xs text-slate-400">No resumes yet. Create one to get started.</p>
            ) : (
              <ul className="space-y-1">
                {resumes.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => selectResume(r)}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        activeId === r.id
                          ? "bg-[#0F3DDE] font-bold text-white"
                          : "font-medium text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <FileText size={15} />
                      <span className="truncate">{r.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* Right: Editor + Preview */}
          <div className="grid gap-5 xl:grid-cols-2">
            <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-100">
              <h2 className="mb-4 font-display text-lg font-bold text-[#0B1F3A]">
                {activeId ? "Edit Resume" : "New Resume"}
              </h2>
              <form onSubmit={onSave} className="space-y-3">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Title</span>
                  <input className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Full Name</span>
                  <input className="input" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Email</span>
                    <input className="input" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Phone</span>
                    <input className="input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Summary</span>
                  <textarea className="input min-h-[70px] resize-y" value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Skills (comma-separated)</span>
                  <input className="input" value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Experience</span>
                  <textarea className="input min-h-[80px] resize-y font-mono text-xs" value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} placeholder="Role · Company · Dates&#10;Achievements…" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Education</span>
                  <textarea className="input min-h-[60px] resize-y font-mono text-xs" value={form.education} onChange={(e) => setForm((f) => ({ ...f, education: e.target.value }))} />
                </label>
                <div className="flex flex-wrap gap-2 pt-2">
                  <PrimaryButton type="submit">
                    <Save size={16} /> Save
                  </PrimaryButton>
                  {activeId ? (
                    <button type="button" onClick={onDelete} className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-100">
                      <Trash2 size={16} /> Delete
                    </button>
                  ) : null}
                </div>
              </form>
            </section>

            {/* Preview pane */}
            <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-100">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">Resume Preview</p>
              <div className="min-h-[480px] rounded-xl border border-slate-100 bg-[#FAFBFC] p-6 shadow-inner">
                <h1 className="font-display text-2xl font-extrabold text-[#0B1F3A]">
                  {form.fullName || "Your Name"}
                </h1>
                <p className="mt-1 text-sm text-[#0F3DDE]">
                  {[form.email, form.phone].filter(Boolean).join(" · ") || "email@example.com"}
                </p>
                {form.summary ? (
                  <div className="mt-5">
                    <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Summary</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{form.summary}</p>
                  </div>
                ) : null}
                {skillTags.length > 0 ? (
                  <div className="mt-5">
                    <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Skills</h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {skillTags.map((s) => (
                        <span key={s} className="rounded-lg bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#0F3DDE]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {form.experience ? (
                  <div className="mt-5">
                    <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Experience</h3>
                    <pre className="mt-1 whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-600">{form.experience}</pre>
                  </div>
                ) : null}
                {form.education ? (
                  <div className="mt-5">
                    <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Education</h3>
                    <pre className="mt-1 whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-600">{form.education}</pre>
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </StudentModuleChrome>
    </StudentShell>
  );
}
