"use client";

import { StudentShell } from "@/components/student-shell";
import { CollagePage } from "@/components/student-home/collage-ui";
import { ProjectMarketplaceContent } from "@/components/student-home/project-marketplace";

export default function ProjectsPage() {
  return (
    <StudentShell>
      <CollagePage>
        <ProjectMarketplaceContent />
      </CollagePage>
    </StudentShell>
  );
}
