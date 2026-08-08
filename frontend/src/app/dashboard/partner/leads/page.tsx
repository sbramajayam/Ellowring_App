"use client";

import { PartnerShell } from "@/components/partner-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <PartnerShell>
      <RoleApiTablePage
        title="Lead Management"
        description="Partner leads captured in CRM."
        endpoint="/partners/me/leads"
        auth={true}
        columns={[
  {
    "key": "name",
    "label": "Lead",
    "path": "name"
  },
  {
    "key": "email",
    "label": "Email",
    "path": "email"
  },
  {
    "key": "phone",
    "label": "Phone",
    "path": "phone"
  },
  {
    "key": "source",
    "label": "Source",
    "path": "source"
  },
  {
    "key": "status",
    "label": "Status",
    "path": "status"
  }
]}
      />
    </PartnerShell>
  );
}
