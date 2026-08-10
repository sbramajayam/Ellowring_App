"use client";

import { useState } from "react";
import {
  BookOpen,
  Bot,
  Briefcase,
  Calendar,
  Download,
  MessageSquare,
  Mic,
  Share2,
  Sparkles,
  Target,
  Trophy,
  Users,
  Video,
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

const SKILLS = [
  { label: "Communication", value: 88, color: "bg-emerald-500" },
  { label: "Technical Depth", value: 76, color: "bg-[#0F3DDE]" },
  { label: "Problem Solving", value: 82, color: "bg-sky-500" },
  { label: "Confidence", value: 71, color: "bg-amber-400" },
  { label: "STAR Answers", value: 79, color: "bg-violet-500" },
];

const CATEGORIES = [
  { label: "HR Round", icon: Users, tone: "bg-blue-50 text-[#0F3DDE]" },
  { label: "Technical", icon: Briefcase, tone: "bg-emerald-50 text-emerald-600" },
  { label: "Behavioral", icon: MessageSquare, tone: "bg-amber-50 text-amber-600" },
  { label: "System Design", icon: Target, tone: "bg-violet-50 text-violet-600" },
  { label: "Aptitude", icon: BookOpen, tone: "bg-sky-50 text-sky-600" },
  { label: "Mock Panel", icon: Video, tone: "bg-rose-50 text-rose-600" },
];

const PRACTICE_Qs = [
  { q: "Tell me about yourself in 60 seconds.", tag: "HR", score: 72 },
  { q: "Explain a project you are proud of.", tag: "Technical", score: 80 },
  { q: "Describe a conflict and how you resolved it.", tag: "Behavioral", score: 68 },
  { q: "How would you design a URL shortener?", tag: "System Design", score: 61 },
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

/** Multi-series line chart via CSS / SVG */
const SERIES = {
  overall: [58, 62, 70, 68, 74, 79, 84],
  technical: [52, 55, 60, 64, 70, 73, 76],
  soft: [64, 66, 72, 70, 75, 80, 88],
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
        <path d={path(SERIES.soft)} fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-bold text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#0F3DDE]" /> Overall
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Technical
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-sky-400" /> Soft skills
        </span>
      </div>
    </div>
  );
}

export default function AiAssistantPage() {
  const [role, setRole] = useState("Software Engineer Intern");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [mode, setMode] = useState("Voice + Text");
  const [duration, setDuration] = useState("20 min");
  const [started, setStarted] = useState(false);
  const [liveOn, setLiveOn] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);

  return (
    <StudentShell>
      <CollagePage>
        <CollageTitle
          title="AI Interview Coach"
          subtitle="Practice mock interviews, track scores, and improve with AI feedback."
          icon={Bot}
          action={<AiAssistantChip href="/dashboard/student/ai-assistant" />}
        />

        <WhiteCard
          title="Interview History"
          action={<span className="text-[11px] font-bold text-slate-400">{HISTORY.length} sessions</span>}
        >
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

        <BlueHero>
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <Bot size={28} />
              </div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight lg:text-[28px]">Start AI Interview</h2>
              <p className="mt-1 text-[13px] text-blue-100">Your AI coach is ready — configure and begin.</p>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase text-blue-100">Target Role</span>
                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border-0 bg-white/15 px-3 py-2.5 text-[13px] font-semibold text-white outline-none ring-1 ring-white/20 placeholder:text-blue-100"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase text-blue-100">Difficulty</span>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full rounded-xl border-0 bg-white/15 px-3 py-2.5 text-[13px] font-semibold text-white outline-none ring-1 ring-white/20"
                  >
                    {["Beginner", "Intermediate", "Advanced"].map((d) => (
                      <option key={d} value={d} className="text-slate-800">
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase text-blue-100">Mode</span>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full rounded-xl border-0 bg-white/15 px-3 py-2.5 text-[13px] font-semibold text-white outline-none ring-1 ring-white/20"
                  >
                    {["Voice + Text", "Text only", "Video mock"].map((d) => (
                      <option key={d} value={d} className="text-slate-800">
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase text-blue-100">Duration</span>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-xl border-0 bg-white/15 px-3 py-2.5 text-[13px] font-semibold text-white outline-none ring-1 ring-white/20"
                  >
                    {["10 min", "20 min", "30 min", "45 min"].map((d) => (
                      <option key={d} value={d} className="text-slate-800">
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <PillButton
                tone="white"
                className="mt-4"
                onClick={() => {
                  setStarted(true);
                  setLiveOn(true);
                  window.alert(`Starting ${difficulty} interview for ${role} (${mode}, ${duration}).`);
                }}
              >
                <Mic size={14} /> {started ? "Resume Session" : "Start AI Interview"}
              </PillButton>
            </div>
            <div className="flex flex-col items-center justify-center rounded-[20px] bg-white/10 p-5 ring-1 ring-white/15">
              <Bot size={64} className="text-white/90" />
              <p className="mt-3 text-center text-[12px] font-semibold text-blue-50">AI Coach Online</p>
            </div>
          </div>
        </BlueHero>

        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <WhiteCard title="Interview Readiness" className="text-[#0B1F3A]">
            <div className="flex flex-col items-center">
              <ScoreRing value={84} label="Ready" size={110} tone="mixed" />
              <p className="mt-2 text-[12px] font-semibold text-slate-500">84/100 overall readiness</p>
            </div>
          </WhiteCard>
          <WhiteCard title="Skill Breakdown">
            <ul className="space-y-3">
              {SKILLS.map((s) => (
                <li key={s.label}>
                  <div className="mb-1 flex justify-between text-[12px]">
                    <span className="font-bold text-slate-700">{s.label}</span>
                    <span className="font-extrabold text-[#0B1F3A]">{s.value}%</span>
                  </div>
                  <ProgressBar value={s.value} color={s.color} />
                </li>
              ))}
            </ul>
          </WhiteCard>
        </div>

        <WhiteCard title="Feedback">
          <div className="rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-white p-4 ring-1 ring-[#BFDBFE]">
            <p className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#0F3DDE]">
              <Sparkles size={14} /> Latest coaching tip
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
              Strong communication, but tighten STAR structure on conflict questions. Lead with the
              situation in one sentence, then quantify the action result.
            </p>
            <PillButton className="mt-4" onClick={() => window.alert("AI coaching tips unlocked (demo).")}>
              <Sparkles size={14} /> Improve with AI
            </PillButton>
          </div>
        </WhiteCard>

        <section
          className={clsx(
            "rounded-[22px] p-5 text-white shadow-lg",
            "bg-gradient-to-br from-[#071526] via-[#0B1F3A] to-[#122F6B]",
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-blue-200">Live Voice Interview</p>
              <h3 className="mt-1 font-display text-xl font-extrabold">
                {liveOn ? "Listening…" : "Mic ready when you are"}
              </h3>
              <p className="mt-1 text-[12px] text-blue-100">
                {role} · {difficulty} · {duration}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={clsx(
                  "flex h-14 w-14 items-center justify-center rounded-full ring-4",
                  liveOn ? "animate-pulse bg-emerald-500 ring-emerald-400/40" : "bg-white/10 ring-white/10",
                )}
              >
                <Mic size={22} />
              </span>
              <PillButton
                tone="white"
                onClick={() => {
                  setLiveOn((v) => !v);
                  if (!started) setStarted(true);
                }}
              >
                {liveOn ? "End" : "Go Live"}
              </PillButton>
            </div>
          </div>
          {liveOn ? (
            <div className="mt-4 flex h-10 items-end gap-1">
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-t bg-sky-400/80"
                  style={{ height: `${20 + ((i * 17) % 70)}%` }}
                />
              ))}
            </div>
          ) : null}
        </section>

        <WhiteCard title="Practice Categories">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => window.alert(`Opening ${c.label} drills…`)}
                  className="flex items-center gap-3 rounded-[16px] bg-[#F8FAFC] p-3 text-left ring-1 ring-slate-100 transition hover:-translate-y-0.5"
                >
                  <SoftIcon icon={Icon} className={c.tone} />
                  <span className="text-[13px] font-extrabold text-[#0B1F3A]">{c.label}</span>
                </button>
              );
            })}
          </div>
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
                className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#F8FAFC] p-3.5 ring-1 ring-slate-100"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-[#0B1F3A]">{item.q}</p>
                  <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#0F3DDE]">
                    {item.tag}
                  </span>
                </div>
                <span className="text-[12px] font-extrabold text-slate-500">{item.score}/100</span>
                <PillButton tone="outline" className="!px-3 !py-1.5" onClick={() => window.alert("Improve with AI…")}>
                  Improve with AI
                </PillButton>
              </li>
            ))}
          </ul>
        </WhiteCard>

        <WhiteCard title="Performance Over Time">
          <MultiLineChart />
        </WhiteCard>

        <WhiteCard
          title="5-Day Interview Plan"
          action={
            <PillButton className="!py-1.5 !text-[11px]" onClick={() => setPlanOpen(true)}>
              Generate 5-Day Plan
            </PillButton>
          }
        >
          {planOpen ? (
            <ul className="space-y-2">
              {PLAN.map((p) => (
                <li
                  key={p.day}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100"
                >
                  <div>
                    <p className="text-[12px] font-extrabold text-[#0F3DDE]">{p.day}</p>
                    <p className="text-[13px] font-bold text-[#0B1F3A]">{p.focus}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">{p.mins} min</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-slate-500">
              Tap Generate to build a personalized mock schedule for the week.
            </p>
          )}
        </WhiteCard>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <PillButton tone="outline" onClick={() => window.alert("Downloading report…")}>
            <Download size={14} /> Download
          </PillButton>
          <PillButton tone="outline" onClick={() => window.alert("Share link copied.")}>
            <Share2 size={14} /> Share
          </PillButton>
          <PillButton onClick={() => window.alert("Mock interview booked.")}>
            <Calendar size={14} /> Book Mock
          </PillButton>
          <PillButton tone="dark" onClick={() => window.alert("Opening saved answers…")}>
            <Trophy size={14} /> Saved
          </PillButton>
        </div>
      </CollagePage>
    </StudentShell>
  );
}
