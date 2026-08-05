"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Lock, Mail, User } from "lucide-react";
import { dashboardPath, Role, useAuth } from "@/lib/auth-context";
import { EllowringLogo } from "@/components/ellowring-logo";

const roles: { value: Role; label: string }[] = [
  { value: "STUDENT", label: "Student" },
  { value: "COLLEGE", label: "College" },
  { value: "COMPANY", label: "HR / Company" },
  { value: "TRAINING", label: "Training" },
  { value: "PARTNER", label: "Channel Partner" },
];

export default function RegisterPage() {
  const { register, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT" as Role,
    city: "",
    orgName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace(dashboardPath(user.role));
  }, [authLoading, user, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const next = await register(form);
      router.push(dashboardPath(next.role));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FB] text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F7FB] px-4 py-10">
      <div className="w-full max-w-lg">
        <Link href="/" className="mb-6 inline-flex justify-center sm:justify-start">
          <EllowringLogo variant="stacked" size="lg" />
        </Link>

        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500">Join Ellowring as a student or institution partner.</p>

        <form
          onSubmit={onSubmit}
          className="mt-6 space-y-3.5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">Full name</span>
            <div className="relative">
              <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">Email</span>
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">Password</span>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                type="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">Role</span>
            <select
              className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>

          <input
            className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />

          {form.role !== "STUDENT" && (
            <div className="relative">
              <Building2 size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                placeholder="Organization name"
                value={form.orgName}
                onChange={(e) => setForm({ ...form, orgName: e.target.value })}
              />
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-red-100">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create account"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/" className="font-semibold text-[#2563EB] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
