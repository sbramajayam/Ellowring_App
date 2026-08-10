"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";

const DOMAIN: Record<string, string> = {
  google: "google.com",
  microsoft: "microsoft.com",
  amazon: "amazon.com",
  tcs: "tcs.com",
  infosys: "infosys.com",
  accenture: "accenture.com",
  zoho: "zoho.com",
  wipro: "wipro.com",
};

function domainFor(name: string) {
  const key = name.toLowerCase().replace(/[^a-z]/g, "");
  return DOMAIN[key] || `${key}.com`;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function logoSources(domain: string) {
  return [
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  ];
}

/** Company mark that matches the linked brand — CDN logo with safe fallbacks */
export function BrandLogo({
  name,
  className,
  imgClassName,
  rounded = "full",
}: {
  name: string;
  className?: string;
  imgClassName?: string;
  rounded?: "full" | "xl" | "lg";
}) {
  const sources = useMemo(() => logoSources(domainFor(name)), [name]);
  const [idx, setIdx] = useState(0);
  const round =
    rounded === "full" ? "rounded-full" : rounded === "xl" ? "rounded-xl" : "rounded-lg";

  if (idx >= sources.length) {
    return (
      <span
        className={clsx(
          "inline-flex items-center justify-center bg-[#EFF6FF] text-[11px] font-extrabold text-[#0F3DDE]",
          round,
          className,
        )}
        title={name}
      >
        {initials(name)}
      </span>
    );
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center overflow-hidden bg-white ring-1 ring-slate-100",
        round,
        className,
      )}
      title={name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={sources[idx]}
        src={sources[idx]}
        alt={`${name} logo`}
        className={clsx("h-[72%] w-[72%] object-contain", imgClassName)}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setIdx((i) => i + 1)}
      />
    </span>
  );
}
