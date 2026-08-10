"use client";

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  Bot,
  Briefcase,
  CalendarDays,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import clsx from "clsx";
import { StudentShell } from "@/components/student-shell";
import {
  PrimaryButton,
  StudentModuleChrome,
} from "@/components/student-home/module-chrome";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type Notif = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

type TabKey = "all" | "unread" | "important";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function iconForType(type: string) {
  const t = type.toUpperCase();
  if (t === "SUCCESS") return Briefcase;
  if (t === "WARNING" || t === "ALERT") return CalendarDays;
  if (t === "SYSTEM") return Bot;
  return Bell;
}

function isImportant(n: Notif): boolean {
  const t = n.type.toUpperCase();
  return t === "WARNING" || t === "ALERT" || t === "SUCCESS";
}

export default function StudentNotificationsPage() {
  return (
    <Suspense
      fallback={
        <StudentShell>
          <div className="flex items-center gap-2 p-6 text-sm text-slate-500">
            <Loader2 className="animate-spin" size={16} /> Loading notifications…
          </div>
        </StudentShell>
      }
    >
      <StudentNotificationsInner />
    </Suspense>
  );
}

function StudentNotificationsInner() {
  const { token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ title: "", message: "", type: "INFO" });
  const [busy, setBusy] = useState(false);

  const tab: TabKey = (searchParams.get("filter") as TabKey) || "all";

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api<Notif[]>("/notifications", { token });
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const unreadCount = useMemo(() => items.filter((n) => !n.isRead).length, [items]);

  const filtered = useMemo(() => {
    if (tab === "unread") return items.filter((n) => !n.isRead);
    if (tab === "important") return items.filter(isImportant);
    return items;
  }, [items, tab]);

  function setTab(next: TabKey) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "all") params.delete("filter");
    else params.set("filter", next);
    const qs = params.toString();
    router.replace(qs ? `/dashboard/student/notifications?${qs}` : "/dashboard/student/notifications");
  }

  async function markAllRead() {
    if (!token) return;
    setBusy(true);
    try {
      await api("/notifications/read-all", { method: "PATCH", token });
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  }

  async function markRead(id: string) {
    if (!token) return;
    const item = items.find((n) => n.id === id);
    if (!item || item.isRead) return;
    try {
      await api(`/notifications/${id}/read`, { method: "PATCH", token });
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error(err);
    }
  }

  async function remove(id: string) {
    if (!token) return;
    try {
      await api(`/notifications/${id}`, { method: "DELETE", token });
      setItems((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  async function addNotification(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setBusy(true);
    try {
      const created = await api<Notif>("/notifications", {
        method: "POST",
        token,
        body: JSON.stringify(addForm),
      });
      setItems((prev) => [created, ...prev]);
      setAddForm({ title: "", message: "", type: "INFO" });
      setShowAdd(false);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  }

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread", count: unreadCount },
    { key: "important", label: "Important" },
  ];

  return (
    <StudentShell>
      <StudentModuleChrome
        title="Notifications"
        description="Stay updated on applications, exams, and platform alerts."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAdd((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <Plus size={16} />
              Add
            </button>
            <PrimaryButton onClick={markAllRead} disabled={busy || unreadCount === 0}>
              Mark all as read
            </PrimaryButton>
          </div>
        }
        filters={
          <div className="flex flex-wrap gap-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={clsx(
                  "rounded-full px-4 py-2 text-sm font-bold transition",
                  tab === t.key
                    ? "bg-[#0F3DDE] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                {t.label}
                {t.count !== undefined && t.count > 0 ? (
                  <span
                    className={clsx(
                      "ml-1.5 inline-flex min-w-[18px] items-center justify-center rounded-full px-1.5 text-[10px]",
                      tab === t.key ? "bg-white/20" : "bg-[#0F3DDE]/10 text-[#0F3DDE]",
                    )}
                  >
                    {t.count}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        }
      >
        {showAdd ? (
          <form
            onSubmit={addNotification}
            className="mb-5 space-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
          >
            <h2 className="text-sm font-bold text-slate-800">Add notification</h2>
            <input
              value={addForm.title}
              onChange={(e) => setAddForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Title"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0F3DDE]"
            />
            <textarea
              value={addForm.message}
              onChange={(e) => setAddForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Message"
              required
              rows={2}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0F3DDE]"
            />
            <select
              value={addForm.type}
              onChange={(e) => setAddForm((f) => ({ ...f, type: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0F3DDE]"
            >
              <option value="INFO">Info</option>
              <option value="SUCCESS">Success</option>
              <option value="WARNING">Warning</option>
              <option value="ALERT">Alert</option>
              <option value="SYSTEM">System</option>
            </select>
            <PrimaryButton type="submit" disabled={busy}>
              {busy ? <Loader2 size={16} className="animate-spin" /> : null}
              Save notification
            </PrimaryButton>
          </form>
        ) : null}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-[#0F3DDE]" size={28} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-100">
            <Bell className="mx-auto text-slate-300" size={36} />
            <p className="mt-3 text-sm font-medium text-slate-600">No notifications</p>
            <p className="mt-1 text-xs text-slate-400">
              {tab === "unread" ? "You're all caught up!" : "Alerts will appear here when something happens."}
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.map((n) => {
              const Icon = iconForType(n.type);
              return (
                <li key={n.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => markRead(n.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") markRead(n.id);
                    }}
                    className={clsx(
                      "group flex cursor-pointer items-start gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:ring-[#0F3DDE]/20",
                      !n.isRead && "bg-[#FAFBFF]",
                    )}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#0F3DDE]">
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={clsx("text-sm text-slate-800", !n.isRead && "font-bold")}>{n.title}</p>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="text-[11px] text-slate-400">{relativeTime(n.createdAt)}</span>
                          {!n.isRead ? (
                            <span className="h-2 w-2 rounded-full bg-[#0F3DDE]" aria-label="Unread" />
                          ) : null}
                        </div>
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">{n.message}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(n.id);
                      }}
                      className="shrink-0 rounded-lg p-2 text-slate-400 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                      aria-label="Delete notification"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </StudentModuleChrome>
    </StudentShell>
  );
}
