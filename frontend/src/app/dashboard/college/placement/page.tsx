"use client";

import { CollegeShell } from "@/components/college-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <CollegeShell>
      <RoleApiTablePage
        title="Placement Cell"
        description="Open jobs for campus placement drives."
        endpoint="/jobs"
        auth={false}
        columns={[
  {
    "key": "title",
    "label": "Role",
    "path": "title"
  },
  {
    "key": "company",
    "label": "Company",
    "path": "company.name"
  },
  {
    "key": "location",
    "label": "Location",
    "path": "location"
  },
  {
    "key": "type",
    "label": "Type",
    "path": "type"
  },
  {
    "key": "mode",
    "label": "Mode",
    "path": "mode"
  }
]}
      />
    </CollegeShell>
  );
}
