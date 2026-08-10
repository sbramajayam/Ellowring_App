"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import {
  Award,
  Bell,
  Bookmark,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  ClipboardList,
  Compass,
  Crown,
  FileText,
  Flame,
  Globe2,
  GraduationCap,
  LayoutDashboard,
  Layers,
  Lightbulb,
  LogOut,
  MessageSquare,
  Rocket,
  Search,
  Settings,
  Sparkles,
  User,
  Wallet,
  X,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/lib/auth-context";
import { EllowringLogo } from "@/components/ellowring-logo";
import { NotificationCenter, ProfileDropdown } from "@/components/ui/chrome-menus";
import { DashboardLoading } from "@/components/ui/dashboard-loading";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [{ href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    title: "Academics",
    items: [
      { href: "/dashboard/student/coaching?track=neet", label: "NEET Coaching", icon: GraduationCap },
      { href: "/dashboard/student/coaching?track=jee", label: "JEE Coaching", icon: GraduationCap },
      { href: "/dashboard/student/coaching?track=competitive", label: "Competitive Exams", icon: Flame },
      { href: "/dashboard/student/courses", label: "Courses", icon: BookOpen },
      { href: "/dashboard/student/study-material", label: "Study Material", icon: FileText },
      { href: "/dashboard/student/mock-tests", label: "Mock Tests", icon: ClipboardCheck },
      { href: "/dashboard/student/previous-papers", label: "Previous Year Papers", icon: ClipboardList },
    ],
  },
  {
    title: "Career",
    items: [
      { href: "/dashboard/student/career", label: "Career Guidance", icon: Compass },
      { href: "/dashboard/student/colleges", label: "Colleges", icon: Building2 },
      { href: "/dashboard/student/admissions", label: "Admissions", icon: ClipboardList },
      { href: "/dashboard/student/study-abroad", label: "Study Abroad", icon: Globe2 },
      { href: "/dashboard/student/ai-hub#scholarship", label: "Scholarships", icon: Award },
      { href: "/dashboard/student/resume", label: "Resume Builder", icon: FileText },
    ],
  },
  {
    title: "Opportunities",
    items: [
      { href: "/dashboard/student/internships", label: "Internships", icon: Briefcase },
      { href: "/dashboard/student/projects", label: "Projects", icon: Layers },
      { href: "/dashboard/student/jobs", label: "Jobs", icon: Briefcase },
      { href: "/dashboard/student/projects", label: "Hackathons", icon: Rocket },
      { href: "/dashboard/student/ai-hub#startup", label: "Startup Hub", icon: Lightbulb },
    ],
  },
  {
    title: "Productivity",
    items: [
      { href: "/dashboard/student/calendar", label: "Calendar", icon: CalendarDays },
      { href: "/dashboard/student/ai-hub#planner", label: "Tasks", icon: CheckSquare },
      { href: "/dashboard/student/bookmarks", label: "Bookmarks", icon: Bookmark },
      { href: "/dashboard/student/ai-assistant", label: "AI Mentor", icon: Bot },
      { href: "/dashboard/student/wallet", label: "Wallet", icon: Wallet },
      { href: "/dashboard/student/messages", label: "Messages", icon: MessageSquare },
      { href: "/dashboard/student/notifications", label: "Notifications", icon: Bell },
      { href: "/dashboard/student/profile", label: "Profile", icon: User },
      { href: "/dashboard/student/settings", label: "Settings", icon: Settings },
    ],
  },
];

const searchIndex = [
  { label: "Mock Tests", href: "/dashboard/student/mock-tests" },
  { label: "NEET Coaching", href: "/dashboard/student/coaching?track=neet" },
  { label: "JEE Coaching", href: "/dashboard/student/coaching?track=jee" },
  { label: "Colleges", href: "/dashboard/student/colleges" },
  { label: "AI Hub", href: "/dashboard/student/ai-hub" },
  { label: "Internships", href: "/dashboard/student/internships" },
  { label: "Jobs", href: "/dashboard/student/jobs" },
  { label: "Resume Builder", href: "/dashboard/student/resume" },
  { label: "Ellowring Pro", href: "/dashboard/student/premium" },
  { label: "Certificates", href: "/dashboard/student/certificates" },
];

function isActive(
  pathname: string,
  searchParams: URLSearchParams,
  href: string,
  exact?: boolean,
) {
  const [pathPart, queryPart] = href.split("?");
  const base = pathPart.split("#")[0];
  const hash = href.includes("#") ? href.split("#")[1] : "";

  if (exact) {
    return pathname === base && !queryPart;
  }

  // Path must match first
  const pathOk = pathname === base || pathname.startsWith(`${base}/`);
  if (!pathOk) return false;

  // If href has query params, ALL of them must match current URL (and for track, exact)
  if (queryPart) {
    const required = new URLSearchParams(queryPart.split("#")[0]);
    for (const [key, value] of required.entries()) {
      if (searchParams.get(key) !== value) return false;
    }
    // Special case: coaching menus — if href has track, don't activate siblings
    if (required.has("track")) {
      return searchParams.get("track") === required.get("track");
    }
    return true;
  }

  // Href has no query: only active when current URL also has no conflicting track on same path
  if (base === "/dashboard/student/coaching" && searchParams.get("track")) {
    return false;
  }

  // Hash-only links (e.g. ai-hub#resume): treat path match as enough for sidebar
  if (hash) return pathname === base;

  return true;
}

