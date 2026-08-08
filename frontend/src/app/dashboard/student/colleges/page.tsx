"use client";

import { useCallback } from "react";
import { Building2 } from "lucide-react";
import { StudentCatalogPage } from "@/components/student-catalog-page";
import { labelOf } from "@/lib/labels";

export default function Page() {
  const mapItem = useCallback((raw: Record<string, unknown>) => {
    const city = labelOf(raw.city, "");
    const state = labelOf(raw.state, "");
    return {
      id: String(raw.id || ""),
      eyebrow: labelOf(raw.type, "College"),
      title: labelOf(raw.name, "College"),
      body: labelOf(raw.description, "Explore courses, rankings and admissions."),
      meta: [city, state].filter(Boolean).join(", ") || "India",
      priceLabel: raw.isVerified ? "Verified" : "Listed",
    };
  }, []);

  return (
    <StudentCatalogPage
      title="Colleges"
      description="Discover colleges, compare programmes, and prepare applications."
      endpoint="/colleges"
      mapItem={mapItem}
      actionLabel="View college"
      icon={<Building2 size={20} />}
    />
  );
}
