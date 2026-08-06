"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { dashboardPath, Role, useAuth } from "@/lib/auth-context";
import { AuthSplitShell, authUnderlineInput } from "@/components/auth-split-shell";

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
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="flex min-h-screen items-center justify-center bg-[#0B2A6B] text-blue-100">
        Loading…
      </div>
    );
  }

  return (
    <AuthSplitShell>
      <h1 className="font-display text-[34px] font-bold tracking-tight text-[#1E293B] sm:text-[40px]">
        Create account
      </h1>
      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-slate-400">
        Join Ellowring as a student or institution partner.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <label className="block">
          <span className="text-[13px] font-bold text-[#1E293B]">Full name</span>
          <input
            className={authUnderlineInput}
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>

        <label className="block">
          <span className="text-[13px] font-bold text-[#1E293B]">Email</span>
          <input
            className={authUnderlineInput}
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>

        <label className="block">
          <span className="text-[13px] font-bold text-[#1E293B]">Password</span>
          <div className="relative mt-2">
            <input
              className="w-full border-0 border-b border-slate-200 bg-transparent py-2.5 pr-10 text-[15px] text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#2563EB]"
              type={showPassword ? "text" : "password"}
              placeholder="Min 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-slate-400 transition hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        <label className="block">
          <span className="text-[13px] font-bold text-[#1E293B]">Role</span>
          <select
            className={`${authUnderlineInput} appearance-none`}
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

        <label className="block">
          <span className="text-[13px] font-bold text-[#1E293B]">City</span>
          <input
            className={authUnderlineInput}
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </label>

        {form.role !== "STUDENT" && (
          <label className="block">
            <span className="text-[13px] font-bold text-[#1E293B]">Organization</span>
            <input
              className={authUnderlineInput}
              placeholder="Organization name"
              value={form.orgName}
              onChange={(e) => setForm({ ...form, orgName: e.target.value })}
            />
          </label>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-red-100">
            {error}
          </p>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#2563EB] px-8 py-3 text-[14px] font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create account"}
          </button>
        </div>
      </form>

      <p className="mt-8 text-[13px] text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#2563EB] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthSplitShell>
  );
}
