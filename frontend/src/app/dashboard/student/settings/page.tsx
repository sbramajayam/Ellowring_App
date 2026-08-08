"use client";

import { FormEvent, useState } from "react";
import { StudentShell } from "@/components/student-shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function Page() {
  const { token, user, refresh } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    try {
      setError("");
      await api("/auth/profile", {
        method: "PATCH",
        token,
        body: JSON.stringify({ name }),
      });
      await refresh();
      setMsg("Profile updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    try {
      setError("");
      await api("/auth/change-password", {
        method: "POST",
        token,
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setMsg("Password changed.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password change failed");
    }
  }

  return (
    <StudentShell>
      <div className="mx-auto max-w-2xl space-y-5 p-4 lg:p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Update profile and password for your account.</p>
        </div>
        {msg && (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{msg}</p>
        )}
        {error && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
        )}

        <form onSubmit={saveProfile} className="space-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h2 className="font-bold text-slate-900">Profile</h2>
          <label className="block text-sm">
            <span className="text-slate-500">Email</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              value={user?.email || ""}
              disabled
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-500">Display name</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <button type="submit" className="rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white">
            Save profile
          </button>
        </form>

        <form onSubmit={changePassword} className="space-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h2 className="font-bold text-slate-900">Password</h2>
          <input
            type="password"
            placeholder="Current password"
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New password (min 6)"
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={6}
          />
          <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Change password
          </button>
        </form>
      </div>
    </StudentShell>
  );
}
