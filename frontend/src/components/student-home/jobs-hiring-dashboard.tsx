"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Bell,
  Briefcase,
  Building2,
  CheckCircle2,
  Circle,
  Lightbulb,
  MapPin,
  Mic,
  Sparkles,
} from "lucide-react";
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

const PIPELINE = [
  { label: "Resume Submitted", status: "done" as const },
  { label: "AI Screening", status: "done" as const },
  { label: "Shortlisted", status: "active" as const },
  { label: "Interview", status: "upcoming" as const },
  { label: "Offer", status: "upcoming" as const },
  { label: "Hired", status: "upcoming" as const },
];

const FEATURED_JOBS = [
  {
    company: "Zoho",
    role: "Junior Full Stack Developer",
    loc: "Chennai",
    salary: "₹5.5–7 LPA",
    tags: ["React", "Java", "SQL"],
    match: 94,
  },
  {
    company: "Freshworks",
    role: "Associate Software Engineer",
    loc: "Bangalore",
    salary: "₹6–8 LPA",
    tags: ["JS", "Node", "APIs"],
    match: 89,
  },
  {
    company: "TCS",
    role: "Digital Cadre – Full Stack",
    loc: "Pan India",
    salary: "₹3.6–4.2 LPA",
    tags: ["Java", "React", "Cloud"],
    match: 82,
  },
];

const CAMPUS = [
  { company: "Infosys", title: "Infosys Springboard Drive 2026", elig: "BE / B.Tech / MCA", date: "22 Aug" },
  { company: "Accenture", title: "Associate Software Engineer Hiring", elig: "Any Graduate 2025–26", date: "05 Sep" },
  { company: "Wipro", title: "Elite NTH Off Campus", elig: "BE / B.Tech / M.Sc", date: "14 Sep" },
];

const SKILL_MATCH = [
  { name: "React / Next.js", value: 88 },
  { name: "JavaScript / TS", value: 84 },
  { name: "Node & REST APIs", value: 71 },
  { name: "SQL / MongoDB", value: 62 },
  { name: "DSA Essentials", value: 55 },
];

const READINESS = [
  { label: "Resume ATS score ≥ 85", done: true },
  { label: "Portfolio with 2 live demos", done: true },
  { label: "Mock interview (AI Coach)", done: false },
  { label: "GitHub activity this month", done: true },
  { label: "Campus drive registration", done: false },
];

const NEXT_STEPS = [
  { title: "Apply to Zoho Jr Full Stack", meta: "High match · closes in 4 days", href: "/dashboard/student/jobs" },
  { title: "Polish projects on resume", meta: "AI suggests 3 bullet upgrades", href: "/dashboard/student/resume" },
  { title: "Practice system design basics", meta: "Career Copilot session · 25 min", href: "/dashboard/student/ai-assistant" },
  { title: "Register Infosys campus drive", meta: "Eligibility matches · 22 Aug", href: "/dashboard/student/jobs" },
];

const ALERTS = [
  { title: "Zoho opened Chennai fresher roles", time: "2h ago", tone: "new" as const },
  { title: "TCS Ninja assessment reminder", time: "Yesterday", tone: "warn" as const },
  { title: "3 new internships match your skills", time: "2d ago", tone: "info" as const },
  { title: "Freshworks ASE deadline in 5 days", time: "3d ago", tone: "info" as const },
];

