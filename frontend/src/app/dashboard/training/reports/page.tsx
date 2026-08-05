"use client";

import { TrainingShell } from "@/components/training-shell";
import { ModuleCard, DataTable } from "@/components/role-shell";

export default function Page() {
  return (
    <TrainingShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="mt-1 text-sm text-slate-500">Enrolment, completion and revenue reports for your institute.</p>
        </div>
        <ModuleCard
          title="Phase 2 module workspace"
          description="Enrolment, completion and revenue reports for your institute."
        />
        <DataTable columns={["Item","Owner","Updated","Status"]} rows={[["Sample Reports","Ops","Today","Active"],["Pipeline item","Faculty","Yesterday","Draft"]]} />
      </div>
    </TrainingShell>
  );
}
