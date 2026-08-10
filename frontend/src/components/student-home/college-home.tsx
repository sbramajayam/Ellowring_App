"use client";

import Link from "next/link";
import {
  Bookmark,
  Briefcase,
  Building2,
  CalendarDays,
  FileText,
  GraduationCap,
  Layers,
  Bot,
  LineChart,
  MapPin,
  Target,
  UserRound,
} from "lucide-react";
import { DashboardPage, SectionHeader } from "@/components/student-home/shared";
import { BrandLogo } from "@/components/student-home/brand-logo";

const companies = [
  { name: "Google", href: "/dashboard/student/jobs" },
  { name: "Microsoft", href: "/dashboard/student/jobs" },
  { name: "Amazon", href: "/dashboard/student/jobs" },
  { name: "TCS", href: "/dashboard/student/jobs" },
  { name: "Infosys", href: "/dashboard/student/jobs" },
  { name: "Accenture", href: "/dashboard/student/jobs" },
  { name: "Zoho", href: "/dashboard/student/jobs" },
];

const quickAccess = [
  { label: "Courses", desc: "Upskill yourself", href: "/dashboard/student/courses", icon: GraduationCap, bg: "bg-blue-100", fg: "text-blue-600" },
  { label: "Internships", desc: "Apply & learn", href: "/dashboard/student/internships", icon: Briefcase, bg: "bg-emerald-100", fg: "text-emerald-600" },
  { label: "Projects", desc: "Build your portfolio", href: "/dashboard/student/projects", icon: Layers, bg: "bg-violet-100", fg: "text-violet-600" },
  { label: "Resume Builder", desc: "Create ATS resume", href: "/dashboard/student/resume", icon: FileText, bg: "bg-orange-100", fg: "text-orange-600" },
  { label: "AI Interview Coach", desc: "Practice & improve", href: "/dashboard/student/ai-assistant", icon: Bot, bg: "bg-pink-100", fg: "text-pink-600" },
  { label: "Jobs", desc: "Find your dream job", href: "/dashboard/student/jobs", icon: Building2, bg: "bg-teal-100", fg: "text-teal-600" },
];

const internships = [
  { company: "Zoho", role: "Software Development Intern", loc: "Chennai, Tamil Nadu", stipend: "₹15,000 / month" },
  { company: "TCS", role: "Business Analyst Intern", loc: "Bengaluru, Karnataka", stipend: "₹12,000 / month" },
  { company: "Wipro", role: "UI/UX Design Intern", loc: "Remote", stipend: "₹10,000 / month" },
];

const campusDrives = [
  { company: "Infosys", title: "Infosys Springboard Off Campus Drive 2025", elig: "BE / B.Tech / MCA", date: "20 May 2025" },
  { company: "TCS", title: "TCS Ninja Hiring Drive 2025", elig: "BE / B.Tech / M.Sc", date: "05 Jun 2025" },
  { company: "Accenture", title: "Accenture Associate Drive", elig: "Any Graduate", date: "18 Jun 2025" },
];

