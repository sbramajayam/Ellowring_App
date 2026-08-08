"use client";

import { CollegeShell } from "@/components/college-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <CollegeShell>
      <RoleApiTablePage
        title="Applications"
        description="Inbound applications for your college."
        endpoint="/colleges/me/applications"
        auth={true}
        columns={[
  {
    "key": "id",
    "label": "ID",
    "path": "id"
  },
  {
    "key": "status",
    "label": "Status",
    "path": "status"
  },
  {
    "key": "student",
    "label": "Student",
    "path": "student.user.name"
  },
  {
    "key": "course",
    "label": "Course",
    "path": "course.name"
  },
  {
    "key": "createdAt",
    "label": "Submitted",
    "path": "createdAt"
  }
]}
      />
    </CollegeShell>
  );
}
