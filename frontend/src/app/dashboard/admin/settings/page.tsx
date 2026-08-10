"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Save, Settings2 } from "lucide-react";
import clsx from "clsx";
import { AdminShell } from "@/components/admin-shell";
import {
  AdminFilterPills,
  AdminFlash,
  AdminFormPanel,
  AdminPageHeader,
  AdminStatRow,
  AdminTableCard,
} from "@/components/admin-crud-chrome";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type SettingRow = {
  id: string;
  key: string;
  value: string;
  description?: string | null;
};

const GENERAL_KEYS: { key: string; label: string; defaultValue: string; description: string }[] = [
  { key: "site.name", label: "Site Name", defaultValue: "Ellowring", description: "Platform display name" },
  {
    key: "support.email",
    label: "Support Email",
    defaultValue: "support@ellowring.com",
    description: "Public support email",
  },
  {
    key: "support.phone",
    label: "Support Phone",
    defaultValue: "+91 00000 00000",
    description: "Public support phone",
  },
  { key: "site.timezone", label: "Timezone", defaultValue: "Asia/Kolkata", description: "Default timezone" },
  { key: "site.currency", label: "Currency", defaultValue: "INR", description: "Display currency" },
  { key: "site.dateFormat", label: "Date Format", defaultValue: "DD/MM/YYYY", description: "Date display format" },
  { key: "site.language", label: "Language", defaultValue: "en", description: "Default language" },
];

