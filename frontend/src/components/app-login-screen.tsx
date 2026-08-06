"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { dashboardPath, useAuth } from "@/lib/auth-context";
import { AuthSplitShell, authUnderlineInput } from "@/components/auth-split-shell";

const demoAccounts = [
  "student@ellowring.com",
  "college@ellowring.com",
  "hr@ellowring.com",
  "training@ellowring.com",
  "partner@ellowring.com",
  "admin@ellowring.com",
];

/** Sign In — same split-card UI as Create Account. */
export function AppLoginScreen() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("student@ellowring.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function resolveNext(role: Parameters<typeof dashboardPath>[0]) {
    const raw = searchParams.get("next");
    if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
    return dashboardPath(role);
  }

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(resolveNext(user.role));
    }
  }, [authLoading, user, router, searchParams]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const nextUser = await login(email, password);
      router.push(resolveNext(nextUser.role));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
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
        Sign In
      </h1>
      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-slate-400">
        Welcome back. Enter your Ellowring workspace credentials to continue.
      </p>

      <form onSubmit={onSubmit} className="mt-10 space-y-8">
        <label className="block">
          <span className="text-[13px] font-bold text-[#1E293B]">Email</span>
          <input
            className={authUnderlineInput}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            autoComplete="email"
            required
          />
        </label>

        <label className="block">
          <span className="text-[13px] font-bold text-[#1E293B]">Password</span>
          <div className="relative mt-2">
            <input
              className="w-full border-0 border-b border-slate-200 bg-transparent py-2.5 pr-10 text-[15px] text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#2563EB]"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
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

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-red-100">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/forgot-password"
              className="text-[14px] font-semibold text-[#2563EB] hover:text-blue-700"
            >
              Forgot Password?
            </Link>
            <Link href="/otp" className="text-[13px] font-medium text-slate-400 hover:text-[#2563EB]">
              OTP login
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#2563EB] px-8 py-3 text-[14px] font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </form>

      <p className="mt-8 text-[13px] text-slate-400">
        No account?{" "}
        <Link href="/register" className="font-semibold text-[#2563EB] hover:underline">
          Create account
        </Link>
      </p>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Demo · password123
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {demoAccounts.map((addr) => (
            <button
              key={addr}
              type="button"
              onClick={() => {
                setEmail(addr);
                setPassword("password123");
              }}
              className="rounded-md bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
            >
              {addr.split("@")[0]}
            </button>
          ))}
        </div>
      </div>
    </AuthSplitShell>
  );
}
