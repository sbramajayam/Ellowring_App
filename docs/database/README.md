# Ellowring Database Design Pack

**Product:** Ellowring (Ellowring Software Solutions)  
**Stack:** PostgreSQL 16 · Prisma ORM · Redis 7  
**Status:** Phase-4 implementable (Version 1.1)

This pack is the **system-of-record design** for Authentication, Career Guidance, NEET/JEE/Competitive Coaching, College Admissions, Study Abroad, Courses, Internships, Projects, Jobs, Payroll, Wallet, Payments, Certificates, Notifications, Reports, and Analytics across Student, College, HR/Company, Training, Channel Partner, and Admin roles.

## Artefacts

| Artefact | Path | Description |
|---|---|---|
| Enterprise design document (27 sections + catalogues) | [`../Ellowring_Database_Design.md`](../Ellowring_Database_Design.md) | Standards, strategies, ER diagrams, 122 table specs |
| PostgreSQL Prisma schema | [`../../backend/prisma/phase4/schema.prisma`](../../backend/prisma/phase4/schema.prisma) | 122 models, enums, indexes, `@@map` snake_case tables |
| Seed strategy | [`../../backend/prisma/phase4/SEED_STRATEGY.md`](../../backend/prisma/phase4/SEED_STRATEGY.md) | Demo accounts & FK-safe seed order |
| Phase-4 activation notes | [`../../backend/prisma/phase4/README.md`](../../backend/prisma/phase4/README.md) | How to swap from SQLite demo → PostgreSQL |
| Catalogue generator | [`../scripts/generate-table-catalogue.js`](../scripts/generate-table-catalogue.js) | Regenerates Appendix A from Prisma |

## Document map (27 required sections)

All live in [`Ellowring_Database_Design.md`](../Ellowring_Database_Design.md):

1. Executive Summary  
2. Database Goals  
3. Database Principles  
4. Database Standards  
5. Naming Convention  
6. Data Types  
7. Schema Design  
8. Normalization Strategy  
9. Relationships  
10. Primary Keys  
11. Foreign Keys  
12. Constraints  
13. Unique Keys  
14. Composite Keys  
15. Index Strategy  
16. Partition Strategy  
17. Soft Delete Strategy  
18. Audit Strategy  
19. Backup Strategy  
20. Recovery Strategy  
21. Security Strategy  
22. Encryption Strategy  
23. Performance Strategy  
24. Scalability Strategy  
25. Prisma ORM Design  
26. Migration Strategy  
27. Seed Data Strategy  

**Appendices:** A Table Catalogue (122) · B ER Diagrams · C SQL/Index/Query tuning · D Activation runbook  

## Module → table ownership (summary)

| Module | Example tables |
|---|---|
| Authentication | `users`, `roles`, `permissions`, `sessions`, `otp_verifications`, `audit_logs` |
| Student | `students`, `skills`, `wallets`, `certificates`, `bookmarks` |
| Coaching | `coaching_programs`, `questions`, `mock_tests`, `leaderboard_entries` |
| College | `colleges`, `college_courses`, `college_applications`, `scholarships` |
| Study Abroad | `abroad_universities`, `abroad_programs`, `abroad_applications` |
| Learning | `courses`, `course_modules`, `enrollments`, `assessments` |
| Internship / Job | `companies`, `internships`, `jobs`, `interviews`, `payroll_*` |
| Project | `projects`, `project_submissions`, `project_evaluations` |
| Training | `training_centers`, `training_batches`, `attendance_records` |
| Channel Partner | `partners`, `referrals`, `commissions`, `payouts` |
| Admin | `settings`, `cms_pages`, `support_tickets`, `analytics_snapshots` |
| Payment | `payments`, `invoices`, `subscriptions`, `refunds` |
| Notification | `notifications`, `email_logs`, `sms_logs`, `whatsapp_logs` |

## Activate Phase-4 (short)

```bash
# 1. Point DATABASE_URL at PostgreSQL
# 2. Promote phase4 schema
cp backend/prisma/phase4/schema.prisma backend/prisma/schema.prisma
cd backend
npx prisma migrate dev --name phase4_init
npx prisma generate
npx prisma db seed
```

Demo logins use `*@ellowring.com` / `password123` (see seed strategy).

## Keep docs in sync

After any Prisma model change:

```bash
node docs/scripts/generate-table-catalogue.js
```
