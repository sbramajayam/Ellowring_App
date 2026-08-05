"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Item = {
  id: string;
  title: string;
  category: string;
  summary?: string;
  targetGrade?: string;
};

export default function CareerPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [interest, setInterest] = useState("technology");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    api<Item[]>("/career").then(setItems).catch(console.error);
  }, []);

  useEffect(() => {
    api<{ recommendations: string[] }>(`/career/assistant/suggest?interest=${interest}`)
      .then((r) => setSuggestions(r.recommendations))
      .catch(console.error);
  }, [interest]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-canopy">Career Guidance</p>
      <h1 className="mt-2 font-display text-4xl font-bold md:text-6xl">Find your next mile.</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate">
        Structured guidance from school streams to first-job playbooks — with an AI assistant that
        adapts to your interest.
      </p>

      <div className="mt-10 surface rounded-3xl p-6 md:p-8">
        <h2 className="font-display text-2xl font-bold">AI Career Assistant</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {["technology", "medicine", "commerce", "arts"].map((key) => (
            <button
              key={key}
              onClick={() => setInterest(key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                interest === key ? "bg-forest text-white" : "bg-mist text-forest"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {suggestions.map((s) => (
            <div key={s} className="rounded-2xl border border-line bg-white p-4 font-medium">
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="surface rounded-3xl p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-canopy">
              {item.category} · {item.targetGrade}
            </span>
            <h3 className="mt-3 font-display text-xl font-bold text-forest">{item.title}</h3>
            <p className="mt-2 text-slate">{item.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
