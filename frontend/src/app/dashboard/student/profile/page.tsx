"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { ChevronDown, Loader2, Save } from "lucide-react";
import clsx from "clsx";
import { StudentShell } from "@/components/student-shell";
import {
  PrimaryButton,
  StudentModuleChrome,
} from "@/components/student-home/module-chrome";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf } from "@/lib/labels";

type EducationEntry = {
  id: string;
  institution?: string;
  degree?: string;
  board?: string;
  grade?: string;
  year?: number | string;
  percentage?: number | string;
};

type CareerInterest = {
  id: string;
  title: string;
};

type StudentProfile = {
  completionPct?: number;
  grade?: string;
  stream?: string;
  city?: string;
  state?: string;
  gender?: string;
  bio?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
  };
  educationHistory?: EducationEntry[];
  careerInterests?: CareerInterest[];
};

type SectionKey = "personal" | "education" | "skills" | "documents" | "password";

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "personal", label: "Personal Information" },
  { key: "education", label: "Education Details" },
  { key: "skills", label: "Skills & Interests" },
  { key: "documents", label: "Documents" },
  { key: "password", label: "Change Password" },
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-sm outline-none focus:border-[#0F3DDE] focus:bg-white focus:ring-4 focus:ring-blue-100";

export default function ProfilePage() {
  const { token, user, refresh } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState<SectionKey | null>("personal");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [personal, setPersonal] = useState({
    name: "",
    phone: "",
    gender: "",
    grade: "",
    stream: "",
    city: "",
    state: "",
    bio: "",
  });
  const [interests, setInterests] = useState("");
  const [documents, setDocuments] = useState({
    resumeUrl: "",
    linkedinUrl: "",
    githubUrl: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api<StudentProfile>("/students/me", { token });
      setProfile(data);
      setPersonal({
        name: data.user?.name || user?.name || "",
        phone: data.user?.phone || "",
        gender: labelOf(data.gender, ""),
        grade: labelOf(data.grade, ""),
        stream: labelOf(data.stream, ""),
        city: labelOf(data.city, ""),
        state: labelOf(data.state, ""),
        bio: labelOf(data.bio, ""),
      });
      setInterests(
        (data.careerInterests || []).map((c) => c.title).join(", "),
      );
      setDocuments({
        resumeUrl: data.resumeUrl || "",
        linkedinUrl: data.linkedinUrl || "",
        githubUrl: data.githubUrl || "",
      });
    } catch (err) {
      console.error(err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [token, user?.name]);

  useEffect(() => {
    load();
  }, [load]);

  function toggleSection(key: SectionKey) {
    setOpenSection((prev) => (prev === key ? null : key));
    setMsg("");
    setError("");
  }

  async function savePersonal(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setBusy(true);
    setMsg("");
    setError("");
    try {
      await api("/students/me", {
        method: "PATCH",
        token,
        body: JSON.stringify(personal),
      });
      await refresh();
      await load();
      setMsg("Personal information saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveEducation(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setBusy(true);
    setMsg("");
    setError("");
    try {
      await api("/students/me", {
        method: "PATCH",
        token,
        body: JSON.stringify({ grade: personal.grade, stream: personal.stream }),
      });
      await load();
      setMsg("Education details saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveSkills(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setBusy(true);
    setMsg("");
    setError("");
    try {
      await api("/students/me", {
        method: "PATCH",
        token,
        body: JSON.stringify({ interests }),
      });
      await load();
      setMsg("Skills & interests saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveDocuments(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setBusy(true);
    setMsg("");
    setError("");
    try {
      await api("/students/me", {
        method: "PATCH",
        token,
        body: JSON.stringify(documents),
      });
      await load();
      setMsg("Documents saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setBusy(true);
    setMsg("");
    setError("");
    try {
      await api("/auth/change-password", {
        method: "POST",
        token,
        body: JSON.stringify(passwordForm),
      });
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setMsg("Password changed successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password change failed");
    } finally {
      setBusy(false);
    }
  }

  const completionPct = profile?.completionPct ?? 0;
  const displayName = profile?.user?.name || user?.name || "Student";
  const displayEmail = profile?.user?.email || user?.email || "";
  const avatarUrl = profile?.user?.avatarUrl;
  const location = [labelOf(profile?.city, ""), labelOf(profile?.state, "")].filter(Boolean).join(", ");

  return (
    <StudentShell>
      <StudentModuleChrome
        title="Profile"
        description="Your student account and academic profile."
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-[#0F3DDE]" size={28} />
          </div>
        ) : (
          <>
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100 lg:p-8">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt=""
                  className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-[#EEF2FF]"
                />
              ) : (
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#0F3DDE] text-2xl font-bold text-white ring-4 ring-[#EEF2FF]">
                  {initials(displayName)}
                </div>
              )}
              <h2 className="mt-4 text-xl font-bold text-slate-900">{displayName}</h2>
              <p className="text-sm text-slate-500">{displayEmail}</p>
              {location ? <p className="mt-1 text-sm text-slate-400">{location}</p> : null}

              <div className="mx-auto mt-6 max-w-md">
                <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">Profile completion</span>
                  <span className="text-[#0F3DDE]">{completionPct}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#0F3DDE] transition-all"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </div>
            </div>

            {msg ? (
              <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{msg}</p>
            ) : null}
            {error ? (
              <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
            ) : null}

            <div className="mt-5 space-y-2">
              {SECTIONS.map(({ key, label }) => {
                const open = openSection === key;
                return (
                  <div key={key} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                    <button
                      type="button"
                      onClick={() => toggleSection(key)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left"
                    >
                      <span className="text-sm font-bold text-slate-800">{label}</span>
                      <ChevronDown
                        size={18}
                        className={clsx("text-slate-400 transition", open && "rotate-180")}
                      />
                    </button>

                    {open ? (
                      <div className="border-t border-slate-100 px-5 pb-5 pt-2">
                        {key === "personal" ? (
                          <form onSubmit={savePersonal} className="space-y-3">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <label className="block text-sm">
                                <span className="font-medium text-slate-600">Name</span>
                                <input
                                  className={inputClass}
                                  value={personal.name}
                                  onChange={(e) => setPersonal((p) => ({ ...p, name: e.target.value }))}
                                />
                              </label>
                              <label className="block text-sm">
                                <span className="font-medium text-slate-600">Phone</span>
                                <input
                                  className={inputClass}
                                  value={personal.phone}
                                  onChange={(e) => setPersonal((p) => ({ ...p, phone: e.target.value }))}
                                />
                              </label>
                              <label className="block text-sm">
                                <span className="font-medium text-slate-600">Gender</span>
                                <input
                                  className={inputClass}
                                  value={personal.gender}
                                  onChange={(e) => setPersonal((p) => ({ ...p, gender: e.target.value }))}
                                />
                              </label>
                              <label className="block text-sm">
                                <span className="font-medium text-slate-600">Grade</span>
                                <input
                                  className={inputClass}
                                  value={personal.grade}
                                  onChange={(e) => setPersonal((p) => ({ ...p, grade: e.target.value }))}
                                />
                              </label>
                              <label className="block text-sm">
                                <span className="font-medium text-slate-600">Stream</span>
                                <input
                                  className={inputClass}
                                  value={personal.stream}
                                  onChange={(e) => setPersonal((p) => ({ ...p, stream: e.target.value }))}
                                />
                              </label>
                              <label className="block text-sm">
                                <span className="font-medium text-slate-600">City</span>
                                <input
                                  className={inputClass}
                                  value={personal.city}
                                  onChange={(e) => setPersonal((p) => ({ ...p, city: e.target.value }))}
                                />
                              </label>
                              <label className="block text-sm sm:col-span-2">
                                <span className="font-medium text-slate-600">State</span>
                                <input
                                  className={inputClass}
                                  value={personal.state}
                                  onChange={(e) => setPersonal((p) => ({ ...p, state: e.target.value }))}
                                />
                              </label>
                            </div>
                            <label className="block text-sm">
                              <span className="font-medium text-slate-600">Bio</span>
                              <textarea
                                rows={3}
                                className={inputClass}
                                value={personal.bio}
                                onChange={(e) => setPersonal((p) => ({ ...p, bio: e.target.value }))}
                              />
                            </label>
                            <PrimaryButton type="submit" disabled={busy}>
                              <Save size={16} />
                              Save
                            </PrimaryButton>
                          </form>
                        ) : null}

                        {key === "education" ? (
                          <form onSubmit={saveEducation} className="space-y-4">
                            {(profile?.educationHistory || []).length > 0 ? (
                              <ul className="space-y-2">
                                {(profile?.educationHistory || []).map((edu) => (
                                  <li
                                    key={edu.id}
                                    className="rounded-xl bg-[#F8FAFC] px-4 py-3 text-sm ring-1 ring-slate-100"
                                  >
                                    <p className="font-bold text-slate-800">
                                      {labelOf(edu.institution, "Institution")}
                                    </p>
                                    <p className="text-slate-500">
                                      {[labelOf(edu.degree, ""), labelOf(edu.board, ""), labelOf(edu.year, "")]
                                        .filter(Boolean)
                                        .join(" · ") || "—"}
                                    </p>
                                    {edu.percentage != null ? (
                                      <p className="text-xs text-slate-400">Score: {labelOf(edu.percentage)}</p>
                                    ) : null}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-slate-500">No education history on file.</p>
                            )}
                            <div className="grid gap-3 sm:grid-cols-2">
                              <label className="block text-sm">
                                <span className="font-medium text-slate-600">Current grade</span>
                                <input
                                  className={inputClass}
                                  value={personal.grade}
                                  onChange={(e) => setPersonal((p) => ({ ...p, grade: e.target.value }))}
                                />
                              </label>
                              <label className="block text-sm">
                                <span className="font-medium text-slate-600">Stream</span>
                                <input
                                  className={inputClass}
                                  value={personal.stream}
                                  onChange={(e) => setPersonal((p) => ({ ...p, stream: e.target.value }))}
                                />
                              </label>
                            </div>
                            <PrimaryButton type="submit" disabled={busy}>
                              <Save size={16} />
                              Save
                            </PrimaryButton>
                          </form>
                        ) : null}

                        {key === "skills" ? (
                          <form onSubmit={saveSkills} className="space-y-3">
                            <label className="block text-sm">
                              <span className="font-medium text-slate-600">Career interests (comma-separated)</span>
                              <textarea
                                rows={4}
                                className={inputClass}
                                value={interests}
                                onChange={(e) => setInterests(e.target.value)}
                                placeholder="Medicine, AI Research, Entrepreneurship"
                              />
                            </label>
                            <PrimaryButton type="submit" disabled={busy}>
                              <Save size={16} />
                              Save
                            </PrimaryButton>
                          </form>
                        ) : null}

                        {key === "documents" ? (
                          <form onSubmit={saveDocuments} className="space-y-3">
                            <label className="block text-sm">
                              <span className="font-medium text-slate-600">Resume URL</span>
                              <input
                                className={inputClass}
                                value={documents.resumeUrl}
                                onChange={(e) => setDocuments((d) => ({ ...d, resumeUrl: e.target.value }))}
                                placeholder="https://…"
                              />
                            </label>
                            <label className="block text-sm">
                              <span className="font-medium text-slate-600">LinkedIn URL</span>
                              <input
                                className={inputClass}
                                value={documents.linkedinUrl}
                                onChange={(e) => setDocuments((d) => ({ ...d, linkedinUrl: e.target.value }))}
                                placeholder="https://linkedin.com/in/…"
                              />
                            </label>
                            <label className="block text-sm">
                              <span className="font-medium text-slate-600">GitHub URL</span>
                              <input
                                className={inputClass}
                                value={documents.githubUrl}
                                onChange={(e) => setDocuments((d) => ({ ...d, githubUrl: e.target.value }))}
                                placeholder="https://github.com/…"
                              />
                            </label>
                            <PrimaryButton type="submit" disabled={busy}>
                              <Save size={16} />
                              Save
                            </PrimaryButton>
                          </form>
                        ) : null}

                        {key === "password" ? (
                          <form onSubmit={changePassword} className="space-y-3">
                            <label className="block text-sm">
                              <span className="font-medium text-slate-600">Current password</span>
                              <input
                                type="password"
                                className={inputClass}
                                value={passwordForm.currentPassword}
                                onChange={(e) =>
                                  setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))
                                }
                              />
                            </label>
                            <label className="block text-sm">
                              <span className="font-medium text-slate-600">New password</span>
                              <input
                                type="password"
                                minLength={6}
                                className={inputClass}
                                value={passwordForm.newPassword}
                                onChange={(e) =>
                                  setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                                }
                              />
                            </label>
                            <PrimaryButton type="submit" disabled={busy}>
                              Change password
                            </PrimaryButton>
                          </form>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </StudentModuleChrome>
    </StudentShell>
  );
}
