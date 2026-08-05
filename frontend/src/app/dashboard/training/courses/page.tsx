"use client";

import { TrainingShell } from "@/components/training-shell";
import { ModuleCard, DataTable } from "@/components/role-shell";

export default function Page() {
  return (
    <TrainingShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
          <p className="mt-1 text-sm text-slate-500">Publish and manage skills and coaching courses supplied to Ellowring.</p>
        </div>
        <ModuleCard
          title="Phase 2 module workspace"
          description="Publish and manage skills and coaching courses supplied to Ellowring."
        />
        <DataTable columns={["Item","Owner","Updated","Status"]} rows={[["Sample Courses","Ops","Today","Active"],["Pipeline item","Faculty","Yesterday","Draft"]]} />
      </div>
    </TrainingShell>
  );
}
