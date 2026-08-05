# Ellowring — Enterprise Database Design Document

**Ellowring Software Solutions**  
**Product:** Ellowring  
**Tagline:** Learn. Prepare. Build. Get Hired.  
**Vision:** From 11th Standard to First Job — Everything in One Platform.  
**Platform:** Enterprise SaaS Web Application  

| Field | Value |
|---|---|
| Document Type | Enterprise Database Design Specification |
| Version | 1.0 (Phase 4) |
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

- [Appendix A — Complete Table Catalogue](#appendix-a--complete-table-catalogue)  
- [Appendix B — Entity Relationship Diagrams](#appendix-b--entity-relationship-diagrams)  
- [Appendix C — SQL Best Practices & Query Optimisation](#appendix-c--sql-best-practices--query-optimisation)  
- [Appendix D — Phase-4 Activation Runbook](#appendix-d--phase-4-activation-runbook)  

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

---

*End of narrative chapters. Complete physical table catalogue follows in Appendix A.*


---


## Appendix A â€” Complete Table Catalogue

Each table below is implementable as defined in `backend/prisma/phase4/schema.prisma`. Column lists mirror Prisma fields (scalars and relations).


### Module: Authentication


#### Table `users` (Prisma: `User`)


**Purpose:** Central identity record for all Ellowring roles; authenticates sessions and owns role profiles.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| email | String | UNIQUE |
| phone | String? | UNIQUE, NULLABLE |
| passwordHash | String | â€” |
| name | String | â€” |
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
| sessions | Session[] | â€” |
| refreshTokens | RefreshToken[] | â€” |
| otpVerifications | OtpVerification[] | â€” |
| passwordResets | PasswordReset[] | â€” |
| auditLogs | AuditLog[] | â€” |
| rbacAssignments | UserRbacRole[] | â€” |
| notifications | Notification[] | â€” |
| payments | Payment[] | â€” |
| subscriptions | Subscription[] | â€” |
| supportTickets | SupportTicket[] | Relation |
| assignedTickets | SupportTicket[] | Relation |
| couponRedemptions | CouponRedemption[] | â€” |
| abroadApplications | AbroadApplication[] | â€” |
| collegeApplications | CollegeApplication[] | â€” |
| jobApplications | JobApplication[] | â€” |
| internshipApplications | InternshipApplication[] | â€” |
| savedJobs | SavedJob[] | â€” |
| emailLogs | EmailLog[] | â€” |
| smsLogs | SmsLog[] | â€” |
| pushNotifications | PushNotification[] | â€” |
| whatsappLogs | WhatsappLog[] | â€” |

**Indexes:** `[role]`, `[isActive]`, `[deletedAt]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `roles` (Prisma: `RbacRole`)


**Purpose:** Enterprise RBAC role definition beyond the coarse application Role enum.


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
| permissions | RbacRolePermission[] | â€” |
| users | UserRbacRole[] | â€” |

**Indexes:** Primary key only (add FK indexes in Prisma schema).


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `permissions` (Prisma: `Permission`)


**Purpose:** Atomic permission capability (module.action) granted through RBAC roles.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| name | String | UNIQUE |
| slug | String | UNIQUE |
| module | String | â€” |
| description | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| roles | RbacRolePermission[] | â€” |

**Indexes:** `[module]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `role_permissions` (Prisma: `RbacRolePermission`)


**Purpose:** Many-to-many mapping of RBAC roles to permissions.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| roleId | String | â€” |
| permissionId | String | â€” |
| createdAt | DateTime | DEFAULT |
| role | RbacRole | Relation |
| permission | Permission | Relation |

**Indexes:** `[roleId]`, `[permissionId]`


**Unique keys:** `[roleId, permissionId]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `user_rbac_roles` (Prisma: `UserRbacRole`)


**Purpose:** Assigns one or more RBAC roles to a user for fine-grained authorization.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | â€” |
| roleId | String | â€” |
| createdAt | DateTime | DEFAULT |
| user | User | Relation |
| role | RbacRole | Relation |

**Indexes:** `[userId]`, `[roleId]`


**Unique keys:** `[userId, roleId]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `sessions` (Prisma: `Session`)


**Purpose:** Server-tracked authenticated session metadata for device/session management.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | â€” |
| token | String | UNIQUE |
| ipAddress | String? | NULLABLE |
| userAgent | String? | NULLABLE |
| expiresAt | DateTime | â€” |
| createdAt | DateTime | DEFAULT |
| user | User | Relation |

**Indexes:** `[userId]`, `[expiresAt]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `refresh_tokens` (Prisma: `RefreshToken`)


**Purpose:** Rotated refresh tokens used to mint short-lived access JWTs securely.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | â€” |
| token | String | UNIQUE |
| expiresAt | DateTime | â€” |
| revokedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| user | User | Relation |

**Indexes:** `[userId]`, `[expiresAt]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `otp_verifications` (Prisma: `OtpVerification`)


**Purpose:** One-time passwords for signup, login, and sensitive action verification.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String? | NULLABLE |
| email | String? | NULLABLE |
| phone | String? | NULLABLE |
| code | String | â€” |
| purpose | OtpPurpose | â€” |
| expiresAt | DateTime | â€” |
| used | Boolean | DEFAULT |
| usedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| user | User? | Relation |

**Indexes:** `[userId]`, `[email]`, `[phone]`, `[expiresAt]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `password_resets` (Prisma: `PasswordReset`)


**Purpose:** Time-bound tokens allowing password recovery without exposing credentials.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | â€” |
| token | String | UNIQUE |
| expiresAt | DateTime | â€” |
| usedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| user | User | Relation |

**Indexes:** `[userId]`, `[expiresAt]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `audit_logs` (Prisma: `AuditLog`)


**Purpose:** Immutable security and compliance trail of sensitive mutations and access events.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String? | NULLABLE |
| action | String | â€” |
| entityType | String | â€” |
| entityId | String? | NULLABLE |
| metadata | Json? | NULLABLE |
| ipAddress | String? | NULLABLE |
| userAgent | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| user | User? | Relation |

**Indexes:** `[userId]`, `[entityType, entityId]`, `[createdAt]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


### Module: Student


#### Table `students` (Prisma: `Student`)


**Purpose:** Student profile extending User with academic context and learning journey state.


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
| parents | Parent[] | â€” |
| educationHistory | EducationHistory[] | â€” |
| careerInterests | CareerInterest[] | â€” |
| careerRecommendations | CareerRecommendation[] | â€” |
| studentSkills | StudentSkill[] | â€” |
| skillProgress | SkillProgress[] | â€” |
| achievements | Achievement[] | â€” |
| wallet | Wallet? | NULLABLE |
| certificates | Certificate[] | â€” |
| bookmarks | Bookmark[] | â€” |
| favorites | Favorite[] | â€” |
| coachingEnrollments | CoachingEnrollment[] | â€” |
| courseEnrollments | CourseEnrollment[] | â€” |
| studentAnswers | StudentAnswer[] | â€” |
| mockResults | MockResult[] | â€” |
| leaderboardEntries | LeaderboardEntry[] | â€” |
| internshipApplications | InternshipApplication[] | â€” |
| internshipProgress | InternshipProgress[] | â€” |
| internshipFeedback | InternshipFeedback[] | â€” |
| projectTeamMembers | ProjectTeamMember[] | â€” |
| projectSubmissions | ProjectSubmission[] | â€” |
| trainingAssignments | TrainingAssignment[] | â€” |
| attendanceRecords | AttendanceRecord[] | â€” |

**Indexes:** `[city, state]`, `[deletedAt]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `parents` (Prisma: `Parent`)


**Purpose:** Optional parent/guardian contacts linked to a student for consent and communication.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | â€” |
| name | String | â€” |
| relation | String | â€” |
| email | String? | NULLABLE |
| phone | String? | NULLABLE |
| occupation | String? | NULLABLE |
| isPrimary | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| student | Student | Relation |

**Indexes:** `[studentId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `education_history` (Prisma: `EducationHistory`)


**Purpose:** Chronological academic history used in guidance, admissions, and hiring.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | â€” |
| institution | String | â€” |
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

**Indexes:** `[studentId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `career_interests` (Prisma: `CareerInterest`)


**Purpose:** Declared career interest areas feeding recommendation engines.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | â€” |
| title | String | â€” |
| category | String? | NULLABLE |
| priority | Int | DEFAULT |
| notes | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| student | Student | Relation |
| recommendations | CareerRecommendation[] | â€” |

**Indexes:** `[studentId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `career_recommendations` (Prisma: `CareerRecommendation`)


**Purpose:** System or counselor-generated career path recommendations.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | â€” |
| careerInterestId | String? | NULLABLE |
| title | String | â€” |
| summary | String? | NULLABLE |
| confidence | Decimal? | NULLABLE |
| source | String? | NULLABLE |
| metadata | Json? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| student | Student | Relation |
| careerInterest | CareerInterest? | Relation |

**Indexes:** `[studentId]`, `[careerInterestId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `skills` (Prisma: `Skill`)


**Purpose:** Canonical skill catalogue shared across coaching, courses, projects, and jobs.


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
| studentSkills | StudentSkill[] | â€” |
| skillProgress | SkillProgress[] | â€” |

**Indexes:** `[category]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `student_skills` (Prisma: `StudentSkill`)


**Purpose:** Student-to-skill association with proficiency metadata.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | â€” |
| skillId | String | â€” |
| level | Int | DEFAULT |
| yearsOfExp | Decimal? | NULLABLE |
| verified | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| student | Student | Relation |
| skill | Skill | Relation |

**Indexes:** `[studentId]`, `[skillId]`


**Unique keys:** `[studentId, skillId]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `skill_progress` (Prisma: `SkillProgress`)


**Purpose:** Time-series progress against a skill for analytics dashboards.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | â€” |
| skillId | String | â€” |
| progressPct | Int | DEFAULT |
| source | String? | NULLABLE |
| notes | String? | NULLABLE |
| recordedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| student | Student | Relation |
| skill | Skill | Relation |

**Indexes:** `[studentId]`, `[skillId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `achievements` (Prisma: `Achievement`)


**Purpose:** Badges/milestones earned by students across modules.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | â€” |
| title | String | â€” |
| description | String? | NULLABLE |
| issuer | String? | NULLABLE |
| achievedAt | DateTime? | NULLABLE |
| badgeUrl | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| student | Student | Relation |

**Indexes:** `[studentId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `wallets` (Prisma: `Wallet`)


**Purpose:** Student/user prepaid wallet balance for marketplace purchases.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | UNIQUE |
| balance | Decimal | DEFAULT |
| currency | String | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| student | Student | Relation |
| ledger | WalletLedger[] | â€” |

**Indexes:** Primary key only (add FK indexes in Prisma schema).


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `wallet_ledger` (Prisma: `WalletLedger`)


**Purpose:** Immutable credit/debit ledger lines for wallet auditability.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| walletId | String | â€” |
| amount | Decimal | â€” |
| type | WalletLedgerType | â€” |
| reference | String? | NULLABLE |
| description | String? | NULLABLE |
| balanceAfter | Decimal? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| wallet | Wallet | Relation |

**Indexes:** `[walletId]`, `[createdAt]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `coupons` (Prisma: `Coupon`)


**Purpose:** Discount instruments for courses, coaching, and premium plans.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| code | String | UNIQUE |
| title | String? | NULLABLE |
| discountPct | Decimal? | NULLABLE |
| discountAmt | Decimal? | NULLABLE |
| minOrderAmt | Decimal? | NULLABLE |
| maxUses | Int | DEFAULT |
| usedCount | Int | DEFAULT |
| expiresAt | DateTime? | NULLABLE |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| createdById | String? | NULLABLE |
| updatedById | String? | NULLABLE |
| redemptions | CouponRedemption[] | â€” |

**Indexes:** `[isActive]`, `[expiresAt]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `coupon_redemptions` (Prisma: `CouponRedemption`)


**Purpose:** Tracks which user redeemed which coupon (once per user by default).


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| couponId | String | â€” |
| userId | String | â€” |
| orderRef | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| coupon | Coupon | Relation |
| user | User | Relation |

**Indexes:** `[couponId]`, `[userId]`


**Unique keys:** `[couponId, userId]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `certificates` (Prisma: `Certificate`)


**Purpose:** Issued credentials for courses, coaching, projects, or platform milestones.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | â€” |
| title | String | â€” |
| issuer | String | â€” |
| credentialId | String? | NULLABLE |
| fileUrl | String? | NULLABLE |
| issuedAt | DateTime | DEFAULT |
| expiresAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| student | Student | Relation |

**Indexes:** `[studentId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `bookmarks` (Prisma: `Bookmark`)


**Purpose:** Polymorphic bookmark of catalogue entities for later revisit.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | â€” |
| entityType | BookmarkEntityType | â€” |
| entityId | String | â€” |
| notes | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| student | Student | Relation |

**Indexes:** `[studentId]`, `[entityType, entityId]`


**Unique keys:** `[studentId, entityType, entityId]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `favorites` (Prisma: `Favorite`)


**Purpose:** Polymorphic favorite flag distinct from bookmarks for ranking/UX.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | â€” |
| entityType | FavoriteEntityType | â€” |
| entityId | String | â€” |
| createdAt | DateTime | DEFAULT |
| student | Student | Relation |

**Indexes:** `[studentId]`, `[entityType, entityId]`


**Unique keys:** `[studentId, entityType, entityId]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


### Module: Coaching


#### Table `coaching_categories` (Prisma: `CoachingCategory`)


**Purpose:** Top-level coaching taxonomy (NEET, JEE, Competitive Exams, etc.).


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
| programs | CoachingProgram[] | â€” |

**Indexes:** Primary key only (add FK indexes in Prisma schema).


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `coaching_programs` (Prisma: `CoachingProgram`)


**Purpose:** Sellable coaching offering under a category with pricing and batches.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| categoryId | String | â€” |
| title | String | â€” |
| slug | String | UNIQUE |
| examType | String | â€” |
| description | String? | NULLABLE |
| price | Decimal | DEFAULT |
| duration | String? | NULLABLE |
| batchSize | Int? | NULLABLE |
| isPublished | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| createdById | String? | NULLABLE |
| updatedById | String? | NULLABLE |
| category | CoachingCategory | Relation |
| subjects | Subject[] | â€” |
| mockTests | MockTest[] | â€” |
| enrollments | CoachingEnrollment[] | â€” |

**Indexes:** `[categoryId]`, `[examType]`, `[isPublished]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `subjects` (Prisma: `Subject`)


**Purpose:** Subject within a coaching program (Physics, Chemistry, etc.).


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| programId | String | â€” |
| name | String | â€” |
| slug | String | â€” |
| description | String? | NULLABLE |
| sortOrder | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| program | CoachingProgram | Relation |
| chapters | Chapter[] | â€” |

**Indexes:** `[programId]`


**Unique keys:** `[programId, slug]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `chapters` (Prisma: `Chapter`)


**Purpose:** Chapter under a subject for structured syllabus navigation.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| subjectId | String | â€” |
| title | String | â€” |
| slug | String | â€” |
| description | String? | NULLABLE |
| sortOrder | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| subject | Subject | Relation |
| lessons | Lesson[] | â€” |

**Indexes:** `[subjectId]`


**Unique keys:** `[subjectId, slug]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `lessons` (Prisma: `Lesson`)


**Purpose:** Lesson content unit within a chapter.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| chapterId | String | â€” |
| title | String | â€” |
| slug | String | â€” |
| content | String? | NULLABLE |
| videoUrl | String? | NULLABLE |
| durationMin | Int? | NULLABLE |
| sortOrder | Int | DEFAULT |
| isFree | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| chapter | Chapter | Relation |
| topics | Topic[] | â€” |

**Indexes:** `[chapterId]`


**Unique keys:** `[chapterId, slug]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `topics` (Prisma: `Topic`)


**Purpose:** Fine-grained topic within a lesson for question tagging.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| lessonId | String | â€” |
| title | String | â€” |
| content | String? | NULLABLE |
| sortOrder | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| lesson | Lesson | Relation |

**Indexes:** `[lessonId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `question_banks` (Prisma: `QuestionBank`)


**Purpose:** Container grouping questions for reuse across mock tests.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| title | String | â€” |
| slug | String | UNIQUE |
| examType | String? | NULLABLE |
| description | String? | NULLABLE |
| isPublished | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| questions | Question[] | â€” |
| mockTests | MockTest[] | â€” |

**Indexes:** `[examType]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `mock_tests` (Prisma: `MockTest`)


**Purpose:** Timed assessment instance mapped to a program/bank.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| programId | String? | NULLABLE |
| questionBankId | String? | NULLABLE |
| title | String | â€” |
| slug | String | UNIQUE |
| durationMin | Int | â€” |
| totalMarks | Int | â€” |
| passingMarks | Int? | NULLABLE |
| isPublished | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| program | CoachingProgram? | Relation |
| questionBank | QuestionBank? | Relation |
| questions | Question[] | â€” |
| results | MockResult[] | â€” |
| leaderboard | LeaderboardEntry[] | â€” |

**Indexes:** `[programId]`, `[questionBankId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `questions` (Prisma: `Question`)


**Purpose:** Assessment item with stem, difficulty, and marking scheme.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| questionBankId | String? | NULLABLE |
| mockTestId | String? | NULLABLE |
| text | String | â€” |
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
| options | QuestionOption[] | â€” |
| answers | StudentAnswer[] | â€” |

**Indexes:** `[questionBankId]`, `[mockTestId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `question_options` (Prisma: `QuestionOption`)


**Purpose:** Selectable options for MCQ questions.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| questionId | String | â€” |
| label | String | â€” |
| text | String | â€” |
| isCorrect | Boolean | DEFAULT |
| sortOrder | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| question | Question | Relation |
| answers | StudentAnswer[] | â€” |

**Indexes:** `[questionId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `student_answers` (Prisma: `StudentAnswer`)


**Purpose:** Captured student response to a question in a mock attempt.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | â€” |
| questionId | String | â€” |
| selectedOptionId | String? | NULLABLE |
| textAnswer | String? | NULLABLE |
| isCorrect | Boolean? | NULLABLE |
| marksAwarded | Decimal? | NULLABLE |
| answeredAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |
| student | Student | Relation |
| question | Question | Relation |
| selectedOption | QuestionOption? | Relation |

**Indexes:** `[studentId]`, `[questionId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `mock_results` (Prisma: `MockResult`)


**Purpose:** Aggregated score and analytics for a completed mock test attempt.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | â€” |
| mockTestId | String | â€” |
| score | Decimal | â€” |
| totalMarks | Int | â€” |
| percentile | Decimal? | NULLABLE |
| timeTakenSec | Int? | NULLABLE |
| completedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| student | Student | Relation |
| mockTest | MockTest | Relation |

**Indexes:** `[studentId]`, `[mockTestId]`


**Unique keys:** `[studentId, mockTestId]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `leaderboard_entries` (Prisma: `LeaderboardEntry`)


**Purpose:** Ranked performance snapshot for motivation and gamification.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | â€” |
| mockTestId | String | â€” |
| rank | Int | â€” |
| score | Decimal | â€” |
| period | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| student | Student | Relation |
| mockTest | MockTest | Relation |

**Indexes:** `[mockTestId, rank]`, `[studentId]`


**Unique keys:** `[studentId, mockTestId, period]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `coaching_enrollments` (Prisma: `CoachingEnrollment`)


**Purpose:** Student enrollment into a coaching program.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | â€” |
| programId | String | â€” |
| status | EnrollmentStatus | DEFAULT |
| enrolledAt | DateTime | DEFAULT |
| completedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| student | Student | Relation |
| program | CoachingProgram | Relation |

**Indexes:** `[studentId]`, `[programId]`


**Unique keys:** `[studentId, programId]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


### Module: College


#### Table `schools` (Prisma: `School`)


**Purpose:** School catalogue entity for Class 11â€“12 feeder context.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| name | String | â€” |
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

**Indexes:** `[city, state]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `colleges` (Prisma: `College`)


**Purpose:** Indian college catalogue entity for admissions discovery.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| universityId | String? | NULLABLE |
| name | String | â€” |
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
| departments | Department[] | â€” |
| courses | CollegeCourse[] | â€” |
| rankings | CollegeRanking[] | â€” |
| reviews | CollegeReview[] | â€” |
| applications | CollegeApplication[] | â€” |
| scholarships | Scholarship[] | â€” |

**Indexes:** `[universityId]`, `[city, state]`, `[isVerified]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `universities` (Prisma: `University`)


**Purpose:** University parent org for colleges and programmes.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| name | String | â€” |
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
| colleges | College[] | â€” |

**Indexes:** `[city, state]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `college_courses` (Prisma: `CollegeCourse`)


**Purpose:** Programme/course offered by a college (seats, fees, eligibility).


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| collegeId | String | â€” |
| departmentId | String? | NULLABLE |
| name | String | â€” |
| slug | String | â€” |
| degree | String | â€” |
| duration | String? | NULLABLE |
| fees | Decimal? | NULLABLE |
| seats | Int | DEFAULT |
| eligibility | String? | NULLABLE |
| description | String? | NULLABLE |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| college | College | Relation |
| department | Department? | Relation |
| applications | CollegeApplication[] | â€” |
| scholarships | Scholarship[] | â€” |

**Indexes:** `[collegeId]`, `[departmentId]`


**Unique keys:** `[collegeId, slug]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `departments` (Prisma: `Department`)


**Purpose:** Academic department within a college.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| collegeId | String | â€” |
| name | String | â€” |
| slug | String | â€” |
| headName | String? | NULLABLE |
| description | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| college | College | Relation |
| courses | CollegeCourse[] | â€” |

**Indexes:** `[collegeId]`


**Unique keys:** `[collegeId, slug]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `college_rankings` (Prisma: `CollegeRanking`)


**Purpose:** Published ranking observations for colleges.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| collegeId | String | â€” |
| source | String | â€” |
| rank | Int | â€” |
| year | Int | â€” |
| category | String? | NULLABLE |
| score | Decimal? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| college | College | Relation |

**Indexes:** `[collegeId]`, `[year, rank]`


**Unique keys:** `[collegeId, source, year, category]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `college_reviews` (Prisma: `CollegeReview`)


**Purpose:** Student/alumni reviews of colleges.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| collegeId | String | â€” |
| userId | String? | NULLABLE |
| rating | Int | â€” |
| title | String? | NULLABLE |
| content | String? | NULLABLE |
| isVerified | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| college | College | Relation |

**Indexes:** `[collegeId]`, `[rating]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `college_applications` (Prisma: `CollegeApplication`)


**Purpose:** Student application to a college programme with status lifecycle.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | â€” |
| collegeId | String | â€” |
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

**Indexes:** `[userId]`, `[collegeId]`, `[courseId]`, `[status]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `scholarships` (Prisma: `Scholarship`)


**Purpose:** Scholarship opportunities tied to colleges or platform.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| collegeId | String? | NULLABLE |
| courseId | String? | NULLABLE |
| title | String | â€” |
| amount | Decimal? | NULLABLE |
| percentage | Decimal? | NULLABLE |
| eligibility | String? | NULLABLE |
| deadline | DateTime? | NULLABLE |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| college | College? | Relation |
| course | CollegeCourse? | Relation |

**Indexes:** `[collegeId]`, `[courseId]`, `[deadline]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `college_profiles` (Prisma: `CollegeProfile`)


**Purpose:** Login profile for COLLEGE role users managing a catalogue college.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | UNIQUE |
| collegeId | String? | NULLABLE |
| name | String | â€” |
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

**Indexes:** `[collegeId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


### Module: StudyAbroad


#### Table `countries` (Prisma: `Country`)


**Purpose:** Study-abroad destination country reference.


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
| universities | AbroadUniversity[] | â€” |
| visaRules | VisaRequirement[] | â€” |

**Indexes:** Primary key only (add FK indexes in Prisma schema).


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `abroad_universities` (Prisma: `AbroadUniversity`)


**Purpose:** International university catalogue entry.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| countryId | String | â€” |
| name | String | â€” |
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
| programs | AbroadProgram[] | â€” |

**Indexes:** `[countryId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `abroad_programs` (Prisma: `AbroadProgram`)


**Purpose:** Programme offered by an abroad university.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| universityId | String | â€” |
| name | String | â€” |
| slug | String | UNIQUE |
| degree | String | â€” |
| duration | String? | NULLABLE |
| tuition | Decimal? | NULLABLE |
| currency | String? | DEFAULT, NULLABLE |
| intake | String? | NULLABLE |
| description | String? | NULLABLE |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| university | AbroadUniversity | Relation |
| eligibility | EligibilityRule[] | â€” |
| applications | AbroadApplication[] | â€” |

**Indexes:** `[universityId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `eligibility_rules` (Prisma: `EligibilityRule`)


**Purpose:** Structured eligibility criteria for an abroad programme.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| programId | String | â€” |
| ruleType | String | â€” |
| ruleValue | String | â€” |
| description | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| program | AbroadProgram | Relation |

**Indexes:** `[programId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `visa_requirements` (Prisma: `VisaRequirement`)


**Purpose:** Visa documentation and process requirements by country/programme.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| countryId | String | â€” |
| visaType | String | â€” |
| requirements | String? | NULLABLE |
| processingDays | Int? | NULLABLE |
| fee | Decimal? | NULLABLE |
| currency | String? | DEFAULT, NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| country | Country | Relation |

**Indexes:** `[countryId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `abroad_applications` (Prisma: `AbroadApplication`)


**Purpose:** Student study-abroad application case file.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | â€” |
| programId | String | â€” |
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
| documents | AbroadDocument[] | â€” |

**Indexes:** `[userId]`, `[programId]`, `[status]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `abroad_documents` (Prisma: `AbroadDocument`)


**Purpose:** Uploaded documents attached to an abroad application.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| applicationId | String | â€” |
| docType | String | â€” |
| fileName | String | â€” |
| fileUrl | String | â€” |
| verified | Boolean | DEFAULT |
| uploadedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| application | AbroadApplication | Relation |

**Indexes:** `[applicationId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


### Module: Learning


#### Table `course_categories` (Prisma: `CourseCategory`)


**Purpose:** Learning marketplace course taxonomy.


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
| courses | Course[] | â€” |

**Indexes:** Primary key only (add FK indexes in Prisma schema).


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `courses` (Prisma: `Course`)


**Purpose:** Skills course listing sold/delivered on Ellowring.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| categoryId | String | â€” |
| trainingCenterId | String? | NULLABLE |
| title | String | â€” |
| slug | String | UNIQUE |
| level | String | â€” |
| duration | String? | NULLABLE |
| price | Decimal | DEFAULT |
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
| modules | CourseModule[] | â€” |
| assignments | Assignment[] | â€” |
| assessments | Assessment[] | â€” |
| certificates | CourseCertificate[] | â€” |
| downloads | CourseDownload[] | â€” |
| enrollments | CourseEnrollment[] | â€” |

**Indexes:** `[categoryId]`, `[trainingCenterId]`, `[isPublished]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `course_modules` (Prisma: `CourseModule`)


**Purpose:** Module grouping lessons inside a course.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| courseId | String | â€” |
| title | String | â€” |
| slug | String | â€” |
| description | String? | NULLABLE |
| sortOrder | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| course | Course | Relation |
| lessons | CourseLesson[] | â€” |

**Indexes:** `[courseId]`


**Unique keys:** `[courseId, slug]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `course_lessons` (Prisma: `CourseLesson`)


**Purpose:** Lesson unit inside a course module.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| moduleId | String | â€” |
| title | String | â€” |
| slug | String | â€” |
| content | String? | NULLABLE |
| durationMin | Int? | NULLABLE |
| sortOrder | Int | DEFAULT |
| isFree | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| module | CourseModule | Relation |
| videos | CourseVideo[] | â€” |

**Indexes:** `[moduleId]`


**Unique keys:** `[moduleId, slug]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `course_videos` (Prisma: `CourseVideo`)


**Purpose:** Video asset metadata for a lesson.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| lessonId | String | â€” |
| title | String | â€” |
| videoUrl | String | â€” |
| durationSec | Int? | NULLABLE |
| sortOrder | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| lesson | CourseLesson | Relation |

**Indexes:** `[lessonId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `assignments` (Prisma: `Assignment`)


**Purpose:** Assignment work item for course learners.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| courseId | String | â€” |
| title | String | â€” |
| description | String? | NULLABLE |
| dueDate | DateTime? | NULLABLE |
| maxScore | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| course | Course | Relation |

**Indexes:** `[courseId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `assessments` (Prisma: `Assessment`)


**Purpose:** Quiz/exam assessment within a course.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| courseId | String | â€” |
| title | String | â€” |
| description | String? | NULLABLE |
| durationMin | Int? | NULLABLE |
| maxScore | Int | DEFAULT |
| passingScore | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| course | Course | Relation |

**Indexes:** `[courseId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `course_certificates` (Prisma: `CourseCertificate`)


**Purpose:** Certificate template/issuance for course completion.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| courseId | String | â€” |
| enrollmentId | String? | UNIQUE, NULLABLE |
| templateUrl | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| course | Course | Relation |
| enrollment | CourseEnrollment? | Relation |

**Indexes:** `[courseId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `course_downloads` (Prisma: `CourseDownload`)


**Purpose:** Downloadable resource attached to a course.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| courseId | String | â€” |
| title | String | â€” |
| fileUrl | String | â€” |
| fileSize | Int? | NULLABLE |
| sortOrder | Int | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| course | Course | Relation |

**Indexes:** `[courseId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `enrollments` (Prisma: `CourseEnrollment`)


**Purpose:** Student enrollment and progress in a learning course.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | â€” |
| courseId | String | â€” |
| status | EnrollmentStatus | DEFAULT |
| progressPct | Int | DEFAULT |
| enrolledAt | DateTime | DEFAULT |
| completedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| student | Student | Relation |
| course | Course | Relation |
| certificate | CourseCertificate? | NULLABLE |

**Indexes:** `[studentId]`, `[courseId]`


**Unique keys:** `[studentId, courseId]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


### Module: Internship


#### Table `companies` (Prisma: `Company`)


**Purpose:** Employer org for jobs, internships, projects, and payroll.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | UNIQUE |
| name | String | â€” |
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
| internships | Internship[] | â€” |
| projects | Project[] | â€” |
| jobs | Job[] | â€” |
| hrUsers | HrUser[] | â€” |
| employees | Employee[] | â€” |
| mentors | Mentor[] | â€” |

**Indexes:** `[industry]`, `[verified]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `internships` (Prisma: `Internship`)


**Purpose:** Internship posting owned by a company.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| companyId | String | â€” |
| title | String | â€” |
| slug | String | UNIQUE |
| location | String? | NULLABLE |
| mode | WorkMode | DEFAULT |
| stipend | Decimal? | NULLABLE |
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
| applications | InternshipApplication[] | â€” |
| offers | InternshipOffer[] | â€” |
| progress | InternshipProgress[] | â€” |
| feedback | InternshipFeedback[] | â€” |
| mentors | Mentor[] | â€” |

**Indexes:** `[companyId]`, `[isActive]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `internship_applications` (Prisma: `InternshipApplication`)


**Purpose:** Student application to an internship.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | â€” |
| studentId | String | â€” |
| internshipId | String | â€” |
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
| offers | InternshipOffer[] | â€” |

**Indexes:** `[userId]`, `[internshipId]`, `[status]`


**Unique keys:** `[studentId, internshipId]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `internship_offers` (Prisma: `InternshipOffer`)


**Purpose:** Offer extended after internship selection.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| applicationId | String | â€” |
| internshipId | String | â€” |
| stipend | Decimal? | NULLABLE |
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

**Indexes:** `[applicationId]`, `[internshipId]`, `[status]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `internship_progress` (Prisma: `InternshipProgress`)


**Purpose:** Milestone/progress tracking during internship.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | â€” |
| internshipId | String | â€” |
| weekNumber | Int | â€” |
| summary | String? | NULLABLE |
| tasksDone | String? | NULLABLE |
| hoursLogged | Decimal? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| student | Student | Relation |
| internship | Internship | Relation |

**Indexes:** `[studentId]`, `[internshipId]`


**Unique keys:** `[studentId, internshipId, weekNumber]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `mentors` (Prisma: `Mentor`)


**Purpose:** Mentor assigned to internships or projects.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| companyId | String | â€” |
| internshipId | String? | NULLABLE |
| name | String | â€” |
| email | String? | NULLABLE |
| phone | String? | NULLABLE |
| designation | String? | NULLABLE |
| bio | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| company | Company | Relation |
| internship | Internship? | Relation |

**Indexes:** `[companyId]`, `[internshipId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `internship_feedback` (Prisma: `InternshipFeedback`)


**Purpose:** Feedback from mentors/HR on intern performance.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| studentId | String | â€” |
| internshipId | String | â€” |
| rating | Int | â€” |
| comment | String? | NULLABLE |
| givenBy | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| student | Student | Relation |
| internship | Internship | Relation |

**Indexes:** `[studentId]`, `[internshipId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


### Module: Project


#### Table `projects` (Prisma: `Project`)


**Purpose:** Live project opportunity for practice-to-hire.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| companyId | String | â€” |
| categoryId | String? | NULLABLE |
| title | String | â€” |
| slug | String | UNIQUE |
| domain | String? | NULLABLE |
| description | String? | NULLABLE |
| duration | String? | NULLABLE |
| stipend | Decimal? | NULLABLE |
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
| technologies | ProjectTechnology[] | â€” |
| teamMembers | ProjectTeamMember[] | â€” |
| submissions | ProjectSubmission[] | â€” |

**Indexes:** `[companyId]`, `[categoryId]`, `[isActive]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `project_categories` (Prisma: `ProjectCategory`)


**Purpose:** Domain category for projects.


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
| projects | Project[] | â€” |

**Indexes:** Primary key only (add FK indexes in Prisma schema).


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `project_technologies` (Prisma: `ProjectTechnology`)


**Purpose:** Technology tags associated with a project.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| projectId | String | â€” |
| technology | String | â€” |
| createdAt | DateTime | DEFAULT |
| project | Project | Relation |

**Indexes:** `[projectId]`


**Unique keys:** `[projectId, technology]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `project_team_members` (Prisma: `ProjectTeamMember`)


**Purpose:** Student membership on a project team.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| projectId | String | â€” |
| studentId | String | â€” |
| role | String | DEFAULT |
| joinedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| project | Project | Relation |
| student | Student | Relation |

**Indexes:** `[projectId]`, `[studentId]`


**Unique keys:** `[projectId, studentId]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `project_submissions` (Prisma: `ProjectSubmission`)


**Purpose:** Deliverable submission for evaluation.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| projectId | String | â€” |
| studentId | String | â€” |
| title | String | â€” |
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
| evaluations | ProjectEvaluation[] | â€” |

**Indexes:** `[projectId]`, `[studentId]`, `[status]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `project_evaluations` (Prisma: `ProjectEvaluation`)


**Purpose:** Score and feedback on a project submission.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| submissionId | String | â€” |
| evaluatorId | String? | NULLABLE |
| score | Decimal | â€” |
| maxScore | Int | DEFAULT |
| feedback | String? | NULLABLE |
| evaluatedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| submission | ProjectSubmission | Relation |

**Indexes:** `[submissionId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


### Module: Job


#### Table `hr_users` (Prisma: `HrUser`)


**Purpose:** HR persona linked to a company user account.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | UNIQUE |
| companyId | String | â€” |
| designation | String? | NULLABLE |
| department | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| user | User | Relation |
| company | Company | Relation |
| jobs | Job[] | â€” |
| interviews | Interview[] | â€” |

**Indexes:** `[companyId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `jobs` (Prisma: `Job`)


**Purpose:** Full-time/part-time job posting.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| companyId | String | â€” |
| hrUserId | String? | NULLABLE |
| title | String | â€” |
| slug | String | UNIQUE |
| location | String? | NULLABLE |
| type | EmploymentType | DEFAULT |
| mode | WorkMode | DEFAULT |
| salaryMin | Decimal? | NULLABLE |
| salaryMax | Decimal? | NULLABLE |
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
| applications | JobApplication[] | â€” |
| savedBy | SavedJob[] | â€” |
| interviews | Interview[] | â€” |
| offers | JobOffer[] | â€” |

**Indexes:** `[companyId]`, `[hrUserId]`, `[isActive]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `job_applications` (Prisma: `JobApplication`)


**Purpose:** Candidate application to a job.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | â€” |
| jobId | String | â€” |
| status | ApplicationStatus | DEFAULT |
| coverLetter | String? | NULLABLE |
| resumeUrl | String? | NULLABLE |
| appliedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| user | User | Relation |
| job | Job | Relation |
| interviews | Interview[] | â€” |
| offers | JobOffer[] | â€” |

**Indexes:** `[userId]`, `[jobId]`, `[status]`


**Unique keys:** `[userId, jobId]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `saved_jobs` (Prisma: `SavedJob`)


**Purpose:** Candidate saved/bookmarked job.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | â€” |
| jobId | String | â€” |
| createdAt | DateTime | DEFAULT |
| user | User | Relation |
| job | Job | Relation |

**Indexes:** `[userId]`, `[jobId]`


**Unique keys:** `[userId, jobId]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `interviews` (Prisma: `Interview`)


**Purpose:** Interview round scheduled for an application.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| jobId | String | â€” |
| applicationId | String | â€” |
| hrUserId | String? | NULLABLE |
| scheduledAt | DateTime | â€” |
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

**Indexes:** `[jobId]`, `[applicationId]`, `[scheduledAt]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `job_offers` (Prisma: `JobOffer`)


**Purpose:** Employment offer with acceptance lifecycle.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| jobId | String | â€” |
| applicationId | String | â€” |
| salary | Decimal | â€” |
| currency | String | DEFAULT |
| joiningDate | DateTime? | NULLABLE |
| status | JobOfferStatus | DEFAULT |
| offeredAt | DateTime | DEFAULT |
| respondedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| job | Job | Relation |
| application | JobApplication | Relation |

**Indexes:** `[jobId]`, `[applicationId]`, `[status]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `employees` (Prisma: `Employee`)


**Purpose:** Employee record for payroll after hire.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| companyId | String | â€” |
| employeeNo | String | â€” |
| name | String | â€” |
| email | String? | NULLABLE |
| phone | String? | NULLABLE |
| designation | String? | NULLABLE |
| department | String? | NULLABLE |
| salary | Decimal? | NULLABLE |
| currency | String | DEFAULT |
| joinedAt | DateTime? | NULLABLE |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| company | Company | Relation |
| payrollItems | PayrollItem[] | â€” |

**Indexes:** `[companyId]`


**Unique keys:** `[companyId, employeeNo]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `payroll_runs` (Prisma: `PayrollRun`)


**Purpose:** Payroll cycle batch for a company.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| companyId | String? | NULLABLE |
| periodStart | DateTime | â€” |
| periodEnd | DateTime | â€” |
| status | PayrollRunStatus | DEFAULT |
| totalAmount | Decimal? | NULLABLE |
| currency | String | DEFAULT |
| processedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| items | PayrollItem[] | â€” |

**Indexes:** `[periodStart, periodEnd]`, `[status]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `payroll_items` (Prisma: `PayrollItem`)


**Purpose:** Per-employee line item inside a payroll run.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| payrollRunId | String | â€” |
| employeeId | String | â€” |
| grossPay | Decimal | â€” |
| deductions | Decimal | DEFAULT |
| netPay | Decimal | â€” |
| currency | String | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| payrollRun | PayrollRun | Relation |
| employee | Employee | Relation |

**Indexes:** `[payrollRunId]`, `[employeeId]`


**Unique keys:** `[payrollRunId, employeeId]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


### Module: Training


#### Table `training_centers` (Prisma: `TrainingCenter`)


**Purpose:** Training partner org profile (TRAINING role).


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | UNIQUE |
| name | String | â€” |
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
| trainers | Trainer[] | â€” |
| programs | TrainingProgram[] | â€” |
| courses | Course[] | â€” |
| revenue | TrainingRevenue[] | â€” |

**Indexes:** `[city, state]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `trainers` (Prisma: `Trainer`)


**Purpose:** Trainer faculty under a training center.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| trainingCenterId | String | â€” |
| name | String | â€” |
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
| batches | TrainingBatch[] | â€” |

**Indexes:** `[trainingCenterId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `training_programs` (Prisma: `TrainingProgram`)


**Purpose:** Programmes delivered by a training center.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| trainingCenterId | String | â€” |
| title | String | â€” |
| slug | String | UNIQUE |
| description | String? | NULLABLE |
| duration | String? | NULLABLE |
| price | Decimal | DEFAULT |
| currency | String | DEFAULT |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| trainingCenter | TrainingCenter | Relation |
| batches | TrainingBatch[] | â€” |
| assignments | TrainingAssignment[] | â€” |

**Indexes:** `[trainingCenterId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `training_batches` (Prisma: `TrainingBatch`)


**Purpose:** Scheduled cohort batch for a training program.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| programId | String | â€” |
| trainerId | String? | NULLABLE |
| name | String | â€” |
| startDate | DateTime | â€” |
| endDate | DateTime? | NULLABLE |
| capacity | Int | DEFAULT |
| enrolled | Int | DEFAULT |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| program | TrainingProgram | Relation |
| trainer | Trainer? | Relation |
| attendance | AttendanceRecord[] | â€” |

**Indexes:** `[programId]`, `[trainerId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `attendance_records` (Prisma: `AttendanceRecord`)


**Purpose:** Batch attendance for a student/session.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| batchId | String | â€” |
| studentId | String | â€” |
| date | DateTime | â€” |
| status | AttendanceStatus | DEFAULT |
| notes | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| batch | TrainingBatch | Relation |
| student | Student | Relation |

**Indexes:** `[batchId]`, `[studentId]`


**Unique keys:** `[batchId, studentId, date]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `training_assignments` (Prisma: `TrainingAssignment`)


**Purpose:** Assignments issued within a training batch.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| programId | String | â€” |
| studentId | String | â€” |
| title | String | â€” |
| description | String? | NULLABLE |
| dueDate | DateTime? | NULLABLE |
| submittedAt | DateTime? | NULLABLE |
| score | Decimal? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| program | TrainingProgram | Relation |
| student | Student | Relation |

**Indexes:** `[programId]`, `[studentId]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `training_revenue` (Prisma: `TrainingRevenue`)


**Purpose:** Revenue recognition lines for training sales.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| trainingCenterId | String | â€” |
| periodMonth | Int | â€” |
| periodYear | Int | â€” |
| grossRevenue | Decimal | â€” |
| netRevenue | Decimal | â€” |
| currency | String | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| trainingCenter | TrainingCenter | Relation |

**Indexes:** `[trainingCenterId]`


**Unique keys:** `[trainingCenterId, periodMonth, periodYear]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


### Module: Partner


#### Table `partners` (Prisma: `Partner`)


**Purpose:** Channel partner profile (PARTNER role).


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | UNIQUE |
| name | String | â€” |
| region | String? | NULLABLE |
| referralCode | String | UNIQUE |
| commissionPct | Decimal | DEFAULT |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| user | User | Relation |
| leads | PartnerLead[] | â€” |
| referrals | Referral[] | â€” |
| wallet | PartnerWallet? | NULLABLE |
| commissions | Commission[] | â€” |
| payouts | Payout[] | â€” |
| reports | PartnerReport[] | â€” |

**Indexes:** `[referralCode]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `partner_leads` (Prisma: `PartnerLead`)


**Purpose:** Lead captured by a partner for conversion.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| partnerId | String | â€” |
| name | String | â€” |
| email | String? | NULLABLE |
| phone | String? | NULLABLE |
| source | String? | NULLABLE |
| status | String | DEFAULT |
| notes | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| partner | Partner | Relation |

**Indexes:** `[partnerId]`, `[status]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `referrals` (Prisma: `Referral`)


**Purpose:** Referral attribution from partner to student/signup.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| partnerId | String | â€” |
| referredEmail | String | â€” |
| referredUserId | String? | NULLABLE |
| status | String | DEFAULT |
| convertedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| partner | Partner | Relation |
| commissions | Commission[] | â€” |

**Indexes:** `[partnerId]`, `[referredEmail]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `partner_wallets` (Prisma: `PartnerWallet`)


**Purpose:** Partner earnings wallet.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| partnerId | String | UNIQUE |
| balance | Decimal | DEFAULT |
| currency | String | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| partner | Partner | Relation |

**Indexes:** Primary key only (add FK indexes in Prisma schema).


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `commissions` (Prisma: `Commission`)


**Purpose:** Commission accrual events for partner activity.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| partnerId | String | â€” |
| referralId | String? | NULLABLE |
| amount | Decimal | â€” |
| currency | String | DEFAULT |
| status | CommissionStatus | DEFAULT |
| earnedAt | DateTime | DEFAULT |
| paidAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| partner | Partner | Relation |
| referral | Referral? | Relation |
| payouts | Payout[] | â€” |

**Indexes:** `[partnerId]`, `[referralId]`, `[status]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `payouts` (Prisma: `Payout`)


**Purpose:** Partner payout request/settlement records.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| partnerId | String | â€” |
| commissionId | String? | NULLABLE |
| amount | Decimal | â€” |
| currency | String | DEFAULT |
| status | PayoutStatus | DEFAULT |
| reference | String? | NULLABLE |
| processedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| partner | Partner | Relation |
| commission | Commission? | Relation |

**Indexes:** `[partnerId]`, `[commissionId]`, `[status]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `partner_reports` (Prisma: `PartnerReport`)


**Purpose:** Stored report snapshots for partner dashboards.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| partnerId | String | â€” |
| reportType | String | â€” |
| periodStart | DateTime | â€” |
| periodEnd | DateTime | â€” |
| data | Json | â€” |
| generatedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |
| partner | Partner | Relation |

**Indexes:** `[partnerId]`, `[reportType]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


### Module: Admin


#### Table `settings` (Prisma: `Setting`)


**Purpose:** Key-value operational settings.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| key | String | UNIQUE |
| value | String | â€” |
| description | String? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |

**Indexes:** Primary key only (add FK indexes in Prisma schema).


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `configurations` (Prisma: `Configuration`)


**Purpose:** Typed configuration / feature-flag store.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| namespace | String | â€” |
| key | String | â€” |
| value | Json | â€” |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |

**Indexes:** `[namespace]`


**Unique keys:** `[namespace, key]`


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `reports` (Prisma: `Report`)


**Purpose:** Admin-generated operational reports metadata.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| title | String | â€” |
| reportType | String | â€” |
| parameters | Json? | NULLABLE |
| fileUrl | String? | NULLABLE |
| generatedBy | String? | NULLABLE |
| generatedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |

**Indexes:** `[reportType]`, `[generatedAt]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `analytics_snapshots` (Prisma: `AnalyticsSnapshot`)


**Purpose:** Materialized analytics metrics for dashboards.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| metricKey | String | â€” |
| metricValue | Decimal | â€” |
| dimensions | Json? | NULLABLE |
| capturedAt | DateTime | DEFAULT |
| createdAt | DateTime | DEFAULT |

**Indexes:** `[metricKey]`, `[capturedAt]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `announcements` (Prisma: `Announcement`)


**Purpose:** Platform-wide announcements.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| title | String | â€” |
| content | String | â€” |
| targetRole | Role? | NULLABLE |
| isPublished | Boolean | DEFAULT |
| startsAt | DateTime? | NULLABLE |
| endsAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| createdById | String? | NULLABLE |
| updatedById | String? | NULLABLE |

**Indexes:** `[isPublished]`, `[targetRole]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `banners` (Prisma: `Banner`)


**Purpose:** Marketing/UX banners for web surfaces.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| title | String | â€” |
| imageUrl | String | â€” |
| linkUrl | String? | NULLABLE |
| sortOrder | Int | DEFAULT |
| isActive | Boolean | DEFAULT |
| startsAt | DateTime? | NULLABLE |
| endsAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |

**Indexes:** `[isActive]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `cms_pages` (Prisma: `CmsPage`)


**Purpose:** CMS pages (about, terms, policy, landing blocks).


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| slug | String | UNIQUE |
| title | String | â€” |
| content | String | â€” |
| metaTitle | String? | NULLABLE |
| metaDesc | String? | NULLABLE |
| isPublished | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| createdById | String? | NULLABLE |
| updatedById | String? | NULLABLE |

**Indexes:** `[isPublished]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `support_tickets` (Prisma: `SupportTicket`)


**Purpose:** Customer support ticket cases.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | â€” |
| assigneeId | String? | NULLABLE |
| subject | String | â€” |
| description | String | â€” |
| status | TicketStatus | DEFAULT |
| priority | TicketPriority | DEFAULT |
| category | String? | NULLABLE |
| resolvedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| user | User | Relation |
| assignee | User? | Relation |

**Indexes:** `[userId]`, `[assigneeId]`, `[status]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


### Module: Payment


#### Table `payments` (Prisma: `Payment`)


**Purpose:** Payment intent/capture record (Razorpay/Stripe).


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | â€” |
| amount | Decimal | â€” |
| currency | String | DEFAULT |
| status | PaymentStatus | DEFAULT |
| provider | String | DEFAULT |
| reference | String? | UNIQUE, NULLABLE |
| purpose | String? | NULLABLE |
| metadata | Json? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| user | User | Relation |
| invoices | Invoice[] | â€” |
| transactions | Transaction[] | â€” |
| refunds | Refund[] | â€” |

**Indexes:** `[userId]`, `[status]`, `[createdAt]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `invoices` (Prisma: `Invoice`)


**Purpose:** Commercial invoice for subscriptions or orders.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| paymentId | String? | NULLABLE |
| invoiceNo | String | UNIQUE |
| userId | String? | NULLABLE |
| amount | Decimal | â€” |
| taxAmount | Decimal | DEFAULT |
| totalAmount | Decimal | â€” |
| currency | String | DEFAULT |
| status | InvoiceStatus | DEFAULT |
| issuedAt | DateTime? | NULLABLE |
| dueDate | DateTime? | NULLABLE |
| paidAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| payment | Payment? | Relation |

**Indexes:** `[paymentId]`, `[status]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `transactions` (Prisma: `Transaction`)


**Purpose:** Normalized financial transaction log.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| paymentId | String | â€” |
| type | TransactionType | â€” |
| amount | Decimal | â€” |
| currency | String | DEFAULT |
| providerRef | String? | NULLABLE |
| status | PaymentStatus | DEFAULT |
| metadata | Json? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| payment | Payment | Relation |

**Indexes:** `[paymentId]`, `[status]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `refunds` (Prisma: `Refund`)


**Purpose:** Refund against a payment or invoice.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| paymentId | String | â€” |
| amount | Decimal | â€” |
| currency | String | DEFAULT |
| reason | String? | NULLABLE |
| status | PaymentStatus | DEFAULT |
| providerRef | String? | NULLABLE |
| processedAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| payment | Payment | Relation |

**Indexes:** `[paymentId]`, `[status]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `subscriptions` (Prisma: `Subscription`)


**Purpose:** User subscription to a premium plan.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | â€” |
| planId | String | â€” |
| status | SubscriptionStatus | DEFAULT |
| startDate | DateTime | DEFAULT |
| endDate | DateTime? | NULLABLE |
| trialEndsAt | DateTime? | NULLABLE |
| cancelledAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| user | User | Relation |
| plan | PremiumPlan | Relation |

**Indexes:** `[userId]`, `[planId]`, `[status]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `premium_plans` (Prisma: `PremiumPlan`)


**Purpose:** Catalogue of premium entitlement plans.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| name | String | UNIQUE |
| slug | String | UNIQUE |
| description | String? | NULLABLE |
| price | Decimal | â€” |
| currency | String | DEFAULT |
| billingCycle | String | DEFAULT |
| features | Json? | NULLABLE |
| isActive | Boolean | DEFAULT |
| createdAt | DateTime | DEFAULT |
| updatedAt | DateTime | AUTO-UPDATE |
| deletedAt | DateTime? | NULLABLE |
| subscriptions | Subscription[] | â€” |

**Indexes:** Primary key only (add FK indexes in Prisma schema).


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


### Module: Notification


#### Table `notifications` (Prisma: `Notification`)


**Purpose:** In-app notification inbox items.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | â€” |
| title | String | â€” |
| message | String | â€” |
| type | NotificationType | DEFAULT |
| channel | NotificationChannel | DEFAULT |
| isRead | Boolean | DEFAULT |
| link | String? | NULLABLE |
| readAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| user | User | Relation |

**Indexes:** `[userId]`, `[isRead]`, `[createdAt]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `email_logs` (Prisma: `EmailLog`)


**Purpose:** Outbound email delivery log.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String? | NULLABLE |
| toEmail | String | â€” |
| subject | String | â€” |
| template | String? | NULLABLE |
| status | String | DEFAULT |
| providerRef | String? | NULLABLE |
| errorMessage | String? | NULLABLE |
| sentAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| user | User? | Relation |

**Indexes:** `[userId]`, `[toEmail]`, `[status]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `sms_logs` (Prisma: `SmsLog`)


**Purpose:** Outbound SMS delivery log.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String? | NULLABLE |
| phone | String | â€” |
| message | String | â€” |
| status | String | DEFAULT |
| providerRef | String? | NULLABLE |
| errorMessage | String? | NULLABLE |
| sentAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| user | User? | Relation |

**Indexes:** `[userId]`, `[phone]`, `[status]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `push_notifications` (Prisma: `PushNotification`)


**Purpose:** Push notification dispatch log.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String | â€” |
| title | String | â€” |
| body | String | â€” |
| deviceToken | String? | NULLABLE |
| status | String | DEFAULT |
| providerRef | String? | NULLABLE |
| sentAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| user | User | Relation |

**Indexes:** `[userId]`, `[status]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.


#### Table `whatsapp_logs` (Prisma: `WhatsappLog`)


**Purpose:** WhatsApp message delivery log.


**Columns**


| Column | Type | Constraints / Notes |
|---|---|---|
| id | String | PK, DEFAULT |
| userId | String? | NULLABLE |
| phone | String | â€” |
| message | String | â€” |
| template | String? | NULLABLE |
| status | String | DEFAULT |
| providerRef | String? | NULLABLE |
| errorMessage | String? | NULLABLE |
| sentAt | DateTime? | NULLABLE |
| createdAt | DateTime | DEFAULT |
| user | User? | Relation |

**Indexes:** `[userId]`, `[phone]`, `[status]`


**Unique keys:** See column-level UNIQUE.


**Relationships:** Defined via Prisma `@relation` fields above; enforce referential integrity in PostgreSQL.


**Business rules:** Soft-delete via `deletedAt` where present; monetary amounts use `Decimal(14,2)`; status transitions validated in application services.


**Validation rules:** Emails unique and lowercased; OTP expiry enforced; non-negative wallet/payment amounts; enum statuses only.


**Example data:** See seed strategy (`*@ellowring.com` / `password123`) in `backend/prisma/phase4/SEED_STRATEGY.md`.

