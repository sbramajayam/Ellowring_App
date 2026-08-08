"use client";

import { StudentShell } from "@/components/student-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <StudentShell>
      <RoleApiTablePage
        title="Messages"
        description="Inbox notices from Ellowring (notifications channel)."
        endpoint="/notifications"
        columns={[
          { key: "title", label: "Subject", path: "title" },
          { key: "message", label: "Preview", path: "message" },
          { key: "type", label: "Type", path: "type" },
          { key: "createdAt", label: "Received", path: "createdAt" },
        ]}
        emptyText="No messages yet."
      />
    </StudentShell>
  );
}
