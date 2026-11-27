# Testing & Mocking Standards (Vitest)

## Core Rules

- **Co-location:** Place `*.test.ts` directly beside the file it tests (e.g., `create-product.service.test.ts` next to `create-product.service.ts`).
- **Mocking boundary:** Mock all external and cross-layer dependencies—including validator helpers inside action and query tests. Only pure functions (e.g., mappers, utilities) stay unmocked, and `*.validator.test.ts` runs against real Zod.
- **`server-only` mock:** Whenever a tested module imports `'server-only'` (such as services and queries), mock it in the test file (`vi.mock('server-only', () => ({}));`).
- **Explicit, decoupled fixtures:** Define each layer's base fixture (Prisma record, Domain entity, DTO, input) independently with explicit types. Never use `as any`, and **never** spread across layers (e.g., do not build `dtoBrand` from `...domainBrand` or `domainBrand` from `...rawBrand`). Spreading a base fixture of the **same** type to create test variations (e.g., `{ ...domainBrand, description: null }` or `{ ...dtoBrand, description: undefined }`) is encouraged to keep edge-case tests concise.
- **Shared test infrastructure:** Use the global Vitest setup in `src/tests/setup.ts` and the shared Prisma mock in `src/tests/mocks/db.ts`.

## Verification

Run targeted feature tests before finishing any task:

```bash
pnpm test src/features/<domain>
```
