"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Eye, EyeOff, Lock, Mail, MapPin, User } from "lucide-react";
import { dashboardPath, Role, useAuth } from "@/lib/auth-context";
import {
  AuthCardShell,
  authCardInput,
  authCardPrimaryBtn,
} from "@/components/auth-card-shell";

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
      <div className="flex min-h-screen items-center justify-center bg-[#E8F1FF] text-[#0F3DDE]">
        {user ? "Opening your workspace…" : "Loading…"}
      </div>
    );
  }

  return (
    <AuthCardShell>
      <div className="text-center">
        <h1 className="font-display text-[28px] font-extrabold tracking-tight text-[#0B1F3A] sm:text-[30px]">
          Create Account
        </h1>
        <p className="mt-1.5 text-[13px] text-slate-500 sm:text-[14px]">
          Join Ellowring as a student or institution partner.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-3.5">
        <label className="relative block">
          <span className="sr-only">Full name</span>
          <User
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className={authCardInput}
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>

        <label className="relative block">
          <span className="sr-only">Email</span>
          <Mail
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className={authCardInput}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>

        <label className="relative block">
          <span className="sr-only">Password</span>
          <Lock
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className={`${authCardInput} pr-11`}
            type={showPassword ? "text" : "password"}
            placeholder="Password (min 6)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 transition hover:text-slate-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </label>

        <label className="relative block">
          <span className="sr-only">Role</span>
          <Building2
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
          />
          <select
            className={`${authCardInput} appearance-none`}
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

        <label className="relative block">
          <span className="sr-only">City</span>
          <MapPin
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className={authCardInput}
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </label>

        {form.role !== "STUDENT" && (
          <label className="relative block">
            <span className="sr-only">Organization</span>
            <Building2
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className={authCardInput}
              placeholder="Organization name"
              value={form.orgName}
              onChange={(e) => setForm({ ...form, orgName: e.target.value })}
            />
          </label>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-center text-sm text-red-600 ring-1 ring-red-100">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className={authCardPrimaryBtn}>
          {loading ? "Creating…" : "Create Account"}
        </button>
      </form>

      <p className="mt-5 text-center text-[13px] text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[#0F3DDE] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCardShell>
  );
}
