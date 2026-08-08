"use client";

import { PartnerShell } from "@/components/partner-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <PartnerShell>
      <RoleApiTablePage
        title="Student Referrals"
        description="Your referral records."
        endpoint="/partners/me/referrals"
        auth={true}
        columns={[
  {
    "key": "id",
    "label": "Referral",
    "path": "id"
  },
  {
    "key": "status",
    "label": "Status",
    "path": "status"
  },
  {
    "key": "type",
    "label": "Type",
    "path": "type"
  },
  {
    "key": "createdAt",
    "label": "Created",
    "path": "createdAt"
  }
]}
      />
    </PartnerShell>
  );
}
