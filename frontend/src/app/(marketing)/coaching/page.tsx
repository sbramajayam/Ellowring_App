"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { MarketplaceCard } from "@/components/ui/marketplace-card";
import { SkeletonCard } from "@/components/ui/skeleton";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Item[]>("/coaching")
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F3DDE]">Coaching Marketplace</p>
      <h1 className="mt-2 font-display text-4xl font-bold text-slate-900 md:text-5xl">NEET. JEE. Competitive.</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        Concept-first batches with national training partners — designed for serious aspirants.
      </p>
      {loading ? (
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <MarketplaceCard
              key={item.id}
              title={item.title}
              eyebrow={item.examType}
              duration={item.duration || "12 weeks"}
              price={`₹${item.price.toLocaleString("en-IN")}`}
              href="/register"
              cta="Start Learning"
              students="8k+"
              rating="4.8"
            />
          ))}
        </div>
      )}
      <div className="mt-10 text-center">
        <Link href="/register" className="text-sm font-bold text-[#0F3DDE]">
          Create a free account to enroll →
        </Link>
      </div>
    </div>
  );
}
