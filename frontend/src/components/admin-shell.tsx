"use client";

import {
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Users,
  GraduationCap,
  Wallet,
} from "lucide-react";
import { RoleNavItem, RoleShell, KpiGrid, DataTable, ModuleCard } from "@/components/role-shell";
import Link from "next/link";

export const adminNav: RoleNavItem[] = [
  { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/admin/users", label: "User Management", icon: Users },
  { href: "/dashboard/admin/students", label: "Student Management", icon: GraduationCap },
  { href: "/dashboard/admin/colleges", label: "College Management", icon: Building2 },
  { href: "/dashboard/admin/hr", label: "HR Management", icon: Briefcase },
  { href: "/dashboard/admin/training", label: "Training Management", icon: BookOpen },
  { href: "/dashboard/admin/partners", label: "Partner Management", icon: Users },
  { href: "/dashboard/admin/courses", label: "Course Management", icon: BookOpen },
  { href: "/dashboard/admin/coaching", label: "Coaching Management", icon: GraduationCap },
  { href: "/dashboard/admin/admissions", label: "Admission Management", icon: ClipboardList },
  { href: "/dashboard/admin/payments", label: "Payment Management", icon: Wallet },
  { href: "/dashboard/admin/ads", label: "Ads & Marketplace", icon: BarChart3 },
  { href: "/dashboard/admin/enterprise-api", label: "Enterprise API", icon: Settings },
  { href: "/dashboard/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <RoleShell role="ADMIN" nav={adminNav} searchPlaceholder="Search users, tenants, payments…">
      {children}
    </RoleShell>
  );
}

export function AdminHome() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Phase 2 — platform governance across users, content, payments and partners.
        </p>
      </div>
      <KpiGrid
        items={[
          { label: "Users", value: "12.4k", sub: "All roles", tint: "bg-blue-50 text-blue-700" },
          { label: "Pending verifications", value: "37", sub: "College / HR / Training", tint: "bg-amber-50 text-amber-700" },
          { label: "Payments (24h)", value: "₹ 2.1L", sub: "Success volume", tint: "bg-emerald-50 text-emerald-700" },
          { label: "Open disputes", value: "4", sub: "Needs review", tint: "bg-rose-50 text-rose-700" },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <ModuleCard
          title="User management"
          description="Suspend, verify and impersonate (audited) across Student, College, HR, Training and Partner."
          action={
            <Link
              href="/dashboard/admin/users"
              className="inline-flex rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white"
            >
              Manage users
            </Link>
          }
        />
        <ModuleCard
          title="Payment ops"
          description="Refunds, wallet adjustments and Razorpay settlement monitoring."
          action={
            <Link
              href="/dashboard/admin/payments"
              className="inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Payment management
            </Link>
          }
        />
      </div>
      <DataTable
        columns={["Queue", "Count", "Priority", "Owner", "SLA"]}
        rows={[
          ["College verification", 12, "High", "Ops", "24h"],
          ["HR KYC", 9, "Medium", "Trust", "48h"],
          ["Refund requests", 4, "High", "Finance", "12h"],
        ]}
      />
    </div>
  );
}
