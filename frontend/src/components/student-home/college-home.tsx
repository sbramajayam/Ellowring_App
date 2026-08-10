"use client";

import Link from "next/link";
import {
  BarChart3,
  Bot,
  Briefcase,
  Building2,
  ChevronRight,
  Compass,
  FileText,
  GraduationCap,
  Layers,
  Map,
  MessageSquare,
  Plus,
  Shield,
  Target,
  UserRound,
} from "lucide-react";
import { BrandLogo } from "@/components/student-home/brand-logo";
import {
  BlueHero,
  PillButton,
  ProgressBar,
  ScoreRing,
  SoftIcon,
  WhiteCard,
} from "@/components/student-home/collage-ui";
import { DashboardPage, QuickAccessRows, SectionHeader } from "@/components/student-home/shared";

const quickAccess = [
  {
    label: "Courses",
    desc: "Learn & upgrade in-demand skills",
    href: "/dashboard/student/courses",
    icon: GraduationCap,
    bg: "bg-blue-100",
    fg: "text-[#0F3DDE]",
  },
  {
    label: "Internships",
    desc: "Real-time internships by Ellowring",
    href: "/dashboard/student/internships",
    icon: Briefcase,
    bg: "bg-emerald-100",
    fg: "text-emerald-600",
  },
  {
    label: "Projects",
    desc: "Work on real projects & build portfolio",
    href: "/dashboard/student/projects",
    icon: Layers,
    bg: "bg-violet-100",
    fg: "text-violet-600",
  },
  {
    label: "Resume Builder",
    desc: "Create ATS friendly professional resume",
    href: "/dashboard/student/resume",
    icon: FileText,
    bg: "bg-orange-100",
    fg: "text-orange-600",
  },
  {
    label: "AI Interview Coach",
    desc: "Practice & improve with AI",
    href: "/dashboard/student/ai-assistant",
    icon: Bot,
    bg: "bg-rose-100",
    fg: "text-rose-600",
  },
  {
    label: "Jobs",
    desc: "Apply for jobs when you're ready",
    href: "/dashboard/student/jobs",
    icon: Building2,
    bg: "bg-teal-100",
    fg: "text-teal-600",
  },
];

