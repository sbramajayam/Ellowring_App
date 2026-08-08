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
    const min = raw.salaryMin != null ? moneyOf(raw.salaryMin) : null;
    const max = raw.salaryMax != null ? moneyOf(raw.salaryMax) : null;
    return {
      id: String(raw.id || ""),
      eyebrow: `${company} · ${labelOf(raw.type, "Job")} · ${labelOf(raw.mode, "Hybrid")}`,
      title: labelOf(raw.title, "Job"),
      body: labelOf(raw.description, labelOf(raw.skills, "Open role on Ellowring.")),
      meta: labelOf(raw.location, "Location TBD"),
      priceLabel: min && max ? `₹${min}–${max}` : min ? `₹${min}+` : max ? `Up to ₹${max}` : "Competitive",
    };
  }, []);

  return (
    <StudentCatalogPage
      title="Jobs"
      description="Partner placement drives, full-time roles and internship-to-hire paths."
      endpoint="/jobs"
      mapItem={mapItem}
      actionLabel="Apply"
      icon={<Briefcase size={20} />}
      onAction={async (id) => {
        await api("/applications", {
          method: "POST",
          token,
          body: JSON.stringify({ jobId: id }),
        });
      }}
    />
  );
}
