"use client";

import { StudentShell } from "@/components/student-shell";
import { JobsHiringCollage } from "@/components/student-home/jobs-hiring-dashboard";

export default function StudentOpportunitiesPage() {
  return (
    <StudentShell>
      <JobsHiringCollage />
    </StudentShell>
  );
}
