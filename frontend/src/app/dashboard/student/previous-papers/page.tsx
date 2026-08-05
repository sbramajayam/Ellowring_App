"use client";

import Link from "next/link";
import { FileText, Download, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { StudentShell } from "@/components/student-shell";

const papers = [
  { id: "1", exam: "JEE Main", year: 2025, subject: "Physics", session: "January", pages: 24 },
  { id: "2", exam: "JEE Main", year: 2025, subject: "Chemistry", session: "January", pages: 22 },
  { id: "3", exam: "JEE Main", year: 2024, subject: "Mathematics", session: "April", pages: 28 },
  { id: "4", exam: "JEE Advanced", year: 2024, subject: "Paper 1", session: "Official", pages: 36 },
  { id: "5", exam: "NEET", year: 2025, subject: "Biology", session: "UG", pages: 32 },
  { id: "6", exam: "NEET", year: 2024, subject: "Full Paper", session: "UG", pages: 40 },
  { id: "7", exam: "NEET", year: 2023, subject: "Physics", session: "UG", pages: 18 },
  { id: "8", exam: "UPSC CSE", year: 2024, subject: "Prelims GS", session: "Paper I", pages: 48 },
  { id: "9", exam: "CAT", year: 2024, subject: "VARC", session: "Slot 1", pages: 16 },
  { id: "10", exam: "GATE", year: 2025, subject: "CSE", session: "Official", pages: 30 },
  { id: "11", exam: "JEE Main", year: 2023, subject: "Physics", session: "Session 2", pages: 24 },
  { id: "12", exam: "NEET", year: 2022, subject: "Full Paper", session: "UG", pages: 40 },
];

const exams = ["All", "JEE Main", "JEE Advanced", "NEET", "UPSC CSE", "CAT", "GATE"];

export default function PreviousYearPapersPage() {
  const [exam, setExam] = useState("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return papers.filter((p) => {
      const okExam = exam === "All" || p.exam === exam;
      const okQ =
        !q.trim() ||
        `${p.exam} ${p.subject} ${p.year} ${p.session}`.toLowerCase().includes(q.toLowerCase());
      return okExam && okQ;
    });
  }, [exam, q]);

  return (
    <StudentShell>
      <div className="mx-auto max-w-6xl space-y-5 p-4 lg:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Previous Year Papers</h1>
            <p className="mt-1 text-sm text-slate-500">
              Practice with authentic past papers for NEET, JEE, and competitive exams.
            </p>
          </div>
          <Link
            href="/dashboard/student/mock-tests"
            className="rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Take a Mock Test
          </Link>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by exam, subject, year…"
              className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {exams.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setExam(e)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  exam === e
                    ? "bg-[#2563EB] text-white"
                    : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <FileText size={22} />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#2563EB]">{p.exam}</p>
              <h2 className="mt-1 text-sm font-bold text-slate-900">
                {p.subject} · {p.year}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {p.session} · {p.pages} pages
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Download size={14} /> PDF
                </button>
                <Link
                  href="/dashboard/student/mock-tests"
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#2563EB] py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Practice
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 ring-1 ring-slate-100">
            No papers match your filters. Try another exam or keyword.
          </p>
        )}
      </div>
    </StudentShell>
  );
}
