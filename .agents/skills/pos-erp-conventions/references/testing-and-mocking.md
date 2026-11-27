# Testing & Mocking Standards (Vitest)

## Core Rules

- **Co-location:** Place `*.test.ts` directly beside the file it tests (e.g., `create-product.service.test.ts` next to `create-product.service.ts`).
- **Mocking boundary:** Mock all external and cross-layer dependencies—including validator helpers inside action and query tests. Only pure functions (e.g., mappers, utilities) stay unmocked, and `*.validator.test.ts` runs against real Zod.
- **`server-only` mock:** Whenever a tested module imports `'server-only'` (such as services and queries), mock it in the test file (`vi.mock('server-only', () => ({}));`).
- **Explicit, decoupled fixtures:** Always define fully typed fixtures for Prisma records, Domain entities, DTOs, and inputs. Never use `as any` or the spread (`...`) operator—even when all fields match—so every layer's fixtures stay independent.
- **Shared test infrastructure:** Use the global Vitest setup in `src/tests/setup.ts` and the shared Prisma mock in `src/tests/mocks/db.ts`.

## Verification

Run targeted feature tests before finishing any task:

```bash
pnpm test src/features/<domain>
```
