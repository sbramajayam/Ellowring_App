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
          Phase 2 — referrals, commission ledger, payouts and marketing collateral.
        </p>
      </div>
      <KpiGrid
        items={[
          { label: "Active Leads", value: "84", sub: "This month", tint: "bg-blue-50 text-blue-700" },
          { label: "Conversions", value: "23", sub: "Paid enrolments", tint: "bg-emerald-50 text-emerald-700" },
          { label: "Commission Due", value: "₹ 36,200", sub: "Wallet balance", tint: "bg-violet-50 text-violet-700" },
          { label: "Partner Tier", value: "Silver", sub: "Next: Gold at ₹1L", tint: "bg-amber-50 text-amber-700" },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <ModuleCard
          title="Your referral link"
          description="Share https://ellowring.com/r/PARTNER-DEMO across schools and coaching centres."
          action={
            <button
              type="button"
              className="rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white"
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
