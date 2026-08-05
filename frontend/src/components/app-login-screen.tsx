"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { dashboardPath, useAuth } from "@/lib/auth-context";
import { EllowringLogo } from "@/components/ellowring-logo";

const demoAccounts = [
  "student@ellowring.com",
  "college@ellowring.com",
  "hr@ellowring.com",
  "training@ellowring.com",
  "partner@ellowring.com",
  "admin@ellowring.com",
];

/** Centered login — logo + form; borders / padding / margins matched to WWW mock */
export function AppLoginScreen() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("student@ellowring.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(dashboardPath(user.role));
    }
  }, [authLoading, user, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const nextUser = await login(email, password);
      router.push(dashboardPath(nextUser.role));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
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
    <div className="flex min-h-screen items-center justify-center bg-[#F4F7FB] px-4 py-12 sm:py-16">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="mb-9 flex justify-center">
          <EllowringLogo variant="horizontal" size="lg" />
        </div>

        {/* Title */}
        <h1 className="text-center text-[28px] font-bold leading-tight tracking-tight text-[#0B1F3A]">
          Sign in to Ellowring
        </h1>
        <p className="mt-2 text-center text-[14px] text-slate-500">
          Enter your workspace credentials to continue.
        </p>

        {/* Card — soft border + padding */}
        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-4 rounded-[16px] border border-slate-200/70 bg-white px-7 py-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)] sm:px-8 sm:py-8"
        >
          <div className="relative">
            <Mail
              size={18}
              strokeWidth={2.4}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              className="w-full rounded-xl border-0 bg-[#EEF2F7] py-3.5 pl-11 pr-3.5 text-[14px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#3B82F6]/35"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@ellowring.com"
              autoComplete="email"
              required
              aria-label="Email"
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              strokeWidth={2.4}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              className="w-full rounded-xl border-0 bg-[#EEF2F7] py-3.5 pl-11 pr-3.5 text-[14px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#3B82F6]/35"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              aria-label="Password"
            />
          </div>

          <div className="flex items-center justify-between pt-1 text-[13px]">
            <Link href="/otp" className="font-semibold text-[#0B1F3A] hover:text-[#2563EB]">
              OTP login
            </Link>
            <Link
              href="/forgot-password"
              className="font-semibold text-[#0B1F3A] hover:text-[#2563EB]"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3.5 text-[14px] font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
            {!loading && <ArrowRight size={17} strokeWidth={2.5} />}
          </button>
        </form>

        <p className="mt-6 text-center text-[14px] text-slate-500">
          No account?{" "}
          <Link href="/register" className="font-semibold text-[#0B1F3A] hover:text-[#2563EB]">
            Create account
          </Link>
        </p>

        {/* Demo card */}
        <div className="mt-7 rounded-[16px] border border-slate-200/70 bg-white px-5 py-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Demo accounts · password123
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {demoAccounts.map((addr) => (
              <button
                key={addr}
                type="button"
                onClick={() => {
                  setEmail(addr);
                  setPassword("password123");
                }}
                className="rounded-full bg-[#EEF2F7] px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {addr.split("@")[0]}@
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
