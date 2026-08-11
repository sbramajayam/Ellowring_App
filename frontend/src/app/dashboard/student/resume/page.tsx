"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  Award,
  Briefcase,
  Download,
  Eye,
  FileText,
  FolderKanban,
  GraduationCap,
  Link2,
  Loader2,
  MapPin,
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
  ScoreRing,
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
    title: "Add measurable project outcomes",
    body: "Quantify impact (users served, latency cut, conversion lift) on your top 2 projects.",
  },
  {
    title: "Improve technical keywords",
    body: "Surface React, TypeScript, Node.js, and REST APIs in the first skills line for ATS.",
  },
  {
    title: "Rewrite summary for ATS",
    body: "Lead with role + stack + internship proof in one crisp sentence recruiters scan.",
  },
  {
    title: "Quantify internship impact",
    body: "Add metrics (e.g. reduced load time by 30%) under your latest internship.",
  },
  {
    title: "Tighten project descriptions",
    body: "Keep each bullet under 18 words and start with a strong action verb.",
  },
];

const SKILL_GAPS = [
  { label: "JavaScript", value: 88, level: "Advanced", color: "bg-emerald-500" },
  { label: "React", value: 84, level: "Advanced", color: "bg-emerald-500" },
  { label: "Node.js", value: 62, level: "Intermediate", color: "bg-[#0F3DDE]" },
  { label: "SQL", value: 48, level: "Beginner", color: "bg-amber-400" },
  { label: "System Design", value: 35, level: "Beginner", color: "bg-rose-400" },
];

const TEMPLATES = [
  { id: "modern", name: "Modern Professional", desc: "Clean two-column layout", tone: "from-[#0F3DDE] to-[#3B82F6]" },
  { id: "ats", name: "ATS Friendly", desc: "Single column, keyword-rich", tone: "from-[#0B1F3A] to-[#1E40AF]" },
  { id: "startup", name: "Startup Creative", desc: "Bold headers, project-first", tone: "from-[#0369A1] to-[#22C55E]" },
];

