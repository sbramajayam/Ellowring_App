"use client";

import { CollegeShell } from "@/components/college-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <CollegeShell>
      <RoleApiTablePage
        title="College Profile"
        description="Your verified college profile."
        endpoint="/colleges/me"
        auth={true}
        columns={[
  {
    "key": "name",
    "label": "College",
    "path": "college.name"
  },
  {
    "key": "city",
    "label": "City",
    "path": "college.city"
  },
  {
    "key": "state",
    "label": "State",
    "path": "college.state"
  },
  {
    "key": "verified",
    "label": "Verified",
    "path": "verified"
  }
]}
      />
    </CollegeShell>
  );
}