export default function AdminSettingsPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState<"general" | "keys">("general");
  const [general, setGeneral] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [customOpen, setCustomOpen] = useState(false);
  const [customForm, setCustomForm] = useState({ key: "", value: "", description: "" });
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const byKey = useMemo(() => {
    const map = new Map<string, SettingRow>();
    for (const s of settings) map.set(s.key, s);
    return map;
  }, [settings]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const list = await api<SettingRow[]>("/admin/settings", { token });
      const rows = Array.isArray(list) ? list : [];
      setSettings(rows);

      const map = new Map(rows.map((r) => [r.key, r]));
      const next: Record<string, string> = {};
      const missing: typeof GENERAL_KEYS = [];

      for (const g of GENERAL_KEYS) {
        const existing = map.get(g.key);
        if (existing) {
          next[g.key] = existing.value;
        } else {
          next[g.key] = g.defaultValue;
          missing.push(g);
        }
      }
      setGeneral(next);

      if (missing.length) {
        await Promise.all(
          missing.map((g) =>
            api(`/admin/settings/${encodeURIComponent(g.key)}`, {
              method: "PUT",
              token,
              body: JSON.stringify({ value: g.defaultValue, description: g.description }),
            }),
          ),
        );
        const refreshed = await api<SettingRow[]>("/admin/settings", { token });
        setSettings(Array.isArray(refreshed) ? refreshed : rows);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveGeneral(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      await Promise.all(
        GENERAL_KEYS.map((g) =>
          api(`/admin/settings/${encodeURIComponent(g.key)}`, {
            method: "PUT",
            token,
            body: JSON.stringify({
              value: (general[g.key] ?? g.defaultValue).trim(),
              description: g.description,
            }),
          }),
        ),
      );
      setMsg("General settings saved.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(row: SettingRow) {
    setEditingKey(row.key);
    setEditValue(row.value);
    setEditDesc(row.description || "");
    setMsg("");
    setError("");
  }

  async function saveInline(key: string) {
    if (!token) return;
    setBusyKey(key);
    setError("");
    try {
      await api(`/admin/settings/${encodeURIComponent(key)}`, {
        method: "PUT",
        token,
        body: JSON.stringify({ value: editValue, description: editDesc || undefined }),
      });
      setMsg(`Updated ${key}.`);
      setEditingKey(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyKey(null);
    }
  }

  async function addCustom(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    const key = customForm.key.trim();
    if (!key) {
      setError("Key is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api(`/admin/settings/${encodeURIComponent(key)}`, {
        method: "PUT",
        token,
        body: JSON.stringify({
          value: customForm.value,
          description: customForm.description.trim() || undefined,
        }),
      });
      setMsg(`Setting ${key} saved.`);
      setCustomOpen(false);
      setCustomForm({ key: "", value: "", description: "" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  const visibleSettings = useMemo(
    () => settings.filter((s) => !s.key.startsWith("api.key.")),
    [settings],
  );

  return (
    <AdminShell>
      <div className="space-y-5">
        <AdminPageHeader
          title="Settings"
          description="General platform preferences and raw key-value configuration."
          actionLabel={tab === "keys" ? "Add Custom Key" : undefined}
          onAction={tab === "keys" ? () => setCustomOpen(true) : undefined}
        />

        <AdminStatRow
          stats={[
            {
              label: "Total Keys",
              value: settings.length,
              sub: "Stored settings",
              tint: "text-[#0F3DDE] bg-blue-50",
            },
            {
              label: "General",
              value: GENERAL_KEYS.length,
              sub: "Core prefs",
              tint: "text-emerald-700 bg-emerald-50",
            },
            {
              label: "Custom",
              value: Math.max(0, visibleSettings.length - GENERAL_KEYS.filter((g) => byKey.has(g.key)).length),
              sub: "Extra keys",
              tint: "text-amber-700 bg-amber-50",
            },
          ]}
        />

        <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
          <AdminFilterPills
            value={tab}
            onChange={setTab}
            options={[
              { id: "general", label: "General" },
              { id: "keys", label: "All Keys" },
            ]}
          />
        </div>

        <AdminFlash loading={loading} error={error} msg={msg} loadingLabel="Loading settings…" />

        {tab === "general" && (
          <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1F3A] via-[#0B1F3A] to-[#0F3DDE] p-[1px] shadow-sm">
            <div className="rounded-[15px] bg-white p-5 lg:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0F3DDE]">
                  <Settings2 size={18} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-[#0B1F3A]">General Settings</h2>
                  <p className="text-sm text-slate-500">Site identity, support contacts, and locale defaults.</p>
                </div>
              </div>
              <form onSubmit={saveGeneral} className="grid gap-4 sm:grid-cols-2">
                {GENERAL_KEYS.map((g) => (
                  <label key={g.key} className={clsx("block", g.key === "site.name" && "sm:col-span-2")}>
                    <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                      {g.label}
                    </span>
                    <input
                      className="input"
                      value={general[g.key] ?? ""}
                      onChange={(e) => setGeneral((prev) => ({ ...prev, [g.key]: e.target.value }))}
                    />
                    <span className="mt-1 block text-[11px] text-slate-400">{g.key}</span>
                  </label>
                ))}
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(15,61,222,0.25)] disabled:opacity-60"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {tab === "keys" && (
          <>
            {customOpen && (
              <AdminFormPanel title="Add Custom Key" onClose={() => setCustomOpen(false)}>
                <form onSubmit={addCustom} className="grid gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                      Key *
                    </span>
                    <input
                      className="input"
                      required
                      value={customForm.key}
                      onChange={(e) => setCustomForm((f) => ({ ...f, key: e.target.value }))}
                      placeholder="e.g. feature.flag.x"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                      Value
                    </span>
                    <input
                      className="input"
                      value={customForm.value}
                      onChange={(e) => setCustomForm((f) => ({ ...f, value: e.target.value }))}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                      Description
                    </span>
                    <input
                      className="input"
                      value={customForm.description}
                      onChange={(e) => setCustomForm((f) => ({ ...f, description: e.target.value }))}
                    />
                  </label>
                  <div className="flex gap-2 sm:col-span-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                    >
                      {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                      Add Key
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomOpen(false)}
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
                    <th className="px-4 py-3 font-semibold">Key</th>
                    <th className="px-4 py-3 font-semibold">Value</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleSettings.map((row) => {
                    const editing = editingKey === row.key;
                    return (
                      <tr key={row.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-[#0B1F3A]">{row.key}</td>
                        <td className="px-4 py-3 text-slate-700">
                          {editing ? (
                            <input
                              className="input"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                            />
                          ) : (
                            <span className="line-clamp-2 break-all">{row.value || "—"}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {editing ? (
                            <input
                              className="input"
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                            />
                          ) : (
                            row.description || "—"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            {editing ? (
                              <>
                                <button
                                  type="button"
                                  disabled={busyKey === row.key}
                                  onClick={() => void saveInline(row.key)}
                                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#0F3DDE] hover:bg-blue-50 disabled:opacity-50"
                                >
                                  {busyKey === row.key ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <Save size={14} />
                                  )}{" "}
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingKey(null)}
                                  className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => startEdit(row)}
                                className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#0F3DDE] hover:bg-blue-50"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!loading && visibleSettings.length === 0 && (
                <div className="flex flex-col items-center py-12 text-slate-400">
                  <Settings2 size={32} />
                  <p className="mt-2 text-sm">No settings yet.</p>
                </div>
              )}
            </AdminTableCard>
          </>
        )}
      </div>
    </AdminShell>
  );
}
