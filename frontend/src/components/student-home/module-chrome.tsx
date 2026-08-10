"use client";

import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import type { ReactNode } from "react";
import clsx from "clsx";

/** Collage-matching page chrome: full width, breadcrumb, title, filters, actions */
export function StudentModuleChrome({
  title,
  description,
  breadcrumbs = [{ label: "Dashboard", href: "/dashboard/student" }],
  actions,
  filters,
  children,
}: {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="w-full space-y-5 p-4 lg:space-y-6 lg:p-6 xl:px-10" style={{ maxWidth: "none" }}>
      <nav className="flex flex-wrap items-center gap-1 text-[12px] text-slate-400">
        {breadcrumbs.map((b, i) => (
          <span key={`${b.label}-${i}`} className="inline-flex items-center gap-1">
            {i > 0 ? <ChevronRight size={12} /> : null}
            {b.href ? (
              <Link href={b.href} className="font-medium hover:text-[#0F3DDE]">
                {b.label}
              </Link>
            ) : (
              <span className="font-semibold text-slate-600">{b.label}</span>
            )}
          </span>
        ))}
        <ChevronRight size={12} />
        <span className="font-semibold text-slate-700">{title}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#0B1F3A] lg:text-[28px]">
            {title}
          </h1>
          {description ? <p className="mt-1 max-w-3xl text-sm text-slate-500">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>

      {filters ? (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100 lg:gap-3 lg:p-3.5">
          {filters}
        </div>
      ) : null}

      {children}
    </div>
  );
}

export function ModuleSearchInput({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative min-w-[180px] flex-1">
      <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#0F3DDE] focus:bg-white focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

export function ModuleSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label?: string;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-slate-600">
      {label ? <span className="hidden text-[11px] font-bold uppercase tracking-wide text-slate-400 sm:inline">{label}</span> : null}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0F3DDE]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function StudentDataTable({
  columns,
  children,
  empty,
}: {
  columns: string[];
  children: ReactNode;
  empty?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((c) => (
                <th key={c} className="whitespace-nowrap px-4 py-3.5">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>
      {empty}
    </div>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "green" | "amber" | "red" | "blue" | "slate";
  children: ReactNode;
}) {
  const map = {
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-rose-50 text-rose-700",
    blue: "bg-blue-50 text-[#0F3DDE]",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={clsx("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold", map[tone])}>
      {children}
    </span>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(15,61,222,0.22)] hover:bg-[#0C32B8] disabled:opacity-60"
    >
      {children}
    </button>
  );
}
