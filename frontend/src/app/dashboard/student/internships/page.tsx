"use client";

import { useCallback } from "react";
import { Briefcase } from "lucide-react";
import { StudentCatalogPage } from "@/components/student-catalog-page";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf, moneyOf } from "@/lib/labels";

export default function Page() {
  const { token } = useAuth();
  const mapItem = useCallback((raw: Record<string, unknown>) => {
    const company = labelOf(raw.company, "Company");
    const stipend = raw.stipend != null ? `₹${moneyOf(raw.stipend)}` : "Unpaid / negotiable";
    return {
      id: String(raw.id || ""),
      eyebrow: `${company} · ${labelOf(raw.mode, "Remote")}`,
      title: labelOf(raw.title, "Internship"),
      body: labelOf(raw.description, labelOf(raw.skills, "Company internship opportunity.")),
      meta: labelOf(raw.duration, labelOf(raw.location, "Flexible")),
      priceLabel: stipend,
    };
  }, []);

  return (
    <StudentCatalogPage
      title="Internships"
      description="Company-backed internships with mentor reviews and completion certificates."
      endpoint="/internships"
      mapItem={mapItem}
      actionLabel="Apply"
      icon={<Briefcase size={20} />}
      onAction={async (id) => {
        await api("/applications", {
          method: "POST",
          token,
          body: JSON.stringify({ internshipId: id }),
        });
      }}
    />
  );
}
