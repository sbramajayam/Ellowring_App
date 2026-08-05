"use client";

import { PartnerShell } from "@/components/partner-shell";
import { ModuleCard, DataTable } from "@/components/role-shell";

export default function Page() {
  return (
    <PartnerShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Referrals</h1>
          <p className="mt-1 text-sm text-slate-500">Track school and student referrals into Ellowring.</p>
        </div>
        <ModuleCard
          title="Phase 2 module workspace"
          description="Track school and student referrals into Ellowring."
        />
        <DataTable columns={["Record","Channel","Value","Status"]} rows={[["REF-1024","Student","₹1,200","Paid"],["REF-1029","Course","₹800","Pending"]]} />
      </div>
    </PartnerShell>
  );
}
