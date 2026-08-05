"use client";

import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-14">
      <Link href="/" className="font-display text-3xl font-bold text-forest">
        Ellow<span className="text-sun">ring</span>
      </Link>
      <h1 className="mt-6 font-display text-4xl font-bold">Reset password</h1>
      <p className="mt-2 text-slate">MVP demo: use OTP login or contact admin to reset.</p>
      <form className="mt-8 space-y-4 surface rounded-3xl p-6">
        <input className="input" type="email" placeholder="Registered email" />
        <button className="btn-primary w-full" type="button">
          Send reset link
        </button>
      </form>
      <Link href="/otp" className="mt-4 text-sm font-semibold text-forest">
        Use OTP login instead
      </Link>
    </div>
  );
}
