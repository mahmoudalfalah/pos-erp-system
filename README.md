# POS & ERP System

A web-based Point of Sale and ERP system for managing sales, inventory, and staff.

> **Status: early development.** Not usable yet. Expect breaking changes.

## Stack

Next.js, React, Tailwind CSS, shadcn/ui, PostgreSQL, Prisma, Zod, Vitest, Docker, pnpm

## Getting Started

```bash
# start the database
docker compose up -d

# install and run
pnpm install
pnpm run dev
```

Create a `.env` file with your `DATABASE_URL` first. Run `pnpm prisma migrate dev` to apply the schema.

## Structure

```text
prisma/               schema and migrations
src/app/              pages and routes
src/components/       UI components
src/lib/              utilities and Prisma client
docker-compose.yml    database container
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the Git workflow and commit conventions.
