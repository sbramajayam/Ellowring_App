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
import { RoleNavItem, RoleShell } from "@/components/role-shell";

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
    <RoleShell role="ADMIN" nav={adminNav} searchPlaceholder="Search users, tenants, payments, reports…">
      {children}
    </RoleShell>
  );
}

export { AdminHome } from "@/components/admin-home";
