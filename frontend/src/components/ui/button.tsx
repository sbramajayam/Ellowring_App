"use client";

import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 font-semibold text-[var(--text-secondary)] hover:bg-[var(--muted)]",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--danger)] px-4 py-2.5 font-semibold text-white shadow-sm hover:opacity-90",
};

const sizeClass: Record<Size, string> = {
  sm: "!px-3 !py-1.5 text-xs",
  md: "text-sm",
  lg: "!px-5 !py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={clsx(variantClass[variant], sizeClass[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
