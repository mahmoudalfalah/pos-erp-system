# Architecture, Directory Layout & Naming Rules

## Core Architecture

This repository uses a **Feature-Based (Vertical Slice)** layout on top of the Next.js App Router.

- **`src/app/` — Thin Delivery Shell:** Handles routing, route groups for organizing (`(auth)`, `(cashier)`, `(dashboard)`), layouts, and API route handlers. Route-only helpers live in underscore-prefixed private folders (`_components`, `_configs`, `_types`, `_utils`). No domain or database logic lives here.
- **`src/features/<domain>/` — Domain Modules:** Self-contained vertical slices exposing only their public, client-safe API through a single barrel file (`index.ts`). Internal directories (create only when needed):
  `types`, `dtos`, `mappers`, `validators`, `services`, `queries`, `query-builder`, `actions`, `lib`, `hooks`, `configs`, `components`.
- **1:1 Operational Files & Co-located Tests:** Write operations are split one file per operation (`create-*.ts`, `update-*.ts`, `delete-*.ts`) rather than monolithic files, with Vitest files sitting directly beside them (`*.test.ts`).
- **`src/components/` — Two-Tiered Shared UI:**
    - `ui/` — Low-level primitives with zero business logic (`shadcn/ui` or custom primitives).
    - `shared/` — Reusable cross-feature abstractions (`EntityDialogForm`, `DynamicField`, `DataGrid`, `ConfirmationDialog`, `AppSidebar`).
- **Root `src/` — Cross-Cutting & Infrastructure:**
    - `types/` — Shared global contracts (e.g., `result.type.ts`, `error.type.ts`).
    - `utils/` — Pure shared utilities (e.g., `prisma-errors.util.ts`, `zod.util.ts`, `string.utils.ts`, `merge-refs.util.ts`).
    - `validators/` — Shared primitive validators (e.g., `id.validator.ts`).
    - `lib/` — Infrastructure singletons and constants (e.g., `db.ts` instead of calling `new PrismaClient()` every time, `constants/paths.ts`). Keep `src/lib/utils.ts` strictly for `shadcn/ui`'s `cn`.
    - `hooks/` — Global client hooks (e.g., `use-mobile.ts`).
    - `tests/` — Vitest setup and shared Prisma mocks (`setup.ts`, `mocks/db.ts`).

## Feature Template Blueprint

**Note:** Create files and directories only when needed.

```text
src/
├── app/
│   ├── api/<entities>/route.ts                  # API route handler (e.g., listing endpoint)
│   └── (group)/dashboard/<entities>/            # e.g., (dashboard)/dashboard/brands/
│       ├── page.tsx | layout.tsx                # Thin page importing the feature container
│       └── _<helper>/                           # Optional route-only helpers (_types, _configs, _components)
│
└── features/<entity>/                           # Singular folder name (e.g., product, brand)
    ├── index.ts                                 # Public barrel export for the feature
    ├── types/
    │   ├── <entity>.type.ts                     # Decoupled domain entity (no DB metadata like deletedAt)
    │   ├── <operation>-<entity>.type.ts         # Domain/operation types only
    │   └── <other>.type.ts                      # NO component prop types
    ├── dtos/
    │   └── <entity>.dto.ts                      # Serializable client contract
    ├── mappers/
    │   ├── <entity>.mapper.ts                   # toDomain, toDto, toPrismaCreate, toPrismaUpdate, etc.
    │   └── <entity>.mapper.test.ts
    ├── validators/
    │   ├── <operation>-<entity>.validator.ts    # Zod schema + Result-based validate<Operation><Entity>Input (mutation pattern; read validators use <entity>-<operation>.validator.ts, e.g., category-listing.validator.ts)
    │   └── <operation>-<entity>.validator.test.ts
    ├── services/                                # Write logic (must start with import 'server-only')
    │   ├── <operation>-<entity>.service.ts
    │   └── <operation>-<entity>.service.test.ts
    ├── queries/                                 # Read logic
    │   ├── <entity>-<operation>.query.ts
    │   └── <entity>-<operation>.query.test.ts
    ├── query-builder/                           # Prisma where/orderBy builders for listings
    │   ├── <entity>-<operation>.builder.ts
    │   └── <entity>-<operation>.builder.test.ts
    ├── actions/                                 # Next.js Server Actions (Auth -> Validate -> Service -> DTO)
    │   ├── <operation>-<entity>.action.ts
    │   └── <operation>-<entity>.action.test.ts
    ├── lib/
    │   └── <description>.ts                     # Feature-scoped infrastructure/adapters
    ├── configs/
    │   ├── <entity>-defaults.configs.ts         # Default form values
    │   ├── <entity>-fields-ui.configs.ts        # UI form configs
    │   └── <description>.configs.ts             # e.g., <entities>-management-page.configs.ts
    ├── hooks/
    │   └── use-<name>.ts                        # React Hook Form + Server Action state wiring
    └── components/
        └── <component>.tsx
```

## Naming Conventions

- **Kebab-case everywhere:** All files and folders use `kebab-case` for cross-OS compatibility (Linux/Windows).
- **Explicit role suffixes (`<name>.<role>.ts`):** Use **only** these suffixes: `.type.ts`, `.dto.ts`, `.mapper.ts`, `.validator.ts`, `.service.ts`, `.query.ts`, `.builder.ts`, `.action.ts`, `.configs.ts`, `.util.ts`, `.test.ts` (e.g., `create-product.action.ts`).
- **Singular vs. Plural:**
    - **Singular** for the feature folder and single-entity files: `features/category/`, `create-category.service.ts`, `category.mapper.ts`, `category.dto.ts`.
    - **Plural** for collections, grids, bulk actions, and route segments: `delete-categories.action.ts`, `categories-grid.tsx`, `app/(dashboard)/dashboard/categories/page.tsx`.

## Directory Grouping & Placement Rules

### Flat vs. Folder-Grouped Directories

- **Flat by default:** Place files directly inside their parent directory (e.g., `src/components/ui/button.tsx`).
- **Folder grouping exception:**
    - Group items into subfolders when most entries in a directory require multiple files (e.g., `src/components/shared/`, `features/product/components/create-page/`, `features/product/configs/create-product/`).
    - Files in `src/components/shared/` must always be grouped into subfolders, even if single-file.

### Types Placement

- A type file holds types and their related type helpers. Its scope determines its location: `features/<entity>/types/` for domain/operation types, or `src/types/` for global types.
- **Never** place component prop types in `features/<entity>/types/`.
- **Component types:** Keep prop types inline inside the component file by default, with two exceptions:
    1. Inside `src/components/shared/`, every component must have a dedicated `*.type.ts` file to maintain directory consistency.
    2. Move types to a separate file when they grow long (~25+ lines), define multiple type aliases, or are shared across multiple components.

### Configs Placement

- Always place configs in a dedicated `configs/` directory: `features/<entity>/configs/`, `src/configs/`, or `src/app/_configs/`.
- **Exception:** Configs belonging to a `src/components/shared/<component>/` live inside that component's group folder (rare).
