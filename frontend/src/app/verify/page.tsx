"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function PublicVerifyPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001/api"}/enterprise/verify/certificate/${encodeURIComponent(code)}`,
        { headers: { "X-API-Key": "ellowring-dev-enterprise-key" } },
      );
      setResult(await res.json());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F7FB] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <Link href="/" className="text-xs font-semibold text-[#2563EB]">
          ← Ellowring
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Verify certificate</h1>
        <p className="mt-1 text-sm text-slate-500">
          Phase-3 credential verification (Enterprise API).
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            placeholder="Certificate code / credential"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button className="w-full rounded-xl bg-[#2563EB] py-2.5 text-sm font-semibold text-white">
            Verify
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {result && (
          <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-3 text-xs text-emerald-300">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
