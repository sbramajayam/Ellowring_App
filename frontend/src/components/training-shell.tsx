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
        <h1 className="text-2xl font-bold text-slate-900">Training Institute Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Phase 2 — manage courses, trainers, assessments, certificates and revenue.
        </p>
      </div>
      <KpiGrid
        items={[
          { label: "Active Courses", value: "18", sub: "Published catalog", tint: "bg-blue-50 text-blue-700" },
          { label: "Trainers", value: "12", sub: "Verified faculty", tint: "bg-emerald-50 text-emerald-700" },
          { label: "Active Students", value: "1,246", sub: "Across batches", tint: "bg-violet-50 text-violet-700" },
          { label: "MTD Revenue", value: "₹ 4.8L", sub: "Wallet settlements", tint: "bg-amber-50 text-amber-700" },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <ModuleCard
          title="Instructor authoring"
          description="Upload lessons, live session links, and quizzes. Students enrol from the Ellowring marketplace."
          action={
            <Link
              href="/dashboard/training/courses"
              className="inline-flex rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white"
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
