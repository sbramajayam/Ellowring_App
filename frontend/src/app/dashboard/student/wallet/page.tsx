"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { ArrowDownCircle, History, Loader2, Ticket } from "lucide-react";
import clsx from "clsx";
import { StudentShell } from "@/components/student-shell";
import {
  PrimaryButton,
  StudentModuleChrome,
} from "@/components/student-home/module-chrome";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type LedgerRow = {
  id: string;
  amount: number | string;
  type: string;
  description?: string;
  createdAt: string;
};

type Wallet = {
  balance: number | string;
  ledger?: LedgerRow[];
  transactions?: LedgerRow[];
};

const PREVIEW_COUNT = 5;

export default function StudentWalletPage() {
  const { token } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("WELCOME100");
  const [topUpAmount, setTopUpAmount] = useState("");
  const [showTopUp, setShowTopUp] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api<Wallet>("/wallet?limit=100", { token });
      setWallet(data);
    } catch (err) {
      console.error(err);
      setWallet(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const rows = wallet?.ledger || wallet?.transactions || [];
  const balance = Number(wallet?.balance ?? 0);
  const visibleRows = showAll ? rows : rows.slice(0, PREVIEW_COUNT);

  async function redeem(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setBusy(true);
    setError("");
    setMsg("");
    try {
      const res = await api<{ message?: string; error?: string; credit?: number }>("/wallet/redeem", {
        method: "POST",
        token,
        body: JSON.stringify({ code }),
      });
      if (res.error) {
        setError(res.error);
      } else {
        setMsg(`${res.message || "Coupon applied"} (+₹${(res.credit ?? 0).toLocaleString("en-IN")})`);
        load();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Redeem failed");
    } finally {
      setBusy(false);
    }
  }

  async function topUp(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    const amount = Math.round(Number(topUpAmount));
    if (!amount || amount <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setBusy(true);
    setError("");
    setMsg("");
    try {
      await api("/wallet/top-up", {
        method: "POST",
        token,
        body: JSON.stringify({ amount }),
      });
      setMsg(`₹${amount.toLocaleString("en-IN")} added to your wallet`);
      setTopUpAmount("");
      setShowTopUp(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Top-up failed");
    } finally {
      setBusy(false);
    }
  }

  function scrollToHistory() {
    historyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function formatAmount(row: LedgerRow): { text: string; positive: boolean } {
    const amt = Number(row.amount);
    const isCredit = row.type.toUpperCase() === "CREDIT";
    const prefix = isCredit ? "+" : "-";
    return { text: `${prefix}₹${Math.abs(amt).toLocaleString("en-IN")}`, positive: isCredit };
  }

  return (
    <StudentShell>
      <StudentModuleChrome
        title="Wallet"
        description="Manage balance, redeem coupons, and track transactions."
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-[#0F3DDE]" size={28} />
          </div>
        ) : (
          <>
            <div className="rounded-2xl bg-gradient-to-br from-[#0F3DDE] to-[#2563EB] p-6 text-white shadow-lg lg:p-8">
              <p className="text-sm font-medium text-blue-100">Available balance</p>
              <p className="mt-2 font-display text-4xl font-extrabold tracking-tight lg:text-5xl">
                ₹{balance.toLocaleString("en-IN")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryButton onClick={() => setShowTopUp((v) => !v)}>
                  <ArrowDownCircle size={16} />
                  Add Money
                </PrimaryButton>
                <button
                  type="button"
                  onClick={scrollToHistory}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur hover:bg-white/20"
                >
                  <History size={16} />
                  History
                </button>
              </div>
            </div>

            {showTopUp ? (
              <form
                onSubmit={topUp}
                className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
              >
                <label className="min-w-[160px] flex-1 text-sm">
                  <span className="font-medium text-slate-600">Amount (₹)</span>
                  <input
                    type="number"
                    min={1}
                    max={100000}
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="500"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0F3DDE] focus:ring-4 focus:ring-blue-100"
                  />
                </label>
                <PrimaryButton type="submit" disabled={busy}>
                  {busy ? <Loader2 size={16} className="animate-spin" /> : null}
                  Confirm top-up
                </PrimaryButton>
              </form>
            ) : null}

            <form
              onSubmit={redeem}
              className="mt-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
            >
              <div className="mb-3 flex items-center gap-2">
                <Ticket size={18} className="text-[#0F3DDE]" />
                <h2 className="text-sm font-bold text-slate-800">Redeem coupon</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="min-w-[180px] flex-1 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-sm outline-none focus:border-[#0F3DDE] focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
                <PrimaryButton type="submit" disabled={busy || !code.trim()}>
                  Redeem
                </PrimaryButton>
              </div>
            </form>

            {msg ? (
              <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{msg}</p>
            ) : null}
            {error ? (
              <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>
            ) : null}

            <div ref={historyRef} className="mt-6 scroll-mt-24">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-800">Recent transactions</h2>
                {rows.length > PREVIEW_COUNT ? (
                  <button
                    type="button"
                    onClick={() => setShowAll((v) => !v)}
                    className="text-sm font-bold text-[#0F3DDE] hover:underline"
                  >
                    {showAll ? "Show less" : "View all"}
                  </button>
                ) : null}
              </div>

              {visibleRows.length === 0 ? (
                <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-100">
                  <History className="mx-auto text-slate-300" size={32} />
                  <p className="mt-3 text-sm text-slate-500">No transactions yet.</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {visibleRows.map((t) => {
                    const { text, positive } = formatAmount(t);
                    return (
                      <li
                        key={t.id}
                        className="flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-slate-100"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800">{t.description || t.type}</p>
                          <p className="text-xs text-slate-400">
                            {new Date(t.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <p
                          className={clsx(
                            "text-sm font-bold",
                            positive ? "text-emerald-600" : "text-rose-600",
                          )}
                        >
                          {text}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </StudentModuleChrome>
    </StudentShell>
  );
}
