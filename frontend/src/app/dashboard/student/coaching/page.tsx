"use client";

import { useCallback } from "react";
import { GraduationCap } from "lucide-react";
import { StudentCatalogPage } from "@/components/student-catalog-page";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { labelOf, moneyOf } from "@/lib/labels";

export default function Page() {
  const { token } = useAuth();
  const mapItem = useCallback((raw: Record<string, unknown>) => {
    const price = Number(raw.price ?? 0);
    return {
      id: String(raw.id || ""),
      eyebrow: `${labelOf(raw.examType, "Exam")} · ${labelOf(raw.category, "Coaching")}`,
      title: labelOf(raw.title, "Programme"),
      body: labelOf(raw.description, "Competitive exam coaching programme."),
      meta: labelOf(raw.duration, "Batch"),
      priceLabel: price > 0 ? `₹${moneyOf(price)}` : "Free",
    };
  }, []);

  return (
    <StudentCatalogPage
      title="Coaching"
      description="Live and recorded competitive exam coaching for NEET, JEE, CUET, UPSC, TNPSC, SSC, Banking and more."
      endpoint="/coaching"
      mapItem={mapItem}
      actionLabel="Enroll"
      icon={<GraduationCap size={20} />}
      onAction={async (id) => {
        await api(`/coaching/${id}/enroll`, { method: "POST", token });
      }}
    />
  );
}
