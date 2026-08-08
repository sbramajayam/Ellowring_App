"use client";

import { AdminShell } from "@/components/admin-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <AdminShell>
      <RoleApiTablePage
        title="Notifications"
        description="Announcements broadcast list."
        endpoint="/admin/announcements"
        auth={true}
        columns={[
  {
    "key": "title",
    "label": "Title",
    "path": "title"
  },
  {
    "key": "status",
    "label": "Status",
    "path": "status"
  },
  {
    "key": "createdAt",
    "label": "Created",
    "path": "createdAt"
  }
]}
      />
    </AdminShell>
  );
}
