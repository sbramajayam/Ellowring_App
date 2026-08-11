"use client";

import { useState } from "react";
import {
  Bookmark,
  BookOpen,
  Bot,
  Briefcase,
  Calendar,
  Clock,
  Code2,
  Download,
  Eye,
  HelpCircle,
  Mic,
  Rocket,
  Share2,
  Signal,
  Sparkles,
  Target,
  Trophy,
  Upload,
  Users,
  Video,
  MessageSquare,
  Shield,
} from "lucide-react";
import clsx from "clsx";
import { StudentShell } from "@/components/student-shell";
import {
  BlueHero,
  CollagePage,
  CollageTitle,
  PillButton,
  ProgressBar,
  ScoreRing,
  SoftIcon,
  WhiteCard,
} from "@/components/student-home/collage-ui";

const READINESS = [
  { label: "Communication", value: 82, color: "bg-emerald-500" },
  { label: "Technical Knowledge", value: 88, color: "bg-[#0F3DDE]" },
  { label: "Confidence", value: 79, color: "bg-amber-400" },
];

const CATEGORIES = [
  { label: "HR Interview", icon: Users, tone: "bg-blue-50 text-[#0F3DDE]" },
  { label: "Technical Interview", icon: Briefcase, tone: "bg-emerald-50 text-emerald-600" },
  { label: "Coding Interview", icon: Code2, tone: "bg-violet-50 text-violet-600" },
  { label: "Aptitude Round", icon: BookOpen, tone: "bg-orange-50 text-orange-600" },
  { label: "Group Discussion", icon: MessageSquare, tone: "bg-teal-50 text-teal-600" },
  { label: "Mock Interview", icon: Video, tone: "bg-rose-50 text-rose-600" },
];

const FEEDBACK = [
  { label: "Eye Contact", value: 74, icon: Eye },
  { label: "Communication Clarity", value: 86, icon: MessageSquare },
  { label: "Technical Accuracy", value: 81, icon: Target },
  { label: "Confidence Level", value: 78, icon: Signal },
  { label: "Answer Structure (STAR)", value: 69, icon: Sparkles },
  { label: "Time Management", value: 72, icon: Clock },
];

const PRACTICE_Qs = [
  { q: "Explain React Hooks with a real example.", tag: "Technical" },
  { q: "Tell me about yourself in 60 seconds.", tag: "HR" },
  { q: "What are the four pillars of OOP?", tag: "Technical" },
  { q: "Describe a conflict and how you resolved it.", tag: "Behavioral" },
  { q: "How would you optimize a slow SQL query?", tag: "Coding" },
];

const HISTORY = [
  { role: "SWE Intern", when: "2 days ago", score: 84 },
  { role: "Full Stack", when: "1 week ago", score: 79 },
  { role: "HR Screen", when: "2 weeks ago", score: 88 },
];

const PLAN = [
  { day: "Day 1", focus: "HR + intro stories", mins: 25 },
  { day: "Day 2", focus: "DSA warm-up + React", mins: 40 },
  { day: "Day 3", focus: "Behavioral STAR drills", mins: 30 },
  { day: "Day 4", focus: "System design lite", mins: 35 },
  { day: "Day 5", focus: "Full mock interview", mins: 45 },
];

const SERIES = {
  overall: [58, 62, 70, 68, 74, 79, 84],
  technical: [52, 55, 60, 64, 70, 73, 76],
  confidence: [60, 63, 68, 66, 72, 76, 79],
  hr: [64, 66, 72, 70, 75, 80, 88],
};

