"use client";

import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Building2,
  FileStack,
  GraduationCap,
  IndianRupee,
  LayoutDashboard,
  Megaphone,
  Users,
  Wallet,
} from "lucide-react";
import { RoleNavItem, RoleShell, KpiGrid, DataTable, ModuleCard } from "@/components/role-shell";
import { SoftBarChart } from "@/components/ui/charts";

export const partnerNav: RoleNavItem[] = [
  { href: "/dashboard/partner", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/partner/student-referrals", label: "Student Referrals", icon: GraduationCap },
  { href: "/dashboard/partner/college-referrals", label: "College Referrals", icon: Building2 },
  { href: "/dashboard/partner/course-referrals", label: "Course Referrals", icon: BookOpen },
  { href: "/dashboard/partner/leads", label: "Lead Management", icon: Users },
  { href: "/dashboard/partner/commission", label: "Commission Wallet", icon: Wallet },
  { href: "/dashboard/partner/earnings", label: "Earnings", icon: IndianRupee },
  { href: "/dashboard/partner/payouts", label: "Payout History", icon: FileStack },
  { href: "/dashboard/partner/marketing", label: "Marketing Materials", icon: Megaphone },
  { href: "/dashboard/partner/reports", label: "Reports", icon: BarChart3 },
];

export function PartnerShell({ children }: { children: React.ReactNode }) {
  return (
    <RoleShell
      role="PARTNER"
      nav={partnerNav}
      searchPlaceholder="Search leads, referrals, payouts…"
    >
      {children}
    </RoleShell>
  );
}

export function PartnerHome() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Channel Partner Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Referrals, admissions, commission, payouts, conversion and partner rank analytics.
        </p>
      </div>
      <KpiGrid
        items={[
          { label: "Referrals", value: "84", sub: "This month", tint: "bg-blue-50 text-blue-700" },
          { label: "Admissions", value: "23", sub: "Converted seats", tint: "bg-emerald-50 text-emerald-700" },
          { label: "Commission", value: "₹ 36,200", sub: "Earned MTD", tint: "bg-violet-50 text-violet-700" },
          { label: "Pending Payouts", value: "₹ 12,400", sub: "Clears Fri", tint: "bg-amber-50 text-amber-700" },
          { label: "Conversion Rate", value: "27%", sub: "Lead → paid", tint: "bg-sky-50 text-sky-700" },
          { label: "Partner Rank", value: "Silver", sub: "Next Gold @ ₹1L", tint: "bg-indigo-50 text-indigo-700" },
          { label: "Performance", value: "+18%", sub: "vs last month", tint: "bg-rose-50 text-rose-700" },
          { label: "Active Schools", value: "31", sub: "Referral network", tint: "bg-orange-50 text-orange-700" },
        ]}
      />
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <h3 className="mb-2 text-sm font-bold text-slate-800">Performance analytics</h3>
        <SoftBarChart
          data={[
            { name: "Wk1", value: 12 },
            { name: "Wk2", value: 18 },
            { name: "Wk3", value: 15 },
            { name: "Wk4", value: 23 },
          ]}
          color="#7C3AED"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ModuleCard
          title="Your referral link"
          description="Share https://ellowring.com/r/PARTNER-DEMO across schools and coaching centres."
          action={
            <button
              type="button"
              className="rounded-xl bg-[#0F3DDE] px-4 py-2 text-sm font-semibold text-white"
              onClick={() => navigator.clipboard?.writeText("https://ellowring.com/r/PARTNER-DEMO")}
            >
              Copy link
            </button>
          }
        />
        <ModuleCard
          title="Commission engine"
          description="Accruals post after payment confirmation. Clawbacks apply on refunds per policy."
          action={
            <Link
              href="/dashboard/partner/commission"
              className="inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Open wallet
            </Link>
          }
        />
      </div>
      <DataTable
        columns={["Lead", "Type", "Status", "Commission", "Updated"]}
        rows={[
          ["Priya S.", "Student · NEET", "Converted", "₹ 1,200", "Today"],
          ["Greenfield College", "College", "In negotiation", "—", "Yesterday"],
          ["Karthik R.", "Course · Full Stack", "Pending payment", "₹ 800*", "2 days ago"],
        ]}
      />
    </div>
  );
}
