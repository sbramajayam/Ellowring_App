"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Award,
  Bookmark,
  BookOpen,
  Briefcase,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  Code2,
  FileText,
  GraduationCap,
  Layers,
  MessageSquare,
  NotebookPen,
  Palette,
  Sparkles,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { StudentDashboardFooter } from "@/components/student-dashboard-footer";
import { AiRobotMascot } from "@/components/ai-robot-mascot";
import { useAuth } from "@/lib/auth-context";

const card =
  "rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-slate-100";

const kpis = [
  {
    label: "Enrolled Courses",
    value: "12",
    sub: "4 In Progress",
    subHref: "/dashboard/student/courses",
    icon: BookOpen,
    tint: "bg-violet-100 text-violet-600",
  },
  {
    label: "Mock Tests",
    value: "45",
    sub: "12 Completed",
    subHref: "/dashboard/student/mock-tests",
    icon: ClipboardCheck,
    tint: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Certificates",
    value: "8",
    sub: "View All",
    subHref: "/dashboard/student/certificates",
    icon: Award,
    tint: "bg-orange-100 text-orange-600",
    subLink: true,
  },
  {
    label: "Wallet Balance",
    value: "₹ 2,450",
    sub: "Add Money",
    subHref: "/dashboard/student/wallet",
    icon: Wallet,
    tint: "bg-blue-100 text-blue-600",
    subLink: true,
  },
  {
    label: "Job Applications",
    value: "6",
    sub: "2 Shortlisted",
    subHref: "/dashboard/student/jobs",
    icon: Briefcase,
    tint: "bg-rose-100 text-rose-600",
  },
];

const learning = [
  {
    title: "Full Stack Web Development",
    progress: 65,
    icon: Code2,
    tint: "bg-[#DBEAFE] text-[#1D4ED8]",
  },
  {
    title: "Python for Data Science",
    progress: 40,
    icon: Layers,
    tint: "bg-[#D1FAE5] text-[#047857]",
  },
  {
    title: "UI/UX Design Masterclass",
    progress: 75,
    icon: Palette,
    tint: "bg-[#FCE7F3] text-[#DB2777]",
  },
  {
    title: "Data Structures & Algorithms",
    progress: 30,
    icon: GraduationCap,
    tint: "bg-[#FEF3C7] text-[#D97706]",
  },
];

const recommended = [
  {
    title: "JEE Advanced Crash Course",
    rating: "4.8",
    students: "12.4k",
    price: "₹4,999",
    color: "bg-[#EDE9FE] text-[#6D28D9]",
    icon: GraduationCap,
  },
  {
    title: "NEET Test Series",
    rating: "4.7",
    students: "9.8k",
    price: "₹2,499",
    color: "bg-[#D1FAE5] text-[#047857]",
    icon: ClipboardCheck,
  },
  {
    title: "Interview Preparation",
    rating: "4.9",
    students: "6.2k",
    price: "₹1,999",
    color: "bg-[#FFE4E6] text-[#E11D48]",
    icon: MessageSquare,
  },
  {
    title: "Resume Building",
    rating: "4.6",
    students: "4.1k",
    price: "₹999",
    color: "bg-[#DBEAFE] text-[#1D4ED8]",
    icon: FileText,
  },
];

const upcoming = [
  { time: "10:00 AM", title: "JEE Main - Physics", teacher: "Rahul Sharma" },
  { time: "02:00 PM", title: "NEET - Biology", teacher: "Dr. Priya Nair" },
  { time: "07:00 PM", title: "Aptitude - Quant", teacher: "Arjun Reddy" },
];

const deadlines = [
  { title: "Maths Assignment", detail: "Trigonometry", due: "May 12", icon: NotebookPen, tint: "bg-rose-50 text-rose-500" },
  { title: "Biology Mock Test", detail: "NEET", due: "May 13", icon: ClipboardCheck, tint: "bg-emerald-50 text-emerald-600" },
  { title: "Project Proposal", detail: "Submission", due: "May 15", icon: Layers, tint: "bg-orange-50 text-orange-500" },
];

