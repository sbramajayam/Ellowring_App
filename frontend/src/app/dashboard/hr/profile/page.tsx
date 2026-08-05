"use client";

import { HrShell } from "@/components/hr-shell";
import { ModuleCard, DataTable } from "@/components/role-shell";

export default function Page() {
  return (
    <HrShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Employer brand page, verification and hiring packages.</p>
        </div>
        <ModuleCard
          title="Phase 2 module workspace"
          description="Employer brand page, verification and hiring packages."
        />
        <DataTable columns={["Item","Owner","Updated","Status"]} rows={[["Sample Company Profile","HR","Today","Open"]]} />
      </div>
    </HrShell>
  );
}
