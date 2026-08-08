"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudentShell } from "@/components/student-shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type Wallet = {
  balance: number | string;
  ledger?: { id: string; amount: number | string; type: string; description?: string; createdAt: string }[];
  transactions?: { id: string; amount: number | string; type: string; description?: string; createdAt: string }[];
};

export default function StudentWalletPage() {
  const { token } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [code, setCode] = useState("WELCOME100");
  const [msg, setMsg] = useState("");

  const load = () => {
    if (!token) return;
    api<Wallet>("/wallet", { token }).then(setWallet).catch(console.error);
  };

  useEffect(load, [token]);

  async function redeem(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    const res = await api<{ message?: string; error?: string; credit?: number }>("/wallet/redeem", {
      method: "POST",
      token,
      body: JSON.stringify({ code }),
    });
    setMsg(res.error || `${res.message || "Done"} (+${res.credit ?? 0})`);
    load();
  }

  const rows = wallet?.ledger || wallet?.transactions || [];
  const balance = Number(wallet?.balance ?? 0);

  return (
    <StudentShell>
      <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-slate-900">Wallet & Coupons</h1>
      <p className="mt-1 text-sm text-slate-500">Manage balance, redeem coupons and track credits.</p>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Available balance</p>
        <p className="mt-2 text-4xl font-bold text-slate-900">₹{balance.toLocaleString("en-IN")}</p>
        <button className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          Add Money
        </button>
      </div>

      <form onSubmit={redeem} className="mt-5 flex flex-wrap gap-3">
        <input
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">
          Redeem coupon
        </button>
      </form>
      {msg && <p className="mt-3 text-sm font-medium text-emerald-600">{msg}</p>}

      <div className="mt-6 space-y-2">
        {rows.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium">{t.description || t.type}</p>
              <p className="text-xs text-slate-400">{new Date(t.createdAt).toLocaleString()}</p>
            </div>
            <p className="font-semibold text-emerald-600">₹{Number(t.amount).toLocaleString("en-IN")}</p>
          </div>
        ))}
      </div>
      </div>
    </StudentShell>
  );
}
