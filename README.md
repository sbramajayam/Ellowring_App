# Ellowring

> **Live website (GitHub Pages):** set **Settings → Pages → Branch = `gh-pages` / (root)**.  
> If Pages is set to `main`, you will only see this README — not the app UI.  
> Site URL after correct setting: https://sbramajayam.github.io/Ellowring_App/

**Learn. Prepare. Build. Get Hired.**

From 11th Standard to First Job — India's AI-powered Education, Career & Hiring ecosystem.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | NestJS, JWT, OTP, RBAC |
| Database | SQLite (local) via Prisma — schema ready for PostgreSQL |
| Auth | JWT + OTP (demo OTP `123456`) |

## Quick start (local)

```bash
# 1) Backend DB + seed
cd backend
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed

# 2) API (port 4001)
npm run start:dev

# 3) Frontend (port 3000) — new terminal
cd ../frontend
npm install
npm run dev
```

Open frontend at [http://localhost:3000](http://localhost:3000). API runs on port **4001**.

## Demo accounts

Password for all: `password123`

| Role | Email |
|------|-------|
| Student | student@ellowring.com |
| College | college@ellowring.com |
| HR / Company | hr@ellowring.com |
| Training | training@ellowring.com |
| Channel Partner | partner@ellowring.com |
| Admin | admin@ellowring.com |

Demo coupons: `ELLO500`, `FIRSTJOB`, `PARTNER12`

## Product roles

1. Student  
2. College  
3. HR / Company  
4. Training Partner  
5. Channel Partner  
6. Admin  

## V1 modules included

- Public site (Home, Coaching, Career, Colleges, Study Abroad, Courses, Internships, Projects, Jobs, Partner, Contact)
- Auth (Login, Register, OTP)
- Dashboards for all 6 roles
- APIs for courses, coaching, jobs, internships, projects, career (AI suggest), admissions, study abroad, wallet/coupons, notifications, applications, admin
- Seeded local database

## Vision

Build India's most trusted Education, Career & Hiring Ecosystem by connecting Students, Colleges, Companies, Training Partners and Channel Partners through one AI-powered platform.
