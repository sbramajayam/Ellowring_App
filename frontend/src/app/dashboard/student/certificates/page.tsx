"use client";

import { StudentShell } from "@/components/student-shell";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <StudentShell>
      <RoleApiTablePage
        title="Certificates"
        description="Your issued Ellowring certificates and credentials."
        endpoint="/students/me/certificates"
        columns={[
          { key: "title", label: "Certificate", path: "title" },
          { key: "issuer", label: "Issuer", path: "issuer" },
          { key: "credentialId", label: "Credential", path: "credentialId" },
          { key: "issuedAt", label: "Issued", path: "issuedAt" },
        ]}
        emptyText="No certificates yet. Complete a course or coaching programme to earn one."
      />
    </StudentShell>
  );
}
