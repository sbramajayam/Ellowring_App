"use client";

import { TrainingShell } from "@/components/training-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <TrainingShell>
      <RoleApiTablePage
        title="Revenue"
        description="Revenue analytics."
        endpoint="/analytics/revenue"
        auth={true}
      listKey="stats"
        columns={[
  {
    "key": "label",
    "label": "Metric",
    "path": "label"
  },
  {
    "key": "value",
    "label": "Value",
    "path": "value"
  }
]}
      />
    </TrainingShell>
  );
}
