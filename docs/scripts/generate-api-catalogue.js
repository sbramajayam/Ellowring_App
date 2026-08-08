/**
 * Phase-5 API catalogue + OpenAPI generator
 * Source of truth for Appendix A endpoint specs and docs/api/openapi.yaml
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const DOC = path.join(ROOT, "docs/Ellowring_API_Design.md");
const OPENAPI_OUT = path.join(ROOT, "docs/api/openapi.yaml");

const BASE = "/api/v1";

/** @typedef {{ purpose:string, method:string, path:string, auth:string, roles?:string[], headers?:string[], params?:object, query?:object, body?:object, success:object, errors:string[], validation:string[], business:string[], exampleReq?:string, exampleRes?:object }} ApiSpec */

/** @type {Record<string, ApiSpec[]>} */
const MODULES = {};

function add(module, spec) {
  if (!MODULES[module]) MODULES[module] = [];
  MODULES[module].push(spec);
}

const H_JSON = ["Content-Type: application/json", "Accept: application/json"];
const H_AUTH = ["Authorization: Bearer <accessToken>", ...H_JSON];
const H_AUTH_ONLY = ["Authorization: Bearer <accessToken>", "Accept: application/json"];
const H_MULTI = ["Authorization: Bearer <accessToken>", "Content-Type: multipart/form-data"];

const ERR_STD = ["400 VALIDATION_ERROR", "401 UNAUTHORIZED", "403 FORBIDDEN", "404 NOT_FOUND", "429 RATE_LIMITED", "500 INTERNAL_ERROR"];
const ERR_AUTH = ["400 VALIDATION_ERROR", "401 INVALID_CREDENTIALS", "409 CONFLICT", "429 RATE_LIMITED"];

function ok(data, extraMeta) {
  return {
    success: true,
    data,
    meta: { requestId: "req_01EXAMPLE", timestamp: "2026-08-08T10:30:00.000Z", ...(extraMeta || {}) },
  };
}

function pageMeta() {
  return {
    pagination: { page: 1, pageSize: 20, totalItems: 42, totalPages: 3, hasNext: true, hasPrev: false },
  };
}

// ─── AUTHENTICATION ───────────────────────────────────────────────────────────
add("Authentication", {
  purpose: "Register a new user and role profile; returns JWT access + refresh pair.",
  method: "POST", path: "/auth/register", auth: "Public",
  headers: H_JSON,
  body: { email: "string", password: "string(min8)", name: "string", phone: "string?", role: "STUDENT|COLLEGE|COMPANY|TRAINING|PARTNER", orgName: "string?", grade: "string?", stream: "string?" },
  success: ok({ accessToken: "eyJ...", refreshToken: "rt_...", user: { id: "clx...", email: "student@ellowring.com", name: "Asha Student", role: "STUDENT" } }),
  errors: [...ERR_AUTH, "409 DUPLICATE_EMAIL"],
  validation: ["email required unique lowercase", "password min 8", "name required", "role enum"],
  business: ["Creates User + matching profile (Student/CollegeProfile/Company/TrainingCenter/Partner)", "Issues tokens; sends verify email/OTP optionally", "Default role STUDENT"],
  exampleReq: `POST ${BASE}/auth/register\n${JSON.stringify({ email: "student@ellowring.com", password: "password123", name: "Asha Student", role: "STUDENT", grade: "12", stream: "PCM" }, null, 2)}`,
});

add("Authentication", {
  purpose: "Email/password login; returns rotated token pair.",
  method: "POST", path: "/auth/login", auth: "Public", headers: H_JSON,
  body: { email: "string", password: "string" },
  success: ok({ accessToken: "eyJ...", refreshToken: "rt_...", user: { id: "clx...", email: "student@ellowring.com", role: "STUDENT" } }),
  errors: ERR_AUTH,
  validation: ["email required", "password required"],
  business: ["Rejects inactive/soft-deleted users", "Updates lastLoginAt", "Creates refresh_tokens row"],
  exampleReq: `POST ${BASE}/auth/login\n{"email":"student@ellowring.com","password":"password123"}`,
});

add("Authentication", {
  purpose: "Start Google OAuth authorization (browser redirect).",
  method: "GET", path: "/auth/google", auth: "Public", headers: ["Accept: text/html"],
  query: { redirectUri: "string?" },
  success: { note: "302 Redirect to Google consent screen" },
  errors: ["503 SERVICE_UNAVAILABLE if Google not configured"],
  validation: ["redirectUri must be allowlisted when present"],
  business: ["Uses OAuth authorization code + PKCE for SPA/mobile"],
});

add("Authentication", {
  purpose: "Google OAuth callback; exchanges code for Ellowring tokens.",
  method: "GET", path: "/auth/google/callback", auth: "Public",
  query: { code: "string", state: "string" },
  success: ok({ accessToken: "eyJ...", refreshToken: "rt_...", user: { id: "clx...", email: "user@gmail.com", role: "STUDENT" } }),
  errors: ["400 BAD_REQUEST", "401 UNAUTHORIZED"],
  validation: ["code required"],
  business: ["Links or creates user by verified Google email"],
});

add("Authentication", {
  purpose: "Request OTP for passwordless login or verification.",
  method: "POST", path: "/auth/otp/request", auth: "Public", headers: H_JSON,
  body: { email: "string?", phone: "string?", purpose: "LOGIN|REGISTER|VERIFY" },
  success: ok({ message: "OTP sent", expiresInSeconds: 600 }),
  errors: ["400 VALIDATION_ERROR", "404 NOT_FOUND", "429 RATE_LIMITED"],
  validation: ["email or phone required", "purpose enum"],
  business: ["Rate-limited in Redis", "Stores hashed OTP with expiry", "Demo may return demoOtp only in non-prod"],
});

add("Authentication", {
  purpose: "Verify OTP and issue token pair.",
  method: "POST", path: "/auth/otp/verify", auth: "Public", headers: H_JSON,
  body: { email: "string?", phone: "string?", code: "string", purpose: "string" },
  success: ok({ accessToken: "eyJ...", refreshToken: "rt_...", user: { id: "clx...", role: "STUDENT" } }),
  errors: ["400 VALIDATION_ERROR", "401 UNAUTHORIZED", "410 GONE expired"],
  validation: ["code 4-8 digits", "purpose required"],
  business: ["Single-use OTP", "Marks user verified when purpose=VERIFY"],
});

