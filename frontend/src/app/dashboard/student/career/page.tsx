"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  CheckCircle2,
  Circle,
  Compass,
  Flame,
  GraduationCap,
  Lightbulb,
  Mic,
  Rocket,
  Send,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import clsx from "clsx";
import { StudentShell } from "@/components/student-shell";
import {
  AiAssistantChip,
  BlueHero,
  CollagePage,
  CollageTitle,
  PillButton,
  SoftIcon,
  WhiteCard,
} from "@/components/student-home/collage-ui";
import { useAuth } from "@/lib/auth-context";

const METRICS = [
  {
    label: "Profile Fit",
    value: "85%",
    spark: [62, 68, 71, 74, 78, 82, 85],
    color: "#0F3DDE",
  },
  {
    label: "Confidence",
    value: "72%",
    spark: [48, 52, 55, 60, 64, 68, 72],
    color: "#22C55E",
  },
  {
    label: "Salary",
    value: "₹12.5 LPA",
    spark: [8, 9, 9.5, 10, 11, 12, 12.5],
    color: "#38BDF8",
  },
];

const ROADMAP = [
  { month: "Jun", title: "Foundation", detail: "DSA + React depth", status: "done" as const },
  { month: "Jul", title: "Projects", detail: "Ship Full Stack app", status: "done" as const },
  { month: "Aug", title: "Apply", detail: "8 internship targets", status: "active" as const },
  { month: "Sep", title: "Mocks", detail: "AI interview drills", status: "upcoming" as const },
  { month: "Oct", title: "Offers", detail: "Negotiate & accept", status: "upcoming" as const },
];

const TASKS = [
  { label: "Finish System Design intro lesson", done: true },
  { label: "Update resume projects section", done: false },
  { label: "Apply to 2 Chennai internships", done: false },
  { label: "30-min LeetCode warm-up", done: false },
];

const STUDY_SLICES = [
  { label: "DSA", value: 35, color: "#0F3DDE" },
  { label: "Projects", value: 28, color: "#22C55E" },
  { label: "Aptitude", value: 22, color: "#38BDF8" },
  { label: "English", value: 15, color: "#F59E0B" },
];

const AI_OPPS = [
  { title: "Product Intern – Web", kind: "Internship", meta: "Freshworks · Bangalore", href: "/dashboard/student/internships", icon: Rocket },
  { title: "Merit Scholarship 2026", kind: "Scholarship", meta: "Ellowring Trust · ₹50k", href: "/dashboard/student/colleges", icon: Award },
  { title: "Jr Full Stack Developer", kind: "Job", meta: "Zoho · Chennai · 94% match", href: "/dashboard/student/jobs", icon: Briefcase },
  { title: "VIT Vellore · CSE", kind: "College", meta: "NIRF top · Apply by Sep", href: "/dashboard/student/colleges", icon: Building2 },
];

const INSIGHTS = [
  {
    title: "Your React depth is hire-ready",
    body: "Match rate for Full Stack roles is 12 pts above batch average.",
    icon: TrendingUp,
  },
  {
    title: "Internship window peaking",
    body: "43 new remote / Chennai listings opened this week — prioritize now.",
    icon: Flame,
  },
  {
    title: "Roadmap tip",
    body: "Add one IEEE / client project to unlock senior internship filters.",
    icon: Lightbulb,
  },
  {
    title: "Salary trajectory",
    body: "Projected ₹12.5 LPA mid-band after 18 months Full Stack track.",
    icon: Target,
  },
];

const QUICK_CHIPS = ["Skill gap analysis", "Best internship plan", "Resume review", "Salary negotiation"];

