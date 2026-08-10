"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Briefcase,
  ClipboardCheck,
  FileText,
  Flame,
  GraduationCap,
  MessageSquare,
  NotebookPen,
  Sparkles,
  Target,
  Bot,
  Building2,
  Users,
} from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { StudentDashboardFooter } from "@/components/student-dashboard-footer";
import { ProgressRing } from "@/components/ui/progress-ring";
import { MarketplaceCard } from "@/components/ui/marketplace-card";
import { SoftAreaChart } from "@/components/ui/charts";
import { useAuth } from "@/lib/auth-context";

const card =
  "rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md";

const kpis = [
  {
    label: "Courses Enrolled",
    value: "12",
    sub: "4 in progress",
    href: "/dashboard/student/courses",
    icon: BookOpen,
    tint: "bg-violet-100 text-violet-600",
  },
  {
    label: "Mock Tests Completed",
    value: "45",
    sub: "12 this month",
    href: "/dashboard/student/mock-tests",
    icon: ClipboardCheck,
    tint: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Internship Applications",
    value: "6",
    sub: "2 shortlisted",
    href: "/dashboard/student/internships",
    icon: Briefcase,
    tint: "bg-rose-100 text-rose-600",
  },
  {
    label: "Career Readiness",
    value: "78%",
    sub: "Rising steadily",
    href: "/dashboard/student/career",
    icon: Target,
    tint: "bg-blue-100 text-blue-600",
  },
  {
    label: "Upcoming Exams",
    value: "3",
    sub: "Next: NEET Bio",
    href: "/dashboard/student/mock-tests",
    icon: GraduationCap,
    tint: "bg-amber-100 text-amber-600",
  },
  {
    label: "Application Deadlines",
    value: "5",
    sub: "This week",
    href: "/dashboard/student/admissions",
    icon: Award,
    tint: "bg-orange-100 text-orange-600",
  },
];

const quickActions = [
  { label: "Mock Test", href: "/dashboard/student/mock-tests", icon: ClipboardCheck, bg: "bg-[#DBEAFE] text-[#0F3DDE]" },
  { label: "Study Material", href: "/dashboard/student/courses", icon: BookOpen, bg: "bg-[#D1FAE5] text-[#059669]" },
  { label: "Previous Year Papers", href: "/dashboard/student/previous-papers", icon: FileText, bg: "bg-[#FFEDD5] text-[#EA580C]" },
  { label: "Notes", href: "/dashboard/student/courses", icon: NotebookPen, bg: "bg-[#EDE9FE] text-[#7C3AED]" },
  { label: "AI Mentor", href: "/dashboard/student/ai-hub", icon: Bot, bg: "bg-[#EEF2FF] text-[#0F3DDE]" },
  { label: "Resume Builder", href: "/dashboard/student/ai-hub#resume", icon: FileText, bg: "bg-[#FCE7F3] text-[#DB2777]" },
  { label: "College Predictor", href: "/dashboard/student/ai-hub#college", icon: Building2, bg: "bg-[#E0F2FE] text-[#0284C7]" },
  { label: "Interview Practice", href: "/dashboard/student/ai-hub#interview", icon: MessageSquare, bg: "bg-[#FEF3C7] text-[#D97706]" },
];

const readinessTrend = [
  { name: "Jan", value: 42 },
  { name: "Feb", value: 48 },
  { name: "Mar", value: 55 },
  { name: "Apr", value: 63 },
  { name: "May", value: 71 },
  { name: "Jun", value: 78 },
];

