"use client";

import { CollegeShell } from "@/components/college-shell";
import { ModuleCard, DataTable } from "@/components/role-shell";

export default function Page() {
  return (
    <CollegeShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="mt-1 text-sm text-slate-500">Downloadable admission and placement reports.</p>
        </div>
        <ModuleCard
          title="Phase 2 module workspace"
          description="Downloadable admission and placement reports."
        />
        <DataTable columns={["Record","Programme","Owner","Status"]} rows={[["Sample Reports","—","Admissions","Active"]]} />
      </div>
    </CollegeShell>
  );
}
