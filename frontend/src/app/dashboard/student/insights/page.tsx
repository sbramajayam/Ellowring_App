"use client";

import { useEffect, useState } from "react";
import { StudentShell } from "@/components/student-shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

type Placement = {
  probability: number;
  confidence: number;
  salaryRange: { min: number; max: number; currency: string };
  interventions: string[];
};

type Dropout = {
  riskScore: number;
  band: string;
  triggers: string[];
  recommendedAction: string;
};

type Ad = {
  id: string;
  type: string;
  title: string;
  label: string;
  href: string;
  cta: string;
};

export default function PredictivePage() {
  const { token } = useAuth();
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [dropout, setDropout] = useState<Dropout | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    api<Ad[]>("/ads/placements").then(setAds).catch(console.error);
  }, []);

  useEffect(() => {
    if (!token) return;
    api<Placement>("/predictive/placement", { token }).then(setPlacement).catch(console.error);
    api<Dropout>("/predictive/dropout-risk", { token }).then(setDropout).catch(console.error);
  }, [token]);

  return (
    <StudentShell>
      <div className="space-y-5 p-4 md:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
            Phase 3 · Predictive Intelligence
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Insights & predictions</h1>
          <p className="mt-1 text-sm text-slate-500">
            Placement probability, salary band and dropout-risk signals — explainable interventions,
            not guarantees.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Placement probability</h2>
            <p className="mt-3 text-4xl font-bold text-[#2563EB]">
              {placement ? `${Math.round(placement.probability * 100)}%` : "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Confidence {placement ? Math.round(placement.confidence * 100) : "—"}%
            </p>
            {placement && (
              <p className="mt-3 text-sm text-slate-600">
                Expected CTC ₹{(placement.salaryRange.min / 100000).toFixed(1)}–₹
                {(placement.salaryRange.max / 100000).toFixed(1)} LPA
              </p>
            )}
            <ul className="mt-4 space-y-2">
              {(placement?.interventions || []).map((i) => (
                <li key={i} className="rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-900">
                  {i}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Engagement / dropout risk</h2>
            <p className="mt-3 text-4xl font-bold text-slate-900">
              {dropout?.band || "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Risk score {dropout ? Math.round(dropout.riskScore * 100) : "—"} / 100
            </p>
            <p className="mt-3 text-sm text-slate-600">{dropout?.recommendedAction}</p>
            <ul className="mt-4 space-y-1 text-xs text-slate-500">
              {(dropout?.triggers || []).map((t) => (
                <li key={t}>• {t}</li>
              ))}
            </ul>
          </div>
        </div>

        <section>
          <h2 className="mb-3 text-lg font-bold text-slate-900">Sponsored placements</h2>
          <p className="mb-3 text-xs text-slate-500">
            Phase-3 advertising surface — all sponsored items are explicitly labelled.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {ads.map((ad) => (
              <Link
                key={ad.id}
                href={ad.href}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-amber-100 transition hover:shadow-md"
              >
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                  {ad.label}
                </span>
                <p className="mt-2 text-sm font-semibold text-slate-900">{ad.title}</p>
                <p className="mt-1 text-xs text-slate-500">{ad.type}</p>
                <p className="mt-3 text-xs font-semibold text-[#2563EB]">{ad.cta} →</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </StudentShell>
  );
}
