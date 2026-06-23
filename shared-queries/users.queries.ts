"use client";

import { useApiQuery } from "@/hooks/use-query";
import type { QueryOptions, PaginatedData, User, UserStatistics } from "@/lib/types";

export const USERS_QUERY_KEY = "users";

/**
 * Example list query. Reads filters as a flat `Record<string,string>` (usually
 * sourced from the URL search params) and forwards them to the API.
 */
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

export function useUserStatisticsQuery(options?: QueryOptions<UserStatistics>) {
  return useApiQuery<UserStatistics>(
    [USERS_QUERY_KEY, "statistics"],
    "/users/summary",
    { method: "GET" },
    options
  );
}
