"use client";

import { useCallback } from "react";
import { ClipboardCheck } from "lucide-react";
import { StudentCatalogPage } from "@/components/student-catalog-page";
import { labelOf } from "@/lib/labels";

export default function Page() {
  const mapItem = useCallback((raw: Record<string, unknown>) => {
    const program = labelOf(raw.program, "Mock");
    return {
      id: String(raw.id || ""),
      eyebrow: `${program} · ${labelOf((raw.program as { examType?: string } | undefined)?.examType, "Test")}`,
      title: labelOf(raw.title, "Mock Test"),
      body: `${labelOf(raw.durationMin, "—")} mins · ${labelOf(raw.totalMarks, "—")} marks`,
      meta: labelOf(raw.passingMarks, "") ? `Pass ${labelOf(raw.passingMarks)}` : "Published",
      priceLabel: "Attempt",
    };
  }, []);

  return (
    <StudentCatalogPage
      title="Mock Tests"
      description="Timed practice tests linked to coaching programmes."
      endpoint="/coaching/mock-tests"
      mapItem={mapItem}
      actionLabel="Start practice"
      icon={<ClipboardCheck size={20} />}
    />
  );
}
