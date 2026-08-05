const fs = require("fs");
const path = require("path");

const root = "d:/E_App/frontend/src/app/dashboard";

function write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("wrote", rel);
}

function page(shellImport, shellName, title, description, extra = "") {
  return `"use client";

import { ${shellName} } from "@/components/${shellImport}";
import { ModuleCard, DataTable } from "@/components/role-shell";

export default function Page() {
  return (
    <${shellName}>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">${title}</h1>
          <p className="mt-1 text-sm text-slate-500">${description}</p>
        </div>
        <ModuleCard
          title="Phase 2 module workspace"
          description="${description}"
        />
        ${extra}
      </div>
    </${shellName}>
  );
}
`;
}

// Homes
write(
  "training/page.tsx",
  `"use client";\nimport { TrainingShell, TrainingHome } from "@/components/training-shell";\nexport default function Page(){return <TrainingShell><TrainingHome/></TrainingShell>;}\n`,
);
write(
  "partner/page.tsx",
  `"use client";\nimport { PartnerShell, PartnerHome } from "@/components/partner-shell";\nexport default function Page(){return <PartnerShell><PartnerHome/></PartnerShell>;}\n`,
);
write(
  "hr/page.tsx",
  `"use client";\nimport { HrShell, HrHome } from "@/components/hr-shell";\nexport default function Page(){return <HrShell><HrHome/></HrShell>;}\n`,
);
write(
  "college/page.tsx",
  `"use client";\nimport { CollegeShell, CollegeHome } from "@/components/college-shell";\nexport default function Page(){return <CollegeShell><CollegeHome/></CollegeShell>;}\n`,
);
write(
  "admin/page.tsx",
  `"use client";\nimport { AdminShell, AdminHome } from "@/components/admin-shell";\nexport default function Page(){return <AdminShell><AdminHome/></AdminShell>;}\n`,
);

const training = [
  ["courses", "Courses", "Publish and manage skills and coaching courses supplied to Ellowring."],
  ["trainers", "Trainers", "Faculty roster, availability and live-class assignments."],
  ["students", "Students", "Roster of enrolled learners across your batches."],
  ["assignments", "Assignments", "Create and grade Phase-2 assignments for your courses."],
  ["assessments", "Assessments", "Build quizzes and proctored assessments; unlock certificates."],
  ["certificates", "Certificates", "Issue and revoke verifiable certificates for completions."],
  ["revenue", "Revenue", "Course fee ledger, settlements and payouts to your institute wallet."],
  ["reports", "Reports", "Enrolment, completion and revenue reports for your institute."],
];
for (const [slug, title, desc] of training) {
  write(
    `training/${slug}/page.tsx`,
    page(
      "training-shell",
      "TrainingShell",
      title,
      desc,
      `<DataTable columns={["Item","Owner","Updated","Status"]} rows={[["Sample ${title}","Ops","Today","Active"],["Pipeline item","Faculty","Yesterday","Draft"]]} />`,
    ),
  );
}

const partner = [
  ["student-referrals", "Student Referrals", "Track school and student referrals into Ellowring."],
  ["college-referrals", "College Referrals", "Introduce colleges for admission partnerships."],
  ["course-referrals", "Course Referrals", "Drive course enrolments with partner links."],
  ["leads", "Lead Management", "Pipeline of open referrals with attribution status."],
  ["commission", "Commission Wallet", "Accrued commissions, holds and clawbacks."],
  ["earnings", "Earnings", "Month-wise earning summary by product line."],
  ["payouts", "Payout History", "Completed and pending payout requests."],
  ["marketing", "Marketing Materials", "Approved collateral, banners and pitch decks."],
  ["reports", "Reports", "Conversion and commission performance reports."],
];
for (const [slug, title, desc] of partner) {
  write(
    `partner/${slug}/page.tsx`,
    page(
      "partner-shell",
      "PartnerShell",
      title,
      desc,
      `<DataTable columns={["Record","Channel","Value","Status"]} rows={[["REF-1024","Student","₹1,200","Paid"],["REF-1029","Course","₹800","Pending"]]} />`,
    ),
  );
}

const hr = [
  ["jobs", "Job Posting", "Create roles, manage ATS stages and publish openings."],
  ["internships", "Internship Hiring", "Post internships and track applicant pipelines."],
  ["candidates", "Candidate Search", "Consent-gated search across Ellowring talent."],
  ["resumes", "Resume Management", "Shortlists, notes and shared resume folders."],
  ["interviews", "Interview Scheduling", "Panels, scorecards and self-scheduling links."],
  ["analytics", "Hiring Analytics", "Time-to-hire, funnel and source effectiveness."],
  ["payroll", "Payroll", "Phase-2 payroll runs, statutory deductions and payslips."],
  ["profile", "Company Profile", "Employer brand page, verification and hiring packages."],
];
for (const [slug, title, desc] of hr) {
  const extra =
    slug === "payroll"
      ? `<DataTable columns={["Employee","Net pay","PF","ESI","Status"]} rows={[["A. Kumar","₹42,800","₹1,800","₹315","Processed"],["S. Iyer","₹38,200","₹1,650","₹285","Draft"]]} />`
      : `<DataTable columns={["Item","Owner","Updated","Status"]} rows={[["Sample ${title}","HR","Today","Open"]]} />`;
  write(`hr/${slug}/page.tsx`, page("hr-shell", "HrShell", title, desc, extra));
}

const college = [
  ["leads", "Admission Leads", "Ellowring-sourced student leads for your programmes."],
  ["applications", "Applications", "Document review, fees and admission decisions."],
  ["placement", "Placement Cell", "Campus drives, eligibility lists and company coordination."],
  ["analytics", "Analytics", "Admission conversion and placement outcome analytics."],
  ["reports", "Reports", "Downloadable admission and placement reports."],
  ["events", "Events", "Open days, counselling camps and drive calendars."],
  ["profile", "College Profile", "Public profile, programmes, seat inventory and branding."],
];
for (const [slug, title, desc] of college) {
  write(
    `college/${slug}/page.tsx`,
    page(
      "college-shell",
      "CollegeShell",
      title,
      desc,
      `<DataTable columns={["Record","Programme","Owner","Status"]} rows={[["Sample ${title}","—","Admissions","Active"]]} />`,
    ),
  );
}

const admin = [
  ["students", "Student Management", "Search and support student accounts and profiles."],
  ["colleges", "College Management", "Verify colleges and manage seat partnerships."],
  ["hr", "HR Management", "Verify companies and hiring package entitlements."],
  ["training", "Training Management", "Approve training institutes and catalogues."],
  ["partners", "Partner Management", "KYC, tiers and commission policy for channel partners."],
  ["courses", "Course Management", "Moderate marketplace courses and pricing."],
  ["coaching", "Coaching Management", "Batches, faculty and live-class operations."],
  ["admissions", "Admission Management", "Oversee admission lead quality and disputes."],
  ["payments", "Payment Management", "Refunds, settlements and wallet adjustments."],
  ["reports", "Reports", "Platform operational and financial reports."],
  ["analytics", "Analytics", "Growth, marketplace health and outcome analytics."],
  ["notifications", "Notifications", "Broadcast and template management."],
  ["settings", "Settings", "Platform configuration, feature flags and policies."],
];
for (const [slug, title, desc] of admin) {
  write(
    `admin/${slug}/page.tsx`,
    page(
      "admin-shell",
      "AdminShell",
      title,
      desc,
      `<DataTable columns={["Item","Owner","Priority","Status"]} rows={[["Sample ${title}","Admin","Normal","Open"]]} />`,
    ),
  );
}

console.log("done");
