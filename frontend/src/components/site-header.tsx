"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth, dashboardPath } from "@/lib/auth-context";
import clsx from "clsx";
import { EllowringLogo } from "@/components/ellowring-logo";

const links = [
  { href: "/coaching", label: "Coaching" },
  { href: "/career-guidance", label: "Career" },
  { href: "/courses", label: "Courses" },
  { href: "/internships", label: "Internships" },
  { href: "/jobs", label: "Jobs" },
  { href: "/study-abroad", label: "Study Abroad" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="shrink-0">
          <EllowringLogo variant="horizontal" size="md" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "text-sm font-medium transition-colors",
                pathname === l.href ? "text-[#2563EB]" : "text-slate-600 hover:text-slate-900",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href={dashboardPath(user.role)}
                className="rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white"
              >
                Dashboard
              </Link>
              <button onClick={logout} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-slate-700">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-medium">
                {l.label}
              </Link>
            ))}
            <Link
              href={user ? dashboardPath(user.role) : "/register"}
              className="mt-2 rounded-xl bg-[#2563EB] px-4 py-2 text-center text-sm font-semibold text-white"
            >
              {user ? "Dashboard" : "Get Started"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
