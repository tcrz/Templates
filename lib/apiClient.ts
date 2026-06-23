import { authOptions } from "@/app/api/auth/auth";
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig, AxiosError } from "axios";
import { getServerSession } from "next-auth";
import { ApiResponse } from "@/lib/types";
import { getSession, signOut } from "next-auth/react";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor: Handle 401 errors and retry (works for both client and server)
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      console.error("Token expired, signing out user");
      if (process.env.NODE_ENV === "production") {
        signOut();
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Core API client function - shared logic for making API requests
 * Headers (including Authorization) should be passed in config
 */
export async function createApiClient<T>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> {
  let result: ApiResponse<T>;
  let status = 500;

  console.log("Full URL =>", `${axiosInstance.defaults.baseURL}${url}`);
  try {
    // Make API request with headers from config
    const response = await axiosInstance({
      url,
      ...config,
    });
    // console.log url with base url

    // Standardized response structure
    result = {
      statusCode: response.status,
      success: response.data?.success ?? true,
      message: response.data?.message ?? "Success",
      data: response.data.data,
      errors: response.data?.errors ?? null,
    };
  } catch (error: any) {
    let errMessage = "Something went wrong, please try again later.";

    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          errMessage = "Session expired. Please login again.";
        }
        // Server responded with an error
        status = error.response.status;
        errMessage =
          error.response.data?.message ||
          error.response.data?.title ||
          errMessage;
      } else if (error.request) {
        // Request was made but no response received
        errMessage = "Data could not be retrieved, please try again later.";
      }
    } else if (error instanceof Error) {
      errMessage = error.message;
    }

    result = {
      statusCode: status,
      success: false,
      message: errMessage,
      data: {} as T,
    };
  }

  return result;
}

/**
 * Server-side API client - gets token from server session and adds to headers
 */
const serverApiClient = async <T>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> => {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  // Merge token into headers
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...config.headers,
  };

  return createApiClient<T>(url, { ...config, headers });
};

export { serverApiClient };
