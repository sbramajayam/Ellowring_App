"use client";

import { AdminShell } from "@/components/admin-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <AdminShell>
      <RoleApiTablePage
        title="Coaching Management"
        description="Published coaching programmes."
        endpoint="/coaching"
        auth={false}
        columns={[
  {
    "key": "title",
    "label": "Programme",
    "path": "title"
  },
  {
    "key": "examType",
    "label": "Exam",
    "path": "examType"
  },
  {
    "key": "price",
    "label": "Price",
    "path": "money:price"
  }
]}
      />
    </AdminShell>
  );
}
