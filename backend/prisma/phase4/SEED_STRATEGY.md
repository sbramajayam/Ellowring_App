# Ellowring Phase-4 Seed Strategy

Demo credentials for all role accounts: **`password123`** (bcrypt-hashed in seed).

Email pattern: `{role}@ellowring.com` (plus module-specific aliases below).

## Seed order (respect FK dependencies)

Run seeds in this sequence so foreign keys resolve cleanly.

### 1. Platform spine (no user FK)

1. **Permissions** — module slugs (`auth.*`, `student.*`, `coaching.*`, …)
2. **RbacRoles** — `super-admin`, `content-manager`, `support-agent`
3. **RbacRolePermissions** — map roles → permissions
4. **Settings** / **Configurations** — app keys, feature flags
5. **PremiumPlans** — Free, Pro, Enterprise tiers

### 2. Reference catalog (no users)

6. **Skills**, **CoachingCategories**, **CourseCategories**, **ProjectCategories**
7. **Countries** → **AbroadUniversities** → **AbroadPrograms** → **EligibilityRules**, **VisaRequirements**
8. **Universities** → **Colleges** → **Departments** → **CollegeCourses**
9. **Schools**, **CollegeRankings**, **Scholarships**
10. **CoachingPrograms** → **Subjects** → **Chapters** → **Lessons** → **Topics**
11. **QuestionBanks** → **Questions** → **QuestionOptions**, **MockTests**
12. **Coupons** (platform-wide)

### 3. Users & role profiles (core demo accounts)

Hash password once, then create **Users** with matching **Role** enum:

| Email | Role | Profile model |
|---|---|---|
| `admin@ellowring.com` | ADMIN | — (+ **UserRbacRole** → super-admin) |
| `student@ellowring.com` | STUDENT | **Student** + **Wallet** |
| `student2@ellowring.com` | STUDENT | **Student** (secondary, for applications/tests) |
| `college@ellowring.com` | COLLEGE | **CollegeProfile** (linked to a seeded **College**) |
| `company@ellowring.com` | COMPANY | **Company** |
| `hr@ellowring.com` | COMPANY | **HrUser** (same **Company** as company user) |
| `training@ellowring.com` | TRAINING | **TrainingCenter** |
| `partner@ellowring.com` | PARTNER | **Partner** + **PartnerWallet** |

### 4. User-scoped & org-scoped data

13. **Student** extras — **Parents**, **EducationHistory**, **CareerInterests**, **StudentSkills**, **Achievements**
14. **TrainingCenter** → **Trainers** → **TrainingPrograms** → **TrainingBatches**
15. **Company** → **Jobs**, **Internships**, **Projects**, **Mentors**, **Employees**
16. **Courses** (owned by training center) → modules, lessons, videos, assignments
17. **Partner** → **PartnerLeads**, **Referrals**

### 5. Transactions & engagement

18. **CourseEnrollment**, **CoachingEnrollment** (student accounts)
19. **CollegeApplications**, **AbroadApplications** + **AbroadDocuments**
20. **InternshipApplications**, **JobApplications**, **SavedJobs**
21. **MockResults**, **LeaderboardEntries**, **StudentAnswers**
22. **Payments** → **Invoices** → **Transactions**; sample **Subscriptions**
23. **Notifications**, sample **EmailLog** / **SmsLog** rows
24. **Announcements**, **Banners**, **CmsPages**
25. **AnalyticsSnapshots**, **SupportTickets** (student → admin assignee)

## Demo login quick reference

```
admin@ellowring.com      / password123   → Admin dashboard
student@ellowring.com    / password123   → Student hub
college@ellowring.com    / password123   → College admissions portal
company@ellowring.com    / password123   → Company jobs/internships/projects
hr@ellowring.com         / password123   → HR hiring & payroll
training@ellowring.com   / password123   → Training center LMS
partner@ellowring.com    / password123   → Partner referrals & commissions
```

## Commands (after swapping schema)

```bash
# Point DATABASE_URL to PostgreSQL, copy phase4/schema.prisma → prisma/schema.prisma
npx prisma migrate dev --name phase4_init
npx prisma db seed
```

## Notes

- Seed **Permissions** and **RbacRoles** before assigning **UserRbacRole** to `admin@ellowring.com`.
- Create **Company** before **HrUser**, **Job**, **Internship**, and **Project** rows.
- Use deterministic `cuid()` overrides or fixed IDs in seed for cross-referencing in E2E tests.
- Keep wallet balances and payment amounts as `Decimal` strings in seed (`"999.00"`) to match `@db.Decimal(14, 2)`.
