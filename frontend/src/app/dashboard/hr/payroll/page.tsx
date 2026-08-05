"use client";

import { useEffect, useState } from "react";
import { HrShell } from "@/components/hr-shell";
import { DataTable, ModuleCard } from "@/components/role-shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type Run = {
  id: string;
  period: string;
  employees: number;
  netPayroll: number;
  status: string;
};

type Emp = {
  id: string;
  name: string;
  netPay: number;
  pf: number;
  esi: number;
  status: string;
};

export default function PayrollPage() {
  const { token } = useAuth();
  const [runs, setRuns] = useState<Run[]>([]);
  const [emps, setEmps] = useState<Emp[]>([]);

  useEffect(() => {
    if (!token) return;
    api<Run[]>("/payroll/runs", { token }).then(setRuns).catch(console.error);
    api<Emp[]>("/payroll/employees", { token }).then(setEmps).catch(console.error);
  }, [token]);

  return (
    <HrShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payroll</h1>
          <p className="mt-1 text-sm text-slate-500">
            Phase 2 — payroll runs, statutory deductions (PF / ESI / PT / TDS) and employee net pay.
          </p>
        </div>
        <ModuleCard
          title="Offer → payroll"
          description="Hired candidates convert into payroll employees with salary structure, attendance hooks and payslips."
        />
        <DataTable
          columns={["Period", "Employees", "Net payroll", "Status"]}
          rows={
            runs.length
              ? runs.map((r) => [
                  r.period,
                  r.employees,
                  `₹ ${r.netPayroll.toLocaleString("en-IN")}`,
                  r.status,
                ])
              : [["Aug 2026", 42, "₹ —", "DRAFT"]]
          }
        />
        <DataTable
          columns={["Employee", "Net pay", "PF", "ESI", "Status"]}
          rows={
            emps.length
              ? emps.map((e) => [
                  e.name,
                  `₹ ${e.netPay.toLocaleString("en-IN")}`,
                  `₹ ${e.pf}`,
                  `₹ ${e.esi}`,
                  e.status,
                ])
              : [["—", "—", "—", "—", "Loading"]]
          }
        />
      </div>
    </HrShell>
  );
}
