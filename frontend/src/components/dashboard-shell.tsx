"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Bell,
  Briefcase,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Wallet,
  BookOpen,
  Building2,
  Users,
} from "lucide-react";
import clsx from "clsx";
import { Role, useAuth } from "@/lib/auth-context";
import { goToWebsiteHome } from "@/lib/site";

const navByRole: Record<Role, { href: string; label: string; icon: any }[]> = {
  STUDENT: [
    { href: "/dashboard/student", label: "Overview", icon: LayoutDashboard },
    { href: "/courses", label: "Courses", icon: BookOpen },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/career-guidance", label: "Career AI", icon: Sparkles },
    { href: "/dashboard/student/wallet", label: "Wallet", icon: Wallet },
    { href: "/dashboard/student/notifications", label: "Alerts", icon: Bell },
  ],
  COLLEGE: [
    { href: "/dashboard/college", label: "Overview", icon: LayoutDashboard },
    { href: "/colleges", label: "Programs", icon: GraduationCap },
  ],
  COMPANY: [
    { href: "/dashboard/hr", label: "Overview", icon: LayoutDashboard },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/internships", label: "Internships", icon: Users },
  ],
  TRAINING: [
    { href: "/dashboard/training", label: "Overview", icon: LayoutDashboard },
    { href: "/courses", label: "Courses", icon: BookOpen },
    { href: "/coaching", label: "Coaching", icon: GraduationCap },
  ],
  PARTNER: [
    { href: "/dashboard/partner", label: "Overview", icon: LayoutDashboard },
    { href: "/partner", label: "Network", icon: Building2 },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
  ],
};

export function DashboardShell({
  role,
  title,
  children,
}: {
  role: Role;
  title: string;
  children: React.ReactNode;
}) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const links = navByRole[role];

  useEffect(() => {
    if (!loading && (!user || user.role !== role)) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/login?next=${next}`);
    }
  }, [user, loading, role, router, pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate" suppressHydrationWarning>
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
      <aside className="border-r border-line bg-forest text-white">
        <div className="px-5 py-6">
          <Link href="/" className="font-display text-2xl font-bold">
            Ellow<span className="text-sun">ring</span>
          </Link>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-leaf/70">{role}</p>
        </div>
        <nav className="space-y-1 px-3 pb-8">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  pathname === link.href ? "bg-white/15 text-white" : "text-leaf/80 hover:bg-white/10",
                )}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={() => {
              logout();
              goToWebsiteHome();
            }}
            className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-leaf/80 hover:bg-white/10"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>
      <div>
        <header className="flex items-center justify-between border-b border-line bg-paper/80 px-5 py-4 backdrop-blur">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
            <p className="text-sm text-slate">Hello, {user.name}</p>
          </div>
          <Link href="/" className="btn-secondary !py-2 !px-4 text-sm">
            Public site
          </Link>
        </header>
        <div className="p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}
