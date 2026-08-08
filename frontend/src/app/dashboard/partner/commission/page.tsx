"use client";

import { PartnerShell } from "@/components/partner-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <PartnerShell>
      <RoleApiTablePage
        title="Commission Wallet"
        description="Commission entries."
        endpoint="/partners/me/commissions"
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
    "key": "earnedAt",
    "label": "Earned",
    "path": "earnedAt"
  }
]}
      />
    </PartnerShell>
  );
}
