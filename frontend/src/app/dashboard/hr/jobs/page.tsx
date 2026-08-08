"use client";

import { HrShell } from "@/components/hr-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <HrShell>
      <RoleApiTablePage
        title="Job Posting"
        description="Published roles from the jobs catalogue."
        endpoint="/jobs"
        auth={false}
        columns={[
  {
    "key": "title",
    "label": "Title",
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
    </HrShell>
  );
}
