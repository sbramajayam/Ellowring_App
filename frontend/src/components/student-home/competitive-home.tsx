"use client";

import Link from "next/link";
import {
  BookOpen,
  Bot,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileText,
  Heart,
  Landmark,
  Newspaper,
  Shield,
  Target,
  TrendingUp,
  Trophy,
  Tv,
  Zap,
} from "lucide-react";
import { BrandLogo } from "@/components/student-home/brand-logo";
import {
  BlueHero,
  FilterChips,
  PillButton,
  ProgressBar,
  ScoreRing,
  SoftIcon,
  WhiteCard,
} from "@/components/student-home/collage-ui";
import { CarouselDots, DashboardPage, SectionHeader } from "@/components/student-home/shared";
import { useState } from "react";

const EXAM_CHIPS = [
  { id: "tnpsc", label: "TNPSC" },
  { id: "upsc", label: "UPSC" },
  { id: "ssc", label: "SSC" },
  { id: "banking", label: "Banking" },
  { id: "railway", label: "Railway" },
  { id: "police", label: "Police" },
  { id: "defence", label: "Defence" },
  { id: "other", label: "Other" },
];

const BANNER_STATS = [
  { label: "25+ Exams", icon: Landmark },
  { label: "10K+ Mock", icon: ClipboardCheck },
  { label: "5000+ Materials", icon: BookOpen },
  { label: "100+ Live", icon: Tv },
];

const FEATURES = [
  {
    title: "Daily Current Affairs",
    tone: "from-blue-50 to-white",
    accent: "text-[#0F3DDE]",
    iconBg: "bg-blue-100 text-[#0F3DDE]",
    icon: Newspaper,
    body: (
      <>
        <p className="text-[11px] font-bold text-slate-500">8 May 2025</p>
        <ul className="mt-2 space-y-1 text-[12px] text-slate-600">
          <li>• India-EU trade corridor update</li>
          <li>• RBI policy repo rate hold</li>
          <li>• TNPSC Group 2 syllabus revision</li>
        </ul>
      </>
    ),
    cta: "Read Now →",
    href: "/dashboard/student/courses",
    btn: "primary" as const,
  },
  {
    title: "Mock Test Leaderboard",
    tone: "from-emerald-50 to-white",
    accent: "text-emerald-700",
    iconBg: "bg-emerald-100 text-emerald-600",
    icon: Trophy,
    body: (
      <ul className="mt-1 space-y-1.5 text-[12px]">
        {[
          ["1", "Aravind S.", "96"],
          ["2", "Priya R.", "91"],
          ["3", "Vignesh P.", "88"],
        ].map(([r, n, s]) => (
          <li key={r} className="flex items-center justify-between gap-2">
            <span className="font-semibold text-slate-700">
              #{r} {n}
            </span>
            <span className="font-extrabold text-emerald-700">{s}</span>
          </li>
        ))}
      </ul>
    ),
    cta: "Take Mock Test >",
    href: "/dashboard/student/mock-tests",
    btn: "primary" as const,
  },
  {
    title: "Live Classes",
    tone: "from-violet-50 to-white",
    accent: "text-violet-700",
    iconBg: "bg-violet-100 text-violet-600",
    icon: Tv,
    body: (
      <>
        <p className="mt-1 text-[13px] font-extrabold text-[#0B1F3A]">Indian Polity By Expert Faculty</p>
        <p className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-violet-700">
          <Clock3 size={12} /> 07:00 PM Tonight
        </p>
      </>
    ),
    cta: "Join Live Class >",
    href: "/dashboard/student/coaching",
    btn: "primary" as const,
  },
  {
    title: "PYQ Collections",
    tone: "from-orange-50 to-white",
    accent: "text-orange-700",
    iconBg: "bg-orange-100 text-orange-600",
    icon: FileText,
    body: (
      <p className="mt-2 font-display text-[22px] font-extrabold leading-none text-[#0B1F3A]">
        12,500+
        <span className="mt-1 block text-[12px] font-semibold text-slate-500">Previous Year Questions</span>
      </p>
    ),
    cta: "Practice Now >",
    href: "/dashboard/student/previous-papers",
    btn: "primary" as const,
  },
  {
    title: "AI Study Planner",
    tone: "from-teal-50 to-white",
    accent: "text-teal-700",
    iconBg: "bg-teal-100 text-teal-600",
    icon: Bot,
    body: (
      <p className="mt-2 text-[13px] font-semibold leading-snug text-slate-600">
        Your AI Plan Optimized for <span className="font-extrabold text-[#0B1F3A]">TNPSC Group 2</span>
      </p>
    ),
    cta: "View Study Plan >",
    href: "/dashboard/student/ai-hub",
    btn: "primary" as const,
  },
  {
    title: "Performance Insights",
    tone: "from-amber-50 to-white",
    accent: "text-amber-700",
    iconBg: "bg-amber-100 text-amber-600",
    icon: TrendingUp,
    body: (
      <div className="mt-2 flex items-center gap-3">
        <ScoreRing value={72} size={64} tone="green" />
        <ul className="space-y-0.5 text-[11px] text-slate-600">
          <li>Accuracy 78%</li>
          <li>Speed 71%</li>
          <li>Consistency 84%</li>
          <li>Attempted 42</li>
        </ul>
      </div>
    ),
    cta: "View Analytics",
    href: "/dashboard/student/insights",
    btn: "outline" as const,
  },
];

