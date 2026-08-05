# Ellowring — Module Gap Checklist (vs SRS)

**Date:** August 2026  
**Sources:** `docs/Ellowring_SRS.md` Appendix A/B, codebase audit  
**Status legend:** EXISTS · SHELL · MISSING · IN PROGRESS

---

## Public website

| Page | Status | Notes |
|---|---|---|
| Home (marketing) | MISSING | Root `/` is app login |
| About | EXISTS | |
| Coaching | EXISTS | API-backed |
| Career Guidance | EXISTS | |
| Colleges | EXISTS | |
| Study Abroad | EXISTS | |
| Courses | EXISTS | |
| Internships | EXISTS | |
| Projects | EXISTS | |
| Jobs | EXISTS | |
| Partner With Us | EXISTS | |
| Contact | SHELL | Form not wired |

---

## Student

| Module | UI | API | Notes |
|---|---|---|---|
| Dashboard | EXISTS | Partial | Canon UI |
| AI Career Assistant | EXISTS | Partial | Chat UI + suggest endpoint; now in nav |
| Career Guidance | SHELL | Partial | |
| Coaching | SHELL | EXISTS | |
| Mock Tests | EXISTS (list) | MISSING | Engine TBD |
| Previous Year Papers | EXISTS (catalog) | MISSING | Route + UI shipped |
| Admissions | SHELL | EXISTS | |
| Study Abroad | EXISTS | EXISTS | |
| Courses | SHELL | EXISTS | |
| Internships | SHELL | EXISTS | |
| Projects | EXISTS | EXISTS | |
| Jobs | SHELL | EXISTS | |
| Certificates | SHELL | Partial | |
| Wallet | EXISTS | EXISTS | |
| Notifications | EXISTS | EXISTS | |
| Profile | SHELL | Partial | |
| Messages | SHELL | MISSING | |
| Settings | SHELL | MISSING | |

---

## College / HR / Training / Partner / Admin

Most routes = **SHELL** UI. Backend ownership mostly **MISSING** except shared Jobs/Internships/Applications/Payroll stubs and Admin users/overview.

See SRS Appendix B for Top 15 build order.

---

## Shipped in this SRS pass

1. `docs/Ellowring_SRS.md` — full 69-chapter SRS  
2. Student nav aligned to SRS (AI Assistant + Previous Year Papers)  
3. `/dashboard/student/ai-assistant` — interactive chat UI  
4. `/dashboard/student/previous-papers` — searchable PYQ catalog  
5. Mock Tests list UI upgraded  

---

## Next build slice (recommended)

1. Marketing Home separate from login  
2. Wire Courses / Coaching / Jobs student dashboards to APIs  
3. Mock test engine (backend + attempt flow)  
4. College admissions backend  
5. Partner commission wallet APIs  
