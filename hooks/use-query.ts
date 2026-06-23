"use client"

import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query"
import { useApiClient } from "./use-api-client"
import type { ApiResponse } from "@/lib/types"
import { AxiosRequestConfig } from "axios"
import { toast } from "sonner"

/**
 * Custom hook that combines React Query with useApiClient
 * Provides caching, offline support, and automatic refetching
 */
export function useApiQuery<T>(
  queryKey: string[],
  url: string,
  config?: AxiosRequestConfig,
  options?: Omit<
    UseQueryOptions<ApiResponse<T>, Error, ApiResponse<T>, string[]>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<ApiResponse<T>, Error> {
  const { apiClient } = useApiClient()

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await apiClient<T>(url, config)
      // Throw error if API returned success: false so React Query can handle it
      if (!response.success) {
        toast.error(response.message || "An error occurred retrieving data");
        const error = new Error(response.message || "An error occurred")
        ;(error as any).statusCode = response.statusCode
        ;(error as any).errors = response.errors
        throw error
      }
      console.log("response", response);
      return response
    },
    ...options,
    // Use cached data when offline
    networkMode: "offlineFirst",
  })
}