const skills = [
  { name: "HTML", level: "Expert", tone: "bg-orange-50 text-orange-700 ring-orange-100" },
  { name: "CSS", level: "Advanced", tone: "bg-sky-50 text-sky-700 ring-sky-100" },
  { name: "JavaScript", level: "Intermediate", tone: "bg-amber-50 text-amber-800 ring-amber-100" },
  { name: "React.js", level: "Intermediate", tone: "bg-cyan-50 text-cyan-700 ring-cyan-100" },
  { name: "Node.js", level: "Beginner", tone: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
];

const resources = [
  { label: "Career Guidance", href: "/dashboard/student/career", icon: Compass, tone: "bg-blue-50 text-[#0F3DDE]" },
  { label: "Learning Roadmap", href: "/dashboard/student/learn", icon: Map, tone: "bg-emerald-50 text-emerald-600" },
  { label: "Interview Prep", href: "/dashboard/student/ai-assistant", icon: MessageSquare, tone: "bg-violet-50 text-violet-600" },
  { label: "Aptitude & Tests", href: "/dashboard/student/mock-tests", icon: BarChart3, tone: "bg-orange-50 text-orange-600" },
];

/** College / Career student home — collage screenshot fidelity */
export function CollegeHome({
  firstName,
  onChangeGoal,
}: {
  firstName: string;
  onChangeGoal: () => void;
}) {
  return (
    <DashboardPage>
      {/* 1. Greeting + Career Path */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-[22px] font-extrabold tracking-tight text-[#0B1F3A] lg:text-[28px]">
            Hi, {firstName}! <span aria-hidden>👋</span>
          </h1>
          <p className="mt-1 max-w-xl text-[13px] text-slate-500 lg:text-[15px]">
            Let&apos;s build your skills, gain real experience and get placed!
          </p>
        </div>
        <button
          type="button"
          onClick={onChangeGoal}
          className="flex w-full max-w-xs items-center gap-3 rounded-[18px] bg-white px-3.5 py-3 text-left shadow-[0_2px_14px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:w-auto"
        >
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#0F3DDE]">
            <Shield size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Your Career Path</span>
            <span className="block truncate font-display text-[14px] font-extrabold text-[#0B1F3A]">Full Stack Developer</span>
          </span>
          <ChevronRight size={16} className="shrink-0 text-slate-300" />
        </button>
      </div>

      {/* 2. Four separate blue metric cards */}
      <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
        <article className="min-w-[200px] shrink-0 rounded-[22px] bg-gradient-to-br from-[#0B1F3A] via-[#0F3DDE] to-[#3B82F6] p-4 text-white shadow-[0_14px_30px_rgba(15,61,222,0.28)] lg:min-w-0">
          <p className="text-[11px] font-semibold text-blue-100">Skill Progress</p>
          <div className="mt-2 flex items-center gap-3">
            <ScoreRing value={78} label="done" size={78} tone="mixed" onDark />
            <p className="text-[12px] font-semibold leading-snug text-blue-50">
              <span className="block font-display text-[15px] font-extrabold text-white">12/15 Skills</span>
              Keep learning!
            </p>
          </div>
        </article>

        <article className="min-w-[200px] shrink-0 rounded-[22px] bg-gradient-to-br from-[#0B1F3A] via-[#0F3DDE] to-[#3B82F6] p-4 text-white shadow-[0_14px_30px_rgba(15,61,222,0.28)] lg:min-w-0">
          <p className="text-[11px] font-semibold text-blue-100">Internships</p>
          <div className="mt-3 flex items-start gap-3">
            <SoftIcon icon={Briefcase} className="h-12 w-12 rounded-2xl bg-white/15 text-white" />
            <div>
              <p className="font-display text-[22px] font-extrabold leading-none">2 Active</p>
              <p className="mt-2 text-[12px] font-semibold text-blue-100">0 Completed</p>
            </div>
          </div>
        </article>

        <article className="min-w-[200px] shrink-0 rounded-[22px] bg-gradient-to-br from-[#0B1F3A] via-[#0F3DDE] to-[#3B82F6] p-4 text-white shadow-[0_14px_30px_rgba(15,61,222,0.28)] lg:min-w-0">
          <p className="text-[11px] font-semibold text-blue-100">Profile Completion</p>
          <div className="mt-2 flex items-center gap-3">
            <ScoreRing value={85} size={78} tone="green" onDark />
            <div>
              <p className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-50">
                <UserRound size={14} /> Almost there
              </p>
              <p className="mt-1 text-[11px] text-blue-100">Complete to 100%</p>
            </div>
          </div>
        </article>

        <article className="min-w-[200px] shrink-0 rounded-[22px] bg-gradient-to-br from-[#0B1F3A] via-[#0F3DDE] to-[#3B82F6] p-4 text-white shadow-[0_14px_30px_rgba(15,61,222,0.28)] lg:min-w-0">
          <p className="text-[11px] font-semibold text-blue-100">Career Readiness</p>
          <div className="mt-2 flex items-center gap-3">
            <ScoreRing value={74} size={78} tone="blue" onDark />
            <div>
              <p className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-50">
                <Target size={14} /> Good Going
              </p>
              <p className="mt-1 text-[11px] text-blue-100">Keep it up 💪</p>
            </div>
          </div>
        </article>
      </div>

      {/* 3. Quick Access */}
      <section>
        <SectionHeader title="Quick Access" href="/dashboard/student/courses" />
        <QuickAccessRows items={quickAccess} />
      </section>

      {/* 4. Internships | College Ads */}
      <div className="grid gap-4 lg:grid-cols-2">
        <WhiteCard
          title="Ellowring Internships"
          action={
            <Link href="/dashboard/student/internships" className="text-[12px] font-semibold text-[#0F3DDE]">
              View All Internships
            </Link>
          }
        >
          <div className="space-y-3">
            <article className="rounded-[16px] bg-[#F8FAFC] p-3.5 ring-1 ring-slate-100">
              <div className="flex items-start gap-3">
                <BrandLogo name="Ellowring" className="h-11 w-11 shrink-0" rounded="xl" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[13px] font-extrabold text-[#0B1F3A]">Full Stack Web Development Intern</h3>
                    <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[9px] font-bold text-[#0F3DDE]">Active</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Started 10 May 2025 · 3 Months</p>
                  <div className="mt-2.5">
                    <div className="mb-1 flex justify-between text-[11px] font-semibold">
                      <span className="text-slate-500">Progress</span>
                      <span className="text-[#0F3DDE]">60%</span>
                    </div>
                    <ProgressBar value={60} />
                  </div>
                  <Link
                    href="/dashboard/student/internships"
                    className="mt-2.5 inline-flex text-[12px] font-bold text-[#0F3DDE]"
                  >
                    Go to Dashboard →
                  </Link>
                </div>
              </div>
            </article>

            <article className="rounded-[16px] bg-[#F8FAFC] p-3.5 ring-1 ring-slate-100">
              <div className="flex items-start gap-3">
                <BrandLogo name="Ellowring" className="h-11 w-11 shrink-0" rounded="xl" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[13px] font-extrabold text-[#0B1F3A]">AI & Machine Learning Intern</h3>
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[9px] font-bold text-orange-600">Upcoming</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Starts 01 Jun 2025 · in 12 Days</p>
                  <Link
                    href="/dashboard/student/internships"
                    className="mt-2.5 inline-flex text-[12px] font-bold text-[#0F3DDE]"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </WhiteCard>

        <WhiteCard
          className="ring-1 ring-rose-100"
          title="College Ads"
          action={
            <Link href="/dashboard/student/colleges" className="text-[12px] font-semibold text-[#0F3DDE]">
              View All
            </Link>
          }
        >
          <div className="space-y-3">
            {[
              {
                name: "Amity University",
                program: "Online MBA",
                blurb: "Scholarships available for 2025 intake.",
                img: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80",
              },
              {
                name: "Christ University",
                program: "MCA Admissions 2025",
                blurb: "Apply now for Bangalore campus seats.",
                img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80",
              },
            ].map((ad) => (
              <article key={ad.name} className="overflow-hidden rounded-[16px] bg-white ring-1 ring-slate-100">
                <div className="relative h-24">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ad.img} alt="" className="h-full w-full object-cover" />
                  <span className="absolute left-2 top-2 rounded bg-[#0F3DDE] px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-white">
                    Sponsored
                  </span>
                </div>
                <div className="flex items-start gap-3 p-3">
                  <BrandLogo name={ad.name} className="h-10 w-10 shrink-0" rounded="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-extrabold text-[#0B1F3A]">{ad.name}</p>
                    <p className="text-[11px] font-semibold text-[#0F3DDE]">{ad.program}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{ad.blurb}</p>
                    <PillButton href="/dashboard/student/colleges" className="mt-2 !px-3 !py-1.5 !text-[11px]">
                      Know More
                    </PillButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </WhiteCard>
      </div>

      {/* 5. Skills pills */}
      <section>
        <SectionHeader title="Your Skills & Strengths" href="/dashboard/student/profile" />
        <div className="flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {skills.map((s) => (
            <div
              key={s.name}
              className={`inline-flex shrink-0 flex-col items-start rounded-[16px] bg-white px-3.5 py-2.5 shadow-sm ring-1 ${s.tone}`}
            >
              <span className="font-display text-[13px] font-extrabold text-[#0B1F3A]">{s.name}</span>
              <span className="text-[10px] font-bold opacity-80">{s.level}</span>
            </div>
          ))}
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-2 rounded-[16px] border border-dashed border-[#BFDBFE] bg-white px-3.5 py-2.5 text-[12px] font-bold text-[#0F3DDE]"
          >
            <Plus size={14} /> Add Skill
          </button>
        </div>
      </section>

      {/* 6. Career Resources */}
      <section>
        <SectionHeader title="Career Resources" />
        <div className="grid grid-cols-2 gap-2.5">
          {resources.map((r) => {
            const Icon = r.icon;
            return (
              <Link
                key={r.label}
                href={r.href}
                className="flex items-center gap-3 rounded-[18px] bg-white p-3.5 shadow-[0_2px_12px_rgba(15,23,42,0.06)] ring-1 ring-slate-100"
              >
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${r.tone}`}>
                  <Icon size={18} />
                </span>
                <span className="min-w-0 flex-1 font-display text-[13px] font-bold text-[#0B1F3A]">{r.label}</span>
                <ChevronRight size={14} className="text-slate-300" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* 7. Promo banner */}
      <BlueHero className="!p-5 lg:!p-6">
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-wide text-blue-100">Ellowring</p>
            <h2 className="mt-1 font-display text-xl font-extrabold lg:text-2xl">All Internships. Provided by Ellowring</h2>
            <p className="mt-1.5 text-[13px] text-blue-100">
              Real projects • Real mentors • Real experience. Build your career with us.
            </p>
            <PillButton href="/dashboard/student/internships" tone="white" className="mt-4">
              Explore Internships →
            </PillButton>
          </div>
          <div className="hidden shrink-0 items-center gap-2 rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15 sm:flex">
            <SoftIcon icon={Briefcase} className="bg-white/20 text-white" />
            <SoftIcon icon={GraduationCap} className="bg-white/20 text-white" />
            <SoftIcon icon={Target} className="bg-white/20 text-white" />
          </div>
        </div>
      </BlueHero>
    </DashboardPage>
  );
}
