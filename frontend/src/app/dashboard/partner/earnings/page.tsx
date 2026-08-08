"use client";

import { PartnerShell } from "@/components/partner-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <PartnerShell>
      <RoleApiTablePage
        title="Earnings"
        description="Partner wallet balance & credits."
        endpoint="/partners/me/wallet"
        auth={true}
        columns={[
  {
    "key": "balance",
    "label": "Balance",
    "path": "money:balance"
  },
  {
    "key": "currency",
    "label": "Currency",
    "path": "currency"
  },
  {
    "key": "updatedAt",
    "label": "Updated",
    "path": "updatedAt"
  }
]}
      />
    </PartnerShell>
  );
}
