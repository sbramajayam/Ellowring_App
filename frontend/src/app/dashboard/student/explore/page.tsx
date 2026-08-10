"use client";

import { useState } from "react";
import { GraduationCap, Layers } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { CollagePage } from "@/components/student-home/collage-ui";
import { ProjectMarketplaceContent } from "@/components/student-home/project-marketplace";
import { CollegesExploreContent } from "@/components/student-home/colleges-explore";

export default function StudentExplorePage() {
  const [tab, setTab] = useState<"projects" | "colleges">("projects");

  return (
    <StudentShell>
      <CollagePage>
        <div className="flex gap-2">
          {(
            [
              { id: "projects" as const, label: "Projects", icon: Layers },
              { id: "colleges" as const, label: "Colleges", icon: GraduationCap },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-bold transition sm:flex-none ${
                  active
                    ? "bg-[#0F3DDE] text-white shadow-[0_8px_18px_rgba(15,61,222,0.25)]"
                    : "bg-white text-slate-600 ring-1 ring-slate-200"
                }`}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "projects" ? (
          <ProjectMarketplaceContent showTitle />
        ) : (
          <CollegesExploreContent showTitle />
        )}
      </CollagePage>
    </StudentShell>
  );
}
