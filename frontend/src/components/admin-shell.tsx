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
import { SoftAreaChart, SoftBarChart } from "@/components/ui/charts";
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
        <h1 className="text-2xl font-bold text-slate-900">Enterprise Admin Panel</h1>
        <p className="mt-1 text-sm text-slate-500">
          Real-time analytics, growth, revenue, partners, transactions, support and AI usage.
        </p>
      </div>
      <KpiGrid
        items={[
          { label: "User Growth", value: "12.4k", sub: "+8.2% MoM", tint: "bg-blue-50 text-blue-700" },
          { label: "Revenue", value: "₹ 48L", sub: "Trailing 30 days", tint: "bg-emerald-50 text-emerald-700" },
          { label: "Colleges", value: "180", sub: "Verified campuses", tint: "bg-violet-50 text-violet-700" },
          { label: "Companies", value: "96", sub: "Hiring tenants", tint: "bg-sky-50 text-sky-700" },
          { label: "Training Partners", value: "64", sub: "Active institutes", tint: "bg-indigo-50 text-indigo-700" },
          { label: "Transactions", value: "2.1L", sub: "Last 24h volume", tint: "bg-amber-50 text-amber-700" },
          { label: "Support Tickets", value: "37", sub: "Open queue", tint: "bg-rose-50 text-rose-700" },
          { label: "System Health", value: "99.9%", sub: "API uptime", tint: "bg-green-50 text-green-700" },
          { label: "AI Usage", value: "128k", sub: "Prompts this week", tint: "bg-fuchsia-50 text-fuchsia-700" },
          { label: "Conversion Funnel", value: "4.6%", sub: "Visit → paid", tint: "bg-orange-50 text-orange-700" },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-2 text-sm font-bold text-slate-800">Real-time user growth</h3>
          <SoftAreaChart
            data={[
              { name: "Mon", value: 180 },
              { name: "Tue", value: 220 },
              { name: "Wed", value: 210 },
              { name: "Thu", value: 260 },
              { name: "Fri", value: 300 },
              { name: "Sat", value: 280 },
              { name: "Sun", value: 340 },
            ]}
          />
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-2 text-sm font-bold text-slate-800">Conversion funnel</h3>
          <SoftBarChart
            data={[
              { name: "Visit", value: 100 },
              { name: "Signup", value: 42 },
              { name: "Activate", value: 28 },
              { name: "Paid", value: 4.6 },
            ]}
            color="#0F3DDE"
          />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ModuleCard
          title="User management"
          description="Suspend, verify and impersonate (audited) across Student, College, HR, Training and Partner."
          action={
            <Link
              href="/dashboard/admin/users"
              className="inline-flex rounded-xl bg-[#0F3DDE] px-4 py-2 text-sm font-semibold text-white"
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
