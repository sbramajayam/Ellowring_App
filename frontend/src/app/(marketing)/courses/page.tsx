"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { labelOf } from "@/lib/labels";

type Course = {
  id: string;
  title: string;
  slug: string;
  category?: string | { name?: string; slug?: string } | null;
  level?: string | null;
  price: number;
  duration?: string;
  description?: string;
};

export default function CoursesPage() {
  const [items, setItems] = useState<Course[]>([]);
  useEffect(() => {
    api<Course[]>("/courses").then(setItems).catch(console.error);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-canopy">Courses</p>
      <h1 className="mt-2 font-display text-4xl font-bold md:text-6xl">Skill tracks that ship.</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate">
        Production-minded courses from Ellowring training partners — ready for projects and hiring.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {items.map((c) => (
          <article key={c.id} className="surface rounded-3xl p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-canopy">
              <span>{labelOf(c.category, "Course")}</span>
              <span>·</span>
              <span>{labelOf(c.level, "All levels")}</span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold text-forest">{c.title}</h2>
            <p className="mt-2 text-slate">{c.description}</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="font-semibold">₹{c.price.toLocaleString("en-IN")}</span>
              <span className="text-sm text-slate">{c.duration}</span>
            </div>
            <Link href={`/courses/${c.slug}`} className="btn-secondary mt-5 inline-flex">
              View course
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
