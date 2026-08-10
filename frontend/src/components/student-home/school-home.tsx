"use client";

import Link from "next/link";
import {
  BookOpen,
  Building2,
  ClipboardCheck,
  FileText,
  Flame,
  GraduationCap,
  HelpCircle,
  LineChart,
  Lightbulb,
  NotebookPen,
  Bot,
  Compass,
  ChevronRight,
  Stethoscope,
  Target,
  TrendingUp,
  Star,
} from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import {
  CarouselDots,
  GoalChip,
  RocketDecor,
  SectionHeader,
} from "@/components/student-home/shared";

/**
 * 12th Standard dashboard — mock UI at TRUE full width of the shell main pane.
 * No max-width centering column.
 */
export function SchoolHome({
  firstName,
  onChangeGoal,
}: {
  firstName: string;
  onChangeGoal: () => void;
}) {
  return (
    <div
      data-dashboard-layout="full-width"
      className="!w-full !max-w-none space-y-5 lg:space-y-6"
      style={{ width: "100%", maxWidth: "none", boxSizing: "border-box" }}
    >
      {/* Greeting row */}
      <div className="flex w-full items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[22px] font-extrabold tracking-tight text-[#0B1F3A] lg:text-[30px]">
            Hi, {firstName}! <span aria-hidden>👋</span>
          </h1>
          <p className="mt-1 text-[13px] text-slate-500 lg:text-[15px]">Keep learning. Keep growing.</p>
        </div>
        <GoalChip
          label="12th Standard"
          onClick={onChangeGoal}
          icon={<GraduationCap size={14} className="shrink-0 text-[#0F3DDE]" />}
        />
      </div>

      {/* Overall Study Progress — mock: ring + vertical metrics */}
      <section className="relative w-full overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0F3DDE] via-[#2563EB] to-[#3B82F6] p-5 text-white shadow-[0_14px_30px_rgba(15,61,222,0.28)] lg:rounded-[28px] lg:p-8">
        <RocketDecor className="pointer-events-none absolute bottom-2 right-6 opacity-90" />
        <p className="relative mb-4 font-display text-[14px] font-bold lg:text-[16px]">Overall Study Progress</p>
        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8 lg:gap-12">
          <ProgressRing
            value={72}
            size={128}
            stroke={10}
            label="Completed"
            light
            gradient={{ id: "school-ring-fw", from: "#4ADE80", to: "#38BDF8" }}
          />
          <div className="min-w-0 w-full flex-1 space-y-4 lg:space-y-5">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-[13px] font-medium lg:text-[15px]">
                <Flame size={16} className="text-orange-300" fill="currentColor" /> Study Streak
              </span>
              <span className="font-display text-[15px] font-extrabold lg:text-[18px]">18 Days</span>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-[13px] font-medium lg:text-[15px]">
                  <BookOpen size={16} className="text-emerald-200" /> Board Exam Progress
                </span>
                <span className="font-display text-[14px] font-extrabold lg:text-[16px]">68%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/25 lg:h-2.5">
                <div className="h-full w-[68%] rounded-full bg-[#4ADE80]" />
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-[13px] font-medium lg:text-[15px]">
                  <Target size={16} className="text-violet-200" /> Today&apos;s Goal
                </span>
                <span className="text-[13px] font-bold lg:text-[15px]">4 / 6 tasks completed</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/25 lg:h-2.5">
                <div className="h-full w-2/3 rounded-full bg-[#FACC15]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access — always fills width; 2 / 3 / 6 cols by viewport */}
      <section className="w-full">
        <SectionHeader title="Quick Access" href="/dashboard/student/courses" />
        <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {[
            { label: "Subjects", desc: "Explore all subjects", href: "/dashboard/student/courses", icon: BookOpen, bg: "bg-violet-100", fg: "text-violet-600" },
            { label: "Notes", desc: "Study notes & PDFs", href: "/dashboard/student/courses", icon: NotebookPen, bg: "bg-emerald-100", fg: "text-emerald-600" },
            { label: "Previous Year Papers", desc: "Past year questions", href: "/dashboard/student/previous-papers", icon: FileText, bg: "bg-blue-100", fg: "text-blue-600" },
            { label: "Mock Tests", desc: "Test your preparation", href: "/dashboard/student/mock-tests", icon: ClipboardCheck, bg: "bg-orange-100", fg: "text-orange-600" },
            { label: "Question Bank", desc: "Practice questions", href: "/dashboard/student/mock-tests", icon: HelpCircle, bg: "bg-pink-100", fg: "text-pink-600" },
            { label: "Performance", desc: "Track your progress", href: "/dashboard/student/insights", icon: LineChart, bg: "bg-indigo-100", fg: "text-indigo-600" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-[16px] bg-white p-4 text-center shadow-[0_2px_10px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className={`mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-full lg:h-14 lg:w-14 ${item.bg} ${item.fg}`}>
                  <Icon size={22} />
                </span>
                <p className="font-display text-[13px] font-bold text-[#0B1F3A]">{item.label}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{item.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* NEET + AI */}
      <div className="grid w-full gap-5 xl:grid-cols-12">
        <section className="w-full xl:col-span-7">
          <SectionHeader title="NEET & JEE Preparation" href="/dashboard/student/coaching" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "NEET Mock Tests", sub: "Practice & Improve", icon: Stethoscope, bg: "bg-emerald-100", fg: "text-emerald-600", href: "/dashboard/student/mock-tests" },
              { label: "JEE Practice Sets", sub: "Topic wise practice", icon: Compass, bg: "bg-blue-100", fg: "text-blue-600", href: "/dashboard/student/coaching" },
              { label: "Daily Quiz", sub: "Test your knowledge", icon: Lightbulb, bg: "bg-amber-100", fg: "text-amber-600", href: "/dashboard/student/mock-tests" },
              { label: "AI Doubt Solver", sub: "Get instant solutions", icon: Bot, bg: "bg-violet-100", fg: "text-violet-600", href: "/dashboard/student/ai-hub" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-[16px] bg-white p-4 text-center shadow-[0_2px_10px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ${item.bg} ${item.fg}`}>
                    <Icon size={22} />
                  </span>
                  <p className="font-display text-[12px] font-bold leading-tight text-[#0B1F3A]">{item.label}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">{item.sub}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="flex w-full items-center gap-4 overflow-hidden rounded-[18px] bg-gradient-to-r from-[#0B1F3A] to-[#1E3A8A] p-5 text-white shadow-lg xl:col-span-5">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden>
              <defs>
                <linearGradient id="aiHexFw" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.65" />
                </linearGradient>
              </defs>
              <polygon points="24,4 42,14 42,34 24,44 6,34 6,14" fill="url(#aiHexFw)" stroke="#7DD3FC" strokeWidth="1.5" />
              <text x="24" y="28" textAnchor="middle" fontSize="11" fontWeight="800" fill="#E0F2FE">
                AI
              </text>
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[15px] font-bold">AI Career Guidance</p>
            <p className="mt-1 text-[12px] leading-snug text-blue-100">
              Discover the right career based on your interests, marks, and strengths.
            </p>
          </div>
          <Link
            href="/dashboard/student/career"
            className="shrink-0 rounded-full bg-white px-4 py-2.5 text-[12px] font-bold text-[#0F3DDE]"
          >
            Explore Careers →
          </Link>
        </section>
      </div>

      {/* Colleges — full width row */}
      <div className="grid w-full gap-5 lg:grid-cols-12">
        <section className="w-full lg:col-span-4">
          <SectionHeader title="Colleges & Scholarships" href="/dashboard/student/colleges" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Link href="/dashboard/student/colleges" className="rounded-[18px] bg-[#EFF6FF] p-4 ring-1 ring-blue-100 transition hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DBEAFE] text-[#0F3DDE]">
                  <Building2 size={20} />
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F3DDE] text-white">
                  <ChevronRight size={14} />
                </span>
              </div>
              <p className="mt-3 font-display text-[13px] font-bold text-[#0B1F3A]">College Finder</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Find best colleges near you</p>
            </Link>
            <Link href="/dashboard/student/study-abroad" className="rounded-[18px] bg-[#ECFDF5] p-4 ring-1 ring-emerald-100 transition hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D]">
                  <GraduationCap size={20} />
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#16A34A] text-white">
                  <ChevronRight size={14} />
                </span>
              </div>
              <p className="mt-3 font-display text-[13px] font-bold text-[#0B1F3A]">Scholarship Opportunities</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Explore scholarships and financial aid</p>
            </Link>
          </div>
        </section>

        <section className="w-full lg:col-span-8">
          <SectionHeader title="Featured Colleges in Your District" badge="Local Promotion - Free" />
          <article className="flex w-full flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_4px_14px_rgba(15,23,42,0.07)] ring-1 ring-slate-100 lg:flex-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?w=900&q=80"
              alt="Arunai Engineering College campus"
              className="h-44 w-full object-cover lg:h-auto lg:min-h-[220px] lg:w-[40%]"
            />
            <div className="flex min-w-0 flex-1 flex-col justify-center p-5 lg:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B1F3A] text-[10px] font-black text-amber-300 ring-2 ring-amber-400/40">
                  AE
                </span>
                <div>
                  <h3 className="font-display text-[16px] font-extrabold text-[#0B1F3A] lg:text-[20px]">
                    Arunai Engineering College
                  </h3>
                  <p className="text-[12px] text-slate-500">B.E / B.Tech Courses</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["AI & DS", "CSE", "ECE", "EEE", "+3 more"].map((t) => (
                  <span key={t} className="rounded-full bg-slate-50 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-100">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4 text-[13px] font-semibold">
                  <span className="inline-flex items-center gap-1 text-emerald-600">
                    <TrendingUp size={14} /> Placement 92%
                  </span>
                  <span className="inline-flex items-center gap-1 text-amber-500">
                    <Star size={14} fill="currentColor" /> NAAC Rating A+
                  </span>
                </div>
                <Link
                  href="/dashboard/student/admissions"
                  className="rounded-full bg-[#0F3DDE] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(15,61,222,0.25)]"
                >
                  Apply Now →
                </Link>
              </div>
            </div>
          </article>
          <CarouselDots active={0} count={4} />
        </section>
      </div>
    </div>
  );
}
