"use client";

import { PartnerShell } from "@/components/partner-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <PartnerShell>
      <RoleApiTablePage
        title="College Referrals"
        description="Referral ledger (college channel)."
        endpoint="/partners/me/referrals"
        auth={true}
        columns={[
  {
    "key": "id",
    "label": "Referral",
    "path": "id"
  },
  {
    "key": "status",
    "label": "Status",
    "path": "status"
  },
  {
    "key": "createdAt",
    "label": "Created",
    "path": "createdAt"
  }
]}
      />
    </PartnerShell>
  );
}
