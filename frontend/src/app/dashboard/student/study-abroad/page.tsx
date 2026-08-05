"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Globe2 } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { api } from "@/lib/api";

type Program = {
  id: string;
  title: string;
  country: string;
  university?: string;
  tuitionFee?: number;
  duration?: string;
  intake?: string;
};

const milestones = [
  "Profile & eligibility",
  "Shortlist universities",
  "Tests (IELTS / GRE)",
  "SOP / LOR drafts",
  "Applications",
  "Offers & finance",
  "Visa",
  "Pre-departure",
];

export default function StudyAbroadPage() {
  const [items, setItems] = useState<Program[]>([]);

  useEffect(() => {
    api<Program[]>("/study-abroad").then(setItems).catch(console.error);
  }, []);

  return (
    <StudentShell>
      <div className="space-y-5 p-4 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
              Phase 2 · Study Abroad
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Study Abroad</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Country pathways, university shortlists, counsellor workflow and an 8-phase milestone
              tracker with transparent pricing.
            </p>
          </div>
          <Link
            href="/dashboard/student/ai-assistant"
            className="rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white"
          >
            Ask AI for shortlist
          </Link>
        </div>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-sm font-bold text-slate-900">Your milestone tracker</h2>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, i) => (
              <li
                key={m}
                className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 text-sm"
              >
                <CheckCircle2
                  size={16}
                  className={i < 2 ? "text-emerald-500" : "text-slate-300"}
                />
                <span className={i < 2 ? "font-semibold text-slate-800" : "text-slate-500"}>
                  {i + 1}. {m}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(items.length
            ? items
            : [
                {
                  id: "uk-1",
                  title: "MSc Computer Science",
                  country: "United Kingdom",
                  university: "University of Manchester",
                  tuitionFee: 28000,
                  duration: "1 year",
                  intake: "Sep 2026",
                },
                {
                  id: "de-1",
                  title: "M.Eng Automotive",
                  country: "Germany",
                  university: "TU Munich (partner track)",
                  tuitionFee: 1500,
                  duration: "2 years",
                  intake: "Oct 2026",
                },
                {
                  id: "ca-1",
                  title: "PG Diploma Data Analytics",
                  country: "Canada",
                  university: "Seneca College",
                  tuitionFee: 18000,
                  duration: "2 years",
                  intake: "Jan 2027",
                },
              ]
          ).map((p) => (
            <article key={p.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                  <Globe2 size={18} />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-500">
                    {p.university || "Partner university"} · {p.country}
                  </p>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="rounded-lg bg-slate-50 p-2">
                  <dt className="text-slate-400">Tuition</dt>
                  <dd className="font-semibold">₹/£/${p.tuitionFee ?? "—"}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <dt className="text-slate-400">Duration</dt>
                  <dd className="font-semibold">{p.duration || "—"}</dd>
                </div>
                <div className="col-span-2 rounded-lg bg-slate-50 p-2">
                  <dt className="text-slate-400">Intake</dt>
                  <dd className="font-semibold">{p.intake || "Rolling"}</dd>
                </div>
              </dl>
              <button
                type="button"
                className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Shortlist & book counsellor
              </button>
            </article>
          ))}
        </div>
      </div>
    </StudentShell>
  );
}
