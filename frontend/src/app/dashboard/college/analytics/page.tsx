"use client";

import { CollegeShell } from "@/components/college-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <CollegeShell>
      <RoleApiTablePage
        title="Analytics"
        description="Platform analytics snapshot."
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
    </CollegeShell>
  );
}