export function JobsHiringCollage({ footer }: { footer?: ReactNode }) {
  return (
    <CollagePage>
      <CollageTitle
        title="Jobs & Hiring Dashboard"
        subtitle="AI matched opportunities for Vignesh · Junior Full Stack track"
        icon={Briefcase}
        action={<AiAssistantChip href="/dashboard/student/ai-assistant" />}
      />

      <BlueHero>
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-100">
              AI Job Match Score
            </p>
            <h2 className="mt-1 font-display text-xl font-extrabold lg:text-2xl">Excellent Match · 91%</h2>
            <p className="mt-1.5 text-[13px] text-blue-100">
              Recommended Role:{" "}
              <span className="font-bold text-white">Junior Full Stack Developer</span>
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:max-w-xl">
              {[
                { label: "Experience", value: "Fresher" },
                { label: "Location", value: "Bangalore / Chennai" },
                { label: "Salary", value: "₹4.5–6.5 LPA" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-white/10 px-3 py-2.5">
                  <p className="text-[10px] font-medium text-blue-100">{s.label}</p>
                  <p className="mt-0.5 text-[13px] font-bold">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <PillButton href="/dashboard/student/resume" tone="white">
                Apply with AI Resume
              </PillButton>
              <PillButton
                href="/dashboard/student/jobs"
                tone="outline"
                className="!bg-white/10 !text-white !ring-white/40"
              >
                Browse Matches
              </PillButton>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-1 self-center rounded-2xl bg-white/10 px-6 py-5">
            <ScoreRing value={91} label="Match Score" size={112} tone="mixed" onDark percent />
            <p className="text-[11px] font-semibold text-emerald-200">Excellent Match</p>
          </div>
        </div>
      </BlueHero>

      <WhiteCard title="Hiring Pipeline">
        <div className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:gap-2 lg:overflow-visible">
          {PIPELINE.map((step, i) => (
            <div key={step.label} className="flex min-w-0 flex-1 items-center gap-1 lg:gap-2">
              <div
                className={`flex w-full min-w-[96px] flex-col items-center rounded-2xl px-2 py-3 text-center lg:min-w-0 ${
                  step.status === "done"
                    ? "bg-emerald-50 ring-1 ring-emerald-100"
                    : step.status === "active"
                      ? "bg-[#EFF6FF] ring-1 ring-[#BFDBFE] shadow-[0_4px_12px_rgba(15,61,222,0.12)]"
                      : "bg-slate-50"
                }`}
              >
                {step.status === "done" ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : step.status === "active" ? (
                  <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#0F3DDE] text-[9px] font-bold text-white">
                    {i + 1}
                  </span>
                ) : (
                  <Circle size={18} className="text-slate-300" />
                )}
                <p
                  className={`mt-1.5 text-[10px] font-bold leading-tight lg:text-[11px] ${
                    step.status !== "upcoming" ? "text-[#0B1F3A]" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {i < PIPELINE.length - 1 ? (
                <span
                  className={`hidden h-0.5 w-3 shrink-0 lg:block ${
                    step.status === "done" ? "bg-emerald-300" : "bg-slate-200"
                  }`}
                />
              ) : null}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-slate-500">
          Current stage: <span className="font-bold text-[#0F3DDE]">Shortlisted</span> · prepare
          interview via AI Coach.
        </p>
      </WhiteCard>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[1.05fr_0.95fr]">
        <WhiteCard
          title="Featured Ellowring Opportunities"
          action={
            <Link href="/dashboard/student/jobs" className="text-[12px] font-bold text-[#0F3DDE]">
              See all
            </Link>
          }
        >
          <ul className="space-y-2.5">
            {FEATURED_JOBS.map((job) => (
              <li key={job.company + job.role} className="rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-100">
                <div className="flex items-start gap-3">
                  <SoftIcon icon={Building2} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[13px] font-extrabold text-[#0B1F3A]">{job.role}</h3>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        {job.match}% match
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {job.company} · <MapPin size={10} className="inline" /> {job.loc} · {job.salary}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {job.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <PillButton href="/dashboard/student/jobs" className="mt-3 w-full !py-2">
                  Apply Now
                </PillButton>
              </li>
            ))}
          </ul>
        </WhiteCard>

        <WhiteCard
          title="Campus Recruitment"
          action={
            <Link href="/dashboard/student/calendar" className="text-[12px] font-bold text-[#0F3DDE]">
              Calendar
            </Link>
          }
        >
          <ul className="space-y-2.5">
            {CAMPUS.map((drive) => (
              <li key={drive.title} className="rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-100">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-bold text-[#0F3DDE]">{drive.company}</p>
                    <h3 className="mt-0.5 text-[13px] font-extrabold text-[#0B1F3A]">{drive.title}</h3>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {drive.elig} · Drive {drive.date}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-bold text-[#0F3DDE]">
                    Open
                  </span>
                </div>
                <PillButton href="/dashboard/student/jobs" tone="outline" className="mt-3 w-full !py-2">
                  Register
                </PillButton>
              </li>
            ))}
          </ul>
        </WhiteCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <WhiteCard title="AI Skill Match Analysis">
          <div className="space-y-3.5">
            {SKILL_MATCH.map((s) => (
              <div key={s.name}>
                <div className="mb-1 flex items-center justify-between text-[12px]">
                  <span className="font-bold text-[#0B1F3A]">{s.name}</span>
                  <span className="font-semibold text-slate-500">{s.value}%</span>
                </div>
                <ProgressBar value={s.value} color={s.value >= 80 ? "bg-emerald-500" : "bg-[#0F3DDE]"} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2.5 rounded-2xl bg-[#EFF6FF] p-3.5 ring-1 ring-[#BFDBFE]">
            <Lightbulb size={18} className="mt-0.5 shrink-0 text-[#0F3DDE]" />
            <div>
              <p className="text-[12px] font-extrabold text-[#0B1F3A]">AI Tip</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">
                Lift DSA Essentials to 70%+ this week — unlocks 24 extra Full Stack openings in your
                match pool.
              </p>
            </div>
          </div>
        </WhiteCard>

        <WhiteCard title="Interview & Placement Readiness" className="text-[#0B1F3A]">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center">
              <ScoreRing value={86} label="Ready" size={104} tone="blue" percent />
              <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#0F3DDE]">
                <Mic size={12} /> Interview ready
              </p>
            </div>
            <ul className="w-full space-y-2">
              {READINESS.map((item) => (
                <li key={item.label} className="flex items-start gap-2 text-[12px]">
                  {item.done ? (
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle size={15} className="mt-0.5 shrink-0 text-slate-300" />
                  )}
                  <span className={item.done ? "font-semibold text-slate-700" : "font-medium text-slate-500"}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <PillButton href="/dashboard/student/ai-assistant" tone="outline" className="mt-4 w-full !py-2">
            Open AI Interview Coach
          </PillButton>
        </WhiteCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <WhiteCard title="AI Recommended Next Steps">
          <div className="grid gap-2.5 sm:grid-cols-2">
            {NEXT_STEPS.map((step, i) => (
              <Link
                key={step.title}
                href={step.href}
                className="flex flex-col rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-100 transition hover:bg-[#EFF6FF]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F3DDE] text-[11px] font-extrabold text-white">
                  {i + 1}
                </span>
                <p className="mt-2 text-[13px] font-extrabold text-[#0B1F3A]">{step.title}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{step.meta}</p>
              </Link>
            ))}
          </div>
        </WhiteCard>

        <WhiteCard
          title="Recent Job Alerts"
          action={
            <Link href="/dashboard/student/notifications" className="text-[12px] font-bold text-[#0F3DDE]">
              Inbox
            </Link>
          }
        >
          <ul className="space-y-2.5">
            {ALERTS.map((a) => (
              <li
                key={a.title}
                className="flex items-start gap-3 rounded-xl bg-slate-50 px-3 py-3 ring-1 ring-slate-100"
              >
                <SoftIcon
                  icon={Bell}
                  className={
                    a.tone === "warn"
                      ? "bg-amber-50 text-amber-600"
                      : a.tone === "new"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-blue-50 text-[#0F3DDE]"
                  }
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-[#0B1F3A]">{a.title}</p>
                  <p className="text-[11px] text-slate-500">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </WhiteCard>
      </div>

      <section className="flex flex-col gap-3 rounded-[22px] bg-white p-4 shadow-[0_2px_14px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between lg:p-5">
        <div className="flex items-start gap-3">
          <SoftIcon icon={Sparkles} className="bg-[#0F3DDE] text-white" />
          <div>
            <h3 className="font-display text-[15px] font-extrabold text-[#0B1F3A]">Need help applying?</h3>
            <p className="mt-0.5 text-[12px] text-slate-500">
              Sync your AI Resume and let Career Copilot sequence applications for you.
            </p>
          </div>
        </div>
        <PillButton href="/dashboard/student/career">Open Career Copilot</PillButton>
      </section>

      {footer}
    </CollagePage>
  );
}
