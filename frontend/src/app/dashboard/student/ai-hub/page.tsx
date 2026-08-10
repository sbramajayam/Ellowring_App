"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot,
  Building2,
  CalendarRange,
  FileText,
  GraduationCap,
  Lightbulb,
  MessageSquare,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { StudentShell } from "@/components/student-shell";

const tools = [
  {
    id: "career",
    title: "AI Career Guidance",
    desc: "Personal roadmap from class 11 to first offer letter.",
    href: "/dashboard/student/career",
    icon: Sparkles,
    tint: "from-blue-500 to-indigo-600",
  },
  {
    id: "college",
    title: "AI College Predictor",
    desc: "Rank-aware shortlists across India & abroad.",
    href: "/dashboard/student/colleges",
    icon: Building2,
    tint: "from-cyan-500 to-blue-600",
  },
  {
    id: "planner",
    title: "AI Study Planner",
    desc: "Daily/weekly plans for NEET, JEE and boards.",
    href: "/dashboard/student/mock-tests",
    icon: CalendarRange,
    tint: "from-violet-500 to-purple-600",
  },
  {
    id: "resume",
    title: "AI Resume Builder",
    desc: "ATS-ready resumes tailored to roles and internships.",
    href: "/dashboard/student/profile",
    icon: FileText,
    tint: "from-rose-500 to-pink-600",
  },
  {
    id: "interview",
    title: "AI Interview Coach",
    desc: "Mock interviews with scoring and feedback loops.",
    href: "/dashboard/student/ai-assistant",
    icon: MessageSquare,
    tint: "from-amber-500 to-orange-600",
  },
  {
    id: "scholarship",
    title: "AI Scholarship Finder",
    desc: "Match funding options by profile and deadline.",
    href: "/dashboard/student/study-abroad",
    icon: WalletCards,
    tint: "from-emerald-500 to-teal-600",
  },
  {
    id: "admission",
    title: "AI Admission Assistant",
    desc: "Forms, documents, cutoffs and counselling help.",
    href: "/dashboard/student/admissions",
    icon: GraduationCap,
    tint: "from-sky-500 to-blue-700",
  },
  {
    id: "startup",
    title: "AI Startup Mentor",
    desc: "Idea validation, MVP scope and founder playbooks.",
    href: "/dashboard/student/projects",
    icon: Lightbulb,
    tint: "from-fuchsia-500 to-purple-700",
  },
];

export default function AiHubPage() {
  return (
    <StudentShell>
      <div className="mx-auto max-w-6xl space-y-6 p-4 lg:p-6">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F3DDE] via-[#2563EB] to-[#60A5FA] p-6 text-white shadow-xl shadow-blue-600/20 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
                <Bot size={14} /> AI Hub
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Your AI-powered growth engine
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-blue-50 sm:text-base">
                Eight specialized copilots for academics, admissions, scholarships, interviews and startup building —
                connected to your Ellowring journey.
              </p>
            </div>
            <Link
              href="/dashboard/student/ai-assistant"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#0F3DDE] shadow-lg"
            >
              Open AI Chat
            </Link>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                id={tool.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={tool.href}
                  className="group block h-full overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br p-3 text-white shadow-md ${tool.tint}`}
                  >
                    <Icon size={20} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 group-hover:text-[#0F3DDE]">{tool.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{tool.desc}</p>
                  <span className="mt-4 inline-flex text-xs font-bold text-[#0F3DDE]">Launch →</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </StudentShell>
  );
}