export function StudentShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <StudentShellInner>{children}</StudentShellInner>
    </Suspense>
  );
}

function StudentShellInner({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || loading) return;
    if (!user || user.role !== "STUDENT") {
      router.replace("/login");
    }
  }, [user, loading, router, hydrated]);

  useEffect(() => setOpen(false), [pathname, searchParams]);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return searchIndex.filter((item) => item.label.toLowerCase().includes(q)).slice(0, 6);
  }, [search]);

  function onSearchSubmit(e: FormEvent) {
    e.preventDefault();
    if (results[0]) {
      router.push(results[0].href);
      setSearch("");
      setSearchOpen(false);
    }
  }

  if (!hydrated || loading || !user || user.role !== "STUDENT") {
    return <DashboardLoading />;
  }

  const firstName = user.name.replace(/^Mr\.?\s+/i, "").trim().split(/\s+/)[0] || "Student";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
      <div className="flex min-h-screen w-full">
        <aside
          className={clsx(
            "fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r border-slate-200/90 bg-white transition-transform lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="relative flex items-center border-b border-slate-100 px-4 py-4">
            <Link href="/dashboard/student" className="min-w-0 flex-1">
              <EllowringLogo variant="horizontal" size="lg" />
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

          <nav className="flex-1 space-y-4 overflow-y-auto px-2.5 py-3">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  {group.title}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(pathname, searchParams, item.href, item.exact);
                    return (
                      <Link
                        key={`${group.title}-${item.label}`}
                        href={item.href}
                        className={clsx(
                          "flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition",
                          active
                            ? "bg-[#0F3DDE] text-white shadow-sm shadow-blue-600/25"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                        )}
                      >
                        <Icon
                          size={17}
                          strokeWidth={active ? 2.5 : 2}
                          className={active ? "text-white" : "text-slate-500"}
                        />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="mx-3 mb-2 rounded-2xl border border-blue-100 bg-gradient-to-br from-[#EEF2FF] to-white p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
              <Crown size={16} className="text-amber-500" fill="currentColor" />
            </div>
            <p className="text-sm font-bold text-slate-900">Ellowring Pro</p>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-600">
              Unlimited mocks, AI Mentor, and internship priority.
            </p>
            <Link
              href="/dashboard/student/premium"
              className="mt-3 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#0F3DDE] to-[#2563EB] py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95"
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
          <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl">
            {/* Mobile — matches mock: logo left, search / bell / profile right */}
            <div className="flex h-14 items-center gap-1 px-3 lg:hidden">
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              >
                <EllowringLogo variant="horizontal" size="sm" />
              </button>
              <button
                type="button"
                className="rounded-full p-2 text-slate-500 hover:bg-slate-50"
                aria-label="Search"
                onClick={() => setSearchOpen((v) => !v)}
              >
                <Search size={20} strokeWidth={1.75} />
              </button>
              <NotificationCenter />
              <ProfileDropdown
                name={firstName}
                roleLabel="Student"
                profileHref="/dashboard/student/profile"
                settingsHref="/dashboard/student/settings"
                premiumHref="/dashboard/student/premium"
                onLogout={() => {
                  logout();
                  router.push("/");
                }}
              />
            </div>
            {searchOpen ? (
              <form onSubmit={onSearchSubmit} className="border-t border-slate-100 px-3 py-2 lg:hidden">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search…"
                  className="w-full rounded-full border border-slate-200 bg-[#F8FAFC] px-4 py-2 text-sm outline-none focus:border-[#2563EB]"
                />
              </form>
            ) : null}

            {/* Desktop header */}
            <div className="hidden h-[68px] items-center gap-6 px-8 lg:flex">
              <form onSubmit={onSearchSubmit} className="relative min-w-0 max-w-[560px] flex-1">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search courses, colleges, exams, jobs, AI tools…"
                  className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-14 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0F3DDE] focus:ring-4 focus:ring-blue-100"
                />
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-[#F8FAFC] px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                  ⌘K
                </span>
                {searchOpen && results.length > 0 ? (
                  <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    {results.map((r) => (
                      <Link
                        key={r.href + r.label}
                        href={r.href}
                        onClick={() => {
                          setSearch("");
                          setSearchOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-[#EEF2FF]"
                      >
                        <Sparkles size={14} className="text-[#0F3DDE]" />
                        {r.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </form>

              <div className="ml-auto flex shrink-0 items-center gap-1">
                <NotificationCenter />
                <Link
                  href="/dashboard/student/messages"
                  className="rounded-full p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-[#0F3DDE]"
                  aria-label="Messages"
                >
                  <MessageSquare size={20} strokeWidth={1.75} />
                </Link>
                <div className="mx-2 h-8 w-px bg-slate-200" />
                <ProfileDropdown
                  name={firstName}
                  roleLabel="Student"
                  profileHref="/dashboard/student/profile"
                  settingsHref="/dashboard/student/settings"
                  premiumHref="/dashboard/student/premium"
                  onLogout={() => {
                    logout();
                    router.push("/");
                  }}
                />
              </div>
            </div>
          </header>

          <main className="page-enter min-h-0 w-full max-w-none flex-1 overflow-y-auto bg-[#FAFBFC]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
