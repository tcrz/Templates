"use client";

import { useMemo } from "react";
import { PaginationState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ChevronsLeft as ChevronsLeftIcon,
  ChevronsRight as ChevronsRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PageItem = number | "ellipsis";

function calculatePaginationPages(
  totalPages: number,
  currentPageIndex: number,
  maxVisiblePages: number = 7,
  siblingCount: number = 1
): PageItem[] {
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const pages: PageItem[] = [];
  const FIRST_PAGE = 0;
  const LAST_PAGE = totalPages - 1;

  pages.push(FIRST_PAGE);

  const rangeStart = Math.max(1, currentPageIndex - siblingCount);
  const rangeEnd = Math.min(LAST_PAGE - 1, currentPageIndex + siblingCount);

  if (rangeStart > 1) pages.push("ellipsis");

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  if (rangeEnd < LAST_PAGE - 1) pages.push("ellipsis");

  pages.push(LAST_PAGE);

  return pages;
}

function PaginationPageButton({
  pageIndex,
  isActive,
  onClick,
}: {
  pageIndex: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      onClick={onClick}
      className={cn(
        "h-8 w-8 p-0",
        !isActive && "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      {pageIndex + 1}
    </Button>
  );
}

function PaginationPages({
  totalPages,
  currentPageIndex,
  onPageChange,
}: {
  totalPages: number;
  currentPageIndex: number;
  onPageChange: (pageIndex: number) => void;
}) {
  const pagesToShow = useMemo(
    () => calculatePaginationPages(totalPages, currentPageIndex),
    [totalPages, currentPageIndex]
  );

  return (
    <>
      {pagesToShow.map((page, index) => {
        if (page === "ellipsis") {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
              ...
            </span>
          );
        }
        return (
          <PaginationPageButton
            key={page}
            pageIndex={page}
            isActive={currentPageIndex === page}
            onClick={() => onPageChange(page)}
          />
        );
      })}
    </>
  );
}

interface PaginationProps {
  totalPages: number;
  pagination: PaginationState;
  onPaginationChange: (updater: PaginationState | ((prev: PaginationState) => PaginationState)) => void;
  className?: string;
}

export function Pagination({
  totalPages,
  pagination,
  onPaginationChange,
  className,
}: PaginationProps) {
  const { pageIndex } = pagination;

  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < totalPages - 1;

  const goToPage = (index: number) => {
    onPaginationChange((prev) => ({ ...prev, pageIndex: index }));
  };

  return (
    <div className={cn("flex items-center justify-center gap-2 px-4 py-4", className)}>
      <Button
        variant="outline"
        className={cn(
          "hidden h-8 w-8 p-0 lg:flex",
          "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
        onClick={() => goToPage(0)}
        disabled={!canPreviousPage}
      >
        <span className="sr-only">Go to first page</span>
        <ChevronsLeftIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className={cn(
          "h-8 w-8 p-0",
          "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
        onClick={() => goToPage(pageIndex - 1)}
        disabled={!canPreviousPage}
      >
        <span className="sr-only">Go to previous page</span>
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      <PaginationPages
        totalPages={totalPages}
        currentPageIndex={pageIndex}
        onPageChange={goToPage}
      />
      <Button
        variant="outline"
        className={cn(
          "h-8 w-8 p-0",
          "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
        onClick={() => goToPage(pageIndex + 1)}
        disabled={!canNextPage}
      >
        <span className="sr-only">Go to next page</span>
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className={cn(
          "hidden h-8 w-8 p-0 lg:flex",
          "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
        onClick={() => goToPage(totalPages - 1)}
        disabled={!canNextPage}
      >
        <span className="sr-only">Go to last page</span>
        <ChevronsRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
