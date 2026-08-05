"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AuthUser, dashboardPath } from "@/lib/auth-context";

export default function OtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("student@ellowring.com");
  const [code, setCode] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [error, setError] = useState("");

  async function requestOtp(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await api<{ demoOtp: string }>("/auth/otp/request", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setDemoOtp(res.demoOtp);
      setStep("verify");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function verify(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await api<{ accessToken: string; user: AuthUser }>("/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
      localStorage.setItem(
        "ellowring_auth",
        JSON.stringify({ token: res.accessToken, user: res.user }),
      );
      router.push(dashboardPath(res.user.role));
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-14">
      <Link href="/" className="font-display text-3xl font-bold text-forest">
        Ellow<span className="text-sun">ring</span>
      </Link>
      <h1 className="mt-6 font-display text-4xl font-bold">OTP Login</h1>
      {step === "request" ? (
        <form onSubmit={requestOtp} className="mt-8 space-y-4 surface rounded-3xl p-6">
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn-primary w-full">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={verify} className="mt-8 space-y-4 surface rounded-3xl p-6">
          <p className="text-sm text-slate">Demo OTP: {demoOtp}</p>
          <input
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter OTP"
            required
          />
          <button className="btn-primary w-full">Verify & Login</button>
        </form>
      )}
      {error && <p className="mt-3 text-sm text-ember">{error}</p>}
      <Link href="/login" className="mt-4 text-sm font-semibold text-forest">
        Password login
      </Link>
    </div>
  );
}