add("Authentication", {
  purpose: "Start password reset; emails/SMS reset link or OTP.",
  method: "POST", path: "/auth/forgot-password", auth: "Public", headers: H_JSON,
  body: { email: "string" },
  success: ok({ message: "If the account exists, reset instructions were sent" }),
  errors: ["400 VALIDATION_ERROR", "429 RATE_LIMITED"],
  validation: ["email required"],
  business: ["Always generic success to prevent enumeration", "Writes password_resets hash"],
});

add("Authentication", {
  purpose: "Complete password reset with token.",
  method: "POST", path: "/auth/reset-password", auth: "Public", headers: H_JSON,
  body: { token: "string", newPassword: "string(min8)" },
  success: ok({ message: "Password updated" }),
  errors: ["400 VALIDATION_ERROR", "401 UNAUTHORIZED", "410 GONE"],
  validation: ["token required", "newPassword min 8"],
  business: ["Invalidates sessions and refresh tokens for user"],
});

add("Authentication", {
  purpose: "Rotate refresh token; issue new access + refresh.",
  method: "POST", path: "/auth/refresh", auth: "Refresh token", headers: H_JSON,
  body: { refreshToken: "string" },
  success: ok({ accessToken: "eyJ...", refreshToken: "rt_new..." }),
  errors: ["401 UNAUTHORIZED", "401 TOKEN_REUSE_DETECTED"],
  validation: ["refreshToken required"],
  business: ["Rotate and revoke old token", "Reuse detection revokes token family"],
});

add("Authentication", {
  purpose: "Logout; revoke refresh token (and optional all sessions).",
  method: "POST", path: "/auth/logout", auth: "JWT", headers: H_AUTH,
  body: { refreshToken: "string?", allDevices: "boolean?" },
  success: ok({ message: "Logged out" }),
  errors: ["401 UNAUTHORIZED"],
  validation: [],
  business: ["Revokes provided refresh or all if allDevices"],
});

add("Authentication", {
  purpose: "Get authenticated user profile with role extensions.",
  method: "GET", path: "/auth/me", auth: "JWT", headers: H_AUTH_ONLY,
  success: ok({ id: "clx...", email: "student@ellowring.com", name: "Asha", role: "STUDENT", student: { id: "clx...", grade: "12" }, wallet: { balance: "1500.00" } }),
  errors: ["401 UNAUTHORIZED"],
  validation: [],
  business: ["Includes role profile relations; excludes passwordHash"],
});

add("Authentication", {
  purpose: "Change password for authenticated user.",
  method: "POST", path: "/auth/change-password", auth: "JWT", headers: H_AUTH,
  body: { currentPassword: "string", newPassword: "string(min8)" },
  success: ok({ message: "Password changed" }),
  errors: ["400 VALIDATION_ERROR", "401 INVALID_CREDENTIALS"],
  validation: ["both passwords required", "newPassword != current"],
  business: ["Revokes other refresh tokens"],
});

add("Authentication", {
  purpose: "Update basic profile fields (name, phone, avatar).",
  method: "PATCH", path: "/auth/profile", auth: "JWT", headers: H_AUTH,
  body: { name: "string?", phone: "string?", avatarUrl: "string?" },
  success: ok({ id: "clx...", name: "Asha Patel", phone: "+9198..." }),
  errors: ERR_STD,
  validation: ["phone unique if set"],
  business: ["Does not change role or email without verify flow"],
});

// ─── STUDENT ──────────────────────────────────────────────────────────────────
const studentApis = [
  ["GET", "/students/me/dashboard", "Student home KPIs: enrollments, applications, wallet, notifications."],
  ["GET", "/students/me", "Get student profile extension."],
  ["PATCH", "/students/me", "Update student profile (grade, stream, city, bio, resume)."],
  ["GET", "/students/me/career-guidance", "List career guidance recommendations for student."],
  ["POST", "/students/me/career-assistant", "AI career assistant suggestion (interest + profile context)."],
  ["GET", "/students/me/mock-tests", "List assigned/available mock tests."],
  ["POST", "/students/me/mock-tests/{mockTestId}/attempts", "Start mock attempt."],
  ["POST", "/students/me/mock-tests/attempts/{attemptId}/answers", "Submit answer."],
  ["POST", "/students/me/mock-tests/attempts/{attemptId}/submit", "Finalize attempt → result."],
  ["GET", "/students/me/question-banks", "Browsable question banks."],
  ["GET", "/students/me/previous-year-papers", "Previous year paper catalogue."],
  ["GET", "/students/me/courses", "Enrolled courses + progress."],
  ["POST", "/courses/{id}/enroll", "Enroll in published course (shared)."],
  ["GET", "/students/me/certificates", "Student certificates."],
  ["GET", "/students/me/wallet", "Wallet balance + ledger page."],
  ["GET", "/students/me/bookmarks", "Bookmarks list."],
  ["POST", "/students/me/bookmarks", "Create bookmark {entityType, entityId}."],
  ["DELETE", "/students/me/bookmarks/{id}", "Remove bookmark."],
  ["GET", "/students/me/favorites", "Favorites list."],
  ["POST", "/students/me/favorites", "Add favorite."],
  ["GET", "/students/me/study-abroad/applications", "Own abroad applications."],
  ["POST", "/study-abroad/applications", "Create abroad application."],
  ["GET", "/students/me/admissions/applications", "Own college applications."],
  ["POST", "/admissions/applications", "Submit college application."],
  ["GET", "/students/me/internships/applications", "Own internship applications."],
  ["POST", "/internships/{id}/applications", "Apply to internship."],
  ["GET", "/students/me/projects", "Joined projects."],
  ["POST", "/projects/{id}/join", "Request join project team."],
  ["GET", "/students/me/jobs/applications", "Own job applications."],
  ["POST", "/jobs/{id}/applications", "Apply to job."],
  ["GET", "/students/me/notifications", "Student notifications inbox."],
];

for (const [method, p, purpose] of studentApis) {
  const isWrite = method !== "GET";
  add("Student", {
    purpose,
    method, path: p, auth: "JWT", roles: ["STUDENT", "ADMIN"],
    headers: isWrite ? H_AUTH : H_AUTH_ONLY,
    query: method === "GET" ? { page: "1", pageSize: "20", q: "string?" } : undefined,
    body: isWrite ? { "(see OpenAPI component for path)": "object" } : undefined,
    success: ok(method === "GET" ? [] : { id: "clx..." }, method === "GET" ? pageMeta() : undefined),
    errors: ERR_STD,
    validation: ["JWT required", "role STUDENT (or ADMIN)", "path ids must be cuid"],
    business: ["Scoped to authenticated student profile", "Soft-deleted entities excluded", "Enrollment/application uniqueness enforced"],
    exampleReq: `${method} ${BASE}${p}`,
  });
}

