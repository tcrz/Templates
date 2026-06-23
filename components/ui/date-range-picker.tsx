"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon, X } from "lucide-react"
import type { DateRange } from "react-day-picker"

export interface DateRangePickerProps {
  value?: { from?: string; to?: string }
  onChange?: (value: { from?: string; to?: string }) => void
  placeholder?: string
  className?: string
  fromLabel?: string
  toLabel?: string
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Select date range",
  className,
  fromLabel = "From",
  toLabel = "To",
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  // Local state for intermediate selection (first click only sets "from")
  const [pendingRange, setPendingRange] = React.useState<DateRange | undefined>(undefined)

  // Convert string dates to Date objects for the calendar
  const dateRange: DateRange | undefined = React.useMemo(() => {
    if (pendingRange) return pendingRange
    if (!value?.from && !value?.to) return undefined

    return {
      from: value.from ? new Date(value.from) : undefined,
      to: value.to ? new Date(value.to) : undefined,
    }
  }, [value, pendingRange])

  // Handle date range selection
  const handleSelect = (range: DateRange | undefined) => {
    if (!onChange) return

    if (!range) {
      setPendingRange(undefined)
      onChange({ from: "", to: "" })
      return
    }

    // Only propagate when both from and to are set and different
    if (range.from && range.to && range.from.getTime() !== range.to.getTime()) {
      setPendingRange(undefined)
      onChange({
        from: format(range.from, "yyyy-MM-dd"),
        to: format(range.to, "yyyy-MM-dd"),
      })
    } else {
      // First click — store locally, don't propagate yet
      setPendingRange(range)
    }
  }

  // Clear the date range
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPendingRange(undefined)
    onChange?.({ from: "", to: "" })
  }

  // Format the display text
  const displayText = React.useMemo(() => {
    if (!value?.from && !value?.to) return placeholder

    const fromDate = value.from ? format(new Date(value.from), "MMM dd, yyyy") : ""
    const toDate = value.to ? format(new Date(value.to), "MMM dd, yyyy") : ""

    if (fromDate && toDate) {
      return `${fromDate} - ${toDate}`
    } else if (fromDate) {
      return `${fromLabel}: ${fromDate}`
    } else if (toDate) {
      return `${toLabel}: ${toDate}`
    }

    return placeholder
  }, [value, placeholder, fromLabel, toLabel])

  const hasValue = Boolean(value?.from || value?.to)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-white hover:bg-transparent border-input hover:text-muted-foreground",
              !hasValue && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayText}
          </Button>
        </PopoverTrigger>
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={handleSelect}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
