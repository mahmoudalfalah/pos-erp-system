# Domain Contracts, Mappers & Validators

## Domain Types & DTOs

- **Domain types (`types/<entity>.type.ts`):** Types representing domain models with no DB-only metadata (e.g., `deletedAt`). Do not leak Prisma entity types into the domain **unless** strictly required for that specific part.
- **DTOs (`dtos/<entity>.dto.ts`):** The client-facing shape of an entity. Must be strictly decoupled from domain types and Prisma models—never derive them via `extends`, `Pick`, or `Omit`.

## Mappers (`mappers/<entity>.mapper.ts`)

- **Explicit field mapping:** Map every field manually in `toDomain`, `toDto`, `toPrismaCreate`, and `toPrismaUpdate`—**never** use the `...` spread operator.
- **Decoupled methods:** Keep mapper functions completely independent of each other even when most fields match (e.g., `toDto` must not call `toDomain`).
- **Update safety:** In `toPrismaUpdate`, preserve `undefined` for omitted fields so existing DB columns are not overwritten with `null`.

## Validators (`validators/<operation>-<entity>.validator.ts`)

- Export both the Zod schema and a `Result`-returning helper function (`validate<Operation><Entity>Input`), using error codes from `src/types/error.type.ts`.
- Reuse shared primitive validators from `src/validators/` (e.g., `id.validator.ts`) when needed instead of redefining them per feature.
