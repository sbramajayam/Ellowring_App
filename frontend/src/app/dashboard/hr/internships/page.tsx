"use client";

import { HrShell } from "@/components/hr-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <HrShell>
      <RoleApiTablePage
        title="Internship Hiring"
        description="Active internship openings."
        endpoint="/internships"
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
    "key": "mode",
    "label": "Mode",
    "path": "mode"
  },
  {
    "key": "stipend",
    "label": "Stipend",
    "path": "money:stipend"
  },
  {
    "key": "duration",
    "label": "Duration",
    "path": "duration"
  }
]}
      />
    </HrShell>
  );
}
