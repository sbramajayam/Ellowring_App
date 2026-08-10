"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import {
  ModuleSelect,
  PrimaryButton,
  StudentModuleChrome,
} from "@/components/student-home/module-chrome";

const STORAGE_KEY = "ellowring_calendar_events";

type CalEvent = {
  id: string;
  title: string;
  date: string;
  type: "mock" | "deadline" | "other";
};

type ViewMode = "month" | "week" | "day";

const TYPE_COLORS: Record<CalEvent["type"], string> = {
  mock: "bg-violet-500",
  deadline: "bg-rose-500",
  other: "bg-[#0F3DDE]",
};

const TYPE_LABELS: Record<CalEvent["type"], string> = {
  mock: "Mock Test",
  deadline: "Deadline",
  other: "Other",
};

function loadEvents(): CalEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveEvents(list: CalEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function newId(): string {
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toYmd(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function startOfWeek(d: Date): Date {
  const copy = new Date(d);
  const day = copy.getDay();
  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

const emptyForm = { title: "", date: toYmd(new Date()), type: "other" as CalEvent["type"] };

export default function CalendarPage() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [view, setView] = useState<ViewMode>("month");
  const [cursor, setCursor] = useState(() => new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEvents(loadEvents());
    setHydrated(true);
  }, []);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalEvent[]>();
    events.forEach((e) => {
      const list = map.get(e.date) || [];
      list.push(e);
      map.set(e.date, list);
    });
    return map;
  }, [events]);

  const monthDays = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const start = startOfWeek(first);
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) days.push(addDays(start, i));
    return days;
  }, [cursor]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(cursor);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [cursor]);

  function persist(list: CalEvent[]) {
    setEvents(list);
    saveEvents(list);
  }

  function onSaveEvent(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const created: CalEvent = {
      id: newId(),
      title: form.title.trim(),
      date: form.date,
      type: form.type,
    };
    persist([...events, created]);
    setFormOpen(false);
    setForm({ ...emptyForm, date: form.date });
  }

  function onDeleteEvent(id: string) {
    persist(events.filter((ev) => ev.id !== id));
  }

  function prev() {
    if (view === "month") setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
    else if (view === "week") setCursor(addDays(cursor, -7));
    else setCursor(addDays(cursor, -1));
  }

  function next() {
    if (view === "month") setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
    else if (view === "week") setCursor(addDays(cursor, 7));
    else setCursor(addDays(cursor, 1));
  }

  const headerLabel = useMemo(() => {
    if (view === "month") return monthLabel(cursor);
    if (view === "week") {
      const end = addDays(startOfWeek(cursor), 6);
      return `${startOfWeek(cursor).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
    }
    return cursor.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }, [view, cursor]);

  const dayEvents = eventsByDate.get(toYmd(cursor)) || [];

  if (!hydrated) {
    return (
      <StudentShell>
        <p className="p-6 text-sm text-slate-500">
          <Loader2 className="mr-2 inline animate-spin" size={16} /> Loading…
        </p>
      </StudentShell>
    );
  }

  return (
    <StudentShell>
      <StudentModuleChrome
        title="Calendar"
        description="Track mock tests, deadlines and milestones."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard/student" }, { label: "Productivity" }]}
        actions={
          <PrimaryButton onClick={() => setFormOpen(true)}>
            <Plus size={16} /> Add Event
          </PrimaryButton>
        }
        filters={
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-100 p-1">
              {(["month", "week", "day"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${
                    view === v ? "bg-[#0F3DDE] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <ModuleSelect
              value=""
              onChange={() => {}}
              options={[
                { value: "", label: "Legend: Mock · Deadline · Other" },
              ]}
            />
            <span className="inline-flex items-center gap-3 text-[11px] font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-violet-500" /> Mock</span>
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Deadline</span>
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#0F3DDE]" /> Other</span>
            </span>
          </div>
        }
      >
        <div className="rounded-2xl bg-white ring-1 ring-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <button type="button" onClick={prev} className="rounded-lg p-2 hover:bg-slate-50" aria-label="Previous">
                <ChevronLeft size={18} />
              </button>
              <h2 className="font-display text-lg font-bold text-[#0B1F3A]">{headerLabel}</h2>
              <button type="button" onClick={next} className="rounded-lg p-2 hover:bg-slate-50" aria-label="Next">
                <ChevronRight size={18} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setCursor(new Date())}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Today
            </button>
          </div>

          {view === "month" && (
            <div className="p-4">
              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase text-slate-400">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((day) => {
                  const ymd = toYmd(day);
                  const inMonth = day.getMonth() === cursor.getMonth();
                  const dayEvts = eventsByDate.get(ymd) || [];
                  const isToday = ymd === toYmd(new Date());
                  return (
                    <button
                      key={ymd}
                      type="button"
                      onClick={() => {
                        setCursor(day);
                        setView("day");
                      }}
                      className={`min-h-[72px] rounded-xl p-1.5 text-left transition hover:bg-slate-50 ${
                        inMonth ? "bg-white" : "bg-slate-50/50 text-slate-400"
                      } ${isToday ? "ring-2 ring-[#0F3DDE]" : "ring-1 ring-slate-100"}`}
                    >
                      <span className={`text-xs font-bold ${isToday ? "text-[#0F3DDE]" : ""}`}>{day.getDate()}</span>
                      <div className="mt-1 space-y-0.5">
                        {dayEvts.slice(0, 2).map((ev) => (
                          <span key={ev.id} className={`block truncate rounded px-1 py-0.5 text-[9px] font-semibold text-white ${TYPE_COLORS[ev.type]}`}>
                            {ev.title}
                          </span>
                        ))}
                        {dayEvts.length > 2 ? (
                          <span className="text-[9px] text-slate-400">+{dayEvts.length - 2} more</span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {view === "week" && (
            <div className="grid grid-cols-7 gap-2 p-4">
              {weekDays.map((day) => {
                const ymd = toYmd(day);
                const dayEvts = eventsByDate.get(ymd) || [];
                const isToday = ymd === toYmd(new Date());
                return (
                  <div key={ymd} className={`rounded-xl p-3 ring-1 ${isToday ? "ring-2 ring-[#0F3DDE] bg-blue-50/30" : "ring-slate-100"}`}>
                    <p className="text-[11px] font-bold uppercase text-slate-400">
                      {day.toLocaleDateString("en-IN", { weekday: "short" })}
                    </p>
                    <p className={`text-lg font-bold ${isToday ? "text-[#0F3DDE]" : "text-slate-800"}`}>{day.getDate()}</p>
                    <div className="mt-2 space-y-1">
                      {dayEvts.map((ev) => (
                        <div key={ev.id} className={`rounded-lg px-2 py-1 text-[10px] font-semibold text-white ${TYPE_COLORS[ev.type]}`}>
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {view === "day" && (
            <div className="p-4">
              {dayEvents.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">
                  <CalendarDays className="mx-auto mb-2" size={24} />
                  No events on this day.
                </p>
              ) : (
                <ul className="space-y-2">
                  {dayEvents.map((ev) => (
                    <li key={ev.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
                      <div className="flex items-center gap-3">
                        <span className={`h-3 w-3 shrink-0 rounded-full ${TYPE_COLORS[ev.type]}`} />
                        <div>
                          <p className="font-bold text-slate-800">{ev.title}</p>
                          <p className="text-xs text-slate-500">{TYPE_LABELS[ev.type]} · {ev.date}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => onDeleteEvent(ev.id)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50">
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {formOpen ? (
          <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 lg:p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-[#0B1F3A]">Add Event</h2>
            <form onSubmit={onSaveEvent} className="grid max-w-md gap-4">
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Title *</span>
                <input className="input" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Date</span>
                <input className="input" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
              </label>
              <label>
                <span className="mb-1.5 block text-[12px] font-bold uppercase text-slate-500">Type</span>
                <select className="input" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as CalEvent["type"] }))}>
                  <option value="mock">Mock Test</option>
                  <option value="deadline">Deadline</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <div className="flex gap-2">
                <PrimaryButton type="submit">
                  <Save size={16} /> Save Event
                </PrimaryButton>
                <button type="button" onClick={() => setFormOpen(false)} className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : null}
      </StudentModuleChrome>
    </StudentShell>
  );
}
