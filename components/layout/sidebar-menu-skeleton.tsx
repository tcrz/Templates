"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

/**
 * Mirrors real sidebar structure: section headers (uppercase label + chevron)
 * and menu items (icon + text). Widths approximate actual labels.
 */
const SIDEBAR_SKELETON_GROUPS = [
  { labelWidth: "w-36", items: ["w-28", "w-24", "w-24"] }, // Account Management
  { labelWidth: "w-32", items: ["w-28"] }, // Trade Operations
  { labelWidth: "w-40", items: ["w-36", "w-32", "w-20"] }, // Receivables Operations
  { labelWidth: "w-32", items: ["w-40"] }, // Finance & Treasury
  { labelWidth: "w-36", items: ["w-24"] }, // System Configuration
] as const

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={cn("rounded bg-white/[0.08] animate-pulse", className)} />
  )
}

export function SidebarMenuSkeleton() {
  return (
    <>
      {SIDEBAR_SKELETON_GROUPS.map((group, i) => (
        <SidebarGroup key={i} className="group/collapsible">
          <SidebarGroupLabel asChild>
            <div className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
              <SkeletonBlock className={cn("h-3.5 shrink-0", group.labelWidth)} />
              <SkeletonBlock className="size-4 shrink-0 rounded" aria-hidden />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 space-y-1.5">
              {group.items.map((textWidth, j) => (
                <SidebarMenuItem key={j}>
                  <div className="flex min-w-0 items-center gap-3 rounded-lg px-3 py-2 h-10">
                    <SkeletonBlock className="size-5 shrink-0 rounded" />
                    <SkeletonBlock className={cn("h-3.5 shrink-0", textWidth)} />
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
