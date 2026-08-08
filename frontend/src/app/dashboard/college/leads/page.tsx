"use client";

import { CollegeShell } from "@/components/college-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <CollegeShell>
      <RoleApiTablePage
        title="Admission Leads"
        description="College-sourced programmes and lead pipeline."
        endpoint="/admissions"
        auth={false}
        columns={[
  {
    "key": "name",
    "label": "Programme",
    "path": "name"
  },
  {
    "key": "college",
    "label": "College",
    "path": "college.name"
  },
  {
    "key": "department",
    "label": "Department",
    "path": "department.name"
  },
  {
    "key": "degree",
    "label": "Degree",
    "path": "degree"
  },
  {
    "key": "seats",
    "label": "Seats",
    "path": "seats"
  }
]}
      />
    </CollegeShell>
  );
}