const deadlines = [
  { title: "NIT Trichy Counselling", detail: "Admissions", due: "Aug 12" },
  { title: "NEET Biology Mock", detail: "Exam", due: "Aug 13" },
  { title: "Startup Hub Pitch", detail: "Project", due: "Aug 15" },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const firstName = useMemo(() => {
    if (!user?.name) return "Student";
    return user.name.replace(/^Mr\.?\s+/i, "").trim().split(/\s+/)[0] || "Student";
  }, [user?.name]);

  return (
    <StudentShell>
      <div className="space-y-5 p-4 lg:p-6">
        <section className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-[#EEF2FF] to-[#DBEAFE] p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <h1 className="text-[26px] font-bold tracking-tight text-slate-900 sm:text-[30px]">
                Hi {firstName} <span aria-hidden>👋</span>
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Current Goal · <span className="font-semibold text-[#0F3DDE]">Preparing for NEET 2027</span>
              </p>
              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Learn. Prepare. Build. Get Hired — your next milestone is today&apos;s mock + college shortlist review.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/80 px-4 py-3 text-center shadow-sm ring-1 ring-white">
                <ProgressRing value={78} label="Ready" />
              </div>
              <div className="rounded-2xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-white">
                <div className="flex items-center gap-2 text-[#F59E0B]">
                  <Flame size={18} fill="currentColor" />
                  <span className="text-2xl font-bold text-slate-900">21</span>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-slate-500">Day streak</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Link key={kpi.label} href={kpi.href} className={card}>
                <div className={`mb-3 inline-flex rounded-xl p-2.5 ${kpi.tint}`}>
                  <Icon size={18} />
                </div>
                <p className="text-[11px] font-medium text-slate-500">{kpi.label}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{kpi.value}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">{kpi.sub}</p>
              </Link>
            );
          })}
        </div>

        <section className={card + " !p-5"}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
            <Link href="/dashboard/student/ai-hub" className="text-sm font-semibold text-[#0F3DDE]">
              Open AI Hub
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
            {quickActions.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.label}
                  href={t.href}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-[#FAFBFC] p-3 text-center transition hover:border-blue-100 hover:bg-white hover:shadow-sm"
                >
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${t.bg}`}>
                    <Icon size={18} />
                  </span>
                  <span className="text-[11px] font-semibold leading-tight text-slate-700">{t.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <section className={card + " !p-5"}>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-[#0F3DDE]" />
                <h2 className="text-lg font-bold text-slate-900">Career Readiness Trend</h2>
              </div>
              <SoftAreaChart data={readinessTrend} />
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Recommended Marketplace</h2>
                <Link href="/dashboard/student/coaching" className="text-sm font-semibold text-[#0F3DDE]">
                  Browse all
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <MarketplaceCard
                  title="NEET Complete Coaching"
                  eyebrow="NEET"
                  rating="4.9"
                  students="18.2k"
                  duration="12 months"
                  price="₹9,999"
                  href="/dashboard/student/coaching"
                  imageGradient="from-[#059669] via-[#10B981] to-[#6EE7B7]"
                />
                <MarketplaceCard
                  title="JEE Advanced Crash Course"
                  eyebrow="JEE"
                  rating="4.8"
                  students="12.4k"
                  duration="16 weeks"
                  price="₹4,999"
                  href="/dashboard/student/coaching"
                />
                <MarketplaceCard
                  title="Interview + Resume Bootcamp"
                  eyebrow="Career"
                  rating="4.9"
                  students="6.2k"
                  duration="4 weeks"
                  price="₹1,999"
                  href="/dashboard/student/ai-hub"
                  imageGradient="from-[#DB2777] via-[#F43F5E] to-[#FB7185]"
                />
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <section className={card}>
              <h3 className="mb-3 text-sm font-bold text-slate-800">Upcoming Exams</h3>
              <ul className="space-y-3">
                {[
                  { time: "10:00 AM", title: "JEE Main - Physics" },
                  { time: "02:00 PM", title: "NEET - Biology" },
                  { time: "07:00 PM", title: "Aptitude Quant" },
                ].map((cls) => (
                  <li key={cls.title} className="rounded-xl border border-slate-100 bg-[#FAFBFC] p-3">
                    <p className="text-[11px] font-semibold text-[#0F3DDE]">{cls.time}</p>
                    <p className="text-sm font-semibold text-slate-800">{cls.title}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className={card}>
              <h3 className="mb-3 text-sm font-bold text-slate-800">Application Deadlines</h3>
              <ul className="space-y-3">
                {deadlines.map((d) => (
                  <li key={d.title} className="border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <p className="text-sm font-medium text-slate-800">{d.title}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {d.detail} · Due {d.due}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-gradient-to-br from-[#0F3DDE] to-[#2563EB] p-4 text-white shadow-lg shadow-blue-600/20"
            >
              <Users size={18} />
              <p className="mt-2 text-sm font-bold">Investor snapshot</p>
              <p className="mt-1 text-xs text-blue-100">42k+ students · 180 colleges · 96 hiring companies</p>
              <Link
                href="/#investor"
                className="mt-3 inline-flex text-xs font-semibold underline underline-offset-2"
              >
                View platform metrics
              </Link>
            </motion.section>
          </aside>
        </div>
      </div>
      <StudentDashboardFooter />
    </StudentShell>
  );
}