// ─── COLLEGE ──────────────────────────────────────────────────────────────────
const collegeApis = [
  ["GET", "/colleges/me/dashboard", "College tenant dashboard KPIs."],
  ["GET", "/colleges/me", "College profile for logged-in college user."],
  ["PATCH", "/colleges/me", "Update college profile fields."],
  ["GET", "/colleges/me/leads", "Admission leads pipeline."],
  ["GET", "/colleges/me/applications", "Incoming college applications."],
  ["PATCH", "/colleges/me/applications/{id}", "Update application status."],
  ["GET", "/colleges/me/departments", "List departments."],
  ["POST", "/colleges/me/departments", "Create department."],
  ["GET", "/colleges/me/courses", "List college courses/programmes."],
  ["POST", "/colleges/me/courses", "Create college course."],
  ["PATCH", "/colleges/me/courses/{id}", "Update college course."],
  ["GET", "/colleges/me/scholarships", "List scholarships."],
  ["POST", "/colleges/me/scholarships", "Create scholarship."],
  ["GET", "/colleges/me/placements", "Placement cell summary."],
  ["GET", "/colleges/me/reports", "College operational reports."],
  ["GET", "/colleges/me/analytics", "College analytics snapshots."],
  ["GET", "/colleges", "Public college catalogue."],
  ["GET", "/colleges/{id}", "Public college detail."],
];
for (const [method, p, purpose] of collegeApis) {
  const pub = p === "/colleges" || p.startsWith("/colleges/{");
  add("College", {
    purpose, method, path: p,
    auth: pub ? "Public" : "JWT",
    roles: pub ? undefined : ["COLLEGE", "ADMIN"],
    headers: method === "GET" ? (pub ? ["Accept: application/json"] : H_AUTH_ONLY) : H_AUTH,
    query: method === "GET" ? { page: "1", pageSize: "20", q: "string?", city: "string?" } : undefined,
    body: method === "GET" ? undefined : { name: "string?", status: "AdmissionStatus?", seats: "number?" },
    success: ok(method === "GET" ? [] : { id: "clx..." }, method === "GET" ? pageMeta() : undefined),
    errors: ERR_STD,
    validation: ["Tenant collegeId derived from CollegeProfile"],
    business: ["COLLEGE users only mutate own college", "Status transitions follow AdmissionStatus enum"],
    exampleReq: `${method} ${BASE}${p}`,
  });
}

// ─── HR / COMPANY ─────────────────────────────────────────────────────────────
const companyApis = [
  ["GET", "/companies/me/dashboard", "Company/HR hiring dashboard."],
  ["GET", "/companies/me", "Company profile."],
  ["PATCH", "/companies/me", "Update company profile."],
  ["GET", "/companies/me/jobs", "List own job postings."],
  ["POST", "/jobs", "Create job posting."],
  ["PATCH", "/jobs/{id}", "Update job posting."],
  ["DELETE", "/jobs/{id}", "Soft-delete / close job."],
  ["GET", "/companies/me/internships", "List own internships."],
  ["POST", "/internships", "Create internship posting."],
  ["PATCH", "/internships/{id}", "Update internship."],
  ["GET", "/companies/me/candidates", "Candidate search across applicants."],
  ["GET", "/companies/me/resumes", "Resume search among applicants."],
  ["POST", "/job-applications/{id}/interviews", "Schedule interview."],
  ["PATCH", "/interviews/{id}", "Update interview / feedback."],
  ["POST", "/job-applications/{id}/offers", "Create offer letter."],
  ["PATCH", "/job-offers/{id}", "Update offer status."],
  ["GET", "/payroll/runs", "List payroll runs."],
  ["POST", "/payroll/runs", "Create payroll run."],
  ["GET", "/payroll/employees", "List employees."],
  ["GET", "/companies/me/reports", "Company reports."],
  ["GET", "/companies/me/analytics", "Company analytics."],
  ["GET", "/jobs", "Public job board."],
  ["GET", "/jobs/{id}", "Public job detail."],
  ["GET", "/internships", "Public internship board."],
  ["GET", "/internships/{id}", "Public internship detail."],
];
for (const [method, p, purpose] of companyApis) {
  const pub = (p === "/jobs" || p.startsWith("/jobs/{") || p === "/internships" || p.startsWith("/internships/{")) && method === "GET";
  add("HR / Company", {
    purpose, method, path: p,
    auth: pub ? "Public" : "JWT",
    roles: pub ? undefined : ["COMPANY", "ADMIN"],
    headers: method === "GET" ? (pub ? ["Accept: application/json"] : H_AUTH_ONLY) : H_AUTH,
    query: method === "GET" ? { page: "1", pageSize: "20", q: "string?", location: "string?", status: "string?" } : undefined,
    body: method === "GET" ? undefined : { title: "string?", description: "string?", status: "string?" },
    success: ok(method === "GET" ? [] : { id: "clx..." }, method === "GET" ? pageMeta() : undefined),
    errors: ERR_STD,
    validation: ["Ownership: job.companyId must match caller company"],
    business: ["ApplicationStatus / JobOfferStatus state machines enforced", "Payroll amounts Decimal"],
    exampleReq: `${method} ${BASE}${p}`,
  });
}

// Extra detailed job create
add("HR / Company", {
  purpose: "Create a job with full salary and employment metadata (detailed contract).",
  method: "POST", path: "/jobs", auth: "JWT", roles: ["COMPANY", "ADMIN"], headers: H_AUTH,
  body: {
    title: "Junior Backend Engineer",
    description: "NestJS + PostgreSQL",
    location: "Bengaluru",
    employmentType: "FULL_TIME",
    workMode: "HYBRID",
    salaryMin: "600000.00",
    salaryMax: "1000000.00",
    skills: ["NestJS", "PostgreSQL"],
    expiresAt: "2026-12-31T00:00:00.000Z",
  },
  success: ok({ id: "clxjob...", title: "Junior Backend Engineer", status: "ACTIVE" }),
  errors: ERR_STD,
  validation: ["title required", "salaryMin <= salaryMax", "enums valid"],
  business: ["companyId from HrUser/Company profile", "Audit log JOB.CREATE"],
  exampleReq: `POST ${BASE}/jobs\n{...}`,
  exampleRes: ok({ id: "clxjob...", title: "Junior Backend Engineer" }),
});

