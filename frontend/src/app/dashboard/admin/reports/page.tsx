"use client";

import { AdminShell } from "@/components/admin-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <AdminShell>
      <RoleApiTablePage
        title="Reports"
        description="Admin overview metrics."
        endpoint="/admin/overview"
        auth={true}
        columns={[
  {
    "key": "students",
    "label": "Students",
    "path": "students"
  },
  {
    "key": "colleges",
    "label": "Colleges",
    "path": "colleges"
  },
  {
    "key": "companies",
    "label": "Companies",
    "path": "companies"
  },
  {
    "key": "partners",
    "label": "Partners",
    "path": "partners"
  },
  {
    "key": "revenue",
    "label": "Revenue",
    "path": "money:revenue"
  }
]}
      />
    </AdminShell>
  );
}
