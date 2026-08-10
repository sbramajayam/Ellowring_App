"use client";

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bell, Loader2, Pencil, Save, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import {
  AdminFilterPills,
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

type Announcement = {
  id: string;
  title: string;
  content: string;
  targetRole?: string | null;
  isPublished?: boolean;
  createdAt?: string;
};

const ROLES = ["", "STUDENT", "COLLEGE", "COMPANY", "TRAINING", "PARTNER", "ADMIN"] as const;

const emptyForm = {
  title: "",
  content: "",
  targetRole: "",
  isPublished: true,
};

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

function AdminNotificationsPageInner() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [pubFilter, setPubFilter] = useState<"all" | "published" | "draft">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const list = await api<Announcement[]>("/admin/announcements", { token });
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setEditingId(null);
      setForm(emptyForm);
      setFormOpen(true);
    }
  }, [searchParams]);

  const stats = useMemo(() => {
    const published = items.filter((a) => a.isPublished !== false).length;
    const draft = items.length - published;
    const targeted = items.filter((a) => Boolean(a.targetRole)).length;
    return { total: items.length, published, draft, targeted };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((a) => {
      const hay = `${a.title} ${a.content} ${a.targetRole || ""}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (pubFilter === "published" && a.isPublished === false) return false;
      if (pubFilter === "draft" && a.isPublished !== false) return false;
      return true;
    });
  }, [items, q, pubFilter]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  function openEdit(a: Announcement) {
    setEditingId(a.id);
    setForm({
      title: a.title || "",
      content: a.content || "",
      targetRole: a.targetRole || "",
      isPublished: a.isPublished !== false,
    });
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        targetRole: form.targetRole || undefined,
        isPublished: form.isPublished,
      };
      if (editingId) {
        await api(`/admin/announcements/${editingId}`, {
          method: "PATCH",
          token,
          body: JSON.stringify(payload),
        });
        setMsg("Announcement updated.");
      } else {
        await api("/admin/announcements", {
          method: "POST",
          token,
          body: JSON.stringify(payload),
        });
        setMsg("Announcement created.");
      }
      setFormOpen(false);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(a: Announcement) {
    if (!token) return;
    if (!window.confirm(`Delete announcement "${a.title}"?`)) return;
    setBusyId(a.id);
    setError("");
    try {
      await api(`/admin/announcements/${a.id}`, { method: "DELETE", token });
      setMsg("Announcement removed.");
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
          title="Notifications"
          description="Platform announcements — publish drafts or target by role."
          actionLabel="Add Announcement"
          onAction={openCreate}
        />

        <AdminStatRow
          stats={[
            { label: "Total", value: stats.total, sub: "All announcements", tint: "text-[#0F3DDE] bg-blue-50" },
            { label: "Published", value: stats.published, sub: "Visible now", tint: "text-emerald-700 bg-emerald-50" },
            { label: "Draft", value: stats.draft, sub: "Unpublished", tint: "text-amber-700 bg-amber-50" },
            { label: "Targeted", value: stats.targeted, sub: "Role-specific", tint: "text-sky-700 bg-sky-50" },
          ]}
        />

        <AdminToolbar
          q={q}
          onQ={setQ}
          placeholder="Search announcements…"
          filters={
            <AdminFilterPills
              value={pubFilter}
              onChange={setPubFilter}
              options={[
                { id: "all", label: "All" },
                { id: "published", label: "Published" },
                { id: "draft", label: "Draft" },
              ]}
            />
          }
        />

        <AdminFlash loading={loading} error={error} msg={msg} loadingLabel="Loading announcements…" />

        {formOpen && (
          <AdminFormPanel
            title={editingId ? "Edit Announcement" : "New Announcement"}
            onClose={() => {
              setFormOpen(false);
              setEditingId(null);
            }}
          >
            <form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Title *
                </span>
                <input
                  className="input"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Platform maintenance window"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Content *
                </span>
                <textarea
                  className="input min-h-[120px]"
                  required
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Target Role
                </span>
                <select
                  className="input"
                  value={form.targetRole}
                  onChange={(e) => setForm((f) => ({ ...f, targetRole: e.target.value }))}
                >
                  {ROLES.map((r) => (
                    <option key={r || "all"} value={r}>
                      {r || "All roles"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 self-end pb-2">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                />
                <span className="text-sm font-semibold text-slate-700">Published</span>
              </label>
              <div className="flex gap-2 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingId ? "Update" : "Save Announcement"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    setEditingId(null);
                  }}
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
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Published</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-800">{a.title}</td>
                  <td className="px-4 py-3 text-slate-600">{a.targetRole || "All"}</td>
                  <td className="px-4 py-3">
                    {statusPill(a.isPublished !== false, { on: "Published", off: "Draft" })}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(a.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(a)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#0F3DDE] hover:bg-blue-50"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        disabled={busyId === a.id}
                        onClick={() => void onDelete(a)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      >
                        {busyId === a.id ? (
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
              <Bell size={32} />
              <p className="mt-2 text-sm">No announcements match your filters.</p>
            </div>
          )}
        </AdminTableCard>
      </div>
    </AdminShell>
  );
}

export default function AdminNotificationsPage() {
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
      <AdminNotificationsPageInner />
    </Suspense>
  );
}
