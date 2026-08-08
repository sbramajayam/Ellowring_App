"use client";

import { useCallback } from "react";
import { Compass } from "lucide-react";
import { StudentCatalogPage } from "@/components/student-catalog-page";
import { labelOf } from "@/lib/labels";

export default function Page() {
  const mapItem = useCallback((raw: Record<string, unknown>) => {
    const interest = raw.careerInterest;
    const category =
      labelOf(
        typeof interest === "object" && interest
          ? (interest as { category?: unknown }).category
          : raw.category,
        "Career",
      );
    return {
      id: String(raw.id || ""),
      eyebrow: category,
      title: labelOf(raw.title, "Pathway"),
      body: labelOf(raw.summary ?? raw.description, "Career guidance pathway."),
      meta: labelOf(raw.targetGrade ?? raw.source, ""),
      priceLabel: "Guide",
    };
  }, []);

  return (
    <StudentCatalogPage
      title="Career Guidance"
      description="Structured pathways from school streams to first-job playbooks."
      endpoint="/career"
      mapItem={mapItem}
      actionLabel="Explore"
      icon={<Compass size={20} />}
    />
  );
}
