"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Briefcase,
  Building2,
  ClipboardCheck,
  Compass,
  Globe2,
  Home,
  User,
} from "lucide-react";
import clsx from "clsx";

type Variant = "school" | "competitive" | "college";

export function StudentBottomNav({ variant = "school" }: { variant?: Variant }) {
  const pathname = usePathname();

  const nav =
    variant === "college"
      ? [
          { href: "/dashboard/student", label: "Home", icon: Home, exact: true },
          { href: "/dashboard/student/courses", label: "Learn", icon: BookOpen },
          { href: "/dashboard/student/internships", label: "Internships", icon: Briefcase },
          { href: "/dashboard/student/jobs", label: "Jobs", icon: Building2 },
          { href: "/dashboard/student/profile", label: "Profile", icon: User },
        ]
      : variant === "competitive"
        ? [
            { href: "/dashboard/student", label: "Home", icon: Home, exact: true },
            { href: "/dashboard/student/coaching", label: "Exams", icon: BookOpen },
            { href: "/dashboard/student/mock-tests", label: "Tests", icon: ClipboardCheck },
            { href: "/dashboard/student/courses", label: "Current Affairs", icon: Globe2 },
            { href: "/dashboard/student/profile", label: "Profile", icon: User },
          ]
        : [
            { href: "/dashboard/student", label: "Home", icon: Home, exact: true },
            { href: "/dashboard/student/courses", label: "Learn", icon: BookOpen },
            { href: "/dashboard/student/mock-tests", label: "Tests", icon: ClipboardCheck },
            { href: "/dashboard/student/colleges", label: "Explore", icon: Compass },
            { href: "/dashboard/student/profile", label: "Profile", icon: User },
          ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/90 bg-white px-1.5 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5 lg:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-0.5">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
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
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
