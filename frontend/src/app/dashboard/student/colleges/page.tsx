"use client";

import { StudentShell } from "@/components/student-shell";
import { CollagePage } from "@/components/student-home/collage-ui";
import { CollegesExploreContent } from "@/components/student-home/colleges-explore";

export default function CollegesPage() {
  return (
    <StudentShell>
      <CollagePage>
        <CollegesExploreContent />
      </CollagePage>
    </StudentShell>
  );
}
