"use client";

import { CollegeShell } from "@/components/college-shell";
import { ModuleCard, DataTable } from "@/components/role-shell";

export default function Page() {
  return (
    <CollegeShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">College Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Public profile, programmes, seat inventory and branding.</p>
        </div>
        <ModuleCard
          title="Phase 2 module workspace"
          description="Public profile, programmes, seat inventory and branding."
        />
        <DataTable columns={["Record","Programme","Owner","Status"]} rows={[["Sample College Profile","—","Admissions","Active"]]} />
      </div>
    </CollegeShell>
  );
}
