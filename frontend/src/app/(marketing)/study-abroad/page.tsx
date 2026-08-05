"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Program = {
  id: string;
  country: string;
  university: string;
  program: string;
  tuition?: number;
  duration?: string;
  description?: string;
};

export default function StudyAbroadPage() {
  const [items, setItems] = useState<Program[]>([]);
  useEffect(() => {
    api<Program[]>("/study-abroad").then(setItems).catch(console.error);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-canopy">Study Abroad</p>
      <h1 className="mt-2 font-display text-4xl font-bold md:text-6xl">World campuses. Clear ROI.</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {items.map((p) => (
          <article key={p.id} className="surface rounded-3xl p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-canopy">{p.country}</span>
            <h2 className="mt-3 font-display text-xl font-bold text-forest">{p.university}</h2>
            <p className="mt-1 font-medium">{p.program}</p>
            <p className="mt-3 text-slate">{p.description}</p>
            <p className="mt-4 text-sm text-slate">
              {p.duration} · Tuition {p.tuition ? `$${p.tuition.toLocaleString()}` : "Low / none"}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
