"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { StudentShell } from "@/components/student-shell";
import { StudentBottomNav } from "@/components/student-home/bottom-nav";
import { SchoolHome } from "@/components/student-home/school-home";
import { CompetitiveHome } from "@/components/student-home/competitive-home";
import { CollegeHome } from "@/components/student-home/college-home";
import { useAuth } from "@/lib/auth-context";
import clsx from "clsx";

type Track = "school" | "competitive" | "college";

const tracks: { id: Track; label: string; hint: string }[] = [
  { id: "school", label: "12th Standard", hint: "School · Boards · NEET/JEE" },
  { id: "competitive", label: "TNPSC / Competitive", hint: "Govt exams prep" },
  { id: "college", label: "College Career", hint: "Internships · Jobs" },
];

const STORAGE_KEY = "ellowring_student_track";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [track, setTrack] = useState<Track>("school");
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Track | null;
      if (saved && tracks.some((t) => t.id === saved)) setTrack(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!pickerRef.current?.contains(e.target as Node)) setPickerOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const firstName = useMemo(() => {
    if (!user?.name) return "Vignesh";
    return user.name.replace(/^Mr\.?\s+/i, "").trim().split(/\s+/)[0] || "Vignesh";
  }, [user?.name]);

  function selectTrack(id: Track) {
    setTrack(id);
    setPickerOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  }

  return (
    <StudentShell>
      <div
        ref={pickerRef}
        className="relative !w-full !max-w-none min-h-[calc(100vh-3.5rem)] bg-[#FAFBFC] px-4 pb-28 pt-4 sm:px-6 lg:min-h-[calc(100vh-68px)] lg:px-8 lg:pb-10 lg:pt-6 xl:px-10"
        style={{ width: "100%", maxWidth: "none" }}
      >
        {pickerOpen ? (
          <div className="absolute left-4 right-4 top-4 z-30 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:left-5 sm:right-auto sm:w-80 lg:left-8">
            <p className="border-b border-slate-100 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Switch dashboard goal
            </p>
            {tracks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTrack(t.id)}
                className={clsx(
                  "flex w-full flex-col items-start px-4 py-3 text-left transition hover:bg-[#EFF6FF]",
                  track === t.id && "bg-[#EFF6FF]",
                )}
              >
                <span className={clsx("font-display text-sm font-bold", track === t.id ? "text-[#0F3DDE]" : "text-slate-800")}>
                  {t.label}
                </span>
                <span className="text-[11px] text-slate-500">{t.hint}</span>
              </button>
            ))}
          </div>
        ) : null}

        {track === "school" ? (
          <SchoolHome firstName={firstName} onChangeGoal={() => setPickerOpen(true)} />
        ) : null}
        {track === "competitive" ? (
          <CompetitiveHome firstName={firstName} onChangeGoal={() => setPickerOpen(true)} />
        ) : null}
        {track === "college" ? (
          <CollegeHome firstName={firstName} onChangeGoal={() => setPickerOpen(true)} />
        ) : null}
      </div>

      <StudentBottomNav variant={track} />
    </StudentShell>
  );
}
