"use client";

import { useCallback } from "react";
import { ClipboardList } from "lucide-react";
import { StudentCatalogPage } from "@/components/student-catalog-page";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf, moneyOf } from "@/lib/labels";

export default function Page() {
  const { token } = useAuth();
  const mapItem = useCallback((raw: Record<string, unknown>) => {
    const college = labelOf(raw.college, "College");
    const dept = labelOf(raw.department, "");
    const fee = raw.fees != null ? `₹${moneyOf(raw.fees)}` : labelOf(raw.degree, "Programme");
    return {
      id: String(raw.id || ""),
      eyebrow: [college, dept].filter(Boolean).join(" · ") || "Admissions",
      title: labelOf(raw.name, "Programme"),
      body: labelOf(raw.description, "College programme open for applications."),
      meta: labelOf(raw.duration, ""),
      priceLabel: fee,
    };
  }, []);

  return (
    <StudentCatalogPage
      title="Admissions"
      description="Browse college programmes and shortlist seats for application."
      endpoint="/admissions"
      mapItem={mapItem}
      actionLabel="Shortlist"
      icon={<ClipboardList size={20} />}
      onAction={async (id) => {
        await api("/students/me/bookmarks", {
          method: "POST",
          token,
          body: JSON.stringify({ entityType: "COLLEGE", entityId: id }),
        });
      }}
    />
  );
}
