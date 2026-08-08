"use client";

import { AdminShell } from "@/components/admin-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <AdminShell>
      <RoleApiTablePage
        title="Course Management"
        description="Published courses."
        endpoint="/courses"
        auth={false}
        columns={[
  {
    "key": "title",
    "label": "Course",
    "path": "title"
  },
  {
    "key": "category",
    "label": "Category",
    "path": "category.name"
  },
  {
    "key": "level",
    "label": "Level",
    "path": "level"
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
