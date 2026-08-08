/**
 * Generates API-backed dashboard pages for Phase 4/5 menus.
 * Run: node frontend/scripts/generate-role-menus.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "src", "app", "dashboard");

function page(shellImport, shellName, title, description, endpoint, columns, opts = {}) {
  const cols = JSON.stringify(columns, null, 2);
  const auth = opts.auth === false ? "false" : "true";
  const listKey = opts.listKey ? `\n      listKey="${opts.listKey}"` : "";
  return `"use client";

import { ${shellName} } from "@/components/${shellImport}";
import { RoleApiTablePage } from "@/components/role-api-table";

export default function Page() {
  return (
    <${shellName}>
      <RoleApiTablePage
        title=${JSON.stringify(title)}
        description=${JSON.stringify(description)}
        endpoint=${JSON.stringify(endpoint)}
        auth={${auth}}${listKey}
        columns={${cols}}
      />
    </${shellName}>
  );
}
`;
}

const specs = [
  // College
  ["college/leads/page.tsx", "college-shell", "CollegeShell", "Admission Leads", "College-sourced programmes and lead pipeline.", "/admissions", [
    { key: "name", label: "Programme", path: "name" },
    { key: "college", label: "College", path: "college.name" },
    { key: "department", label: "Department", path: "department.name" },
    { key: "degree", label: "Degree", path: "degree" },
    { key: "seats", label: "Seats", path: "seats" },
  ], { auth: false }],
  ["college/applications/page.tsx", "college-shell", "CollegeShell", "Applications", "Inbound applications for your college.", "/colleges/me/applications", [
    { key: "id", label: "ID", path: "id" },
    { key: "status", label: "Status", path: "status" },
    { key: "student", label: "Student", path: "student.user.name" },
    { key: "course", label: "Course", path: "course.name" },
    { key: "createdAt", label: "Submitted", path: "createdAt" },
  ]],
  ["college/placement/page.tsx", "college-shell", "CollegeShell", "Placement Cell", "Open jobs for campus placement drives.", "/jobs", [
    { key: "title", label: "Role", path: "title" },
    { key: "company", label: "Company", path: "company.name" },
    { key: "location", label: "Location", path: "location" },
    { key: "type", label: "Type", path: "type" },
    { key: "mode", label: "Mode", path: "mode" },
  ], { auth: false }],
  ["college/analytics/page.tsx", "college-shell", "CollegeShell", "Analytics", "Platform analytics snapshot.", "/analytics/dashboard", [
    { key: "label", label: "Metric", path: "label" },
    { key: "value", label: "Value", path: "value" },
  ], { auth: true, listKey: "stats" }],
  ["college/reports/page.tsx", "college-shell", "CollegeShell", "Reports", "College course catalogue report.", "/colleges/me/courses", [
    { key: "name", label: "Course", path: "name" },
    { key: "degree", label: "Degree", path: "degree" },
    { key: "duration", label: "Duration", path: "duration" },
    { key: "seats", label: "Seats", path: "seats" },
  ]],
  ["college/events/page.tsx", "college-shell", "CollegeShell", "Events", "Announcements usable as campus events.", "/admin/announcements", [
    { key: "title", label: "Event", path: "title" },
    { key: "status", label: "Status", path: "status" },
    { key: "startsAt", label: "Starts", path: "startsAt" },
    { key: "endsAt", label: "Ends", path: "endsAt" },
  ]],
  ["college/profile/page.tsx", "college-shell", "CollegeShell", "College Profile", "Your verified college profile.", "/colleges/me", [
    { key: "name", label: "College", path: "college.name" },
    { key: "city", label: "City", path: "college.city" },
    { key: "state", label: "State", path: "college.state" },
    { key: "verified", label: "Verified", path: "verified" },
  ]],

  // HR
  ["hr/jobs/page.tsx", "hr-shell", "HrShell", "Job Posting", "Published roles from the jobs catalogue.", "/jobs", [
    { key: "title", label: "Title", path: "title" },
    { key: "company", label: "Company", path: "company.name" },
    { key: "location", label: "Location", path: "location" },
    { key: "type", label: "Type", path: "type" },
    { key: "mode", label: "Mode", path: "mode" },
  ], { auth: false }],
  ["hr/internships/page.tsx", "hr-shell", "HrShell", "Internship Hiring", "Active internship openings.", "/internships", [
    { key: "title", label: "Title", path: "title" },
    { key: "company", label: "Company", path: "company.name" },
    { key: "mode", label: "Mode", path: "mode" },
    { key: "stipend", label: "Stipend", path: "money:stipend" },
    { key: "duration", label: "Duration", path: "duration" },
  ], { auth: false }],
  ["hr/candidates/page.tsx", "hr-shell", "HrShell", "Candidate Search", "Applications submitted on Ellowring.", "/applications", [
    { key: "id", label: "Application", path: "id" },
    { key: "status", label: "Status", path: "status" },
    { key: "job", label: "Job", path: "job.title" },
    { key: "createdAt", label: "Applied", path: "createdAt" },
  ]],
  ["hr/resumes/page.tsx", "hr-shell", "HrShell", "Resume Management", "Student profiles available to employers.", "/admin/users", [
    { key: "name", label: "Name", path: "name" },
    { key: "email", label: "Email", path: "email" },
    { key: "role", label: "Role", path: "role" },
    { key: "isActive", label: "Active", path: "isActive" },
  ]],
  ["hr/interviews/page.tsx", "hr-shell", "HrShell", "Interview Scheduling", "Applications in interview pipeline.", "/applications", [
    { key: "id", label: "Application", path: "id" },
    { key: "status", label: "Status", path: "status" },
    { key: "createdAt", label: "Updated", path: "createdAt" },
  ]],
  ["hr/analytics/page.tsx", "hr-shell", "HrShell", "Hiring Analytics", "Company / platform analytics.", "/analytics/companies", [
    { key: "label", label: "Metric", path: "label" },
    { key: "value", label: "Value", path: "value" },
  ], { listKey: "stats" }],
  ["hr/profile/page.tsx", "hr-shell", "HrShell", "Company Profile", "Signed-in HR / company account.", "/auth/me", [
    { key: "name", label: "Name", path: "name" },
    { key: "email", label: "Email", path: "email" },
    { key: "role", label: "Role", path: "role" },
    { key: "id", label: "User ID", path: "id" },
  ]],

  // Training
  ["training/courses/page.tsx", "training-shell", "TrainingShell", "Courses", "Published skill courses.", "/courses", [
    { key: "title", label: "Course", path: "title" },
    { key: "category", label: "Category", path: "category.name" },
    { key: "level", label: "Level", path: "level" },
    { key: "price", label: "Price", path: "money:price" },
  ], { auth: false }],
  ["training/trainers/page.tsx", "training-shell", "TrainingShell", "Trainers", "Trainer roster linked to centres.", "/analytics/courses", [
    { key: "label", label: "Metric", path: "label" },
    { key: "value", label: "Value", path: "value" },
  ], { listKey: "stats" }],
  ["training/students/page.tsx", "training-shell", "TrainingShell", "Students", "Student users enrolled in platform learning.", "/admin/users", [
    { key: "name", label: "Name", path: "name" },
    { key: "email", label: "Email", path: "email" },
    { key: "role", label: "Role", path: "role" },
  ]],
  ["training/assignments/page.tsx", "training-shell", "TrainingShell", "Assignments", "Course catalogue used for assignment planning.", "/courses", [
    { key: "title", label: "Course", path: "title" },
    { key: "level", label: "Level", path: "level" },
    { key: "duration", label: "Duration", path: "duration" },
  ], { auth: false }],
  ["training/assessments/page.tsx", "training-shell", "TrainingShell", "Assessments", "Coaching programmes used for assessments.", "/coaching", [
    { key: "title", label: "Programme", path: "title" },
    { key: "examType", label: "Exam", path: "examType" },
    { key: "duration", label: "Duration", path: "duration" },
  ], { auth: false }],
  ["training/certificates/page.tsx", "training-shell", "TrainingShell", "Certificates", "Certificate records for learners.", "/students/me/certificates", [
    { key: "title", label: "Certificate", path: "title" },
    { key: "code", label: "Code", path: "code" },
    { key: "issuedAt", label: "Issued", path: "issuedAt" },
  ]],
  ["training/revenue/page.tsx", "training-shell", "TrainingShell", "Revenue", "Revenue analytics.", "/analytics/revenue", [
    { key: "label", label: "Metric", path: "label" },
    { key: "value", label: "Value", path: "value" },
  ], { listKey: "stats" }],
  ["training/reports/page.tsx", "training-shell", "TrainingShell", "Reports", "Courses analytics report.", "/analytics/courses", [
    { key: "label", label: "Metric", path: "label" },
    { key: "value", label: "Value", path: "value" },
  ], { listKey: "stats" }],

  // Partner
  ["partner/student-referrals/page.tsx", "partner-shell", "PartnerShell", "Student Referrals", "Your referral records.", "/partners/me/referrals", [
    { key: "id", label: "Referral", path: "id" },
    { key: "status", label: "Status", path: "status" },
    { key: "type", label: "Type", path: "type" },
    { key: "createdAt", label: "Created", path: "createdAt" },
  ]],
  ["partner/college-referrals/page.tsx", "partner-shell", "PartnerShell", "College Referrals", "Referral ledger (college channel).", "/partners/me/referrals", [
    { key: "id", label: "Referral", path: "id" },
    { key: "status", label: "Status", path: "status" },
    { key: "createdAt", label: "Created", path: "createdAt" },
  ]],
  ["partner/course-referrals/page.tsx", "partner-shell", "PartnerShell", "Course Referrals", "Referral ledger (course channel).", "/partners/me/referrals", [
    { key: "id", label: "Referral", path: "id" },
    { key: "status", label: "Status", path: "status" },
    { key: "createdAt", label: "Created", path: "createdAt" },
  ]],
  ["partner/leads/page.tsx", "partner-shell", "PartnerShell", "Lead Management", "Partner leads captured in CRM.", "/partners/me/leads", [
    { key: "name", label: "Lead", path: "name" },
    { key: "email", label: "Email", path: "email" },
    { key: "phone", label: "Phone", path: "phone" },
    { key: "source", label: "Source", path: "source" },
    { key: "status", label: "Status", path: "status" },
  ]],
  ["partner/commission/page.tsx", "partner-shell", "PartnerShell", "Commission Wallet", "Commission entries.", "/partners/me/commissions", [
    { key: "amount", label: "Amount", path: "money:amount" },
    { key: "status", label: "Status", path: "status" },
    { key: "earnedAt", label: "Earned", path: "earnedAt" },
  ]],
  ["partner/earnings/page.tsx", "partner-shell", "PartnerShell", "Earnings", "Partner wallet balance & credits.", "/partners/me/wallet", [
    { key: "balance", label: "Balance", path: "money:balance" },
    { key: "currency", label: "Currency", path: "currency" },
    { key: "updatedAt", label: "Updated", path: "updatedAt" },
  ]],
  ["partner/payouts/page.tsx", "partner-shell", "PartnerShell", "Payout History", "Payout requests and settlements.", "/partners/me/payouts", [
    { key: "amount", label: "Amount", path: "money:amount" },
    { key: "status", label: "Status", path: "status" },
    { key: "reference", label: "Reference", path: "reference" },
    { key: "createdAt", label: "Created", path: "createdAt" },
  ]],
  ["partner/marketing/page.tsx", "partner-shell", "PartnerShell", "Marketing Materials", "Platform announcements / collateral feed.", "/admin/announcements", [
    { key: "title", label: "Asset", path: "title" },
    { key: "status", label: "Status", path: "status" },
    { key: "createdAt", label: "Published", path: "createdAt" },
  ]],
  ["partner/reports/page.tsx", "partner-shell", "PartnerShell", "Reports", "Partner performance dashboard.", "/partners/me/dashboard", [
    { key: "label", label: "Metric", path: "label" },
    { key: "value", label: "Value", path: "value" },
  ], { listKey: "stats" }],

  // Admin
  ["admin/students/page.tsx", "admin-shell", "AdminShell", "Student Management", "All platform users (filter by STUDENT in ops).", "/admin/users", [
    { key: "name", label: "Name", path: "name" },
    { key: "email", label: "Email", path: "email" },
    { key: "role", label: "Role", path: "role" },
    { key: "isActive", label: "Active", path: "isActive" },
  ]],
  ["admin/colleges/page.tsx", "admin-shell", "AdminShell", "College Management", "College directory.", "/colleges", [
    { key: "name", label: "College", path: "name" },
    { key: "city", label: "City", path: "city" },
    { key: "state", label: "State", path: "state" },
    { key: "type", label: "Type", path: "type" },
    { key: "isVerified", label: "Verified", path: "isVerified" },
  ], { auth: false }],
  ["admin/hr/page.tsx", "admin-shell", "AdminShell", "HR Management", "Company / HR accounts.", "/admin/users", [
    { key: "name", label: "Name", path: "name" },
    { key: "email", label: "Email", path: "email" },
    { key: "role", label: "Role", path: "role" },
  ]],
  ["admin/training/page.tsx", "admin-shell", "AdminShell", "Training Management", "Training centres via course catalogue ownership.", "/courses", [
    { key: "title", label: "Course", path: "title" },
    { key: "category", label: "Category", path: "category.name" },
    { key: "price", label: "Price", path: "money:price" },
  ], { auth: false }],
  ["admin/partners/page.tsx", "admin-shell", "AdminShell", "Partner Management", "Channel partner users.", "/admin/users", [
    { key: "name", label: "Name", path: "name" },
    { key: "email", label: "Email", path: "email" },
    { key: "role", label: "Role", path: "role" },
  ]],
  ["admin/courses/page.tsx", "admin-shell", "AdminShell", "Course Management", "Published courses.", "/courses", [
    { key: "title", label: "Course", path: "title" },
    { key: "category", label: "Category", path: "category.name" },
    { key: "level", label: "Level", path: "level" },
    { key: "price", label: "Price", path: "money:price" },
  ], { auth: false }],
  ["admin/coaching/page.tsx", "admin-shell", "AdminShell", "Coaching Management", "Published coaching programmes.", "/coaching", [
    { key: "title", label: "Programme", path: "title" },
    { key: "examType", label: "Exam", path: "examType" },
    { key: "price", label: "Price", path: "money:price" },
  ], { auth: false }],
  ["admin/admissions/page.tsx", "admin-shell", "AdminShell", "Admission Management", "College programmes available for admission.", "/admissions", [
    { key: "name", label: "Programme", path: "name" },
    { key: "college", label: "College", path: "college.name" },
    { key: "degree", label: "Degree", path: "degree" },
  ], { auth: false }],
  ["admin/payments/page.tsx", "admin-shell", "AdminShell", "Payment Management", "Payment / subscription transactions.", "/payments/transactions", [
    { key: "id", label: "Txn", path: "id" },
    { key: "amount", label: "Amount", path: "money:amount" },
    { key: "status", label: "Status", path: "status" },
    { key: "createdAt", label: "Created", path: "createdAt" },
  ]],
  ["admin/reports/page.tsx", "admin-shell", "AdminShell", "Reports", "Admin overview metrics.", "/admin/overview", [
    { key: "students", label: "Students", path: "students" },
    { key: "colleges", label: "Colleges", path: "colleges" },
    { key: "companies", label: "Companies", path: "companies" },
    { key: "partners", label: "Partners", path: "partners" },
    { key: "revenue", label: "Revenue", path: "money:revenue" },
  ]],
  ["admin/analytics/page.tsx", "admin-shell", "AdminShell", "Analytics", "Platform analytics dashboard.", "/analytics/dashboard", [
    { key: "label", label: "Metric", path: "label" },
    { key: "value", label: "Value", path: "value" },
  ], { listKey: "stats" }],
  ["admin/notifications/page.tsx", "admin-shell", "AdminShell", "Notifications", "Announcements broadcast list.", "/admin/announcements", [
    { key: "title", label: "Title", path: "title" },
    { key: "status", label: "Status", path: "status" },
    { key: "createdAt", label: "Created", path: "createdAt" },
  ]],
  ["admin/settings/page.tsx", "admin-shell", "AdminShell", "Settings", "System settings key-value store.", "/admin/settings", [
    { key: "key", label: "Key", path: "key" },
    { key: "value", label: "Value", path: "value" },
    { key: "description", label: "Description", path: "description" },
  ]],
];

let n = 0;
for (const spec of specs) {
  const [rel, shellFile, shellName, title, desc, endpoint, columns, opts] = spec;
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page(shellFile, shellName, title, desc, endpoint, columns, opts || {}), "utf8");
  n++;
  console.log("wrote", rel);
}
console.log("Generated", n, "menu pages");
