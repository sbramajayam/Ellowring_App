"use client";

import { CollegeShell } from "@/components/college-shell";
import { ModuleCard, DataTable } from "@/components/role-shell";

export default function Page() {
  return (
    <CollegeShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admission Leads</h1>
          <p className="mt-1 text-sm text-slate-500">Ellowring-sourced student leads for your programmes.</p>
        </div>
        <ModuleCard
          title="Phase 2 module workspace"
          description="Ellowring-sourced student leads for your programmes."
        />
        <DataTable columns={["Record","Programme","Owner","Status"]} rows={[["Sample Admission Leads","—","Admissions","Active"]]} />
      </div>
    </CollegeShell>
  );
}
