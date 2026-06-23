"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { LogOut, ChevronRight } from "lucide-react"
import {
  ROUTES,
  sidebarItems,
  isSidebarGroup,
  type SidebarMenuConfig,
  type SidebarGroupConfig,
} from "@/constants"
import { SidebarMenuSkeleton } from "@/components/layout/sidebar-menu-skeleton"
import { cn } from "@/lib/utils"
import { APP_BRAND } from "@/constants/branding"

function isRouteActive(pathname: string, routeUrl: string): boolean {
  if (routeUrl === "/") return pathname === routeUrl
  return pathname.startsWith(routeUrl)
}

function isGroupActive(pathname: string, items: SidebarMenuConfig[]): boolean {
  return items.some((item) => isRouteActive(pathname, item.url))
}

function StandaloneMenuItem({ item, pathname, isSidebarDisabled }: { item: SidebarMenuConfig; pathname: string; isSidebarDisabled: boolean }) {
  const isActive = isRouteActive(pathname, item.url)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        disabled={isSidebarDisabled}
        tooltip={item.description || item.title}
        className={cn(
          "group relative transition-all h-9.5 rounded-lg",
          isActive
            ? "!bg-primary !text-primary-foreground hover:!bg-primary"
            : "bg-transparent hover:bg-sidebar-accent text-sidebar-foreground"
        )}
        data-active={isActive}
      >
        <Link href={item.url} className="relative flex min-w-0 items-center w-full px-3 py-0">
          <div className="flex min-w-0 items-center gap-3">
            <div className={cn("flex shrink-0 items-center justify-center", isActive ? "text-primary-foreground" : "text-sidebar-foreground")}>
              <item.icon strokeWidth={isActive ? 2.5 : 2} className="size-5" />
            </div>
            <span className={cn("truncate text-sm", isActive ? "text-primary-foreground font-semibold" : "text-sidebar-foreground")}>
              {item.title}
            </span>
          </div>
          {item.badge && (
            <Badge
              variant="secondary"
              className={cn(
                "ml-auto h-5 min-w-5 px-1.5 text-[10px] font-semibold border-0",
                isActive
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-sidebar-accent text-sidebar-foreground"
              )}
            >
              {item.badge}
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

interface CollapsibleSidebarGroupProps {
  group: SidebarGroupConfig
  pathname: string
}

function CollapsibleSidebarGroup({ group, pathname }: CollapsibleSidebarGroupProps) {
  if (!group.items || group.items.length === 0) {
    return null;
  }

  const hasActiveItem = isGroupActive(pathname, group.items)
  const defaultOpen = group.defaultOpen || hasActiveItem

  return (
    <Collapsible
      key={group.title}
      defaultOpen={defaultOpen}
      className="group/collapsible"
    >
      <SidebarGroup>
        <SidebarGroupLabel
          asChild
          className="group/label text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground/80 text-xs font-semibold uppercase tracking-wider px-3 py-2"
        >
          <CollapsibleTrigger className="flex w-full items-center gap-1 justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="truncate">{group.title}</span>
              </TooltipTrigger>
              <TooltipContent side="right">{group.title}</TooltipContent>
            </Tooltip>
            <ChevronRight className="shrink-0 size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 mt-2">
              {group.items.map((item: SidebarMenuConfig) => {
                const isActive = isRouteActive(pathname, item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.description || item.title}
                      className={cn(
                        "group relative transition-all h-9.5 rounded-lg",
                        isActive
                          ? "!bg-primary !text-primary-foreground hover:!bg-primary"
                          : "bg-transparent hover:bg-sidebar-accent text-sidebar-foreground"
                      )}
                      data-active={isActive}
                    >
                      <Link href={item.url} className="relative flex min-w-0 items-center w-full px-3 py-1">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className={cn("flex shrink-0 items-center justify-center", isActive ? "text-primary-foreground" : "text-sidebar-foreground")}>
                            <item.icon strokeWidth={isActive ? 2.5 : 2} className="size-5" />
                          </div>
                          <span className={cn("truncate text-sm", isActive ? "text-primary-foreground font-semibold" : "text-sidebar-foreground")}>
                            {item.title}
                          </span>
                        </div>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "ml-auto h-5 min-w-5 px-1.5 text-[10px] font-semibold border-0",
                              isActive
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-sidebar-accent text-sidebar-foreground"
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}

export function SidebarComponent() {
  const { status } = useSession()
  const isLoading = status === "loading"
  const isSidebarDisabled = false
  const pathname = usePathname()
  const filteredItems = sidebarItems

  return (
    <Sidebar collapsible="icon" className={cn("border-r-0 bg-sidebar")}>
      <SidebarHeader className="px-5 py-4 border-b border-sidebar-border">
        <Link href={ROUTES.HOME} className="flex items-center gap-6">
          <img
            src={APP_BRAND.logo}
            alt={APP_BRAND.name}
            width={32}
            height={32}
            className="object-contain flex-shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-bold text-sidebar-foreground text-xl">
              {APP_BRAND.name}
            </span>
            <span className="text-xs text-primary">{APP_BRAND.tagline}</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 pt-2">
        {isLoading ? (
          <SidebarMenuSkeleton />
        ) : (
        filteredItems.map((item) => {
          if (isSidebarGroup(item)) {
            return (
              <CollapsibleSidebarGroup
                key={item.title}
                group={item}
                pathname={pathname}
              />
            );
          }
          return (
            <SidebarGroup key={item.title}>
              <SidebarGroupContent className={isSidebarDisabled ? "cursor-not-allowed" : ""}>
                <SidebarMenu className={isSidebarDisabled ? "cursor-not-allowed" : ""}>
                  <StandaloneMenuItem item={item} pathname={pathname} isSidebarDisabled={isSidebarDisabled} />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })
        )}
      </SidebarContent>

      <SidebarFooter className="px-3 py-4 relative z-10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut({ callbackUrl: ROUTES.LOGIN })}
              className="rounded-lg text-sidebar-foreground hover:text-red-500 hover:bg-red-500/10 w-full justify-start px-4 h-12 transition-colors"
            >
              <div className="flex items-center gap-3">
                <LogOut strokeWidth={2} className="size-5" />
                <span className="text-base">Sign Out</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
