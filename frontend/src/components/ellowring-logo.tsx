"use client";

import clsx from "clsx";

/**
 * Official Ellowring brand mark — WWW / dashboard header lockup:
 * 5 ring segments with white gaps: Yellow · Red · Purple · Blue · Green
 * Text: ELLOWRING / SOFTWARE SOLUTIONS
 */

export function EllowringMark({ className = "h-10 w-10" }: { className?: string }) {
  // Equal 5ths (~72°) with ~4° white gaps — matches Channel Partner / student header art
  const colors = [
    { fill: "#F5C518", start: -90 }, // Yellow — top
    { fill: "#E53935", start: -18 }, // Red
    { fill: "#5B2EEA", start: 54 }, // Purple
    { fill: "#1E88E5", start: 126 }, // Blue
    { fill: "#43A047", start: 198 }, // Green
  ];
  const cx = 32;
  const cy = 32;
  const outer = 30;
  const inner = 12.5;
  const sweep = 68;

  function polar(r: number, deg: number) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function segment(startDeg: number) {
    const end = startDeg + sweep;
    const o1 = polar(outer, startDeg);
    const o2 = polar(outer, end);
    const i2 = polar(inner, end);
    const i1 = polar(inner, startDeg);
    return `M ${o1.x} ${o1.y} A ${outer} ${outer} 0 0 1 ${o2.x} ${o2.y} L ${i2.x} ${i2.y} A ${inner} ${inner} 0 0 0 ${i1.x} ${i1.y} Z`;
  }

  return (
    <svg viewBox="0 0 64 64" className={clsx("shrink-0", className)} aria-hidden>
      <circle cx={cx} cy={cy} r={inner - 0.75} fill="#fff" />
      {colors.map((c) => (
        <path key={c.fill} d={segment(c.start)} fill={c.fill} />
      ))}
    </svg>
  );
}

type LogoProps = {
  className?: string;
  variant?: "stacked" | "horizontal" | "mark";
  dark?: boolean;
  size?: "sm" | "md" | "lg";
};

export function EllowringLogo({
  className,
  variant = "horizontal",
  dark = false,
  size = "md",
}: LogoProps) {
  const markSize =
    size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-9 w-9";

  if (variant === "mark") {
    return <EllowringMark className={clsx(markSize, className)} />;
  }

  if (variant === "stacked") {
    return (
      <div
        className={clsx("inline-flex flex-col items-center text-center", className)}
        aria-label="Ellowring Software Solutions"
      >
        <EllowringMark className={size === "lg" ? "h-14 w-14" : "h-12 w-12"} />
        <div
          className={clsx(
            "mt-1.5 text-[15px] font-extrabold tracking-[0.06em]",
            dark ? "text-white" : "text-black",
          )}
        >
          ELLOWRING
        </div>
        <div
          className={clsx(
            "text-[8px] font-semibold uppercase tracking-[0.2em]",
            dark ? "text-slate-300" : "text-black",
          )}
        >
          Software Solutions
        </div>
      </div>
    );
  }

  // Horizontal — same lockup as Channel Partner / student dashboard header
  return (
    <div
      className={clsx("flex items-center gap-2.5", className)}
      aria-label="Ellowring Software Solutions"
    >
      <EllowringMark className={markSize} />
      <div className="min-w-0 leading-[1.05]">
        <div
          className={clsx(
            "truncate font-extrabold tracking-[0.02em]",
            size === "sm" ? "text-[13px]" : size === "lg" ? "text-[18px]" : "text-[15px]",
            dark ? "text-white" : "text-black",
          )}
        >
          ELLOWRING
        </div>
        <div
          className={clsx(
            "truncate font-semibold uppercase",
            size === "sm" ? "text-[7px] tracking-[0.16em]" : size === "lg" ? "text-[9px] tracking-[0.22em]" : "text-[8px] tracking-[0.2em]",
            dark ? "text-slate-300" : "text-black",
          )}
        >
          Software Solutions
        </div>
      </div>
    </div>
  );
}
