"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  ChevronDown,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { BrandLogo } from "@/components/student-home/brand-logo";
import { JobsHiringCollage } from "@/components/student-home/jobs-hiring-dashboard";
import { PillButton, WhiteCard } from "@/components/student-home/collage-ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf, moneyOf } from "@/lib/labels";

type Job = {
  id: string;
  title: string;
  location?: string | null;
  type?: string | null;
  mode?: string | null;
  salaryMin?: number | string | null;
  salaryMax?: number | string | null;
  experience?: string | null;
  skills?: string | null;
  description?: string | null;
  isActive?: boolean;
  company?: { name?: string; industry?: string; city?: string; logoUrl?: string } | null;
};

const emptyForm = {
  title: "",
  location: "",
  type: "FULL_TIME",
  mode: "HYBRID",
  salaryMin: "",
  salaryMax: "",
  experience: "",
  skills: "",
  description: "",
  isActive: true,
};

const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
];

const MODES = [
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "On-site" },
];

const FALLBACK: Job[] = [
  {
    id: "mock-j1",
    title: "Junior Full Stack Developer",
    location: "Chennai",
    type: "FULL_TIME",
    mode: "HYBRID",
    salaryMin: 450000,
    salaryMax: 650000,
    experience: "Fresher",
    company: { name: "Zoho" },
  },
  {
    id: "mock-j2",
    title: "Associate Software Engineer",
    location: "Bangalore",
    type: "FULL_TIME",
    mode: "ONSITE",
    salaryMin: 600000,
    salaryMax: 800000,
    experience: "0–1 years",
    company: { name: "Freshworks" },
  },
  {
    id: "mock-j3",
    title: "Digital Cadre – Full Stack",
    location: "Pan India",
    type: "FULL_TIME",
    mode: "HYBRID",
    salaryMin: 360000,
    salaryMax: 420000,
    experience: "Fresher",
    company: { name: "TCS" },
  },
];

function salaryLabel(job: Job): string {
  const min = job.salaryMin != null ? moneyOf(job.salaryMin) : null;
  const max = job.salaryMax != null ? moneyOf(job.salaryMax) : null;
  if (min && max) return `₹${min} – ₹${max}`;
  if (min) return `₹${min}+`;
  if (max) return `Up to ₹${max}`;
  return "Competitive";
}

