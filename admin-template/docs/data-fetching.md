# Data Fetching

All data access goes through two hooks — never import `axios` or call `fetch`
directly in components.

## Response envelope

Every API response is normalised to `ApiResponse<T>` (`lib/types.ts`):

```ts
interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  errors?: string | string[] | null;
}
```

## Client-side hooks

### `useApiQuery` (`hooks/use-query.ts`)

Wraps `useQuery` from TanStack Query. Accepts a query key, URL, optional Axios
config, and optional React Query options. Automatically attaches the auth token
via `useApiClient` and toasts on `success: false`.

```ts
const { data, isLoading } = useApiQuery<PaginatedData<User>>(
  [USERS_QUERY_KEY, queryParams],
  "/users",
  { method: "GET", params },
  options
);
```

### `useApiMutation` (`hooks/use-mutation.ts`)

Wraps `useMutation`. Accepts a URL and mutation options. The mutation function
receives `{ data, config }` so the caller can override the HTTP method or URL
at call time.

```ts
const mutation = useApiMutation<User, UserFormData>(
  isEditMode ? `/users/${user.id}` : "/users",
  {
    onSuccess: () => {
      toast.success("Saved");
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  }
);

await mutation.mutateAsync({
  data: formValues,
  config: { method: isEditMode ? "PUT" : "POST" },
});
```

## Query files

One file per resource in `shared-queries/*.queries.ts`. Each file exports:

1. A `*_QUERY_KEY` string constant (used as the cache key root).
2. One or more `use*Query` hooks that call `useApiQuery`.

**Do not put mutations in query files.** Mutations are always defined inline in the component that uses them.

### Example (`shared-queries/users.queries.ts`)

```ts
export const USERS_QUERY_KEY = "users";

export function useUsersQuery(
  params?: Record<string, string>,
  options?: QueryOptions<PaginatedData<User>>
) {
  const queryParams = new URLSearchParams(params).toString();
  return useApiQuery<PaginatedData<User>>(
    [USERS_QUERY_KEY, queryParams],
    "/users",
    { method: "GET", params: params || {} },
    options
  );
}
```

## Server-side client

`serverApiClient` (`lib/apiClient.ts`) reads the token from the server session
for use in Server Components or Route Handlers. Same envelope, same base URL.

## Transport

`lib/apiClient.ts` creates a shared Axios instance (`axiosInstance`) with:

- `baseURL` from `NEXT_PUBLIC_API_URL` (falls back to `http://localhost:8080/api`)
- 20 s timeout
- A response interceptor that signs out on 401 in production

`useApiClient` (`hooks/use-api-client.ts`) injects the bearer token from the
NextAuth session (or localStorage while the session is hydrating).
