"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  CalendarClock,
  FileSearch,
  FileText,
  LayoutDashboard,
  LineChart,
  Users,
  Wallet,
} from "lucide-react";
import { RoleNavItem, RoleShell, KpiGrid, DataTable, ModuleCard } from "@/components/role-shell";
import { SoftAreaChart, SoftBarChart } from "@/components/ui/charts";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export const hrNav: RoleNavItem[] = [
  { href: "/dashboard/hr", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/hr/jobs", label: "Job Posting", icon: Briefcase },
  { href: "/dashboard/hr/internships", label: "Internship Hiring", icon: Users },
  { href: "/dashboard/hr/candidates", label: "Candidate Search", icon: FileSearch },
  { href: "/dashboard/hr/resumes", label: "Resume Management", icon: FileText },
  { href: "/dashboard/hr/interviews", label: "Interview Scheduling", icon: CalendarClock },
  { href: "/dashboard/hr/analytics", label: "Hiring Analytics", icon: LineChart },
  { href: "/dashboard/hr/payroll", label: "Payroll", icon: Wallet },
  { href: "/dashboard/hr/profile", label: "Company Profile", icon: Building2 },
];

export function HrShell({ children }: { children: React.ReactNode }) {
  return (
    <RoleShell role="COMPANY" nav={hrNav} searchPlaceholder="Search jobs, candidates, payroll…">
      {children}
    </RoleShell>
  );
}

export function HrHome() {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");

  async function createJob(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    await api("/jobs", {
      method: "POST",
      token,
      body: JSON.stringify({
        title,
        location: "Bengaluru",
        description: "Posted from HR Phase-2 dashboard",
        skills: "Communication, Ownership",
        salaryMin: 400000,
        salaryMax: 700000,
      }),
    });
    setMsg("Job published.");
    setTitle("");
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Corporate Hiring Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Active job posts, applicants, interviews, hires, college partners and payroll — enterprise hiring ops.
        </p>
      </div>
      <KpiGrid
        items={[
          { label: "Active Job Posts", value: "9", sub: "Live openings", tint: "bg-blue-50 text-blue-700" },
          { label: "Applicants", value: "146", sub: "In ATS pipeline", tint: "bg-emerald-50 text-emerald-700" },
          { label: "Shortlisted Candidates", value: "38", sub: "Awaiting panels", tint: "bg-sky-50 text-sky-700" },
          { label: "Interviews", value: "18", sub: "This week", tint: "bg-violet-50 text-violet-700" },
          { label: "Hires", value: "11", sub: "MTD offers accepted", tint: "bg-rose-50 text-rose-700" },
          { label: "College Partners", value: "27", sub: "Campus pipelines", tint: "bg-indigo-50 text-indigo-700" },
          { label: "Payroll", value: "42", sub: "Headcount managed", tint: "bg-amber-50 text-amber-700" },
          { label: "Hiring Funnel", value: "7.5%", sub: "Apply → hire", tint: "bg-orange-50 text-orange-700" },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-2 text-sm font-bold text-slate-800">Applicant volume</h3>
          <SoftAreaChart
            data={[
              { name: "W1", value: 24 },
              { name: "W2", value: 31 },
              { name: "W3", value: 28 },
              { name: "W4", value: 42 },
            ]}
          />
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-2 text-sm font-bold text-slate-800">Hiring funnel</h3>
          <SoftBarChart
            data={[
              { name: "Applied", value: 146 },
              { name: "Screen", value: 88 },
              { name: "Interview", value: 38 },
              { name: "Offer", value: 14 },
              { name: "Hire", value: 11 },
            ]}
            color="#0F3DDE"
          />
        </div>
      </div>

      <form onSubmit={createJob} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Quick job post</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <input
            className="min-w-[240px] flex-1 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            placeholder="Job title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <button className="rounded-xl bg-[#0F3DDE] px-4 py-2.5 text-sm font-semibold text-white">
            Publish
          </button>
          <Link
            href="/dashboard/hr/jobs"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            Full ATS
          </Link>
        </div>
        {msg && <p className="mt-3 text-sm font-medium text-emerald-600">{msg}</p>}
      </form>

      <div className="grid gap-4 lg:grid-cols-2">
        <ModuleCard
          title="Payroll (Phase 2)"
          description="Offer-to-payroll, attendance, PF/ESI/TDS runs and payslips for hired candidates."
          action={
            <Link
              href="/dashboard/hr/payroll"
              className="inline-flex rounded-xl bg-[#0F3DDE] px-4 py-2 text-sm font-semibold text-white"
            >
              Open payroll
            </Link>
          }
        />
        <ModuleCard
          title="Interview scheduling"
          description="Panel slots, scorecards and self-scheduling links for shortlisted candidates."
          action={
            <Link
              href="/dashboard/hr/interviews"
              className="inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Schedule interviews
            </Link>
          }
        />
      </div>

      <DataTable
        columns={["Candidate", "Role", "Stage", "Score", "Next action"]}
        rows={[
          ["Ananya K.", "Backend Engineer", "Interview", "82", "Panel Wed 3 PM"],
          ["Rahul M.", "Internship · ML", "Shortlisted", "76", "Send assessment"],
          ["Sneha P.", "Full Stack", "Offer", "91", "Letter approval"],
        ]}
      />
    </div>
  );
}
