"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
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

function LoginHeroArt() {
  return (
    <svg
      viewBox="0 0 420 360"
      className="mx-auto h-auto w-full max-w-[380px]"
      aria-hidden
    >
      {/* soft ground waves */}
      <path
        d="M20 300 C90 270 150 320 220 295 C290 270 350 310 400 285 L400 360 L20 360 Z"
        fill="#BFDBFE"
        opacity="0.55"
      />
      <path
        d="M0 320 C80 300 140 340 210 318 C280 296 340 335 420 310 L420 360 L0 360 Z"
        fill="#93C5FD"
        opacity="0.45"
      />

      {/* decorative leaves */}
      <ellipse cx="55" cy="210" rx="28" ry="48" fill="#60A5FA" opacity="0.35" transform="rotate(-18 55 210)" />
      <ellipse cx="365" cy="195" rx="32" ry="54" fill="#3B82F6" opacity="0.28" transform="rotate(22 365 195)" />
      <circle cx="95" cy="120" r="4" fill="#FBBF24" />
      <circle cx="330" cy="95" r="3.5" fill="#60A5FA" />
      <path d="M108 108 l6 6 M108 114 l6 -6" stroke="#FBBF24" strokeWidth="2" />
      <path d="M340 80 l5 5 M340 85 l5 -5" stroke="#3B82F6" strokeWidth="2" />

      {/* monitor */}
      <rect x="48" y="118" width="130" height="92" rx="10" fill="#1E3A8A" />
      <rect x="56" y="126" width="114" height="68" rx="4" fill="#EFF6FF" />
      <circle cx="88" cy="158" r="18" fill="#93C5FD" />
      <path d="M88 158 L88 140 A18 18 0 0 1 103 150 Z" fill="#2563EB" />
      <path d="M88 158 L103 150 A18 18 0 0 1 98 172 Z" fill="#F59E0B" />
      <polyline
        points="118,175 132,155 144,165 162,140"
        fill="none"
        stroke="#2563EB"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="95" y="212" width="36" height="10" rx="2" fill="#1E3A8A" />
      <rect x="78" y="222" width="70" height="6" rx="2" fill="#64748B" opacity="0.5" />

      {/* person */}
      <circle cx="210" cy="132" r="22" fill="#FDE68A" />
      <path
        d="M188 158 C188 148 198 142 210 142 C222 142 232 148 232 158 L236 230 C236 242 226 250 210 250 C194 250 184 242 184 230 Z"
        fill="#FACC15"
      />
      <rect x="196" y="168" width="28" height="22" rx="3" fill="#1E293B" />
      <path d="M178 250 L178 310 L198 310 L202 258 L218 258 L222 310 L242 310 L242 250 Z" fill="#334155" />
      {/* laptop in hands */}
      <rect x="188" y="188" width="44" height="28" rx="3" fill="#94A3B8" />
      <rect x="192" y="192" width="36" height="20" rx="2" fill="#E0F2FE" />
      <rect x="184" y="216" width="52" height="5" rx="1.5" fill="#64748B" />

      {/* phone with shield */}
      <rect x="278" y="130" width="72" height="128" rx="12" fill="#1E3A8A" />
      <rect x="286" y="142" width="56" height="96" rx="6" fill="#F8FAFC" />
      <circle cx="314" cy="188" r="22" fill="#DBEAFE" />
      <path
        d="M314 172 C306 172 300 176 300 184 V196 C300 208 314 216 314 216 C314 216 328 208 328 196 V184 C328 176 322 172 314 172 Z"
        fill="#2563EB"
      />
      <path
        d="M306 190 L312 196 L324 182"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="304" y="248" width="20" height="4" rx="2" fill="#64748B" opacity="0.6" />
    </svg>
  );
}

/** Split-card Sign In — reference layout with Ellowring brand */
export function AppLoginScreen() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("student@ellowring.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="flex min-h-screen items-center justify-center bg-[#0B2A6B] text-blue-100">
        Loading…
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B2A6B] px-4 py-10 sm:px-6 sm:py-14">
      {/* Atmosphere — soft waves + corner dots */}
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 15% 20%, #1E4DB7 0%, transparent 55%),
            radial-gradient(ellipse 80% 60% at 90% 85%, #153A8F 0%, transparent 50%),
            radial-gradient(circle at 70% 25%, rgba(37, 99, 235, 0.35) 0%, transparent 40%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute -left-24 top-[-10%] h-[70vmin] w-[70vmin] rounded-full border-[48px] border-[#133A8C]/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-[-15%] h-[75vmin] w-[75vmin] rounded-full border-[56px] border-[#153F96]/35"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-6 top-6 grid grid-cols-6 gap-2 opacity-40 sm:right-10 sm:top-10"
        aria-hidden
      >
        {Array.from({ length: 36 }).map((_, i) => (
          <span key={i} className="h-1 w-1 rounded-full bg-[#1E3A8A]" />
        ))}
      </div>
      <div
        className="pointer-events-none absolute bottom-8 left-6 grid grid-cols-6 gap-2 opacity-35 sm:bottom-12 sm:left-10"
        aria-hidden
      >
        {Array.from({ length: 36 }).map((_, i) => (
          <span key={`b-${i}`} className="h-1 w-1 rounded-full bg-[#1E3A8A]" />
        ))}
      </div>

      <div className="login-rise relative z-10 w-full max-w-[920px]">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_rgba(7,20,60,0.45)] sm:rounded-[32px]">
          <div className="grid lg:grid-cols-2">
            {/* Left — brand + illustration */}
            <div className="relative flex flex-col bg-gradient-to-b from-[#F8FBFF] to-white px-7 pb-8 pt-7 sm:px-10 sm:pt-9">
              <div className="login-fade">
                <EllowringLogo variant="horizontal" size="md" />
              </div>
              <div className="mt-6 flex flex-1 items-center justify-center py-4 sm:mt-4 sm:py-8">
                <div className="login-float w-full">
                  <LoginHeroArt />
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="flex flex-col justify-center border-t border-slate-100 px-7 py-9 sm:px-12 sm:py-12 lg:border-l lg:border-t-0">
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
                    className="mt-2 w-full border-0 border-b border-slate-200 bg-transparent py-2.5 text-[15px] text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#2563EB]"
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
                    <Link
                      href="/otp"
                      className="text-[13px] font-medium text-slate-400 hover:text-[#2563EB]"
                    >
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
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
