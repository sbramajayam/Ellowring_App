"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles } from "lucide-react";
import { StudentShell } from "@/components/student-shell";

const features = [
  "Unlimited Mock Tests",
  "AI Mentor (full access)",
  "Premium Courses library",
  "Internship Priority ranking",
  "Resume & Interview Support",
  "Application Tracking",
  "Scholarship Alerts",
  "College Predictor Pro",
];

export default function PremiumPage() {
  const [yearly, setYearly] = useState(true);
  const price = yearly ? 3999 : 499;
  const period = yearly ? "/year" : "/month";
  const save = yearly ? "Save 33%" : null;

  return (
    <StudentShell>
      <div className="mx-auto max-w-4xl space-y-6 p-4 lg:p-6">
        <section className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-[#EEF2FF] via-white to-[#DBEAFE] p-6 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#0F3DDE] shadow-sm">
                <Crown size={13} className="text-amber-500" fill="currentColor" /> Ellowring Pro
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Unlock the full student-to-job platform
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Designed for serious aspirants — unlimited practice, AI coaching, premium courses and priority access to
                opportunities.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center gap-1 rounded-xl bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setYearly(false)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    !yearly ? "bg-[#0F3DDE] text-white shadow" : "text-slate-600"
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setYearly(true)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    yearly ? "bg-[#0F3DDE] text-white shadow" : "text-slate-600"
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
          </div>

          <motion.div
            key={yearly ? "y" : "m"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-slate-900">₹{price.toLocaleString("en-IN")}</span>
                <span className="pb-1 text-sm text-slate-500">{period}</span>
                {save ? (
                  <span className="ml-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    {save}
                  </span>
                ) : null}
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 rounded-full bg-emerald-50 p-0.5 text-emerald-600">
                      <Check size={14} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-8 w-full rounded-2xl bg-gradient-to-r from-[#0F3DDE] to-[#2563EB] py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:opacity-95"
              >
                Start Ellowring Pro
              </button>
              <p className="mt-3 text-center text-[11px] text-slate-400">Cancel anytime · GST extra as applicable</p>
            </div>

            <div className="rounded-3xl bg-[#0F3DDE] p-6 text-white shadow-xl">
              <Sparkles size={22} />
              <h2 className="mt-3 text-xl font-bold">Why investors love Pro</h2>
              <p className="mt-2 text-sm text-blue-100">
                Higher retention, clearer monetization, and deeper engagement across academics → career journey.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-blue-50">
                <li>· Conversion from free → paid learning pathways</li>
                <li>· Measurable readiness score lift</li>
                <li>· Priority funnel for college & HR partners</li>
              </ul>
            </div>
          </motion.div>
        </section>
      </div>
    </StudentShell>
  );
}
