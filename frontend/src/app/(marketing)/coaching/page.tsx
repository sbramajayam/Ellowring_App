"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

type Item = {
  id: string;
  title: string;
  examType: string;
  description?: string;
  price: number;
  duration?: string;
  partner?: { name: string };
};

export default function CoachingPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    api<Item[]>("/coaching").then(setItems).catch(console.error);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-canopy">Coaching</p>
      <h1 className="mt-2 font-display text-4xl font-bold md:text-6xl">NEET. JEE. Competitive.</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate">
        Concept-first batches with national training partners — designed for serious aspirants.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="surface rounded-3xl p-6">
            <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-canopy">
              {item.examType}
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold text-forest">{item.title}</h2>
            <p className="mt-2 text-slate">{item.description}</p>
            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="font-semibold text-ink">₹{item.price.toLocaleString("en-IN")}</span>
              <span className="text-slate">{item.duration}</span>
            </div>
            <Link href="/register" className="btn-primary mt-5 w-full">
              Enroll interest
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