// ─── TRAINING ─────────────────────────────────────────────────────────────────
const trainingApis = [
  ["GET", "/training/me/dashboard", "Training center dashboard."],
  ["GET", "/training/me/courses", "Manage LMS courses."],
  ["POST", "/training/me/courses", "Create course."],
  ["PATCH", "/training/me/courses/{id}", "Update course."],
  ["GET", "/training/me/trainers", "List trainers."],
  ["POST", "/training/me/trainers", "Create trainer."],
  ["GET", "/training/me/batches", "List batches."],
  ["POST", "/training/me/batches", "Create batch."],
  ["GET", "/training/me/batches/{id}/attendance", "Attendance records."],
  ["POST", "/training/me/batches/{id}/attendance", "Upsert attendance."],
  ["GET", "/training/me/assignments", "Batch assignments."],
  ["POST", "/training/me/assignments", "Create assignment."],
  ["GET", "/training/me/assessments", "Assessments."],
  ["POST", "/training/me/certificates", "Issue training certificate."],
  ["GET", "/training/me/revenue", "Revenue entries."],
  ["GET", "/training/me/reports", "Training reports."],
];
for (const [method, p, purpose] of trainingApis) {
  add("Training", {
    purpose, method, path: p, auth: "JWT", roles: ["TRAINING", "ADMIN"],
    headers: method === "GET" ? H_AUTH_ONLY : H_AUTH,
    query: method === "GET" ? { page: "1", pageSize: "20" } : undefined,
    body: method === "GET" ? undefined : { title: "string?", sessionDate: "date?", status: "string?" },
    success: ok(method === "GET" ? [] : { id: "clx..." }, method === "GET" ? pageMeta() : undefined),
    errors: ERR_STD,
    validation: ["Scoped to TrainingCenter of caller"],
    business: ["Batch capacity enforced", "Attendance unique per student/day"],
    exampleReq: `${method} ${BASE}${p}`,
  });
}

