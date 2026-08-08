"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { labelOf, labelOfPath, moneyOf } from "@/lib/labels";

type Program = Record<string, unknown>;

export default function StudyAbroadPage() {
  const [items, setItems] = useState<Program[]>([]);
  useEffect(() => {
    api<Program[]>("/study-abroad").then((data) => setItems(Array.isArray(data) ? data : [])).catch(console.error);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-canopy">Study Abroad</p>
      <h1 className="mt-2 font-display text-4xl font-bold md:text-6xl">World campuses. Clear ROI.</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {items.map((p) => (
          <article key={String(p.id)} className="surface rounded-3xl p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-canopy">
              {labelOfPath(p, "university.country", labelOf(p.country, "International"))}
            </span>
            <h2 className="mt-3 font-display text-xl font-bold text-forest">
              {labelOf(p.university, "University")}
            </h2>
            <p className="mt-1 font-medium">{labelOf(p.name ?? p.program ?? p.title, "Programme")}</p>
            <p className="mt-3 text-slate">{labelOf(p.description, "")}</p>
            <p className="mt-4 text-sm text-slate">
              {labelOf(p.duration, "—")} · Tuition{" "}
              {p.tuition != null || p.tuitionFee != null
                ? `${labelOf(p.currency, "USD")} ${moneyOf(p.tuition ?? p.tuitionFee)}`
                : "Low / none"}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