export default function JobsPage() {
  const { token, user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "COMPANY" || user?.role === "TRAINING";
  const [items, setItems] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await api<Job[]>("/jobs", { token: token || undefined });
      setItems(Array.isArray(list) && list.length ? list : FALLBACK);
    } catch {
      setItems(FALLBACK);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onApply(id: string, title: string) {
    if (!token) {
      window.alert("Please sign in to apply for this job.");
      return;
    }
    if (id.startsWith("mock-")) {
      setMsg(`Applied to ${title} (demo listing).`);
      return;
    }
    setBusyId(id);
    try {
      await api(`/jobs/${id}/enroll`, { method: "POST", token }).catch(async () => {
        await api("/applications", { method: "POST", token, body: JSON.stringify({ jobId: id }) });
      });
      setMsg(`Applied to ${title}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Apply failed");
    } finally {
      setBusyId(null);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
    setAdminOpen(true);
  }

  function openEdit(item: Job) {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      location: item.location || "",
      type: item.type || "FULL_TIME",
      mode: item.mode || "HYBRID",
      salaryMin: item.salaryMin != null ? String(item.salaryMin) : "",
      salaryMax: item.salaryMax != null ? String(item.salaryMax) : "",
      experience: item.experience || "",
      skills: item.skills || "",
      description: item.description || "",
      isActive: item.isActive !== false,
    });
    setFormOpen(true);
    setAdminOpen(true);
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!token) return setError("Sign in required.");
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        location: form.location.trim() || null,
        type: form.type,
        mode: form.mode,
        salaryMin: form.salaryMin !== "" ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax !== "" ? Number(form.salaryMax) : null,
        experience: form.experience.trim() || null,
        skills: form.skills.trim() || null,
        description: form.description.trim() || null,
        isActive: form.isActive,
      };
      if (editingId) {
        await api(`/jobs/${editingId}`, { method: "PATCH", token, body: JSON.stringify(payload) });
        setMsg("Job updated.");
      } else {
        await api("/jobs", { method: "POST", token, body: JSON.stringify(payload) });
        setMsg("Job created.");
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(item: Job) {
    if (!token || !window.confirm(`Delete “${item.title}”?`)) return;
    try {
      await api(`/jobs/${item.id}`, { method: "DELETE", token });
      setMsg(`Deleted “${item.title}”.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const liveFooter = (
    <>
      {error ? <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-[13px] text-rose-700">{error}</p> : null}
      {msg ? <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-[13px] text-emerald-700">{msg}</p> : null}

      <WhiteCard
        title="Live Openings"
        action={loading ? <Loader2 className="animate-spin text-[#0F3DDE]" size={16} /> : (
          <span className="text-[11px] font-bold text-slate-400">{items.length} roles</span>
        )}
      >
        <ul className="space-y-2.5">
          {items.map((item) => {
            const company = labelOf(item.company, "Company");
            return (
              <li
                key={item.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-100"
              >
                <BrandLogo name={company} className="h-11 w-11" rounded="xl" />
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-[#0F3DDE]">{company}</p>
                  <p className="text-[14px] font-extrabold text-[#0B1F3A]">{item.title}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={11} /> {labelOf(item.location, "TBD")}
                    </span>
                    <span>{salaryLabel(item)}</span>
                    <span>{labelOf(item.experience, "")}</span>
                  </p>
                </div>
                <PillButton onClick={() => void onApply(item.id, item.title)} className="!py-2">
                  {busyId === item.id ? "Applying…" : "Apply Now"}
                </PillButton>
              </li>
            );
          })}
        </ul>
      </WhiteCard>

      {canManage ? (
        <details
          open={adminOpen}
          onToggle={(e) => setAdminOpen((e.target as HTMLDetailsElement).open)}
          className="rounded-[20px] bg-white p-4 shadow-[0_2px_14px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 lg:rounded-[22px] lg:p-5"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-display text-[15px] font-extrabold text-[#0B1F3A]">
            <span>Admin · Manage jobs</span>
            <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0F3DDE]">
              <ChevronDown size={16} /> {adminOpen ? "Collapse" : "Expand"}
            </span>
          </summary>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0F3DDE]"
              >
                <Plus size={14} /> Add Job
              </button>
            </div>
            {formOpen ? (
              <form onSubmit={onSave} className="mb-4 grid gap-3 rounded-2xl bg-[#F8FAFC] p-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Title</span>
                  <input
                    className="input"
                    required
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </label>
                <label>
                  <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Location</span>
                  <input
                    className="input"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  />
                </label>
                <label>
                  <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Type</span>
                  <select
                    className="input"
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  >
                    {JOB_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Mode</span>
                  <select
                    className="input"
                    value={form.mode}
                    onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value }))}
                  >
                    {MODES.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="mb-1 block text-[11px] font-bold uppercase text-slate-500">Experience</span>
                  <input
                    className="input"
                    value={form.experience}
                    onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                  />
                </label>
                <div className="flex flex-wrap gap-2 sm:col-span-2">
                  <PillButton type="submit" disabled={saving}>
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                  </PillButton>
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="rounded-full px-4 text-[12px] font-bold text-slate-500"
                  >
                    <X size={14} className="inline" /> Cancel
                  </button>
                </div>
              </form>
            ) : null}
            <ul className="space-y-2">
              {items
                .filter((i) => !i.id.startsWith("mock-"))
                .map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-[13px]"
                  >
                    <span className="font-semibold text-slate-700">{item.title}</span>
                    <span className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="rounded-lg p-2 text-[#0F3DDE] hover:bg-white"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void onDelete(item)}
                        className="rounded-lg p-2 text-rose-500 hover:bg-white"
                      >
                        <Trash2 size={14} />
                      </button>
                    </span>
                  </li>
                ))}
              {items.every((i) => i.id.startsWith("mock-")) ? (
                <li className="py-3 text-center text-[12px] text-slate-400">No live jobs yet — add one above.</li>
              ) : null}
            </ul>
          </div>
        </details>
      ) : null}
    </>
  );

  return (
    <StudentShell>
      <JobsHiringCollage footer={liveFooter} />
    </StudentShell>
  );
}
