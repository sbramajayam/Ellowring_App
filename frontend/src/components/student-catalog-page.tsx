"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf, moneyOf } from "@/lib/labels";

export type CatalogCard = {
  id: string;
  eyebrow: string;
  title: string;
  body?: string;
  meta?: string;
  priceLabel?: string;
};

type Props = {
  title: string;
  description: string;
  endpoint: string;
  mapItem: (raw: Record<string, unknown>) => CatalogCard;
  emptyHref?: string;
  emptyLabel?: string;
  auth?: boolean;
  actionLabel?: string;
  icon?: ReactNode;
  /** Called with catalog item id when CTA clicked */
  onAction?: (id: string) => Promise<void> | void;
};

export function StudentCatalogPage({
  title,
  description,
  endpoint,
  mapItem,
  emptyHref = "/dashboard/student",
  emptyLabel = "Back to Dashboard",
  auth = false,
  actionLabel = "View details",
  icon,
  onAction,
}: Props) {
  const { token } = useAuth();
  const [items, setItems] = useState<CatalogCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (auth && !token) {
          if (!cancelled) {
            setItems([]);
            setError("Sign in required.");
          }
          return;
        }
        const data = await api<unknown[]>(endpoint, auth ? { token } : {});
        const rows = Array.isArray(data) ? data : [];
        if (!cancelled) {
          setItems(
            rows.map((row, i) => {
              const obj = (row && typeof row === "object" ? row : {}) as Record<string, unknown>;
              const mapped = mapItem(obj);
              return {
                ...mapped,
                id: mapped.id || String(obj.id || i),
                title: labelOf(mapped.title, "Untitled"),
                eyebrow: labelOf(mapped.eyebrow, title),
                body: mapped.body ? labelOf(mapped.body, "") : undefined,
                meta: mapped.meta ? labelOf(mapped.meta, "") : undefined,
                priceLabel: mapped.priceLabel,
              };
            }),
          );
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [endpoint, token, auth]);
  // mapItem is stable per page module; intentionally omitted from deps

  return (
    <StudentShell>
      <div className="mx-auto max-w-6xl space-y-5 p-4 lg:p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        {loading && (
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Loading…
          </p>
        )}
        {error && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">
            {error}
          </p>
        )}
        {msg && (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
            {msg}
          </p>
        )}

        {!loading && !error && items.length === 0 && (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 ring-1 ring-slate-100">
            No items yet.{" "}
            <Link href={emptyHref} className="font-semibold text-[#2563EB]">
              {emptyLabel}
            </Link>
          </p>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
              >
                {icon ? (
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                    {icon}
                  </div>
                ) : null}
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  {item.eyebrow}
                </p>
                <h2 className="mt-1 text-base font-bold text-slate-900">{item.title}</h2>
                {item.body ? (
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-500">{item.body}</p>
                ) : (
                  <div className="flex-1" />
                )}
                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    {item.priceLabel || moneyOf(null)}
                  </span>
                  <span className="text-xs text-slate-400">{item.meta || ""}</span>
                </div>
                <button
                  type="button"
                  disabled={!!busyId}
                  className="mt-3 w-full rounded-xl bg-[#2563EB] py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                  onClick={async () => {
                    if (!onAction) {
                      setMsg("Open the public catalogue or detail for more options.");
                      return;
                    }
                    if (!token) {
                      setError("Sign in required.");
                      return;
                    }
                    try {
                      setBusyId(item.id);
                      setError("");
                      await onAction(item.id);
                      setMsg(`${actionLabel} completed.`);
                    } catch (e) {
                      setError(e instanceof Error ? e.message : "Action failed");
                    } finally {
                      setBusyId(null);
                    }
                  }}
                >
                  {busyId === item.id ? "Working…" : actionLabel}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </StudentShell>
  );
}
