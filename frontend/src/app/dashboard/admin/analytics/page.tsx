"use client";

import { AdminShell } from "@/components/admin-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <AdminShell>
      <RoleApiTablePage
        title="Analytics"
        description="Platform analytics dashboard."
        endpoint="/analytics/dashboard"
        auth={true}
      listKey="stats"
        columns={[
  {
    "key": "label",
    "label": "Metric",
    "path": "label"
  },
  {
    "key": "value",
    "label": "Value",
    "path": "value"
  }
]}
      />
    </AdminShell>
  );
}
