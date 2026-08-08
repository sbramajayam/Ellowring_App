"use client";

import { CollegeShell } from "@/components/college-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <CollegeShell>
      <RoleApiTablePage
        title="Reports"
        description="College course catalogue report."
        endpoint="/colleges/me/courses"
        auth={true}
        columns={[
  {
    "key": "name",
    "label": "Course",
    "path": "name"
  },
  {
    "key": "degree",
    "label": "Degree",
    "path": "degree"
  },
  {
    "key": "duration",
    "label": "Duration",
    "path": "duration"
  },
  {
    "key": "seats",
    "label": "Seats",
    "path": "seats"
  }
]}
      />
    </CollegeShell>
  );
}
