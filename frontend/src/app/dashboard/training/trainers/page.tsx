"use client";

import { TrainingShell } from "@/components/training-shell";
import { ModuleCard, DataTable } from "@/components/role-shell";

export default function Page() {
  return (
    <TrainingShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trainers</h1>
          <p className="mt-1 text-sm text-slate-500">Faculty roster, availability and live-class assignments.</p>
        </div>
        <ModuleCard
          title="Phase 2 module workspace"
          description="Faculty roster, availability and live-class assignments."
        />
        <DataTable columns={["Item","Owner","Updated","Status"]} rows={[["Sample Trainers","Ops","Today","Active"],["Pipeline item","Faculty","Yesterday","Draft"]]} />
      </div>
    </TrainingShell>
  );
}
