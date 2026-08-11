"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { dashboardPath, useAuth } from "@/lib/auth-context";
import {
  AuthCardShell,
  authCardInput,
  authCardPrimaryBtn,
} from "@/components/auth-card-shell";
import { checkApiHealth } from "@/lib/api";
import clsx from "clsx";

const DEMO_PASSWORD = "password123";

const demoAccounts = [
  { role: "Student", email: "student@ellowring.com" },
  { role: "College", email: "college@ellowring.com" },
  { role: "HR", email: "hr@ellowring.com" },
  { role: "Training", email: "training@ellowring.com" },
  { role: "Partner", email: "partner@ellowring.com" },
  { role: "Admin", email: "admin@ellowring.com" },
];

/** Sign In — centered card mock (new style + alignment, same Ellowring logo). */
export function AppLoginScreen() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("student@ellowring.com");
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
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
    const run = () => {
      checkApiHealth().then((status) => {
        if (!cancelled) setApiStatus(status);
      });
    };
    run();
    const t = window.setTimeout(run, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
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
      if (typeof window !== "undefined") {
        if (remember) localStorage.setItem("ellowring_remember_email", email);
        else localStorage.removeItem("ellowring_remember_email");
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
      <div className="flex min-h-screen items-center justify-center bg-[#E8F1FF] text-[#0F3DDE]">
        Loading…
      </div>
    );
  }

  return (
    <AuthCardShell>
      <div className="text-center">
        <h1 className="font-display text-[28px] font-extrabold tracking-tight text-[#0B1F3A] sm:text-[30px]">
          Sign In
        </h1>
        <p className="mt-1.5 text-[13px] text-slate-500 sm:text-[14px]">
          Welcome back! Please sign in to continue.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="relative block">
          <span className="sr-only">Email</span>
          <User
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className={authCardInput}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
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

        <div className="flex items-center justify-between gap-3 pt-0.5">
          <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#0F3DDE]">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#0F3DDE] focus:ring-[#0F3DDE]"
            />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="text-[13px] font-semibold text-[#0F3DDE] hover:text-[#0B32B8]"
          >
            Forgot Password?
          </Link>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-center text-sm text-red-600 ring-1 ring-red-100">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={authCardPrimaryBtn}
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-[11px] font-bold tracking-wide text-slate-400">OR</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={() => window.alert("Google sign-in will be available soon.")}
        className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        <GoogleGlyph />
        Sign in with Google
      </button>

      <p className="mt-5 text-center text-[13px] text-slate-500">
        New here?{" "}
        <Link href="/register" className="font-bold text-[#0F3DDE] hover:underline">
          Create account
        </Link>
        {" · "}
        <Link href="/otp" className="font-semibold text-[#0F3DDE] hover:underline">
          OTP login
        </Link>
      </p>

      <div className="mt-5 rounded-xl bg-[#F5F8FF] px-3.5 py-3 ring-1 ring-[#D6E4FF]">
        <p className="text-center text-[11px] text-slate-500">
          Demo password for all roles:{" "}
          <span className="font-bold text-[#0B1F3A]">{DEMO_PASSWORD}</span>
        </p>
        <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          Tap a role to fill login
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {demoAccounts.map((acc) => {
            const active = email === acc.email;
            return (
              <button
                key={acc.email}
                type="button"
                onClick={() => {
                  setEmail(acc.email);
                  setPassword(DEMO_PASSWORD);
                  setError("");
                }}
                className={clsx(
                  "rounded-full px-2.5 py-1 text-[11px] font-bold transition",
                  active
                    ? "bg-[#0F3DDE] text-white shadow-sm"
                    : "bg-white text-[#0F3DDE] ring-1 ring-[#BFDBFE] hover:bg-[#EFF6FF]",
                )}
                title={acc.email}
              >
                {acc.role}
              </button>
            );
          })}
        </div>
        <p className="mt-2 break-all text-center text-[10px] font-medium text-slate-500">{email}</p>
      </div>
    </AuthCardShell>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l.0.0 6.2 5.2C39.2 37.3 44 32 44 24c0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}
