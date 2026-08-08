"use client";

import { HrShell } from "@/components/hr-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <HrShell>
      <RoleApiTablePage
        title="Interview Scheduling"
        description="Applications in interview pipeline."
        endpoint="/applications"
        auth={true}
        columns={[
  {
    "key": "id",
    "label": "Application",
    "path": "id"
  },
  {
    "key": "status",
    "label": "Status",
    "path": "status"
  },
  {
    "key": "createdAt",
    "label": "Updated",
    "path": "createdAt"
  }
]}
      />
    </HrShell>
  );
}
