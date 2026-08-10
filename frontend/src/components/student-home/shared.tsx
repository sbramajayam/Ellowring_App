"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";

export function SectionHeader({
  title,
  href,
  badge,
  actionLabel = "View All >",
}: {
  title: string;
  href?: string;
  badge?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2 lg:mb-4">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <h2 className="font-display text-[15px] font-extrabold text-[#0B1F3A] lg:text-[18px]">{title}</h2>
        {badge ? (
          <span className="rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-[9px] font-bold text-[#15803D] lg:text-[10px]">
            {badge}
          </span>
        ) : null}
      </div>
      {href && actionLabel ? (
        <Link href={href} className="shrink-0 text-[12px] font-semibold text-[#0F3DDE] lg:text-[13px]">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

/** School Quick Access — 2 cols mobile → 3 tablet → 6 desktop (full page) */
export function QuickAccessPaleGrid({
  items,
}: {
  items: { label: string; desc: string; href: string; icon: LucideIcon; bg: string; fg: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-[16px] bg-white p-3.5 text-center shadow-[0_2px_10px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 transition hover:-translate-y-0.5 hover:shadow-md lg:p-4"
          >
            <span
              className={clsx(
                "mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-full lg:h-14 lg:w-14",
                item.bg,
                item.fg,
              )}
            >
              <Icon size={22} strokeWidth={2} />
            </span>
            <p className="font-display text-[12.5px] font-bold text-[#0B1F3A] lg:text-[13px]">{item.label}</p>
            <p className="mt-0.5 text-[10px] leading-snug text-slate-500 lg:text-[11px]">{item.desc}</p>
          </Link>
        );
      })}
    </div>
  );
}

export function QuickAccessCircles({
  items,
}: {
  items: { label: string; desc?: string; href: string; icon: LucideIcon; bg: string; fg: string }[];
}) {
  return (
    <div className="grid grid-cols-3 gap-x-2 gap-y-4 md:grid-cols-6">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1.5 text-center">
            <span className={clsx("flex h-14 w-14 items-center justify-center rounded-full shadow-sm", item.bg, item.fg)}>
              <Icon size={24} />
            </span>
            <span className="font-display text-[11px] font-bold text-slate-800">{item.label}</span>
            {item.desc ? <span className="text-[9px] leading-tight text-slate-400">{item.desc}</span> : null}
          </Link>
        );
      })}
    </div>
  );
}

export function QuickAccessRows({
  items,
}: {
  items: { label: string; desc: string; href: string; icon: LucideIcon; bg: string; fg: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-2.5 rounded-[14px] bg-white p-3 shadow-[0_2px_10px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 transition hover:-translate-y-0.5 hover:shadow-md lg:p-4"
          >
            <span className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-full lg:h-12 lg:w-12", item.bg, item.fg)}>
              <Icon size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[12px] font-bold leading-tight text-[#0B1F3A] lg:text-[14px]">{item.label}</p>
              <p className="text-[9px] text-slate-500 lg:text-[11px]">{item.desc}</p>
            </div>
            <ChevronRight size={14} className="shrink-0 text-slate-300" />
          </Link>
        );
      })}
    </div>
  );
}

export function GoalChip({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex max-w-[200px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-[11px] font-semibold text-slate-700 shadow-sm lg:px-4 lg:py-2.5 lg:text-[12px]"
    >
      {icon}
      <span className="truncate">{label}</span>
      <span className="text-slate-400">▾</span>
    </button>
  );
}

export function CarouselDots({ active = 0, count = 4 }: { active?: number; count?: number }) {
  return (
    <div className="mt-3 flex justify-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={clsx("h-1.5 rounded-full", i === active ? "w-4 bg-[#0F3DDE]" : "w-1.5 bg-slate-300")}
        />
      ))}
    </div>
  );
}

export function RocketDecor({ className }: { className?: string }) {
  return (
    <svg className={className} width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
      <path
        d="M36 8c8 10 12 22 12 34 0 4-1 8-3 11H27c-2-3-3-7-3-11 0-12 4-24 12-34Z"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      <circle cx="36" cy="28" r="4" stroke="white" strokeOpacity="0.4" strokeWidth="2" />
      <path
        d="M27 48l-6 10M45 48l6 10M33 53v12M39 53v12"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Shared full-page dashboard shell — ALWAYS edge-to-edge */
export function DashboardPage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="!w-full !max-w-none min-h-full bg-[#FAFBFC] font-sans text-[#0B1F3A]"
      style={{ width: "100%", maxWidth: "none" }}
    >
      <div className="!w-full !max-w-none space-y-5 pb-4 lg:space-y-6" style={{ width: "100%", maxWidth: "none" }}>
        {children}
      </div>
    </div>
  );
}
