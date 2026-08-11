"use client";

import Link from "next/link";
import {
  Bot,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Code2,
  Database,
  Flame,
  Map,
  Play,
  Sparkles,
  Target,
} from "lucide-react";
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

const ROADMAP_STEPS = [
  { title: "Programming Fundamentals", status: "done" as const },
  { title: "HTML & CSS", status: "done" as const },
  { title: "JavaScript", status: "active" as const },
  { title: "React.js", status: "upcoming" as const },
  { title: "Node.js & Express", status: "upcoming" as const },
  { title: "SQL & Databases", status: "upcoming" as const },
  { title: "API Development", status: "upcoming" as const },
  { title: "Real-World Projects", status: "upcoming" as const },
  { title: "Ellowring Internship", status: "upcoming" as const },
];

const SKILL_BARS = [
  { name: "JavaScript", value: 78, color: "bg-[#0F3DDE]" },
  { name: "React", value: 42, color: "bg-[#3B82F6]" },
  { name: "Node.js", value: 31, color: "bg-indigo-500" },
  { name: "SQL", value: 26, color: "bg-sky-500" },
  { name: "Git & GitHub", value: 64, color: "bg-emerald-500" },
  { name: "Communication", value: 81, color: "bg-violet-500" },
];

const MILESTONES = [
  { label: "Complete React Basics (May 25)", done: true },
  { label: "Finish SQL Module (May 25)", done: true },
  { label: "Upload GitHub Project (May 26)", done: false },
  { label: "Attend Ellowring Webinar (May 27)", done: false },
  { label: "Complete Mock Interview (May 28)", done: false },
];

const TODAY_TASKS = [
  { title: "JavaScript Arrays & Methods", progress: 70, mins: "30m", icon: Code2 },
  { title: "React Components", progress: 40, mins: "45m", icon: Sparkles },
  { title: "SQL Joins Practice", progress: 30, mins: "30m", icon: Database },
  { title: "Build Mini Project", progress: 20, mins: "1h 30m", icon: Map },
  { title: "20 Aptitude Questions", progress: 60, mins: "20m", icon: Target },
];

const NEXT_SKILLS = [
  { title: "Advanced JavaScript", meta: "2 weeks · Intermediate", level: "Intermediate" },
  { title: "REST APIs", meta: "10 days · Intermediate", level: "Intermediate" },
  { title: "Database Design", meta: "1 week · Intermediate", level: "Intermediate" },
  { title: "Authentication & JWT", meta: "5 days · Advanced", level: "Advanced" },
  { title: "System Design Basics", meta: "2 weeks · Advanced", level: "Advanced" },
];

