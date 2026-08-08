"use client";

import { AdminShell } from "@/components/admin-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <AdminShell>
      <RoleApiTablePage
        title="HR Management"
        description="Company / HR accounts."
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
  }
]}
      />
    </AdminShell>
  );
}
