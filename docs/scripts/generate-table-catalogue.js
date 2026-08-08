/**
 * Regenerates Appendix A (Complete Table Catalogue) from phase4 Prisma schema
 * with table-specific Purpose / Business / Validation / Example Data.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const SCHEMA = path.join(ROOT, "backend/prisma/phase4/schema.prisma");
const DOC = path.join(ROOT, "docs/Ellowring_Database_Design.md");

const MODULE_ORDER = [
  ["Authentication", ["User", "RbacRole", "Permission", "RbacRolePermission", "UserRbacRole", "Session", "RefreshToken", "OtpVerification", "PasswordReset", "AuditLog"]],
  ["Student", ["Student", "Parent", "EducationHistory", "CareerInterest", "CareerRecommendation", "Skill", "StudentSkill", "SkillProgress", "Achievement", "Wallet", "WalletLedger", "Coupon", "CouponRedemption", "Certificate", "Bookmark", "Favorite"]],
  ["Coaching", ["CoachingCategory", "CoachingProgram", "CoachingEnrollment", "Subject", "Chapter", "Lesson", "Topic", "QuestionBank", "MockTest", "Question", "QuestionOption", "StudentAnswer", "MockResult", "LeaderboardEntry"]],
  ["College", ["School", "University", "College", "CollegeProfile", "Department", "CollegeCourse", "CollegeRanking", "CollegeReview", "CollegeApplication", "Scholarship"]],
  ["Study Abroad", ["Country", "AbroadUniversity", "AbroadProgram", "EligibilityRule", "VisaRequirement", "AbroadApplication", "AbroadDocument"]],
  ["Learning", ["CourseCategory", "Course", "CourseModule", "CourseLesson", "CourseVideo", "Assignment", "Assessment", "CourseCertificate", "CourseDownload", "CourseEnrollment"]],
  ["Internship", ["Company", "Internship", "InternshipApplication", "InternshipOffer", "InternshipProgress", "Mentor", "InternshipFeedback"]],
  ["Project", ["ProjectCategory", "Project", "ProjectTechnology", "ProjectTeamMember", "ProjectSubmission", "ProjectEvaluation"]],
  ["Job", ["HrUser", "Job", "JobApplication", "SavedJob", "Interview", "JobOffer", "Employee", "PayrollRun", "PayrollItem"]],
  ["Training", ["TrainingCenter", "Trainer", "TrainingProgram", "TrainingBatch", "AttendanceRecord", "TrainingAssignment", "TrainingRevenue"]],
  ["Channel Partner", ["Partner", "PartnerLead", "Referral", "PartnerWallet", "Commission", "Payout", "PartnerReport"]],
  ["Admin", ["Setting", "Configuration", "Report", "AnalyticsSnapshot", "Announcement", "Banner", "CmsPage", "SupportTicket"]],
  ["Payment", ["PremiumPlan", "Subscription", "Payment", "Invoice", "Transaction", "Refund"]],
  ["Notification", ["Notification", "EmailLog", "SmsLog", "PushNotification", "WhatsappLog"]],
];

const TABLE_META = {
  User: {
    purpose: "Central identity record for all Ellowring roles; authenticates sessions and owns role profiles.",
    business: "One user may hold exactly one primary Role enum profile (Student, CollegeProfile, Company, TrainingCenter, Partner, HrUser). Soft-delete disables login but retains FK history. Email is immutable after verification unless Admin reset. Password hash never returned via API.",
    validation: "email required, unique, lowercased; passwordHash required (bcrypt/argon2); role must be valid Role enum; phone unique when present (E.164 preferred).",
    example: "student@ellowring.com / Role.STUDENT / isVerified=true / isActive=true",
  },
  RbacRole: {
    purpose: "Fine-grained enterprise RBAC role beyond the coarse application Role enum.",
    business: "System roles (isSystem=true) cannot be deleted. Assigned via UserRbacRole. Used primarily for Admin console privileges.",
    validation: "name and slug unique; slug kebab-case; isSystem default false.",
    example: "super-admin, content-manager, support-agent",
  },
  Permission: {
    purpose: "Atomic permission claims (module.action) bound to RBAC roles.",
    business: "Permissions are additive. Module prefix must match platform module ownership (auth.*, student.*, jobs.*, …).",
    validation: "slug unique; format module.action; name required.",
    example: "jobs.publish, payments.refund, cms.publish",
  },
  RbacRolePermission: {
    purpose: "Many-to-many join of RBAC roles to permissions.",
    business: "Deleting a role cascades join rows. Duplicate (roleId, permissionId) forbidden.",
    validation: "roleId and permissionId required FKs; composite unique.",
    example: "super-admin → all permissions; support-agent → support.* + notifications.read",
  },
  UserRbacRole: {
    purpose: "Assigns enterprise RBAC roles to users (typically Admins).",
    business: "Independent of coarse Role enum. A COMPANY user may also receive limited RBAC roles if needed.",
    validation: "composite unique (userId, roleId); both FKs required.",
    example: "admin@ellowring.com → super-admin",
  },
  Session: {
    purpose: "Server-side session tracking for authenticated browsers/apps.",
    business: "Expire sessions on logout and password reset. Purge expired sessions via scheduled job. Soft device/context metadata only.",
    validation: "userId FK; tokenHash unique; expiresAt > createdAt.",
    example: "userId=student…, expiresAt=+7d, userAgent=Chrome Windows",
  },
  RefreshToken: {
    purpose: "Rotating refresh tokens for JWT/access-token renewal.",
    business: "Rotate on each use; mark superseded tokens revoked. Hard-delete after retention window.",
    validation: "tokenHash unique; userId FK; revokedAt null means active.",
    example: "hashed refresh token, familyId for reuse detection",
  },
  OtpVerification: {
    purpose: "One-time codes for signup, login, or sensitive actions.",
    business: "Single-use; mark used=true on consume. Invalidate prior OTPs for same purpose+target. Rate-limit creation via Redis.",
    validation: "code 4–8 digits; expiresAt required; purpose enum-like string; either email or phone or userId.",
    example: "purpose=REGISTER, code=482913, expiresAt=+10m",
  },
  PasswordReset: {
    purpose: "Password reset request tokens.",
    business: "One active token per user; invalidate on success or expiry. Never log raw token.",
    validation: "tokenHash unique; expiresAt required; used boolean.",
    example: "userId=student…, expiresAt=+30m, used=false",
  },
  AuditLog: {
    purpose: "Immutable security and domain action trail.",
    business: "Insert-only. No updates/deletes from app role. Partition-ready by createdAt. Store actor, action, entity, before/after diffs as JSON.",
    validation: "action and entityType required; metadata JSON optional.",
    example: "action=USER.LOGIN, entityType=User, ip=…, metadata={channel:web}",
  },
  Student: {
    purpose: "Student profile extension (1:1 with User where role=STUDENT).",
    business: "Created at registration for STUDENT role. Career fields drive guidance recommendations. Soft-delete mirrors user deactivation.",
    validation: "userId unique FK; grade/stream optional enumerated values preferred; city/state free text.",
    example: "grade=12, stream=PCM, city=Pune, careerInterest=Engineering",
  },
  Parent: {
    purpose: "Guardian contacts linked to a student.",
    business: "Multiple parents allowed; primary flag enforced in app (at most one primary).",
    validation: "studentId FK; phone/email format; relationType required (FATHER/MOTHER/GUARDIAN).",
    example: "relationType=MOTHER, name=Anita Sharma, phone=+91…",
  },
  EducationHistory: {
    purpose: "Chronological education records for career/admission forms.",
    business: "Ordered by yearFrom/yearTo. Used to prefill college and study-abroad applications.",
    validation: "studentId FK; institutionName required; percentage 0–100 when present.",
    example: "institution=Delhi Public School, board=CBSE, yearTo=2024, percentage=92.4",
  },
  CareerInterest: {
    purpose: "Declared career interest tags for guidance.",
    business: "Weighted interests influence CareerRecommendation generation.",
    validation: "studentId FK; interest required; weight 1–10 when used.",
    example: "interest=Software Engineering, weight=9",
  },
  CareerRecommendation: {
    purpose: "System or counselor-generated career pathway suggestions.",
    business: "Recommendations are advisory; student may dismiss. Store algorithm version in metadata.",
    validation: "studentId FK; title required; score 0–100 optional.",
    example: "title=JEE → B.Tech CSE → Product Internship, score=86",
  },
  Skill: {
    purpose: "Canonical skill catalogue (tech, soft, domain).",
    business: "Shared across students, jobs, and courses. Prefer slug uniqueness for upserts.",
    validation: "name/slug unique; category optional.",
    example: "name=React, slug=react, category=FRONTEND",
  },
  StudentSkill: {
    purpose: "Student ↔ skill association with proficiency.",
    business: "Proficiency drives job matching and project eligibility.",
    validation: "composite unique (studentId, skillId); level enum-like BEGINNER…EXPERT.",
    example: "skill=React, level=INTERMEDIATE",
  },
  SkillProgress: {
    purpose: "Time-series skill improvement checkpoints.",
    business: "Append progress events; do not overwrite history.",
    validation: "studentId + skillId FKs; progressPercent 0–100.",
    example: "progressPercent=65, source=COURSE_COMPLETION",
  },
  Achievement: {
    purpose: "Badges / milestones awarded to students.",
    business: "Issued by coaching, courses, or admin. Certificate linkage optional.",
    validation: "studentId FK; title required; awardedAt default now.",
    example: "title=NEET Mock Top 10, awardedAt=2026-03-01",
  },
  Wallet: {
    purpose: "Student prepaid wallet balance (INR).",
    business: "Balance must equal sum(ledger credits − debits − holds + releases). Never update balance without a WalletLedger row in the same transaction.",
    validation: "userId unique; balance ≥ 0; currency default INR; Decimal(14,2).",
    example: "balance=1500.00 INR linked to student@ellowring.com",
  },
  WalletLedger: {
    purpose: "Immutable wallet movement ledger.",
    business: "Insert-only. CREDIT/DEBIT/HOLD/RELEASE. Reference paymentId/orderId in metadata for reconciliation.",
    validation: "walletId FK; amount > 0; type WalletLedgerType; balanceAfter computed.",
    example: "type=CREDIT, amount=500.00, reference=PAY_…",
  },
  Coupon: {
    purpose: "Discount coupons for courses, coaching, or plans.",
    business: "Enforce maxRedemptions, validFrom/validTo, and percent vs fixed amount exclusivity in services.",
    validation: "code unique uppercase; either percentOff (0–100) or amountOff ≥ 0; dates coherent.",
    example: "code=WELCOME100, amountOff=100.00, maxRedemptions=1000",
  },
  CouponRedemption: {
    purpose: "Records a user’s successful coupon use.",
    business: "One redemption per user per coupon unless policy allows repeats. Increment coupon.redeemedCount atomically.",
    validation: "composite unique (couponId, userId) when single-use; FKs required.",
    example: "user=student@…, coupon=WELCOME100, orderRef=ORD_…",
  },
  Certificate: {
    purpose: "General achievement/completion certificates issued to students.",
    business: "certificateNo unique for verification portal. Soft-delete hides from public verify.",
    validation: "studentId FK; certificateNo unique; issuedAt required.",
    example: "certificateNo=ELW-CERT-2026-00042, title=Full Stack Internship",
  },
  Bookmark: {
    purpose: "Polymorphic bookmarks (jobs, courses, colleges, …).",
    business: "entityType+entityId pattern; app validates entity exists. Unique per user+entity.",
    validation: "userId FK; entityType/entityId required; composite unique.",
    example: "entityType=JOB, entityId=…",
  },
  Favorite: {
    purpose: "Polymorphic favorites distinct from bookmarks (UI emphasis).",
    business: "Same polymorphic rules as bookmarks; keep separate for product analytics.",
    validation: "userId FK; entityType/entityId; composite unique.",
    example: "entityType=COURSE, entityId=…",
  },
  CoachingCategory: {
    purpose: "Top-level coaching taxonomy (NEET, JEE, Competitive).",
    business: "Catalogue entity; soft-delete hides from browse but keeps enrollments.",
    validation: "slug unique; name required; sortOrder ≥ 0.",
    example: "name=NEET, slug=neet",
  },
  CoachingProgram: {
    purpose: "Sellable coaching program under a category (optionally owned by training partner).",
    business: "Published flag controls storefront. Price Decimal. Enrollments require isPublished or admin override.",
    validation: "categoryId FK; slug unique; price ≥ 0.",
    example: "NEET 2027 Crash Course, price=14999.00",
  },
  CoachingEnrollment: {
    purpose: "Student enrollment in a coaching program.",
    business: "Unique (studentId, programId). Progress 0–100. Status ACTIVE/COMPLETED/CANCELLED.",
    validation: "FKs required; progress 0–100.",
    example: "student@… enrolled in NEET Crash, progress=12",
  },
  Subject: {
    purpose: "Subject within a coaching program (Physics, Chemistry, …).",
    business: "Ordered by sortOrder. Cascades to chapters.",
    validation: "programId FK; name required.",
    example: "Physics under NEET program",
  },
  Chapter: {
    purpose: "Chapter within a subject.",
    business: "Curriculum hierarchy node; unlock rules may depend on prior chapter completion (app).",
    validation: "subjectId FK; sortOrder ≥ 0.",
    example: "Laws of Motion, sortOrder=3",
  },
  Lesson: {
    purpose: "Lesson content unit under a chapter.",
    business: "May link video URL or rich content. DurationMinutes for planning.",
    validation: "chapterId FK; title required.",
    example: "Newton’s Third Law — 25 minutes",
  },
  Topic: {
    purpose: "Fine-grained topic tags inside lessons for question mapping.",
    business: "Used by question banks for adaptive practice.",
    validation: "lessonId FK; name required.",
    example: "Action-Reaction pairs",
  },
  QuestionBank: {
    purpose: "Container for practice/exam questions (by exam/board).",
    business: "Owned by program or platform. Soft-delete archives bank.",
    validation: "name/slug required; programId optional FK.",
    example: "NEET Biology 2025 PYQ Bank",
  },
  MockTest: {
    purpose: "Timed mock examination definition.",
    business: "durationMinutes and totalMarks authoritative for scoring. Publish before attempts allowed.",
    validation: "durationMinutes > 0; totalMarks > 0; programId/bank optional.",
    example: "NEET Full Syllabus Mock #4, 180 min, 720 marks",
  },
  Question: {
    purpose: "Assessment question (MCQ or other).",
    business: "Correctness derived via QuestionOption.isCorrect or answerKey for subjectives. Difficulty guides adaptive picks.",
    validation: "bankId FK; stem required; marks > 0.",
    example: "MCQ Physics, marks=4, difficulty=MEDIUM",
  },
  QuestionOption: {
    purpose: "MCQ options for a question.",
    business: "Exactly one isCorrect=true for single-answer MCQs (enforce in service).",
    validation: "questionId FK; label/text required; sortOrder ≥ 0.",
    example: "A/B/C/D options with one correct",
  },
  StudentAnswer: {
    purpose: "Immutable student response to a question in a mock attempt.",
    business: "Insert-mostly; scoring updates isCorrect/marksAwarded. Do not delete scored answers.",
    validation: "studentId, questionId, mockResultId FKs; marksAwarded ≥ 0.",
    example: "selectedOptionId=…, isCorrect=true, marksAwarded=4",
  },
  MockResult: {
    purpose: "Aggregate score for a student’s mock attempt.",
    business: "One result per attempt. Leaderboard derived from score/percentile.",
    validation: "studentId + mockTestId FKs; score ≥ 0; percentage 0–100.",
    example: "score=612/720, percentage=85, percentile=92",
  },
  LeaderboardEntry: {
    purpose: "Ranked leaderboard snapshot for a mock or program.",
    business: "Rebuild periodically; unique (mockTestId, studentId) for current board.",
    validation: "rank ≥ 1; score ≥ 0.",
    example: "rank=1, score=680, student=…",
  },
  School: {
    purpose: "School catalogue for Class 11–12 sourcing and profiles.",
    business: "Reference data; soft-delete hides from search.",
    validation: "name required; board/city/state optional.",
    example: "Delhi Public School, RK Puram, CBSE",
  },
  University: {
    purpose: "Domestic university master records.",
    business: "Parent of colleges when applicable; rankings may reference university or college.",
    validation: "name required; code unique when present.",
    example: "Savirtibai Phule Pune University",
  },
  College: {
    purpose: "College catalogue for admissions discovery.",
    business: "Distinct from CollegeProfile (tenant login). verified flag for trust.",
    validation: "name required; universityId optional FK.",
    example: "COEP Technological University, Pune",
  },
  CollegeProfile: {
    purpose: "Authenticated college-tenant profile (1:1 User role=COLLEGE).",
    business: "Links User to a College catalogue row they manage.",
    validation: "userId unique; collegeId FK required.",
    example: "college@ellowring.com manages COEP profile",
  },
  Department: {
    purpose: "Academic departments inside a college.",
    business: "Owns CollegeCourse offerings.",
    validation: "collegeId FK; name required; code unique per college preferred.",
    example: "Computer Engineering",
  },
  CollegeCourse: {
    purpose: "Admission programme offered by a college/department (B.Tech CSE, …).",
    business: "seats and eligibility drive CollegeApplication capacity checks.",
    validation: "collegeId FK; name/slug; durationYears > 0; seats ≥ 0.",
    example: "B.Tech Computer Science, seats=120, fees=150000",
  },
  CollegeRanking: {
    purpose: "Published ranking entries (NIRF etc.).",
    business: "year + source define uniqueness with college/university.",
    validation: "rank ≥ 1; year four-digit.",
    example: "NIRF 2025 Engineering rank=45",
  },
  CollegeReview: {
    purpose: "Student/alumni reviews of colleges.",
    business: "Moderation via isPublished. Rating 1–5.",
    validation: "collegeId FK; rating 1–5; body length limits in app.",
    example: "rating=4, title=Strong placement cell",
  },
  CollegeApplication: {
    purpose: "Student application to a college course.",
    business: "Status machine: DRAFT→SUBMITTED→…→ACCEPTED/REJECTED/WITHDRAWN. Unique open application per student+course.",
    validation: "student User or Student FK + collegeCourseId; status AdmissionStatus.",
    example: "status=UNDER_REVIEW for B.Tech CSE at COEP",
  },
  Scholarship: {
    purpose: "Scholarship catalogue and eligibility summary.",
    business: "Linked to college or platform-wide. amount Decimal.",
    validation: "title required; amount ≥ 0; dates coherent.",
    example: "Merit Scholarship 50000 INR, deadline=2026-06-30",
  },
  Country: {
    purpose: "Study-abroad country reference.",
    business: "ISO country codes preferred (iso2/iso3).",
    validation: "name/iso unique; currency code optional.",
    example: "United States, US, USD",
  },
  AbroadUniversity: {
    purpose: "International university catalogue.",
    business: "Scoped under Country. Soft-delete archives listings.",
    validation: "countryId FK; name required.",
    example: "University of Toronto, Canada",
  },
  AbroadProgram: {
    purpose: "International degree/program offering.",
    business: "tuitionFee Decimal; intake seasons in metadata/fields.",
    validation: "universityId FK; name required; tuition ≥ 0.",
    example: "MSc Computer Science, tuition=45000 CAD",
  },
  EligibilityRule: {
    purpose: "Eligibility criteria for an abroad program.",
    business: "Evaluated by guidance/admissions services before submit.",
    validation: "programId FK; ruleType + expression/value required.",
    example: "IELTS >= 6.5 overall",
  },
  VisaRequirement: {
    purpose: "Visa checklist items for a country/program path.",
    business: "Displayed in application document checklist.",
    validation: "countryId FK; title required.",
    example: "Proof of funds, valid passport > 6 months",
  },
  AbroadApplication: {
    purpose: "Student study-abroad application case.",
    business: "Status AbroadApplicationStatus state machine. Documents attach via AbroadDocument.",
    validation: "userId + programId FKs; status enum.",
    example: "status=DOCUMENTS_PENDING for UofT MSc",
  },
  AbroadDocument: {
    purpose: "Uploaded documents for an abroad application.",
    business: "status PENDING/APPROVED/REJECTED by counselor. Store fileUrl in object storage.",
    validation: "applicationId FK; docType + fileUrl required.",
    example: "docType=TRANSCRIPT, status=APPROVED",
  },
  CourseCategory: {
    purpose: "Learning course taxonomy.",
    business: "Catalogue; soft-delete hides category.",
    validation: "slug unique.",
    example: "Full Stack Development, slug=full-stack",
  },
  Course: {
    purpose: "Sellable/publishable learning course (LMS).",
    business: "May be owned by TrainingCenter. isPublished controls storefront. Distinct from CollegeCourse.",
    validation: "slug unique; price ≥ 0; categoryId FK optional.",
    example: "React + Nest Bootcamp, price=7999",
  },
  CourseModule: {
    purpose: "Module section within a course.",
    business: "Ordered modules gate lesson unlocks optionally.",
    validation: "courseId FK; sortOrder ≥ 0.",
    example: "Module 1 — TypeScript Fundamentals",
  },
  CourseLesson: {
    purpose: "Lesson within a course module.",
    business: "May have videos, assignments, assessments.",
    validation: "moduleId FK; title required.",
    example: "Generics & Utility Types",
  },
  CourseVideo: {
    purpose: "Video asset metadata for a lesson.",
    business: "Store CDN URL; durationSeconds for progress calc.",
    validation: "lessonId FK; url required; duration ≥ 0.",
    example: "url=https://cdn…/lesson1.mp4, duration=720",
  },
  Assignment: {
    purpose: "Course assignment definition.",
    business: "Due dates optional; submissions tracked in app layer / project module as needed.",
    validation: "courseId/lessonId FK; title required.",
    example: "Build a REST API with NestJS",
  },
  Assessment: {
    purpose: "Course quiz/assessment definition.",
    business: "Distinct from coaching MockTest; course-scoped grading.",
    validation: "courseId FK; passPercent 0–100.",
    example: "Module 2 Quiz, passPercent=70",
  },
  CourseCertificate: {
    purpose: "Certificate issued on course completion.",
    business: "Generate after enrollment progress=100 and assessments passed.",
    validation: "enrollmentId/user unique constraints as designed; certificateNo unique.",
    example: "ELW-COURSE-2026-00118",
  },
  CourseDownload: {
    purpose: "Downloadable resources attached to a course/lesson.",
    business: "Access gated by enrollment entitlement.",
    validation: "courseId FK; fileUrl required.",
    example: "Cheat sheet PDF for SQL joins",
  },
  CourseEnrollment: {
    purpose: "Student enrollment and progress in a learning course.",
    business: "Unique (studentId, courseId). progress 0–100. Payment may gate ACTIVE status.",
    validation: "FKs required; progress 0–100.",
    example: "student@… in React Bootcamp, progress=40, status=ACTIVE",
  },
  Company: {
    purpose: "Employer/organization tenant posting jobs, internships, projects.",
    business: "1:1 with User when role=COMPANY. verified required before high-trust actions (offers/payroll).",
    validation: "userId unique; name required.",
    example: "Ellowring Labs Pvt Ltd, industry=IT, city=Bengaluru",
  },
  Internship: {
    purpose: "Internship opening posted by a company.",
    business: "stipend Decimal; workMode/EmploymentType enums; applications close after deadline.",
    validation: "companyId FK; title required; seats ≥ 1 when limited.",
    example: "Backend Intern, stipend=15000, HYBRID, 3 months",
  },
  InternshipApplication: {
    purpose: "Student application to an internship.",
    business: "ApplicationStatus state machine. Unique (student/user, internshipId).",
    validation: "FKs required; status enum.",
    example: "status=SHORTLISTED",
  },
  InternshipOffer: {
    purpose: "Offer letter lifecycle for internship.",
    business: "InternshipOfferStatus: PENDING→ACCEPTED/DECLINED/EXPIRED/REVOKED.",
    validation: "applicationId unique/FK; stipend ≥ 0; expiresAt > offeredAt.",
    example: "status=PENDING, expiresAt=+7d",
  },
  InternshipProgress: {
    purpose: "Milestone tracking during active internship.",
    business: "Updated by mentor/HR; percent 0–100.",
    validation: "internship/application FK; percentComplete 0–100.",
    example: "percentComplete=50, milestone=Mid-term demo",
  },
  Mentor: {
    purpose: "Mentor profiles associated with company/programs.",
    business: "May advise internships and projects.",
    validation: "companyId FK optional; email unique when present.",
    example: "name=Rahul Mehta, title=Staff Engineer",
  },
  InternshipFeedback: {
    purpose: "Feedback from mentor/HR on intern performance.",
    business: "Rating 1–5; visible to student after publish.",
    validation: "applicationId FK; rating 1–5.",
    example: "rating=5, comment=Strong ownership",
  },
  ProjectCategory: {
    purpose: "Live-project taxonomy.",
    business: "Catalogue soft-delete.",
    validation: "slug unique.",
    example: "slug=saas-mvp",
  },
  Project: {
    purpose: "Company live project for student teams.",
    business: "Budget/reward Decimal; team capacity enforced via ProjectTeamMember count.",
    validation: "companyId FK; title required.",
    example: "Build Analytics Dashboard, reward=25000",
  },
  ProjectTechnology: {
    purpose: "Tech tags required/used by a project.",
    business: "Inform skill matching.",
    validation: "projectId FK; name required; unique per project.",
    example: "Next.js, PostgreSQL, Prisma",
  },
  ProjectTeamMember: {
    purpose: "Students assigned to a project team.",
    business: "Unique (projectId, studentId); role LEAD/MEMBER.",
    validation: "FKs required.",
    example: "role=LEAD for student@…",
  },
  ProjectSubmission: {
    purpose: "Team deliverable submission for evaluation.",
    business: "Versioned submissions allowed; latest flagged in app.",
    validation: "projectId FK; repoUrl or artifactUrl required.",
    example: "repoUrl=github.com/…, submittedAt=now",
  },
  ProjectEvaluation: {
    purpose: "Scoring and feedback for a submission.",
    business: "score 0–100; evaluator is mentor/HR user.",
    validation: "submissionId FK; score 0–100.",
    example: "score=88, feedback=Solid architecture",
  },
  HrUser: {
    purpose: "HR user profile under a company (hiring ops).",
    business: "Multiple HR users per company; tied to User account.",
    validation: "userId unique; companyId FK.",
    example: "hr@ellowring.com for Ellowring Labs",
  },
  Job: {
    purpose: "Full-time/part-time job opening.",
    business: "salaryMin/Max Decimal; EmploymentType + WorkMode; close applications after expiresAt.",
    validation: "companyId FK; title required; salaryMin ≤ salaryMax when both set.",
    example: "Junior Backend Engineer, 6–10 LPA, HYBRID",
  },
  JobApplication: {
    purpose: "Candidate application to a job.",
    business: "ApplicationStatus machine; unique per user+job.",
    validation: "FKs; status enum.",
    example: "status=INTERVIEW",
  },
  SavedJob: {
    purpose: "User-saved jobs for later apply.",
    business: "Composite unique (userId, jobId).",
    validation: "FKs required.",
    example: "student@… saved Junior Backend Engineer",
  },
  Interview: {
    purpose: "Interview rounds scheduled against a job application.",
    business: "Multiple rounds allowed; store mode VIDEO/ONSITE; feedback after completion.",
    validation: "applicationId FK; scheduledAt required.",
    example: "round=TECHNICAL, scheduledAt=2026-04-10T10:00Z",
  },
  JobOffer: {
    purpose: "Employment offer for a job application.",
    business: "JobOfferStatus state machine; CTC Decimal; acceptance creates Employee optionally.",
    validation: "applicationId FK; ctc ≥ 0; status enum.",
    example: "ctc=900000, status=PENDING",
  },
  Employee: {
    purpose: "Hired employee record under a company (post-offer).",
    business: "Links user/candidate to payroll. employeeCode unique per company.",
    validation: "companyId FK; joiningDate required; salary Decimal ≥ 0.",
    example: "employeeCode=ELW-E-0042, salary=75000 monthly",
  },
  PayrollRun: {
    purpose: "Monthly/period payroll batch for a company.",
    business: "Immutable once status=PROCESSED. Contains PayrollItems.",
    validation: "companyId FK; periodStart < periodEnd.",
    example: "Aug 2026 payroll, status=DRAFT",
  },
  PayrollItem: {
    purpose: "Per-employee line in a payroll run.",
    business: "gross/net Decimal; deductions breakdown in JSON metadata.",
    validation: "payrollRunId + employeeId FKs; amounts ≥ 0; net ≤ gross.",
    example: "gross=75000, net=68000",
  },
  TrainingCenter: {
    purpose: "Training partner organisation (role=TRAINING user).",
    business: "Owns programs, batches, trainers, courses. verified for payouts.",
    validation: "userId unique; name required.",
    example: "training@ellowring.com → Ellowring Skill Hub Pune",
  },
  Trainer: {
    purpose: "Trainer staff under a training center.",
    business: "Assigned to batches/programs.",
    validation: "centerId FK; email unique when set.",
    example: "name=Priya Nair, specialty=Data Science",
  },
  TrainingProgram: {
    purpose: "Training programme catalogue at a center.",
    business: "Fee Decimal; duration; linked batches.",
    validation: "centerId FK; title required; fee ≥ 0.",
    example: "Full Stack 16-week Intensive, fee=45000",
  },
  TrainingBatch: {
    purpose: "Scheduled cohort for a training program.",
    business: "capacity limits enrollments; start/end dates required.",
    validation: "programId FK; capacity > 0; startDate < endDate.",
    example: "Batch FS-2026-A, capacity=40",
  },
  AttendanceRecord: {
    purpose: "Student attendance for a batch session day.",
    business: "Unique (batchId, studentId, sessionDate). PRESENT/ABSENT/LATE.",
    validation: "FKs; sessionDate required.",
    example: "status=PRESENT, sessionDate=2026-02-01",
  },
  TrainingAssignment: {
    purpose: "Assignments issued to a training batch.",
    business: "Due dates; submissions tracked in app or linked project submissions.",
    validation: "batchId FK; title required.",
    example: "Capstone proposal due=+14d",
  },
  TrainingRevenue: {
    purpose: "Revenue recognition entries for training center.",
    business: "Reconcile with Payments. amount Decimal; period tagged.",
    validation: "centerId FK; amount ≥ 0.",
    example: "amount=180000 for Batch FS-2026-A fees",
  },
  Partner: {
    purpose: "Channel partner tenant (role=PARTNER).",
    business: "referralCode unique drives attribution. commissionPct default policy.",
    validation: "userId unique; referralCode unique; commissionPct 0–100.",
    example: "partner@ellowring.com, referralCode=ELW-PARTNER-01, commissionPct=10",
  },
  PartnerLead: {
    purpose: "Leads captured by channel partners.",
    business: "Status pipeline NEW→CONTACTED→CONVERTED/LOST.",
    validation: "partnerId FK; contact email/phone required.",
    example: "lead email=prospect@…, status=NEW",
  },
  Referral: {
    purpose: "Attributed referral from partner code to registered user/payment.",
    business: "Triggers Commission when conversion qualifies.",
    validation: "partnerId FK; referredUserId optional unique.",
    example: "referredUser=student2@…, converted=true",
  },
  PartnerWallet: {
    purpose: "Partner earnings wallet.",
    business: "Balance updated only with commission/payout transactions in app services.",
    validation: "partnerId unique; balance ≥ 0; Decimal(14,2).",
    example: "balance=12500.00 INR",
  },
  Commission: {
    purpose: "Commission accrual for partner referrals.",
    business: "CommissionStatus PENDING→APPROVED→PAID/CANCELLED. amount Decimal.",
    validation: "partnerId FK; amount > 0; status enum.",
    example: "amount=799.90, status=PENDING, referralId=…",
  },
  Payout: {
    purpose: "Partner payout settlement records.",
    business: "PayoutStatus PENDING→PROCESSING→PAID/FAILED. Links optional commission.",
    validation: "partnerId FK; amount > 0.",
    example: "amount=10000, status=PAID, reference=UTR…",
  },
  PartnerReport: {
    purpose: "Generated partner performance report snapshots.",
    business: "data JSON stores metrics; immutable after generate.",
    validation: "partnerId FK; periodStart < periodEnd.",
    example: "reportType=MONTHLY, Aug 2026 metrics JSON",
  },
  Setting: {
    purpose: "Flat key/value platform settings.",
    business: "Admin-editable; cache in Redis; audit changes.",
    validation: "key unique; value string.",
    example: "key=support.email, value=support@ellowring.com",
  },
  Configuration: {
    purpose: "Namespaced JSON configuration (feature flags, limits).",
    business: "Unique (namespace, key). Prefer over Settings for structured config.",
    validation: "namespace+key unique; value JSON.",
    example: "namespace=features, key=studyAbroad.enabled, value=true",
  },
  Report: {
    purpose: "Admin-generated operational reports metadata.",
    business: "fileUrl points to stored artifact; parameters JSON.",
    validation: "title/reportType required.",
    example: "reportType=PAYMENTS_DAILY, generatedAt=today",
  },
  AnalyticsSnapshot: {
    purpose: "Point-in-time analytics metric capture.",
    business: "Insert-mostly time series for dashboards; partition by capturedAt when large.",
    validation: "metricKey required; metricValue Decimal.",
    example: "metricKey=dau.students, metricValue=1820",
  },
  Announcement: {
    purpose: "Platform announcements targeted by role.",
    business: "Publish window startsAt/endsAt; soft-delete.",
    validation: "title/content required; targetRole optional Role.",
    example: "title=Mock Test Weekend, targetRole=STUDENT",
  },
  Banner: {
    purpose: "Marketing/home banners.",
    business: "sortOrder + isActive control display; schedule window optional.",
    validation: "imageUrl required; sortOrder ≥ 0.",
    example: "Hero banner — Learn. Prepare. Build. Get Hired.",
  },
  CmsPage: {
    purpose: "CMS pages (About, Terms, Privacy, …).",
    business: "slug unique; isPublished gate; soft-delete.",
    validation: "slug unique kebab-case; title/content required.",
    example: "slug=terms-of-service",
  },
  SupportTicket: {
    purpose: "Customer support tickets.",
    business: "TicketStatus/Priority enums; assignee optional Admin user.",
    validation: "userId FK; subject/description required; status/priority enums.",
    example: "status=OPEN, priority=HIGH, subject=Payment not reflected",
  },
  PremiumPlan: {
    purpose: "Subscription plan catalogue.",
    business: "price Decimal; billingCycle MONTHLY/YEARLY; features JSON.",
    validation: "name/slug unique; price ≥ 0; isActive flag.",
    example: "Pro Plan, 499 INR/month",
  },
  Subscription: {
    purpose: "User subscription to a premium plan.",
    business: "SubscriptionStatus TRIAL/ACTIVE/PAUSED/CANCELLED/EXPIRED. End dating mandatory on cancel.",
    validation: "userId+planId FKs; status enum; dates coherent.",
    example: "user=student@…, plan=Pro, status=ACTIVE",
  },
  Payment: {
    purpose: "Payment intent/capture record (Razorpay etc.).",
    business: "PaymentStatus machine; reference unique for idempotency. Never delete SUCCESS rows.",
    validation: "userId FK; amount > 0; currency INR default; status enum.",
    example: "amount=7999.00, status=SUCCESS, provider=RAZORPAY, reference=pay_…",
  },
  Invoice: {
    purpose: "Tax invoice issued for a payment/subscription.",
    business: "invoiceNo unique legal identifier; totals = amount + tax.",
    validation: "invoiceNo unique; totalAmount = amount + taxAmount; status InvoiceStatus.",
    example: "invoiceNo=ELW-INV-2026-00088, totalAmount=9438.82",
  },
  Transaction: {
    purpose: "Low-level payment provider transaction legs.",
    business: "Insert-mostly; links to Payment; type CREDIT/DEBIT/REFUND/ADJUSTMENT.",
    validation: "paymentId FK; amount > 0; type/status enums.",
    example: "type=CREDIT, status=SUCCESS, providerRef=txn_…",
  },
  Refund: {
    purpose: "Refund requests against a payment.",
    business: "amount ≤ original payment captured amount sum of prior refunds. Status PaymentStatus-like.",
    validation: "paymentId FK; amount > 0; ≤ net paid.",
    example: "amount=1000.00, reason=Duplicate charge, status=SUCCESS",
  },
  Notification: {
    purpose: "In-app (and multi-channel) notification inbox items.",
    business: "isRead + readAt; channel NotificationChannel. High volume — index userId+createdAt.",
    validation: "userId FK; title/message required; type enum.",
    example: "type=SUCCESS, title=Application Shortlisted",
  },
  EmailLog: {
    purpose: "Outbound email delivery log.",
    business: "Insert-only operational log; retention policy applies; PII minimization.",
    validation: "toEmail required; status QUEUED/SENT/FAILED.",
    example: "to=student@…, template=welcome, status=SENT",
  },
  SmsLog: {
    purpose: "Outbound SMS delivery log.",
    business: "Insert-only; purge on retention schedule.",
    validation: "phone required; status QUEUED/SENT/FAILED.",
    example: "phone=+91…, status=SENT",
  },
  PushNotification: {
    purpose: "Push notification dispatch log.",
    business: "deviceToken optional; providerRef for FCM/APNs.",
    validation: "userId FK; title/body required.",
    example: "title=Interview Reminder, status=SENT",
  },
  WhatsappLog: {
    purpose: "WhatsApp Business API message log.",
    business: "template-based messages preferred for compliance.",
    validation: "phone required; status QUEUED/SENT/FAILED.",
    example: "template=otp_login, status=SENT",
  },
};

function parseModels(schema) {
  const models = {};
  const re = /^model (\w+) \{([\s\S]*?)^\}/gm;
  let m;
  while ((m = re.exec(schema))) {
    const name = m[1];
    const body = m[2];
    const fields = [];
    const indexes = [];
    const uniques = [];
    let mapName = null;
    for (const raw of body.split("\n")) {
      const line = raw.trim();
      if (!line || line.startsWith("//")) continue;
      if (line.startsWith("@@map(")) {
        mapName = line.match(/@@map\("([^"]+)"\)/)?.[1] || null;
        continue;
      }
      if (line.startsWith("@@index(")) {
        indexes.push(line.replace(/^@@index/, "INDEX").replace(/\s+/g, " "));
        continue;
      }
      if (line.startsWith("@@unique(")) {
        uniques.push(line.replace(/^@@unique/, "UNIQUE").replace(/\s+/g, " "));
        continue;
      }
      if (line.startsWith("@@")) continue;
      const fm = line.match(/^(\w+)\s+(.+)$/);
      if (!fm) continue;
      const field = fm[1];
      const rest = fm[2];
      if (rest.includes("@relation")) {
        fields.push({ field, type: rest.split(/\s+/)[0], note: "Relation", isRelation: true });
      } else {
        const type = rest.split(/\s+/)[0];
        const notes = [];
        if (rest.includes("@id")) notes.push("PK");
        if (rest.includes("@unique")) notes.push("UNIQUE");
        if (rest.includes("@default")) notes.push("DEFAULT");
        if (rest.includes("@updatedAt")) notes.push("AUTO-UPDATE");
        if (type.endsWith("?")) notes.push("NULLABLE");
        if (rest.includes("@db.Decimal")) notes.push(rest.match(/@db\.Decimal\([^)]+\)/)?.[0] || "Decimal");
        fields.push({ field, type, note: notes.join(", ") || "—", isRelation: false });
      }
    }
    models[name] = { name, mapName: mapName || toSnake(name), fields, indexes, uniques };
  }
  return models;
}

function toSnake(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .toLowerCase() + (name.endsWith("s") || name.endsWith("Status") ? "" : "");
}

function renderTable(model) {
  const meta = TABLE_META[model.name] || {
    purpose: `${model.name} domain entity for Ellowring platform operations.`,
    business: "Follow platform soft-delete, audit, and Decimal money standards. Enforce status transitions in application services.",
    validation: "Required FKs must exist; enum fields restricted to Prisma enums; non-negative monetary amounts.",
    example: `See seed strategy for sample ${model.name} rows (*@ellowring.com).`,
  };
  const cols = model.fields
    .map((f) => `| ${f.field} | ${f.type} | ${f.note} |`)
    .join("\n");
  const idx =
    model.indexes.length > 0
      ? model.indexes.map((i) => `- \`${i}\``).join("\n")
      : "- Primary key index on `id` (and `@unique` columns as declared).";
  const uq =
    model.uniques.length > 0
      ? model.uniques.map((u) => `- \`${u}\``).join("\n")
      : "- Column-level `@unique` constraints where marked UNIQUE above.";
  const relFields = model.fields.filter((f) => f.isRelation).map((f) => `\`${f.field}\``);
  const rel =
    relFields.length > 0
      ? `Prisma relations: ${relFields.join(", ")}. Enforced as PostgreSQL foreign keys per schema.`
      : "No relation fields (reference/lookup or join-owned elsewhere).";

  return `#### Table \`${model.mapName}\` (Prisma: \`${model.name}\`)

**Purpose:** ${meta.purpose}

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
${cols}

**Indexes**

${idx}

**Unique Keys**

${uq}

**Relationships:** ${rel}

**Business Rules:** ${meta.business}

**Validation Rules:** ${meta.validation}

**Example Data:** ${meta.example}
`;
}

function buildAppendix(models) {
  const listed = new Set();
  let out = `## Appendix A — Complete Table Catalogue

Each table below is implementable as defined in \`backend/prisma/phase4/schema.prisma\`. Column lists mirror Prisma fields. Companion seed guidance: \`backend/prisma/phase4/SEED_STRATEGY.md\`.

`;
  for (const [mod, names] of MODULE_ORDER) {
    out += `### Module: ${mod}\n\n`;
    for (const n of names) {
      if (!models[n]) {
        console.warn("Missing model", n);
        continue;
      }
      listed.add(n);
      out += renderTable(models[n]) + "\n";
    }
  }
  const missing = Object.keys(models).filter((n) => !listed.has(n));
  if (missing.length) {
    out += `### Module: Additional\n\n`;
    for (const n of missing) out += renderTable(models[n]) + "\n";
  }
  out += `\n*End of Appendix A — ${listed.size} tables documented.*\n`;
  return out;
}

function main() {
  const schema = fs.readFileSync(SCHEMA, "utf8");
  const models = parseModels(schema);
  const appendix = buildAppendix(models);

  let doc = fs.readFileSync(DOC, "utf8");

  // Remove existing Appendix A block (wherever it sits)
  doc = doc.replace(/\n## Appendix A[\s\S]*?(?=\n## Appendix B|\n## Appendix C|\n## Related Documents|\n# Appendix|\n\*End of Appendix A[\s\S]*?\n)/, "\n");
  doc = doc.replace(/\n## Appendix A[\s\S]*?\*End of Appendix A[^\n]*\n?/g, "\n");
  // Also remove old "End of narrative... Appendix A" trailing block if present after Related Documents
  doc = doc.replace(/\n---\n\n\*End of narrative chapters\.[\s\S]*$/m, "\n");

  // Insert Appendix A before Appendix B
  if (doc.includes("\n# Appendix B") || doc.includes("\n## Appendix B")) {
    doc = doc.replace(/\n(#+\sAppendix B)/, `\n${appendix}\n---\n\n$1`);
  } else {
    doc += "\n\n" + appendix;
  }

  // Version bump note
  doc = doc.replace(
    "| 1.0 | Aug 2026 | Ellowring Architecture | Initial Phase-4 database design — implementable without further requirement gathering |",
    "| 1.0 | Aug 2026 | Ellowring Architecture | Initial Phase-4 database design — implementable without further requirement gathering |\n| 1.1 | Aug 2026 | Ellowring Architecture | Regenerated Appendix A from Prisma (122 models) with table-specific rules; encoding cleanup |"
  );
  doc = doc.replace("Version | 1.0 (Phase 4)", "Version | 1.1 (Phase 4)");

  fs.writeFileSync(DOC, doc, "utf8");
  console.log("Models:", Object.keys(models).length);
  console.log("Wrote Appendix A into", DOC);
  console.log("Doc chars:", doc.length);
}

main();
