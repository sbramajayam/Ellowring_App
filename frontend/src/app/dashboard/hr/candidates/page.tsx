"use client";

import { HrShell } from "@/components/hr-shell";
import { ModuleCard, DataTable } from "@/components/role-shell";

export default function Page() {
  return (
    <HrShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidate Search</h1>
          <p className="mt-1 text-sm text-slate-500">Consent-gated search across Ellowring talent.</p>
        </div>
        <ModuleCard
          title="Phase 2 module workspace"
          description="Consent-gated search across Ellowring talent."
        />
        <DataTable columns={["Item","Owner","Updated","Status"]} rows={[["Sample Candidate Search","HR","Today","Open"]]} />
      </div>
    </HrShell>
  );
}
