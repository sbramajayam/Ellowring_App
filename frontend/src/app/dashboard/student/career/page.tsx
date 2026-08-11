"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  Circle,
  Code2,
  Compass,
  Database,
  Flag,
  Flame,
  Heart,
  Layout,
  Lock,
  MapPin,
  Mic,
  Rocket,
  Send,
  Server,
  Sparkles,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import clsx from "clsx";
import { StudentShell } from "@/components/student-shell";
import {
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
    label: "Profile Fit Score",
    value: "85%",
    hint: "Great Match!",
    spark: [62, 68, 71, 74, 78, 82, 85],
    color: "#0F3DDE",
  },
  {
    label: "Career Confidence",
    value: "72%",
    hint: "Keep Improving!",
    spark: [48, 52, 55, 60, 64, 68, 72],
    color: "#8B5CF6",
  },
  {
    label: "Future Salary Prediction",
    value: "₹12.5 LPA",
    hint: "Expected",
    spark: [8, 9, 9.5, 10, 11, 12, 12.5],
    color: "#22C55E",
  },
];

const ROADMAP = [
  { month: "Month 1", title: "Frontend Foundation", status: "done" as const, icon: Check },
  { month: "Month 2", title: "Backend Development", status: "done" as const, icon: Check },
  { month: "Month 3", title: "Database & APIs", status: "active" as const, icon: Database },
  { month: "Month 4", title: "Projects", status: "upcoming" as const, icon: Lock },
  { month: "Month 5–6", title: "Advanced + Placement", status: "upcoming" as const, icon: Flag },
];

const TASKS = [
  { label: "React Basics – Components", mins: 45, done: true, icon: Code2, tone: "bg-blue-50 text-[#0F3DDE]" },
  { label: "Finish System Design intro lesson", mins: 30, done: true, icon: Layout, tone: "bg-violet-50 text-violet-600" },
  { label: "Update resume projects section", mins: 20, done: false, icon: BookOpen, tone: "bg-amber-50 text-amber-600" },
  { label: "Apply to 2 Chennai internships", mins: 25, done: false, icon: Briefcase, tone: "bg-emerald-50 text-emerald-600" },
  { label: "30-min LeetCode warm-up", mins: 30, done: false, icon: Target, tone: "bg-rose-50 text-rose-600" },
];

const STUDY_SLICES = [
  { label: "DSA", value: 40, color: "#0F3DDE" },
  { label: "Backend", value: 25, color: "#8B5CF6" },
  { label: "Frontend", value: 20, color: "#22C55E" },
  { label: "DBMS", value: 15, color: "#F59E0B" },
];

const AI_OPPS = [
  {
    title: "Product Intern – Web",
    kind: "Internship",
    meta: "Freshworks · Bangalore",
    href: "/dashboard/student/internships",
    icon: Rocket,
    cta: "Apply Now",
    btn: "bg-emerald-500 text-white",
    chip: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Merit Scholarship 2026",
    kind: "Scholarship",
    meta: "Ellowring Trust · ₹50k",
    href: "/dashboard/student/colleges",
    icon: Award,
    cta: "Explore",
    btn: "bg-violet-500 text-white",
    chip: "bg-violet-50 text-violet-700",
  },
  {
    title: "Jr Full Stack Developer",
    kind: "Job Opening",
    meta: "Zoho · Chennai · 94% match",
    href: "/dashboard/student/jobs",
    icon: Briefcase,
    cta: "Apply Now",
    btn: "bg-orange-500 text-white",
    chip: "bg-orange-50 text-orange-700",
  },
  {
    title: "VIT Vellore · CSE",
    kind: "College",
    meta: "NIRF top · Apply by Sep",
    href: "/dashboard/student/colleges",
    icon: Building2,
    cta: "Explore",
    btn: "bg-[#0F3DDE] text-white",
    chip: "bg-blue-50 text-[#0F3DDE]",
  },
];

const INSIGHTS = [
  {
    title: "JavaScript score improved +8 pts",
    body: "Your React depth is hire-ready vs batch average.",
    when: "2h ago",
    icon: Star,
  },
  {
    title: "Internship readiness at 78%",
    body: "43 new remote / Chennai listings opened this week.",
    when: "5h ago",
    icon: Target,
  },
  {
    title: "Add System Design this week",
    body: "Unlocks senior internship filters on your roadmap.",
    when: "1d ago",
    icon: BookOpen,
  },
  {
    title: "Salary trajectory update",
    body: "Projected ₹12.5 LPA mid-band after 18 months Full Stack.",
    when: "2d ago",
    icon: TrendingUp,
  },
];