function MiniSpark({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 88;
  const h = 28;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="mt-2 overflow-visible" aria-hidden>
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

function StudyDonut() {
  const total = STUDY_SLICES.reduce((s, x) => s + x.value, 0);
  let acc = 0;
  const segments = STUDY_SLICES.map((slice) => {
    const start = (acc / total) * 100;
    acc += slice.value;
    const end = (acc / total) * 100;
    return { ...slice, start, end };
  });
  const gradient = segments.map((s) => `${s.color} ${s.start}% ${s.end}%`).join(", ");

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div className="relative h-[120px] w-[120px] shrink-0 rounded-full" style={{ background: `conic-gradient(${gradient})` }}>
        <div className="absolute inset-[18px] flex flex-col items-center justify-center rounded-full bg-white text-center">
          <span className="font-display text-lg font-extrabold text-[#0B1F3A]">100%</span>
          <span className="text-[9px] font-semibold text-slate-500">focus</span>
        </div>
      </div>
      <ul className="grid flex-1 grid-cols-2 gap-2">
        {STUDY_SLICES.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-[12px]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            <span className="font-bold text-[#0B1F3A]">{s.label}</span>
            <span className="text-slate-500">{s.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CareerPage() {
  const { user } = useAuth();
  const firstName =
    user?.name?.replace(/^Mr\.?\s+/i, "").trim().split(/\s+/)[0] || "Vignesh";
  const [prompt, setPrompt] = useState("");
  const [aiMode, setAiMode] = useState(true);
  const [taskState, setTaskState] = useState(TASKS);

  const doneCount = useMemo(() => taskState.filter((t) => t.done).length, [taskState]);

  function onAsk(e: FormEvent) {
    e.preventDefault();
    const q = prompt.trim();
    const href = q
      ? `/dashboard/student/ai-assistant?q=${encodeURIComponent(q)}`
      : "/dashboard/student/ai-assistant";
    window.location.href = href;
  }

  function toggleTask(index: number) {
    setTaskState((prev) => prev.map((t, i) => (i === index ? { ...t, done: !t.done } : t)));
  }

  return (
    <StudentShell>
      <CollagePage>
        <CollageTitle
          title="AI Career Copilot"
          subtitle={`Personalized playbook for ${firstName} · Full Stack Developer`}
          icon={Compass}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setAiMode((v) => !v)}
                className={clsx(
                  "inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-bold ring-1 transition",
                  aiMode
                    ? "bg-[#0F3DDE] text-white ring-[#0F3DDE]"
                    : "bg-white text-slate-600 ring-slate-200",
                )}
              >
                <span
                  className={clsx(
                    "h-4 w-7 rounded-full p-0.5 transition",
                    aiMode ? "bg-white/30" : "bg-slate-200",
                  )}
                >
                  <span
                    className={clsx(
                      "block h-3 w-3 rounded-full bg-white transition",
                      aiMode ? "translate-x-3" : "translate-x-0",
                    )}
                  />
                </span>
                AI Mode
              </button>
              <AiAssistantChip />
            </div>
          }
        />

        <BlueHero>
          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <Bot size={28} />
              </div>
              <h2 className="font-display text-xl font-extrabold lg:text-2xl">Hi {firstName} 👋</h2>
              <p className="mt-1 max-w-xl text-[13px] text-blue-100">
                I&apos;m your AI Career Copilot — ask about roles, skills, colleges, or interview prep.
              </p>
              <form onSubmit={onAsk} className="relative mt-4 max-w-2xl">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Type your question…"
                  className="w-full rounded-full border border-white/25 bg-white/15 py-3 pl-4 pr-[6.5rem] text-[13px] text-white outline-none placeholder:text-white/60 focus:bg-white/20"
                />
                <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
                  <button
                    type="button"
                    className="rounded-full p-2 text-white/80 hover:bg-white/10"
                    onClick={() => window.alert("Voice input (demo).")}
                    aria-label="Voice"
                  >
                    <Mic size={16} />
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-[12px] font-bold text-[#0F3DDE]"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </form>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setPrompt(chip)}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white ring-1 ring-white/25"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </BlueHero>

        <WhiteCard title="AI Smart Dashboard">
          <div className="grid gap-3 sm:grid-cols-3">
            {METRICS.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100"
              >
                <p className="text-[11px] font-semibold text-slate-500">{m.label}</p>
                <p className="mt-1 font-display text-2xl font-extrabold text-[#0B1F3A]">{m.value}</p>
                <MiniSpark values={m.spark} color={m.color} />
              </div>
            ))}
          </div>
        </WhiteCard>

        <WhiteCard title="Personalized Roadmap">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ROADMAP.map((step, i) => (
              <div key={step.month} className="flex min-w-0 flex-1 items-center gap-2">
                <div
                  className={clsx(
                    "flex min-w-[108px] flex-col items-center rounded-2xl px-3 py-3.5 text-center",
                    step.status === "done" && "bg-emerald-50 ring-1 ring-emerald-100",
                    step.status === "active" && "bg-[#EFF6FF] ring-1 ring-[#BFDBFE]",
                    step.status === "upcoming" && "bg-slate-50",
                  )}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{step.month}</p>
                  <p className="mt-1 text-[13px] font-extrabold text-[#0B1F3A]">{step.title}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">{step.detail}</p>
                  <span
                    className={clsx(
                      "mt-2 rounded-full px-2 py-0.5 text-[9px] font-bold",
                      step.status === "done" && "bg-emerald-100 text-emerald-700",
                      step.status === "active" && "bg-[#0F3DDE] text-white",
                      step.status === "upcoming" && "bg-slate-200 text-slate-500",
                    )}
                  >
                    {step.status === "done" ? "Done" : step.status === "active" ? "Now" : "Next"}
                  </span>
                </div>
                {i < ROADMAP.length - 1 ? (
                  <span
                    className={clsx(
                      "hidden h-0.5 w-3 shrink-0 sm:block",
                      step.status === "done" ? "bg-emerald-300" : "bg-slate-200",
                    )}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </WhiteCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <WhiteCard
            title="Today's AI Tasks"
            action={
              <span className="text-[11px] font-bold text-slate-400">
                {doneCount}/{taskState.length}
              </span>
            }
          >
            <ul className="space-y-2.5">
              {taskState.map((t, i) => (
                <li key={t.label}>
                  <button
                    type="button"
                    onClick={() => toggleTask(i)}
                    className="flex w-full items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 text-left ring-1 ring-slate-100"
                  >
                    {t.done ? (
                      <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
                    ) : (
                      <Circle size={18} className="shrink-0 text-slate-300" />
                    )}
                    <span
                      className={clsx(
                        "text-[13px]",
                        t.done ? "font-medium text-slate-400 line-through" : "font-bold text-[#0B1F3A]",
                      )}
                    >
                      {t.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </WhiteCard>

          <WhiteCard title="Study Focus">
            <StudyDonut />
            <div className="mt-4 flex flex-wrap gap-2">
              <PillButton href="/dashboard/student/learn" tone="outline" className="!text-[11px]">
                <BookOpen size={13} /> Learn hub
              </PillButton>
              <PillButton href="/dashboard/student/mock-tests" className="!text-[11px]">
                <GraduationCap size={13} /> Mock tests
              </PillButton>
            </div>
          </WhiteCard>
        </div>

        <WhiteCard
          title="Opportunities Recommended by AI"
          action={
            <Link href="/dashboard/student/opportunities" className="text-[12px] font-bold text-[#0F3DDE]">
              View all
            </Link>
          }
        >
          <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {AI_OPPS.map((o) => (
              <article
                key={o.title}
                className="min-w-[200px] max-w-[220px] rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-100"
              >
                <SoftIcon icon={o.icon} />
                <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#0F3DDE]">{o.kind}</p>
                <h3 className="mt-0.5 text-[13px] font-extrabold leading-snug text-[#0B1F3A]">{o.title}</h3>
                <p className="mt-1 text-[11px] text-slate-500">{o.meta}</p>
                <PillButton href={o.href} className="mt-3 w-full !py-2 !text-[11px]">
                  Open
                </PillButton>
              </article>
            ))}
          </div>
        </WhiteCard>

        <WhiteCard title="Recent AI Insights">
          <ul className="space-y-2.5">
            {INSIGHTS.map((ins) => (
              <li key={ins.title} className="flex gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
                <SoftIcon icon={ins.icon} className="bg-[#EFF6FF] text-[#0F3DDE]" />
                <div className="min-w-0">
                  <p className="text-[13px] font-extrabold text-[#0B1F3A]">{ins.title}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{ins.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </WhiteCard>

        {!aiMode ? (
          <p className="rounded-xl bg-slate-50 px-4 py-3 text-center text-[12px] text-slate-500 ring-1 ring-slate-100">
            AI Mode is off — turn it on for personalized recommendations.
          </p>
        ) : (
          <div className="flex items-center justify-center gap-2 text-[12px] font-semibold text-[#0F3DDE]">
            <Sparkles size={14} /> Live AI guidance enabled
          </div>
        )}
      </CollagePage>
    </StudentShell>
  );
}
