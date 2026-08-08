"use client";

import { useEffect, useState } from "react";
import { StudentShell } from "@/components/student-shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf } from "@/lib/labels";

export default function ProfilePage() {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!token) return;
    api<Record<string, unknown>>("/students/me", { token })
      .then(setProfile)
      .catch(() => setProfile(null));
  }, [token]);

  return (
    <StudentShell>
      <div className="space-y-5 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Your student account and academic profile.</p>
        </div>
        <div className="max-w-lg space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm">
            <span className="text-slate-500">Name:</span> {user?.name}
          </p>
          <p className="text-sm">
            <span className="text-slate-500">Email:</span> {user?.email}
          </p>
          <p className="text-sm">
            <span className="text-slate-500">Role:</span> Student
          </p>
          {profile && (
            <>
              <p className="text-sm">
                <span className="text-slate-500">Grade:</span> {labelOf(profile.grade, "—")}
              </p>
              <p className="text-sm">
                <span className="text-slate-500">Stream:</span> {labelOf(profile.stream, "—")}
              </p>
              <p className="text-sm">
                <span className="text-slate-500">City:</span> {labelOf(profile.city, "—")}
              </p>
            </>
          )}
        </div>
      </div>
    </StudentShell>
  );
}
