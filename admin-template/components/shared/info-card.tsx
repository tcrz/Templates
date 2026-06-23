"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface InfoField {
  label: string
  value: string | React.ReactNode
  className?: string
  fullWidth?: boolean
}

interface InfoCardProps {
  header: string
  description?: string
  fields?: InfoField[]
  className?: string
  children?: React.ReactNode
  headerAction?: React.ReactNode
  showBorders?: boolean
  layout?: "rows" | "grid"
  columns?: 2 | 3 | 4
  cardContentClassName?: string
  valueAlign?: "start" | "end"
}

const GRID_COLS = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
} as const

export function InfoCard({
  header,
  description,
  fields = [],
  className,
  cardContentClassName,
  children,
  headerAction,
  showBorders = false,
  layout = "rows",
  columns = 3,
  valueAlign = "start",
}: InfoCardProps) {

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">{header}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>

          {headerAction && <div>{headerAction}</div>}
        </div>
      </CardHeader>
      <CardContent className={cn("px-6", cardContentClassName)}>
        {children ? (
          children
        ) : fields.length > 0 ? (
          layout === "grid" ? (
            <div className={cn("grid gap-x-6 gap-y-4", GRID_COLS[columns])}>
              {fields.map(({ label, value, className: fieldClassName }) => (
                <div key={label} className="flex flex-col gap-1">
                  <div className="text-sm text-muted-foreground font-medium">
                    {label}
                  </div>
                  <div className={cn("text-sm font-medium text-foreground", fieldClassName)}>
                    {value || "—"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-0">
              {fields.map(({ label, value, className: fieldClassName, fullWidth }, index) => (
                <div
                  key={label}
                  className={cn(
                    fullWidth
                      ? "flex flex-col gap-2 py-4"
                      : "grid grid-cols-[120px_1fr] gap-4 py-4",
                    showBorders && index < fields.length - 1 && "border-b border-border"
                  )}
                >
                  <div className="text-sm text-muted-foreground font-medium">
                    {label}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-medium text-foreground",
                      fullWidth && "whitespace-pre-wrap",
                      valueAlign === "end" && "text-right",
                      fieldClassName
                    )}
                  >
                    {value || "—"}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : null}
      </CardContent>
    </Card>
  )
}
