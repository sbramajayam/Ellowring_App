"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Inbox } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf, moneyOf } from "@/lib/labels";
import { MarketplaceCard } from "@/components/ui/marketplace-card";
import { EmptyState, SkeletonCard } from "@/components/ui/skeleton";

export type CatalogCard = {
  id: string;
  eyebrow: string;
  title: string;
  body?: string;
  meta?: string;
  priceLabel?: string;
  rating?: string;
  students?: string;
  duration?: string;
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

const gradients = [
  "from-[#0F3DDE] via-[#2563EB] to-[#60A5FA]",
  "from-[#059669] via-[#10B981] to-[#6EE7B7]",
  "from-[#7C3AED] via-[#6366F1] to-[#A5B4FC]",
  "from-[#DB2777] via-[#E11D48] to-[#FB7185]",
  "from-[#D97706] via-[#F59E0B] to-[#FCD34D]",
  "from-[#0EA5E9] via-[#0284C7] to-[#38BDF8]",
];

export function StudentCatalogPage({
  title,
  description,
  endpoint,
  mapItem,
  emptyHref = "/dashboard/student",
  emptyLabel = "Back to Dashboard",
  auth = false,
  actionLabel = "Enroll now",
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
                rating: mapped.rating || "4.8",
                students: mapped.students || `${1200 + i * 87}+`,
                duration: mapped.duration || mapped.meta || "8–12 weeks",
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
  }, [endpoint, token, auth, title]);

  return (
    <StudentShell>
      <div className="mx-auto max-w-6xl space-y-5 p-4 lg:p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        {loading && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}
        {error && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">{error}</p>
        )}
        {msg && (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">{msg}</p>
        )}

        {!loading && !error && items.length === 0 && (
          <EmptyState
            icon={<Inbox size={22} />}
            title="Nothing here yet"
            description="Browse other modules or return to your dashboard to continue learning."
            action={
              <Link
                href={emptyHref}
                className="rounded-xl bg-[#0F3DDE] px-4 py-2.5 text-sm font-bold text-white"
              >
                {emptyLabel}
              </Link>
            }
          />
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, idx) => (
              <MarketplaceCard
                key={item.id}
                title={item.title}
                eyebrow={item.eyebrow}
                rating={item.rating}
                students={item.students}
                duration={item.duration}
                price={item.priceLabel || moneyOf(null)}
                href="/dashboard/student"
                cta={busyId === item.id ? "Working…" : actionLabel}
                imageGradient={gradients[idx % gradients.length]}
                onCtaClick={async () => {
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
              />
            ))}
          </div>
        )}
      </div>
    </StudentShell>
  );
}
