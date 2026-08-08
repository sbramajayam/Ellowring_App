run # Ellowring — Enterprise Database Design Document

**Ellowring Software Solutions**  
**Product:** Ellowring  
**Tagline:** Learn. Prepare. Build. Get Hired.  
**Vision:** From 11th Standard to First Job — Everything in One Platform.  
**Platform:** Enterprise SaaS Web Application  

| Field | Value |
|---|---|
| Document Type | Enterprise Database Design Specification |
| Version | 1.1 (Phase 4) |
| Date | August 2026 |
| Database | PostgreSQL 16+ |
| ORM | Prisma ORM |
| Cache | Redis 7+ |
| Classification | Internal / Confidential |
| Audience | Data Architects, Backend Engineers, DevOps, Security, QA |
| Companion Artefacts | `backend/prisma/phase4/schema.prisma`, `backend/prisma/phase4/SEED_STRATEGY.md` |

---

## Document Control

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | Aug 2026 | Ellowring Architecture | Initial Phase-4 database design — implementable without further requirement gathering |
| 1.1 | Aug 2026 | Ellowring Architecture | Regenerated Appendix A from Prisma (122 models) with table-specific rules; encoding cleanup |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)  
2. [Database Goals](#2-database-goals)  
3. [Database Principles](#3-database-principles)  
4. [Database Standards](#4-database-standards)  
5. [Naming Convention](#5-naming-convention)  
6. [Data Types](#6-data-types)  
7. [Schema Design](#7-schema-design)  
8. [Normalization Strategy](#8-normalization-strategy)  
9. [Relationships](#9-relationships)  
10. [Primary Keys](#10-primary-keys)  
11. [Foreign Keys](#11-foreign-keys)  
12. [Constraints](#12-constraints)  
13. [Unique Keys](#13-unique-keys)  
14. [Composite Keys](#14-composite-keys)  
15. [Index Strategy](#15-index-strategy)  
16. [Partition Strategy](#16-partition-strategy)  
17. [Soft Delete Strategy](#17-soft-delete-strategy)  
18. [Audit Strategy](#18-audit-strategy)  
19. [Backup Strategy](#19-backup-strategy)  
20. [Recovery Strategy](#20-recovery-strategy)  
21. [Security Strategy](#21-security-strategy)  
22. [Encryption Strategy](#22-encryption-strategy)  
23. [Performance Strategy](#23-performance-strategy)  
24. [Scalability Strategy](#24-scalability-strategy)  
25. [Prisma ORM Design](#25-prisma-orm-design)  
26. [Migration Strategy](#26-migration-strategy)  
27. [Seed Data Strategy](#27-seed-data-strategy)  

**Appendices**

- [Appendix A — Complete Table Catalogue](#appendix-a--complete-table-catalogue) (122 tables)  
- [Appendix B — Entity Relationship Diagrams](#appendix-b--entity-relationship-diagrams)  
- [Appendix C — SQL Best Practices & Query Optimisation](#appendix-c--sql-best-practices--query-optimisation)  
- [Appendix D — Phase-4 Activation Runbook](#appendix-d--phase-4-activation-runbook)  
- Generator: `docs/scripts/generate-table-catalogue.js`  

---

# 1. Executive Summary

Ellowring is an enterprise Education → Career → Hiring SaaS platform that unifies student journeys from Class 11 through first job. The Phase-4 database is the **system of record** for Authentication, Career Guidance, Coaching (NEET / JEE / Competitive), College Admissions, Study Abroad, Courses, Internships, Projects, Jobs, Companies, Payroll, Wallet, Payments, Certificates, Notifications, Reports, and Analytics — across six application roles:

| Role | Primary Data Domains |
|---|---|
| Student | Profile, learning, coaching, admissions, applications, wallet |
| College | Catalogue programmes, applications, scholarships |
| HR / Company | Jobs, internships, projects, interviews, offers, payroll |
| Training | Centres, batches, attendance, revenue |
| Channel Partner | Leads, referrals, commissions, payouts |
| Admin | Settings, CMS, support, analytics, RBAC |

**Design thesis:** A single **PostgreSQL 16** database owned by a **NestJS modular monolith** through **Prisma ORM**, with **Redis** for hot-path cache and rate limits. The schema is modular by domain, 3NF by default, money-safe (`Decimal`), soft-delete aware, and audit-ready — while remaining microservice-extractable later via clear table ownership.

| Metric | Phase-4 Target |
|---|---|
| Logical models | **122** Prisma models |
| Enumerations | **24+** domain enums |
| Physical DB | PostgreSQL 16 (Unicode / `utf8`) |
| Local prior state | SQLite demo (`backend/prisma/schema.prisma`) — superseded by Phase-4 PostgreSQL schema |
| Implementable artefact | `backend/prisma/phase4/schema.prisma` |

This document is detailed enough that Engineering can implement the database **without further requirement gatherings**.

---

# 2. Database Goals

| ID | Goal | Success Criteria |
|---|---|---|
| DG-1 | Single source of truth for identity & RBAC | One `users` table; role profiles 1:1; enterprise permissions via RBAC tables |
| DG-2 | End-to-end student journey persistence | Coaching → courses → internships → projects → jobs share coherent student keys |
| DG-3 | Financial integrity | Wallet ledger + payments/invoices/refunds are append-friendly and reconcilable |
| DG-4 | Partner / HR / Training multi-tenancy | Company / training centre / partner scoped data with FK ownership |
| DG-5 | Compliance readiness | Soft delete, audit logs, PII encryption-at-rest, retention hooks |
| DG-6 | Performance at SaaS scale | Indexed FK lookups, partition-ready high-volume logs, Redis cache of catalogues |
| DG-7 | ORM-first developer velocity | Complete Prisma schema; typed clients; migrate-dev / migrate-deploy |
| DG-8 | Zero ambiguity for Phase-4 build | Every table has purpose, columns, constraints, indexes, relationships, rules |

---

# 3. Database Principles

1. **Domain ownership** — Each Nest module owns a coherent table set; cross-module access only via FK + API, not silent cross-writes.  
2. **Identity centrality** — `users.id` is the universal principal; profiles extend users.  
3. **Immutability for money & answers** — Ledgers, payment transactions, and scored answers are insert-mostly.  
4. **Explicit state machines** — Status enums for applications, payments, subscriptions, tickets.  
5. **Least privilege** — App DB role has DML only; migrations use a migrator role.  
6. **Prefer relational integrity** over application-only rules for FKs and uniqueness.  
7. **Soft delete by default** on catalogue and profile entities; hard delete only for ephemeral tokens after expiry purge.  
8. **Time-zone honesty** — Store `timestamptz` (`DateTime` in Prisma); render in IST/UI locale.  
9. **Idempotent writes** for payments and OTP consumption.  
10. **Documented exceptions** — Polymorphic bookmarks/favorites use `(entityType, entityId)` intentionally.

---

# 4. Database Standards

| Area | Standard |
|---|---|
| RDBMS | PostgreSQL 16+ |
| Character set | UTF8 |
| Collation | `en_US.utf8` (or cloud-provider equivalent) |
| Time | `TIMESTAMPTZ` via Prisma `DateTime` |
| Money | `NUMERIC(14,2)` / Prisma `Decimal @db.Decimal(14,2)` |
| Booleans | PostgreSQL `BOOLEAN` |
| JSON | `JSONB` for flexible metadata payloads only |
| Identifiers | `cuid()` strings (URL-safe, sortable enough for MVP) |
| Migrations | Prisma Migrate only (no manual hot-fix DDL in production) |
| Environments | `dev` / `staging` / `prod` with isolated databases |
| Connection | Pooled (`PgBouncer` / Prisma Data Proxy optional in later scale) |

---

# 5. Naming Convention

| Object | Convention | Example |
|---|---|---|
| Tables | `snake_case` plural | `job_applications` |
| Columns | `snake_case` (Prisma uses camelCase field names mapped to DB) | `created_at` via `@map` where needed; Prisma defaults camelCase columns unless mapped |
| Prisma models | `PascalCase` | `JobApplication` |
| Prisma fields | `camelCase` | `createdAt` |
| Enums | `PascalCase` type, `SCREAMING_SNAKE` values | `ApplicationStatus.SHORTLISTED` |
| Primary key | `id` | `id String @id @default(cuid())` |
| Foreign key | `<entity>Id` | `studentId` |
| Soft delete | `deletedAt` | `DateTime?` |
| Junction tables | descriptive plural | `role_permissions`, `user_rbac_roles` |
| Indexes | Prisma `@@index` / DB auto names | — |
| Map directive | `@@map("snake_table")` on every Phase-4 model | Required |

**Special naming decisions (locked):**

| Prisma Model | Table | Reason |
|---|---|---|
| `RbacRole` | `roles` | Avoid clash with application `Role` enum |
| `CollegeProfile` | `college_profiles` | Login profile ≠ catalogue `colleges` |
| `CourseEnrollment` | `enrollments` | Learning enrollments |
| `Project` | `projects` | Live projects module |

---

# 6. Data Types

| Domain Concept | PostgreSQL | Prisma |
|---|---|---|
| Surrogate key | `TEXT` / `VARCHAR` | `String @id @default(cuid())` |
| Email | `TEXT` | `String` + unique |
| Password hash | `TEXT` | `String` (bcrypt/argon2 hash only) |
| Money | `NUMERIC(14,2)` | `Decimal @db.Decimal(14,2)` |
| Percentage | `NUMERIC(5,2)` or `FLOAT` | `Decimal` preferred |
| Flags | `BOOLEAN` | `Boolean` |
| Enumerations | `ENUM` or check | Prisma `enum` |
| Long text | `TEXT` | `String` |
| URLs / paths | `TEXT` | `String` |
| JSON metadata | `JSONB` | `Json` |
| Counters | `INTEGER` / `BIGINT` | `Int` / `BigInt` |
| Timestamps | `TIMESTAMPTZ` | `DateTime` |

**Prohibited:** storing raw card PANs, plaintext OTP beyond TTL windows in logs, plaintext passwords.

---

# 7. Schema Design

## 7.1 Logical domains

```text
┌─────────────────── AUTH / RBAC ───────────────────┐
│ users · roles · permissions · sessions · tokens   │
└───────────────┬───────────────────────────────────┘
                │ 1:1 profiles
   ┌────────────┼────────────┬────────────┬─────────┐
   ▼            ▼            ▼            ▼         ▼
 Student    College     Company      Training   Partner
   │         Profile       │          Center
   │                       ├── Jobs / Internships / Projects / Payroll
   ├── Coaching / Courses / Abroad / Admissions
   └── Wallet / Certificates / Notifications
                │
                ▼
        PAYMENTS · INVOICES · SUBSCRIPTIONS
                │
                ▼
        ADMIN CMS · SUPPORT · ANALYTICS · AUDIT
```

## 7.2 Physical schema

- One PostgreSQL database: `ellowring`  
- One Prisma schema file (Phase-4): all domains co-located for monolith velocity  
- Optional future schemas (`auth`, `learning`, …) only after microservice split  

## 7.3 Module → table ownership

See **Appendix A** for every table. High-level counts:

| Module | Approx. tables |
|---|---|
| Authentication / RBAC | 10 |
| Student | 16 |
| Coaching | 14 |
| College | 10 |
| Study Abroad | 7 |
| Learning | 10 |
| Internship (+ Company) | 7 |
| Project | 6 |
| Job / Payroll | 9 |
| Training | 7 |
| Channel Partner | 7 |
| Admin | 8 |
| Payment | 6 |
| Notification | 5 |
| **Total** | **122 models** |

---

# 8. Normalization Strategy

| Level | Practice |
|---|---|
| 1NF | Atomic columns; no CSV skills blobs in Phase-4 (use `student_skills`, `project_technologies`) |
| 2NF | Composite natural keys avoided for entities; junction tables for M:N |
| 3NF | Derived totals (wallet balance) may be stored for performance but must reconcile to `wallet_ledger` |
| Denormalisation (allowed) | Leaderboard snapshots, analytics snapshots, cached course ratings |

**Rule:** Prefer a new table over adding polymorphic JSON unless the attribute set is truly schemaless.

---

# 9. Relationships

### Cardinality patterns

| Pattern | Examples |
|---|---|
| 1:1 | `User`–`Student`, `User`–`Company`, `User`–`Wallet` |
| 1:N | `Company`–`Job`, `CoachingProgram`–`Subject`, `MockTest`–`MockResult` |
| M:N | `RbacRole`–`Permission`, `Student`–`Skill`, users–RBAC roles |
| Polymorphic | `Bookmark`, `Favorite` via `entityType` + `entityId` |

### Core relationship diagram (simplified)

```mermaid
erDiagram
  USER ||--o| STUDENT : has
  USER ||--o| COLLEGE_PROFILE : has
  USER ||--o| COMPANY : has
  USER ||--o| TRAINING_CENTER : has
  USER ||--o| PARTNER : has
  USER ||--o| WALLET : has
  USER ||--o{ SESSION : opens
  USER ||--o{ NOTIFICATION : receives
  STUDENT ||--o{ EDUCATION_HISTORY : records
  STUDENT ||--o{ COURSE_ENROLLMENT : enrolls
  STUDENT ||--o{ COACHING_ENROLLMENT : enrolls
  STUDENT ||--o{ JOB_APPLICATION : applies
  COMPANY ||--o{ JOB : posts
  COMPANY ||--o{ INTERNSHIP : posts
  COMPANY ||--o{ PROJECT : posts
  COMPANY ||--o{ EMPLOYEE : employs
  JOB ||--o{ JOB_APPLICATION : receives
  PARTNER ||--o{ REFERRAL : attributes
  PARTNER ||--o| PARTNER_WALLET : earns
```

Full per-table relationships are listed in Appendix A.

---

# 10. Primary Keys

| Rule | Detail |
|---|---|
| Default PK | `id String @id @default(cuid())` |
| No natural PKs | Business codes (`referralCode`, `slug`) are UNIQUE, not PKs |
| Junction tables | Still use surrogate `id` OR composite `@@id` — Phase-4 uses surrogate + `@@unique` for clarity |
| Ledger lines | Surrogate PK; never reuse IDs |

---

# 11. Foreign Keys

| Rule | Detail |
|---|---|
| Naming | `<parent>Id` |
| ON DELETE | `Cascade` for owned children (enrollments, options); `Restrict`/`SetNull` for shared catalogues |
| Prisma | `@relation(fields: [...], references: [id], onDelete: Cascade)` |
| Orphans | Forbidden for financial children |

---

# 12. Constraints

| Constraint Type | Usage |
|---|---|
| NOT NULL | Required identity & status fields |
| UNIQUE | Email, slugs, referral codes, one enrollment per student/course |
| CHECK (app-level + future SQL) | Amount ≥ 0; progress 0–100 |
| ENUM | Status / role / notification type |
| FK | All references validated |

Application services enforce state-transition CHECK rules (e.g., offer cannot go `ACCEPTED` → `PENDING`).

---

# 13. Unique Keys

Critical unique keys (non-exhaustive — Prisma schema is authoritative):

| Table | Unique |
|---|---|
| `users` | `email` |
| `students` | `userId` |
| `wallets` | `userId` |
| `coupons` | `code` |
| `courses` | `slug` |
| `partners` | `referralCode` |
| `enrollments` | `(studentId, courseId)` |
| `coupon_redemptions` | `(couponId, userId)` |
| `saved_jobs` | `(userId, jobId)` |

---

# 14. Composite Keys

Phase-4 prefers **surrogate PK + composite UNIQUE** over composite primary keys for ORM ergonomics.

Examples:

- `@@unique([studentId, courseId])` on enrollments  
- `@@unique([rbacRoleId, permissionId])` on role permissions  
- `@@unique([userId, jobId])` on saved jobs  

---

# 15. Index Strategy

| Priority | Index |
|---|---|
| P0 | All foreign keys |
| P0 | Login: `users(email)`, sessions by `userId`, refresh token hash |
| P0 | Application lists: `(studentId, status)`, `(jobId, status)` |
| P1 | Catalogue filters: `courses(categoryId, isPublished)`, `jobs(companyId, isActive)` |
| P1 | Time scans: `createdAt DESC` on notifications, audit logs |
| P2 | Full-text (later): PostgreSQL `tsvector` on course/job titles |
| P2 | Partial indexes: `WHERE deletedAt IS NULL` for hot catalogues |

**Anti-pattern:** Indexing every column; unused indexes slow writes.

---

# 16. Partition Strategy

| Table class | Strategy | When |
|---|---|---|
| `audit_logs`, `email_logs`, `sms_logs`, `whatsapp_logs`, `push_notifications` | RANGE on `createdAt` (monthly) | > 20M rows |
| `wallet_ledger`, `transactions` | RANGE on `createdAt` | High finance volume |
| `student_answers` | HASH / RANGE by `mockResultId` or month | Heavy exam seasons |
| Core master data | **Do not partition** early | — |

Partitioning is operational DDL applied after Prisma baseline; document as follow-up migrations when thresholds hit.

---

# 17. Soft Delete Strategy

| Entity class | Approach |
|---|---|
| Users, profiles, catalogue (courses, jobs, colleges) | `deletedAt DateTime?`; default queries filter `deletedAt: null` |
| Sessions, OTP, password resets | Hard delete via TTL job after expiry |
| Payments / ledger | **Never soft-delete**; reverse with compensating entries |
| Admin CMS | Soft delete + audit |

Prisma middleware / query helpers MUST enforce soft-delete filters in repositories.

---

# 18. Audit Strategy

| Layer | Mechanism |
|---|---|
| Table | `audit_logs` — actor, action, entity, before/after JSON, IP, user-agent |
| Column | `createdAt`, `updatedAt` on mutable tables; `createdById` / `updatedById` on admin content |
| Auth events | Login success/failure, refresh rotation, password reset |
| Finance | Every wallet ledger & payment status change |
| Retention | Hot 90 days online; archive to cold object storage |

---

# 19. Backup Strategy

| Environment | Method | Frequency | Retention |
|---|---|---|---|
| Production | PostgreSQL continuous WAL + daily base backup | Continuous / Daily | 30 days |
| Staging | Daily snapshot | Daily | 7 days |
| Dev | Optional | On demand | — |
| Offsite | Encrypted copy to object storage (S3/GCS) | Daily | 30–90 days |
| Redis | AOF/RDB optional; cache is rebuildable | — | Not SoR |

Test restore **monthly**. Backup success must alert on failure.

---

# 20. Recovery Strategy

| Scenario | RPO | RTO | Action |
|---|---|---|---|
| Accidental DELETE / bad migration | ≤ 5 min (WAL) | ≤ 1 h | Point-in-time recovery (PITR) to new instance; cutover |
| AZ failure | 0 (sync replica) | ≤ 15 min | Promote replica |
| Regional disaster | ≤ 15 min | ≤ 4 h | Restore offsite to DR region |
| Ransomware | ≤ 24 h (immutable backups) | ≤ 24 h | Rebuild infra + restore clean backup |

Document runbooks in DevOps wiki; pair with Architecture Document § Backup / DR.

---

# 21. Security Strategy

1. Least-privilege DB roles (`ellowring_app`, `ellowring_migrator`, `ellowring_readonly`).  
2. Network isolation — DB in private subnet; SSL/TLS required.  
3. Secrets in vault / env — never commit `DATABASE_URL` production credentials.  
4. Row-level tenancy in application (companyId / partnerId scoping).  
5. Parameterised queries only (Prisma eliminates classic SQL injection).  
6. Admin actions require RBAC permission checks + audit.  
7. PII access logging for exports.  
8. Rate-limit auth endpoints (Redis).  

---

# 22. Encryption Strategy

| Data | At rest | In transit | Application |
|---|---|---|---|
| Disk / volume | Cloud KMS encrypted volumes | — | — |
| TLS | — | TLS 1.2+ to PostgreSQL | — |
| Passwords | — | — | bcrypt/argon2 hashes |
| OTP | short TTL | TLS | hashed or overwritten on use |
| Payment providers | tokenised by Razorpay/Stripe | TLS | store provider refs only |
| Sensitive docs (visa, ID) | object storage SSE | TLS | signed URLs; DB stores URL + checksum |

---

# 23. Performance Strategy

1. Select only required columns in Prisma (`select` / `omit`).  
2. Avoid N+1 — use `include` deliberately or DataLoader patterns.  
3. Cache hot catalogues in Redis (courses featured, banners, plans) with TTL.  
4. Materialise `analytics_snapshots` via scheduled jobs.  
5. Connection pooling.  
6. EXPLAIN ANALYZE on slow queries (> 200 ms).  
7. Paginate all list endpoints (cursor preferred for feeds).  

---

# 24. Scalability Strategy

| Scale stage | Approach |
|---|---|
| 0–100k users | Single primary + read replica; Redis cache |
| 100k–1M | PgBouncer; partition logs; read replicas for reporting |
| 1M+ | Consider CQRS for analytics; extract Payment/Notification services with dedicated DBs only after clear ownership |

Vertical scale first; horizontal service split second (see System Architecture ADR on modular monolith).

---

# 25. Prisma ORM Design

**Authoritative file:** `backend/prisma/phase4/schema.prisma`

| Topic | Decision |
|---|---|
| Provider | `postgresql` |
| Client | `prisma-client-js` |
| IDs | `cuid()` |
| Money | `Decimal @db.Decimal(14,2)` |
| Mapping | `@@map("snake_case")` on all models |
| Enums | Native Prisma enums → PostgreSQL enums |
| Relations | Explicit `@relation` with onDelete policy |
| Soft delete | `deletedAt` fields — filter in repositories |
| Multi-file schema | Future option (`prismaSchemaFolder`); Phase-4 ships single file for clarity |

**NestJS integration:** `PrismaService` singleton; one client per process; `$transaction` for wallet debit + payment capture.

**Validation:** `npx prisma validate` with PostgreSQL `DATABASE_URL`.

---

# 26. Migration Strategy

### 26.1 From Phase 1–3 SQLite demo → Phase-4 PostgreSQL

1. Start infra: `docker compose -f docker-compose.phase3.yml up -d` (Postgres + Redis).  
2. Set `DATABASE_URL=postgresql://ellowring:ellowring@localhost:5432/ellowring?schema=public`.  
3. Backup SQLite `dev.db` if demo data must be preserved.  
4. Replace `backend/prisma/schema.prisma` with Phase-4 schema (or configure Prisma to use `phase4/schema.prisma`).  
5. `npx prisma migrate dev --name phase4_init`.  
6. Run seed per §27.  
7. Update Nest modules to new model names (`LiveProject` → `Project`, etc.) as part of Phase-4 application work.  
8. Smoke-test auth + student dashboard + payments sandbox.

### 26.2 Ongoing

| Rule | Practice |
|---|---|
| One concern per migration | Additive first; destructive in follow-up with expand/contract |
| Expand/contract | Add column → backfill → switch reads → drop old |
| Never edit applied migrations in prod | Create new migration |
| CI | `prisma migrate diff` / deploy in pipeline |

---

# 27. Seed Data Strategy

Authoritative seed order: `backend/prisma/phase4/SEED_STRATEGY.md`.

**Demo credentials (all roles):** password `password123`

| Email | Role |
|---|---|
| `student@ellowring.com` | STUDENT |
| `college@ellowring.com` | COLLEGE |
| `hr@ellowring.com` / `company@ellowring.com` | COMPANY |
| `training@ellowring.com` | TRAINING |
| `partner@ellowring.com` | PARTNER |
| `admin@ellowring.com` | ADMIN |

Seed sequence: platform spine (permissions, roles, settings, plans) → reference catalogues → users/profiles → commerce samples → applications/notifications.

Deterministic IDs optional; prefer unique natural keys (`email`, `slug`, `code`) for upsert seeds.

---

## Appendix A — Complete Table Catalogue

Each table below is implementable as defined in `backend/prisma/phase4/schema.prisma`. Column lists mirror Prisma fields. Companion seed guidance: `backend/prisma/phase4/SEED_STRATEGY.md`.

### Module: Authentication

#### Table `users` (Prisma: `User`)

**Purpose:** Central identity record for all Ellowring roles; authenticates sessions and owns role profiles.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| email | String | UNIQUE |
| phone | String? | UNIQUE, NULLABLE |
| passwordHash | String | — |
| name | String | — |
| role | Role | DEFAULT |
| avatarUrl | String? | NULLABLE |
| isVerified | Boolean | DEFAULT |
| isActive | Boolean | DEFAULT |
| lastLoginAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| student | Student? | NULLABLE |
| collegeProfile | CollegeProfile? | NULLABLE |
| company | Company? | NULLABLE |
| trainingCenter | TrainingCenter? | NULLABLE |
| partner | Partner? | NULLABLE |
| hrUser | HrUser? | NULLABLE |
| sessions | Session[] | — |
| refreshTokens | RefreshToken[] | — |
| otpVerifications | OtpVerification[] | — |
| passwordResets | PasswordReset[] | — |
| auditLogs | AuditLog[] | — |
| rbacAssignments | UserRbacRole[] | — |
| notifications | Notification[] | — |
| payments | Payment[] | — |
| subscriptions | Subscription[] | — |
| supportTickets | SupportTicket[] | Relation |
| assignedTickets | SupportTicket[] | Relation |
| couponRedemptions | CouponRedemption[] | — |
| abroadApplications | AbroadApplication[] | — |
| collegeApplications | CollegeApplication[] | — |
| jobApplications | JobApplication[] | — |
| internshipApplications | InternshipApplication[] | — |
| savedJobs | SavedJob[] | — |
| emailLogs | EmailLog[] | — |
| smsLogs | SmsLog[] | — |
| pushNotifications | PushNotification[] | — |
| whatsappLogs | WhatsappLog[] | — |

**Indexes**

- `INDEX([role])`
- `INDEX([isActive])`
- `INDEX([deletedAt])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `supportTickets`, `assignedTickets`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** One user may hold exactly one primary Role enum profile (Student, CollegeProfile, Company, TrainingCenter, Partner, HrUser). Soft-delete disables login but retains FK history. Email is immutable after verification unless Admin reset. Password hash never returned via API.

**Validation Rules:** email required, unique, lowercased; passwordHash required (bcrypt/argon2); role must be valid Role enum; phone unique when present (E.164 preferred).

**Example Data:** student@ellowring.com / Role.STUDENT / isVerified=true / isActive=true

#### Table `roles` (Prisma: `RbacRole`)

**Purpose:** Fine-grained enterprise RBAC role beyond the coarse application Role enum.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| name | String | UNIQUE |
| slug | String | UNIQUE |
| description | String? | NULLABLE |
| isSystem | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| permissions | RbacRolePermission[] | — |
| users | UserRbacRole[] | — |

**Indexes**

- Primary key index on `id` (and `@unique` columns as declared).

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** System roles (isSystem=true) cannot be deleted. Assigned via UserRbacRole. Used primarily for Admin console privileges.

**Validation Rules:** name and slug unique; slug kebab-case; isSystem default false.

**Example Data:** super-admin, content-manager, support-agent

#### Table `permissions` (Prisma: `Permission`)

**Purpose:** Atomic permission claims (module.action) bound to RBAC roles.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| name | String | UNIQUE |
| slug | String | UNIQUE |
| module | String | — |
| description | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| roles | RbacRolePermission[] | — |

**Indexes**

- `INDEX([module])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** Permissions are additive. Module prefix must match platform module ownership (auth.*, student.*, jobs.*, …).

**Validation Rules:** slug unique; format module.action; name required.

**Example Data:** jobs.publish, payments.refund, cms.publish

#### Table `role_permissions` (Prisma: `RbacRolePermission`)

**Purpose:** Many-to-many join of RBAC roles to permissions.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| roleId | String | — |
| permissionId | String | — |
| createdAt | DateTime | DEFAULT |
| role | RbacRole | Relation |
| permission | Permission | Relation |

**Indexes**

- `INDEX([roleId])`
- `INDEX([permissionId])`

**Unique Keys**

- `UNIQUE([roleId, permissionId])`

**Relationships:** Prisma relations: `role`, `permission`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Deleting a role cascades join rows. Duplicate (roleId, permissionId) forbidden.

**Validation Rules:** roleId and permissionId required FKs; composite unique.

**Example Data:** super-admin → all permissions; support-agent → support.* + notifications.read

#### Table `user_rbac_roles` (Prisma: `UserRbacRole`)

**Purpose:** Assigns enterprise RBAC roles to users (typically Admins).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | — |
| roleId | String | — |
| createdAt | DateTime | DEFAULT |
| user | User | Relation |
| role | RbacRole | Relation |

**Indexes**

- `INDEX([userId])`
- `INDEX([roleId])`

**Unique Keys**

- `UNIQUE([userId, roleId])`

**Relationships:** Prisma relations: `user`, `role`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Independent of coarse Role enum. A COMPANY user may also receive limited RBAC roles if needed.

**Validation Rules:** composite unique (userId, roleId); both FKs required.

**Example Data:** admin@ellowring.com → super-admin

#### Table `sessions` (Prisma: `Session`)

**Purpose:** Server-side session tracking for authenticated browsers/apps.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | — |
| token | String | UNIQUE |
| ipAddress | String? | NULLABLE |
| userAgent | String? | NULLABLE |
| expiresAt | DateTime | — |
| createdAt | DateTime | DEFAULT |
| user | User | Relation |

**Indexes**

- `INDEX([userId])`
- `INDEX([expiresAt])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Expire sessions on logout and password reset. Purge expired sessions via scheduled job. Soft device/context metadata only.

**Validation Rules:** userId FK; tokenHash unique; expiresAt > createdAt.

**Example Data:** userId=student…, expiresAt=+7d, userAgent=Chrome Windows

#### Table `refresh_tokens` (Prisma: `RefreshToken`)

**Purpose:** Rotating refresh tokens for JWT/access-token renewal.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | — |
| token | String | UNIQUE |
| expiresAt | DateTime | — |
| revokedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| user | User | Relation |

**Indexes**

- `INDEX([userId])`
- `INDEX([expiresAt])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Rotate on each use; mark superseded tokens revoked. Hard-delete after retention window.

**Validation Rules:** tokenHash unique; userId FK; revokedAt null means active.

**Example Data:** hashed refresh token, familyId for reuse detection

#### Table `otp_verifications` (Prisma: `OtpVerification`)

**Purpose:** One-time codes for signup, login, or sensitive actions.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String? | NULLABLE |
| email | String? | NULLABLE |
| phone | String? | NULLABLE |
| code | String | — |
| purpose | OtpPurpose | — |
| expiresAt | DateTime | — |
| used | Boolean | DEFAULT |
| usedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| user | User? | Relation |

**Indexes**

- `INDEX([userId])`
- `INDEX([email])`
- `INDEX([phone])`
- `INDEX([expiresAt])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Single-use; mark used=true on consume. Invalidate prior OTPs for same purpose+target. Rate-limit creation via Redis.

**Validation Rules:** code 4–8 digits; expiresAt required; purpose enum-like string; either email or phone or userId.

**Example Data:** purpose=REGISTER, code=482913, expiresAt=+10m

#### Table `password_resets` (Prisma: `PasswordReset`)

**Purpose:** Password reset request tokens.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | — |
| token | String | UNIQUE |
| expiresAt | DateTime | — |
| usedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| user | User | Relation |

**Indexes**

- `INDEX([userId])`
- `INDEX([expiresAt])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** One active token per user; invalidate on success or expiry. Never log raw token.

**Validation Rules:** tokenHash unique; expiresAt required; used boolean.

**Example Data:** userId=student…, expiresAt=+30m, used=false

#### Table `audit_logs` (Prisma: `AuditLog`)

**Purpose:** Immutable security and domain action trail.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String? | NULLABLE |
| action | String | — |
| entityType | String | — |
| entityId | String? | NULLABLE |
| metadata | Json? | NULLABLE |
| ipAddress | String? | NULLABLE |
| userAgent | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| user | User? | Relation |

**Indexes**

- `INDEX([userId])`
- `INDEX([entityType, entityId])`
- `INDEX([createdAt])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Insert-only. No updates/deletes from app role. Partition-ready by createdAt. Store actor, action, entity, before/after diffs as JSON.

**Validation Rules:** action and entityType required; metadata JSON optional.

**Example Data:** action=USER.LOGIN, entityType=User, ip=…, metadata={channel:web}

### Module: Student

#### Table `students` (Prisma: `Student`)

**Purpose:** Student profile extension (1:1 with User where role=STUDENT).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | UNIQUE |
| dateOfBirth | DateTime? | NULLABLE |
| gender | String? | NULLABLE |
| grade | String? | NULLABLE |
| stream | String? | NULLABLE |
| city | String? | NULLABLE |
| state | String? | NULLABLE |
| country | String? | DEFAULT, NULLABLE |
| bio | String? | NULLABLE |
| resumeUrl | String? | NULLABLE |
| linkedinUrl | String? | NULLABLE |
| githubUrl | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| createdById | String? | NULLABLE |
| updatedById | String? | NULLABLE |
| user | User | Relation |
| parents | Parent[] | — |
| educationHistory | EducationHistory[] | — |
| careerInterests | CareerInterest[] | — |
| careerRecommendations | CareerRecommendation[] | — |
| studentSkills | StudentSkill[] | — |
| skillProgress | SkillProgress[] | — |
| achievements | Achievement[] | — |
| wallet | Wallet? | NULLABLE |
| certificates | Certificate[] | — |
| bookmarks | Bookmark[] | — |
| favorites | Favorite[] | — |
| coachingEnrollments | CoachingEnrollment[] | — |
| courseEnrollments | CourseEnrollment[] | — |
| studentAnswers | StudentAnswer[] | — |
| mockResults | MockResult[] | — |
| leaderboardEntries | LeaderboardEntry[] | — |
| internshipApplications | InternshipApplication[] | — |
| internshipProgress | InternshipProgress[] | — |
| internshipFeedback | InternshipFeedback[] | — |
| projectTeamMembers | ProjectTeamMember[] | — |
| projectSubmissions | ProjectSubmission[] | — |
| trainingAssignments | TrainingAssignment[] | — |
| attendanceRecords | AttendanceRecord[] | — |

**Indexes**

- `INDEX([city, state])`
- `INDEX([deletedAt])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Created at registration for STUDENT role. Career fields drive guidance recommendations. Soft-delete mirrors user deactivation.

**Validation Rules:** userId unique FK; grade/stream optional enumerated values preferred; city/state free text.

**Example Data:** grade=12, stream=PCM, city=Pune, careerInterest=Engineering

#### Table `parents` (Prisma: `Parent`)

**Purpose:** Guardian contacts linked to a student.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | — |
| name | String | — |
| relation | String | — |
| email | String? | NULLABLE |
| phone | String? | NULLABLE |
| occupation | String? | NULLABLE |
| isPrimary | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| student | Student | Relation |

**Indexes**

- `INDEX([studentId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `student`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Multiple parents allowed; primary flag enforced in app (at most one primary).

**Validation Rules:** studentId FK; phone/email format; relationType required (FATHER/MOTHER/GUARDIAN).

**Example Data:** relationType=MOTHER, name=Anita Sharma, phone=+91…

#### Table `education_history` (Prisma: `EducationHistory`)

**Purpose:** Chronological education records for career/admission forms.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | — |
| institution | String | — |
| degree | String? | NULLABLE |
| fieldOfStudy | String? | NULLABLE |
| startYear | Int? | NULLABLE |
| endYear | Int? | NULLABLE |
| grade | String? | NULLABLE |
| description | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| student | Student | Relation |

**Indexes**

- `INDEX([studentId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `student`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Ordered by yearFrom/yearTo. Used to prefill college and study-abroad applications.

**Validation Rules:** studentId FK; institutionName required; percentage 0–100 when present.

**Example Data:** institution=Delhi Public School, board=CBSE, yearTo=2024, percentage=92.4

#### Table `career_interests` (Prisma: `CareerInterest`)

**Purpose:** Declared career interest tags for guidance.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | — |
| title | String | — |
| category | String? | NULLABLE |
| priority | Int | DEFAULT |
| notes | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| student | Student | Relation |
| recommendations | CareerRecommendation[] | — |

**Indexes**

- `INDEX([studentId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `student`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Weighted interests influence CareerRecommendation generation.

**Validation Rules:** studentId FK; interest required; weight 1–10 when used.

**Example Data:** interest=Software Engineering, weight=9

#### Table `career_recommendations` (Prisma: `CareerRecommendation`)

**Purpose:** System or counselor-generated career pathway suggestions.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | — |
| careerInterestId | String? | NULLABLE |
| title | String | — |
| summary | String? | NULLABLE |
| confidence | Decimal? | NULLABLE, @db.Decimal(5, 2) |
| source | String? | NULLABLE |
| metadata | Json? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| student | Student | Relation |
| careerInterest | CareerInterest? | Relation |

**Indexes**

- `INDEX([studentId])`
- `INDEX([careerInterestId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `student`, `careerInterest`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Recommendations are advisory; student may dismiss. Store algorithm version in metadata.

**Validation Rules:** studentId FK; title required; score 0–100 optional.

**Example Data:** title=JEE → B.Tech CSE → Product Internship, score=86

#### Table `skills` (Prisma: `Skill`)

**Purpose:** Canonical skill catalogue (tech, soft, domain).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| name | String | UNIQUE |
| slug | String | UNIQUE |
| category | String? | NULLABLE |
| description | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| studentSkills | StudentSkill[] | — |
| skillProgress | SkillProgress[] | — |

**Indexes**

- `INDEX([category])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** Shared across students, jobs, and courses. Prefer slug uniqueness for upserts.

**Validation Rules:** name/slug unique; category optional.

**Example Data:** name=React, slug=react, category=FRONTEND

#### Table `student_skills` (Prisma: `StudentSkill`)

**Purpose:** Student ↔ skill association with proficiency.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | — |
| skillId | String | — |
| level | Int | DEFAULT |
| yearsOfExp | Decimal? | NULLABLE, @db.Decimal(4, 1) |
| verified | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| student | Student | Relation |
| skill | Skill | Relation |

**Indexes**

- `INDEX([studentId])`
- `INDEX([skillId])`

**Unique Keys**

- `UNIQUE([studentId, skillId])`

**Relationships:** Prisma relations: `student`, `skill`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Proficiency drives job matching and project eligibility.

**Validation Rules:** composite unique (studentId, skillId); level enum-like BEGINNER…EXPERT.

**Example Data:** skill=React, level=INTERMEDIATE

#### Table `skill_progress` (Prisma: `SkillProgress`)

**Purpose:** Time-series skill improvement checkpoints.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | — |
| skillId | String | — |
| progressPct | Int | DEFAULT |
| source | String? | NULLABLE |
| notes | String? | NULLABLE |
| recordedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| student | Student | Relation |
| skill | Skill | Relation |

**Indexes**

- `INDEX([studentId])`
- `INDEX([skillId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `student`, `skill`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Append progress events; do not overwrite history.

**Validation Rules:** studentId + skillId FKs; progressPercent 0–100.

**Example Data:** progressPercent=65, source=COURSE_COMPLETION

#### Table `achievements` (Prisma: `Achievement`)

**Purpose:** Badges / milestones awarded to students.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | — |
| title | String | — |
| description | String? | NULLABLE |
| issuer | String? | NULLABLE |
| achievedAt | DateTime? | NULLABLE |
| badgeUrl | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| student | Student | Relation |

**Indexes**

- `INDEX([studentId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `student`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Issued by coaching, courses, or admin. Certificate linkage optional.

**Validation Rules:** studentId FK; title required; awardedAt default now.

**Example Data:** title=NEET Mock Top 10, awardedAt=2026-03-01

#### Table `wallets` (Prisma: `Wallet`)

**Purpose:** Student prepaid wallet balance (INR).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | UNIQUE |
| balance | Decimal | DEFAULT, @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| student | Student | Relation |
| ledger | WalletLedger[] | — |

**Indexes**

- Primary key index on `id` (and `@unique` columns as declared).

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `student`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Balance must equal sum(ledger credits − debits − holds + releases). Never update balance without a WalletLedger row in the same transaction.

**Validation Rules:** userId unique; balance ≥ 0; currency default INR; Decimal(14,2).

**Example Data:** balance=1500.00 INR linked to student@ellowring.com

#### Table `wallet_ledger` (Prisma: `WalletLedger`)

**Purpose:** Immutable wallet movement ledger.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| walletId | String | — |
| amount | Decimal | @db.Decimal(14, 2) |
| type | WalletLedgerType | — |
| reference | String? | NULLABLE |
| description | String? | NULLABLE |
| balanceAfter | Decimal? | NULLABLE, @db.Decimal(14, 2) |
| createdAt | DateTime | DEFAULT |
| wallet | Wallet | Relation |

**Indexes**

- `INDEX([walletId])`
- `INDEX([createdAt])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `wallet`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Insert-only. CREDIT/DEBIT/HOLD/RELEASE. Reference paymentId/orderId in metadata for reconciliation.

**Validation Rules:** walletId FK; amount > 0; type WalletLedgerType; balanceAfter computed.

**Example Data:** type=CREDIT, amount=500.00, reference=PAY_…

#### Table `coupons` (Prisma: `Coupon`)

**Purpose:** Discount coupons for courses, coaching, or plans.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| code | String | UNIQUE |
| title | String? | NULLABLE |
| discountPct | Decimal? | NULLABLE, @db.Decimal(5, 2) |
| discountAmt | Decimal? | NULLABLE, @db.Decimal(14, 2) |
| minOrderAmt | Decimal? | NULLABLE, @db.Decimal(14, 2) |
| maxUses | Int | DEFAULT |
| usedCount | Int | DEFAULT |
| expiresAt | DateTime? | NULLABLE |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| createdById | String? | NULLABLE |
| updatedById | String? | NULLABLE |
| redemptions | CouponRedemption[] | — |

**Indexes**

- `INDEX([isActive])`
- `INDEX([expiresAt])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** Enforce maxRedemptions, validFrom/validTo, and percent vs fixed amount exclusivity in services.

**Validation Rules:** code unique uppercase; either percentOff (0–100) or amountOff ≥ 0; dates coherent.

**Example Data:** code=WELCOME100, amountOff=100.00, maxRedemptions=1000

#### Table `coupon_redemptions` (Prisma: `CouponRedemption`)

**Purpose:** Records a user’s successful coupon use.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| couponId | String | — |
| userId | String | — |
| orderRef | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| coupon | Coupon | Relation |
| user | User | Relation |

**Indexes**

- `INDEX([couponId])`
- `INDEX([userId])`

**Unique Keys**

- `UNIQUE([couponId, userId])`

**Relationships:** Prisma relations: `coupon`, `user`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** One redemption per user per coupon unless policy allows repeats. Increment coupon.redeemedCount atomically.

**Validation Rules:** composite unique (couponId, userId) when single-use; FKs required.

**Example Data:** user=student@…, coupon=WELCOME100, orderRef=ORD_…

#### Table `certificates` (Prisma: `Certificate`)

**Purpose:** General achievement/completion certificates issued to students.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | — |
| title | String | — |
| issuer | String | — |
| credentialId | String? | NULLABLE |
| fileUrl | String? | NULLABLE |
| issuedAt | DateTime | DEFAULT |
| expiresAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| student | Student | Relation |

**Indexes**

- `INDEX([studentId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `student`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** certificateNo unique for verification portal. Soft-delete hides from public verify.

**Validation Rules:** studentId FK; certificateNo unique; issuedAt required.

**Example Data:** certificateNo=ELW-CERT-2026-00042, title=Full Stack Internship

#### Table `bookmarks` (Prisma: `Bookmark`)

**Purpose:** Polymorphic bookmarks (jobs, courses, colleges, …).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | — |
| entityType | BookmarkEntityType | — |
| entityId | String | — |
| notes | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| student | Student | Relation |

**Indexes**

- `INDEX([studentId])`
- `INDEX([entityType, entityId])`

**Unique Keys**

- `UNIQUE([studentId, entityType, entityId])`

**Relationships:** Prisma relations: `student`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** entityType+entityId pattern; app validates entity exists. Unique per user+entity.

**Validation Rules:** userId FK; entityType/entityId required; composite unique.

**Example Data:** entityType=JOB, entityId=…

#### Table `favorites` (Prisma: `Favorite`)

**Purpose:** Polymorphic favorites distinct from bookmarks (UI emphasis).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | — |
| entityType | FavoriteEntityType | — |
| entityId | String | — |
| createdAt | DateTime | DEFAULT |
| student | Student | Relation |

**Indexes**

- `INDEX([studentId])`
- `INDEX([entityType, entityId])`

**Unique Keys**

- `UNIQUE([studentId, entityType, entityId])`

**Relationships:** Prisma relations: `student`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Same polymorphic rules as bookmarks; keep separate for product analytics.

**Validation Rules:** userId FK; entityType/entityId; composite unique.

**Example Data:** entityType=COURSE, entityId=…

### Module: Coaching

#### Table `coaching_categories` (Prisma: `CoachingCategory`)

**Purpose:** Top-level coaching taxonomy (NEET, JEE, Competitive).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| name | String | UNIQUE |
| slug | String | UNIQUE |
| description | String? | NULLABLE |
| iconUrl | String? | NULLABLE |
| sortOrder | Int | DEFAULT |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| programs | CoachingProgram[] | — |

**Indexes**

- Primary key index on `id` (and `@unique` columns as declared).

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** Catalogue entity; soft-delete hides from browse but keeps enrollments.

**Validation Rules:** slug unique; name required; sortOrder ≥ 0.

**Example Data:** name=NEET, slug=neet

#### Table `coaching_programs` (Prisma: `CoachingProgram`)

**Purpose:** Sellable coaching program under a category (optionally owned by training partner).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| categoryId | String | — |
| title | String | — |
| slug | String | UNIQUE |
| examType | String | — |
| description | String? | NULLABLE |
| price | Decimal | DEFAULT, @db.Decimal(14, 2) |
| duration | String? | NULLABLE |
| batchSize | Int? | NULLABLE |
| isPublished | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| createdById | String? | NULLABLE |
| updatedById | String? | NULLABLE |
| category | CoachingCategory | Relation |
| subjects | Subject[] | — |
| mockTests | MockTest[] | — |
| enrollments | CoachingEnrollment[] | — |

**Indexes**

- `INDEX([categoryId])`
- `INDEX([examType])`
- `INDEX([isPublished])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `category`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Published flag controls storefront. Price Decimal. Enrollments require isPublished or admin override.

**Validation Rules:** categoryId FK; slug unique; price ≥ 0.

**Example Data:** NEET 2027 Crash Course, price=14999.00

#### Table `coaching_enrollments` (Prisma: `CoachingEnrollment`)

**Purpose:** Student enrollment in a coaching program.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | — |
| programId | String | — |
| status | EnrollmentStatus | DEFAULT |
| enrolledAt | DateTime | DEFAULT |
| completedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| student | Student | Relation |
| program | CoachingProgram | Relation |

**Indexes**

- `INDEX([studentId])`
- `INDEX([programId])`

**Unique Keys**

- `UNIQUE([studentId, programId])`

**Relationships:** Prisma relations: `student`, `program`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Unique (studentId, programId). Progress 0–100. Status ACTIVE/COMPLETED/CANCELLED.

**Validation Rules:** FKs required; progress 0–100.

**Example Data:** student@… enrolled in NEET Crash, progress=12

#### Table `subjects` (Prisma: `Subject`)

**Purpose:** Subject within a coaching program (Physics, Chemistry, …).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| programId | String | — |
| name | String | — |
| slug | String | — |
| description | String? | NULLABLE |
| sortOrder | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| program | CoachingProgram | Relation |
| chapters | Chapter[] | — |

**Indexes**

- `INDEX([programId])`

**Unique Keys**

- `UNIQUE([programId, slug])`

**Relationships:** Prisma relations: `program`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Ordered by sortOrder. Cascades to chapters.

**Validation Rules:** programId FK; name required.

**Example Data:** Physics under NEET program

#### Table `chapters` (Prisma: `Chapter`)

**Purpose:** Chapter within a subject.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| subjectId | String | — |
| title | String | — |
| slug | String | — |
| description | String? | NULLABLE |
| sortOrder | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| subject | Subject | Relation |
| lessons | Lesson[] | — |

**Indexes**

- `INDEX([subjectId])`

**Unique Keys**

- `UNIQUE([subjectId, slug])`

**Relationships:** Prisma relations: `subject`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Curriculum hierarchy node; unlock rules may depend on prior chapter completion (app).

**Validation Rules:** subjectId FK; sortOrder ≥ 0.

**Example Data:** Laws of Motion, sortOrder=3

#### Table `lessons` (Prisma: `Lesson`)

**Purpose:** Lesson content unit under a chapter.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| chapterId | String | — |
| title | String | — |
| slug | String | — |
| content | String? | NULLABLE |
| videoUrl | String? | NULLABLE |
| durationMin | Int? | NULLABLE |
| sortOrder | Int | DEFAULT |
| isFree | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| chapter | Chapter | Relation |
| topics | Topic[] | — |

**Indexes**

- `INDEX([chapterId])`

**Unique Keys**

- `UNIQUE([chapterId, slug])`

**Relationships:** Prisma relations: `chapter`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** May link video URL or rich content. DurationMinutes for planning.

**Validation Rules:** chapterId FK; title required.

**Example Data:** Newton’s Third Law — 25 minutes

#### Table `topics` (Prisma: `Topic`)

**Purpose:** Fine-grained topic tags inside lessons for question mapping.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| lessonId | String | — |
| title | String | — |
| content | String? | NULLABLE |
| sortOrder | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| lesson | Lesson | Relation |

**Indexes**

- `INDEX([lessonId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `lesson`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Used by question banks for adaptive practice.

**Validation Rules:** lessonId FK; name required.

**Example Data:** Action-Reaction pairs

#### Table `question_banks` (Prisma: `QuestionBank`)

**Purpose:** Container for practice/exam questions (by exam/board).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| title | String | — |
| slug | String | UNIQUE |
| examType | String? | NULLABLE |
| description | String? | NULLABLE |
| isPublished | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| questions | Question[] | — |
| mockTests | MockTest[] | — |

**Indexes**

- `INDEX([examType])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** Owned by program or platform. Soft-delete archives bank.

**Validation Rules:** name/slug required; programId optional FK.

**Example Data:** NEET Biology 2025 PYQ Bank

#### Table `mock_tests` (Prisma: `MockTest`)

**Purpose:** Timed mock examination definition.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| programId | String? | NULLABLE |
| questionBankId | String? | NULLABLE |
| title | String | — |
| slug | String | UNIQUE |
| durationMin | Int | — |
| totalMarks | Int | — |
| passingMarks | Int? | NULLABLE |
| isPublished | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| program | CoachingProgram? | Relation |
| questionBank | QuestionBank? | Relation |
| questions | Question[] | — |
| results | MockResult[] | — |
| leaderboard | LeaderboardEntry[] | — |

**Indexes**

- `INDEX([programId])`
- `INDEX([questionBankId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `program`, `questionBank`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** durationMinutes and totalMarks authoritative for scoring. Publish before attempts allowed.

**Validation Rules:** durationMinutes > 0; totalMarks > 0; programId/bank optional.

**Example Data:** NEET Full Syllabus Mock #4, 180 min, 720 marks

#### Table `questions` (Prisma: `Question`)

**Purpose:** Assessment question (MCQ or other).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| questionBankId | String? | NULLABLE |
| mockTestId | String? | NULLABLE |
| text | String | — |
| type | QuestionType | DEFAULT |
| difficulty | DifficultyLevel | DEFAULT |
| marks | Int | DEFAULT |
| explanation | String? | NULLABLE |
| sortOrder | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| questionBank | QuestionBank? | Relation |
| mockTest | MockTest? | Relation |
| options | QuestionOption[] | — |
| answers | StudentAnswer[] | — |

**Indexes**

- `INDEX([questionBankId])`
- `INDEX([mockTestId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `questionBank`, `mockTest`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Correctness derived via QuestionOption.isCorrect or answerKey for subjectives. Difficulty guides adaptive picks.

**Validation Rules:** bankId FK; stem required; marks > 0.

**Example Data:** MCQ Physics, marks=4, difficulty=MEDIUM

#### Table `question_options` (Prisma: `QuestionOption`)

**Purpose:** MCQ options for a question.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| questionId | String | — |
| label | String | — |
| text | String | — |
| isCorrect | Boolean | DEFAULT |
| sortOrder | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| question | Question | Relation |
| answers | StudentAnswer[] | — |

**Indexes**

- `INDEX([questionId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `question`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Exactly one isCorrect=true for single-answer MCQs (enforce in service).

**Validation Rules:** questionId FK; label/text required; sortOrder ≥ 0.

**Example Data:** A/B/C/D options with one correct

#### Table `student_answers` (Prisma: `StudentAnswer`)

**Purpose:** Immutable student response to a question in a mock attempt.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | — |
| questionId | String | — |
| selectedOptionId | String? | NULLABLE |
| textAnswer | String? | NULLABLE |
| isCorrect | Boolean? | NULLABLE |
| marksAwarded | Decimal? | NULLABLE, @db.Decimal(6, 2) |
| answeredAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |
| student | Student | Relation |
| question | Question | Relation |
| selectedOption | QuestionOption? | Relation |

**Indexes**

- `INDEX([studentId])`
- `INDEX([questionId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `student`, `question`, `selectedOption`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Insert-mostly; scoring updates isCorrect/marksAwarded. Do not delete scored answers.

**Validation Rules:** studentId, questionId, mockResultId FKs; marksAwarded ≥ 0.

**Example Data:** selectedOptionId=…, isCorrect=true, marksAwarded=4

#### Table `mock_results` (Prisma: `MockResult`)

**Purpose:** Aggregate score for a student’s mock attempt.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | — |
| mockTestId | String | — |
| score | Decimal | @db.Decimal(8, 2) |
| totalMarks | Int | — |
| percentile | Decimal? | NULLABLE, @db.Decimal(5, 2) |
| timeTakenSec | Int? | NULLABLE |
| completedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| student | Student | Relation |
| mockTest | MockTest | Relation |

**Indexes**

- `INDEX([studentId])`
- `INDEX([mockTestId])`

**Unique Keys**

- `UNIQUE([studentId, mockTestId])`

**Relationships:** Prisma relations: `student`, `mockTest`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** One result per attempt. Leaderboard derived from score/percentile.

**Validation Rules:** studentId + mockTestId FKs; score ≥ 0; percentage 0–100.

**Example Data:** score=612/720, percentage=85, percentile=92

#### Table `leaderboard_entries` (Prisma: `LeaderboardEntry`)

**Purpose:** Ranked leaderboard snapshot for a mock or program.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | — |
| mockTestId | String | — |
| rank | Int | — |
| score | Decimal | @db.Decimal(8, 2) |
| period | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| student | Student | Relation |
| mockTest | MockTest | Relation |

**Indexes**

- `INDEX([mockTestId, rank])`
- `INDEX([studentId])`

**Unique Keys**

- `UNIQUE([studentId, mockTestId, period])`

**Relationships:** Prisma relations: `student`, `mockTest`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Rebuild periodically; unique (mockTestId, studentId) for current board.

**Validation Rules:** rank ≥ 1; score ≥ 0.

**Example Data:** rank=1, score=680, student=…

### Module: College

#### Table `schools` (Prisma: `School`)

**Purpose:** School catalogue for Class 11–12 sourcing and profiles.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| name | String | — |
| slug | String | UNIQUE |
| board | String? | NULLABLE |
| city | String? | NULLABLE |
| state | String? | NULLABLE |
| country | String? | DEFAULT, NULLABLE |
| website | String? | NULLABLE |
| description | String? | NULLABLE |
| logoUrl | String? | NULLABLE |
| isVerified | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |

**Indexes**

- `INDEX([city, state])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** Reference data; soft-delete hides from search.

**Validation Rules:** name required; board/city/state optional.

**Example Data:** Delhi Public School, RK Puram, CBSE

#### Table `universities` (Prisma: `University`)

**Purpose:** Domestic university master records.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| name | String | — |
| slug | String | UNIQUE |
| city | String? | NULLABLE |
| state | String? | NULLABLE |
| country | String? | DEFAULT, NULLABLE |
| website | String? | NULLABLE |
| description | String? | NULLABLE |
| logoUrl | String? | NULLABLE |
| isVerified | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| colleges | College[] | — |

**Indexes**

- `INDEX([city, state])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** Parent of colleges when applicable; rankings may reference university or college.

**Validation Rules:** name required; code unique when present.

**Example Data:** Savirtibai Phule Pune University

#### Table `colleges` (Prisma: `College`)

**Purpose:** College catalogue for admissions discovery.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| universityId | String? | NULLABLE |
| name | String | — |
| slug | String | UNIQUE |
| code | String? | NULLABLE |
| type | String? | NULLABLE |
| city | String? | NULLABLE |
| state | String? | NULLABLE |
| country | String? | DEFAULT, NULLABLE |
| website | String? | NULLABLE |
| description | String? | NULLABLE |
| logoUrl | String? | NULLABLE |
| isVerified | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| university | University? | Relation |
| departments | Department[] | — |
| courses | CollegeCourse[] | — |
| rankings | CollegeRanking[] | — |
| reviews | CollegeReview[] | — |
| applications | CollegeApplication[] | — |
| scholarships | Scholarship[] | — |

**Indexes**

- `INDEX([universityId])`
- `INDEX([city, state])`
- `INDEX([isVerified])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `university`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Distinct from CollegeProfile (tenant login). verified flag for trust.

**Validation Rules:** name required; universityId optional FK.

**Example Data:** COEP Technological University, Pune

#### Table `college_profiles` (Prisma: `CollegeProfile`)

**Purpose:** Authenticated college-tenant profile (1:1 User role=COLLEGE).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | UNIQUE |
| collegeId | String? | NULLABLE |
| name | String | — |
| code | String? | NULLABLE |
| city | String? | NULLABLE |
| state | String? | NULLABLE |
| type | String? | NULLABLE |
| website | String? | NULLABLE |
| description | String? | NULLABLE |
| logoUrl | String? | NULLABLE |
| verified | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| user | User | Relation |

**Indexes**

- `INDEX([collegeId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Links User to a College catalogue row they manage.

**Validation Rules:** userId unique; collegeId FK required.

**Example Data:** college@ellowring.com manages COEP profile

#### Table `departments` (Prisma: `Department`)

**Purpose:** Academic departments inside a college.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| collegeId | String | — |
| name | String | — |
| slug | String | — |
| headName | String? | NULLABLE |
| description | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| college | College | Relation |
| courses | CollegeCourse[] | — |

**Indexes**

- `INDEX([collegeId])`

**Unique Keys**

- `UNIQUE([collegeId, slug])`

**Relationships:** Prisma relations: `college`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Owns CollegeCourse offerings.

**Validation Rules:** collegeId FK; name required; code unique per college preferred.

**Example Data:** Computer Engineering

#### Table `college_courses` (Prisma: `CollegeCourse`)

**Purpose:** Admission programme offered by a college/department (B.Tech CSE, …).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| collegeId | String | — |
| departmentId | String? | NULLABLE |
| name | String | — |
| slug | String | — |
| degree | String | — |
| duration | String? | NULLABLE |
| fees | Decimal? | NULLABLE, @db.Decimal(14, 2) |
| seats | Int | DEFAULT |
| eligibility | String? | NULLABLE |
| description | String? | NULLABLE |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| college | College | Relation |
| department | Department? | Relation |
| applications | CollegeApplication[] | — |
| scholarships | Scholarship[] | — |

**Indexes**

- `INDEX([collegeId])`
- `INDEX([departmentId])`

**Unique Keys**

- `UNIQUE([collegeId, slug])`

**Relationships:** Prisma relations: `college`, `department`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** seats and eligibility drive CollegeApplication capacity checks.

**Validation Rules:** collegeId FK; name/slug; durationYears > 0; seats ≥ 0.

**Example Data:** B.Tech Computer Science, seats=120, fees=150000

#### Table `college_rankings` (Prisma: `CollegeRanking`)

**Purpose:** Published ranking entries (NIRF etc.).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| collegeId | String | — |
| source | String | — |
| rank | Int | — |
| year | Int | — |
| category | String? | NULLABLE |
| score | Decimal? | NULLABLE, @db.Decimal(8, 2) |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| college | College | Relation |

**Indexes**

- `INDEX([collegeId])`
- `INDEX([year, rank])`

**Unique Keys**

- `UNIQUE([collegeId, source, year, category])`

**Relationships:** Prisma relations: `college`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** year + source define uniqueness with college/university.

**Validation Rules:** rank ≥ 1; year four-digit.

**Example Data:** NIRF 2025 Engineering rank=45

#### Table `college_reviews` (Prisma: `CollegeReview`)

**Purpose:** Student/alumni reviews of colleges.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| collegeId | String | — |
| userId | String? | NULLABLE |
| rating | Int | — |
| title | String? | NULLABLE |
| content | String? | NULLABLE |
| isVerified | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| college | College | Relation |

**Indexes**

- `INDEX([collegeId])`
- `INDEX([rating])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `college`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Moderation via isPublished. Rating 1–5.

**Validation Rules:** collegeId FK; rating 1–5; body length limits in app.

**Example Data:** rating=4, title=Strong placement cell

#### Table `college_applications` (Prisma: `CollegeApplication`)

**Purpose:** Student application to a college course.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | — |
| collegeId | String | — |
| courseId | String? | NULLABLE |
| status | AdmissionStatus | DEFAULT |
| applicationNo | String? | UNIQUE, NULLABLE |
| documents | Json? | NULLABLE |
| submittedAt | DateTime? | NULLABLE |
| decisionAt | DateTime? | NULLABLE |
| notes | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| user | User | Relation |
| college | College | Relation |
| course | CollegeCourse? | Relation |

**Indexes**

- `INDEX([userId])`
- `INDEX([collegeId])`
- `INDEX([courseId])`
- `INDEX([status])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`, `college`, `course`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Status machine: DRAFT→SUBMITTED→…→ACCEPTED/REJECTED/WITHDRAWN. Unique open application per student+course.

**Validation Rules:** student User or Student FK + collegeCourseId; status AdmissionStatus.

**Example Data:** status=UNDER_REVIEW for B.Tech CSE at COEP

#### Table `scholarships` (Prisma: `Scholarship`)

**Purpose:** Scholarship catalogue and eligibility summary.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| collegeId | String? | NULLABLE |
| courseId | String? | NULLABLE |
| title | String | — |
| amount | Decimal? | NULLABLE, @db.Decimal(14, 2) |
| percentage | Decimal? | NULLABLE, @db.Decimal(5, 2) |
| eligibility | String? | NULLABLE |
| deadline | DateTime? | NULLABLE |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| college | College? | Relation |
| course | CollegeCourse? | Relation |

**Indexes**

- `INDEX([collegeId])`
- `INDEX([courseId])`
- `INDEX([deadline])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `college`, `course`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Linked to college or platform-wide. amount Decimal.

**Validation Rules:** title required; amount ≥ 0; dates coherent.

**Example Data:** Merit Scholarship 50000 INR, deadline=2026-06-30

### Module: Study Abroad

#### Table `countries` (Prisma: `Country`)

**Purpose:** Study-abroad country reference.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| name | String | UNIQUE |
| code | String | UNIQUE |
| currency | String? | NULLABLE |
| flagUrl | String? | NULLABLE |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| universities | AbroadUniversity[] | — |
| visaRules | VisaRequirement[] | — |

**Indexes**

- Primary key index on `id` (and `@unique` columns as declared).

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** ISO country codes preferred (iso2/iso3).

**Validation Rules:** name/iso unique; currency code optional.

**Example Data:** United States, US, USD

#### Table `abroad_universities` (Prisma: `AbroadUniversity`)

**Purpose:** International university catalogue.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| countryId | String | — |
| name | String | — |
| slug | String | UNIQUE |
| city | String? | NULLABLE |
| ranking | Int? | NULLABLE |
| website | String? | NULLABLE |
| description | String? | NULLABLE |
| logoUrl | String? | NULLABLE |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| country | Country | Relation |
| programs | AbroadProgram[] | — |

**Indexes**

- `INDEX([countryId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `country`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Scoped under Country. Soft-delete archives listings.

**Validation Rules:** countryId FK; name required.

**Example Data:** University of Toronto, Canada

#### Table `abroad_programs` (Prisma: `AbroadProgram`)

**Purpose:** International degree/program offering.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| universityId | String | — |
| name | String | — |
| slug | String | UNIQUE |
| degree | String | — |
| duration | String? | NULLABLE |
| tuition | Decimal? | NULLABLE, @db.Decimal(14, 2) |
| currency | String? | DEFAULT, NULLABLE |
| intake | String? | NULLABLE |
| description | String? | NULLABLE |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| university | AbroadUniversity | Relation |
| eligibility | EligibilityRule[] | — |
| applications | AbroadApplication[] | — |

**Indexes**

- `INDEX([universityId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `university`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** tuitionFee Decimal; intake seasons in metadata/fields.

**Validation Rules:** universityId FK; name required; tuition ≥ 0.

**Example Data:** MSc Computer Science, tuition=45000 CAD

#### Table `eligibility_rules` (Prisma: `EligibilityRule`)

**Purpose:** Eligibility criteria for an abroad program.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| programId | String | — |
| ruleType | String | — |
| ruleValue | String | — |
| description | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| program | AbroadProgram | Relation |

**Indexes**

- `INDEX([programId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `program`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Evaluated by guidance/admissions services before submit.

**Validation Rules:** programId FK; ruleType + expression/value required.

**Example Data:** IELTS >= 6.5 overall

#### Table `visa_requirements` (Prisma: `VisaRequirement`)

**Purpose:** Visa checklist items for a country/program path.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| countryId | String | — |
| visaType | String | — |
| requirements | String? | NULLABLE |
| processingDays | Int? | NULLABLE |
| fee | Decimal? | NULLABLE, @db.Decimal(14, 2) |
| currency | String? | DEFAULT, NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| country | Country | Relation |

**Indexes**

- `INDEX([countryId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `country`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Displayed in application document checklist.

**Validation Rules:** countryId FK; title required.

**Example Data:** Proof of funds, valid passport > 6 months

#### Table `abroad_applications` (Prisma: `AbroadApplication`)

**Purpose:** Student study-abroad application case.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | — |
| programId | String | — |
| status | AbroadApplicationStatus | DEFAULT |
| applicationNo | String? | UNIQUE, NULLABLE |
| submittedAt | DateTime? | NULLABLE |
| decisionAt | DateTime? | NULLABLE |
| notes | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| user | User | Relation |
| program | AbroadProgram | Relation |
| documents | AbroadDocument[] | — |

**Indexes**

- `INDEX([userId])`
- `INDEX([programId])`
- `INDEX([status])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`, `program`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Status AbroadApplicationStatus state machine. Documents attach via AbroadDocument.

**Validation Rules:** userId + programId FKs; status enum.

**Example Data:** status=DOCUMENTS_PENDING for UofT MSc

#### Table `abroad_documents` (Prisma: `AbroadDocument`)

**Purpose:** Uploaded documents for an abroad application.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| applicationId | String | — |
| docType | String | — |
| fileName | String | — |
| fileUrl | String | — |
| verified | Boolean | DEFAULT |
| uploadedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| application | AbroadApplication | Relation |

**Indexes**

- `INDEX([applicationId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `application`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** status PENDING/APPROVED/REJECTED by counselor. Store fileUrl in object storage.

**Validation Rules:** applicationId FK; docType + fileUrl required.

**Example Data:** docType=TRANSCRIPT, status=APPROVED

### Module: Learning

#### Table `course_categories` (Prisma: `CourseCategory`)

**Purpose:** Learning course taxonomy.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| name | String | UNIQUE |
| slug | String | UNIQUE |
| description | String? | NULLABLE |
| iconUrl | String? | NULLABLE |
| sortOrder | Int | DEFAULT |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| courses | Course[] | — |

**Indexes**

- Primary key index on `id` (and `@unique` columns as declared).

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** Catalogue; soft-delete hides category.

**Validation Rules:** slug unique.

**Example Data:** Full Stack Development, slug=full-stack

#### Table `courses` (Prisma: `Course`)

**Purpose:** Sellable/publishable learning course (LMS).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| categoryId | String | — |
| trainingCenterId | String? | NULLABLE |
| title | String | — |
| slug | String | UNIQUE |
| level | String | — |
| duration | String? | NULLABLE |
| price | Decimal | DEFAULT, @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| description | String? | NULLABLE |
| thumbnail | String? | NULLABLE |
| isPublished | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| createdById | String? | NULLABLE |
| updatedById | String? | NULLABLE |
| category | CourseCategory | Relation |
| trainingCenter | TrainingCenter? | Relation |
| modules | CourseModule[] | — |
| assignments | Assignment[] | — |
| assessments | Assessment[] | — |
| certificates | CourseCertificate[] | — |
| downloads | CourseDownload[] | — |
| enrollments | CourseEnrollment[] | — |

**Indexes**

- `INDEX([categoryId])`
- `INDEX([trainingCenterId])`
- `INDEX([isPublished])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `category`, `trainingCenter`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** May be owned by TrainingCenter. isPublished controls storefront. Distinct from CollegeCourse.

**Validation Rules:** slug unique; price ≥ 0; categoryId FK optional.

**Example Data:** React + Nest Bootcamp, price=7999

#### Table `course_modules` (Prisma: `CourseModule`)

**Purpose:** Module section within a course.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| courseId | String | — |
| title | String | — |
| slug | String | — |
| description | String? | NULLABLE |
| sortOrder | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| course | Course | Relation |
| lessons | CourseLesson[] | — |

**Indexes**

- `INDEX([courseId])`

**Unique Keys**

- `UNIQUE([courseId, slug])`

**Relationships:** Prisma relations: `course`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Ordered modules gate lesson unlocks optionally.

**Validation Rules:** courseId FK; sortOrder ≥ 0.

**Example Data:** Module 1 — TypeScript Fundamentals

#### Table `course_lessons` (Prisma: `CourseLesson`)

**Purpose:** Lesson within a course module.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| moduleId | String | — |
| title | String | — |
| slug | String | — |
| content | String? | NULLABLE |
| durationMin | Int? | NULLABLE |
| sortOrder | Int | DEFAULT |
| isFree | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| module | CourseModule | Relation |
| videos | CourseVideo[] | — |

**Indexes**

- `INDEX([moduleId])`

**Unique Keys**

- `UNIQUE([moduleId, slug])`

**Relationships:** Prisma relations: `module`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** May have videos, assignments, assessments.

**Validation Rules:** moduleId FK; title required.

**Example Data:** Generics & Utility Types

#### Table `course_videos` (Prisma: `CourseVideo`)

**Purpose:** Video asset metadata for a lesson.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| lessonId | String | — |
| title | String | — |
| videoUrl | String | — |
| durationSec | Int? | NULLABLE |
| sortOrder | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| lesson | CourseLesson | Relation |

**Indexes**

- `INDEX([lessonId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `lesson`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Store CDN URL; durationSeconds for progress calc.

**Validation Rules:** lessonId FK; url required; duration ≥ 0.

**Example Data:** url=https://cdn…/lesson1.mp4, duration=720

#### Table `assignments` (Prisma: `Assignment`)

**Purpose:** Course assignment definition.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| courseId | String | — |
| title | String | — |
| description | String? | NULLABLE |
| dueDate | DateTime? | NULLABLE |
| maxScore | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| course | Course | Relation |

**Indexes**

- `INDEX([courseId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `course`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Due dates optional; submissions tracked in app layer / project module as needed.

**Validation Rules:** courseId/lessonId FK; title required.

**Example Data:** Build a REST API with NestJS

#### Table `assessments` (Prisma: `Assessment`)

**Purpose:** Course quiz/assessment definition.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| courseId | String | — |
| title | String | — |
| description | String? | NULLABLE |
| durationMin | Int? | NULLABLE |
| maxScore | Int | DEFAULT |
| passingScore | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| course | Course | Relation |

**Indexes**

- `INDEX([courseId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `course`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Distinct from coaching MockTest; course-scoped grading.

**Validation Rules:** courseId FK; passPercent 0–100.

**Example Data:** Module 2 Quiz, passPercent=70

#### Table `course_certificates` (Prisma: `CourseCertificate`)

**Purpose:** Certificate issued on course completion.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| courseId | String | — |
| enrollmentId | String? | UNIQUE, NULLABLE |
| templateUrl | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| course | Course | Relation |
| enrollment | CourseEnrollment? | Relation |

**Indexes**

- `INDEX([courseId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `course`, `enrollment`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Generate after enrollment progress=100 and assessments passed.

**Validation Rules:** enrollmentId/user unique constraints as designed; certificateNo unique.

**Example Data:** ELW-COURSE-2026-00118

#### Table `course_downloads` (Prisma: `CourseDownload`)

**Purpose:** Downloadable resources attached to a course/lesson.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| courseId | String | — |
| title | String | — |
| fileUrl | String | — |
| fileSize | Int? | NULLABLE |
| sortOrder | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| course | Course | Relation |

**Indexes**

- `INDEX([courseId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `course`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Access gated by enrollment entitlement.

**Validation Rules:** courseId FK; fileUrl required.

**Example Data:** Cheat sheet PDF for SQL joins

#### Table `enrollments` (Prisma: `CourseEnrollment`)

**Purpose:** Student enrollment and progress in a learning course.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | — |
| courseId | String | — |
| status | EnrollmentStatus | DEFAULT |
| progressPct | Int | DEFAULT |
| enrolledAt | DateTime | DEFAULT |
| completedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| student | Student | Relation |
| course | Course | Relation |
| certificate | CourseCertificate? | NULLABLE |

**Indexes**

- `INDEX([studentId])`
- `INDEX([courseId])`

**Unique Keys**

- `UNIQUE([studentId, courseId])`

**Relationships:** Prisma relations: `student`, `course`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Unique (studentId, courseId). progress 0–100. Payment may gate ACTIVE status.

**Validation Rules:** FKs required; progress 0–100.

**Example Data:** student@… in React Bootcamp, progress=40, status=ACTIVE

### Module: Internship

#### Table `companies` (Prisma: `Company`)

**Purpose:** Employer/organization tenant posting jobs, internships, projects.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | UNIQUE |
| name | String | — |
| industry | String? | NULLABLE |
| size | String? | NULLABLE |
| city | String? | NULLABLE |
| state | String? | NULLABLE |
| website | String? | NULLABLE |
| description | String? | NULLABLE |
| logoUrl | String? | NULLABLE |
| verified | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| user | User | Relation |
| internships | Internship[] | — |
| projects | Project[] | — |
| jobs | Job[] | — |
| hrUsers | HrUser[] | — |
| employees | Employee[] | — |
| mentors | Mentor[] | — |

**Indexes**

- `INDEX([industry])`
- `INDEX([verified])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** 1:1 with User when role=COMPANY. verified required before high-trust actions (offers/payroll).

**Validation Rules:** userId unique; name required.

**Example Data:** Ellowring Labs Pvt Ltd, industry=IT, city=Bengaluru

#### Table `internships` (Prisma: `Internship`)

**Purpose:** Internship opening posted by a company.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| companyId | String | — |
| title | String | — |
| slug | String | UNIQUE |
| location | String? | NULLABLE |
| mode | WorkMode | DEFAULT |
| stipend | Decimal? | NULLABLE, @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| duration | String? | NULLABLE |
| description | String? | NULLABLE |
| skills | String? | NULLABLE |
| openings | Int | DEFAULT |
| isActive | Boolean | DEFAULT |
| startsAt | DateTime? | NULLABLE |
| endsAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| createdById | String? | NULLABLE |
| updatedById | String? | NULLABLE |
| company | Company | Relation |
| applications | InternshipApplication[] | — |
| offers | InternshipOffer[] | — |
| progress | InternshipProgress[] | — |
| feedback | InternshipFeedback[] | — |
| mentors | Mentor[] | — |

**Indexes**

- `INDEX([companyId])`
- `INDEX([isActive])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `company`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** stipend Decimal; workMode/EmploymentType enums; applications close after deadline.

**Validation Rules:** companyId FK; title required; seats ≥ 1 when limited.

**Example Data:** Backend Intern, stipend=15000, HYBRID, 3 months

#### Table `internship_applications` (Prisma: `InternshipApplication`)

**Purpose:** Student application to an internship.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | — |
| studentId | String | — |
| internshipId | String | — |
| status | ApplicationStatus | DEFAULT |
| coverLetter | String? | NULLABLE |
| resumeUrl | String? | NULLABLE |
| appliedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| user | User | Relation |
| student | Student | Relation |
| internship | Internship | Relation |
| offers | InternshipOffer[] | — |

**Indexes**

- `INDEX([userId])`
- `INDEX([internshipId])`
- `INDEX([status])`

**Unique Keys**

- `UNIQUE([studentId, internshipId])`

**Relationships:** Prisma relations: `user`, `student`, `internship`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** ApplicationStatus state machine. Unique (student/user, internshipId).

**Validation Rules:** FKs required; status enum.

**Example Data:** status=SHORTLISTED

#### Table `internship_offers` (Prisma: `InternshipOffer`)

**Purpose:** Offer letter lifecycle for internship.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| applicationId | String | — |
| internshipId | String | — |
| stipend | Decimal? | NULLABLE, @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| startDate | DateTime? | NULLABLE |
| endDate | DateTime? | NULLABLE |
| status | InternshipOfferStatus | DEFAULT |
| offeredAt | DateTime | DEFAULT |
| respondedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| application | InternshipApplication | Relation |
| internship | Internship | Relation |

**Indexes**

- `INDEX([applicationId])`
- `INDEX([internshipId])`
- `INDEX([status])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `application`, `internship`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** InternshipOfferStatus: PENDING→ACCEPTED/DECLINED/EXPIRED/REVOKED.

**Validation Rules:** applicationId unique/FK; stipend ≥ 0; expiresAt > offeredAt.

**Example Data:** status=PENDING, expiresAt=+7d

#### Table `internship_progress` (Prisma: `InternshipProgress`)

**Purpose:** Milestone tracking during active internship.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | — |
| internshipId | String | — |
| weekNumber | Int | — |
| summary | String? | NULLABLE |
| tasksDone | String? | NULLABLE |
| hoursLogged | Decimal? | NULLABLE, @db.Decimal(6, 2) |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| student | Student | Relation |
| internship | Internship | Relation |

**Indexes**

- `INDEX([studentId])`
- `INDEX([internshipId])`

**Unique Keys**

- `UNIQUE([studentId, internshipId, weekNumber])`

**Relationships:** Prisma relations: `student`, `internship`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Updated by mentor/HR; percent 0–100.

**Validation Rules:** internship/application FK; percentComplete 0–100.

**Example Data:** percentComplete=50, milestone=Mid-term demo

#### Table `mentors` (Prisma: `Mentor`)

**Purpose:** Mentor profiles associated with company/programs.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| companyId | String | — |
| internshipId | String? | NULLABLE |
| name | String | — |
| email | String? | NULLABLE |
| phone | String? | NULLABLE |
| designation | String? | NULLABLE |
| bio | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| company | Company | Relation |
| internship | Internship? | Relation |

**Indexes**

- `INDEX([companyId])`
- `INDEX([internshipId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `company`, `internship`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** May advise internships and projects.

**Validation Rules:** companyId FK optional; email unique when present.

**Example Data:** name=Rahul Mehta, title=Staff Engineer

#### Table `internship_feedback` (Prisma: `InternshipFeedback`)

**Purpose:** Feedback from mentor/HR on intern performance.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | — |
| internshipId | String | — |
| rating | Int | — |
| comment | String? | NULLABLE |
| givenBy | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| student | Student | Relation |
| internship | Internship | Relation |

**Indexes**

- `INDEX([studentId])`
- `INDEX([internshipId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `student`, `internship`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Rating 1–5; visible to student after publish.

**Validation Rules:** applicationId FK; rating 1–5.

**Example Data:** rating=5, comment=Strong ownership

### Module: Project

#### Table `project_categories` (Prisma: `ProjectCategory`)

**Purpose:** Live-project taxonomy.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| name | String | UNIQUE |
| slug | String | UNIQUE |
| description | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| projects | Project[] | — |

**Indexes**

- Primary key index on `id` (and `@unique` columns as declared).

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** Catalogue soft-delete.

**Validation Rules:** slug unique.

**Example Data:** slug=saas-mvp

#### Table `projects` (Prisma: `Project`)

**Purpose:** Company live project for student teams.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| companyId | String | — |
| categoryId | String? | NULLABLE |
| title | String | — |
| slug | String | UNIQUE |
| domain | String? | NULLABLE |
| description | String? | NULLABLE |
| duration | String? | NULLABLE |
| stipend | Decimal? | NULLABLE, @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| teamSize | Int | DEFAULT |
| isActive | Boolean | DEFAULT |
| deadline | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| createdById | String? | NULLABLE |
| updatedById | String? | NULLABLE |
| company | Company | Relation |
| category | ProjectCategory? | Relation |
| technologies | ProjectTechnology[] | — |
| teamMembers | ProjectTeamMember[] | — |
| submissions | ProjectSubmission[] | — |

**Indexes**

- `INDEX([companyId])`
- `INDEX([categoryId])`
- `INDEX([isActive])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `company`, `category`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Budget/reward Decimal; team capacity enforced via ProjectTeamMember count.

**Validation Rules:** companyId FK; title required.

**Example Data:** Build Analytics Dashboard, reward=25000

#### Table `project_technologies` (Prisma: `ProjectTechnology`)

**Purpose:** Tech tags required/used by a project.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| projectId | String | — |
| technology | String | — |
| createdAt | DateTime | DEFAULT |
| project | Project | Relation |

**Indexes**

- `INDEX([projectId])`

**Unique Keys**

- `UNIQUE([projectId, technology])`

**Relationships:** Prisma relations: `project`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Inform skill matching.

**Validation Rules:** projectId FK; name required; unique per project.

**Example Data:** Next.js, PostgreSQL, Prisma

#### Table `project_team_members` (Prisma: `ProjectTeamMember`)

**Purpose:** Students assigned to a project team.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| projectId | String | — |
| studentId | String | — |
| role | String | DEFAULT |
| joinedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| project | Project | Relation |
| student | Student | Relation |

**Indexes**

- `INDEX([projectId])`
- `INDEX([studentId])`

**Unique Keys**

- `UNIQUE([projectId, studentId])`

**Relationships:** Prisma relations: `project`, `student`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Unique (projectId, studentId); role LEAD/MEMBER.

**Validation Rules:** FKs required.

**Example Data:** role=LEAD for student@…

#### Table `project_submissions` (Prisma: `ProjectSubmission`)

**Purpose:** Team deliverable submission for evaluation.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| projectId | String | — |
| studentId | String | — |
| title | String | — |
| description | String? | NULLABLE |
| repoUrl | String? | NULLABLE |
| demoUrl | String? | NULLABLE |
| fileUrl | String? | NULLABLE |
| status | ProjectSubmissionStatus | DEFAULT |
| submittedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| project | Project | Relation |
| student | Student | Relation |
| evaluations | ProjectEvaluation[] | — |

**Indexes**

- `INDEX([projectId])`
- `INDEX([studentId])`
- `INDEX([status])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `project`, `student`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Versioned submissions allowed; latest flagged in app.

**Validation Rules:** projectId FK; repoUrl or artifactUrl required.

**Example Data:** repoUrl=github.com/…, submittedAt=now

#### Table `project_evaluations` (Prisma: `ProjectEvaluation`)

**Purpose:** Scoring and feedback for a submission.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| submissionId | String | — |
| evaluatorId | String? | NULLABLE |
| score | Decimal | @db.Decimal(6, 2) |
| maxScore | Int | DEFAULT |
| feedback | String? | NULLABLE |
| evaluatedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| submission | ProjectSubmission | Relation |

**Indexes**

- `INDEX([submissionId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `submission`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** score 0–100; evaluator is mentor/HR user.

**Validation Rules:** submissionId FK; score 0–100.

**Example Data:** score=88, feedback=Solid architecture

### Module: Job

#### Table `hr_users` (Prisma: `HrUser`)

**Purpose:** HR user profile under a company (hiring ops).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | UNIQUE |
| companyId | String | — |
| designation | String? | NULLABLE |
| department | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| user | User | Relation |
| company | Company | Relation |
| jobs | Job[] | — |
| interviews | Interview[] | — |

**Indexes**

- `INDEX([companyId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`, `company`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Multiple HR users per company; tied to User account.

**Validation Rules:** userId unique; companyId FK.

**Example Data:** hr@ellowring.com for Ellowring Labs

#### Table `jobs` (Prisma: `Job`)

**Purpose:** Full-time/part-time job opening.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| companyId | String | — |
| hrUserId | String? | NULLABLE |
| title | String | — |
| slug | String | UNIQUE |
| location | String? | NULLABLE |
| type | EmploymentType | DEFAULT |
| mode | WorkMode | DEFAULT |
| salaryMin | Decimal? | NULLABLE, @db.Decimal(14, 2) |
| salaryMax | Decimal? | NULLABLE, @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| experience | String? | NULLABLE |
| description | String? | NULLABLE |
| skills | String? | NULLABLE |
| openings | Int | DEFAULT |
| isActive | Boolean | DEFAULT |
| expiresAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| createdById | String? | NULLABLE |
| updatedById | String? | NULLABLE |
| company | Company | Relation |
| hrUser | HrUser? | Relation |
| applications | JobApplication[] | — |
| savedBy | SavedJob[] | — |
| interviews | Interview[] | — |
| offers | JobOffer[] | — |

**Indexes**

- `INDEX([companyId])`
- `INDEX([hrUserId])`
- `INDEX([isActive])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `company`, `hrUser`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** salaryMin/Max Decimal; EmploymentType + WorkMode; close applications after expiresAt.

**Validation Rules:** companyId FK; title required; salaryMin ≤ salaryMax when both set.

**Example Data:** Junior Backend Engineer, 6–10 LPA, HYBRID

#### Table `job_applications` (Prisma: `JobApplication`)

**Purpose:** Candidate application to a job.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | — |
| jobId | String | — |
| status | ApplicationStatus | DEFAULT |
| coverLetter | String? | NULLABLE |
| resumeUrl | String? | NULLABLE |
| appliedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| user | User | Relation |
| job | Job | Relation |
| interviews | Interview[] | — |
| offers | JobOffer[] | — |

**Indexes**

- `INDEX([userId])`
- `INDEX([jobId])`
- `INDEX([status])`

**Unique Keys**

- `UNIQUE([userId, jobId])`

**Relationships:** Prisma relations: `user`, `job`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** ApplicationStatus machine; unique per user+job.

**Validation Rules:** FKs; status enum.

**Example Data:** status=INTERVIEW

#### Table `saved_jobs` (Prisma: `SavedJob`)

**Purpose:** User-saved jobs for later apply.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | — |
| jobId | String | — |
| createdAt | DateTime | DEFAULT |
| user | User | Relation |
| job | Job | Relation |

**Indexes**

- `INDEX([userId])`
- `INDEX([jobId])`

**Unique Keys**

- `UNIQUE([userId, jobId])`

**Relationships:** Prisma relations: `user`, `job`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Composite unique (userId, jobId).

**Validation Rules:** FKs required.

**Example Data:** student@… saved Junior Backend Engineer

#### Table `interviews` (Prisma: `Interview`)

**Purpose:** Interview rounds scheduled against a job application.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| jobId | String | — |
| applicationId | String | — |
| hrUserId | String? | NULLABLE |
| scheduledAt | DateTime | — |
| durationMin | Int | DEFAULT |
| mode | WorkMode | DEFAULT |
| meetingUrl | String? | NULLABLE |
| status | InterviewStatus | DEFAULT |
| notes | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| job | Job | Relation |
| application | JobApplication | Relation |
| hrUser | HrUser? | Relation |

**Indexes**

- `INDEX([jobId])`
- `INDEX([applicationId])`
- `INDEX([scheduledAt])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `job`, `application`, `hrUser`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Multiple rounds allowed; store mode VIDEO/ONSITE; feedback after completion.

**Validation Rules:** applicationId FK; scheduledAt required.

**Example Data:** round=TECHNICAL, scheduledAt=2026-04-10T10:00Z

#### Table `job_offers` (Prisma: `JobOffer`)

**Purpose:** Employment offer for a job application.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| jobId | String | — |
| applicationId | String | — |
| salary | Decimal | @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| joiningDate | DateTime? | NULLABLE |
| status | JobOfferStatus | DEFAULT |
| offeredAt | DateTime | DEFAULT |
| respondedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| job | Job | Relation |
| application | JobApplication | Relation |

**Indexes**

- `INDEX([jobId])`
- `INDEX([applicationId])`
- `INDEX([status])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `job`, `application`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** JobOfferStatus state machine; CTC Decimal; acceptance creates Employee optionally.

**Validation Rules:** applicationId FK; ctc ≥ 0; status enum.

**Example Data:** ctc=900000, status=PENDING

#### Table `employees` (Prisma: `Employee`)

**Purpose:** Hired employee record under a company (post-offer).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| companyId | String | — |
| employeeNo | String | — |
| name | String | — |
| email | String? | NULLABLE |
| phone | String? | NULLABLE |
| designation | String? | NULLABLE |
| department | String? | NULLABLE |
| salary | Decimal? | NULLABLE, @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| joinedAt | DateTime? | NULLABLE |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| company | Company | Relation |
| payrollItems | PayrollItem[] | — |

**Indexes**

- `INDEX([companyId])`

**Unique Keys**

- `UNIQUE([companyId, employeeNo])`

**Relationships:** Prisma relations: `company`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Links user/candidate to payroll. employeeCode unique per company.

**Validation Rules:** companyId FK; joiningDate required; salary Decimal ≥ 0.

**Example Data:** employeeCode=ELW-E-0042, salary=75000 monthly

#### Table `payroll_runs` (Prisma: `PayrollRun`)

**Purpose:** Monthly/period payroll batch for a company.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| companyId | String? | NULLABLE |
| periodStart | DateTime | — |
| periodEnd | DateTime | — |
| status | PayrollRunStatus | DEFAULT |
| totalAmount | Decimal? | NULLABLE, @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| processedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| items | PayrollItem[] | — |

**Indexes**

- `INDEX([periodStart, periodEnd])`
- `INDEX([status])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** Immutable once status=PROCESSED. Contains PayrollItems.

**Validation Rules:** companyId FK; periodStart < periodEnd.

**Example Data:** Aug 2026 payroll, status=DRAFT

#### Table `payroll_items` (Prisma: `PayrollItem`)

**Purpose:** Per-employee line in a payroll run.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| payrollRunId | String | — |
| employeeId | String | — |
| grossPay | Decimal | @db.Decimal(14, 2) |
| deductions | Decimal | DEFAULT, @db.Decimal(14, 2) |
| netPay | Decimal | @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| payrollRun | PayrollRun | Relation |
| employee | Employee | Relation |

**Indexes**

- `INDEX([payrollRunId])`
- `INDEX([employeeId])`

**Unique Keys**

- `UNIQUE([payrollRunId, employeeId])`

**Relationships:** Prisma relations: `payrollRun`, `employee`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** gross/net Decimal; deductions breakdown in JSON metadata.

**Validation Rules:** payrollRunId + employeeId FKs; amounts ≥ 0; net ≤ gross.

**Example Data:** gross=75000, net=68000

### Module: Training

#### Table `training_centers` (Prisma: `TrainingCenter`)

**Purpose:** Training partner organisation (role=TRAINING user).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | UNIQUE |
| name | String | — |
| specialty | String? | NULLABLE |
| city | String? | NULLABLE |
| state | String? | NULLABLE |
| website | String? | NULLABLE |
| description | String? | NULLABLE |
| logoUrl | String? | NULLABLE |
| verified | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| user | User | Relation |
| trainers | Trainer[] | — |
| programs | TrainingProgram[] | — |
| courses | Course[] | — |
| revenue | TrainingRevenue[] | — |

**Indexes**

- `INDEX([city, state])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Owns programs, batches, trainers, courses. verified for payouts.

**Validation Rules:** userId unique; name required.

**Example Data:** training@ellowring.com → Ellowring Skill Hub Pune

#### Table `trainers` (Prisma: `Trainer`)

**Purpose:** Trainer staff under a training center.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| trainingCenterId | String | — |
| name | String | — |
| email | String? | NULLABLE |
| phone | String? | NULLABLE |
| specialty | String? | NULLABLE |
| bio | String? | NULLABLE |
| avatarUrl | String? | NULLABLE |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| trainingCenter | TrainingCenter | Relation |
| batches | TrainingBatch[] | — |

**Indexes**

- `INDEX([trainingCenterId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `trainingCenter`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Assigned to batches/programs.

**Validation Rules:** centerId FK; email unique when set.

**Example Data:** name=Priya Nair, specialty=Data Science

#### Table `training_programs` (Prisma: `TrainingProgram`)

**Purpose:** Training programme catalogue at a center.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| trainingCenterId | String | — |
| title | String | — |
| slug | String | UNIQUE |
| description | String? | NULLABLE |
| duration | String? | NULLABLE |
| price | Decimal | DEFAULT, @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| trainingCenter | TrainingCenter | Relation |
| batches | TrainingBatch[] | — |
| assignments | TrainingAssignment[] | — |

**Indexes**

- `INDEX([trainingCenterId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `trainingCenter`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Fee Decimal; duration; linked batches.

**Validation Rules:** centerId FK; title required; fee ≥ 0.

**Example Data:** Full Stack 16-week Intensive, fee=45000

#### Table `training_batches` (Prisma: `TrainingBatch`)

**Purpose:** Scheduled cohort for a training program.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| programId | String | — |
| trainerId | String? | NULLABLE |
| name | String | — |
| startDate | DateTime | — |
| endDate | DateTime? | NULLABLE |
| capacity | Int | DEFAULT |
| enrolled | Int | DEFAULT |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| program | TrainingProgram | Relation |
| trainer | Trainer? | Relation |
| attendance | AttendanceRecord[] | — |

**Indexes**

- `INDEX([programId])`
- `INDEX([trainerId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `program`, `trainer`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** capacity limits enrollments; start/end dates required.

**Validation Rules:** programId FK; capacity > 0; startDate < endDate.

**Example Data:** Batch FS-2026-A, capacity=40

#### Table `attendance_records` (Prisma: `AttendanceRecord`)

**Purpose:** Student attendance for a batch session day.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| batchId | String | — |
| studentId | String | — |
| date | DateTime | — |
| status | AttendanceStatus | DEFAULT |
| notes | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| batch | TrainingBatch | Relation |
| student | Student | Relation |

**Indexes**

- `INDEX([batchId])`
- `INDEX([studentId])`

**Unique Keys**

- `UNIQUE([batchId, studentId, date])`

**Relationships:** Prisma relations: `batch`, `student`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Unique (batchId, studentId, sessionDate). PRESENT/ABSENT/LATE.

**Validation Rules:** FKs; sessionDate required.

**Example Data:** status=PRESENT, sessionDate=2026-02-01

#### Table `training_assignments` (Prisma: `TrainingAssignment`)

**Purpose:** Assignments issued to a training batch.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| programId | String | — |
| studentId | String | — |
| title | String | — |
| description | String? | NULLABLE |
| dueDate | DateTime? | NULLABLE |
| submittedAt | DateTime? | NULLABLE |
| score | Decimal? | NULLABLE, @db.Decimal(6, 2) |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| program | TrainingProgram | Relation |
| student | Student | Relation |

**Indexes**

- `INDEX([programId])`
- `INDEX([studentId])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `program`, `student`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Due dates; submissions tracked in app or linked project submissions.

**Validation Rules:** batchId FK; title required.

**Example Data:** Capstone proposal due=+14d

#### Table `training_revenue` (Prisma: `TrainingRevenue`)

**Purpose:** Revenue recognition entries for training center.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| trainingCenterId | String | — |
| periodMonth | Int | — |
| periodYear | Int | — |
| grossRevenue | Decimal | @db.Decimal(14, 2) |
| netRevenue | Decimal | @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| trainingCenter | TrainingCenter | Relation |

**Indexes**

- `INDEX([trainingCenterId])`

**Unique Keys**

- `UNIQUE([trainingCenterId, periodMonth, periodYear])`

**Relationships:** Prisma relations: `trainingCenter`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Reconcile with Payments. amount Decimal; period tagged.

**Validation Rules:** centerId FK; amount ≥ 0.

**Example Data:** amount=180000 for Batch FS-2026-A fees

### Module: Channel Partner

#### Table `partners` (Prisma: `Partner`)

**Purpose:** Channel partner tenant (role=PARTNER).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | UNIQUE |
| name | String | — |
| region | String? | NULLABLE |
| referralCode | String | UNIQUE |
| commissionPct | Decimal | DEFAULT, @db.Decimal(5, 2) |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| user | User | Relation |
| leads | PartnerLead[] | — |
| referrals | Referral[] | — |
| wallet | PartnerWallet? | NULLABLE |
| commissions | Commission[] | — |
| payouts | Payout[] | — |
| reports | PartnerReport[] | — |

**Indexes**

- `INDEX([referralCode])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** referralCode unique drives attribution. commissionPct default policy.

**Validation Rules:** userId unique; referralCode unique; commissionPct 0–100.

**Example Data:** partner@ellowring.com, referralCode=ELW-PARTNER-01, commissionPct=10

#### Table `partner_leads` (Prisma: `PartnerLead`)

**Purpose:** Leads captured by channel partners.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| partnerId | String | — |
| name | String | — |
| email | String? | NULLABLE |
| phone | String? | NULLABLE |
| source | String? | NULLABLE |
| status | String | DEFAULT |
| notes | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| partner | Partner | Relation |

**Indexes**

- `INDEX([partnerId])`
- `INDEX([status])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `partner`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Status pipeline NEW→CONTACTED→CONVERTED/LOST.

**Validation Rules:** partnerId FK; contact email/phone required.

**Example Data:** lead email=prospect@…, status=NEW

#### Table `referrals` (Prisma: `Referral`)

**Purpose:** Attributed referral from partner code to registered user/payment.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| partnerId | String | — |
| referredEmail | String | — |
| referredUserId | String? | NULLABLE |
| status | String | DEFAULT |
| convertedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| partner | Partner | Relation |
| commissions | Commission[] | — |

**Indexes**

- `INDEX([partnerId])`
- `INDEX([referredEmail])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `partner`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Triggers Commission when conversion qualifies.

**Validation Rules:** partnerId FK; referredUserId optional unique.

**Example Data:** referredUser=student2@…, converted=true

#### Table `partner_wallets` (Prisma: `PartnerWallet`)

**Purpose:** Partner earnings wallet.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| partnerId | String | UNIQUE |
| balance | Decimal | DEFAULT, @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| partner | Partner | Relation |

**Indexes**

- Primary key index on `id` (and `@unique` columns as declared).

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `partner`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Balance updated only with commission/payout transactions in app services.

**Validation Rules:** partnerId unique; balance ≥ 0; Decimal(14,2).

**Example Data:** balance=12500.00 INR

#### Table `commissions` (Prisma: `Commission`)

**Purpose:** Commission accrual for partner referrals.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| partnerId | String | — |
| referralId | String? | NULLABLE |
| amount | Decimal | @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| status | CommissionStatus | DEFAULT |
| earnedAt | DateTime | DEFAULT |
| paidAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| partner | Partner | Relation |
| referral | Referral? | Relation |
| payouts | Payout[] | — |

**Indexes**

- `INDEX([partnerId])`
- `INDEX([referralId])`
- `INDEX([status])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `partner`, `referral`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** CommissionStatus PENDING→APPROVED→PAID/CANCELLED. amount Decimal.

**Validation Rules:** partnerId FK; amount > 0; status enum.

**Example Data:** amount=799.90, status=PENDING, referralId=…

#### Table `payouts` (Prisma: `Payout`)

**Purpose:** Partner payout settlement records.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| partnerId | String | — |
| commissionId | String? | NULLABLE |
| amount | Decimal | @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| status | PayoutStatus | DEFAULT |
| reference | String? | NULLABLE |
| processedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| partner | Partner | Relation |
| commission | Commission? | Relation |

**Indexes**

- `INDEX([partnerId])`
- `INDEX([commissionId])`
- `INDEX([status])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `partner`, `commission`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** PayoutStatus PENDING→PROCESSING→PAID/FAILED. Links optional commission.

**Validation Rules:** partnerId FK; amount > 0.

**Example Data:** amount=10000, status=PAID, reference=UTR…

#### Table `partner_reports` (Prisma: `PartnerReport`)

**Purpose:** Generated partner performance report snapshots.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| partnerId | String | — |
| reportType | String | — |
| periodStart | DateTime | — |
| periodEnd | DateTime | — |
| data | Json | — |
| generatedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |
| partner | Partner | Relation |

**Indexes**

- `INDEX([partnerId])`
- `INDEX([reportType])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `partner`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** data JSON stores metrics; immutable after generate.

**Validation Rules:** partnerId FK; periodStart < periodEnd.

**Example Data:** reportType=MONTHLY, Aug 2026 metrics JSON

### Module: Admin

#### Table `settings` (Prisma: `Setting`)

**Purpose:** Flat key/value platform settings.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| key | String | UNIQUE |
| value | String | — |
| description | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |

**Indexes**

- Primary key index on `id` (and `@unique` columns as declared).

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** Admin-editable; cache in Redis; audit changes.

**Validation Rules:** key unique; value string.

**Example Data:** key=support.email, value=support@ellowring.com

#### Table `configurations` (Prisma: `Configuration`)

**Purpose:** Namespaced JSON configuration (feature flags, limits).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| namespace | String | — |
| key | String | — |
| value | Json | — |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |

**Indexes**

- `INDEX([namespace])`

**Unique Keys**

- `UNIQUE([namespace, key])`

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** Unique (namespace, key). Prefer over Settings for structured config.

**Validation Rules:** namespace+key unique; value JSON.

**Example Data:** namespace=features, key=studyAbroad.enabled, value=true

#### Table `reports` (Prisma: `Report`)

**Purpose:** Admin-generated operational reports metadata.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| title | String | — |
| reportType | String | — |
| parameters | Json? | NULLABLE |
| fileUrl | String? | NULLABLE |
| generatedBy | String? | NULLABLE |
| generatedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |

**Indexes**

- `INDEX([reportType])`
- `INDEX([generatedAt])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** fileUrl points to stored artifact; parameters JSON.

**Validation Rules:** title/reportType required.

**Example Data:** reportType=PAYMENTS_DAILY, generatedAt=today

#### Table `analytics_snapshots` (Prisma: `AnalyticsSnapshot`)

**Purpose:** Point-in-time analytics metric capture.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| metricKey | String | — |
| metricValue | Decimal | @db.Decimal(18, 4) |
| dimensions | Json? | NULLABLE |
| capturedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |

**Indexes**

- `INDEX([metricKey])`
- `INDEX([capturedAt])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** Insert-mostly time series for dashboards; partition by capturedAt when large.

**Validation Rules:** metricKey required; metricValue Decimal.

**Example Data:** metricKey=dau.students, metricValue=1820

#### Table `announcements` (Prisma: `Announcement`)

**Purpose:** Platform announcements targeted by role.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| title | String | — |
| content | String | — |
| targetRole | Role? | NULLABLE |
| isPublished | Boolean | DEFAULT |
| startsAt | DateTime? | NULLABLE |
| endsAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| createdById | String? | NULLABLE |
| updatedById | String? | NULLABLE |

**Indexes**

- `INDEX([isPublished])`
- `INDEX([targetRole])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** Publish window startsAt/endsAt; soft-delete.

**Validation Rules:** title/content required; targetRole optional Role.

**Example Data:** title=Mock Test Weekend, targetRole=STUDENT

#### Table `banners` (Prisma: `Banner`)

**Purpose:** Marketing/home banners.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| title | String | — |
| imageUrl | String | — |
| linkUrl | String? | NULLABLE |
| sortOrder | Int | DEFAULT |
| isActive | Boolean | DEFAULT |
| startsAt | DateTime? | NULLABLE |
| endsAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |

**Indexes**

- `INDEX([isActive])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** sortOrder + isActive control display; schedule window optional.

**Validation Rules:** imageUrl required; sortOrder ≥ 0.

**Example Data:** Hero banner — Learn. Prepare. Build. Get Hired.

#### Table `cms_pages` (Prisma: `CmsPage`)

**Purpose:** CMS pages (About, Terms, Privacy, …).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| slug | String | UNIQUE |
| title | String | — |
| content | String | — |
| metaTitle | String? | NULLABLE |
| metaDesc | String? | NULLABLE |
| isPublished | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| createdById | String? | NULLABLE |
| updatedById | String? | NULLABLE |

**Indexes**

- `INDEX([isPublished])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** slug unique; isPublished gate; soft-delete.

**Validation Rules:** slug unique kebab-case; title/content required.

**Example Data:** slug=terms-of-service

#### Table `support_tickets` (Prisma: `SupportTicket`)

**Purpose:** Customer support tickets.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | — |
| assigneeId | String? | NULLABLE |
| subject | String | — |
| description | String | — |
| status | TicketStatus | DEFAULT |
| priority | TicketPriority | DEFAULT |
| category | String? | NULLABLE |
| resolvedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| user | User | Relation |
| assignee | User? | Relation |

**Indexes**

- `INDEX([userId])`
- `INDEX([assigneeId])`
- `INDEX([status])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`, `assignee`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** TicketStatus/Priority enums; assignee optional Admin user.

**Validation Rules:** userId FK; subject/description required; status/priority enums.

**Example Data:** status=OPEN, priority=HIGH, subject=Payment not reflected

### Module: Payment

#### Table `premium_plans` (Prisma: `PremiumPlan`)

**Purpose:** Subscription plan catalogue.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| name | String | UNIQUE |
| slug | String | UNIQUE |
| description | String? | NULLABLE |
| price | Decimal | @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| billingCycle | String | DEFAULT |
| features | Json? | NULLABLE |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| subscriptions | Subscription[] | — |

**Indexes**

- Primary key index on `id` (and `@unique` columns as declared).

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** No relation fields (reference/lookup or join-owned elsewhere).

**Business Rules:** price Decimal; billingCycle MONTHLY/YEARLY; features JSON.

**Validation Rules:** name/slug unique; price ≥ 0; isActive flag.

**Example Data:** Pro Plan, 499 INR/month

#### Table `subscriptions` (Prisma: `Subscription`)

**Purpose:** User subscription to a premium plan.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | — |
| planId | String | — |
| status | SubscriptionStatus | DEFAULT |
| startDate | DateTime | DEFAULT |
| endDate | DateTime? | NULLABLE |
| trialEndsAt | DateTime? | NULLABLE |
| cancelledAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| user | User | Relation |
| plan | PremiumPlan | Relation |

**Indexes**

- `INDEX([userId])`
- `INDEX([planId])`
- `INDEX([status])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`, `plan`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** SubscriptionStatus TRIAL/ACTIVE/PAUSED/CANCELLED/EXPIRED. End dating mandatory on cancel.

**Validation Rules:** userId+planId FKs; status enum; dates coherent.

**Example Data:** user=student@…, plan=Pro, status=ACTIVE

#### Table `payments` (Prisma: `Payment`)

**Purpose:** Payment intent/capture record (Razorpay etc.).

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | — |
| amount | Decimal | @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| status | PaymentStatus | DEFAULT |
| provider | String | DEFAULT |
| reference | String? | UNIQUE, NULLABLE |
| purpose | String? | NULLABLE |
| metadata | Json? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| user | User | Relation |
| invoices | Invoice[] | — |
| transactions | Transaction[] | — |
| refunds | Refund[] | — |

**Indexes**

- `INDEX([userId])`
- `INDEX([status])`
- `INDEX([createdAt])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** PaymentStatus machine; reference unique for idempotency. Never delete SUCCESS rows.

**Validation Rules:** userId FK; amount > 0; currency INR default; status enum.

**Example Data:** amount=7999.00, status=SUCCESS, provider=RAZORPAY, reference=pay_…

#### Table `invoices` (Prisma: `Invoice`)

**Purpose:** Tax invoice issued for a payment/subscription.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| paymentId | String? | NULLABLE |
| invoiceNo | String | UNIQUE |
| userId | String? | NULLABLE |
| amount | Decimal | @db.Decimal(14, 2) |
| taxAmount | Decimal | DEFAULT, @db.Decimal(14, 2) |
| totalAmount | Decimal | @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| status | InvoiceStatus | DEFAULT |
| issuedAt | DateTime? | NULLABLE |
| dueDate | DateTime? | NULLABLE |
| paidAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| payment | Payment? | Relation |

**Indexes**

- `INDEX([paymentId])`
- `INDEX([status])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `payment`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** invoiceNo unique legal identifier; totals = amount + tax.

**Validation Rules:** invoiceNo unique; totalAmount = amount + taxAmount; status InvoiceStatus.

**Example Data:** invoiceNo=ELW-INV-2026-00088, totalAmount=9438.82

#### Table `transactions` (Prisma: `Transaction`)

**Purpose:** Low-level payment provider transaction legs.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| paymentId | String | — |
| type | TransactionType | — |
| amount | Decimal | @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| providerRef | String? | NULLABLE |
| status | PaymentStatus | DEFAULT |
| metadata | Json? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| payment | Payment | Relation |

**Indexes**

- `INDEX([paymentId])`
- `INDEX([status])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `payment`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Insert-mostly; links to Payment; type CREDIT/DEBIT/REFUND/ADJUSTMENT.

**Validation Rules:** paymentId FK; amount > 0; type/status enums.

**Example Data:** type=CREDIT, status=SUCCESS, providerRef=txn_…

#### Table `refunds` (Prisma: `Refund`)

**Purpose:** Refund requests against a payment.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| paymentId | String | — |
| amount | Decimal | @db.Decimal(14, 2) |
| currency | String | DEFAULT |
| reason | String? | NULLABLE |
| status | PaymentStatus | DEFAULT |
| providerRef | String? | NULLABLE |
| processedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| payment | Payment | Relation |

**Indexes**

- `INDEX([paymentId])`
- `INDEX([status])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `payment`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** amount ≤ original payment captured amount sum of prior refunds. Status PaymentStatus-like.

**Validation Rules:** paymentId FK; amount > 0; ≤ net paid.

**Example Data:** amount=1000.00, reason=Duplicate charge, status=SUCCESS

### Module: Notification

#### Table `notifications` (Prisma: `Notification`)

**Purpose:** In-app (and multi-channel) notification inbox items.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | — |
| title | String | — |
| message | String | — |
| type | NotificationType | DEFAULT |
| channel | NotificationChannel | DEFAULT |
| isRead | Boolean | DEFAULT |
| link | String? | NULLABLE |
| readAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| user | User | Relation |

**Indexes**

- `INDEX([userId])`
- `INDEX([isRead])`
- `INDEX([createdAt])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** isRead + readAt; channel NotificationChannel. High volume — index userId+createdAt.

**Validation Rules:** userId FK; title/message required; type enum.

**Example Data:** type=SUCCESS, title=Application Shortlisted

#### Table `email_logs` (Prisma: `EmailLog`)

**Purpose:** Outbound email delivery log.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String? | NULLABLE |
| toEmail | String | — |
| subject | String | — |
| template | String? | NULLABLE |
| status | String | DEFAULT |
| providerRef | String? | NULLABLE |
| errorMessage | String? | NULLABLE |
| sentAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| user | User? | Relation |

**Indexes**

- `INDEX([userId])`
- `INDEX([toEmail])`
- `INDEX([status])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Insert-only operational log; retention policy applies; PII minimization.

**Validation Rules:** toEmail required; status QUEUED/SENT/FAILED.

**Example Data:** to=student@…, template=welcome, status=SENT

#### Table `sms_logs` (Prisma: `SmsLog`)

**Purpose:** Outbound SMS delivery log.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String? | NULLABLE |
| phone | String | — |
| message | String | — |
| status | String | DEFAULT |
| providerRef | String? | NULLABLE |
| errorMessage | String? | NULLABLE |
| sentAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| user | User? | Relation |

**Indexes**

- `INDEX([userId])`
- `INDEX([phone])`
- `INDEX([status])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** Insert-only; purge on retention schedule.

**Validation Rules:** phone required; status QUEUED/SENT/FAILED.

**Example Data:** phone=+91…, status=SENT

#### Table `push_notifications` (Prisma: `PushNotification`)

**Purpose:** Push notification dispatch log.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | — |
| title | String | — |
| body | String | — |
| deviceToken | String? | NULLABLE |
| status | String | DEFAULT |
| providerRef | String? | NULLABLE |
| sentAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| user | User | Relation |

**Indexes**

- `INDEX([userId])`
- `INDEX([status])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** deviceToken optional; providerRef for FCM/APNs.

**Validation Rules:** userId FK; title/body required.

**Example Data:** title=Interview Reminder, status=SENT

#### Table `whatsapp_logs` (Prisma: `WhatsappLog`)

**Purpose:** WhatsApp Business API message log.

**Columns**

| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String? | NULLABLE |
| phone | String | — |
| message | String | — |
| template | String? | NULLABLE |
| status | String | DEFAULT |
| providerRef | String? | NULLABLE |
| errorMessage | String? | NULLABLE |
| sentAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| user | User? | Relation |

**Indexes**

- `INDEX([userId])`
- `INDEX([phone])`
- `INDEX([status])`

**Unique Keys**

- Column-level `@unique` constraints where marked UNIQUE above.

**Relationships:** Prisma relations: `user`. Enforced as PostgreSQL foreign keys per schema.

**Business Rules:** template-based messages preferred for compliance.

**Validation Rules:** phone required; status QUEUED/SENT/FAILED.

**Example Data:** template=otp_login, status=SENT


*End of Appendix A — 122 tables documented.*

---

# Appendix B — Entity Relationship Diagrams

## B.1 Authentication & RBAC

```mermaid
erDiagram
  USER ||--o{ SESSION : has
  USER ||--o{ REFRESH_TOKEN : has
  USER ||--o{ OTP_VERIFICATION : requests
  USER ||--o{ PASSWORD_RESET : requests
  USER ||--o{ AUDIT_LOG : acts
  USER ||--o{ USER_RBAC_ROLE : assigned
  RBAC_ROLE ||--o{ USER_RBAC_ROLE : grants
  RBAC_ROLE ||--o{ RBAC_ROLE_PERMISSION : includes
  PERMISSION ||--o{ RBAC_ROLE_PERMISSION : included_in
```

## B.2 Student Learning & Coaching

```mermaid
erDiagram
  STUDENT ||--o{ COACHING_ENROLLMENT : enrolls
  COACHING_PROGRAM ||--o{ COACHING_ENROLLMENT : accepts
  COACHING_CATEGORY ||--o{ COACHING_PROGRAM : classifies
  COACHING_PROGRAM ||--o{ SUBJECT : contains
  SUBJECT ||--o{ CHAPTER : contains
  CHAPTER ||--o{ LESSON : contains
  LESSON ||--o{ TOPIC : contains
  QUESTION_BANK ||--o{ QUESTION : holds
  QUESTION ||--o{ QUESTION_OPTION : has
  MOCK_TEST ||--o{ MOCK_RESULT : yields
  MOCK_RESULT ||--o{ STUDENT_ANSWER : records
  STUDENT ||--o{ COURSE_ENROLLMENT : learns
  COURSE ||--o{ COURSE_ENROLLMENT : teaches
```

## B.3 Hiring Graph

```mermaid
erDiagram
  COMPANY ||--o{ JOB : posts
  COMPANY ||--o{ INTERNSHIP : posts
  COMPANY ||--o{ PROJECT : posts
  COMPANY ||--o{ HR_USER : staffs
  JOB ||--o{ JOB_APPLICATION : receives
  JOB_APPLICATION ||--o{ INTERVIEW : schedules
  JOB_APPLICATION ||--o{ JOB_OFFER : may_receive
  COMPANY ||--o{ EMPLOYEE : hires
  EMPLOYEE ||--o{ PAYROLL_ITEM : paid_via
  PAYROLL_RUN ||--o{ PAYROLL_ITEM : contains
```

## B.4 Payments & Wallet

```mermaid
flowchart LR
  User --> Wallet
  Wallet --> WalletLedger
  User --> Payment
  Payment --> Transaction
  Payment --> Refund
  User --> Subscription
  PremiumPlan --> Subscription
  Payment --> Invoice
```

## B.5 College Admissions

```mermaid
erDiagram
  UNIVERSITY ||--o{ COLLEGE : affiliates
  COLLEGE ||--o{ DEPARTMENT : houses
  COLLEGE ||--o{ COLLEGE_COURSE : offers
  DEPARTMENT ||--o{ COLLEGE_COURSE : owns
  COLLEGE ||--o{ COLLEGE_APPLICATION : receives
  COLLEGE_COURSE ||--o{ COLLEGE_APPLICATION : targets
  USER ||--o{ COLLEGE_APPLICATION : submits
  COLLEGE ||--o{ SCHOLARSHIP : sponsors
  COLLEGE ||--o{ COLLEGE_REVIEW : reviewed_in
  USER ||--|| COLLEGE_PROFILE : manages
  COLLEGE_PROFILE }o--|| COLLEGE : linked_to
```

## B.6 Study Abroad

```mermaid
erDiagram
  COUNTRY ||--o{ ABROAD_UNIVERSITY : hosts
  ABROAD_UNIVERSITY ||--o{ ABROAD_PROGRAM : offers
  ABROAD_PROGRAM ||--o{ ELIGIBILITY_RULE : constrains
  COUNTRY ||--o{ VISA_REQUIREMENT : requires
  ABROAD_PROGRAM ||--o{ ABROAD_APPLICATION : attracts
  USER ||--o{ ABROAD_APPLICATION : submits
  ABROAD_APPLICATION ||--o{ ABROAD_DOCUMENT : attaches
```

## B.7 Training & Channel Partner

```mermaid
erDiagram
  TRAINING_CENTER ||--o{ TRAINER : employs
  TRAINING_CENTER ||--o{ TRAINING_PROGRAM : delivers
  TRAINING_PROGRAM ||--o{ TRAINING_BATCH : schedules
  TRAINING_BATCH ||--o{ ATTENDANCE_RECORD : tracks
  PARTNER ||--o{ PARTNER_LEAD : captures
  PARTNER ||--o{ REFERRAL : attributes
  PARTNER ||--|| PARTNER_WALLET : holds
  PARTNER ||--o{ COMMISSION : earns
  COMMISSION ||--o{ PAYOUT : settles
```

## B.8 Platform relationship overview (flow)

```mermaid
flowchart TB
  subgraph Identity
    Users --> Profiles[Student / College / Company / Training / Partner]
    Users --> RBAC[RBAC Roles and Permissions]
    Users --> SessionsTokens[Sessions / OTP / Refresh Tokens]
  end
  subgraph Learn
    Coaching --> MockTests
    Courses --> Enrollments
    TrainingBatches --> Attendance
  end
  subgraph Progress
    Internships --> OffersI[Internship Offers]
    Projects --> Evaluations
    Jobs --> OffersJ[Job Offers] --> Employees --> Payroll
  end
  subgraph Money
    Wallet --> Ledger
    Payments --> Invoices
    Partners --> Commissions --> Payouts
  end
  Profiles --> Learn
  Profiles --> Progress
  Profiles --> Money
  Users --> AuditLogs
  Users --> Notifications
```

---

# Appendix C — SQL Best Practices & Query Optimisation

### SQL best practices

- Never concatenate SQL strings with user input — use Prisma/parameter binding.  
- Prefer explicit column lists.  
- Keep transactions short; do not call external HTTP inside DB transactions.  
- Use `SELECT … FOR UPDATE` (Prisma interactive transactions) for wallet balance updates.  
- Vacuum / analyze regularly; monitor bloat on high-churn tables.

### Index optimisation

- Create indexes matching `WHERE` + `ORDER BY` of top API queries.  
- Drop unused indexes quarterly (`pg_stat_user_indexes`).  
- Use partial indexes for `deletedAt IS NULL AND isActive = true`.

### Query optimisation

- Pagination: cursor on `(createdAt, id)`.  
- Avoid `OR` across unrelated columns — prefer `UNION ALL`.  
- Precompute dashboards into `analytics_snapshots`.

### Performance tuning (PostgreSQL)

| Setting area | Guidance |
|---|---|
| `shared_buffers` | ~25% RAM on dedicated DB |
| `work_mem` | Tune for sort-heavy coaching analytics carefully |
| `max_connections` | Keep low; pool via PgBouncer |
| Autovacuum | Aggressive on ledger & log tables |

### Database security (ops checklist)

- [ ] SSL enforced  
- [ ] Migrator credentials rotated  
- [ ] Continuous backup verified  
- [ ] Read replica not writable from app  
- [ ] PII export approval workflow  

### Backup & restore (commands — illustrative)

```bash
# Logical backup
pg_dump -Fc "$DATABASE_URL" -f ellowring_$(date +%F).dump

# Restore to new database
pg_restore -d "$RESTORE_URL" --clean --if-exists ellowring_YYYY-MM-DD.dump
```

---

# Appendix D — Phase-4 Activation Runbook

1. **Infra:** `docker compose -f docker-compose.phase3.yml up -d`  
2. **Env (`backend/.env`):**

```env
DATABASE_URL="postgresql://ellowring:ellowring@localhost:5432/ellowring?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="change-me"
```

3. **Activate schema:**

```bash
cd backend
copy prisma\phase4\schema.prisma prisma\schema.prisma
npx prisma migrate dev --name phase4_init
npx prisma generate
npx prisma db seed
```

4. **Application alignment:** Update Nest services for renamed models (`Project`, `CourseEnrollment`, etc.).  
5. **Verify:** Login as `student@ellowring.com` / `password123`; run health checks.  
6. **Document:** Keep this file and `schema.prisma` in sync on every schema change (PR checklist).

---

## Related Documents

| Document | Path |
|---|---|
| Product Requirements | `docs/Ellowring_PRD.md` |
| System Architecture | `docs/Ellowring_System_Architecture.md` |
| Phase-4 Prisma Schema | `backend/prisma/phase4/schema.prisma` |
| Seed Strategy | `backend/prisma/phase4/SEED_STRATEGY.md` |
| Database pack index | `docs/database/README.md` |
| API Design (Phase 5) | `docs/Ellowring_API_Design.md` |
| OpenAPI 3.0 | `docs/api/openapi.yaml` |

---

*Document maintained in sync with `backend/prisma/phase4/schema.prisma`. Regenerate Appendix A via `node docs/scripts/generate-table-catalogue.js` after schema changes.*
