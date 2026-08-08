"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf, moneyOf } from "@/lib/labels";
import { DataTable, ModuleCard } from "@/components/role-shell";

export type RoleColumn = {
  key: string;
  label: string;
  /** Dot path or special: money:field */
  path?: string;
};

function readPath(row: Record<string, unknown>, path: string): string {
  if (path.startsWith("money:")) {
    return moneyOf(readRaw(row, path.slice(6)), "—");
  }
  return labelOf(readRaw(row, path), "—");
}

function readRaw(row: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let cur: unknown = row;
  for (const part of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
}

type Props = {
  title: string;
  description: string;
  endpoint: string;
  columns: RoleColumn[];
  auth?: boolean;
  /** Extract array from envelope object if needed */
  listKey?: string;
  emptyText?: string;
  headerAction?: ReactNode;
  mapRow?: (row: Record<string, unknown>) => Record<string, unknown>;
};

export function RoleApiTablePage({
  title,
  description,
  endpoint,
  columns,
  auth = true,
  listKey,
  emptyText = "No records yet.",
  headerAction,
  mapRow,
}: Props) {
  const { token } = useAuth();
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (auth && !token) {
          if (!cancelled) setError("Sign in required.");
          return;
        }
        const data = await api<unknown>(endpoint, auth ? { token } : {});
        let list: unknown[] = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data && typeof data === "object") {
          const obj = data as Record<string, unknown>;
          if (listKey && Array.isArray(obj[listKey])) {
            list = obj[listKey] as unknown[];
          } else if (Array.isArray(obj.jobApplications) || Array.isArray(obj.internshipApplications)) {
            const jobs = (obj.jobApplications as unknown[]) || [];
            const interns = (obj.internshipApplications as unknown[]) || [];
            list = [
              ...jobs.map((j) => ({ ...(j as object), _kind: "JOB" })),
              ...interns.map((j) => ({ ...(j as object), _kind: "INTERNSHIP" })),
            ];
          } else if (Array.isArray(obj.stats)) {
            list = obj.stats as unknown[];
          } else {
            // metrics object → label/value rows
            list = Object.entries(obj)
              .filter(([k]) => k !== "role" && k !== "phase" && k !== "success" && k !== "meta")
              .map(([label, value]) => ({ label, value }));
          }
        }
        if (!cancelled) {
          setCount(list.length);
          setRows(
            list.map((item, i) => {
              const raw = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
              const row = mapRow ? mapRow(raw) : raw;
              return columns.map((col) => {
                const path = col.path || col.key;
                if (path === "_index") return String(i + 1);
                return readPath(row, path);
              });
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
  }, [endpoint, token, auth, listKey]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        {headerAction}
      </div>

      <ModuleCard
        title={`${title} workspace`}
        description={`${count} record(s) from ${endpoint}`}
      />

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
      {!loading && !error && rows.length === 0 && (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 ring-1 ring-slate-100">
          {emptyText}
        </p>
      )}
      {!loading && !error && rows.length > 0 && (
        <DataTable columns={columns.map((c) => c.label)} rows={rows} />
      )}
    </div>
  );
}