// ─── CHANNEL PARTNER ──────────────────────────────────────────────────────────
const partnerApis = [
  ["GET", "/partners/me/dashboard", "Partner dashboard KPIs."],
  ["GET", "/partners/me/leads", "Partner leads."],
  ["POST", "/partners/me/leads", "Create lead."],
  ["PATCH", "/partners/me/leads/{id}", "Update lead status."],
  ["GET", "/partners/me/referrals/students", "Student referrals."],
  ["GET", "/partners/me/referrals/colleges", "College referrals."],
  ["GET", "/partners/me/referrals/courses", "Course referrals."],
  ["POST", "/partners/me/referrals", "Register referral attribution."],
  ["GET", "/partners/me/wallet", "Commission wallet."],
  ["GET", "/partners/me/commissions", "Commission ledger."],
  ["POST", "/partners/me/payouts", "Request payout."],
  ["GET", "/partners/me/payouts", "Payout history."],
  ["GET", "/partners/me/reports", "Partner reports."],
];
for (const [method, p, purpose] of partnerApis) {
  add("Channel Partner", {
    purpose, method, path: p, auth: "JWT", roles: ["PARTNER", "ADMIN"],
    headers: method === "GET" ? H_AUTH_ONLY : H_AUTH,
    query: method === "GET" ? { page: "1", pageSize: "20", status: "string?" } : undefined,
    body: method === "GET" ? undefined : { amount: "string?", note: "string?", referralCode: "string?" },
    success: ok(method === "GET" ? [] : { id: "clx..." }, method === "GET" ? pageMeta() : undefined),
    errors: ERR_STD,
    validation: ["Amounts Decimal strings", "Payout amount <= available balance"],
    business: ["CommissionStatus / PayoutStatus machines", "referralCode unique attribution"],
    exampleReq: `${method} ${BASE}${p}`,
  });
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
const adminApis = [
  ["GET", "/admin/dashboard", "Platform admin dashboard."],
  ["GET", "/admin/users", "List all users."],
  ["PATCH", "/admin/users/{id}", "Activate/deactivate or change role."],
  ["GET", "/admin/students", "List students."],
  ["GET", "/admin/colleges", "List colleges."],
  ["GET", "/admin/companies", "List companies."],
  ["GET", "/admin/training-centers", "List training centers."],
  ["GET", "/admin/partners", "List partners."],
  ["GET", "/admin/courses", "Moderate courses."],
  ["GET", "/admin/coaching", "Moderate coaching programs."],
  ["GET", "/admin/admissions", "Platform admissions overview."],
  ["GET", "/admin/payments", "Payment operations list."],
  ["POST", "/admin/notifications/broadcast", "Broadcast notification."],
  ["GET", "/admin/reports", "Generated reports."],
  ["GET", "/admin/analytics", "Platform analytics."],
  ["GET", "/admin/settings", "List settings."],
  ["PUT", "/admin/settings/{key}", "Upsert setting."],
  ["GET", "/admin/announcements", "CMS announcements."],
  ["POST", "/admin/announcements", "Create announcement."],
  ["GET", "/admin/banners", "Banners."],
  ["POST", "/admin/banners", "Create banner."],
  ["GET", "/admin/cms/pages", "CMS pages."],
  ["POST", "/admin/cms/pages", "Create CMS page."],
  ["GET", "/admin/support-tickets", "Support tickets."],
  ["PATCH", "/admin/support-tickets/{id}", "Assign/resolve ticket."],
];
for (const [method, p, purpose] of adminApis) {
  add("Admin", {
    purpose, method, path: p, auth: "JWT", roles: ["ADMIN"],
    headers: method === "GET" ? H_AUTH_ONLY : H_AUTH,
    query: method === "GET" ? { page: "1", pageSize: "20", q: "string?", role: "string?" } : undefined,
    body: method === "GET" ? undefined : { value: "any?", isActive: "boolean?", status: "string?" },
    success: ok(method === "GET" ? [] : { id: "clx..." }, method === "GET" ? pageMeta() : undefined),
    errors: ERR_STD,
    validation: ["ADMIN role required", "RBAC permission optional overlay"],
    business: ["All mutations write audit_logs", "Dangerous role changes require isSystem guard"],
    exampleReq: `${method} ${BASE}${p}`,
  });
}

// ─── PAYMENT ──────────────────────────────────────────────────────────────────
add("Payment", {
  purpose: "Create payment order with payment provider (Razorpay).",
  method: "POST", path: "/payments/orders", auth: "JWT", headers: [...H_AUTH, "Idempotency-Key: <uuid>"],
  body: { amount: "7999.00", currency: "INR", purpose: "COURSE_ENROLLMENT", referenceId: "clxcourse...", provider: "RAZORPAY" },
  success: ok({ paymentId: "clxpay...", orderId: "order_...", amount: "7999.00", currency: "INR", status: "PENDING" }),
  errors: [...ERR_STD, "422 BUSINESS_RULE_VIOLATION"],
  validation: ["amount > 0", "currency ISO", "Idempotency-Key recommended"],
  business: ["Creates Payment PENDING", "Provider order created", "Idempotent on key"],
});
add("Payment", {
  purpose: "Verify provider payment signature and mark SUCCESS.",
  method: "POST", path: "/payments/verify", auth: "JWT", headers: H_AUTH,
  body: { paymentId: "clxpay...", providerPaymentId: "pay_...", providerOrderId: "order_...", signature: "string" },
  success: ok({ paymentId: "clxpay...", status: "SUCCESS" }),
  errors: ["400 VALIDATION_ERROR", "401 UNAUTHORIZED", "422 BUSINESS_RULE_VIOLATION"],
  validation: ["signature required"],
  business: ["Verifies HMAC", "Credits entitlements / wallet as per purpose", "Writes Transaction"],
});
add("Payment", {
  purpose: "Refund a successful payment (full/partial).",
  method: "POST", path: "/payments/{id}/refunds", auth: "JWT", roles: ["ADMIN", "COMPANY"], headers: [...H_AUTH, "Idempotency-Key: <uuid>"],
  body: { amount: "1000.00", reason: "Duplicate charge" },
  success: ok({ refundId: "clxref...", status: "PENDING" }),
  errors: ERR_STD,
  validation: ["amount > 0", "amount <= net captured"],
  business: ["Creates Refund", "Provider refund call async"],
});
add("Payment", {
  purpose: "Get invoice by id or payment.",
  method: "GET", path: "/invoices/{id}", auth: "JWT", headers: H_AUTH_ONLY,
  success: ok({ id: "clxinv...", invoiceNo: "ELW-INV-2026-00088", totalAmount: "9438.82", status: "PAID" }),
  errors: ERR_STD,
  validation: [],
  business: ["Owner or ADMIN only"],
});
add("Payment", {
  purpose: "List premium plans.",
  method: "GET", path: "/premium-plans", auth: "Public", headers: ["Accept: application/json"],
  success: ok([{ id: "clx...", name: "Pro", price: "499.00", billingCycle: "MONTHLY" }]),
  errors: ["500 INTERNAL_ERROR"],
  validation: [],
  business: ["Only isActive && !deletedAt"],
});
add("Payment", {
  purpose: "Create/subscribe user to premium plan.",
  method: "POST", path: "/subscriptions", auth: "JWT", headers: H_AUTH,
  body: { planId: "clxplan..." },
  success: ok({ id: "clxsub...", status: "TRIAL", planId: "clxplan..." }),
  errors: ERR_STD,
  validation: ["planId required"],
  business: ["May create payment order for paid plans"],
});
add("Payment", {
  purpose: "Transaction history for current user.",
  method: "GET", path: "/payments/transactions", auth: "JWT", headers: H_AUTH_ONLY,
  query: { page: "1", pageSize: "20", status: "string?" },
  success: ok([], pageMeta()),
  errors: ERR_STD,
  validation: [],
  business: ["Includes Payment + Transaction join view"],
});

add("Payment", {
  purpose: "Get payment by id.",
  method: "GET", path: "/payments/{id}", auth: "JWT", headers: H_AUTH_ONLY,
  success: ok({ id: "clxpay...", status: "SUCCESS", amount: "7999.00" }),
  errors: ERR_STD,
  validation: [],
  business: ["Owner or ADMIN"],
});

// ─── NOTIFICATION ─────────────────────────────────────────────────────────────
const notifApis = [
  ["GET", "/notifications", "List in-app notifications.", "JWT"],
  ["PATCH", "/notifications/{id}/read", "Mark notification read.", "JWT"],
  ["POST", "/notifications/read-all", "Mark all read.", "JWT"],
  ["POST", "/notifications/email", "Enqueue email (admin/system).", "JWT"],
  ["POST", "/notifications/sms", "Enqueue SMS.", "JWT"],
  ["POST", "/notifications/whatsapp", "Enqueue WhatsApp template message.", "JWT"],
  ["POST", "/notifications/push", "Enqueue push notification.", "JWT"],
  ["GET", "/announcements", "Public/active announcements.", "Public"],
  ["GET", "/banners", "Active banners.", "Public"],
];
for (const [method, p, purpose, auth] of notifApis) {
  add("Notification", {
    purpose, method, path: p, auth,
    roles: auth === "JWT" && p.includes("/notifications/") && method === "POST" && !p.includes("read") ? ["ADMIN"] : undefined,
    headers: auth === "Public" ? ["Accept: application/json"] : (method === "GET" ? H_AUTH_ONLY : H_AUTH),
    body: method === "GET" ? undefined : { to: "string?", title: "string?", message: "string?", template: "string?" },
    success: ok(method === "GET" ? [] : { id: "clx...", status: "QUEUED" }),
    errors: ERR_STD,
    validation: ["Channel-specific fields required"],
    business: ["Writes EmailLog/SmsLog/WhatsappLog/PushNotification", "User inbox uses Notification model"],
    exampleReq: `${method} ${BASE}${p}`,
  });
}

// ─── FILES ────────────────────────────────────────────────────────────────────
const fileApis = [
  ["POST", "/files/images", "Upload image (avatar, banner, thumbnail)."],
  ["POST", "/files/pdfs", "Upload PDF document."],
  ["POST", "/files/certificates", "Upload certificate asset."],
  ["POST", "/files/resumes", "Upload student resume."],
  ["GET", "/files/{id}", "Get file metadata + signed URL."],
  ["GET", "/files/{id}/download", "Download file (redirect or stream)."],
  ["DELETE", "/files/{id}", "Delete file (soft + storage delete job)."],
];
for (const [method, p, purpose] of fileApis) {
  add("File Management", {
    purpose, method, path: p, auth: "JWT",
    headers: method === "POST" ? H_MULTI : H_AUTH_ONLY,
    body: method === "POST" ? { file: "binary", purpose: "AVATAR|RESUME|CERTIFICATE|PDF|OTHER" } : undefined,
    success: ok({ fileId: "clxfile...", url: "https://cdn.../signed", mimeType: "application/pdf", sizeBytes: 204800 }),
    errors: [...ERR_STD, "413 PAYLOAD_TOO_LARGE", "415 UNSUPPORTED_MEDIA_TYPE"],
    validation: ["MIME allowlist", "size limits per purpose"],
    business: ["Stored in R2/S3 private bucket", "Owner-scoped access"],
    exampleReq: `${method} ${BASE}${p}`,
  });
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
const analyticsApis = [
  ["GET", "/analytics/dashboard", "Role-aware dashboard statistics."],
  ["GET", "/analytics/revenue", "Revenue analytics time series."],
  ["GET", "/analytics/students", "Student funnel analytics."],
  ["GET", "/analytics/placements", "Placement analytics."],
  ["GET", "/analytics/courses", "Course engagement analytics."],
  ["GET", "/analytics/partners", "Partner performance analytics."],
  ["GET", "/analytics/companies", "Company hiring analytics."],
];
for (const [method, p, purpose] of analyticsApis) {
  add("Analytics", {
    purpose, method, path: p, auth: "JWT",
    roles: p.includes("revenue") || p.includes("partners") || p.includes("companies") ? ["ADMIN", "COMPANY", "PARTNER", "TRAINING"] : undefined,
    headers: H_AUTH_ONLY,
    query: { from: "ISO date?", to: "ISO date?", groupBy: "day|week|month?" },
    success: ok({ series: [{ date: "2026-08-01", value: 120 }], totals: { count: 1200 } }),
    errors: ERR_STD,
    validation: ["from <= to"],
    business: ["Reads analytics_snapshots + live aggregates", "Tenant-scoped for non-ADMIN"],
    exampleReq: `${method} ${BASE}${p}?from=2026-01-01&to=2026-08-08&groupBy=month`,
  });
}

// ─── SHARED CATALOGUE / COACHING / COURSES / CAREER ───────────────────────────
const publicCatalog = [
  ["GET", "/coaching/categories", "List coaching categories.", "Public"],
  ["GET", "/coaching/programs", "List coaching programs (NEET/JEE/Competitive).", "Public"],
  ["GET", "/coaching/programs/{id}", "Coaching program detail.", "Public"],
  ["POST", "/coaching/programs/{id}/enroll", "Enroll in coaching program.", "JWT"],
  ["GET", "/courses", "List published courses.", "Public"],
  ["GET", "/courses/{slug}", "Course detail by slug.", "Public"],
  ["GET", "/career/guidance", "Career guidance articles.", "Public"],
  ["GET", "/career/guidance/{id}", "Guidance article detail.", "Public"],
  ["GET", "/study-abroad/programs", "Study abroad programs.", "Public"],
  ["GET", "/study-abroad/programs/{id}", "Program detail.", "Public"],
  ["GET", "/admissions/programs", "Open admission programmes.", "Public"],
  ["GET", "/projects", "Live projects board.", "Public"],
  ["GET", "/projects/{id}", "Project detail.", "Public"],
  ["GET", "/health", "Liveness probe.", "Public"],
  ["GET", "/health/ready", "Readiness (DB/Redis).", "Public"],
];
for (const [method, p, purpose, auth] of publicCatalog) {
  add("Catalogue & Platform", {
    purpose, method, path: p, auth,
    roles: auth === "JWT" ? ["STUDENT", "ADMIN"] : undefined,
    headers: auth === "Public" ? ["Accept: application/json"] : H_AUTH,
    query: method === "GET" && !p.includes("health") ? { page: "1", pageSize: "20", q: "string?", category: "string?", examType: "string?" } : undefined,
    success: ok(p.includes("health") ? { status: "ok", service: "ellowring-api" } : (method === "GET" ? [] : { id: "clx...", status: "ACTIVE" }), method === "GET" && !p.includes("health") ? pageMeta() : undefined),
    errors: p.includes("health") ? ["503 SERVICE_UNAVAILABLE"] : ERR_STD,
    validation: [],
    business: ["Published flags honored", "Enroll requires student profile"],
    exampleReq: `${method} ${BASE}${p}`,
  });
}

// ─── ENTERPRISE ───────────────────────────────────────────────────────────────
const ent = [
  ["GET", "/enterprise/health", "Partner API health."],
  ["GET", "/enterprise/students/{id}/profile", "Fetch student profile by id."],
  ["GET", "/enterprise/verify/certificate/{code}", "Verify certificate credential."],
  ["GET", "/enterprise/jobs", "List active jobs for partners."],
  ["POST", "/enterprise/webhooks/test", "Echo webhook test payload."],
];
for (const [method, p, purpose] of ent) {
  add("Enterprise", {
    purpose, method, path: p, auth: "API Key",
    headers: ["X-API-Key: <enterprise_key>", "Accept: application/json", ...(method === "POST" ? ["Content-Type: application/json"] : [])],
    body: method === "POST" ? { event: "string", payload: "object" } : undefined,
    success: ok({ status: "ok" }),
    errors: ["401 UNAUTHORIZED", "403 FORBIDDEN", "404 NOT_FOUND", "429 RATE_LIMITED"],
    validation: ["Valid X-API-Key"],
    business: ["M2M partner access", "Scoped data policies per key"],
    exampleReq: `${method} ${BASE}${p}`,
  });
}

// ─── RENDERERS ────────────────────────────────────────────────────────────────

function renderApi(spec) {
  const headers = (spec.headers || []).map((h) => `- \`${h}\``).join("\n") || "- _(none)_";
  const params = spec.params
    ? Object.entries(spec.params).map(([k, v]) => `| ${k} | ${v} |`).join("\n")
    : "| — | — |";
  const query = spec.query
    ? Object.entries(spec.query).map(([k, v]) => `| ${k} | ${v} |`).join("\n")
    : "| — | — |";
  const body = spec.body
    ? "```json\n" + JSON.stringify(spec.body, null, 2) + "\n```"
    : "_No request body._";
  const success = "```json\n" + JSON.stringify(spec.success, null, 2) + "\n```";
  const errors = spec.errors.map((e) => `- ${e}`).join("\n");
  const validation = spec.validation.map((v) => `- ${v}`).join("\n") || "- None beyond auth.";
  const business = spec.business.map((b) => `- ${b}`).join("\n");
  const roles = spec.roles ? spec.roles.join(", ") : "—";
  return `#### \`${spec.method} ${BASE}${spec.path}\`

**Purpose:** ${spec.purpose}

| Attribute | Value |
|---|---|
| Endpoint | \`${BASE}${spec.path}\` |
| HTTP Method | \`${spec.method}\` |
| Authentication | ${spec.auth} |
| Roles | ${roles} |

**Headers**

${headers}

**Request Parameters (path)**

| Name | Type / Notes |
|---|---|
${params}

**Request Parameters (query)**

| Name | Type / Notes |
|---|---|
${query}

**Request Body**

${body}

**Success Response**

${success}

**Error Response**

${errors}

Standard error envelope — see Section 12.

**Validation Rules**

${validation}

**Business Rules**

${business}

**Example Request**

\`\`\`http
${spec.exampleReq || `${spec.method} ${BASE}${spec.path} HTTP/1.1`}
\`\`\`

**Example Response**

${spec.exampleRes ? "```json\n" + JSON.stringify(spec.exampleRes, null, 2) + "\n```" : success}
`;
}

function buildAppendix() {
  let total = 0;
  let out = `## Appendix A — Complete API Catalogue

Base URL: \`{HOST}${BASE}\` (local: \`http://localhost:4000${BASE}\`).

Each endpoint below is Phase-5 contract. Companion machine-readable spec: \`docs/api/openapi.yaml\`.

`;
  for (const [mod, apis] of Object.entries(MODULES)) {
    out += `### Module: ${mod}\n\n`;
    out += `| # | Method | Path | Auth | Purpose |\n|---|---|---|---|---|\n`;
    apis.forEach((a, i) => {
      out += `| ${i + 1} | ${a.method} | \`${a.path}\` | ${a.auth} | ${a.purpose} |\n`;
    });
    out += `\n`;
    for (const a of apis) {
      total++;
      out += renderApi(a) + "\n";
    }
  }
  out += `\n*End of Appendix A — ${total} endpoints documented.*\n`;
  return { out, total };
}

function yamlEscape(s) {
  if (s == null) return '""';
  const t = String(s);
  if (/[:#{}[\],&*?|>!%@`]/.test(t) || t.includes("\n") || t.includes('"')) {
    return JSON.stringify(t);
  }
  return t;
}

function buildOpenApi(total) {
  const paths = {};
  for (const apis of Object.values(MODULES)) {
    for (const a of apis) {
      const full = `${BASE}${a.path}`.replace(/\{([^}]+)\}/g, "{$1}");
      // OpenAPI path without /api prefix duplication — use /v1/... under servers url ending /api
      const p = `/v1${a.path}`;
      if (!paths[p]) paths[p] = {};
      const method = a.method.toLowerCase();
      const params = [];
      const pathParams = [...a.path.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
      for (const name of pathParams) {
        params.push({ name, in: "path", required: true, schema: { type: "string" } });
      }
      if (a.query) {
        for (const [name, desc] of Object.entries(a.query)) {
          params.push({
            name,
            in: "query",
            required: false,
            description: String(desc),
            schema: { type: "string" },
          });
        }
      }
      const op = {
        tags: [Object.entries(MODULES).find(([, list]) => list.includes(a))?.[0] || "General"],
        summary: a.purpose,
        description: a.purpose,
        operationId: `${method}_${a.path.replace(/[\/{}]/g, "_")}`,
        parameters: params,
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessEnvelope" },
                example: a.success,
              },
            },
          },
          400: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorEnvelope" } } } },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Not found" },
          429: { description: "Rate limited" },
        },
      };
      if (a.auth === "JWT" || a.auth === "Refresh token") {
        op.security = [{ bearerAuth: [] }];
      } else if (a.auth === "API Key") {
        op.security = [{ apiKeyAuth: [] }];
      }
      if (a.body && a.method !== "GET") {
        op.requestBody = {
          required: true,
          content: {
            [a.headers?.some((h) => h.includes("multipart")) ? "multipart/form-data" : "application/json"]: {
              schema: { type: "object", additionalProperties: true, example: a.body },
            },
          },
        };
      }
      paths[p][method] = op;
    }
  }

  // Manual YAML build (avoid dependency)
  let y = `openapi: 3.0.3
info:
  title: Ellowring API
  description: |
    Ellowring Software Solutions — Enterprise SaaS REST API (Phase 5).
    Learn. Prepare. Build. Get Hired.
  version: 1.0.0
  contact:
    name: Ellowring Engineering
    email: engineering@ellowring.com
servers:
  - url: http://localhost:4000/api
    description: Local
  - url: https://api-staging.ellowring.com/api
    description: Staging
  - url: https://api.ellowring.com/api
    description: Production
tags:
`;
  for (const mod of Object.keys(MODULES)) {
    y += `  - name: ${yamlEscape(mod)}\n`;
  }
  y += `paths:\n`;
  for (const [p, methods] of Object.entries(paths)) {
    y += `  ${p}:\n`;
    for (const [m, op] of Object.entries(methods)) {
      y += `    ${m}:\n`;
      y += `      tags:\n        - ${yamlEscape(op.tags[0])}\n`;
      y += `      summary: ${yamlEscape(op.summary)}\n`;
      y += `      operationId: ${yamlEscape(op.operationId)}\n`;
      if (op.security) {
        y += `      security:\n`;
        for (const s of op.security) {
          const k = Object.keys(s)[0];
          y += `        - ${k}: []\n`;
        }
      }
      if (op.parameters?.length) {
        y += `      parameters:\n`;
        for (const par of op.parameters) {
          y += `        - name: ${par.name}\n`;
          y += `          in: ${par.in}\n`;
          y += `          required: ${par.required}\n`;
          if (par.description) y += `          description: ${yamlEscape(par.description)}\n`;
          y += `          schema:\n            type: string\n`;
        }
      }
      if (op.requestBody) {
        const ct = Object.keys(op.requestBody.content)[0];
        y += `      requestBody:\n        required: true\n        content:\n          ${ct}:\n            schema:\n              type: object\n              additionalProperties: true\n`;
      }
      y += `      responses:\n`;
      y += `        '200':\n          description: Success\n          content:\n            application/json:\n              schema:\n                $ref: '#/components/schemas/SuccessEnvelope'\n`;
      y += `        '400':\n          description: Validation error\n        '401':\n          description: Unauthorized\n        '403':\n          description: Forbidden\n        '404':\n          description: Not found\n        '429':\n          description: Rate limited\n`;
    }
  }
  y += `components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    apiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
  schemas:
    SuccessEnvelope:
      type: object
      required: [success, data, meta]
      properties:
        success:
          type: boolean
          example: true
        data: {}
        meta:
          type: object
          properties:
            requestId:
              type: string
            timestamp:
              type: string
              format: date-time
            pagination:
              $ref: '#/components/schemas/PaginationMeta'
    ErrorEnvelope:
      type: object
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string
            details:
              type: array
              items:
                type: object
            requestId:
              type: string
            timestamp:
              type: string
              format: date-time
    PaginationMeta:
      type: object
      properties:
        page: { type: integer }
        pageSize: { type: integer }
        totalItems: { type: integer }
        totalPages: { type: integer }
        hasNext: { type: boolean }
        hasPrev: { type: boolean }
`;
  return { yaml: y, pathCount: Object.keys(paths).length, total };
}

