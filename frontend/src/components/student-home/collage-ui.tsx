"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Bot, Sparkles } from "lucide-react";
import clsx from "clsx";
import type { ReactNode } from "react";

export function CollagePage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx("w-full space-y-5 pb-24 p-4 lg:space-y-6 lg:p-6 lg:pb-8 xl:px-10", className)}>
      {children}
    </div>
  );
}

export function CollageTitle({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="flex flex-wrap items-center gap-2 font-display text-[22px] font-extrabold tracking-tight text-[#0B1F3A] lg:text-[28px]">
          {Icon ? (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#0F3DDE]">
              <Icon size={18} />
            </span>
          ) : null}
          {title}
          <Sparkles size={16} className="text-[#0F3DDE]" />
        </h1>
        {subtitle ? <p className="mt-1 text-[13px] text-slate-500 lg:text-sm">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function BlueHero({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={clsx(
        "relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0B1F3A] via-[#0F3DDE] to-[#3B82F6] p-4 text-white shadow-[0_16px_36px_rgba(15,61,222,0.28)] lg:rounded-[24px] lg:p-6",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      {children}
    </section>
  );
}

export function WhiteCard({
  children,
  className,
  title,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}) {
  return (
    <section className={clsx("rounded-[20px] bg-white p-4 shadow-[0_2px_14px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 lg:rounded-[22px] lg:p-5", className)}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title ? <h2 className="font-display text-[15px] font-extrabold text-[#0B1F3A] lg:text-[17px]">{title}</h2> : <span />}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function ScoreRing({
  value,
  max = 100,
  label,
  size = 88,
  tone = "blue",
  onDark = false,
  percent = false,
}: {
  value: number;
  max?: number;
  label?: string;
  size?: number;
  tone?: "blue" | "green" | "mixed";
  /** Use on BlueHero / navy surfaces so the track stays visible */
  onDark?: boolean;
  /** Show value as e.g. 91% instead of 91/100 */
  percent?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const stroke = tone === "green" ? "#22C55E" : tone === "mixed" ? "url(#ringGrad)" : "#0F3DDE";
  const track = onDark ? "rgba(255,255,255,0.25)" : "#E2E8F0";
  return (
    <div className="relative inline-flex flex-col items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth="8" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-lg font-extrabold leading-none">
          {value}
          {percent ? (
            <span className="text-[12px] font-bold">%</span>
          ) : (
            <span className="text-[11px] font-bold opacity-80">/{max}</span>
          )}
        </span>
        {label ? <span className="mt-0.5 text-[9px] font-semibold opacity-80">{label}</span> : null}
      </div>
    </div>
  );
}

export function ProgressBar({ value, color = "bg-[#0F3DDE]" }: { value: number; color?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className={clsx("h-full rounded-full", color)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function PillButton({
  children,
  href,
  tone = "primary",
  className,
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  href?: string;
  tone?: "primary" | "white" | "outline" | "dark";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  const styles = {
    primary: "bg-[#0F3DDE] text-white shadow-[0_8px_18px_rgba(15,61,222,0.25)]",
    white: "bg-white text-[#0F3DDE]",
    outline: "bg-white text-[#0F3DDE] ring-1 ring-[#BFDBFE]",
    dark: "bg-[#0B1F3A] text-white",
  }[tone];
  const cls = clsx(
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-bold transition hover:opacity-95 disabled:opacity-60",
    styles,
    className,
  );
  if (href) return <Link href={href} className={cls} onClick={onClick}>{children}</Link>;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function AiAssistantChip({ href = "/dashboard/student/ai-assistant" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-[#BFDBFE] bg-white px-3 py-2 text-[12px] font-bold text-[#0F3DDE] shadow-sm"
    >
      <Bot size={15} /> AI Assistant
    </Link>
  );
}

export function FilterChips({
  items,
  value,
  onChange,
}: {
  items: { id: string; label: string; count?: number }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={clsx(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-bold transition",
              active ? "bg-[#0F3DDE] text-white shadow-sm" : "bg-white text-slate-600 ring-1 ring-slate-200",
            )}
          >
            {item.label}
            {item.count != null ? (
              <span className={clsx("rounded-full px-1.5 text-[10px]", active ? "bg-white/20" : "bg-slate-100")}>
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function SoftIcon({
  icon: Icon,
  className = "bg-blue-50 text-[#0F3DDE]",
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <span className={clsx("inline-flex h-10 w-10 items-center justify-center rounded-xl", className)}>
      <Icon size={18} />
    </span>
  );
}