function MultiLineChart() {
  const w = 320;
  const h = 120;
  const pad = 8;
  function path(values: number[]) {
    return values
      .map((v, i) => {
        const x = pad + (i / (values.length - 1)) * (w - pad * 2);
        const y = h - pad - (v / 100) * (h - pad * 2);
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  }
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-36 w-full min-w-[280px]">
        {[25, 50, 75].map((g) => (
          <line
            key={g}
            x1={pad}
            x2={w - pad}
            y1={h - pad - (g / 100) * (h - pad * 2)}
            y2={h - pad - (g / 100) * (h - pad * 2)}
            stroke="#E2E8F0"
            strokeWidth="1"
          />
        ))}
        <path d={path(SERIES.overall)} fill="none" stroke="#0F3DDE" strokeWidth="2.5" strokeLinecap="round" />
        <path d={path(SERIES.technical)} fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
        <path d={path(SERIES.confidence)} fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <path d={path(SERIES.hr)} fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-bold text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#0F3DDE]" /> Overall
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Technical
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400" /> Confidence
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-sky-400" /> HR
        </span>
      </div>
    </div>
  );
}

export default function AiAssistantPage() {
  const [role, setRole] = useState("Full Stack Developer");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [mode, setMode] = useState("Technical + HR");
  const [duration, setDuration] = useState("30 Minutes");
  const [started, setStarted] = useState(false);
  const [liveOn, setLiveOn] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);

  return (
    <StudentShell>
      <CollagePage>
        <CollageTitle
          title="AI Interview Coach"
          subtitle="Practice interviews with AI and get instant feedback."
          icon={Bot}
          action={
            <PillButton tone="outline" onClick={() => setHistoryOpen((v) => !v)}>
              <Clock size={14} /> Interview History
            </PillButton>
          }
        />

        {historyOpen ? (
          <WhiteCard title="Interview History" action={<span className="text-[11px] font-bold text-slate-400">{HISTORY.length} sessions</span>}>
            <ul className="space-y-2">
              {HISTORY.map((h) => (
                <li
                  key={h.role + h.when}
                  className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100"
                >
                  <div>
                    <p className="text-[13px] font-extrabold text-[#0B1F3A]">{h.role}</p>
                    <p className="text-[11px] text-slate-500">{h.when}</p>
                  </div>
                  <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[12px] font-extrabold text-[#0F3DDE]">
                    {h.score}
                  </span>
                </li>
              ))}
            </ul>
          </WhiteCard>
        ) : null}

        <BlueHero>
          <div className="relative z-10 grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="flex flex-col items-center justify-center rounded-[20px] bg-white/10 p-5 ring-1 ring-white/15">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-white/25 to-white/5 ring-4 ring-sky-300/30">
                <Bot size={48} className="text-white" />
              </div>
              <p className="mt-3 text-center text-[12px] font-semibold text-blue-50">AI Coach Online</p>
            </div>
            <div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                <label className="block rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase text-blue-100">
                    <Briefcase size={12} /> Target Role
                  </span>
                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border-0 bg-white/15 px-3 py-2 text-[13px] font-semibold text-white outline-none ring-1 ring-white/20"
                  />
                </label>
                <label className="block rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase text-blue-100">
                    <Signal size={12} /> Difficulty
                  </span>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full rounded-xl border-0 bg-white/15 px-3 py-2 text-[13px] font-semibold text-white outline-none ring-1 ring-white/20"
                  >
                    {["Beginner", "Intermediate", "Advanced"].map((d) => (
                      <option key={d} value={d} className="text-slate-800">
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase text-blue-100">
                    <Shield size={12} /> Interview Mode
                  </span>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full rounded-xl border-0 bg-white/15 px-3 py-2 text-[13px] font-semibold text-white outline-none ring-1 ring-white/20"
                  >
                    {["Technical + HR", "HR only", "Technical only", "Voice + Text"].map((d) => (
                      <option key={d} value={d} className="text-slate-800">
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase text-blue-100">
                    <Clock size={12} /> Duration
                  </span>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-xl border-0 bg-white/15 px-3 py-2 text-[13px] font-semibold text-white outline-none ring-1 ring-white/20"
                  >
                    {["15 Minutes", "30 Minutes", "45 Minutes", "60 Minutes"].map((d) => (
                      <option key={d} value={d} className="text-slate-800">
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <PillButton
                tone="white"
                className="mt-4 w-full sm:w-auto"
                onClick={() => {
                  setStarted(true);
                  setLiveOn(true);
                  window.alert(`Starting ${difficulty} interview for ${role} (${mode}, ${duration}).`);
                }}
              >
                <Rocket size={14} /> {started ? "Resume Session" : "Start AI Interview"}
              </PillButton>
            </div>
          </div>
        </BlueHero>

        <div className="grid gap-4 lg:grid-cols-2">
          <WhiteCard title="Interview Readiness Score">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
              <div className="flex flex-col items-center">
                <ScoreRing value={84} label="Ready" size={118} tone="mixed" />
                <p className="mt-2 text-[13px] font-bold text-emerald-600">Great Progress!</p>
              </div>
              <ul className="w-full flex-1 space-y-3">
                {READINESS.map((s) => (
                  <li key={s.label}>
                    <div className="mb-1 flex justify-between text-[12px]">
                      <span className="font-bold text-slate-700">{s.label}</span>
                      <span className="font-extrabold text-[#0B1F3A]">{s.value}%</span>
                    </div>
                    <ProgressBar value={s.value} color={s.color} />
                  </li>
                ))}
              </ul>
            </div>
          </WhiteCard>

          <WhiteCard title="Practice Categories">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => window.alert(`Opening ${c.label} drills…`)}
                    className="flex flex-col items-start gap-2 rounded-[16px] bg-[#F8FAFC] p-3 text-left ring-1 ring-slate-100 transition hover:-translate-y-0.5"
                  >
                    <SoftIcon icon={Icon} className={c.tone} />
                    <span className="text-[12px] font-extrabold leading-snug text-[#0B1F3A]">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </WhiteCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <WhiteCard title="Interview Feedback">
            <ul className="space-y-2.5">
              {FEEDBACK.map((f) => (
                <li
                  key={f.label}
                  className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#F8FAFC] p-3 ring-1 ring-slate-100"
                >
                  <SoftIcon icon={f.icon} className="bg-[#EFF6FF] text-[#0F3DDE]" />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex justify-between text-[12px]">
                      <span className="font-bold text-[#0B1F3A]">{f.label}</span>
                      <span className="font-extrabold text-slate-500">{f.value}%</span>
                    </div>
                    <ProgressBar value={f.value} />
                  </div>
                  <PillButton
                    tone="outline"
                    className="!px-3 !py-1.5 !text-[11px]"
                    onClick={() => window.alert(`Improve ${f.label} with AI…`)}
                  >
                    Improve with AI
                  </PillButton>
                </li>
              ))}
            </ul>
          </WhiteCard>

          <WhiteCard
            title="Questions You Should Practice Today"
            action={
              <button
                type="button"
                className="text-[12px] font-bold text-[#0F3DDE]"
                onClick={() => window.alert("Refreshing set…")}
              >
                Shuffle
              </button>
            }
          >
            <ul className="space-y-2.5">
              {PRACTICE_Qs.map((item) => (
                <li
                  key={item.q}
                  className="flex items-center gap-3 rounded-2xl bg-[#F8FAFC] p-3.5 ring-1 ring-slate-100"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#0F3DDE]">
                    <HelpCircle size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-[#0B1F3A]">{item.q}</p>
                    <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#0F3DDE]">
                      {item.tag}
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label="Save question"
                    onClick={() =>
                      setSaved((prev) => (prev.includes(item.q) ? prev.filter((q) => q !== item.q) : [...prev, item.q]))
                    }
                    className={clsx(
                      "rounded-full p-2 transition",
                      saved.includes(item.q) ? "bg-[#0F3DDE] text-white" : "bg-white text-slate-400 ring-1 ring-slate-200",
                    )}
                  >
                    <Bookmark size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </WhiteCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section
            className={clsx(
              "rounded-[22px] p-5 text-white shadow-lg",
              "bg-gradient-to-br from-[#071526] via-[#0B1F3A] to-[#122F6B]",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sky-200 ring-1 ring-white/15">
                  <Sparkles size={11} /> AI Voice Analysis
                </p>
                <h3 className="mt-2 font-display text-xl font-extrabold">Live Voice Interview</h3>
                <p className="mt-1 text-[12px] text-blue-100">
                  {liveOn ? "Listening…" : "Speak naturally — AI scores clarity, pace & confidence."}
                </p>
                <p className="mt-1 text-[11px] text-blue-200">
                  {role} · {difficulty} · {duration}
                </p>
              </div>
              <span
                className={clsx(
                  "flex h-14 w-14 items-center justify-center rounded-full ring-4",
                  liveOn ? "animate-pulse bg-emerald-500 ring-emerald-400/40" : "bg-white/10 ring-white/10",
                )}
              >
                <Mic size={22} />
              </span>
            </div>
            {liveOn ? (
              <div className="mt-4 flex h-10 items-end gap-1">
                {Array.from({ length: 28 }).map((_, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-t bg-sky-400/80"
                    style={{ height: `${20 + ((i * 17) % 70)}%` }}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-4 flex h-10 items-end gap-1 opacity-40">
                {Array.from({ length: 28 }).map((_, i) => (
                  <span key={i} className="flex-1 rounded-t bg-white/40" style={{ height: `${25 + ((i * 11) % 50)}%` }} />
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <PillButton
                tone="white"
                onClick={() => {
                  setLiveOn((v) => !v);
                  if (!started) setStarted(true);
                }}
              >
                <Mic size={14} /> {liveOn ? "End Voice Interview" : "Start Voice Interview"}
              </PillButton>
              <PillButton
                tone="outline"
                className="!bg-transparent !text-white !ring-white/30"
                onClick={() => window.alert("Upload video response (demo).")}
              >
                <Upload size={14} /> Upload Video Response
              </PillButton>
            </div>
          </section>

          <WhiteCard title="Performance Over Time" action={<span className="text-[11px] font-bold text-slate-400">Last 7 interviews</span>}>
            <MultiLineChart />
          </WhiteCard>
        </div>

        <div className="overflow-hidden rounded-[22px] bg-gradient-to-r from-[#EFF6FF] via-white to-[#F0FDF4] p-4 ring-1 ring-[#BFDBFE] lg:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-3">
              <SoftIcon icon={Bot} className="bg-white text-[#0F3DDE] ring-1 ring-[#BFDBFE]" />
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wide text-[#0F3DDE]">AI Career Recommendation</p>
                <p className="mt-1 max-w-2xl text-[13px] font-semibold leading-relaxed text-[#0B1F3A]">
                  You are interview-ready for Junior Full Stack Developer roles. Focus Day 2–3 on STAR stories and
                  System Design lite to push readiness past 90.
                </p>
              </div>
            </div>
            <PillButton className="shrink-0" onClick={() => setPlanOpen(true)}>
              <Calendar size={14} /> Generate 5-Day Interview Plan
            </PillButton>
          </div>
          {planOpen ? (
            <ul className="mt-4 grid gap-2 sm:grid-cols-5">
              {PLAN.map((p) => (
                <li key={p.day} className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-100">
                  <p className="text-[11px] font-extrabold text-[#0F3DDE]">{p.day}</p>
                  <p className="mt-0.5 text-[12px] font-bold text-[#0B1F3A]">{p.focus}</p>
                  <p className="mt-1 text-[10px] text-slate-500">{p.mins} min</p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <PillButton tone="outline" onClick={() => window.alert("Downloading report…")}>
            <Download size={14} /> Download Report
          </PillButton>
          <PillButton tone="outline" onClick={() => window.alert("Share link copied.")}>
            <Share2 size={14} /> Share Performance
          </PillButton>
          <PillButton onClick={() => window.alert("Mock interview booked.")}>
            <Calendar size={14} /> Book Mock with Expert
          </PillButton>
          <PillButton tone="dark" onClick={() => window.alert(`Saved answers: ${saved.length || "demo set"}`)}>
            <Trophy size={14} /> Saved Answers
          </PillButton>
        </div>
      </CollagePage>
    </StudentShell>
  );
}