function buildAppendixBCD() {
  return `
## Appendix B — API Flow & Sequence Diagrams

### B.1 Authentication (OTP)

\`\`\`mermaid
sequenceDiagram
  participant U as User
  participant C as Client
  participant API as API /auth
  participant R as Redis
  participant DB as DB
  U->>C: Enter email
  C->>API: POST /auth/otp/request
  API->>R: rate limit check
  API->>DB: store OTP hash
  API-->>C: 200 message
  U->>C: Enter OTP
  C->>API: POST /auth/otp/verify
  API->>DB: validate + issue tokens
  API-->>C: access + refresh
\`\`\`

### B.2 Job apply flow

\`\`\`mermaid
sequenceDiagram
  participant S as Student App
  participant API as Jobs/Applications API
  participant DB as PostgreSQL
  S->>API: GET /jobs?q=backend
  API-->>S: job list
  S->>API: POST /jobs/{id}/applications
  API->>DB: insert JobApplication PENDING
  API-->>S: application created
  Note over API: Company schedules interview via POST .../interviews
\`\`\`

### B.3 Payment verify flow

\`\`\`mermaid
sequenceDiagram
  participant C as Client
  participant API as Payments API
  participant RZ as Razorpay
  participant DB as DB
  C->>API: POST /payments/orders
  API->>RZ: create order
  API->>DB: Payment PENDING
  API-->>C: orderId
  C->>RZ: checkout
  C->>API: POST /payments/verify
  API->>RZ: verify signature
  API->>DB: SUCCESS + Transaction + entitlement
  API-->>C: success
\`\`\`

### B.4 Authorization decision

\`\`\`mermaid
flowchart TD
  A[Incoming request] --> B{JWT valid?}
  B -->|No| C[401]
  B -->|Yes| D{Role allowed?}
  D -->|No| E[403]
  D -->|Yes| F{RBAC permission?}
  F -->|No| E
  F -->|Yes| G{Tenant ownership OK?}
  G -->|No| E
  G -->|Yes| H[Execute handler]
\`\`\`

---

## Appendix C — HTTP Status & Error Codes

| HTTP | When used |
|---|---|
| 200 | Successful GET/PATCH/action |
| 201 | Resource created (optional; Phase-5 allows 200+envelope) |
| 204 | Empty delete (optional) |
| 400 | Validation / malformed |
| 401 | Missing/invalid auth |
| 403 | Authenticated but not allowed |
| 404 | Resource missing |
| 409 | Duplicate / conflict |
| 410 | Expired OTP/token |
| 413 | Upload too large |
| 415 | Unsupported media type |
| 422 | Business rule violation |
| 429 | Rate limited |
| 500 | Unexpected server error |
| 503 | Dependency down |

| error.code | Meaning |
|---|---|
| VALIDATION_ERROR | DTO failed |
| UNAUTHORIZED | Auth required/failed |
| TOKEN_EXPIRED | Access JWT expired |
| INVALID_CREDENTIALS | Bad password/OTP |
| FORBIDDEN | Role/permission |
| NOT_FOUND | Missing entity |
| CONFLICT | Unique violation |
| BUSINESS_RULE_VIOLATION | Domain rule |
| RATE_LIMITED | Throttle |
| INTERNAL_ERROR | Unhandled |

---

## Appendix D — OpenAPI / Swagger

| Artefact | Path |
|---|---|
| OpenAPI 3.0 YAML | \`docs/api/openapi.yaml\` |
| Nest Swagger UI (Phase-5 impl) | \`GET /api/docs\` |
| Pack index | \`docs/api/README.md\` |

Generate/refresh YAML:

\`\`\`bash
node docs/scripts/generate-api-catalogue.js
\`\`\`

Import \`openapi.yaml\` into Postman, Insomnia, or Stoplight for client stubs.

---

## Appendix E — Phase-5 Implementation Gap vs Current Code

| Area | Current repo | Phase-5 target |
|---|---|---|
| Prefix | \`/api\` | \`/api/v1\` |
| Endpoints | ~52 | 180+ (this catalogue) |
| Envelope | Ad-hoc | Uniform success/error |
| Refresh / Google / reset | Partial/missing | Fully specified |
| Swagger | None | openapi.yaml + /api/docs |
| Soft error on 200 | Present in places | Forbidden |

Migration guidance: implement interceptors/guards first, alias unversioned routes, then fill module controllers to match Appendix A.

---

## Related Documents

| Document | Path |
|---|---|
| Database Design (Phase 4) | \`docs/Ellowring_Database_Design.md\` |
| System Architecture | \`docs/Ellowring_System_Architecture.md\` |
| API pack index | \`docs/api/README.md\` |
| OpenAPI | \`docs/api/openapi.yaml\` |
| PRD | \`docs/Ellowring_PRD.md\` |

---

*Ellowring Phase-5 API Design — end of document.*
`;
}

