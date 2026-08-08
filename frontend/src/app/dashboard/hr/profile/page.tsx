"use client";

import { HrShell } from "@/components/hr-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <HrShell>
      <RoleApiTablePage
        title="Company Profile"
        description="Signed-in HR / company account."
        endpoint="/auth/me"
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
    "key": "id",
    "label": "User ID",
    "path": "id"
  }
]}
      />
    </HrShell>
  );
}
