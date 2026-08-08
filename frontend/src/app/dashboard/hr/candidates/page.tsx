"use client";

import { HrShell } from "@/components/hr-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <HrShell>
      <RoleApiTablePage
        title="Candidate Search"
        description="Applications submitted on Ellowring."
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
    "key": "job",
    "label": "Job",
    "path": "job.title"
  },
  {
    "key": "createdAt",
    "label": "Applied",
    "path": "createdAt"
  }
]}
      />
    </HrShell>
  );
}