function main() {
  const { out, total } = buildAppendix();
  const { yaml, pathCount } = buildOpenApi(total);
  const bcd = buildAppendixBCD();

  let doc = fs.readFileSync(DOC, "utf8");
  // Strip old appendices if re-run
  const marker = "\n*End of narrative chapters.";
  const idx = doc.indexOf(marker);
  if (idx >= 0) doc = doc.slice(0, idx + marker.length) + " Complete endpoint catalogue, diagrams, status codes, and OpenAPI follow in Appendices.\n\n---\n\n";
  else if (!doc.includes("## Appendix A")) doc += "\n\n---\n\n";

  // Remove existing generated appendix if present
  const aIdx = doc.indexOf("## Appendix A — Complete API Catalogue");
  if (aIdx >= 0) doc = doc.slice(0, aIdx);

  doc = doc.trimEnd() + "\n\n" + out + "\n" + bcd;
  // Patch executive metric
  doc = doc.replace(/\|\s*Documented endpoints\s*\|\s*\*\*[^*]+\*\*/, `| Documented endpoints | **${total}**`);

  fs.writeFileSync(DOC, doc);
  fs.writeFileSync(OPENAPI_OUT, yaml);
  console.log(`Endpoints: ${total}`);
  console.log(`OpenAPI paths: ${pathCount}`);
  console.log(`Wrote ${DOC}`);
  console.log(`Wrote ${OPENAPI_OUT}`);
}

main();
