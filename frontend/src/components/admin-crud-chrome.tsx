"use client";

import { Loader2, Plus, Search, X } from "lucide-react";
import clsx from "clsx";
import { ReactNode } from "react";

export type AdminStat = {
  label: string;
  value: string | number;
  sub?: string;
  tint?: string;
};

export function AdminPageHeader({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-[#0B1F3A] lg:text-[28px]">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(15,61,222,0.25)]"
        >
          <Plus size={16} /> {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export function AdminStatRow({ stats }: { stats: AdminStat[] }) {
  return (
    <div className={clsx("grid gap-3", stats.length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3")}>
      {stats.map((k) => (
        <div key={k.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{k.label}</p>
          <p className="mt-1 font-display text-2xl font-extrabold text-[#0B1F3A]">{k.value}</p>
          {k.sub ? (
            <p
              className={clsx(
                "mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
                k.tint || "text-[#0F3DDE] bg-blue-50",
              )}
            >
              {k.sub}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function AdminToolbar({
  q,
  onQ,
  placeholder = "Search…",
  filters,
}: {
  q: string;
  onQ: (v: string) => void;
  placeholder?: string;
  filters?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input className="input w-full pl-10" placeholder={placeholder} value={q} onChange={(e) => onQ(e.target.value)} />
      </div>
      {filters}
    </div>
  );
}

export function AdminFilterPills<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => onChange(f.id)}
          className={clsx(
            "rounded-full px-3 py-1.5 text-xs font-bold transition",
            value === f.id
              ? "bg-[#0F3DDE] text-white shadow-sm"
              : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100",
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export function AdminFlash({ loading, error, msg, loadingLabel = "Loading…" }: {
  loading?: boolean;
  error?: string;
  msg?: string;
  loadingLabel?: string;
}) {
  return (
    <>
      {loading ? (
        <p className="inline-flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="animate-spin" size={16} /> {loadingLabel}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">{error}</p>
      ) : null}
      {msg ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">{msg}</p>
      ) : null}
    </>
  );
}

export function AdminFormPanel({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 lg:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-[#0B1F3A]">{title}</h2>
        <button type="button" className="rounded-full p-2 text-slate-400 hover:bg-slate-50" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      {children}
    </section>
  );
}

export function AdminTableCard({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function statusPill(active: boolean, labels?: { on: string; off: string }) {
  const on = labels?.on || "Active";
  const off = labels?.off || "Inactive";
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold",
        active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500",
      )}
    >
      {active ? on : off}
    </span>
  );
}
