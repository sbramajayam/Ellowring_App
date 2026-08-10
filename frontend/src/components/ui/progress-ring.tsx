"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { ReactNode } from "react";

export function ProgressRing({
  value,
  size = 72,
  stroke = 7,
  label,
  className,
  trackColor = "#E2E8F0",
  progressColor = "#0F3DDE",
  light = false,
  gradient,
  center,
  valueClassName,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  className?: string;
  trackColor?: string;
  progressColor?: string;
  light?: boolean;
  /** Optional SVG gradient stops for ring stroke */
  gradient?: { id: string; from: string; to: string };
  center?: ReactNode;
  valueClassName?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;
  const gradId = gradient?.id ?? `pr-${size}-${Math.round(pct)}`;
  const strokePaint = gradient
    ? `url(#${gradId})`
    : light
      ? "#34D399"
      : progressColor;

  return (
    <div className={clsx("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {gradient ? (
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradient.from} />
              <stop offset="100%" stopColor={gradient.to} />
            </linearGradient>
          </defs>
        ) : null}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={light ? "rgba(255,255,255,0.25)" : trackColor}
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={strokePaint}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {center ? (
          center
        ) : (
          <>
            <span
              className={clsx(
                "font-extrabold leading-none",
                size >= 100 ? "text-[22px]" : "text-sm",
                light ? "text-white" : "text-slate-900",
                valueClassName,
              )}
            >
              {Math.round(pct)}%
            </span>
            {label ? (
              <span className={clsx("mt-0.5 text-[9px] font-medium", light ? "text-blue-100" : "text-slate-400")}>
                {label}
              </span>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
