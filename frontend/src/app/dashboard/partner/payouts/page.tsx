"use client";

import { PartnerShell } from "@/components/partner-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <PartnerShell>
      <RoleApiTablePage
        title="Payout History"
        description="Payout requests and settlements."
        endpoint="/partners/me/payouts"
        auth={true}
        columns={[
  {
    "key": "amount",
    "label": "Amount",
    "path": "money:amount"
  },
  {
    "key": "status",
    "label": "Status",
    "path": "status"
  },
  {
    "key": "reference",
    "label": "Reference",
    "path": "reference"
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
