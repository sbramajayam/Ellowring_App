"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { dashboardPath, useAuth } from "@/lib/auth-context";
import { AuthSplitShell, authUnderlineInput } from "@/components/auth-split-shell";
import { checkApiHealth } from "@/lib/api";

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
  const [apiStatus, setApiStatus] = useState<{
    ok: boolean;
    base: string;
    detail: string;
  } | null>(null);

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

  useEffect(() => {
    let cancelled = false;
    checkApiHealth().then((status) => {
      if (!cancelled) setApiStatus(status);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const health = await checkApiHealth();
      setApiStatus(health);
      if (!health.ok) {
        throw new Error(health.detail);
      }
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

      {apiStatus ? (
        <p
          className={`mt-4 rounded-lg px-3 py-2 text-[12px] ring-1 ${
            apiStatus.ok
              ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
              : "bg-amber-50 text-amber-800 ring-amber-100"
          }`}
        >
          {apiStatus.ok ? "API connected" : "API offline"} — {apiStatus.detail}
        </p>
      ) : (
        <p className="mt-4 text-[12px] text-slate-400">Checking API connection…</p>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-8">
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
            disabled={loading || apiStatus?.ok === false}
            className="inline-flex h-11 min-w-[120px] items-center justify-center rounded-full bg-[#2563EB] px-8 text-[14px] font-bold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </form>

      <p className="mt-8 text-[12px] leading-relaxed text-slate-400">
        Demo password for all roles:{" "}
        <span className="font-semibold text-slate-600">password123</span>
        <br />
        Accounts: {demoAccounts.join(" · ")}
      </p>
    </AuthSplitShell>
  );
}
