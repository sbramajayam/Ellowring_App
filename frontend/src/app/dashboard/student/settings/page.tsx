"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronRight,
  Globe,
  HelpCircle,
  Lock,
  Mail,
  Shield,
  User,
} from "lucide-react";
import clsx from "clsx";
import { StudentShell } from "@/components/student-shell";
import {
  PrimaryButton,
  StudentModuleChrome,
} from "@/components/student-home/module-chrome";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const SETTINGS_KEY = "ellowring_settings_v1";

type SettingsPrefs = {
  pushNotifications: boolean;
  emailNotifications: boolean;
  marketingEmails: boolean;
};

const defaultPrefs: SettingsPrefs = {
  pushNotifications: true,
  emailNotifications: true,
  marketingEmails: false,
};

type ExpandKey =
  | "account-info"
  | "change-password"
  | "privacy"
  | "notif-prefs"
  | "email-prefs"
  | "language"
  | "theme"
  | null;

function loadPrefs(): SettingsPrefs {
  if (typeof window === "undefined") return defaultPrefs;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultPrefs;
    return { ...defaultPrefs, ...JSON.parse(raw) };
  } catch {
    return defaultPrefs;
  }
}

function savePrefs(prefs: SettingsPrefs) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(prefs));
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-2">
      <span className="text-sm text-slate-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          "relative h-6 w-11 shrink-0 rounded-full transition",
          checked ? "bg-[#0F3DDE]" : "bg-slate-200",
        )}
      >
        <span
          className={clsx(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
            checked ? "left-[22px]" : "left-0.5",
          )}
        />
      </button>
    </label>
  );
}

