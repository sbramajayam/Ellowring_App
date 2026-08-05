"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Admission = {
  id: string;
  program: string;
  stream?: string;
  seats: number;
  fees?: number;
  description?: string;
  college?: { name: string; city?: string; state?: string };
};

export default function CollegesPage() {
  const [items, setItems] = useState<Admission[]>([]);
  useEffect(() => {
    api<Admission[]>("/admissions").then(setItems).catch(console.error);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-canopy">Colleges</p>
      <h1 className="mt-2 font-display text-4xl font-bold md:text-6xl">Admissions without noise.</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {items.map((a) => (
          <article key={a.id} className="surface rounded-3xl p-6">
            <h2 className="font-display text-2xl font-bold text-forest">{a.program}</h2>
            <p className="mt-1 text-slate">
              {a.college?.name} · {a.college?.city}, {a.college?.state}
            </p>
            <p className="mt-3 text-slate">{a.description}</p>
            <div className="mt-5 flex justify-between text-sm font-semibold">
              <span>{a.seats} seats</span>
              <span>₹{(a.fees || 0).toLocaleString("en-IN")}/yr</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
