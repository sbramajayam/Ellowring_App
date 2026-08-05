"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import { ChevronDown, LogOut, Menu, Search, Bell, X } from "lucide-react";
import clsx from "clsx";
import { Role, useAuth } from "@/lib/auth-context";
import { EllowringLogo } from "@/components/ellowring-logo";

export type RoleNavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  exact?: boolean;
};

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

const roleLabels: Record<Role, string> = {
  STUDENT: "Student",
  COLLEGE: "College",
  COMPANY: "HR / Company",
  TRAINING: "Training Partner",
  PARTNER: "Channel Partner",
  ADMIN: "Admin",
};

export function RoleShell({
  role,
  nav,
  searchPlaceholder = "Search…",
  children,
}: {
  role: Role;
  nav: RoleNavItem[];
  searchPlaceholder?: string;
  children: React.ReactNode;
}) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== role)) {
      router.replace("/");
    }
  }, [user, loading, role, router]);

  useEffect(() => setOpen(false), [pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FB] text-slate-500">
        Loading dashboard…
      </div>
    );
  }

  const firstName = user.name.replace(/^Mr\.?\s+/i, "").trim().split(/\s+/)[0] || "User";

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          className={clsx(
            "fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r border-slate-200/90 bg-white transition-transform lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="relative flex flex-col items-center border-b border-slate-100 px-3 py-4">
            <EllowringLogo variant="horizontal" size="md" />
            <button
              type="button"
              className="absolute right-2 top-3 shrink-0 rounded-lg p-1.5 hover:bg-slate-100 lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 py-3">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href, item.exact);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition",
                    active
                      ? "bg-[#2563EB] text-white shadow-sm shadow-blue-600/30"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <Icon
                    size={17}
                    strokeWidth={active ? 2.4 : 1.9}
                    className={active ? "text-white" : "text-slate-400"}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="mx-3 mb-4 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
          >
            <LogOut size={16} /> Logout
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
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200/90 bg-white px-4 md:px-6">
            <button
              type="button"
              className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <Link href="/" className="hidden shrink-0 lg:block" aria-label="Ellowring home">
              <EllowringLogo variant="horizontal" size="md" />
            </Link>
            <Link href="/" className="shrink-0 lg:hidden" aria-label="Ellowring home">
              <EllowringLogo variant="horizontal" size="sm" />
            </Link>

            <div className="relative mx-auto hidden min-w-0 w-full max-w-xl flex-1 md:block">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-full border border-slate-200 bg-[#F4F7FB] py-2.5 pl-10 pr-14 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                ⌘K
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                className="relative rounded-full p-2.5 text-slate-500 hover:bg-slate-100"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              </button>
              <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />
              <div className="flex items-center gap-2 py-1 pl-1 pr-2 sm:pr-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                  {firstName.slice(0, 1).toUpperCase()}
                </div>
                <div className="hidden leading-tight sm:block">
                  <p className="text-sm font-semibold text-slate-800">
                    Hi, {firstName} <span aria-hidden>👋</span>
                  </p>
                  <p className="text-[11px] text-slate-500">{roleLabels[role]}</p>
                </div>
                <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function KpiGrid({
  items,
}: {
  items: { label: string; value: string | number; sub?: string; tint: string }[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((k) => (
        <div key={k.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className={`mb-3 inline-flex rounded-xl px-2.5 py-1 text-[11px] font-bold ${k.tint}`}>
            Phase 2
          </div>
          <p className="text-xs font-medium text-slate-500">{k.label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{k.value}</p>
          {k.sub && <p className="mt-0.5 text-xs text-slate-400">{k.sub}</p>}
        </div>
      ))}
    </div>
  );
}

export function ModuleCard({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((c) => (
              <th key={c} className="px-4 py-3 font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-50 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