const quickTools = [
  { label: "Mock Test", href: "/dashboard/student/mock-tests", icon: ClipboardCheck, bg: "bg-[#DBEAFE] text-[#2563EB]" },
  { label: "Study Material", href: "/dashboard/student/courses", icon: BookOpen, bg: "bg-[#D1FAE5] text-[#059669]" },
  { label: "Previous Papers", href: "/dashboard/student/previous-papers", icon: FileText, bg: "bg-[#FFEDD5] text-[#EA580C]" },
  { label: "Notes", href: "/dashboard/student/courses", icon: NotebookPen, bg: "bg-[#EDE9FE] text-[#7C3AED]" },
  { label: "Bookmarks", href: "/dashboard/student/courses", icon: Bookmark, bg: "bg-[#FCE7F3] text-[#DB2777]" },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const firstName = useMemo(() => {
    if (!user?.name) return "Vignesh";
    return user.name.replace(/^Mr\.?\s+/i, "").trim().split(/\s+/)[0] || "Vignesh";
  }, [user?.name]);

  return (
    <StudentShell>
      <div className="grid gap-5 p-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6 lg:p-6">
        {/* MAIN */}
        <div className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-[26px] font-bold tracking-tight text-slate-900 sm:text-[28px]">
                Welcome back, {firstName}! <span aria-hidden>👋</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Continue your learning journey. You&apos;re doing great!
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm"
            >
              <CalendarDays size={15} className="text-[#3B82F6]" />
              May 08, 2025
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>

          {/* 5 KPI cards */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className={card}>
                  <div className={`mb-3 inline-flex rounded-xl p-2.5 ${kpi.tint}`}>
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <p className="text-[11px] font-medium text-slate-500">{kpi.label}</p>
                  <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{kpi.value}</p>
                  {"subLink" in kpi && kpi.subLink ? (
                    <Link href={kpi.subHref} className="mt-0.5 inline-block text-[11px] font-semibold text-[#3B82F6]">
                      {kpi.sub}
                    </Link>
                  ) : (
                    <p className="mt-0.5 text-[11px] text-slate-400">{kpi.sub}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* AI Career Assistant */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE] p-5 shadow-sm ring-1 ring-blue-100 sm:p-6">
            <div className="pointer-events-none absolute -left-8 top-0 h-32 w-32 rounded-full bg-white/50 blur-2xl" />
            <div className="pointer-events-none absolute -right-4 bottom-0 h-40 w-40 rounded-full bg-blue-300/30 blur-2xl" />

            {/* floating suggestion chips */}
            <div className="pointer-events-none absolute left-[38%] top-4 hidden rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium text-slate-600 shadow-sm ring-1 ring-blue-100 lg:block">
              Best career for me?
            </div>
            <div className="pointer-events-none absolute bottom-5 left-[42%] hidden rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium text-slate-600 shadow-sm ring-1 ring-blue-100 lg:block">
              Suggest CSE courses
            </div>

            <div className="relative grid items-center gap-4 md:grid-cols-[1fr_auto]">
              <div className="max-w-xl">
                <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                  <Sparkles size={12} /> AI Career Assistant
                </p>
                <h2 className="mt-1.5 text-lg font-bold text-slate-900 sm:text-xl">
                  Get personalized career guidance
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  Course recommendations and career roadmaps based on your interests and skills — powered by AI.
                </p>
                <Link
                  href="/dashboard/student/ai-assistant"
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#3B82F6] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 hover:bg-blue-600"
                >
                  Chat with AI Assistant →
                </Link>
              </div>

              <div className="relative mx-auto flex h-[150px] w-[150px] items-center justify-center sm:h-[170px] sm:w-[170px]">
                <AiRobotMascot className="h-full w-full drop-shadow-lg" />
              </div>
            </div>
          </section>

          {/* Continue Learning */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Continue Learning</h2>
              <Link href="/dashboard/student/courses" className="text-sm font-semibold text-[#3B82F6]">
                View All
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {learning.map((course) => {
                const Icon = course.icon;
                return (
                  <Link
                    key={course.title}
                    href="/dashboard/student/courses"
                    className="rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition hover:shadow-md"
                  >
                    <span
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${course.tint}`}
                    >
                      <Icon size={22} strokeWidth={2} />
                    </span>
                    <h3 className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-slate-800">
                      {course.title}
                    </h3>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#3B82F6]"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] font-medium text-slate-400">
                      {course.progress}% Completed
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Recommended for You */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Recommended for You</h2>
              <Link href="/dashboard/student/coaching" className="text-sm font-semibold text-[#3B82F6]">
                See more
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {recommended.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href="/dashboard/student/coaching"
                    className="rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}
                    >
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-slate-800">
                      {item.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-0.5 font-medium text-amber-500">
                        <Star size={11} fill="currentColor" /> {item.rating}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <Users size={11} /> {item.students}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-slate-900">{item.price}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <aside className="space-y-4">
          <section className={card}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Upcoming Classes</h3>
              <Link href="/dashboard/student/coaching" className="text-xs font-semibold text-[#3B82F6]">
                View All
              </Link>
            </div>
            <ul className="space-y-3">
              {upcoming.map((cls) => (
                <li
                  key={cls.title}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-[#FAFBFC] p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#3B82F6]">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {cls.time}
                    </p>
                    <p className="truncate text-sm font-semibold text-slate-800">{cls.title}</p>
                    <p className="text-xs text-slate-500">{cls.teacher}</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg bg-[#22C55E] px-3 py-1.5 text-xs font-bold text-white shadow-sm shadow-emerald-500/20 hover:bg-emerald-600"
                  >
                    Join
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className={card}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Deadlines</h3>
              <Link href="/dashboard/student/courses" className="text-xs font-semibold text-[#3B82F6]">
                View All
              </Link>
            </div>
            <ul className="space-y-3">
              {deadlines.map((d) => {
                const Icon = d.icon;
                return (
                  <li key={d.title} className="flex items-start gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${d.tint}`}>
                      <Icon size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800">{d.title}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {d.detail} · Due {d.due}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className={card}>
            <h3 className="mb-3 text-sm font-bold text-slate-800">Quick Tools</h3>
            <div className="grid grid-cols-5 gap-2">
              {quickTools.map((t) => {
                const Icon = t.icon;
                return (
                  <Link
                    key={t.label}
                    href={t.href}
                    className="flex flex-col items-center gap-1.5 text-center"
                  >
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${t.bg}`}>
                      <Icon size={16} strokeWidth={2} />
                    </span>
                    <span className="text-[9px] font-semibold leading-tight text-slate-600">
                      {t.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </aside>
      </div>

      <StudentDashboardFooter />
    </StudentShell>
  );
}
