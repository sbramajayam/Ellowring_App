"use client";

import Link from "next/link";
import { ClipboardCheck, Clock, FileText } from "lucide-react";
import { StudentShell } from "@/components/student-shell";

const tests = [
  {
    title: "JEE Main Physics Full Mock",
    subject: "Physics",
    exam: "JEE Main",
    qs: 90,
    duration: "3h",
    difficulty: "Advanced",
  },
  {
    title: "NEET Biology Chapter Test",
    subject: "Biology",
    exam: "NEET",
    qs: 45,
    duration: "1h",
    difficulty: "Intermediate",
  },
  {
    title: "Placement Aptitude Set A",
    subject: "Aptitude",
    exam: "Placement",
    qs: 60,
    duration: "90m",
    difficulty: "Beginner",
  },
  {
    title: "Coding Round Warmup",
    subject: "DSA",
    exam: "Placement",
    qs: 3,
    duration: "2h",
    difficulty: "Intermediate",
  },
  {
    title: "JEE Advanced Chemistry",
    subject: "Chemistry",
    exam: "JEE Advanced",
    qs: 54,
    duration: "3h",
    difficulty: "Advanced",
  },
  {
    title: "NEET Physics Full Syllabus",
    subject: "Physics",
    exam: "NEET",
    qs: 50,
    duration: "90m",
    difficulty: "Advanced",
  },
];

export default function MockTestsPage() {
  return (
    <StudentShell>
      <div className="mx-auto max-w-6xl space-y-5 p-4 lg:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mock Tests</h1>
            <p className="mt-1 text-sm text-slate-500">
              Timed practice for NEET, JEE, and placement tracks with instant scoring.
            </p>
          </div>
          <Link
            href="/dashboard/student/previous-papers"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <FileText size={16} /> Previous Year Papers
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {tests.map((t) => (
            <article
              key={t.title}
              className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-700">
                  {t.exam}
                </span>
                <span className="text-[11px] font-medium text-slate-400">{t.difficulty}</span>
              </div>
              <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ClipboardCheck size={20} />
              </div>
              <h2 className="mt-3 text-base font-bold text-slate-900">{t.title}</h2>
              <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                <Clock size={14} /> {t.qs} questions · {t.duration}
              </p>
              <button
                type="button"
                className="mt-4 w-full rounded-xl bg-[#2563EB] py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Start test
              </button>
            </article>
          ))}
        </div>
      </div>
    </StudentShell>
  );
}
