# Ellowring — Product Requirements Document (PRD)

**Learn. Prepare. Build. Get Hired.**

---

## Document Control

| Field | Value |
|---|---|
| **Document Title** | Ellowring — Enterprise Product Requirements Document |
| **Product Name** | Ellowring |
| **Legal Entity** | Ellowring Software Solutions |
| **Document Version** | 1.1 |
| **Status** | Approved for Engineering Intake |
| **Date of Issue** | August 2026 |
| **Classification** | Internal / Confidential |
| **Document Owner** | Head of Product, Ellowring Software Solutions |
| **Authors** | Product Management Team, Architecture & Engineering Team |
| **Reviewers** | Founder & CEO, CTO, Head of Design, Head of Growth, Head of Compliance |
| **Approvers** | Founder & CEO, CTO |
| **Intended Audience** | Product, Design (UX/UI), Backend Engineering, Frontend Engineering, QA & Automation, DevOps/SRE, Data & Analytics, Sales & Partnerships, Investors and Board |
| **Distribution** | Restricted — internal stakeholders, contracted vendors under NDA, and prospective investors under NDA |
| **Retention** | Retained for the life of the product; superseded versions archived for 7 years |

### Version History

| Version | Date | Author | Summary of Change |
|---|---|---|---|
| 0.1 | Mar 2026 | Product Team | Initial concept note and module inventory |
| 0.4 | May 2026 | Product + Design | Persona research, journey mapping, IA draft |
| 0.7 | Jun 2026 | Product + Architecture | Technical architecture, data model outline, non-functional requirements |
| 0.9 | Jul 2026 | Product Team | Revenue model, roadmap phasing, risk register |
| **1.0** | **Aug 2026** | **Product + Architecture** | **Complete enterprise PRD covering all 47 chapters; baselined for V1 MVP build** |
| **1.1** | **Aug 2026** | **Product + Design** | **Locked Student Dashboard reference UI PNG as canonical Ch.20.2; Addendum A** |

### Approval Matrix

| Role | Name / Function | Responsibility | Sign-off Required |
|---|---|---|---|
| Founder & CEO | Executive Sponsor | Business model, revenue targets, market positioning | Yes |
| CTO | Technical Sponsor | Architecture, security, scalability, delivery feasibility | Yes |
| Head of Product | Document Owner | Scope, prioritisation, acceptance criteria | Yes |
| Head of Design | Design Authority | Information architecture, design system, accessibility | Yes |
| Head of QA | Quality Authority | Testability, acceptance-oriented requirements | Yes |
| Head of Compliance | Legal & Data Protection | DPDP Act compliance, contracts, payroll statutory scope | Yes |
| Head of Growth | Commercial | Go-to-market, channel partner economics | Advisory |

### How to Read This Document

| Reader | Recommended Chapters |
|---|---|
| Investor / Board | 1-17, 40-43, 44-47 |
| Product Manager | All chapters |
| UX/UI Designer | 10-13, 18-22, 31-33, 37 |
| Backend Engineer | 18-21, 23-36, 38-39 |
| Frontend Engineer | 18-22, 31-33, 37-40 |
| QA Engineer | 21, 23-39, 43 |
| DevOps / SRE | 36, 39, 40-42 |
| Sales & Partnerships | 9-17, 24-30, 37 |

### Terminology and Glossary

| Term | Definition |
|---|---|
| **Ellowring** | The enterprise SaaS web platform described in this document |
| **Ecosystem** | A vertically complete functional domain within Ellowring (e.g., Coaching Ecosystem) |
| **Module** | A user-facing functional unit inside an ecosystem (e.g., Mock Test Engine) |
| **Actor / Role** | A distinct authenticated user type with a scoped permission set |
| **Tenant** | An institutional account (College, Company, Training Institute, Channel Partner) |
| **Learner** | Any student-role user consuming educational content |
| **Candidate** | A student-role user in an active hiring or internship pipeline |
| **Placement Drive** | A time-bound campus or off-campus recruitment event |
| **Live Project** | A real, mentor-supervised, deliverable-based industry project |
| **Wallet** | Internal ledgered store of platform credits and refunds |
| **ATS** | Applicant Tracking System |
| **LMS** | Learning Management System |
| **KPI** | Key Performance Indicator |
| **SLA** | Service Level Agreement |
| **DPDP Act** | Digital Personal Data Protection Act, 2023 (India) |
| **RBAC** | Role-Based Access Control |
| **MRR / ARR** | Monthly / Annual Recurring Revenue |
| **CAC / LTV** | Customer Acquisition Cost / Lifetime Value |
| **NPS** | Net Promoter Score |
| **TAM / SAM / SOM** | Total / Serviceable / Serviceable-Obtainable Addressable Market |

### Requirement Notation Convention

Throughout this document, requirement statements use the following conventions:

| Keyword | Meaning |
|---|---|
| **MUST** | Mandatory. Absence blocks release. |
| **SHOULD** | Strongly recommended. Deviation requires documented justification. |
| **MAY** | Optional. Included at team discretion or in a later version. |
| **AC** | Acceptance Criteria — testable condition that defines "done" |

Requirement identifiers follow the pattern `FR-<MODULE>-<NNN>` for functional requirements and `NFR-<CATEGORY>-<NNN>` for non-functional requirements.

---

## Table of Contents

| # | Chapter |
|---|---|
| 1 | Executive Summary |
| 2 | Company Overview |
| 3 | Product Vision |
| 4 | Mission Statement |
| 5 | Business Objectives |
| 6 | Product Goals |
| 7 | Problem Statement |
| 8 | Proposed Solution |
| 9 | Market Opportunity |
| 10 | Target Audience |
| 11 | User Personas |
| 12 | Customer Journey |
| 13 | Product Positioning |
| 14 | Competitive Analysis |
| 15 | SWOT Analysis |
| 16 | Business Model |
| 17 | Revenue Model |
| 18 | User Roles |
| 19 | Website Information Architecture |
| 20 | Dashboard Information Architecture |
| 21 | Detailed Module Explanation |
| 22 | Student Journey |
| 23 | Coaching Ecosystem |
| 24 | College Admission Ecosystem |
| 25 | Study Abroad Ecosystem |
| 26 | Course Ecosystem |
| 27 | Internship Ecosystem |
| 28 | Live Project Ecosystem |
| 29 | Hiring Ecosystem |
| 30 | Payroll Ecosystem |
| 31 | AI Features |
| 32 | Wallet & Coupon System |
| 33 | Notification System |
| 34 | Analytics |
| 35 | Reports |
| 36 | Security Overview |
| 37 | Product Features List |
| 38 | Functional Scope |
| 39 | Non-Functional Scope |
| 40 | Version 1 MVP Scope |
| 41 | Version 2 Roadmap |
| 42 | Version 3 Roadmap |
| 43 | Product Success Metrics |
| 44 | Risks |
| 45 | Assumptions |
| 46 | Future Enhancements |
| 47 | Conclusion |

---

# Chapter 1 — Executive Summary

> **Purpose of this chapter:** To provide executives, investors, and incoming team members with a complete, self-contained understanding of what Ellowring is, why it exists, who it serves, how it makes money, and what is being built — in a single readable chapter.

## 1.1 The One-Paragraph Summary

Ellowring is an enterprise-grade SaaS web platform built by Ellowring Software Solutions that unifies the entire Indian education-to-employment lifecycle into a single, AI-powered ecosystem. A student joins Ellowring in 11th Standard seeking stream and career clarity, prepares for competitive examinations such as NEET, JEE, CUET, UPSC, TNPSC, SSC, Banking, Railway, Defence, Police, TET and TRB through structured coaching, secures admission into a college through verified admission partnerships or pursues study-abroad pathways, upskills through industry-relevant certification courses, gains practical exposure through internships and mentor-supervised live projects, and finally enters the workforce through Ellowring's integrated hiring and placement network — with the employer's onboarding and payroll also running on the same platform. One identity, one profile, one continuous data trail, from Class 11 to first salary slip.

## 1.2 The Core Insight

The Indian education and employment market is not short of products. It is short of **continuity**. A student today uses one application for coaching, another for admission counselling, a third for skill courses, a fourth for internships, a fifth for job applications, and a physical consultant for study abroad. Each of these systems begins with zero knowledge of the student. Each asks the same questions again. None of them carries forward what the student has actually learned, scored, built, or proven.

Ellowring's foundational insight is that **the value is in the continuity, not in any single module**. A platform that knows a student's Class 11 stream aptitude, their NEET mock test trajectory, the college they joined, the four certification courses they completed, the two live projects they shipped, and the internship feedback they received can make a hiring recommendation that no standalone job board can match. Every module makes every other module smarter.

## 1.3 What Ellowring Is

| Dimension | Description |
|---|---|
| **Product Category** | Vertically integrated Education, Career and Hiring SaaS platform |
| **Delivery Model** | Cloud-hosted, multi-tenant web application (responsive; mobile app in later versions) |
| **Primary Market** | India (Tier 1, Tier 2, Tier 3 cities and semi-urban districts) |
| **Future Market** | Global — starting with the Indian diaspora corridor, GCC, South-East Asia and Africa |
| **Business Model** | Hybrid — B2C transactional, B2C subscription, B2B SaaS subscription, B2B2C partnership commission |
| **Core Differentiator** | Single continuous student identity spanning 11th Standard to first job, with employer-side payroll closing the loop |
| **Technology Stack** | Next.js / React / TypeScript / Tailwind CSS / shadcn-ui frontend; NestJS backend; PostgreSQL with Prisma ORM; JWT, Google OAuth and OTP authentication; Razorpay and Stripe payments; Cloudflare R2 object storage; Vercel, Railway and AWS deployment |

## 1.4 The Six Actors

Ellowring is a six-sided platform. Each side both consumes and produces value for the others.

| # | Role | What They Get | What They Contribute |
|---|---|---|---|
| 1 | **Student** | Career clarity, coaching, admission help, courses, internships, projects, jobs | Demand, engagement data, verified skill signal |
| 2 | **College** | Verified admission leads, placement automation, student outcome analytics | Seats, campus placement drives, institutional credibility |
| 3 | **HR / Company** | Pre-verified, skill-proven candidate pipeline; ATS; payroll | Jobs, internships, live projects, hiring revenue |
| 4 | **Training Institute** | Distribution for coaching and courses, batch and content tooling | Educational supply, faculty, curriculum |
| 5 | **Channel Partner** | Commission income from referrals across every revenue line | Local market reach, especially Tier 2/3 penetration |
| 6 | **Admin** | Full platform governance, verification, finance, moderation | Trust, quality control, dispute resolution |

## 1.5 The Sixteen Core Modules

| Module | One-Line Description |
|---|---|
| Career Guidance | Psychometric and aptitude-driven stream and career recommendation engine |
| Competitive Exam Coaching | Structured live and recorded coaching for 15+ examination tracks |
| College Admissions | Verified college discovery, comparison, application and admission tracking |
| Study Abroad | Country, university and visa pathway management with counsellor workflow |
| Skill Courses | Industry-aligned certification courses with assessments and certificates |
| Internships | Internship discovery, application, selection and completion certification |
| Live Projects | Mentor-supervised, deliverable-based real industry projects with portfolio output |
| Jobs & Placements | Job discovery, application, campus placement drives, offer management |
| HR Hiring | Employer-side ATS: job posting, screening, interview scheduling, offers |
| Payroll | Employee onboarding, attendance, salary structure, payslips, statutory compliance |
| AI Career Assistant | Conversational and proactive AI for career, learning, resume and interview support |
| Wallet | Ledgered internal credit store for payments, refunds, commissions and payouts |
| Coupons | Discount, referral and campaign engine across all paid modules |
| Certificates | Verifiable, uniquely-coded digital certificates for every completion |
| Notifications | Multi-channel in-app, email, SMS/WhatsApp and push communication system |
| Analytics | Role-scoped dashboards, funnels, cohorts, outcomes and business intelligence |

## 1.6 Revenue Architecture at a Glance

| Revenue Line | Type | Payer | Model |
|---|---|---|---|
| Coaching fees | Transactional | Student | Per-course / per-batch fee, EMI supported |
| College admission partnership | Commission | College | Per-confirmed-admission fee or annual retainer |
| Study abroad services | Service fee + commission | Student + University | Package fee plus university commission |
| Skill courses | Transactional | Student | Per-course fee or bundle |
| Internship placement | Fee | Student and/or Company | Nominal student fee and/or employer posting fee |
| Live projects | Fee | Student + Company | Student enrolment fee; company sponsorship |
| Recruitment | Transactional | Company | Per-hire fee or job posting credits |
| Payroll | SaaS | Company | Per-employee-per-month subscription |
| Premium membership | Subscription | Student | Monthly / annual student premium |
| Company hiring packages | Subscription | Company | Tiered annual hiring packages |
| SaaS subscription | Subscription | College / Training Institute | Annual per-institution licence |
| Channel partner network | Revenue share | Platform —' Partner | Commission payout (cost line generating volume) |
| Advertising | Future | Institutions / Brands | Sponsored placement (V3) |

## 1.7 Delivery Phasing Summary

| Version | Theme | Target Window | Headline Scope |
|---|---|---|---|
| **V1 — MVP** | Prove the spine | Months 0-6 | Auth, Student/College/HR/Admin dashboards, Career Guidance, Coaching, Courses, Colleges, Internships, Jobs, Payments, Wallet, Coupons, Certificates, Notifications, Basic Analytics |
| **V2 — Depth** | Deepen and monetise | Months 7-14 | Live Projects, Study Abroad, full ATS, Payroll, Training and Channel Partner dashboards, advanced AI, advanced analytics, mobile apps |
| **V3 — Scale** | Scale and expand | Months 15-30 | Global expansion, marketplace, advertising, enterprise API, credential verification network, predictive intelligence |

## 1.8 Headline Success Metrics (Year 1)

| Metric | Year 1 Target |
|---|---|
| Registered students | 250,000 |
| Monthly active students | 90,000 |
| Paying students | 22,000 |
| Partner colleges | 400 |
| Partner companies | 600 |
| Channel partners | 1,200 |
| Internships facilitated | 15,000 |
| Placements facilitated | 5,000 |
| Annual revenue run rate | —,—28-35 crore |
| Student NPS | —— 55 |
| Platform uptime | —— 99.9% |

## 1.9 Why Now

| Enabling Condition | Evidence |
|---|---|
| Digital payment ubiquity | UPI has normalised small-ticket digital payments across all income tiers |
| Post-pandemic online learning acceptance | Live online coaching is now mainstream, including in Tier 2/3 |
| National Education Policy alignment | NEP 2020 emphasises multidisciplinary skills, credit portability and employability |
| Employer skills-first shift | Employers increasingly value demonstrated projects over degree pedigree alone |
| AI cost curve | Large language models now make personalised guidance economically viable at scale |
| Fragmentation fatigue | Students and parents are actively frustrated by managing 6-8 disconnected platforms |

## 1.10 What Success Looks Like

Three years from launch, a student in a Tier 3 district town in Tamil Nadu should be able to say: *"I found my career direction on Ellowring in Class 11, cleared my entrance exam with Ellowring coaching, chose and joined my college through Ellowring, learned my job skills there, built two real projects, did an internship, and got my first job — all from the same login. My employer pays my salary through the same platform."*

That sentence is the entire product strategy.

---

# Chapter 2 — Company Overview

> **Purpose of this chapter:** To establish who Ellowring Software Solutions is, its operating philosophy, organisational structure, values, and the strategic logic behind building a vertically integrated platform rather than a single-purpose product.

## 2.1 Corporate Identity

| Attribute | Detail |
|---|---|
| **Company Name** | Ellowring Software Solutions |
| **Flagship Product** | Ellowring |
| **Tagline** | Learn. Prepare. Build. Get Hired. |
| **Category** | EdTech + CareerTech + HRTech convergence |
| **Headquarters Market** | India |
| **Operating Model** | Product-led SaaS with partner-assisted distribution |
| **Expansion Horizon** | India-first, global-ready architecture |

## 2.2 Founding Rationale

Ellowring Software Solutions was founded on the observation that India produces one of the world's largest annual cohorts of graduates while simultaneously reporting one of the world's most persistent employability gaps. The gap is not principally a gap of intelligence, ambition, or even access to information. It is a gap of **structured, continuous, outcome-linked guidance**.

The company's founding thesis has four parts:

1. **Guidance must start early.** By the time a student reaches final-year placement season, most determinative decisions — stream, entrance exam, college, branch, early skills — are already locked in. Intervening at Class 11 changes the outcome distribution far more than intervening at Year 4.
2. **Fragmentation destroys compounding.** Each disconnected platform discards the student's history. A unified platform compounds it.
3. **Employability is provable, not claimable.** Resumes assert. Projects, assessments, internship feedback and verified certificates demonstrate. A platform that owns the demonstration owns the trust.
4. **The employer must be inside the loop, not outside it.** A platform that only sends resumes to employers is a marketplace. A platform that hosts the employer's hiring workflow and payroll becomes infrastructure.

## 2.3 Operating Philosophy

| Principle | Practical Meaning |
|---|---|
| **Outcome over engagement** | We optimise for admissions, internships, placements and salaries — not screen time |
| **Verified over claimed** | Every institution, employer and certificate is verified before it is surfaced |
| **Accessible over exclusive** | Free tier must be genuinely useful; pricing must work for Tier 2/3 households |
| **Integrated over bolted-on** | New modules must share the identity, wallet, notification and analytics spine |
| **Trust is the product** | In education and hiring, one fraud incident costs more than a hundred features |
| **Build for the district, not the metro** | If it works on a —,—8,000 Android phone on a 3G connection in a district town, it works everywhere |

## 2.4 Organisational Functions

| Function | Charter | Key Interfaces |
|---|---|---|
| **Product Management** | Roadmap, requirements, prioritisation, success metrics | All functions |
| **Design (UX/UI)** | Information architecture, design system, accessibility, usability research | Product, Frontend |
| **Frontend Engineering** | Next.js web application, dashboards, design-system implementation | Design, Backend |
| **Backend Engineering** | NestJS services, domain logic, integrations, data model | Product, DevOps, Data |
| **Data & Analytics** | Event pipeline, warehouse, dashboards, AI feature data, reporting | Product, Backend |
| **QA & Automation** | Test strategy, regression suites, release certification | Engineering, Product |
| **DevOps / SRE** | CI/CD, infrastructure, observability, incident response, cost control | Engineering |
| **Academic & Content** | Curriculum, question banks, course quality, faculty onboarding | Product, Training partners |
| **Partnerships** | Colleges, training institutes, universities abroad, channel partners | Growth, Admin Ops |
| **Enterprise Sales** | Employer hiring packages, payroll SaaS, institutional licences | Growth, Product |
| **Admin Operations** | Verification, moderation, dispute resolution, payout processing | All |
| **Finance** | Revenue recognition, reconciliation, commission payouts, taxation | Admin Ops, Product |
| **Compliance & Legal** | DPDP Act, contracts, payroll statutory obligations, IP | All |
| **Customer Success** | Onboarding, retention, escalation, institutional health | Product, Sales |

## 2.5 Core Values

| Value | Definition | Anti-Pattern We Reject |
|---|---|---|
| **Student First** | Every trade-off is resolved in the student's long-term favour | Dark patterns that inflate conversions at the cost of student outcomes |
| **Radical Verification** | Nothing enters the platform unverified | Listing unverified colleges or ghost job postings to inflate inventory |
| **Transparent Pricing** | Every fee, refund and commission is visible before commitment | Hidden charges revealed at checkout |
| **Craft** | Enterprise-grade engineering, not prototype-grade shortcuts | "We'll fix scalability later" |
| **Compounding Data Ethics** | Data enriches the student's own profile first, the platform second | Selling personal data to third parties |
| **Serve the Underserved** | Tier 2/3 accessibility is a design constraint, not charity | Metro-only assumptions about bandwidth, device and pricing |

## 2.6 Strategic Positioning of the Company

Ellowring Software Solutions does not position itself as an EdTech company that also does hiring, nor as an HRTech company that also does learning. It positions itself as an **education-to-employment infrastructure company**. The strategic implication of this positioning is that defensibility comes from three compounding assets:

| Asset | How It Compounds | Why It Is Hard to Copy |
|---|---|---|
| **Longitudinal student graph** | Every module adds verified signal to the same profile | Requires years of continuous engagement to accumulate |
| **Verified institutional network** | Colleges, companies and training institutes reinforce each other | Requires slow, relationship-driven field sales |
| **Outcome data flywheel** | Placement outcomes improve recommendations, which improve outcomes | Requires closed-loop visibility from learning to salary |

## 2.7 Company Milestones and Trajectory

| Phase | Horizon | Company Milestone |
|---|---|---|
| **Foundation** | Months 0-6 | V1 MVP shipped; first 50 colleges and 100 companies onboarded |
| **Traction** | Months 7-14 | V2 shipped; payroll live; 250k students; positive unit economics per module |
| **Scale** | Months 15-30 | V3 shipped; multi-state dominance; international pilot; enterprise API |
| **Category Leadership** | Year 3+ | Recognised default platform for Indian education-to-employment transition |

## 2.8 Relationship Between Company and Product

| Company Capability | Product Manifestation |
|---|---|
| Academic content network | Coaching Ecosystem, Course Ecosystem |
| College partnership network | College Admission Ecosystem |
| University partnership network (international) | Study Abroad Ecosystem |
| Employer relationships | Internship, Live Project, Hiring, Payroll Ecosystems |
| Channel partner field network | Channel Partner Dashboard, referral and commission engine |
| Engineering and AI capability | AI Career Assistant, recommendation and matching engines |
| Trust and verification operations | Admin Dashboard, verification workflows, certificate authenticity |

---

# Chapter 3 — Product Vision

> **Purpose of this chapter:** To articulate the long-term destination of the product, the principles that guide every product decision toward it, and the concrete future-state description that engineering and design should design backwards from.

## 3.1 Vision Statement

> **From 11th Standard to First Job — Everything in One Platform.**

## 3.2 Vision Expanded

Ellowring's vision is a future in which an Indian student never again has to assemble their own path from disconnected fragments. In that future:

- A Class 11 student's stream confusion is resolved with data, not opinion.
- Entrance examination preparation is personalised to the individual's actual weak concepts, not delivered as a uniform lecture series.
- College selection is based on verified placement outcomes and transparent fees, not on brochures and paid rankings.
- Study abroad is a structured, milestone-tracked pathway rather than an opaque consultancy transaction.
- Skills are acquired against actual employer demand signals visible on the same platform.
- Every student graduates with a portfolio of real, mentor-verified project work — not just a mark sheet.
- Employers hire from a pool where every claim is already verified by the platform.
- The first salary is credited through a payroll system that already knows the employee's entire learning history.

## 3.3 The Vision as a Timeline

| Student Stage | Age | Ellowring's Role | Modules Engaged |
|---|---|---|---|
| Class 11 entry | 16 | Stream and career clarity | Career Guidance, AI Assistant |
| Class 11-12 | 16-18 | Entrance exam preparation | Coaching, Mock Tests, Doubt Solving |
| Class 12 exit | 18 | College selection and admission | College Admissions, Study Abroad, Scholarships |
| College Year 1-2 | 18-20 | Foundational skill building | Skill Courses, Certificates, Communication |
| College Year 2-3 | 19-21 | Practical exposure | Internships, Live Projects, Portfolio |
| College Year 3-4 | 20-22 | Placement readiness | Placement Prep, Coding Prep, Interview Prep, Resume Builder |
| Graduation | 22 | Job acquisition | Jobs & Placements, Campus Drives, Offer Management |
| First job | 22+ | Employment lifecycle | Payroll, Onboarding, Continuing Education |

## 3.4 Vision Pillars

| Pillar | Description | Product Implication |
|---|---|---|
| **Continuity** | One identity across eight years of a student's life | Single unified profile schema; no data silos between modules |
| **Personalisation** | Guidance adapted to the individual's demonstrated data | AI layer with access to cross-module signals |
| **Verification** | Every claim on the platform is provable | Verification workflows, unique certificate codes, audit trails |
| **Accessibility** | Usable and affordable across income and geography tiers | Performance budgets, regional language roadmap, free tier, EMI |
| **Outcome Orientation** | Measured by admissions, internships, placements, salaries | Outcome telemetry embedded from day one |
| **Ecosystem Symbiosis** | Each actor's participation improves every other actor's value | Cross-role data contracts and shared marketplace surfaces |

## 3.5 Design Principles Derived from the Vision

| # | Principle | Application |
|---|---|---|
| 1 | **One profile, many lenses** | The same student record renders differently to student, college, HR and admin, governed by RBAC |
| 2 | **Never ask twice** | Any datum captured in any module is reused platform-wide with consent |
| 3 | **Progress must be visible** | Every module exposes explicit progress state on the dashboard |
| 4 | **The next best action is always offered** | Every screen surfaces a contextual recommended next step |
| 5 | **Trust signals are always present** | Verification badges, outcome statistics and transparent pricing on every listing |
| 6 | **Degrade gracefully** | Poor connectivity reduces fidelity, never functionality |
| 7 | **Explainable AI** | AI recommendations always state their reasoning basis |
| 8 | **Institutional self-service** | Colleges, companies and training institutes operate without platform hand-holding |

## 3.6 What Ellowring Will Deliberately Not Be

| Not This | Rationale |
|---|---|
| A generic MOOC library | Undifferentiated content is a commodity; curation and outcomes are the value |
| A resume-spam job board | Volume without verification destroys employer trust |
| A social network | Engagement-maximising social loops conflict with outcome orientation |
| A pure marketplace with no quality control | Unverified supply is the primary failure mode of Indian education platforms |
| A K-8 learning app | Focus begins at Class 11, where career determination begins |
| An offline-first coaching chain | Physical delivery does not scale with software economics |

## 3.7 Vision Measurement

| Vision Pillar | Long-Term Measure | Year 3 Target |
|---|---|---|
| Continuity | % of students active across —— 4 modules | 40% |
| Continuity | Median student tenure on platform | 30 months |
| Personalisation | % of students accepting AI-recommended next action | 45% |
| Verification | % of listed institutions verified | 100% |
| Accessibility | % of paying users from Tier 2/3 | 60% |
| Outcome Orientation | Placement rate among placement-ready students | 65% |
| Ecosystem Symbiosis | % of hires sourced from students who used —— 3 Ellowring modules | 55% |

---

# Chapter 4 — Mission Statement

> **Purpose of this chapter:** To convert the vision into an operating mission with explicit commitments, measurable mission objectives, and stakeholder-specific promises that guide day-to-day product decisions.

## 4.1 Mission Statement

> **To build India's most trusted Education, Career and Hiring Ecosystem that supports students from 11th Standard to First Job through one AI-powered platform.**

## 4.2 Deconstructing the Mission

| Mission Phrase | What It Commits Us To | How It Is Enforced in Product |
|---|---|---|
| **"India's most trusted"** | Trust is the primary competitive axis, above scale or price | Mandatory verification, transparent pricing, refund policy, grievance workflow |
| **"Education, Career and Hiring Ecosystem"** | Three domains, not one; ecosystem, not application | Six roles, sixteen modules, cross-role marketplaces |
| **"Supports students"** | Student is the centre of gravity even in B2B modules | Student consent gates on data sharing; student-visible outcome data |
| **"From 11th Standard to First Job"** | An eight-year relationship, not a transaction | Longitudinal profile, stage-aware dashboards, lifecycle notifications |
| **"One AI-powered platform"** | Single system with AI as a native layer, not a bolt-on | Shared identity, shared wallet, shared notifications, AI with cross-module context |

## 4.3 Mission Commitments by Stakeholder

### 4.3.1 To Students

| # | Commitment | Product Guarantee |
|---|---|---|
| 1 | You will always know your next best step | Contextual next-action recommendation on every dashboard |
| 2 | You will never pay a hidden charge | All-inclusive pricing displayed before payment; itemised invoice after |
| 3 | Your data belongs to you | Export, deletion and consent controls in profile settings |
| 4 | Every opportunity shown to you is real | 100% employer and institution verification before listing |
| 5 | Your achievements are portable and provable | Publicly verifiable certificate codes and shareable portfolio |
| 6 | You will get help in your language | Regional language expansion roadmap (V2/V3) |

### 4.3.2 To Colleges

| # | Commitment | Product Guarantee |
|---|---|---|
| 1 | Leads will be genuine and intent-qualified | Lead scoring, duplicate suppression, verified contact details |
| 2 | Placement operations will be measurably cheaper | Drive automation, bulk shortlisting, automated student communication |
| 3 | You will own your data | Institution-scoped data export; no cross-college data leakage |
| 4 | Outcomes will be transparent | Placement analytics benchmarked against anonymised peer set |

### 4.3.3 To Employers

| # | Commitment | Product Guarantee |
|---|---|---|
| 1 | Candidates will be pre-verified | Platform-verified education, certificates, projects and assessments |
| 2 | Time-to-hire will fall | Integrated ATS, assessment scores, interview scheduling in one flow |
| 3 | Hiring and payroll will be one continuous flow | Offer acceptance converts directly into payroll onboarding |
| 4 | You will reach beyond metro talent pools | Tier 2/3 candidate reach through college and channel partner network |

### 4.3.4 To Training Institutes

| # | Commitment | Product Guarantee |
|---|---|---|
| 1 | You will get distribution without building software | Full batch, content, assessment and revenue tooling out of the box |
| 2 | Settlement will be timely and transparent | Automated revenue-share ledger and scheduled payouts |

### 4.3.5 To Channel Partners

| # | Commitment | Product Guarantee |
|---|---|---|
| 1 | Every conversion you drive will be attributed | Unique referral codes, immutable attribution ledger |
| 2 | Payouts will be predictable | Published commission schedule, wallet-based payouts, payout SLA |

### 4.3.6 To Investors

| # | Commitment | Product Guarantee |
|---|---|---|
| 1 | Diversified, non-correlated revenue | Thirteen revenue lines across B2C and B2B |
| 2 | Compounding defensibility | Longitudinal data graph and verified network effects |
| 3 | Governance and auditability | Full financial ledger, audit trails, compliance posture |

## 4.4 Mission Objectives (Measurable)

| Objective | Metric | Year 1 | Year 2 | Year 3 |
|---|---|---|---|---|
| Reach students early | % of new students joining in Class 11/12 | 30% | 38% | 45% |
| Build trust | Student NPS | 55 | 62 | 70 |
| Deliver outcomes | Placements facilitated (cumulative) | 5,000 | 25,000 | 80,000 |
| Democratise access | % paying users from Tier 2/3 | 45% | 55% | 60% |
| Institutionalise | Partner colleges | 400 | 1,200 | 3,000 |
| Employ AI meaningfully | % of students using AI Assistant monthly | 40% | 55% | 65% |
| Prove continuity | % of students active in —— 3 modules | 22% | 32% | 42% |

## 4.5 Mission Guardrails

The following are treated as non-negotiable constraints on all product decisions:

| Guardrail | Rule |
|---|---|
| **No unverified listings** | No college, company, internship or job may be publicly visible without completed verification |
| **No misleading outcome claims** | Placement and salary statistics must be sourced from platform-verified records or explicitly labelled as institution-declared |
| **No personal data sale** | Personal data is never sold or licensed to third parties |
| **No forced bundling** | Students may purchase any module independently |
| **No fee opacity** | Total payable amount, taxes and refund terms disclosed before payment |
| **No dark-pattern retention** | Cancellation and refund flows must be as easy as purchase flows |

---

# Chapter 5 — Business Objectives

> **Purpose of this chapter:** To define the measurable commercial, operational, and strategic objectives that Ellowring must achieve, with explicit targets, owners, and dependencies, so that product scope can be traced to business value.

## 5.1 Objective Framework

Business objectives are grouped into six categories. Each objective carries an identifier (`BO-<n>`), a metric, targets across three years, an accountable function, and the product capability it depends upon.

## 5.2 Category A — Growth Objectives

| ID | Objective | Metric | Y1 | Y2 | Y3 | Owner | Product Dependency |
|---|---|---|---|---|---|---|---|
| BO-1 | Build a large registered student base | Registered students | 250,000 | 900,000 | 2,500,000 | Growth | Public site SEO, free tier, referral engine |
| BO-2 | Convert registration into active usage | Monthly active students | 90,000 | 340,000 | 1,000,000 | Product | Dashboard engagement, notifications, AI assistant |
| BO-3 | Convert activity into revenue | Paying students | 22,000 | 95,000 | 300,000 | Growth | Payment flows, EMI, coupons, premium tier |
| BO-4 | Expand institutional supply | Partner colleges | 400 | 1,200 | 3,000 | Partnerships | College dashboard, admission ecosystem |
| BO-5 | Expand employer demand | Partner companies | 600 | 2,200 | 6,000 | Enterprise Sales | HR dashboard, ATS, hiring packages |
| BO-6 | Build distribution reach | Active channel partners | 1,200 | 4,000 | 10,000 | Growth | Channel partner dashboard, commission engine |
| BO-7 | Expand geographically | States with —— 5% student share | 4 | 9 | 16 | Growth | Regional language support, local partner network |

## 5.3 Category B — Revenue Objectives

| ID | Objective | Metric | Y1 | Y2 | Y3 | Owner | Product Dependency |
|---|---|---|---|---|---|---|---|
| BO-8 | Achieve headline revenue | Annual revenue | —,—30 Cr | —,—115 Cr | —,—320 Cr | CEO | All monetised modules |
| BO-9 | Build recurring revenue base | ARR from subscriptions (premium + SaaS + payroll) | —,—6 Cr | —,—34 Cr | —,—120 Cr | Product | Premium tier, SaaS billing, payroll |
| BO-10 | Diversify revenue | No single line > 35% of revenue | Yes | Yes | Yes | Finance | Multi-module monetisation |
| BO-11 | Improve monetisation efficiency | ARPPU (average revenue per paying user) | —,—6,800 | —,—8,200 | —,—9,500 | Product | Cross-sell, bundles, upsell surfaces |
| BO-12 | Grow B2B share | B2B revenue as % of total | 30% | 42% | 50% | Enterprise Sales | Payroll, hiring packages, institutional SaaS |

## 5.4 Category C — Unit Economics Objectives

| ID | Objective | Metric | Y1 | Y2 | Y3 | Owner | Product Dependency |
|---|---|---|---|---|---|---|---|
| BO-13 | Control acquisition cost | Blended student CAC | —,—420 | —,—340 | —,—280 | Growth | Referral engine, organic SEO, channel partners |
| BO-14 | Maximise lifetime value | Student LTV | —,—4,200 | —,—6,500 | —,—9,000 | Product | Cross-module retention, multi-year lifecycle |
| BO-15 | Achieve healthy ratio | LTV:CAC | —— 10:1 | —— 19:1 | —— 32:1 | CEO | Combined effect of BO-13, BO-14 |
| BO-16 | Improve gross margin | Blended gross margin | 52% | 62% | 68% | Finance | Content amortisation, infrastructure efficiency |
| BO-17 | Reach contribution positivity | Contribution margin positive modules | 6 of 10 | 9 of 10 | 10 of 10 | Product | Per-module P&L instrumentation |

## 5.5 Category D — Outcome Objectives

These objectives measure whether Ellowring actually delivers on its mission, and are treated with equal weight to revenue objectives.

| ID | Objective | Metric | Y1 | Y2 | Y3 | Owner |
|---|---|---|---|---|---|---|
| BO-18 | Facilitate admissions | Confirmed admissions via platform | 12,000 | 48,000 | 140,000 | Partnerships |
| BO-19 | Facilitate internships | Internships completed | 15,000 | 65,000 | 200,000 | Product |
| BO-20 | Facilitate placements | Placements confirmed | 5,000 | 25,000 | 80,000 | Enterprise Sales |
| BO-21 | Improve exam outcomes | % of coaching students improving mock percentile —— 15 points | 55% | 62% | 70% | Academic |
| BO-22 | Build verified portfolios | Students with —— 1 verified live project | 8,000 | 45,000 | 160,000 | Product |
| BO-23 | Improve salary outcomes | Median first-salary premium vs. peer baseline | +8% | +14% | +20% | Product |

## 5.6 Category E — Operational Objectives

| ID | Objective | Metric | Y1 | Y2 | Y3 | Owner |
|---|---|---|---|---|---|---|
| BO-24 | Maintain platform reliability | Uptime | 99.9% | 99.95% | 99.97% | SRE |
| BO-25 | Maintain verification integrity | Verified listings | 100% | 100% | 100% | Admin Ops |
| BO-26 | Resolve support quickly | Median first-response time | < 4 h | < 2 h | < 1 h | Customer Success |
| BO-27 | Settle partners on time | Payouts within SLA | 95% | 98% | 99% | Finance |
| BO-28 | Control fraud | Confirmed fraud incidents per 10,000 transactions | < 5 | < 3 | < 2 | Admin Ops |
| BO-29 | Institutional self-service | % of institutional tasks completed without support ticket | 75% | 85% | 92% | Product |

## 5.7 Category F — Strategic Objectives

| ID | Objective | Description | Target Horizon |
|---|---|---|---|
| BO-30 | Category definition | Be referenced as the reference "education-to-employment platform" in Indian industry discourse | Year 2 |
| BO-31 | Data moat | Accumulate longitudinal records on —— 1 million students spanning —— 3 modules | Year 3 |
| BO-32 | Employer infrastructure lock-in | —— 1,500 companies running payroll on Ellowring | Year 3 |
| BO-33 | International beachhead | Live operations in —— 2 international markets | Year 3 |
| BO-34 | Regulatory readiness | Full DPDP Act compliance certification and payroll statutory audit clearance | Year 1 |
| BO-35 | Ecosystem API | Public partner API with —— 50 integrated third parties | Year 3 |

## 5.8 Objective-to-Module Traceability

| Business Objective Cluster | Primary Enabling Modules |
|---|---|
| Growth (BO-1 to BO-7) | Public Site, Career Guidance, Coaching, Referrals, College & HR dashboards |
| Revenue (BO-8 to BO-12) | Payments, Premium, Payroll, Hiring Packages, SaaS Billing |
| Unit Economics (BO-13 to BO-17) | Referral engine, Analytics, Notification retention loops |
| Outcomes (BO-18 to BO-23) | Admissions, Internships, Live Projects, Placements, Coaching |
| Operations (BO-24 to BO-29) | Admin Dashboard, Verification, Wallet, Support, Observability |
| Strategy (BO-30 to BO-35) | Data platform, Payroll, Study Abroad, Public API |

## 5.9 Objective Review Cadence

| Cadence | Forum | Objectives Reviewed |
|---|---|---|
| Weekly | Product & Growth stand-up | BO-1, BO-2, BO-3, BO-13 |
| Monthly | Business review | All Category A, B, C |
| Quarterly | Board review | All categories; roadmap re-baselining |
| Annually | Strategy offsite | Category F; three-year target revision |

---

# Chapter 6 — Product Goals

> **Purpose of this chapter:** To translate business objectives into concrete, testable product goals that engineering and design teams can build against, with explicit definitions of done.

## 6.1 Goal Structure

Each product goal (`PG-<n>`) states the outcome, the measurable definition of success, the modules involved, and the version in which it is expected to be achieved.

## 6.2 Goal Group 1 — Unified Identity and Continuity

| ID | Goal | Definition of Success | Modules | Version |
|---|---|---|---|---|
| PG-1 | One account serves the student for eight years | A single student record persists across school, college and employment stages without migration | Auth, Profile | V1 |
| PG-2 | Data captured once is never re-requested | Zero duplicate field capture across module onboarding flows | All | V1 |
| PG-3 | Stage-aware experience | Dashboard content adapts automatically to the student's declared academic stage | Student Dashboard | V1 |
| PG-4 | Portable verified portfolio | Student can generate a single public profile URL containing verified certificates, projects and assessments | Certificates, Projects | V2 |
| PG-5 | Employment continuity | Accepted job offer automatically initiates payroll onboarding for the same identity | Hiring, Payroll | V2 |

## 6.3 Goal Group 2 — Guidance and Personalisation

| ID | Goal | Definition of Success | Modules | Version |
|---|---|---|---|---|
| PG-6 | Every student receives a career direction | —— 80% of new students complete the career assessment within 14 days of registration | Career Guidance | V1 |
| PG-7 | Recommendations are explainable | 100% of AI recommendations display the signals that produced them | AI Assistant | V1 |
| PG-8 | Next-best-action always available | Every dashboard renders a contextual recommended action | Student Dashboard, AI | V1 |
| PG-9 | Adaptive learning paths | Mock test performance automatically adjusts recommended study plan | Coaching, AI | V2 |
| PG-10 | Skill-gap to job-demand mapping | Student sees the specific skills missing for their target role, sourced from live job postings | AI, Jobs | V2 |

## 6.4 Goal Group 3 — Learning Effectiveness

| ID | Goal | Definition of Success | Modules | Version |
|---|---|---|---|---|
| PG-11 | Structured exam preparation | 15 exam tracks with syllabus map, schedule, content and mock tests | Coaching | V1 |
| PG-12 | Reliable live classes | —— 99% of scheduled live classes start within 3 minutes of scheduled time | Coaching | V1 |
| PG-13 | Instant performance feedback | Mock test results with rank, percentile and topic analysis within 60 seconds of submission | Coaching | V1 |
| PG-14 | Resolve doubts fast | Median doubt resolution time under 6 hours | Coaching, AI | V2 |
| PG-15 | Course completion discipline | —— 55% course completion rate for paid courses | Courses | V2 |

## 6.5 Goal Group 4 — Opportunity Access

| ID | Goal | Definition of Success | Modules | Version |
|---|---|---|---|---|
| PG-16 | Transparent college discovery | Every listed college displays verified fees, placement statistics and admission criteria | Colleges | V1 |
| PG-17 | Frictionless applications | Student applies to an internship or job in —— 3 clicks with a saved profile | Internships, Jobs | V1 |
| PG-18 | Real, verified opportunities | 100% of live internship and job postings from verified employers | Internships, Jobs | V1 |
| PG-19 | Portfolio-grade project experience | Every completed live project produces a mentor-graded deliverable and certificate | Live Projects | V2 |
| PG-20 | Structured study-abroad pathway | Student tracks country, university, test, visa and finance milestones in one view | Study Abroad | V2 |

## 6.6 Goal Group 5 — Employer Efficiency

| ID | Goal | Definition of Success | Modules | Version |
|---|---|---|---|---|
| PG-21 | Post a job in under 3 minutes | Median time from "Post Job" to published listing < 180 seconds | HR Hiring | V1 |
| PG-22 | Pre-qualified candidate pipeline | —— 70% of shortlisted candidates meet stated minimum criteria automatically | HR Hiring, AI | V2 |
| PG-23 | End-to-end ATS | Full pipeline from application to offer without leaving the platform | HR Hiring | V2 |
| PG-24 | Campus drive automation | A college can run a complete placement drive with —— 5 manual actions | College, HR | V2 |
| PG-25 | Compliant payroll | Payroll run produces statutory-compliant payslips and filings for Indian regulations | Payroll | V2 |

## 6.7 Goal Group 6 — Platform Quality

| ID | Goal | Definition of Success | Modules | Version |
|---|---|---|---|---|
| PG-26 | Fast on low-end devices | Largest Contentful Paint < 2.5s on mid-tier Android over 4G | All | V1 |
| PG-27 | Reliable | 99.9% monthly uptime, error rate < 0.5% | All | V1 |
| PG-28 | Secure | Zero critical vulnerabilities at release; annual penetration test | All | V1 |
| PG-29 | Accessible | WCAG 2.1 AA conformance on all primary flows | All | V2 |
| PG-30 | Observable | Every business-critical transaction traceable end to end | All | V1 |

## 6.8 Goal Group 7 — Trust and Governance

| ID | Goal | Definition of Success | Modules | Version |
|---|---|---|---|---|
| PG-31 | Verified supply | No unverified institution or employer visible publicly | Admin | V1 |
| PG-32 | Financial integrity | Wallet ledger reconciles to payment gateway with zero unexplained variance | Wallet, Payments | V1 |
| PG-33 | Certificate authenticity | Any certificate verifiable by code on a public verification page | Certificates | V1 |
| PG-34 | Data rights | Student can export or delete personal data within 30 days of request | Profile, Admin | V1 |
| PG-35 | Auditability | All privileged administrative actions recorded in an immutable audit log | Admin | V1 |

## 6.9 Goal Prioritisation Matrix

| Goal Group | Business Impact | Implementation Effort | V1 Priority |
|---|---|---|---|
| Unified Identity and Continuity | Very High | Medium | P0 |
| Guidance and Personalisation | Very High | Medium-High | P0 |
| Learning Effectiveness | High | High | P0 |
| Opportunity Access | Very High | Medium | P0 |
| Employer Efficiency | High | High | P1 |
| Platform Quality | Critical | Medium | P0 |
| Trust and Governance | Critical | Medium | P0 |

---

# Chapter 7 — Problem Statement

> **Purpose of this chapter:** To document, with structure and evidence, the specific problems Ellowring exists to solve — for each stakeholder — and to establish the causal chain from problem to product requirement.

## 7.1 The Macro Problem

India educates one of the largest youth populations in the world, yet the transition from education to employment remains structurally broken. The failure is not concentrated at a single point; it is distributed across eight years of a student's life, at every decision node, and it compounds. A wrong stream choice at 16 constrains the entrance exams available at 17, which constrains the college at 18, which constrains the campus recruiters at 21, which constrains the first salary at 22, which constrains the entire career trajectory thereafter.

**The macro problem statement:**

> Indian students make the most consequential decisions of their lives — stream, exam, college, skill, first job — with fragmented information, unverified advice, disconnected tools, and no continuous record of their own progress. The result is systemic under-achievement relative to potential: capable students in the wrong courses, graduates without demonstrable skills, employers unable to find verified talent, and institutions unable to prove or improve their outcomes.

## 7.2 Problem Decomposition by Stakeholder

### 7.2.1 Student Problems

| # | Problem | Manifestation | Consequence | Ellowring Response |
|---|---|---|---|---|
| S-1 | **Career direction ambiguity** | Stream chosen based on family pressure, peer choice or marks alone | Wrong-fit degrees, dropouts, career dissatisfaction | Career Guidance psychometric + aptitude engine (Ch. 21, 22) |
| S-2 | **Coaching access inequality** | Quality entrance coaching concentrated in metros and expensive hubs | Tier 2/3 students systematically disadvantaged | Online Coaching Ecosystem with affordable pricing (Ch. 23) |
| S-3 | **Opaque college selection** | Marketing brochures, paid rankings, unverifiable placement claims | Fee overspend, poor placement outcomes | Verified College Admission Ecosystem (Ch. 24) |
| S-4 | **Study abroad exploitation** | Opaque consultants, hidden commissions, unclear visa processes | Financial loss, rejected applications | Transparent Study Abroad Ecosystem (Ch. 25) |
| S-5 | **Skill-curriculum mismatch** | Degree curriculum lags employer skill demand by years | Unemployable graduates despite good marks | Demand-linked Course Ecosystem (Ch. 26) |
| S-6 | **No practical experience** | Internships scarce, unpaid, unverified or fictitious | Empty resumes at placement time | Internship + Live Project Ecosystems (Ch. 27, 28) |
| S-7 | **Placement unpreparedness** | No structured aptitude, coding, communication or interview training | Rejection despite technical capability | Placement Prep tracks (Ch. 23) |
| S-8 | **Fragmented tooling** | 6-8 platforms, repeated data entry, no consolidated view | Cognitive overload, dropped opportunities | Single unified platform (Ch. 19, 20) |
| S-9 | **No proof of competence** | Marks sheet only; skills unverifiable by employers | Cannot differentiate from peers | Verified Certificates + Portfolio (Ch. 21, 32) |
| S-10 | **No personalised guidance** | Generic advice; no adaptation to individual performance | Wasted effort on already-mastered topics | AI Career Assistant (Ch. 31) |
| S-11 | **Financial barriers** | Lump-sum coaching and course fees | Exclusion of capable low-income students | EMI, wallet, coupons, scholarships (Ch. 32) |
| S-12 | **Information asymmetry on jobs** | Ghost postings, exaggerated salary bands, unclear criteria | Wasted applications, demoralisation | Verified employer listings with transparent criteria (Ch. 29) |

### 7.2.2 College Problems

| # | Problem | Manifestation | Consequence | Ellowring Response |
|---|---|---|---|---|
| C-1 | **Expensive, low-quality admission leads** | Broker networks, unverified enquiries, high duplication | High cost per admission, wasted counsellor time | Intent-scored verified lead pipeline (Ch. 24) |
| C-2 | **Manual placement operations** | Spreadsheets, WhatsApp groups, manual shortlisting | Errors, delays, poor employer experience | Placement drive automation (Ch. 24, 29) |
| C-3 | **Limited recruiter access** | Only local or historically-connected employers visit campus | Poor placement statistics for non-elite colleges | Access to national employer network (Ch. 29) |
| C-4 | **No outcome visibility** | Cannot measure or benchmark student outcomes | Cannot improve or credibly market | College Analytics with peer benchmarking (Ch. 34, 35) |
| C-5 | **Student engagement blind spots** | No visibility into student skill development | Late discovery of unplaceable students | Student progress visibility with consent (Ch. 34) |
| C-6 | **Accreditation data burden** | Manual compilation of placement and outcome data for NAAC/NBA | Enormous administrative load | Automated report generation (Ch. 35) |

### 7.2.3 Employer / HR Problems

| # | Problem | Manifestation | Consequence | Ellowring Response |
|---|---|---|---|---|
| H-1 | **Resume flood, signal scarcity** | Hundreds of unfiltered applications per posting | Recruiter time consumed by screening | AI screening + verified attributes (Ch. 29, 31) |
| H-2 | **Unverifiable claims** | Fake certificates, exaggerated project claims | Bad hires, wasted interview cycles | Platform-verified credentials (Ch. 21) |
| H-3 | **High cost per hire** | Consultancy fees, job board subscriptions, multiple tools | Hiring budget inefficiency | Bundled hiring packages (Ch. 17, 29) |
| H-4 | **Limited Tier 2/3 reach** | Campus visits economically viable only for large colleges | Talent pool artificially narrowed | Virtual drives + national college network (Ch. 29) |
| H-5 | **Fragmented hiring stack** | Job board + ATS + assessment + scheduling + payroll, all separate | Integration overhead, data loss between systems | Unified hiring-to-payroll flow (Ch. 29, 30) |
| H-6 | **Slow onboarding** | Manual document collection, manual payroll setup | Delay between offer and productivity | Offer-to-payroll automation (Ch. 30) |
| H-7 | **Intern management overhead** | No structured system for intern tasks, evaluation, certification | Internships avoided or run poorly | Internship + Live Project management tools (Ch. 27, 28) |

### 7.2.4 Training Institute Problems

| # | Problem | Manifestation | Consequence | Ellowring Response |
|---|---|---|---|---|
| T-1 | **No digital distribution** | Reach limited to physical catchment area | Growth ceiling | Platform distribution to national student base (Ch. 23, 26) |
| T-2 | **No affordable technology** | Building an LMS is capital-intensive | Stuck with WhatsApp and Google Drive | Full batch, content, assessment tooling included (Ch. 23) |
| T-3 | **Payment collection friction** | Cash, manual tracking, defaults | Revenue leakage | Integrated payments and revenue-share ledger (Ch. 17, 32) |
| T-4 | **No outcome measurement** | Cannot prove teaching effectiveness | Cannot command premium pricing | Batch analytics and outcome tracking (Ch. 34) |

### 7.2.5 Channel Partner Problems

| # | Problem | Manifestation | Consequence | Ellowring Response |
|---|---|---|---|---|
| P-1 | **Unreliable attribution** | Referrals disputed or untracked by principals | Distrust, disengagement | Immutable referral attribution ledger (Ch. 32) |
| P-2 | **Delayed commissions** | Manual, arbitrary payout cycles | Cash-flow stress | Automated wallet payouts with SLA (Ch. 32) |
| P-3 | **Single-product income** | Commission from one product line only | Limited earning potential | Commission across all 13 revenue lines (Ch. 17) |
| P-4 | **No sales enablement** | No collateral, no pricing clarity, no lead tracking | Low conversion | Partner dashboard with collateral and lead tracking (Ch. 20) |

### 7.2.6 Parent Problems (Influencer Stakeholder)

| # | Problem | Manifestation | Ellowring Response |
|---|---|---|---|
| PR-1 | **No visibility into child's progress** | Reliant on self-reporting | Parent-linked progress view (V2) |
| PR-2 | **Fear of fee fraud** | Cash payments to unverified agents | Transparent digital payments with invoices |
| PR-3 | **Inability to evaluate options** | Cannot compare colleges or coaching objectively | Comparison tools with verified data |

## 7.3 Root Cause Analysis

| Symptom | Immediate Cause | Root Cause |
|---|---|---|
| Unemployable graduates | Skills not aligned to employer demand | No feedback loop from hiring back into learning |
| Wrong course selection | Poor career guidance at Class 11 | Guidance is unmonetised, therefore unserved by the market |
| Ghost internships | No verification of employer intent | Marketplaces monetise listings, not outcomes |
| Duplicate data entry | Every platform starts from zero | No shared identity layer in the ecosystem |
| Tier 2/3 disadvantage | Quality supply concentrated in metros | Physical delivery economics |
| Unverifiable credentials | Paper certificates, no central registry | No trusted issuing authority spanning providers |

The single deepest root cause is the **absence of a continuous, trusted data spine** connecting learning to hiring. Every downstream symptom traces back to it. This is precisely the layer Ellowring builds.

## 7.4 Cost of the Problem (Illustrative Quantification)

| Problem | Illustrative Annual Cost |
|---|---|
| Student paying for coaching that does not match their weak areas | —,—15,000-—,—60,000 wasted per student |
| Wrong college choice | —,—2-8 lakh in fees for a poor-outcome degree |
| Study abroad consultant opacity | —,—50,000-—,—3,00,000 in hidden margins per student |
| Employer bad hire | 3-6 months of salary plus re-hiring cost |
| College manual placement operations | 2-4 full-time-equivalent staff per institution |
| Channel partner disputed commissions | 15-30% of earned commission unrealised |

## 7.5 Why Existing Solutions Fail

| Existing Solution Type | Why It Fails |
|---|---|
| Exam-prep apps | Stop at the exam; no continuity into college, skills or jobs |
| Job boards | Start at graduation; no verified skill signal; resume-spam dynamics |
| Internship platforms | Narrow scope; limited verification; no learning integration |
| Global MOOC platforms | Not aligned to Indian entrance exams, colleges or employer expectations |
| Offline consultants | Not scalable; opaque incentives; no data trail |
| University LMS | Institution-locked; ends at graduation; no employer side |
| HR ATS products | Employer-only; no candidate development; no education data |
| Payroll products | Post-hire only; disconnected from talent acquisition |

Each solves one node. None solves the **path**.

## 7.6 Problem-to-Requirement Traceability

| Problem ID | Requirement Cluster | Chapter |
|---|---|---|
| S-1, S-10 | Career Guidance and AI recommendation | 21, 22, 31 |
| S-2, S-7 | Coaching Ecosystem with 15 exam tracks | 23 |
| S-3, C-1, C-4 | College Admission Ecosystem and analytics | 24, 34 |
| S-4 | Study Abroad Ecosystem | 25 |
| S-5, T-1, T-2 | Course Ecosystem and training tools | 26 |
| S-6, H-7 | Internship and Live Project Ecosystems | 27, 28 |
| S-9, H-2 | Certificates and verification | 21, 36 |
| S-12, H-1, H-3, C-3 | Hiring Ecosystem and ATS | 29 |
| H-5, H-6 | Payroll Ecosystem | 30 |
| S-11, P-1, P-2 | Wallet, coupons, commission engine | 32 |
| S-8 | Unified IA and dashboards | 19, 20 |
| C-6, T-4 | Reports and analytics | 34, 35 |

---

# Chapter 8 — Proposed Solution

> **Purpose of this chapter:** To describe the solution architecture at a conceptual and system level — what Ellowring builds, how the pieces fit, and how each solution component maps to the problems in Chapter 7.

## 8.1 Solution Thesis

Ellowring solves the continuity problem by building a **single platform with a shared spine and vertically complete ecosystems on top of it**. The spine consists of identity, profile, wallet, notifications, analytics and AI. The ecosystems consist of Career Guidance, Coaching, Admissions, Study Abroad, Courses, Internships, Live Projects, Hiring and Payroll. Because all ecosystems sit on the same spine, the student's data compounds automatically, and each ecosystem improves the intelligence of every other.

## 8.2 Solution Architecture — Conceptual Layers

| Layer | Contents | Purpose |
|---|---|---|
| **L1 — Experience Layer** | Public marketing site, six role dashboards, responsive web UI, design system | Deliver role-appropriate interfaces |
| **L2 — Ecosystem Layer** | Nine vertical ecosystems (Career, Coaching, Admissions, Abroad, Courses, Internships, Projects, Hiring, Payroll) | Deliver domain functionality end to end |
| **L3 — Intelligence Layer** | AI Career Assistant, recommendation engine, matching engine, scoring, insights | Personalise and automate decisions |
| **L4 — Platform Spine** | Identity & RBAC, unified profile, wallet & payments, coupons, certificates, notifications, search, file storage | Shared services consumed by all ecosystems |
| **L5 — Data Layer** | PostgreSQL transactional store, event stream, analytics warehouse, object storage | Persist, stream and analyse |
| **L6 — Infrastructure Layer** | Vercel (frontend), Railway/AWS (services), Cloudflare R2 (objects), CDN, observability | Run reliably, securely and cost-efficiently |

## 8.3 Solution Component Map

```
L1 EXPERIENCE
  Public Site | Student | College | HR | Training | Partner | Admin

L2 ECOSYSTEMS
  Career | Coaching | Admissions | Abroad | Courses | Internships
  Live Projects | Hiring (ATS) | Payroll

L3 INTELLIGENCE
  AI Assistant | Recommender | Matcher | Resume AI | Interview AI | Insight Generator

L4 PLATFORM SPINE
  Identity/RBAC | Unified Profile | Wallet | Payments | Coupons
  Certificates | Notifications | Search | Files | Audit

L5 DATA
  PostgreSQL + Prisma | Event Stream | Analytics Warehouse | R2 Objects

L6 INFRASTRUCTURE
  Vercel | Railway/AWS | Cloudflare | CI/CD | Observability | Secrets
```

## 8.4 Solution Elements in Detail

### 8.4.1 Unified Identity and Profile

A single `User` record with role assignments, extended by role-specific profile entities. The `StudentProfile` is the longitudinal record that accumulates across eight years.

| Element | Description |
|---|---|
| Authentication | Email/password with JWT, Google OAuth, mobile OTP |
| Authorisation | RBAC with role, permission and tenant scoping |
| Profile sections | Personal, academic, skills, certificates, projects, internships, experience, preferences, documents |
| Consent management | Granular consent per data-sharing purpose (college, employer, partner) |
| Completeness scoring | Weighted profile completeness percentage driving nudges |

### 8.4.2 Nine Vertical Ecosystems

| Ecosystem | Solves | Core Capability |
|---|---|---|
| Career Guidance | S-1, S-10 | Psychometric assessment —' career recommendation —' roadmap |
| Coaching | S-2, S-7 | 15 exam tracks: syllabus, live classes, recordings, notes, mock tests, doubts, analytics |
| College Admissions | S-3, C-1 | Discovery, comparison, application, admission tracking, scholarship |
| Study Abroad | S-4 | Country/university selection, test prep, SOP/LOR, visa, finance, milestone tracking |
| Courses | S-5, T-1 | Catalogue, curriculum, video, assignments, assessments, certificates |
| Internships | S-6, H-7 | Listing, application, selection, task tracking, evaluation, certificate |
| Live Projects | S-6, S-9 | Real industry problems, teams, mentors, sprints, deliverables, grading, portfolio |
| Hiring | S-12, H-1..H-5, C-3 | Job posting, ATS pipeline, assessments, interviews, offers, campus drives |
| Payroll | H-5, H-6 | Onboarding, attendance, leave, salary structure, payslips, statutory compliance |

### 8.4.3 Intelligence Layer

| AI Capability | Input Signals | Output |
|---|---|---|
| Career recommendation | Psychometric results, marks, interests, market demand | Ranked career paths with rationale |
| Study plan generation | Exam target, syllabus map, mock performance, available hours | Daily/weekly personalised plan |
| Weakness detection | Question-level mock analytics | Topic-level weak-concept list with remediation |
| Course recommendation | Career target, current skills, job market skills | Ranked course list |
| Job/internship matching | Profile, skills, certificates, projects, preferences | Match score with explanation |
| Candidate ranking (employer) | Job requirements, verified candidate attributes | Ranked shortlist with reasoning |
| Resume generation | Profile data | ATS-optimised resume in multiple templates |
| Interview preparation | Target role, company, student profile | Mock questions, answer feedback |
| Conversational assistant | All of the above plus chat context | Natural-language guidance |

### 8.4.4 Platform Spine Services

| Service | Responsibility | Consumers |
|---|---|---|
| Payments | Razorpay/Stripe orchestration, EMI, invoices, refunds | All monetised modules |
| Wallet | Ledgered credits, refunds, commissions, payouts | Students, Partners, Institutions |
| Coupons | Discount codes, referral codes, campaigns, eligibility rules | All checkout flows |
| Certificates | Issuance, unique code, PDF generation, public verification | Coaching, Courses, Internships, Projects |
| Notifications | In-app, email, SMS/WhatsApp, push; templates; preferences | All modules |
| Search | Unified search across colleges, courses, jobs, internships, projects | Public site, dashboards |
| Files | Upload, virus scan, signed URLs, lifecycle | Documents, videos, resumes |
| Audit | Immutable log of privileged actions | Admin, Compliance |

### 8.4.5 Data and Analytics

| Component | Description |
|---|---|
| Transactional store | PostgreSQL with Prisma ORM; normalised domain schema |
| Event stream | Typed product events emitted from frontend and backend |
| Warehouse | Analytical tables for funnels, cohorts, retention, outcomes |
| Role dashboards | Pre-computed metrics scoped by role and tenant |
| Reports | Scheduled and on-demand exports (PDF/CSV/XLSX) |

## 8.5 How the Solution Creates Compounding Value

| Interaction | Value Created |
|---|---|
| Career Guidance —' Coaching | Exam recommendation drives coaching enrolment with higher fit |
| Coaching —' Admissions | Score prediction improves college shortlisting accuracy |
| Admissions —' Courses | College curriculum gap analysis drives course recommendations |
| Courses —' Internships | Verified skills unlock better internship matches |
| Internships —' Live Projects | Internship feedback informs project team allocation |
| Live Projects —' Hiring | Mentor-graded deliverables become employer-trusted signal |
| Hiring —' Payroll | Offer acceptance auto-initiates onboarding |
| Payroll —' Analytics | Real salary outcomes calibrate the entire recommendation stack |
| Analytics —' Career Guidance | Actual outcomes improve the initial career recommendation |

This is a closed loop. Ellowring is the only architecture in the Indian market designed to close it.

## 8.6 Solution Differentiators

| # | Differentiator | Why Competitors Cannot Easily Replicate |
|---|---|---|
| 1 | Eight-year longitudinal student record | Requires simultaneous presence in school, college and employment stages |
| 2 | Employer payroll inside the same platform | Requires HRTech capability alongside EdTech |
| 3 | Six-role marketplace | Requires three distinct go-to-market motions (B2C, B2B institutional, B2B enterprise) |
| 4 | Verified-only supply | Requires operational verification capability, not just software |
| 5 | Outcome-calibrated AI | Requires closed-loop outcome data unavailable to single-node players |
| 6 | Channel partner distribution | Requires field network economics designed into the product |

## 8.7 Solution Constraints and Boundaries

| Constraint | Statement |
|---|---|
| Web-first | V1 is a responsive web application; native mobile apps arrive in V2 |
| India-first | Statutory logic (payroll, taxation, exam syllabi) is India-specific in V1/V2 |
| English-first | English in V1; Hindi and Tamil in V2; further languages in V3 |
| Verified supply only | No open self-serve publishing without verification, at any version |
| No proctoring hardware | Online proctoring is software-based only |
| Third-party live video | Live classes use an integrated third-party video provider, not in-house WebRTC infrastructure in V1 |

## 8.8 Solution Success Criteria

| Criterion | Measure |
|---|---|
| The spine works | A student's data captured in one module is demonstrably reused in three others |
| The loop closes | At least one cohort traceable from Career Guidance to Payroll |
| The AI is useful | —— 45% acceptance rate on AI-recommended next actions |
| The verification holds | Zero unverified listings in production audits |
| The economics work | Contribution-positive in —— 6 of 10 monetised modules in Year 1 |

---

# Chapter 9 — Market Opportunity

> **Purpose of this chapter:** To size the addressable market, establish the structural tailwinds, segment the opportunity by revenue line and geography, and demonstrate that the target business objectives are achievable within a realistic share of the market.

## 9.1 Market Definition

Ellowring operates at the convergence of three markets that have historically been served separately:

| Market | Description | Traditional Players |
|---|---|---|
| **EdTech** | Test preparation, skilling, higher-education services | Exam-prep apps, MOOC platforms, coaching chains |
| **CareerTech** | Career guidance, admissions counselling, study abroad | Counsellors, consultants, admission portals |
| **HRTech** | Recruitment, applicant tracking, payroll, HRMS | Job boards, staffing firms, HRMS vendors |

Ellowring's market is the **intersection**: the education-to-employment transition. This intersection is currently unowned by any single player in India.

## 9.2 Macro Market Drivers

| Driver | Description | Impact on Ellowring |
|---|---|---|
| **Demographic scale** | India has one of the world's largest 15-24 age cohorts | Very large top-of-funnel |
| **Higher education expansion** | Continued growth in gross enrolment ratio | Growing college and student base |
| **Competitive exam intensity** | Millions of annual aspirants across NEET, JEE, CUET, UPSC, SSC, Banking, Railway, State PSC | Deep coaching demand |
| **Employability gap** | Persistent gap between graduate output and industry-ready talent | Demand for skilling and verification |
| **Digital payment penetration** | UPI-driven normalisation of small digital transactions | Enables low-ticket monetisation in Tier 2/3 |
| **Smartphone and data affordability** | Low-cost data and widespread Android penetration | Reaches district-level students |
| **Post-pandemic online acceptance** | Online live classes are now culturally accepted | Reduces adoption friction |
| **NEP 2020** | Emphasis on skills, multidisciplinary learning, credit portability | Policy tailwind for skill certification |
| **Formalisation of employment** | Growing share of formal-sector jobs requiring payroll compliance | Expands payroll SaaS market |
| **AI cost reduction** | Personalised guidance now economically viable at scale | Enables the intelligence layer |

## 9.3 Market Sizing Framework

Market sizing is presented as TAM (total addressable), SAM (serviceable addressable), and SOM (serviceable obtainable) for each revenue line. Figures are directional planning estimates for internal prioritisation, expressed in Indian rupees, and should be validated with primary research before external publication.

### 9.3.1 Aggregate Sizing

| Metric | Estimate | Basis |
|---|---|---|
| **TAM** | —,—1,80,000 Cr+ annually | Total Indian spend across test prep, higher-ed services, skilling, study abroad, recruitment and SMB payroll |
| **SAM** | —,—42,000 Cr annually | Digitally-addressable portion in target segments and geographies |
| **SOM (Year 3)** | —,—320 Cr | Ellowring's realistic obtainable revenue at Year 3 |
| **SOM as % of SAM** | ~0.76% | Demonstrates targets require only a fractional market share |

### 9.3.2 Sizing by Revenue Line

| Revenue Line | TAM (—,— Cr) | SAM (—,— Cr) | Y3 SOM (—,— Cr) | Share of SAM |
|---|---|---|---|---|
| Competitive exam coaching | 58,000 | 14,000 | 82 | 0.59% |
| Skill courses & certification | 22,000 | 7,500 | 48 | 0.64% |
| College admission services | 16,000 | 4,200 | 38 | 0.90% |
| Study abroad services | 24,000 | 6,000 | 34 | 0.57% |
| Recruitment & hiring | 32,000 | 6,500 | 52 | 0.80% |
| Payroll / HRMS SaaS | 12,000 | 2,400 | 26 | 1.08% |
| Internships & live projects | 6,000 | 900 | 18 | 2.00% |
| Student premium subscription | 5,000 | 400 | 14 | 3.50% |
| Institutional SaaS licences | 5,000 | 600 | 8 | 1.33% |
| **Total** | **1,80,000** | **42,500** | **320** | **0.75%** |

**Strategic conclusion:** No revenue objective in this PRD requires Ellowring to capture more than approximately 3.5% of any serviceable segment. The plan is therefore not dependent on category dominance in any single vertical — it depends on modest share across many verticals, which is exactly what an integrated platform is structurally positioned to achieve.

## 9.4 Geographic Opportunity Segmentation

| Tier | Characteristics | Ellowring Strategy | Expected Revenue Mix Y3 |
|---|---|---|---|
| **Tier 1 (Metros)** | High willingness to pay, high competition, strong existing supply | Premium products, employer relationships, brand credibility | 28% |
| **Tier 2 (State capitals, large cities)** | Growing income, aspirational, under-served by quality supply | Core growth engine; coaching + courses + placements | 40% |
| **Tier 3 (District towns)** | Price-sensitive, severe supply scarcity, high channel-partner leverage | Affordable tiers, channel partners, regional languages | 26% |
| **Rural / semi-urban** | Very price-sensitive, connectivity constrained | Free tier, lightweight experience, scholarship programmes | 6% |

### 9.4.1 State Prioritisation

| Phase | States | Rationale |
|---|---|---|
| **Phase 1 (Y1)** | Tamil Nadu, Karnataka, Andhra Pradesh, Telangana | Strong exam culture (TNPSC, TET, TRB), dense engineering college base, high employer concentration |
| **Phase 2 (Y2)** | Maharashtra, Kerala, Uttar Pradesh, Rajasthan, Madhya Pradesh | Large aspirant volumes, strong coaching demand, expanding college base |
| **Phase 3 (Y3)** | Gujarat, West Bengal, Bihar, Odisha, Punjab, Haryana, Delhi NCR | Volume expansion and national coverage |
| **Phase 4 (Y3+)** | North-East, remaining states, international | Coverage completion and global pilots |

## 9.5 Segment Attractiveness Analysis

| Segment | Market Size | Growth Rate | Competitive Intensity | Ellowring Fit | Priority |
|---|---|---|---|---|---|
| Competitive exam coaching | Very Large | High | Very High | High | P0 |
| Skill courses | Large | Very High | High | Very High | P0 |
| College admissions | Large | Medium | Medium | Very High | P0 |
| Internships | Small | Very High | Medium | Very High | P0 |
| Jobs & placements | Very Large | Medium | Very High | High | P0 |
| Live projects | Small | Very High | Low | Very High | P1 |
| Study abroad | Large | High | Medium | High | P1 |
| Payroll SaaS | Medium | High | High | Medium | P1 |
| Institutional SaaS | Medium | Medium | Medium | High | P1 |
| Advertising | Medium | High | High | Low (initially) | P3 |

## 9.6 Timing Analysis — Why This Window

| Factor | Five Years Ago | Today | Implication |
|---|---|---|---|
| Online class acceptance | Low outside metros | Mainstream nationwide | Coaching can be delivered digitally at scale |
| Digital payments in Tier 3 | Limited | Ubiquitous via UPI | Monetisation feasible at low ticket sizes |
| AI personalisation cost | Prohibitive | Commercially viable | Intelligence layer becomes a realistic differentiator |
| Employer skills-first hiring | Emerging | Established practice | Verified project portfolios have real hiring currency |
| Platform fatigue | Low | High | Integration is now a felt need, not a theoretical benefit |
| Regulatory clarity (data) | Ambiguous | DPDP Act framework in force | Compliance-by-design is possible from day one |

## 9.7 Market Entry Strategy

| Stage | Motion | Target | Success Criterion |
|---|---|---|---|
| **Beachhead** | Tamil Nadu + Karnataka engineering colleges and Class 11/12 exam aspirants | 50 colleges, 40,000 students | Proven module engagement and paid conversion |
| **Expand supply** | Onboard employers who hire from those colleges | 200 companies | Placement outcomes demonstrable |
| **Densify** | Channel partners in Tier 2/3 within beachhead states | 500 partners | CAC below —,—400 |
| **Replicate** | Apply the playbook to Phase 2 states | 4 new states | Same unit economics reproduced |
| **Verticalise** | Add Payroll and Study Abroad to deepen wallet share | 300 payroll clients | Recurring revenue share > 30% |
| **Nationalise** | Full India coverage plus international pilot | All Phase 3 states | —,—320 Cr run rate |

## 9.8 Market Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Category incumbents add adjacent modules | High | Medium | Depth of integration and verified supply is hard to copy quickly |
| Price war in exam prep | Medium | High | Differentiate on outcomes and bundled value, not price |
| Regulatory change in coaching sector | Medium | Medium | Compliance monitoring; diversified revenue reduces exposure |
| Slower Tier 3 monetisation than modelled | Medium | Medium | Free tier plus channel partner economics; adjust pricing tiers |
| Employer hiring downturn | Medium | High | Non-hiring revenue lines (coaching, courses, admissions) provide ballast |

---

# Chapter 10 — Target Audience

> **Purpose of this chapter:** To define precisely who Ellowring serves, segment each audience by observable characteristics, and specify the needs, behaviours and acquisition channels for each segment so that product and marketing decisions are grounded in specific users.

## 10.1 Audience Hierarchy

| Level | Audience | Relationship |
|---|---|---|
| **Primary** | Students (Class 11 through early career) | Core user; centre of the product |
| **Secondary — Supply** | Colleges, Training Institutes | Provide educational supply and institutional reach |
| **Secondary — Demand** | Companies / HR | Provide internships, projects, jobs; pay for hiring and payroll |
| **Tertiary — Distribution** | Channel Partners | Extend market reach, especially Tier 2/3 |
| **Influencers** | Parents, School Teachers, College Faculty | Influence decisions and payments without being primary users |
| **Internal** | Admin, Operations, Support | Govern the platform |

## 10.2 Primary Audience — Student Segmentation

### 10.2.1 By Academic Stage

| Segment | Stage | Age | Primary Need | Primary Modules | Willingness to Pay |
|---|---|---|---|---|---|
| **S1 — Stream Seeker** | Class 11 | 16-17 | Career and stream clarity | Career Guidance, Coaching | Medium (parent-funded) |
| **S2 — Exam Aspirant** | Class 12 / Drop Year | 17-19 | Entrance exam success | Coaching, Mock Tests | High (parent-funded) |
| **S3 — Admission Seeker** | Post Class 12 | 18 | College selection and admission | Admissions, Study Abroad, Scholarships | High (parent-funded) |
| **S4 — Early Undergraduate** | College Year 1-2 | 18-20 | Foundational skills | Courses, Certificates | Low-Medium |
| **S5 — Experience Seeker** | College Year 2-3 | 19-21 | Internships and projects | Internships, Live Projects | Medium |
| **S6 — Placement Candidate** | College Year 3-4 | 20-22 | Job readiness and placement | Placement Prep, Jobs, Coding Prep | High (self/parent-funded) |
| **S7 — Fresh Graduate** | Post-graduation | 21-24 | First job | Jobs, Courses, Interview Prep | High (self-funded) |
| **S8 — Government Exam Aspirant** | Any post-12 | 18-30 | Government job | UPSC/TNPSC/SSC/Banking/Railway/Defence/Police tracks | High |
| **S9 — Teaching Aspirant** | Post-graduation | 21-30 | TET/TRB qualification | TET/TRB tracks | Medium-High |
| **S10 — Study Abroad Aspirant** | Class 12 or graduate | 18-26 | Overseas admission | Study Abroad | Very High |

### 10.2.2 By Geography

| Segment | Description | Behavioural Notes | Product Implication |
|---|---|---|---|
| **Metro** | Tier 1 city students | High device quality, English-comfortable, brand-aware, high competition for attention | Premium features, brand credibility, advanced tracks |
| **Tier 2** | State capitals and large cities | Aspirational, price-conscious, strong exam culture | Core pricing tier, strong exam catalogue |
| **Tier 3** | District towns | Severe local supply scarcity, price-sensitive, trust-driven by local referrals | Channel partner acquisition, low-bandwidth UX, EMI |
| **Rural / semi-urban** | Village and small-town students | Very price-sensitive, shared devices, intermittent connectivity | Free tier, downloadable content (V2), regional language |

### 10.2.3 By Financial Profile

| Segment | Household Context | Payment Behaviour | Product Response |
|---|---|---|---|
| **Premium** | High household income | Pays full fee upfront; expects premium service | Premium membership, priority mentorship |
| **Mainstream** | Middle income | Compares prices; responds to coupons | Standard pricing, coupon campaigns |
| **Value** | Lower-middle income | Requires EMI; highly discount-sensitive | EMI, wallet, referral credits |
| **Scholarship** | Low income | Cannot pay; requires subsidy | Free tier, scholarship programmes, sponsored seats |

### 10.2.4 By Stream / Discipline

| Stream | Typical Exam Track | Typical Course Track | Typical Hiring Track |
|---|---|---|---|
| Science — PCB | NEET | Healthcare, Life Sciences | Healthcare, Pharma, Research |
| Science — PCM | JEE, CUET | Engineering, Computing, Data | IT, Core Engineering, Product |
| Commerce | CUET, Banking, CA foundation | Finance, Accounting, Analytics | BFSI, Finance, Consulting |
| Arts / Humanities | UPSC, TNPSC, SSC, TET | Communication, Design, Media, HR | Government, Media, Education, HR |
| Vocational / Diploma | Railway, SSC, Police | Technical trades, IT support | Manufacturing, Operations, Field roles |

## 10.3 Secondary Audience — Colleges

| Segment | Characteristics | Primary Need | Willingness to Pay |
|---|---|---|---|
| **Tier 1 Institutions** | Established brand, strong placements | Recruiter diversity, analytics, accreditation reporting | Medium (low admission need) |
| **Tier 2 Private Colleges** | Good infrastructure, moderate placements | Admission leads AND placement improvement | High |
| **Tier 3 / Emerging Colleges** | Admission-constrained, weak placement network | Admission leads primarily | Very High |
| **Autonomous / Deemed Universities** | Multi-campus, complex programmes | Multi-campus management, brand marketing | High |
| **Government Colleges** | Fixed admissions via counselling | Placement support and skill development | Low-Medium (budget-constrained) |

## 10.4 Secondary Audience — Companies / HR

| Segment | Size | Hiring Volume | Primary Need | Preferred Revenue Line |
|---|---|---|---|---|
| **Startups** | 1-50 employees | 5-30/year | Low-cost, fast hiring; interns | Pay-per-hire, internship postings |
| **SMEs** | 50-500 employees | 30-150/year | Reliable pipeline + payroll | Hiring packages + Payroll SaaS |
| **Mid-Market** | 500-5,000 employees | 150-800/year | Campus drives, ATS, analytics | Annual hiring package |
| **Large Enterprises** | 5,000+ employees | 800+/year | Bulk campus hiring, compliance, integrations | Enterprise contract + API |
| **Staffing / Consultancies** | Varies | High | Candidate sourcing at scale | Credit-based sourcing |
| **IT Services** | Varies | Very High | Volume freshers with verified coding skill | Campus drives + assessments |

## 10.5 Secondary Audience — Training Institutes

| Segment | Description | Need |
|---|---|---|
| **Local coaching centres** | Single-city exam coaching | Digital distribution and tooling |
| **Skill training providers** | IT/soft-skill training organisations | Course marketplace access and payments |
| **Independent educators** | Individual subject experts | Simple content and batch tooling with revenue share |
| **Corporate training firms** | B2B trainers | Access to institutional clients |

## 10.6 Tertiary Audience — Channel Partners

| Segment | Profile | Motivation | Typical Products Sold |
|---|---|---|---|
| **Education consultants** | Independent admission advisors | Commission across multiple lines | Admissions, Study Abroad, Coaching |
| **Local coaching owners** | Existing student relationships | Additional revenue without added delivery cost | Coaching, Courses |
| **College faculty (approved)** | Trusted advisors to students | Supplemental income | Courses, Placement Prep |
| **Student ambassadors** | Campus influencers | Earnings and experience | Courses, Premium, Referrals |
| **Regional franchise partners** | Local business operators | Territory-based business | All lines within territory |

## 10.7 Influencer Audience — Parents

| Attribute | Description |
|---|---|
| **Role** | Decision approver and payer for segments S1-S3, S6 |
| **Concerns** | Fee legitimacy, outcome credibility, safety, child's engagement |
| **Product needs** | Transparent invoices, verified institution badges, progress visibility (V2) |
| **Communication channel** | SMS/WhatsApp notifications, printed receipts, parent portal (V2) |

## 10.8 Audience Acquisition Channels

| Audience | Primary Channels | Secondary Channels |
|---|---|---|
| Students (S1-S3) | School partnerships, channel partners, parent-targeted campaigns | Social media, YouTube, search |
| Students (S4-S7) | College partnerships, campus ambassadors, placement cells | Search, content marketing, referrals |
| Students (S8-S10) | Exam-specific content SEO, coaching partner referrals | Community forums, social media |
| Colleges | Direct field sales, education conferences, channel partners | Inbound from placement outcomes |
| Companies | Enterprise sales, HR community events, inbound from candidate quality | Referral from existing clients |
| Training Institutes | Direct outreach, partner network | Inbound marketplace interest |
| Channel Partners | Recruitment campaigns, existing consultant networks | Referral from active partners |

## 10.9 Audience Exclusions (Explicit Non-Targets for V1/V2)

| Excluded Audience | Reason |
|---|---|
| K-10 school students | Career determination has not yet begun; different pedagogy and compliance regime |
| Mid-career professionals (8+ years) | Different value proposition; would dilute focus |
| PhD / research candidates | Niche, low volume, specialised needs |
| International students without India linkage | Deferred to V3 global expansion |
| Blue-collar-only staffing | Different platform mechanics; considered in V3 |

---

# Chapter 11 — User Personas

> **Purpose of this chapter:** To give design, engineering and QA a concrete human reference for every role, so that features are built for specific people with specific constraints rather than abstract "users".

Each persona includes demographics, context, goals, frustrations, behaviours, technology constraints, Ellowring journey, success definition, and the specific features that serve them.

---

## 11.1 Persona 1 — Arjun, the Class 11 Stream Seeker

| Attribute | Detail |
|---|---|
| **Age** | 16 |
| **Location** | Coimbatore, Tamil Nadu (Tier 2) |
| **Education** | Class 11, Science stream (PCM), state board |
| **Household** | Father: bank clerk; Mother: school teacher; combined income ~—,—9 lakh/year |
| **Device** | Shared family laptop; personal mid-range Android phone |
| **Connectivity** | Home broadband + 4G mobile |
| **Language** | Tamil primary; functional English |

**Context.** Arjun chose PCM because his marks were good and his uncle is an engineer. He has no idea what engineering branches exist, whether he should aim for JEE or state counselling, or whether his actual interests point elsewhere. His school has one career counsellor for 800 students.

**Goals**
- Understand which careers actually fit his aptitude and interests
- Know which entrance exam to target and when to start preparing
- Get a realistic view of what different careers pay and require
- Reassure his parents that he has a plan

**Frustrations**
- Everyone gives contradictory advice
- Coaching institutes push their own courses regardless of fit
- No way to evaluate whether advice is objective
- Feels behind peers who "already know what they want"

**Behaviours**
- Researches on YouTube in Tamil
- Asks seniors and cousins for advice
- Parents make final decisions on spending

**Ellowring Journey**
1. Discovers Ellowring through a school partnership seminar
2. Registers free; completes the career assessment (35 minutes)
3. Receives a ranked career report with rationale and salary data
4. Explores the JEE and CUET coaching tracks recommended for his profile
5. Parents review transparent pricing; enrol in a foundation coaching batch on EMI
6. Continues on the platform through Class 12 and into college

**Success Definition.** Arjun can articulate a specific career target and the exam path to reach it, and his parents believe the plan is credible.

**Key Features Serving Arjun**
Career Guidance assessment · Career report with rationale · Exam recommendation · Coaching foundation batches · EMI payment · Parent-visible invoices · Tamil language (V2) · AI Career Assistant

---

## 11.2 Persona 2 — Priya, the NEET Aspirant

| Attribute | Detail |
|---|---|
| **Age** | 18 |
| **Location** | Salem, Tamil Nadu (Tier 3) |
| **Education** | Class 12 completed; taking a drop year for NEET |
| **Household** | Father: small business owner; income ~—,—6 lakh/year |
| **Device** | Personal Android phone (—,—12,000 range) |
| **Connectivity** | 4G mobile only; occasional instability |
| **Language** | Tamil primary; reads English |

**Context.** Priya scored below the cut-off in her first NEET attempt. Relocating to a Kota-style coaching hub costs —,—3-4 lakh including living expenses, which her family cannot afford. Local coaching quality is poor.

**Goals**
- Improve her NEET score by 120+ marks
- Identify and fix her weak topics systematically
- Access quality faculty without relocating
- Track her rank trajectory realistically

**Frustrations**
- Cannot afford metro coaching
- Local coaching uses outdated materials
- No way to benchmark herself against the national aspirant pool
- Doubts pile up with no one to resolve them

**Behaviours**
- Studies 8-10 hours daily
- Uses her phone as the primary study device
- Highly motivated but anxious about performance
- Watches recorded lectures at 1.5—- speed

**Ellowring Journey**
1. Finds Ellowring through a local channel partner in Salem
2. Enrols in the NEET Repeaters batch at a fraction of hub coaching cost
3. Attends daily live classes; downloads notes; watches recordings when connectivity fails
4. Takes weekly full-length mocks; receives rank, percentile and topic-wise analysis
5. AI generates a corrective study plan focused on her weak topics
6. Posts doubts; receives faculty and AI responses
7. Uses College Admissions module post-result for medical counselling guidance

**Success Definition.** Priya's mock percentile improves consistently and she secures a medical seat.

**Key Features Serving Priya**
NEET coaching track · Live + recorded classes · Downloadable notes · Mock test engine with rank/percentile · Topic-wise weakness analysis · AI study plan · Doubt solving · Low-bandwidth mode · EMI · Channel partner support · College counselling guidance

---

## 11.3 Persona 3 — Karthik, the Placement Candidate

| Attribute | Detail |
|---|---|
| **Age** | 21 |
| **Location** | Chennai, Tamil Nadu |
| **Education** | B.E. Computer Science, Year 3, Tier 2 private engineering college |
| **CGPA** | 7.8 |
| **Device** | Laptop + Android phone |
| **Connectivity** | Hostel Wi-Fi + 4G |
| **Language** | English comfortable |

**Context.** Karthik's college placement cell brings 15 recruiters annually, mostly IT services with modest packages. He wants a product-company role but has no projects, no internship, and no idea how to prepare for technical interviews.

**Goals**
- Build a resume with real, demonstrable work
- Clear aptitude and coding rounds
- Get an internship that converts to a job
- Access recruiters beyond his campus

**Frustrations**
- College curriculum is theoretical and outdated
- Internships in Chennai are unpaid or fictitious
- No structured interview preparation
- Cannot differentiate himself from thousands of similar CS graduates

**Behaviours**
- Active on coding practice platforms
- Compares packages and companies with peers
- Willing to pay for demonstrable outcomes
- Applies broadly and gets rejected without feedback

**Ellowring Journey**
1. Registers via a campus ambassador
2. Completes skill-gap analysis against a "Software Engineer" target role
3. Enrols in a Full Stack Development course; earns a verified certificate
4. Joins a live project team building a real client application under mentor supervision
5. Applies to internships with a strengthened profile; secures a paid internship
6. Uses Placement Prep: aptitude, coding, communication and interview modules
7. Uses the AI Resume Builder and AI Mock Interview
8. Applies to off-campus jobs; receives interview calls; accepts an offer
9. Employer onboards him through Ellowring Payroll

**Success Definition.** Karthik receives a job offer above his campus median package, with verified project work as the differentiator.

**Key Features Serving Karthik**
Skill-gap analysis · Skill courses + certificates · Live projects with mentor grading · Internship applications · Placement Prep tracks · Coding Prep · AI Resume Builder · AI Mock Interview · Job applications · Offer management · Payroll onboarding

---

## 11.4 Persona 4 — Divya, the Government Exam Aspirant

| Attribute | Detail |
|---|---|
| **Age** | 24 |
| **Location** | Madurai, Tamil Nadu |
| **Education** | B.A. Economics graduate |
| **Occupation** | Preparing full-time for TNPSC Group 2 and SSC CGL |
| **Household** | Middle income; family supportive but pressuring for employment |
| **Device** | Android phone; occasional access to a library computer |
| **Language** | Tamil primary |

**Context.** Divya has attempted TNPSC twice without success. She studies from books and free YouTube content but has no structured plan, no current-affairs discipline, and no benchmark against other aspirants.

**Goals**
- Clear TNPSC Group 2 in the next attempt
- Maintain daily current-affairs discipline
- Practise with realistic mock tests
- Manage exam-cycle deadlines without missing notifications

**Frustrations**
- Vast, unstructured syllabus
- Current affairs scattered across sources
- No feedback on why she is falling short
- Missed application deadlines in the past

**Ellowring Journey**
1. Discovers Ellowring via TNPSC-focused content marketing
2. Enrols in the TNPSC track; also adds the SSC track
3. Follows the structured daily study plan and daily current-affairs digest
4. Takes sectional and full-length mocks with all-India and state-level ranking
5. Receives notifications for notification releases, application windows and exam dates
6. Uses AI to identify recurring weak areas across attempts

**Success Definition.** Divya sustains a study routine, improves mock ranks, and never misses an exam deadline.

**Key Features Serving Divya**
TNPSC + SSC tracks · Structured study plan · Daily current affairs · Sectional and full mocks · State and all-India ranking · Exam calendar and deadline notifications · Tamil content (V2) · Multi-track enrolment

---

## 11.5 Persona 5 — Dr. Ramesh, the College Placement Officer

| Attribute | Detail |
|---|---|
| **Age** | 46 |
| **Role** | Training & Placement Officer |
| **Institution** | Private engineering college, 2,400 students, Tier 2 city |
| **Team** | 2 assistants |
| **Reporting to** | Principal and Management Trustee |
| **Device** | Desktop; Android phone |

**Context.** Dr. Ramesh must place 600 final-year students annually. He manages the entire operation on spreadsheets and WhatsApp groups. Management pressures him on placement percentage; students complain about communication; recruiters complain about disorganisation.

**Goals**
- Increase placement percentage from 62% to 80%
- Attract more and better recruiters
- Reduce manual coordination effort
- Produce credible placement reports for management and NAAC

**Frustrations**
- Manual student data collection every year
- Recruiters find the process unprofessional
- No visibility into which students are actually job-ready
- Reporting takes weeks of manual compilation

**Ellowring Journey**
1. Onboards the college; verifies institutional credentials
2. Bulk-imports student records; students claim their profiles
3. Publishes campus placement drives; invites companies from the Ellowring network
4. Uses automated eligibility filtering and bulk shortlisting
5. Schedules interviews with automated student notification
6. Tracks offers and acceptance in real time
7. Exports placement analytics and accreditation-ready reports
8. Monitors student skill development to intervene early with weak students

**Success Definition.** Placement percentage rises, recruiter count increases, and reporting takes hours instead of weeks.

**Key Features Serving Dr. Ramesh**
College dashboard · Bulk student import · Placement drive management · Eligibility auto-filtering · Bulk shortlisting and communication · Interview scheduling · Offer tracking · Placement analytics · Accreditation reports · Student readiness visibility · Recruiter network access

---

## 11.6 Persona 6 — Anitha, the Startup HR Manager

| Attribute | Detail |
|---|---|
| **Age** | 32 |
| **Role** | HR Manager (generalist; also handles payroll and operations) |
| **Company** | 65-person product startup, Bengaluru |
| **Hiring volume** | 25-40 hires per year, mostly junior engineering and operations |
| **Budget** | Constrained; cannot afford recruitment consultancies |

**Context.** Anitha is a one-person HR function. She posts on job boards, receives hundreds of irrelevant applications, screens manually, coordinates interviews over email, and runs payroll on spreadsheets with a part-time accountant.

**Goals**
- Reduce time-to-hire from 45 days to under 25
- Get pre-screened, genuinely qualified candidates
- Consolidate hiring and payroll into one system
- Reduce cost-per-hire

**Frustrations**
- 80% of applications are irrelevant
- Candidate claims cannot be verified
- Interview coordination consumes hours weekly
- Payroll errors and statutory compliance anxiety

**Ellowring Journey**
1. Registers the company; completes verification
2. Purchases a hiring package
3. Posts a job with structured requirements
4. Receives AI-ranked candidates with verified skills, certificates and projects
5. Sends platform assessments; reviews scores
6. Schedules interviews with calendar integration
7. Issues a digital offer; candidate accepts on platform
8. Offer acceptance auto-creates the payroll onboarding workflow
9. Runs monthly payroll with automatic statutory calculations and payslips

**Success Definition.** Anitha hires faster, with better fit, and closes her month-end payroll without errors.

**Key Features Serving Anitha**
HR dashboard · Job posting · AI candidate ranking · Verified candidate attributes · Assessments · Interview scheduling · Digital offers · Hiring-to-payroll automation · Payroll runs · Statutory compliance · Payslips · Hiring analytics

---

## 11.7 Persona 7 — Suresh, the Training Institute Owner

| Attribute | Detail |
|---|---|
| **Age** | 41 |
| **Role** | Founder, local IT training institute |
| **Institution** | 6 trainers, ~450 students annually, Tier 2 city |
| **Revenue** | ~—,—1.2 crore annually |

**Context.** Suresh runs a physical training institute constrained by his city's catchment area. He wants to reach students nationally but cannot afford to build a learning platform. He currently uses WhatsApp groups, Google Drive and manual fee registers.

**Goals**
- Reach students beyond his city
- Digitise batches, content and assessments
- Eliminate fee collection leakage
- Prove training outcomes to command premium pricing

**Ellowring Journey**
1. Applies as a training partner; completes verification
2. Uses the Training dashboard to create batches and upload content
3. Publishes courses to the Ellowring catalogue
4. Conducts live classes through the integrated platform
5. Creates assessments; issues verified certificates
6. Tracks enrolments and revenue share in real time
7. Receives scheduled payouts to his wallet and bank account

**Success Definition.** Suresh's addressable student base expands nationally with no software investment, and settlement is transparent.

**Key Features Serving Suresh**
Training dashboard · Batch management · Content upload · Live class hosting · Assessment builder · Certificate issuance · Enrolment analytics · Revenue-share ledger · Automated payouts

---

## 11.8 Persona 8 — Mohan, the Channel Partner

| Attribute | Detail |
|---|---|
| **Age** | 36 |
| **Role** | Independent education consultant |
| **Location** | Tirunelveli district (Tier 3) |
| **Network** | Relationships with 20 schools and 6 colleges |
| **Current income** | —,—35,000-—,—60,000/month from admission commissions |

**Context.** Mohan earns commissions by referring students to colleges and coaching institutes. His principals frequently dispute or delay commissions, and he has no way to prove attribution.

**Goals**
- Earn commission reliably across multiple product lines
- Prove that a conversion came from his referral
- Receive payouts predictably
- Access marketing collateral he does not have to create

**Ellowring Journey**
1. Applies as a channel partner; completes KYC and verification
2. Receives a unique referral code and shareable links
3. Distributes collateral to his school and college network
4. Tracks leads, conversions and earnings in real time on his dashboard
5. Earns commission across coaching, courses, admissions and study abroad
6. Requests payout from wallet; receives settlement within SLA

**Success Definition.** Mohan's monthly income increases and becomes predictable, with zero attribution disputes.

**Key Features Serving Mohan**
Channel Partner dashboard · Unique referral codes and links · Lead tracking · Attribution ledger · Multi-line commission · Real-time earnings · Wallet payouts · Marketing collateral library · Tier-based incentives

---

## 11.9 Persona 9 — Meera, the Study Abroad Aspirant

| Attribute | Detail |
|---|---|
| **Age** | 22 |
| **Education** | B.Tech graduate, 8.4 CGPA |
| **Target** | MS in Data Science, Germany or Canada |
| **Household** | Upper-middle income; education loan planned |

**Context.** Meera has approached three consultants who quote different fees, recommend different universities, and provide no transparency on their commissions. She does not know whether recommendations serve her interests or theirs.

**Goals**
- Select the right country and universities objectively
- Understand total cost including tuition, living and visa
- Track application, test, SOP, LOR and visa milestones
- Avoid consultant exploitation

**Ellowring Journey**
1. Uses the Study Abroad country and university comparison tools
2. Sees transparent fee structures and Ellowring's disclosed service fee
3. Builds a university shortlist (ambitious / target / safe)
4. Follows the milestone tracker: IELTS/GRE, SOP, LORs, applications, visa, finance
5. Works with an assigned counsellor through the platform
6. Receives admits; tracks visa progress; completes pre-departure checklist

**Success Definition.** Meera secures admission to a target university with full cost transparency and no hidden commissions.

**Key Features Serving Meera**
Country comparison · University database · Cost calculator · Eligibility checker · Milestone tracker · Document manager · SOP/LOR assistance · Counsellor workflow · Visa tracking · Scholarship database · Pre-departure checklist

---

## 11.10 Persona 10 — Vikram, the Platform Administrator

| Attribute | Detail |
|---|---|
| **Age** | 29 |
| **Role** | Platform Operations Manager |
| **Team** | 8 operations executives |
| **Responsibility** | Verification, moderation, disputes, payouts, platform health |

**Context.** Vikram is accountable for the trust layer that the entire product depends on. Every unverified college, ghost job posting or fraudulent certificate is his responsibility.

**Goals**
- Verify institutions and employers within SLA
- Detect and block fraud before it reaches students
- Resolve disputes fairly and quickly
- Process partner payouts accurately and on time
- Maintain platform health visibility

**Ellowring Journey**
1. Reviews the verification queue with document checks and audit trails
2. Moderates flagged content and reported listings
3. Investigates disputes with full transaction and audit history
4. Approves payout batches with reconciliation checks
5. Monitors platform-wide health, revenue and fraud dashboards
6. Manages roles, permissions and configuration

**Success Definition.** Zero unverified listings in production, fraud rate below threshold, payouts within SLA, disputes resolved within SLA.

**Key Features Serving Vikram**
Admin dashboard · Verification queues · Moderation tools · Dispute management · Payout approval workflow · Reconciliation reports · Fraud detection signals · Audit logs · RBAC management · Platform configuration · System health monitoring

---

## 11.11 Persona Summary Matrix

| Persona | Role | Stage | Primary Modules | Revenue Contribution | Priority |
|---|---|---|---|---|---|
| Arjun | Student | Class 11 | Career Guidance, Coaching | Medium | P0 |
| Priya | Student | Exam aspirant | Coaching, Mocks | High | P0 |
| Karthik | Student | Placement candidate | Courses, Projects, Internships, Jobs | High | P0 |
| Divya | Student | Govt exam aspirant | Govt exam tracks | High | P0 |
| Dr. Ramesh | College | Institutional | Admissions, Placements, Analytics | Medium | P0 |
| Anitha | HR | Enterprise | Hiring, ATS, Payroll | High | P0/P1 |
| Suresh | Training | Institutional | Batches, Content, Courses | Medium | P1 |
| Mohan | Channel Partner | Distribution | Referrals, Commission | Enabler | P1 |
| Meera | Student | Study abroad | Study Abroad | Very High | P1 |
| Vikram | Admin | Internal | Governance | Enabler | P0 |

---

# Chapter 12 — Customer Journey

> **Purpose of this chapter:** To map the end-to-end experience of every role from first awareness through advocacy, identifying touchpoints, emotions, friction points and product interventions at each stage, so that experience design and lifecycle communication are systematically planned rather than incidental.

## 12.1 Journey Framework

All journeys are mapped across seven canonical stages:

| Stage | Definition | Key Question the User Asks |
|---|---|---|
| **1. Awareness** | User first learns Ellowring exists | "What is this— |
| **2. Consideration** | User evaluates relevance and credibility | "Is this for me? Can I trust it— |
| **3. Registration** | User creates an account | "What do I get for signing up— |
| **4. Activation** | User experiences first meaningful value | "Was this worth my time— |
| **5. Conversion** | User makes a first payment | "Is this worth my money— |
| **6. Retention** | User returns and expands usage | "Is this still helping me— |
| **7. Advocacy** | User recommends Ellowring to others | "Would I tell others about this— |

## 12.2 Student Journey — Detailed Map

### 12.2.1 Stage 1 — Awareness

| Element | Detail |
|---|---|
| **Triggers** | Exam anxiety, stream confusion, placement season, peer success stories |
| **Channels** | School/college seminars, channel partners, search results, YouTube, social media, campus ambassadors, word of mouth |
| **Touchpoints** | Public home page, exam-specific landing pages, career guidance landing page, blog content |
| **Emotion** | Curious but sceptical |
| **Friction** | "Another EdTech app"; unclear differentiation |
| **Product intervention** | Clear tagline, outcome statistics on home page, free career assessment as the hook, verified-partner logos |
| **Success metric** | Landing page —' registration conversion —— 8% |

### 12.2.2 Stage 2 — Consideration

| Element | Detail |
|---|---|
| **Behaviour** | Browses modules, checks pricing, reads reviews, compares with alternatives, asks parents |
| **Touchpoints** | Module pages, pricing page, success stories, college and company partner listings, FAQ |
| **Emotion** | Interested but uncertain about value and cost |
| **Friction** | Price sensitivity; scepticism about outcome claims; parent approval needed |
| **Product intervention** | Transparent pricing, free tier clearly explained, verified outcome statistics, EMI visibility, testimonials with verifiable identities |
| **Success metric** | Consideration —' registration —— 25% |

### 12.2.3 Stage 3 — Registration

| Element | Detail |
|---|---|
| **Flow** | Email/Google/mobile OTP —' verify —' basic profile (name, stage, stream, location, target) —' dashboard |
| **Design rule** | Registration MUST complete in under 90 seconds with —— 6 required fields |
| **Emotion** | Committed but impatient |
| **Friction** | Long forms, OTP delivery failure, unclear value of fields requested |
| **Product intervention** | Progressive profiling (ask more later), social login, OTP fallback, immediate dashboard access |
| **Success metric** | Registration completion —— 85%; OTP delivery success —— 98% |

### 12.2.4 Stage 4 — Activation

| Element | Detail |
|---|---|
| **Definition of activation** | Student completes the career assessment OR enrols in any free content OR applies to any opportunity within 7 days |
| **Touchpoints** | Onboarding checklist, dashboard KPI cards, Explore Modules grid, AI Assistant banner |
| **Emotion** | Hopeful; seeking a quick win |
| **Friction** | Overwhelm from too many modules; unclear where to start |
| **Product intervention** | Guided onboarding checklist, single prominent recommended next action, stage-aware module surfacing, AI assistant proactive greeting |
| **Success metric** | 7-day activation rate —— 55% |

### 12.2.5 Stage 5 — Conversion

| Element | Detail |
|---|---|
| **Trigger** | Career report recommends a specific coaching track; skill-gap analysis recommends a course; deadline pressure |
| **Touchpoints** | Course/batch detail page, checkout, coupon field, EMI option, wallet balance |
| **Emotion** | Anxious about spending; needs parental approval |
| **Friction** | Price, payment failure, parent hesitancy, trust in refund policy |
| **Product intervention** | Transparent all-inclusive pricing, coupons, referral credit, EMI, published refund policy, instant invoice, parent-shareable payment link |
| **Success metric** | Free —' paid conversion —— 9% within 60 days; checkout success —— 94% |

### 12.2.6 Stage 6 — Retention

| Element | Detail |
|---|---|
| **Drivers** | Visible progress, class schedule adherence, mock rank improvement, new opportunity alerts, streaks |
| **Touchpoints** | Continue Learning card, Upcoming Classes, Calendar/Deadlines, Announcements, Overall Progress, notifications |
| **Emotion** | Motivated when progressing; discouraged when plateauing |
| **Friction** | Content fatigue, plateau in scores, competing priorities, exam-cycle seasonality |
| **Product intervention** | Adaptive plans, weakness remediation, streaks and milestones, mentor check-ins, re-engagement notification campaigns, cross-module recommendations |
| **Success metric** | Month-3 retention —— 48%; multi-module adoption —— 22% |

### 12.2.7 Stage 7 — Advocacy

| Element | Detail |
|---|---|
| **Trigger** | Achieved outcome — exam score, admission, internship, placement |
| **Touchpoints** | Success story capture, referral programme, certificate sharing, social share of portfolio |
| **Emotion** | Proud; willing to help peers |
| **Product intervention** | Referral credits into wallet, one-click certificate sharing, alumni ambassador programme, outcome celebration moments |
| **Success metric** | Referral rate —— 18%; NPS —— 55 |

### 12.2.8 Student Journey Emotion Curve

| Stage | Emotional State | Risk of Drop-off | Primary Retention Lever |
|---|---|---|---|
| Awareness | Curious | Very High | Free, immediately valuable career assessment |
| Consideration | Sceptical | High | Verified outcomes and transparent pricing |
| Registration | Impatient | Medium | Sub-90-second registration |
| Activation | Overwhelmed | High | One clear recommended next action |
| Conversion | Anxious | High | EMI, coupons, refund clarity |
| Retention | Variable | Medium | Visible progress and adaptive guidance |
| Advocacy | Proud | Low | Referral rewards and celebration |

## 12.3 College Journey

| Stage | Activity | Touchpoint | Friction | Product Intervention |
|---|---|---|---|---|
| Awareness | Field sales visit, conference, partner referral | "Partner With Us" page, sales deck | "We already have a system" | Outcome case studies, free pilot offer |
| Consideration | Evaluates lead quality and placement value | Demo, pilot access, reference calls | Procurement approval, budget cycle | Pilot with defined success criteria, phased pricing |
| Onboarding | Submits registration documents; verification | Verification workflow | Document burden, verification delay | Clear checklist, —— 3 business day SLA, status visibility |
| Setup | Imports students, configures departments, invites staff | Bulk import, role management | Data quality issues, staff resistance | Import validation, templates, training session, in-app guides |
| Activation | Publishes first placement drive or receives first lead | Drive creation, lead inbox | Uncertainty about process | Guided first-drive wizard, dedicated success manager |
| Value realisation | Sees admissions and placements attributed to Ellowring | Analytics dashboard | Attribution scepticism | Transparent attribution reporting |
| Expansion | Adds departments, campuses, premium analytics | Upgrade flow | Budget approval | ROI report generation for management |
| Renewal | Annual licence renewal | Renewal notification | Value justification | Automated annual value report |

## 12.4 Company / HR Journey

| Stage | Activity | Touchpoint | Friction | Product Intervention |
|---|---|---|---|---|
| Awareness | Enterprise sales, inbound from candidate quality, HR community | Partner page, sales outreach | "We use existing job boards" | Verified-candidate value proposition, free first posting |
| Consideration | Evaluates candidate pool relevance | Talent pool preview, demo | Uncertain pool depth in their domain | Pool size preview by role and location |
| Onboarding | Company registration and verification | Verification workflow | Document requirements | Clear checklist, fast-track for known entities |
| First posting | Posts first job or internship | Job posting wizard | Unfamiliar form; unclear reach | —— 3 minute posting flow, reach estimate, templates |
| Activation | Receives qualified applications | Candidate pipeline | Application quality doubt | AI ranking with verified attribute badges |
| Value realisation | Completes first hire | Offer management | Trust in candidate verification | Verified credential display, assessment scores |
| Expansion | Purchases hiring package; adds payroll | Package upgrade, payroll onboarding | Switching cost from existing payroll | Migration assistance, parallel-run support |
| Retention | Repeat hiring cycles | Hiring analytics | Cost justification | Cost-per-hire comparison reporting |

## 12.5 Training Institute Journey

| Stage | Activity | Friction | Product Intervention |
|---|---|---|---|
| Awareness | Partner outreach | "We can't afford technology" | Zero upfront cost; revenue-share model |
| Onboarding | Verification, faculty setup | Documentation, technical unfamiliarity | Guided onboarding, training webinar |
| Content setup | Upload curriculum, videos, assessments | Content preparation effort | Bulk upload, templates, content team support |
| First batch | Launch first batch on platform | Fear of student migration | Co-branded batches, retained student relationship |
| Value realisation | Enrolments beyond local catchment | Trust in payout accuracy | Real-time revenue ledger |
| Expansion | Adds courses and batches | Capacity | Faculty management tooling |

## 12.6 Channel Partner Journey

| Stage | Activity | Friction | Product Intervention |
|---|---|---|---|
| Awareness | Recruitment campaign, peer referral | Scepticism about commission payment | Published commission schedule and payout SLA |
| Application | Submits KYC and profile | Documentation | Simple digital KYC |
| Onboarding | Training on products and pricing | Product knowledge gap | Partner training modules and certification |
| Activation | First referral link shared; first lead | Uncertain how to sell | Collateral library, scripts, pricing sheets |
| First earning | First conversion and commission credited | Attribution doubt | Transparent attribution ledger with timestamps |
| Scaling | Multi-line selling, tier upgrade | Motivation and focus | Tier incentives, leaderboards, bonus campaigns |
| Retention | Consistent monthly earnings | Payout delays | Automated payouts within SLA |

## 12.7 Admin Journey (Internal Operations)

| Stage | Activity | Product Support |
|---|---|---|
| Daily operations | Verification queue processing | Prioritised queue with SLA timers |
| Monitoring | Platform health, fraud signals, revenue | Real-time operational dashboard |
| Intervention | Dispute resolution, content moderation | Case management with full audit history |
| Financial operations | Payout batch approval, reconciliation | Reconciliation reports with variance flags |
| Governance | Role and permission management, configuration | RBAC console with change audit log |

## 12.8 Cross-Journey Moments of Truth

| Moment | Why It Matters | Required Experience Standard |
|---|---|---|
| First career report delivery | Determines whether the student trusts the platform | Delivered within 60 seconds; specific and explainable |
| First live class attended | Determines coaching retention | Starts on time; audio/video stable; recording available within 2 hours |
| First mock test result | Determines belief in improvement | Results with rank and analysis within 60 seconds |
| First payment | Determines financial trust | Success rate —— 94%; instant invoice; instant access |
| First job/internship application response | Determines belief in opportunity reality | Status update within 7 days, always |
| First commission payout | Determines channel partner loyalty | Within published SLA, with itemised statement |
| First payroll run | Determines employer retention | Zero calculation errors; payslips on schedule |
| Certificate issuance | Determines advocacy | Issued within 24 hours; publicly verifiable |

---

# Chapter 13 — Product Positioning

> **Purpose of this chapter:** To define exactly how Ellowring is positioned in the mind of each audience, the messaging architecture that supports that position, and the boundaries that prevent positioning dilution.

## 13.1 Positioning Statement (Master)

> **For** Indian students from Class 11 through their first job, **who** are forced to navigate career decisions, exam preparation, admissions, skilling, internships and job hunting across a dozen disconnected and often untrustworthy platforms, **Ellowring is** an AI-powered Education, Career and Hiring ecosystem **that** carries one verified student profile continuously from Class 11 to first salary, connecting learning directly to employment outcomes. **Unlike** exam-prep apps that stop at the exam, job boards that start at graduation, or course marketplaces disconnected from hiring, **Ellowring** owns the entire path — and closes the loop by hosting the employer's hiring and payroll on the same platform.

## 13.2 Positioning by Audience

| Audience | Positioning Statement | Primary Message | Proof Point |
|---|---|---|---|
| **Students** | The one platform that stays with you from Class 11 to your first salary | "Learn. Prepare. Build. Get Hired." | Verified outcomes; single profile across 8 years |
| **Parents** | The trusted, transparent alternative to opaque consultants and coaching brokers | "Every rupee accounted for. Every claim verified." | Transparent pricing, invoices, verified partners |
| **Colleges** | Admission leads and placement automation in one institutional system | "More admissions. Better placements. Less paperwork." | Lead quality metrics, drive automation, accreditation reports |
| **Companies** | Pre-verified talent plus hiring-to-payroll in one stack | "Hire verified. Onboard instantly. Pay compliantly." | Verified credentials, ATS + payroll integration |
| **Training Institutes** | National distribution with zero technology investment | "Your teaching. Our platform. National reach." | Revenue share model, full tooling |
| **Channel Partners** | Multi-line commission income with guaranteed attribution | "Every referral tracked. Every rupee paid." | Attribution ledger, payout SLA |
| **Investors** | Vertically integrated education-to-employment infrastructure with compounding data moat | "The only platform that owns the entire path" | 13 revenue lines, longitudinal data graph |

## 13.3 Positioning Map — Category Landscape

Two axes define the competitive space:
- **Horizontal axis:** Lifecycle Coverage (single node — full lifecycle)
- **Vertical axis:** Outcome Verification (self-declared — platform-verified)

| Quadrant | Characteristics | Representative Players |
|---|---|---|
| **Low coverage / Low verification** | Single-purpose, claim-based | Generic job boards, listing sites |
| **Low coverage / High verification** | Single-purpose but trustworthy | Assessment platforms, university LMS |
| **High coverage / Low verification** | Broad but unverified | Multi-product EdTech aggregators |
| **High coverage / High verification** | **Ellowring's target quadrant** | *(currently unoccupied in India)* |

## 13.4 Value Proposition Canvas — Student

| Student Job-to-Be-Done | Pain | Gain Ellowring Delivers |
|---|---|---|
| Decide my career direction | Contradictory, biased advice | Data-driven, explainable career recommendation |
| Prepare for my entrance exam | Expensive, metro-concentrated coaching | Affordable, quality online coaching with analytics |
| Choose the right college | Opaque, unverifiable claims | Verified fees, placements and reviews |
| Study abroad safely | Exploitative consultants | Transparent, milestone-tracked pathway |
| Learn employable skills | Curriculum-industry mismatch | Demand-linked courses with verified certificates |
| Get real experience | Ghost or unpaid internships | Verified internships and mentor-graded live projects |
| Get placed | Limited campus recruiters | National employer network + placement prep |
| Prove my skills | Marks sheet only | Verifiable certificates and portfolio |

## 13.5 Messaging Architecture

### 13.5.1 Message Hierarchy

| Level | Message |
|---|---|
| **Master brand** | Learn. Prepare. Build. Get Hired. |
| **Positioning line** | From 11th Standard to First Job — Everything in One Platform. |
| **Trust line** | India's most trusted Education, Career and Hiring Ecosystem. |
| **Capability lines** | Career clarity · Exam success · Admission confidence · Real skills · Real experience · Real jobs |

### 13.5.2 Message by Funnel Stage

| Funnel Stage | Message Focus | Example Copy |
|---|---|---|
| Awareness | Problem recognition | "Still using five different apps for your career— |
| Consideration | Differentiation | "One profile. Class 11 to your first salary." |
| Conversion | Risk reduction | "Transparent pricing. EMI available. Verified partners only." |
| Onboarding | Quick value | "Discover your career direction in 30 minutes — free." |
| Retention | Progress | "You're 68% through your NEET syllabus. Here's what's next." |
| Advocacy | Achievement | "You got placed. Share your Ellowring story." |

### 13.5.3 Words We Use and Avoid

| Use | Avoid | Reason |
|---|---|---|
| Verified | Guaranteed | Legal and ethical accuracy |
| Outcome | Success guarantee | No unprovable promises |
| Ecosystem | App | Signals integration, not a point tool |
| Pathway | Course | Signals continuity |
| Transparent | Cheap | Positions on trust, not price |
| Recommended | Best | Recommendations are personalised, not absolute |

## 13.6 Brand Attributes

| Attribute | Definition | Expression in Product |
|---|---|---|
| **Trustworthy** | Verified, transparent, honest | Verification badges, itemised pricing, refund clarity |
| **Comprehensive** | Covers the whole path | Module grid visible on every dashboard |
| **Intelligent** | Data-driven and personalised | AI recommendations with rationale |
| **Accessible** | Works for everyone, everywhere | Performance budgets, EMI, free tier, regional languages |
| **Professional** | Enterprise-grade craft | Consistent design system, reliable performance |
| **Supportive** | Guides rather than sells | Next-best-action guidance over aggressive upsell |

## 13.7 Competitive Positioning Statements

| Against | Their Position | Our Counter-Position |
|---|---|---|
| Exam-prep apps | "Crack your exam" | "Crack your exam — and then get hired" |
| Job boards | "Find jobs" | "Become the candidate who gets chosen" |
| Course marketplaces | "Learn anything" | "Learn exactly what employers are hiring for" |
| Internship platforms | "Find internships" | "Build a verified portfolio, then get the internship" |
| Study abroad consultants | "We'll handle it" | "See everything. Pay transparently. Track every milestone" |
| ATS vendors | "Manage applicants" | "Hire verified candidates and run their payroll" |
| University LMS | "Manage your courses" | "Manage learning that leads to employment" |

## 13.8 Positioning Risks and Guardrails

| Risk | Description | Guardrail |
|---|---|---|
| **Jack-of-all-trades perception** | Breadth read as shallowness | Lead with depth proof in each module (faculty credentials, employer names, outcome data) |
| **Trust erosion from one bad actor** | A single fraudulent employer damages the whole position | Zero-tolerance verification; rapid delisting; public transparency reports |
| **Price-based repositioning** | Competing on discounting erodes the trust position | Discount only via structured coupon campaigns, never on headline positioning |
| **Feature-led messaging** | Communicating features instead of outcomes | All external messaging must lead with outcome, not feature |
| **Metro-centric brand drift** | Positioning drifting toward metro premium audience | Mandatory Tier 2/3 representation in all campaign creative and pricing tiers |

---

# Chapter 14 — Competitive Analysis

> **Purpose of this chapter:** To provide an objective, structured assessment of the competitive landscape, identify where Ellowring wins and where it is vulnerable, and define the strategic response to each competitor class.

## 14.1 Competitive Landscape Segmentation

| Class | Description | Representative Players |
|---|---|---|
| **A. Exam-prep platforms** | Online coaching for competitive examinations | Unacademy, Byju's, PhysicsWallah, Vedantu, Testbook, Adda247 |
| **B. Course marketplaces / MOOCs** | Skill and certification courses | Coursera, Udemy, upGrad, Great Learning, Simplilearn |
| **C. Job boards / professional networks** | Job discovery and applications | Naukri, LinkedIn, Indeed, Shine, Apna, Foundit |
| **D. Internship platforms** | Internships and early-career opportunities | Internshala, LetsIntern |
| **E. Admission / counselling portals** | College discovery and admission services | Shiksha, CollegeDunia, Careers360 |
| **F. Study abroad services** | Overseas education consulting | IDP, Leverage Edu, ApplyBoard, Yocket |
| **G. University LMS / campus systems** | Institutional learning and ERP | Moodle, Canvas, Blackboard, campus ERP vendors |
| **H. HRTech / ATS / payroll** | Employer-side hiring and payroll | Greenhouse-class ATS, Zoho People, Keka, RazorpayX Payroll, Darwinbox |

## 14.2 Master Competitive Comparison

Legend: —-— Full capability · —-— Partial capability · —-< Absent

| Capability | Unacademy | Byju's | Coursera | LinkedIn | Naukri | Internshala | University LMS | **Ellowring** |
|---|---|---|---|---|---|---|---|---|
| Career guidance (psychometric) | —-< | —-— | —-< | —-< | —-< | —-< | —-< | **—-—** |
| Competitive exam coaching | —-— | —-— | —-< | —-< | —-< | —-< | —-< | **—-—** |
| Mock tests with rank/analytics | —-— | —-— | —-< | —-< | —-< | —-< | —-— | **—-—** |
| College admission guidance | —-< | —-— | —-< | —-< | —-< | —-< | —-< | **—-—** |
| Study abroad pathway | —-< | —-< | —-< | —-< | —-< | —-< | —-< | **—-—** |
| Skill courses with certificates | —-— | —-— | —-— | —-— | —-< | —-— | —-— | **—-—** |
| Internships | —-< | —-< | —-< | —-— | —-— | —-— | —-< | **—-—** |
| Mentor-supervised live projects | —-< | —-< | —-— | —-< | —-< | —-— | —-< | **—-—** |
| Job discovery and applications | —-< | —-< | —-< | —-— | —-— | —-— | —-< | **—-—** |
| Campus placement drive management | —-< | —-< | —-< | —-< | —-— | —-< | —-— | **—-—** |
| Employer ATS | —-< | —-< | —-< | —-— | —-— | —-— | —-< | **—-—** |
| Payroll | —-< | —-< | —-< | —-< | —-< | —-< | —-< | **—-—** |
| AI career assistant | —-— | —-— | —-— | —-— | —-— | —-< | —-< | **—-—** |
| Verified credential registry | —-< | —-< | —-— | —-— | —-< | —-— | —-— | **—-—** |
| Unified wallet and coupons | —-— | —-— | —-< | —-< | —-< | —-< | —-< | **—-—** |
| Channel partner network | —-— | —-— | —-< | —-< | —-< | —-< | —-< | **—-—** |
| Institutional (college) dashboard | —-< | —-< | —-— | —-< | —-— | —-< | —-— | **—-—** |
| Single profile Class 11 —' first job | —-< | —-< | —-< | —-< | —-< | —-< | —-< | **—-—** |
| **Lifecycle coverage score (/18)** | **5.5** | **7** | **4** | **5** | **5.5** | **4.5** | **4** | **18** |

## 14.3 Detailed Competitor Assessments

### 14.3.1 Unacademy (Exam-Prep Platform)

| Dimension | Assessment |
|---|---|
| **Core strength** | Large educator network, strong brand in competitive exam prep, extensive live class infrastructure |
| **Business model** | Subscription-based exam-prep plans |
| **Target user** | Competitive exam aspirants |
| **Where they win** | Depth of exam catalogue, educator star power, brand recall among aspirants |
| **Where they are weak** | Journey ends at the exam; no admissions, skilling-to-hiring linkage, no employer side; heavy discounting pressure on margins |
| **Threat level to Ellowring** | **High** — direct competition in the Coaching Ecosystem |
| **Ellowring's counter** | Compete on outcome continuity, not educator celebrity. Position coaching as one stage in a longer path with admission and placement value attached. Bundle coaching with career guidance and placement prep at comparable price points. |
| **Risk if they expand** | They could add job placement, but lack employer relationships and payroll capability; expansion would take multiple years and a distinct GTM motion |

### 14.3.2 Byju's / Large-Scale EdTech Coaching

| Dimension | Assessment |
|---|---|
| **Core strength** | Massive brand awareness, large content library, extensive offline-online hybrid presence, strong field sales |
| **Business model** | High-ticket course sales, often via aggressive direct sales |
| **Target user** | K-12 and competitive exam students |
| **Where they win** | Brand reach into households, content production quality, distribution muscle |
| **Where they are weak** | Reputational challenges around sales practices and refunds; K-12 focus; no employment linkage; high cost structure |
| **Threat level** | **Medium-High** — competes for the same parent wallet |
| **Ellowring's counter** | Position explicitly on transparency and refund fairness — the exact dimension where large-scale EdTech has drawn criticism. Emphasise no-pressure self-serve purchase and published refund policy. |

### 14.3.3 Coursera / Global MOOC Platforms

| Dimension | Assessment |
|---|---|
| **Core strength** | University and industry partnerships, globally recognised certificates, enormous catalogue |
| **Business model** | Subscription plus per-certificate fees; enterprise learning |
| **Where they win** | Brand credibility of certificates, breadth, global recognition |
| **Where they are weak** | Not aligned to Indian entrance exams, colleges or campus placement dynamics; low completion rates; no hiring pipeline into Indian employers; pricing in a global band |
| **Threat level** | **Medium** — competes in the Course Ecosystem only |
| **Ellowring's counter** | Position courses as demand-linked: every course maps to live job postings on the same platform. Indian pricing. Certificate value backed by employer network recognition, not brand alone. |

### 14.3.4 LinkedIn (Professional Network)

| Dimension | Assessment |
|---|---|
| **Core strength** | Global professional graph, recruiter product, content engine, brand authority |
| **Business model** | Recruiter subscriptions, advertising, premium memberships, learning |
| **Where they win** | Network effects among experienced professionals, recruiter adoption, brand |
| **Where they are weak** | Weak for fresh graduates and Tier 2/3 students; self-declared and unverified profile claims; no exam prep, admissions or Indian campus placement workflow; no payroll |
| **Threat level** | **Medium** — competes in Jobs, not in the student lifecycle |
| **Ellowring's counter** | Own the pre-professional stage LinkedIn does not serve. Verified-by-platform credentials versus self-declared claims. Campus placement workflow that LinkedIn does not offer. |

### 14.3.5 Naukri (Job Board)

| Dimension | Assessment |
|---|---|
| **Core strength** | Largest Indian resume database, deep recruiter relationships, strong brand for job search |
| **Business model** | Recruiter subscriptions and job posting fees; candidate premium services |
| **Where they win** | Recruiter mindshare, database scale, experienced-hire market |
| **Where they are weak** | Fresher segment poorly served; unverified resumes; no learning, no skill development, no campus workflow, no payroll; resume-spam dynamics |
| **Threat level** | **Medium-High** in the Jobs module |
| **Ellowring's counter** | Do not compete on database size. Compete on candidate verification and fresher specialisation. Sell to employers on quality-per-application, not volume. |

### 14.3.6 Internshala (Internship Platform)

| Dimension | Assessment |
|---|---|
| **Core strength** | Strong student brand for internships, established employer base for internships, training courses attached |
| **Business model** | Employer posting fees, student training course sales |
| **Where they win** | Category ownership of "internship" in Indian student mindshare |
| **Where they are weak** | Limited verification depth; narrow lifecycle scope; no admissions, coaching or payroll; limited institutional (college) product |
| **Threat level** | **Medium-High** in the Internship module |
| **Ellowring's counter** | Verified internships plus mentor-supervised live projects — a category they do not offer at depth. Internships positioned within a full career path rather than as a standalone transaction. |

### 14.3.7 University LMS (Moodle / Canvas / Campus ERP)

| Dimension | Assessment |
|---|---|
| **Core strength** | Deep institutional integration, academic workflow, faculty familiarity |
| **Business model** | Institutional licence or open-source with services |
| **Where they win** | Course delivery inside the institution; academic records |
| **Where they are weak** | Institution-locked; student loses access at graduation; no employer side; no career guidance; no external opportunity marketplace; poor student UX |
| **Threat level** | **Low** — largely complementary |
| **Ellowring's counter** | Position as complementary: the LMS handles the degree, Ellowring handles employability. Offer integration rather than replacement to reduce institutional resistance. |

### 14.3.8 Study Abroad Consultants and Platforms

| Dimension | Assessment |
|---|---|
| **Core strength** | University relationships, established counselling processes, high-touch service |
| **Business model** | Student service fees plus undisclosed university commissions |
| **Where they win** | Personal relationships, offline trust, university access |
| **Where they are weak** | Opacity of commissions creates incentive misalignment; inconsistent quality; poor digital tracking |
| **Threat level** | **Medium** in the Study Abroad module |
| **Ellowring's counter** | Radical transparency — disclose service fees and commission structure. Digital milestone tracking. Position against the exact opacity that defines the incumbent category. |

### 14.3.9 HRTech / Payroll Vendors

| Dimension | Assessment |
|---|---|
| **Core strength** | Mature payroll compliance engines, established SMB relationships, deep HR feature sets |
| **Business model** | Per-employee-per-month SaaS |
| **Where they win** | Compliance depth, HR feature breadth, integration ecosystems |
| **Where they are weak** | No talent supply; hiring and payroll are separate purchases; no education linkage |
| **Threat level** | **Medium** in the Payroll module |
| **Ellowring's counter** | Do not compete on HR feature depth in V2. Compete on the hiring-to-payroll continuum: employers who hire on Ellowring get payroll with zero onboarding friction. Target SMBs, not large enterprises, initially. |

## 14.4 Competitive Positioning Summary Table

| Competitor Class | Their Scope | Ellowring's Overlap | Ellowring's Advantage | Their Advantage |
|---|---|---|---|---|
| Exam-prep platforms | Exam only | Coaching | Path continuity, placement linkage | Brand, educator depth |
| MOOCs | Courses only | Courses | Indian relevance, demand-linkage, pricing | Global brand, catalogue size |
| Job boards | Jobs only | Jobs | Verification, fresher focus, campus workflow | Database scale, recruiter base |
| Internship platforms | Internships only | Internships | Live projects, verification, path context | Category mindshare |
| Admission portals | Discovery only | Admissions | Transactional completion, verified data | SEO traffic, content depth |
| Study abroad | Abroad only | Study Abroad | Transparency, digital tracking | University relationships |
| University LMS | Academics only | Courses | Employability linkage, post-graduation continuity | Institutional entrenchment |
| HRTech/Payroll | Post-hire only | Payroll | Hiring integration | Compliance maturity |

## 14.5 Competitive Moats

| Moat | Strength | Time to Replicate | Why |
|---|---|---|---|
| **Longitudinal student data graph** | Very Strong | 4-6 years | Requires continuous engagement across the full lifecycle |
| **Verified institutional network** | Strong | 3-4 years | Field sales relationship-building cannot be accelerated with capital alone |
| **Six-role marketplace liquidity** | Strong | 3-5 years | Requires three distinct GTM motions operating simultaneously |
| **Hiring-to-payroll integration** | Medium-Strong | 2-3 years | Requires HRTech compliance capability plus talent supply |
| **Outcome-calibrated AI** | Medium-Strong | 3-4 years | Requires closed-loop outcome data |
| **Channel partner field network** | Medium | 2-3 years | Requires partner economics and trust track record |
| **Brand trust** | Medium | 3-5 years | Accumulates only through consistent delivery |

## 14.6 Competitive Vulnerabilities of Ellowring

| Vulnerability | Description | Mitigation |
|---|---|---|
| **Breadth vs. depth perception** | Specialists may out-execute in any single module | Ensure each V1 module meets or exceeds category-standard quality bars before launch |
| **Brand recognition deficit** | Incumbents have years of brand investment | Lead with verified outcome proof and channel partner trust rather than brand spend |
| **Capital intensity** | Multi-module build requires sustained investment | Strict V1 scope discipline; revenue from Day 1 across multiple lines |
| **Content production burden** | 15 exam tracks require substantial content | Partner-sourced content via Training Institutes reduces first-party production load |
| **Two-sided cold start** | Students need employers; employers need students | Beachhead strategy: dense concentration in 2 states before expansion |
| **Operational verification cost** | Manual verification does not scale linearly | Progressive automation of verification checks; tiered verification depth |

## 14.7 Competitive Response Playbook

| Competitor Move | Likely Trigger | Ellowring Response |
|---|---|---|
| Exam-prep player adds job placement | Ellowring gains coaching share | Accelerate employer network depth and publish comparative placement outcomes |
| Job board launches fresher-verified product | Ellowring gains hiring share | Emphasise learning-to-hiring integration they cannot match |
| Internship platform adds live projects | Ellowring gains project traction | Emphasise mentor quality, employer sponsorship and portfolio verification |
| Aggressive price war in coaching | Market share pressure | Hold price; increase bundled value (career guidance + placement prep included) |
| Incumbent acquires a complementary player | Consolidation | Accelerate integration depth; integration quality is not acquirable quickly |
| Payroll vendor adds hiring | Payroll competition | Emphasise verified candidate supply, which they lack |

---

# Chapter 15 — SWOT Analysis

> **Purpose of this chapter:** To provide an honest internal and external assessment of Ellowring's strategic position, and to convert each SWOT element into a concrete action with an owner and a measurable indicator.

## 15.1 SWOT Summary Matrix

| | **Helpful to Objectives** | **Harmful to Objectives** |
|---|---|---|
| **Internal Origin** | **STRENGTHS**<br>Integrated lifecycle coverage · Six-role ecosystem · Verified-only supply · Modern scalable architecture · AI-native design · Diversified revenue · Channel distribution model · India-specific depth | **WEAKNESSES**<br>New brand · Execution complexity · Content production burden · Capital requirement · Two-sided cold start · Operational verification cost · Team scaling risk |
| **External Origin** | **OPPORTUNITIES**<br>Large under-served market · Tier 2/3 supply gap · NEP 2020 tailwind · Skills-first hiring shift · AI cost curve · Platform fatigue · Study abroad growth · SMB payroll formalisation · Global expansion | **THREATS**<br>Well-funded incumbents · Price wars · Regulatory change · Economic/hiring downturn · Data breach risk · Content piracy · Partner churn · Talent competition |

## 15.2 Strengths — Detailed

| # | Strength | Description | Evidence / Basis | Strategic Action | Indicator |
|---|---|---|---|---|---|
| S1 | **Integrated lifecycle coverage** | Only platform spanning Class 11 to first salary | Chapter 14 comparison: 18/18 vs. next best 7/18 | Market the continuity relentlessly; make cross-module linkage visible in product | % students in —— 3 modules |
| S2 | **Six-role ecosystem** | Students, colleges, companies, training, partners, admin on one platform | Architecture designed for six roles from inception | Build cross-role marketplaces that create mutual dependency | Cross-role transaction volume |
| S3 | **Verified-only supply** | Zero unverified institutions or employers | Mandatory verification workflows | Publish transparency reports; make verification a brand asset | Verification SLA compliance |
| S4 | **Modern scalable architecture** | Next.js + NestJS + PostgreSQL/Prisma; cloud-native | Chapter 8 architecture | Maintain engineering standards; avoid technical debt accumulation | P95 latency, uptime, deploy frequency |
| S5 | **AI-native design** | AI is a platform layer, not a bolt-on feature | Chapter 31 | Ship explainable AI early; measure acceptance rate | AI recommendation acceptance rate |
| S6 | **Diversified revenue** | 13 revenue lines across B2C and B2B | Chapter 17 | Enforce the no-single-line > 35% rule | Revenue concentration ratio |
| S7 | **Channel partner distribution** | Field network reaching Tier 2/3 | Chapter 20, 32 | Invest in partner economics and tooling early | Partner-sourced revenue % |
| S8 | **India-specific depth** | State exams (TNPSC, TET, TRB), Indian payroll statutory logic, Indian college system | Chapter 23, 30 | Deepen state-level content moat before national players localise | State exam track completeness |
| S9 | **Outcome orientation** | Measured by placements, not screen time | Chapter 43 | Publish outcome data; make it the primary marketing asset | Placement and admission counts |
| S10 | **Transparent pricing** | No hidden fees, published refund policy | Chapter 4 guardrails | Contrast explicitly with category norms in messaging | Refund dispute rate |

## 15.3 Weaknesses — Detailed

| # | Weakness | Description | Impact | Mitigation Action | Owner | Indicator |
|---|---|---|---|---|---|---|
| W1 | **New brand, zero recognition** | Competing against decade-old brands | Slower top-of-funnel | Channel partners + institutional partnerships + outcome-led content SEO | Growth | CAC, organic traffic share |
| W2 | **Execution complexity** | Nine ecosystems, six roles, 16 modules | Delivery risk, quality dilution | Ruthless V1 scope discipline (Ch. 40); phased rollout; per-module quality gates | Product | On-time release %, defect density |
| W3 | **Content production burden** | 15 exam tracks require enormous content | Cost and time | Partner-sourced content via Training Institutes; buy vs. build per track | Academic | Content coverage % per track |
| W4 | **Capital requirement** | Multi-module build with long payback | Funding dependency | Revenue from Day 1 in 6 modules; phase capital-heavy modules to V2 | CEO | Burn multiple, runway months |
| W5 | **Two-sided cold start** | Students need employers; employers need students | Slow initial liquidity | Beachhead density strategy; seed employer side via founder network | Growth | Applications per posting; postings per student |
| W6 | **Operational verification cost** | Manual verification is labour-intensive | Margin pressure at scale | Progressive automation; risk-tiered verification depth | Admin Ops | Cost per verification |
| W7 | **Team scaling risk** | Hiring senior engineers and domain experts competitively | Delivery velocity | Early senior hires; strong engineering brand; remote-friendly | CTO | Time-to-fill, attrition |
| W8 | **No mobile app in V1** | Indian students are mobile-first | Engagement ceiling | Best-in-class responsive PWA in V1; native apps in V2 | Product | Mobile web engagement metrics |
| W9 | **Limited language coverage in V1** | English-only launch | Tier 3 exclusion | Hindi and Tamil in V2; content architecture i18n-ready from V1 | Product | Non-English user % post-V2 |
| W10 | **Unproven AI accuracy** | Recommendation quality not yet validated at scale | Trust risk | Human-in-the-loop review, explainability, conservative confidence thresholds | Data | AI acceptance and correction rates |

## 15.4 Opportunities — Detailed

| # | Opportunity | Description | Size / Potential | Capture Strategy | Timeline |
|---|---|---|---|---|---|
| O1 | **Large under-served market** | —,—42,000 Cr SAM; target is < 1% share | Very Large | Multi-module penetration rather than single-category dominance | Y1-Y3 |
| O2 | **Tier 2/3 supply gap** | Quality supply concentrated in metros | Very Large | Channel partners + affordable pricing + low-bandwidth UX | Y1-Y2 |
| O3 | **NEP 2020 alignment** | Policy emphasis on skills, credits, multidisciplinarity | Large | Position certificates and skill credits for policy alignment | Y1-Y3 |
| O4 | **Skills-first hiring shift** | Employers valuing demonstrated skill over pedigree | Large | Live projects and verified assessments as the differentiating asset | Y1-Y2 |
| O5 | **AI cost curve** | Personalisation now economically viable | Large | Ship AI features that competitors cannot match without the data graph | Y1-Y2 |
| O6 | **Platform fatigue** | Users tired of managing multiple apps | Medium | Consolidation messaging; import/migration tooling | Y1 |
| O7 | **Study abroad growth** | Continued growth in Indian outbound students | Large | Transparency-led positioning against opaque consultants | Y2 |
| O8 | **SMB payroll formalisation** | Growing formal employment requiring compliant payroll | Medium-Large | Bundle payroll free/discounted with hiring packages to drive adoption | Y2 |
| O9 | **College digitalisation pressure** | Accreditation and ranking pressure driving data systems adoption | Medium | Accreditation-ready reporting as an institutional wedge | Y1-Y2 |
| O10 | **Global expansion** | Diaspora corridors, GCC, SE Asia, Africa with similar structural problems | Very Large | Architecture built multi-currency and multi-locale from V1 | Y3 |
| O11 | **Public API ecosystem** | Third parties building on Ellowring data | Medium | Partner API in V3 | Y3 |
| O12 | **Credential verification network** | Becoming the trusted registry for Indian skill credentials | Large | Open verification endpoint; employer adoption | Y3 |

## 15.5 Threats — Detailed

| # | Threat | Description | Likelihood | Impact | Mitigation | Early Warning Signal |
|---|---|---|---|---|---|---|
| T1 | **Well-funded incumbent expansion** | An exam-prep or job-board player adds adjacent modules | High | High | Deepen integration; integration quality is the moat, not feature presence | Competitor job posting / product announcements |
| T2 | **Price war** | Aggressive discounting in coaching or courses | High | Medium-High | Compete on bundled outcome value, not price; protect gross margin floor | Competitor pricing changes; our conversion rate at list price |
| T3 | **Regulatory change** | Coaching sector regulation, data protection changes, payroll statutory changes | Medium | Medium-High | Compliance monitoring function; diversified revenue reduces single-sector exposure | Regulatory consultation notices |
| T4 | **Economic / hiring downturn** | Reduced employer hiring budgets | Medium | High | Non-hiring revenue lines (coaching, courses, admissions) provide ballast | Job posting volume decline |
| T5 | **Data breach** | Compromise of student personal data | Low-Medium | Very High | Security-by-design (Ch. 36), encryption, pen testing, incident response plan | Security monitoring alerts |
| T6 | **Content piracy** | Coaching content redistributed illegally | High | Medium | DRM, watermarking, session limits, legal enforcement | Piracy monitoring |
| T7 | **Partner churn** | Colleges or training institutes leaving | Medium | Medium | Contractual terms, demonstrated ROI reporting, success management | Renewal rate, engagement decline |
| T8 | **Channel partner misconduct** | Partners making false promises to students | Medium | High | Partner code of conduct, training certification, mystery shopping, delisting | Student complaint patterns |
| T9 | **Talent competition** | Losing engineers and domain experts to better-funded firms | Medium | Medium | Equity, mission, engineering culture, remote flexibility | Attrition rate, offer acceptance rate |
| T10 | **Payment gateway / infrastructure dependency** | Outage in Razorpay, Vercel, Railway or AWS | Medium | Medium-High | Multi-provider payment fallback (Stripe), multi-region readiness | Provider status monitoring |
| T11 | **Fraudulent employers** | A bad actor posts fraudulent jobs targeting students | Medium | Very High | Mandatory verification, ongoing monitoring, rapid delisting, student reporting | Student fraud reports |
| T12 | **AI hallucination in guidance** | AI gives incorrect career or academic advice | Medium | High | Grounded retrieval, confidence thresholds, human review of high-stakes advice, disclaimers | AI correction and complaint rates |

## 15.6 Strategic Options Derived from SWOT

### 15.6.1 SO Strategies (Strengths —' Opportunities)

| Strategy | Description |
|---|---|
| **SO-1** | Use integrated lifecycle coverage (S1) to capture the platform-fatigue opportunity (O6) with explicit consolidation messaging |
| **SO-2** | Use channel partner distribution (S7) to capture the Tier 2/3 supply gap (O2) faster than metro-centric incumbents |
| **SO-3** | Use AI-native design (S5) plus the data graph to capture the AI cost-curve opportunity (O5) with features competitors cannot replicate |
| **SO-4** | Use verified-only supply (S3) to build the credential verification network (O12) as a long-term standard |
| **SO-5** | Use India-specific depth (S8) plus modern architecture (S4) to enable global expansion (O10) with a proven playbook |

### 15.6.2 WO Strategies (Weaknesses —' Opportunities)

| Strategy | Description |
|---|---|
| **WO-1** | Offset brand deficit (W1) by capturing college digitalisation pressure (O9) — institutional endorsement substitutes for brand |
| **WO-2** | Offset content burden (W3) by using training institute partnerships (O2 supply gap) to source content |
| **WO-3** | Offset cold start (W5) by bundling payroll with hiring (O8) to attract employers before student liquidity exists |
| **WO-4** | Offset capital requirement (W4) by monetising six modules from Day 1 |

### 15.6.3 ST Strategies (Strengths —' Threats)

| Strategy | Description |
|---|---|
| **ST-1** | Use diversified revenue (S6) to withstand hiring downturn (T4) |
| **ST-2** | Use integration depth (S1) to defend against incumbent expansion (T1) — features are copyable, integration is not |
| **ST-3** | Use verification capability (S3) to neutralise fraudulent employer threat (T11) |
| **ST-4** | Use transparent pricing (S10) to avoid being drawn into price wars (T2) — compete on trust, not discount |

### 15.6.4 WT Strategies (Weaknesses —' Threats)

| Strategy | Description |
|---|---|
| **WT-1** | Manage execution complexity (W2) against incumbent expansion (T1) via strict V1 scope discipline — ship fewer things excellently |
| **WT-2** | Manage capital constraint (W4) against price war (T2) by refusing to match irrational pricing |
| **WT-3** | Manage unproven AI (W10) against hallucination risk (T12) with conservative confidence thresholds and human review |
| **WT-4** | Manage team scaling risk (W7) against talent competition (T9) with early senior hiring and strong culture investment |

## 15.7 SWOT-Driven Priorities

| Priority | Rationale | V1 Action |
|---|---|---|
| 1 | Integration depth is the only durable moat | Build the shared spine (identity, wallet, notifications, analytics) before module breadth |
| 2 | Verification is the trust foundation | Ship verification workflows in V1, not later |
| 3 | Cold start must be solved geographically | Concentrate all V1 GTM in two states |
| 4 | Scope discipline protects quality | Freeze V1 scope per Chapter 40; no additions without an equal removal |
| 5 | Revenue diversity protects survival | Six monetised modules live in V1 |
| 6 | Security is existential | Security-by-design from the first commit |

---

# Chapter 16 — Business Model

> **Purpose of this chapter:** To describe the complete business model — how Ellowring creates, delivers and captures value across all six actors — including the operating model, cost structure, unit economics and network effects.

## 16.1 Business Model Canvas

### 16.1.1 Customer Segments

| Segment | Type | Paying? |
|---|---|---|
| Students (Class 11 —' early career) | B2C | Yes (transactional + subscription) |
| Colleges and Universities | B2B | Yes (SaaS + commission) |
| Companies (SMB —' Enterprise) | B2B | Yes (hiring + payroll) |
| Training Institutes | B2B partner | Revenue share |
| Channel Partners | B2B2C distributor | Commission recipient |
| International Universities | B2B partner | Commission payer |

### 16.1.2 Value Propositions

| Segment | Value Proposition |
|---|---|
| Students | One continuous, verified path from Class 11 to first job with AI guidance |
| Colleges | Qualified admission leads + placement automation + outcome analytics |
| Companies | Pre-verified candidates + integrated ATS + payroll in one system |
| Training Institutes | National distribution with zero technology investment |
| Channel Partners | Multi-line commission with guaranteed attribution |
| International Universities | Qualified, document-ready Indian applicants |

### 16.1.3 Channels

| Channel | Segment | Cost Profile |
|---|---|---|
| Organic search / content | Students | Low, compounding |
| Channel partner network | Students (Tier 2/3) | Variable (commission-based) |
| School and college partnerships | Students | Medium (field effort) |
| Campus ambassadors | College students | Low |
| Performance marketing | Students | High (used selectively) |
| Direct field sales | Colleges | High |
| Enterprise sales | Companies | High |
| Inbound (outcome-driven) | All | Low, compounding |
| Referral programme | Students | Low (credit-based) |

### 16.1.4 Customer Relationships

| Segment | Relationship Model |
|---|---|
| Students | Self-service + AI assistant + community + escalated human support |
| Colleges | Dedicated success manager + quarterly business reviews |
| Companies (SMB) | Self-service + pooled support |
| Companies (Enterprise) | Named account manager |
| Training Institutes | Partner manager + onboarding support |
| Channel Partners | Partner portal + tiered support + training programme |

### 16.1.5 Revenue Streams

Detailed in Chapter 17. Summary: 13 streams across transactional, commission, subscription and revenue-share models.

### 16.1.6 Key Resources

| Resource | Description | Criticality |
|---|---|---|
| Technology platform | Codebase, architecture, infrastructure | Critical |
| Longitudinal student data graph | The compounding moat | Critical |
| Verified institutional network | Colleges, companies, training institutes | Critical |
| Content library | Exam and course content | High |
| Channel partner network | Field distribution | High |
| Brand and trust | Reputation asset | High |
| Team | Product, engineering, academic, operations | Critical |
| Capital | Funding runway | High |

### 16.1.7 Key Activities

| Activity | Description | Frequency |
|---|---|---|
| Product development | Building and shipping modules | Continuous |
| Content production and curation | Exam and course content | Continuous |
| Verification operations | Institution and employer verification | Daily |
| Partner acquisition | Colleges, companies, training, channel | Continuous |
| Student acquisition | Marketing and channel-driven | Continuous |
| Matching and recommendation operations | AI model improvement and tuning | Continuous |
| Payout and reconciliation | Financial operations | Weekly/Monthly |
| Support and success | Student and institutional support | Daily |
| Compliance | Data protection, payroll statutory, contracts | Continuous |

### 16.1.8 Key Partnerships

| Partner Type | Purpose | Commercial Basis |
|---|---|---|
| Training institutes | Content and delivery supply | Revenue share (60/40 to 70/30 in partner's favour depending on tier) |
| Colleges | Admission supply and placement demand | Commission and/or SaaS licence |
| Companies | Internship, project and job supply | They pay for hiring |
| International universities | Study abroad supply | Commission from university |
| Channel partners | Distribution | Commission on conversions |
| Payment providers (Razorpay, Stripe) | Payment processing | Transaction fees |
| Cloud providers (Vercel, Railway, AWS, Cloudflare) | Infrastructure | Usage-based |
| Communication providers (SMS/WhatsApp/Email) | Notifications | Usage-based |
| Live video provider | Class delivery | Usage-based |
| AI model providers | Intelligence layer | Usage-based |
| Assessment/proctoring vendors | Test integrity | Per-test or subscription |
| Background verification vendors | Employer/candidate checks | Per-check |

### 16.1.9 Cost Structure

| Cost Category | Description | Type | Approx. % of Revenue (Y1 —' Y3) |
|---|---|---|---|
| Content and academic delivery | Faculty, content production, partner revenue share | Variable | 26% —' 20% |
| Technology infrastructure | Cloud, CDN, storage, AI inference, third-party APIs | Semi-variable | 9% —' 6% |
| Product and engineering | Salaries for product, design, engineering, QA, DevOps | Fixed | 22% —' 16% |
| Sales and marketing | Performance marketing, field sales, events | Variable | 18% —' 14% |
| Channel partner commissions | Payouts to partners | Variable | 8% —' 9% |
| Operations and support | Verification, moderation, support, success | Semi-variable | 8% —' 6% |
| Payment processing | Gateway fees | Variable | 2% —' 2% |
| General and administrative | Legal, finance, compliance, office, insurance | Fixed | 7% —' 5% |
| **Total** | | | **100% —' 78%** |
| **Operating margin** | | | **0% —' 22%** |

## 16.2 Operating Model

### 16.2.1 Platform Operating Principles

| Principle | Implementation |
|---|---|
| **Self-service first** | 85%+ of institutional tasks completable without support intervention |
| **Verification is non-negotiable** | Human-reviewed verification for all institutional accounts, progressively automated |
| **Automated financial flows** | Wallet ledger, automatic commission calculation, scheduled payouts |
| **Data-driven prioritisation** | Every roadmap decision tied to a measured metric |
| **Partner-led content supply** | Ellowring builds tooling; partners supply much of the teaching capacity |

### 16.2.2 Multi-Tenancy Model

| Aspect | Approach |
|---|---|
| Tenant types | College, Company, Training Institute, Channel Partner |
| Isolation | Logical isolation via tenant-scoped queries and RBAC; shared database with strict row-level scoping |
| Data sharing | Student data shared with tenants only under explicit student consent and defined purpose |
| Branding | Co-branding supported for colleges and training institutes (V2) |
| Configuration | Per-tenant configuration for workflows, fields, notifications and branding |

### 16.2.3 Marketplace Dynamics

| Marketplace | Supply Side | Demand Side | Liquidity Metric |
|---|---|---|---|
| Coaching | Training institutes, faculty | Students | Enrolments per batch |
| Courses | Training institutes, Ellowring, industry partners | Students | Enrolments per course |
| Admissions | Colleges | Students | Applications per college |
| Study abroad | International universities | Students | Applications per university |
| Internships | Companies | Students | Applications per internship |
| Live projects | Companies | Student teams | Teams per project |
| Jobs | Companies | Students | Applications per job |

### 16.2.4 Marketplace Liquidity Targets

| Marketplace | Healthy Ratio | Y1 Target |
|---|---|---|
| Internships | 20-60 applications per posting | 35 |
| Jobs | 30-100 applications per posting | 55 |
| Live projects | 3-8 teams per project | 5 |
| Coaching | 60-200 students per batch | 90 |
| Admissions | 15-50 applications per college programme | 25 |

## 16.3 Network Effects

| Network Effect Type | Description | Strength |
|---|---|---|
| **Direct (student — student)** | Peer referrals, study groups, leaderboards, project teams | Medium |
| **Cross-side (student — employer)** | More students attract more employers and vice versa | Strong |
| **Cross-side (student — college)** | More students attract more colleges and vice versa | Strong |
| **Cross-side (college — employer)** | More colleges attract more recruiters and vice versa | Strong |
| **Data network effect** | More usage —' better AI —' better outcomes —' more usage | Very Strong |
| **Verification network effect** | More verified credentials —' more employer trust —' more credential demand | Strong |

## 16.4 Unit Economics

### 16.4.1 Student Unit Economics

| Metric | Y1 | Y2 | Y3 |
|---|---|---|---|
| Blended CAC | —,—420 | —,—340 | —,—280 |
| Free —' paid conversion | 8.8% | 10.6% | 12.0% |
| CAC per paying student | —,—4,770 | —,—3,210 | —,—2,330 |
| ARPPU (annual) | —,—6,800 | —,—8,200 | —,—9,500 |
| Gross margin per paying student | 52% | 62% | 68% |
| Gross profit per paying student | —,—3,536 | —,—5,084 | —,—6,460 |
| Average paying tenure | 1.4 yrs | 1.8 yrs | 2.3 yrs |
| LTV (gross profit basis) | —,—4,950 | —,—9,151 | —,—14,858 |
| LTV : CAC (per paying student) | 1.04 : 1 | 2.85 : 1 | 6.38 : 1 |
| Payback period | 14 months | 8 months | 5 months |

> **Note:** Year 1 unit economics are intentionally near break-even at the paying-student level because acquisition is front-loaded and tenure has not yet accumulated. The model becomes strongly positive from Year 2 as multi-module adoption extends tenure and ARPPU.

### 16.4.2 College Unit Economics

| Metric | Value |
|---|---|
| Sales cost to acquire | —,—45,000 |
| Annual contract value (blended) | —,—1,80,000 |
| Gross margin | 78% |
| Gross profit Y1 | —,—1,40,400 |
| Payback | 4 months |
| Expected retention | 85% annually |
| 3-year LTV | —,—3,60,000 |
| LTV : CAC | 8 : 1 |

### 16.4.3 Company Unit Economics

| Metric | SMB | Mid-Market | Enterprise |
|---|---|---|---|
| Sales cost to acquire | —,—18,000 | —,—90,000 | —,—3,50,000 |
| Annual contract value | —,—85,000 | —,—4,50,000 | —,—18,00,000 |
| Gross margin | 82% | 80% | 76% |
| Payback | 3 months | 3 months | 4 months |
| Retention | 78% | 87% | 92% |
| 3-year LTV | —,—1,70,000 | —,—10,50,000 | —,—46,00,000 |
| LTV : CAC | 9 : 1 | 12 : 1 | 13 : 1 |

### 16.4.4 Channel Partner Economics

| Metric | Value |
|---|---|
| Cost to recruit and onboard | —,—2,500 |
| Average monthly conversions per active partner | 6 |
| Average commission per conversion | —,—1,100 |
| Average monthly revenue generated per partner | —,—9,800 |
| Partner commission cost | —,—6,600 |
| Net platform contribution per partner per month | —,—3,200 |
| Partner active retention (12 months) | 55% |
| Payback | < 1 month |

## 16.5 Pricing Philosophy

| Principle | Application |
|---|---|
| **Value-based, not cost-plus** | Price against the outcome delivered, not the cost of delivery |
| **Accessible entry point** | A genuinely useful free tier in every student-facing module |
| **Tiered by capacity to pay** | Tier 1/2/3 pricing variants where legally and commercially appropriate |
| **Bundle for continuity** | Bundles priced to reward multi-module adoption |
| **Transparent always** | Total payable, taxes and refund terms shown before payment |
| **No surprise renewals** | Renewal notice 7 days in advance; one-click cancellation |
| **EMI where ticket size warrants** | Any purchase above —,—8,000 offers EMI |

## 16.6 Growth Model

| Growth Loop | Mechanism | Compounding Factor |
|---|---|---|
| **Referral loop** | Student refers peer —' both receive wallet credit —' new student refers again | Medium |
| **Outcome loop** | Student gets placed —' success story —' attracts students —' more placements | Strong |
| **Institutional loop** | College joins —' students onboard in bulk —' employers attracted —' more colleges join | Strong |
| **Content SEO loop** | Exam content ranks —' organic traffic —' registrations —' more content demand | Medium-Strong |
| **Channel partner loop** | Partner earns —' recruits sub-partners / stays active —' more conversions | Medium |
| **Data loop** | More usage —' better AI —' better outcomes —' more usage | Very Strong |

## 16.7 Defensibility Timeline

| Horizon | Primary Defensibility |
|---|---|
| Months 0-12 | Execution speed and integration breadth |
| Months 12-24 | Verified network density in beachhead states |
| Months 24-36 | Longitudinal data graph and outcome-calibrated AI |
| Year 3+ | Credential verification standard; employer payroll lock-in; ecosystem API |

---

# Chapter 17 — Revenue Model

> **Purpose of this chapter:** To specify every revenue stream in operational detail — pricing, payer, mechanics, margins, projections and the product capabilities required to bill and collect — so that finance, product and engineering share one authoritative reference.

## 17.1 Revenue Stream Inventory

| # | Stream | Type | Payer | V1? |
|---|---|---|---|---|
| R1 | Competitive exam coaching fees | Transactional | Student | Yes |
| R2 | College admission partnerships | Commission | College | Yes |
| R3 | Study abroad services | Service fee + commission | Student + University | No (V2) |
| R4 | Skill course fees | Transactional | Student | Yes |
| R5 | Internship facilitation | Fee | Student and/or Company | Yes |
| R6 | Live project fees | Fee | Student + Company | No (V2) |
| R7 | Recruitment fees | Transactional | Company | Yes |
| R8 | Payroll SaaS | Subscription | Company | No (V2) |
| R9 | Student premium membership | Subscription | Student | Yes |
| R10 | Company hiring packages | Subscription | Company | Yes |
| R11 | Institutional SaaS subscription | Subscription | College / Training Institute | Yes |
| R12 | Channel partner network | Cost/enabler | Platform —' Partner | Yes |
| R13 | Advertising and sponsorship | Advertising | Institutions / Brands | No (V3) |

## 17.2 R1 — Competitive Exam Coaching Fees

### 17.2.1 Mechanics

| Element | Detail |
|---|---|
| **Payer** | Student (usually parent-funded) |
| **Model** | Per-batch or per-track fee for a defined duration |
| **Billing** | One-time or EMI (3/6/9/12 months) |
| **Delivery** | Live classes, recorded lectures, notes, mock tests, doubt solving |
| **Revenue recognition** | Recognised rateably over the batch duration |
| **Refund policy** | Full refund within 7 days if less than 10% content consumed; pro-rata thereafter per published policy |

### 17.2.2 Pricing Grid

| Track | Duration | Tier 1 Price | Tier 2 Price | Tier 3 Price | Notes |
|---|---|---|---|---|---|
| NEET (Full) | 12 months | —,—34,999 | —,—27,999 | —,—21,999 | Includes 40+ full mocks |
| NEET (Repeater/Dropper) | 12 months | —,—39,999 | —,—31,999 | —,—24,999 | Intensive schedule |
| NEET (Crash) | 3 months | —,—12,999 | —,—9,999 | —,—7,999 | Pre-exam intensive |
| JEE Main | 12 months | —,—32,999 | —,—26,999 | —,—20,999 | |
| JEE Advanced | 12 months | —,—38,999 | —,—31,999 | —,—24,999 | Requires Main foundation |
| CUET | 8 months | —,—18,999 | —,—14,999 | —,—11,999 | Domain + general |
| UPSC (Prelims + Mains) | 15 months | —,—54,999 | —,—44,999 | —,—36,999 | Includes answer writing |
| TNPSC | 10 months | —,—19,999 | —,—15,999 | —,—12,999 | Tamil + English medium |
| SSC (CGL/CHSL) | 8 months | —,—14,999 | —,—11,999 | —,—8,999 | |
| Banking (IBPS/SBI) | 8 months | —,—14,999 | —,—11,999 | —,—8,999 | |
| Railway (RRB) | 6 months | —,—11,999 | —,—8,999 | —,—6,999 | |
| Defence (NDA/CDS/AFCAT) | 10 months | —,—21,999 | —,—17,999 | —,—13,999 | Includes SSB prep |
| Police (State) | 6 months | —,—9,999 | —,—7,999 | —,—5,999 | Includes physical prep guidance |
| TET | 6 months | —,—8,999 | —,—6,999 | —,—5,499 | |
| TRB | 8 months | —,—13,999 | —,—10,999 | —,—8,499 | |
| Placement Prep | 4 months | —,—9,999 | —,—7,999 | —,—5,999 | Aptitude + reasoning + verbal |
| Coding Prep | 6 months | —,—14,999 | —,—11,999 | —,—8,999 | DSA + system design basics |
| Communication Skills | 3 months | —,—6,999 | —,—5,499 | —,—3,999 | |
| Interview Prep | 2 months | —,—5,999 | —,—4,499 | —,—3,499 | Includes 5 mock interviews |

### 17.2.3 Economics

| Metric | Value |
|---|---|
| Average ticket size | —,—18,500 |
| Content and faculty cost | 34% |
| Platform delivery cost | 7% |
| Payment processing | 2% |
| Channel commission (where applicable) | 8% |
| **Gross margin** | **49%** |

### 17.2.4 Projection

| Year | Enrolments | Avg Ticket | Revenue (—,— Cr) |
|---|---|---|---|
| Y1 | 9,500 | —,—18,500 | 17.6 |
| Y2 | 33,000 | —,—19,400 | 64.0 |
| Y3 | 78,000 | —,—20,300 | 158.3 |

## 17.3 R2 — College Admission Partnerships

### 17.3.1 Mechanics

| Element | Detail |
|---|---|
| **Payer** | College |
| **Model A — Per admission** | Fee per confirmed and verified admission |
| **Model B — Annual retainer** | Fixed annual fee for unlimited leads within a defined programme scope |
| **Model C — Lead-based** | Per qualified lead delivered |
| **Verification** | Admission confirmed by both student and college; payment triggered post-confirmation |
| **Dispute window** | 15 days for the college to dispute attribution |

### 17.3.2 Pricing

| Programme Type | Per-Admission Fee | Annual Retainer (per programme) |
|---|---|---|
| Engineering (B.E./B.Tech) | —,—8,000 - —,—15,000 | —,—4,50,000 |
| Medical / Allied Health | —,—15,000 - —,—35,000 | —,—9,00,000 |
| Management (MBA/BBA) | —,—10,000 - —,—20,000 | —,—5,50,000 |
| Arts & Science | —,—3,000 - —,—6,000 | —,—1,80,000 |
| Law | —,—8,000 - —,—14,000 | —,—4,00,000 |
| Design / Architecture | —,—9,000 - —,—16,000 | —,—4,20,000 |
| Diploma / Polytechnic | —,—2,000 - —,—4,000 | —,—1,20,000 |

### 17.3.3 Economics

| Metric | Value |
|---|---|
| Average revenue per admission | —,—9,800 |
| Lead generation cost | 22% |
| Counsellor / operations cost | 12% |
| Channel commission | 12% |
| **Gross margin** | **54%** |

### 17.3.4 Projection

| Year | Admissions | Avg Fee | Revenue (—,— Cr) |
|---|---|---|---|
| Y1 | 12,000 | —,—9,800 | 11.8 |
| Y2 | 48,000 | —,—10,400 | 49.9 |
| Y3 | 1,40,000 | —,—11,000 | 154.0 |

> Note: R2 projections include retainer revenue and are moderated in the consolidated model in §17.15 to reflect ramp realism.

## 17.4 R3 — Study Abroad Services (V2)

### 17.4.1 Mechanics

| Element | Detail |
|---|---|
| **Payer** | Student (service fee) + University (commission) |
| **Service fee** | Charged for counselling, application management, SOP/LOR support, visa assistance |
| **University commission** | Percentage of first-year tuition, paid by the university on enrolment |
| **Transparency rule** | Both the student fee and the fact of university commission MUST be disclosed to the student |

### 17.4.2 Pricing

| Package | Scope | Student Fee |
|---|---|---|
| **Self-Guided** | Platform tools, university database, milestone tracker, document manager | Free |
| **Essential** | 5 university applications, SOP review, document checklist, visa guidance | —,—24,999 |
| **Premium** | 10 applications, SOP/LOR writing support, dedicated counsellor, visa filing support, interview prep | —,—59,999 |
| **Elite** | Unlimited applications, scholarship strategy, loan assistance, pre-departure and accommodation support | —,—1,24,999 |

| Commission Source | Rate |
|---|---|
| Partner university commission | 8-18% of first-year tuition |

### 17.4.3 Economics

| Metric | Value |
|---|---|
| Average total revenue per student | —,—1,15,000 |
| Counsellor cost | 26% |
| Operations and documentation | 9% |
| Channel commission | 10% |
| **Gross margin** | **55%** |

### 17.4.4 Projection

| Year | Students | Avg Revenue | Revenue (—,— Cr) |
|---|---|---|---|
| Y1 | — | — | 0 |
| Y2 | 900 | —,—1,10,000 | 9.9 |
| Y3 | 3,000 | —,—1,15,000 | 34.5 |

## 17.5 R4 — Skill Course Fees

### 17.5.1 Pricing

| Category | Duration | Price Range |
|---|---|---|
| Micro-course (single skill) | 2-4 weeks | —,—499 - —,—1,499 |
| Standard certification course | 6-10 weeks | —,—2,999 - —,—7,999 |
| Advanced / specialisation programme | 3-6 months | —,—9,999 - —,—24,999 |
| Career track bundle (multi-course) | 6-12 months | —,—19,999 - —,—49,999 |
| Corporate-endorsed certification | Varies | —,—12,999 - —,—34,999 |

### 17.5.2 Economics

| Metric | Value |
|---|---|
| Average ticket size | —,—4,200 |
| Content cost / partner revenue share | 38% |
| Platform delivery cost | 6% |
| Certification cost | 2% |
| Channel commission | 8% |
| **Gross margin** | **46%** |

### 17.5.3 Projection

| Year | Enrolments | Avg Ticket | Revenue (—,— Cr) |
|---|---|---|---|
| Y1 | 34,000 | —,—4,200 | 14.3 |
| Y2 | 1,45,000 | —,—4,500 | 65.3 |
| Y3 | 4,20,000 | —,—4,800 | 201.6 |

> Note: R4 projections are moderated in the consolidated model in §17.15.

## 17.6 R5 — Internship Facilitation

### 17.6.1 Mechanics

| Element | Detail |
|---|---|
| **Student side** | Free to apply; optional premium internship programmes with training and guaranteed placement attempt |
| **Company side** | Free basic postings for verified employers; paid featured postings and bulk hiring credits |
| **Guarantee programmes** | Paid programmes carry a defined refund guarantee if no internship is secured within the stated window |

### 17.6.2 Pricing

| Product | Payer | Price |
|---|---|---|
| Standard internship application | Student | Free |
| Guaranteed Internship Programme | Student | —,—7,999 (refundable per policy if unplaced in 90 days) |
| Internship + Training Bundle | Student | —,—12,999 |
| Basic internship posting | Company | Free (verified employers, up to 3 active) |
| Featured internship posting | Company | —,—2,999 per posting |
| Bulk internship hiring pack (10 postings) | Company | —,—19,999 |

### 17.6.3 Projection

| Year | Revenue (—,— Cr) |
|---|---|
| Y1 | 3.4 |
| Y2 | 12.8 |
| Y3 | 31.0 |

## 17.7 R6 — Live Project Fees (V2)

### 17.7.1 Mechanics

| Element | Detail |
|---|---|
| **Student side** | Enrolment fee for mentor-supervised participation |
| **Company side** | Sponsorship fee for posting a real project and receiving deliverables |
| **Mentor cost** | Paid per project cohort |

### 17.7.2 Pricing

| Product | Payer | Price |
|---|---|---|
| Individual project enrolment | Student | —,—3,999 - —,—8,999 |
| Project track (3 projects) | Student | —,—14,999 |
| Company project sponsorship | Company | —,—24,999 - —,—99,999 per project |
| Enterprise project programme (annual) | Company | —,—4,50,000+ |

### 17.7.3 Projection

| Year | Revenue (—,— Cr) |
|---|---|
| Y1 | 0 |
| Y2 | 8.2 |
| Y3 | 24.5 |

## 17.8 R7 — Recruitment Fees

### 17.8.1 Mechanics

| Element | Detail |
|---|---|
| **Model A — Pay per hire** | Fee charged on confirmed offer acceptance |
| **Model B — Job credits** | Prepaid credits consumed per posting |
| **Model C — Campus drive fee** | Per-drive fee for organised campus recruitment |
| **Trigger** | Offer acceptance confirmed by both parties on platform |
| **Replacement guarantee** | Free replacement if the hire exits within 60 days (fresher roles) |

### 17.8.2 Pricing

| Product | Price |
|---|---|
| Fresher hire (0-1 year experience) | —,—8,000 - —,—18,000 per hire |
| Experienced hire (1-5 years) | 6-8% of annual CTC |
| Job posting credit (single) | —,—3,999 |
| Job posting pack (10) | —,—29,999 |
| Campus drive (single college) | —,—24,999 |
| Multi-college virtual drive | —,—74,999 |
| Assessment add-on (per candidate) | —,—149 |
| Background verification (per candidate) | —,—899 |

### 17.8.3 Economics

| Metric | Value |
|---|---|
| Average revenue per hire | —,—12,400 |
| Sourcing and matching cost | 14% |
| Account management | 8% |
| **Gross margin** | **78%** |

### 17.8.4 Projection

| Year | Hires | Avg Fee | Revenue (—,— Cr) |
|---|---|---|---|
| Y1 | 5,000 | —,—12,400 | 6.2 |
| Y2 | 25,000 | —,—13,200 | 33.0 |
| Y3 | 80,000 | —,—14,000 | 112.0 |

## 17.9 R8 — Payroll SaaS (V2)

### 17.9.1 Pricing

| Tier | Employee Range | Price (per employee per month) | Minimum Monthly |
|---|---|---|---|
| Starter | 1-25 | —,—49 | —,—999 |
| Growth | 26-100 | —,—39 | —,—1,999 |
| Business | 101-500 | —,—32 | —,—4,999 |
| Enterprise | 500+ | —,—25 (negotiated) | —,—15,000 |

| Add-On | Price |
|---|---|
| Statutory filing assistance | —,—1,999/month |
| Expense management | —,—15/employee/month |
| Advanced HR analytics | —,—2,999/month |
| Multi-entity support | —,—4,999/month |

**Bundling incentive:** Companies purchasing an annual hiring package receive the first 6 months of Payroll Starter free — designed to drive payroll adoption using hiring as the wedge.

### 17.9.2 Economics

| Metric | Value |
|---|---|
| Average revenue per company per month | —,—4,600 |
| Infrastructure and compliance cost | 18% |
| Support cost | 12% |
| **Gross margin** | **70%** |

### 17.9.3 Projection

| Year | Companies | ARPA (annual) | Revenue (—,— Cr) |
|---|---|---|---|
| Y1 | — | — | 0 |
| Y2 | 420 | —,—52,000 | 2.2 |
| Y3 | 1,500 | —,—58,000 | 8.7 |

## 17.10 R9 — Student Premium Membership

### 17.10.1 Tiers

| Tier | Monthly | Annual | Benefits |
|---|---|---|---|
| **Free** | —,—0 | —,—0 | Career assessment, profile, browse all opportunities, 3 applications/month, basic AI assistant (10 queries/month), free content samples |
| **Plus** | —,—199 | —,—1,799 | Unlimited applications, unlimited AI assistant, AI resume builder, 2 AI mock interviews/month, priority support, ad-free, 5% course discount |
| **Pro** | —,—499 | —,—4,499 | All Plus + profile boost in employer search, unlimited mock interviews, 1 mentor session/month, advanced analytics, early access to opportunities, 10% course discount |
| **Elite** | —,—999 | —,—8,999 | All Pro + dedicated career counsellor, guaranteed interview opportunities, portfolio review, 4 mentor sessions/month, 15% course discount, priority placement consideration |

### 17.10.2 Economics

| Metric | Value |
|---|---|
| Blended ARPU (annual) | —,—2,600 |
| Delivery cost (AI, mentor, support) | 24% |
| **Gross margin** | **76%** |

### 17.10.3 Projection

| Year | Subscribers | ARPU | Revenue (—,— Cr) |
|---|---|---|---|
| Y1 | 14,000 | —,—2,400 | 3.4 |
| Y2 | 78,000 | —,—2,600 | 20.3 |
| Y3 | 2,40,000 | —,—2,800 | 67.2 |

## 17.11 R10 — Company Hiring Packages

### 17.11.1 Tiers

| Package | Annual Price | Includes |
|---|---|---|
| **Startup** | —,—49,999 | 10 job postings, 5 hires included, basic ATS, 50 assessments |
| **Growth** | —,—1,99,999 | 40 postings, 25 hires, full ATS, 300 assessments, 2 campus drives, 6 months free payroll |
| **Business** | —,—5,99,999 | 150 postings, 100 hires, full ATS, unlimited assessments, 8 campus drives, 12 months free payroll, dedicated account manager |
| **Enterprise** | —,—15,00,000+ | Unlimited postings, negotiated hire volume, API access, custom workflows, SLA, dedicated team |

### 17.11.2 Projection

| Year | Companies | Avg Package | Revenue (—,— Cr) |
|---|---|---|---|
| Y1 | 180 | —,—1,15,000 | 2.1 |
| Y2 | 900 | —,—1,45,000 | 13.1 |
| Y3 | 3,000 | —,—1,80,000 | 54.0 |

## 17.12 R11 — Institutional SaaS Subscription

### 17.12.1 College Pricing

| Tier | Student Range | Annual Price | Includes |
|---|---|---|---|
| Essential | Up to 500 | —,—60,000 | Admission leads, basic placement module, standard analytics |
| Standard | 501-2,000 | —,—1,80,000 | + Placement drive automation, advanced analytics, accreditation reports |
| Advanced | 2,001-5,000 | —,—4,20,000 | + Multi-department, faculty accounts, co-branding, API |
| University | 5,000+ | —,—9,00,000+ | + Multi-campus, custom workflows, dedicated success manager |

### 17.12.2 Training Institute Pricing

| Tier | Annual Price | Revenue Share to Institute |
|---|---|---|
| Partner (free) | —,—0 | 60% |
| Professional | —,—36,000 | 68% |
| Premium | —,—1,20,000 | 75% |

### 17.12.3 Projection

| Year | Institutions | Avg Fee | Revenue (—,— Cr) |
|---|---|---|---|
| Y1 | 400 | —,—92,000 | 3.7 |
| Y2 | 1,200 | —,—1,10,000 | 13.2 |
| Y3 | 3,000 | —,—1,30,000 | 39.0 |

## 17.13 R12 — Channel Partner Commission Structure

Channel partners are a **cost line** that generates volume. The structure below is what the platform pays out.

### 17.13.1 Commission Rates by Product

| Product | Bronze | Silver | Gold | Platinum |
|---|---|---|---|---|
| Coaching enrolment | 8% | 10% | 12% | 15% |
| Skill course | 10% | 12% | 15% | 18% |
| College admission | —,—1,500/admission | —,—2,000 | —,—2,800 | —,—3,500 |
| Study abroad | 8% | 10% | 12% | 15% |
| Premium membership | 15% | 18% | 20% | 25% |
| Internship programme | 10% | 12% | 15% | 18% |
| Company hiring package | 5% | 6% | 8% | 10% |
| Institutional SaaS | 6% | 8% | 10% | 12% |

### 17.13.2 Tier Qualification

| Tier | Qualification (rolling 3 months) | Additional Benefits |
|---|---|---|
| Bronze | Default on approval | Standard collateral, monthly payout |
| Silver | —— —,—1,00,000 GMV | Bi-weekly payout, priority support |
| Gold | —— —,—5,00,000 GMV | Weekly payout, co-branded collateral, quarterly bonus |
| Platinum | —— —,—15,00,000 GMV | Weekly payout, territory rights, annual bonus, dedicated manager |

### 17.13.3 Payout Rules

| Rule | Detail |
|---|---|
| Attribution window | 60 days from first referred click/registration |
| Attribution model | Last-touch referral code, immutable ledger entry |
| Commission accrual | On confirmed payment, after refund window closes |
| Hold period | 15 days post refund-window closure |
| Payout SLA | Within 5 business days of payout request, per tier frequency |
| Clawback | Commission reversed on refund or fraud finding |
| Minimum payout | —,—500 |

### 17.13.4 Cost Projection

| Year | Partner-Sourced GMV (—,— Cr) | Commission Payout (—,— Cr) | % of Revenue |
|---|---|---|---|
| Y1 | 9.0 | 0.95 | 3.2% |
| Y2 | 40.0 | 4.30 | 3.7% |
| Y3 | 118.0 | 12.80 | 4.0% |

## 17.14 R13 — Advertising and Sponsorship (V3)

| Product | Price Model | Target Advertiser |
|---|---|---|
| Sponsored college listing | —,—15,000 - —,—75,000/month | Colleges |
| Sponsored course placement | —,—10,000 - —,—40,000/month | Training institutes |
| Employer brand page | —,—50,000 - —,—2,00,000/year | Companies |
| Exam-track sponsorship | —,—1,00,000 - —,—5,00,000/year | Publishers, brands |
| Newsletter sponsorship | —,—25,000 per edition | Any |
| Career fair sponsorship | —,—1,00,000 - —,—10,00,000 | Enterprises |

**Guardrail:** Sponsored content MUST be visually and textually labelled as sponsored, MUST NOT displace organically-ranked results above the fold, and MUST NOT be shown to users under 18 in personalised form.

| Year | Revenue (—,— Cr) |
|---|---|
| Y3 | 6.0 |

## 17.15 Consolidated Revenue Projection

The following is the moderated, planning-grade consolidated model. Individual stream projections above represent stream-level potential; the consolidated figures apply ramp-realism discounts.

| Stream | Y1 (—,— Cr) | Y2 (—,— Cr) | Y3 (—,— Cr) | Y3 Mix |
|---|---|---|---|---|
| R1 Coaching | 8.8 | 30.5 | 82.0 | 25.6% |
| R2 College admissions | 4.2 | 15.0 | 38.0 | 11.9% |
| R3 Study abroad | 0.0 | 9.9 | 34.5 | 10.8% |
| R4 Skill courses | 5.6 | 22.0 | 48.0 | 15.0% |
| R5 Internships | 1.4 | 5.2 | 11.0 | 3.4% |
| R6 Live projects | 0.0 | 3.4 | 7.0 | 2.2% |
| R7 Recruitment | 3.1 | 14.0 | 32.0 | 10.0% |
| R8 Payroll SaaS | 0.0 | 2.2 | 8.7 | 2.7% |
| R9 Premium membership | 2.0 | 9.0 | 22.0 | 6.9% |
| R10 Hiring packages | 2.1 | 8.6 | 20.0 | 6.3% |
| R11 Institutional SaaS | 2.8 | 8.2 | 16.8 | 5.2% |
| R13 Advertising | 0.0 | 0.0 | 6.0 | 1.9% |
| **Total Revenue** | **30.0** | **128.0** | **326.0** | **100%** |
| Less: Channel commissions | (0.95) | (4.30) | (12.80) | |
| **Net Revenue** | **29.05** | **123.70** | **313.20** | |

### 17.15.1 Revenue Concentration Check

| Year | Largest Stream | Share | Guardrail (< 35%) |
|---|---|---|---|
| Y1 | R1 Coaching | 29.3% | Pass |
| Y2 | R1 Coaching | 23.8% | Pass |
| Y3 | R1 Coaching | 25.2% | Pass |

### 17.15.2 Recurring vs. Transactional Mix

| Year | Recurring (—,— Cr) | Transactional (—,— Cr) | Recurring % |
|---|---|---|---|
| Y1 | 6.9 | 23.1 | 23% |
| Y2 | 28.0 | 100.0 | 22% |
| Y3 | 67.5 | 258.5 | 21% |

> **Strategic note:** Recurring share is intentionally held around 21-23% in the first three years because transactional education revenue has higher absolute ticket sizes. From Year 4 onward, Payroll SaaS and Premium Membership are expected to drive recurring share above 30%.

## 17.16 Billing and Financial Capabilities Required

| Capability | Description | Version |
|---|---|---|
| One-time payment | Card, UPI, netbanking, wallet via Razorpay | V1 |
| International payment | Cards and international methods via Stripe | V1 |
| EMI | No-cost and standard EMI on eligible tickets | V1 |
| Subscription billing | Recurring mandates, renewal, dunning, cancellation | V1 |
| Invoicing | GST-compliant invoices with sequential numbering | V1 |
| Refunds | Full and partial refunds with policy engine | V1 |
| Wallet ledger | Double-entry ledger for credits, debits, holds | V1 |
| Coupon engine | Percentage, flat, first-purchase, referral, campaign codes | V1 |
| Commission engine | Automatic accrual, hold, clawback, payout | V1 |
| Revenue share | Training institute settlement calculation | V1 |
| Payout processing | Bank transfer with reconciliation | V1 |
| Revenue recognition | Deferred revenue schedules for multi-month products | V2 |
| Multi-currency | Currency selection, conversion, settlement | V2 (Study Abroad), V3 (global) |
| Tax computation | GST, TDS on commissions | V1 |
| Dunning management | Failed payment retry, grace periods, suspension | V2 |
| Financial reporting | Revenue, deferred revenue, receivables, reconciliation | V1 basic, V2 advanced |

## 17.17 Revenue Model Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Coaching price compression | Revenue and margin erosion | Bundle career guidance + placement prep to defend price; shift mix toward courses and B2B |
| Low free-to-paid conversion | Revenue shortfall | Improve activation; test pricing tiers; strengthen paywall value |
| Admission commission disputes | Revenue leakage and relationship damage | Strong attribution ledger and dual-confirmation workflow |
| Refund rate above model | Margin erosion | Improve pre-purchase clarity; monitor per-product refund rates weekly |
| Payroll adoption slower than modelled | Recurring revenue shortfall | Bundle free payroll with hiring packages to accelerate adoption |
| Channel commission cost above model | Margin erosion | Tier discipline; monitor commission as % of revenue against 4% ceiling |
| Concentration in a single state | Revenue fragility | Geographic diversification per Chapter 9 phasing |

---

# Chapter 18 — User Roles

> **Purpose of this chapter:** To define every role in the system, its permission scope, its lifecycle, the role-based access control model, and the exact capabilities granted and denied — so that engineering can implement authorisation without ambiguity and QA can test it exhaustively.

## 18.1 Role Inventory

| # | Role Code | Role Name | Type | Tenant-Scoped | V1 |
|---|---|---|---|---|---|
| 1 | `STUDENT` | Student | Individual | No | Yes |
| 2 | `COLLEGE_ADMIN` | College Administrator | Institutional | Yes (College) | Yes |
| 3 | `COLLEGE_STAFF` | College Staff (TPO / Faculty / Counsellor) | Institutional | Yes (College) | Yes |
| 4 | `COMPANY_ADMIN` | Company Administrator | Enterprise | Yes (Company) | Yes |
| 5 | `HR_RECRUITER` | HR Recruiter | Enterprise | Yes (Company) | Yes |
| 6 | `HR_PAYROLL` | Payroll Manager | Enterprise | Yes (Company) | V2 |
| 7 | `HIRING_MANAGER` | Hiring Manager | Enterprise | Yes (Company) | V2 |
| 8 | `TRAINING_ADMIN` | Training Institute Administrator | Institutional | Yes (Institute) | V2 |
| 9 | `TRAINER` | Trainer / Faculty | Institutional | Yes (Institute) | V2 |
| 10 | `MENTOR` | Project / Career Mentor | Individual contractor | Partially | V2 |
| 11 | `CHANNEL_PARTNER` | Channel Partner | Distributor | Yes (Partner) | V2 |
| 12 | `SUB_PARTNER` | Sub-Partner | Distributor | Yes (Parent Partner) | V3 |
| 13 | `COUNSELLOR` | Ellowring Counsellor (Career / Abroad) | Internal | No | V2 |
| 14 | `SUPPORT_AGENT` | Support Agent | Internal | No | V1 |
| 15 | `OPS_EXECUTIVE` | Operations Executive (Verification/Moderation) | Internal | No | V1 |
| 16 | `FINANCE_ADMIN` | Finance Administrator | Internal | No | V1 |
| 17 | `CONTENT_ADMIN` | Content Administrator | Internal | No | V1 |
| 18 | `SUPER_ADMIN` | Super Administrator | Internal | No | Yes |
| 19 | `PARENT` | Parent / Guardian (linked view) | Individual | Linked to Student | V2 |
| 20 | `EMPLOYEE` | Payroll Employee (self-service) | Enterprise | Yes (Company) | V2 |

## 18.2 Role Hierarchy

```

SUPER_ADMIN
| o | ? | ? FINANCE_ADMIN
| o | ? | ? OPS_EXECUTIVE
| o | ? | ? CONTENT_ADMIN
| o | ? | ? SUPPORT_AGENT
| " | ? | ? COUNSELLOR

COLLEGE_ADMIN (tenant owner)
| " | ? | ? COLLEGE_STAFF

COMPANY_ADMIN (tenant owner)
| o | ? | ? HR_RECRUITER
| o | ? | ? HIRING_MANAGER
| o | ? | ? HR_PAYROLL
| " | ? | ? EMPLOYEE

TRAINING_ADMIN (tenant owner)
| " | ? | ? TRAINER

CHANNEL_PARTNER (tenant owner)
| " | ? | ? SUB_PARTNER

STUDENT (standalone)
| " | ? | ? PARENT (linked, read-only)

MENTOR (standalone contractor)

```

## 18.3 Role Definitions in Detail

### 18.3.1 STUDENT

| Attribute | Detail |
|---|---|
| **Definition** | Any individual learner from Class 11 through early career |
| **Registration** | Self-service, free |
| **Verification** | Email/mobile verification mandatory; academic verification optional (boosts profile trust score) |
| **Tenant** | None (may be *associated* with a college) |
| **Sub-states** | `SCHOOL` (Class 11/12), `COLLEGE` (UG/PG), `GRADUATE`, `EMPLOYED` |
| **Lifecycle** | Register —' Verify —' Onboard —' Active —' (Dormant) —' (Deactivated / Deleted) |

**Capabilities**

| Capability | Allowed |
|---|---|
| Complete career assessment | Yes |
| Enrol in coaching batches and courses | Yes |
| Take mock tests and assessments | Yes |
| Browse and apply to colleges, internships, projects, jobs | Yes |
| Manage own profile, documents and consent | Yes |
| Use AI Career Assistant | Yes (quota by tier) |
| Manage wallet, apply coupons, make payments | Yes |
| Download own certificates | Yes |
| View own analytics | Yes |
| Refer others and earn credits | Yes |
| View other students' personal data | **No** |
| Post jobs, internships or courses | **No** |
| Access institutional dashboards | **No** |

### 18.3.2 COLLEGE_ADMIN

| Attribute | Detail |
|---|---|
| **Definition** | Primary owner of a college tenant account |
| **Registration** | Applied for; requires institutional verification |
| **Verification** | Registration certificate, affiliation/accreditation proof, authorised signatory ID, address proof |
| **Verification SLA** | 3 business days |

**Capabilities**

| Capability | Allowed |
|---|---|
| Manage college profile and programme listings | Yes |
| Invite and manage `COLLEGE_STAFF` | Yes |
| Bulk import and manage student records | Yes |
| View consented student profiles of own college | Yes |
| Create and manage placement drives | Yes |
| Invite companies to campus drives | Yes |
| Manage admission leads and applications | Yes |
| Access college analytics and reports | Yes |
| Manage subscription and billing | Yes |
| View students from other colleges | **No** |
| Modify student academic records without student confirmation | **No** |
| Access company payroll data | **No** |

### 18.3.3 COLLEGE_STAFF

Scoped subset of `COLLEGE_ADMIN`, with department-level or function-level restriction.

| Sub-Function | Additional Scope |
|---|---|
| Training & Placement Officer | Full placement module; drive creation; employer communication |
| Admission Counsellor | Admission leads and applications only |
| Faculty | Assigned department students; academic progress view only |
| Department Head | All students in own department |

**Denied:** Billing management, staff invitation, tenant-level configuration.

### 18.3.4 COMPANY_ADMIN

| Attribute | Detail |
|---|---|
| **Definition** | Primary owner of a company tenant account |
| **Verification** | Company registration (CIN/GSTIN/Udyam), authorised signatory ID, business address proof, official domain email |
| **Verification SLA** | 2 business days |

**Capabilities**

| Capability | Allowed |
|---|---|
| Manage company profile and employer brand page | Yes |
| Invite and manage `HR_RECRUITER`, `HIRING_MANAGER`, `HR_PAYROLL` | Yes |
| Post jobs, internships and live projects | Yes |
| Access full ATS pipeline | Yes |
| View consented candidate profiles | Yes |
| Manage offers | Yes |
| Manage payroll (V2) | Yes |
| Manage subscription and billing | Yes |
| Access hiring analytics | Yes |
| Contact candidates who have not applied | Only for candidates with search-visibility consent |
| View another company's data | **No** |
| Access college internal analytics | **No** |

### 18.3.5 HR_RECRUITER

| Capability | Allowed |
|---|---|
| Post and manage own job/internship listings | Yes |
| Screen, shortlist, reject applications | Yes |
| Schedule interviews | Yes |
| Send assessments | Yes |
| Recommend offers | Yes |
| **Approve** offers | No (requires `COMPANY_ADMIN` or `HIRING_MANAGER`) |
| Access payroll | **No** |
| Manage billing | **No** |

### 18.3.6 HIRING_MANAGER (V2)

| Capability | Allowed |
|---|---|
| View pipeline for own requisitions | Yes |
| Provide interview feedback | Yes |
| Approve/reject candidates | Yes |
| Approve offers within approval limit | Yes |
| Post jobs | Configurable |
| Access payroll | **No** |

### 18.3.7 HR_PAYROLL (V2)

| Capability | Allowed |
|---|---|
| Onboard employees | Yes |
| Configure salary structures | Yes |
| Manage attendance and leave | Yes |
| Execute payroll runs | Yes |
| Generate payslips and statutory reports | Yes |
| Access hiring pipeline | Read-only for onboarding purposes |
| Post jobs | **No** |

### 18.3.8 TRAINING_ADMIN (V2)

| Capability | Allowed |
|---|---|
| Manage institute profile | Yes |
| Invite and manage `TRAINER` | Yes |
| Create batches and courses | Yes |
| Upload content | Yes |
| Create assessments | Yes |
| Issue certificates (platform-countersigned) | Yes |
| View enrolment and revenue analytics | Yes |
| Request payouts | Yes |
| Access student data beyond enrolled students | **No** |
| Set platform-wide pricing | **No** (proposes; platform approves) |

### 18.3.9 TRAINER (V2)

| Capability | Allowed |
|---|---|
| Conduct live classes for assigned batches | Yes |
| Upload content to assigned batches | Yes |
| Answer doubts | Yes |
| Grade assessments and assignments | Yes |
| View student progress in assigned batches | Yes |
| Manage billing or payouts | **No** |
| Create new batches | **No** |

### 18.3.10 MENTOR (V2)

| Capability | Allowed |
|---|---|
| Manage assigned live project teams | Yes |
| Review deliverables and provide feedback | Yes |
| Grade project outcomes | Yes |
| Conduct mentor sessions | Yes |
| View assigned students' relevant profile sections | Yes |
| Access unassigned students | **No** |

### 18.3.11 CHANNEL_PARTNER (V2)

| Capability | Allowed |
|---|---|
| Generate and manage referral codes/links | Yes |
| View own leads and conversions | Yes |
| View own earnings and commission ledger | Yes |
| Request payouts | Yes |
| Download marketing collateral | Yes |
| Manage sub-partners (V3) | Yes |
| View student personal data | **No** (only lead status, masked contact) |
| Access platform pricing configuration | **No** |
| Represent themselves as Ellowring employees | **No** (contractual prohibition; enforced by code of conduct) |

### 18.3.12 Internal Administrative Roles

| Role | Primary Scope | Key Denials |
|---|---|---|
| `SUPPORT_AGENT` | View user accounts, impersonate with consent-logged session, resolve tickets | Cannot modify financial records; cannot delete data |
| `OPS_EXECUTIVE` | Verification queues, content moderation, listing approval/rejection | Cannot process payouts; cannot change RBAC |
| `FINANCE_ADMIN` | Payouts, refunds, reconciliation, invoices, revenue reports | Cannot modify content; cannot verify institutions |
| `CONTENT_ADMIN` | Course/exam content, question banks, CMS pages | Cannot access financial or personal data beyond need |
| `COUNSELLOR` | Assigned students' career/abroad casework | Cannot access unassigned students |
| `SUPER_ADMIN` | All capabilities including RBAC and configuration | Actions fully audit-logged; dual approval for destructive operations |

### 18.3.13 PARENT (V2)

| Capability | Allowed |
|---|---|
| View linked student's progress summary | Yes (with student consent) |
| View linked student's attendance and test scores | Yes (with consent) |
| View and pay invoices | Yes |
| Receive notifications | Yes |
| Message faculty | Configurable |
| Modify student profile | **No** |
| Access student's private AI conversations | **No** |

### 18.3.14 EMPLOYEE (V2)

| Capability | Allowed |
|---|---|
| View own payslips and tax documents | Yes |
| Apply for leave | Yes |
| Mark attendance | Yes |
| Update own bank and tax declaration details | Yes |
| Submit reimbursement claims | Yes |
| View others' salary data | **No** |

## 18.4 RBAC Model

### 18.4.1 Model Structure

| Concept | Description |
|---|---|
| **User** | An authenticated identity |
| **Role** | A named set of permissions |
| **Permission** | A `resource:action` pair (e.g., `job:create`, `student:read`) |
| **Scope** | The boundary within which the permission applies (`self`, `tenant`, `assigned`, `global`) |
| **Role Assignment** | A user-role-tenant triple; a user MAY hold multiple role assignments |
| **Policy** | Additional conditional rules (e.g., approval limits, consent requirements) |

### 18.4.2 Permission Naming Convention

`<domain>:<resource>:<action>`

Examples: `hiring:job:create`, `hiring:application:shortlist`, `payroll:run:execute`, `admin:verification:approve`, `student:profile:read`.

### 18.4.3 Scope Semantics

| Scope | Meaning | Example |
|---|---|---|
| `self` | Only the user's own records | Student reading their own profile |
| `assigned` | Only records explicitly assigned to the user | Mentor reading assigned project team |
| `tenant` | All records within the user's tenant | College admin reading own college's students |
| `global` | All records platform-wide | Super admin |

### 18.4.4 Permission Matrix (Representative Extract)

| Permission | STUDENT | COLLEGE_ADMIN | HR_RECRUITER | TRAINING_ADMIN | CHANNEL_PARTNER | OPS_EXECUTIVE | SUPER_ADMIN |
|---|---|---|---|---|---|---|---|
| `student:profile:read` | self | tenant* | applicant-only* | enrolled-only* | — | global | global |
| `student:profile:write` | self | — | — | — | — | — | global |
| `coaching:batch:create` | — | — | — | tenant | — | — | global |
| `coaching:batch:enrol` | self | — | — | — | — | — | global |
| `college:programme:write` | — | tenant | — | — | — | — | global |
| `hiring:job:create` | — | — | tenant | — | — | — | global |
| `hiring:application:read` | self | tenant (own students) | tenant | — | — | global | global |
| `hiring:offer:approve` | — | — | — | — | — | — | global |
| `payroll:run:execute` | — | — | — | — | — | — | global |
| `wallet:balance:read` | self | tenant | tenant | tenant | self | global | global |
| `wallet:payout:approve` | — | — | — | — | — | — | global (FINANCE_ADMIN) |
| `admin:verification:approve` | — | — | — | — | — | global | global |
| `admin:rbac:write` | — | — | — | — | — | — | global |
| `analytics:tenant:read` | — | tenant | tenant | tenant | self | global | global |

\* Subject to student consent.

### 18.4.5 Consent Gates

Certain reads require explicit student consent in addition to role permission.

| Data | Consent Required From Student | Default |
|---|---|---|
| Full profile visible to employers in search | Yes | Off |
| Academic records visible to own college | Yes | On (at bulk import, student can revoke) |
| Contact details visible to employer | Yes, on application | Granted implicitly by applying |
| Profile visible to channel partner | Never granted | Permanently off |
| Progress visible to parent | Yes | Off |
| Data used for AI personalisation | Yes | On (revocable) |
| Data used for anonymised benchmarking | Yes | On (revocable) |

### 18.4.6 Role Transition Rules

| Transition | Trigger | Effect |
|---|---|---|
| Student `SCHOOL` —' `COLLEGE` | Student updates academic stage or joins a college via admission | Dashboard modules change; college association created |
| Student `COLLEGE` —' `GRADUATE` | Graduation date reached or student declares | Placement modules prioritised; alumni status on college |
| Student —' `EMPLOYEE` | Offer accepted and employer onboards them into payroll | `EMPLOYEE` role added; `STUDENT` role retained |
| `HR_RECRUITER` —' `COMPANY_ADMIN` | Promoted by existing admin | Elevated permissions; audit-logged |
| Any institutional role —' deactivated | Staff exit | Access revoked immediately; records retained with attribution |
| `CHANNEL_PARTNER` —' suspended | Code-of-conduct violation | Referral links disabled; pending commissions held pending review |

## 18.5 Multi-Role Users

A single identity MAY hold multiple roles. Examples:

| Scenario | Roles Held |
|---|---|
| A student who becomes an employee at a client company | `STUDENT` + `EMPLOYEE` |
| A college faculty member who is also an approved channel partner | `COLLEGE_STAFF` + `CHANNEL_PARTNER` |
| A trainer who also mentors live projects | `TRAINER` + `MENTOR` |
| A company admin who is also a student pursuing a course | `COMPANY_ADMIN` + `STUDENT` |

**Requirement `FR-RBAC-011`:** The application MUST provide a role/context switcher in the top navigation when a user holds more than one role. The active context MUST be visually indicated at all times and MUST be included in every audit log entry.

## 18.6 Authentication Requirements

| ID | Requirement |
|---|---|
| `FR-AUTH-001` | The system MUST support email + password registration with a minimum 8-character password including at least one letter and one number. |
| `FR-AUTH-002` | The system MUST support Google OAuth 2.0 sign-in. |
| `FR-AUTH-003` | The system MUST support mobile number + OTP sign-in with a 6-digit OTP valid for 10 minutes. |
| `FR-AUTH-004` | The system MUST issue a short-lived JWT access token (15 minutes) and a rotating refresh token (30 days). |
| `FR-AUTH-005` | The system MUST enforce email or mobile verification before granting access to paid features. |
| `FR-AUTH-006` | The system MUST support password reset via a time-limited, single-use link (30 minutes). |
| `FR-AUTH-007` | The system MUST rate-limit authentication attempts to 5 failures per identifier per 15 minutes, followed by exponential backoff. |
| `FR-AUTH-008` | The system MUST support two-factor authentication for all institutional and administrative roles (mandatory for `SUPER_ADMIN` and `FINANCE_ADMIN`). |
| `FR-AUTH-009` | The system MUST maintain an active-session list per user with the ability to revoke individual sessions. |
| `FR-AUTH-010` | The system MUST log all authentication events (success, failure, logout, token refresh, MFA challenge) with IP and user agent. |
| `FR-AUTH-011` | Support-initiated impersonation MUST require documented reason, MUST be time-limited to 60 minutes, MUST be visibly indicated in the UI, and MUST be fully audit-logged. |
| `FR-AUTH-012` | The system MUST invalidate all sessions on password change. |

**Acceptance Criteria (representative)**

| AC | Statement |
|---|---|
| AC-AUTH-01 | Given a new user with a valid email, when they register and verify, then they can log in and reach the student dashboard within 90 seconds of starting registration. |
| AC-AUTH-02 | Given 5 consecutive failed logins, when a 6th attempt is made within 15 minutes, then the request is rejected with a rate-limit response and no information about credential validity. |
| AC-AUTH-03 | Given a `SUPER_ADMIN` without MFA configured, when they attempt to log in, then they are forced into MFA enrolment before any privileged action is available. |
| AC-AUTH-04 | Given a support agent impersonating a student, when any page is rendered, then a persistent banner states the impersonation and the audit log contains the session record. |

## 18.7 Authorisation Requirements

| ID | Requirement |
|---|---|
| `FR-AUTHZ-001` | Every API endpoint MUST declare its required permission and scope; endpoints without a declaration MUST fail closed. |
| `FR-AUTHZ-002` | Every tenant-scoped query MUST be filtered by tenant at the data-access layer, not only at the controller layer. |
| `FR-AUTHZ-003` | Cross-tenant data access MUST be impossible via parameter manipulation; attempts MUST be logged as security events. |
| `FR-AUTHZ-004` | Consent-gated data MUST be filtered at the query level based on the current consent state. |
| `FR-AUTHZ-005` | All privileged administrative actions MUST be recorded in an append-only audit log with actor, action, target, before/after state, timestamp and IP. |
| `FR-AUTHZ-006` | Destructive operations (bulk delete, tenant deletion, payout batch release) MUST require dual approval by two distinct administrators. |

---

# Chapter 19 — Website Information Architecture

> **Purpose of this chapter:** To define the complete public-facing site structure, page-level content requirements, navigation model, SEO strategy and conversion design, so that design and frontend can build the marketing surface without further specification.

## 19.1 Public Site Objectives

| Objective | Measure |
|---|---|
| Communicate the integrated value proposition within 5 seconds | Bounce rate < 45% |
| Convert visitors into registered users | Visit —' registration —— 8% |
| Rank organically for exam, college and career queries | Organic traffic —— 45% of acquisition by Y2 |
| Establish institutional credibility | Partner logos, outcome statistics, verification messaging on every key page |
| Generate institutional leads | Partner enquiry form conversion —— 12% |

## 19.2 Top-Level Site Map

```

/ Home
| o | ? | ? /about About Ellowring
| o | ? | ? /coaching Coaching (hub)
| , | o | ? | ? /coaching/neet
| , | o | ? | ? /coaching/jee-main
| , | o | ? | ? /coaching/jee-advanced
| , | o | ? | ? /coaching/cuet
| , | o | ? | ? /coaching/upsc
| , | o | ? | ? /coaching/tnpsc
| , | o | ? | ? /coaching/ssc
| , | o | ? | ? /coaching/banking
| , | o | ? | ? /coaching/railway
| , | o | ? | ? /coaching/defence
| , | o | ? | ? /coaching/police
| , | o | ? | ? /coaching/tet
| , | o | ? | ? /coaching/trb
| , | o | ? | ? /coaching/placement-prep
| , | o | ? | ? /coaching/coding-prep
| , | o | ? | ? /coaching/communication
| , | " | ? | ? /coaching/interview-prep
| o | ? | ? /career-guidance Career Guidance
| , | o | ? | ? /career-guidance/assessment
| , | o | ? | ? /career-guidance/careers (career library index)
| , | " | ? | ? /career-guidance/careers/[slug]
| o | ? | ? /colleges Colleges (search + directory)
| , | o | ? | ? /colleges/[state]
| , | o | ? | ? /colleges/[state]/[city]
| , | o | ? | ? /colleges/[slug] (college profile)
| , | o | ? | ? /colleges/compare
| , | " | ? | ? /colleges/exams/[exam] (exam-to-college mapping)
| o | ? | ? /study-abroad Study Abroad
| , | o | ? | ? /study-abroad/[country]
| , | o | ? | ? /study-abroad/universities
| , | o | ? | ? /study-abroad/universities/[slug]
| , | o | ? | ? /study-abroad/cost-calculator
| , | " | ? | ? /study-abroad/scholarships
| o | ? | ? /courses Courses (catalogue)
| , | o | ? | ? /courses/[category]
| , | o | ? | ? /courses/[slug]
| , | " | ? | ? /courses/tracks/[slug] (career track bundles)
| o | ? | ? /internships Internships
| , | o | ? | ? /internships/[category]
| , | o | ? | ? /internships/[location]
| , | " | ? | ? /internships/[slug]
| o | ? | ? /projects Live Projects
| , | o | ? | ? /projects/[category]
| , | " | ? | ? /projects/[slug]
| o | ? | ? /jobs Jobs
| , | o | ? | ? /jobs/[category]
| , | o | ? | ? /jobs/[location]
| , | o | ? | ? /jobs/companies/[slug]
| , | " | ? | ? /jobs/[slug]
| o | ? | ? /partner-with-us Partner With Us (hub)
| , | o | ? | ? /partner-with-us/colleges
| , | o | ? | ? /partner-with-us/companies
| , | o | ? | ? /partner-with-us/training-institutes
| , | " | ? | ? /partner-with-us/channel-partners
| o | ? | ? /contact Contact
| o | ? | ? /pricing Pricing
| o | ? | ? /success-stories Success Stories
| o | ? | ? /blog Blog / Resources
| , | o | ? | ? /blog/[category]
| , | " | ? | ? /blog/[slug]
| o | ? | ? /verify Certificate Verification (public)
| o | ? | ? /login
| o | ? | ? /register
| o | ? | ? /forgot-password
| " | ? | ? Legal
| o | ? | ? /terms
| o | ? | ? /privacy
| o | ? | ? /refund-policy
| o | ? | ? /cookie-policy
| " | ? | ? /grievance-redressal

```

## 19.3 Global Navigation

### 19.3.1 Primary Header Navigation (Desktop)

| Position | Item | Type | Contents |
|---|---|---|---|
| 1 | **Logo** | Link | —' `/` |
| 2 | **Coaching** | Mega-menu | Three columns: School Exams (NEET, JEE Main, JEE Advanced, CUET) · Government Exams (UPSC, TNPSC, SSC, Banking, Railway, Defence, Police, TET, TRB) · Career Skills (Placement Prep, Coding Prep, Communication, Interview Prep) |
| 3 | **Career** | Dropdown | Career Guidance · Career Assessment · Career Library · AI Career Assistant |
| 4 | **Colleges** | Dropdown | Search Colleges · Compare Colleges · Colleges by Exam · Admission Guidance |
| 5 | **Study Abroad** | Dropdown | Countries · Universities · Cost Calculator · Scholarships · Visa Guidance |
| 6 | **Courses** | Mega-menu | By category (Technology, Data, Business, Design, Finance, Healthcare, Communication) · Career Tracks · Certifications |
| 7 | **Opportunities** | Dropdown | Internships · Live Projects · Jobs · Campus Drives |
| 8 | **Partner With Us** | Dropdown | For Colleges · For Companies · For Training Institutes · For Channel Partners |
| 9 | **Search** | Icon | Global search overlay |
| 10 | **Login** | Button (secondary) | —' `/login` |
| 11 | **Get Started Free** | Button (primary) | —' `/register` |

### 19.3.2 Mobile Navigation

| Element | Behaviour |
|---|---|
| Header | Logo · Search icon · Hamburger |
| Drawer | Accordion sections mirroring desktop menu; Login and Get Started pinned at bottom |
| Sticky bottom bar | "Get Started Free" CTA persists on scroll on all marketing pages |

### 19.3.3 Footer Structure

| Column 1 — Product | Column 2 — For Students | Column 3 — For Partners | Column 4 — Company |
|---|---|---|---|
| Coaching | Career Guidance | For Colleges | About Us |
| Courses | Career Assessment | For Companies | Careers at Ellowring |
| Colleges | Scholarships | For Training Institutes | Contact |
| Study Abroad | Success Stories | For Channel Partners | Blog |
| Internships | Student Pricing | Partner Login | Press |
| Live Projects | Verify Certificate | Partner Resources | Grievance Redressal |
| Jobs | Help Centre | | Terms · Privacy · Refunds |

**Footer bottom bar:** Company legal name, copyright, social links, "Made in India" mark, trust badges (payment security, data protection, verified-partner count).

## 19.4 Page Specifications

### 19.4.1 Home — `/`

| Section | Content Requirement | Conversion Element |
|---|---|---|
| **1. Hero** | Headline: "From 11th Standard to First Job — Everything in One Platform." Sub-headline stating the six-stage path. Background: subtle animated path graphic. | Primary CTA "Start Free Career Assessment"; Secondary CTA "Explore Coaching" |
| **2. Trust strip** | Live counters: students, partner colleges, hiring companies, placements facilitated, certificates issued | — |
| **3. The Path** | Visual eight-stage journey (Class 11 —' First Job) with a one-line description and link per stage | Stage-level CTAs |
| **4. Modules grid** | 12 module cards (Coaching, Career Guidance, Colleges, Study Abroad, Courses, Internships, Projects, Jobs, AI Assistant, Certificates, Wallet, Placements) | Each card links to its hub |
| **5. Exam catalogue** | All 18 exam tracks as chips with aspirant counts | Links to exam landing pages |
| **6. AI Career Assistant** | Demonstration of a real assistant exchange; explanation of explainability | "Try the AI Assistant" CTA |
| **7. Outcomes** | Placement statistics, admission counts, top hiring partners, salary ranges | "See Success Stories" |
| **8. Success stories** | 6 student cards with photo, name, college, outcome, module path used | Carousel; link to full stories |
| **9. For institutions** | Three cards (Colleges, Companies, Training Institutes) with value bullets | "Partner With Us" CTAs |
| **10. Why Ellowring** | 6 differentiators with icons: Verified only · One profile · AI-powered · Transparent pricing · Outcome-focused · Tier 2/3 accessible | — |
| **11. Pricing preview** | Free tier vs. Premium comparison summary | "See Full Pricing" |
| **12. FAQ** | 8 highest-intent questions with schema markup | — |
| **13. Final CTA** | Registration prompt with value restatement | "Get Started Free" |
| **14. Trust footer** | Payment security, data protection, verification, grievance contact | — |

**Performance requirement:** LCP < 2.0s, CLS < 0.1, TBT < 200ms on 4G mid-tier Android.

### 19.4.2 About — `/about`

| Section | Content |
|---|---|
| Mission and vision | Full statements with context |
| The problem we solve | Condensed Chapter 7 narrative with statistics |
| Our approach | The six-actor ecosystem explained visually |
| Verification commitment | How we verify institutions and employers |
| Leadership | Founder and leadership profiles |
| Values | The six core values |
| Impact numbers | Cumulative outcomes |
| Careers | Link to open roles |

### 19.4.3 Coaching Hub — `/coaching`

| Section | Content |
|---|---|
| Hero | "Prepare for any exam. From anywhere. At a price that works." |
| Exam category tabs | School Entrance · Government · Teaching · Career Skills |
| Exam cards | Per exam: name, next exam date, aspirant count, batch count, starting price, "View Details" |
| How coaching works | 5 steps: Choose exam —' Take diagnostic —' Join batch —' Learn + Practise —' Track improvement |
| What's included | Live classes, recordings, notes, mock tests, doubt solving, analytics, mentor support |
| Faculty | Selected faculty profiles with credentials |
| Results | Score improvement statistics and selection counts |
| Pricing | Tier-wise pricing table with EMI note |
| Comparison | Ellowring vs. offline coaching vs. other online platforms |
| FAQ | 10 coaching-specific questions |

### 19.4.4 Exam Landing Page — `/coaching/[exam]` (Template)

This template is used for all 18 exam tracks and is the primary SEO asset.

| Section | Content Requirement |
|---|---|
| Hero | Exam name, full form, next exam date countdown, aspirant count, CTA "Join Batch" / "Take Free Mock" |
| Exam overview | Conducting body, eligibility, exam pattern, marking scheme, duration, mode |
| Syllabus | Complete subject-wise, topic-wise syllabus with weightage table |
| Important dates | Notification, application, admit card, exam, result dates |
| Batches available | Batch cards: name, start date, duration, schedule, faculty, seats left, price, EMI |
| Free resources | Free mock test, sample notes, previous year papers, syllabus PDF |
| Preparation strategy | Month-wise preparation plan (content asset) |
| Faculty | Faculty for this exam with credentials and student ratings |
| Results | Selections and score improvements for this exam |
| Cut-offs and trends | Historical cut-off table |
| Colleges/posts accepting this exam | Link to `/colleges/exams/[exam]` |
| Student reviews | Verified reviews from enrolled students |
| FAQ | 12 exam-specific questions with FAQ schema |
| Related exams | Cross-links to adjacent exam tracks |

### 19.4.5 Career Guidance — `/career-guidance`

| Section | Content |
|---|---|
| Hero | "Not sure what to do after Class 12? Find out in 30 minutes — free." |
| How the assessment works | 4 steps: Aptitude —' Interest —' Personality —' Report |
| What you get | Sample report preview with career matches, salary bands, education paths |
| Career library | Searchable index of 200+ careers |
| Why it matters | Statistics on wrong-stream selection and its consequences |
| Testimonials | Students who changed direction after assessment |
| CTA | "Start Free Assessment" |

### 19.4.6 Career Detail — `/career-guidance/careers/[slug]` (Template)

| Section | Content |
|---|---|
| Overview | What this career involves, day-to-day work |
| Education path | Required stream, entrance exams, degrees, certifications |
| Skills required | Technical and soft skills with proficiency levels |
| Salary progression | Entry, mid, senior salary bands by city tier |
| Job market | Demand outlook, top hiring sectors, top employers |
| Growth path | Typical career ladder |
| Related Ellowring products | Recommended exams, courses, projects, jobs |
| Related careers | Adjacent career options |

### 19.4.7 Colleges — `/colleges`

| Section | Content |
|---|---|
| Search bar | Query with autocomplete on college name, city, course |
| Filters | State, city, course, degree level, fee range, exam accepted, college type (govt/private/deemed), accreditation, placement range, hostel, ranking |
| Results | College cards: logo, name, location, type, top courses, fee range, average package, placement %, accreditation badges, verified badge, "Compare" checkbox |
| Sort | Relevance, fees, placement rate, average package, ranking, name |
| Comparison drawer | Up to 4 colleges side by side |
| SEO content block | State/course-specific descriptive content |

### 19.4.8 College Profile — `/colleges/[slug]` (Template)

| Section | Content |
|---|---|
| Header | Logo, name, location, established year, type, accreditation badges, **Verified by Ellowring** badge |
| Quick facts | Campus size, student count, faculty count, hostel, ranking |
| Courses offered | Table: course, duration, seats, eligibility, exams accepted, annual fee, total fee |
| Fee structure | Detailed itemised fees including hostel and other charges |
| Admission process | Step-by-step process, important dates, documents required |
| Placements | Placement %, highest/average/median package, top recruiters, sector-wise distribution, 3-year trend |
| Infrastructure | Facilities with photographs |
| Faculty | Department-wise faculty strength and qualifications |
| Scholarships | Available scholarships with eligibility |
| Reviews | Verified student reviews with rating breakdown |
| Location | Map, connectivity, nearby amenities |
| Similar colleges | Recommendation strip |
| CTA | "Apply Now" / "Get Admission Guidance" / "Add to Compare" |

**Data integrity requirement `FR-COL-021`:** Every quantitative claim on a college profile MUST be labelled with its source (`Ellowring Verified` or `Institution Declared`) and last-verified date.

### 19.4.9 Study Abroad — `/study-abroad`

| Section | Content |
|---|---|
| Hero | "Study abroad without the guesswork — or the hidden commissions." |
| Country cards | USA, UK, Canada, Germany, Australia, Ireland, New Zealand, Singapore, France, Netherlands — each with cost range, popular courses, visa difficulty, work rights, PR pathway |
| Cost calculator | Interactive tool: country + course + city —' tuition, living, visa, travel, total |
| University search | Filterable university database |
| Process timeline | 12-month timeline from test prep to departure |
| Packages | Self-Guided / Essential / Premium / Elite comparison |
| Transparency statement | Explicit disclosure that Ellowring receives university commissions and what they are |
| Scholarships | Searchable scholarship database |
| Success stories | Students placed at international universities |
| FAQ | 12 study-abroad questions |

### 19.4.10 Courses — `/courses`

| Section | Content |
|---|---|
| Search and filters | Category, level, duration, price, rating, language, certification type, job-demand indicator |
| Career tracks | Bundled multi-course tracks with outcome statement |
| Course cards | Thumbnail, title, provider, duration, level, rating, enrolled count, price, **"X jobs on Ellowring require this skill"** demand badge |
| Categories | Technology, Data & AI, Business, Design, Finance, Healthcare, Communication, Government Exam Skills |
| Why Ellowring courses | Demand-linked curriculum, verified certificates, employer recognition |

### 19.4.11 Course Detail — `/courses/[slug]` (Template)

| Section | Content |
|---|---|
| Header | Title, provider, rating, enrolled count, level, duration, language, last updated |
| Outcome statement | "After this course you will be able to." (3-6 concrete capabilities) |
| Job demand panel | Live count of Ellowring jobs and internships requiring this skill, with median salary |
| Curriculum | Module-wise breakdown with lesson count and duration; preview lessons marked |
| Instructor | Profile, credentials, other courses, rating |
| Certificate | Sample certificate image, verification explanation |
| Requirements | Prerequisites |
| Reviews | Verified learner reviews |
| Pricing | Price, discounts, EMI, bundle offers |
| FAQ | Course-specific questions |
| Related courses | Recommendation strip |

### 19.4.12 Internships — `/internships`

| Section | Content |
|---|---|
| Search and filters | Category, location (including Remote), duration, stipend range, start date, part/full-time, company type |
| Internship cards | Company logo, role, location, duration, stipend, applicants count, posted date, **Verified Employer** badge, deadline |
| Sort | Relevance, stipend, deadline, recency |
| Guidance panel | "How to get selected" tips and profile-strength prompt |
| Category pages | SEO-optimised pages per category and city |

### 19.4.13 Internship Detail — `/internships/[slug]` (Template)

| Section | Content |
|---|---|
| Header | Role, company (with verified badge), location, duration, stipend, apply-by date |
| About the company | Description, size, industry, website, Ellowring hiring history |
| Responsibilities | Bullet list |
| Requirements | Skills, eligibility, year of study, minimum CGPA if applicable |
| Perks | Certificate, LOR, PPO possibility, flexible hours, stipend details |
| Selection process | Stages with expected timeline |
| Match indicator | For logged-in students: match score with explanation of gaps |
| Apply | One-click apply with saved profile; optional cover note |
| Similar internships | Recommendation strip |

### 19.4.14 Live Projects — `/projects`

| Section | Content |
|---|---|
| Hero | "Build real products for real companies — with a mentor beside you." |
| How it works | 6 steps: Browse —' Apply —' Team formation —' Sprint execution —' Mentor review —' Certificate + Portfolio |
| Project cards | Title, sponsoring company, domain, duration, team size, difficulty, skills gained, mentor, seats left, fee |
| Categories | Software, Data & AI, Design, Marketing, Business Analysis, Content, Operations |
| Outcomes | Portfolio artefacts, mentor grading, employer visibility, PPO conversion statistics |
| Difference from internships | Comparison table |

### 19.4.15 Jobs — `/jobs`

| Section | Content |
|---|---|
| Search and filters | Role, location, experience (0-1, 1-3, 3-5, 5+), salary range, job type, industry, company size, work mode, skills |
| Job cards | Company logo, title, location, experience, salary range, posted date, applicant count, **Verified Employer** badge, match score (logged-in) |
| Fresher spotlight | Dedicated section for 0-1 year roles |
| Campus drives | Upcoming drives visible to eligible college students |
| Company directory | Link to `/jobs/companies` |

### 19.4.16 Job Detail — `/jobs/[slug]` (Template)

| Section | Content |
|---|---|
| Header | Title, company, location, experience, salary range, job type, posted date, apply-by date |
| Match panel | Match score, matched skills, missing skills, and courses that close each gap |
| Job description | Role summary, responsibilities, requirements, preferred qualifications |
| About the company | Profile, culture, benefits, Ellowring hiring history and average time-to-decision |
| Selection process | Stages, expected duration |
| Apply | One-click apply; resume selection; optional cover note |
| Similar jobs | Recommendation strip |

### 19.4.17 Partner With Us — `/partner-with-us` and Sub-Pages

| Sub-Page | Key Sections |
|---|---|
| `/colleges` | Value proposition, admission lead statistics, placement automation demo, pricing tiers, onboarding process, case studies, enquiry form |
| `/companies` | Verified candidate pool statistics by role and city, ATS demo, hiring package pricing, payroll bundle offer, case studies, enquiry form |
| `/training-institutes` | Distribution value, tooling overview, revenue share model, onboarding process, partner testimonials, application form |
| `/channel-partners` | Earning potential calculator, commission schedule, tier benefits, tools provided, training programme, application form |

**Requirement `FR-WEB-014`:** Every partner enquiry form MUST create a lead record, MUST send an acknowledgement within 60 seconds, and MUST assign to the appropriate sales queue with an SLA timer.

### 19.4.18 Contact — `/contact`

| Section | Content |
|---|---|
| Contact form | Name, email, phone, category (Student / College / Company / Training / Partner / Media / Grievance), message |
| Direct channels | Support email, sales email, phone, WhatsApp, support hours |
| Offices | Address with map |
| Grievance officer | Name, designation, email, response SLA (as required by Indian IT rules) |
| Response commitment | Published response-time SLA by category |

### 19.4.19 Certificate Verification — `/verify`

| Element | Requirement |
|---|---|
| Input | Certificate code (alphanumeric) or QR scan |
| Output (valid) | Holder name, credential title, issuer, issue date, credential type, verification status, issuing authority signature |
| Output (invalid) | Clear "Not found / Invalid" message with fraud-reporting link |
| Access | Public; no login required |
| Rate limiting | 30 verifications per IP per hour |
| Privacy | Displays only credential-relevant data; no contact details |

## 19.5 SEO Architecture

### 19.5.1 SEO Page Type Strategy

| Page Type | Count (Y1) | Primary Intent | Priority |
|---|---|---|---|
| Exam landing pages | 18 | "neet coaching online", "tnpsc preparation" | P0 |
| Exam sub-topic pages | 200+ | "neet biology syllabus", "jee main cut off 2026" | P1 |
| College profiles | 5,000+ | "[college name] fees placement" | P0 |
| College listing pages (state/city/course) | 800+ | "engineering colleges in coimbatore" | P0 |
| Career detail pages | 200+ | "how to become a data scientist in india" | P1 |
| Course pages | 300+ | "full stack development course" | P1 |
| Job/internship category pages | 400+ | "internships in chennai for cse students" | P1 |
| University pages (abroad) | 1,000+ | "[university] ms fees" | P2 |
| Blog articles | 500+ | Long-tail informational | P1 |

### 19.5.2 Technical SEO Requirements

| ID | Requirement |
|---|---|
| `NFR-SEO-001` | All public pages MUST be server-rendered or statically generated by Next.js with full HTML content available without JavaScript execution. |
| `NFR-SEO-002` | Every page MUST have a unique title (—— 60 chars) and meta description (—— 155 chars). |
| `NFR-SEO-003` | Structured data MUST be implemented: `Organization`, `Course`, `JobPosting`, `EducationalOrganization`, `FAQPage`, `BreadcrumbList`, `Review`. |
| `NFR-SEO-004` | XML sitemaps MUST be generated per content type and updated at least daily. |
| `NFR-SEO-005` | Canonical URLs MUST be declared on all pages; parameterised filter pages MUST canonicalise to the base listing. |
| `NFR-SEO-006` | Core Web Vitals MUST meet "Good" thresholds for 75th percentile of real users. |
| `NFR-SEO-007` | Internal linking MUST connect every exam page to related colleges, courses, careers and jobs. |
| `NFR-SEO-008` | `hreflang` MUST be implemented when regional language pages ship (V2). |
| `NFR-SEO-009` | Expired job and internship postings MUST return HTTP 410 or redirect to the relevant category page, never 404 soft-errors. |
| `NFR-SEO-010` | Open Graph and Twitter Card metadata MUST be present on all shareable pages. |

## 19.6 Conversion Design Requirements

| ID | Requirement |
|---|---|
| `FR-WEB-021` | Every marketing page MUST contain at least one primary CTA above the fold. |
| `FR-WEB-022` | Registration MUST be reachable in one click from every page. |
| `FR-WEB-023` | Exit-intent prompts MAY be shown at most once per session and MUST be dismissible. |
| `FR-WEB-024` | Anonymous users MUST be able to browse all listings; only application and enrolment require authentication. |
| `FR-WEB-025` | When an anonymous user attempts a gated action, the system MUST preserve intent and complete the action automatically after registration. |
| `FR-WEB-026` | All pricing displays MUST show the final payable amount inclusive of taxes. |
| `FR-WEB-027` | Trust elements (verified counts, security badges, refund policy link) MUST appear in the footer of every page. |

## 19.7 Content Governance

| Content Type | Owner | Review Cycle | Approval |
|---|---|---|---|
| Exam pages | Academic Team | Quarterly + on notification changes | Head of Academics |
| College data | Partnerships + Ops | Annually + on institution update | Ops Lead |
| Course pages | Content Admin | On course update | Content Lead |
| Job/internship listings | Employer (self-serve) | On posting; auto-expire | Ops moderation |
| Blog | Content Team | Continuous | Content Lead |
| Legal pages | Compliance | Annually + on regulatory change | Head of Compliance |
| Pricing | Product + Finance | Quarterly | CEO |

---

# Chapter 20 — Dashboard Information Architecture

> **Purpose of this chapter:** To define the complete post-login experience for all six roles, including navigation structure, screen inventory, widget specifications and the reference UI design for the Student Dashboard.

## 20.1 Dashboard Design System Foundations

| Element | Specification |
|---|---|
| **Layout** | Persistent left sidebar (collapsible) + fixed top bar + scrollable content area |
| **Grid** | 12-column responsive grid; 24px gutters desktop, 16px tablet, 12px mobile |
| **Breakpoints** | `sm` 640px · `md` 768px · `lg` 1024px · `xl` 1280px · `2xl` 1536px |
| **Sidebar width** | 260px expanded, 72px collapsed |
| **Top bar height** | 64px |
| **Component library** | shadcn/ui on Tailwind CSS |
| **Typography** | Inter (UI), tabular numerals for data |
| **Colour semantics** | Primary (brand), Success (green), Warning (amber), Danger (red), Info (blue), Neutral (slate) |
| **Elevation** | Cards at level 1; modals at level 3; toasts at level 4 |
| **Density** | Comfortable by default; compact option for institutional tables |
| **Empty states** | Every list MUST define an empty state with illustration, explanatory text and a primary action |
| **Loading states** | Skeleton loaders for all data regions; no full-page spinners |
| **Error states** | Inline error with retry action; never a blank screen |
| **Accessibility** | WCAG 2.1 AA; full keyboard navigation; visible focus rings; ARIA landmarks |

## 20.2 Student Dashboard — Reference UI Design (CANONICAL)

> **MANDATORY UI SPEC:** The approved high-fidelity Student Dashboard design (`docs/assets/student-dashboard-reference.png`) is the **canonical visual and structural specification** for V1 Student Dashboard implementation. Designers and engineers MUST match this layout, hierarchy, placement of widgets, navigation order, colour semantics and component density. Deviation requires Head of Design + Head of Product written approval.

**Reference artwork:** `docs/assets/student-dashboard-reference.png`

### 20.2.1 Overall Layout (matches reference screenshot)

Four-zone desktop composition on a light theme (white / soft gray surfaces, primary blue `#3B82F6`):

```
+------------------------------------------------------------------------------------+
| TOP BAR (full width): Logo | Global Search | Bell | Messages | Avatar + Name/Role  |
+--------------+---------------------------------------------------+-----------------+
| LEFT SIDEBAR | MAIN CONTENT                                      | RIGHT SIDEBAR   |
| (~240px)     |                                                   | (~300px)        |
|              | Greeting ("Good Morning, {Name}!")                | Upcoming Classes|
| Dashboard *  | KPI cards x4 (Courses / Mocks / Certs / Wallet)   | Calendar (month)|
| Career Guid. | AI Career Assistant banner + robot + CTA          | Announcements   |
| Coaching     | Explore Modules (8 circular module icons)         | Your Progress   |
| Mock Tests   | Continue Learning (progress course cards)         | (donut ~75%)    |
| Colleges     |                                                   |                 |
| Admissions   |                                                   |                 |
| Courses      |                                                   |                 |
| Internships  |                                                   |                 |
| Projects     |                                                   |                 |
| Jobs         |                                                   |                 |
| Study Abroad |                                                   |                 |
| Certificates |                                                   |                 |
| Wallet       |                                                   |                 |
| Messages     |                                                   |                 |
| Notifications|                                                   |                 |
| Profile      |                                                   |                 |
| Settings     |                                                   |                 |
| +----------+ | Value bar: AI Powered | Secure | All-in-One |     |                 |
| |Go Premium| | Trusted | 24/7 Support                            |                 |
| |Upgrade   | | Footer: logo + mission + tagline + (c)            |                 |
| +----------+ |                                                   |                 |
+--------------+---------------------------------------------------+-----------------+
```

| Zone | Spec from reference |
|---|---|
| **Top bar** | White; logo left; centred search "Search for courses, colleges, exams."; right utilities: bell (red unread badge), messages, circular avatar + display name + role label "Student" + chevron |
| **Left sidebar** | Light surface; single-column icon + label list; active item solid blue highlight (white text); "Go Premium" crown card pinned at bottom with "Upgrade Now" |
| **Main column** | Soft gray canvas; white cards with ~12px radius and subtle shadow |
| **Right sidebar** | Stacked widgets: Upcoming Classes —' Calendar —' Announcements —' Your Progress |

### 20.2.2 Left Sidebar — Navigation (exact order from reference)

| # | Item | Icon intent | Route | Notes |
|---|---|---|---|---|
| 1 | Dashboard | Home / grid | `/dashboard/student` | Active = blue fill |
| 2 | Career Guidance | Compass / path | `/dashboard/student/career` | |
| 3 | Coaching | Graduation cap | `/dashboard/student/coaching` | |
| 4 | Mock Tests | Clipboard / checklist | `/dashboard/student/mock-tests` | |
| 5 | Colleges | Building | `/dashboard/student/colleges` | |
| 6 | Admissions | Clipboard with check | `/dashboard/student/admissions` | |
| 7 | Courses | Book | `/dashboard/student/courses` | |
| 8 | Internships | Briefcase | `/dashboard/student/internships` | |
| 9 | Projects | Layers / cube | `/dashboard/student/projects` | |
| 10 | Jobs | Search briefcase | `/dashboard/student/jobs` | |
| 11 | Study Abroad | Globe / plane | `/dashboard/student/study-abroad` | |
| 12 | Certificates | Award / ribbon | `/dashboard/student/certificates` | |
| 13 | Wallet | Wallet | `/dashboard/student/wallet` | |
| 14 | Messages | Chat bubble | `/dashboard/student/messages` | Unread badge |
| 15 | Notifications | Bell | `/dashboard/student/notifications` | Unread badge |
| 16 | Profile | User | `/dashboard/student/profile` | |
| 17 | Settings | Gear | `/dashboard/student/settings` | |
| **PINNED** | **Go Premium** | Gold crown | `/dashboard/student/premium` | Card with "Upgrade Now"; hidden if already premium |

### 20.2.3 Top Bar (reference screenshot)

| Zone | Element | Specification |
|---|---|---|
| **Left** | Logo | Ellowring mark + wordmark; hamburger on `<lg` |
| **Centre** | Global search | Placeholder exactly: `Search for courses, colleges, exams...` |
| **Right** | Notifications bell | Red unread badge |
| | Messages | Speech-bubble icon —' Messages |
| | Profile | Circular avatar + `Mr. {Name}` + role `Student` + chevron |

**Sidebar behavioural requirements**

| ID | Requirement |
|---|---|
| `FR-SDB-001` | The sidebar MUST match the reference order and labels exactly for V1. |
| `FR-SDB-002` | The active route MUST use solid primary blue (`#3B82F6`) with white text. |
| `FR-SDB-003` | The Go Premium card MUST be pinned to the bottom with crown icon and Upgrade Now CTA. |
| `FR-SDB-004` | On viewports below `lg`, the sidebar MUST convert to an off-canvas drawer. |
| `FR-SDB-005` | Unread badges on Messages/Notifications MUST suppress at zero. |
| `FR-SDB-006` | Full keyboard navigation MUST be supported; `Esc` closes the mobile drawer. |

**Global search / notification / profile requirements** remain as previously specified (`FR-STB-*`) with placeholder text updated to the reference string above.

### 20.2.4 KPI Cards (reference screenshot — V1 home default)

Four cards in a single row on desktop; 2—-2 on tablet; stacked on mobile. **V1 Student Dashboard home MUST render these four cards as shown in the reference artwork** (stage-aware card swaps remain allowed on specialised stage home variants in V2+).

| Card | Colour accent | Primary value example | Sub-label |
|---|---|---|---|
| Enrolled Courses | Blue | `08` | Active Courses |
| Mock Tests | Green | `24` | Tests Attempted |
| Certificates | Orange | `03` | Certificates Earned |
| Wallet Balance | Purple | `—,— 2,450` | Available Balance |

**KPI card requirements**

| ID | Requirement |
|---|---|
| `FR-KPI-001` | Each card MUST display icon, label, large numeral, and sub-label per the reference. |
| `FR-KPI-002` | Each card MUST be clickable to the relevant module. |
| `FR-KPI-003` | Cards MUST use ~12px radius, white surface, subtle shadow on light canvas. |
| `FR-KPI-004` | Cards MUST render skeleton loaders while data is pending. |
| `FR-KPI-005` | Live values MUST come from the authenticated student's data APIs. |

### 20.2.6 Explore Modules Grid (reference screenshot)

Eight circular quick-access tiles in a responsive grid:

Career Guidance · Coaching · Colleges · Admissions · Courses · Internships · Projects · Jobs

| Layout | Columns |
|---|---|
| `xl+` | 4 (two rows) or 8 on wide |
| `md` | 4 |
| `sm` | 2 |

| ID | Requirement |
|---|---|
| `FR-EMG-001` | Icons MUST be circular, multi-colour accents as in the reference. |
| `FR-EMG-002` | Each tile MUST navigate to the corresponding student module route. |
| `FR-EMG-003` | Labels MUST match the reference wording. |

### 20.2.7 Continue Learning (reference screenshot)

Horizontal/grid course cards with thumbnail, title, and blue percentage progress bar (examples in reference: Full Stack Web Development 40%, Python for Data Science 40%, UI/UX Design Masterclass 70%, DSA 20%).

### 20.2.8 Right Sidebar Widgets (reference screenshot)

| Widget | Spec |
|---|---|
| **Upcoming Classes** | Time, subject (e.g. JEE Main - Physics), instructor, Join button |
| **Calendar** | Mini month grid with current day highlighted |
| **Announcements** | Chronological list (e.g. NEET 2025 mock series, scholarship tests) |
| **Your Progress** | Donut ~75% overall + breakdown bars/list for Courses, Mock Tests, Admissions/Assignments, Projects |

### 20.2.9 Trust / Value Bar + Footer (reference screenshot)

Value bar items: AI Powered · Secure & Reliable · All In One Platform · Trusted by Thousands · 24/7 Support

Footer: Ellowring logo, mission line "From 11th Standard to First Job — Everything in One Platform.", tagline "Learn. Prepare. Build. Get Hired.", copyright Ellowring Software Solutions.

### 20.2.10 Colour & Component Tokens (from reference)

| Token | Value / guidance |
|---|---|
| Primary blue | `#3B82F6` |
| Canvas | Soft gray / `#F3F6FB` family |
| Surfaces | White cards, ~12px radius, light shadow |
| KPI accents | Blue / Green / Orange / Purple |
| Component library | shadcn/ui patterns on Tailwind |

| ID | Requirement |
|---|---|
| `FR-UI-001` | V1 Student Dashboard MUST pass visual QA against `docs/assets/student-dashboard-reference.png`. |
| `FR-UI-002` | Marketing public site MAY retain brand-green marketing identity; logged-in Student Dashboard MUST follow the blue reference system above. |

### 20.2.11 AI Career Assistant Banner

Full-width light-blue banner with robot/AI mascot visual, short guidance copy, and primary CTA **"Ask AI Assistant"**.

### 20.2.12 Additional Widget Requirements

Upcoming Classes, Calendar, Announcements, Continue Learning, and Progress widgets retain prior behavioural IDs (`FR-UC-*`, `FR-CAL-*`, `FR-ANN-*`, `FR-CL-*`, `FR-OP-*`) with **layout placement forced to the reference screenshot** (right rail for classes/calendar/announcements/progress; main column for continue learning).

### 20.2.13 Student Dashboard Screen Inventory

| # | Screen | Route | Key Components |
|---|---|---|---|
| 1 | Dashboard Home | `/dashboard/student` | Reference layout end-to-end |
| 2 | AI Career Assistant | `/dashboard/student/ai-assistant` | Chat, suggestions, history |
| 3 | Career Guidance | `/dashboard/student/career` | Assessment, report, explorer |
| 4 | Coaching | `/dashboard/student/coaching` | Batches, schedule, join |
| 5 | Mock Tests | `/dashboard/student/mock-tests` | Attempt, results |
| 6 | Colleges | `/dashboard/student/colleges` | Browse, shortlist |
| 7 | Admissions | `/dashboard/student/admissions` | Applications, status |
| 8 | Courses | `/dashboard/student/courses` | Catalogue, player, progress |
| 9 | Internships | `/dashboard/student/internships` | Apply, track |
| 10 | Projects | `/dashboard/student/projects` | Live projects |
| 11 | Jobs | `/dashboard/student/jobs` | Apply, track |
| 12 | Study Abroad | `/dashboard/student/study-abroad` | Pathways (teaser in V1) |
| 13 | Certificates | `/dashboard/student/certificates` | Grid, download, verify |
| 14 | Wallet | `/dashboard/student/wallet` | Balance, redeem, ledger |
| 15 | Messages | `/dashboard/student/messages` | Threads |
| 16 | Notifications | `/dashboard/student/notifications` | Full list |
| 17 | Profile | `/dashboard/student/profile` | Completeness, docs |
| 18 | Settings | `/dashboard/student/settings` | Security, prefs |
| 19 | Premium | `/dashboard/student/premium` | Upgrade |

## 20.3 College Dashboard

### 20.3.1 Navigation Structure

| Group | Items |
|---|---|
| **OVERVIEW** | Dashboard · Analytics |
| **STUDENTS** | Student Directory · Bulk Import · Student Progress · Readiness Tracker |
| **ADMISSIONS** | Admission Leads · Applications · Programmes · Seat Management · Admission Analytics |
| **PLACEMENTS** | Placement Drives · Companies · Job Postings · Shortlists · Interview Schedule · Offers · Placement Analytics |
| **INSTITUTION** | College Profile · Departments · Staff Management · Verification Status |
| **REPORTS** | Placement Reports · Admission Reports · Accreditation Reports · Custom Reports |
| **ACCOUNT** | Subscription & Billing · Notifications · Settings · Support |

### 20.3.2 Dashboard Home Widgets

| Widget | Content |
|---|---|
| KPI cards | Total Students · Placement % (current year) · Admission Leads (this month) · Active Drives |
| Placement funnel | Eligible —' Registered —' Shortlisted —' Interviewed —' Offered —' Placed |
| Upcoming drives | Next 5 drives with company, date, roles, registered count |
| Admission leads | Recent leads with source, programme, status, assigned counsellor |
| Student readiness distribution | Histogram of placement readiness scores |
| Top recruiters | Companies by hires with average package |
| Department performance | Placement % by department with peer benchmark |
| Announcements | Publish to students |
| Pending actions | Verification items, unapproved staff, expiring subscription |

### 20.3.3 Key College Screens

| Screen | Key Capabilities |
|---|---|
| Student Directory | Search, filter (department, year, CGPA, readiness, placement status), bulk actions, export |
| Bulk Import | CSV/XLSX upload, column mapping, validation report, error correction, student invitation |
| Placement Drive Manager | Create drive, define eligibility, invite companies, publish to students, manage rounds, track results |
| Shortlist Manager | Auto-filter by eligibility, manual override, bulk shortlist/reject, notify students |
| Interview Scheduler | Slot creation, panel assignment, student allocation, conflict detection, bulk notification |
| Offer Tracker | Offers by company, acceptance status, package details, joining status |
| Accreditation Reports | NAAC/NBA-oriented placement and outcome data compilation with export |

## 20.4 HR / Company Dashboard

### 20.4.1 Navigation Structure

| Group | Items |
|---|---|
| **OVERVIEW** | Dashboard · Hiring Analytics |
| **HIRING** | Job Postings · Internship Postings · Live Projects · Candidate Search · Applications · Shortlists · Assessments · Interviews · Offers |
| **CAMPUS** | Campus Drives · Partner Colleges · Drive Calendar |
| **PAYROLL** *(V2)* | Employees · Onboarding · Attendance · Leave · Salary Structures · Payroll Runs · Payslips · Statutory Compliance · Payroll Reports |
| **COMPANY** | Company Profile · Employer Brand Page · Team Management · Verification Status |
| **ACCOUNT** | Subscription & Billing · Credits · Notifications · Settings · Support |

### 20.4.2 Dashboard Home Widgets

| Widget | Content |
|---|---|
| KPI cards | Active Postings · Total Applications · Interviews This Week · Offers Pending |
| Hiring funnel | Applied —' Screened —' Shortlisted —' Assessed —' Interviewed —' Offered —' Joined |
| Recent applications | Latest applicants with match score, verified badges, quick actions |
| Interview schedule | Today and this week |
| Time-to-hire trend | Rolling average by role |
| Source effectiveness | Applications and hires by source (direct, campus, search, referral) |
| Credit balance | Remaining posting credits and hire credits |
| Recommended candidates | AI-surfaced candidates matching open requisitions |
| Pending actions | Applications awaiting review, offers awaiting approval, expiring postings |

### 20.4.3 Key HR Screens

| Screen | Key Capabilities |
|---|---|
| Job Posting Wizard | Role details, requirements, compensation, selection process, eligibility, publish targets (public / campus / invited colleges) |
| Candidate Pipeline (Kanban) | Drag-and-drop across stages, bulk actions, filters, saved views |
| Candidate Profile | Verified education, certificates, projects, assessments, resume, application history, match explanation |
| Candidate Search | Boolean and faceted search across consented profiles with saved searches and alerts |
| Assessment Manager | Assign platform assessments, view scores, compare candidates |
| Interview Scheduler | Panel management, slot proposal, candidate self-scheduling, video link generation, feedback forms |
| Offer Manager | Offer creation, approval workflow, digital offer letter, candidate acceptance tracking |
| Campus Drive Manager | College selection, eligibility broadcast, registration tracking, on-campus round management |

## 20.5 Training Institute Dashboard (V2)

### 20.5.1 Navigation Structure

| Group | Items |
|---|---|
| **OVERVIEW** | Dashboard · Analytics |
| **TEACHING** | Batches · Courses · Content Library · Live Classes · Schedule |
| **ASSESSMENT** | Question Bank · Tests · Assignments · Grading · Results |
| **STUDENTS** | Enrolled Students · Attendance · Progress · Doubts · Feedback |
| **FACULTY** | Trainers · Assignments · Performance |
| **REVENUE** | Enrolments · Revenue Share · Payouts · Invoices |
| **ACCOUNT** | Institute Profile · Verification · Settings · Support |

### 20.5.2 Dashboard Home Widgets

| Widget | Content |
|---|---|
| KPI cards | Active Batches · Total Students · This Month's Revenue · Average Rating |
| Today's schedule | Classes with trainer, batch, time, join link |
| Enrolment trend | New enrolments over time by course |
| Revenue summary | Gross, platform share, institute share, pending payout |
| Student progress distribution | Completion rate distribution across batches |
| Pending actions | Ungraded assignments, unanswered doubts, content awaiting approval |
| Ratings and feedback | Recent student feedback with sentiment |

## 20.6 Channel Partner Dashboard (V2)

### 20.6.1 Navigation Structure

| Group | Items |
|---|---|
| **OVERVIEW** | Dashboard · Performance |
| **SALES** | My Referral Links · Leads · Conversions · Products & Pricing |
| **EARNINGS** | Commission Ledger · Wallet · Payout Requests · Statements |
| **RESOURCES** | Marketing Collateral · Product Training · Certification · Announcements |
| **NETWORK** | Sub-Partners *(V3)* · Team Performance *(V3)* |
| **ACCOUNT** | Profile & KYC · Tier Status · Settings · Support |

### 20.6.2 Dashboard Home Widgets

| Widget | Content |
|---|---|
| KPI cards | This Month's Earnings · Conversions This Month · Active Leads · Current Tier |
| Tier progress | Progress bar toward the next tier with the GMV gap stated |
| Earnings trend | Monthly earnings chart with product-wise breakdown |
| Lead pipeline | Leads by stage: Clicked —' Registered —' Engaged —' Converted |
| Recent conversions | Product, amount, commission, status, date |
| Top products | Best-converting products for this partner |
| Payout status | Available balance, pending clearance, last payout, next payout date |
| Leaderboard | Partner's rank within region and tier (opt-in) |
| Collateral highlights | Latest marketing assets |

## 20.7 Admin Dashboard

### 20.7.1 Navigation Structure

| Group | Items |
|---|---|
| **OVERVIEW** | Platform Dashboard · Real-Time Monitor |
| **USERS** | Students · Colleges · Companies · Training Institutes · Channel Partners · Internal Users · RBAC |
| **VERIFICATION** | Verification Queue · Institution Verification · Employer Verification · Document Review · Rejection History |
| **CONTENT** | Courses · Coaching Batches · Question Banks · CMS Pages · Blog · Moderation Queue |
| **MARKETPLACE** | Job Listings · Internship Listings · Project Listings · College Listings · Reported Content |
| **FINANCE** | Transactions · Revenue · Refunds · Payouts · Commission Ledger · Reconciliation · Invoices · Tax Reports |
| **OPERATIONS** | Support Tickets · Disputes · Escalations · SLA Monitor |
| **ANALYTICS** | Business Analytics · Product Analytics · Cohort Analysis · Funnel Analysis · Custom Reports |
| **SYSTEM** | Configuration · Feature Flags · Notification Templates · Coupon Campaigns · Audit Logs · System Health · Integrations |

### 20.7.2 Dashboard Home Widgets

| Widget | Content |
|---|---|
| KPI cards | Total Users · MAU · Today's Revenue · Platform Health Status |
| Revenue dashboard | Today / MTD / YTD with target comparison and stream breakdown |
| User growth | New registrations by role, trend, source |
| Verification queue | Pending count by type with SLA breach indicators |
| Transaction monitor | Real-time transaction feed with failure rate |
| System health | API latency, error rate, uptime, queue depths, DB health |
| Fraud signals | Anomaly alerts requiring review |
| Support SLA | Open tickets by priority with SLA status |
| Top content | Most-viewed pages, most-enrolled courses, most-applied jobs |
| Pending approvals | Payout batches, high-value refunds, escalated disputes |

### 20.7.3 Key Admin Screens

| Screen | Key Capabilities |
|---|---|
| Verification Queue | Prioritised list, document viewer, checklist-based approval, rejection with reason, SLA timers, bulk actions |
| Reconciliation | Gateway settlement vs. platform ledger comparison with variance flagging and resolution workflow |
| Payout Approval | Batch review, per-partner breakdown, dual approval, release, failure handling |
| Dispute Manager | Case timeline, evidence from both parties, transaction history, resolution actions, refund/clawback execution |
| Audit Log Viewer | Filterable immutable log by actor, action, resource, time; export for compliance |
| Feature Flags | Per-environment, per-role, per-tenant percentage rollouts with kill switches |
| Coupon Campaign Manager | Create campaigns, define eligibility rules, set budgets and caps, monitor redemption and ROI |

## 20.8 Cross-Dashboard Requirements

| ID | Requirement |
|---|---|
| `FR-DASH-001` | Every dashboard MUST load its above-the-fold content within 2.0 seconds at P75. |
| `FR-DASH-002` | Every list view MUST support pagination or virtualised infinite scroll, filtering, sorting and export where the user has export permission. |
| `FR-DASH-003` | Every data table MUST support column visibility configuration, persisted per user. |
| `FR-DASH-004` | Every destructive action MUST require explicit confirmation naming the affected entity. |
| `FR-DASH-005` | Every dashboard MUST provide a contextual help affordance linking to the relevant help article. |
| `FR-DASH-006` | Every dashboard MUST display the tenant/context name in the top bar for multi-tenant roles. |
| `FR-DASH-007` | Session timeout MUST warn the user 2 minutes before expiry with an option to extend. |
| `FR-DASH-008` | All dashboards MUST be fully operable on 1366—-768 without horizontal scrolling. |
| `FR-DASH-009` | All monetary values MUST be displayed with currency symbol and Indian numbering format where locale is India. |
| `FR-DASH-010` | All timestamps MUST be displayed in the viewer's local timezone with the timezone indicated on hover. |

---

# Chapter 21 — Detailed Module Explanation

> **Purpose of this chapter:** To specify each of the sixteen core modules in engineering-ready detail — purpose, actors, capabilities, data entities, workflows, integration points, functional requirements and acceptance criteria.

## 21.1 Module Inventory and Dependencies

| # | Module | Depends On | Consumed By | Version |
|---|---|---|---|---|
| M1 | Career Guidance | Identity, Profile | Coaching, Courses, Colleges, AI | V1 |
| M2 | Competitive Exam Coaching | Identity, Payments, Notifications | Analytics, Certificates | V1 |
| M3 | College Admissions | Identity, Profile, Payments | Analytics | V1 |
| M4 | Study Abroad | Identity, Profile, Payments, Documents | Analytics | V2 |
| M5 | Skill Courses | Identity, Payments, Certificates | Jobs, Internships, AI | V1 |
| M6 | Internships | Identity, Profile, Notifications | Certificates, Analytics | V1 |
| M7 | Live Projects | Identity, Profile, Payments | Portfolio, Certificates | V2 |
| M8 | Jobs & Placements | Identity, Profile, Notifications | Payroll, Analytics | V1 |
| M9 | HR Hiring (ATS) | Identity, Jobs | Payroll, Analytics | V1 basic / V2 full |
| M10 | Payroll | Identity, Hiring | Analytics | V2 |
| M11 | AI Career Assistant | All modules (read) | Student experience | V1 basic / V2 advanced |
| M12 | Wallet | Payments, Identity | All monetised modules | V1 |
| M13 | Coupons | Payments, Wallet | All monetised modules | V1 |
| M14 | Certificates | Coaching, Courses, Internships, Projects | Profile, Portfolio | V1 |
| M15 | Notifications | Identity, all modules | All modules | V1 |
| M16 | Analytics | All modules | All dashboards | V1 basic / V2 advanced |

## 21.2 M1 — Career Guidance Module

### 21.2.1 Purpose

To replace opinion-based career advice with a structured, data-driven, explainable recommendation process that produces a concrete, actionable career roadmap for every student.

### 21.2.2 Actors

| Actor | Interaction |
|---|---|
| Student | Takes assessment, reads report, explores careers, follows roadmap |
| AI Assistant | Generates recommendations, answers questions about the report |
| Counsellor (V2) | Reviews report with student in a scheduled session |
| Admin | Manages assessment instruments and career library content |

### 21.2.3 Core Capabilities

| Capability | Description |
|---|---|
| Multi-dimensional assessment | Aptitude, interest, personality, values and academic performance sections |
| Adaptive question flow | Question selection adapts to prior responses to reduce assessment length |
| Career recommendation | Ranked list of career matches with a fit score and explicit rationale |
| Career library | 200+ career profiles with education paths, skills, salary data and market outlook |
| Education pathway mapping | Career —' required stream —' entrance exams —' degrees —' certifications |
| Stream recommendation | For Class 10/11 students: recommended stream with reasoning |
| Exam recommendation | Specific entrance exams aligned to recommended careers |
| Roadmap generation | Year-by-year action plan from current stage to target career |
| Skill gap identification | Current skills vs. target career requirements |
| Report generation | Downloadable PDF report, shareable with parents |
| Reassessment | Periodic reassessment with change tracking |

### 21.2.4 Assessment Structure

| Section | Questions | Duration | Measures |
|---|---|---|---|
| Aptitude — Numerical | 20 | 15 min | Quantitative reasoning |
| Aptitude — Verbal | 20 | 12 min | Language and comprehension |
| Aptitude — Logical | 20 | 15 min | Pattern and logic reasoning |
| Aptitude — Spatial | 15 | 10 min | Visual-spatial ability |
| Interest inventory | 60 | 12 min | RIASEC-style interest dimensions |
| Personality | 50 | 10 min | Work-style and behavioural traits |
| Values | 25 | 6 min | Work values and motivators |
| Academic profile | Form | 3 min | Marks, subjects, board, preferences |
| **Total** | **210 + form** | **~83 min** | Completable across multiple sessions |

**Requirement `FR-CG-001`:** The assessment MUST support save-and-resume at question-level granularity, with progress preserved for at least 30 days.

### 21.2.5 Recommendation Output

| Output Element | Detail |
|---|---|
| Top career matches | 10 careers ranked with fit score (0-100) |
| Fit rationale | For each career: which assessment dimensions drove the match, stated in plain language |
| Confidence indicator | High / Medium / Low based on assessment completeness and score separation |
| Stream recommendation | For school students: recommended stream with alternatives |
| Exam recommendation | 3-5 entrance exams aligned to top careers |
| Education roadmap | Stage-by-stage path to each of the top 3 careers |
| Skill development plan | Prioritised skills with recommended Ellowring courses |
| Salary expectations | Entry / mid / senior bands by city tier |
| Market outlook | Demand trend and top hiring sectors |
| Alternative paths | Careers adjacent to the top matches |

### 21.2.6 Data Entities

| Entity | Key Fields |
|---|---|
| `AssessmentInstrument` | id, name, version, sections, scoring_config, active |
| `AssessmentSession` | id, student_id, instrument_id, status, started_at, completed_at, progress |
| `AssessmentResponse` | id, session_id, question_id, response, response_time_ms |
| `AssessmentResult` | id, session_id, dimension_scores, normalised_scores, computed_at |
| `CareerProfile` | id, slug, title, description, education_path, skills, salary_bands, outlook, sectors |
| `CareerRecommendation` | id, student_id, career_id, fit_score, rationale, rank, generated_at |
| `CareerRoadmap` | id, student_id, career_id, stages, current_stage, generated_at |

### 21.2.7 Workflow

```

Student registers
|
Prompted to take assessment (dashboard CTA + notification)
|
Assessment section 1..N - ' Save & resume supported
|
Submission - ' Scoring engine computes dimension scores
|
Recommendation engine matches dimensions to career profiles
|
Report generated (< 60 seconds)
|
Student views report - ' explores careers - ' selects target career
|
Roadmap generated - ' surfaced on dashboard as next actions
|
Cross-module recommendations (exams, courses) activated
|
[V2] Optional counsellor session booked
|
Reassessment prompt after 12 months or on stage change

```

### 21.2.8 Functional Requirements

| ID | Requirement |
|---|---|
| `FR-CG-001` | Assessment MUST support save-and-resume with 30-day retention. |
| `FR-CG-002` | Assessment MUST be completable on mobile web without loss of usability. |
| `FR-CG-003` | Report MUST be generated within 60 seconds of submission. |
| `FR-CG-004` | Each recommendation MUST include a plain-language rationale referencing specific assessment dimensions. |
| `FR-CG-005` | Report MUST be downloadable as a PDF branded for parent sharing. |
| `FR-CG-006` | Career library MUST be browsable and searchable without taking the assessment. |
| `FR-CG-007` | Selecting a target career MUST update dashboard recommendations across coaching, courses and jobs. |
| `FR-CG-008` | Students MUST be able to retake the assessment; prior results MUST be retained with change comparison. |
| `FR-CG-009` | The system MUST NOT present a single career as "the" answer; a minimum of 5 options MUST always be presented. |
| `FR-CG-010` | Salary and outlook data MUST display its source and last-updated date. |
| `FR-CG-011` | Assessment content MUST be reviewable and versionable by `CONTENT_ADMIN` without a code deployment. |
| `FR-CG-012` | Partial assessments (—— 60% complete) MUST produce a provisional report labelled as provisional. |

### 21.2.9 Acceptance Criteria

| AC | Statement |
|---|---|
| AC-CG-01 | Given a student who completes all assessment sections, when they submit, then a full report with 10 ranked careers and rationales is available within 60 seconds. |
| AC-CG-02 | Given a student who abandons the assessment mid-section, when they return within 30 days, then they resume at the exact question they left. |
| AC-CG-03 | Given a completed report, when the student selects a target career, then the dashboard's recommended actions update to reflect that career within one page load. |
| AC-CG-04 | Given a student on a 360px-wide viewport, when they take the assessment, then all questions and options are fully readable and selectable without horizontal scrolling. |
| AC-CG-05 | Given a report, when the student downloads the PDF, then it contains all report sections and is under 5MB. |

## 21.3 M2 — Competitive Exam Coaching Module

### 21.3.1 Purpose

To deliver structured, affordable, outcome-measured examination preparation across 18 tracks, with live teaching, self-paced content, rigorous assessment and diagnostic analytics.

### 21.3.2 Exam Track Catalogue

| # | Track | Category | Typical Duration | Key Components |
|---|---|---|---|---|
| 1 | NEET | Medical entrance | 12 months | Physics, Chemistry, Biology; 40+ full mocks |
| 2 | JEE Main | Engineering entrance | 12 months | Physics, Chemistry, Mathematics; 40+ mocks |
| 3 | JEE Advanced | Engineering entrance | 12 months | Advanced PCM; problem-solving intensive |
| 4 | CUET | University entrance | 8 months | Domain subjects + general test |
| 5 | UPSC | Civil services | 15 months | Prelims, Mains, answer writing, optional guidance |
| 6 | TNPSC | State PSC | 10 months | General studies, aptitude, Tamil |
| 7 | SSC | Central government | 8 months | CGL, CHSL patterns |
| 8 | Banking | BFSI | 8 months | IBPS PO/Clerk, SBI PO/Clerk, RRB |
| 9 | Railway | Railways | 6 months | RRB NTPC, Group D, ALP |
| 10 | Defence | Armed forces | 10 months | NDA, CDS, AFCAT + SSB guidance |
| 11 | Police | State police | 6 months | Written + physical preparation guidance |
| 12 | TET | Teaching eligibility | 6 months | Paper I and II |
| 13 | TRB | Teacher recruitment | 8 months | Subject + pedagogy |
| 14 | Placement Prep | Career skills | 4 months | Aptitude, reasoning, verbal, company patterns |
| 15 | Coding Prep | Career skills | 6 months | DSA, problem solving, system design basics |
| 16 | Communication | Career skills | 3 months | Spoken English, presentation, business writing |
| 17 | Interview Prep | Career skills | 2 months | HR, technical, case interviews, mock sessions |
| 18 | Foundation (Class 11/12) | Early prep | 12-24 months | Board + entrance combined foundation |

### 21.3.3 Core Capabilities

| Capability | Description |
|---|---|
| Batch management | Structured cohorts with defined start dates, schedules and faculty |
| Live classes | Scheduled interactive sessions with chat, polls, raise-hand, screen share |
| Recorded library | Every live class recorded and available within 2 hours |
| Study materials | Notes, formula sheets, previous papers, reference PDFs |
| Mock test engine | Sectional, full-length, previous-year and custom tests with real exam interface |
| Ranking and percentile | All-India and cohort-level ranking with percentile |
| Performance analytics | Subject, topic, difficulty, time-per-question and accuracy analysis |
| Doubt resolution | Text/image doubt posting with faculty and AI responses |
| Study planner | Personalised daily/weekly plan generated from syllabus, target date and performance |
| Current affairs | Daily digest for government exam tracks |
| Progress tracking | Syllabus coverage, attendance, test participation, improvement trajectory |
| Parent reporting (V2) | Periodic progress summary to linked parent |

### 21.3.4 Mock Test Engine Specification

| Feature | Requirement |
|---|---|
| Test types | Sectional, full-length, previous-year, custom, adaptive (V2) |
| Interface | Replicates the actual exam interface (question palette, timer, sections, marking) |
| Question types | MCQ single, MCQ multiple, numerical entry, matching, comprehension-based |
| Marking schemes | Configurable per exam including negative marking |
| Timer | Server-authoritative countdown; section-wise locking where applicable |
| Navigation | Question palette with states: Not Visited, Not Answered, Answered, Marked for Review, Answered & Marked |
| Auto-save | Answers persisted every 10 seconds and on every selection |
| Resilience | Network interruption MUST NOT lose answers; auto-resume on reconnect |
| Submission | Manual submit or auto-submit on timer expiry |
| Results | Score, rank, percentile, section-wise breakdown within 60 seconds |
| Analysis | Topic-wise accuracy, difficulty-wise performance, time distribution, comparison with toppers |
| Solutions | Detailed text solutions with optional video explanations |
| Re-attempt | Practice re-attempt mode that does not affect ranking |

**Requirement `FR-COACH-021`:** The mock test engine MUST tolerate a network disconnection of up to 5 minutes without answer loss, restoring full state on reconnection.

### 21.3.5 Data Entities

| Entity | Key Fields |
|---|---|
| `ExamTrack` | id, slug, name, category, syllabus_map, exam_pattern, marking_scheme |
| `Batch` | id, exam_track_id, name, start_date, end_date, schedule, faculty_ids, capacity, price_tiers, status |
| `Enrolment` | id, student_id, batch_id, enrolled_at, status, payment_id, progress |
| `ClassSession` | id, batch_id, title, topic, faculty_id, scheduled_at, duration, live_url, recording_url, status |
| `Attendance` | id, session_id, student_id, joined_at, left_at, duration, engagement_score |
| `StudyMaterial` | id, batch_id, title, type, file_url, topic, published_at |
| `Test` | id, exam_track_id, batch_id, type, title, duration, sections, marking_scheme, scheduled_at |
| `Question` | id, test_id, type, content, options, correct_answer, solution, topic, difficulty, marks |
| `TestAttempt` | id, test_id, student_id, started_at, submitted_at, responses, score, rank, percentile |
| `Doubt` | id, student_id, batch_id, topic, content, attachments, status, responses, resolved_at |
| `StudyPlan` | id, student_id, exam_track_id, target_date, daily_tasks, adherence_rate |

### 21.3.6 Functional Requirements

| ID | Requirement |
|---|---|
| `FR-COACH-001` | Students MUST be able to browse batches filtered by exam, start date, schedule, language and price. |
| `FR-COACH-002` | Batch detail MUST display complete schedule, faculty credentials, syllabus coverage, inclusions and seats remaining. |
| `FR-COACH-003` | Enrolment MUST grant immediate access to all batch content upon successful payment. |
| `FR-COACH-004` | Live class join MUST be available from 10 minutes before scheduled start. |
| `FR-COACH-005` | Class recordings MUST be published within 2 hours of session end. |
| `FR-COACH-006` | Students MUST be able to download permitted study materials for offline use. |
| `FR-COACH-007` | Mock test results MUST be available within 60 seconds of submission. |
| `FR-COACH-008` | Ranking MUST be computed across all students who attempted the same test. |
| `FR-COACH-009` | Topic-wise weakness analysis MUST be generated after every full-length test. |
| `FR-COACH-010` | Students MUST be able to post doubts with text and image attachments. |
| `FR-COACH-011` | Doubts MUST receive an AI-generated preliminary response within 5 minutes and a faculty response within the published SLA. |
| `FR-COACH-012` | The study planner MUST regenerate the plan when test performance indicates a significant change in weak areas. |
| `FR-COACH-013` | Attendance MUST be recorded automatically from live session participation. |
| `FR-COACH-014` | Students MUST be able to view syllabus coverage as a percentage with topic-level detail. |
| `FR-COACH-015` | Content MUST be protected against unauthorised download; video MUST use signed, expiring URLs and MUST be watermarked with the student identifier. |
| `FR-COACH-016` | Concurrent stream limit MUST be enforced (default 2 devices) with session eviction. |
| `FR-COACH-017` | Faculty MUST be able to publish batch announcements that reach enrolled students via notification. |
| `FR-COACH-018` | Batch cancellation MUST trigger automatic full refund and student notification. |
| `FR-COACH-019` | Current affairs digests MUST be published daily for applicable government exam tracks. |
| `FR-COACH-020` | Students MUST be able to enrol in multiple batches simultaneously with a unified schedule view. |

### 21.3.7 Acceptance Criteria

| AC | Statement |
|---|---|
| AC-COACH-01 | Given an enrolled student, when a live class starts, then the Join button is active and the session loads with audio and video within 15 seconds. |
| AC-COACH-02 | Given a student taking a mock test, when the network disconnects for 3 minutes and reconnects, then all previously entered answers are intact and the timer reflects true elapsed time. |
| AC-COACH-03 | Given a submitted full-length test, when results are generated, then score, all-India rank, percentile and topic-wise analysis are all displayed within 60 seconds. |
| AC-COACH-04 | Given a student who posts a doubt, when 5 minutes elapse, then an AI preliminary response is present and the doubt is queued for faculty review. |
| AC-COACH-05 | Given a student logged in on 3 devices, when they attempt to play video on the third, then the oldest session is terminated and the student is informed. |

## 21.4 M3 — College Admissions Module

### 21.4.1 Purpose

To make college selection transparent and data-driven, and to convert student interest into confirmed admissions while giving colleges a verified, intent-scored lead pipeline.

### 21.4.2 Core Capabilities

| Capability | Description |
|---|---|
| College discovery | Search and filter across a verified college database |
| College profiles | Verified fees, placements, infrastructure, accreditation, reviews |
| Comparison | Side-by-side comparison of up to 4 colleges across 20+ parameters |
| Eligibility checker | Match student marks and exam scores against college criteria |
| Predictor (V2) | Admission probability based on historical cut-offs and student score |
| Shortlisting | Save colleges into ambitious / target / safe buckets |
| Application | Guided application with document upload and fee payment |
| Application tracking | Status timeline from submitted to admitted |
| Counselling guidance | Exam-specific counselling process guidance (e.g., NEET, JEE, state counselling) |
| Scholarship discovery | Searchable scholarships with eligibility matching |
| Admission confirmation | Dual confirmation by student and college, triggering commission |
| Lead management (college side) | Lead inbox, scoring, assignment, status tracking, conversion recording |

### 21.4.3 Data Entities

| Entity | Key Fields |
|---|---|
| `College` | id, slug, name, type, location, established, accreditation, verified_status, verified_at |
| `Programme` | id, college_id, name, degree_level, duration, seats, eligibility, exams_accepted, fee_structure |
| `PlacementRecord` | id, college_id, year, placement_pct, highest, average, median, top_recruiters, source |
| `CollegeReview` | id, college_id, student_id, ratings, content, verified, status |
| `Shortlist` | id, student_id, college_id, programme_id, bucket, notes |
| `Application` | id, student_id, college_id, programme_id, status, documents, fee_payment_id, submitted_at |
| `AdmissionLead` | id, student_id, college_id, programme_id, source, score, status, assigned_to, created_at |
| `AdmissionConfirmation` | id, application_id, student_confirmed_at, college_confirmed_at, commission_status |
| `Scholarship` | id, name, provider, eligibility, amount, deadline, application_url |

### 21.4.4 Lead Scoring Model

| Signal | Weight | Description |
|---|---|---|
| Profile completeness | 15% | Complete profiles indicate serious intent |
| Exam score availability | 20% | Verified score indicates readiness |
| Eligibility match | 20% | Meets the programme's stated criteria |
| Engagement depth | 15% | Profile views, comparison usage, document downloads |
| Application initiation | 20% | Started or submitted an application |
| Geographic proximity | 5% | Distance from the college |
| Financial fit | 5% | Fee range aligned with declared budget |

Leads are bucketed as **Hot** (—— 75), **Warm** (50-74), **Cold** (< 50).

### 21.4.5 Functional Requirements

| ID | Requirement |
|---|---|
| `FR-ADM-001` | College search MUST return results within 500ms at P95 for filtered queries. |
| `FR-ADM-002` | Every college profile MUST display a verification badge and last-verified date. |
| `FR-ADM-003` | Every quantitative claim MUST be labelled `Ellowring Verified` or `Institution Declared`. |
| `FR-ADM-004` | Comparison MUST support up to 4 colleges across at least 20 parameters. |
| `FR-ADM-005` | The eligibility checker MUST evaluate the student's stored marks and scores against programme criteria and state pass/fail per criterion. |
| `FR-ADM-006` | Applications MUST support document upload with format and size validation and virus scanning. |
| `FR-ADM-007` | Application status changes MUST notify the student within 60 seconds. |
| `FR-ADM-008` | Colleges MUST receive leads in their dashboard within 60 seconds of generation. |
| `FR-ADM-009` | Admission commission MUST be triggered only after dual confirmation by student and college. |
| `FR-ADM-010` | Colleges MUST be able to dispute an attributed admission within 15 days, with evidence upload. |
| `FR-ADM-011` | Student reviews MUST be verified (enrolment confirmed) before publication and MUST be moderated. |
| `FR-ADM-012` | Scholarship listings MUST be matched against student eligibility and surfaced proactively. |

### 21.4.6 Acceptance Criteria

| AC | Statement |
|---|---|
| AC-ADM-01 | Given a student with stored Class 12 marks and an entrance score, when they view a programme, then eligibility is evaluated automatically and each criterion is shown as met or unmet. |
| AC-ADM-02 | Given a student who submits an application, when the college updates the status, then the student receives a notification and sees the updated timeline. |
| AC-ADM-03 | Given a confirmed admission, when both student and college confirm, then a commission accrual record is created with status `pending_dispute_window`. |
| AC-ADM-04 | Given a college profile, when any statistic is displayed, then its source label and last-verified date are visible without interaction. |

## 21.5 M5 — Skill Courses Module

### 21.5.1 Purpose

To provide industry-aligned, demand-linked skill courses that produce verified certificates recognised by the employers on the platform.

### 21.5.2 Course Taxonomy

| Category | Example Courses |
|---|---|
| Technology | Full Stack Development, Backend with Node.js, React, Mobile Development, Cloud Fundamentals, DevOps Basics |
| Data & AI | Python for Data, SQL, Data Analysis, Machine Learning Foundations, Power BI, Excel Advanced |
| Business | Business Analysis, Project Management, Operations, Supply Chain, Entrepreneurship |
| Design | UI/UX Fundamentals, Figma, Graphic Design, Video Editing |
| Finance | Financial Modelling, Accounting Basics, Taxation, Investment Analysis |
| Healthcare | Medical Coding, Clinical Research Basics, Hospital Administration |
| Communication | Business English, Presentation Skills, Email Writing, Interview Communication |
| Career Skills | Resume Writing, Personal Branding, Workplace Readiness |

### 21.5.3 Course Structure

| Element | Specification |
|---|---|
| Modules | Logical groupings of lessons |
| Lessons | Video, text, downloadable resource, or interactive |
| Assignments | Practical tasks with submission and grading |
| Quizzes | Auto-graded knowledge checks per module |
| Final assessment | Certification-gating assessment with a defined pass mark |
| Project | Capstone deliverable for advanced courses |
| Certificate | Issued on meeting completion and assessment criteria |

### 21.5.4 Functional Requirements

| ID | Requirement |
|---|---|
| `FR-CRS-001` | Course catalogue MUST support filtering by category, level, duration, price, language, rating and job-demand indicator. |
| `FR-CRS-002` | Every course page MUST display a live count of platform jobs/internships requiring the taught skill. |
| `FR-CRS-003` | Video playback MUST support speed control (0.5—--2—-), quality selection, captions and resume-from-last-position. |
| `FR-CRS-004` | Progress MUST be computed from watched duration, not lesson open events. |
| `FR-CRS-005` | Assignments MUST support file upload, text submission and link submission with grading and feedback. |
| `FR-CRS-006` | The final assessment MUST be gated behind a minimum content completion threshold (default 80%). |
| `FR-CRS-007` | Certificates MUST be issued automatically within 24 hours of meeting completion criteria. |
| `FR-CRS-008` | Students MUST retain access to purchased course content for a minimum of 12 months. |
| `FR-CRS-009` | Course Q&A MUST allow students to ask questions and instructors to respond, with upvoting. |
| `FR-CRS-010` | Courses MUST support bundling into career tracks with track-level progress and certification. |
| `FR-CRS-011` | Course completion MUST update the student's skill profile, which MUST propagate to job matching. |
| `FR-CRS-012` | Instructors MUST be able to update course content with existing learners notified of material changes. |

### 21.5.5 Acceptance Criteria

| AC | Statement |
|---|---|
| AC-CRS-01 | Given a student who completes 80% of content and passes the final assessment, when 24 hours elapse, then a verified certificate is available in their certificates list. |
| AC-CRS-02 | Given a completed course, when the student views the Jobs module, then skills gained from that course are reflected in their match scores. |
| AC-CRS-03 | Given a course page, when a student views it, then the count of jobs requiring that skill is accurate as of the last hourly refresh. |

## 21.6 M12 — Wallet Module

### 21.6.1 Purpose

To provide a single, auditable internal value store handling credits, refunds, referral earnings, commissions and payouts across all roles.

### 21.6.2 Wallet Types

| Wallet Type | Owner | Credit Sources | Debit Uses |
|---|---|---|---|
| Student Wallet | Student | Refunds, referral rewards, cashback, promotional credits, direct top-up | Course/coaching/service purchases, withdrawal (earned credits only) |
| Partner Wallet | Channel Partner | Commission accruals | Payout to bank |
| Institute Wallet | Training Institute | Revenue share settlements | Payout to bank |
| College Wallet | College | Refunds, adjustments | Subscription payment offset, payout |
| Company Wallet | Company | Credits purchased, refunds | Job postings, assessments, hires |

### 21.6.3 Ledger Model

The wallet MUST be implemented as a **double-entry ledger**. Every movement creates balanced debit and credit entries.

| Entity | Key Fields |
|---|---|
| `Wallet` | id, owner_type, owner_id, currency, status, created_at |
| `WalletBalance` | wallet_id, available, on_hold, lifetime_credited, lifetime_debited, updated_at |
| `LedgerEntry` | id, wallet_id, transaction_id, type (credit/debit), amount, balance_after, category, reference_type, reference_id, description, created_at |
| `WalletTransaction` | id, type, status, amount, source_wallet_id, destination_wallet_id, reference, initiated_by, created_at, settled_at |
| `PayoutRequest` | id, wallet_id, amount, bank_account_id, status, requested_at, approved_by, processed_at, utr |
| `Hold` | id, wallet_id, amount, reason, reference, expires_at, released_at |

### 21.6.4 Functional Requirements

| ID | Requirement |
|---|---|
| `FR-WAL-001` | Every wallet movement MUST create immutable ledger entries; entries MUST NEVER be updated or deleted. |
| `FR-WAL-002` | Wallet balance MUST always equal the sum of ledger entries; a reconciliation job MUST verify this daily and alert on variance. |
| `FR-WAL-003` | All wallet operations MUST be idempotent, keyed by an idempotency token. |
| `FR-WAL-004` | Concurrent debits MUST be serialised to prevent negative balances. |
| `FR-WAL-005` | Promotional credits MUST carry an expiry date and MUST NOT be withdrawable. |
| `FR-WAL-006` | Earned credits (referrals, commissions) MUST be withdrawable subject to KYC completion and minimum payout threshold. |
| `FR-WAL-007` | Commission credits MUST be held until the associated refund window closes. |
| `FR-WAL-008` | Refund clawbacks MUST debit the commission wallet and MUST be permitted to create a negative balance recorded as recoverable. |
| `FR-WAL-009` | Payout requests MUST require dual approval above a configurable threshold. |
| `FR-WAL-010` | Every wallet owner MUST be able to download a statement for any date range in CSV and PDF. |
| `FR-WAL-011` | Wallet MUST support partial payment: wallet balance applied first, remainder charged to the payment gateway. |
| `FR-WAL-012` | All wallet transactions MUST be visible in the admin dashboard with full traceability to the source event. |

### 21.6.5 Acceptance Criteria

| AC | Statement |
|---|---|
| AC-WAL-01 | Given a wallet with —,—500 available, when a purchase of —,—1,200 is made, then —,—500 is debited from the wallet and —,—700 is charged to the gateway in a single atomic transaction. |
| AC-WAL-02 | Given a duplicate payment webhook, when it is processed twice, then only one ledger entry pair exists. |
| AC-WAL-03 | Given a refunded purchase that generated a partner commission, when the refund is processed, then the commission is clawed back and the partner's ledger shows the reversal with reference to the original entry. |
| AC-WAL-04 | Given the daily reconciliation job, when balances and ledger sums differ by any amount, then an alert is raised and the affected wallet is flagged for review. |

## 21.7 M13 — Coupons Module

### 21.7.1 Coupon Types

| Type | Description | Example |
|---|---|---|
| Percentage discount | X% off, optionally capped | 20% off up to —,—2,000 |
| Flat discount | Fixed amount off | —,—500 off |
| First purchase | Applies only to a user's first paid transaction | WELCOME500 |
| Referral | Auto-generated per student; rewards both parties | REF-ARJ4821 |
| Bundle | Discount when multiple products are purchased together | Coaching + Placement Prep |
| Partner code | Channel-partner-specific with attribution | MOHAN-TN12 |
| Campaign | Time-bound marketing campaign | EXAMSEASON26 |
| Institutional | Bulk discount for a specific college's students | SRMCOLLEGE10 |
| Win-back | Targeted at dormant users | COMEBACK25 |

### 21.7.2 Coupon Rule Engine

| Rule Dimension | Options |
|---|---|
| Validity period | Start and end datetime |
| Usage limit — global | Total redemptions allowed |
| Usage limit — per user | Redemptions per user |
| Minimum order value | Threshold amount |
| Maximum discount | Cap on discount value |
| Applicable products | Specific modules, categories, courses, batches |
| Excluded products | Explicit exclusions |
| User eligibility | New users, existing users, specific segments, specific colleges, specific tiers |
| Geography | State or city restriction |
| Stacking | Whether combinable with wallet credit or other coupons |
| Budget cap | Maximum total discount value across all redemptions |

### 21.7.3 Functional Requirements

| ID | Requirement |
|---|---|
| `FR-CPN-001` | Coupon validation MUST occur server-side; client-side validation is advisory only. |
| `FR-CPN-002` | Coupon application MUST display the exact discount amount and revised payable amount before payment. |
| `FR-CPN-003` | Invalid coupons MUST return a specific, non-enumerable reason (expired, not applicable, limit reached, minimum not met). |
| `FR-CPN-004` | Coupons MUST NOT stack unless explicitly configured to allow stacking. |
| `FR-CPN-005` | Referral coupons MUST reward the referrer only after the referee's refund window closes. |
| `FR-CPN-006` | Campaign budget caps MUST automatically disable a coupon when the cap is reached. |
| `FR-CPN-007` | Coupon redemption MUST be recorded with user, order, discount amount and timestamp for ROI analysis. |
| `FR-CPN-008` | Admins MUST be able to create, edit, pause and expire coupons without a code deployment. |
| `FR-CPN-009` | Refunded orders MUST restore the user's coupon usage count only if configured to do so. |
| `FR-CPN-010` | Coupon codes MUST be case-insensitive and MUST reject codes with ambiguous characters at generation time. |

## 21.8 M14 — Certificates Module

### 21.8.1 Certificate Types

| Type | Issued For | Issuer |
|---|---|---|
| Course Completion | Completing a skill course with passing assessment | Ellowring / Training Partner (co-signed) |
| Coaching Completion | Completing a coaching batch with minimum attendance | Ellowring / Training Partner |
| Internship Completion | Completing an internship with employer sign-off | Employer + Ellowring |
| Live Project Completion | Completing a project with mentor grading | Company + Mentor + Ellowring |
| Assessment / Proficiency | Achieving a defined score in a skill assessment | Ellowring |
| Career Track | Completing all courses in a track | Ellowring |
| Participation | Attending events, workshops, drives | Ellowring |

### 21.8.2 Certificate Data Model

| Field | Description |
|---|---|
| `certificate_id` | Internal UUID |
| `verification_code` | Public, human-readable unique code (format: `ELW-<TYPE>-<YYYY>-<8CHAR>`) |
| `holder_id`, `holder_name` | Student reference and printed name |
| `credential_title` | Title as printed |
| `credential_type` | Enum of certificate types |
| `issuer` | Issuing entity or entities |
| `issued_at`, `valid_until` | Dates; most credentials do not expire |
| `criteria_met` | Structured record of what was achieved (score, duration, grade) |
| `metadata` | Course/batch/project references |
| `pdf_url` | Signed URL to the generated PDF |
| `revoked`, `revoked_reason`, `revoked_at` | Revocation state |

### 21.8.3 Functional Requirements

| ID | Requirement |
|---|---|
| `FR-CERT-001` | Every certificate MUST have a globally unique, non-guessable verification code. |
| `FR-CERT-002` | Certificates MUST be publicly verifiable at `/verify` without authentication. |
| `FR-CERT-003` | The verification page MUST display holder name, credential, issuer, issue date and validity status only — never contact details. |
| `FR-CERT-004` | Certificates MUST be generated as PDF with an embedded QR code linking to the verification URL. |
| `FR-CERT-005` | Certificates MUST be issued automatically within 24 hours of criteria being met. |
| `FR-CERT-006` | Certificates MUST be shareable to LinkedIn and downloadable as PDF and image. |
| `FR-CERT-007` | Revoked certificates MUST show as revoked on the verification page with the revocation date. |
| `FR-CERT-008` | Certificate issuance MUST be recorded in an append-only log. |
| `FR-CERT-009` | Certificates MUST automatically appear in the student's profile and portfolio. |
| `FR-CERT-010` | Employers viewing a candidate MUST see verification status inline without leaving the ATS. |

### 21.8.4 Acceptance Criteria

| AC | Statement |
|---|---|
| AC-CERT-01 | Given an issued certificate, when any person enters its code at `/verify`, then the credential details and a valid status are displayed within 2 seconds. |
| AC-CERT-02 | Given a revoked certificate, when its code is verified, then the page clearly states it has been revoked and shows the revocation date. |
| AC-CERT-03 | Given a completed internship with employer sign-off, when 24 hours elapse, then the certificate is present in the student's certificate list and portfolio. |

## 21.9 M15 — Notification Module

Specified in full in Chapter 33.

## 21.10 M16 — Analytics Module

Specified in full in Chapters 34 and 35.

## 21.11 Cross-Module Integration Contracts

| Source Module | Event | Consuming Modules | Effect |
|---|---|---|---|
| Career Guidance | `career.target_selected` | Coaching, Courses, Jobs, AI | Recommendations re-ranked |
| Coaching | `test.completed` | AI, Analytics, Study Planner | Weakness analysis, plan regeneration |
| Courses | `course.completed` | Certificates, Profile, Jobs | Certificate issued, skill added, match scores updated |
| Internships | `internship.completed` | Certificates, Profile, Portfolio | Certificate issued, experience added |
| Live Projects | `project.graded` | Certificates, Portfolio, Hiring | Portfolio artefact created, employer-visible signal |
| Jobs | `offer.accepted` | Payroll, Analytics, College | Payroll onboarding initiated, placement recorded |
| Payments | `payment.succeeded` | Wallet, Coupons, Commission, Enrolment | Access granted, commission accrued, coupon redemption recorded |
| Payments | `payment.refunded` | Wallet, Commission, Enrolment | Access revoked, commission clawed back |
| Profile | `profile.updated` | Jobs, Internships, AI | Match scores recomputed |
| Verification | `entity.verified` | Public site, Search | Listing becomes publicly visible |

**Requirement `FR-INT-001`:** All cross-module communication MUST occur via typed domain events published to an event bus. Direct cross-module database access is prohibited.

**Requirement `FR-INT-002`:** All event consumers MUST be idempotent and MUST tolerate out-of-order and duplicate delivery.

---

# Chapter 22 — Student Journey

> **Purpose of this chapter:** To describe the complete eight-year student lifecycle inside Ellowring stage by stage, defining what the platform does at each stage, what state transitions occur, what data accumulates, and what the product must deliver to move the student forward.

## 22.1 The Eight-Stage Lifecycle

| Stage | Label | Typical Age | Duration | Primary Outcome |
|---|---|---|---|---|
| ST-1 | Discovery & Clarity | 16-17 | 1-3 months | Career direction identified |
| ST-2 | Exam Preparation | 16-19 | 6-24 months | Entrance exam attempted with improved score |
| ST-3 | Admission | 18-19 | 2-6 months | College seat confirmed (or abroad pathway started) |
| ST-4 | Foundation Skilling | 18-20 | 12-24 months | Foundational employable skills certified |
| ST-5 | Practical Experience | 19-21 | 6-18 months | Internship and live project portfolio built |
| ST-6 | Placement Readiness | 20-22 | 6-12 months | Placement-ready score achieved |
| ST-7 | Job Acquisition | 21-22 | 3-9 months | Offer accepted |
| ST-8 | Employment | 22+ | Ongoing | Payroll onboarding; continuing education |

## 22.2 Stage ST-1 — Discovery & Clarity

### 22.2.1 Entry Conditions

| Condition | Description |
|---|---|
| Trigger | Registration, or existing user declaring `SCHOOL` stage |
| Student state | No career target selected |

### 22.2.2 What the Platform Does

| Action | Module | Timing |
|---|---|---|
| Prompt career assessment | Career Guidance | On first dashboard load |
| Send assessment reminder | Notifications | Day 2, Day 5, Day 10 if incomplete |
| Deliver career report | Career Guidance | Within 60s of completion |
| Recommend exam tracks | Coaching | Immediately post-report |
| Generate roadmap | Career Guidance + AI | Immediately post-report |
| Offer free diagnostic test | Coaching | Post-report |
| Prompt parent sharing | Career Guidance | Post-report |

### 22.2.3 Data Accumulated

Aptitude scores across 4 dimensions · Interest profile · Personality traits · Work values · Academic marks · Declared preferences · Selected career target

### 22.2.4 Exit Criteria

| Criterion | Requirement |
|---|---|
| Assessment completed | Yes |
| Career report viewed | Yes |
| Target career selected | Yes |
| Exam track identified | Yes |

### 22.2.5 Stage Metrics

| Metric | Target |
|---|---|
| Assessment start rate (within 7 days) | —— 65% |
| Assessment completion rate | —— 80% of starts |
| Report —' target selection | —— 70% |
| Stage ST-1 —' ST-2 progression (60 days) | —— 45% |

## 22.3 Stage ST-2 — Exam Preparation

### 22.3.1 What the Platform Does

| Action | Module |
|---|---|
| Recommend batches matched to target exam, budget and schedule | Coaching |
| Offer free diagnostic and sample content | Coaching |
| Enable enrolment with EMI and coupons | Payments, Wallet, Coupons |
| Deliver live classes, recordings and materials | Coaching |
| Generate and adapt a personalised study plan | Coaching + AI |
| Administer mock tests with rank and analysis | Coaching |
| Detect weak topics and prescribe remediation | AI |
| Resolve doubts | Coaching + AI |
| Track syllabus coverage and attendance | Coaching |
| Alert on exam notifications and deadlines | Notifications |
| Report progress to parent (V2) | Notifications |
| Issue completion certificate | Certificates |

### 22.3.2 State Machine

```

NOT_ENROLLED - ' ENROLLED - ' ACTIVE_LEARNING - ' EXAM_READY - ' EXAM_ATTEMPTED
- |
DORMANT - | ? | ? | ? | ? AT_RISK
|
RE_ENGAGED / CHURNED

```

| State | Definition | Product Response |
|---|---|---|
| `ENROLLED` | Payment complete, access granted | Onboarding, first class scheduled |
| `ACTIVE_LEARNING` | —— 3 sessions/week attended or watched | Standard progression |
| `AT_RISK` | < 1 session/week for 2 weeks, or declining mock scores | Mentor outreach, plan adjustment, motivational nudges |
| `DORMANT` | No activity 21+ days | Re-engagement campaign, counsellor call |
| `EXAM_READY` | Syllabus —— 85% + mock percentile stable/improving | Final revision plan, exam-day guidance |
| `EXAM_ATTEMPTED` | Exam date passed | Result capture, transition to ST-3 |

### 22.3.3 Stage Metrics

| Metric | Target |
|---|---|
| Enrolment conversion from recommendation | —— 12% |
| Live class attendance rate | —— 62% |
| Mock test participation rate | —— 70% |
| Mean percentile improvement | —— 15 points |
| Batch completion rate | —— 68% |
| ST-2 —' ST-3 progression | —— 75% |

## 22.4 Stage ST-3 — Admission

### 22.4.1 What the Platform Does

| Action | Module |
|---|---|
| Capture exam result | Coaching / Profile |
| Generate college shortlist based on score, budget, location and preference | Colleges + AI |
| Provide counselling process guidance | Colleges |
| Enable comparison and eligibility checking | Colleges |
| Facilitate applications and document management | Colleges |
| Surface matching scholarships | Colleges |
| Offer study-abroad pathway as an alternative | Study Abroad |
| Track application status | Colleges |
| Record confirmed admission | Colleges |
| Transition student to `COLLEGE` stage | Profile |

### 22.4.2 Decision Branches

| Branch | Condition | Path |
|---|---|---|
| Domestic admission | Score meets domestic college criteria | College Admission Ecosystem |
| Study abroad | Student opts for overseas education | Study Abroad Ecosystem |
| Repeat attempt | Score below target and student opts to reattempt | Return to ST-2 with repeater batch |
| Alternative pathway | Diploma, vocational, direct skilling | Course Ecosystem |

### 22.4.3 Stage Metrics

| Metric | Target |
|---|---|
| Shortlist generation rate | —— 85% of ST-3 entrants |
| Application submission rate | —— 55% |
| Admission confirmation rate | —— 32% of applicants |
| ST-3 —' ST-4 progression | —— 70% |

## 22.5 Stage ST-4 — Foundation Skilling

### 22.5.1 What the Platform Does

| Action | Module |
|---|---|
| Update stage to `COLLEGE`; reconfigure dashboard | Profile |
| Perform curriculum-to-market skill gap analysis | AI + Courses |
| Recommend foundational courses aligned to target career | Courses |
| Deliver courses with assessments and certificates | Courses |
| Track skill profile growth | Profile + Analytics |
| Introduce Communication and Placement Prep tracks | Coaching |
| Encourage early portfolio building | Portfolio |
| Connect with the college's placement cell (if partner college) | Colleges |

### 22.5.2 Skill Profile Construction

| Signal Source | Contribution to Skill Profile |
|---|---|
| Course completion | Skill added with proficiency = assessment score band |
| Assessment score | Skill proficiency validated |
| Project deliverable | Skill demonstrated with mentor grading |
| Internship feedback | Skill validated by employer |
| Self-declared | Skill listed but marked unverified |

**Requirement `FR-SKILL-001`:** The skill profile MUST distinguish verified skills (platform-evidenced) from self-declared skills in all views, including employer-facing views.

### 22.5.3 Stage Metrics

| Metric | Target |
|---|---|
| Skill gap analysis completion | —— 60% |
| Course enrolment rate | —— 35% |
| Course completion rate | —— 55% |
| Average verified skills at stage exit | —— 4 |
| ST-4 —' ST-5 progression | —— 60% |

## 22.6 Stage ST-5 — Practical Experience

### 22.6.1 What the Platform Does

| Action | Module |
|---|---|
| Recommend internships matched to skills and preferences | Internships + AI |
| Recommend live projects to build portfolio depth | Live Projects |
| Assist with application materials | AI Resume Builder |
| Track applications and outcomes | Applications |
| Manage active internship tasks and evaluation | Internships |
| Manage project sprints, deliverables and mentor review | Live Projects |
| Issue certificates on completion | Certificates |
| Publish portfolio artefacts | Portfolio |

### 22.6.2 Experience Portfolio Targets

| Artefact | Target by Stage Exit |
|---|---|
| Completed internships | —— 1 |
| Completed live projects | —— 2 |
| Verified certificates | —— 4 |
| Public portfolio published | Yes |
| Employer-visible profile enabled | Yes |

### 22.6.3 Stage Metrics

| Metric | Target |
|---|---|
| Internship application rate | —— 70% |
| Internship placement rate (of applicants) | —— 28% |
| Live project enrolment rate | —— 22% |
| Project completion rate | —— 80% |
| Portfolio publication rate | —— 45% |
| ST-5 —' ST-6 progression | —— 80% |

## 22.7 Stage ST-6 — Placement Readiness

### 22.7.1 Placement Readiness Score (PRS)

A composite 0-100 score published to the student with full transparency of its components.

| Component | Weight | Basis |
|---|---|---|
| Profile completeness | 10% | Required fields populated |
| Verified skills | 20% | Count and relevance of verified skills vs. target role |
| Certificates | 10% | Number and relevance |
| Practical experience | 20% | Internships and projects completed with grades |
| Aptitude readiness | 15% | Placement Prep assessment scores |
| Technical/coding readiness | 15% | Coding Prep performance (role-dependent) |
| Communication readiness | 10% | Communication assessment and mock interview scores |

| PRS Band | Label | Product Response |
|---|---|---|
| 0-39 | Not Ready | Structured 12-week readiness plan |
| 40-59 | Developing | Targeted gap-closing recommendations |
| 60-79 | Ready | Job applications enabled with confidence indicators |
| 80-100 | Highly Ready | Priority visibility to employers; premium opportunities |

**Requirement `FR-PRS-001`:** The PRS calculation MUST be published to the student in full, with each component's current value, weight and the specific actions that would increase it.

### 22.7.2 What the Platform Does

| Action | Module |
|---|---|
| Compute and display PRS | Analytics |
| Recommend gap-closing actions | AI |
| Deliver Placement Prep, Coding Prep, Interview Prep | Coaching |
| Generate ATS-optimised resume | AI |
| Run AI mock interviews with feedback | AI |
| Register student for campus drives | Colleges + Hiring |
| Enable employer profile visibility (with consent) | Profile |

### 22.7.3 Stage Metrics

| Metric | Target |
|---|---|
| PRS computed for eligible students | 100% |
| Mean PRS at stage exit | —— 68 |
| Resume generation rate | —— 75% |
| Mock interview participation | —— 45% |
| ST-6 —' ST-7 progression | —— 90% |

## 22.8 Stage ST-7 — Job Acquisition

### 22.8.1 What the Platform Does

| Action | Module |
|---|---|
| Surface matched jobs with explanation | Jobs + AI |
| Enable one-click application | Jobs |
| Register for campus drives | Colleges + Hiring |
| Track application pipeline status | Applications |
| Schedule and remind about interviews | Hiring + Notifications |
| Provide company-specific interview preparation | Interview Prep |
| Manage and compare offers | Offers |
| Record placement outcome | Analytics |

### 22.8.2 Application Pipeline States (Student View)

```

SAVED - ' APPLIED - ' UNDER_REVIEW - ' SHORTLISTED - ' ASSESSMENT - ' INTERVIEW
- ' OFFER_EXTENDED - ' OFFER_ACCEPTED - ' JOINED
* OFFER_DECLINED
* REJECTED (at any stage, with reason category)
* WITHDRAWN (student-initiated)

```

**Requirement `FR-JOB-031`:** Every application MUST receive a status update within 7 days of submission. If the employer has not acted, the system MUST send an automated status notice to the student and an action reminder to the employer.

### 22.8.3 Stage Metrics

| Metric | Target |
|---|---|
| Applications per active student | —— 12 |
| Application —' interview rate | —— 14% |
| Interview —' offer rate | —— 26% |
| Offer acceptance rate | —— 72% |
| Placement rate among PRS —— 60 students | —— 65% |
| Median time from ST-7 entry to offer | —— 90 days |

## 22.9 Stage ST-8 — Employment

### 22.9.1 What the Platform Does

| Action | Module |
|---|---|
| Convert accepted offer into payroll onboarding | Hiring —' Payroll |
| Collect onboarding documents | Payroll |
| Provision employee self-service access | Payroll |
| Deliver payslips and tax documents | Payroll |
| Record salary outcome for platform calibration | Analytics |
| Recommend continuing education | Courses |
| Invite to alumni ambassador programme | Growth |
| Request success story | Growth |

### 22.9.2 The Closing of the Loop

| Data Point Captured | Feeds Back Into |
|---|---|
| Actual salary | Career Guidance salary bands; course ROI calculations |
| Role and employer | Career pathway validation |
| Time from graduation to hire | Placement readiness model calibration |
| Skills the employer valued | Course recommendation weighting |
| Retention at 6/12 months | Career fit model validation |

**This feedback is the mechanism by which Ellowring's recommendations become progressively more accurate than any competitor's.**

### 22.9.3 Stage Metrics

| Metric | Target |
|---|---|
| Offer —' payroll onboarding conversion (where employer uses payroll) | —— 80% |
| Salary data capture rate | —— 70% |
| Alumni advocacy participation | —— 25% |
| Continuing education enrolment within 12 months | —— 18% |

## 22.10 Journey Analytics Requirements

| ID | Requirement |
|---|---|
| `FR-JRN-001` | Every student MUST have a computed current stage, visible on their dashboard and in admin views. |
| `FR-JRN-002` | Stage transitions MUST be recorded as events with timestamp and triggering condition. |
| `FR-JRN-003` | The system MUST compute stage-to-stage conversion rates by cohort. |
| `FR-JRN-004` | Students stalled in a stage beyond its expected duration MUST be flagged for intervention. |
| `FR-JRN-005` | The complete journey history MUST be viewable as a timeline in the student's own analytics view. |

## 22.11 Journey Intervention Matrix

| Signal | Stage | Intervention | Channel |
|---|---|---|---|
| Assessment not started in 7 days | ST-1 | Value-reminder message with 2-minute preview | Email + In-app |
| Assessment abandoned mid-way | ST-1 | Resume prompt with progress shown | Push + Email |
| No batch enrolment 21 days post-report | ST-2 | Free diagnostic test offer + counsellor call | SMS + Call |
| Attendance < 40% for 2 weeks | ST-2 | Mentor outreach, schedule adjustment offer | Call + In-app |
| Mock score declining across 3 tests | ST-2 | Plan regeneration + faculty session offer | In-app + Email |
| No college shortlist 14 days post-result | ST-3 | AI-generated shortlist delivered proactively | Email + In-app |
| Zero course enrolment in college Year 1 | ST-4 | Skill gap report + free micro-course | In-app + Email |
| Zero internship applications by Year 3 | ST-5 | Curated 5-internship shortlist | Push + Email |
| PRS < 40 in final year | ST-6 | Structured 12-week readiness programme enrolment | Call + In-app |
| 20+ applications, zero interviews | ST-7 | Resume review + profile audit by counsellor | Call + In-app |
| Offer received, no response in 5 days | ST-7 | Decision-support content + counsellor availability | Push + Call |

---

# Chapter 23 — Coaching Ecosystem

> **Purpose of this chapter:** To specify the complete coaching ecosystem — all actors, content architecture, delivery mechanics, assessment engine, quality controls, commercial rules and operational SLAs — for the eighteen supported examination and skill tracks.

## 23.1 Ecosystem Overview

| Element | Description |
|---|---|
| **Purpose** | Deliver structured, affordable, measurable examination and career-skill preparation |
| **Actors** | Student, Trainer/Faculty, Training Institute, Content Admin, Academic Team, Parent (V2) |
| **Delivery modes** | Live online classes, recorded lectures, self-paced modules, downloadable materials |
| **Assessment** | Diagnostic, sectional, full-length, previous-year and practice tests |
| **Commercial model** | Per-batch fee (student pays); revenue share with training partners |
| **Quality model** | Faculty vetting, content review, student ratings, outcome measurement |

## 23.2 Exam Track Architecture

### 23.2.1 Track Categories

| Category | Tracks | Student Segment |
|---|---|---|
| **Medical & Engineering Entrance** | NEET, JEE Main, JEE Advanced | Class 11/12, droppers |
| **University Entrance** | CUET | Class 12 |
| **Civil Services & State PSC** | UPSC, TNPSC | Graduates |
| **Central Government** | SSC, Banking, Railway | Graduates, 12th-pass |
| **Uniformed Services** | Defence (NDA/CDS/AFCAT), Police | 12th-pass, graduates |
| **Teaching** | TET, TRB | Graduates, B.Ed holders |
| **Career Skills** | Placement Prep, Coding Prep, Communication, Interview Prep | College students, graduates |
| **Foundation** | Class 11/12 Foundation | Class 11/12 |

### 23.2.2 Track Configuration Model

Every track is configured with the following, editable by `CONTENT_ADMIN` without deployment:

| Configuration | Description |
|---|---|
| Syllabus map | Hierarchical subject —' unit —' topic —' sub-topic structure with weightage |
| Exam pattern | Sections, question counts, durations, marking scheme, negative marking |
| Eligibility rules | Age, qualification, attempt limits |
| Exam calendar | Notification, application, admit card, exam and result dates |
| Cut-off history | Year-wise category-wise cut-offs |
| Content requirements | Required content types per topic |
| Assessment blueprint | Test composition rules by topic and difficulty |
| Language variants | Available instruction languages |

**Requirement `FR-TRACK-001`:** Adding a new exam track MUST be a configuration operation, not a code change. The system MUST support onboarding a new track within 5 business days of content availability.

## 23.3 Batch Model

### 23.3.1 Batch Types

| Type | Description | Duration | Typical Price Band |
|---|---|---|---|
| Foundation | Early preparation alongside school | 12-24 months | Mid |
| Regular | Standard full-syllabus preparation | 8-12 months | Mid-High |
| Repeater / Dropper | Intensive full-time preparation | 12 months | High |
| Crash | Pre-exam intensive revision | 2-3 months | Low-Mid |
| Test Series only | Mock tests without classes | 3-6 months | Low |
| Weekend | For working aspirants and school students | 10-14 months | Mid |
| Fast-track | Accelerated coverage | 4-6 months | Mid |

### 23.3.2 Batch Lifecycle

```

DRAFT - ' PENDING_APPROVAL - ' PUBLISHED - ' ENROLLING - ' RUNNING - ' COMPLETED - ' ARCHIVED
+----+
REJECTED CANCELLED PAUSED

```

| State | Rules |
|---|---|
| `DRAFT` | Editable by creator; not visible publicly |
| `PENDING_APPROVAL` | Submitted for academic review; SLA 2 business days |
| `PUBLISHED` | Visible publicly; enrolment not yet open |
| `ENROLLING` | Accepting enrolments until capacity or cut-off date |
| `RUNNING` | Classes in progress; late enrolment allowed if configured |
| `PAUSED` | Temporarily suspended; students notified; no billing |
| `CANCELLED` | Terminated; automatic full refund to all enrolled students |
| `COMPLETED` | All sessions delivered; certificates issued |
| `ARCHIVED` | Content retained for enrolled students; no new enrolment |

### 23.3.3 Batch Requirements

| ID | Requirement |
|---|---|
| `FR-BATCH-001` | Every batch MUST declare its complete schedule before publication. |
| `FR-BATCH-002` | Batch capacity MUST be enforced; enrolment beyond capacity MUST be blocked with a waitlist option. |
| `FR-BATCH-003` | Schedule changes MUST notify all enrolled students at least 24 hours in advance where possible, immediately otherwise. |
| `FR-BATCH-004` | Batch cancellation MUST trigger automatic full refunds within 7 business days. |
| `FR-BATCH-005` | Late enrolment MUST grant access to all prior recordings. |
| `FR-BATCH-006` | Faculty substitutions MUST be recorded and disclosed to enrolled students. |
| `FR-BATCH-007` | Batches MUST display real-time seats remaining when capacity is below 20%. |

## 23.4 Live Class Delivery

### 23.4.1 Capabilities

| Capability | Specification |
|---|---|
| Video and audio | HD video with adaptive bitrate; audio-only fallback below 200kbps |
| Screen share | Faculty screen and document sharing |
| Digital whiteboard | Annotation with save-to-materials |
| Chat | Text chat with moderation and faculty highlighting |
| Polls and quizzes | In-class polls with live results |
| Raise hand | Queued student questions |
| Attendance | Automatic capture of join/leave times and total duration |
| Recording | Automatic recording with post-processing |
| Breakout rooms | V2 |
| Live captions | V2 |

### 23.4.2 Requirements

| ID | Requirement |
|---|---|
| `FR-LIVE-001` | Live sessions MUST start within 3 minutes of scheduled time in —— 99% of cases. |
| `FR-LIVE-002` | Students MUST be able to join from 10 minutes before start. |
| `FR-LIVE-003` | The system MUST degrade gracefully to audio-only when bandwidth falls below 200kbps. |
| `FR-LIVE-004` | Recordings MUST be available within 2 hours of session end. |
| `FR-LIVE-005` | Attendance MUST be computed as (time present / session duration) and MUST count only sessions where the student was present —— 60% as "attended". |
| `FR-LIVE-006` | Session capacity MUST support at least 2,000 concurrent students per session. |
| `FR-LIVE-007` | Chat MUST support profanity filtering and faculty/moderator muting. |
| `FR-LIVE-008` | If a session fails to start within 15 minutes, the system MUST automatically notify students, mark the session as disrupted, and schedule a make-up session. |

### 23.4.3 Class Quality SLAs

| Metric | SLA |
|---|---|
| Session start punctuality | —— 99% within 3 minutes |
| Session completion without disruption | —— 98% |
| Recording availability | —— 99% within 2 hours |
| Audio quality complaints | —— 2% of sessions |
| Make-up session scheduling | Within 72 hours of a disrupted session |

## 23.5 Content Architecture

### 23.5.1 Content Types

| Type | Format | Usage |
|---|---|---|
| Live class | Streamed session | Primary teaching |
| Recorded lecture | Video | Revision and catch-up |
| Concept video | Short video (5-15 min) | Focused topic explanation |
| Notes | PDF | Reference and revision |
| Formula sheet | PDF | Quick reference |
| Previous year papers | PDF + interactive | Practice |
| Practice questions | Interactive | Topic-level drilling |
| Current affairs digest | Text/PDF | Government exam tracks |
| Mind maps | Image/PDF | Visual revision |
| Doubt archive | Text | Peer learning |

### 23.5.2 Content Governance

| Control | Requirement |
|---|---|
| Review | All content reviewed by the Academic Team before publication |
| Versioning | Content versioned; students notified of significant revisions |
| Accuracy reporting | Students can report errors; SLA 48 hours for review |
| Syllabus mapping | Every content item mapped to at least one syllabus topic |
| Coverage tracking | Track-level dashboard shows topic coverage gaps |
| Language variants | Content can carry multiple language versions with a shared topic mapping |

### 23.5.3 Content Protection

| ID | Requirement |
|---|---|
| `FR-CPROT-001` | Video MUST be delivered via signed, short-lived URLs (max 4 hours). |
| `FR-CPROT-002` | Video MUST carry a dynamic watermark with the student's identifier and timestamp. |
| `FR-CPROT-003` | Concurrent playback MUST be limited to a configurable device count (default 2). |
| `FR-CPROT-004` | Downloadable PDFs MUST be watermarked with the student identifier. |
| `FR-CPROT-005` | Screen recording detection MUST be attempted on supported platforms, with playback blocking where detected. |
| `FR-CPROT-006` | Abnormal download or streaming patterns MUST trigger automated account review. |

## 23.6 Assessment Engine

### 23.6.1 Test Blueprint System

Tests are generated from blueprints rather than hand-assembled, ensuring consistency.

| Blueprint Element | Description |
|---|---|
| Section definitions | Name, question count, duration, marking |
| Topic distribution | Percentage of questions per topic |
| Difficulty distribution | Percentage easy / medium / hard |
| Question type mix | MCQ single, MCQ multiple, numerical, matching |
| Randomisation | Question and option order shuffling per student |
| Anti-cheating | Question pool sampling so no two students receive identical papers (V2) |

### 23.6.2 Question Bank

| Attribute | Requirement |
|---|---|
| Minimum bank size per track | 5,000 questions at launch |
| Question metadata | Topic, sub-topic, difficulty, source, year, average time, discrimination index |
| Quality control | Peer review before activation; performance-based retirement |
| Calibration | Difficulty recalibrated from actual student performance after 500 attempts |
| Duplication check | Semantic duplicate detection at ingestion |

### 23.6.3 Result and Analytics Output

| Output | Detail |
|---|---|
| Raw score | Marks obtained with breakdown by section |
| Rank | All-India rank among all attempters of that test |
| Percentile | Percentile within the attempting cohort |
| Section analysis | Score, accuracy, attempts, time per section |
| Topic analysis | Accuracy by topic with strong/weak classification |
| Difficulty analysis | Performance by difficulty band |
| Time analysis | Time per question vs. cohort average; time wasted on incorrect answers |
| Comparison | Performance vs. top 10% of attempters |
| Improvement tracking | Score and percentile trajectory across all attempts |
| Recommendation | Prioritised list of topics to revise with linked content |

### 23.6.4 Requirements

| ID | Requirement |
|---|---|
| `FR-TEST-001` | Test timer MUST be server-authoritative; client clock manipulation MUST NOT affect the timer. |
| `FR-TEST-002` | Answers MUST auto-save within 10 seconds of selection. |
| `FR-TEST-003` | The test MUST auto-submit at timer expiry with all recorded answers. |
| `FR-TEST-004` | Results MUST be computed within 60 seconds of submission. |
| `FR-TEST-005` | Rank MUST be recomputed as additional students attempt the test, with the student's rank display updated on next view. |
| `FR-TEST-006` | Solutions MUST be released according to the test's configured release policy (immediate, after window close, or scheduled). |
| `FR-TEST-007` | Students MUST be able to re-attempt tests in practice mode without affecting ranking. |
| `FR-TEST-008` | The system MUST support at least 25,000 concurrent test-takers. |
| `FR-TEST-009` | Question-level analytics MUST feed back into difficulty calibration. |
| `FR-TEST-010` | Students MUST be able to report a question error directly from the solution view. |

## 23.7 Doubt Resolution System

### 23.7.1 Flow

```

Student posts doubt (text + optional image)
|
Auto-classification (subject, topic, urgency)
|
AI generates preliminary answer ( - 5 minutes)
|
Student marks resolved | ? | ? | ? | ? OR | ? | ? | ? | ? Escalate to faculty
|
Routed to subject faculty queue
|
Faculty responds (SLA by tier)
|
Student rates the resolution
|
High-quality resolutions added to public doubt archive

```

### 23.7.2 SLAs

| Tier | AI Response | Faculty Response |
|---|---|---|
| Free | 5 minutes | Not included |
| Standard batch | 5 minutes | 12 hours |
| Premium batch | 5 minutes | 6 hours |
| Elite membership | 5 minutes | 2 hours |

### 23.7.3 Requirements

| ID | Requirement |
|---|---|
| `FR-DBT-001` | Doubts MUST support text and up to 3 image attachments. |
| `FR-DBT-002` | AI preliminary responses MUST be clearly labelled as AI-generated. |
| `FR-DBT-003` | Students MUST be able to escalate to faculty in one action. |
| `FR-DBT-004` | Faculty response SLAs MUST be monitored with breach alerts. |
| `FR-DBT-005` | Resolved doubts MAY be published to a searchable archive after anonymisation and faculty approval. |
| `FR-DBT-006` | Students MUST be able to search the doubt archive before posting. |

## 23.8 Study Planner

### 23.8.1 Plan Generation Inputs

| Input | Use |
|---|---|
| Target exam and date | Determines total available time |
| Syllabus map with weightage | Determines topic priority |
| Current syllabus coverage | Determines remaining scope |
| Mock test performance by topic | Determines remediation priority |
| Declared available study hours per day | Determines daily capacity |
| Batch class schedule | Blocks time already committed |
| Historical adherence rate | Calibrates plan ambition |

### 23.8.2 Plan Output

| Element | Description |
|---|---|
| Daily tasks | Specific topics with content links and estimated durations |
| Weekly goals | Topic coverage and test targets |
| Revision cycles | Spaced repetition scheduling for completed topics |
| Test schedule | When to attempt which tests |
| Buffer time | Deliberate slack for slippage |
| Milestone checkpoints | Progress review points |

### 23.8.3 Requirements

| ID | Requirement |
|---|---|
| `FR-PLAN-001` | The plan MUST regenerate automatically when a full-length test reveals significant weak-area change. |
| `FR-PLAN-002` | The plan MUST adapt to actual adherence; persistent under-completion MUST reduce daily load and flag the student. |
| `FR-PLAN-003` | Students MUST be able to mark tasks complete, snooze or skip with a reason. |
| `FR-PLAN-004` | Adherence rate MUST be visible to the student and, with consent, to their mentor and parent. |
| `FR-PLAN-005` | The plan MUST guarantee full syllabus coverage before the exam date, or MUST explicitly warn the student that full coverage is not achievable at the current pace. |

## 23.9 Faculty Management

### 23.9.1 Faculty Onboarding

| Step | Requirement |
|---|---|
| Application | Credentials, teaching experience, subject expertise, sample lecture |
| Verification | Qualification documents, identity, prior institution references |
| Demo evaluation | Recorded demo lecture reviewed by Academic Team |
| Trial batch | Limited-cohort trial with student feedback |
| Approval | Full onboarding with rate card agreement |
| Continuous review | Quarterly review on ratings, attendance and outcomes |

### 23.9.2 Faculty Quality Metrics

| Metric | Threshold |
|---|---|
| Student rating | —— 4.0 / 5.0 |
| Class punctuality | —— 98% on time |
| Session completion | —— 99% |
| Doubt response SLA compliance | —— 95% |
| Student score improvement in their batches | Above track median |
| Content accuracy reports | —— 3 per 1,000 content items |

**Requirement `FR-FAC-001`:** Faculty falling below quality thresholds for two consecutive review cycles MUST be placed on a documented improvement plan; a third consecutive failure MUST trigger removal from active batches.

## 23.10 Coaching Commercial Rules

| Rule | Specification |
|---|---|
| Pricing authority | Platform sets price bands; training partners propose within bands; Academic + Finance approve |
| Revenue share | 60-75% to training partner depending on tier, per Chapter 17 |
| Refund policy | Full refund within 7 days if < 10% content consumed; pro-rata refund up to 30 days; no refund thereafter except batch cancellation |
| EMI | Available on all batches above —,—8,000 |
| Batch transfer | Student may transfer to another batch of the same track once, free of charge, within 14 days |
| Batch upgrade | Price difference payable; prior payment fully credited |
| Access duration | Content access for batch duration plus 6 months |
| Certificate criteria | —— 60% attendance and —— 50% test participation |

## 23.11 Coaching Ecosystem Metrics

| Metric | Y1 Target |
|---|---|
| Active batches | 220 |
| Total enrolments | 9,500 |
| Average batch fill rate | 72% |
| Live class attendance rate | 62% |
| Mock test participation | 70% |
| Mean percentile improvement | +15 points |
| Batch completion rate | 68% |
| Student rating (coaching) | —— 4.2 / 5.0 |
| Refund rate | —— 6% |
| Doubt SLA compliance | —— 95% |

---

# Chapter 24 — College Admission Ecosystem

> **Purpose of this chapter:** To specify the complete admission ecosystem covering student-side discovery through college-side lead management, admission confirmation, commission settlement, and the placement services that colleges also consume.

## 24.1 Ecosystem Overview

| Element | Description |
|---|---|
| **Purpose** | Make college selection transparent for students and admission acquisition efficient for colleges |
| **Actors** | Student, Parent, College Admin, College Counsellor, Channel Partner, Ellowring Ops |
| **Value exchange** | Students receive verified information and guided applications; colleges receive intent-scored leads and confirmed admissions |
| **Commercial model** | Per-admission commission, annual retainer, or per-lead — per Chapter 17 |

## 24.2 College Onboarding and Verification

### 24.2.1 Onboarding Flow

```

College applies (self-serve or sales-assisted)
|
Submits institutional documents
|
Ops verification (SLA: 3 business days)
| o | ? | ? Approved - ' Profile setup - ' Programme listing - ' Go live
| " | ? | ? Rejected - ' Reason communicated - ' Resubmission permitted
|
Contract execution (commercial terms)
|
Staff onboarding and training
|
Student bulk import (optional)
|
Active

```

### 24.2.2 Verification Checklist

| Document | Purpose | Mandatory |
|---|---|---|
| Registration/incorporation certificate | Legal existence | Yes |
| University affiliation letter | Academic legitimacy | Yes |
| AICTE/UGC/MCI/BCI approval (as applicable) | Regulatory approval | Yes |
| NAAC/NBA accreditation certificate | Quality accreditation | If claimed |
| Authorised signatory ID and authorisation letter | Signing authority | Yes |
| Address proof | Physical existence | Yes |
| Official domain email verification | Digital legitimacy | Yes |
| Bank account and cancelled cheque | Settlement | Yes |
| GST registration | Taxation | Yes |
| Prior year placement data (if claimed) | Claim substantiation | If claimed |

**Requirement `FR-CVER-001`:** No college may appear in public search results until verification is `APPROVED`. Verification status and date MUST be displayed on the public profile.

**Requirement `FR-CVER-002`:** Verification MUST be re-confirmed annually; lapsed verification MUST move the listing to a `VERIFICATION_PENDING` state with reduced visibility and a visible notice.

## 24.3 College Data Model

### 24.3.1 Profile Data Categories

| Category | Fields | Source Label |
|---|---|---|
| Identity | Name, type, established year, affiliation, approvals | Verified |
| Location | Address, city, state, coordinates, connectivity | Verified |
| Accreditation | NAAC grade, NBA programmes, rankings | Verified |
| Programmes | Name, degree, duration, seats, eligibility, exams accepted | Verified |
| Fees | Tuition, hostel, other charges, total, payment schedule | Verified |
| Placements | Placement %, highest/average/median package, recruiters, sector split | Verified or Declared |
| Infrastructure | Campus area, labs, library, hostel, sports, transport | Declared |
| Faculty | Count, qualifications, student-faculty ratio | Declared |
| Scholarships | Name, eligibility, amount, process | Verified |
| Media | Photographs, videos, brochure, virtual tour | Declared |
| Reviews | Student ratings and text reviews | Platform-verified authorship |

**Requirement `FR-COL-031`:** Placement statistics claimed as `Verified` MUST be substantiated by supporting documentation reviewed by Ops, or MUST be derived from placements recorded on the Ellowring platform. All other statistics MUST be labelled `Institution Declared`.

## 24.4 Student-Side Admission Journey

### 24.4.1 Discovery to Admission

```

Exam result captured / marks entered
|
AI generates shortlist (Ambitious / Target / Safe)
|
Student explores profiles, compares, checks eligibility
|
Student shortlists colleges
|
Student initiates application
|
Document upload and verification
|
Application fee payment (where applicable)
|
Application submitted - ' College reviews
|
College decision: Offer / Waitlist / Reject
|
Student accepts offer - ' Admission fee payment
|
Dual confirmation (student + college)
|
Admission recorded - ' Commission accrued
|
Student stage transitions to COLLEGE

```

### 24.4.2 Shortlist Generation Logic

| Bucket | Definition | Count |
|---|---|---|
| **Ambitious** | Admission probability 15-40% | 3-5 colleges |
| **Target** | Admission probability 40-75% | 5-8 colleges |
| **Safe** | Admission probability > 75% | 3-5 colleges |

Inputs: entrance score/rank, board marks, category, state domicile, budget, preferred locations, preferred programmes, historical cut-offs, seat availability.

**Requirement `FR-SHORT-001`:** Every shortlisted college MUST display the estimated admission probability and the basis for that estimate. Estimates MUST be labelled as estimates, not guarantees.

### 24.4.3 Comparison Parameters

Students may compare up to 4 colleges across: Fees (total and annual) · Placement % · Average package · Highest package · Median package · Top recruiters · Accreditation · Ranking · Seats · Eligibility · Location · Hostel availability · Hostel fees · Faculty ratio · Campus size · Labs and facilities · Scholarships · Student reviews rating · Alumni network · Distance from student's location.

## 24.5 College-Side Lead Management

### 24.5.1 Lead Lifecycle

```

GENERATED - ' ASSIGNED - ' CONTACTED - ' QUALIFIED - ' APPLICATION_STARTED
- ' APPLICATION_SUBMITTED - ' ADMITTED - ' CONFIRMED
* NOT_INTERESTED / UNREACHABLE / LOST_TO_COMPETITOR

```

### 24.5.2 Lead Management Capabilities

| Capability | Description |
|---|---|
| Lead inbox | Real-time lead feed with score, source and student summary |
| Auto-assignment | Round-robin or rule-based assignment to counsellors |
| Lead scoring | Hot/Warm/Cold per §21.4.4 |
| Contact logging | Call, email and message logging with outcomes |
| Follow-up scheduling | Task creation with reminders |
| Bulk actions | Bulk status update, bulk messaging (template-based, consent-respecting) |
| Duplicate detection | Automatic identification of duplicate leads |
| Conversion recording | Marking leads as converted with the admission record |
| Analytics | Lead volume, conversion rate by source, counsellor performance, time-to-contact |

### 24.5.3 Lead Quality Guarantees

| Guarantee | Specification |
|---|---|
| No duplicates | A student is never delivered twice as a new lead to the same college within 180 days |
| Verified contact | Mobile number verified via OTP before lead delivery |
| Genuine intent | Only students who have viewed the college profile or matched shortlist criteria are delivered as leads |
| Credit policy | Leads proven to be invalid (wrong number, non-existent student) are credited back within 7 days of report |
| Consent | Lead delivery requires the student's consent to be contacted by colleges |

**Requirement `FR-LEAD-001`:** Students MUST be able to opt out of college contact at any time; opt-out MUST take effect within 24 hours across all colleges.

## 24.6 Admission Confirmation and Commission

### 24.6.1 Dual Confirmation Protocol

| Step | Actor | Action |
|---|---|---|
| 1 | College | Marks the application as `ADMITTED` with admission number and date |
| 2 | Platform | Notifies student to confirm admission |
| 3 | Student | Confirms admission (or disputes) |
| 4 | Platform | Creates `AdmissionConfirmation` record |
| 5 | Platform | Opens a 15-day dispute window |
| 6 | Platform | On window close without dispute, accrues commission |
| 7 | Platform | Invoices college per commercial terms |
| 8 | Platform | Credits channel partner commission where attributable |

### 24.6.2 Dispute Handling

| Dispute Type | Resolution |
|---|---|
| College claims the student was not sourced from Ellowring | Ops reviews attribution trail (first touch, profile views, application record); decision within 10 business days |
| Student claims they did not take admission | Ops requests admission proof from college; reverses if unsubstantiated |
| Duplicate attribution across partners | Last-touch referral code wins; ledger corrected |
| Admission subsequently cancelled | Commission reversed pro-rata per contract terms |

## 24.7 College Placement Services

Colleges consume placement functionality in addition to admissions. Full hiring mechanics are in Chapter 29; this section covers college-specific capabilities.

### 24.7.1 Placement Drive Management

| Capability | Description |
|---|---|
| Drive creation | Company, date, roles, eligibility, process stages, package details |
| Company invitation | Invite from the Ellowring network or add an external company |
| Eligibility broadcast | Automatic identification and notification of eligible students |
| Student registration | Students register with confirmation and commitment tracking |
| Pre-placement talk | Scheduled session with attendance tracking |
| Round management | Aptitude, technical, GD, HR round configuration with results entry |
| Bulk shortlisting | Filter and shortlist in bulk with automatic student notification |
| Interview scheduling | Slot allocation with conflict detection |
| Offer recording | Offers with package details and acceptance tracking |
| Drive analytics | Funnel, conversion, package distribution, department split |

### 24.7.2 Placement Policy Configuration

| Policy | Configurable Options |
|---|---|
| One-offer policy | Students with an offer above a threshold cannot sit for further drives |
| Dream company policy | Students may attempt one "dream" company regardless of existing offers |
| Minimum CGPA | Global or per-drive |
| Backlog policy | Maximum active backlogs permitted |
| Attendance requirement | Minimum attendance to be placement-eligible |
| Registration commitment | Penalty for registering and not attending |

**Requirement `FR-PLC-001`:** Placement policies MUST be configurable per college and MUST be automatically enforced during student registration for drives, with clear explanation when a student is blocked.

### 24.7.3 Student Readiness Tracking

Colleges see, with student consent, a readiness view enabling early intervention.

| View | Content |
|---|---|
| Readiness distribution | Histogram of PRS across the cohort |
| At-risk list | Students with PRS < 40 in their final year |
| Skill gap summary | Most common missing skills across the cohort vs. recruiter demand |
| Intervention tracking | Actions taken and outcome |
| Department comparison | Readiness by department |

## 24.8 College Reports

| Report | Contents | Format | Frequency |
|---|---|---|---|
| Placement Summary | Placement %, package statistics, recruiter list, department split | PDF/XLSX | On-demand, annual |
| NAAC/NBA Data Pack | Outcome data formatted for accreditation criteria | XLSX | On-demand |
| Admission Funnel | Leads, contacts, applications, admissions by source and programme | XLSX | Monthly |
| Counsellor Performance | Leads handled, contact rate, conversion, response time | XLSX | Monthly |
| Student Outcome Register | Per-student placement/higher-study outcome | XLSX | Annual |
| Recruiter Feedback | Aggregated employer feedback on the college's candidates | PDF | Annual |
| Peer Benchmark | Anonymised comparison against similar institutions | PDF | Annual |

**Requirement `FR-CRPT-001`:** All reports MUST be generatable on demand within 60 seconds for datasets up to 10,000 students, and MUST be schedulable for automated delivery.

## 24.9 Ecosystem Metrics

| Metric | Y1 Target |
|---|---|
| Verified colleges listed | 5,000 |
| Partner colleges (paying) | 400 |
| Leads delivered | 180,000 |
| Lead —' application conversion | 18% |
| Application —' admission conversion | 32% |
| Confirmed admissions | 12,000 |
| Lead dispute rate | —— 3% |
| College retention (annual) | —— 85% |
| College satisfaction (CSAT) | —— 4.2 / 5.0 |
| Median lead delivery latency | < 60 seconds |

---

# Chapter 25 — Study Abroad Ecosystem

> **Purpose of this chapter:** To specify the study abroad ecosystem — country and university discovery, application management, test preparation linkage, documentation, visa tracking, financial planning and counsellor workflow — with transparency as the defining design principle.

## 25.1 Ecosystem Overview

| Element | Description |
|---|---|
| **Purpose** | Replace opaque consultancy with a transparent, milestone-tracked, digitally-managed overseas education pathway |
| **Actors** | Student, Parent, Ellowring Counsellor, International University, Ops, Channel Partner |
| **Version** | V2 |
| **Commercial model** | Tiered student service fee + disclosed university commission |
| **Defining principle** | The student sees everything: every fee, every commission, every deadline, every document status |

## 25.2 Supported Destinations (V2 Launch)

| Country | Popular Programmes | Typical Annual Cost (Tuition + Living) | Work Rights | PR Pathway |
|---|---|---|---|---|
| Germany | MS Engineering, Data Science, Automotive | —,—12,000 - —,—18,000 | 120 full / 240 half days | Strong |
| Canada | MS CS, Business, Health Sciences | CAD 35,000 - 55,000 | 20 hrs/week | Strong |
| United Kingdom | MSc Management, Data, Finance | £28,000 - £42,000 | 20 hrs/week | Moderate |
| Australia | MS IT, Engineering, Nursing | AUD 45,000 - 65,000 | 48 hrs/fortnight | Strong |
| Ireland | MSc Computing, Pharma, Business | —,—25,000 - —,—38,000 | 20 hrs/week | Moderate |
| USA | MS CS, Engineering, Management | USD 45,000 - 80,000 | On-campus 20 hrs | Competitive |
| New Zealand | MS IT, Agriculture, Hospitality | NZD 38,000 - 55,000 | 20 hrs/week | Moderate |
| Singapore | MSc Business, Computing | SGD 40,000 - 60,000 | Limited | Competitive |
| France | MSc Management, Luxury, Engineering | —,—18,000 - —,—30,000 | 964 hrs/year | Moderate |
| Netherlands | MSc Engineering, Business, Design | —,—20,000 - —,—32,000 | 16 hrs/week | Moderate |

## 25.3 Service Packages

| Package | Price | Applications | Counsellor | Included Services |
|---|---|---|---|---|
| **Self-Guided** | Free | Unlimited (self-managed) | None | University database, cost calculator, eligibility checker, milestone tracker, document vault, checklists, community |
| **Essential** | —,—24,999 | 5 | Shared queue | Shortlist review, SOP review (2 rounds), document checklist verification, application submission support, visa guidance documentation |
| **Premium** | —,—59,999 | 10 | Dedicated | All Essential + SOP/LOR writing support, university communication handling, scholarship applications, visa filing support, interview preparation, loan guidance |
| **Elite** | —,—1,24,999 | Unlimited | Dedicated senior | All Premium + scholarship strategy, accommodation assistance, pre-departure briefing, airport pickup coordination, first-month settlement support, alumni connect |

**Requirement `FR-ABR-001`:** The platform MUST display, on the pricing page and at checkout, an explicit statement that Ellowring may receive a commission from partner universities, and MUST state that this does not increase the student's tuition.

## 25.4 Core Modules

### 25.4.1 Country Explorer

| Element | Content |
|---|---|
| Overview | Education system, popular programmes, intake cycles, language requirements |
| Cost breakdown | Tuition ranges by programme, living costs by city, visa fees, insurance, travel |
| Admission requirements | Academic, English proficiency, standardised tests, work experience |
| Visa process | Type, requirements, financial proof, processing time, success rate |
| Work rights | During study, post-study work visa duration, conditions |
| PR pathway | Eligibility route, timeline, points systems where applicable |
| Living conditions | Accommodation types and costs, transport, healthcare, Indian community |
| Comparison | Side-by-side country comparison across 15 parameters |

### 25.4.2 University Database

| Field Group | Fields |
|---|---|
| Identity | Name, country, city, type, established, ranking (multiple systems) |
| Programmes | Name, degree, duration, intake months, tuition, curriculum |
| Requirements | Minimum GPA/percentage, English test scores, GRE/GMAT, work experience, prerequisites |
| Application | Deadlines by intake, fee, required documents, process |
| Outcomes | Employment rate, average starting salary, notable employers |
| Scholarships | Available scholarships with eligibility and amounts |
| Partnership | Whether an Ellowring partner (affects application support, not ranking) |

**Requirement `FR-ABR-002`:** Partner universities MUST NOT receive preferential ranking in search results. Partnership status MAY be displayed as a badge indicating streamlined application support, but MUST NOT influence sort order.

### 25.4.3 Eligibility Checker

Compares the student's academic profile, test scores and experience against a programme's stated requirements, producing:

| Output | Detail |
|---|---|
| Eligibility verdict | Eligible / Conditionally Eligible / Not Eligible |
| Criterion breakdown | Each requirement with met/unmet status and the gap |
| Improvement path | What the student must do to become eligible (e.g., "IELTS 6.5 —' 7.0") |
| Alternative programmes | Similar programmes where the student is already eligible |

### 25.4.4 Cost Calculator

| Input | Output |
|---|---|
| Country, city, programme, duration, lifestyle level, dependants | Tuition (total) · Living costs (monthly and total) · Visa and application fees · Health insurance · Travel · One-time setup · **Total cost of study** · Estimated part-time earnings offset · **Net funding requirement** · Loan EMI estimate at prevailing rates |

**Requirement `FR-ABR-003`:** The calculator MUST show a currency-converted total in INR using a rate refreshed at least daily, and MUST display the rate and its timestamp.

### 25.4.5 Milestone Tracker

The central organising interface of the student's abroad journey.

| Phase | Milestones |
|---|---|
| **1. Planning (Month 1-2)** | Country selection · Programme selection · Budget confirmation · Timeline agreement |
| **2. Testing (Month 2-6)** | IELTS/TOEFL/PTE registration · Test preparation · Test attempt · Score received · GRE/GMAT (if required) |
| **3. Documentation (Month 4-7)** | Academic transcripts · Degree certificates · SOP drafting · SOP finalisation · LOR requests · LOR received · CV preparation · Portfolio (if required) |
| **4. Application (Month 6-9)** | University shortlist finalised · Application forms · Application fees paid · Applications submitted · Interview (if required) |
| **5. Decision (Month 8-11)** | Offers received · Offer comparison · Offer accepted · Deposit paid |
| **6. Finance (Month 9-11)** | Loan application · Loan sanction · Financial proof prepared · Funds transferred |
| **7. Visa (Month 10-12)** | Visa application · Biometrics · Visa interview · Visa decision |
| **8. Pre-Departure (Month 11-12)** | Accommodation booked · Flight booked · Insurance purchased · Forex arranged · Pre-departure briefing · Departure |

**Requirement `FR-ABR-004`:** Each milestone MUST have an owner (student or counsellor), a target date derived from the intake deadline, a status, and automated reminders at T-14, T-7 and T-2 days.

### 25.4.6 Document Vault

| Capability | Requirement |
|---|---|
| Upload | PDF, JPG, PNG up to 20MB per file |
| Categorisation | Automatic categorisation by document type |
| Verification | Counsellor marks documents verified or requests correction |
| Version control | Multiple versions retained with the active version marked |
| Sharing | Documents shared with universities only with explicit student action |
| Security | Encrypted at rest; access logged; signed URLs with short expiry |
| Checklist | Per-university document checklist with completion status |
| Expiry tracking | Passport and test score validity tracked with alerts |

### 25.4.7 SOP and LOR Support

| Service | Essential | Premium | Elite |
|---|---|---|---|
| SOP template and guidance | Yes | Yes | Yes |
| AI SOP draft generation | Yes | Yes | Yes |
| Counsellor SOP review | 2 rounds | Unlimited | Unlimited |
| Counsellor SOP writing support | No | Yes | Yes |
| LOR template and request tracking | Yes | Yes | Yes |
| LOR drafting support | No | Yes | Yes |
| University-specific customisation | No | Yes | Yes |

**Requirement `FR-ABR-005`:** AI-generated SOP drafts MUST be clearly labelled as drafts requiring substantial personalisation, MUST include a plagiarism-risk warning, and MUST NOT be submittable directly without student editing.

### 25.4.8 Visa Tracking

| Element | Detail |
|---|---|
| Requirement checklist | Country-specific visa document checklist |
| Financial proof calculator | Required funds calculation per country rules |
| Application status | Submitted, biometrics, under process, decision |
| Interview preparation | Common questions, mock interview (Premium+) |
| Timeline expectations | Country-specific processing time with current averages |
| Rejection support | Rejection reason analysis and reapplication guidance |

### 25.4.9 Financial Planning

| Capability | Description |
|---|---|
| Loan eligibility | Estimate based on family income, collateral, co-applicant |
| Lender comparison | Interest rates, processing fees, moratorium, collateral requirements |
| Loan application referral | Referral to partner lenders (commission disclosed) |
| Scholarship database | Searchable scholarships filtered by country, university, eligibility |
| Scholarship application tracking | Deadlines, status, outcomes |
| Forex guidance | Remittance options and cost comparison |

## 25.5 Counsellor Workflow

### 25.5.1 Counsellor Dashboard

| Widget | Content |
|---|---|
| Assigned students | List with package tier, current phase, next milestone, days to deadline |
| At-risk students | Students with overdue milestones |
| Today's tasks | Reviews due, calls scheduled, documents to verify |
| Application pipeline | Applications by status across all assigned students |
| Deadline calendar | University deadlines across the caseload |
| Performance | Students served, offers secured, visa success rate, satisfaction rating |

### 25.5.2 Counsellor SLAs

| Activity | SLA |
|---|---|
| Initial consultation after purchase | 2 business days |
| Document review | 3 business days |
| SOP review round | 5 business days |
| Query response | 24 hours |
| Application submission after student approval | 3 business days |
| Milestone status update | Within 24 hours of change |

### 25.5.3 Counsellor Caseload Limits

| Package | Maximum Active Students per Counsellor |
|---|---|
| Essential (shared) | 80 |
| Premium (dedicated) | 35 |
| Elite (dedicated senior) | 18 |

## 25.6 Transparency Requirements

| ID | Requirement |
|---|---|
| `FR-ABR-011` | The platform MUST display the exact student service fee before any commitment, with no additional charges permitted later. |
| `FR-ABR-012` | The platform MUST disclose that university commissions are received and MUST state that they do not affect student tuition. |
| `FR-ABR-013` | University search results MUST NOT be ordered by partnership status or commission rate. |
| `FR-ABR-014` | Any lender or service-provider referral MUST disclose whether Ellowring receives a referral fee. |
| `FR-ABR-015` | Students MUST be able to see the complete status and history of every document and application at all times. |
| `FR-ABR-016` | Refund terms MUST be stated per milestone: a defined refund schedule based on services already rendered. |
| `FR-ABR-017` | The platform MUST NOT guarantee admission or visa outcomes in any communication. |

## 25.7 Refund Policy Structure

| Stage at Cancellation | Refund |
|---|---|
| Before initial consultation | 90% (10% administrative) |
| After consultation, before shortlist finalisation | 70% |
| After shortlist, before application submission | 45% |
| After first application submitted | 20% |
| After 50% of applications submitted | 0% |
| Visa rejection (with Ellowring-verified complete documentation) | 30% of package fee |

## 25.8 Ecosystem Metrics

| Metric | Y2 Target | Y3 Target |
|---|---|---|
| Students served | 900 | 3,000 |
| Universities in database | 3,000 | 8,000 |
| Partner universities | 120 | 400 |
| Application-to-offer rate | 62% | 68% |
| Visa success rate | 88% | 92% |
| Average offers per student | 3.2 | 3.8 |
| Milestone on-time completion | 78% | 85% |
| Student satisfaction | 4.3 / 5.0 | 4.5 / 5.0 |
| Counsellor SLA compliance | 92% | 96% |

---

# Chapter 26 — Course Ecosystem

> **Purpose of this chapter:** To specify the skill course ecosystem — catalogue architecture, content standards, learning delivery, assessment and certification, partner content supply, and the demand-linkage mechanism that differentiates Ellowring courses from generic course marketplaces.

## 26.1 Ecosystem Overview

| Element | Description |
|---|---|
| **Purpose** | Deliver skills that map directly to employer demand visible on the same platform |
| **Actors** | Student, Instructor, Training Institute, Content Admin, Employer (demand signal), Mentor |
| **Differentiator** | Every course displays live hiring demand for the skill it teaches |
| **Commercial model** | Per-course fee, track bundles, premium-tier discounts, partner revenue share |

## 26.2 The Demand-Linkage Mechanism

This is the defining feature of the Course Ecosystem.

### 26.2.1 How It Works

```

Employers post jobs/internships with structured skill requirements
|
Skill taxonomy normalises skill names across postings
|
Demand index computed per skill: open postings, median salary, growth trend
|
Each course is mapped to the skills it teaches
|
Course pages display: "X open opportunities require this skill"
|
Students see the employment value of a course before purchasing
|
Course completion adds verified skills to the student profile
|
Verified skills increase match scores on those same postings
|
Placement outcomes feed back into course ROI reporting

```

### 26.2.2 Requirements

| ID | Requirement |
|---|---|
| `FR-DMD-001` | The platform MUST maintain a normalised skill taxonomy with synonym mapping. |
| `FR-DMD-002` | Every course MUST declare the skills it teaches, mapped to the taxonomy. |
| `FR-DMD-003` | Every job and internship posting MUST capture required skills mapped to the taxonomy. |
| `FR-DMD-004` | The demand index per skill MUST be recomputed at least hourly. |
| `FR-DMD-005` | Course pages MUST display the current open-opportunity count and median salary for the taught skills. |
| `FR-DMD-006` | Where a skill has fewer than 5 open opportunities, the count MUST be suppressed rather than displayed as a low number. |
| `FR-DMD-007` | Course completion MUST add the taught skills to the student's verified skill profile within 1 hour. |
| `FR-DMD-008` | Job match scores MUST recompute within 1 hour of a skill profile change. |

## 26.3 Course Catalogue Architecture

### 26.3.1 Hierarchy

```

Career Track (e.g., "Full Stack Developer")
| " | ? | ? Course (e.g., "React Fundamentals")
| " | ? | ? Module (e.g., "State Management")
| " | ? | ? Lesson (e.g., "useState and useReducer")
| " | ? | ? Content Item (video / text / resource / quiz)

```

### 26.3.2 Course Levels

| Level | Prerequisites | Typical Duration | Assessment Rigour |
|---|---|---|---|
| Beginner | None | 2-6 weeks | Quizzes + basic assignment |
| Intermediate | Beginner course or equivalent | 6-10 weeks | Quizzes + graded assignments + final assessment |
| Advanced | Intermediate + demonstrated skill | 10-16 weeks | Assignments + capstone project + proctored assessment |
| Specialisation | Multiple advanced courses | 3-6 months | Full portfolio project + comprehensive assessment |

### 26.3.3 Career Tracks (Launch Set)

| Track | Courses | Duration | Target Role |
|---|---|---|---|
| Full Stack Developer | 6 | 6 months | Software Engineer |
| Data Analyst | 5 | 4 months | Data Analyst |
| Digital Marketing Specialist | 5 | 4 months | Marketing Executive |
| UI/UX Designer | 5 | 5 months | Product Designer |
| Business Analyst | 4 | 4 months | Business Analyst |
| Cloud & DevOps Associate | 5 | 5 months | DevOps Engineer |
| Financial Analyst | 5 | 4 months | Finance Associate |
| HR Generalist | 4 | 3 months | HR Executive |
| Placement Readiness | 4 | 3 months | Any fresher role |

## 26.4 Content Standards

### 26.4.1 Mandatory Course Elements

| Element | Requirement |
|---|---|
| Outcome statement | 3-6 concrete capabilities the learner will possess on completion |
| Prerequisites | Explicitly stated |
| Curriculum | Full module and lesson listing with durations, visible before purchase |
| Preview content | At least 10% of lessons freely previewable |
| Practical component | At least one graded assignment or project |
| Assessment | Final assessment with a defined pass mark |
| Instructor profile | Credentials, experience, other courses, rating |
| Resources | Downloadable materials, code repositories, reference links |
| Q&A | Active instructor participation required |
| Update commitment | Stated review cycle |

### 26.4.2 Video Standards

| Standard | Requirement |
|---|---|
| Resolution | Minimum 720p; 1080p preferred |
| Audio | Clear, noise-free, consistent levels; minimum 128kbps |
| Lesson length | 5-20 minutes per lesson |
| Captions | English captions mandatory; regional captions in V2 |
| Adaptive streaming | Multiple bitrate renditions with automatic switching |
| Accessibility | Transcripts available for all video content |

### 26.4.3 Content Review Gate

| Check | Reviewer | Blocking |
|---|---|---|
| Technical accuracy | Subject matter expert | Yes |
| Curriculum completeness vs. outcome statement | Academic team | Yes |
| Video and audio quality | Content ops | Yes |
| Caption accuracy | Content ops | Yes |
| Assessment validity | Academic team | Yes |
| Plagiarism / IP clearance | Legal | Yes |
| Skill taxonomy mapping | Content admin | Yes |

**Requirement `FR-CRS-021`:** No course may be published without passing all blocking review checks. Review SLA is 5 business days from submission.

## 26.5 Learning Delivery

### 26.5.1 Course Player

| Feature | Specification |
|---|---|
| Video player | Speed control 0.5—--2—-, quality selector, captions, fullscreen, picture-in-picture |
| Resume | Auto-resume from last position per lesson |
| Curriculum sidebar | Full course structure with completion state, collapsible |
| Notes | Timestamped personal notes with export |
| Bookmarks | Save specific timestamps with labels |
| Resources | Per-lesson downloadable materials |
| Q&A | Ask questions inline at a timestamp |
| Transcript | Searchable, click-to-seek transcript |
| Progress | Per-lesson, per-module and course-level progress |
| Keyboard shortcuts | Play/pause, seek, speed, fullscreen |

### 26.5.2 Progress Computation

**Requirement `FR-CRS-022`:** Lesson completion MUST require —— 90% of video duration watched (excluding seek-skips) or explicit completion of a text lesson. Course progress MUST be duration-weighted, not lesson-count-weighted.

### 26.5.3 Assignments

| Type | Submission | Grading |
|---|---|---|
| File upload | Documents, code archives, design files | Instructor rubric-based |
| Text response | In-platform editor | Instructor or AI-assisted |
| Link submission | GitHub, deployed URL, portfolio link | Instructor review |
| Auto-graded code | Code editor with test cases | Automated |
| Peer review | Submission reviewed by 3 peers | Peer + instructor moderation (V2) |

| ID | Requirement |
|---|---|
| `FR-ASG-001` | Assignments MUST state their rubric before submission. |
| `FR-ASG-002` | Grading SLA MUST be 5 business days; breaches MUST alert the instructor and content ops. |
| `FR-ASG-003` | Students MUST be permitted at least one resubmission after feedback. |
| `FR-ASG-004` | Auto-graded submissions MUST return results within 60 seconds. |

## 26.6 Assessment and Certification

### 26.6.1 Final Assessment

| Element | Specification |
|---|---|
| Gating | Available after —— 80% content completion |
| Format | MCQ, scenario-based, and practical components depending on level |
| Duration | 30-120 minutes by level |
| Pass mark | 60% default; configurable per course |
| Attempts | 3 attempts included; additional attempts chargeable |
| Cooling period | 48 hours between attempts |
| Question pool | Randomised from a pool at least 3—- the test length |
| Proctoring | Browser-lock and webcam proctoring for advanced certifications (V2) |

### 26.6.2 Certification Criteria

| Course Level | Criteria |
|---|---|
| Beginner | 100% lessons + all quizzes passed |
| Intermediate | 100% lessons + all assignments graded —— 60% + final assessment —— 60% |
| Advanced | 100% lessons + all assignments —— 65% + capstone graded —— 65% + final assessment —— 65% |
| Track | All constituent course certificates + track capstone |

### 26.6.3 Certificate Value Chain

| Step | Mechanism |
|---|---|
| Issuance | Automatic within 24 hours of criteria satisfaction |
| Verification | Public code-based verification at `/verify` |
| Employer visibility | Verified badge shown inline in the ATS candidate view |
| Profile integration | Auto-added to student profile, portfolio and resume |
| Skill propagation | Skills added to the verified skill profile |
| Sharing | One-click LinkedIn share, PDF and image download |

## 26.7 Partner Content Supply

### 26.7.1 Partner Types

| Partner Type | Content Contribution | Revenue Share |
|---|---|---|
| Training Institute | Full courses with own instructors | 60-75% |
| Independent Instructor | Individual courses | 55-65% |
| Industry Partner | Corporate-endorsed certification courses | Negotiated |
| Ellowring In-House | First-party courses | 100% retained |

### 26.7.2 Partner Content Workflow

```

Partner submits course proposal (outline, outcomes, instructor credentials)
|
Academic team reviews proposal (SLA 5 business days)
- Approved
Partner produces content in the platform authoring tools
|
Partner submits for review
|
Content review gate (§26.4.3)
- Passed
Pricing agreed within platform bands
|
Course published
|
Ongoing: ratings monitored, content refresh required annually

```

### 26.7.3 Partner Quality Requirements

| Metric | Minimum Threshold | Consequence of Breach |
|---|---|---|
| Course rating | 3.8 / 5.0 | Improvement plan; delisting after 2 cycles |
| Q&A response rate | 85% within 5 days | Warning; reduced visibility |
| Assignment grading SLA | 90% within 5 days | Warning; reduced visibility |
| Refund rate | —— 12% | Content review triggered |
| Content freshness | Reviewed annually | Marked "may be outdated" |

## 26.8 Pricing and Access Rules

| Rule | Specification |
|---|---|
| Access duration | 12 months minimum from purchase; lifetime for track purchases |
| Refund window | 7 days if < 20% content consumed |
| Track discount | 25-35% versus purchasing constituent courses individually |
| Premium member discount | 5% (Plus) / 10% (Pro) / 15% (Elite) |
| Institutional bulk pricing | Volume discounts for college-purchased seats |
| Free courses | At least 15 genuinely free courses maintained at all times |
| Preview | Minimum 10% of every course freely previewable |

## 26.9 Ecosystem Metrics

| Metric | Y1 Target |
|---|---|
| Published courses | 320 |
| Career tracks | 9 |
| Course enrolments | 34,000 |
| Course completion rate | 55% |
| Certificate issuance | 18,700 |
| Average course rating | —— 4.2 / 5.0 |
| Assignment grading SLA compliance | —— 90% |
| Refund rate | —— 8% |
| Skill-to-job match improvement post-course | +18 percentile points |
| Partner-supplied course share | 60% |

---

# Chapter 27 — Internship Ecosystem

> **Purpose of this chapter:** To specify the internship ecosystem — employer posting, verification, student discovery and application, selection, active internship management, evaluation and certification — with a design centred on eliminating ghost and exploitative internships.

## 27.1 Ecosystem Overview

| Element | Description |
|---|---|
| **Purpose** | Provide verified, meaningful internship experiences with structured evaluation and portable proof |
| **Actors** | Student, Company Admin, HR Recruiter, Internship Supervisor, College TPO, Ops |
| **Defining principle** | Every internship is from a verified employer with a verified scope of work and mandatory evaluation |
| **Commercial model** | Free student applications; paid guaranteed programmes; employer featured postings and bulk packs |

## 27.2 Internship Types

| Type | Duration | Mode | Stipend | Typical Purpose |
|---|---|---|---|---|
| Summer Internship | 6-8 weeks | On-site / Remote | Paid | Curriculum requirement, exposure |
| Winter Internship | 3-4 weeks | Remote mostly | Paid / Unpaid | Short exposure |
| Semester Internship | 4-6 months | On-site / Hybrid | Paid | Deep experience, often credit-bearing |
| Part-Time Internship | 3-6 months | Remote | Paid | Alongside academics |
| Virtual Internship | 4-8 weeks | Remote | Paid / Certificate-only | Scale exposure |
| Pre-Placement Internship | 2-6 months | On-site | Paid | PPO conversion pipeline |
| Research Internship | 2-6 months | On-site / Remote | Stipend / Fellowship | Academic research |

## 27.3 Employer Verification for Internships

**No internship may be published by an unverified employer.** Beyond company verification (Chapter 29), internship postings undergo posting-level checks.

| Check | Requirement |
|---|---|
| Company verification | Must be `VERIFIED` status |
| Scope of work | Must describe concrete responsibilities, not generic filler |
| Supervisor named | A named supervisor with a company email must be assigned |
| Stipend disclosure | Amount stated, or explicitly marked unpaid with justification |
| Unpaid justification | Unpaid internships require a stated learning rationale and are flagged for Ops review |
| No fee to student | Any posting requesting payment from students is automatically rejected and the employer flagged |
| Duration and hours | Explicit working hours; must not exceed statutory norms for interns |
| Certificate commitment | Employer commits to issuing completion evaluation |

| ID | Requirement |
|---|---|
| `FR-INT-011` | Internship postings requesting any payment, deposit or "training fee" from students MUST be automatically rejected and the employer account suspended pending review. |
| `FR-INT-012` | Unpaid internships MUST be visually distinguished and MUST NOT exceed 20% of any employer's active postings. |
| `FR-INT-013` | Employers who fail to issue completion evaluations for —— 20% of their interns MUST be blocked from new postings until remediated. |

## 27.4 Student Discovery and Application

### 27.4.1 Discovery

| Capability | Detail |
|---|---|
| Search | Free text with autocomplete on role, skill, company |
| Filters | Category, location (incl. Remote), duration, stipend range, start date, work mode, company size, PPO availability |
| Recommendations | AI-matched internships ranked by fit with explanation |
| Match score | 0-100 with matched and missing skills displayed |
| Saved searches | With email/push alerts for new matches |
| Deadline alerts | Notifications at T-3 and T-1 days for saved internships |

### 27.4.2 Application

| ID | Requirement |
|---|---|
| `FR-INT-021` | Application MUST be completable in —— 3 clicks for a student with a complete profile. |
| `FR-INT-022` | Students MUST be able to attach a cover note (optional, max 1,500 characters). |
| `FR-INT-023` | Students MUST be able to select which resume version to attach. |
| `FR-INT-024` | Employer-defined screening questions MUST be supported (max 5, short answer or MCQ). |
| `FR-INT-025` | Students MUST see their application count and remaining quota (free tier: 3/month). |
| `FR-INT-026` | Students MUST be able to withdraw an application before the shortlisting stage. |
| `FR-INT-027` | Duplicate applications to the same posting MUST be prevented. |

### 27.4.3 Application Status Transparency

| ID | Requirement |
|---|---|
| `FR-INT-031` | Every application MUST show a status timeline visible to the student. |
| `FR-INT-032` | Employers MUST act on applications within 14 days; unacted applications MUST auto-transition to `NO_RESPONSE` with student notification. |
| `FR-INT-033` | Rejections MUST include a reason category (eligibility, skills, experience, position filled, other). |
| `FR-INT-034` | Employers with a `NO_RESPONSE` rate above 30% MUST have reduced posting visibility until improved. |

## 27.5 Selection Process

### 27.5.1 Configurable Stages

| Stage | Optional | Description |
|---|---|---|
| Application screening | No | Automatic eligibility filtering + recruiter review |
| Assessment | Yes | Platform skill assessment or custom test |
| Assignment | Yes | Take-home task with submission and evaluation |
| Interview | Yes | Video or in-person, scheduled on platform |
| Final selection | No | Offer extended |

### 27.5.2 Requirements

| ID | Requirement |
|---|---|
| `FR-INT-041` | Employers MUST declare the selection process stages in the posting. |
| `FR-INT-042` | Take-home assignments MUST NOT exceed 8 hours of estimated effort and MUST be disclosed as such. |
| `FR-INT-043` | Assignment IP MUST remain with the student unless a separate agreement is executed. |
| `FR-INT-044` | Interview scheduling MUST offer the student at least 3 slot options. |
| `FR-INT-045` | Offer letters MUST state role, duration, stipend, work mode, supervisor, start date and certificate commitment. |

## 27.6 Active Internship Management

Once an internship begins, the platform manages the engagement.

### 27.6.1 Capabilities

| Capability | Description |
|---|---|
| Onboarding checklist | Documents, NDA acknowledgement, orientation confirmation |
| Task board | Supervisor assigns tasks with descriptions, due dates and priorities |
| Weekly logs | Student submits weekly work logs |
| Timesheet | Hours logged (for stipend calculation where applicable) |
| Check-ins | Scheduled supervisor-intern check-ins with notes |
| Mid-term evaluation | Structured feedback at the midpoint |
| Issue escalation | Student can escalate concerns to Ellowring Ops confidentially |
| Final evaluation | Structured rubric-based evaluation by the supervisor |
| Certificate issuance | Automatic on evaluation submission |
| Testimonial | Optional supervisor testimonial for the student's portfolio |
| PPO recording | Pre-placement offer recorded if extended |

### 27.6.2 Evaluation Rubric

| Dimension | Scale | Weight |
|---|---|---|
| Technical/functional competence | 1-5 | 30% |
| Quality of work delivered | 1-5 | 25% |
| Communication | 1-5 | 15% |
| Initiative and ownership | 1-5 | 15% |
| Reliability and punctuality | 1-5 | 15% |
| Overall recommendation | Strongly recommend / Recommend / Neutral / Not recommend | Qualitative |
| Written feedback | Free text (min 100 characters) | Qualitative |

**Requirement `FR-INT-051`:** Evaluations MUST be submitted within 7 days of internship end. The evaluation score and written feedback MUST be visible to the student. Employers MUST NOT be able to submit an evaluation without written feedback.

### 27.6.3 Student Protection

| ID | Requirement |
|---|---|
| `FR-INT-061` | Students MUST have a confidential escalation channel to Ellowring Ops during an active internship. |
| `FR-INT-062` | Reported issues (non-payment of stipend, scope misrepresentation, harassment, excessive hours) MUST be triaged within 24 hours. |
| `FR-INT-063` | Stipend non-payment reports MUST trigger employer contact within 48 hours and posting suspension if unresolved in 14 days. |
| `FR-INT-064` | Students MUST be able to terminate an internship with a documented reason without penalty in cases of verified employer misconduct. |
| `FR-INT-065` | Employers MUST NOT be able to see which student filed an escalation until Ops determines disclosure is necessary and the student consents. |

## 27.7 Guaranteed Internship Programme

A paid student programme with an outcome commitment.

| Element | Specification |
|---|---|
| Price | —,—7,999 |
| Includes | Profile optimisation, resume building, 4-week readiness training, priority employer matching, 3 guaranteed interview opportunities, application support |
| Guarantee | Internship secured within 90 days of programme completion |
| Refund | 100% refund if no internship secured within 90 days, subject to the student meeting participation criteria |
| Participation criteria | Attend —— 80% of training, apply to —— 20 recommended internships, attend all scheduled interviews |
| Exclusions | Students who decline offers matching their stated preferences forfeit the guarantee |

**Requirement `FR-INT-071`:** Guarantee terms, participation criteria and exclusions MUST be presented and explicitly acknowledged before purchase.

## 27.8 College Integration

| Capability | Description |
|---|---|
| Credit-bearing internships | Colleges can mark internships as credit-eligible with a required duration |
| Faculty supervisor | College faculty assigned alongside the industry supervisor |
| College reporting | Aggregate internship participation and outcome reports |
| Approval workflow | Colleges may require approval before students accept internships |
| NOC generation | Automatic No Objection Certificate generation where required |

## 27.9 Ecosystem Metrics

| Metric | Y1 Target |
|---|---|
| Active internship postings | 3,200 |
| Verified employers posting internships | 480 |
| Applications submitted | 210,000 |
| Applications per posting | 35 |
| Application —' interview rate | 16% |
| Interview —' selection rate | 38% |
| Internships commenced | 15,000 |
| Completion rate | 88% |
| Evaluation submission rate | —— 92% |
| PPO conversion rate | 14% |
| Employer no-response rate | —— 12% |
| Student escalations per 1,000 internships | —— 8 |
| Student satisfaction | —— 4.1 / 5.0 |

---

# Chapter 28 — Live Project Ecosystem

> **Purpose of this chapter:** To specify the live project ecosystem — the category-defining feature in which students work in mentor-supervised teams on real industry problems and produce graded, portfolio-grade deliverables that employers trust.

## 28.1 Ecosystem Overview

| Element | Description |
|---|---|
| **Purpose** | Produce demonstrable, verified proof of capability that resumes cannot provide |
| **Actors** | Student, Mentor, Sponsoring Company, Project Coordinator, Ops |
| **Version** | V2 |
| **Differentiator** | Real company problems + expert mentorship + structured sprints + rigorous grading + employer visibility |
| **Commercial model** | Student enrolment fee + company sponsorship fee |

## 28.2 How Live Projects Differ from Internships

| Dimension | Internship | Live Project |
|---|---|---|
| Structure | Employer-defined, variable | Standardised sprint framework |
| Supervision | Company supervisor (variable quality) | Trained Ellowring mentor + company stakeholder |
| Duration | 4 weeks - 6 months | 6-12 weeks (fixed) |
| Team | Usually individual | Team of 3-6 students |
| Deliverable | Variable, often ambiguous | Defined deliverable with acceptance criteria |
| Evaluation | Employer discretion | Standardised rubric with mentor grading |
| Portfolio output | Certificate only | Certificate + deliverable + code/artefact + mentor testimonial |
| Location | Often location-bound | Fully remote |
| Access | Competitive, scarce | Scalable, available to many |
| Cost to student | Free | Paid enrolment |

## 28.3 Project Categories

| Category | Example Projects | Skills Developed |
|---|---|---|
| Software Development | Build a customer portal, internal dashboard, mobile app feature | Full stack, APIs, testing, deployment |
| Data & Analytics | Sales forecasting model, churn analysis, BI dashboard | SQL, Python, statistics, visualisation |
| AI/ML | Recommendation engine, document classifier, chatbot | ML pipelines, model evaluation, deployment |
| UI/UX Design | Redesign an onboarding flow, design system creation | Research, wireframing, prototyping, testing |
| Digital Marketing | Campaign strategy, SEO audit, content calendar execution | SEO, analytics, content, paid media |
| Business Analysis | Process mapping, requirements documentation, market study | Requirement elicitation, documentation, analysis |
| Content & Communication | Documentation set, brand content system, video series | Writing, editing, content strategy |
| Operations | Supply chain optimisation study, process automation design | Process design, analysis, automation |

## 28.4 Project Lifecycle

```

Company submits project brief
|
Ops + Mentor review: scope, feasibility, learning value, IP terms
- Approved
Project published with defined deliverables, skills, duration, seats
|
Students apply (profile + skill match + short statement)
|
Team formation (3-6 students, complementary skills, mentor-approved)
|
Kickoff: mentor + company stakeholder + team; scope confirmation
|
Sprint 1..N (1-2 weeks each)
| o | ? | ? Sprint planning
| o | ? | ? Execution with mentor check-ins (2 * per week)
| o | ? | ? Sprint review with company stakeholder
| " | ? | ? Retrospective
|
Final deliverable submission
|
Company acceptance review
|
Mentor grading (individual + team)
|
Certificates issued · Portfolio artefacts published · Testimonials
|
Employer visibility: graded projects surface in candidate search

```

## 28.5 Project Brief Standards

**Requirement `FR-PRJ-001`:** Every project brief MUST contain the following before publication.

| Element | Requirement |
|---|---|
| Problem statement | Real business problem in plain language |
| Deliverables | Specific, enumerable artefacts with acceptance criteria |
| Skills required | Mapped to the skill taxonomy |
| Skills developed | Mapped to the skill taxonomy |
| Duration and sprint count | Fixed |
| Team size | 3-6 |
| Company stakeholder | Named, with committed availability (min 2 hours/week) |
| Mentor | Assigned with relevant domain expertise |
| Tools and access | What the team will use; what the company provides |
| IP terms | Explicitly stated (see §28.9) |
| Difficulty level | Beginner / Intermediate / Advanced |
| Prerequisites | Required prior knowledge |

**Requirement `FR-PRJ-002`:** Projects that constitute unpaid production work without learning value MUST be rejected. Ops review MUST assess learning value explicitly.

## 28.6 Team Formation

### 28.6.1 Formation Algorithm

| Factor | Consideration |
|---|---|
| Skill complementarity | Team must collectively cover required skills |
| Skill level balance | Mix of stronger and developing members; avoid all-beginner teams |
| Timezone/availability | Overlapping availability windows |
| Prior collaboration | Avoid repeated identical teams to broaden experience |
| Diversity | Balanced across colleges and backgrounds where possible |
| Commitment signal | Historical completion rate weighted |

**Requirement `FR-PRJ-011`:** Team composition MUST be reviewed and approved by the assigned mentor before kickoff. Mentors MUST be able to request substitutions.

### 28.6.2 Role Assignment

| Role | Responsibility |
|---|---|
| Team Lead | Coordination, sprint planning, stakeholder communication (rotates per sprint) |
| Contributors | Domain-specific execution |
| Documentation Owner | Deliverable documentation quality |
| QA Owner | Verification against acceptance criteria |

## 28.7 Sprint Framework

### 28.7.1 Sprint Structure

| Ceremony | Frequency | Duration | Participants |
|---|---|---|---|
| Sprint planning | Start of sprint | 60 min | Team + Mentor |
| Daily async standup | Daily | Written | Team |
| Mentor check-in | 2—- per week | 30 min | Team + Mentor |
| Sprint review | End of sprint | 45 min | Team + Mentor + Company stakeholder |
| Retrospective | End of sprint | 30 min | Team + Mentor |

### 28.7.2 Project Workspace Features

| Feature | Description |
|---|---|
| Sprint board | Kanban with task assignment, status, due dates |
| Deliverable tracker | Acceptance-criteria-linked deliverable status |
| Team chat | Threaded discussion with mentor participation |
| File repository | Shared artefacts with version history |
| Meeting scheduler | Integrated scheduling with video links |
| Time logging | Individual contribution hours |
| Contribution tracker | Per-member task completion and commit/artefact linkage |
| Mentor feedback log | Written feedback per sprint per member |
| Stakeholder feedback | Company feedback per sprint review |

**Requirement `FR-PRJ-021`:** Individual contribution MUST be tracked and MUST be evidenced (task completion, artefact authorship, commit history where applicable) to prevent free-riding.

## 28.8 Grading

### 28.8.1 Team Grade (40% of individual grade)

| Criterion | Weight |
|---|---|
| Deliverable completeness vs. acceptance criteria | 35% |
| Quality of deliverable | 30% |
| Company stakeholder satisfaction | 20% |
| Process adherence (sprints, documentation) | 15% |

### 28.8.2 Individual Grade (60% of individual grade)

| Criterion | Weight |
|---|---|
| Technical contribution quality | 30% |
| Contribution volume and consistency | 20% |
| Collaboration and communication | 20% |
| Problem-solving and initiative | 15% |
| Growth demonstrated across sprints | 15% |

### 28.8.3 Grade Bands

| Grade | Score | Meaning | Certificate |
|---|---|---|---|
| Distinction | 85-100 | Exceptional; employer-recommended | Distinction certificate + mentor testimonial |
| Merit | 70-84 | Strong performance | Merit certificate + mentor testimonial |
| Pass | 55-69 | Satisfactory completion | Completion certificate |
| Incomplete | < 55 | Did not meet minimum contribution | No certificate; one re-attempt permitted |

**Requirement `FR-PRJ-031`:** Grades MUST be accompanied by written mentor feedback of at least 150 characters per student, visible to the student and included in the portfolio artefact if the student opts to publish.

## 28.9 Intellectual Property

| Scenario | IP Ownership | Student Portfolio Rights |
|---|---|---|
| **Standard project** | Company owns the deliverable | Student may describe the problem, approach and their contribution; may show non-confidential artefacts |
| **Open project** | Open-source or shared | Student may publish the full artefact |
| **Confidential project** | Company owns; NDA applies | Student may state participation and skills only; no artefact publication |

**Requirement `FR-PRJ-041`:** IP terms MUST be stated in the project brief, MUST be acknowledged by the student before joining, and MUST be enforced by the portfolio publishing controls (confidential projects cannot have artefacts published).

**Requirement `FR-PRJ-042`:** In all cases, the student retains the right to state that they participated in the project, describe their role generically, and cite the mentor grade and testimonial.

## 28.10 Mentor Programme

### 28.10.1 Mentor Profile

| Requirement | Specification |
|---|---|
| Experience | Minimum 5 years in the relevant domain |
| Verification | Employment verification, portfolio review, reference check |
| Training | Ellowring mentor certification (mentoring practice, grading rubric, escalation) |
| Capacity | Maximum 3 concurrent project teams |
| Commitment | Minimum 5 hours per week per team |
| Compensation | Per-project fee based on duration and complexity |

### 28.10.2 Mentor Quality Metrics

| Metric | Threshold |
|---|---|
| Student rating | —— 4.2 / 5.0 |
| Check-in attendance | —— 95% |
| Feedback timeliness | —— 95% within 48 hours of sprint end |
| Team completion rate | —— 80% |
| Company stakeholder rating | —— 4.0 / 5.0 |
| Grading consistency | Within 1 standard deviation of cohort norms |

## 28.11 Employer Value

| Value | Description |
|---|---|
| Real work delivered | Functional deliverable for a sponsorship fee far below contractor rates |
| Talent evaluation | Extended observation of candidates in real working conditions |
| Hiring pipeline | Direct conversion of high-performing project participants |
| Brand exposure | Employer visibility to engaged, capable students |
| Low commitment | No employment obligation; fixed-scope engagement |

**Requirement `FR-PRJ-051`:** Companies MUST be able to extend internship or job offers directly to project participants from the project workspace, with the offer flowing into the standard hiring pipeline.

## 28.12 Portfolio Output

Every completed project produces the following portfolio artefacts:

| Artefact | Description |
|---|---|
| Project card | Title, company (or anonymised), duration, team size, role, skills |
| Problem and approach | Student-written narrative of the problem and their approach |
| Contribution summary | Platform-generated summary of the student's tracked contributions |
| Deliverable showcase | Screenshots, links or files (subject to IP terms) |
| Mentor grade and testimonial | Verified grade with mentor's written feedback |
| Verified certificate | With public verification code |
| Skills verified | Skills added to the verified skill profile |

## 28.13 Ecosystem Metrics

| Metric | Y2 Target |
|---|---|
| Active projects | 320 |
| Sponsoring companies | 180 |
| Certified mentors | 140 |
| Students enrolled | 4,800 |
| Project completion rate | 82% |
| Distinction + Merit rate | 58% |
| Company acceptance rate of deliverables | 88% |
| Company satisfaction | —— 4.2 / 5.0 |
| Student satisfaction | —— 4.4 / 5.0 |
| Project —' offer conversion | 18% |
| Portfolio publication rate | 76% |

---

# Chapter 29 — Hiring Ecosystem

> **Purpose of this chapter:** To specify the complete employer-side hiring ecosystem — company onboarding and verification, job posting, applicant tracking, assessment, interviewing, offers, campus drives and hiring analytics.

## 29.1 Ecosystem Overview

| Element | Description |
|---|---|
| **Purpose** | Give employers a pre-verified fresher talent pipeline with an integrated applicant tracking system, and give students genuine, transparent opportunities |
| **Actors** | Company Admin, HR Recruiter, Hiring Manager, Interviewer, Student/Candidate, College TPO, Ops |
| **Version** | V1 (core posting + basic pipeline), V2 (full ATS, campus drives, assessments) |
| **Commercial model** | Pay-per-hire, job credits, annual hiring packages, campus drive fees |

## 29.2 Company Onboarding and Verification

### 29.2.1 Verification Requirements

| Document / Check | Purpose | Mandatory |
|---|---|---|
| Certificate of Incorporation / Udyam / GST registration | Legal existence | Yes (at least one) |
| PAN | Tax identity | Yes |
| Official domain email verification | Digital legitimacy | Yes |
| Authorised signatory ID | Signing authority | Yes |
| Registered address proof | Physical existence | Yes |
| Company website | Public presence | Yes (or documented exception) |
| Employee count declaration | Scale verification | Yes |
| Bank account | Settlement and refunds | Yes |
| Prior hiring history (external references) | Legitimacy signal | Optional |

### 29.2.2 Verification Tiers

| Tier | Criteria | Privileges |
|---|---|---|
| **Basic Verified** | Documents verified | Post up to 3 active listings; standard visibility |
| **Verified Plus** | Basic + —— 5 completed hires with positive candidate feedback | Up to 15 active listings; enhanced visibility; assessment access |
| **Trusted Employer** | Verified Plus + —— 25 hires + —— 4.3 candidate rating + zero unresolved complaints | Unlimited listings; premium placement; campus drive access; badge |

**Requirement `FR-HIRE-001`:** Company verification MUST be completed within 2 business days. No job or internship may be published before verification is approved.

**Requirement `FR-HIRE-002`:** Verification MUST be re-confirmed annually and MUST be immediately revoked upon substantiated fraud, non-payment of stipend/salary, or misrepresentation.

## 29.3 Job Posting

### 29.3.1 Posting Structure

| Section | Fields |
|---|---|
| Role | Title, function, seniority, number of openings |
| Location | City/cities, work mode (on-site/hybrid/remote) |
| Compensation | CTC range (mandatory), fixed/variable split, benefits, joining bonus |
| Requirements | Required skills (taxonomy-mapped), preferred skills, education, experience, minimum CGPA (optional) |
| Eligibility | Graduation year, branches/streams, backlog policy |
| Description | Role summary, responsibilities, what success looks like |
| Selection process | Stages with expected duration |
| Timeline | Application deadline, expected joining date |
| Screening questions | Up to 5 |
| Visibility | Public / Campus-only / Invited colleges only |

### 29.3.2 Posting Requirements

| ID | Requirement |
|---|---|
| `FR-JOB-001` | Salary range disclosure MUST be mandatory; postings without it cannot be published. |
| `FR-JOB-002` | The posting wizard MUST allow a complete posting in —— 3 minutes with templates and AI-assisted description generation. |
| `FR-JOB-003` | Required skills MUST be selected from the skill taxonomy (with the ability to request new skills). |
| `FR-JOB-004` | Postings MUST auto-expire at the application deadline or after 60 days, whichever is earlier. |
| `FR-JOB-005` | Employers MUST be able to duplicate a previous posting as a template. |
| `FR-JOB-006` | The system MUST display an estimated reach (number of matching candidates) before publishing. |
| `FR-JOB-007` | Postings MUST be screened for discriminatory language (gender, age, marital status, caste, religion) and MUST be blocked with an explanation where detected. |
| `FR-JOB-008` | Postings MUST NOT request any payment from candidates; such postings MUST be blocked and the employer flagged. |

## 29.4 Applicant Tracking System (ATS)

### 29.4.1 Pipeline Stages

| Stage | Description | Automation |
|---|---|---|
| `APPLIED` | Application received | Auto-acknowledgement to candidate |
| `SCREENING` | Automatic eligibility filtering | Auto-reject on hard criteria failure with reason |
| `SHORTLISTED` | Recruiter-selected for progression | Candidate notified |
| `ASSESSMENT` | Assessment sent | Auto-reminder at T-2 days before deadline |
| `INTERVIEW_SCHEDULED` | Interview arranged | Calendar invites, reminders at T-24h and T-1h |
| `INTERVIEWED` | Interview completed, awaiting feedback | Feedback reminder to panel at T+24h |
| `OFFER_APPROVAL` | Offer pending internal approval | Approver notified |
| `OFFER_EXTENDED` | Offer sent to candidate | Candidate notified; response deadline set |
| `OFFER_ACCEPTED` | Candidate accepted | Payroll onboarding triggered (if payroll enabled) |
| `OFFER_DECLINED` | Candidate declined | Reason captured; pipeline reopened |
| `REJECTED` | Not proceeding | Reason category mandatory; candidate notified |
| `WITHDRAWN` | Candidate withdrew | Reason captured |
| `JOINED` | Candidate joined | Placement recorded; commission triggered |

### 29.4.2 ATS Capabilities

| Capability | Description | Version |
|---|---|---|
| Kanban pipeline | Drag-and-drop stage movement with bulk selection | V2 |
| List view | Sortable, filterable table with saved views | V1 |
| Auto-screening | Eligibility rules applied automatically | V1 |
| AI ranking | Candidates ranked by match score with explanation | V2 |
| Candidate profile | Full verified profile inline without leaving the ATS | V1 |
| Notes and tags | Internal notes, tags, ratings per candidate | V1 |
| Collaborative review | Multiple team members review with structured feedback | V2 |
| Bulk actions | Bulk shortlist, reject, message, assessment send | V1 |
| Email templates | Configurable, personalised candidate communication | V1 |
| Interview scheduling | Panel availability, candidate self-scheduling, video links | V2 |
| Feedback forms | Structured interview feedback with scorecards | V2 |
| Offer management | Offer creation, approval workflow, digital acceptance | V2 |
| Pipeline analytics | Funnel, time-in-stage, source effectiveness, drop-off | V1 basic, V2 full |
| Talent pool | Save candidates for future roles with consent | V2 |

### 29.4.3 Candidate Profile View (Employer)

| Section | Content | Verification Indicator |
|---|---|---|
| Header | Name, photo, location, current stage of education, availability | — |
| Match | Match score, matched skills, missing skills | AI-generated with rationale |
| Education | Institution, programme, year, CGPA | Verified / Declared badge |
| Verified skills | Skills with proficiency and evidence source | Verified badge with source link |
| Certificates | Ellowring and external certificates | Verified badge with verification link |
| Projects | Live projects with grades and mentor testimonials | Verified badge |
| Internships | Prior internships with employer evaluations | Verified badge |
| Assessments | Platform assessment scores with percentile | Verified |
| Resume | Downloadable resume | — |
| Application | Cover note, screening question answers | — |
| Activity | Application history on this company's postings | — |

**Requirement `FR-ATS-001`:** Every claim in a candidate profile MUST carry an explicit verification indicator. Self-declared claims MUST be visually distinct from platform-verified claims.

### 29.4.4 Candidate Experience Requirements

| ID | Requirement |
|---|---|
| `FR-ATS-011` | Every application MUST receive an acknowledgement within 60 seconds. |
| `FR-ATS-012` | Every stage transition MUST notify the candidate within 5 minutes. |
| `FR-ATS-013` | Rejections MUST include a reason category and MUST be delivered within 14 days of application. |
| `FR-ATS-014` | Candidates MUST be able to see the current stage and expected next step at all times. |
| `FR-ATS-015` | Employers exceeding a 30% no-response rate MUST receive escalating warnings and posting restrictions. |
| `FR-ATS-016` | Candidates MUST be able to rate their hiring experience after a terminal outcome. |

## 29.5 Candidate Search

| Capability | Description |
|---|---|
| Faceted search | Skills, education, location, graduation year, CGPA, certifications, project grades, assessment scores, availability |
| Boolean search | Advanced query syntax on skills and keywords |
| Saved searches | With new-match alerts |
| Talent pools | Named collections of saved candidates |
| Outreach | Direct messaging to candidates with search-visibility consent |
| Consent enforcement | Only candidates who have enabled employer visibility appear |

**Requirement `FR-SRCH-001`:** Candidate search MUST only return students who have explicitly enabled employer search visibility. Students MUST be able to toggle this at any time with effect within 5 minutes.

**Requirement `FR-SRCH-002`:** Employer outreach MUST be rate-limited (default 50 messages per recruiter per day) and MUST be templated with mandatory role context. Students MUST be able to block an employer.

## 29.6 Assessments

| Assessment Type | Description | Duration |
|---|---|---|
| Aptitude | Quantitative, logical, verbal | 45-60 min |
| Domain knowledge | Role-specific technical MCQ | 30-45 min |
| Coding | Live code editor with test cases | 60-120 min |
| Communication | Written and spoken assessment | 20-30 min |
| Situational judgement | Scenario-based behavioural | 20-30 min |
| Custom | Employer-uploaded assessment | Configurable |

| ID | Requirement |
|---|---|
| `FR-ASMT-001` | Assessments MUST support browser-lock and tab-switch detection. |
| `FR-ASMT-002` | Webcam proctoring MUST be available as an option with candidate consent. |
| `FR-ASMT-003` | Assessment results MUST include score, percentile against all takers, and section breakdown. |
| `FR-ASMT-004` | Candidates MUST see their own assessment scores. |
| `FR-ASMT-005` | Assessment scores MUST be reusable across applications for 6 months to avoid repeated testing. |
| `FR-ASMT-006` | Assessments MUST be accessible on mobile for non-coding types. |

## 29.7 Interview Management

| Capability | Description |
|---|---|
| Panel management | Define interview panels with member availability |
| Slot generation | Automatic slot creation from panel calendars |
| Candidate self-scheduling | Candidate selects from available slots |
| Video integration | Auto-generated video meeting links |
| Reminders | T-24h and T-1h to both parties |
| Rescheduling | Self-service rescheduling within policy limits |
| Scorecards | Structured, role-specific evaluation forms |
| Collaborative decision | Panel scores aggregated with a decision recommendation |
| Recording | Optional with mutual consent (V3) |
| No-show handling | Automatic recording of no-shows with follow-up |

**Requirement `FR-IVW-001`:** Interview feedback MUST be submitted within 48 hours; overdue feedback MUST escalate to the hiring manager.

**Requirement `FR-IVW-002`:** Candidates MUST receive interview details (format, duration, panel, preparation guidance) at least 24 hours in advance.

## 29.8 Offer Management

| Element | Specification |
|---|---|
| Offer creation | Role, CTC breakdown, joining date, location, reporting manager, terms |
| Approval workflow | Configurable multi-level approval with limits |
| Digital offer letter | Generated PDF with company branding |
| Candidate acceptance | Digital acceptance with timestamp; optional e-signature |
| Response deadline | Configurable; automatic reminder at T-2 days |
| Negotiation | Structured counter-offer flow (V2) |
| Revocation | Permitted only with documented reason; recorded against the employer |
| Multiple offers | Candidates can compare offers side by side |
| Payroll trigger | Acceptance initiates payroll onboarding if the employer uses Ellowring Payroll |

**Requirement `FR-OFR-001`:** Offer revocation after acceptance MUST require Ops review, MUST be recorded on the employer's trust record, and MUST trigger candidate support outreach.

## 29.9 Campus Drives

### 29.9.1 Drive Types

| Type | Description |
|---|---|
| Single college on-campus | Physical drive at one college |
| Single college virtual | Online drive for one college |
| Multi-college pooled | One drive serving multiple colleges |
| Regional virtual drive | Open to all eligible students in a region |
| Ellowring open drive | Platform-wide, not college-restricted |

### 29.9.2 Drive Workflow

```

Company creates drive (roles, eligibility, date, process)
|
Company selects colleges (from network) OR college invites company
|
College approves participation and confirms logistics
|
Eligible students auto-identified and notified
|
Students register (with commitment acknowledgement)
|
Pre-placement talk (scheduled, attendance tracked)
|
Round 1 (aptitude/online test) - ' results published
|
Round 2 (technical) - ' results published
|
Round 3 (HR) - ' results published
|
Offers extended - ' acceptance tracked
|
Drive analytics published to college and company

```

### 29.9.3 Drive Requirements

| ID | Requirement |
|---|---|
| `FR-DRV-001` | Eligible students MUST be identified automatically from drive criteria and college records. |
| `FR-DRV-002` | Round results MUST be publishable in bulk with automatic student notification. |
| `FR-DRV-003` | Colleges MUST be able to enforce their placement policy during registration. |
| `FR-DRV-004` | Drive analytics MUST be available to both college and company within 24 hours of drive completion. |
| `FR-DRV-005` | Students MUST be able to view their status at each round in real time. |
| `FR-DRV-006` | The system MUST support at least 5,000 students in a single virtual drive. |

## 29.10 Hiring Analytics

| Metric Category | Metrics |
|---|---|
| Funnel | Applications, screened, shortlisted, assessed, interviewed, offered, accepted, joined — with stage conversion rates |
| Efficiency | Time-to-fill, time-to-hire, time-in-stage, cost-per-hire |
| Quality | Offer acceptance rate, 90-day retention, hiring manager satisfaction, assessment score of hires |
| Source | Applications and hires by source (search, direct apply, campus, referral, recommendation) |
| Diversity | Distribution by college tier, geography, gender (where voluntarily disclosed) |
| Benchmark | Comparison against anonymised peer companies in the same sector and size band |
| Candidate experience | Response time, candidate rating, no-response rate |

## 29.11 Employer Trust and Accountability

| Signal | Measurement | Consequence |
|---|---|---|
| No-response rate | % applications with no action in 14 days | > 30%: reduced visibility; > 50%: posting suspension |
| Offer revocation rate | Revocations / offers | > 5%: Ops review; > 10%: verification downgrade |
| Stipend/salary non-payment | Substantiated reports | Immediate posting suspension; verification revocation |
| Candidate rating | Average post-process rating | < 3.0: improvement notice; < 2.5: verification review |
| Misrepresentation | Substantiated role/compensation misrepresentation | Posting removal; verification downgrade or revocation |
| Ghost postings | Postings with no hiring intent | Removal; repeat offence: account suspension |

**Requirement `FR-TRUST-001`:** Employer trust metrics MUST be computed continuously and MUST be visible to Ops. Trusted Employer badges MUST be automatically revoked when thresholds are breached.

## 29.12 Ecosystem Metrics

| Metric | Y1 Target |
|---|---|
| Verified companies | 600 |
| Active job postings | 2,400 |
| Applications submitted | 320,000 |
| Applications per posting | 55 |
| Application —' interview rate | 14% |
| Interview —' offer rate | 26% |
| Offer acceptance rate | 72% |
| Placements confirmed | 5,000 |
| Median time-to-hire | 22 days |
| Employer no-response rate | —— 12% |
| Candidate experience rating | —— 4.0 / 5.0 |
| Employer satisfaction | —— 4.2 / 5.0 |
| Campus drives conducted | 340 |

---

# Chapter 30 — Payroll Ecosystem

> **Purpose of this chapter:** To specify the payroll ecosystem that closes the education-to-employment loop by hosting the employer's post-hire workflow — onboarding, attendance, salary processing, statutory compliance and employee self-service.

## 30.1 Ecosystem Overview

| Element | Description |
|---|---|
| **Purpose** | Convert hiring into employment on the same platform, creating employer lock-in and closing the outcome data loop |
| **Actors** | Company Admin, Payroll Manager, Employee, Finance, Ops, Compliance |
| **Version** | V2 |
| **Target segment** | SMBs (10-500 employees) initially; mid-market in V3 |
| **Commercial model** | Per-employee-per-month SaaS, bundled free with hiring packages |
| **Strategic role** | The wedge that makes Ellowring infrastructure rather than a marketplace |

## 30.2 Why Payroll Matters Strategically

| Reason | Explanation |
|---|---|
| **Closes the loop** | Actual salary data calibrates the entire recommendation stack |
| **Employer retention** | Payroll switching costs are high; hiring relationships become sticky |
| **Recurring revenue** | Converts transactional hiring revenue into predictable SaaS revenue |
| **Data advantage** | Real compensation data by role, city and skill is uniquely valuable |
| **Student trust** | Students see verified salary outcomes rather than claimed ranges |
| **Alumni continuity** | The student identity persists into employment, enabling continuing education |

## 30.3 Onboarding — From Offer to Employee

### 30.3.1 Automated Handoff

```

Offer accepted in Hiring Ecosystem
|
Payroll onboarding record auto-created with:
. Personal details (from student profile)
. Education (verified)
. Offer terms (role, CTC, joining date, location)
|
Employee invited to complete onboarding
|
Employee submits: bank details, PAN, Aadhaar, address, emergency contact,
previous employment, tax declarations, documents
|
Employer verifies documents
|
Salary structure assigned
|
Statutory registrations processed (PF, ESI as applicable)
|
Employee record activated
|
Employee self-service access provisioned

```

**Requirement `FR-PAY-001`:** Onboarding MUST pre-populate all data already held in the student profile, requiring the employee to supply only genuinely new information.

### 30.3.2 Onboarding Checklist

| Item | Owner | Mandatory |
|---|---|---|
| Personal details confirmation | Employee | Yes |
| Bank account with cancelled cheque/passbook | Employee | Yes |
| PAN | Employee | Yes |
| Aadhaar (masked) | Employee | Yes |
| UAN (if existing) | Employee | If applicable |
| Address proof | Employee | Yes |
| Educational certificates | Employee | Yes (pre-verified where from Ellowring) |
| Previous employment documents | Employee | If applicable |
| Tax regime selection | Employee | Yes |
| Investment declarations | Employee | Optional |
| Emergency contact | Employee | Yes |
| Signed offer/appointment letter | Both | Yes |
| Document verification | Employer | Yes |
| Salary structure assignment | Employer | Yes |
| Reporting manager and department | Employer | Yes |

## 30.4 Salary Structure Management

### 30.4.1 Components

| Component Type | Examples | Configurable |
|---|---|---|
| **Earnings — Fixed** | Basic, HRA, Conveyance, Special Allowance, Medical Allowance, LTA | Yes |
| **Earnings — Variable** | Performance bonus, incentives, overtime, shift allowance | Yes |
| **Deductions — Statutory** | PF (employee), ESI (employee), Professional Tax, TDS | Rule-driven |
| **Deductions — Other** | Loan repayment, advance recovery, insurance premium | Yes |
| **Employer Contributions** | PF (employer), ESI (employer), Gratuity provision | Rule-driven |
| **Reimbursements** | Fuel, telephone, books, meal | Yes |

### 30.4.2 Structure Templates

| ID | Requirement |
|---|---|
| `FR-PAY-011` | Employers MUST be able to define reusable salary structure templates by grade or role. |
| `FR-PAY-012` | Structures MUST support both percentage-of-basic and fixed-amount component definitions. |
| `FR-PAY-013` | The system MUST compute the full CTC-to-net-pay breakdown and display it to both employer and employee. |
| `FR-PAY-014` | Structure changes MUST be effective-dated and MUST maintain full history. |
| `FR-PAY-015` | The system MUST validate structures against statutory minimums (minimum wage, PF wage ceiling rules). |

## 30.5 Attendance and Leave

### 30.5.1 Attendance

| Capability | Description |
|---|---|
| Marking modes | Web check-in/out, geo-fenced mobile (V3), biometric integration (V3), manual entry by manager |
| Shift management | Multiple shift definitions with rosters |
| Regularisation | Employee requests correction; manager approves |
| Overtime | Automatic computation from configured rules |
| Holiday calendar | Location-specific holiday calendars |
| Week-off configuration | Fixed or rotational |
| Attendance reports | Daily, monthly, employee-wise, department-wise |

### 30.5.2 Leave

| Leave Type | Typical Configuration |
|---|---|
| Casual Leave | Accrual-based, annual quota, carry-forward rules |
| Sick Leave | Annual quota, documentation threshold |
| Earned/Privileged Leave | Accrual, encashment, carry-forward |
| Maternity Leave | Statutory duration |
| Paternity Leave | Company policy |
| Loss of Pay | Unpaid, salary deduction |
| Compensatory Off | Earned from extra work |

| ID | Requirement |
|---|---|
| `FR-PAY-021` | Leave policies MUST be configurable per company and per employee grade. |
| `FR-PAY-022` | Leave balances MUST be computed in real time with accrual, consumption and carry-forward. |
| `FR-PAY-023` | Leave approval MUST follow a configurable workflow with delegation support. |
| `FR-PAY-024` | Approved leave MUST automatically reflect in attendance and payroll computation. |
| `FR-PAY-025` | Leave calendars MUST show team availability to managers. |

## 30.6 Payroll Processing

### 30.6.1 Payroll Run Workflow

```

Pay period closes
|
Attendance and leave data locked
|
Variable inputs collected (incentives, reimbursements, deductions, one-time payments)
|
Payroll computation executed
|
Preview generated: employee-wise breakdown, totals, variance vs. prior month
|
Exception review (new joiners, exits, salary changes, unusual variances)
|
Approval by authorised approver
|
Payroll locked
|
Payslips generated and published
|
Bank transfer file generated / payment initiated
|
Statutory computations finalised
|
Statutory reports generated
|
Payroll register archived

```

### 30.6.2 Computation Requirements

| ID | Requirement |
|---|---|
| `FR-PAY-031` | Payroll computation MUST be deterministic and reproducible; re-running with identical inputs MUST produce identical outputs. |
| `FR-PAY-032` | The system MUST compute pro-rata salary for mid-month joiners and leavers based on the company's configured calendar-day or working-day basis. |
| `FR-PAY-033` | The system MUST compute PF, ESI, Professional Tax and TDS per prevailing statutory rules, with rules maintained centrally and versioned by effective date. |
| `FR-PAY-034` | TDS computation MUST consider the employee's declared regime, investments, prior employment income and projected annual income. |
| `FR-PAY-035` | The system MUST flag exceptions before approval: negative net pay, variance > 20% vs. prior month, missing bank details, missing statutory identifiers. |
| `FR-PAY-036` | Payroll MUST NOT be executable without explicit approval by an authorised approver. |
| `FR-PAY-037` | Approved payroll MUST be immutable; corrections MUST be processed as adjustments in a subsequent run or via a documented off-cycle run. |
| `FR-PAY-038` | The system MUST support off-cycle payroll runs for corrections, full-and-final settlements and bonuses. |
| `FR-PAY-039` | Payroll for up to 500 employees MUST complete computation within 3 minutes. |

### 30.6.3 Payslip

| Element | Requirement |
|---|---|
| Format | PDF, company-branded |
| Contents | Employee details, pay period, earnings breakdown, deductions breakdown, employer contributions, net pay, YTD figures, leave balance, bank details (masked) |
| Delivery | Published to employee self-service; optional email delivery |
| Timing | Within 24 hours of payroll approval |
| Access | Employee retains access to all historical payslips |
| Security | Password-protected PDF option |

## 30.7 Statutory Compliance

### 30.7.1 Covered Obligations (India)

| Obligation | Scope | Output |
|---|---|---|
| **Provident Fund (PF)** | Employee and employer contributions, EPS split | ECR file, challan data, UAN management |
| **Employees' State Insurance (ESI)** | Applicable wage-threshold employees | ESI return data, contribution challan |
| **Professional Tax (PT)** | State-specific slabs | State-wise PT return data |
| **Tax Deducted at Source (TDS)** | Salary TDS under Section 192 | Form 24Q data, Form 16 generation |
| **Labour Welfare Fund (LWF)** | State-specific | LWF contribution data |
| **Gratuity** | Provision computation | Gratuity liability report |
| **Bonus** | Statutory bonus computation | Bonus register |
| **Minimum Wages** | Validation against state minimum wages | Compliance flag |

**Requirement `FR-PAY-041`:** Statutory rules MUST be maintained in a versioned, effective-dated rule store, editable by Compliance without a code deployment.

**Requirement `FR-PAY-042`:** The system MUST generate statutory filing data files in the formats prescribed by the respective authorities. Actual filing MAY be performed by the employer or by an Ellowring-partnered service.

**Requirement `FR-PAY-043`:** Form 16 MUST be generatable for all employees at financial year end, with Part A and Part B.

### 30.7.2 Compliance Calendar

| Obligation | Due Date | Reminder |
|---|---|---|
| PF ECR filing and payment | 15th of following month | T-5, T-2, T-0 days |
| ESI contribution | 15th of following month | T-5, T-2, T-0 days |
| TDS deposit | 7th of following month | T-3, T-1, T-0 days |
| TDS return (24Q) | Quarterly | T-10, T-3 days |
| PT payment | State-specific | T-5, T-2 days |
| Form 16 issuance | 15 June | T-30, T-15, T-7 days |

## 30.8 Employee Self-Service

| Capability | Description |
|---|---|
| Payslips | View and download all historical payslips |
| Tax documents | Form 16, tax computation sheet, investment declaration |
| Salary structure | View current and historical structures |
| Attendance | View records, request regularisation |
| Leave | Apply, view balances, view history, view team calendar |
| Reimbursements | Submit claims with receipts, track approval and payment |
| Profile | Update personal details, bank account, address, emergency contact |
| Documents | Access employment documents (offer letter, appointment letter, experience letter) |
| Declarations | Submit and update tax investment declarations |
| Requests | Raise HR queries and track resolution |

**Requirement `FR-PAY-051`:** Employee self-service MUST be accessible on mobile web with full functionality.

**Requirement `FR-PAY-052`:** Employees MUST NOT be able to view any other employee's compensation data.

## 30.9 Exit Management

| Step | Description |
|---|---|
| Resignation submission | Employee submits with intended last working day |
| Approval and notice period | Manager approves; notice period computed per policy |
| Exit checklist | Asset return, knowledge transfer, clearances by department |
| Full and final settlement | Final salary, leave encashment, gratuity, recoveries, notice-period adjustment |
| Settlement approval | Reviewed and approved |
| Payment | F&F amount disbursed |
| Documents | Relieving letter, experience letter, Form 16 |
| Access revocation | System access removed on last working day |
| Alumni status | Employee record archived; student identity retained on Ellowring |

**Requirement `FR-PAY-061`:** Full and final settlement MUST be computable and payable within 45 days of the last working day, with a settlement statement itemising every component.

## 30.10 Payroll Reports

| Report | Contents | Frequency |
|---|---|---|
| Payroll register | Full employee-wise computation for the period | Monthly |
| Salary disbursement | Bank transfer file with account details and amounts | Monthly |
| Statutory summary | PF, ESI, PT, TDS totals with employee-wise detail | Monthly |
| Cost-to-company report | Total employment cost by department, location, grade | Monthly |
| Headcount report | Joiners, leavers, active headcount, attrition | Monthly |
| Attendance summary | Present, absent, leave, overtime by employee | Monthly |
| Leave liability | Accrued leave liability in monetary terms | Quarterly |
| Gratuity liability | Estimated gratuity liability | Annual |
| Form 16 batch | Form 16 for all employees | Annual |
| Variance analysis | Month-on-month payroll variance with explanations | Monthly |

## 30.11 Payroll Security and Controls

| Control | Requirement |
|---|---|
| Access | Payroll data accessible only to `HR_PAYROLL`, `COMPANY_ADMIN` and the employee themselves |
| Encryption | Bank details and statutory identifiers encrypted at rest with field-level encryption |
| Segregation of duties | Payroll preparer and approver MUST be different users |
| Audit trail | Every payroll action logged immutably with actor and timestamp |
| Approval limits | Configurable approval thresholds |
| Data retention | Payroll records retained for 8 years per statutory requirement |
| Backup | Daily encrypted backups with tested restore procedures |
| Masking | Bank account numbers masked in all views except during explicit verification |

## 30.12 Ecosystem Metrics

| Metric | Y2 Target | Y3 Target |
|---|---|---|
| Companies using payroll | 420 | 1,500 |
| Employees processed monthly | 18,000 | 82,000 |
| Payroll runs executed | 4,800 | 17,500 |
| Payroll accuracy (error-free runs) | —— 99.5% | —— 99.8% |
| Payslip delivery within 24h of approval | —— 99% | —— 99.5% |
| Statutory filing data accuracy | 100% | 100% |
| Hiring —' payroll conversion | 55% | 70% |
| Payroll customer retention | 88% | 92% |
| Support tickets per 100 employees per month | —— 4 | —— 2.5 |

---

# Chapter 31 — AI Features

> **Purpose of this chapter:** To specify the intelligence layer — every AI capability, its inputs, outputs, quality requirements, explainability obligations, safety controls and version phasing.

## 31.1 AI Philosophy

| Principle | Statement |
|---|---|
| **Explainable by default** | Every AI output MUST state the basis on which it was produced. |
| **Grounded, not generative-only** | Recommendations MUST be grounded in the student's actual platform data and verified catalogue content. |
| **Assistive, not authoritative** | AI advises; the student decides. No AI output is presented as a guarantee. |
| **Conservative on high stakes** | Career, financial and legal advice carries explicit confidence indicators and human-escalation paths. |
| **Privacy-preserving** | AI operates on the student's own data; cross-student learning uses aggregated, anonymised signals only. |
| **Continuously evaluated** | Every AI feature has measurable accuracy and acceptance metrics reviewed monthly. |

## 31.2 AI Feature Inventory

| # | Feature | Type | Version |
|---|---|---|---|
| AI-1 | Career Recommendation Engine | Recommendation | V1 |
| AI-2 | Conversational Career Assistant | Conversational | V1 |
| AI-3 | Course Recommendation | Recommendation | V1 |
| AI-4 | Job & Internship Matching | Matching | V1 |
| AI-5 | Resume Builder & ATS Optimiser | Generative | V1 |
| AI-6 | Daily Insight Generator | Insight | V1 |
| AI-7 | Doubt Preliminary Response | Generative | V1 |
| AI-8 | Adaptive Study Plan Generator | Planning | V2 |
| AI-9 | Weakness Detection & Remediation | Diagnostic | V2 |
| AI-10 | Candidate Ranking (Employer) | Ranking | V2 |
| AI-11 | AI Mock Interview | Conversational + Evaluation | V2 |
| AI-12 | Skill Gap Analyser | Diagnostic | V2 |
| AI-13 | College Shortlist Generator | Recommendation | V2 |
| AI-14 | SOP Draft Assistant | Generative | V2 |
| AI-15 | Job Description Generator (Employer) | Generative | V2 |
| AI-16 | Content Moderation Assistant | Classification | V2 |
| AI-17 | Fraud & Anomaly Detection | Classification | V2 |
| AI-18 | Predictive Placement Model | Prediction | V3 |
| AI-19 | Salary Prediction | Prediction | V3 |
| AI-20 | Learning Path Optimiser | Optimisation | V3 |
| AI-21 | Multilingual Assistant | Conversational | V3 |
| AI-22 | Voice-Based Interaction | Interface | V3 |

## 31.3 AI-1 — Career Recommendation Engine

### 31.3.1 Specification

| Element | Detail |
|---|---|
| **Purpose** | Produce a ranked, explained set of career matches for a student |
| **Inputs** | Aptitude scores (4 dimensions), interest profile, personality traits, work values, academic marks and subjects, declared preferences, geographic constraints, financial constraints |
| **Reference data** | Career profile library (200+ careers) with required aptitudes, interests, education paths, market demand and salary bands |
| **Method** | Weighted multi-dimensional similarity scoring against career profiles, adjusted by market demand and feasibility constraints |
| **Output** | Top 10 careers with fit score (0-100), dimension-level rationale, confidence level, education pathway, salary bands, market outlook |
| **Latency** | < 10 seconds |
| **Explainability** | Each recommendation states the three strongest contributing dimensions and any constraint that lowered the score |

### 31.3.2 Requirements

| ID | Requirement |
|---|---|
| `FR-AI-011` | The engine MUST return at least 5 and at most 10 career recommendations. |
| `FR-AI-012` | Each recommendation MUST include a plain-language rationale of at least 200 characters. |
| `FR-AI-013` | Confidence MUST be stated as High/Medium/Low based on assessment completeness and score separation between ranks. |
| `FR-AI-014` | Recommendations MUST NOT be influenced by any commercial relationship (no paid career promotion). |
| `FR-AI-015` | The engine MUST be re-runnable; results MUST be versioned and comparable across runs. |
| `FR-AI-016` | Where an aptitude constraint materially limits a career, the system MUST state it honestly and offer adjacent alternatives. |

## 31.4 AI-2 — Conversational Career Assistant

### 31.4.1 Capabilities

| Capability | Example Query |
|---|---|
| Platform guidance | "Where can I find my mock test results— |
| Career advice | "Should I take Computer Science or Electronics— |
| Exam guidance | "How many hours a day should I study for NEET— |
| College advice | "Is SRM better than VIT for CSE placements— |
| Skill advice | "What should I learn to become a data analyst— |
| Application help | "Why am I not getting interview calls— |
| Progress queries | "How am I doing in Physics— |
| Opportunity discovery | "Show me remote internships matching my skills" |
| Document help | "Help me improve my resume summary" |
| Motivation and planning | "I'm falling behind my study plan, what should I do— |

### 31.4.2 Context Available to the Assistant

| Context Category | Data |
|---|---|
| Identity | Name, stage, stream, target career, target exam |
| Academic | Marks, exam scores, mock test history, topic-level performance |
| Learning | Enrolled batches and courses, progress, attendance, completion |
| Skills | Verified and declared skills with proficiency |
| Experience | Internships, projects, certificates |
| Applications | Applications submitted, statuses, outcomes |
| Preferences | Location, salary expectation, work mode, industries |
| Platform catalogue | Courses, batches, colleges, jobs, internships, projects |
| Historical outcomes | Anonymised aggregate outcomes for similar students |

### 31.4.3 Requirements

| ID | Requirement |
|---|---|
| `FR-AI-021` | The assistant MUST have access to the student's full platform context, subject to their AI-personalisation consent. |
| `FR-AI-022` | Responses MUST cite the specific data used (e.g., "Based on your last 3 mock tests."). |
| `FR-AI-023` | The assistant MUST NOT fabricate platform data; if information is unavailable, it MUST say so. |
| `FR-AI-024` | The assistant MUST NOT provide medical, legal, financial-investment or immigration-legal advice; it MUST redirect to qualified sources. |
| `FR-AI-025` | The assistant MUST offer escalation to a human counsellor for high-stakes decisions. |
| `FR-AI-026` | Response latency MUST be < 3 seconds to first token and < 12 seconds to completion at P95. |
| `FR-AI-027` | Conversation history MUST be retained and searchable by the student, and MUST be deletable by the student. |
| `FR-AI-028` | Usage quotas MUST be enforced per membership tier with clear communication when the quota is reached. |
| `FR-AI-029` | The assistant MUST support suggestion chips for common intents to reduce cold-start friction. |
| `FR-AI-030` | All assistant outputs MUST be labelled as AI-generated. |

### 31.4.4 Safety Controls

| Control | Implementation |
|---|---|
| Prompt injection defence | Input sanitisation; system-prompt isolation; output validation |
| PII leakage prevention | Context restricted to the requesting student's own data; cross-student data never in context |
| Harmful content | Content filtering on input and output |
| Self-harm and distress detection | Detection of distress signals with immediate escalation to human support and helpline information |
| Hallucination mitigation | Retrieval-grounded responses; refusal when grounding data is absent |
| Rate limiting | Per-user and per-IP limits |
| Cost control | Token budgets per tier with graceful degradation |
| Audit | All conversations logged for quality review with student privacy protections |

**Requirement `FR-AI-031`:** If the assistant detects signals of severe distress or self-harm, it MUST immediately surface mental-health helpline information and MUST create a priority support alert.

## 31.5 AI-4 — Job & Internship Matching

### 31.5.1 Matching Model

| Signal | Weight | Description |
|---|---|---|
| Skill match | 35% | Overlap between required skills and student's verified skills, weighted by proficiency |
| Education match | 15% | Degree, branch, graduation year, CGPA against criteria |
| Experience match | 15% | Internships, projects relevant to the role |
| Assessment scores | 10% | Relevant platform assessment performance |
| Preference match | 10% | Location, work mode, salary expectation, industry |
| Certificate relevance | 8% | Certificates relevant to the role |
| Engagement signals | 4% | Profile completeness, responsiveness, application quality |
| Outcome model | 3% | Historical success of similar students in similar roles |

### 31.5.2 Requirements

| ID | Requirement |
|---|---|
| `FR-AI-041` | Match scores MUST be computed for both student-facing and employer-facing views using the same model. |
| `FR-AI-042` | Match explanations MUST list matched skills, missing skills and the impact of each. |
| `FR-AI-043` | For missing skills, the system MUST link to the specific Ellowring course that closes the gap. |
| `FR-AI-044` | Match scores MUST recompute within 1 hour of any profile change or new posting. |
| `FR-AI-045` | The model MUST NOT use protected attributes (gender, caste, religion, marital status) as features. |
| `FR-AI-046` | The model MUST be audited quarterly for adverse impact across college tier and geography. |
| `FR-AI-047` | Employers MUST be able to see the match rationale, not only the score. |

## 31.6 AI-5 — Resume Builder & ATS Optimiser

| Capability | Description |
|---|---|
| Auto-generation | Generates a complete resume from the student's platform profile |
| Templates | 6+ ATS-friendly templates with role-appropriate layouts |
| Role targeting | Tailors content emphasis to a target role or a specific job posting |
| Bullet enhancement | Converts task descriptions into achievement-oriented bullets |
| Keyword optimisation | Suggests keywords from the target job description |
| ATS score | Scores the resume against ATS parsing criteria with specific fixes |
| Verification badges | Marks verified credentials distinctly |
| Multiple versions | Save and manage multiple resume versions |
| Export | PDF and DOCX |

| ID | Requirement |
|---|---|
| `FR-AI-051` | Generated resumes MUST contain only factual content derived from the student's profile; the AI MUST NOT invent experience or skills. |
| `FR-AI-052` | The ATS score MUST be accompanied by specific, actionable improvement items. |
| `FR-AI-053` | Students MUST be able to edit every generated element before saving. |
| `FR-AI-054` | Generated resumes MUST render correctly when parsed by standard ATS parsers (verified in QA). |

## 31.7 AI-6 — Daily Insight Generator

Powers the AI Career Assistant Banner on the Student Dashboard.

| Insight Category | Example |
|---|---|
| Performance trend | "Your Physics mock accuracy improved from 52% to 68% over three tests." |
| Opportunity alert | "Three internships posted today match your verified skills." |
| Risk warning | "You've missed 4 of your last 6 classes. At this pace you'll cover only 71% of the syllabus before your exam." |
| Deadline reminder | "Two college application deadlines close within 5 days." |
| Skill gap | "Backend Engineer roles you're viewing require Docker. You don't have it yet." |
| Milestone celebration | "You completed your first live project with a Merit grade." |
| Comparative insight | "Students with your profile who completed SQL saw 34% more interview calls." |
| Next best action | "Completing your profile (currently 62%) would make you visible to 180 more employers." |

| ID | Requirement |
|---|---|
| `FR-AI-061` | Insights MUST be derived from the student's actual data within the last 30 days. |
| `FR-AI-062` | Insights MUST be specific and quantified; generic motivational statements are prohibited. |
| `FR-AI-063` | Each insight MUST carry a linked action. |
| `FR-AI-064` | Insight generation MUST run at least daily and on significant event triggers. |
| `FR-AI-065` | Comparative insights MUST use anonymised aggregates of at least 100 students. |

## 31.8 AI-8 & AI-9 — Adaptive Study Plan and Weakness Detection

### 31.8.1 Weakness Detection

| Input | Analysis |
|---|---|
| Question-level responses | Correct/incorrect by topic, sub-topic and difficulty |
| Time per question | Identifies topics where the student is slow despite being accurate |
| Repeated errors | Identifies persistent misconceptions across attempts |
| Concept dependency graph | Traces errors to prerequisite gaps |
| Comparison to cohort | Identifies topics where the student underperforms the cohort |

| Output | Detail |
|---|---|
| Weak topic list | Ranked by impact (weightage —- weakness severity) |
| Root cause | Whether the gap is conceptual, application-level, or speed-related |
| Remediation plan | Specific content items, practice sets and estimated time |
| Predicted impact | Estimated score improvement if remediated |

### 31.8.2 Requirements

| ID | Requirement |
|---|---|
| `FR-AI-081` | Weakness analysis MUST be generated within 60 seconds of full-length test submission. |
| `FR-AI-082` | Weak topics MUST be ranked by exam-weightage-adjusted impact, not raw error count. |
| `FR-AI-083` | The study plan MUST regenerate when weakness analysis changes materially (—— 3 topics change rank). |
| `FR-AI-084` | The plan MUST fit within the student's declared available hours; if full syllabus coverage is infeasible, the system MUST say so explicitly and prioritise by weightage. |
| `FR-AI-085` | Adherence MUST be tracked and MUST feed back into plan ambition calibration. |

## 31.9 AI-11 — AI Mock Interview

| Element | Specification |
|---|---|
| Interview types | HR/behavioural, technical (role-specific), case-based, company-specific |
| Format | Text or voice (V2 text, V3 voice) |
| Question generation | Derived from target role, company, student's profile and resume |
| Adaptive follow-ups | Probes based on the student's answers |
| Duration | 15-45 minutes configurable |
| Evaluation dimensions | Content relevance, structure (e.g., STAR), specificity, technical accuracy, communication clarity, confidence indicators |
| Feedback | Per-answer feedback, overall score, top 3 improvements, model answers |
| Recording | Session transcript retained for student review |
| Progress | Score trajectory across multiple mock interviews |

| ID | Requirement |
|---|---|
| `FR-AI-111` | Questions MUST be tailored to the student's stated target role and their actual profile. |
| `FR-AI-112` | Feedback MUST be specific to what the student actually said, with quoted excerpts. |
| `FR-AI-113` | The system MUST provide a model answer for each question. |
| `FR-AI-114` | Scores MUST be accompanied by the rubric so the student understands the basis. |
| `FR-AI-115` | Mock interview scores MUST contribute to the Placement Readiness Score. |

## 31.10 AI-10 — Candidate Ranking (Employer-Facing)

| ID | Requirement |
|---|---|
| `FR-AI-101` | Candidate ranking MUST use the same matching model as student-facing match scores for consistency. |
| `FR-AI-102` | Employers MUST see the ranking rationale for every candidate. |
| `FR-AI-103` | Employers MUST be able to adjust the weighting of criteria for their specific role. |
| `FR-AI-104` | AI ranking MUST be advisory; employers MUST always be able to view all applicants in an unranked list. |
| `FR-AI-105` | Ranking MUST NOT use protected attributes and MUST be auditable for adverse impact. |
| `FR-AI-106` | Auto-rejection based solely on AI ranking MUST be prohibited; a human MUST review every rejection above the hard-eligibility filter. |

## 31.11 AI-17 — Fraud & Anomaly Detection

| Detection Target | Signals |
|---|---|
| Fake student accounts | Registration velocity, disposable emails, device fingerprint clustering, behavioural anomalies |
| Fraudulent employers | Posting patterns, payment requests, contact behaviour, verification document anomalies |
| Content piracy | Abnormal download volumes, concurrent session patterns, screen-recording signals |
| Assessment cheating | Tab switching, answer timing patterns, identical answer sequences, IP clustering |
| Referral fraud | Self-referral patterns, circular referral graphs, low-quality conversions |
| Payment fraud | Card testing patterns, refund abuse, chargeback patterns |
| Review manipulation | Review velocity, sentiment anomalies, account age patterns |

| ID | Requirement |
|---|---|
| `FR-AI-171` | Detected anomalies MUST create a review case for Ops; automatic action MUST be limited to reversible measures (temporary hold, additional verification challenge). |
| `FR-AI-172` | Account suspension based on fraud detection MUST require human review. |
| `FR-AI-173` | False-positive rate MUST be monitored; a rate above 15% MUST trigger model retuning. |
| `FR-AI-174` | Affected users MUST be informed of any restriction and MUST have an appeal path. |

## 31.12 AI Governance

### 31.12.1 Evaluation Framework

| Feature | Primary Metric | Target | Review Cadence |
|---|---|---|---|
| Career Recommendation | Student agreement rate with top-3 | —— 68% | Monthly |
| Conversational Assistant | Helpful-rating rate | —— 78% | Weekly |
| Course Recommendation | Click-through to enrolment | —— 12% | Monthly |
| Job Matching | Application rate on high-match items | —— 30% | Monthly |
| Job Matching | Interview rate on high-match applications | —— 22% | Monthly |
| Resume Builder | ATS parse success rate | —— 96% | Monthly |
| Daily Insights | Action-click rate | —— 24% | Weekly |
| Weakness Detection | Score improvement after remediation | —— +8% | Monthly |
| Mock Interview | Correlation with real interview outcomes | —— 0.45 | Quarterly |
| Candidate Ranking | Precision at top-20 vs. employer shortlist | —— 65% | Monthly |
| Fraud Detection | Precision / Recall | —— 85% / —— 78% | Monthly |

### 31.12.2 Governance Controls

| Control | Requirement |
|---|---|
| Model registry | Every model version registered with training data description, evaluation results and approval |
| Change control | Model changes require evaluation against the prior version on a held-out set |
| Bias audit | Quarterly audit for adverse impact across geography, college tier, gender and language |
| Human oversight | High-stakes outputs (rejections, career direction, financial guidance) require human availability |
| Feedback loop | Every AI output MUST offer thumbs-up/down feedback captured for evaluation |
| Incident process | AI incidents (harmful output, systematic error) MUST follow the standard incident process |
| Transparency | An AI usage disclosure page MUST describe what AI is used for and what data it uses |
| Opt-out | Students MUST be able to disable AI personalisation while retaining non-personalised platform use |

## 31.13 AI Cost Management

| Control | Description |
|---|---|
| Tiered quotas | Free 10 queries/month; Plus unlimited standard; Pro/Elite unlimited with priority |
| Model routing | Simple intents routed to smaller/cheaper models; complex reasoning to larger models |
| Caching | Deterministic outputs (career library summaries, course descriptions) cached |
| Batch processing | Insights and match recomputation batched off-peak |
| Context trimming | Only relevant context included per query |
| Budget alerts | Per-day and per-month cost thresholds with automatic degradation to cheaper models |
| Cost per active user | Target —— —,—12 per monthly active student by Y2 |

---

# Chapter 32 — Wallet & Coupon System

> **Purpose of this chapter:** To specify the complete financial value-movement layer — payments, wallet ledger, coupons, referrals, commissions and payouts — with the integrity controls required of a system handling money at scale.

## 32.1 System Overview

| Component | Responsibility |
|---|---|
| **Payments** | External money-in via Razorpay and Stripe |
| **Wallet** | Internal double-entry ledger of value |
| **Coupons** | Discount computation at checkout |
| **Referrals** | Attribution and reward for user-driven acquisition |
| **Commissions** | Accrual and settlement for channel partners and training institutes |
| **Payouts** | Money-out to partner and institute bank accounts |
| **Reconciliation** | Continuous verification of ledger integrity against external sources |

## 32.2 Payment Architecture

### 32.2.1 Payment Flow

```

Student initiates checkout
|
Order created (server-side price computation - never trust client)
|
Coupon validated and discount applied (server-side)
|
Wallet balance applied (if elected)
|
Remaining amount - ' Payment gateway order created
|
Student completes payment on gateway
|
Gateway webhook received - ' signature verified
|
Payment verified server-side via gateway API (never trust webhook alone)
|
Order marked paid (idempotent)
|
Ledger entries created (wallet debit if used; revenue recognition entry)
|
Access granted (enrolment, subscription, credits)
|
Invoice generated
|
Commission accrual created (if attributable)
|
Confirmation notification sent

```

### 32.2.2 Payment Requirements

| ID | Requirement |
|---|---|
| `FR-PAYT-001` | Order amounts MUST be computed server-side; client-supplied amounts MUST be rejected. |
| `FR-PAYT-002` | Webhook signatures MUST be verified; unverified webhooks MUST be rejected and logged. |
| `FR-PAYT-003` | Payment status MUST be confirmed by a server-to-server API call to the gateway before granting access. |
| `FR-PAYT-004` | All payment operations MUST be idempotent, keyed by order ID and gateway payment ID. |
| `FR-PAYT-005` | Failed payments MUST preserve the order for retry for 24 hours. |
| `FR-PAYT-006` | The system MUST support UPI, credit card, debit card, netbanking and wallets via Razorpay. |
| `FR-PAYT-007` | The system MUST support international cards via Stripe. |
| `FR-PAYT-008` | EMI MUST be offered on all orders above —,—8,000 with tenure options and total cost clearly displayed. |
| `FR-PAYT-009` | GST-compliant invoices MUST be generated within 60 seconds of successful payment. |
| `FR-PAYT-010` | Payment method availability MUST degrade gracefully if a gateway is unavailable, with automatic failover to the secondary provider. |
| `FR-PAYT-011` | The checkout page MUST display the final payable amount including all taxes before payment initiation. |
| `FR-PAYT-012` | Payment success rate MUST be monitored; a drop below 92% MUST trigger an alert. |

### 32.2.3 Subscription Billing

| ID | Requirement |
|---|---|
| `FR-SUB-001` | Recurring subscriptions MUST use gateway-native mandates (UPI Autopay / card mandate). |
| `FR-SUB-002` | Renewal notice MUST be sent 7 days before charge. |
| `FR-SUB-003` | Failed renewals MUST enter a dunning sequence: retry at T+1, T+3, T+5 days, then downgrade. |
| `FR-SUB-004` | Cancellation MUST be self-service and MUST take effect at the end of the current period. |
| `FR-SUB-005` | Upgrades MUST be prorated immediately; downgrades MUST take effect at period end. |
| `FR-SUB-006` | Subscription state changes MUST be reflected in feature access within 60 seconds. |

### 32.2.4 Refunds

| Refund Type | Trigger | Processing |
|---|---|---|
| Policy refund | Student request within policy window | Auto-approved if within policy; to source or wallet at student's election |
| Discretionary refund | Support-approved exception | Requires supervisor approval |
| Service failure refund | Batch cancellation, undelivered service | Automatic, full, to source |
| Partial refund | Pro-rata for partially consumed services | Computed per published policy |
| Chargeback | Gateway-initiated dispute | Evidence submission workflow |

| ID | Requirement |
|---|---|
| `FR-RFD-001` | Refund eligibility MUST be computed automatically from the published policy and actual consumption. |
| `FR-RFD-002` | Refunds to source MUST be initiated within 2 business days of approval. |
| `FR-RFD-003` | Refunds MUST reverse access, revoke certificates if applicable, and claw back commissions. |
| `FR-RFD-004` | Every refund MUST generate a credit note. |
| `FR-RFD-005` | Refund status MUST be visible to the student with expected credit timeline. |

## 32.3 Wallet Ledger

### 32.3.1 Design Principles

| Principle | Implementation |
|---|---|
| **Double-entry** | Every movement creates balanced entries; the ledger always balances |
| **Immutable** | Entries are never updated or deleted; corrections are new compensating entries |
| **Idempotent** | Every operation carries an idempotency key |
| **Auditable** | Every entry traces to a source event with full lineage |
| **Reconciled** | Daily automated reconciliation against gateway settlements and balances |

### 32.3.2 Balance Types

| Balance | Description | Withdrawable |
|---|---|---|
| Available | Usable immediately | Depends on source |
| On hold | Reserved pending an event (refund window, dispute) | No |
| Promotional | Granted credits with expiry | No |
| Earned | Referral rewards, commissions | Yes (after KYC) |
| Refund credit | Refunds elected to wallet | Yes |

### 32.3.3 Wallet Operations

| Operation | Description | Controls |
|---|---|---|
| Credit | Add value | Source-typed; idempotent |
| Debit | Consume value | Serialised; balance-checked |
| Hold | Reserve value | Time-bound with auto-release |
| Release | Free a hold | Automatic on expiry or event |
| Transfer | Move between wallets | Both legs atomic |
| Payout | Move to external bank | Approval-gated; KYC-gated |
| Adjustment | Administrative correction | Dual approval; reason mandatory |
| Expiry | Remove expired promotional credit | Scheduled job; notified in advance |

### 32.3.4 Requirements

Refer to §21.6.4 for the full wallet functional requirement set. Additional requirements:

| ID | Requirement |
|---|---|
| `FR-WAL-021` | Promotional credit expiry MUST be notified to the user at T-14 and T-3 days. |
| `FR-WAL-022` | Wallet spending priority MUST be: expiring promotional credit first, then other promotional, then earned, then refund credit. |
| `FR-WAL-023` | Wallet statements MUST show running balance and MUST be exportable for any date range. |
| `FR-WAL-024` | Negative balances MUST only arise from clawbacks and MUST be recorded as recoverable receivables. |
| `FR-WAL-025` | Wallet operations MUST complete within 500ms at P95. |

## 32.4 Coupon System

Refer to §21.7 for coupon types and rule dimensions. Additional operational specification follows.

### 32.4.1 Coupon Validation Order

```
1. Code exists and is active
2. Within validity period
3. Global usage limit not exhausted
4. Per-user usage limit not exhausted
5. Campaign budget not exhausted
6. User eligibility satisfied (segment, geography, new/existing)
7. Cart eligibility satisfied (products, categories, exclusions)
8. Minimum order value satisfied
9. Stacking rules satisfied
10. Compute discount, apply maximum cap
11. Return discount amount and revised total
```

### 32.4.2 Referral Programme

| Element | Specification |
|---|---|
| Referral code | Auto-generated per student, format `REF-<3 letters><4 digits>` |
| Referral link | Shareable URL with embedded code and UTM parameters |
| Attribution window | 60 days from first click |
| Attribution model | Last-touch referral code |
| Referee reward | —,—300 wallet credit on first paid purchase, or 10% off (whichever is configured) |
| Referrer reward | —,—500 wallet credit after referee's refund window closes |
| Reward cap | Maximum —,—15,000 earned per referrer per financial year |
| Fraud controls | Self-referral blocked by device, payment instrument and identity matching; circular referral graphs flagged |
| Visibility | Referrer sees referral status: clicked —' registered —' purchased —' rewarded |

| ID | Requirement |
|---|---|
| `FR-REF-001` | Self-referral MUST be blocked by matching device fingerprint, payment instrument, phone number and email domain patterns. |
| `FR-REF-002` | Referral rewards MUST be credited only after the referee's refund window closes. |
| `FR-REF-003` | Referral status MUST be visible to the referrer in real time. |
| `FR-REF-004` | Referral rewards MUST be reversed if the referee's purchase is refunded. |

## 32.5 Commission Engine

### 32.5.1 Commission Lifecycle

```

Attributable transaction completes
|
Attribution resolved (referral code / partner link / assigned relationship)
|
Commission computed per the partner's tier rate card
|
Accrual created with status PENDING
|
Hold period (refund window + 15 days)
|
Status - ' AVAILABLE (credited to partner wallet)
|
Partner requests payout
|
Approval (dual approval above threshold)
|
Bank transfer executed
|
Status - ' PAID with UTR recorded
|
TDS deducted and recorded; statement issued

```

### 32.5.2 Requirements

| ID | Requirement |
|---|---|
| `FR-COM-001` | Attribution MUST be recorded immutably at the moment of the qualifying event. |
| `FR-COM-002` | Commission rates MUST be resolved from the partner's tier at the time of the transaction, not at payout time. |
| `FR-COM-003` | Tier upgrades MUST NOT retroactively change already-accrued commissions. |
| `FR-COM-004` | Refunds MUST trigger automatic commission clawback. |
| `FR-COM-005` | Partners MUST be able to see every accrual with its source transaction reference. |
| `FR-COM-006` | TDS MUST be computed and deducted per prevailing rates, with a TDS certificate issued. |
| `FR-COM-007` | Commission disputes MUST be raisable by the partner with a 30-day window and MUST be resolved within 10 business days. |

## 32.6 Payout Processing

| Element | Specification |
|---|---|
| Eligibility | KYC complete, bank account verified (penny-drop), minimum balance —,—500 |
| Frequency | Bronze monthly · Silver bi-weekly · Gold and Platinum weekly |
| Request | Partner-initiated or automatic per schedule |
| Approval | Finance approval; dual approval above —,—50,000 |
| Execution | Batch bank transfer via payment gateway payout API |
| Confirmation | UTR recorded; partner notified |
| Failure handling | Failed transfers returned to wallet with reason; partner notified to correct details |
| Statement | Itemised statement with gross, TDS, net |
| SLA | Within 5 business days of approved request |

**Requirement `FR-POUT-001`:** Payout batches MUST be reconciled against bank statements within 2 business days of execution; unreconciled items MUST be escalated.

## 32.7 Reconciliation

| Reconciliation | Frequency | Method | Escalation |
|---|---|---|---|
| Wallet ledger integrity | Daily | Sum of entries vs. stored balance for every wallet | Any variance —' immediate alert and wallet freeze |
| Gateway settlement | Daily | Gateway settlement report vs. platform payment records | Variance > —,—100 —' Finance review |
| Refund reconciliation | Daily | Refunds initiated vs. gateway refund confirmations | Pending > 5 days —' escalation |
| Payout reconciliation | Per batch | Payout instructions vs. bank confirmations | Any failure —' immediate handling |
| Commission accrual | Weekly | Transactions vs. accruals for completeness | Missing accrual —' correction entry |
| Revenue recognition | Monthly | Deferred revenue schedules vs. delivery | Variance —' Finance review |
| Coupon liability | Monthly | Outstanding promotional credit vs. provision | Variance —' provision adjustment |

**Requirement `FR-REC-001`:** All reconciliation results MUST be recorded with an auditable trail, including variances found, investigation notes and resolution.

## 32.8 Financial Controls

| Control | Implementation |
|---|---|
| Segregation of duties | Payout requester —— approver —— executor |
| Approval thresholds | Configurable limits by role and amount |
| Dual approval | Required for payouts > —,—50,000, refunds > —,—25,000, and all adjustments |
| Rate limits | Payout requests limited per partner per period |
| Anomaly detection | Unusual transaction patterns flagged for review |
| Immutable audit | Every financial action logged with actor, timestamp, before/after, IP |
| Access control | Financial data restricted to `FINANCE_ADMIN` and `SUPER_ADMIN` |
| Encryption | Bank details encrypted at field level |
| Retention | Financial records retained for 8 years |

## 32.9 System Metrics

| Metric | Target |
|---|---|
| Payment success rate | —— 94% |
| Payment processing latency (P95) | < 3 seconds |
| Wallet operation latency (P95) | < 500ms |
| Ledger reconciliation variance | —,—0 |
| Refund processing time (median) | —— 2 business days |
| Payout SLA compliance | —— 98% |
| Commission dispute rate | —— 1.5% |
| Coupon fraud rate | —— 0.3% of redemptions |
| Invoice generation success | —— 99.9% |

---

# Chapter 33 — Notification System

> **Purpose of this chapter:** To specify the multi-channel communication system that drives engagement, retention and operational awareness across all roles, with the discipline required to avoid notification fatigue.

## 33.1 System Overview

| Element | Description |
|---|---|
| **Purpose** | Deliver the right message to the right person on the right channel at the right time |
| **Channels** | In-app, Email, SMS, WhatsApp, Web Push, Mobile Push (V2) |
| **Design constraint** | Every notification must be actionable or genuinely informative; no filler |
| **Governance** | Per-user preferences, frequency caps, quiet hours, unsubscribe compliance |

## 33.2 Channel Strategy

| Channel | Best For | Latency | Cost | Constraints |
|---|---|---|---|---|
| **In-app** | All notifications; persistent record | Real-time | Negligible | Requires app open |
| **Web Push** | Time-sensitive re-engagement | Seconds | Negligible | Requires permission grant |
| **Email** | Detailed content, receipts, reports, digests | Minutes | Low | Deliverability management required |
| **SMS** | Critical, time-sensitive, high-reliability | Seconds | Medium | 160 chars; DLT template registration required |
| **WhatsApp** | Rich, high-open-rate engagement | Seconds | Medium-High | Template approval required; opt-in mandatory |
| **Mobile Push** | Engagement, reminders (V2) | Seconds | Negligible | Requires app install |

## 33.3 Notification Catalogue

### 33.3.1 Student Notifications

| # | Event | In-App | Email | SMS | WhatsApp | Push | Priority |
|---|---|---|---|---|---|---|---|
| 1 | Welcome / registration complete | Yes | Yes | Yes | Opt-in | — | High |
| 2 | Email/mobile verification | Yes | Yes | Yes | — | — | Critical |
| 3 | Career assessment reminder | Yes | Yes | — | Opt-in | Yes | Medium |
| 4 | Career report ready | Yes | Yes | Yes | Opt-in | Yes | High |
| 5 | Payment successful | Yes | Yes | Yes | Opt-in | — | Critical |
| 6 | Payment failed | Yes | Yes | Yes | Opt-in | Yes | Critical |
| 7 | EMI due reminder | Yes | Yes | Yes | Opt-in | Yes | High |
| 8 | Class starting in 30 minutes | Yes | — | — | Opt-in | Yes | High |
| 9 | Class starting in 5 minutes | Yes | — | — | — | Yes | High |
| 10 | Class recording available | Yes | Yes (digest) | — | — | — | Low |
| 11 | Class cancelled or rescheduled | Yes | Yes | Yes | Opt-in | Yes | Critical |
| 12 | New study material published | Yes | Yes (digest) | — | — | — | Low |
| 13 | Mock test scheduled | Yes | Yes | — | Opt-in | Yes | Medium |
| 14 | Mock test result ready | Yes | Yes | — | Opt-in | Yes | High |
| 15 | Doubt answered | Yes | Yes | — | — | Yes | Medium |
| 16 | Study plan updated | Yes | — | — | — | Yes | Low |
| 17 | Attendance falling below threshold | Yes | Yes | — | Opt-in | Yes | High |
| 18 | Course enrolment confirmed | Yes | Yes | — | Opt-in | — | High |
| 19 | Assignment due in 24 hours | Yes | Yes | — | — | Yes | High |
| 20 | Assignment graded | Yes | Yes | — | — | Yes | Medium |
| 21 | Certificate issued | Yes | Yes | Yes | Opt-in | Yes | High |
| 22 | New matching internship | Yes | Yes (digest) | — | Opt-in | Yes | Medium |
| 23 | New matching job | Yes | Yes (digest) | — | Opt-in | Yes | Medium |
| 24 | Application received confirmation | Yes | Yes | — | — | — | Medium |
| 25 | Application shortlisted | Yes | Yes | Yes | Opt-in | Yes | Critical |
| 26 | Assessment invitation | Yes | Yes | Yes | Opt-in | Yes | Critical |
| 27 | Interview scheduled | Yes | Yes | Yes | Opt-in | Yes | Critical |
| 28 | Interview reminder (24h / 1h) | Yes | Yes | Yes | Opt-in | Yes | Critical |
| 29 | Application rejected | Yes | Yes | — | — | Yes | High |
| 30 | Offer received | Yes | Yes | Yes | Opt-in | Yes | Critical |
| 31 | Offer response deadline approaching | Yes | Yes | Yes | Opt-in | Yes | Critical |
| 32 | College application deadline approaching | Yes | Yes | Yes | Opt-in | Yes | High |
| 33 | College application status change | Yes | Yes | Yes | Opt-in | Yes | High |
| 34 | Admission confirmed | Yes | Yes | Yes | Opt-in | Yes | Critical |
| 35 | Study abroad milestone due | Yes | Yes | — | Opt-in | Yes | High |
| 36 | Project sprint deliverable due | Yes | Yes | — | — | Yes | High |
| 37 | Mentor feedback received | Yes | Yes | — | — | Yes | Medium |
| 38 | Wallet credited | Yes | Yes | — | Opt-in | — | Medium |
| 39 | Referral reward earned | Yes | Yes | — | Opt-in | Yes | Medium |
| 40 | Coupon expiring soon | Yes | Yes | — | — | Yes | Low |
| 41 | Premium renewal upcoming | Yes | Yes | — | Opt-in | — | High |
| 42 | Weekly progress digest | — | Yes | — | — | — | Low |
| 43 | Exam notification released (subscribed track) | Yes | Yes | Yes | Opt-in | Yes | High |
| 44 | Re-engagement (dormant 14 days) | Yes | Yes | — | — | Yes | Low |
| 45 | Security: new device login | Yes | Yes | Yes | — | — | Critical |
| 46 | Security: password changed | Yes | Yes | Yes | — | — | Critical |

### 33.3.2 College Notifications

| Event | Channels | Priority |
|---|---|---|
| New admission lead | In-app, Email | High |
| Hot lead (score —— 75) | In-app, Email, SMS | Critical |
| Application received | In-app, Email | High |
| Drive registration milestone | In-app, Email | Medium |
| Company confirmed for drive | In-app, Email | High |
| Drive results pending entry | In-app, Email | High |
| Student placement confirmed | In-app, Email | Medium |
| Subscription renewal due | In-app, Email | High |
| Verification expiring | In-app, Email | Critical |
| Monthly analytics digest | Email | Low |

### 33.3.3 Company / HR Notifications

| Event | Channels | Priority |
|---|---|---|
| New application received | In-app, Email (digest) | Medium |
| High-match candidate applied | In-app, Email | High |
| Assessment completed by candidate | In-app, Email | Medium |
| Interview scheduled/rescheduled | In-app, Email | High |
| Interview feedback overdue | In-app, Email | High |
| Offer accepted | In-app, Email, SMS | Critical |
| Offer declined | In-app, Email | High |
| Posting expiring in 3 days | In-app, Email | Medium |
| Credits running low | In-app, Email | High |
| Payroll run due | In-app, Email | Critical |
| Statutory filing due | In-app, Email | Critical |
| No-response rate warning | In-app, Email | Critical |
| Verification expiring | In-app, Email | Critical |

### 33.3.4 Training Institute Notifications

| Event | Channels | Priority |
|---|---|---|
| New enrolment | In-app, Email | Medium |
| Class starting soon | In-app, Push | High |
| Unanswered doubts (> SLA) | In-app, Email | High |
| Ungraded assignments (> SLA) | In-app, Email | High |
| Content review outcome | In-app, Email | High |
| Payout processed | In-app, Email | High |
| Rating below threshold | In-app, Email | Critical |

### 33.3.5 Channel Partner Notifications

| Event | Channels | Priority |
|---|---|---|
| New lead from your link | In-app, Email | Medium |
| Conversion recorded | In-app, Email, WhatsApp | High |
| Commission credited | In-app, Email, WhatsApp | High |
| Payout processed | In-app, Email, SMS | High |
| Tier upgraded | In-app, Email, WhatsApp | High |
| New collateral available | In-app, Email | Low |
| Monthly performance summary | Email | Low |

### 33.3.6 Admin Notifications

| Event | Channels | Priority |
|---|---|---|
| Verification SLA breach | In-app, Email, SMS | Critical |
| Payment failure rate spike | In-app, Email, SMS | Critical |
| Reconciliation variance | In-app, Email, SMS | Critical |
| Fraud signal detected | In-app, Email, SMS | Critical |
| System health degradation | In-app, Email, SMS | Critical |
| Escalated dispute | In-app, Email | High |
| Payout batch awaiting approval | In-app, Email | High |
| Content report requiring review | In-app | Medium |

## 33.4 Notification Preferences

### 33.4.1 User Control Model

| Control | Granularity |
|---|---|
| Channel toggle | Per channel (email, SMS, WhatsApp, push) |
| Category toggle | Per category (Academic, Opportunities, Payments, Marketing, System) |
| Frequency | Immediate / Daily digest / Weekly digest / Off (per category) |
| Quiet hours | Configurable window; non-critical notifications suppressed |
| Language | Preferred language for notifications |

### 33.4.2 Non-Suppressible Notifications

The following MUST always be delivered regardless of preferences:

| Category | Examples |
|---|---|
| Security | Login from new device, password change, account lock |
| Financial | Payment success/failure, refund, invoice |
| Legal/contractual | Terms change, policy change, account action |
| Critical service | Class cancellation, exam date change, offer deadline |

**Requirement `FR-NTF-001`:** Marketing notifications MUST be fully suppressible and MUST include an unsubscribe mechanism in every message.

## 33.5 Delivery Requirements

| ID | Requirement |
|---|---|
| `FR-NTF-011` | In-app notifications MUST appear in real time without page refresh. |
| `FR-NTF-012` | Critical notifications MUST be delivered on at least two channels. |
| `FR-NTF-013` | SMS delivery MUST use DLT-registered templates as required by Indian regulation. |
| `FR-NTF-014` | WhatsApp messages MUST use pre-approved templates and MUST require explicit opt-in. |
| `FR-NTF-015` | Email MUST implement SPF, DKIM and DMARC; bounce and complaint handling MUST be automated. |
| `FR-NTF-016` | Failed deliveries MUST retry with exponential backoff up to 3 attempts. |
| `FR-NTF-017` | Persistent delivery failures MUST mark the channel as unhealthy for that user and MUST notify them in-app. |
| `FR-NTF-018` | Notification delivery status MUST be tracked (queued, sent, delivered, opened, clicked, failed). |
| `FR-NTF-019` | Frequency capping MUST limit non-critical notifications to 5 per user per day across all channels. |
| `FR-NTF-020` | Quiet hours MUST suppress non-critical notifications, queuing them for the next allowed window. |
| `FR-NTF-021` | Notification content MUST be templated and versioned, editable by admin without deployment. |
| `FR-NTF-022` | All notifications MUST deep-link to the relevant in-app destination. |
| `FR-NTF-023` | Bulk notifications MUST be rate-limited to protect provider reputation and MUST be sendable to at least 100,000 recipients within 10 minutes. |

## 33.6 Template System

| Element | Requirement |
|---|---|
| Variables | Named placeholders with defaults and null-safety |
| Personalisation | Name, stage, target, contextual data |
| Localisation | Per-language template variants sharing a template key |
| Preview | Admin preview with sample data before activation |
| Versioning | Template changes versioned with rollback |
| Approval | Marketing templates require approval before activation |
| A/B testing | Multiple variants with performance measurement (V2) |
| Compliance | DLT template IDs mapped for SMS; WhatsApp template IDs mapped |

## 33.7 Notification Analytics

| Metric | Purpose |
|---|---|
| Delivery rate by channel | Provider health |
| Open rate by category and template | Content effectiveness |
| Click-through rate | Action effectiveness |
| Conversion rate post-notification | Business impact |
| Unsubscribe rate by category | Fatigue detection |
| Complaint rate (email) | Deliverability risk |
| Time-to-open distribution | Send-time optimisation |
| Channel preference distribution | Channel investment decisions |

**Requirement `FR-NTF-031`:** Any notification template with an unsubscribe rate above 2% or a click-through rate below 1% over 1,000 sends MUST be flagged for review.

## 33.8 System Metrics

| Metric | Target |
|---|---|
| In-app delivery latency (P95) | < 2 seconds |
| Push delivery latency (P95) | < 10 seconds |
| SMS delivery rate | —— 97% |
| Email delivery rate | —— 98% |
| Email open rate (transactional) | —— 45% |
| Email open rate (digest) | —— 22% |
| WhatsApp delivery rate | —— 98% |
| Notification-driven action rate | —— 18% |
| Unsubscribe rate | —— 1.2% |
| Spam complaint rate | —— 0.08% |

---

# Chapter 34 — Analytics

> **Purpose of this chapter:** To specify the analytics capability — the event model, metric definitions, role-scoped dashboards, and the analytical infrastructure that makes Ellowring a data-driven organisation.

## 34.1 Analytics Architecture

| Layer | Component | Purpose |
|---|---|---|
| **Collection** | Client SDK + server-side event emission | Capture typed product events |
| **Transport** | Event queue | Reliable, ordered delivery |
| **Storage — Raw** | Event store | Immutable raw event log |
| **Storage — Modelled** | Analytics warehouse | Dimensional models for querying |
| **Computation** | Scheduled aggregation jobs | Pre-computed metrics for dashboards |
| **Serving** | Metrics API | Low-latency dashboard queries |
| **Presentation** | Role-scoped dashboards | Visualisation and exploration |
| **Export** | Report generation | PDF/CSV/XLSX outputs |

## 34.2 Event Model

### 34.2.1 Event Schema

Every event carries a standard envelope:

| Field | Description |
|---|---|
| `event_id` | Unique identifier |
| `event_name` | Dot-notation name (e.g., `course.lesson.completed`) |
| `event_version` | Schema version |
| `occurred_at` | Event timestamp (source of truth) |
| `received_at` | Ingestion timestamp |
| `actor_id`, `actor_role` | Who performed the action |
| `tenant_id` | Institutional context if applicable |
| `session_id` | Session correlation |
| `device`, `platform`, `app_version` | Client context |
| `properties` | Event-specific typed payload |

### 34.2.2 Core Event Taxonomy

| Domain | Events |
|---|---|
| **Identity** | `user.registered`, `user.verified`, `user.logged_in`, `user.logged_out`, `user.role_added`, `user.deactivated` |
| **Profile** | `profile.updated`, `profile.completeness_changed`, `profile.document_uploaded`, `profile.consent_changed` |
| **Career** | `assessment.started`, `assessment.section_completed`, `assessment.completed`, `report.viewed`, `career.target_selected`, `roadmap.generated` |
| **Coaching** | `batch.viewed`, `batch.enrolled`, `class.joined`, `class.left`, `recording.watched`, `material.downloaded`, `doubt.posted`, `doubt.resolved` |
| **Assessment** | `test.started`, `test.submitted`, `test.result_viewed`, `solution.viewed`, `question.reported` |
| **Courses** | `course.viewed`, `course.enrolled`, `lesson.started`, `lesson.completed`, `assignment.submitted`, `assignment.graded`, `course.completed` |
| **Certificates** | `certificate.issued`, `certificate.downloaded`, `certificate.shared`, `certificate.verified` |
| **Colleges** | `college.viewed`, `college.compared`, `college.shortlisted`, `application.started`, `application.submitted`, `admission.confirmed` |
| **Study Abroad** | `country.viewed`, `university.shortlisted`, `milestone.completed`, `abroad_application.submitted`, `visa.status_changed` |
| **Internships** | `internship.viewed`, `internship.applied`, `internship.shortlisted`, `internship.selected`, `internship.completed` |
| **Projects** | `project.viewed`, `project.applied`, `project.team_formed`, `sprint.completed`, `deliverable.submitted`, `project.graded` |
| **Jobs** | `job.viewed`, `job.applied`, `application.stage_changed`, `interview.scheduled`, `interview.completed`, `offer.extended`, `offer.accepted`, `candidate.joined` |
| **Hiring (Employer)** | `job.posted`, `candidate.viewed`, `candidate.shortlisted`, `candidate.rejected`, `assessment.sent`, `offer.created` |
| **Payroll** | `employee.onboarded`, `payroll.run_executed`, `payslip.generated`, `employee.exited` |
| **Commerce** | `checkout.started`, `coupon.applied`, `payment.initiated`, `payment.succeeded`, `payment.failed`, `refund.processed`, `subscription.started`, `subscription.cancelled` |
| **Wallet** | `wallet.credited`, `wallet.debited`, `payout.requested`, `payout.processed` |
| **AI** | `ai.query_submitted`, `ai.response_delivered`, `ai.feedback_given`, `ai.recommendation_accepted`, `ai.recommendation_dismissed` |
| **Notifications** | `notification.sent`, `notification.delivered`, `notification.opened`, `notification.clicked`, `notification.unsubscribed` |

### 34.2.3 Event Requirements

| ID | Requirement |
|---|---|
| `FR-EVT-001` | All events MUST conform to a registered, versioned schema; non-conforming events MUST be routed to a dead-letter queue. |
| `FR-EVT-002` | Events MUST NOT contain sensitive personal data (passwords, full bank numbers, government IDs). |
| `FR-EVT-003` | Business-critical events (payments, enrolments, applications, offers) MUST be emitted server-side, never client-side only. |
| `FR-EVT-004` | Event delivery MUST be at-least-once with idempotent consumption. |
| `FR-EVT-005` | Event ingestion MUST sustain 5,000 events per second. |
| `FR-EVT-006` | Events MUST be available in the warehouse within 15 minutes of occurrence. |

## 34.3 Metric Definitions

### 34.3.1 Acquisition Metrics

| Metric | Definition |
|---|---|
| New registrations | Count of `user.registered` in period |
| Verified registrations | Registrations completing email/mobile verification |
| Registration source | First-touch attribution channel |
| Landing —' registration rate | Registrations / unique landing page visitors |
| CAC | Total acquisition spend / new paying users |
| Organic share | Registrations from organic search and direct / total |

### 34.3.2 Activation Metrics

| Metric | Definition |
|---|---|
| Activation rate | % of registrations completing a defined activation event within 7 days |
| Activation events | Career assessment completed OR content consumed OR opportunity applied |
| Time to activation | Median hours from registration to activation |
| Profile completeness | Weighted % of profile fields populated |
| Onboarding completion | % completing the guided onboarding checklist |

### 34.3.3 Engagement Metrics

| Metric | Definition |
|---|---|
| DAU / WAU / MAU | Unique users with any meaningful action |
| Stickiness | DAU / MAU |
| Sessions per user per week | Session count / active users |
| Session duration | Median active session length |
| Modules used per user | Distinct modules with activity in period |
| Multi-module rate | % of users active in —— 3 modules |
| Content consumption | Minutes of video watched, lessons completed |
| Feature adoption | % of eligible users using each feature |

### 34.3.4 Learning Metrics

| Metric | Definition |
|---|---|
| Class attendance rate | Sessions attended / sessions scheduled (—— 60% presence counted) |
| Course completion rate | Courses completed / courses enrolled (cohort-based) |
| Test participation rate | Tests attempted / tests available |
| Score improvement | Change in percentile from first to latest test |
| Syllabus coverage | % of syllabus topics with completed content |
| Study plan adherence | Tasks completed / tasks scheduled |
| Doubt resolution time | Median hours from post to resolution |

### 34.3.5 Outcome Metrics

| Metric | Definition |
|---|---|
| Admission conversion | Confirmed admissions / applications submitted |
| Internship placement rate | Internships secured / students applying |
| Project completion rate | Projects completed / projects joined |
| Placement rate | Offers accepted / placement-ready students |
| Time to placement | Median days from ST-7 entry to offer acceptance |
| Salary outcome | Median first salary by role, city and college tier |
| Placement Readiness Score | Composite per §22.7.1 |
| Certificate issuance | Certificates issued per active student |

### 34.3.6 Monetisation Metrics

| Metric | Definition |
|---|---|
| Paying users | Unique users with —— 1 successful payment in period |
| Free —' paid conversion | Paying users / registered users (cohort-based) |
| ARPU / ARPPU | Revenue / active users; Revenue / paying users |
| Revenue by stream | Revenue attributed to each of the 13 streams |
| MRR / ARR | Recurring revenue |
| Net revenue retention | Revenue from prior cohort this period / prior period |
| LTV | Projected gross profit over expected tenure |
| Payback period | Months to recover CAC |
| Refund rate | Refunded amount / gross revenue |

### 34.3.7 Marketplace Metrics

| Metric | Definition |
|---|---|
| Liquidity | Applications per posting; postings per active student |
| Fill rate | Postings resulting in a hire / total postings |
| Time to fill | Median days from posting to offer acceptance |
| Match quality | Interview rate on high-match applications |
| Supply growth | New verified employers/colleges/institutes per period |
| Employer no-response rate | Applications with no action in 14 days / total |

### 34.3.8 Retention Metrics

| Metric | Definition |
|---|---|
| Day 1 / 7 / 30 retention | % of a registration cohort active on/by that day |
| Month 1/3/6/12 retention | % of cohort active in that month |
| Churn rate | % of paying users not renewing |
| Resurrection rate | % of dormant users returning |
| Cohort revenue retention | Revenue from a cohort over time |
| Stage progression rate | % advancing to the next journey stage per §22 |

## 34.4 Role-Scoped Dashboards

### 34.4.1 Student Analytics

| Section | Content |
|---|---|
| Learning summary | Hours studied, lessons completed, attendance rate, streak |
| Test performance | Score trend, percentile trend, subject-wise accuracy, topic strengths and weaknesses |
| Skill growth | Verified skills over time, proficiency progression |
| Application funnel | Applied, shortlisted, interviewed, offered — with rates |
| Comparison | Anonymised comparison with similar students (same stage, target, cohort) |
| Placement readiness | PRS with component breakdown and improvement actions |
| Time allocation | Where study time is spent by module and subject |
| Achievements | Certificates, badges, milestones |

### 34.4.2 College Analytics

| Section | Content |
|---|---|
| Student overview | Total, active, by department, by year, engagement distribution |
| Placement funnel | Eligible —' registered —' shortlisted —' interviewed —' offered —' placed |
| Placement statistics | Placement %, package distribution (highest/average/median), recruiter count |
| Department comparison | Placement metrics by department with peer benchmark |
| Recruiter analysis | Companies by hires, packages offered, repeat participation |
| Admission funnel | Leads —' contacted —' applied —' admitted, by source and programme |
| Counsellor performance | Leads handled, contact rate, conversion, response time |
| Student readiness | PRS distribution, at-risk students, skill gap summary |
| Trend analysis | Year-on-year comparison across all metrics |
| Peer benchmark | Anonymised comparison against similar institutions |

### 34.4.3 Company Analytics

| Section | Content |
|---|---|
| Hiring funnel | Full pipeline with stage conversion rates |
| Efficiency | Time-to-fill, time-to-hire, time-in-stage, cost-per-hire |
| Source analysis | Applications and hires by source |
| Quality | Offer acceptance rate, assessment scores of hires, 90-day retention |
| College analysis | Applications and hires by college and college tier |
| Candidate experience | Response time, candidate ratings, no-response rate |
| Requisition status | Open, filled, aging requisitions |
| Benchmark | Anonymised comparison against sector and size peers |
| Payroll (V2) | Headcount, cost, attrition, statutory summary |

### 34.4.4 Training Institute Analytics

| Section | Content |
|---|---|
| Enrolment | New, active, completed by course and batch; trend |
| Engagement | Attendance, content consumption, completion rates |
| Assessment | Score distribution, pass rates, item analysis |
| Student feedback | Ratings, sentiment, common themes |
| Trainer performance | Ratings, punctuality, doubt SLA, student outcomes |
| Revenue | Gross, platform share, institute share, payout status |
| Funnel | Course page views —' enrolments |

### 34.4.5 Channel Partner Analytics

| Section | Content |
|---|---|
| Lead funnel | Clicks —' registrations —' engaged —' converted |
| Conversion by product | Which products convert best for this partner |
| Earnings | By product, by month, trend |
| Tier progress | Current GMV vs. next tier threshold |
| Payout history | Requested, approved, paid, pending |
| Leaderboard | Regional and tier ranking (opt-in) |
| Collateral performance | Which assets drive conversions |

### 34.4.6 Admin Analytics

| Section | Content |
|---|---|
| Business overview | Revenue, users, growth against targets |
| Acquisition | Registrations by source, CAC, channel performance |
| Activation and retention | Cohort tables, funnel analysis |
| Monetisation | Revenue by stream, conversion, ARPU, LTV:CAC |
| Marketplace health | Liquidity, fill rates, supply/demand balance |
| Operational health | Verification SLA, support SLA, payout SLA, dispute rates |
| Platform health | Uptime, latency, error rates, queue depths |
| Content performance | Top courses, batches, pages; completion rates |
| Fraud and risk | Fraud signals, refund rates, chargeback rates |
| Cohort analysis | Any metric sliced by registration cohort |
| Funnel builder | Custom funnel definition and analysis |
| Segment builder | Custom user segment definition |

## 34.5 Analytics Requirements

| ID | Requirement |
|---|---|
| `FR-ANL-001` | All dashboards MUST load within 3 seconds at P95 for standard date ranges. |
| `FR-ANL-002` | All metrics MUST have a published, single-source-of-truth definition accessible from the dashboard. |
| `FR-ANL-003` | All dashboards MUST support date range selection with comparison to a prior period. |
| `FR-ANL-004` | All charts MUST be exportable as image and underlying data as CSV. |
| `FR-ANL-005` | Data freshness MUST be displayed on every dashboard. |
| `FR-ANL-006` | Tenant-scoped dashboards MUST NEVER expose data from other tenants. |
| `FR-ANL-007` | Benchmark comparisons MUST use anonymised aggregates with a minimum cohort of 10 entities. |
| `FR-ANL-008` | Admin analytics MUST support ad-hoc segmentation across at least 15 dimensions. |
| `FR-ANL-009` | Cohort analysis MUST support daily, weekly and monthly cohorts over at least 24 periods. |
| `FR-ANL-010` | Funnel analysis MUST support up to 8 steps with configurable conversion windows. |
| `FR-ANL-011` | All analytics queries MUST be executed against the warehouse, never against the transactional database. |
| `FR-ANL-012` | Personally identifiable data in analytics MUST be access-controlled and MUST be excluded from exports by default. |

## 34.6 Data Governance

| Control | Requirement |
|---|---|
| Metric ownership | Every metric has a named owner responsible for its definition |
| Definition registry | Central, versioned metric definitions with change history |
| Data quality monitoring | Automated checks for volume anomalies, null spikes, schema drift |
| Lineage | Every dashboard metric traceable to its source events |
| Access control | Row-level and column-level security by role and tenant |
| Retention | Raw events 24 months; aggregates indefinitely; PII purged on deletion request |
| Anonymisation | Benchmarks and comparisons use k-anonymity with k —— 10 |

---

# Chapter 35 — Reports

> **Purpose of this chapter:** To specify the reporting capability — the complete report catalogue by role, generation mechanics, scheduling, formats and compliance-oriented outputs.

## 35.1 Reporting Principles

| Principle | Statement |
|---|---|
| **Self-service** | Users generate reports themselves without support intervention |
| **Scheduled delivery** | Recurring reports delivered automatically |
| **Multiple formats** | PDF for presentation; XLSX/CSV for analysis |
| **Auditable** | Every report records who generated it, when, and with what parameters |
| **Scoped** | Reports contain only data the requester is authorised to see |
| **Branded** | Institutional reports carry the institution's branding where configured |

## 35.2 Report Catalogue — Student

| Report | Contents | Format | Trigger |
|---|---|---|---|
| Career Assessment Report | Full assessment results, career matches, rationale, roadmap | PDF | On completion |
| Academic Progress Report | Attendance, syllabus coverage, test performance, trend | PDF | On-demand, monthly |
| Test Performance Report | Detailed analysis of a single test or a series | PDF | On-demand |
| Skill Portfolio Report | Verified skills, certificates, projects, assessments | PDF | On-demand |
| Application Summary | All applications with statuses and outcomes | PDF/XLSX | On-demand |
| Placement Readiness Report | PRS with component detail and improvement plan | PDF | On-demand |
| Certificate Portfolio | All certificates with verification codes | PDF | On-demand |
| Payment History | All transactions, invoices, refunds | PDF/XLSX | On-demand |
| Wallet Statement | Ledger entries for a date range | PDF/CSV | On-demand |
| Data Export (DPDP) | Complete personal data export | JSON/ZIP | On-demand |

## 35.3 Report Catalogue — College

| Report | Contents | Format | Frequency |
|---|---|---|---|
| Placement Summary Report | Placement %, package statistics, recruiter list, department breakdown, trend | PDF/XLSX | On-demand, annual |
| Detailed Placement Register | Student-wise placement record with company, role, package, date | XLSX | Annual |
| Accreditation Data Pack (NAAC/NBA) | Outcome data mapped to accreditation criteria | XLSX | On-demand |
| Admission Funnel Report | Leads, contacts, applications, admissions by source, programme, counsellor | XLSX | Monthly |
| Counsellor Performance Report | Per-counsellor lead handling and conversion metrics | XLSX | Monthly |
| Student Engagement Report | Platform engagement by department and year | XLSX | Monthly |
| Student Readiness Report | PRS distribution, at-risk list, skill gaps | PDF/XLSX | Quarterly |
| Drive Performance Report | Per-drive funnel, results, offers | PDF/XLSX | Per drive |
| Recruiter Feedback Report | Aggregated employer feedback on the institution's candidates | PDF | Annual |
| Peer Benchmark Report | Anonymised comparison with similar institutions | PDF | Annual |
| Subscription Value Report | Usage, outcomes and ROI for the subscription period | PDF | Annual (pre-renewal) |
| Alumni Outcome Report | Long-term outcomes of graduated cohorts | XLSX | Annual |

## 35.4 Report Catalogue — Company

| Report | Contents | Format | Frequency |
|---|---|---|---|
| Hiring Funnel Report | Full pipeline with conversion rates by requisition | PDF/XLSX | On-demand, monthly |
| Time-to-Hire Report | Time metrics by role, department, source | XLSX | Monthly |
| Source Effectiveness Report | Applications and hires by source with cost | XLSX | Monthly |
| Cost-per-Hire Report | Total hiring cost allocated per hire | XLSX | Quarterly |
| Candidate Experience Report | Response times, ratings, no-response rate | PDF | Quarterly |
| Offer Analysis Report | Offers extended, accepted, declined with reasons | XLSX | Monthly |
| Campus Drive Report | Per-drive performance across colleges | PDF/XLSX | Per drive |
| Diversity Report | Distribution by college tier, geography, gender (voluntary) | PDF | Quarterly |
| Payroll Register | Full employee-wise payroll computation | XLSX | Monthly |
| Salary Disbursement File | Bank transfer file | CSV/XLSX | Monthly |
| Statutory Summary Report | PF, ESI, PT, TDS with employee detail | XLSX | Monthly |
| Form 16 Batch | Form 16 for all employees | PDF (batch) | Annual |
| Headcount & Attrition Report | Joiners, leavers, active, attrition rate | XLSX | Monthly |
| Employment Cost Report | CTC by department, location, grade | XLSX | Monthly |
| Leave Liability Report | Accrued leave liability | XLSX | Quarterly |

## 35.5 Report Catalogue — Training Institute

| Report | Contents | Format | Frequency |
|---|---|---|---|
| Enrolment Report | Enrolments by course, batch, period with revenue | XLSX | Monthly |
| Student Progress Report | Per-student progress across enrolled batches | XLSX | Monthly |
| Attendance Report | Session-wise and student-wise attendance | XLSX | Monthly |
| Assessment Analysis | Score distributions, item analysis, pass rates | XLSX | Per test |
| Trainer Performance Report | Ratings, punctuality, SLA compliance, outcomes | PDF/XLSX | Quarterly |
| Revenue & Settlement Report | Gross revenue, platform share, institute share, payouts | PDF/XLSX | Monthly |
| Student Feedback Report | Ratings and qualitative feedback summary | PDF | Monthly |
| Course Performance Report | Views, enrolments, completions, ratings by course | XLSX | Monthly |

## 35.6 Report Catalogue — Channel Partner

| Report | Contents | Format | Frequency |
|---|---|---|---|
| Performance Summary | Leads, conversions, earnings by product and period | PDF/XLSX | Monthly |
| Commission Statement | Itemised accruals with source transaction references | PDF/XLSX | Monthly |
| Payout Statement | Payouts with gross, TDS, net, UTR | PDF | Per payout |
| TDS Certificate | TDS deducted certificate | PDF | Quarterly |
| Lead Detail Report | All leads with status and outcome | XLSX | On-demand |
| Tier Status Report | Current tier, GMV, progress to next tier | PDF | Monthly |

## 35.7 Report Catalogue — Admin

| Report | Contents | Format | Frequency |
|---|---|---|---|
| Business Performance Report | Revenue, users, growth vs. targets across all streams | PDF/XLSX | Monthly |
| Revenue Recognition Report | Recognised vs. deferred revenue by stream | XLSX | Monthly |
| Reconciliation Report | Gateway, wallet, payout and commission reconciliation with variances | XLSX | Daily/Monthly |
| Payout Batch Report | Payout batch detail with approvals and confirmations | XLSX | Per batch |
| Refund Analysis Report | Refunds by reason, product, period with trend | XLSX | Monthly |
| Verification SLA Report | Verification volumes, times, SLA compliance, rejections | XLSX | Weekly |
| Support Performance Report | Ticket volumes, response times, resolution times, CSAT | XLSX | Weekly |
| Dispute Report | Disputes by type, resolution time, outcome | XLSX | Monthly |
| Fraud & Risk Report | Fraud signals, confirmed incidents, losses, actions | PDF/XLSX | Monthly |
| Platform Health Report | Uptime, latency, error rates, incidents | PDF | Monthly |
| Content Performance Report | Top content, completion rates, quality flags | XLSX | Monthly |
| Cohort Analysis Report | Retention and revenue by registration cohort | XLSX | Monthly |
| Compliance Report | DPDP requests, data exports, deletions, consent changes | XLSX | Monthly |
| Audit Log Export | Filtered audit log for compliance review | CSV | On-demand |
| Tax Report | GST liability, TDS deducted and deposited | XLSX | Monthly |

## 35.8 Report Generation Requirements

| ID | Requirement |
|---|---|
| `FR-RPT-001` | Reports for datasets up to 10,000 rows MUST generate within 60 seconds. |
| `FR-RPT-002` | Larger reports MUST be generated asynchronously with notification on completion. |
| `FR-RPT-003` | All reports MUST support a configurable date range. |
| `FR-RPT-004` | All reports MUST be schedulable (daily, weekly, monthly, quarterly, annually) with email delivery to configured recipients. |
| `FR-RPT-005` | Report generation MUST be logged with requester, parameters and timestamp. |
| `FR-RPT-006` | Reports MUST respect the requester's data access scope; out-of-scope data MUST be excluded, not masked. |
| `FR-RPT-007` | PDF reports MUST include a generation timestamp, the generating user and a data-as-of timestamp. |
| `FR-RPT-008` | Institutional reports MUST support the institution's logo and name where configured. |
| `FR-RPT-009` | Report download links MUST expire after 7 days and MUST require authentication. |
| `FR-RPT-010` | Reports containing personal data MUST be watermarked with the recipient's identity. |
| `FR-RPT-011` | Financial reports MUST be immutable once generated for a closed period. |
| `FR-RPT-012` | Custom report building MUST be available to admins with dimension and measure selection (V2). |

## 35.9 Compliance Reporting

| Requirement | Report | Frequency |
|---|---|---|
| DPDP Act — data principal requests | Data access, correction and deletion request log | Monthly |
| DPDP Act — consent | Consent grant and withdrawal log | Monthly |
| DPDP Act — breach | Breach incident report | Per incident |
| Income Tax — TDS | Form 24Q data, TDS certificates | Quarterly |
| GST | GSTR-1 and GSTR-3B supporting data | Monthly |
| PF | ECR file | Monthly |
| ESI | Contribution return data | Monthly |
| Professional Tax | State-wise PT return data | Monthly/Quarterly |
| Internal audit | Audit log export, access review, privileged action review | Quarterly |

---

# Chapter 36 — Security Overview

> **Purpose of this chapter:** To specify the security architecture, controls, compliance obligations and operational security practices required to protect a platform holding the personal, academic, financial and employment data of millions of students.

## 36.1 Security Principles

| Principle | Application |
|---|---|
| **Defence in depth** | Multiple independent control layers; no single point of failure |
| **Least privilege** | Every actor receives the minimum access required |
| **Fail closed** | Ambiguous authorisation decisions deny access |
| **Zero trust between services** | Service-to-service calls are authenticated and authorised |
| **Secure by default** | Insecure configurations are not selectable |
| **Assume breach** | Detection, containment and recovery are designed for, not hoped against |
| **Privacy by design** | Data minimisation and purpose limitation from the schema upward |
| **Auditable** | Every privileged action leaves an immutable trace |

## 36.2 Threat Model

| Threat Actor | Motivation | Primary Targets | Key Controls |
|---|---|---|---|
| Opportunistic attacker | Credential stuffing, resale | Student accounts | Rate limiting, MFA, breach-password checks |
| Content pirate | Free access to paid content | Video, notes, question banks | DRM, watermarking, session limits, anomaly detection |
| Fraudulent employer | Scam students | Student contact data, payments | Verification, monitoring, no-payment-request rule |
| Malicious insider | Data theft, financial fraud | Personal data, financial records | RBAC, segregation of duties, audit logs, dual approval |
| Competitor scraper | Data harvesting | College data, job listings, student profiles | Rate limiting, bot detection, consent-gated data |
| Exam cheat | Unfair advantage | Test content, assessment integrity | Question randomisation, proctoring, anomaly detection |
| Financial fraudster | Monetary gain | Wallet, refunds, commissions | Idempotency, reconciliation, dual approval, fraud detection |
| Organised attacker | Ransom, disruption | Infrastructure, database | Network isolation, backups, incident response, DDoS protection |

## 36.3 Application Security

### 36.3.1 Authentication Controls

Refer to §18.6 for the full authentication requirement set. Additional security controls:

| ID | Requirement |
|---|---|
| `NFR-SEC-001` | Passwords MUST be hashed with Argon2id or bcrypt (cost factor —— 12); plaintext storage is prohibited. |
| `NFR-SEC-002` | Passwords MUST be checked against known-breach corpora at registration and change. |
| `NFR-SEC-003` | JWTs MUST be signed with RS256 or ES256; secrets MUST be rotated at least annually. |
| `NFR-SEC-004` | Refresh tokens MUST rotate on use; reuse of a rotated token MUST invalidate the entire token family. |
| `NFR-SEC-005` | Session cookies MUST be `HttpOnly`, `Secure`, `SameSite=Lax` (or `Strict` for administrative surfaces). |
| `NFR-SEC-006` | MFA MUST be mandatory for `SUPER_ADMIN`, `FINANCE_ADMIN`, `OPS_EXECUTIVE`, and available to all other roles. |
| `NFR-SEC-007` | Account lockout MUST apply after 10 failed attempts in 1 hour, with self-service unlock via verified channel. |

### 36.3.2 Authorisation Controls

| ID | Requirement |
|---|---|
| `NFR-SEC-011` | Authorisation MUST be enforced server-side on every request; client-side checks are presentation-only. |
| `NFR-SEC-012` | Tenant scoping MUST be applied at the data access layer, not only in controllers. |
| `NFR-SEC-013` | Object-level authorisation MUST be verified for every resource access (prevention of IDOR). |
| `NFR-SEC-014` | Endpoints without an explicit permission declaration MUST be rejected at startup (fail-closed by construction). |
| `NFR-SEC-015` | Privilege escalation attempts MUST be logged as security events and MUST trigger alerting on repetition. |

### 36.3.3 Input and Output Security

| ID | Requirement |
|---|---|
| `NFR-SEC-021` | All input MUST be validated server-side against a strict schema (type, length, format, range). |
| `NFR-SEC-022` | All database access MUST use parameterised queries via Prisma; raw SQL with interpolation is prohibited. |
| `NFR-SEC-023` | All user-generated content MUST be sanitised before rendering; React's default escaping MUST NOT be bypassed without documented review. |
| `NFR-SEC-024` | A strict Content Security Policy MUST be enforced with no `unsafe-inline` for scripts. |
| `NFR-SEC-025` | File uploads MUST be validated by content type (magic bytes, not extension), size-limited, virus-scanned and stored outside the web root. |
| `NFR-SEC-026` | Uploaded files MUST be served from a separate origin with `Content-Disposition: attachment` where appropriate. |
| `NFR-SEC-027` | Server-side request forgery MUST be prevented by allow-listing outbound destinations for user-supplied URLs. |
| `NFR-SEC-028` | All responses MUST include security headers: `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`. |

### 36.3.4 API Security

| ID | Requirement |
|---|---|
| `NFR-SEC-031` | All API traffic MUST use TLS 1.2 or higher; TLS 1.3 preferred. |
| `NFR-SEC-032` | Rate limiting MUST be applied per user, per IP and per endpoint class. |
| `NFR-SEC-033` | Sensitive endpoints (auth, payment, payout) MUST have stricter rate limits. |
| `NFR-SEC-034` | API responses MUST NOT leak internal identifiers, stack traces or infrastructure detail. |
| `NFR-SEC-035` | Error responses MUST be generic externally while logging full detail internally. |
| `NFR-SEC-036` | CORS MUST allow only explicitly configured origins. |
| `NFR-SEC-037` | Webhook endpoints MUST verify provider signatures and MUST reject replayed timestamps beyond a 5-minute window. |
| `NFR-SEC-038` | Bulk data endpoints MUST enforce pagination limits and MUST log unusual volume access. |

## 36.4 Data Security

### 36.4.1 Data Classification

| Class | Examples | Controls |
|---|---|---|
| **Restricted** | Passwords, payment credentials, bank accounts, government IDs, payroll salary data | Field-level encryption, strict RBAC, access logging, masking in all views |
| **Confidential** | Personal contact details, academic records, assessment responses, health-related declarations | Encryption at rest, RBAC, consent gating, access logging |
| **Internal** | Aggregated analytics, internal documents, non-personal operational data | RBAC, encryption at rest |
| **Public** | Marketing content, public college data, published job listings | Integrity controls only |

### 36.4.2 Encryption

| ID | Requirement |
|---|---|
| `NFR-SEC-041` | All data MUST be encrypted at rest using AES-256. |
| `NFR-SEC-042` | Restricted-class fields MUST additionally use application-level field encryption with keys managed in a dedicated key management service. |
| `NFR-SEC-043` | All data in transit MUST be encrypted with TLS 1.2+. |
| `NFR-SEC-044` | Encryption keys MUST be rotated at least annually and immediately upon suspected compromise. |
| `NFR-SEC-045` | Backups MUST be encrypted with separately managed keys. |
| `NFR-SEC-046` | Object storage MUST be private by default; access MUST be via signed URLs with a maximum 4-hour expiry. |

### 36.4.3 Data Minimisation and Retention

| Data Category | Retention | Basis |
|---|---|---|
| Active student profile | Duration of account + 3 years | Service delivery |
| Assessment responses | 5 years | Outcome analysis and dispute resolution |
| Financial transactions | 8 years | Statutory requirement |
| Payroll records | 8 years | Statutory requirement |
| Audit logs | 7 years | Compliance and forensics |
| Raw analytics events | 24 months | Product analysis |
| Support tickets | 3 years | Service quality |
| Marketing consent records | Duration + 3 years | Consent proof |
| Deleted account data | Purged within 30 days except statutory retention | DPDP compliance |
| Session data | 30 days | Security |
| Video recordings (classes) | 3 years | Learner access |

**Requirement `NFR-SEC-051`:** Data MUST NOT be collected unless it serves a declared, documented purpose. Every field in every form MUST be traceable to a purpose.

## 36.5 Privacy and Regulatory Compliance

### 36.5.1 DPDP Act 2023 Compliance

| Obligation | Implementation |
|---|---|
| **Notice** | Clear, plain-language privacy notice at collection, in English and regional languages |
| **Consent** | Granular, purpose-specific, freely given, revocable consent with a consent management interface |
| **Purpose limitation** | Data used only for consented purposes; purpose recorded per data element |
| **Data minimisation** | Only necessary data collected |
| **Accuracy** | Users can correct their data |
| **Right to access** | Self-service data export within 30 days |
| **Right to correction** | Self-service correction for most fields; assisted for verified fields |
| **Right to erasure** | Self-service deletion request; executed within 30 days subject to statutory retention |
| **Right to grievance** | Named Grievance Officer with published contact and response SLA |
| **Children's data** | Verifiable parental consent for users under 18; no behavioural advertising or tracking for minors |
| **Data breach notification** | Notification to the Data Protection Board and affected principals per prescribed timelines |
| **Data processor agreements** | Contracts with all processors specifying obligations |
| **Security safeguards** | Reasonable security safeguards as documented in this chapter |

**Requirement `NFR-SEC-061`:** Users under 18 MUST have parental consent recorded before any paid transaction or before their profile is made visible to employers.

**Requirement `NFR-SEC-062`:** No behavioural advertising, tracking-based profiling for advertising, or third-party advertising cookies may be applied to users under 18.

### 36.5.2 Other Compliance

| Regulation | Applicability | Implementation |
|---|---|---|
| IT Act 2000 & Intermediary Rules | Content hosting | Grievance Officer, takedown process, compliance reporting |
| PCI DSS | Payment data | Achieved by never storing card data; gateway-hosted collection (SAQ-A scope) |
| GST law | Invoicing | Compliant invoice generation with sequential numbering |
| Income Tax Act | TDS on commissions, payroll TDS | Automated computation, certificates, returns data |
| Labour laws | Payroll module | PF, ESI, PT, gratuity, bonus computation |
| Consumer Protection (E-Commerce) Rules | Marketplace operations | Seller information, grievance mechanism, refund policy transparency |
| GDPR | Future EU users | Architecture supports data residency and enhanced rights (V3) |

## 36.6 Infrastructure Security

| Control | Implementation |
|---|---|
| Network segmentation | Public, application and data tiers isolated; database not publicly reachable |
| Firewall / security groups | Default-deny with explicit allow rules |
| WAF | Web application firewall with OWASP rule set at the CDN edge |
| DDoS protection | Cloudflare edge protection with rate limiting and challenge |
| Secrets management | Dedicated secrets manager; no secrets in code, config files or environment dumps |
| Infrastructure as code | All infrastructure declared in code and version-controlled |
| Immutable deployments | Containers rebuilt per deploy; no in-place mutation |
| Least-privilege service accounts | Each service has a scoped identity |
| Bastion / just-in-time access | No standing SSH access to production; time-bound, approved, logged access only |
| Vulnerability management | Automated dependency scanning; critical patches within 7 days |
| Container scanning | Image vulnerability scanning in CI; blocking on critical findings |
| Backup | Automated daily backups; point-in-time recovery; quarterly restore testing |
| Disaster recovery | RTO 4 hours; RPO 15 minutes |

## 36.7 Secure Development Lifecycle

| Phase | Control |
|---|---|
| Design | Threat modelling for new modules; security review of design documents |
| Development | Secure coding standards; peer review mandatory; no direct commits to main |
| Dependencies | Automated dependency vulnerability scanning; approved-package policy |
| Static analysis | SAST in CI pipeline; blocking on high-severity findings |
| Secret scanning | Pre-commit and CI secret detection |
| Dynamic testing | DAST against staging before major releases |
| Penetration testing | Annual third-party test; remediation tracked to closure |
| Bug bounty | Responsible disclosure programme (V2) |
| Release | Security sign-off required for releases touching auth, payments or personal data |
| Post-release | Monitoring for anomalies; rapid rollback capability |

## 36.8 Monitoring, Detection and Response

### 36.8.1 Security Monitoring

| Signal | Detection |
|---|---|
| Authentication anomalies | Failed login spikes, credential stuffing patterns, impossible travel |
| Authorisation anomalies | Repeated denied access, IDOR attempts, privilege escalation attempts |
| Data access anomalies | Bulk exports, unusual query volumes, off-hours administrative access |
| Financial anomalies | Unusual refunds, payout patterns, ledger variances |
| Content anomalies | Mass downloads, concurrent session violations |
| Infrastructure anomalies | Unexpected outbound connections, configuration drift, new privileged accounts |

### 36.8.2 Incident Response

| Phase | Actions | Target |
|---|---|---|
| **Detect** | Automated alerting; on-call notification | < 15 minutes |
| **Triage** | Severity classification; incident commander assigned | < 30 minutes |
| **Contain** | Isolate affected systems; revoke credentials; block attack paths | < 2 hours (P1) |
| **Eradicate** | Remove attacker access; patch vulnerability | < 24 hours (P1) |
| **Recover** | Restore service; verify integrity | < 4 hours from containment |
| **Notify** | Regulators and affected users per legal timelines | Per statute |
| **Review** | Blameless post-mortem with corrective actions tracked | Within 5 business days |

### 36.8.3 Severity Definitions

| Severity | Definition | Examples |
|---|---|---|
| **P1 — Critical** | Confirmed breach of personal data, financial loss, or full service outage | Database compromise, payment system breach |
| **P2 — High** | Potential breach, partial outage, or significant vulnerability | Exposed endpoint, privilege escalation vulnerability |
| **P3 — Medium** | Limited impact security issue | Isolated account compromise, minor data exposure |
| **P4 — Low** | Minimal impact, informational | Policy violation, low-severity vulnerability |

## 36.9 Third-Party Risk

| Requirement | Implementation |
|---|---|
| Vendor assessment | Security questionnaire and review before onboarding any processor |
| Data processing agreement | Executed with every processor handling personal data |
| Sub-processor register | Maintained and published |
| Access scoping | Vendors receive minimum necessary access, time-bound |
| Monitoring | Vendor security incidents monitored; contractual notification obligations |
| Exit plan | Data return and deletion obligations on termination |

## 36.10 Security Metrics

| Metric | Target |
|---|---|
| Critical vulnerabilities in production | 0 |
| Mean time to detect (security incidents) | < 15 minutes |
| Mean time to contain (P1) | < 2 hours |
| Patch compliance (critical, within 7 days) | 100% |
| MFA adoption (privileged roles) | 100% |
| Penetration test critical findings | 0 unremediated after 30 days |
| Failed access-control test cases in QA | 0 |
| Data subject request fulfilment within SLA | 100% |
| Security training completion (all staff) | 100% annually |
| Phishing simulation failure rate | < 8% |

---

# Chapter 37 — Product Features List

> **Purpose of this chapter:** To provide the complete, enumerated feature inventory with priority, version, owning module and acceptance-oriented descriptions, serving as the master checklist for scope, estimation and QA coverage.

## 37.1 Legend

| Priority | Meaning |
|---|---|
| **P0** | Must ship in the stated version; release-blocking |
| **P1** | Should ship in the stated version; deferrable with approval |
| **P2** | Nice to have in the stated version |
| **P3** | Future consideration |

## 37.2 Platform Foundation Features

| ID | Feature | Description (acceptance-oriented) | Priority | Version |
|---|---|---|---|---|
| F-001 | Email/password registration | A user can register with email and password, receive a verification email, and access the dashboard after verification | P0 | V1 |
| F-002 | Google OAuth sign-in | A user can register and sign in with a Google account in —— 3 interactions | P0 | V1 |
| F-003 | Mobile OTP sign-in | A user can register and sign in with mobile number and a 6-digit OTP delivered within 30 seconds | P0 | V1 |
| F-004 | Password reset | A user can reset their password via a single-use link valid for 30 minutes | P0 | V1 |
| F-005 | Two-factor authentication | Privileged users must enrol in and use TOTP-based MFA | P0 | V1 |
| F-006 | Session management | A user can view active sessions and revoke any of them | P1 | V1 |
| F-007 | Role-based access control | Every endpoint enforces declared permissions with tenant scoping | P0 | V1 |
| F-008 | Multi-role context switching | A user with multiple roles can switch context; the active context is always visible | P1 | V1 |
| F-009 | Unified student profile | All profile data is stored once and reused across every module | P0 | V1 |
| F-010 | Profile completeness scoring | A weighted completeness percentage is displayed with the specific missing items | P0 | V1 |
| F-011 | Consent management | A user can grant and revoke consent per purpose, with effect within 24 hours | P0 | V1 |
| F-012 | Data export | A user can request and receive a complete export of their personal data | P0 | V1 |
| F-013 | Account deletion | A user can request deletion; data is purged within 30 days except statutory retention | P0 | V1 |
| F-014 | Global search | A user can search across all entity types with grouped results in < 400ms | P0 | V1 |
| F-015 | Document upload and vault | A user can upload documents with validation, virus scanning and secure retrieval | P0 | V1 |
| F-016 | Audit logging | Every privileged action is recorded immutably with actor, target and before/after state | P0 | V1 |
| F-017 | Feature flags | Features can be enabled per environment, role, tenant or percentage without deployment | P1 | V1 |
| F-018 | Impersonation (support) | Support can impersonate with reason, time limit, visible banner and full audit | P1 | V1 |
| F-019 | Multi-language support | UI and content available in Hindi and Tamil | P1 | V2 |
| F-020 | Native mobile apps | iOS and Android apps with feature parity for student flows | P0 | V2 |

## 37.3 Career Guidance Features

| ID | Feature | Description | Priority | Version |
|---|---|---|---|---|
| F-101 | Multi-dimensional assessment | A student completes aptitude, interest, personality and values sections with save-and-resume | P0 | V1 |
| F-102 | Career report generation | A ranked report of 10 careers with rationale is produced within 60 seconds | P0 | V1 |
| F-103 | Explainable recommendations | Each career states the three strongest contributing dimensions | P0 | V1 |
| F-104 | Career library | 200+ browsable, searchable career profiles with education paths and salary data | P0 | V1 |
| F-105 | Stream recommendation | School students receive a stream recommendation with reasoning | P0 | V1 |
| F-106 | Exam recommendation | 3-5 entrance exams aligned to top career matches | P0 | V1 |
| F-107 | Career roadmap | A stage-by-stage plan from current position to target career | P0 | V1 |
| F-108 | PDF report download | The report downloads as a parent-shareable branded PDF under 5MB | P0 | V1 |
| F-109 | Reassessment with comparison | A student can retake the assessment and compare results across attempts | P1 | V1 |
| F-110 | Counsellor session booking | A student can book a human counsellor session to review their report | P1 | V2 |
| F-111 | Parent report sharing | The report can be shared to a parent with a secure link | P2 | V2 |

## 37.4 Coaching Features

| ID | Feature | Description | Priority | Version |
|---|---|---|---|---|
| F-201 | 18 exam track catalogue | All 18 tracks are configured with syllabus, pattern and calendar | P0 | V1 |
| F-202 | Batch discovery and enrolment | A student can filter batches and enrol with immediate content access on payment | P0 | V1 |
| F-203 | Live class delivery | Classes start within 3 minutes of schedule with chat, polls and screen share | P0 | V1 |
| F-204 | Class recordings | Recordings are available within 2 hours of session end | P0 | V1 |
| F-205 | Study materials | Notes, formula sheets and papers are downloadable with watermarking | P0 | V1 |
| F-206 | Mock test engine | Tests replicate the real exam interface with server-authoritative timing | P0 | V1 |
| F-207 | Instant results | Score, rank, percentile and analysis are available within 60 seconds | P0 | V1 |
| F-208 | Topic-wise analysis | Every full test produces topic-level accuracy and weakness classification | P0 | V1 |
| F-209 | Detailed solutions | Every question has a text solution; key questions have video solutions | P0 | V1 |
| F-210 | Doubt posting and resolution | Doubts receive an AI response in 5 minutes and a faculty response within SLA | P0 | V1 |
| F-211 | Attendance tracking | Attendance is captured automatically and visible to student and faculty | P0 | V1 |
| F-212 | Syllabus coverage tracker | Coverage percentage with topic-level detail is always visible | P0 | V1 |
| F-213 | Adaptive study planner | A personalised plan regenerates when performance changes materially | P0 | V2 |
| F-214 | Current affairs digest | Daily digest published for applicable government exam tracks | P1 | V1 |
| F-215 | Multi-batch enrolment | A student can enrol in multiple batches with a unified schedule | P1 | V1 |
| F-216 | Content protection | Signed URLs, watermarking and concurrent-session limits are enforced | P0 | V1 |
| F-217 | Batch announcements | Faculty announcements reach enrolled students via notification | P0 | V1 |
| F-218 | Practice question banks | Topic-level practice sets with instant feedback | P1 | V1 |
| F-219 | Adaptive testing | Tests adapt difficulty based on responses | P2 | V3 |
| F-220 | Parent progress reports | Periodic progress summary to a linked parent | P2 | V2 |

## 37.5 College Admission Features

| ID | Feature | Description | Priority | Version |
|---|---|---|---|---|
| F-301 | Verified college database | 5,000+ colleges with verification badges and last-verified dates | P0 | V1 |
| F-302 | Advanced college search | Filtering across 12+ dimensions returning results in < 500ms | P0 | V1 |
| F-303 | College profiles | Complete profiles with source-labelled statistics | P0 | V1 |
| F-304 | College comparison | Side-by-side comparison of up to 4 colleges across 20+ parameters | P0 | V1 |
| F-305 | Eligibility checker | Automatic evaluation of student data against programme criteria | P0 | V1 |
| F-306 | Shortlist management | Ambitious/Target/Safe bucketing with notes | P0 | V1 |
| F-307 | Application submission | Guided application with document upload and fee payment | P0 | V1 |
| F-308 | Application tracking | Real-time status timeline visible to the student | P0 | V1 |
| F-309 | Scholarship discovery | Eligibility-matched scholarships surfaced proactively | P1 | V1 |
| F-310 | Admission confirmation | Dual confirmation protocol triggering commission | P0 | V1 |
| F-311 | AI shortlist generator | AI generates a bucketed shortlist with probability estimates | P0 | V2 |
| F-312 | Admission predictor | Probability estimates based on historical cut-offs | P1 | V2 |
| F-313 | Counselling guidance | Exam-specific counselling process guidance | P1 | V2 |
| F-314 | Verified student reviews | Reviews from confirmed enrolled students with moderation | P1 | V1 |
| F-315 | College lead inbox | Colleges receive scored leads within 60 seconds | P0 | V1 |
| F-316 | Lead assignment and tracking | Auto-assignment with contact logging and follow-up | P0 | V1 |
| F-317 | Bulk student import | CSV/XLSX import with validation and student invitation | P0 | V1 |
| F-318 | Placement drive management | End-to-end drive creation, execution and result tracking | P0 | V2 |
| F-319 | Placement policy enforcement | Configurable policies enforced automatically at registration | P1 | V2 |
| F-320 | Accreditation reports | NAAC/NBA-oriented data packs generated on demand | P1 | V2 |

## 37.6 Study Abroad Features

| ID | Feature | Description | Priority | Version |
|---|---|---|---|---|
| F-401 | Country explorer | 10 countries with cost, visa, work rights and PR data | P0 | V2 |
| F-402 | University database | 3,000+ universities with programmes, requirements and outcomes | P0 | V2 |
| F-403 | Cost calculator | Total cost computation with INR conversion and loan EMI estimate | P0 | V2 |
| F-404 | Eligibility checker | Programme-level eligibility with gap identification | P0 | V2 |
| F-405 | Milestone tracker | 8-phase milestone timeline with owners, dates and reminders | P0 | V2 |
| F-406 | Document vault | Categorised, versioned, verified document storage | P0 | V2 |
| F-407 | SOP assistance | Templates, AI draft and counsellor review rounds | P0 | V2 |
| F-408 | LOR management | Request tracking and drafting support | P1 | V2 |
| F-409 | Application management | University application submission and tracking | P0 | V2 |
| F-410 | Visa tracking | Country-specific checklist and status tracking | P0 | V2 |
| F-411 | Scholarship database | Searchable scholarships with eligibility matching | P1 | V2 |
| F-412 | Counsellor workflow | Assigned counsellor with caseload management and SLAs | P0 | V2 |
| F-413 | Commission transparency | Explicit disclosure of university commissions | P0 | V2 |
| F-414 | Loan guidance | Lender comparison and referral with disclosure | P1 | V2 |
| F-415 | Pre-departure support | Accommodation, forex, insurance and briefing checklists | P2 | V2 |

## 37.7 Course Features

| ID | Feature | Description | Priority | Version |
|---|---|---|---|---|
| F-501 | Course catalogue | 300+ courses filterable across 8 dimensions | P0 | V1 |
| F-502 | Job demand indicator | Live count of opportunities requiring the taught skill | P0 | V1 |
| F-503 | Course player | Video with speed control, captions, notes, bookmarks and transcript | P0 | V1 |
| F-504 | Duration-weighted progress | Progress computed from watched duration, not lesson count | P0 | V1 |
| F-505 | Assignments | Submission, rubric-based grading and feedback within 5 days | P0 | V1 |
| F-506 | Quizzes | Auto-graded module quizzes with instant feedback | P0 | V1 |
| F-507 | Final assessment | Gated certification assessment with 3 attempts | P0 | V1 |
| F-508 | Certificate issuance | Verified certificate issued within 24 hours of criteria satisfaction | P0 | V1 |
| F-509 | Career tracks | 9 bundled multi-course tracks with track certification | P0 | V1 |
| F-510 | Course Q&A | Learner questions with instructor responses and upvoting | P1 | V1 |
| F-511 | Skill profile propagation | Completion adds verified skills within 1 hour | P0 | V1 |
| F-512 | Course preview | Minimum 10% of every course freely previewable | P0 | V1 |
| F-513 | Instructor authoring tools | Partners create and manage courses without engineering support | P0 | V2 |
| F-514 | Peer review assignments | Assignments reviewed by peers with moderation | P2 | V2 |
| F-515 | Proctored certification | Browser lock and webcam proctoring for advanced certificates | P2 | V2 |

## 37.8 Internship & Live Project Features

| ID | Feature | Description | Priority | Version |
|---|---|---|---|---|
| F-601 | Internship discovery | Filtered search with AI recommendations and match scores | P0 | V1 |
| F-602 | One-click application | Application completable in —— 3 clicks with a saved profile | P0 | V1 |
| F-603 | Application status transparency | Status timeline with mandatory employer action within 14 days | P0 | V1 |
| F-604 | Verified employer enforcement | Only verified employers can post; no payment-request postings | P0 | V1 |
| F-605 | Selection process management | Configurable stages with assessments, assignments and interviews | P0 | V1 |
| F-606 | Active internship workspace | Task board, weekly logs, timesheet and check-ins | P1 | V2 |
| F-607 | Structured evaluation | Rubric-based supervisor evaluation with mandatory written feedback | P0 | V2 |
| F-608 | Internship certificate | Automatic certificate issuance on evaluation submission | P0 | V1 |
| F-609 | Student escalation channel | Confidential escalation with 24-hour triage | P0 | V1 |
| F-610 | Guaranteed Internship Programme | Paid programme with a defined 90-day outcome guarantee | P1 | V2 |
| F-611 | Live project catalogue | Real company projects with defined deliverables and mentors | P0 | V2 |
| F-612 | Team formation | Skill-complementary team assembly with mentor approval | P0 | V2 |
| F-613 | Sprint workspace | Kanban board, deliverable tracker, chat, files and time logging | P0 | V2 |
| F-614 | Mentor supervision | Twice-weekly check-ins with per-sprint written feedback | P0 | V2 |
| F-615 | Contribution tracking | Evidence-based individual contribution measurement | P0 | V2 |
| F-616 | Project grading | Team (40%) and individual (60%) rubric-based grading | P0 | V2 |
| F-617 | Portfolio artefacts | Published project artefacts respecting IP terms | P0 | V2 |
| F-618 | Direct offer from project | Companies extend offers to project participants | P1 | V2 |

## 37.9 Jobs, Hiring & Payroll Features

| ID | Feature | Description | Priority | Version |
|---|---|---|---|---|
| F-701 | Job discovery | Filtered search with AI match scores and gap explanation | P0 | V1 |
| F-702 | One-click job application | Application in —— 3 clicks with resume selection | P0 | V1 |
| F-703 | Job posting wizard | Complete posting in —— 3 minutes with mandatory salary disclosure | P0 | V1 |
| F-704 | Company verification | Two-business-day verification with three trust tiers | P0 | V1 |
| F-705 | Applicant pipeline | Stage-based pipeline with bulk actions and saved views | P0 | V1 |
| F-706 | AI candidate ranking | Ranked candidates with explainable rationale | P0 | V2 |
| F-707 | Verified candidate profiles | Every claim carries a verification indicator | P0 | V1 |
| F-708 | Candidate search | Consent-gated faceted and boolean search with saved searches | P0 | V2 |
| F-709 | Platform assessments | 6 assessment types with proctoring options and reusable scores | P0 | V2 |
| F-710 | Interview scheduling | Panel availability, candidate self-scheduling and video links | P0 | V2 |
| F-711 | Interview scorecards | Structured feedback with 48-hour submission SLA | P1 | V2 |
| F-712 | Offer management | Creation, approval workflow, digital letter and acceptance tracking | P0 | V2 |
| F-713 | Campus drive management | Multi-college drives with automated eligibility and rounds | P0 | V2 |
| F-714 | Employer accountability | No-response, revocation and rating thresholds with consequences | P0 | V1 |
| F-715 | Hiring analytics | Funnel, efficiency, quality, source and benchmark analytics | P0 | V2 |
| F-716 | Offer-to-payroll automation | Accepted offer initiates payroll onboarding automatically | P0 | V2 |
| F-717 | Employee onboarding | Pre-populated onboarding with document collection and verification | P0 | V2 |
| F-718 | Salary structure management | Templates, effective-dated changes and CTC-to-net breakdown | P0 | V2 |
| F-719 | Attendance and leave | Configurable policies, accrual, approval workflows | P0 | V2 |
| F-720 | Payroll processing | Deterministic computation with exception review and approval gate | P0 | V2 |
| F-721 | Payslip generation | Branded payslips published within 24 hours of approval | P0 | V2 |
| F-722 | Statutory compliance | PF, ESI, PT, TDS computation with filing data generation | P0 | V2 |
| F-723 | Form 16 generation | Annual Form 16 Part A and B for all employees | P0 | V2 |
| F-724 | Employee self-service | Mobile-accessible payslips, leave, claims and declarations | P0 | V2 |
| F-725 | Exit and F&F settlement | Exit checklist and full-and-final settlement within 45 days | P1 | V2 |

## 37.10 AI Features

| ID | Feature | Description | Priority | Version |
|---|---|---|---|---|
| F-801 | Career recommendation engine | Explainable ranked career matches | P0 | V1 |
| F-802 | Conversational assistant | Context-aware assistant with data citation and escalation | P0 | V1 |
| F-803 | Course recommendation | Personalised course suggestions linked to career target | P0 | V1 |
| F-804 | Job and internship matching | Match scores with matched/missing skill breakdown | P0 | V1 |
| F-805 | Resume builder | Profile-derived, ATS-optimised resumes in multiple templates | P0 | V1 |
| F-806 | Daily insight generator | Specific, quantified, actionable daily insight on the dashboard | P0 | V1 |
| F-807 | AI doubt response | Preliminary answer within 5 minutes, clearly labelled | P0 | V1 |
| F-808 | Adaptive study plan | Plan regenerating on material performance change | P0 | V2 |
| F-809 | Weakness detection | Weightage-adjusted weak topic identification with remediation | P0 | V2 |
| F-810 | AI mock interview | Adaptive interview with per-answer feedback and model answers | P0 | V2 |
| F-811 | Skill gap analyser | Gap between current skills and target role, with course links | P0 | V2 |
| F-812 | AI college shortlist | Bucketed shortlist with probability estimates | P0 | V2 |
| F-813 | SOP draft assistant | Labelled draft with plagiarism warning and mandatory editing | P1 | V2 |
| F-814 | Job description generator | Employer-side JD generation from structured inputs | P1 | V2 |
| F-815 | Content moderation assistant | Automated flagging of policy-violating content | P1 | V2 |
| F-816 | Fraud and anomaly detection | Multi-signal detection with human-reviewed action | P0 | V2 |
| F-817 | Predictive placement model | Placement probability prediction with intervention triggers | P2 | V3 |
| F-818 | Salary prediction | Expected salary range by profile, role and location | P2 | V3 |
| F-819 | Multilingual assistant | Assistant available in Hindi and Tamil | P1 | V3 |
| F-820 | Voice interaction | Voice input and output for the assistant | P3 | V3 |

## 37.11 Commerce, Notification & Analytics Features

| ID | Feature | Description | Priority | Version |
|---|---|---|---|---|
| F-901 | Multi-method payments | UPI, cards, netbanking, wallets via Razorpay; international via Stripe | P0 | V1 |
| F-902 | EMI | EMI on orders above —,—8,000 with total cost disclosure | P0 | V1 |
| F-903 | Subscription billing | Mandates, renewals, dunning and self-service cancellation | P0 | V1 |
| F-904 | GST invoicing | Compliant invoices generated within 60 seconds | P0 | V1 |
| F-905 | Refund engine | Policy-driven automatic eligibility with 2-day initiation | P0 | V1 |
| F-906 | Double-entry wallet | Immutable ledger with daily reconciliation | P0 | V1 |
| F-907 | Coupon engine | 9 coupon types with a 10-dimension rule engine | P0 | V1 |
| F-908 | Referral programme | Attribution, dual rewards, fraud controls and status visibility | P0 | V1 |
| F-909 | Commission engine | Tier-based accrual, hold, clawback and TDS | P0 | V2 |
| F-910 | Payout processing | KYC-gated, approval-gated payouts within 5-day SLA | P0 | V2 |
| F-911 | Reconciliation suite | Seven automated reconciliations with variance escalation | P0 | V1 |
| F-912 | Multi-channel notifications | In-app, email, SMS, WhatsApp and push with templates | P0 | V1 |
| F-913 | Notification preferences | Per-channel, per-category, frequency and quiet-hours control | P0 | V1 |
| F-914 | Frequency capping | Maximum 5 non-critical notifications per user per day | P0 | V1 |
| F-915 | Notification analytics | Delivery, open, click and unsubscribe tracking by template | P1 | V1 |
| F-916 | Event pipeline | Typed, versioned events with 15-minute warehouse latency | P0 | V1 |
| F-917 | Role-scoped dashboards | Six role-specific analytics dashboards | P0 | V1 |
| F-918 | Cohort analysis | Daily/weekly/monthly cohorts over 24 periods | P1 | V2 |
| F-919 | Funnel builder | Custom funnels up to 8 steps with configurable windows | P1 | V2 |
| F-920 | Report catalogue | 60+ reports across six roles with scheduling and export | P0 | V1 basic, V2 full |
| F-921 | Certificate verification | Public verification page with QR and code lookup | P0 | V1 |
| F-922 | Portfolio builder | Public shareable portfolio with verified artefacts | P1 | V2 |
| F-923 | Admin verification console | Prioritised queues with SLA timers and checklist approval | P0 | V1 |
| F-924 | Dispute management | Case management with evidence, timeline and resolution actions | P0 | V1 |
| F-925 | Coupon campaign manager | Campaign creation with budget caps and ROI monitoring | P1 | V1 |

## 37.12 Feature Count Summary

| Category | V1 | V2 | V3 | Total |
|---|---|---|---|---|
| Platform Foundation | 18 | 2 | 0 | 20 |
| Career Guidance | 9 | 2 | 0 | 11 |
| Coaching | 17 | 2 | 1 | 20 |
| College Admissions | 17 | 3 | 0 | 20 |
| Study Abroad | 0 | 15 | 0 | 15 |
| Courses | 12 | 3 | 0 | 15 |
| Internships & Projects | 8 | 10 | 0 | 18 |
| Jobs, Hiring & Payroll | 6 | 19 | 0 | 25 |
| AI | 7 | 9 | 4 | 20 |
| Commerce, Notifications, Analytics | 17 | 8 | 0 | 25 |
| **Total** | **111** | **73** | **5** | **189** |

---

# Chapter 38 — Functional Scope

> **Purpose of this chapter:** To define authoritatively what is in scope and out of scope functionally, resolve boundary ambiguities, and record the integration surface with external systems.

## 38.1 In-Scope Functional Domains

| Domain | In Scope | Notes |
|---|---|---|
| Identity & Access | Registration, authentication, RBAC, multi-tenancy, consent | All roles |
| Student Profile | Longitudinal profile, documents, skills, portfolio | Single record across 8 years |
| Career Guidance | Assessment, recommendation, roadmap, career library | Psychometric-style instruments |
| Exam Coaching | 18 tracks, batches, live and recorded classes, materials | Online delivery only |
| Assessment | Mock tests, quizzes, skill assessments, proctoring options | Server-authoritative |
| College Admissions | Discovery, comparison, application, admission tracking, leads | India |
| Study Abroad | 10 countries, university database, applications, visa tracking | V2 |
| Skill Courses | Catalogue, delivery, assessment, certification, tracks | First-party and partner |
| Internships | Discovery, application, management, evaluation, certification | Verified employers only |
| Live Projects | Catalogue, teams, sprints, mentoring, grading, portfolio | V2 |
| Hiring | Job posting, ATS, assessments, interviews, offers, campus drives | Fresher-focused |
| Payroll | Onboarding, attendance, leave, payroll, statutory, self-service | India, SMB focus, V2 |
| AI | 22 AI features across recommendation, generation and detection | Explainable |
| Commerce | Payments, wallet, coupons, referrals, commissions, payouts | Multi-gateway |
| Certificates | Issuance, verification, portfolio integration | Publicly verifiable |
| Notifications | Six channels with preferences and governance | DLT/WhatsApp compliant |
| Analytics | Events, warehouse, six role dashboards, cohorts, funnels | Self-service |
| Reporting | 60+ reports with scheduling and compliance outputs | Multi-format |
| Administration | Verification, moderation, disputes, finance, configuration, audit | Full governance |

## 38.2 Explicitly Out of Scope

| Item | Rationale | Reconsideration |
|---|---|---|
| K-10 school curriculum | Different pedagogy, compliance regime and market | Not planned |
| Offline coaching centre operations | Physical delivery does not scale with software economics | Not planned |
| In-house WebRTC video infrastructure | Third-party providers are more reliable and cost-effective at this scale | V3 evaluation |
| Full HRMS (performance, OKRs, engagement surveys) | Beyond the hiring-to-payroll continuum | V3 evaluation |
| Accounting / ERP | Outside the education-to-employment scope | Not planned |
| Student loan origination and underwriting | Requires lending licences and balance-sheet risk | Referral partnership only |
| Physical infrastructure (hostels, transport) | Not a software problem | Not planned |
| Blue-collar and gig staffing | Different platform mechanics and unit economics | V3 evaluation |
| Mid-career executive hiring (8+ years) | Different value proposition; dilutes focus | Not planned |
| PhD and research placement | Niche, low volume | Not planned |
| Social networking feed | Engagement loops conflict with outcome orientation | Not planned |
| Peer-to-peer content marketplace (unverified) | Conflicts with verified-supply principle | Not planned |
| Cryptocurrency or blockchain credentials | No demonstrated employer demand in target market | V3 evaluation |
| Offline examination centres | Operational complexity outside core competence | Partnership only |

## 38.3 Boundary Clarifications

| Ambiguity | Resolution |
|---|---|
| Is Ellowring an LMS for colleges? | No. Ellowring complements the college LMS. It does not manage degree curriculum, internal marks or academic administration. It manages employability. |
| Does Ellowring guarantee placements? | No. Ellowring facilitates and measures placement outcomes. Only the explicitly-defined Guaranteed Internship Programme carries a refund-backed commitment, with published conditions. |
| Does Ellowring conduct examinations? | No. Ellowring conducts mock tests and skill assessments. It does not conduct official examinations. |
| Does Ellowring issue degrees? | No. Ellowring issues skill and completion certificates only. |
| Is Ellowring a recruitment consultancy? | No. Ellowring provides self-service hiring software and a candidate marketplace. It does not perform retained search. |
| Does Ellowring provide immigration legal advice? | No. Study Abroad provides process guidance and documentation support, not legal advice. Legal matters are referred to licensed professionals. |
| Does Ellowring lend money? | No. EMI is provided through payment gateway partners; education loans are referred to partner lenders with disclosure. |
| Does Ellowring own project IP? | No. IP terms are between the sponsoring company and the students, stated in the project brief and enforced by platform controls. |
| Is student data sold? | Never. Data is shared only with the student's explicit, purpose-specific consent, and never sold or licensed. |

## 38.4 External Integration Surface

| Integration | Provider Type | Purpose | Criticality | Fallback |
|---|---|---|---|---|
| Payment gateway (primary) | Razorpay | Domestic payments, subscriptions, payouts | Critical | Stripe failover |
| Payment gateway (secondary) | Stripe | International payments | High | Manual processing |
| Live video | Third-party video SDK | Live class delivery | Critical | Recorded fallback + rescheduling |
| Object storage | Cloudflare R2 | Videos, documents, images | Critical | Multi-region replication |
| CDN | Cloudflare | Content delivery, WAF, DDoS | Critical | Origin serving (degraded) |
| Transactional email | Email service provider | Email notifications | High | Secondary provider |
| SMS | DLT-registered SMS provider | SMS notifications | High | Secondary provider |
| WhatsApp | WhatsApp Business API provider | WhatsApp notifications | Medium | SMS fallback |
| Push notifications | Push service | Web and mobile push | Medium | In-app only |
| AI models | LLM provider(s) | AI features | High | Multi-provider routing; degraded non-AI experience |
| Authentication | Google OAuth | Social sign-in | Medium | Email/OTP |
| Virus scanning | Scanning service | Upload security | High | Quarantine until scanned |
| Proctoring | Proctoring vendor | Assessment integrity | Medium | Basic browser-lock only |
| Background verification | BGV vendor | Candidate verification (employer add-on) | Low | Manual process |
| Bank verification | Penny-drop service | Payout account verification | High | Manual verification |
| Calendar | Google/Microsoft Calendar | Interview and class scheduling | Low | Manual ICS export |
| Analytics | Internal warehouse | Product analytics | High | Delayed processing |
| Error tracking | Observability provider | Error and performance monitoring | High | Log-based investigation |
| Maps | Maps provider | College and job location display | Low | Text address only |
| Currency rates | FX rate provider | Study abroad cost calculation | Low | Cached last-known rate |

**Requirement `FR-EXT-001`:** Every critical integration MUST have a documented failure mode, a defined user-facing degradation behaviour, and monitoring with alerting.

## 38.5 Data Migration Scope

| Migration | Source | Scope | Version |
|---|---|---|---|
| College student records | College spreadsheets/ERP | Bulk import with validation and student claim flow | V1 |
| College placement history | College records | Historical placement data for profile completeness | V1 |
| Company employee records | Employer spreadsheets/existing payroll | Payroll onboarding migration | V2 |
| Training institute content | Partner content libraries | Bulk content ingestion with review | V2 |
| Student external certificates | Student uploads | Manual upload with optional verification | V1 |

## 38.6 Functional Scope Change Control

| Rule | Statement |
|---|---|
| Baseline | This PRD version 1.0 is the scope baseline |
| Addition | Any scope addition to a version requires an equal-effort removal or an approved timeline extension |
| Approval | Scope changes require Head of Product and CTO approval; changes affecting revenue targets require CEO approval |
| Documentation | Every change is recorded in the change log with rationale, impact and approver |
| Communication | Scope changes are communicated to all delivery teams within 2 business days |

---

# Chapter 39 — Non-Functional Scope

> **Purpose of this chapter:** To specify the quality attributes the system must exhibit — performance, scalability, availability, security, usability, accessibility, maintainability and operability — with measurable targets and verification methods.

## 39.1 Performance Requirements

### 39.1.1 Frontend Performance

| ID | Requirement | Target | Measurement |
|---|---|---|---|
| `NFR-PERF-001` | Largest Contentful Paint (public pages) | < 2.0s at P75 | Real user monitoring, 4G mid-tier Android |
| `NFR-PERF-002` | Largest Contentful Paint (dashboards) | < 2.5s at P75 | Real user monitoring |
| `NFR-PERF-003` | First Input Delay / Interaction to Next Paint | INP < 200ms at P75 | Real user monitoring |
| `NFR-PERF-004` | Cumulative Layout Shift | < 0.1 at P75 | Real user monitoring |
| `NFR-PERF-005` | Time to Interactive | < 3.5s at P75 | Synthetic testing |
| `NFR-PERF-006` | JavaScript bundle (initial route) | < 200KB gzipped | Build-time budget enforcement |
| `NFR-PERF-007` | Image delivery | WebP/AVIF with responsive sizes; lazy loading below the fold | Build and runtime audit |
| `NFR-PERF-008` | Route transition (client-side) | < 300ms | Synthetic testing |

### 39.1.2 Backend Performance

| ID | Requirement | Target |
|---|---|---|
| `NFR-PERF-011` | API response time — read endpoints | P50 < 120ms, P95 < 350ms, P99 < 800ms |
| `NFR-PERF-012` | API response time — write endpoints | P50 < 200ms, P95 < 600ms, P99 < 1.2s |
| `NFR-PERF-013` | Search queries | P95 < 500ms |
| `NFR-PERF-014` | Dashboard aggregate queries | P95 < 1.5s |
| `NFR-PERF-015` | Report generation (—— 10,000 rows) | < 60s |
| `NFR-PERF-016` | Mock test result computation | < 60s from submission |
| `NFR-PERF-017` | Payroll computation (500 employees) | < 3 minutes |
| `NFR-PERF-018` | AI assistant first token | < 3s at P95 |
| `NFR-PERF-019` | Wallet operations | P95 < 500ms |
| `NFR-PERF-020` | Notification dispatch (in-app) | P95 < 2s |

### 39.1.3 Database Performance

| ID | Requirement |
|---|---|
| `NFR-PERF-031` | No production query may exceed 1 second; slow queries MUST be logged and reviewed weekly. |
| `NFR-PERF-032` | All queries filtering on foreign keys, status fields or timestamps MUST have supporting indexes. |
| `NFR-PERF-033` | N+1 query patterns MUST be eliminated; detection MUST be part of CI. |
| `NFR-PERF-034` | Connection pooling MUST be configured with limits appropriate to instance sizing. |
| `NFR-PERF-035` | Read-heavy analytical queries MUST be served from read replicas or the warehouse, never the primary. |
| `NFR-PERF-036` | Bulk operations MUST be batched and MUST NOT block interactive traffic. |

## 39.2 Scalability Requirements

### 39.2.1 Capacity Targets

| Dimension | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Registered users | 250,000 | 900,000 | 2,500,000 |
| Monthly active users | 90,000 | 340,000 | 1,000,000 |
| Peak concurrent users | 12,000 | 45,000 | 130,000 |
| Peak concurrent live class attendees | 8,000 | 30,000 | 90,000 |
| Peak concurrent test takers | 25,000 | 80,000 | 220,000 |
| Requests per second (peak) | 3,500 | 12,000 | 35,000 |
| Events per second (peak) | 5,000 | 18,000 | 50,000 |
| Database size | 800 GB | 3.5 TB | 12 TB |
| Object storage | 25 TB | 110 TB | 400 TB |
| Monthly video streaming | 180 TB | 800 TB | 2.8 PB |

### 39.2.2 Scalability Requirements

| ID | Requirement |
|---|---|
| `NFR-SCAL-001` | All application services MUST be stateless and horizontally scalable. |
| `NFR-SCAL-002` | Auto-scaling MUST trigger at 65% sustained CPU or 75% memory utilisation. |
| `NFR-SCAL-003` | The system MUST handle a 5—- traffic spike within 3 minutes (exam result days, application deadlines). |
| `NFR-SCAL-004` | Background jobs MUST be queue-based with independent worker scaling. |
| `NFR-SCAL-005` | Database MUST support read replicas with automatic read/write routing. |
| `NFR-SCAL-006` | Caching MUST be applied at CDN, application and query layers with documented invalidation strategies. |
| `NFR-SCAL-007` | The data model MUST support partitioning of high-volume tables (events, ledger entries, test attempts). |
| `NFR-SCAL-008` | No single-tenant load may degrade service for other tenants; per-tenant rate limits MUST be enforced. |

### 39.2.3 Predictable Load Events

| Event | Load Multiplier | Preparation |
|---|---|---|
| NEET/JEE result declaration | 8—- | Pre-scaled capacity, cached result pages, queue-based processing |
| Major mock test (scheduled) | 6—- | Pre-warmed capacity, staggered start windows |
| College application deadline | 5—- | Pre-scaled, deadline reminders staggered |
| Campus placement season (Sep-Dec) | 3—- sustained | Baseline capacity increase |
| Exam notification release | 4—- | Cached content, CDN pre-warming |
| Marketing campaign launch | 3—- | Coordinated with growth team; capacity pre-provisioned |

## 39.3 Availability and Reliability

| ID | Requirement | Target |
|---|---|---|
| `NFR-AVL-001` | Monthly uptime (core platform) | —— 99.9% (—— 43 minutes downtime/month) |
| `NFR-AVL-002` | Monthly uptime (payment processing) | —— 99.95% |
| `NFR-AVL-003` | Monthly uptime (live classes during scheduled hours) | —— 99.5% |
| `NFR-AVL-004` | Error rate (5xx responses) | < 0.5% of requests |
| `NFR-AVL-005` | Planned maintenance window | Monthly, —— 2 hours, 02:00-04:00 IST, announced 72 hours in advance |
| `NFR-AVL-006` | Recovery Time Objective (RTO) | 4 hours |
| `NFR-AVL-007` | Recovery Point Objective (RPO) | 15 minutes |
| `NFR-AVL-008` | Backup frequency | Continuous WAL archiving + daily full backup |
| `NFR-AVL-009` | Backup retention | 30 days point-in-time; 12 monthly archives |
| `NFR-AVL-010` | Restore testing | Quarterly, documented |
| `NFR-AVL-011` | Graceful degradation | Non-critical feature failures MUST NOT prevent core flows |
| `NFR-AVL-012` | Circuit breakers | All external integrations MUST have circuit breakers with fallback behaviour |
| `NFR-AVL-013` | Retry policy | Idempotent operations retry with exponential backoff and jitter |
| `NFR-AVL-014` | Zero-downtime deployment | All deployments MUST be zero-downtime with automated rollback |

## 39.4 Security Non-Functional Requirements

Refer to Chapter 36 for the complete security specification. Summary non-functional targets:

| ID | Requirement | Target |
|---|---|---|
| `NFR-SEC-101` | Critical vulnerabilities in production | 0 |
| `NFR-SEC-102` | Critical patch application | Within 7 days |
| `NFR-SEC-103` | Penetration testing | Annual, with remediation within 30 days |
| `NFR-SEC-104` | Dependency scanning | Every build |
| `NFR-SEC-105` | Secret detection | Pre-commit and CI |
| `NFR-SEC-106` | Mean time to detect security incidents | < 15 minutes |
| `NFR-SEC-107` | Mean time to contain P1 incidents | < 2 hours |

## 39.5 Usability Requirements

| ID | Requirement |
|---|---|
| `NFR-USE-001` | A first-time student MUST be able to complete registration in —— 90 seconds. |
| `NFR-USE-002` | Any primary user task MUST be completable in —— 5 interactions from the dashboard. |
| `NFR-USE-003` | Every form MUST provide inline validation with specific, actionable error messages. |
| `NFR-USE-004` | Every destructive action MUST require confirmation naming the affected entity. |
| `NFR-USE-005` | Every list MUST define an empty state with an explanatory message and a primary action. |
| `NFR-USE-006` | Every asynchronous action MUST provide immediate feedback within 100ms. |
| `NFR-USE-007` | Loading states MUST use skeleton loaders matching final content layout. |
| `NFR-USE-008` | Error states MUST offer a retry action and MUST never present a blank screen. |
| `NFR-USE-009` | The UI MUST be fully operable on 1366—-768 without horizontal scrolling. |
| `NFR-USE-010` | All primary student flows MUST be fully usable on a 360px-wide viewport. |
| `NFR-USE-011` | Task success rate in usability testing MUST be —— 90% for primary flows. |
| `NFR-USE-012` | System Usability Scale score MUST be —— 75. |

## 39.6 Accessibility Requirements

| ID | Requirement |
|---|---|
| `NFR-ACC-001` | All primary flows MUST conform to WCAG 2.1 Level AA. |
| `NFR-ACC-002` | All functionality MUST be operable by keyboard alone. |
| `NFR-ACC-003` | Focus indicators MUST be visible with a minimum 3:1 contrast against adjacent colours. |
| `NFR-ACC-004` | Text contrast MUST be at least 4.5:1 (3:1 for large text). |
| `NFR-ACC-005` | All images MUST have appropriate alternative text; decorative images MUST be marked as such. |
| `NFR-ACC-006` | All form inputs MUST have programmatically associated labels. |
| `NFR-ACC-007` | Colour MUST NOT be the sole means of conveying information. |
| `NFR-ACC-008` | All video content MUST have captions. |
| `NFR-ACC-009` | Dynamic content changes MUST be announced to screen readers via ARIA live regions. |
| `NFR-ACC-010` | Page structure MUST use semantic HTML with correct heading hierarchy and landmarks. |
| `NFR-ACC-011` | The interface MUST remain usable at 200% zoom. |
| `NFR-ACC-012` | Motion MUST respect `prefers-reduced-motion`. |
| `NFR-ACC-013` | Automated accessibility testing MUST run in CI; manual screen-reader testing MUST occur before each major release. |

## 39.7 Compatibility Requirements

| Category | Support |
|---|---|
| **Browsers (desktop)** | Chrome, Edge, Firefox, Safari — latest 2 major versions |
| **Browsers (mobile)** | Chrome Android, Safari iOS — latest 2 major versions |
| **Operating systems** | Windows 10+, macOS 12+, Android 9+, iOS 15+ |
| **Screen sizes** | 320px - 2560px width |
| **Network** | Functional on 3G (degraded fidelity); optimised for 4G |
| **Devices** | Mid-tier Android (4GB RAM) MUST provide an acceptable experience |
| **Assistive technology** | NVDA, JAWS, VoiceOver, TalkBack |

**Requirement `NFR-COMP-001`:** The application MUST be tested on a defined device matrix including at least three mid-tier Android devices before each major release.

## 39.8 Maintainability Requirements

| ID | Requirement |
|---|---|
| `NFR-MNT-001` | Code MUST pass linting and type checking with zero errors before merge. |
| `NFR-MNT-002` | Unit test coverage MUST be —— 75% overall and —— 90% for financial, authentication and authorisation code. |
| `NFR-MNT-003` | Every module MUST have integration tests covering its primary flows. |
| `NFR-MNT-004` | Critical user journeys MUST have end-to-end automated tests. |
| `NFR-MNT-005` | All API endpoints MUST be documented in an OpenAPI specification generated from code. |
| `NFR-MNT-006` | Database schema changes MUST use versioned, reversible migrations. |
| `NFR-MNT-007` | Cyclomatic complexity per function SHOULD NOT exceed 15. |
| `NFR-MNT-008` | Cross-module communication MUST occur via events or defined service interfaces, never direct database access. |
| `NFR-MNT-009` | Configuration MUST be externalised; no environment-specific values in code. |
| `NFR-MNT-010` | Dependencies MUST be updated at least quarterly; security updates immediately. |
| `NFR-MNT-011` | Every module MUST have an owner documented in a code ownership file. |
| `NFR-MNT-012` | Architecture decisions MUST be recorded as dated decision records. |

## 39.9 Observability Requirements

| ID | Requirement |
|---|---|
| `NFR-OBS-001` | All services MUST emit structured JSON logs with correlation IDs propagated across service boundaries. |
| `NFR-OBS-002` | Distributed tracing MUST cover all request paths with sampling configurable per environment. |
| `NFR-OBS-003` | The four golden signals (latency, traffic, errors, saturation) MUST be dashboarded per service. |
| `NFR-OBS-004` | Business metrics (registrations, payments, enrolments, applications) MUST be monitored with anomaly alerting. |
| `NFR-OBS-005` | Alerts MUST be actionable, MUST have runbooks, and MUST route to an on-call rotation. |
| `NFR-OBS-006` | Alert noise MUST be managed; any alert firing more than 5 times per week without action MUST be reviewed. |
| `NFR-OBS-007` | Logs MUST NOT contain passwords, tokens, full card numbers, bank accounts or government IDs. |
| `NFR-OBS-008` | Log retention MUST be 30 days hot, 12 months cold. |
| `NFR-OBS-009` | Synthetic monitoring MUST verify critical journeys (registration, login, payment, class join) every 5 minutes. |
| `NFR-OBS-010` | A public status page MUST report current and historical availability. |

## 39.10 Operability Requirements

| ID | Requirement |
|---|---|
| `NFR-OPS-001` | Deployments MUST be automated via CI/CD with no manual production steps. |
| `NFR-OPS-002` | Every deployment MUST be revertible within 10 minutes. |
| `NFR-OPS-003` | Database migrations MUST be backward-compatible to permit rollback. |
| `NFR-OPS-004` | Feature flags MUST allow disabling any new feature without deployment. |
| `NFR-OPS-005` | Runbooks MUST exist for every alert and every recurring operational procedure. |
| `NFR-OPS-006` | An on-call rotation MUST be maintained with a 15-minute acknowledgement SLA for P1 alerts. |
| `NFR-OPS-007` | Incident post-mortems MUST be blameless and MUST produce tracked corrective actions. |
| `NFR-OPS-008` | Disaster recovery MUST be exercised at least annually. |
| `NFR-OPS-009` | Infrastructure cost MUST be monitored per service with monthly review. |
| `NFR-OPS-010` | Capacity planning MUST be reviewed quarterly against growth projections. |

## 39.11 Localisation Requirements

| ID | Requirement | Version |
|---|---|---|
| `NFR-LOC-001` | All user-facing strings MUST be externalised into resource files from V1. | V1 |
| `NFR-LOC-002` | Date, time, number and currency formatting MUST respect locale. | V1 |
| `NFR-LOC-003` | The Indian numbering system (lakh, crore) MUST be used for INR display in India. | V1 |
| `NFR-LOC-004` | Hindi and Tamil UI translations MUST be available. | V2 |
| `NFR-LOC-005` | Content (course, coaching) MUST support per-language variants sharing a topic mapping. | V2 |
| `NFR-LOC-006` | Notification templates MUST support per-language variants. | V2 |
| `NFR-LOC-007` | Text expansion of up to 40% MUST NOT break layouts. | V1 |
| `NFR-LOC-008` | Additional languages (Telugu, Kannada, Malayalam, Marathi, Bengali) MUST be addable without code changes. | V3 |

## 39.12 Cost Efficiency Requirements

| ID | Requirement | Target |
|---|---|---|
| `NFR-COST-001` | Infrastructure cost per monthly active user | —— —,—9 (Y1), —— —,—6 (Y3) |
| `NFR-COST-002` | AI inference cost per monthly active student | —— —,—12 (Y2) |
| `NFR-COST-003` | Video delivery cost per hour streamed | —— —,—1.80 |
| `NFR-COST-004` | Storage lifecycle policies MUST move cold content to lower-cost tiers after 90 days |
| `NFR-COST-005` | Non-production environments MUST scale to zero outside business hours |
| `NFR-COST-006` | Cost anomaly alerts MUST trigger on a 25% day-over-day increase |

## 39.13 Verification Matrix

| NFR Category | Verification Method | Frequency |
|---|---|---|
| Performance | Synthetic testing + real user monitoring | Continuous; formal review weekly |
| Scalability | Load testing at 1.5—- projected peak | Before each major release |
| Availability | Uptime monitoring; chaos testing | Continuous; chaos quarterly |
| Security | SAST, DAST, dependency scanning, penetration test | CI; annual pen test |
| Usability | Moderated usability testing | Before each major release |
| Accessibility | Automated axe testing + manual screen reader | CI; manual per major release |
| Compatibility | Device matrix testing | Before each major release |
| Maintainability | Coverage reports, complexity analysis, review metrics | Every build |
| Observability | Alert coverage audit; runbook review | Quarterly |
| Cost | Cost dashboards and per-unit metrics | Monthly |

---

# Chapter 40 — Version 1 MVP Scope

> **Purpose of this chapter:** To define with absolute precision what will be built and released in Version 1, what will not, the delivery plan, the team structure, and the criteria that determine whether V1 is ready to launch.

## 40.1 V1 Strategic Objective

> **Prove the spine.** V1 must demonstrate that a single student identity can flow continuously from career discovery through coaching, courses, college applications, internships and jobs, with money moving correctly, institutions verified, and outcomes measured — for a concentrated cohort in two states.

V1 is not an attempt to be complete. It is an attempt to be **coherent**. Every module included exists because it is required to demonstrate continuity or to generate revenue from day one.

## 40.2 V1 Scope Summary

| Included | Excluded (deferred to V2/V3) |
|---|---|
| Authentication, RBAC, unified profile | Native mobile apps |
| Student, College, HR, Admin dashboards | Training Institute dashboard |
| Career Guidance (full) | Channel Partner dashboard |
| Coaching (18 tracks, live + recorded + mocks) | Study Abroad |
| Skill Courses (catalogue + delivery + certification) | Live Projects |
| College Admissions (discovery —' admission) | Payroll |
| Internships (discovery —' certification) | Full ATS (Kanban, scorecards, offer workflow) |
| Jobs (posting —' application —' basic pipeline) | Campus drive management |
| Payments, Wallet, Coupons, Referrals | Platform assessments for employers |
| Certificates with public verification | Advanced AI (mock interview, adaptive plans) |
| Notifications (in-app, email, SMS, WhatsApp) | Regional languages |
| Basic AI (career, chat, matching, resume, insights) | Advanced analytics (cohorts, funnels builder) |
| Basic analytics dashboards | Commission engine and payouts |
| Admin verification, moderation, finance | Peer review, proctoring |
| Public marketing site with SEO | Public API |

## 40.2.1 V1 Student Dashboard UI (Mandatory)

| Rule | Detail |
|---|---|
| Canon | `docs/assets/student-dashboard-reference.png` + Chapter 20.2 |
| Requirement | V1 Student Dashboard MUST match the reference layout (top bar, left nav order, KPIs, AI banner, Explore Modules, Continue Learning, right-rail widgets, trust bar, footer) |
| Primary colour | `#3B82F6` |
| Exit criterion | Visual QA sign-off against the reference PNG is required for V1 launch (see also `FR-UI-001`) |

## 40.3 V1 Module-by-Module Scope

### 40.3.1 Platform Foundation — IN SCOPE

| Capability | Included | Notes |
|---|---|---|
| Email/password, Google OAuth, mobile OTP | Yes | All three methods |
| JWT with refresh rotation | Yes | |
| MFA for privileged roles | Yes | TOTP |
| RBAC with tenant scoping | Yes | All V1 roles |
| Multi-role context switching | Yes | |
| Unified student profile | Yes | Full schema, progressive profiling |
| Profile completeness scoring | Yes | |
| Consent management | Yes | Granular, per purpose |
| Data export and deletion | Yes | DPDP compliance |
| Document upload with virus scanning | Yes | |
| Global search | Yes | Across 6 entity types |
| Audit logging | Yes | All privileged actions |
| Feature flags | Yes | |
| Support impersonation | Yes | With audit and banner |

### 40.3.2 Career Guidance — IN SCOPE (Full)

| Capability | Included |
|---|---|
| Multi-dimensional assessment (210 questions) | Yes |
| Save-and-resume | Yes |
| Career report with 10 ranked matches | Yes |
| Explainable rationale | Yes |
| Career library (200 careers) | Yes |
| Stream and exam recommendation | Yes |
| Career roadmap | Yes |
| PDF report download | Yes |
| Reassessment with comparison | Yes |
| Human counsellor booking | **No — V2** |

### 40.3.3 Coaching — IN SCOPE (Core)

| Capability | Included | Notes |
|---|---|---|
| 18 exam tracks configured | Yes | Content depth varies; minimum viable content per track defined below |
| Batch discovery and enrolment | Yes | |
| Live class delivery | Yes | Third-party video integration |
| Class recordings | Yes | Within 2 hours |
| Study materials with watermarking | Yes | |
| Mock test engine | Yes | Full exam-replica interface |
| Instant results with rank and percentile | Yes | |
| Topic-wise weakness analysis | Yes | Rule-based; AI-enhanced in V2 |
| Solutions (text) | Yes | Video solutions for key questions only |
| Doubt posting with AI response | Yes | Faculty response for paid batches |
| Attendance tracking | Yes | |
| Syllabus coverage tracker | Yes | |
| Current affairs digest | Yes | Government tracks only |
| Multi-batch enrolment | Yes | |
| Content protection | Yes | Signed URLs, watermark, session limits |
| Adaptive study planner | **Basic only** | Static plan generation; adaptive in V2 |
| Parent progress reports | **No — V2** | |

**V1 Content Depth Minimum per Track**

| Track Category | Minimum at Launch |
|---|---|
| Priority tracks (NEET, JEE Main, TNPSC, SSC, Banking, Placement Prep) | Full syllabus content + 3,000 questions + 20 full mocks |
| Secondary tracks (JEE Advanced, CUET, UPSC, Railway, Defence, Police, TET, TRB) | Full syllabus map + 1,500 questions + 10 full mocks |
| Skill tracks (Coding Prep, Communication, Interview Prep, Foundation) | Full curriculum + assessments |

### 40.3.4 Skill Courses — IN SCOPE

| Capability | Included |
|---|---|
| Course catalogue (120 courses at launch) | Yes |
| Job demand indicator | Yes |
| Course player with full features | Yes |
| Duration-weighted progress | Yes |
| Assignments with grading | Yes |
| Quizzes | Yes |
| Final assessment | Yes |
| Certificate issuance | Yes |
| Career tracks (5 at launch, 9 by V2) | Yes |
| Course Q&A | Yes |
| Skill profile propagation | Yes |
| Instructor authoring tools | **Admin-assisted only in V1** |
| Proctored certification | **No — V2** |

### 40.3.5 College Admissions — IN SCOPE

| Capability | Included |
|---|---|
| Verified college database (2,000 at launch, 5,000 by end of V1) | Yes |
| Advanced search and filtering | Yes |
| College profiles with source labelling | Yes |
| Comparison (up to 4) | Yes |
| Eligibility checker | Yes |
| Shortlist management | Yes |
| Application submission with documents | Yes |
| Application tracking | Yes |
| Scholarship discovery | Yes |
| Dual-confirmation admission recording | Yes |
| College lead inbox and management | Yes |
| Bulk student import | Yes |
| Verified student reviews | Yes |
| AI shortlist generator | **Rule-based in V1; AI in V2** |
| Admission predictor | **No — V2** |
| Placement drive management | **No — V2** |
| Accreditation reports | **Basic export only** |

### 40.3.6 Internships — IN SCOPE

| Capability | Included |
|---|---|
| Internship discovery with match scores | Yes |
| One-click application | Yes |
| Application status transparency | Yes |
| Verified employer enforcement | Yes |
| Basic selection process (screening, interview) | Yes |
| Internship certificate | Yes |
| Student escalation channel | Yes |
| Active internship workspace | **No — V2** |
| Structured rubric evaluation | **Simplified in V1** |
| Guaranteed Internship Programme | **No — V2** |

### 40.3.7 Jobs & Hiring — IN SCOPE (Core Only)

| Capability | Included |
|---|---|
| Job discovery with match scores | Yes |
| One-click job application | Yes |
| Job posting wizard | Yes |
| Company verification (3 tiers) | Yes |
| Basic applicant pipeline (list view, status transitions) | Yes |
| Candidate profile view with verification badges | Yes |
| Bulk shortlist/reject with notification | Yes |
| Employer accountability metrics | Yes |
| Kanban pipeline | **No — V2** |
| AI candidate ranking | **Basic score only; full ranking V2** |
| Candidate search | **No — V2** |
| Platform assessments | **No — V2** |
| Interview scheduling | **Manual coordination in V1** |
| Interview scorecards | **No — V2** |
| Offer management workflow | **Basic offer record only** |
| Campus drives | **No — V2** |

### 40.3.8 Commerce — IN SCOPE (Full)

| Capability | Included |
|---|---|
| Razorpay integration (UPI, cards, netbanking, wallets) | Yes |
| Stripe integration (international) | Yes |
| EMI | Yes |
| Subscription billing (Premium tiers) | Yes |
| GST invoicing | Yes |
| Refund engine with policy automation | Yes |
| Double-entry wallet ledger | Yes |
| Coupon engine (all 9 types) | Yes |
| Referral programme | Yes |
| Reconciliation suite | Yes |
| Commission engine | **Accrual only; payouts V2** |
| Payout processing | **No — V2** |

### 40.3.9 AI — IN SCOPE (Basic)

| Capability | Included |
|---|---|
| Career recommendation engine | Yes |
| Conversational assistant | Yes |
| Course recommendation | Yes |
| Job and internship matching | Yes |
| Resume builder | Yes |
| Daily insight generator | Yes |
| AI doubt preliminary response | Yes |
| Adaptive study plan | **No — V2** |
| Weakness detection (AI) | **Rule-based in V1** |
| AI mock interview | **No — V2** |
| Skill gap analyser | **Basic in V1** |
| Fraud detection | **Rule-based in V1** |

### 40.3.10 Notifications & Analytics — IN SCOPE (Core)

| Capability | Included |
|---|---|
| In-app notifications (real-time) | Yes |
| Email notifications | Yes |
| SMS notifications (DLT-registered) | Yes |
| WhatsApp notifications | Yes |
| Web push | Yes |
| Preference management | Yes |
| Frequency capping and quiet hours | Yes |
| Template management | Yes |
| Event pipeline | Yes |
| Student, College, Company, Admin dashboards | Yes |
| Standard reports (25 of 60) | Yes |
| Cohort analysis | **No — V2** |
| Custom funnel builder | **No — V2** |
| Custom report builder | **No — V2** |

### 40.3.11 Administration — IN SCOPE (Full)

| Capability | Included |
|---|---|
| Verification queues with SLA timers | Yes |
| Institution and employer verification | Yes |
| Content moderation | Yes |
| Listing approval and reporting | Yes |
| Transaction monitoring | Yes |
| Refund approval | Yes |
| Reconciliation dashboards | Yes |
| Dispute management | Yes |
| Support ticketing | Yes |
| RBAC management | Yes |
| Feature flags | Yes |
| Coupon campaign management | Yes |
| Audit log viewer | Yes |
| System health monitoring | Yes |

## 40.4 V1 Delivery Plan

### 40.4.1 Phase Breakdown

| Phase | Weeks | Focus | Key Deliverables |
|---|---|---|---|
| **Phase 0 — Foundation** | 1-4 | Infrastructure and spine | Repos, CI/CD, environments, database schema, auth, RBAC, design system, component library |
| **Phase 1 — Identity & Profile** | 5-8 | Student core | Registration flows, profile, consent, documents, student dashboard shell, notifications core |
| **Phase 2 — Discovery & Guidance** | 7-11 | Career + Public site | Career assessment, report engine, career library, public marketing site, SEO foundation |
| **Phase 3 — Commerce** | 9-13 | Money | Payments, wallet ledger, coupons, invoicing, refunds, subscriptions, reconciliation |
| **Phase 4 — Learning** | 11-17 | Coaching + Courses | Batches, live classes, recordings, materials, mock test engine, course player, assessments, certificates |
| **Phase 5 — Opportunities** | 15-20 | Colleges + Internships + Jobs | College database, search, applications, internship and job posting, application flows |
| **Phase 6 — Institutional** | 17-22 | College + HR dashboards | Lead management, bulk import, applicant pipeline, employer tools |
| **Phase 7 — Intelligence** | 19-22 | AI layer | Recommendations, matching, assistant, resume builder, insights |
| **Phase 8 — Governance** | 20-23 | Admin | Verification, moderation, finance, disputes, analytics dashboards, reports |
| **Phase 9 — Hardening** | 23-26 | Quality | Performance optimisation, security testing, accessibility, load testing, UAT, content loading |

### 40.4.2 Team Structure

| Function | Headcount | Allocation |
|---|---|---|
| Product Management | 3 | 1 platform, 1 learning, 1 opportunities/institutional |
| Design (UX/UI) | 4 | 1 lead, 2 product designers, 1 design system |
| Frontend Engineering | 8 | 2 platform, 2 learning, 2 opportunities, 2 institutional |
| Backend Engineering | 10 | 2 platform/auth, 2 commerce, 3 learning, 3 opportunities |
| Data & AI Engineering | 3 | 1 pipeline, 2 AI features |
| QA & Automation | 5 | 2 manual, 3 automation |
| DevOps / SRE | 3 | Infrastructure, CI/CD, observability |
| Academic & Content | 12 | Content production, question banks, review |
| **Total** | **48** | |

### 40.4.3 Critical Path

```

Auth + RBAC - ' Profile - ' Payments - ' Wallet
|
Career Assessment - ' Career Report
|
Coaching Batches - ' Live Classes - ' Mock Tests
|
Courses - ' Certificates
|
Colleges / Internships / Jobs - ' Applications
|
Institutional Dashboards
|
AI Layer - ' Analytics - ' Admin
|
Hardening - ' Launch

```

**Longest lead-time items:** Content production for 18 exam tracks (starts Week 1, parallel to all engineering); college database compilation and verification (starts Week 1); DLT and WhatsApp template registration (starts Week 4); payment gateway onboarding and KYC (starts Week 2).

## 40.5 V1 Launch Criteria

### 40.5.1 Functional Gates

| Gate | Criterion | Owner |
|---|---|---|
| G-F1 | All P0 features implemented and accepted | Product |
| G-F2 | All acceptance criteria in Chapters 21-33 verified | QA |
| G-F3 | End-to-end student journey completable: register —' assess —' enrol —' learn —' test —' apply —' track | QA |
| G-F4 | End-to-end college journey completable: onboard —' verify —' import students —' receive leads —' convert | QA |
| G-F5 | End-to-end employer journey completable: onboard —' verify —' post —' receive applications —' shortlist —' offer | QA |
| G-F6 | End-to-end payment journey verified across all methods including EMI, coupon, wallet and refund | QA + Finance |
| G-F7 | Certificate issuance and public verification working end to end | QA |

### 40.5.2 Quality Gates

| Gate | Criterion |
|---|---|
| G-Q1 | Zero P1 (critical) and zero P2 (high) open defects |
| G-Q2 | Unit test coverage —— 75% overall; —— 90% for auth, RBAC and financial code |
| G-Q3 | All critical journeys covered by automated end-to-end tests |
| G-Q4 | Performance targets met: LCP < 2.5s, API P95 < 350ms (read) |
| G-Q5 | Load test passed at 1.5—- projected peak (18,000 concurrent users, 37,500 concurrent test takers) |
| G-Q6 | Accessibility: WCAG 2.1 AA verified on all primary flows |
| G-Q7 | Compatibility verified across the defined device and browser matrix |

### 40.5.3 Security Gates

| Gate | Criterion |
|---|---|
| G-S1 | Third-party penetration test completed with zero unremediated critical or high findings |
| G-S2 | SAST and dependency scans clean of critical and high severity |
| G-S3 | All access-control test cases pass (zero cross-tenant leakage, zero IDOR) |
| G-S4 | Secrets audit clean; no secrets in code or configuration |
| G-S5 | Encryption verified at rest and in transit |
| G-S6 | Incident response plan documented and tabletop-exercised |

### 40.5.4 Compliance Gates

| Gate | Criterion |
|---|---|
| G-C1 | Privacy policy, terms of service, refund policy and cookie policy published and legally reviewed |
| G-C2 | DPDP compliance verified: consent, notice, export, deletion, grievance officer |
| G-C3 | GST invoicing verified with sequential numbering and correct tax computation |
| G-C4 | DLT SMS templates registered and approved |
| G-C5 | WhatsApp Business templates approved |
| G-C6 | Payment gateway compliance and KYC complete |

### 40.5.5 Content and Supply Gates

| Gate | Criterion |
|---|---|
| G-CS1 | 6 priority exam tracks at full content depth |
| G-CS2 | 12 secondary tracks at minimum content depth |
| G-CS3 | 120 courses published and reviewed |
| G-CS4 | 2,000 colleges verified and published |
| G-CS5 | 100 employers verified and onboarded |
| G-CS6 | 300 active internship and job postings |
| G-CS7 | 50 partner colleges contracted |
| G-CS8 | 40 coaching batches scheduled with confirmed faculty |

### 40.5.6 Operational Gates

| Gate | Criterion |
|---|---|
| G-O1 | Monitoring, alerting and on-call rotation operational |
| G-O2 | Runbooks written for all alerts and recurring procedures |
| G-O3 | Backup and restore verified |
| G-O4 | Support team trained; help centre populated with 100+ articles |
| G-O5 | Verification operations team trained and staffed |
| G-O6 | Finance reconciliation process operational and tested |
| G-O7 | Status page live |

## 40.6 V1 Success Criteria (90 Days Post-Launch)

| Metric | Target |
|---|---|
| Registered students | 40,000 |
| Career assessments completed | 22,000 |
| Monthly active students | 18,000 |
| Paying students | 2,800 |
| Revenue | —,—4.2 Cr |
| Partner colleges (active) | 80 |
| Verified companies | 160 |
| Internship applications | 24,000 |
| Job applications | 30,000 |
| Confirmed admissions | 1,400 |
| Uptime | —— 99.9% |
| P1 incidents | —— 2 |
| Student NPS | —— 45 |
| Payment success rate | —— 94% |
| Support first-response time | < 4 hours |

## 40.7 V1 Explicit Non-Goals

| Non-Goal | Rationale |
|---|---|
| National coverage | Beachhead focus on Tamil Nadu and Karnataka |
| Complete content library | Depth in 6 priority tracks beats breadth in 18 |
| Feature parity with category specialists | Coherence beats completeness in V1 |
| Native mobile apps | Responsive web proves the model; apps follow demand |
| Profitability | V1 targets validated unit economics, not profit |
| Advanced AI | Prove basic AI is trusted and used before deepening |
| Payroll | Requires hiring volume that V1 will not yet have generated |

## 40.8 V1 Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| Content production slips | Launch delay | Content starts Week 1 in parallel; buy-vs-build decision per track at Week 8; reduce secondary track depth if needed |
| College verification volume | Insufficient supply at launch | Dedicated verification team from Week 1; prioritise 2 beachhead states |
| Live video provider reliability | Core coaching experience fails | Dual-provider evaluation; recorded fallback; make-up session policy |
| Payment gateway onboarding delay | Cannot monetise at launch | Start onboarding Week 2; parallel Stripe onboarding |
| Team hiring delays | Delivery slips | Front-load senior hiring; contractor buffer for content and QA |
| Scope creep | Delivery slips | Scope frozen at this document; addition requires equal removal |
| Load on exam result day | Outage at peak visibility | Load testing at 1.5—- projected peak; pre-scaling runbook |

---

# Chapter 41 — Version 2 Roadmap

> **Purpose of this chapter:** To define the Version 2 scope, its strategic objective, phased delivery, and the success criteria that determine whether Ellowring has moved from coherent to competitive.

## 41.1 V2 Strategic Objective

> **Deepen and monetise.** V2 completes the ecosystem by adding the modules that create the strongest defensibility (Live Projects, Payroll), the highest-margin revenue (Study Abroad, Payroll SaaS), and the operating leverage (Training and Channel Partner dashboards, full ATS, advanced AI, mobile apps).

V1 proves the spine works. V2 proves the business compounds.

## 41.2 V2 Timeline

| Window | Months post-V1 launch |
|---|---|
| Development | Months 1-8 |
| Phased release | Months 3, 5, 7, 8 |
| Full V2 availability | Month 8 |

## 41.3 V2 Scope by Theme

### 41.3.1 Theme 1 — New Ecosystems

| Module | Scope | Release |
|---|---|---|
| **Live Projects** | Full ecosystem: project briefs, team formation, sprint workspace, mentor programme, grading, IP controls, portfolio artefacts, direct offers | Month 5 |
| **Study Abroad** | Full ecosystem: 10 countries, 3,000 universities, cost calculator, eligibility checker, 8-phase milestone tracker, document vault, SOP/LOR support, visa tracking, counsellor workflow, transparency controls | Month 7 |
| **Payroll** | Full ecosystem: offer-to-payroll automation, onboarding, salary structures, attendance, leave, payroll runs, statutory compliance (PF, ESI, PT, TDS), payslips, Form 16, employee self-service, exit and F&F | Month 7 |

### 41.3.2 Theme 2 — New Dashboards

| Dashboard | Scope | Release |
|---|---|---|
| **Training Institute** | Batch and course management, content authoring, live class hosting, assessment builder, student management, trainer management, revenue ledger, payouts | Month 3 |
| **Channel Partner** | Referral link generation, lead tracking, conversion attribution, commission ledger, wallet, payout requests, collateral library, training and certification, tier progression, leaderboards | Month 3 |
| **Parent (linked view)** | Progress summary, attendance, test scores, invoices and payments, notifications | Month 5 |
| **Mentor** | Assigned teams, sprint reviews, deliverable feedback, grading, session management | Month 5 |

### 41.3.3 Theme 3 — Hiring Depth

| Capability | Scope | Release |
|---|---|---|
| Full ATS | Kanban pipeline, collaborative review, saved views, bulk operations | Month 3 |
| Candidate search | Consent-gated faceted and boolean search, saved searches, alerts, talent pools | Month 3 |
| Platform assessments | 6 assessment types, browser lock, optional webcam proctoring, reusable scores | Month 5 |
| Interview management | Panel availability, self-scheduling, video links, scorecards, aggregated decisions | Month 5 |
| Offer management | Creation, approval workflow, digital letters, acceptance tracking, negotiation | Month 5 |
| Campus drives | Multi-college drives, automatic eligibility, round management, bulk results, drive analytics | Month 7 |
| AI candidate ranking | Full explainable ranking with configurable weighting | Month 5 |
| Employer brand pages | Customisable employer profile pages | Month 7 |

### 41.3.4 Theme 4 — AI Depth

| Capability | Release |
|---|---|
| Adaptive study plan generator | Month 3 |
| AI weakness detection and remediation | Month 3 |
| Skill gap analyser (full) | Month 3 |
| AI mock interview with feedback | Month 5 |
| AI college shortlist generator | Month 5 |
| SOP draft assistant | Month 7 |
| Job description generator | Month 5 |
| Content moderation assistant | Month 5 |
| Fraud and anomaly detection (ML-based) | Month 7 |

### 41.3.5 Theme 5 — Platform Maturity

| Capability | Release |
|---|---|
| Native mobile apps (iOS + Android, student flows) | Month 8 |
| Hindi and Tamil localisation (UI + key content) | Month 5 |
| Cohort analysis and funnel builder | Month 3 |
| Custom report builder | Month 5 |
| Commission engine and payout processing | Month 3 |
| Instructor self-service authoring tools | Month 3 |
| Proctored certification | Month 5 |
| Peer review assignments | Month 7 |
| Portfolio builder (public shareable) | Month 5 |
| Parent progress reporting | Month 5 |
| Bug bounty programme | Month 7 |
| Data residency controls | Month 8 |

### 41.3.6 Theme 6 — Content and Supply Expansion

| Target | Month 8 |
|---|---|
| Exam tracks at full content depth | 18 of 18 |
| Published courses | 320 |
| Career tracks | 9 |
| Verified colleges | 12,000 |
| Partner colleges | 1,200 |
| Verified companies | 2,200 |
| Training institute partners | 180 |
| Active channel partners | 4,000 |
| Certified mentors | 140 |

## 41.4 V2 Phased Release Plan

| Release | Month | Contents |
|---|---|---|
| **V2.1** | 3 | Training Institute dashboard, Channel Partner dashboard, commission engine and payouts, full ATS, candidate search, adaptive study plan, AI weakness detection, cohort analysis, funnel builder, instructor authoring |
| **V2.2** | 5 | Live Projects, Mentor dashboard, Parent view, platform assessments, interview management, offer management, AI mock interview, AI college shortlist, portfolio builder, Hindi and Tamil, proctored certification, custom reports |
| **V2.3** | 7 | Study Abroad, Payroll, campus drives, SOP assistant, ML fraud detection, employer brand pages, peer review, bug bounty |
| **V2.4** | 8 | Native mobile apps, data residency controls, V2 hardening |

## 41.5 V2 Success Criteria

| Metric | Target at V2 completion (Month 8) |
|---|---|
| Registered students | 900,000 |
| Monthly active students | 340,000 |
| Paying students | 95,000 |
| Annual revenue run rate | —,—128 Cr |
| Recurring revenue share | —— 22% |
| Partner colleges | 1,200 |
| Verified companies | 2,200 |
| Companies using payroll | 420 |
| Active channel partners | 4,000 |
| Students in —— 3 modules | —— 32% |
| Placements facilitated (cumulative) | 25,000 |
| Internships facilitated (cumulative) | 65,000 |
| Student NPS | —— 62 |
| Mobile app installs | 250,000 |
| Uptime | —— 99.95% |
| Contribution-positive modules | 9 of 10 |

## 41.6 V2 Key Dependencies

| Dependency | Required By | Risk if Delayed |
|---|---|---|
| Payroll statutory rule engine and compliance sign-off | Month 6 | Payroll release slips; recurring revenue delayed |
| Mentor recruitment (140 certified) | Month 4 | Live Projects capacity constrained |
| International university partnerships (120) | Month 6 | Study Abroad supply insufficient |
| Regional language content production | Month 4 | Localisation is UI-only, reducing impact |
| Mobile app store approval | Month 8 | App launch slips |
| Channel partner recruitment (4,000) | Ongoing | Tier 2/3 growth slower than modelled |

---

# Chapter 42 — Version 3 Roadmap

> **Purpose of this chapter:** To define the Version 3 horizon — scaling nationally, expanding internationally, opening the platform, and applying predictive intelligence.

## 42.1 V3 Strategic Objective

> **Scale and expand.** V3 takes a proven, complete ecosystem and scales it nationally, extends it internationally, opens it to third parties through APIs, and applies predictive intelligence built on three years of accumulated outcome data.

## 42.2 V3 Timeline

| Window | Months post-V2 completion |
|---|---|
| Development | Months 1-16 |
| Phased release | Months 4, 8, 12, 16 |

## 42.3 V3 Scope by Theme

### 42.3.1 Theme 1 — National Scale

| Capability | Description |
|---|---|
| Full state coverage | Operations in all major states with localised content and exam tracks |
| Regional exam tracks | State PSC tracks for 12 additional states (MPPSC, UPPSC, BPSC, RPSC, KPSC, APPSC, TSPSC, MPSC, WBPSC, GPSC, HPSC, PPSC) |
| Additional languages | Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Odia |
| Regional content partnerships | State-specific content partners for language and curriculum depth |
| Multi-region infrastructure | Reduced latency through regional deployment |
| Regional operations teams | Localised verification, support and partnerships |

### 42.3.2 Theme 2 — International Expansion

| Capability | Description |
|---|---|
| Market entry (2 markets) | Initial international markets selected from GCC, South-East Asia and Africa based on structural similarity |
| Multi-currency | Full multi-currency pricing, payment, wallet and settlement |
| Localised compliance | Data residency, local payment methods, local tax and employment rules |
| International employer network | Employers hiring Indian and local talent |
| Diaspora corridor | Indian students abroad and international students seeking Indian education |
| Global credential verification | Certificates verifiable and recognised across markets |

### 42.3.3 Theme 3 — Platform Opening

| Capability | Description |
|---|---|
| Public partner API | REST and webhook API for colleges, employers and ecosystem partners |
| API marketplace | Third-party integrations built on Ellowring data with student consent |
| SSO federation | SAML/OIDC integration with college and enterprise identity providers |
| LMS integration | Bidirectional integration with Moodle, Canvas and campus ERPs |
| HRIS integration | Integration with major HRIS platforms for enterprise employers |
| Embedded widgets | Embeddable job boards, course catalogues and verification widgets |
| Developer portal | Documentation, sandbox, keys, usage analytics |

### 42.3.4 Theme 4 — Predictive Intelligence

| Capability | Description |
|---|---|
| Predictive placement model | Placement probability with the specific interventions that most improve it |
| Salary prediction | Expected salary range by profile, role, location and market conditions |
| Dropout risk prediction | Early identification of students likely to disengage, with intervention triggers |
| Exam score prediction | Predicted exam performance with confidence intervals |
| Admission probability (calibrated) | Probability calibrated on three years of actual admission outcomes |
| Learning path optimiser | Optimal sequence of courses and projects for a target role |
| Demand forecasting | Predicted skill demand 6-12 months ahead, guiding curriculum investment |
| Employer fit prediction | Predicted retention and performance fit between candidate and employer |

### 42.3.5 Theme 5 — New Revenue Surfaces

| Capability | Description |
|---|---|
| Advertising platform | Sponsored college, course and employer placements with strict labelling and youth protections |
| Career fairs (virtual) | Large-scale virtual hiring events with sponsorship |
| Enterprise learning | Corporate upskilling sold to employers for existing workforces |
| Credential verification service | Paid verification API for third-party employers and institutions |
| Data insights products | Anonymised, aggregated market intelligence reports for institutions and policymakers |
| Financial products (partnered) | Education loans, income-share agreements and insurance via licensed partners |

### 42.3.6 Theme 6 — Experience Innovation

| Capability | Description |
|---|---|
| Voice-based AI interaction | Voice input and output for the assistant, critical for low-literacy and regional users |
| Multilingual AI assistant | Assistant operating natively in 8 Indian languages |
| Offline-capable mobile | Downloadable content with sync for low-connectivity regions |
| Adaptive testing | Item-response-theory-based adaptive assessments |
| AR/VR learning experiences | Selected practical training simulations |
| Community platform | Moderated peer study groups, alumni networks and mentorship circles |
| Gamification depth | Structured achievement systems tied to genuine outcomes |

## 42.4 V3 Phased Release Plan

| Release | Month | Contents |
|---|---|---|
| **V3.1** | 4 | 6 additional state PSC tracks, 4 additional languages, offline mobile content, community platform, adaptive testing |
| **V3.2** | 8 | Public partner API, developer portal, SSO federation, LMS integration, predictive placement model, salary prediction |
| **V3.3** | 12 | International market 1, multi-currency, advertising platform, enterprise learning, credential verification service |
| **V3.4** | 16 | International market 2, voice AI, multilingual assistant, HRIS integrations, data insights products, financial partnerships |

## 42.5 V3 Success Criteria

| Metric | Target |
|---|---|
| Registered students | 2,500,000 |
| Monthly active students | 1,000,000 |
| Paying students | 300,000 |
| Annual revenue | —,—326 Cr |
| Recurring revenue share | —— 21% |
| Partner colleges | 3,000 |
| Verified companies | 6,000 |
| Companies using payroll | 1,500 |
| Active channel partners | 10,000 |
| States with —— 5% student share | 16 |
| International markets live | 2 |
| API partners integrated | 50 |
| Students in —— 3 modules | —— 42% |
| Placements facilitated (cumulative) | 80,000 |
| Student NPS | —— 70 |
| Operating margin | —— 22% |
| Uptime | —— 99.97% |

## 42.6 Version Comparison Summary

| Dimension | V1 | V2 | V3 |
|---|---|---|---|
| **Theme** | Prove the spine | Deepen and monetise | Scale and expand |
| **Ecosystems live** | 6 | 9 | 9 + international |
| **Dashboards** | 4 | 8 | 8 + partner API |
| **Exam tracks** | 18 | 18 (full depth) | 30 |
| **Languages** | 1 | 3 | 11 |
| **Geography** | 2 states | 9 states | 16 states + 2 countries |
| **AI features** | 7 | 16 | 22 |
| **Revenue streams** | 8 | 12 | 13 |
| **Registered students** | 250,000 | 900,000 | 2,500,000 |
| **Annual revenue** | —,—30 Cr | —,—128 Cr | —,—326 Cr |
| **Platform openness** | Closed | Closed | Open API |
| **Mobile** | Responsive web | Native apps | Offline-capable + voice |

---

# Chapter 43 — Product Success Metrics

> **Purpose of this chapter:** To define the complete measurement framework — the North Star metric, the metric tree, targets by version, review cadence and the guardrails that prevent metric gaming.

## 43.1 North Star Metric

> **Verified Outcomes Delivered** — the count of students who achieve a verified, platform-recorded outcome (confirmed admission, completed internship, graded live project, or accepted job offer) in a given period.

### 43.1.1 Why This Metric

| Criterion | Assessment |
|---|---|
| Reflects real value | An outcome is what the student actually came for |
| Cannot be gamed by engagement tricks | Requires a third party (college or employer) to confirm |
| Correlates with revenue | Every outcome type is monetised |
| Aligns all six actors | Students, colleges, employers, trainers and partners all benefit from outcomes |
| Measurable and verifiable | Every component is a recorded, dual-confirmed platform event |

### 43.1.2 North Star Targets

| Period | Verified Outcomes |
|---|---|
| V1 (Year 1) | 32,000 |
| V2 (Year 2) | 138,000 |
| V3 (Year 3) | 420,000 |

## 43.2 Metric Tree

```

NORTH STAR: Verified Outcomes Delivered
| ,
| o | ? | ? L1: Outcome-Capable Students
| , | o | ? | ? L2: Registered Students
| , | , | o | ? | ? L3: Traffic (organic, partner, referral, paid)
| , | , | " | ? | ? L3: Landing - ' Registration conversion
| , | o | ? | ? L2: Activated Students
| , | , | o | ? | ? L3: Assessment completion rate
| , | , | " | ? | ? L3: First meaningful action rate
| , | " | ? | ? L2: Retained Students
| , | o | ? | ? L3: Month-3 retention
| , | " | ? | ? L3: Multi-module adoption
| ,
| o | ? | ? L1: Opportunity Supply
| , | o | ? | ? L2: Verified Colleges
| , | o | ? | ? L2: Verified Employers
| , | o | ? | ? L2: Active Postings (internships, jobs, projects)
| , | " | ? | ? L2: Coaching Batches and Courses
| ,
| o | ? | ? L1: Match Quality
| , | o | ? | ? L2: Application - ' Interview rate
| , | o | ? | ? L2: Interview - ' Offer rate
| , | " | ? | ? L2: AI match acceptance rate
| ,
| " | ? | ? L1: Conversion Efficiency
| o | ? | ? L2: Employer response rate
| o | ? | ? L2: Offer acceptance rate
| " | ? | ? L2: Admission confirmation rate

```

## 43.3 Metric Categories and Targets

### 43.3.1 Growth Metrics

| Metric | V1 (Y1) | V2 (Y2) | V3 (Y3) |
|---|---|---|---|
| Registered students | 250,000 | 900,000 | 2,500,000 |
| Monthly active students | 90,000 | 340,000 | 1,000,000 |
| Daily active students | 27,000 | 105,000 | 320,000 |
| DAU/MAU (stickiness) | 30% | 31% | 32% |
| New registrations per month (exit rate) | 32,000 | 78,000 | 180,000 |
| Organic acquisition share | 34% | 45% | 55% |
| Referral acquisition share | 12% | 18% | 22% |
| Partner colleges | 400 | 1,200 | 3,000 |
| Verified companies | 600 | 2,200 | 6,000 |
| Training institute partners | 60 | 180 | 450 |
| Active channel partners | 1,200 | 4,000 | 10,000 |

### 43.3.2 Engagement Metrics

| Metric | V1 | V2 | V3 |
|---|---|---|---|
| 7-day activation rate | 55% | 62% | 68% |
| Month-1 retention | 62% | 68% | 72% |
| Month-3 retention | 48% | 55% | 60% |
| Month-12 retention | 26% | 34% | 40% |
| Students in —— 2 modules | 38% | 48% | 58% |
| Students in —— 3 modules | 22% | 32% | 42% |
| Sessions per active student per week | 4.2 | 5.1 | 5.8 |
| Median session duration | 18 min | 22 min | 24 min |
| AI assistant monthly usage rate | 40% | 55% | 65% |
| Profile completeness (median) | 68% | 76% | 82% |

### 43.3.3 Learning Metrics

| Metric | V1 | V2 | V3 |
|---|---|---|---|
| Coaching enrolments | 9,500 | 33,000 | 78,000 |
| Live class attendance rate | 62% | 68% | 72% |
| Mock test participation rate | 70% | 76% | 80% |
| Mean mock percentile improvement | +15 | +18 | +21 |
| Batch completion rate | 68% | 74% | 78% |
| Course enrolments | 34,000 | 145,000 | 420,000 |
| Course completion rate | 55% | 62% | 66% |
| Certificates issued | 28,000 | 145,000 | 480,000 |
| Doubt resolution median time | 8 hrs | 5 hrs | 3 hrs |
| Study plan adherence | 54% | 62% | 68% |

### 43.3.4 Outcome Metrics

| Metric | V1 | V2 | V3 |
|---|---|---|---|
| Confirmed admissions | 12,000 | 48,000 | 140,000 |
| Internships facilitated | 15,000 | 65,000 | 200,000 |
| Live projects completed | 0 | 3,900 | 22,000 |
| Placements confirmed | 5,000 | 25,000 | 80,000 |
| **Verified Outcomes (North Star)** | **32,000** | **138,000** | **420,000** |
| Placement rate (PRS —— 60 students) | 58% | 63% | 68% |
| Median time to placement | 105 days | 92 days | 78 days |
| Students with —— 1 verified project | 0 | 45,000 | 160,000 |
| Median first-salary premium vs. baseline | +8% | +14% | +20% |
| PPO conversion from internships | 14% | 17% | 20% |

### 43.3.5 Monetisation Metrics

| Metric | V1 | V2 | V3 |
|---|---|---|---|
| Paying students | 22,000 | 95,000 | 300,000 |
| Free —' paid conversion | 8.8% | 10.6% | 12.0% |
| ARPPU (annual) | —,—6,800 | —,—8,200 | —,—9,500 |
| Total revenue | —,—30 Cr | —,—128 Cr | —,—326 Cr |
| Recurring revenue | —,—6.9 Cr | —,—28 Cr | —,—67.5 Cr |
| Recurring share | 23% | 22% | 21% |
| B2B revenue share | 30% | 42% | 50% |
| Largest stream concentration | 29.3% | 23.8% | 25.2% |
| Gross margin | 52% | 62% | 68% |
| Operating margin | 0% | 8% | 22% |
| Blended CAC | —,—420 | —,—340 | —,—280 |
| LTV:CAC (paying student) | 1.04:1 | 2.85:1 | 6.38:1 |
| Payback period | 14 months | 8 months | 5 months |
| Refund rate | —— 7% | —— 6% | —— 5% |

### 43.3.6 Marketplace Health Metrics

| Metric | V1 | V2 | V3 |
|---|---|---|---|
| Applications per internship posting | 35 | 42 | 48 |
| Applications per job posting | 55 | 62 | 68 |
| Employer no-response rate | —— 12% | —— 8% | —— 5% |
| Application —' interview rate | 14% | 17% | 20% |
| Interview —' offer rate | 26% | 30% | 34% |
| Offer acceptance rate | 72% | 76% | 80% |
| Median time-to-hire | 22 days | 18 days | 15 days |
| Posting fill rate | 58% | 66% | 72% |
| Lead —' admission conversion | 6.7% | 8.2% | 9.5% |

### 43.3.7 Quality and Trust Metrics

| Metric | V1 | V2 | V3 |
|---|---|---|---|
| Student NPS | —— 45 | —— 62 | —— 70 |
| College CSAT | —— 4.2 | —— 4.4 | —— 4.5 |
| Employer CSAT | —— 4.2 | —— 4.4 | —— 4.5 |
| Candidate experience rating | —— 4.0 | —— 4.2 | —— 4.4 |
| Coaching rating | —— 4.2 | —— 4.4 | —— 4.5 |
| Course rating | —— 4.2 | —— 4.3 | —— 4.5 |
| Verified listings | 100% | 100% | 100% |
| Confirmed fraud per 10,000 transactions | —— 5 | —— 3 | —— 2 |
| Support first-response time | < 4 hrs | < 2 hrs | < 1 hr |
| Dispute resolution within SLA | 90% | 95% | 98% |
| Verification SLA compliance | 92% | 96% | 98% |

### 43.3.8 Technical Metrics

| Metric | V1 | V2 | V3 |
|---|---|---|---|
| Uptime | 99.9% | 99.95% | 99.97% |
| API P95 latency (read) | 350ms | 280ms | 220ms |
| LCP (P75) | 2.5s | 2.2s | 1.9s |
| Error rate | < 0.5% | < 0.3% | < 0.2% |
| Payment success rate | —— 94% | —— 95% | —— 96% |
| P1 incidents per quarter | —— 2 | —— 1 | —— 1 |
| Mean time to recovery | < 4 hrs | < 2 hrs | < 1 hr |
| Deployment frequency | Weekly | 2—- weekly | Daily |
| Change failure rate | < 12% | < 8% | < 5% |
| Infrastructure cost per MAU | —,—9 | —,—7 | —,—6 |

## 43.4 AI-Specific Metrics

| Metric | V1 | V2 | V3 |
|---|---|---|---|
| AI recommendation acceptance rate | 35% | 45% | 52% |
| Career recommendation agreement (top-3) | 62% | 68% | 74% |
| Assistant helpful-rating rate | 72% | 78% | 84% |
| Job match —' application rate (high match) | 26% | 32% | 38% |
| Job match —' interview rate (high match) | 18% | 22% | 27% |
| Resume ATS parse success | 94% | 96% | 98% |
| Daily insight action-click rate | 20% | 26% | 32% |
| Weakness remediation score lift | — | +8% | +12% |
| Fraud detection precision / recall | — | 85% / 78% | 91% / 86% |
| AI cost per MAU | —,—15 | —,—12 | —,—9 |

## 43.5 Metric Guardrails (Anti-Gaming)

Every primary metric is paired with a guardrail metric that must not degrade.

| Primary Metric | Guardrail | Rationale |
|---|---|---|
| Registered students | Activation rate | Prevents low-quality registration farming |
| Applications submitted | Application —' interview rate | Prevents spray-and-pray application behaviour |
| Course enrolments | Course completion rate | Prevents selling courses students never use |
| Revenue | Refund rate + NPS | Prevents aggressive sales at the cost of satisfaction |
| Job postings | Employer no-response rate | Prevents ghost posting inflation |
| Placements | 90-day retention of placed candidates | Prevents poor-fit placements |
| Verified outcomes | Dispute rate | Prevents fabricated outcome recording |
| Engagement time | Outcome progression rate | Prevents optimising for time-wasting |
| Coaching enrolments | Score improvement | Prevents selling coaching that does not work |
| AI usage | AI helpful-rating rate | Prevents forcing AI interactions that add no value |

**Requirement:** If any guardrail metric degrades by more than 15% relative to baseline, the associated growth initiative MUST be paused and reviewed.

## 43.6 Measurement Governance

| Practice | Specification |
|---|---|
| Metric definitions | Single registry; every metric has an owner and a versioned definition |
| Instrumentation review | Every feature ships with defined events and metrics; no feature ships uninstrumented |
| Data quality | Automated checks for volume anomalies, null rates and schema drift |
| Reporting cadence | Daily automated dashboard; weekly product review; monthly business review; quarterly board review |
| Target setting | Annual targets set at strategy offsite; quarterly re-baselining permitted with documented rationale |
| Experiment discipline | Feature changes affecting primary metrics require a controlled experiment where sample size permits |
| Cohort discipline | All retention and conversion metrics reported by cohort, never as blended aggregates |
| Segmentation | All primary metrics available segmented by geography, stage, tier and acquisition source |

## 43.7 Review Cadence

| Cadence | Forum | Attendees | Metrics Reviewed |
|---|---|---|---|
| Daily | Automated dashboard | All | Registrations, revenue, uptime, P1 incidents |
| Weekly | Product & Growth review | Product, Growth, Engineering leads | Growth, activation, engagement, experiment results |
| Bi-weekly | Ecosystem review | Product, Partnerships, Sales | Marketplace health, supply, liquidity |
| Monthly | Business review | Leadership | Full metric tree, unit economics, targets vs. actual |
| Quarterly | Board review | Board, Leadership | Strategic metrics, roadmap, financial performance |
| Annually | Strategy offsite | Leadership | Three-year targets, North Star validation |

---

# Chapter 44 — Risks

> **Purpose of this chapter:** To maintain a complete, honest risk register with likelihood, impact, mitigation, ownership, early warning indicators and contingency plans.

## 44.1 Risk Scoring Framework

| Likelihood | Definition |
|---|---|
| Very High (5) | Expected to occur |
| High (4) | Likely within 12 months |
| Medium (3) | Possible within 12 months |
| Low (2) | Unlikely but plausible |
| Very Low (1) | Remote |

| Impact | Definition |
|---|---|
| Critical (5) | Threatens business viability |
| High (4) | Materially damages targets or reputation |
| Medium (3) | Noticeable setback, recoverable |
| Low (2) | Minor, absorbed within normal operations |
| Very Low (1) | Negligible |

**Risk Score = Likelihood —- Impact.** Scores —— 15 require executive-level mitigation plans with named owners and monthly review.

## 44.2 Strategic Risks

| ID | Risk | L | I | Score | Mitigation | Owner | Early Warning |
|---|---|---|---|---|---|---|---|
| RS-1 | Well-funded incumbent replicates the integrated model | 4 | 4 | 16 | Integration depth and verified network take years to build; accelerate data moat; deepen employer payroll lock-in | CEO | Competitor hiring in adjacent domains; product announcements |
| RS-2 | Breadth perceived as shallowness; specialists win each vertical | 4 | 4 | 16 | Meet or exceed category-standard quality bars per module before launch; publish comparative outcome data | Product | Module-level ratings below category benchmarks |
| RS-3 | Two-sided cold start fails to reach liquidity | 3 | 5 | 15 | Geographic beachhead concentration; seed employer side through founder network; bundle payroll free with hiring | Growth | Applications per posting below 20; postings per student below threshold |
| RS-4 | Execution complexity causes quality dilution across modules | 4 | 4 | 16 | Strict V1 scope freeze; per-module quality gates; phased release | Product | Defect density rising; release dates slipping |
| RS-5 | Capital runway insufficient for multi-module build | 3 | 5 | 15 | Revenue from 8 streams in V1; V2/V3 capital-heavy items phased; monthly burn discipline | CEO | Burn multiple above plan; runway below 12 months |
| RS-6 | Category positioning fails to land; market does not understand the product | 3 | 4 | 12 | Clear tagline and path messaging; outcome-led proof; channel partner education | Growth | Low landing-page conversion; high bounce |
| RS-7 | International expansion premature and dilutive | 2 | 4 | 8 | Gated on India profitability and V3 readiness criteria | CEO | India metrics below plan at V3 gate |

## 44.3 Market and Commercial Risks

| ID | Risk | L | I | Score | Mitigation | Owner | Early Warning |
|---|---|---|---|---|---|---|---|
| RM-1 | Price war in coaching compresses margins | 4 | 4 | 16 | Compete on bundled outcome value; protect gross margin floor; shift mix to B2B | Growth | Conversion at list price falling; competitor pricing moves |
| RM-2 | Free-to-paid conversion below model | 3 | 5 | 15 | Improve activation; test pricing tiers; strengthen paywall value; EMI expansion | Product | Cohort conversion below 7% |
| RM-3 | Employer hiring downturn reduces hiring revenue | 3 | 4 | 12 | Diversified revenue; coaching and courses provide ballast; focus on internships in downturns | CEO | Job posting volume declining month over month |
| RM-4 | Tier 2/3 monetisation slower than modelled | 3 | 4 | 12 | Tiered pricing; channel partner economics; free tier value; EMI | Growth | Tier 2/3 paying share below 40% |
| RM-5 | College partnerships slower to close than planned | 3 | 4 | 12 | Pilot offers with defined success criteria; outcome case studies; channel partner introductions | Partnerships | Sales cycle exceeding 120 days |
| RM-6 | Payroll adoption slower than modelled | 3 | 3 | 9 | Bundle free payroll with hiring packages; migration assistance | Enterprise Sales | Hiring-to-payroll conversion below 40% |
| RM-7 | Study abroad market disruption (visa policy changes) | 3 | 3 | 9 | Multi-country portfolio reduces single-country exposure | Partnerships | Visa policy announcements; application volume shifts |
| RM-8 | Channel partner commission cost exceeds model | 3 | 3 | 9 | Tier discipline; monitor commission as % of revenue against 4% ceiling | Finance | Commission ratio above 4.5% |

## 44.4 Product and Technology Risks

| ID | Risk | L | I | Score | Mitigation | Owner | Early Warning |
|---|---|---|---|---|---|---|---|
| RP-1 | Content production for 18 tracks slips, delaying launch | 4 | 4 | 16 | Content starts Week 1 parallel to engineering; buy-vs-build decision per track at Week 8; partner-sourced content | Academic | Content coverage below plan at Week 8 |
| RP-2 | Live class platform reliability failures damage coaching trust | 3 | 5 | 15 | Dual-provider evaluation; recorded fallback; make-up session policy; SLA monitoring | Engineering | Session disruption rate above 2% |
| RP-3 | Load failure on exam result days or major mock tests | 3 | 5 | 15 | Load testing at 1.5—- peak; pre-scaling runbooks; staggered test start windows; queue-based processing | SRE | Load test failures; latency degradation under load |
| RP-4 | AI produces incorrect or harmful career guidance | 3 | 5 | 15 | Grounded retrieval; confidence thresholds; explainability; human escalation; distress detection | Data | AI complaint rate rising; low helpful-rating |
| RP-5 | Data breach exposing student personal data | 2 | 5 | 10 | Security-by-design; encryption; pen testing; least privilege; incident response plan | CTO | Security monitoring alerts; anomalous access patterns |
| RP-6 | Wallet or payment ledger integrity failure | 2 | 5 | 10 | Double-entry ledger; daily reconciliation; idempotency; dual approval | Engineering | Any reconciliation variance |
| RP-7 | Content piracy erodes coaching revenue | 4 | 3 | 12 | DRM, watermarking, session limits, anomaly detection, legal enforcement | Engineering | Piracy monitoring hits; abnormal download patterns |
| RP-8 | Third-party dependency outage (gateway, video, AI, cloud) | 3 | 4 | 12 | Multi-provider strategies; circuit breakers; documented degradation behaviour | SRE | Provider status alerts |
| RP-9 | Technical debt accumulates, slowing delivery | 3 | 3 | 9 | Coverage thresholds; complexity limits; quarterly debt allocation of 15% capacity | CTO | Velocity declining; change failure rate rising |
| RP-10 | Mobile app rejection or delay in app stores | 2 | 3 | 6 | Early submission; compliance review; responsive web fallback | Product | Review feedback during submission |

## 44.5 Operational Risks

| ID | Risk | L | I | Score | Mitigation | Owner | Early Warning |
|---|---|---|---|---|---|---|---|
| RO-1 | Verification operations do not scale, creating supply bottleneck | 4 | 4 | 16 | Progressive automation; risk-tiered verification depth; staffing plan tied to volume | Admin Ops | SLA breach rate rising |
| RO-2 | Fraudulent employer harms students, damaging trust irreparably | 3 | 5 | 15 | Mandatory verification; continuous monitoring; no-payment rule; rapid delisting; escalation channel | Admin Ops | Student fraud reports; unusual posting patterns |
| RO-3 | Channel partner misconduct (false promises to students) | 3 | 4 | 12 | Code of conduct; mandatory training certification; mystery shopping; delisting | Growth | Student complaint patterns by partner |
| RO-4 | Faculty quality inconsistency damages coaching reputation | 3 | 4 | 12 | Vetting, demo evaluation, trial batches, quarterly review, improvement plans | Academic | Faculty ratings below 4.0 |
| RO-5 | Support volume exceeds capacity | 3 | 3 | 9 | Self-service help centre; AI first-line support; staffing tied to user growth | Customer Success | First-response time exceeding SLA |
| RO-6 | Team scaling and attrition disrupt delivery | 3 | 4 | 12 | Front-loaded senior hiring; equity; culture investment; knowledge documentation | CTO | Attrition above 18%; time-to-fill above 60 days |
| RO-7 | Payout errors damage partner trust | 2 | 4 | 8 | Dual approval; reconciliation; automated computation; clear statements | Finance | Payout disputes rising |
| RO-8 | Internship stipend non-payment by employers | 3 | 4 | 12 | Employer accountability metrics; escalation channel; posting suspension; verification revocation | Admin Ops | Student escalations on payment |

## 44.6 Regulatory and Compliance Risks

| ID | Risk | L | I | Score | Mitigation | Owner | Early Warning |
|---|---|---|---|---|---|---|---|
| RC-1 | DPDP Act enforcement finds non-compliance | 2 | 5 | 10 | Compliance-by-design; consent management; grievance officer; annual review | Compliance | Regulatory consultations; audit findings |
| RC-2 | Coaching sector regulation restricts operations or pricing | 3 | 4 | 12 | Regulatory monitoring; diversified revenue; compliance-forward practices | Compliance | Draft regulations; industry consultations |
| RC-3 | Payroll statutory computation error creates employer liability | 2 | 5 | 10 | Versioned rule engine; compliance review; testing against known cases; professional indemnity insurance | Compliance | Statutory computation discrepancies |
| RC-4 | Advertising to minors regulation | 2 | 3 | 6 | No behavioural advertising to under-18s by design | Compliance | Regulatory guidance changes |
| RC-5 | GST or tax treatment reassessment | 2 | 3 | 6 | Professional tax advisory; conservative treatment; documented positions | Finance | Tax notices; advisory updates |
| RC-6 | Intermediary liability for user-generated content | 2 | 3 | 6 | Moderation; grievance officer; takedown process; compliance reporting | Compliance | Takedown notices |
| RC-7 | International data residency requirements on expansion | 2 | 3 | 6 | Architecture supports regional deployment from V2 | CTO | Market entry planning |

## 44.7 Financial Risks

| ID | Risk | L | I | Score | Mitigation | Owner |
|---|---|---|---|---|---|---|
| RF-1 | Revenue shortfall against plan | 3 | 5 | 15 | Monthly variance review; diversified streams; cost flexibility | CEO |
| RF-2 | CAC exceeds model, breaking unit economics | 3 | 4 | 12 | Channel and referral emphasis; organic SEO investment; paid spend discipline | Growth |
| RF-3 | Refund rate exceeds model | 3 | 3 | 9 | Pre-purchase clarity; per-product refund monitoring; quality intervention | Product |
| RF-4 | Infrastructure cost scales faster than revenue | 3 | 3 | 9 | Per-unit cost targets; caching; lifecycle policies; monthly cost review | SRE |
| RF-5 | Working capital strain from commission and payout timing | 2 | 3 | 6 | Hold periods aligned to refund windows; payout scheduling by tier | Finance |
| RF-6 | Chargeback and payment fraud losses | 2 | 3 | 6 | Fraud detection; gateway risk rules; evidence workflow | Finance |

## 44.8 Top Ten Risks by Score

| Rank | ID | Risk | Score |
|---|---|---|---|
| 1 | RS-1 | Incumbent replicates the integrated model | 16 |
| 2 | RS-2 | Breadth perceived as shallowness | 16 |
| 3 | RS-4 | Execution complexity dilutes quality | 16 |
| 4 | RM-1 | Price war compresses margins | 16 |
| 5 | RP-1 | Content production slips | 16 |
| 6 | RO-1 | Verification operations bottleneck | 16 |
| 7 | RS-3 | Two-sided cold start failure | 15 |
| 8 | RS-5 | Capital runway insufficient | 15 |
| 9 | RM-2 | Conversion below model | 15 |
| 10 | RP-2 | Live class reliability failures | 15 |

## 44.9 Contingency Plans

| Trigger | Contingency |
|---|---|
| Content production more than 4 weeks behind at Week 12 | Reduce launch to 10 tracks at full depth; add remaining tracks post-launch monthly |
| Free-to-paid conversion below 6% at Month 4 | Introduce a lower-priced entry tier; test aggressive first-purchase incentives; re-examine paywall placement |
| Applications per posting below 15 at Month 6 | Pause employer acquisition; concentrate all growth spend on student acquisition in beachhead states |
| Runway below 12 months | Freeze V2 capital-heavy modules; reduce content investment to top 6 tracks; focus on profitable revenue lines |
| P1 security incident | Activate incident response; notify per statute; engage external forensics; pause non-essential releases |
| Verification SLA breach exceeding 20% for 2 weeks | Emergency staffing; temporarily reduce verification depth for low-risk categories with retrospective review |
| Live class provider persistent failure | Activate secondary provider; issue service credits; publish transparent communication |
| Competitor launches a directly equivalent integrated product | Accelerate payroll and live projects; publish comparative outcome data; deepen college contracts |

## 44.10 Risk Governance

| Practice | Specification |
|---|---|
| Register ownership | Head of Product maintains the register; each risk has a named owner |
| Review cadence | Scores —— 15 reviewed monthly by leadership; all risks reviewed quarterly |
| New risk intake | Any team member may raise a risk; triaged within 5 business days |
| Escalation | Any risk scoring —— 20, or any materialised risk with critical impact, escalates to the board immediately |
| Closure | Risks closed only with documented evidence that the underlying condition no longer applies |

---

# Chapter 45 — Assumptions

> **Purpose of this chapter:** To make explicit every assumption underlying this PRD, so that when an assumption proves false, the affected plan can be identified and revised immediately rather than discovered through failure.

## 45.1 Assumption Framework

Each assumption is recorded with its confidence level, what depends on it, how it will be validated, and what happens if it is wrong.

| Confidence | Meaning |
|---|---|
| High | Strong supporting evidence; unlikely to be wrong |
| Medium | Reasonable basis; requires validation |
| Low | Working hypothesis; must be tested early |

## 45.2 Market Assumptions

| ID | Assumption | Confidence | Dependency | Validation | If Wrong |
|---|---|---|---|---|---|
| AM-1 | Indian students and parents are willing to consolidate onto a single platform | Medium | Entire product thesis | Track multi-module adoption; user research | Reposition as best-in-class single modules with soft cross-sell |
| AM-2 | Tier 2/3 students will pay for quality online coaching at 30-40% below metro prices | Medium | Coaching revenue model | V1 conversion data by tier | Adjust pricing tiers; increase free-tier value; lean on channel partners |
| AM-3 | Employers will value platform-verified credentials over self-declared claims | Medium | Verification moat, hiring revenue | Employer interviews; shortlist behaviour on verified vs. unverified | Emphasise assessment scores over credentials; deepen assessment products |
| AM-4 | Colleges will pay for admission leads and placement automation | High | College revenue, institutional network | Pilot conversion rates | Shift to pure per-admission commission with no upfront fee |
| AM-5 | Live projects will be accepted by employers as meaningful hiring signal | Low | Live Project ecosystem viability | Employer feedback; project-to-offer conversion | Reposition projects as learning products rather than hiring signal |
| AM-6 | SMB employers will adopt payroll bundled with hiring | Medium | Payroll SaaS, recurring revenue | V2 hiring-to-payroll conversion | Sell payroll standalone with dedicated GTM; or de-prioritise |
| AM-7 | Study abroad students will pay for transparency over relationships | Medium | Study Abroad revenue | V2 package conversion rates | Move to a lower-fee, higher-volume model relying on university commission |
| AM-8 | Channel partners will actively sell multiple product lines | Medium | Tier 2/3 distribution | Partner activity and multi-line conversion | Simplify to single-product partners; increase per-product commission |
| AM-9 | Demand for the 18 selected exam tracks remains stable | High | Coaching catalogue | Enrolment distribution by track | Reallocate content investment to high-demand tracks |
| AM-10 | The Indian education-to-employment market grows or remains stable | High | All revenue projections | Macro indicators; enrolment trends | Reduce growth targets; extend runway |

## 45.3 User Behaviour Assumptions

| ID | Assumption | Confidence | Validation | If Wrong |
|---|---|---|---|---|
| AU-1 | Students will complete an 80-minute career assessment | Medium | V1 completion rates | Shorten to a 35-minute core with optional depth |
| AU-2 | Students discovered in Class 11 will remain on the platform for multiple years | Low | Cohort retention over 24 months | Focus acquisition on higher-intent, nearer-to-monetisation stages |
| AU-3 | Students will trust AI recommendations when given explanations | Medium | AI acceptance rate | Increase human counsellor availability; reduce AI prominence |
| AU-4 | Mobile web is sufficient for V1 student engagement | Medium | Mobile engagement metrics vs. desktop | Accelerate native app development into V1.5 |
| AU-5 | Students will publish public portfolios | Medium | Portfolio publication rate | Make portfolios employer-visible by default (with consent) rather than public |
| AU-6 | Parents will approve digital payments for education | High | Payment success by student age band | Add parent-initiated payment links; offline payment options |
| AU-7 | Students will complete courses at a materially higher rate than MOOC benchmarks | Medium | Course completion rate vs. 10% MOOC benchmark | Restructure courses into shorter, higher-commitment formats |
| AU-8 | Students will accept notification volumes at planned frequency | Medium | Unsubscribe and complaint rates | Reduce frequency caps; shift to digest-first |
| AU-9 | Students prefer English content initially in target states | Medium | Language preference signals | Accelerate Tamil and Hindi into V1.5 |
| AU-10 | Employers will respond to applications within 14 days when prompted | Medium | No-response rate | Strengthen enforcement; auto-close postings from non-responsive employers |

## 45.4 Technical Assumptions

| ID | Assumption | Confidence | Validation | If Wrong |
|---|---|---|---|---|
| AT-1 | Next.js + NestJS + PostgreSQL will scale to V3 targets | High | Load testing at each version | Introduce read replicas, sharding, or selective service extraction |
| AT-2 | A single PostgreSQL primary with replicas suffices through V2 | Medium | Database load monitoring | Partition high-volume tables; consider separate stores for events |
| AT-3 | Third-party live video will meet reliability requirements at 8,000 concurrent | Medium | Load testing with provider | Dual-provider strategy; evaluate in-house infrastructure in V3 |
| AT-4 | AI inference costs remain at or below current levels | Medium | Monthly AI cost per MAU | Model routing to smaller models; stricter quotas; caching expansion |
| AT-5 | Cloudflare R2 egress economics remain favourable for video | Medium | Monthly storage and egress costs | Multi-CDN strategy; adaptive bitrate optimisation |
| AT-6 | Prisma ORM will not become a performance bottleneck | Medium | Query performance monitoring | Selective raw queries for hot paths |
| AT-7 | Responsive web can deliver an acceptable experience on 4GB Android devices | Medium | Device matrix testing | Aggressive bundle reduction; lightweight mode |
| AT-8 | Event pipeline can sustain 5,000 events/second in V1 | High | Load testing | Batching, sampling for non-critical events |
| AT-9 | Vercel and Railway suffice for V1/V2; AWS needed only at V3 scale | Medium | Cost and performance monitoring | Earlier migration to AWS |
| AT-10 | 15-minute warehouse latency is acceptable for all analytics use cases | High | User feedback on dashboards | Introduce a real-time serving layer for selected metrics |

## 45.5 Operational Assumptions

| ID | Assumption | Confidence | Validation | If Wrong |
|---|---|---|---|---|
| AO-1 | Institution verification can be completed within 3 business days at volume | Medium | SLA compliance tracking | Increase staffing; automate document checks; tier verification depth |
| AO-2 | Training institute partners will supply 60% of course content | Medium | Partner content pipeline | Increase first-party content investment |
| AO-3 | Faculty can be recruited at planned quality and cost | Medium | Recruitment funnel and quality metrics | Increase compensation; partner with existing coaching institutes |
| AO-4 | Mentors can be recruited at 140 by V2 | Low | Recruitment pipeline | Reduce concurrent projects per mentor; increase compensation; limit project volume |
| AO-5 | Support can be delivered at planned staffing ratios with AI assistance | Medium | Ticket volume per user; resolution times | Increase staffing; expand self-service |
| AO-6 | Content review can keep pace with partner submission volume | Medium | Review SLA compliance | Increase reviewer capacity; tier review depth by partner track record |
| AO-7 | Channel partners can be recruited at 1,200 in Y1 | Medium | Recruitment funnel | Increase commission rates; expand recruitment channels |
| AO-8 | Payment gateway settlement timelines remain at T+2 | High | Settlement monitoring | Adjust working capital planning |

## 45.6 Financial Assumptions

| ID | Assumption | Confidence | Validation | If Wrong |
|---|---|---|---|---|
| AF-1 | Blended CAC of —,—420 in Y1 is achievable | Medium | Monthly CAC tracking | Shift mix further toward organic and channel |
| AF-2 | Free-to-paid conversion of 8.8% in Y1 | Medium | Cohort conversion tracking | Revise revenue projections; adjust pricing |
| AF-3 | Gross margin of 52% in Y1 | Medium | Monthly margin analysis | Renegotiate partner revenue share; reduce delivery costs |
| AF-4 | Refund rate below 7% | Medium | Weekly refund monitoring | Improve pre-purchase clarity; address quality issues |
| AF-5 | Channel commission stays below 4% of revenue | Medium | Monthly commission ratio | Tier discipline; rate adjustment |
| AF-6 | Payment success rate of 94% | High | Daily monitoring | Add payment methods; improve retry logic |
| AF-7 | Average coaching ticket of —,—18,500 | Medium | Actual ticket distribution | Adjust pricing mix; revise revenue model |
| AF-8 | College retention of 85% annually | Medium | Renewal tracking | Increase success management; improve demonstrated ROI |
| AF-9 | Sufficient capital is available to fund the V1-V2 plan | Medium | Fundraising progress | Reduce scope; extend timeline; prioritise profitable lines |
| AF-10 | Infrastructure cost of —,—9 per MAU in Y1 | Medium | Monthly cost per MAU | Optimise caching, storage lifecycle, compute sizing |

## 45.7 Regulatory Assumptions

| ID | Assumption | Confidence | Validation | If Wrong |
|---|---|---|---|---|
| AR-1 | DPDP Act requirements are as currently understood | Medium | Legal review; regulatory guidance | Compliance programme adjustment |
| AR-2 | No new coaching sector regulation materially restricts online delivery | Medium | Regulatory monitoring | Adapt delivery model; diversify revenue |
| AR-3 | Payroll statutory rules change predictably with adequate notice | High | Compliance monitoring | Versioned rule engine absorbs changes |
| AR-4 | Current GST treatment of education services continues | Medium | Tax advisory | Reprice to absorb or pass through |
| AR-5 | Intermediary safe harbour continues to apply to marketplace listings | Medium | Legal monitoring | Increase pre-publication moderation |
| AR-6 | Under-18 users can be served with parental consent mechanisms | High | Legal review | Restrict certain features to 18+ |

## 45.8 Assumption Validation Plan

| Phase | Assumptions to Validate | Method |
|---|---|---|
| Pre-V1 (Weeks 1-12) | AM-4, AM-9, AO-1, AO-3, AR-1, AR-6 | Partner pilots, legal review, recruitment pipeline |
| V1 Launch (Months 1-3) | AU-1, AU-4, AU-6, AF-6, AT-3, AT-7 | Live product metrics |
| V1 Steady (Months 3-9) | AM-1, AM-2, AM-3, AU-2, AU-3, AU-7, AF-1, AF-2, AF-3 | Cohort analysis, conversion tracking |
| V2 Development (Months 9-14) | AM-5, AM-6, AM-7, AM-8, AO-2, AO-4 | Pilot programmes, partner pipelines |
| V2 Launch (Months 14-20) | AF-8, AT-2, AT-4, AO-5 | Live metrics at scale |
| V3 Planning (Months 20+) | AT-1, AT-9, AM-10, AR-7 | Capacity planning, market analysis |

**Governance requirement:** Every assumption MUST be reviewed quarterly. Any assumption proven false MUST trigger a documented plan revision within 10 business days, identifying every dependent element of the plan and the corrective action.

---

# Chapter 46 — Future Enhancements

> **Purpose of this chapter:** To capture the enhancement backlog beyond V3 — ideas that are strategically interesting but not yet committed — so that they are recorded rather than lost, and so that architectural decisions today do not foreclose them.

## 46.1 Enhancement Categories

| Category | Description |
|---|---|
| **Deepening** | Making existing modules substantially more capable |
| **Broadening** | Adding adjacent modules within the education-to-employment scope |
| **Platform** | Making Ellowring infrastructure that others build upon |
| **Intelligence** | Applying accumulated data in more sophisticated ways |
| **Access** | Reaching users currently excluded by language, ability, connectivity or cost |
| **Ecosystem** | Deepening the value exchange between the six actors |

## 46.2 Deepening Enhancements

| # | Enhancement | Description | Value | Complexity |
|---|---|---|---|---|
| D-1 | Item-response-theory adaptive testing | Assessments that converge on true ability in fewer questions | Shorter, more accurate tests | High |
| D-2 | Automated video lecture summarisation | AI-generated summaries, key points and quiz questions from every lecture | Faster revision; content leverage | Medium |
| D-3 | Handwriting recognition for answer evaluation | Evaluate handwritten answers for descriptive exams (UPSC Mains, TNPSC) | Unlocks descriptive exam coaching | High |
| D-4 | Live doubt sessions with screen sharing | Real-time one-to-one doubt resolution | Higher-value premium tier | Medium |
| D-5 | Simulated exam-day environment | Full exam-hall simulation including timing, breaks and pressure conditions | Better exam readiness | Medium |
| D-6 | Peer study groups with accountability | Matched study cohorts with shared goals and mutual accountability | Retention improvement | Medium |
| D-7 | Micro-credentials and stackable certificates | Fine-grained credentials that stack into larger qualifications | Employer granularity; NEP alignment | Medium |
| D-8 | Employer-designed curriculum | Courses co-designed and endorsed by specific employers with hiring commitment | Direct hiring linkage | Medium |
| D-9 | Simulation-based assessment | Job-realistic simulations replacing MCQ assessments | Better predictive validity | High |
| D-10 | Longitudinal career coaching | Ongoing human coaching relationship across years, not one-off sessions | Premium revenue; retention | Medium |

## 46.3 Broadening Enhancements

| # | Enhancement | Description | Value | Complexity |
|---|---|---|---|---|
| B-1 | Vocational and skilled-trades track | ITI, polytechnic and skilled-trades pathways with employer linkage | Large underserved segment | Medium |
| B-2 | Postgraduate and research pathway | GATE, CAT, NET preparation and PG admission support | Extends the lifecycle upward | Medium |
| B-3 | Entrepreneurship pathway | For students choosing venture creation over employment | Alternative outcome path | Medium |
| B-4 | Gig and freelance marketplace | Short-term paid work for students building experience | Income for students; flexible supply for employers | High |
| B-5 | Alumni network and mentorship | Structured alumni-to-student mentorship at scale | Retention; advocacy; outcomes | Medium |
| B-6 | Continuing professional education | Upskilling for the platform's own alumni in employment | Lifetime relationship | Medium |
| B-7 | School partnership programme | Deep integration with schools for Class 9-12 career readiness | Earlier funnel entry | Medium |
| B-8 | Teacher and faculty development | Professional development for educators on the platform | New B2B segment | Medium |
| B-9 | Government skilling programme delivery | Delivering publicly-funded skilling schemes | Large volume; policy alignment | High |
| B-10 | Corporate campus programme management | Managing employers' entire early-career programmes | Deep enterprise lock-in | High |

## 46.4 Platform Enhancements

| # | Enhancement | Description | Value | Complexity |
|---|---|---|---|---|
| P-1 | Full public API with marketplace | Third parties build products on Ellowring data with consent | Ecosystem leverage | High |
| P-2 | White-label institutional deployment | Colleges run a branded Ellowring instance | Enterprise revenue | High |
| P-3 | Embeddable widgets | Job boards, course catalogues and verification embeddable on partner sites | Distribution | Low |
| P-4 | Open credential standard | Interoperable, portable credential format adopted across institutions | Category leadership | High |
| P-5 | Data clean room | Privacy-preserving analytics collaboration with institutions and employers | New data products | High |
| P-6 | Plugin architecture | Third-party modules extending dashboards | Ecosystem velocity | High |
| P-7 | Multi-region data residency | Full regional data isolation for international markets | International expansion enabler | High |

## 46.5 Intelligence Enhancements

| # | Enhancement | Description | Value | Complexity |
|---|---|---|---|---|
| I-1 | Causal outcome modelling | Move from correlation to causal inference on what actually improves outcomes | Genuinely better recommendations | Very High |
| I-2 | Personalised content generation | AI-generated practice questions and explanations tuned to the individual | Infinite personalised practice | High |
| I-3 | Real-time labour market intelligence | Live skill demand signals from across the employer network and external sources | Curriculum and student guidance accuracy | Medium |
| I-4 | Employer-candidate fit prediction | Predicting retention and performance, not just hiring probability | Better placement quality | High |
| I-5 | Intervention optimisation | Learning which interventions work for which student segments | Operational efficiency | High |
| I-6 | Automated content quality scoring | AI evaluation of content effectiveness from learner outcome data | Content investment efficiency | Medium |
| I-7 | Conversational tutoring | AI that teaches, not just answers, with Socratic method | Scalable one-to-one teaching | Very High |
| I-8 | Emotion and motivation modelling | Detecting disengagement and demotivation early from behavioural signals | Retention | High |

## 46.6 Access Enhancements

| # | Enhancement | Description | Value | Complexity |
|---|---|---|---|---|
| A-1 | Full offline mode | Complete offline learning with background sync | Rural and low-connectivity access | High |
| A-2 | Feature phone / IVR access | Voice-based access for students without smartphones | Deepest-tier access | High |
| A-3 | 15+ Indian languages | Full content and UI localisation | National accessibility | High |
| A-4 | Sign language content | Interpreted content for hearing-impaired students | Inclusion | Medium |
| A-5 | Screen-reader optimised learning | Fully accessible learning experience for visually impaired students | Inclusion | Medium |
| A-6 | Income-share agreements | Pay-after-placement financing | Removes upfront cost barrier | High |
| A-7 | Sponsored seats programme | CSR-funded seats for underprivileged students | Access + CSR revenue | Medium |
| A-8 | Community learning centres | Physical access points in low-connectivity areas via partners | Last-mile access | High |
| A-9 | Low-data mode | Text-first, audio-only experience under 5MB per hour | Data-cost accessibility | Medium |

## 46.7 Ecosystem Enhancements

| # | Enhancement | Description | Value | Complexity |
|---|---|---|---|---|
| E-1 | Cross-institutional credit transfer | NEP-aligned credit portability between institutions | Policy alignment; student mobility | High |
| E-2 | Employer consortium hiring | Groups of employers running joint hiring processes | Efficiency for SMBs | Medium |
| E-3 | College-to-college benchmarking network | Opt-in performance benchmarking community | Institutional value | Medium |
| E-4 | Student union and governance | Student representation in platform policy decisions | Trust and legitimacy | Low |
| E-5 | Outcome-linked institutional pricing | Colleges pay based on placement outcomes achieved | Aligned incentives | Medium |
| E-6 | Verified reference network | Structured, verified references from mentors and supervisors | Hiring signal depth | Medium |
| E-7 | Skills passport | Portable, standards-based record of all verified capability | Category-defining asset | High |

## 46.8 Prioritisation Framework for Future Enhancements

Enhancements will be prioritised against four criteria, each scored 1-5:

| Criterion | Question |
|---|---|
| **Outcome impact** | How much does this improve verified outcomes delivered? |
| **Strategic defensibility** | How much does this strengthen the moat? |
| **Revenue potential** | What is the realistic annual revenue contribution? |
| **Feasibility** | Can we build and operate this well with the team and data we will have? |

**Priority score = (Outcome —- 2) + (Defensibility —- 1.5) + (Revenue —- 1.5) + Feasibility.**

Enhancements scoring above 24 enter the committed roadmap; 18-24 remain candidates; below 18 are archived with rationale.

## 46.9 Architectural Implications

The following architectural decisions are taken now specifically to keep future enhancements open:

| Decision | Enables |
|---|---|
| Externalised strings and i18n-ready content model from V1 | A-3 (15+ languages) |
| Event-driven cross-module communication | P-1 (public API), P-6 (plugins) |
| Skill taxonomy as a first-class entity | I-3 (market intelligence), E-7 (skills passport) |
| Certificate model with standards-compatible fields | P-4 (open credential standard) |
| Multi-currency-capable money model from V1 | International expansion |
| Tenant-scoped data model with configurable branding | P-2 (white-label) |
| Content model separating structure from media | A-1 (offline), A-9 (low-data mode) |
| Immutable event log with full outcome linkage | I-1 (causal modelling) |
| Region-aware infrastructure abstractions | P-7 (data residency) |

---

# Chapter 47 — Conclusion

> **Purpose of this chapter:** To restate the case for Ellowring, summarise what this document commits the organisation to, and define what happens next.

## 47.1 What This Document Establishes

This Product Requirements Document specifies Ellowring in complete detail across forty-seven chapters: the market and the problem, the six actors and their journeys, the nine ecosystems and sixteen modules, the information architecture for a public site and six dashboards, the intelligence layer, the financial infrastructure, the security posture, the measurement framework, and a three-version delivery plan with explicit scope boundaries.

It is intended to be sufficient for a designer to design from, an architect to architect from, an engineer to build from, a QA engineer to test from, and an investor to evaluate from — without needing to ask what was meant.

## 47.2 The Case, Restated

India's education-to-employment transition is broken not because any single component is missing, but because **nothing connects**. A student assembles their path from a dozen disconnected systems, each of which forgets them the moment they leave. The consequences compound across eight years: wrong streams, wasted coaching, poor college choices, irrelevant skills, empty resumes, and first jobs far below potential.

Ellowring's answer is not a better exam-prep app or a better job board. It is a **continuous spine** — one identity, one profile, one accumulating record — running from Class 11 to the first salary slip, with every module feeding every other module, and with the employer's own hiring and payroll running on the same platform so that the loop closes and the data returns.

The strategic consequences of that architecture are:

| Consequence | Why It Matters |
|---|---|
| **Every module makes every other module smarter** | Competitors optimising a single node cannot match recommendations informed by eight years of verified data |
| **Verification becomes a network asset** | A verified credential is worth more when a large employer network already trusts it |
| **Revenue is diversified by construction** | Thirteen streams across B2C and B2B, with no line exceeding 35% |
| **Defensibility compounds rather than depreciates** | The longitudinal data graph cannot be bought, only accumulated |
| **The mission and the business model are aligned** | The North Star is verified outcomes, and every outcome is monetised |

## 47.3 What Is Being Committed To

| Commitment | Specification |
|---|---|
| **Scope** | 189 features across 16 modules, 6 roles, 9 ecosystems |
| **V1** | 111 features in 26 weeks, proving the spine across 6 monetised modules in 2 states |
| **V2** | 73 features in 8 further months, adding Live Projects, Study Abroad, Payroll, full ATS, and 4 more dashboards |
| **V3** | National scale, 2 international markets, public API, predictive intelligence |
| **Quality** | 99.9% uptime, WCAG 2.1 AA, zero critical vulnerabilities, 75%+ test coverage |
| **Trust** | 100% verified supply, transparent pricing, publicly verifiable credentials, DPDP compliance |
| **Outcomes** | 32,000 verified outcomes in Year 1; 420,000 by Year 3 |
| **Business** | —,—30 Cr Year 1 revenue; —,—326 Cr and 22% operating margin by Year 3 |

## 47.4 The Non-Negotiables

Six commitments in this document are treated as constraints rather than goals. They may not be traded away for speed, cost or growth:

| # | Non-Negotiable |
|---|---|
| 1 | **No unverified supply.** No college, employer, internship or job appears publicly without completed verification. |
| 2 | **No hidden pricing.** Every fee, tax and refund term is disclosed before payment. |
| 3 | **No data sale.** Personal data is never sold or licensed; sharing requires explicit, purpose-specific consent. |
| 4 | **No unprovable claims.** Statistics are labelled by source; outcomes are never guaranteed except where a refund-backed commitment is explicitly defined. |
| 5 | **No dark patterns.** Cancellation is as easy as purchase; consent is as easy to withdraw as to give. |
| 6 | **No financial ambiguity.** The ledger balances daily, reconciles to the rupee, and every movement is traceable. |

These exist because Ellowring's entire strategy rests on being the most trusted platform in a category where trust is scarce. A single breach of these constraints costs more than any feature is worth.

## 47.5 What Determines Success

Success will not be determined by feature count, funding raised, or registered users. It will be determined by whether a specific sentence becomes true for a large number of people:

> *"I found my direction on Ellowring in Class 11, prepared for my exam there, chose my college there, learned my skills there, built my projects there, did my internship there, got my job there — and my employer pays my salary through the same platform."*

Every chapter in this document exists to make that sentence possible, verifiable, and repeatable at scale.

## 47.6 Immediate Next Steps

| # | Action | Owner | Timeline |
|---|---|---|---|
| 1 | Circulate this PRD for formal sign-off per the approval matrix | Head of Product | Week 0 |
| 2 | Produce detailed UX wireframes for all V1 screens | Head of Design | Weeks 1-8 |
| 3 | Finalise technical architecture document and data model | CTO | Weeks 1-4 |
| 4 | Establish repositories, CI/CD, environments and observability | DevOps | Weeks 1-3 |
| 5 | Begin content production for the 6 priority exam tracks | Head of Academics | Week 1 |
| 6 | Begin college data compilation and verification for 2 beachhead states | Partnerships | Week 1 |
| 7 | Initiate payment gateway, DLT and WhatsApp onboarding | Finance + Product | Week 2 |
| 8 | Complete senior engineering hiring | CTO | Weeks 1-6 |
| 9 | Begin employer network seeding for launch supply | Enterprise Sales | Week 2 |
| 10 | Establish the metric registry and instrumentation standards | Data | Weeks 2-4 |
| 11 | Complete legal review of all policies and DPDP compliance design | Compliance | Weeks 1-6 |
| 12 | Stand up the verification operations team and process | Admin Ops | Weeks 4-8 |

## 47.7 Document Governance

| Aspect | Specification |
|---|---|
| **Status** | This document, version 1.0, is the approved scope baseline for the Ellowring platform |
| **Ownership** | Head of Product is the document owner and sole authority for changes |
| **Change control** | Any change to committed scope requires an equal-effort removal or an approved timeline extension, per §38.6 |
| **Review cadence** | Reviewed at each version boundary (pre-V2, pre-V3) and whenever a Chapter 45 assumption is proven false |
| **Supersession** | Version 1.1 and beyond will supersede this document; superseded versions are archived, not deleted |
| **Related documents** | Technical Architecture Document, Data Model Specification, Design System Documentation, API Specification, Test Strategy, Content Production Plan, Go-To-Market Plan |

## 47.8 Closing Statement

Ellowring is not attempting to build a better version of something that already exists. It is attempting to build the connective layer that the Indian education-to-employment market has never had — and to build it with enough rigour, verification and transparency that students, parents, colleges and employers can all rely on it simultaneously.

That is a hard thing to build. It requires nine vertically complete ecosystems, six distinct user experiences, thirteen revenue lines, three go-to-market motions, and an intelligence layer that earns trust rather than assuming it. This document specifies all of it.

The measure of whether it worked will not be found in this document. It will be found, three years from now, in the number of students who can point to a first job and trace an unbroken line back to a career assessment they took at sixteen.

**Learn. Prepare. Build. Get Hired.**

---

*End of Document — Ellowring Product Requirements Document, Version 1.0, August 2026. Ellowring Software Solutions. Internal / Confidential.*

---

### Addendum A - Student Dashboard UI Canon (Version 1.1)

| Field | Value |
|---|---|
| Reference artwork | `docs/assets/student-dashboard-reference.png` |
| Normative chapter | Chapter 20.2 (CANONICAL) |
| V1 rule | Student Dashboard home and shell MUST pass visual QA against the reference PNG |
| Primary colour | `#3B82F6` |
| Change control | Deviation requires Head of Design + Head of Product written approval |

**Engineering note (Aug 2026):** Frontend Student Dashboard implementation has been aligned to this reference (`/dashboard/student`).
