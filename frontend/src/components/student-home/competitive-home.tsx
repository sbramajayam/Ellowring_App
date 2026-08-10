"use client";

import Link from "next/link";
import {
  BookOpen,
  Bot,
  Building2,
  ClipboardCheck,
  Clock3,
  FileText,
  Flame,
  Landmark,
  Newspaper,
  Scale,
  Shield,
  Train,
  Zap,
  CalendarDays,
} from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import {
  CarouselDots,
  DashboardPage,
  GoalChip,
  SectionHeader,
} from "@/components/student-home/shared";

const examCats = [
  { label: "TNPSC", desc: "State PSC", href: "/dashboard/student/coaching?track=competitive", icon: Landmark, card: "bg-emerald-50", iconBg: "bg-emerald-600" },
  { label: "UPSC", desc: "Civil Services", href: "/dashboard/student/coaching?track=competitive", icon: Scale, card: "bg-violet-50", iconBg: "bg-violet-600" },
  { label: "SSC", desc: "Staff Selection", href: "/dashboard/student/coaching?track=competitive", icon: Building2, card: "bg-orange-50", iconBg: "bg-orange-500" },
  { label: "Banking", desc: "IBPS · SBI", href: "/dashboard/student/coaching?track=competitive", icon: Landmark, card: "bg-sky-50", iconBg: "bg-sky-600" },
  { label: "Railway", desc: "RRB exams", href: "/dashboard/student/coaching?track=competitive", icon: Train, card: "bg-rose-50", iconBg: "bg-rose-500" },
  { label: "Police & Defence", desc: "Force exams", href: "/dashboard/student/coaching?track=competitive", icon: Shield, card: "bg-teal-50", iconBg: "bg-teal-600" },
  { label: "Other State Exams", desc: "All states", href: "/dashboard/student/coaching?track=competitive", icon: Landmark, card: "bg-amber-50", iconBg: "bg-amber-500" },
];

const quickAccess = [
  { label: "Mock Tests", desc: "Take tests & improve", href: "/dashboard/student/mock-tests", icon: ClipboardCheck, bg: "bg-emerald-100", fg: "text-emerald-600" },
  { label: "PYQ Papers", desc: "Previous year questions", href: "/dashboard/student/previous-papers", icon: FileText, bg: "bg-violet-100", fg: "text-violet-600" },
  { label: "Current Affairs", desc: "Daily updates & news", href: "/dashboard/student/courses", icon: Newspaper, bg: "bg-orange-100", fg: "text-orange-600" },
  { label: "Quiz Practice", desc: "Test your knowledge", href: "/dashboard/student/mock-tests", icon: Zap, bg: "bg-pink-100", fg: "text-pink-600" },
  { label: "Study Material", desc: "Notes, PDFs & eBooks", href: "/dashboard/student/study-material", icon: BookOpen, bg: "bg-blue-100", fg: "text-blue-600" },
  { label: "AI Doubt Solver", desc: "Get instant AI solutions", href: "/dashboard/student/ai-assistant", icon: Bot, bg: "bg-teal-100", fg: "text-teal-600" },
];

const plan = [
  { time: "09:00 AM", topic: "Indian Polity", detail: "Fundamental Rights", status: "Completed" as const },
  { time: "11:00 AM", topic: "Aptitude", detail: "Simplification", status: "In Progress" as const },
  { time: "02:00 PM", topic: "Economy", detail: "Indian Economy basics", status: "Pending" as const },
  { time: "04:00 PM", topic: "Mock Test", detail: "Full length practice", status: "Pending" as const },
];

const topics = [
  { name: "Polity", pct: 80, color: "bg-emerald-500" },
  { name: "History", pct: 65, color: "bg-violet-500" },
  { name: "Geography", pct: 70, color: "bg-amber-400" },
  { name: "Economy", pct: 55, color: "bg-[#0F3DDE]" },
  { name: "Current Affairs", pct: 75, color: "bg-teal-400" },
];

