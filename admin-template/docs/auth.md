# Auth & Session

Authentication uses **NextAuth v4** with a credentials provider and JWT
sessions. There is no RBAC or permissions system.

## Login flow

1. User submits email + password on `/auth/login`.
2. `authorize()` in `app/api/auth/auth.ts` posts to `POST /Auth/login`.
3. The backend returns `LoginData` — `{ token, email, fullName, role }`.
4. NextAuth stores this as `token.data` in the JWT (see the `jwt` callback).
5. The `session` callback copies `token.data` onto `session.user`.

## Session shape

```ts
// lib/types.ts
interface LoginData {
  token: string;
  email: string;
  fullName: string;
  role: string;
}

interface UserDetails extends LoginData {}
```

`session.user` is typed as `UserDetails`. Access it via:

```ts
// Client component
const { data: session } = useSession();
const user = session?.user; // UserDetails

// Server component / Route Handler
const session = await getServerSession(authOptions);
const user = session?.user;
```

## Extending the session

If the backend adds new fields (e.g. `tenantId`, `permissions`):

1. Add the field to `LoginData` in `lib/types.ts`.
2. Map it in the `authorize()` function in `app/api/auth/auth.ts`.
3. It flows automatically through the JWT → session callbacks.

## Middleware

`middleware.ts` uses `withAuth` to require a valid session on all routes except
auth pages and static assets. Unauthenticated users are redirected to
`/auth/login`. The root path `/` redirects to `ROUTES.DASHBOARD`.

To add permission-based route protection, gate on fields from `token.data`
inside the middleware function.

## Token handling

`useApiClient` (`hooks/use-api-client.ts`) injects the bearer token into every
API request. While the NextAuth session is hydrating, it falls back to
localStorage (via `getUserFromStorage`) so the shell can load without waiting.
