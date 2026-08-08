"use client";

import { TrainingShell } from "@/components/training-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <TrainingShell>
      <RoleApiTablePage
        title="Certificates"
        description="Course outcomes used for certificate issuance planning."
        endpoint="/courses"
        auth={false}
        columns={[
          { key: "title", label: "Course", path: "title" },
          { key: "category", label: "Category", path: "category.name" },
          { key: "level", label: "Level", path: "level" },
          { key: "price", label: "Price", path: "money:price" },
        ]}
      />
    </TrainingShell>
  );
}
