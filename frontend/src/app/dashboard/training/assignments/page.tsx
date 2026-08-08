"use client";

import { TrainingShell } from "@/components/training-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <TrainingShell>
      <RoleApiTablePage
        title="Assignments"
        description="Course catalogue used for assignment planning."
        endpoint="/courses"
        auth={false}
        columns={[
  {
    "key": "title",
    "label": "Course",
    "path": "title"
  },
  {
    "key": "level",
    "label": "Level",
    "path": "level"
  },
  {
    "key": "duration",
    "label": "Duration",
    "path": "duration"
  }
]}
      />
    </TrainingShell>
  );
}
