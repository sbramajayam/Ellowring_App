"use client";

import { StudentShell } from "@/components/student-shell";

export default function MessagesPage() {
  return (
    <StudentShell>
      <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
      <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        Inbox will sync mentoring, admission and recruiter threads in V1.1.
      </div>
    </StudentShell>
  );
}
