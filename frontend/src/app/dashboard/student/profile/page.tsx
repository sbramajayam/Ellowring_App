"use client";

import { StudentShell } from "@/components/student-shell";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <StudentShell>
      <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
      <div className="mt-5 max-w-lg space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm">
          <span className="text-slate-500">Name:</span> {user?.name}
        </p>
        <p className="text-sm">
          <span className="text-slate-500">Email:</span> {user?.email}
        </p>
        <p className="text-sm">
          <span className="text-slate-500">Role:</span> Student
        </p>
      </div>
    </StudentShell>
  );
}
