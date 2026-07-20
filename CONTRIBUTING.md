# Contributing Guide

This document is the source of truth for all Git workflow standards in this repository. All contributors must follow these conventions. Enforcement is automated via CI where noted.

---

## Branch Naming Convention

Branches must follow this format:

- **With a linked issue:** `type/issueNumber-simple-description` (e.g., `feat/23-category-validation`)
- **Without a linked issue:** `type/simple-description` (e.g., `hotfix/fix-auth-crash`)

### Allowed Branch Type Prefixes

| Prefix | Purpose |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `hotfix` | Emergency patch outside normal issue cycle |
| `chore` | Maintenance, config, tooling |
| `refactor` | Code restructuring without behavior change |
| `ci` | CI/CD pipeline changes |
| `docs` | Documentation only |
| `test` | Test additions or corrections |
| `perf` | Performance improvements |

> **Enforced by CI** — branches not matching this convention will be rejected.

---

## Conventional Commits

All commit messages must follow this format:

```
type(scope): description
```

### Allowed Commit Types

| Type | Purpose |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `hotfix` | Emergency patch |
| `chore` | Maintenance, config, tooling |
| `refactor` | Code restructuring without behavior change |
| `ci` | CI/CD pipeline changes |
| `docs` | Documentation only |
| `test` | Test additions or corrections |
| `perf` | Performance improvements |

> **Enforced by CI** — commits not matching this convention will be rejected.

---

## PR Title Convention

PR titles must follow the same format as commit messages:

```
type(scope): description
```

Example: `feat(auth): add role-based route protection`

> **Enforced by CI** — PRs with non-compliant titles will be rejected.

---

## Issue Title Convention

Issue titles should follow the same format:

```
type(scope): description
```

Example: `chore(infrastructure): establish CONTRIBUTING.md for Git workflow`

> **Convention only** — not enforced by CI.

---

## Testing: Shared Prisma Mock

Tests that need a mocked Prisma client should **not** create their own `mockDeep<PrismaClient>()` instance or call `vi.mock("@/lib/db", ...)` locally. A single shared mock is already wired up globally:

- `src/tests/mocks/db.ts` exports the shared instance: `mockPrisma: DeepMockProxy<PrismaClient>`.
- `src/tests/setup.ts` registers `vi.mock("@/lib/db", ...)` once and resets `mockPrisma` in a global `beforeEach`.
- `vitest.config.ts` loads `src/tests/setup.ts` via `test.setupFiles`, so this is active before any test file runs.

**In a new test file, just import the mock and set return values:**

```typescript
import { mockPrisma } from "@/tests/mocks/db";

mockPrisma.category.create.mockResolvedValue(fakeDbResponse);
```

Do not:
- Redefine `mockDeep<PrismaClient>()` in a test file
- Call `vi.mock("@/lib/db", ...)` outside of `src/tests/setup.ts`
- Call `mockReset` yourself — it already runs globally before every test

> **Note:** the shared mock must be named starting with `mock` (e.g. `mockPrisma`, not `prismaMock`). Vitest's hoisting of `vi.mock()` factories only allows referencing out-of-scope variables prefixed with `mock` — a differently-named variable will throw a hoisting/initialization error.

> **Convention only** — not enforced by CI.