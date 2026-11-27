# Read Operations: Queries & Query Builders

Read operations bypass Server Actions and Services, using `.query.ts` files paired with a `.builder.ts` when dynamic filtering, sorting, or pagination is needed (`<description>.query.ts` and `<description>.builder.ts`).

## Unified Result & Error Contract

- All queries must return the global `Result` type (`src/types/result.type.ts`), constructed strictly via `ok()` and `fail()`.
- All error codes must come from `src/types/error.type.ts`. Failed validation or authorization results are propagated directly as-is without re-wrapping.

## Queries (`queries/<entity>-<operation>.query.ts`)

- **Server boundary:** Must start with `import 'server-only';`.
- **Input:** Raw query parameters typed as `unknown`.
- **Output:** `Promise<Result<EntityDto>>` or `Promise<Result<PaginatedResult<EntityDto>>>` (using `PaginatedResult` from `src/types/pagination.type.ts`), unless stated otherwise.
- **Database access:** Always use the Prisma singleton from `src/lib/db.ts`.
- **Required flow (inside `try`):**
    1. Check authorization via `authorizeAction`, passing roles using the `Role` enum.
       _(Known legacy deviation: queries place `authorizeAction` inside the `try` block, whereas actions place it outside. Keep consistent until a dedicated refactor standardizes both.)_
    2. Validate parameters using the feature's ready validator helper function (**never** call the Zod schema directly). If `!parsedParams.success`, propagate the `Result` as-is.
    3. Build Prisma clauses by calling the paired `.builder.ts` with `parsedParams.data` (when applicable).
    4. Execute database reads through `src/lib/db.ts`. Use `Promise.all` whenever more than one independent DB query is required (e.g., fetching paginated rows and total count).
    5. Map records via `<Entity>Mapper.toDto(...)` and return `ok(dto)` / `ok(paginatedResult)` unless stated otherwise.
    6. In `catch`: return `fail(...)` with the `UNEXPECTED` error code from `src/types/error.type.ts`.

## Query Builders (`query-builder/<entity>-<operation>.builder.ts`)

- Pure function module that translates validated query parameters into Prisma `where`, `orderBy`, `skip`, and `take` clauses.
- Never import or call `db` (keeps builders unit-testable with zero mocking).
