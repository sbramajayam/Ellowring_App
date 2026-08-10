"use client";

import { Bookmark } from "lucide-react";
import { StudentShell } from "@/components/student-shell";

export default function BookmarksPage() {
  return (
    <StudentShell>
      <div className="w-full space-y-4 p-4 lg:p-6 xl:px-10">
        <h1 className="font-display text-2xl font-extrabold text-[#0B1F3A]">Bookmarks</h1>
        <p className="text-sm text-slate-500">Save courses, coaching programmes, and papers for later.</p>
        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-slate-100">
          <Bookmark className="mx-auto text-slate-300" size={32} />
          <p className="mt-3 text-sm text-slate-500">No bookmarks yet — save items from Courses, Coaching, or Papers.</p>
        </div>
      </div>
    </StudentShell>
  );
}
