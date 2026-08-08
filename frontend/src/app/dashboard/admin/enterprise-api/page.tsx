"use client";

import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { ModuleCard } from "@/components/role-shell";

export default function AdminEnterpriseApiPage() {
  const [result, setResult] = useState<string>("");
  const [code, setCode] = useState("CERT-DEMO");

  async function ping() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001/api/v1"}/enterprise/health`,
      { headers: { "X-API-Key": "ellowring-dev-enterprise-key" } },
    );
    setResult(JSON.stringify(await res.json(), null, 2));
  }

  async function verify() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001/api/v1"}/enterprise/verify/certificate/${encodeURIComponent(code)}`,
      { headers: { "X-API-Key": "ellowring-dev-enterprise-key" } },
    );
    setResult(JSON.stringify(await res.json(), null, 2));
  }

  return (
    <AdminShell>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">Phase 3</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Enterprise API Console</h1>
          <p className="mt-1 text-sm text-slate-500">
            Developer/ops sandbox for the V3 Partner API (API key authentication).
          </p>
        </div>

        <ModuleCard
          title="Dev API key"
          description="Header X-API-Key: ellowring-dev-enterprise-key (from ENTERPRISE_API_KEY). Rotate in production."
          action={
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={ping}
                className="rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white"
              >
                Ping /enterprise/health
              </button>
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Certificate code"
              />
              <button
                type="button"
                onClick={verify}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold"
              >
                Verify certificate
              </button>
            </div>
          }
        />

        {result && (
          <pre className="overflow-x-auto rounded-2xl bg-slate-900 p-4 text-xs text-emerald-300">
            {result}
          </pre>
        )}
      </div>
    </AdminShell>
  );
}
