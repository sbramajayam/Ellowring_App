"use client";

import { PartnerShell } from "@/components/partner-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <PartnerShell>
      <RoleApiTablePage
        title="Marketing Materials"
        description="Partner lead funnel used as campaign workspace."
        endpoint="/partners/me/leads"
        columns={[
          { key: "name", label: "Lead / Campaign", path: "name" },
          { key: "source", label: "Source", path: "source" },
          { key: "status", label: "Status", path: "status" },
          { key: "createdAt", label: "Created", path: "createdAt" },
        ]}
      />
    </PartnerShell>
  );
}
