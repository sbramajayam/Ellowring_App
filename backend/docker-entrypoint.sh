#!/bin/sh
set -e
mkdir -p /app/data
npx prisma db push
npx ts-node --transpile-only prisma/seed.ts || true
exec node dist/src/main.js
