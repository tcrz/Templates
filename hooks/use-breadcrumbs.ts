"use client";

import { ROUTE_GROUPS } from "@/constants";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage: boolean;
  isNavigable: boolean;
}

export interface BackDestination {
  label: string;
  href: string;
}

/**
 * Segments that are used for URL structure only and don't have their own pages.
 * These will be shown in breadcrumbs but won't be clickable.
 */
const NON_NAVIGABLE_SEGMENTS = new Set<string>(Object.values(ROUTE_GROUPS));

/**
 * Converts a URL segment to a human-readable label.
 * Falls back to title case if no mapping exists.
 */
function segmentToLabel(segment: string): string {
  // Fallback: convert kebab-case to Title Case
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Hook that generates breadcrumb items from the current pathname.
 * Automatically parses the URL and maps segments to readable labels.
 */
export function useBreadcrumbs(): {
  breadcrumbs: BreadcrumbItem[];
  backTo: BackDestination | null;
} {
  const pathname = usePathname();

  return useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length <= 1) {
      return { breadcrumbs: [], backTo: null };
    }

    const items: BreadcrumbItem[] = segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const isCurrentPage = index === segments.length - 1;
      const isNavigable = !NON_NAVIGABLE_SEGMENTS.has(segment);

      return {
        label: segmentToLabel(segment),
        href,
        isCurrentPage,
        isNavigable,
      };
    });

    // Find the nearest navigable parent for the back button
    const parent = [...items]
      .reverse()
      .find((item) => !item.isCurrentPage && item.isNavigable);

    const backTo = parent
      ? {
        label: parent.label,
        href: parent.href,
      }
      : null;

    return { breadcrumbs: items.filter((item) => item.isNavigable), backTo };
  }, [pathname]);
}
