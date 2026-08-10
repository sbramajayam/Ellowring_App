"use client";

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type StudentRow = {
  id: string;
  grade?: string | null;
  stream?: string | null;
  city?: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    isActive: boolean;
    createdAt: string;
  };
};

const emptyCreate = {
  name: "",
  email: "",
  password: "",
  phone: "",
};

const emptyEdit = {
  name: "",
  phone: "",
  isActive: true,
  password: "",
};

function AdminStudentsPageInner() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<StudentRow | null>(null);
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
      const qs = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
      const list = await api<StudentRow[]>(`/admin/students${qs}`, { token });
      setStudents(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load students");
    } finally {
      setLoading(false);
    }
  }, [token, q]);

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

  const stats = useMemo(
    () => ({
      total: students.length,
      active: students.filter((s) => s.user.isActive).length,
    }),
    [students],
  );

  function openCreate() {
    setEditing(null);
    setCreateForm(emptyCreate);
    setTempPassword(null);
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  function openEdit(s: StudentRow) {
    setEditing(s);
    setEditForm({
      name: s.user.name,
      phone: s.user.phone || "",
      isActive: s.user.isActive,
      password: "",
    });
    setFormOpen(true);
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
        role: "STUDENT",
      };
      if (createForm.phone.trim()) payload.phone = createForm.phone.trim();
      if (createForm.password.trim()) payload.password = createForm.password.trim();
      const res = await api<{ name: string; temporaryPassword?: string }>("/admin/users", {
        method: "POST",
        token,
        body: JSON.stringify(payload),
      });
      if (res.temporaryPassword) setTempPassword(res.temporaryPassword);
      setMsg(`Student ${res.name} created. Grade/stream can be set later via student profile.`);
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
        isActive: editForm.isActive,
      };
      if (editForm.password.trim()) payload.password = editForm.password.trim();
      await api(`/admin/users/${editing.user.id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify(payload),
      });
      setMsg("Student updated.");
      setFormOpen(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(s: StudentRow) {
    if (!token) return;
    if (!window.confirm(`Deactivate student ${s.user.name}?`)) return;
    setBusyId(s.user.id);
    setError("");
    try {
      await api(`/admin/users/${s.user.id}`, { method: "DELETE", token });
      setMsg(`${s.user.name} deactivated.`);
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
              Student Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create student accounts and manage enrollment profiles across the platform.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(15,61,222,0.25)]"
          >
            <Plus size={16} /> Add Student
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Total Students</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-[#0B1F3A]">{stats.total}</p>
            <p className="mt-2 inline-flex rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
              In current view
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Active</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-[#0B1F3A]">{stats.active}</p>
            <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              Enabled accounts
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              className="input w-full pl-10"
              placeholder="Search name, email, or city…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <p className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Loading students…
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
                {editing ? "Edit Student" : "New Student"}
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
                  <input className="input bg-slate-50" value={editing.user.email} readOnly disabled />
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
                <p className="text-xs text-slate-400 sm:col-span-2">
                  Grade, stream, and city are updated by the student via their profile (`/students/me`).
                </p>
                <div className="flex gap-2 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Update Student
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
                <p className="text-xs text-slate-400 sm:col-span-2">
                  A student profile is created automatically. Grade and stream can be filled in later by the
                  student.
                </p>
                <div className="flex gap-2 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0F3DDE] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Create Student
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
                <th className="px-4 py-3 font-semibold">Grade</th>
                <th className="px-4 py-3 font-semibold">Stream</th>
                <th className="px-4 py-3 font-semibold">City</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-800">{s.user.name}</td>
                  <td className="px-4 py-3 text-slate-600">{s.user.email}</td>
                  <td className="px-4 py-3 text-slate-600">{s.grade || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{s.stream || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{s.city || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        s.user.isActive
                          ? "rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"
                          : "rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500"
                      }
                    >
                      {s.user.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(s)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#0F3DDE] hover:bg-blue-50"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        disabled={busyId === s.user.id}
                        onClick={() => void onDelete(s)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      >
                        {busyId === s.user.id ? (
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
          {!loading && students.length === 0 && (
            <div className="flex flex-col items-center py-12 text-slate-400">
              <GraduationCap size={32} />
              <p className="mt-2 text-sm">No students found.</p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

export default function AdminStudentsPage() {
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
      <AdminStudentsPageInner />
    </Suspense>
  );
}
