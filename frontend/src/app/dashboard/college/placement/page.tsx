"use client";

import { CollegeShell } from "@/components/college-shell";
import { ModuleCard, DataTable } from "@/components/role-shell";

export default function Page() {
  return (
    <CollegeShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Placement Cell</h1>
          <p className="mt-1 text-sm text-slate-500">Campus drives, eligibility lists and company coordination.</p>
        </div>
        <ModuleCard
          title="Phase 2 module workspace"
          description="Campus drives, eligibility lists and company coordination."
        />
        <DataTable columns={["Record","Programme","Owner","Status"]} rows={[["Sample Placement Cell","—","Admissions","Active"]]} />
      </div>
    </CollegeShell>
  );
}
