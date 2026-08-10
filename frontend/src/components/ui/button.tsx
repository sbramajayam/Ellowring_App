"use client";

import clsx from "clsx";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "link";
type Size = "sm" | "md" | "lg" | "icon";

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-full px-4 font-semibold text-[var(--color-ink)] hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] disabled:opacity-40",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-danger-icon)] px-4 font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] disabled:opacity-40",
  link: "inline-flex items-center gap-1 bg-transparent p-0 font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] disabled:opacity-40",
};

const sizeClass: Record<Size, string> = {
  sm: "!min-h-8 !px-3.5 !py-1.5 text-xs",
  md: "!min-h-10 text-sm",
  lg: "!min-h-12 !px-6 !py-3 text-base",
  icon: "!h-10 !w-10 !min-h-0 !p-0",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  loading = false,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      className={clsx(variantClass[variant], sizeClass[size], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
      {loading ? <span className="sr-only">Loading</span> : null}
      {children}
    </button>
  );
}
