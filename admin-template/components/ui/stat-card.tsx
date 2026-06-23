import * as React from "react"
import { cn, formatAsAmount, formatNumber, formatPercentage } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { type LucideIcon } from "lucide-react"

type StatCardVariant = "default" | "success" | "warning" | "info"

interface StatCardProps {
  title: string
  value?: string | number
  subtitle?: string
  change?: {
    value: string
    trend: "up" | "down" | "neutral"
  }
  icon?: LucideIcon
  variant?: StatCardVariant
  statusText?: string
  className?: string
  formatType?: "default" | "amount" | "percentage"
}

const variantStyles: Record<StatCardVariant, { icon: string; status: string }> = {
  default: {
    icon: "bg-primary/10 text-primary",
    status: "text-muted-foreground",
  },
  success: {
    icon: "bg-green-500/10 text-green-600",
    status: "text-green-600",
  },
  warning: {
    icon: "bg-red-500/10 text-red-600",
    status: "text-red-600",
  },
  info: {
    icon: "bg-blue-500/10 text-blue-600",
    status: "text-muted-foreground",
  },
}

function StatCard({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  variant = "default",
  statusText,
  className,
  formatType = "default"
}: StatCardProps) {
  const styles = variantStyles[variant]
  const isValueNumber = !isNaN(Number(value))
  
  const formattedValue = React.useMemo(() => {
    if (!isValueNumber) {
      return value
    }
    
    switch (formatType) {
      case "amount":
        return formatAsAmount(value)
      case "percentage":
        return formatPercentage(Number(value))
      case "default":
      default:
        return formatNumber(value)
    }
  }, [value])

  return (
    <Card
      className={cn(
        "flex h-full min-h-0 flex-row justify-between gap-3 p-4 rounded-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col self-stretch">
        <div
          className={cn(
            "flex flex-col gap-0.5",
            subtitle ? "min-h-0 flex-1" : undefined
          )}
        >
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight">
              {formattedValue ?? "-"}
            </span>
            {change && (
              <span
                className={cn(
                  "text-xs font-medium",
                  change.trend === "up" && "text-green-600",
                  change.trend === "down" && "text-red-600",
                  change.trend === "neutral" && "text-muted-foreground"
                )}
              >
                {change.trend === "up" && "↑"}
                {change.trend === "down" && "↓"}
                {change.value}
              </span>
            )}
            {statusText && (
              <span className={cn("text-xs font-medium", styles.status)}>
                {statusText}
              </span>
            )}
          </div>
        </div>
        {subtitle ? (
          <span className="mt-3 text-xs leading-snug text-muted-foreground">
            {subtitle}
          </span>
        ) : null}
      </div>
      {Icon && (
        <div className={cn("shrink-0 self-start p-2 rounded-lg", styles.icon)}>
          <Icon className="size-4" />
        </div>
      )}
    </Card>
  )
}

interface StatCardsGridProps {
  children: React.ReactNode
  className?: string
}

function StatCardsGrid({ children, className }: StatCardsGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
        className
      )}
    >
      {children}
    </div>
  )
}

export { StatCard, StatCardsGrid, type StatCardProps, type StatCardVariant }
