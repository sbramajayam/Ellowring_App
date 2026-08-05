"use client";

import Link from "next/link";
import { StudentShell } from "@/components/student-shell";

export function StudentModulePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <StudentShell>
      <div className="p-4 md:p-6">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
            Student module
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>
          <p className="mt-4 text-xs text-slate-400">
            Navigation and chrome match the approved Student Dashboard reference UI.
          </p>
          <Link
            href="/dashboard/student"
            className="mt-6 inline-flex rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </StudentShell>
  );
}
