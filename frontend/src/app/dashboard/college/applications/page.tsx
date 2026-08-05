"use client";

import { CollegeShell } from "@/components/college-shell";
import { ModuleCard, DataTable } from "@/components/role-shell";

export default function Page() {
  return (
    <CollegeShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
          <p className="mt-1 text-sm text-slate-500">Document review, fees and admission decisions.</p>
        </div>
        <ModuleCard
          title="Phase 2 module workspace"
          description="Document review, fees and admission decisions."
        />
        <DataTable columns={["Record","Programme","Owner","Status"]} rows={[["Sample Applications","—","Admissions","Active"]]} />
      </div>
    </CollegeShell>
  );
}
