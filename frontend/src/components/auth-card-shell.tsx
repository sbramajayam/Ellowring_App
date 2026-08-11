"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const logoSrc = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/brand/ellowring-logo-lockup.png`;

/** Centered white auth card on soft blue wave background (Sign In mock). */
export function AuthCardShell({
  children,
  backHref = "/",
}: {
  children: React.ReactNode;
  backHref?: string;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#E8F1FF] px-4 py-10 sm:px-6">
      {/* Soft wave atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 55% at 50% -10%, rgba(15,61,222,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 70% 45% at 100% 100%, rgba(59,130,246,0.16) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 0% 80%, rgba(147,197,253,0.35) 0%, transparent 45%)
          `,
        }}
        aria-hidden
      />
      <svg
        className="pointer-events-none absolute bottom-0 left-0 w-full opacity-40"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0,120 C240,180 480,40 720,100 C960,160 1200,60 1440,120 L1440,220 L0,220 Z"
          fill="#BFDBFE"
        />
        <path
          d="M0,150 C300,90 600,190 900,130 C1100,90 1300,160 1440,140 L1440,220 L0,220 Z"
          fill="#93C5FD"
          opacity="0.55"
        />
      </svg>

      <div className="relative z-10 w-full max-w-[420px]">
        <Link
          href={backHref}
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0F3DDE] transition hover:text-[#0B32B8]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to website
        </Link>

        <div className="rounded-[22px] bg-white px-7 py-8 shadow-[0_18px_50px_rgba(15,61,222,0.12)] ring-1 ring-[#D6E4FF] sm:px-9 sm:py-10">
          {/* Official WWW lockup — glossy ring + ELLOWRING SOFTWARE SOLUTIONS */}
          <div className="mb-6 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="Ellowring Software Solutions"
              className="h-[92px] w-auto max-w-[220px] object-contain object-center"
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export const authCardInput =
  "w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-3.5 text-[14px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0F3DDE] focus:ring-2 focus:ring-[#0F3DDE]/15";

export const authCardPrimaryBtn =
  "inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#0F3DDE] text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(15,61,222,0.28)] transition hover:bg-[#0B32B8] disabled:cursor-not-allowed disabled:opacity-60";