const QUICK_CHIPS = [
  { label: "Best colleges for my score?", icon: Building2 },
  { label: "Roadmap to become Full Stack Developer", icon: Compass },
  { label: "TNPSC Group 2 6-month plan", icon: BookOpen },
  { label: "Scholarship for me?", icon: Award },
];

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
  const [liked, setLiked] = useState<string[]>([]);

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
          subtitle="Your personal AI guide for learning, career & life decisions."
          icon={Compass}
          action={
            <button
              type="button"
              onClick={() => setAiMode((v) => !v)}
              className={clsx(
                "inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-bold ring-1 transition",
                aiMode ? "bg-white text-[#0B1F3A] ring-slate-200 shadow-sm" : "bg-slate-100 text-slate-500 ring-slate-200",
              )}
            >
              <span
                className={clsx(
                  "relative h-4 w-7 rounded-full p-0.5 transition",
                  aiMode ? "bg-emerald-500" : "bg-slate-300",
                )}
              >
                <span
                  className={clsx(
                    "block h-3 w-3 rounded-full bg-white shadow transition",
                    aiMode ? "translate-x-3" : "translate-x-0",
                  )}
                />
              </span>
              AI Mode
            </button>
          }
        />

        <BlueHero>
          <div className="relative z-10 grid gap-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div className="min-w-0">
              <h2 className="font-display text-xl font-extrabold lg:text-2xl">Hi, {firstName}! 👋</h2>
              <p className="mt-1 max-w-xl text-[13px] text-blue-100">
                I&apos;m your AI Career Copilot. Ask me anything.
              </p>
              <form onSubmit={onAsk} className="relative mt-4 max-w-2xl">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Type your question..."
                  className="w-full rounded-full border-0 bg-white py-3.5 pl-4 pr-[6.5rem] text-[13px] font-medium text-[#0B1F3A] outline-none placeholder:text-slate-400 shadow-lg"
                />
                <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
                  <button
                    type="button"
                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
                    onClick={() => window.alert("Voice input (demo).")}
                    aria-label="Voice"
                  >
                    <Mic size={16} />
                  </button>
                  <button
                    type="submit"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0F3DDE] text-white"
                    aria-label="Send"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_CHIPS.map((chip) => {
                  const Icon = chip.icon;
                  return (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => setPrompt(chip.label)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white ring-1 ring-white/25"
                    >
                      <Icon size={12} />
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="hidden flex-col items-center justify-center lg:flex">
              <div className="flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-b from-white/25 to-white/5 ring-4 ring-sky-300/25">
                <Bot size={72} className="text-white drop-shadow-lg" />
              </div>
              <p className="mt-3 text-[12px] font-semibold text-blue-50">AI Copilot Online</p>
            </div>
          </div>
        </BlueHero>

        <WhiteCard
          title="AI Smart Dashboard"
          action={
            <Link href="/dashboard/student/career" className="text-[12px] font-bold text-[#0F3DDE]">
              View Full Report →
            </Link>
          }
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {METRICS.map((m) => (
              <div key={m.label} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <p className="text-[11px] font-semibold text-slate-500">{m.label}</p>
                <p className="mt-1 font-display text-2xl font-extrabold text-[#0B1F3A]">{m.value}</p>
                <p className="mt-0.5 text-[11px] font-bold text-emerald-600">{m.hint}</p>
                <MiniSpark values={m.spark} color={m.color} />
              </div>
            ))}
          </div>
        </WhiteCard>

        <WhiteCard
          title="AI Personalized Roadmap"
          action={
            <Link href="/dashboard/student/learn" className="text-[12px] font-bold text-[#0F3DDE]">
              View Full Roadmap →
            </Link>
          }
        >
          <p className="mb-3 text-[13px] font-extrabold text-[#0B1F3A]">Full Stack Developer Roadmap (6 Months)</p>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ROADMAP.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.month} className="flex min-w-0 flex-1 items-center gap-2">
                  <div
                    className={clsx(
                      "flex min-w-[120px] flex-col items-center rounded-2xl px-3 py-3.5 text-center",
                      step.status === "done" && "bg-emerald-50 ring-1 ring-emerald-100",
                      step.status === "active" && "bg-[#EFF6FF] ring-1 ring-[#BFDBFE]",
                      step.status === "upcoming" && "bg-slate-50 ring-1 ring-slate-100",
                    )}
                  >
                    <span
                      className={clsx(
                        "mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full",
                        step.status === "done" && "bg-emerald-500 text-white",
                        step.status === "active" && "bg-[#0F3DDE] text-white",
                        step.status === "upcoming" && "bg-slate-200 text-slate-500",
                      )}
                    >
                      <Icon size={14} />
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{step.month}</p>
                    <p className="mt-1 text-[12px] font-extrabold leading-snug text-[#0B1F3A]">{step.title}</p>
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
              );
            })}
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
              {taskState.map((t, i) => {
                const Icon = t.icon;
                return (
                  <li key={t.label}>
                    <button
                      type="button"
                      onClick={() => toggleTask(i)}
                      className="flex w-full items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 text-left ring-1 ring-slate-100"
                    >
                      <SoftIcon icon={Icon} className={t.tone} />
                      <div className="min-w-0 flex-1">
                        <span
                          className={clsx(
                            "block text-[13px]",
                            t.done ? "font-medium text-slate-400 line-through" : "font-bold text-[#0B1F3A]",
                          )}
                        >
                          {t.label}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">{t.mins} min</span>
                      </div>
                      {t.done ? (
                        <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
                      ) : (
                        <Circle size={18} className="shrink-0 text-slate-300" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </WhiteCard>

          <WhiteCard title="AI Study Focus">
            <StudyDonut />
            <div className="mt-4 flex flex-wrap gap-2">
              <PillButton href="/dashboard/student/learn" tone="outline" className="!text-[11px]">
                <BookOpen size={13} /> Learn hub
              </PillButton>
              <PillButton href="/dashboard/student/mock-tests" className="!text-[11px]">
                <Server size={13} /> Practice focus
              </PillButton>
            </div>
          </WhiteCard>
        </div>

        <WhiteCard
          title="Opportunities Recommended by AI"
          action={
            <Link href="/dashboard/student/opportunities" className="text-[12px] font-bold text-[#0F3DDE]">
              View All →
            </Link>
          }
        >
          <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {AI_OPPS.map((o) => (
              <article
                key={o.title}
                className="relative min-w-[210px] max-w-[230px] rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-100"
              >
                <button
                  type="button"
                  aria-label="Save"
                  onClick={() =>
                    setLiked((prev) => (prev.includes(o.title) ? prev.filter((t) => t !== o.title) : [...prev, o.title]))
                  }
                  className="absolute right-3 top-3 rounded-full bg-white p-1.5 text-slate-400 ring-1 ring-slate-100"
                >
                  <Heart size={13} className={liked.includes(o.title) ? "fill-rose-500 text-rose-500" : ""} />
                </button>
                <SoftIcon icon={o.icon} />
                <p className={clsx("mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", o.chip)}>
                  {o.kind}
                </p>
                <h3 className="mt-1.5 text-[13px] font-extrabold leading-snug text-[#0B1F3A]">{o.title}</h3>
                <p className="mt-1 text-[11px] text-slate-500">{o.meta}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                  <MapPin size={10} /> Near You
                </p>
                <Link
                  href={o.href}
                  className={clsx(
                    "mt-3 inline-flex w-full items-center justify-center rounded-full px-3 py-2 text-[11px] font-bold",
                    o.btn,
                  )}
                >
                  {o.cta}
                </Link>
              </article>
            ))}
          </div>
        </WhiteCard>

        <WhiteCard
          title="Recent AI Insights"
          action={
            <button type="button" className="text-[12px] font-bold text-[#0F3DDE]" onClick={() => window.alert("All insights…")}>
              View All →
            </button>
          }
        >
          <ul className="space-y-2.5">
            {INSIGHTS.map((ins) => (
              <li key={ins.title} className="flex gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
                <SoftIcon icon={ins.icon} className="bg-[#EFF6FF] text-[#0F3DDE]" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-extrabold text-[#0B1F3A]">{ins.title}</p>
                    <span className="shrink-0 text-[10px] font-semibold text-slate-400">{ins.when}</span>
                  </div>
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
            <Sparkles size={14} /> <Flame size={14} /> Live AI guidance enabled
          </div>
        )}
      </CollagePage>
    </StudentShell>
  );
}
