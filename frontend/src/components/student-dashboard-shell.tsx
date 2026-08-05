"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/lib/auth-context";

const studentNav = [
  { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/student/career", label: "Career Guidance", icon: Compass },
  { href: "/dashboard/student/coaching", label: "Coaching", icon: GraduationCap },
  { href: "/dashboard/student/mock-tests", label: "Mock Tests", icon: ClipboardCheck },
  { href: "/dashboard/student/colleges", label: "Colleges", icon: Building2 },
  { href: "/dashboard/student/admissions", label: "Admissions", icon: ClipboardList },
  { href: "/dashboard/student/courses", label: "Courses", icon: BookOpen },
  { href: "/dashboard/student/internships", label: "Internships", icon: Briefcase },
  { href: "/dashboard/student/projects", label: "Projects", icon: Layers },
  { href: "/dashboard/student/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/student/study-abroad", label: "Study Abroad", icon: Globe2 },
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

function greetingForHour(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export function StudentDashboardShell({
  children,
  showHomeChrome = false,
}: {
  children: React.ReactNode;
  /** When true, page owns full home layout (greeting already in shell is skipped). */
  showHomeChrome?: boolean;
}) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");

  const firstName = useMemo(() => {
    if (!user?.name) return "Student";
    const parts = user.name.replace(/^Mr\.?\s+/i, "").trim().split(/\s+/);
    return parts[0] || "Student";
  }, [user?.name]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "STUDENT")) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F6FB] text-slate-500">
        Loading dashboard…
      </div>
    );
  }

  const Sidebar = (
    <div className="flex h-full flex-col">
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {studentNav.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href, "exact" in item ? item.exact : false);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-[#3B82F6] text-white shadow-sm shadow-blue-500/25"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <Icon size={18} className={active ? "text-white" : "text-slate-400"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mb-3 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 ring-1 ring-amber-200/70">
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-white shadow">
          <Crown size={18} />
        </div>
        <p className="text-sm font-semibold text-slate-800">Go Premium</p>
        <p className="mt-0.5 text-xs text-slate-500">Unlock AI insights, mocks & mentorship.</p>
        <Link
          href="/dashboard/student/premium"
          className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-[#3B82F6] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
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
        className="mx-3 mb-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F6FB] text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
          <button
            type="button"
            className="inline-flex rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <Link href="/dashboard/student" className="flex shrink-0 items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-emerald-400 text-xs font-bold text-white shadow-sm">
              E
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-slate-900">
              ELLOWRING
            </span>
          </Link>

          <div className="mx-auto hidden w-full max-w-xl md:block">
            <label className="relative block">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for courses, colleges, exams..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              href="/dashboard/student/notifications"
              className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                3
              </span>
            </Link>
            <Link
              href="/dashboard/student/messages"
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Messages"
            >
              <MessageSquare size={20} />
            </Link>
            <div className="ml-1 flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-semibold text-white">
                {firstName.slice(0, 1).toUpperCase()}
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-semibold text-slate-800">Mr. {firstName}</p>
                <p className="text-[11px] text-slate-500">Student</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-[240px] shrink-0 overflow-y-auto border-r border-slate-200/80 bg-white lg:block">
          {Sidebar}
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-slate-900/40"
              aria-label="Close menu overlay"
              onClick={() => setDrawerOpen(false)}
            />
            <aside className="absolute left-0 top-0 flex h-full w-[280px] flex-col bg-white shadow-xl">
              <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
                <span className="font-display font-bold">Menu</span>
                <button
                  type="button"
                  className="rounded-lg p-2 hover:bg-slate-100"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              {Sidebar}
            </aside>
          </div>
        )}

        <div className="min-w-0 flex-1">
          {!showHomeChrome && (
            <div className="border-b border-slate-200/60 bg-white/50 px-4 py-5 lg:px-8">
              <h1 className="font-display text-2xl font-bold text-slate-900">
                {greetingForHour()}, {firstName}!
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Let&apos;s continue your learning journey. You&apos;re doing great.
              </p>
            </div>
          )}
          <div className={showHomeChrome ? "" : "p-4 lg:p-8"}>{children}</div>
        </div>
      </div>
    </div>
  );
}

export { greetingForHour };
