"use client";

import { CollegeShell } from "@/components/college-shell";
import { ModuleCard, DataTable } from "@/components/role-shell";

export default function Page() {
  return (
    <CollegeShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Events</h1>
          <p className="mt-1 text-sm text-slate-500">Open days, counselling camps and drive calendars.</p>
        </div>
        <ModuleCard
          title="Phase 2 module workspace"
          description="Open days, counselling camps and drive calendars."
        />
        <DataTable columns={["Record","Programme","Owner","Status"]} rows={[["Sample Events","—","Admissions","Active"]]} />
      </div>
    </CollegeShell>
  );
}
