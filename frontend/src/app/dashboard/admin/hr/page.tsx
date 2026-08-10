"use client";

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Users, Loader2, Pencil, Save, Trash2 } from "lucide-react";
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

type Employee = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  designation?: string | null;
  department?: string | null;
  employeeNo?: string | null;
  salary?: number | string | null;
  isActive?: boolean;
};

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  designation: "",
  department: "",
  employeeNo: "",
  salary: "",
  isActive: true,
};

function AdminHrPageInner() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
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
      const list = await api<Employee[]>("/admin/employees", { token });
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load employees");
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
    const active = items.filter((e) => e.isActive !== false).length;
    const departments = new Set(items.map((e) => (e.department || "").trim()).filter(Boolean)).size;
    return { total: items.length, active, departments, inactive: items.length - active };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((e) => {
      const hay = `${e.name} ${e.email || ""} ${e.department || ""} ${e.designation || ""} ${e.employeeNo || ""}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (statusFilter === "active" && e.isActive === false) return false;
      if (statusFilter === "inactive" && e.isActive !== false) return false;
      return true;
    });
  }, [items, q, statusFilter]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  function openEdit(e: Employee) {
    setEditingId(e.id);
    setForm({
      name: e.name || "",
      email: e.email || "",
      phone: e.phone || "",
      designation: e.designation || "",
      department: e.department || "",
      employeeNo: e.employeeNo || "",
      salary: e.salary != null ? String(e.salary) : "",
      isActive: e.isActive !== false,
    });
    setFormOpen(true);
    setMsg("");
    setError("");
  }

  async function onSave(ev: FormEvent) {
    ev.preventDefault();
    if (!token) return;
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        designation: form.designation.trim() || null,
        department: form.department.trim() || null,
        salary: form.salary.trim() ? Number(form.salary) : null,
        isActive: form.isActive,
      };
      if (!editingId && form.employeeNo.trim()) payload.employeeNo = form.employeeNo.trim();
      if (editingId) {
        await api(`/admin/employees/${editingId}`, {
          method: "PATCH",
          token,
          body: JSON.stringify(payload),
        });
        setMsg("Employee updated.");
      } else {
        await api("/admin/employees", { method: "POST", token, body: JSON.stringify(payload) });
        setMsg("Employee created.");
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

  async function onDelete(e: Employee) {
    if (!token) return;
    if (!window.confirm(`Delete employee "${e.name}"?`)) return;
    setBusyId(e.id);
    setError("");
    try {
      await api(`/admin/employees/${e.id}`, { method: "DELETE", token });
      setMsg("Employee removed.");
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
          title="HR / Employees"
          description="Internal staff — departments, designations, and employment status."
          actionLabel="Add Employee"
          onAction={openCreate}
        />

        <AdminStatRow
          stats={[
            { label: "Total", value: stats.total, sub: "All employees", tint: "text-[#0F3DDE] bg-blue-50" },
            { label: "Active", value: stats.active, sub: "On board", tint: "text-emerald-700 bg-emerald-50" },
            { label: "Departments", value: stats.departments, sub: "Unique", tint: "text-slate-600 bg-slate-100" },
            { label: "Off-board", value: stats.inactive, sub: "Inactive", tint: "text-amber-700 bg-amber-50" },
          ]}
        />

        <AdminToolbar
          q={q}
          onQ={setQ}
          placeholder="Search employees…"
          filters={
            <AdminFilterPills
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { id: "all", label: "All" },
                { id: "active", label: "Active" },
                { id: "inactive", label: "Inactive" },
              ]}
            />
          }
        />

        <AdminFlash loading={loading} error={error} msg={msg} loadingLabel="Loading employees…" />

        {formOpen && (
          <AdminFormPanel
            title={editingId ? "Edit Employee" : "New Employee"}
            onClose={() => {
              setFormOpen(false);
              setEditingId(null);
            }}
          >
            <form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Name *
                </span>
                <input
                  className="input"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Email
                </span>
                <input
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Phone
                </span>
                <input
                  className="input"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Designation
                </span>
                <input
                  className="input"
                  value={form.designation}
                  onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Department
                </span>
                <input
                  className="input"
                  value={form.department}
                  onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                />
              </label>
              {!editingId && (
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                    Employee No
                  </span>
                  <input
                    className="input"
                    value={form.employeeNo}
                    onChange={(e) => setForm((f) => ({ ...f, employeeNo: e.target.value }))}
                    placeholder="Auto if empty"
                  />
                </label>
              )}
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-500">
                  Salary (₹)
                </span>
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={form.salary}
                  onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))}
                />
              </label>
              <label className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
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
                  {editingId ? "Update Employee" : "Save Employee"}
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
                <th className="px-4 py-3 font-semibold">Employee Name</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Designation</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    <div>{e.name}</div>
                    {e.employeeNo ? <div className="text-xs text-slate-400">{e.employeeNo}</div> : null}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{e.department || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{e.designation || "—"}</td>
                  <td className="px-4 py-3">{statusPill(e.isActive !== false)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(e)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#0F3DDE] hover:bg-blue-50"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        disabled={busyId === e.id}
                        onClick={() => void onDelete(e)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      >
                        {busyId === e.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}{" "}
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
              <Users size={32} />
              <p className="mt-2 text-sm">No employees match your filters.</p>
            </div>
          )}
        </AdminTableCard>
      </div>
    </AdminShell>
  );
}

export default function AdminHrPage() {
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
      <AdminHrPageInner />
    </Suspense>
  );
}
