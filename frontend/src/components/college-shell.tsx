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
import { SoftAreaChart, SoftBarChart } from "@/components/ui/charts";

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
    <RoleShell role="COLLEGE" nav={collegeNav} searchPlaceholder="Search leads, applications, events…">
      {children}
    </RoleShell>
  );
}

export function CollegeHome() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">College Institutional Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Admissions, placements, MOUs and partner company intelligence — investor-ready institutional ops.
        </p>
      </div>
      <KpiGrid
        items={[
          { label: "Student Applications", value: "864", sub: "This cycle", tint: "bg-blue-50 text-blue-700" },
          { label: "Admissions", value: "214", sub: "Confirmed offers", tint: "bg-emerald-50 text-emerald-700" },
          { label: "Placement Rate", value: "91%", sub: "Last graduating batch", tint: "bg-violet-50 text-violet-700" },
          { label: "Partner Companies", value: "48", sub: "Active MOUs", tint: "bg-amber-50 text-amber-700" },
          { label: "Internships", value: "312", sub: "Live campus roles", tint: "bg-sky-50 text-sky-700" },
          { label: "Projects", value: "76", sub: "Industry-sponsored", tint: "bg-rose-50 text-rose-700" },
          { label: "Placement Analytics", value: "₹8.4L", sub: "Median CTC", tint: "bg-indigo-50 text-indigo-700" },
          { label: "MOU Status", value: "12 Open", sub: "4 renewals due", tint: "bg-orange-50 text-orange-700" },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-2 text-sm font-bold text-slate-800">Application inflow</h3>
          <SoftAreaChart
            data={[
              { name: "Jan", value: 80 },
              { name: "Feb", value: 120 },
              { name: "Mar", value: 180 },
              { name: "Apr", value: 240 },
              { name: "May", value: 210 },
              { name: "Jun", value: 280 },
            ]}
          />
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-2 text-sm font-bold text-slate-800">Placement funnel</h3>
          <SoftBarChart
            data={[
              { name: "Eligible", value: 420 },
              { name: "Applied", value: 310 },
              { name: "Shortlist", value: 180 },
              { name: "Offers", value: 96 },
            ]}
            color="#16A34A"
          />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ModuleCard
          title="Admission desk"
          description="Capture and qualify Ellowring-sourced student leads; update application statuses."
          action={
            <Link
              href="/dashboard/college/leads"
              className="inline-flex rounded-xl bg-[#0F3DDE] px-4 py-2 text-sm font-semibold text-white"
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