const QUICK_EDITS: { id: NonNullable<EditSection>; label: string; icon: typeof UserRound; hint: string; tone: string }[] = [
  { id: "personal", label: "Personal Info", icon: UserRound, hint: "Name, email, phone", tone: "bg-blue-50 text-[#0F3DDE]" },
  { id: "education", label: "Education", icon: GraduationCap, hint: "Degrees & college", tone: "bg-emerald-50 text-emerald-600" },
  { id: "skills", label: "Skills", icon: Sparkles, hint: "Tech & soft skills", tone: "bg-violet-50 text-violet-600" },
  { id: "projects", label: "Projects", icon: FolderKanban, hint: "Portfolio highlights", tone: "bg-amber-50 text-amber-600" },
  { id: "internship", label: "Ellowring Internship", icon: Briefcase, hint: "Work experience", tone: "bg-sky-50 text-sky-600" },
  { id: "certifications", label: "Certifications", icon: Award, hint: "Credentials", tone: "bg-rose-50 text-rose-600" },
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
        fullName: user?.name || "Vignesh",
        email: user?.email || "vignesh@ellowring.com",
        phone: "+91 98765 43210",
        summary:
          "Full Stack Developer undergraduate seeking software internships. Strong in React, TypeScript, and collaborative product delivery.",
        skills: "React, TypeScript, Node.js, SQL, Git",
        education: "B.Tech CSE · Sri Venkateswara College · 2022–2026 · CGPA 8.4",
        experience: "Frontend Intern · Zoho · Jun–Aug 2025\n• Built dashboard widgets used by 2k users",
        projects: "Campus Connect — MERN job board for colleges\nEllowring Tracker — attendance + analytics PWA",
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
    if (title.toLowerCase().includes("summary") || title.toLowerCase().includes("ats")) {
      setForm((f) => ({
        ...f,
        summary:
          "Software engineering student (React/TypeScript) with internship experience shipping UI used by 2k+ users. Seeking roles in product engineering.",
      }));
    } else if (title.toLowerCase().includes("keyword") || title.toLowerCase().includes("technical")) {
      setForm((f) => ({
        ...f,
        skills: "React, TypeScript, Node.js, REST APIs, " + f.skills.replace(/React,?\s*|TypeScript,?\s*|Node\.js,?\s*/gi, ""),
      }));
    } else if (title.toLowerCase().includes("project")) {
      setForm((f) => ({
        ...f,
        projects: f.projects.includes("2k+")
          ? f.projects
          : f.projects + "\n• Served 2k+ campus users; cut query latency 35%",
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
          subtitle="Create a recruiter-ready resume in minutes."
          icon={FileText}
          action={<AiAssistantChip />}
        />

        {msg ? (
          <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-[13px] font-medium text-emerald-700 ring-1 ring-emerald-100">
            {msg}
          </p>
        ) : null}

        <BlueHero>
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <ScoreRing value={82} size={108} tone="mixed" onDark label="Score" />
              <div>
                <p className="text-[12px] font-semibold text-blue-100">Resume Score</p>
                <p className="mt-0.5 font-display text-3xl font-extrabold tracking-tight">82/100</p>
                <p className="mt-1 text-[14px] font-bold text-emerald-300">Great Job!</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <div className="flex flex-col items-center text-center">
                <ScoreRing value={91} size={72} tone="green" onDark percent label="ATS" />
                <p className="mt-1 text-[10px] font-semibold text-blue-100">Compatibility</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <ScoreRing value={88} size={72} tone="blue" onDark percent label="Profile" />
                <p className="mt-1 text-[10px] font-semibold text-blue-100">Completion</p>
              </div>
              <div className="flex min-w-[96px] flex-col items-center rounded-2xl bg-white/10 px-3 py-3 text-center ring-1 ring-white/15">
                <SoftIcon icon={Award} className="bg-white/15 text-white" />
                <p className="mt-2 text-[12px] font-extrabold">Strong</p>
                <p className="text-[10px] font-semibold text-blue-100">Recruiter Readiness</p>
              </div>
              <div className="flex min-w-[96px] flex-col items-center rounded-2xl bg-white/10 px-3 py-3 text-center ring-1 ring-white/15">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#0F3DDE] text-[11px] font-extrabold">
                  AI
                </span>
                <p className="mt-2 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-200 ring-1 ring-emerald-300/30">
                  AI Optimized
                </p>
              </div>
            </div>
          </div>
        </BlueHero>

        <div className="grid gap-4 lg:grid-cols-2">
          <WhiteCard
            title="Resume Preview"
            action={
              <PillButton tone="outline" className="!py-1.5 !text-[11px]" onClick={() => window.alert("Opening PDF preview…")}>
                <Eye size={13} /> Preview PDF
              </PillButton>
            }
          >
            <div className="min-h-[300px] rounded-xl border border-slate-100 bg-[#FAFBFC] p-5">
              <div className="flex gap-3">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0F3DDE] font-display text-lg font-extrabold text-white">
                  {(form.fullName || "V").charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-[#0B1F3A]">
                    {form.fullName || "Your Name"}
                  </h3>
                  <p className="text-[12px] font-bold text-[#0F3DDE]">Full Stack Developer</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
                    <span>{form.email || "email@example.com"}</span>
                    <span>·</span>
                    <span>{form.phone || "+91 …"}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-0.5">
                      <MapPin size={10} /> Chennai
                    </span>
                  </p>
                </div>
              </div>
              {form.summary ? <p className="mt-4 text-[13px] leading-relaxed text-slate-600">{form.summary}</p> : null}
              {skillTags.length > 0 ? (
                <div className="mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Skills</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {skillTags.map((s) => (
                      <span key={s} className="rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#0F3DDE]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {form.education ? (
                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Education</p>
                  <pre className="mt-1 whitespace-pre-wrap font-sans text-[12px] text-slate-600">{form.education}</pre>
                </div>
              ) : null}
              {form.projects ? (
                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Projects</p>
                  <pre className="mt-1 whitespace-pre-wrap font-sans text-[12px] leading-relaxed text-slate-600">{form.projects}</pre>
                </div>
              ) : null}
              {form.experience ? (
                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Internship</p>
                  <pre className="mt-1 whitespace-pre-wrap font-sans text-[12px] leading-relaxed text-slate-600">{form.experience}</pre>
                </div>
              ) : null}
            </div>
          </WhiteCard>

          <WhiteCard
            title="AI Improvement Suggestions"
            action={<Sparkles size={15} className="text-[#0F3DDE]" />}
          >
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
                  <PillButton className="mt-3 w-full sm:w-auto" onClick={() => applyAiFix(s.title)}>
                    {appliedFixes.includes(s.title) ? "Applied" : "Apply AI Fix"}
                  </PillButton>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-3 w-full text-center text-[12px] font-bold text-[#0F3DDE]"
              onClick={() => window.alert("More suggestions unlocked (demo).")}
            >
              View All Suggestions
            </button>
          </WhiteCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <WhiteCard title="Quick Edit">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {QUICK_EDITS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEditSection(item.id)}
                    className="rounded-[16px] bg-[#F8FAFC] p-3 text-left ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:ring-[#BFDBFE]"
                  >
                    <SoftIcon icon={Icon} className={item.tone} />
                    <p className="mt-2 text-[12px] font-extrabold text-[#0B1F3A]">{item.label}</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">{item.hint}</p>
                  </button>
                );
              })}
            </div>
          </WhiteCard>

          <WhiteCard
            title="AI Resume Templates"
            action={
              <button type="button" className="text-[12px] font-bold text-[#0F3DDE]" onClick={() => window.alert("Template gallery…")}>
                View All
              </button>
            }
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {TEMPLATES.map((t) => (
                <div
                  key={t.id}
                  className={clsx(
                    "overflow-hidden rounded-[18px] text-left ring-2 transition",
                    template === t.id ? "ring-[#0F3DDE]" : "ring-transparent",
                  )}
                >
                  <button type="button" onClick={() => setTemplate(t.id)} className="block w-full text-left">
                    <div className={clsx("h-16 bg-gradient-to-br", t.tone)} />
                    <div className="bg-white p-3">
                      <p className="text-[13px] font-extrabold text-[#0B1F3A]">{t.name}</p>
                      <p className="text-[11px] text-slate-500">{t.desc}</p>
                    </div>
                  </button>
                  <div className="bg-white px-3 pb-3">
                    <PillButton
                      tone={template === t.id ? "primary" : "outline"}
                      className="w-full !py-1.5 !text-[11px]"
                      onClick={() => {
                        setTemplate(t.id);
                        setMsg(`Template set: ${t.name}`);
                      }}
                    >
                      Use Template
                    </PillButton>
                  </div>
                </div>
              ))}
            </div>
          </WhiteCard>
        </div>

        <WhiteCard
          title="AI Skill Gap Analysis"
          action={<span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[10px] font-bold text-[#0F3DDE]">Based on 50+ Job Descriptions</span>}
        >
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <ul className="space-y-3">
              {SKILL_GAPS.map((g) => (
                <li key={g.label}>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="font-bold text-slate-700">
                      {g.label}{" "}
                      <span className="ml-1 text-[10px] font-semibold text-slate-400">{g.level}</span>
                    </span>
                    <span className="font-extrabold text-[#0B1F3A]">{g.value}%</span>
                  </div>
                  <ProgressBar value={g.value} color={g.color} />
                </li>
              ))}
            </ul>
            <div className="rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-white p-4 ring-1 ring-[#BFDBFE]">
              <p className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#0F3DDE]">
                <Sparkles size={14} /> AI Recommendation
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                Learn SQL Joins and Backend APIs to increase your resume score to 92+. Pair practice with Interview Coach,
                then apply to 3 SDE internships matched to your keywords.
              </p>
              <PillButton href="/dashboard/student/learn" className="mt-4">
                View Learning Path
              </PillButton>
            </div>
          </div>
        </WhiteCard>

        <div className="flex flex-wrap gap-2">
          <PillButton onClick={() => window.alert("PDF export will download shortly (demo).")}>
            <Download size={14} /> Download PDF
          </PillButton>
          <PillButton tone="outline" onClick={() => window.alert("Share sheet opened (demo).")}>
            <Share2 size={14} /> Share Resume
          </PillButton>
          <PillButton tone="outline" onClick={() => window.alert("Public resume link copied (demo).")}>
            <Link2 size={14} /> Create Resume Link
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
