"use client";

import { ArrowLeft } from "lucide-react";
import { EllowringLogo } from "@/components/ellowring-logo";

/** Shared illustration for Sign In / Create Account split layout. */
export function AuthHeroArt() {
  return (
    <svg
      viewBox="0 0 420 360"
      className="mx-auto h-auto w-full max-w-[380px]"
      aria-hidden
    >
      <path
        d="M20 300 C90 270 150 320 220 295 C290 270 350 310 400 285 L400 360 L20 360 Z"
        fill="#BFDBFE"
        opacity="0.55"
      />
      <path
        d="M0 320 C80 300 140 340 210 318 C280 296 340 335 420 310 L420 360 L0 360 Z"
        fill="#93C5FD"
        opacity="0.45"
      />
      <ellipse cx="55" cy="210" rx="28" ry="48" fill="#60A5FA" opacity="0.35" transform="rotate(-18 55 210)" />
      <ellipse cx="365" cy="195" rx="32" ry="54" fill="#3B82F6" opacity="0.28" transform="rotate(22 365 195)" />
      <circle cx="95" cy="120" r="4" fill="#FBBF24" />
      <circle cx="330" cy="95" r="3.5" fill="#60A5FA" />
      <path d="M108 108 l6 6 M108 114 l6 -6" stroke="#FBBF24" strokeWidth="2" />
      <path d="M340 80 l5 5 M340 85 l5 -5" stroke="#3B82F6" strokeWidth="2" />
      <rect x="48" y="118" width="130" height="92" rx="10" fill="#1E3A8A" />
      <rect x="56" y="126" width="114" height="68" rx="4" fill="#EFF6FF" />
      <circle cx="88" cy="158" r="18" fill="#93C5FD" />
      <path d="M88 158 L88 140 A18 18 0 0 1 103 150 Z" fill="#2563EB" />
      <path d="M88 158 L103 150 A18 18 0 0 1 98 172 Z" fill="#F59E0B" />
      <polyline
        points="118,175 132,155 144,165 162,140"
        fill="none"
        stroke="#2563EB"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="95" y="212" width="36" height="10" rx="2" fill="#1E3A8A" />
      <rect x="78" y="222" width="70" height="6" rx="2" fill="#64748B" opacity="0.5" />
      <circle cx="210" cy="132" r="22" fill="#FDE68A" />
      <path
        d="M188 158 C188 148 198 142 210 142 C222 142 232 148 232 158 L236 230 C236 242 226 250 210 250 C194 250 184 242 184 230 Z"
        fill="#FACC15"
      />
      <rect x="196" y="168" width="28" height="22" rx="3" fill="#1E293B" />
      <path d="M178 250 L178 310 L198 310 L202 258 L218 258 L222 310 L242 310 L242 250 Z" fill="#334155" />
      <rect x="188" y="188" width="44" height="28" rx="3" fill="#94A3B8" />
      <rect x="192" y="192" width="36" height="20" rx="2" fill="#E0F2FE" />
      <rect x="184" y="216" width="52" height="5" rx="1.5" fill="#64748B" />
      <rect x="278" y="130" width="72" height="128" rx="12" fill="#1E3A8A" />
      <rect x="286" y="142" width="56" height="96" rx="6" fill="#F8FAFC" />
      <circle cx="314" cy="188" r="22" fill="#DBEAFE" />
      <path
        d="M314 172 C306 172 300 176 300 184 V196 C300 208 314 216 314 216 C314 216 328 208 328 196 V184 C328 176 322 172 314 172 Z"
        fill="#2563EB"
      />
      <path
        d="M306 190 L312 196 L324 182"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="304" y="248" width="20" height="4" rx="2" fill="#64748B" opacity="0.6" />
    </svg>
  );
}

/** Dark navy shell + white split card used by Sign In and Create Account. */
export function AuthSplitShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B2A6B] px-4 py-10 sm:px-6 sm:py-14">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 15% 20%, #1E4DB7 0%, transparent 55%),
            radial-gradient(ellipse 80% 60% at 90% 85%, #153A8F 0%, transparent 50%),
            radial-gradient(circle at 70% 25%, rgba(37, 99, 235, 0.35) 0%, transparent 40%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute -left-24 top-[-10%] h-[70vmin] w-[70vmin] rounded-full border-[48px] border-[#133A8C]/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-[-15%] h-[75vmin] w-[75vmin] rounded-full border-[56px] border-[#153F96]/35"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-[920px]">
        <a
          href="/"
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[13px] font-semibold text-white/90 backdrop-blur-sm ring-1 ring-white/20 transition hover:bg-white/15 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to website
        </a>

        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_rgba(7,20,60,0.45)] sm:rounded-[32px]">
          <div className="grid lg:grid-cols-2">
            <div className="relative flex flex-col bg-gradient-to-b from-[#F8FBFF] to-white px-7 pb-8 pt-7 sm:px-10 sm:pt-9">
              <EllowringLogo variant="stacked" size="md" />
              <div className="mt-6 flex flex-1 items-center justify-center py-4 sm:mt-4 sm:py-8">
                <div className="w-full">
                  <AuthHeroArt />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center border-t border-slate-100 px-7 py-9 sm:px-12 sm:py-12 lg:border-l lg:border-t-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const authUnderlineInput =
  "mt-2 w-full border-0 border-b border-slate-200 bg-transparent py-2.5 text-[15px] text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#2563EB]";
