"use client";

import { AdminShell } from "@/components/admin-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <AdminShell>
      <RoleApiTablePage
        title="College Management"
        description="College directory."
        endpoint="/colleges"
        auth={false}
        columns={[
  {
    "key": "name",
    "label": "College",
    "path": "name"
  },
  {
    "key": "city",
    "label": "City",
    "path": "city"
  },
  {
    "key": "state",
    "label": "State",
    "path": "state"
  },
  {
    "key": "type",
    "label": "Type",
    "path": "type"
  },
  {
    "key": "isVerified",
    "label": "Verified",
    "path": "isVerified"
  }
]}
      />
    </AdminShell>
  );
}
