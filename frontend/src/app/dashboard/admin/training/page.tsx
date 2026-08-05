"use client";

import { AdminShell } from "@/components/admin-shell";
import { ModuleCard, DataTable } from "@/components/role-shell";

export default function Page() {
  return (
    <AdminShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Training Management</h1>
          <p className="mt-1 text-sm text-slate-500">Approve training institutes and catalogues.</p>
        </div>
        <ModuleCard
          title="Phase 2 module workspace"
          description="Approve training institutes and catalogues."
        />
        <DataTable columns={["Item","Owner","Priority","Status"]} rows={[["Sample Training Management","Admin","Normal","Open"]]} />
      </div>
    </AdminShell>
  );
}