function SettingRow({
  icon: Icon,
  label,
  hint,
  expanded,
  onToggle,
  children,
}: {
  icon: typeof User;
  label: string;
  hint?: string;
  expanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-[#F8FAFC]"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#0F3DDE]">
          <Icon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-800">{label}</p>
          {hint ? <p className="text-xs text-slate-400">{hint}</p> : null}
        </div>
        <ChevronRight
          size={18}
          className={clsx("shrink-0 text-slate-400 transition", expanded && "rotate-90")}
        />
      </button>
      {expanded && children ? (
        <div className="border-t border-slate-100 px-4 pb-4 pt-2">{children}</div>
      ) : null}
    </div>
  );
}

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-sm outline-none focus:border-[#0F3DDE] focus:bg-white focus:ring-4 focus:ring-blue-100";

export default function SettingsPage() {
  const { token, user, refresh } = useAuth();
  const [expanded, setExpanded] = useState<ExpandKey>(null);
  const [prefs, setPrefs] = useState<SettingsPrefs>(defaultPrefs);
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPrefs(loadPrefs());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  function toggle(key: ExpandKey) {
    setExpanded((prev) => (prev === key ? null : key));
    setMsg("");
    setError("");
  }

  function updatePrefs(patch: Partial<SettingsPrefs>) {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    savePrefs(next);
  }

  async function saveAccount(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    try {
      setError("");
      await api("/auth/profile", {
        method: "PATCH",
        token,
        body: JSON.stringify({ name }),
      });
      await refresh();
      setMsg("Account information updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    try {
      setError("");
      await api("/auth/change-password", {
        method: "POST",
        token,
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setMsg("Password changed.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password change failed");
    }
  }

  if (!hydrated) return null;

  return (
    <StudentShell>
      <StudentModuleChrome
        title="Settings"
        description="Manage account, preferences, and support."
      >
        {msg ? (
          <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{msg}</p>
        ) : null}
        {error ? (
          <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
        ) : null}

        <div className="space-y-6">
          <section>
            <h2 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">Account</h2>
            <div className="space-y-2">
              <SettingRow
                icon={User}
                label="Account Information"
                hint="Name and email"
                expanded={expanded === "account-info"}
                onToggle={() => toggle("account-info")}
              >
                <form onSubmit={saveAccount} className="space-y-3 pt-1">
                  <label className="block text-sm">
                    <span className="font-medium text-slate-600">Email</span>
                    <input className={inputClass} value={user?.email || ""} disabled />
                  </label>
                  <label className="block text-sm">
                    <span className="font-medium text-slate-600">Display name</span>
                    <input
                      className={inputClass}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                  <PrimaryButton type="submit">Save</PrimaryButton>
                </form>
              </SettingRow>

              <SettingRow
                icon={Lock}
                label="Change Password"
                expanded={expanded === "change-password"}
                onToggle={() => toggle("change-password")}
              >
                <form onSubmit={changePassword} className="space-y-3 pt-1">
                  <input
                    type="password"
                    placeholder="Current password"
                    className={inputClass}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="New password (min 6)"
                    minLength={6}
                    className={inputClass}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <PrimaryButton type="submit">Change password</PrimaryButton>
                </form>
              </SettingRow>

              <SettingRow
                icon={Shield}
                label="Privacy & Security"
                hint="How we protect your data"
                expanded={expanded === "privacy"}
                onToggle={() => toggle("privacy")}
              >
                <div className="space-y-2 pt-1 text-sm text-slate-600">
                  <p>
                    Your profile and academic data are encrypted in transit and stored securely. We never sell your
                    personal information to third parties.
                  </p>
                  <p>
                    You can update your password anytime and control notification preferences below. For account
                    deletion requests, contact support via Messages.
                  </p>
                </div>
              </SettingRow>
            </div>
          </section>

          <section>
            <h2 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">Preferences</h2>
            <div className="space-y-2">
              <SettingRow
                icon={Bell}
                label="Notification Preferences"
                expanded={expanded === "notif-prefs"}
                onToggle={() => toggle("notif-prefs")}
              >
                <div className="pt-1">
                  <Toggle
                    label="Push notifications"
                    checked={prefs.pushNotifications}
                    onChange={(v) => updatePrefs({ pushNotifications: v })}
                  />
                </div>
              </SettingRow>

              <SettingRow
                icon={Mail}
                label="Email Preferences"
                expanded={expanded === "email-prefs"}
                onToggle={() => toggle("email-prefs")}
              >
                <div className="pt-1">
                  <Toggle
                    label="Account & activity emails"
                    checked={prefs.emailNotifications}
                    onChange={(v) => updatePrefs({ emailNotifications: v })}
                  />
                  <Toggle
                    label="Marketing & tips"
                    checked={prefs.marketingEmails}
                    onChange={(v) => updatePrefs({ marketingEmails: v })}
                  />
                </div>
              </SettingRow>

              <SettingRow
                icon={Globe}
                label="Language"
                hint="English"
                expanded={expanded === "language"}
                onToggle={() => toggle("language")}
              >
                <p className="pt-1 text-sm text-slate-600">
                  English is currently the only supported language. More languages coming soon.
                </p>
              </SettingRow>

              <SettingRow
                icon={Globe}
                label="Appearance"
                expanded={expanded === "theme"}
                onToggle={() => toggle("theme")}
              >
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm text-slate-600">Theme</span>
                  <ThemeToggle />
                </div>
              </SettingRow>
            </div>
          </section>

          <section>
            <h2 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">Support</h2>
            <div className="space-y-2">
              <Link
                href="/dashboard/student/messages"
                className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-slate-100 transition hover:bg-[#F8FAFC]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#0F3DDE]">
                  <HelpCircle size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800">Help & Support</p>
                  <p className="text-xs text-slate-400">Chat with our support team</p>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </Link>

              <a
                href="#"
                className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-slate-100 transition hover:bg-[#F8FAFC]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#0F3DDE]">
                  <Shield size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800">Terms & Privacy</p>
                  <p className="text-xs text-slate-400">Read our policies</p>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </a>
            </div>
          </section>
        </div>
      </StudentModuleChrome>
    </StudentShell>
  );
}
