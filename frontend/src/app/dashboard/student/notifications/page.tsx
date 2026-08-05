"use client";

import { useEffect, useState } from "react";
import { StudentShell } from "@/components/student-shell";
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

export default function StudentNotificationsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Notif[]>([]);

  useEffect(() => {
    if (!token) return;
    api<Notif[]>("/notifications", { token }).then(setItems).catch(console.error);
  }, [token]);

  return (
    <StudentShell>
      <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
      <div className="mt-5 space-y-3">
        {items.map((n) => (
          <div key={n.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-slate-900">{n.title}</h3>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">
                {n.type}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{n.message}</p>
          </div>
        ))}
        {!items.length && <p className="text-sm text-slate-500">No notifications yet.</p>}
      </div>
      </div>
    </StudentShell>
  );
}
