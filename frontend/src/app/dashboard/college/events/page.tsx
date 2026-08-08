"use client";

import { CollegeShell } from "@/components/college-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <CollegeShell>
      <RoleApiTablePage
        title="Events"
        description="Campus programmes and admission streams for event planning."
        endpoint="/admissions"
        auth={false}
        columns={[
          { key: "name", label: "Programme", path: "name" },
          { key: "college", label: "College", path: "college.name" },
          { key: "degree", label: "Degree", path: "degree" },
          { key: "seats", label: "Seats", path: "seats" },
        ]}
      />
    </CollegeShell>
  );
}
