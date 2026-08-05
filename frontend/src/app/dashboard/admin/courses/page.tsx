"use client";

import { AdminShell } from "@/components/admin-shell";
import { ModuleCard, DataTable } from "@/components/role-shell";

export default function Page() {
  return (
    <AdminShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Course Management</h1>
          <p className="mt-1 text-sm text-slate-500">Moderate marketplace courses and pricing.</p>
        </div>
        <ModuleCard
          title="Phase 2 module workspace"
          description="Moderate marketplace courses and pricing."
        />
        <DataTable columns={["Item","Owner","Priority","Status"]} rows={[["Sample Course Management","Admin","Normal","Open"]]} />
      </div>
    </AdminShell>
  );
}
