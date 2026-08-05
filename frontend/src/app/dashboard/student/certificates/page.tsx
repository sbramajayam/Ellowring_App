"use client";

import { StudentShell } from "@/components/student-shell";
import { Award } from "lucide-react";

const certs = [
  { title: "Career Foundations", issuer: "Ellowring", date: "Jan 2026" },
  { title: "Full Stack Starter", issuer: "PeakPrep Academy", date: "Mar 2026" },
  { title: "Interview Readiness", issuer: "Ellowring", date: "May 2026" },
];

export default function CertificatesPage() {
  return (
    <StudentShell>
      <h1 className="text-2xl font-bold text-slate-900">Certificates</h1>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {certs.map((c) => (
          <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Award size={20} />
            </div>
            <h2 className="mt-3 font-bold text-slate-900">{c.title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {c.issuer} · {c.date}
            </p>
            <button className="mt-4 text-sm font-semibold text-blue-600">Download</button>
          </div>
        ))}
      </div>
    </StudentShell>
  );
}
