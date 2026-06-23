"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface MultiSelectOption {
  label: string
  value: string | number
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value?: (string | number)[]
  onChange?: (values: (string | number)[]) => void
  placeholder?: string
  disabled?: boolean
  emptyMessage?: string
  className?: string
  error?: boolean
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select items...",
  disabled = false,
  emptyMessage = "No items found.",
  className,
  error = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const selectedValues = React.useMemo(() => {
    return value.map((v) => String(v))
  }, [value])

  const selectedOptions = React.useMemo(() => {
    return options.filter((opt) => selectedValues.includes(String(opt.value)))
  }, [options, selectedValues])

  const handleSelect = (optionValue: string | number) => {
    if (!onChange) return

    const stringValue = String(optionValue)
    const isSelected = selectedValues.includes(stringValue)

    if (isSelected) {
      // Remove from selection
      const newValues = value.filter((v) => String(v) !== stringValue)
      onChange(newValues)
    } else {
      // Add to selection
      onChange([...value, optionValue])
    }
  }

  const handleRemove = (optionValue: string | number, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!onChange) return

    const newValues = value.filter((v) => String(v) !== String(optionValue))
    onChange(newValues)
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "text-black w-full justify-between h-9 border-input hover:bg-transparent hover:text-black dark:hover:text-white dark:border-input aria-expanded:bg-transparent aria-expanded:text-black dark:aria-expanded:text-white",
            !selectedOptions.length && "text-muted-foreground",
            error && "border-destructive",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 flex-1 min-w-0">
            {selectedOptions.length === 0 ? (
              <span className="truncate">{placeholder}</span>
            ) : (
              selectedOptions.map((option) => (
                <span
                  key={String(option.value)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-sm"
                >
                  <span className="truncate">{option.label}</span>
                  <button
                    type="button"
                    className="hover:opacity-70 cursor-pointer"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRemove(option.value, e as unknown as React.MouseEvent)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={(e) => handleRemove(option.value, e)}
                  >
                    <X className="h-3 w-3 text-emerald-700" />
                  </button>
                </span>
              ))
            )}
          </div>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.includes(String(option.value))
                return (
                  <CommandItem
                    key={String(option.value)}
                    value={String(option.value)}
                    onSelect={() => handleSelect(option.value)}
                    className="whitespace-normal break-words"
                  >
                    <span className="flex-1">{option.label}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4 shrink-0",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
