# Write Operations: Mutations (Actions & Services)

All write operations (`CREATE`, `UPDATE`, `DELETE`) use a 1:1 Server Action + Service pair (`create-<entity>.(action|service).ts`, `update-<entity>.(action|service).ts`, `delete-<entity>.(action|service).ts`). Use the singular `<entity>` name for single-record mutations, and the plural `<entities>` name for bulk operations (e.g., `delete-categories.action.ts`).

## Unified Result & Error Contract

- Both actions and services must always return the global `Result` type (`src/types/result.type.ts`), constructed strictly via `ok()` and `fail()`.
- All error codes must come from `src/types/error.type.ts`. Every layer uses the same `Result` shape, callers propagate failed results directly without re-wrapping them.

## Server Actions (`actions/<operation>-<entity>.action.ts`) — Traffic Cops

Server Actions handle communication between the consumer and one or more services (or transactions).

- **Server boundary:** Must start with `'use server'`.
- **Input:** Raw input typed as `z.input<typeof schema>` imported from the validator.
- **Output:** `Promise<Result<EntityDto>>` (always returns the DTO type).
- **Required flow:**
    1. Check authorization via `authorizeAction`, passing roles using the `Role` enum.
       _(Known legacy deviation: keep `authorizeAction` outside the `try` block for consistency with existing actions until a future refactor standardizes it with queries.)_
    2. Inside `try`: validate the input using the feature's ready validator helper function (**never** call the Zod schema directly). If `!validated.success`, propagate the `Result` as-is.
    3. Call the service (or coordinate multiple services / transactions) with `validated.data` (`z.output`). If `!serviceResult.success`, propagate the `Result` as-is.
    4. Map the returned Domain entity using `<Entity>Mapper.toDto(...)` and return `ok(dto)`.
    5. In `catch`: return `fail(...)` with the `UNEXPECTED` error code from `src/types/error.type.ts`.

## Services (`services/<operation>-<entity>.service.ts`) — Business Logic

Services own domain business logic and database writes.

- **Server boundary:** Must start with `import 'server-only';`.
- **Input:** Strictly validated data typed as `z.output<typeof schema>`.
- **Validation boundary:** Services **must not** perform Zod schema validation. They may only check business-logic conditions (e.g., uniqueness, state constraints, or domain rules unrelated to schema validation).
- **Output:** `Promise<Result<DomainEntity>>` (always returns the Domain type).
- **Database access:** Always use the Prisma singleton from `src/lib/db.ts`. Delegate Prisma write payloads to `<Entity>Mapper.toPrismaCreate` / `toPrismaUpdate`.
- **Error handling:** Format failures consistently using `fail()` and error codes from `src/types/error.type.ts` (translating Prisma errors via `src/utils/prisma-errors.util.ts`) so actions can propagate service results directly.
