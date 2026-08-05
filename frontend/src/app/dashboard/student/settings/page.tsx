"use client";

import { StudentShell } from "@/components/student-shell";

export default function SettingsPage() {
  return (
    <StudentShell>
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <div className="mt-5 max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="flex items-center justify-between text-sm">
          Email notifications
          <input type="checkbox" defaultChecked className="h-4 w-4 accent-blue-600" />
        </label>
        <label className="flex items-center justify-between text-sm">
          SMS alerts
          <input type="checkbox" className="h-4 w-4 accent-blue-600" />
        </label>
        <label className="flex items-center justify-between text-sm">
          Weekly progress digest
          <input type="checkbox" defaultChecked className="h-4 w-4 accent-blue-600" />
        </label>
        <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          Save preferences
        </button>
      </div>
    </StudentShell>
  );
}
