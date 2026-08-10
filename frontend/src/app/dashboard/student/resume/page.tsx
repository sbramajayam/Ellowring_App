"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  Award,
  Briefcase,
  Download,
  FileText,
  FolderKanban,
  GraduationCap,
  Link2,
  Loader2,
  Save,
  Send,
  Share2,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import clsx from "clsx";
import { StudentShell } from "@/components/student-shell";
import {
  AiAssistantChip,
  BlueHero,
  CollagePage,
  CollageTitle,
  PillButton,
  ProgressBar,
  SoftIcon,
  WhiteCard,
} from "@/components/student-home/collage-ui";
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
  projects: string;
  certifications: string;
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
  projects: "",
  certifications: "",
};

type EditSection =
  | "personal"
  | "education"
  | "skills"
  | "projects"
  | "internship"
  | "certifications"
  | null;

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

function newId() {
  return `resume-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const SUGGESTIONS = [
  {
    title: "Quantify internship impact",
    body: "Add metrics (e.g. reduced load time by 30%) under your latest internship.",
  },
  {
    title: "Rewrite summary for ATS",
    body: "Lead with role + years + 2–3 keywords recruiters scan for.",
  },
  {
    title: "Promote React & TypeScript",
    body: "Move front-end stack into the first line of Skills for stronger keyword match.",
  },
];

const SKILL_GAPS = [
  { label: "System Design", value: 45, color: "bg-amber-400" },
  { label: "DSA / Problem Solving", value: 62, color: "bg-[#0F3DDE]" },
  { label: "Cloud (AWS/GCP)", value: 38, color: "bg-rose-400" },
  { label: "Communication", value: 78, color: "bg-emerald-500" },
];

const TEMPLATES = [
  { id: "modern", name: "Modern Professional", desc: "Clean two-column layout", tone: "from-[#0F3DDE] to-[#3B82F6]" },
  { id: "ats", name: "ATS Friendly", desc: "Single column, keyword-rich", tone: "from-[#0B1F3A] to-[#1E40AF]" },
  { id: "startup", name: "Startup Creative", desc: "Bold headers, project-first", tone: "from-[#0369A1] to-[#22C55E]" },
];

const QUICK_EDITS: { id: NonNullable<EditSection>; label: string; icon: typeof UserRound; hint: string }[] = [
  { id: "personal", label: "Personal Info", icon: UserRound, hint: "Name, email, phone" },
  { id: "education", label: "Education", icon: GraduationCap, hint: "Degrees & college" },
  { id: "skills", label: "Skills", icon: Sparkles, hint: "Tech & soft skills" },
  { id: "projects", label: "Projects", icon: FolderKanban, hint: "Portfolio highlights" },
  { id: "internship", label: "Internship", icon: Briefcase, hint: "Work experience" },
  { id: "certifications", label: "Certifications", icon: Award, hint: "Credentials" },
];

export default function ResumePage() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [editSection, setEditSection] = useState<EditSection>(null);
  const [template, setTemplate] = useState("modern");
  const [appliedFixes, setAppliedFixes] = useState<string[]>([]);

  useEffect(() => {
    const list = loadResumes();
    setResumes(list);
    if (list.length > 0) {
      setActiveId(list[0].id);
      const r = list[0];
      setForm({
        title: r.title,
        fullName: r.fullName,
        email: r.email,
        phone: r.phone,
        summary: r.summary,
        skills: r.skills,
        experience: r.experience,
        education: r.education,
        projects: r.projects || "",
        certifications: r.certifications || "",
      });
    } else {
      setForm({
        ...emptyForm,
        fullName: user?.name || "Alex Kumar",
        email: user?.email || "alex@ellowring.com",
        phone: "+91 98765 43210",
        summary:
          "Computer Science undergraduate seeking software internships. Strong in React, TypeScript, and collaborative product delivery.",
        skills: "React, TypeScript, Node.js, SQL, Git",
        education: "B.Tech CSE · Sri Venkateswara College · 2022–2026 · CGPA 8.4",
        experience: "Frontend Intern · Zoho · Jun–Aug 2025\n• Built dashboard widgets used by 2k users",
        projects: "Campus Connect — MERN job board for colleges",
        certifications: "AWS Cloud Practitioner",
      });
    }
    setHydrated(true);
  }, [user?.name, user?.email]);

  const skillTags = form.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const persistForm = useCallback(() => {
    const now = new Date().toISOString();
    let list: Resume[];
    if (activeId) {
      list = resumes.map((r) => (r.id === activeId ? { ...r, ...form, updatedAt: now } : r));
    } else {
      const created: Resume = { id: newId(), ...form, updatedAt: now };
      list = [created, ...resumes];
      setActiveId(created.id);
    }
    setResumes(list);
    saveResumes(list);
    setMsg("Resume saved on this device.");
  }, [activeId, form, resumes]);

  function onSave(e: FormEvent) {
    e.preventDefault();
    persistForm();
    setEditSection(null);
  }

  function applyAiFix(title: string) {
    setAppliedFixes((prev) => (prev.includes(title) ? prev : [...prev, title]));
    if (title.includes("summary")) {
      setForm((f) => ({
        ...f,
        summary:
          "Software engineering student (React/TypeScript) with internship experience shipping UI used by 2k+ users. Seeking roles in product engineering.",
      }));
    } else if (title.includes("React")) {
      setForm((f) => ({
        ...f,
        skills: "React, TypeScript, " + f.skills.replace(/React,?\s*|TypeScript,?\s*/gi, ""),
      }));
    } else {
      setForm((f) => ({
        ...f,
        experience: f.experience.includes("30%")
          ? f.experience
          : f.experience + "\n• Reduced page load time by 30% via code-splitting",
      }));
    }
    setMsg(`Applied AI fix: ${title}`);
  }

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
      <CollagePage>
        <CollageTitle
          title="AI Resume Builder"
          subtitle="ATS-ready resume with AI score, skill gaps, and quick edits."
          icon={FileText}
          action={<AiAssistantChip />}
        />

        {msg ? (
          <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-[13px] font-medium text-emerald-700 ring-1 ring-emerald-100">
            {msg}
          </p>
        ) : null}

        <BlueHero>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[12px] font-semibold text-blue-100">Resume Score</p>
              <p className="mt-1 font-display text-4xl font-extrabold tracking-tight">
                82<span className="text-xl font-bold text-blue-100">/100</span>
              </p>
              <p className="mt-1 text-[14px] font-bold text-emerald-300">Great Job!</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: "ATS", value: "91%" },
                { label: "Profile", value: "88%" },
                { label: "Recruiter", value: "Strong" },
                { label: "AI", value: "Optimized" },
              ].map((s) => (
                <div key={s.label} className="min-w-[88px] rounded-2xl bg-white/10 px-3 py-2.5 text-center ring-1 ring-white/15">
                  <p className="text-[10px] font-semibold text-blue-100">{s.label}</p>
                  <p className="mt-0.5 text-[15px] font-extrabold">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </BlueHero>

        <div className="grid gap-4 lg:grid-cols-2">
          <WhiteCard title="Resume Preview" action={<span className="text-[11px] font-bold text-[#0F3DDE]">{TEMPLATES.find((t) => t.id === template)?.name}</span>}>
            <div className="min-h-[280px] rounded-xl border border-slate-100 bg-[#FAFBFC] p-5">
              <h3 className="font-display text-xl font-extrabold text-[#0B1F3A]">{form.fullName || "Your Name"}</h3>
              <p className="mt-1 text-[12px] text-[#0F3DDE]">
                {[form.email, form.phone].filter(Boolean).join(" · ") || "email@example.com"}
              </p>
              {form.summary ? <p className="mt-3 text-[13px] leading-relaxed text-slate-600">{form.summary}</p> : null}
              {skillTags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {skillTags.map((s) => (
                    <span key={s} className="rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#0F3DDE]">
                      {s}
                    </span>
                  ))}
                </div>
              ) : null}
              {form.experience ? (
                <div className="mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Experience</p>
                  <pre className="mt-1 whitespace-pre-wrap font-sans text-[12px] leading-relaxed text-slate-600">{form.experience}</pre>
                </div>
              ) : null}
              {form.education ? (
                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Education</p>
                  <pre className="mt-1 whitespace-pre-wrap font-sans text-[12px] text-slate-600">{form.education}</pre>
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setEditSection("personal")}
              className="mt-3 w-full rounded-full bg-slate-50 py-2.5 text-[12px] font-bold text-[#0F3DDE] ring-1 ring-slate-200"
            >
              Open Quick Edit
            </button>
          </WhiteCard>

          <WhiteCard title="AI Improvement Suggestions">
            <ul className="space-y-3">
              {SUGGESTIONS.map((s) => (
                <li key={s.title} className="rounded-2xl bg-[#F8FAFC] p-3.5 ring-1 ring-slate-100">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[13px] font-extrabold text-[#0B1F3A]">{s.title}</p>
                      <p className="mt-1 text-[12px] leading-relaxed text-slate-500">{s.body}</p>
                    </div>
                    <SoftIcon icon={Sparkles} className="bg-[#EFF6FF] text-[#0F3DDE]" />
                  </div>
                  <PillButton
                    className="mt-3 w-full sm:w-auto"
                    onClick={() => applyAiFix(s.title)}
                  >
                    {appliedFixes.includes(s.title) ? "Applied" : "Apply AI Fix"}
                  </PillButton>
                </li>
              ))}
            </ul>
          </WhiteCard>
        </div>

        <WhiteCard title="Quick Edit">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {QUICK_EDITS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setEditSection(item.id)}
                  className="rounded-[16px] bg-[#F8FAFC] p-3 text-left ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:ring-[#BFDBFE]"
                >
                  <SoftIcon icon={Icon} />
                  <p className="mt-2 text-[12px] font-extrabold text-[#0B1F3A]">{item.label}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">{item.hint}</p>
                </button>
              );
            })}
          </div>
        </WhiteCard>

        <WhiteCard title="Templates">
          <div className="grid gap-3 sm:grid-cols-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplate(t.id)}
                className={clsx(
                  "overflow-hidden rounded-[18px] text-left ring-2 transition",
                  template === t.id ? "ring-[#0F3DDE]" : "ring-transparent",
                )}
              >
                <div className={clsx("h-16 bg-gradient-to-br", t.tone)} />
                <div className="bg-white p-3">
                  <p className="text-[13px] font-extrabold text-[#0B1F3A]">{t.name}</p>
                  <p className="text-[11px] text-slate-500">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </WhiteCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <WhiteCard title="Skill Gap Analysis">
            <ul className="space-y-3">
              {SKILL_GAPS.map((g) => (
                <li key={g.label}>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="font-bold text-slate-700">{g.label}</span>
                    <span className="font-extrabold text-[#0B1F3A]">{g.value}%</span>
                  </div>
                  <ProgressBar value={g.value} color={g.color} />
                </li>
              ))}
            </ul>
          </WhiteCard>
          <WhiteCard title="AI Recommendation">
            <div className="rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-white p-4 ring-1 ring-[#BFDBFE]">
              <p className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#0F3DDE]">
                <Sparkles size={14} /> Personalized plan
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                Strengthen System Design and Cloud basics next. Pair practice with AI Interview Coach, then apply to 3 SDE internships matched to your resume keywords.
              </p>
              <PillButton href="/dashboard/student/ai-assistant" className="mt-4">
                Improve with AI
              </PillButton>
            </div>
          </WhiteCard>
        </div>

        <div className="flex flex-wrap gap-2">
          <PillButton onClick={() => window.alert("PDF export will download shortly (demo).")}>
            <Download size={14} /> Download PDF
          </PillButton>
          <PillButton tone="outline" onClick={() => window.alert("Share sheet opened (demo).")}>
            <Share2 size={14} /> Share
          </PillButton>
          <PillButton tone="outline" onClick={() => window.alert("Public resume link copied (demo).")}>
            <Link2 size={14} /> Create Link
          </PillButton>
          <PillButton tone="dark" href="/dashboard/student/jobs">
            <Send size={14} /> Send to Ellowring Jobs
          </PillButton>
        </div>

        {resumes.length > 0 ? (
          <WhiteCard title="Saved locally">
            <div className="flex flex-wrap gap-2">
              {resumes.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
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
                      projects: r.projects || "",
                      certifications: r.certifications || "",
                    });
                  }}
                  className={clsx(
                    "rounded-full px-3 py-1.5 text-[12px] font-bold",
                    activeId === r.id ? "bg-[#0F3DDE] text-white" : "bg-slate-100 text-slate-600",
                  )}
                >
                  {r.title}
                </button>
              ))}
            </div>
          </WhiteCard>
        ) : null}
      </CollagePage>

      {editSection ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[22px] bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-[#0B1F3A]">
                Edit {QUICK_EDITS.find((q) => q.id === editSection)?.label || "Resume"}
              </h2>
              <button type="button" onClick={() => setEditSection(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-50">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={onSave} className="space-y-3">
              {(editSection === "personal" || editSection === null) && (
                <>
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
                </>
              )}
              {editSection === "education" ? (
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Education</span>
                  <textarea className="input min-h-[100px] resize-y" value={form.education} onChange={(e) => setForm((f) => ({ ...f, education: e.target.value }))} />
                </label>
              ) : null}
              {editSection === "skills" ? (
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Skills (comma-separated)</span>
                  <input className="input" value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} />
                </label>
              ) : null}
              {editSection === "projects" ? (
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Projects</span>
                  <textarea className="input min-h-[100px] resize-y" value={form.projects} onChange={(e) => setForm((f) => ({ ...f, projects: e.target.value }))} />
                </label>
              ) : null}
              {editSection === "internship" ? (
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Internship / Experience</span>
                  <textarea className="input min-h-[120px] resize-y" value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} />
                </label>
              ) : null}
              {editSection === "certifications" ? (
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Certifications</span>
                  <textarea className="input min-h-[80px] resize-y" value={form.certifications} onChange={(e) => setForm((f) => ({ ...f, certifications: e.target.value }))} />
                </label>
              ) : null}
              <PillButton type="submit" className="w-full">
                <Save size={14} /> Save to localStorage
              </PillButton>
            </form>
          </div>
        </div>
      ) : null}
    </StudentShell>
  );
}
