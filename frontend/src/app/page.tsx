"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Building2,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Handshake,
  School,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SoftAreaChart, SoftBarChart } from "@/components/ui/charts";
import { MarketplaceCard } from "@/components/ui/marketplace-card";

function AnimatedStat({ end, label, suffix = "" }: { end: number; label: string; suffix?: string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame = 0;
    const total = 36;
    const id = window.setInterval(() => {
      frame += 1;
      setValue(Math.round((end * frame) / total));
      if (frame >= total) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
  }, [end]);
  return (
    <div className="rounded-2xl bg-white/80 p-4 text-center shadow-sm ring-1 ring-white/80 backdrop-blur">
      <p className="text-2xl font-bold text-[#0F3DDE] sm:text-3xl">
        {value.toLocaleString("en-IN")}
        {suffix}
      </p>
      <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
    </div>
  );
}

const journey = [
  "11th Standard",
  "NEET / JEE / Competitive Prep",
  "Career Guidance",
  "College Selection",
  "Admissions",
  "Skill Courses",
  "Internship",
  "Projects",
  "Resume",
  "Interview",
  "Job Offer",
];

const ecosystem = [
  { label: "Students", icon: Users },
  { label: "Schools", icon: School },
  { label: "Colleges", icon: GraduationCap },
  { label: "Training Institutes", icon: Building2 },
  { label: "Companies / HRs", icon: Briefcase },
  { label: "Channel Partners", icon: Handshake },
  { label: "AI Engine", icon: Bot },
  { label: "Payments", icon: Workflow },
];

const partners = ["NIRF Colleges", "IBM Skills", "AWS Educate", "NASSCOM", "Coursera Partners", "State Boards"];

const growth = [
  { name: "Q1", value: 12 },
  { name: "Q2", value: 19 },
  { name: "Q3", value: 28 },
  { name: "Q4", value: 41 },
];

const revenue = [
  { name: "Jan", value: 18 },
  { name: "Feb", value: 22 },
  { name: "Mar", value: 27 },
  { name: "Apr", value: 34 },
  { name: "May", value: 39 },
  { name: "Jun", value: 48 },
];

export default function PremiumLandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(15,61,222,0.12),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(37,99,235,0.16),transparent_35%),linear-gradient(180deg,#ffffff_0%,#F8FAFC_100%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#0F3DDE] shadow-sm ring-1 ring-blue-100">
                <Sparkles size={13} /> Ellowring Software Solutions
              </p>
              <h1 className="mt-5 max-w-2xl font-display text-4xl font-bold tracking-tight text-[#111827] sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
                From 11th Standard to First Job — Everything in One Platform
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Ellowring helps students prepare for NEET, JEE, competitive exams, admissions, internships, projects,
                jobs, and career growth through one AI-powered ecosystem.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-[#0F3DDE] px-6 font-display text-sm font-bold text-white shadow-[0_10px_24px_rgba(15,61,222,0.28)] transition hover:-translate-y-0.5 hover:bg-[#0C32B8]"
                >
                  Start Learning <ArrowRight size={16} />
                </Link>
                <Link
                  href="/colleges"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-slate-200 bg-white px-6 font-display text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-[#0F3DDE]/30 hover:text-[#0F3DDE]"
                >
                  Explore Colleges
                </Link>
                <Link
                  href="/partner"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-[#0F3DDE]/20 bg-[#EEF2FF] px-6 font-display text-sm font-bold text-[#0F3DDE] transition hover:-translate-y-0.5 hover:bg-[#E0E7FF]"
                >
                  Join as Partner
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
                {["ISO-ready processes", "Campus verified partners", "AI Mentorship", "Secure payments"].map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-100"
                  >
                    <CheckCircle2 size={13} className="text-[#16A34A]" /> {b}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[#0F3DDE]/20 to-[#2563EB]/10 blur-2xl" />
              <div className="relative grid gap-3 rounded-[1.75rem] border border-white/70 bg-white/70 p-4 shadow-xl backdrop-blur-xl sm:grid-cols-2">
                {[
                  { title: "School Students", sub: "NEET · JEE · Boards", icon: School },
                  { title: "College Students", sub: "Skills · Internships", icon: GraduationCap },
                  { title: "HRs & Companies", sub: "Hiring funnel", icon: Briefcase },
                  { title: "Training Institutes", sub: "Batches · Revenue", icon: Building2 },
                  { title: "Channel Partners", sub: "Referrals · Payouts", icon: Handshake },
                  { title: "AI Assistant", sub: "24/7 mentor", icon: Bot },
                ].map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.title}
                      animate={{ y: [0, i % 2 ? -6 : 6, 0] }}
                      transition={{ duration: 4 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                      className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
                    >
                      <span className="inline-flex rounded-xl bg-[#EEF2FF] p-2.5 text-[#0F3DDE]">
                        <Icon size={18} />
                      </span>
                      <p className="mt-3 text-sm font-bold text-slate-900">{card.title}</p>
                      <p className="text-xs text-slate-500">{card.sub}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto grid max-w-7xl gap-3 px-4 pb-8 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
          <AnimatedStat end={42000} suffix="+" label="Students onboarded" />
          <AnimatedStat end={180} suffix="+" label="Partner colleges" />
          <AnimatedStat end={96} suffix="+" label="Hiring companies" />
          <AnimatedStat end={64} suffix="+" label="Training partners" />
        </section>

        {/* Partners */}
        <section className="border-y border-slate-100 bg-white py-10">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Trusted by ecosystem partners</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {partners.map((p) => (
                <span
                  key={p}
                  className="rounded-2xl border border-slate-100 bg-[#F8FAFC] px-4 py-2.5 text-sm font-semibold text-slate-600"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Journey */}
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">The Ellowring student journey</h2>
            <p className="mt-2 text-sm text-slate-500">One visual timeline from classrooms to career offers.</p>
          </div>
          <div className="mt-10 overflow-x-auto pb-2">
            <div className="flex min-w-max items-stretch gap-0 px-2">
              {journey.map((step, i) => (
                <div key={step} className="flex items-center">
                  <div className="w-36 rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
                    <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#0F3DDE] text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <p className="mt-3 text-xs font-semibold leading-snug text-slate-800">{step}</p>
                  </div>
                  {i < journey.length - 1 ? (
                    <div className="mx-1 h-0.5 w-6 rounded-full bg-gradient-to-r from-[#0F3DDE] to-[#2563EB]" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ecosystem */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-slate-900">One connected ecosystem</h2>
              <p className="mt-2 text-sm text-slate-500">Ellowring at the center — education, hiring and analytics united.</p>
            </div>
            <div className="relative mx-auto mt-12 max-w-4xl">
              <div className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-[#0F3DDE] text-center text-white shadow-xl shadow-blue-600/30">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Center</span>
                <span className="text-sm font-bold">Ellowring</span>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {ecosystem.map((node) => {
                  const Icon = node.icon;
                  return (
                    <div
                      key={node.label}
                      className="rounded-2xl border border-slate-100 bg-[#F8FAFC] p-4 text-center shadow-sm"
                    >
                      <span className="mx-auto mb-2 inline-flex rounded-xl bg-white p-2 text-[#0F3DDE] shadow-sm">
                        <Icon size={18} />
                      </span>
                      <p className="text-xs font-semibold text-slate-700">{node.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Marketplace preview */}
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Marketplace</h2>
              <p className="mt-1 text-sm text-slate-500">NEET, JEE, colleges, courses, internships and jobs — premium cards.</p>
            </div>
            <Link href="/coaching" className="text-sm font-bold text-[#0F3DDE]">
              Explore all →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MarketplaceCard title="NEET Coaching Elite" eyebrow="NEET" href="/coaching" />
            <MarketplaceCard
              title="JEE Advanced Mastery"
              eyebrow="JEE"
              href="/coaching"
              imageGradient="from-[#7C3AED] via-[#6366F1] to-[#60A5FA]"
            />
            <MarketplaceCard
              title="Study Abroad Pathway"
              eyebrow="Abroad"
              href="/study-abroad"
              imageGradient="from-[#0EA5E9] via-[#0284C7] to-[#0369A1]"
            />
            <MarketplaceCard
              title="Product Design Internship"
              eyebrow="Internship"
              href="/internships"
              price="Stipend ₹15k"
              imageGradient="from-[#DB2777] via-[#E11D48] to-[#FB7185]"
            />
          </div>
        </section>

        {/* Investor metrics */}
        <section id="investor" className="border-t border-slate-100 bg-gradient-to-b from-[#EEF2FF] to-white py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-slate-900">Investor-ready platform metrics</h2>
              <p className="mt-2 text-sm text-slate-500">
                Growth, partners and monetization — built for angels, VCs and institutional partners.
              </p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Total Students", "42,180"],
                ["Partner Colleges", "180"],
                ["Hiring Companies", "96"],
                ["Training Partners", "64"],
                ["Countries", "6"],
                ["Internships", "3,240"],
                ["Jobs", "1,180"],
                ["Revenue (ARR proxy)", "₹4.8 Cr"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                  <p className="text-xs font-medium text-slate-500">{label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <h3 className="mb-2 text-sm font-bold text-slate-800">User growth (k)</h3>
                <SoftBarChart data={growth} />
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <h3 className="mb-2 text-sm font-bold text-slate-800">Revenue index</h3>
                <SoftAreaChart data={revenue} color="#2563EB" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="overflow-hidden rounded-3xl bg-[#111827] px-6 py-12 text-center text-white sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight">Ready to build the next generation workforce?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">
              Start learning, partner with Ellowring, or explore colleges — one premium SaaS platform.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/register" className="rounded-2xl bg-[#0F3DDE] px-5 py-3 text-sm font-bold">
                Start Learning
              </Link>
              <Link href="/login" className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold ring-1 ring-white/20">
                Sign in to app
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
