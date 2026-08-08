"use client";

import { TrainingShell } from "@/components/training-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <TrainingShell>
      <RoleApiTablePage
        title="Assessments"
        description="Coaching programmes used for assessments."
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
    "key": "duration",
    "label": "Duration",
    "path": "duration"
  }
]}
      />
    </TrainingShell>
  );
}
