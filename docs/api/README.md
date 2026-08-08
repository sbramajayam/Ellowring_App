# Ellowring API Documentation Pack (Phase 5)

**Product:** Ellowring (Ellowring Software Solutions)  
**Style:** REST JSON · NestJS · JWT + OTP + Google OAuth  
**Status:** Phase-5 design contract (Version 1.0)

## Artefacts

| Artefact | Path |
|---|---|
| Enterprise API Design (25 sections + catalogues) | [`../Ellowring_API_Design.md`](../Ellowring_API_Design.md) |
| OpenAPI 3.0 (Swagger) | [`openapi.yaml`](./openapi.yaml) |
| Generator | [`../scripts/generate-api-catalogue.js`](../scripts/generate-api-catalogue.js) |
| Phase-4 Database Design | [`../Ellowring_Database_Design.md`](../Ellowring_Database_Design.md) |

## Quick facts

| Item | Value |
|---|---|
| Base path | `/api/v1` |
| Local | `http://localhost:4000/api/v1` |
| Documented endpoints | **193** |
| Success envelope | `{ success, data, meta }` |
| Error envelope | `{ success: false, error: { code, message, details?, requestId, timestamp } }` |
| Auth header | `Authorization: Bearer <accessToken>` |
| Enterprise | `X-API-Key` |

## Modules covered

Authentication · Student · College · HR/Company · Training · Channel Partner · Admin · Payment · Notification · File Management · Analytics · Catalogue/Platform · Enterprise

## Regenerate OpenAPI + Appendix A

```bash
node docs/scripts/generate-api-catalogue.js
```

## Consume OpenAPI

- Swagger UI / Redoc / Stoplight  
- Postman: Import → `docs/api/openapi.yaml`  
- NestJS Phase-5: serve at `/api/docs` via `@nestjs/swagger`

## Implementation note

Current runtime demo still uses unversioned `/api/*` (~52 endpoints). Phase-5 is the **target contract**. See Appendix E in the design document for the gap list.
