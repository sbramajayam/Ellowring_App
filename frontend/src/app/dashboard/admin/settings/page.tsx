"use client";

import { AdminShell } from "@/components/admin-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <AdminShell>
      <RoleApiTablePage
        title="Settings"
        description="System settings key-value store."
        endpoint="/admin/settings"
        auth={true}
        columns={[
  {
    "key": "key",
    "label": "Key",
    "path": "key"
  },
  {
    "key": "value",
    "label": "Value",
    "path": "value"
  },
  {
    "key": "description",
    "label": "Description",
    "path": "description"
  }
]}
      />
    </AdminShell>
  );
}
