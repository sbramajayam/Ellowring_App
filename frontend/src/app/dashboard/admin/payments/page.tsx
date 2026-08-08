"use client";

import { AdminShell } from "@/components/admin-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <AdminShell>
      <RoleApiTablePage
        title="Payment Management"
        description="Payment / subscription transactions."
        endpoint="/payments/transactions"
        auth={true}
        columns={[
  {
    "key": "id",
    "label": "Txn",
    "path": "id"
  },
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
    "key": "createdAt",
    "label": "Created",
    "path": "createdAt"
  }
]}
      />
    </AdminShell>
  );
}
