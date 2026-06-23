# Admin Template

A reusable Next.js admin dashboard starter extracted from a production app. It
ships the shell, data-fetching layer, auth, and a set of shared UI patterns so a
new internal tool can start from working conventions instead of a blank page.

## Stack

- **Next.js 16** (App Router) + **React 19**, TypeScript
- **Tailwind CSS v4** + shadcn-style UI primitives (`components/ui`)
- **TanStack Query** + **Axios** for data fetching (`useApiQuery` / `useApiMutation`)
- **NextAuth v4** (credentials + JWT session) for auth
- **react-hook-form** + **zod** for forms
- **TanStack Table** for data tables

## Getting started

```bash
pnpm install
cp .env.example .env   # then fill in NEXTAUTH_SECRET and NEXT_PUBLIC_API_URL
pnpm dev               # http://localhost:3000
```

The app expects a backend that returns the standard envelope
(`{ success, message, data }`) — see `lib/apiClient.ts`. Point
`NEXT_PUBLIC_API_URL` at it. The login flow posts to `POST /Auth/login` and
expects `{ token, email, fullName, role }` back (`app/api/auth/auth.ts`).

## What's included

| Area | Location |
| --- | --- |
| App shell (sidebar, header, breadcrumbs) | `app/(routes)/layout.tsx`, `components/layout/*` |
| Auth (login, forgot/reset/setup password) | `app/auth/*`, `components/auth/*`, `app/api/auth/*` |
| Data layer | `lib/apiClient.ts`, `hooks/use-query.ts`, `hooks/use-mutation.ts` |
| Providers (Query + Session) | `components/providers.tsx`, `lib/query-client.ts` |
| Shared UI primitives | `components/ui/*` |
| Shared patterns (data table, filters, stat cards, modals) | `components/shared/*` |
| Routes / sidebar config | `constants/index.ts` |
| Status enums + option maps | `constants/statuses.ts` |
| Excel export helpers | `lib/exports/*` |
| **Example feature** (list + filters + table + create/edit modal) | `components/users/*`, `app/(routes)/users`, `shared-queries/users.queries.ts` |

## Conventions

- **Routes** live in `constants/index.ts` (`ROUTES`) and the sidebar is driven
  by `sidebarItems` in the same file. Add a route there, then a page under
  `app/(routes)/`.
- **Data fetching**: write a hook in `shared-queries/*.queries.ts` using
  `useApiQuery`, and mutations with `useApiMutation`. Both wrap the shared
  `apiClient` and the standard response envelope.
- **Statuses**: declare a status enum + `*_OPTIONS` map in `constants/statuses.ts`;
  the `variant` feeds `StatusTag`/`Badge` so tables and filters share one source.
- The bundled **Users** module is the reference implementation — copy it when
  adding a new resource.

## Notes

- **No RBAC.** Auth is authentication-only; `middleware.ts` just requires a
  valid session. To add permission-based gating, extend the JWT in
  `app/api/auth/auth.ts` and check it in `middleware.ts`.
- Replace `public/logo.svg`, the branding strings in `components/layout/Sidebar.tsx`
  and `components/auth/auth-layout.tsx`, and the example `User` types in
  `lib/types.ts` for your project.
