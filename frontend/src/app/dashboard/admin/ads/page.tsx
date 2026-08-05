"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { DataTable, ModuleCard } from "@/components/role-shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AdminAdsPage() {
  const { token } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [demand, setDemand] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    api<any[]>("/ads/campaigns", { token }).then(setCampaigns).catch(console.error);
    api<any>("/predictive/admin/demand", { token }).then(setDemand).catch(console.error);
  }, [token]);

  return (
    <AdminShell>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">Phase 3</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Advertising & Demand Intelligence</h1>
          <p className="mt-1 text-sm text-slate-500">
            Sponsored placements (labelled) and predictive skill-demand forecast for curriculum planning.
          </p>
        </div>

        <ModuleCard
          title="Enterprise API"
          description="Partner API key auth via X-API-Key. Health: GET /api/enterprise/health. Verify certificates: GET /api/enterprise/verify/certificate/:code"
        />

        <DataTable
          columns={["Campaign", "Budget", "Impressions", "Status"]}
          rows={
            campaigns.length
              ? campaigns.map((c) => [
                  c.name,
                  `₹ ${Number(c.budgetInr).toLocaleString("en-IN")}`,
                  c.impressions,
                  c.status,
                ])
              : [["—", "—", "—", "Loading"]]
          }
        />

        <DataTable
          columns={["Skill", "Demand index", "Trend"]}
          rows={
            demand?.skills?.map((s: any) => [s.skill, s.demandIndex, s.trend]) || [
              ["Full Stack", 92, "up"],
            ]
          }
        />
      </div>
    </AdminShell>
  );
}
