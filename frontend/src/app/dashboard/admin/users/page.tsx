"use client";

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import clsx from "clsx";
import { AdminShell } from "@/components/admin-shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type RoleFilter = "" | "STUDENT" | "ADMIN" | "COLLEGE" | "COMPANY" | "TRAINING" | "PARTNER";

type UserRow = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
};

const ROLES: { value: RoleFilter; label: string }[] = [
  { value: "", label: "All" },
  { value: "STUDENT", label: "Student" },
  { value: "ADMIN", label: "Admin" },
  { value: "COLLEGE", label: "College" },
  { value: "COMPANY", label: "Company" },
  { value: "TRAINING", label: "Training" },
  { value: "PARTNER", label: "Partner" },
];

const ASSIGNABLE_ROLES = ["STUDENT", "ADMIN", "COLLEGE", "COMPANY", "TRAINING", "PARTNER"];

const emptyCreate = {
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "STUDENT",
  isActive: true,
};

const emptyEdit = {
  name: "",
  phone: "",
  role: "STUDENT",
  isActive: true,
  isVerified: true,
  password: "",
};

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

function AdminUsersPageInner() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [createForm, setCreateForm] = useState(emptyCreate);
  const [editForm, setEditForm] = useState(emptyEdit);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.set("role", roleFilter);
      if (q.trim()) params.set("q", q.trim());
      const qs = params.toString();
      const list = await api<UserRow[]>(`/admin/users${qs ? `?${qs}` : ""}`, { token });
      setUsers(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [token, roleFilter, q]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setEditing(null);
      setCreateForm(emptyCreate);
      setFormOpen(true);
      setTempPassword(null);
    }
  }, [searchParams]);

  const stats = useMemo(() => {
    const active = users.filter((u) => u.isActive).length;
    return { total: users.length, active, inactive: users.length - active };
  }, [users]);

  function openCreate() {
    setEditing(null);
    setCreateForm(emptyCreate);
    setTempPassword(null);
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  function openEdit(u: UserRow) {
    setEditing(u);
    setEditForm({
      name: u.name,
      phone: u.phone || "",
      role: u.role,
      isActive: u.isActive,
      isVerified: u.isVerified,
      password: "",
    });
    setFormOpen(true);
    setTempPassword(null);
    setMsg("");
    setError("");
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    setTempPassword(null);
    try {
      const payload: Record<string, unknown> = {
        name: createForm.name.trim(),
        email: createForm.email.trim(),
        role: createForm.role,
        isActive: createForm.isActive,
      };
      if (createForm.phone.trim()) payload.phone = createForm.phone.trim();
      if (createForm.password.trim()) payload.password = createForm.password.trim();
      const res = await api<UserRow & { temporaryPassword?: string }>("/admin/users", {
        method: "POST",
        token,
        body: JSON.stringify(payload),
      });
      if (res.temporaryPassword) setTempPassword(res.temporaryPassword);
      setMsg(`User ${res.name} created.`);
      setFormOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  async function onUpdate(e: FormEvent) {
    e.preventDefault();
    if (!token || !editing) return;
    setSaving(true);
    setError("");
    try {
      const payload: Record<string, unknown> = {
        name: editForm.name.trim(),
        phone: editForm.phone.trim() || null,
        role: editForm.role,
        isActive: editForm.isActive,
        isVerified: editForm.isVerified,
      };
      if (editForm.password.trim()) payload.password = editForm.password.trim();
      await api(`/admin/users/${editing.id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify(payload),
      });
      setMsg("User updated.");
      setFormOpen(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(u: UserRow) {
    if (!token) return;
    if (!window.confirm(`Soft-delete ${u.name} (${u.email})?`)) return;
    setBusyId(u.id);
    setError("");
    try {
      await api(`/admin/users/${u.id}`, { method: "DELETE", token });
      setMsg(`${u.name} deactivated.`);
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
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-[#0B1F3A] lg:text-[28px]">
              User Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage accounts across all Ellowring roles — create, edit, and deactivate users.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(15,61,222,0.25)]"
          >
            <Plus size={16} /> Add User
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Total", value: stats.total, sub: "In current view", tint: "text-[#0F3DDE] bg-blue-50" },
            { label: "Active", value: stats.active, sub: "Enabled accounts", tint: "text-emerald-700 bg-emerald-50" },
            { label: "Inactive", value: stats.inactive, sub: "Disabled", tint: "text-slate-600 bg-slate-100" },
          ].map((k) => (
            <div key={k.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{k.label}</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-[#0B1F3A]">{k.value}</p>
              <p className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${k.tint}`}>
                {k.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              className="input w-full pl-10"
              placeholder="Search name or email…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button
                key={r.value || "all"}
                type="button"
                onClick={() => setRoleFilter(r.value)}
                className={clsx(
                  "rounded-full px-3 py-1.5 text-xs font-bold transition",
                  roleFilter === r.value
                    ? "bg-[#0F3DDE] text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Loading users…
          </p>
        )}
        {error && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">{error}</p>
        )}
        {msg && (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
            {msg}
            {tempPassword ? (
              <span className="mt-1 block font-mono text-xs">
                Temporary password: <strong>{tempPassword}</strong>
              </span>
            ) : null}
          </p>
        )}

        {formOpen && (
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 lg:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0B1F3A]">
                {editing ? "Edit User" : "New User"}
              </h2>
              <button
                type="button"
                className="rounded-full p-2 text-slate-400 hover:bg-slate-50"
                onClick={() => {
                  setFormOpen(false);
                  setEditing(null);
                }}
              >
                <X size={18} />
              </button>
            </div>
            {editing ? (
              <form onSubmit={onUpdate} className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                    Email
                  </span>
                  <input className="input bg-slate-50" value={editing.email} readOnly disabled />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                    Name *
                  </span>
                  <input
                    className="input"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                    Phone
                  </span>
                  <input
                    className="input"
                    value={editForm.phone}
                    onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                    Role
                  </span>
                  <select
                    className="input"
                    value={editForm.role}
                    onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                  >
                    {ASSIGNABLE_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                    New password
                  </span>
                  <input
                    className="input"
                    type="password"
                    placeholder="Leave blank to keep"
                    value={editForm.password}
                    onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))}
                  />
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm((f) => ({ ...f, isActive: e.target.checked }))}
                  />
                  <span className="text-sm font-semibold text-slate-700">Active</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.isVerified}
                    onChange={(e) => setEditForm((f) => ({ ...f, isVerified: e.target.checked }))}
                  />
                  <span className="text-sm font-semibold text-slate-700">Verified</span>
                </label>
                <div className="flex gap-2 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Update User
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormOpen(false);
                      setEditing(null);
                    }}
                    className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={onCreate} className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                    Name *
                  </span>
                  <input
                    className="input"
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                    Email *
                  </span>
                  <input
                    className="input"
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                    Password
                  </span>
                  <input
                    className="input"
                    type="password"
                    placeholder="Auto-generated if empty"
                    value={createForm.password}
                    onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                    Phone
                  </span>
                  <input
                    className="input"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                    Role
                  </span>
                  <select
                    className="input"
                    value={createForm.role}
                    onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value }))}
                  >
                    {ASSIGNABLE_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={createForm.isActive}
                    onChange={(e) => setCreateForm((f) => ({ ...f, isActive: e.target.checked }))}
                  />
                  <span className="text-sm font-semibold text-slate-700">Active</span>
                </label>
                <div className="flex gap-2 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Create User
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
            )}
          </section>
        )}

        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Last login / Created</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#0F3DDE]">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        u.isActive
                          ? "rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"
                          : "rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500"
                      }
                    >
                      {u.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    <span className="block text-xs">{fmtDate(u.lastLoginAt)}</span>
                    <span className="block text-[11px] text-slate-400">Created {fmtDate(u.createdAt)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(u)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#0F3DDE] hover:bg-blue-50"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        disabled={busyId === u.id}
                        onClick={() => void onDelete(u)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      >
                        {busyId === u.id ? (
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
          {!loading && users.length === 0 && (
            <div className="flex flex-col items-center py-12 text-slate-400">
              <Users size={32} />
              <p className="mt-2 text-sm">No users match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

export default function AdminUsersPage() {
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
      <AdminUsersPageInner />
    </Suspense>
  );
}
