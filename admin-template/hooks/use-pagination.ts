"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { PaginationState } from "@tanstack/react-table";

interface UsePaginationOptions {
  /**
   * Default page number (1-indexed)
   * @default 1
   */
  defaultPage?: number;
  /**
   * Default page size
   * @default 10
   */
  defaultPageSize?: number;
  /**
   * URL parameter name for page number
   * @default "pageIndex"
   */
  pageParamName?: string;
  /**
   * URL parameter name for page size
   * @default "pageSize"
   */
  pageSizeParamName?: string;
}

interface UsePaginationReturn {
  /**
   * Pagination state compatible with @tanstack/react-table
   */
  pagination: PaginationState;
  /**
   * Function to update pagination state (compatible with tanstack/react-table's onPaginationChange)
   */
  setPagination: (updater: PaginationState | ((prev: PaginationState) => PaginationState)) => void;
  /**
   * Current page number (1-indexed)
   */
  page: number;
  /**
   * Current page size
   */
  pageSize: number;
}

/**
 * Hook to manage pagination state and sync it with URL search parameters
 * 
 * @example
 * ```tsx
 * const { pagination, setPagination, page, pageSize } = usePagination();
 * 
 * // Use with DataTable
 * <DataTable
 *   pagination={pagination}
 *   onPaginationChange={setPagination}
 *   // ...
 * />
 * ```
 */
export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const {
    defaultPage = 1,
    defaultPageSize = 10,
    pageParamName = "pageIndex",
    pageSizeParamName = "pageSize",
  } = options;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read pagination from URL params
  const pageParam = searchParams.get(pageParamName);
  const page = pageParam ? parseInt(pageParam, 10) : defaultPage;

  const pageSizeParam = searchParams.get(pageSizeParamName);
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : defaultPageSize;

  // Convert to PaginationState format (pageIndex is 0-indexed)
  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: page - 1, // Convert from 1-indexed to 0-indexed
      pageSize,
    }),
    [page, pageSize]
  );

  // Update URL params when pagination changes
  const setPagination = useCallback(
    (updater: PaginationState | ((prev: PaginationState) => PaginationState)) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;

      // Always read fresh searchParams to avoid stale state and preserve all existing params
      const params = new URLSearchParams(searchParams.toString());

      // Update page (convert from 0-indexed to 1-indexed)
      const newPage = newPagination.pageIndex + 1;
      if (newPage === defaultPage) {
        params.delete(pageParamName);
      } else {
        params.set(pageParamName, newPage.toString());
      }

      // Update page size
      if (newPagination.pageSize === defaultPageSize) {
        params.delete(pageSizeParamName);
      } else {
        params.set(pageSizeParamName, newPagination.pageSize.toString());
      }

      // Use replace instead of push to avoid navigation history issues and race conditions
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [
      page,
      pageSize,
      pathname,
      searchParams,
    ]
  );

  return {
    pagination,
    setPagination,
    page,
    pageSize,
  };
}
