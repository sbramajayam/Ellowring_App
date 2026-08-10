"use client";

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, KeyRound, Loader2, Save, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import {
  AdminFlash,
  AdminFormPanel,
  AdminPageHeader,
  AdminStatRow,
  AdminTableCard,
  AdminToolbar,
  statusPill,
} from "@/components/admin-crud-chrome";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type ApiKeyRow = {
  id: string;
  key: string;
  value: string;
  description?: string | null;
  createdAt?: string;
  status?: string;
};

type CreatedSetting = {
  id: string;
  key: string;
  value: string;
  description?: string | null;
};

const emptyForm = {
  appName: "",
  description: "",
};

function maskKey(value: string) {
  if (!value) return "—";
  const last = value.slice(-6);
  return `••••••••${last}`;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function AdminEnterpriseApiPageInner() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const list = await api<ApiKeyRow[]>("/admin/api-keys", { token });
      setKeys(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load API keys");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setForm(emptyForm);
      setFormOpen(true);
    }
  }, [searchParams]);

  const stats = useMemo(() => {
    const active = keys.filter((k) => (k.status || "ACTIVE") === "ACTIVE").length;
    return { total: keys.length, active, expired: 0, expiring: 0 };
  }, [keys]);

  const filtered = useMemo(() => {
    if (!q.trim()) return keys;
    const needle = q.toLowerCase();
    return keys.filter((k) => {
      const hay = `${k.key} ${k.description || ""} ${k.value}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [keys, q]);

  function openCreate() {
    setForm(emptyForm);
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (!form.appName.trim()) {
      setError("App name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const created = await api<CreatedSetting>("/admin/api-keys", {
        method: "POST",
        token,
        body: JSON.stringify({
          appName: form.appName.trim(),
          description: form.description.trim() || undefined,
        }),
      });
      setMsg(`Key generated. Copy now — raw value: ${created.value}`);
      setFormOpen(false);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generate failed");
    } finally {
      setSaving(false);
    }
  }

  async function onCopy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMsg("API key copied to clipboard.");
    } catch {
      setError("Could not copy to clipboard.");
    }
  }

  async function onDelete(row: ApiKeyRow) {
    if (!token) return;
    if (!window.confirm(`Delete API key for "${row.key || row.description}"?`)) return;
    setBusyId(row.id);
    setError("");
    try {
      await api(`/admin/api-keys/${row.id}`, { method: "DELETE", token });
      setMsg("API key deleted.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminShell>
      <div className="space-y-5">
        <AdminPageHeader
          title="Enterprise API"
          description="Issue and revoke partner API keys for enterprise integrations."
          actionLabel="Generate New Key"
          onAction={openCreate}
        />

        <AdminStatRow
          stats={[
            { label: "Total APIs", value: stats.total, sub: "Issued keys", tint: "text-[#0F3DDE] bg-blue-50" },
            { label: "Active", value: stats.active, sub: "Usable now", tint: "text-emerald-700 bg-emerald-50" },
            { label: "Expired", value: stats.expired, sub: "Placeholder", tint: "text-slate-600 bg-slate-100" },
            { label: "Expiring", value: stats.expiring, sub: "Placeholder", tint: "text-amber-700 bg-amber-50" },
          ]}
        />

        <AdminToolbar q={q} onQ={setQ} placeholder="Search by app name or key…" />

        <AdminFlash loading={loading} error={error} msg={msg} loadingLabel="Loading API keys…" />

        {formOpen && (
          <AdminFormPanel title="Generate New Key" onClose={() => setFormOpen(false)}>
            <form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  App Name *
                </span>
                <input
                  className="input"
                  required
                  value={form.appName}
                  onChange={(e) => setForm((f) => ({ ...f, appName: e.target.value }))}
                  placeholder="e.g. Partner Portal"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Description
                </span>
                <input
                  className="input"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Optional notes"
                />
              </label>
              <div className="flex gap-2 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Generate Key
                </button>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </AdminFormPanel>
        )}

        <AdminTableCard>
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">API Key</th>
                <th className="px-4 py-3 font-semibold">App Name</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{maskKey(row.value)}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {row.description || row.key || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(row.createdAt)}</td>
                  <td className="px-4 py-3">{statusPill((row.status || "ACTIVE") === "ACTIVE")}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => void onCopy(row.value)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#0F3DDE] hover:bg-blue-50"
                      >
                        <Copy size={14} /> Copy
                      </button>
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => void onDelete(row)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      >
                        {busyId === row.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}{" "}
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center py-12 text-slate-400">
              <KeyRound size={32} />
              <p className="mt-2 text-sm">No API keys yet.</p>
            </div>
          )}
        </AdminTableCard>
      </div>
    </AdminShell>
  );
}

export default function AdminEnterpriseApiPage() {
  return (
    <Suspense
      fallback={
        <AdminShell>
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Loading…
          </p>
        </AdminShell>
      }
    >
      <AdminEnterpriseApiPageInner />
    </Suspense>
  );
}
