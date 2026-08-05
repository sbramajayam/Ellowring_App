"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Award,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  ClipboardCheck,
  ClipboardList,
  Compass,
  Crown,
  Globe2,
  GraduationCap,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  User,
  Wallet,
  X,
  ChevronDown,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/lib/auth-context";
import { EllowringLogo } from "@/components/ellowring-logo";

/** Exact nav order from Student Dashboard UI reference */
const studentNav = [
  { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/student/career", label: "Career Guidance", icon: Compass },
  { href: "/dashboard/student/coaching", label: "Coaching", icon: GraduationCap },
  { href: "/dashboard/student/mock-tests", label: "Mock Tests", icon: ClipboardCheck },
  { href: "/dashboard/student/colleges", label: "Colleges", icon: Building2 },
  { href: "/dashboard/student/admissions", label: "Admissions", icon: ClipboardList },
  { href: "/dashboard/student/courses", label: "Courses", icon: BookOpen },
  { href: "/dashboard/student/study-abroad", label: "Study Abroad", icon: Globe2 },
  { href: "/dashboard/student/internships", label: "Internships", icon: Briefcase },
  { href: "/dashboard/student/projects", label: "Projects", icon: Layers },
  { href: "/dashboard/student/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/student/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/student/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/student/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/student/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/student/profile", label: "Profile", icon: User },
  { href: "/dashboard/student/settings", label: "Settings", icon: Settings },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function StudentShell({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== "STUDENT")) {
      router.replace("/");
    }
  }, [user, loading, router]);

  useEffect(() => setOpen(false), [pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-slate-500">
        Loading dashboard…
      </div>
    );
  }

  const firstName = user.name.replace(/^Mr\.?\s+/i, "").trim().split(/\s+/)[0] || "Student";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        {/* Sidebar — same logo lockup as header */}
        <aside
          className={clsx(
            "fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r border-slate-200/90 bg-white transition-transform lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="relative flex items-center border-b border-slate-100 px-4 py-4">
            <Link href="/dashboard/student" className="min-w-0 flex-1">
              <EllowringLogo variant="horizontal" size="md" />
            </Link>
            <button
              type="button"
              className="rounded-lg p-1.5 hover:bg-slate-100 lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 py-3">
            {studentNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href, "exact" in item ? item.exact : false);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition",
                    active
                      ? "bg-[#3B82F6] text-white shadow-sm shadow-blue-500/25"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <Icon
                    size={18}
                    strokeWidth={active ? 2.75 : 2.5}
                    className={active ? "text-white" : "text-slate-700"}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mx-3 mb-2 rounded-2xl border border-blue-100 bg-[#EAF2FF] p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
              <Crown size={16} className="text-amber-500" fill="currentColor" />
            </div>
            <p className="text-sm font-bold text-slate-900">Go Premium</p>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-600">
              Unlock premium courses, mock tests and more.
            </p>
            <Link
              href="/dashboard/student/premium"
              className="mt-3 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95"
            >
              Upgrade Now
            </Link>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="mx-3 mb-3 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          >
            <LogOut size={14} /> Logout
          </button>
        </aside>

        {open && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/35 lg:hidden"
            aria-label="Close overlay"
            onClick={() => setOpen(false)}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar — padding / spacing matched to header mockup */}
          <header className="sticky top-0 z-20 flex h-16 items-center gap-6 border-b border-slate-200/90 bg-[#F8FAFC] px-5 lg:h-[68px] lg:gap-8 lg:px-8">
            <button
              type="button"
              className="shrink-0 rounded-lg p-2 hover:bg-white lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <div className="relative min-w-0 max-w-[560px] flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for courses, colleges, exams, jobs..."
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-14 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#3B82F6] focus:ring-4 focus:ring-blue-100"
              />
              <span className="pointer-events-none absolute right-3.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-[#F8FAFC] px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 sm:inline">
                ⌘K
              </span>
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
              <Link
                href="/dashboard/student/notifications"
                className="relative rounded-full p-2.5 text-slate-500 hover:bg-white"
                aria-label="Notifications"
              >
                <Bell size={20} strokeWidth={1.75} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#F8FAFC]" />
              </Link>
              <Link
                href="/dashboard/student/messages"
                className="rounded-full p-2.5 text-slate-500 hover:bg-white"
                aria-label="Messages"
              >
                <MessageSquare size={20} strokeWidth={1.75} />
              </Link>

              <div className="mx-2 hidden h-8 w-px bg-slate-200 sm:block" />

              <button
                type="button"
                className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-1 hover:bg-white sm:pr-2.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB] text-sm font-bold text-white">
                  {firstName.slice(0, 1).toUpperCase()}
                </div>
                <div className="hidden text-left leading-tight sm:block">
                  <p className="text-sm font-semibold text-slate-800">
                    Hi, {firstName} <span aria-hidden>👋</span>
                  </p>
                  <p className="text-[11px] text-slate-500">Student</p>
                </div>
                <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
              </button>
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
