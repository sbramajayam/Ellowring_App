"use client";

import Link from "next/link";
import {
  Award,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  FileText,
  IndianRupee,
  LayoutDashboard,
  UserRound,
  Users,
} from "lucide-react";
import { RoleNavItem, RoleShell, KpiGrid, DataTable, ModuleCard } from "@/components/role-shell";
import { SoftAreaChart } from "@/components/ui/charts";

export const trainingNav: RoleNavItem[] = [
  { href: "/dashboard/training", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/training/courses", label: "Courses", icon: BookOpen },
  { href: "/dashboard/training/trainers", label: "Trainers", icon: UserRound },
  { href: "/dashboard/training/students", label: "Students", icon: Users },
  { href: "/dashboard/training/assignments", label: "Assignments", icon: FileText },
  { href: "/dashboard/training/assessments", label: "Assessments", icon: ClipboardCheck },
  { href: "/dashboard/training/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/training/revenue", label: "Revenue", icon: IndianRupee },
  { href: "/dashboard/training/reports", label: "Reports", icon: BarChart3 },
];

export function TrainingShell({ children }: { children: React.ReactNode }) {
  return (
    <RoleShell
      role="TRAINING"
      nav={trainingNav}
      searchPlaceholder="Search courses, trainers, students…"
    >
      {children}
    </RoleShell>
  );
}

export function TrainingHome() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Training Partner Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Students, courses, revenue, completions, certifications, mocks, mentors and batches.
        </p>
      </div>
      <KpiGrid
        items={[
          { label: "Students", value: "1,246", sub: "Across batches", tint: "bg-violet-50 text-violet-700" },
          { label: "Courses", value: "18", sub: "Published catalog", tint: "bg-blue-50 text-blue-700" },
          { label: "Revenue", value: "₹ 4.8L", sub: "MTD settlements", tint: "bg-amber-50 text-amber-700" },
          { label: "Completion Rate", value: "76%", sub: "Course finishers", tint: "bg-emerald-50 text-emerald-700" },
          { label: "Certifications", value: "418", sub: "Issued this quarter", tint: "bg-sky-50 text-sky-700" },
          { label: "Mock Tests", value: "92", sub: "Live assessments", tint: "bg-rose-50 text-rose-700" },
          { label: "Mentors", value: "12", sub: "Verified faculty", tint: "bg-indigo-50 text-indigo-700" },
          { label: "Batches", value: "24", sub: "Running cohorts", tint: "bg-orange-50 text-orange-700" },
        ]}
      />
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <h3 className="mb-2 text-sm font-bold text-slate-800">Revenue trend</h3>
        <SoftAreaChart
          data={[
            { name: "Jan", value: 2.1 },
            { name: "Feb", value: 2.8 },
            { name: "Mar", value: 3.4 },
            { name: "Apr", value: 3.9 },
            { name: "May", value: 4.2 },
            { name: "Jun", value: 4.8 },
          ]}
          color="#F59E0B"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ModuleCard
          title="Instructor authoring"
          description="Upload lessons, live session links, and quizzes. Students enrol from the Ellowring marketplace."
          action={
            <Link
              href="/dashboard/training/courses"
              className="inline-flex rounded-xl bg-[#0F3DDE] px-4 py-2 text-sm font-semibold text-white"
            >
              Manage courses
            </Link>
          }
        />
        <ModuleCard
          title="Assessment builder"
          description="Create assignments and assessments, auto-issue certificates on completion."
          action={
            <Link
              href="/dashboard/training/assessments"
              className="inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Open assessments
            </Link>
          }
        />
      </div>
      <DataTable
        columns={["Batch", "Course", "Students", "Next live class", "Status"]}
        rows={[
          ["NEET-2026-A", "NEET Crash Course", 86, "Today 6:00 PM", "Live"],
          ["JEE-MAIN-B", "JEE Main Intensive", 64, "Tomorrow 10:00 AM", "Scheduled"],
          ["FULLSTACK-01", "Full Stack Web Dev", 112, "Fri 7:30 PM", "Active"],
        ]}
      />
    </div>
  );
}