const UNIVERSITIES = [
  {
    name: "Bharathidasan University",
    loc: "Tiruchirappalli, TN",
    tags: "UGC | NAAC A+",
    blurb: "Govt exam aspirant coaching + degree path.",
    img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80",
  },
  {
    name: "Madurai Kamaraj University",
    loc: "Madurai, TN",
    tags: "UGC | NAAC A++",
    blurb: "Distance programs for working aspirants.",
    img: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80",
  },
  {
    name: "Alagappa University",
    loc: "Karaikudi, TN",
    tags: "UGC | Distance+",
    blurb: "Flexible schedules for TNPSC preparation.",
    img: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=80",
  },
  {
    name: "Periyar University",
    loc: "Salem, TN",
    tags: "UGC | NAAC A",
    blurb: "Sponsored packs for Group 2 aspirants.",
    img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
  },
];

/** TNPSC / Competitive exam student home — collage screenshot fidelity */
export function CompetitiveHome({
  firstName,
  onChangeGoal,
}: {
  firstName: string;
  onChangeGoal: () => void;
}) {
  const [exam, setExam] = useState("tnpsc");

  return (
    <DashboardPage>
      {/* 1. Greeting + Current Goal */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-[22px] font-extrabold tracking-tight text-[#0B1F3A] lg:text-[28px]">
            Hi, {firstName}! <span aria-hidden>👋</span>
          </h1>
          <p className="mt-1 text-[13px] text-slate-500 lg:text-[15px]">
            Crack your dream government job with Ellowring.
          </p>
        </div>
        <button
          type="button"
          onClick={onChangeGoal}
          className="w-full max-w-xs rounded-[18px] bg-gradient-to-br from-[#0B1F3A] via-[#0F3DDE] to-[#3B82F6] p-3.5 text-left text-white shadow-[0_12px_28px_rgba(15,61,222,0.28)] sm:w-auto"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <Target size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-blue-100">Current Goal</span>
              <span className="block font-display text-[14px] font-extrabold">TNPSC Group 2</span>
            </span>
            <ChevronRight size={16} className="shrink-0 text-blue-100" />
          </div>
          <div className="mt-2.5">
            <div className="mb-1 flex justify-between text-[11px] font-semibold">
              <span className="text-blue-100">Progress</span>
              <span>68% Completed</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-sky-300 to-emerald-400" />
            </div>
          </div>
        </button>
      </div>

      {/* 2. Exam chips */}
      <FilterChips items={EXAM_CHIPS} value={exam} onChange={setExam} />

      {/* 3. Govt Exam Preparation banner */}
      <BlueHero>
        <div className="pointer-events-none absolute bottom-0 right-4 top-4 hidden opacity-20 lg:block">
          <Landmark size={140} strokeWidth={1} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-extrabold lg:text-2xl">Government Exam Preparation</h2>
              <p className="mt-1 text-[13px] text-blue-100">Plan • Practice • Perform • Succeed</p>
            </div>
            <SoftIcon icon={Landmark} className="hidden h-14 w-14 rounded-2xl bg-white/15 text-white sm:inline-flex" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {BANNER_STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-xl bg-white/10 px-3 py-2.5 ring-1 ring-white/15">
                  <Icon size={14} className="mb-1 text-sky-200" />
                  <p className="text-[12px] font-extrabold">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </BlueHero>

      {/* 4. Feature cards 2x3 */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <WhiteCard key={f.title} className={`bg-gradient-to-b ${f.tone} !p-3.5`}>
              <div className="mb-2 flex items-center gap-2">
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${f.iconBg}`}>
                  <Icon size={16} />
                </span>
                <h3 className={`font-display text-[14px] font-extrabold ${f.accent}`}>{f.title}</h3>
              </div>
              {f.body}
              <PillButton href={f.href} tone={f.btn} className="mt-3 w-full !py-2">
                {f.cta}
              </PillButton>
            </WhiteCard>
          );
        })}
      </div>

      {/* 5. Overall Progress */}
      <WhiteCard
        title="Your Overall Progress"
        action={
          <Link href="/dashboard/student/insights" className="text-[12px] font-semibold text-[#0F3DDE]">
            Detailed Analytics →
          </Link>
        }
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <ScoreRing value={68} label="Overall Progress" size={110} tone="mixed" />
          <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: ClipboardCheck, label: "Mock Tests", value: "28/50", tone: "bg-blue-50 text-[#0F3DDE]" },
              { icon: Clock3, label: "Study Hours", value: "126/200", tone: "bg-emerald-50 text-emerald-600" },
              { icon: Zap, label: "Strong Topics", value: "12/25", tone: "bg-amber-50 text-amber-600" },
              { icon: Shield, label: "Weak Topics", value: "5 Need Focus", tone: "bg-rose-50 text-rose-600" },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="rounded-2xl bg-[#F8FAFC] p-3 ring-1 ring-slate-100">
                  <span className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${m.tone}`}>
                    <Icon size={14} />
                  </span>
                  <p className="text-[10px] font-semibold text-slate-500">{m.label}</p>
                  <p className="mt-0.5 font-display text-[14px] font-extrabold text-[#0B1F3A]">{m.value}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-2 flex justify-between text-[12px] font-bold text-slate-600">
            <span>Syllabus completion</span>
            <span className="text-[#0F3DDE]">68%</span>
          </div>
          <ProgressBar value={68} color="bg-emerald-500" />
        </div>
      </WhiteCard>

      {/* 6. Education Opportunities */}
      <section>
        <SectionHeader
          title="Education Opportunities"
          href="/dashboard/student/colleges"
          badge="Sponsored"
          actionLabel="View All →"
        />
        <p className="mb-3 text-[12px] text-slate-500">
          Colleges & Universities that support Government Exam Aspirants.
        </p>
        <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-4 lg:overflow-visible">
          {UNIVERSITIES.map((u) => (
            <article
              key={u.name}
              className="min-w-[230px] overflow-hidden rounded-[20px] bg-white shadow-[0_2px_14px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 lg:min-w-0"
            >
              <div className="relative h-28">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u.img} alt="" className="h-full w-full object-cover" />
                <span className="absolute left-2 top-2 rounded-full bg-[#0F3DDE] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white">
                  Sponsored
                </span>
                <button
                  type="button"
                  className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-500"
                  aria-label="Save"
                >
                  <Heart size={14} />
                </button>
                <span className="absolute bottom-2 left-2">
                  <BrandLogo name={u.name} className="h-10 w-10 ring-2 ring-white" rounded="full" />
                </span>
              </div>
              <div className="p-3.5">
                <p className="line-clamp-2 text-[13px] font-extrabold leading-snug text-[#0B1F3A]">{u.name}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{u.loc}</p>
                <p className="mt-1 text-[10px] font-bold text-[#0F3DDE]">{u.tags}</p>
                <p className="mt-1 line-clamp-2 text-[11px] text-slate-500">{u.blurb}</p>
                <PillButton href="/dashboard/student/colleges" className="mt-3 w-full !py-2">
                  Know More
                </PillButton>
              </div>
            </article>
          ))}
        </div>
        <div className="lg:hidden">
          <CarouselDots active={0} count={UNIVERSITIES.length} />
        </div>
      </section>
    </DashboardPage>
  );
}
