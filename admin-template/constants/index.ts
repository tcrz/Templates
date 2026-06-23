import type { LucideIcon } from "lucide-react";
import { LayoutGrid, Users, Settings } from "lucide-react";

/**
 * Route group segments (used for URL structure + breadcrumb labelling).
 * Add a group here when a section of the app has nested routes.
 */
export const ROUTE_GROUPS = {
  // Example: ADMIN: "admin",
} as const;

/**
 * Centralised route table. Reference routes from here instead of hard-coding
 * strings so links stay in sync when paths change.
 */
export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/auth/login",
  // Protected
  DASHBOARD: "/dashboard",
  USERS: "/users",
  USER_DETAILS: "/users/*",
  CUSTOMERS: "/customers",
  SETTINGS: "/settings",
} as const;

export interface SidebarMenuConfig {
  title: string;
  url: string;
  icon: LucideIcon;
  description?: string;
  badge?: string | number;
}

export interface SidebarGroupConfig {
  title: string;
  icon?: LucideIcon;
  items?: SidebarMenuConfig[]; // Optional - if no items, treat as standalone menu
  defaultOpen?: boolean;
}

// Unified sidebar items - can be standalone menu items or groups.
// If `items` is undefined/empty, the entry renders as a standalone link.
export type SidebarItem = SidebarMenuConfig | SidebarGroupConfig;

export const sidebarItems: SidebarItem[] = [
  // Standalone menu item (no `items` property)
  {
    title: "Dashboard",
    url: ROUTES.DASHBOARD,
    icon: LayoutGrid,
    description: "Overview",
  },
  // Group with items
  {
    title: "Management",
    defaultOpen: true,
    items: [
      {
        title: "Users",
        url: ROUTES.USERS,
        icon: Users,
        description: "Manage users",
      },
      {
        title: "Customers",
        url: ROUTES.CUSTOMERS,
        icon: Users,
        description: "Manage customers",
      },
    ],
  },
  {
    title: "System",
    defaultOpen: false,
    items: [
      {
        title: "Settings",
        url: ROUTES.SETTINGS,
        icon: Settings,
        description: "Application settings",
      },
    ],
  },
];

// Helper to check if an item is a group (has a non-empty items array).
export function isSidebarGroup(item: SidebarItem): item is SidebarGroupConfig {
  return "items" in item && Array.isArray(item.items) && item.items.length > 0;
}

// Flat list of all leaf menu items.
export const sidebarMenuItems: SidebarMenuConfig[] = sidebarItems.flatMap((item) => {
  if (isSidebarGroup(item)) {
    return item.items || [];
  }
  return [item];
});

/** localStorage key the SessionProvider mirrors the user object into. */
export const USER_STORAGE_KEY = "admin-user";

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 1000;
