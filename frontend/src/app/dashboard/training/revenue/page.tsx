"use client";

import { TrainingShell } from "@/components/training-shell";
import { ModuleCard, DataTable } from "@/components/role-shell";

export default function Page() {
  return (
    <TrainingShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Revenue</h1>
          <p className="mt-1 text-sm text-slate-500">Course fee ledger, settlements and payouts to your institute wallet.</p>
        </div>
        <ModuleCard
          title="Phase 2 module workspace"
          description="Course fee ledger, settlements and payouts to your institute wallet."
        />
        <DataTable columns={["Item","Owner","Updated","Status"]} rows={[["Sample Revenue","Ops","Today","Active"],["Pipeline item","Faculty","Yesterday","Draft"]]} />
      </div>
    </TrainingShell>
  );
}
