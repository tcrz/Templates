/**
 * Auth API payload returned from the login endpoint.
 * Extend with whatever your backend returns (e.g. permissions, tenant id).
 */
export interface LoginData {
  token: string;
  email: string;
  fullName: string;
  role: string;
}

/**
 * Shape of the user object stored in the NextAuth session (`session.user`).
 */
export interface UserDetails extends LoginData {}

/**
 * Standardised envelope every API call resolves to (see `lib/apiClient.ts`).
 */
export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  errors?: string | string[] | null;
}

export type QueryOptions<T> = Omit<
  import("@tanstack/react-query").UseQueryOptions<
    ApiResponse<T>,
    Error,
    ApiResponse<T>,
    string[]
  >,
  "queryKey" | "queryFn"
>;

/**
 * Generic paginated list envelope. `results`/`items` are both supported so
 * either backend convention works without changing call sites.
 */
export interface PaginatedData<T> {
  results: T[];
  items?: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

// ============================================
// Example domain type (delete / replace per project)
// ============================================
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsers: number;
}
