"use client";

import { HrShell } from "@/components/hr-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <HrShell>
      <RoleApiTablePage
        title="Resume Management"
        description="Student profiles available to employers."
        endpoint="/admin/users"
        auth={true}
        columns={[
  {
    "key": "name",
    "label": "Name",
    "path": "name"
  },
  {
    "key": "email",
    "label": "Email",
    "path": "email"
  },
  {
    "key": "role",
    "label": "Role",
    "path": "role"
  },
  {
    "key": "isActive",
    "label": "Active",
    "path": "isActive"
  }
]}
      />
    </HrShell>
  );
}
