"use client";

import { BarChart3, Network, Shield } from "lucide-react";
import { EllowringMark } from "@/components/ellowring-logo";

/** Dashboard footer brand bar — padding, borders, dividers matched to WWW mockup */
export function StudentDashboardFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col lg:flex-row lg:items-stretch">
        {/* 1 — Logo */}
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4 lg:min-w-[210px] lg:shrink-0 lg:border-b-0 lg:border-r lg:border-slate-200 lg:px-6 lg:py-5">
          <EllowringMark className="h-9 w-9" />
          <div className="min-w-0 leading-[1.05]">
            <div className="text-[14px] font-extrabold tracking-[0.02em] text-[#0B1F3A]">
              ELLOWRING
            </div>
            <div className="text-[7.5px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Software Solutions
            </div>
          </div>
        </div>

        {/* 2 — AI-Powered */}
        <div className="flex flex-1 items-center gap-3 border-b border-slate-100 px-5 py-4 lg:justify-center lg:border-b-0 lg:border-r lg:border-slate-200 lg:px-5 lg:py-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C4B5FD]">
            <Network size={18} strokeWidth={2.5} className="text-white" />
          </span>
          <div className="min-w-0 text-[12px] leading-snug">
            <p className="font-bold text-[#0B1F3A]">AI-Powered</p>
            <p className="text-slate-500">Smart Recommendations</p>
          </div>
        </div>

        {/* 3 — Secure */}
        <div className="flex flex-1 items-center gap-3 border-b border-slate-100 px-5 py-4 lg:justify-center lg:border-b-0 lg:border-r lg:border-slate-200 lg:px-5 lg:py-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#93C5FD]">
            <Shield size={18} strokeWidth={2.5} className="text-white" />
          </span>
          <div className="min-w-0 text-[12px] leading-snug">
            <p className="font-bold text-[#0B1F3A]">Secure &amp; Reliable</p>
            <p className="text-slate-500">Enterprise Grade Security</p>
          </div>
        </div>

        {/* 4 — All-in-One */}
        <div className="flex flex-1 items-center gap-3 border-b border-slate-100 px-5 py-4 lg:justify-center lg:border-b-0 lg:border-r lg:border-slate-200 lg:px-5 lg:py-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#93C5FD]">
            <BarChart3 size={18} strokeWidth={2.5} className="text-white" />
          </span>
          <div className="min-w-0 text-[12px] leading-snug">
            <p className="font-bold text-[#0B1F3A]">All-in-One Platform</p>
            <p className="text-slate-500">Learn. Prepare. Build. Get Hired.</p>
          </div>
        </div>

        {/* 5 — Tagline */}
        <div className="flex items-center px-5 py-4 text-[12px] leading-snug text-slate-500 lg:w-[280px] lg:shrink-0 lg:px-6 lg:py-5">
          <div>
            <p>From 11th Standard to First Job – Everything in One Platform.</p>
            <p className="mt-1 text-[13px] font-extrabold tracking-tight">
              <span className="text-[#1E88E5]">Learn.</span>{" "}
              <span className="text-[#43A047]">Prepare.</span>{" "}
              <span className="text-[#5B2EEA]">Build.</span>{" "}
              <span className="text-[#E53935]">Get Hired.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