export default function StudentLearnPage() {
  return (
    <StudentShell>
      <CollagePage className="relative">
        <CollageTitle
          title="AI Skill Roadmap Dashboard"
          subtitle="Your personalized AI-powered learning path."
          icon={Map}
        />

        <BlueHero>
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex shrink-0 flex-col items-center gap-1 self-center rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm lg:self-start">
              <p className="text-[10px] font-bold uppercase tracking-wide text-blue-100">AI Roadmap Progress</p>
              <ScoreRing value={38} label="Overall Progress" size={112} tone="mixed" onDark percent />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white ring-1 ring-white/25">
                <Sparkles size={12} /> AI Personalized
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <p className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-100">
                    <Briefcase size={11} /> Target Career
                  </p>
                  <p className="mt-0.5 text-[13px] font-bold">Full Stack Developer</p>
                </div>
                <div>
                  <p className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-100">
                    <Clock3 size={11} /> Estimated Completion
                  </p>
                  <p className="mt-0.5 text-[13px] font-bold">4 Months Left</p>
                </div>
                <div>
                  <p className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-100">
                    <CheckCircle2 size={11} /> Weekly Consistency
                  </p>
                  <p className="mt-0.5 text-[13px] font-bold">92%</p>
                </div>
                <div>
                  <p className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-100">
                    <CalendarDays size={11} /> Daily Goal
                  </p>
                  <p className="mt-0.5 text-[13px] font-bold">3 of 5</p>
                </div>
              </div>
              <div className="mt-4">
                <PillButton href="/dashboard/student/courses" tone="white">
                  <Play size={14} /> Continue Today&apos;s Plan →
                </PillButton>
              </div>
            </div>
          </div>
        </BlueHero>

        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          {/* Left sticky-feel column */}
          <div className="space-y-4 lg:sticky lg:top-4">
            <WhiteCard
              title="AI Roadmap Timeline"
              action={<span className="text-[11px] font-bold text-[#0F3DDE]">9 stages</span>}
            >
              <ul className="space-y-3">
                {ROADMAP_STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      {step.status === "done" ? (
                        <CheckCircle2 size={20} className="text-emerald-500" />
                      ) : step.status === "active" ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0F3DDE] text-[9px] font-bold text-white">
                          {i + 1}
                        </span>
                      ) : (
                        <Circle size={20} className="text-slate-300" />
                      )}
                      {i < ROADMAP_STEPS.length - 1 ? (
                        <span
                          className={`mt-1 w-0.5 min-h-[18px] flex-1 ${
                            step.status === "done" ? "bg-emerald-200" : "bg-slate-100"
                          }`}
                        />
                      ) : null}
                    </div>
                    <div
                      className={`min-w-0 flex-1 rounded-xl px-3 py-2 ${
                        step.status === "active" ? "bg-[#EFF6FF] ring-1 ring-[#BFDBFE]" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13px] font-bold text-[#0B1F3A]">{step.title}</p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            step.status === "done"
                              ? "bg-emerald-50 text-emerald-700"
                              : step.status === "active"
                                ? "bg-[#0F3DDE] text-white"
                                : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {step.status === "done" ? "Done" : step.status === "active" ? "In Progress" : "Upcoming"}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard/student/career" className="mt-3 inline-flex text-[12px] font-bold text-[#0F3DDE]">
                View Full Roadmap →
              </Link>
            </WhiteCard>

            <WhiteCard
              title="Skill Progress Analytics"
              action={
                <Link href="/dashboard/student/insights" className="text-[11px] font-bold text-[#0F3DDE]">
                  View Detailed Analytics →
                </Link>
              }
            >
              <div className="space-y-3.5">
                {SKILL_BARS.map((s) => (
                  <div key={s.name}>
                    <div className="mb-1 flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#0B1F3A]">{s.name}</span>
                      <span className="font-semibold text-slate-500">{s.value}%</span>
                    </div>
                    <ProgressBar value={s.value} color={s.color} />
                  </div>
                ))}
              </div>
            </WhiteCard>

            <WhiteCard
              title="Weekly Milestones"
              action={
                <Link href="/dashboard/student/calendar" className="text-[11px] font-bold text-[#0F3DDE]">
                  View All Milestones →
                </Link>
              }
            >
              <ul className="space-y-2.5">
                {MILESTONES.map((m) => (
                  <li key={m.label} className="flex items-center gap-2.5">
                    {m.done ? (
                      <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
                    ) : (
                      <Circle size={18} className="shrink-0 text-slate-300" />
                    )}
                    <span className={`text-[13px] font-semibold ${m.done ? "text-slate-500 line-through" : "text-[#0B1F3A]"}`}>
                      {m.label}
                    </span>
                  </li>
                ))}
              </ul>
            </WhiteCard>
          </div>

          {/* Right sticky-feel column */}
          <div className="space-y-4 lg:sticky lg:top-4">
            <WhiteCard
              title="Today's AI Learning Tasks"
              action={<span className="rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-[11px] font-bold text-[#0F3DDE]">5 Tasks</span>}
            >
              <ul className="space-y-2.5">
                {TODAY_TASKS.map((task) => {
                  const Icon = task.icon;
                  return (
                    <li
                      key={task.title}
                      className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <SoftIcon icon={Icon} className="h-9 w-9 bg-blue-50 text-[#0F3DDE]" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-bold text-[#0B1F3A]">{task.title}</p>
                          <p className="text-[11px] text-slate-500">{task.mins}</p>
                        </div>
                        <PillButton href="/dashboard/student/courses" className="!px-3 !py-1.5 !text-[11px]">
                          Start
                        </PillButton>
                      </div>
                      <div className="mt-2">
                        <ProgressBar value={task.progress} />
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Link href="/dashboard/student/courses" className="mt-3 inline-flex text-[12px] font-bold text-[#0F3DDE]">
                View All Tasks →
              </Link>
            </WhiteCard>

            <WhiteCard
              title="AI Recommended Next Skills"
              action={
                <Link href="/dashboard/student/courses" className="text-[11px] font-bold text-[#0F3DDE]">
                  View All
                </Link>
              }
            >
              <ul className="space-y-2.5">
                {NEXT_SKILLS.map((skill) => (
                  <li
                    key={skill.title}
                    className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-[#EFF6FF] to-white px-3 py-2.5 ring-1 ring-[#BFDBFE]"
                  >
                    <SoftIcon icon={Sparkles} className="h-9 w-9 bg-white text-[#0F3DDE]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-extrabold text-[#0B1F3A]">{skill.title}</p>
                      <p className="text-[11px] text-slate-500">{skill.meta}</p>
                    </div>
                    <PillButton href="/dashboard/student/courses" tone="outline" className="!px-3 !py-1.5 !text-[11px]">
                      Learn Now
                    </PillButton>
                  </li>
                ))}
              </ul>
            </WhiteCard>

            <WhiteCard
              title="AI Productivity Insights"
              action={
                <Link href="/dashboard/student/insights" className="text-[11px] font-bold text-[#0F3DDE]">
                  View Full Insights →
                </Link>
              }
            >
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-100">
                  <SoftIcon icon={Clock3} className="mb-2 h-9 w-9 bg-blue-50 text-[#0F3DDE]" />
                  <p className="text-[11px] font-semibold text-slate-500">Best Study Time</p>
                  <p className="mt-0.5 text-[13px] font-extrabold text-[#0B1F3A]">7:00 PM – 9:00 PM</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-100">
                  <SoftIcon icon={Target} className="mb-2 h-9 w-9 bg-emerald-50 text-emerald-600" />
                  <p className="text-[11px] font-semibold text-slate-500">Focus Score</p>
                  <p className="mt-0.5 text-[13px] font-extrabold text-[#0B1F3A]">88%</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-100">
                  <SoftIcon icon={Flame} className="mb-2 h-9 w-9 bg-orange-50 text-orange-600" />
                  <p className="text-[11px] font-semibold text-slate-500">Consistency Streak</p>
                  <p className="mt-0.5 text-[13px] font-extrabold text-[#0B1F3A]">18 Days</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-100">
                  <ScoreRing value={78} label="Job Ready" size={72} tone="green" />
                  <p className="mt-1 text-[11px] font-semibold text-slate-500">Predicted Job Readiness</p>
                </div>
              </div>
            </WhiteCard>
          </div>
        </div>

        {/* Bottom tip bar */}
        <section className="flex flex-col gap-3 rounded-[22px] bg-gradient-to-r from-[#0B1F3A] via-[#0F3DDE] to-[#3B82F6] p-4 text-white shadow-[0_14px_30px_rgba(15,61,222,0.28)] sm:flex-row sm:items-center sm:justify-between lg:p-5">
          <div className="flex items-start gap-3">
            <SoftIcon icon={Sparkles} className="shrink-0 bg-white/20 text-white" />
            <p className="text-[13px] font-medium leading-snug text-blue-50">
              If you complete React and SQL this week, your internship eligibility will increase from{" "}
              <span className="font-extrabold text-white">72% to 90%</span>.
            </p>
          </div>
          <PillButton href="/dashboard/student/ai-assistant" tone="white" className="shrink-0">
            Optimize My Roadmap →
          </PillButton>
        </section>

        {/* Floating Ask AI Mentor */}
        <Link
          href="/dashboard/student/ai-assistant"
          className="fixed bottom-24 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-4 py-3 text-[12px] font-bold text-white shadow-[0_12px_28px_rgba(15,61,222,0.4)] lg:bottom-8 lg:right-8"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Bot size={16} />
          </span>
          Ask AI Mentor
        </Link>
      </CollagePage>
    </StudentShell>
  );
}
