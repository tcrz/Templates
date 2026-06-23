"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type TabsVariant = "underline" | "pill"

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
  variant: TabsVariant
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  variant = "pill",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  variant?: TabsVariant
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "")
  const value = controlledValue ?? internalValue
  const handleValueChange = onValueChange ?? setInternalValue

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange, variant }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const context = React.useContext(TabsContext)
  const variant = context?.variant ?? "pill"
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const checkScroll = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    const observer = new ResizeObserver(checkScroll)
    observer.observe(el)
    return () => observer.disconnect()
  }, [checkScroll])

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction === "left" ? -150 : 150, behavior: "smooth" })
  }

  const showArrows = canScrollLeft || canScrollRight

  return (
    <div className={cn("relative flex items-center", showArrows && "gap-1")} {...props}>
      {showArrows && (
        <button
          type="button"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={cn(
            "shrink-0 flex items-center justify-center size-7 rounded-md transition-colors",
            canScrollLeft
              ? "text-foreground hover:bg-muted cursor-pointer"
              : "text-muted-foreground/30 cursor-default"
          )}
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className={cn(
          "inline-flex items-center text-muted-foreground overflow-x-auto scrollbar-none",
          variant === "pill" && "justify-center bg-muted p-1 rounded-lg gap-0 shadow-inner border",
          variant === "underline" && "justify-start h-10 bg-transparent p-0 mb-0 rounded-none gap-6",
          className
        )}
      >
        {children}
      </div>
      {showArrows && (
        <button
          type="button"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={cn(
            "shrink-0 flex items-center justify-center size-7 rounded-md transition-colors",
            canScrollRight
              ? "text-foreground hover:bg-muted cursor-pointer"
              : "text-muted-foreground/30 cursor-default"
          )}
          aria-label="Scroll tabs right"
        >
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  )
}

function TabsTrigger({
  value,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  value: string
}) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsTrigger must be used within Tabs")

  const isActive = context.value === value
  const variant = context.variant

  return (
    <button
      type="button"
      data-state={isActive ? "active" : "inactive"}
      onClick={() => context.onValueChange(value)}
      className={cn(
        "cursor-pointer relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "pill" && "rounded-md px-4 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md",
        variant === "underline" && "h-10 rounded-none border-b-[3px] border-transparent bg-transparent px-0 pb-2.5 pt-2 text-muted-foreground shadow-none ring-offset-background hover:text-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:font-semibold",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  value,
  className,
  ...props
}: React.ComponentProps<"div"> & { value: string }) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsContent must be used within Tabs")

  if (context.value !== value) return null

  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

