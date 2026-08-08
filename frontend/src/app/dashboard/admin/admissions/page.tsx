"use client";

import { AdminShell } from "@/components/admin-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <AdminShell>
      <RoleApiTablePage
        title="Admission Management"
        description="College programmes available for admission."
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
    "key": "degree",
    "label": "Degree",
    "path": "degree"
  }
]}
      />
    </AdminShell>
  );
}
