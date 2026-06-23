"use client";

import { useSession } from "next-auth/react";
import { createApiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/lib/types";
import { AxiosRequestConfig } from "axios";
import { useCallback } from "react";
import { getUserFromStorage } from "@/lib/utils";

export function useApiClient() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const storageToken = getUserFromStorage()?.token;
  const sessionToken = session?.user?.token;
  // While session is hydrating, prefer localStorage so the shell can load quickly.
  // Once not loading, prefer session so updated JWTs (e.g. country switch) beat stale storage.
  const token =
    status === "loading"
      ? (storageToken ?? sessionToken)
      : (sessionToken ?? storageToken);
  const apiClient = useCallback(
    async <T>(
      url: string,
      config: AxiosRequestConfig = {}
    ): Promise<ApiResponse<T>> => {
      // Only return 401 if session finished loading and there's no token
      // if (!token) {
      //   return {
      //     statusCode: 401,
      //     success: false,
      //     message: "Authentication required",
      //     data: {} as T,
      //     errors: null,
      //   };
      // }

      // Merge token into headers
      const headers = {
        Authorization: `Bearer ${token}`,
        ...config.headers,
      };

      return createApiClient<T>(url, { ...config, headers });
    },
    [token]
  );

  return { apiClient, isLoading };
}
