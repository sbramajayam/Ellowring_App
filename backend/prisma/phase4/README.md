# Ellowring Phase-4 — Database Implementation Pack

**Learn. Prepare. Build. Get Hired.**

This folder contains the implementable PostgreSQL database design for Phase-4.

| Artefact | Purpose |
|---|---|
| [`schema.prisma`](./schema.prisma) | Complete Prisma schema (122 models) — PostgreSQL |
| [`SEED_STRATEGY.md`](./SEED_STRATEGY.md) | Seed order + demo accounts |
| [`../../docs/Ellowring_Database_Design.md`](../../docs/Ellowring_Database_Design.md) | Full enterprise database design document (27 chapters + table catalogue) |

## Activate (local)

```bash
# From repo root
docker compose -f docker-compose.phase3.yml up -d

# backend/.env
# DATABASE_URL="postgresql://ellowring:ellowring@localhost:5432/ellowring?schema=public"
# REDIS_URL="redis://localhost:6379"

cd backend
# Windows:
copy /Y prisma\phase4\schema.prisma prisma\schema.prisma
# macOS/Linux:
# cp prisma/phase4/schema.prisma prisma/schema.prisma

npx prisma migrate dev --name phase4_init
npx prisma generate
```

> **Note:** Replacing the root `schema.prisma` switches the API from the SQLite demo schema to the full Phase-4 model. Nest module code must be updated to match renamed models (e.g. `LiveProject` → `Project`) as part of Phase-4 application work.

## Demo logins (after seed)

All passwords: `password123`

- `student@ellowring.com`
- `college@ellowring.com`
- `hr@ellowring.com`
- `training@ellowring.com`
- `partner@ellowring.com`
- `admin@ellowring.com`
