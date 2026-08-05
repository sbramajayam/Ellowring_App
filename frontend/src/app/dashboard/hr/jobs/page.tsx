"use client";

import { HrShell } from "@/components/hr-shell";
import { ModuleCard, DataTable } from "@/components/role-shell";

export default function Page() {
  return (
    <HrShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Posting</h1>
          <p className="mt-1 text-sm text-slate-500">Create roles, manage ATS stages and publish openings.</p>
        </div>
        <ModuleCard
          title="Phase 2 module workspace"
          description="Create roles, manage ATS stages and publish openings."
        />
        <DataTable columns={["Item","Owner","Updated","Status"]} rows={[["Sample Job Posting","HR","Today","Open"]]} />
      </div>
    </HrShell>
  );
}
