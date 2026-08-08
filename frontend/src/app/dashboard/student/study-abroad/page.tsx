"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Globe2, Loader2 } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { api } from "@/lib/api";
import { labelOf, labelOfPath, moneyOf } from "@/lib/labels";

type Program = Record<string, unknown>;

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api<Program[]>("/study-abroad")
      .then((data) => {
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <StudentShell>
      <div className="space-y-5 p-4 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
              Study Abroad
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

        {loading && (
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Loading programmes…
          </p>
        )}
        {error && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((p) => {
              const title = labelOf(p.name ?? p.title, "Programme");
              const university = labelOf(p.university, "Partner university");
              const country = labelOfPath(p, "university.country", labelOf(p.country, "International"));
              const tuition = moneyOf(p.tuition ?? p.tuitionFee);
              const duration = labelOf(p.duration, "—");
              const intake = labelOf(p.intake, "Rolling");
              const currency = labelOf(p.currency, "USD");
              return (
                <article
                  key={String(p.id)}
                  className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                      <Globe2 size={18} />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900">{title}</h3>
                      <p className="text-xs text-slate-500">
                        {university} · {country}
                      </p>
                    </div>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="rounded-lg bg-slate-50 p-2">
                      <dt className="text-slate-400">Tuition</dt>
                      <dd className="font-semibold">
                        {tuition === "—" ? "—" : `${currency} ${tuition}`}
                      </dd>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                      <dt className="text-slate-400">Duration</dt>
                      <dd className="font-semibold">{duration}</dd>
                    </div>
                    <div className="col-span-2 rounded-lg bg-slate-50 p-2">
                      <dt className="text-slate-400">Intake</dt>
                      <dd className="font-semibold">{intake}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Shortlist & book counsellor
                  </button>
                </article>
              );
            })}
            {items.length === 0 && (
              <p className="col-span-full rounded-2xl bg-white p-8 text-center text-sm text-slate-500 ring-1 ring-slate-100">
                No abroad programmes published yet.
              </p>
            )}
          </div>
        )}
      </div>
    </StudentShell>
  );
}
