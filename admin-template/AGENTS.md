# Project conventions

Next.js 16 (App Router) + React 19 + TypeScript, Tailwind v4, TanStack
Query/Table, NextAuth v4, react-hook-form + zod. Package manager is **pnpm**.

## Rules

1. [Data fetching](docs/data-fetching.md) — `useApiQuery`/`useApiMutation` only, no raw axios/fetch
2. [Routes & sidebar](docs/routes-and-sidebar.md) — all paths from `ROUTES`, no hardcoded strings
3. [Statuses](docs/statuses.md) — const-enum + options-map in `constants/statuses.ts`
4. [Modals](docs/modals.md) — Dialog shell for form modals, confirmation dialogs via `useConfirmationDialog`
5. [Forms](docs/forms.md) — react-hook-form + zod, Field components, mutation wiring
6. [Tables](docs/tables.md) — DataTable, column defs, pagination, common column patterns
7. [Page structure](docs/page-structure.md) — thin route pages, logic in `components/<feature>/`
8. [Auth & session](docs/auth.md) — NextAuth JWT, session shape, how to extend
9. [Branding](docs/branding.md) — app identity in `constants/branding.ts`, theme colours in `globals.css`
10. Reuse `components/ui/*` and `components/shared/*` before writing new components