/** Screenshot 3 — College / Career student home */
export function CollegeHome({
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
          <p className="mt-1 text-[13px] text-slate-500 lg:text-[15px]">Build your career with Ellowring.</p>
        </div>
        <button
          type="button"
          onClick={onChangeGoal}
          className="flex max-w-[168px] items-center gap-2 rounded-[14px] border border-slate-200 bg-white px-2.5 py-2 text-left shadow-sm"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#0F3DDE]">
            <GraduationCap size={15} />
          </span>
          <span className="min-w-0">
            <span className="block text-[9px] font-bold uppercase text-slate-400">Your College</span>
            <span className="block truncate text-[11px] font-extrabold text-slate-800">Sri Venkateswara College</span>
          </span>
          <span className="text-slate-300">›</span>
        </button>
      </div>

      <section className="rounded-[20px] bg-gradient-to-r from-[#0B1F3A] via-[#0F3DDE] to-[#2563EB] p-4 text-white shadow-[0_14px_30px_rgba(15,61,222,0.3)] lg:rounded-[24px] lg:p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:divide-x sm:divide-white/20 sm:gap-0">
          {[
            {
              icon: LineChart,
              label: "Skill Progress",
              value: "78%",
              foot: "12 / 15 Skills",
              bar: 78,
              barClass: "from-sky-300 to-emerald-400",
            },
            {
              icon: Briefcase,
              label: "Internship Applications",
              value: "12",
              foot: "3 Shortlisted",
            },
            {
              icon: UserRound,
              label: "Profile Completion",
              value: "85%",
              foot: "Almost there!",
              bar: 85,
              barClass: "from-amber-300 to-emerald-400",
            },
            {
              icon: Target,
              label: "Career Readiness Score",
              value: "74/100",
              foot: "Keep it up! 🚀",
              bar: 74,
              barClass: "from-sky-300 to-blue-200",
            },
          ].map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="px-1 sm:px-4 first:sm:pl-0 last:sm:pr-0">
                <Icon size={16} className="mb-1.5 text-blue-100" />
                <p className="text-[10px] font-medium leading-tight text-blue-100 lg:text-[11px]">{k.label}</p>
                <p className="mt-1 font-display text-[20px] font-extrabold leading-none lg:text-[26px]">{k.value}</p>
                {"bar" in k && k.bar ? (
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${k.barClass}`}
                      style={{ width: `${k.bar}%` }}
                    />
                  </div>
                ) : (
                  <div className="mt-2 h-1.5" />
                )}
                <p className="mt-1.5 text-[10px] text-blue-100 lg:text-[11px]">{k.foot}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeader title="Quick Access" href="/dashboard/student/courses" />
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3 xl:grid-cols-6">
          {quickAccess.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-2.5 rounded-[14px] bg-white p-3 shadow-[0_2px_10px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.bg} ${item.fg}`}>
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-bold leading-tight text-[#0B1F3A]">{item.label}</p>
                  <p className="text-[9px] text-slate-500">{item.desc}</p>
                </div>
                <span className="text-slate-300">›</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeader title="Recommended Internships" href="/dashboard/student/internships" />
        <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {internships.map((job) => (
            <article
              key={job.company + job.role}
              className="min-w-[250px] rounded-[16px] bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.06)] ring-1 ring-slate-100"
            >
              <BrandLogo name={job.company} className="h-11 w-11" rounded="xl" />
              <h3 className="mt-2.5 text-[13px] font-extrabold text-[#0B1F3A]">{job.role}</h3>
              <p className="mt-1 text-[11px] font-medium text-slate-600">{job.company}</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-500">
                <MapPin size={11} /> {job.loc}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Stipend</span>
                <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-semibold text-[#0F3DDE]">{job.stipend}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Link
                  href="/dashboard/student/internships"
                  className="flex flex-1 items-center justify-center rounded-full bg-[#0F3DDE] py-2 text-[12px] font-bold text-white"
                >
                  Apply Now
                </Link>
                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400"
                  aria-label="Save internship"
                >
                  <Bookmark size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Top Hiring Companies" href="/dashboard/student/jobs" />
        <div className="flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {companies.map((c) => (
            <Link
              key={c.name}
              href={c.href}
              className="flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-[14px] bg-white p-2 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
              title={c.name}
            >
              <BrandLogo name={c.name} className="h-8 w-8" rounded="lg" />
              <span className="max-w-full truncate text-[9px] font-bold text-slate-600">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Campus Recruitment Opportunities" href="/dashboard/student/jobs" />
        <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {campusDrives.map((d) => (
            <article
              key={d.title}
              className="min-w-[260px] rounded-[16px] bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.06)] ring-1 ring-slate-100"
            >
              <div className="flex items-start gap-3">
                <BrandLogo name={d.company} className="h-11 w-11 shrink-0" rounded="xl" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-extrabold leading-snug text-[#0B1F3A]">{d.title}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{d.elig}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                    <CalendarDays size={11} /> {d.date}
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/student/jobs"
                className="mt-3 flex w-full items-center justify-center rounded-full bg-[#0F3DDE] py-2.5 text-[12px] font-bold text-white"
              >
                Register
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[20px] bg-gradient-to-b from-[#0B1F3A] to-[#122F6B] px-4 py-5 text-white lg:rounded-[24px] lg:px-6 lg:py-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-[14px] font-extrabold leading-snug lg:text-[18px]">
            Higher Studies & Campus Recruitment Opportunities
          </h2>
          <Link href="/dashboard/student/colleges" className="shrink-0 text-[12px] font-semibold text-sky-300">
            View All &gt;
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            {
              name: "VIT University",
              loc: "Vellore",
              deg: "B.Tech | M.Tech | MBA",
              img: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80",
            },
            {
              name: "BITS Pilani",
              loc: "Pilani",
              deg: "B.E | M.Sc | PhD",
              img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80",
            },
            {
              name: "Manipal Academy",
              loc: "Manipal",
              deg: "B.Tech | MBBS | MCA",
              img: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=80",
            },
            {
              name: "KIIT University",
              loc: "Bhubaneswar",
              deg: "B.Tech | Law | MBA",
              img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
            },
          ].map((u) => (
            <article key={u.name} className="min-w-[172px] overflow-hidden rounded-[16px] bg-white/10 ring-1 ring-white/15">
              <div className="relative h-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u.img} alt={u.name} className="h-full w-full object-cover opacity-90" />
                <span className="absolute left-2 top-2 rounded bg-[#0F3DDE] px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-white">
                  Sponsored
                </span>
              </div>
              <div className="p-2.5">
                <p className="text-[12px] font-extrabold">{u.name}</p>
                <p className="text-[10px] text-blue-100">{u.loc}</p>
                <p className="mt-1 text-[9px] text-blue-200">{u.deg}</p>
                <Link
                  href="/dashboard/student/colleges"
                  className="mt-2 flex w-full items-center justify-center rounded-full border border-white/70 py-1.5 text-[11px] font-bold text-white"
                >
                  Know More
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-3 flex justify-center gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`h-1.5 rounded-full ${i === 0 ? "w-4 bg-[#60A5FA]" : "w-1.5 bg-white/30"}`} />
          ))}
        </div>
      </section>
    </DashboardPage>
  );
}
