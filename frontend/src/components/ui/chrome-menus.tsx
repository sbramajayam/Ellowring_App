"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock3,
  Crown,
  LogOut,
  Settings,
  User,
  X,
} from "lucide-react";
import clsx from "clsx";

const demoNotifications = [
  {
    id: "1",
    title: "NEET Mock Series unlocked",
    body: "Your weekly biology mock is ready.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "2",
    title: "Internship shortlist",
    body: "Frontend Intern · Stripe Campus Drive",
    time: "1h ago",
    unread: true,
  },
  {
    id: "3",
    title: "College deadline reminder",
    body: "NIT Trichy counselling form closes tomorrow.",
    time: "Yesterday",
    unread: false,
  },
];

export function NotificationCenter({
  href = "/dashboard/student/notifications",
}: {
  href?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-full p-2.5 text-slate-500 transition hover:bg-white hover:text-[#0F3DDE]"
        aria-label="Notifications"
      >
        <Bell size={20} strokeWidth={1.75} />
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#DC2626] px-1 text-[9px] font-bold text-white ring-2 ring-white">
          3
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-slate-900">Notifications</p>
              <p className="text-[11px] text-slate-500">2 unread updates</p>
            </div>
            <button
              type="button"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
          <ul className="max-h-80 overflow-y-auto p-2">
            {demoNotifications.map((n) => (
              <li
                key={n.id}
                className={clsx(
                  "mb-1 rounded-xl px-3 py-2.5 transition hover:bg-slate-50",
                  n.unread && "bg-[#EEF2FF]/60",
                )}
              >
                <div className="flex gap-2.5">
                  <span
                    className={clsx(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                      n.unread ? "bg-[#0F3DDE]/10 text-[#0F3DDE]" : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {n.unread ? <Bell size={14} /> : <CheckCircle2 size={14} />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{n.body}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-slate-400">
                      <Clock3 size={10} /> {n.time}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-100 p-2">
            <Link
              href={href}
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-xl bg-[#EEF2FF] py-2.5 text-xs font-bold text-[#0F3DDE] hover:bg-[#E0E7FF]"
            >
              View all notifications
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ProfileDropdown({
  name,
  roleLabel,
  profileHref,
  settingsHref,
  premiumHref,
  onLogout,
}: {
  name: string;
  roleLabel: string;
  profileHref: string;
  settingsHref: string;
  premiumHref?: string;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initial = name.slice(0, 1).toUpperCase();

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-1 transition hover:bg-white sm:pr-2.5"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F3DDE] text-sm font-bold text-white">
          {initial}
        </div>
        <div className="hidden text-left leading-tight sm:block">
          <p className="text-sm font-semibold text-slate-800">
            Hi, {name} <span aria-hidden>👋</span>
          </p>
          <p className="text-[11px] text-slate-500">{roleLabel}</p>
        </div>
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl">
          <div className="border-b border-slate-100 px-3 py-2.5">
            <p className="text-sm font-bold text-slate-900">{name}</p>
            <p className="text-[11px] text-slate-500">{roleLabel}</p>
          </div>
          <Link
            href={profileHref}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            <User size={15} className="text-slate-400" /> Profile
          </Link>
          <Link
            href={settingsHref}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Settings size={15} className="text-slate-400" /> Settings
          </Link>
          {premiumHref ? (
            <Link
              href={premiumHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <Crown size={15} className="text-amber-500" /> Ellowring Pro
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-[#DC2626] hover:bg-rose-50"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
