"use client";

import Link from "next/link";
import {
  BarChart3,
  Building2,
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LineChart,
  Users,
} from "lucide-react";
import { RoleNavItem, RoleShell, KpiGrid, DataTable, ModuleCard } from "@/components/role-shell";

export const collegeNav: RoleNavItem[] = [
  { href: "/dashboard/college", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/college/leads", label: "Admission Leads", icon: Users },
  { href: "/dashboard/college/applications", label: "Applications", icon: ClipboardList },
  { href: "/dashboard/college/placement", label: "Placement Cell", icon: Building2 },
  { href: "/dashboard/college/analytics", label: "Analytics", icon: LineChart },
  { href: "/dashboard/college/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/college/events", label: "Events", icon: CalendarDays },
  { href: "/dashboard/college/profile", label: "Profile", icon: FileText },
];

export function CollegeShell({ children }: { children: React.ReactNode }) {
  return (
    <RoleShell
      role="COLLEGE"
      nav={collegeNav}
      searchPlaceholder="Search leads, applications, events…"
    >
      {children}
    </RoleShell>
  );
}

export function CollegeHome() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">College Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Phase 2 — admission leads, applications, placement cell and campus events.
        </p>
      </div>
      <KpiGrid
        items={[
          { label: "New Leads", value: "128", sub: "Last 7 days", tint: "bg-blue-50 text-blue-700" },
          { label: "Applications", value: "64", sub: "In review", tint: "bg-emerald-50 text-emerald-700" },
          { label: "Open Seats", value: "210", sub: "Across programmes", tint: "bg-violet-50 text-violet-700" },
          { label: "Placement Drives", value: "5", sub: "This semester", tint: "bg-amber-50 text-amber-700" },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <ModuleCard
          title="Admission desk"
          description="Capture and qualify Ellowring-sourced student leads; update application statuses."
          action={
            <Link
              href="/dashboard/college/leads"
              className="inline-flex rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white"
            >
              View leads
            </Link>
          }
        />
        <ModuleCard
          title="Placement cell"
          description="Coordinate campus drives with HR partners and publish eligible student lists."
          action={
            <Link
              href="/dashboard/college/placement"
              className="inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Open placement cell
            </Link>
          }
        />
      </div>
      <DataTable
        columns={["Applicant", "Programme", "Status", "Counselor", "Updated"]}
        rows={[
          ["Vignesh R.", "B.Tech CSE", "Documents pending", "Ms. Latha", "Today"],
          ["Meera S.", "B.Sc Nursing", "Interview", "Mr. Kumar", "Yesterday"],
          ["Arjun P.", "BBA", "Offer issued", "Ms. Latha", "3 days ago"],
        ]}
      />
    </div>
  );
}
