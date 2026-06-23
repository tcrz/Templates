"use client"

import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query"
import { useApiClient } from "./use-api-client"
import type { ApiResponse } from "@/lib/types"
import { AxiosRequestConfig } from "axios"

/**
 * Custom hook that combines React Query mutations with useApiClient
 * For now, mutations work online only. Offline queueing can be added later.
 */
export function useApiMutation<TData, TVariables = void>(
  url: string,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<TData>,
      Error,
      { config?: AxiosRequestConfig; data?: TVariables },
      unknown
    >,
    "mutationFn"
  >
): UseMutationResult<
  ApiResponse<TData>,
  Error,
  { config?: AxiosRequestConfig; data?: TVariables },
  unknown
> {
  const { apiClient } = useApiClient()

  return useMutation({
    mutationFn: async ({ config, data }) => {
      const mutationConfig: AxiosRequestConfig = {
        ...config,
        method: config?.method || "POST",
        data,
      }
      const response = await apiClient<TData>(url, mutationConfig)

      // Match useApiQuery behavior: treat API-level failures as errors
      if (!response.success) {
        const error = new Error(response.message || "An error occurred")
        ;(error as any).statusCode = response.statusCode
        ;(error as any).errors = response.errors
        throw error
      }

      return response
    },
    ...options,
  })
}

