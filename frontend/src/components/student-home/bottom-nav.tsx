"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Briefcase,
  Compass,
  Home,
  User,
} from "lucide-react";
import clsx from "clsx";

/** Collage bottom nav — same on all student tracks */
const NAV = [
  { href: "/dashboard/student", label: "Home", icon: Home, exact: true },
  { href: "/dashboard/student/learn", label: "Learn", icon: BookOpen },
  { href: "/dashboard/student/explore", label: "Explore", icon: Compass },
  { href: "/dashboard/student/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/dashboard/student/profile", label: "Profile", icon: User },
];

export function StudentBottomNav({ variant: _variant }: { variant?: "school" | "competitive" | "college" }) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/90 bg-white px-1.5 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5 lg:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-0.5">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href ||
              pathname.startsWith(`${item.href}/`) ||
              (item.href === "/dashboard/student/learn" &&
                ["/dashboard/student/courses", "/dashboard/student/career", "/dashboard/student/mock-tests", "/dashboard/student/ai-assistant"].some(
                  (p) => pathname === p || pathname.startsWith(`${p}/`),
                )) ||
              (item.href === "/dashboard/student/explore" &&
                ["/dashboard/student/projects", "/dashboard/student/colleges", "/dashboard/student/study-abroad"].some(
                  (p) => pathname === p || pathname.startsWith(`${p}/`),
                )) ||
              (item.href === "/dashboard/student/opportunities" &&
                ["/dashboard/student/jobs", "/dashboard/student/internships", "/dashboard/student/notifications"].some(
                  (p) => pathname === p || pathname.startsWith(`${p}/`),
                )) ||
              (item.href === "/dashboard/student/profile" &&
                ["/dashboard/student/resume", "/dashboard/student/certificates", "/dashboard/student/wallet", "/dashboard/student/settings"].some(
                  (p) => pathname === p || pathname.startsWith(`${p}/`),
                ));
          return (
            <li key={item.label} className="min-w-0 flex-1">
              <Link
                href={item.href}
                className={clsx(
                  "flex flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 text-[9px] font-semibold transition",
                  active ? "bg-[#EFF6FF] text-[#0F3DDE]" : "text-slate-400 hover:text-slate-600",
                )}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 1.75} />
                <span className="max-w-full truncate">{item.label}</span>
                {active ? <span className="mt-0.5 h-1 w-1 rounded-full bg-[#0F3DDE]" /> : <span className="mt-0.5 h-1 w-1" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