/** Screenshot 1 — TNPSC / Competitive exam student home */
export function CompetitiveHome({
  firstName,
  onChangeGoal,
}: {
  firstName: string;
  onChangeGoal: () => void;
}) {
  return (
    <DashboardPage>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[22px] font-extrabold tracking-tight text-[#0B1F3A] lg:text-[28px]">
            Hi, {firstName}! <span aria-hidden>👋</span>
          </h1>
          <p className="mt-1 text-[13px] text-slate-500 lg:text-[15px]">Stay consistent, Success is closer than you think!</p>
        </div>
        <div className="text-right">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-slate-400">Current Goal</p>
          <GoalChip label="TNPSC Group 2" icon={<span aria-hidden>🎯</span>} onClick={onChangeGoal} />
        </div>
      </div>

      {/* Exam countdown hero — full width */}
      <section className="overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0F3DDE] to-[#2563EB] p-5 text-white shadow-[0_14px_30px_rgba(15,61,222,0.32)] lg:rounded-[28px] lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[16px] font-extrabold lg:text-[22px]">TNPSC Group 2 Exam</h2>
            <p className="mt-0.5 text-[11px] text-blue-100 lg:text-[13px]">Exam Date: 14 Sep 2025</p>
            <div className="mt-4 grid max-w-md grid-cols-4 gap-2 lg:max-w-lg lg:gap-3">
              {[
                ["78", "Days"],
                ["12", "Hours"],
                ["34", "Mins"],
                ["59", "Secs"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-[12px] bg-white px-1 py-3 text-center text-[#0B1F3A] shadow-sm lg:rounded-[14px] lg:py-4">
                  <p className="font-display text-[18px] font-extrabold leading-none lg:text-[24px]">{v}</p>
                  <p className="mt-1 text-[8px] font-bold uppercase tracking-wide text-slate-500 lg:text-[10px]">{l}</p>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard/student/coaching"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2.5 text-[12px] font-bold ring-1 ring-white/30 backdrop-blur-sm"
            >
              <CalendarDays size={14} /> View Exam Details
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 lg:w-[280px] lg:shrink-0 lg:grid-cols-1 lg:gap-3">
            {[
              { icon: Flame, label: "Study Streak", value: "18 Days", iconClass: "text-orange-300", fill: true },
              { icon: ClipboardCheck, label: "Tests Taken", value: "42 Tests", iconClass: "text-sky-200" },
              { icon: Clock3, label: "Hours Studied", value: "126 Hours", iconClass: "text-emerald-200" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-xl bg-white/10 px-3 py-2.5 ring-1 ring-white/15">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={`shrink-0 ${s.iconClass}`} fill={s.fill ? "currentColor" : "none"} />
                    <div>
                      <p className="text-[9px] text-blue-100 lg:text-[11px]">{s.label}</p>
                      <p className="font-display text-[13px] font-extrabold leading-tight lg:text-[16px]">{s.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-[14px] bg-white/10 p-3 ring-1 ring-white/15">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex justify-between text-[12px] font-semibold">
              <span>Syllabus Completion</span>
              <span>68%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/25">
              <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-emerald-400 to-sky-300" />
            </div>
            <p className="mt-1.5 text-[11px] text-blue-100">34 / 50 Topics Completed</p>
          </div>
          <ProgressRing
            value={68}
            size={58}
            stroke={5}
            light
            gradient={{ id: "syllabus-ring", from: "#4ADE80", to: "#38BDF8" }}
            center={<ClipboardCheck size={18} className="text-white" />}
          />
        </div>
      </section>

      {/* Popular Exam Categories */}
      <section>
        <SectionHeader title="Popular Exam Categories" href="/dashboard/student/coaching" />
        <div className="flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {examCats.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.label}
                href={c.href}
                className={`flex min-w-[92px] flex-col items-center gap-2 rounded-[16px] p-3 transition hover:-translate-y-0.5 ${c.card}`}
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-full text-white ${c.iconBg}`}>
                  <Icon size={20} />
                </span>
                <span className="text-center text-[11px] font-extrabold leading-tight text-slate-800">{c.label}</span>
                <span className="text-center text-[9px] text-slate-500">{c.desc}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Access — 2→3→6 cols full page */}
      <section>
        <SectionHeader title="Quick Access" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {quickAccess.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-[16px] bg-white p-3.5 text-center shadow-[0_2px_10px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md lg:p-4"
              >
                <span className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full lg:h-14 lg:w-14 ${item.bg} ${item.fg}`}>
                  <Icon size={22} />
                </span>
                <p className="font-display text-[12px] font-bold text-[#0B1F3A]">{item.label}</p>
                <p className="mt-0.5 text-[9px] leading-snug text-slate-500 lg:text-[11px]">{item.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Study plan + Performance */}
      <div className="grid gap-3 lg:grid-cols-2">
        <section className="rounded-[18px] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[14px] font-extrabold text-[#0B1F3A]">Today&apos;s Study Plan</h3>
            <Link href="/dashboard/student/ai-hub#planner" className="text-[11px] font-semibold text-[#0F3DDE]">
              View Plan
            </Link>
          </div>
          <ul className="relative space-y-0">
            {plan.map((p, i) => (
              <li key={p.time} className="relative flex gap-3 pb-3 last:pb-0">
                {i < plan.length - 1 ? (
                  <span className="absolute left-[5px] top-3 h-[calc(100%-4px)] w-px bg-slate-200" aria-hidden />
                ) : null}
                <span
                  className={`relative z-[1] mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white ${
                    p.status === "Completed"
                      ? "bg-emerald-500"
                      : p.status === "In Progress"
                        ? "bg-[#0F3DDE]"
                        : "bg-slate-300"
                  }`}
                />
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xl bg-[#F8FAFC] px-3 py-2">
                  <div>
                    <p className="text-[10px] font-bold text-[#0F3DDE]">{p.time}</p>
                    <p className="text-[12px] font-bold text-slate-800">{p.topic}</p>
                    <p className="text-[10px] text-slate-400">{p.detail}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      p.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700"
                        : p.status === "In Progress"
                          ? "bg-blue-50 text-[#0F3DDE]"
                          : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/student/ai-hub#planner"
            className="mt-3 flex w-full items-center justify-center rounded-full bg-[#EFF6FF] py-2.5 text-[12px] font-bold text-[#0F3DDE]"
          >
            View Full Study Plan →
          </Link>
        </section>

        <section className="rounded-[18px] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[14px] font-extrabold text-[#0B1F3A]">Performance Analytics</h3>
            <span className="text-[11px] font-semibold text-slate-400">This Week ▾</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-emerald-50 p-3">
              <p className="text-[10px] font-semibold text-emerald-700">Accuracy</p>
              <p className="text-lg font-extrabold text-slate-900">72%</p>
              <p className="text-[9px] font-bold text-emerald-600">↑ 8% from last week</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3">
              <p className="text-[10px] font-semibold text-[#0F3DDE]">Average Score</p>
              <p className="text-lg font-extrabold text-slate-900">64/100</p>
              <p className="text-[9px] font-bold text-emerald-600">↑ 10 pts from last week</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[12px] font-bold text-slate-800">Topic Wise Progress</p>
            <Link href="/dashboard/student/insights" className="text-[10px] font-semibold text-[#0F3DDE]">
              View All
            </Link>
          </div>
          <ul className="mt-2 space-y-2">
            {topics.map((t) => (
              <li key={t.name}>
                <div className="mb-1 flex justify-between text-[11px]">
                  <span className="font-medium text-slate-600">{t.name}</span>
                  <span className="font-bold text-slate-800">{t.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${t.color}`} style={{ width: `${t.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Sponsored colleges — blue Apply Now per latest mock */}
      <section>
        <SectionHeader title="Sponsored Colleges & Universities" href="/dashboard/student/colleges" />
        <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            {
              name: "SRM Institute of Science & Technology",
              loc: "Chennai, Tamil Nadu",
              courses: "Engineering | MBA | Law",
              img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80",
            },
            {
              name: "VIT University",
              loc: "Vellore, Tamil Nadu",
              courses: "B.Tech | MBA | M.Sc",
              img: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80",
            },
            {
              name: "Christ University",
              loc: "Bengaluru, Karnataka",
              courses: "Arts | Commerce | Law",
              img: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=80",
            },
            {
              name: "Amity University",
              loc: "Noida, Uttar Pradesh",
              courses: "Engineering | Management",
              img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
            },
          ].map((c) => (
            <article
              key={c.name}
              className="min-w-[220px] overflow-hidden rounded-[18px] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.06)] ring-1 ring-slate-100"
            >
              <div className="relative h-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt="" className="h-full w-full object-cover" />
                <span className="absolute left-2 top-2 rounded bg-[#0F3DDE] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-white">
                  Sponsored
                </span>
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-[13px] font-extrabold leading-snug text-[#0B1F3A]">{c.name}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{c.loc}</p>
                <p className="mt-1 text-[10px] text-slate-400">{c.courses}</p>
                <Link
                  href="/dashboard/student/admissions"
                  className="mt-3 flex w-full items-center justify-center rounded-full bg-[#0F3DDE] py-2 text-[12px] font-bold text-white"
                >
                  Apply Now →
                </Link>
              </div>
            </article>
          ))}
        </div>
        <CarouselDots active={0} count={4} />
      </section>
    </DashboardPage>
  );
}
