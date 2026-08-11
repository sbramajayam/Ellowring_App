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

      {/* 2. Single blue metrics banner (mockup: one composition, 4 cells) */}
      <BlueHero className="!p-4 lg:!p-5">
        <div className="relative z-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6 lg:divide-x lg:divide-white/15">
          <div className="flex items-center gap-3 lg:pr-4">
            <ScoreRing value={78} size={76} tone="mixed" onDark />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-blue-100">Skill Progress</p>
              <p className="mt-0.5 font-display text-[15px] font-extrabold leading-tight">12 / 15 Skills</p>
              <p className="text-[11px] text-blue-100">78% done</p>
            </div>
          </div>
          <div className="flex items-center gap-3 lg:px-4">
            <SoftIcon icon={Briefcase} className="h-12 w-12 shrink-0 rounded-2xl bg-white/15 text-white" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-blue-100">Internships</p>
              <p className="mt-0.5 font-display text-[20px] font-extrabold leading-none">2 Active</p>
              <p className="mt-1 text-[11px] text-blue-100">0 Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-3 lg:px-4">
            <ScoreRing value={85} size={76} tone="green" onDark />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-blue-100">Profile Completion</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-[13px] font-bold">
                <UserRound size={13} /> Almost there!
              </p>
              <p className="text-[11px] text-blue-100">Complete to 100%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 lg:pl-4">
            <ScoreRing value={74} size={76} tone="blue" onDark />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-blue-100">Career Readiness Score</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-[13px] font-bold">
                <Target size={13} /> Good Going!
              </p>
              <p className="text-[11px] text-blue-100">74 / 100</p>
            </div>
          </div>
        </div>
      </BlueHero>

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

      {/* 7. Promo banner — campus/office illustration plane (mockup) */}
      <BlueHero className="!p-0 overflow-hidden">
        <div className="relative z-10 grid min-h-[160px] lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col justify-center p-5 lg:p-7">
            <h2 className="font-display text-xl font-extrabold leading-snug lg:text-[26px]">
              All Internships.
              <br />
              Provided by Ellowring.
            </h2>
            <p className="mt-2 max-w-md text-[13px] text-blue-100">
              Real projects • Real mentors • Real experience.
            </p>
            <PillButton href="/dashboard/student/internships" tone="white" className="mt-4 w-fit">
              Explore Internships →
            </PillButton>
          </div>
          <div className="relative hidden min-h-[160px] lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0F3DDE]/40 to-[#0F3DDE]" />
          </div>
        </div>
      </BlueHero>
    </DashboardPage>
  );
}
