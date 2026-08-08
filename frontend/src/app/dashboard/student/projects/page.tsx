"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Layers, Users } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf, moneyOf } from "@/lib/labels";

type Project = {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  durationWeeks?: number;
  stipend?: number | string;
  skills?: string;
  technologies?: { technology?: string; name?: string }[];
  company?: { name: string; industry?: string };
};

export default function StudentProjectsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Project[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api<Project[]>("/projects").then(setItems).catch(console.error);
  }, []);

  return (
    <StudentShell>
      <div className="space-y-5 p-4 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
              Phase 2 · Live Projects
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Live Projects</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Mentor-supervised industry projects with sprint delivery, grading and portfolio
              output — from Class skill-building to hire-ready proof.
            </p>
          </div>
          <Link
            href="/dashboard/student"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Back to Dashboard
          </Link>
        </div>
        {msg && (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
            {msg}
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Open projects", value: String(items.length || 6) },
            { label: "Avg duration", value: "6–8 wks" },
            { label: "With stipend", value: "Yes / hybrid" },
          ].map((k) => (
            <div key={k.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <p className="text-xs text-slate-500">{k.label}</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{k.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(items.length ? items : [
            {
              id: "demo-1",
              title: "Campus Placement Analytics Dashboard",
              description: "Build a React dashboard for placement cell KPIs with NestJS APIs.",
              durationWeeks: 6,
              stipend: 8000,
              skills: "React, NestJS, SQL",
              company: { name: "Ellowring Labs", industry: "EdTech" },
            },
            {
              id: "demo-2",
              title: "NEET Mock Insight Engine",
              description: "Score analytics and weakness detection for mock test cohorts.",
              durationWeeks: 8,
              stipend: 10000,
              skills: "Python, Data Viz",
              company: { name: "InsightPrep", industry: "EdTech" },
            },
          ]).map((p) => (
            <article
              key={p.id}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                  <Layers size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-slate-900">{p.title}</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {labelOf(p.company, "Partner company")}
                    {p.company?.industry ? ` · ${labelOf(p.company.industry)}` : ""}
                  </p>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                {labelOf(p.description, "Industry live project with mentor reviews and deliverables.")}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-600">
                <span className="rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-100">
                  {labelOf(p.duration, p.durationWeeks ? `${p.durationWeeks} weeks` : "6–8 weeks")}
                </span>
                <span className="rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-100">
                  Stipend ₹{moneyOf(p.stipend, "0")}
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-blue-700 ring-1 ring-blue-100">
                  <Users size={12} /> Team + mentor
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                {p.technologies?.length
                  ? p.technologies.map((t) => labelOf(t.technology ?? t.name ?? t)).filter(Boolean).join(", ")
                  : labelOf(p.skills, "Skills listed by company")}
              </p>
              <button
                type="button"
                className="mt-4 w-full rounded-xl bg-[#2563EB] py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={async () => {
                  try {
                    if (!token) {
                      setMsg("Sign in required.");
                      return;
                    }
                    await api("/applications", {
                      method: "POST",
                      token,
                      body: JSON.stringify({ projectId: p.id }),
                    });
                    setMsg(`Applied to ${p.title}`);
                  } catch (e) {
                    setMsg(e instanceof Error ? e.message : "Apply failed");
                  }
                }}
              >
                Apply to project
              </button>
            </article>
          ))}
        </div>
      </div>
    </StudentShell>
  );
}
