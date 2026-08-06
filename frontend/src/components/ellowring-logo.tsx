"use client";

import clsx from "clsx";

/**
 * Official Ellowring brand — uses /brand/ellowring-logo.jpg (same as EWebsite).
 * SVG mark reserved for dark/compact headers where the JPG white plate would clash.
 */

/** Compact 5-segment ring for dark/small headers. */
export function EllowringMark({ className = "h-10 w-10" }: { className?: string }) {
  const colors = [
    { fill: "#F5C518", start: -126 },
    { fill: "#E53935", start: -54 },
    { fill: "#3F2B96", start: 18 },
    { fill: "#1BA7C8", start: 90 },
    { fill: "#43A047", start: 162 },
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

  // Official JPG lockup (mark + ELLOWRING / SOFTWARE SOLUTIONS)
  if (!dark) {
    const h =
      variant === "stacked"
        ? size === "sm"
          ? 72
          : size === "lg"
            ? 120
            : 96
        : size === "sm"
          ? 40
          : size === "lg"
            ? 72
            : 56;

    return (
      <div
        className={clsx(
          variant === "stacked" ? "inline-flex justify-center" : "inline-flex items-center",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/ellowring-logo.jpg"
          alt="Ellowring Software Solutions"
          className="w-auto object-contain"
          style={{ height: h, maxWidth: variant === "horizontal" ? 260 : 200 }}
        />
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div
        className={clsx("inline-flex flex-col items-center text-center", className)}
        aria-label="Ellowring Software Solutions"
      >
        <EllowringMark className={size === "lg" ? "h-14 w-14" : "h-12 w-12"} />
        <div className="mt-1.5 text-[15px] font-extrabold tracking-[0.06em] text-white">
          ELLOWRING
        </div>
        <div className="text-[8px] font-semibold uppercase tracking-[0.2em] text-slate-300">
          Software Solutions
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx("flex items-center gap-2.5", className)}
      aria-label="Ellowring Software Solutions"
    >
      <EllowringMark className={markSize} />
      <div className="min-w-0 leading-[1.05]">
        <div
          className={clsx(
            "truncate font-extrabold tracking-[0.02em] text-white",
            size === "sm" ? "text-[13px]" : size === "lg" ? "text-[18px]" : "text-[15px]",
          )}
        >
          ELLOWRING
        </div>
        <div
          className={clsx(
            "truncate font-semibold uppercase text-slate-300",
            size === "sm"
              ? "text-[7px] tracking-[0.16em]"
              : size === "lg"
                ? "text-[9px] tracking-[0.22em]"
                : "text-[8px] tracking-[0.2em]",
          )}
        >
          Software Solutions
        </div>
      </div>
    </div>
  );
}
