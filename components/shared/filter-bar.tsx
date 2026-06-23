"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Combobox } from "@/components/ui/combobox";

/** `DateRangePicker` always sends yyyy-MM-dd; URL/controlled keys are `startDate` and `endDate` (ISO). */
function dateRangeToIso(raw: string, boundary: "start" | "end"): string {
  const v = raw.trim();
  if (!v) return "";
  const time = boundary === "start" ? "00:00:00" : "23:59:59.999";
  return new Date(`${v}T${time}`).toISOString();
}

export interface FilterFieldOption {
  label: string;
  value: string | number | boolean;
}

export interface FilterField {
  key: string;
  label: string;
  type: "text" | "select" | "combobox" | "date" | "date-range" | "number";
  placeholder?: string;
  options?: FilterFieldOption[];
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface FilterBarProps {
  fields: FilterField[];
  defaultExpanded?: boolean;
  className?: string;
  showClearButton?: boolean;
  variant?: "inline" | "expandable";
  /**
   * Controlled mode: when provided, filter values are stored in state instead of URL params.
   * Useful for nested contexts like drawers where you don't want to affect parent page URL.
   */
  values?: Record<string, string>;
  /** Callback when filter values change in controlled mode */
  onValuesChange?: (values: Record<string, string>) => void;
  filterContainerClassName?: string;
}

export function FilterBar({
  fields,
  defaultExpanded = false,
  className,
  showClearButton = true,
  variant = "expandable",
  values,
  onValuesChange,
  filterContainerClassName,
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Check if component is in controlled mode (state-based instead of URL-based)
  const isControlled = values !== undefined && onValuesChange !== undefined;
  
  // Store local state for text inputs (for immediate UI feedback)
  const [textInputValues, setTextInputValues] = useState<Record<string, string>>({});
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
  
  // Initialize text input values from URL params or controlled values
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.type === "text" || field.type === "number") {
        initialValues[field.key] = isControlled
          ? (values?.[field.key] || "")
          : (searchParams.get(field.key) || "");
      }
    });
    setTextInputValues(initialValues);
  }, [fields, searchParams, isControlled, values]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach((timer) => {
        clearTimeout(timer);
      });
    };
  }, []);

  // Helper to read filter value from URL params or controlled values
  const getFilterValue = useCallback((key: string, type: FilterField["type"]) => {
    if (isControlled) {
      if (type === "date-range") {
        return {
          from: values?.startDate || "",
          to: values?.endDate || "",
        };
      }
      return values?.[key] || "";
    }
    if (type === "date-range") {
      return {
        from: searchParams.get("startDate") || "",
        to: searchParams.get("endDate") || "",
      };
    }
    return searchParams.get(key) || "";
  }, [searchParams, isControlled, values]);

  // Update URL params or controlled values when filter changes (immediate for non-text inputs)
  const updateFilter = useCallback((key: string, value: any, type: FilterField["type"]) => {
    if (isControlled) {
      const newValues = { ...values };
      if (type === "date-range") {
        if (value.from) {
          newValues.startDate = dateRangeToIso(value.from, "start");
        } else {
          delete newValues.startDate;
        }
        if (value.to) {
          newValues.endDate = dateRangeToIso(value.to, "end");
        } else {
          delete newValues.endDate;
        }
      } else {
        // Handle number 0 properly - check for null/undefined/empty string explicitly
        if (value !== null && value !== undefined && value !== "") {
          newValues[key] = value.toString();
        } else {
          delete newValues[key];
        }
      }
      // Reset page to 1 when filters are applied
      delete newValues.pageIndex;
      onValuesChange?.(newValues);
      return;
    }

    // URL mode: Always read fresh searchParams to avoid stale state
    const params = new URLSearchParams(searchParams.toString());

    if (type === "date-range") {
      if (value.from) {
        params.set("startDate", dateRangeToIso(value.from, "start"));
      } else {
        params.delete("startDate");
      }
      if (value.to) {
        params.set("endDate", dateRangeToIso(value.to, "end"));
      } else {
        params.delete("endDate");
      }
    } else {
      // Handle number 0 properly - check for null/undefined/empty string explicitly
      if (value !== null && value !== undefined && value !== "") {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    }

    // Reset page to 1 when filters are applied
    params.delete("pageIndex");

    // Use replace instead of push to avoid navigation history issues and race conditions
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, isControlled, values]);

  // Debounced update for text inputs
  const updateTextFilter = useCallback((key: string, value: string, type: FilterField["type"]) => {
    // Update local state immediately for UI feedback
    setTextInputValues((prev) => ({ ...prev, [key]: value }));

    // Clear existing timer for this field
    if (debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key]);
    }

    // Set new timer to update URL after 500ms of no typing
    debounceTimers.current[key] = setTimeout(() => {
      // Convert number type properly
      const filterValue = type === "number" && value ? Number(value) : value;
      updateFilter(key, filterValue, type);
      delete debounceTimers.current[key];
    }, 500);
  }, [updateFilter]);

  // Clear a single filter
  const clearFilter = useCallback((key: string, type: FilterField["type"]) => {
    // Clear any pending debounce timer for text/number inputs
    if ((type === "text" || type === "number") && debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key]);
      delete debounceTimers.current[key];
    }

    // Clear local text input state
    if (type === "text" || type === "number") {
      setTextInputValues((prev) => ({ ...prev, [key]: "" }));
    }

    if (isControlled) {
      const newValues = { ...values };
      if (type === "date-range") {
        delete newValues.startDate;
        delete newValues.endDate;
      } else {
        delete newValues[key];
      }
      // Reset page to 1 when filter is cleared
      delete newValues.pageIndex;
      onValuesChange?.(newValues);
      return;
    }

    // URL mode: Always read fresh searchParams to avoid stale state
    const params = new URLSearchParams(searchParams.toString());

    if (type === "date-range") {
      params.delete("startDate");
      params.delete("endDate");
    } else {
      params.delete(key);
    }

    // Reset page to 1 when filter is cleared
    params.delete("pageIndex");

    // Use replace instead of push to avoid navigation history issues and race conditions
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, isControlled, values]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    // Clear all pending debounce timers
    Object.keys(debounceTimers.current).forEach((key) => {
      clearTimeout(debounceTimers.current[key]);
    });
    debounceTimers.current = {};

    // Clear all local text input state
    setTextInputValues({});

    if (isControlled) {
      onValuesChange?.({});
      return;
    }

    // URL mode: Always read fresh searchParams to avoid stale state
    const params = new URLSearchParams(searchParams.toString());

    fields.forEach((field) => {
      if (field.type === "date-range") {
        params.delete("startDate");
        params.delete("endDate");
      } else {
        params.delete(field.key);
      }
    });

    // Reset page to 1 when all filters are cleared
    params.delete("pageIndex");

    // Use replace instead of push to avoid navigation history issues and race conditions
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, fields, isControlled]);

  // Check if there are active filters
  const hasActiveFilters = useMemo(() => {
    return fields.some((field) => {
      const value = getFilterValue(field.key, field.type);
      if (field.type === "date-range") {
        return (value as { from: string; to: string }).from || (value as { from: string; to: string }).to;
      }
      return value && value !== "";
    });
  }, [fields, getFilterValue]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return fields.filter((field) => {
      const value = getFilterValue(field.key, field.type);
      if (field.type === "date-range") {
        return (value as { from: string; to: string }).from || (value as { from: string; to: string }).to;
      }
      return value && value !== "";
    }).length;
  }, [fields, getFilterValue]);

  const renderField = (field: FilterField) => {
    const fieldValue = getFilterValue(field.key, field.type);

    switch (field.type) {
      case "text":
        const textValue = textInputValues[field.key] ?? fieldValue;
        return (
          <div key={field.key} className={cn("space-y-2", field.className)}>
            <Label htmlFor={field.key} className="text-sm font-medium text-foreground">
              {field.label}
            </Label>
            <div className="relative">
              <Input
                id={field.key}
                type="text"
                placeholder={field.placeholder}
                value={textValue as string}
                onChange={(e) => updateTextFilter(field.key, e.target.value, field.type)}
                className="pr-8"
              />
              {textValue && (
                <button
                  type="button"
                  onClick={() => clearFilter(field.key, field.type)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );

      case "number":
        const numberValue = textInputValues[field.key] ?? fieldValue;
        return (
          <div key={field.key} className={cn("space-y-2", field.className)}>
            <Label htmlFor={field.key} className="text-sm font-medium text-foreground">
              {field.label}
            </Label>
            <div className="relative">
              <Input
                id={field.key}
                type="number"
                placeholder={field.placeholder}
                value={numberValue as string}
                onChange={(e) =>
                  updateTextFilter(
                    field.key,
                    e.target.value,
                    field.type
                  )
                }
                min={field.min}
                max={field.max}
                step={field.step}
                className="pr-8"
              />
              {numberValue && (
                <button
                  type="button"
                  onClick={() => clearFilter(field.key, field.type)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );

      case "select":
        const selectValue = fieldValue as string;
        return (
          <div key={field.key} className={cn("space-y-2", field.className)}>
            <Label htmlFor={field.key} className="text-sm font-medium text-foreground">
              {field.label}
            </Label>
            <Select
              key={`${field.key}-${selectValue || "empty"}`}
              value={selectValue && selectValue !== "" ? selectValue : undefined}
              onValueChange={(value: string) => {
                const option = field.options?.find(
                  (opt) => opt.value.toString() === value
                );
                if (option) {
                  updateFilter(field.key, option.value, field.type);
                }
              }}
            >
              <SelectTrigger id={field.key} className="w-full">
                <SelectValue placeholder={field.placeholder || "All"} />
              </SelectTrigger>
              <SelectContent>
                {field.options
                  ?.filter(
                    (option) =>
                      option.value !== "" &&
                      option.value !== null &&
                      option.value !== undefined
                  )
                  .map((option) => (
                    <SelectItem
                      key={option.value.toString()}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "combobox":
        const comboboxValue = fieldValue as string;
        return (
          <div key={field.key} className={cn("space-y-2", field.className)}>
            <Label htmlFor={field.key} className="text-sm font-medium text-foreground">
              {field.label}
            </Label>
            <Combobox
              key={`${field.key}-${comboboxValue || "empty"}`}
              options={
                field.options
                  ?.filter(
                    (option): option is FilterFieldOption & { value: string | number } =>
                      option.value !== "" &&
                      option.value !== null &&
                      option.value !== undefined &&
                      typeof option.value !== "boolean"
                  )
                  .map((option) => ({
                    label: option.label,
                    value: option.value,
                  })) || []
              }
              value={comboboxValue || undefined}
              onChange={(value) => {
                updateFilter(field.key, value, field.type);
              }}
              placeholder={field.placeholder || "All"}
            />
          </div>
        );

      case "date":
        return (
          <div key={field.key} className={cn("space-y-2", field.className)}>
            <Label htmlFor={field.key} className="text-sm font-medium text-foreground">
              {field.label}
            </Label>
            <div className="relative">
              <Input
                id={field.key}
                type="date"
                value={fieldValue as string}
                onChange={(e) => updateFilter(field.key, e.target.value, field.type)}
                className="pr-8"
              />
              {fieldValue && (
                <button
                  type="button"
                  onClick={() => clearFilter(field.key, field.type)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );

      case "date-range":
        const rangeValue = fieldValue as { from: string; to: string };
        return (
          <div key={field.key} className={cn("space-y-2", field.className)}>
            <Label className="text-sm font-medium text-foreground">{field.label}</Label>
            <DateRangePicker
              value={rangeValue}
              onChange={(value) => updateFilter(field.key, value, field.type)}
              placeholder={field.placeholder || "Select date range"}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Inline variant - always visible in a horizontal row
  if (variant === "inline") {
    return (
      <div className={cn(" text-black rounded-sm border bg-white px-4 py-3", className)}>
        <div className="flex items-end gap-4">
          <div className={cn("flex flex-1 items-end gap-4 overflow-x-auto", filterContainerClassName)}>
            {fields.map((field) => {
              const fieldValue = getFilterValue(field.key, field.type);

              switch (field.type) {
                case "text":
                  const textValue = textInputValues[field.key] ?? fieldValue;
                  return (
                    <div key={field.key} className={cn("min-w-[200px] space-y-1.5", field.className)}>
                      <Label htmlFor={field.key} className="text-xs font-medium text-muted-foreground">
                        {field.label}
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id={field.key}
                          type="text"
                          placeholder={field.placeholder}
                          value={textValue as string}
                          onChange={(e) => updateTextFilter(field.key, e.target.value, field.type)}
                          className="h-9 pl-8 pr-8"
                        />
                        {textValue && (
                          <button
                            type="button"
                            onClick={() => clearFilter(field.key, field.type)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );

                case "select":
                  const selectValue = fieldValue as string;
                  return (
                    <div key={field.key} className={cn("min-w-[130px] space-y-1.5", field.className)}>
                      <Label htmlFor={field.key} className="text-xs font-medium text-muted-foreground">
                        {field.label}
                      </Label>
                      <Select
                        key={`${field.key}-${selectValue || "empty"}`}
                        value={selectValue && selectValue !== "" ? selectValue : undefined}
                        onValueChange={(value: string) => {
                          const option = field.options?.find(
                            (opt) => opt.value.toString() === value
                          );
                          if (option) {
                            updateFilter(field.key, option.value, field.type);
                          }
                        }}
                      >
                        <SelectTrigger id={field.key} className="h-9 w-full">
                          <SelectValue placeholder={field.placeholder || "All"} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options
                            ?.filter(
                              (option) =>
                                option.value !== "" &&
                                option.value !== null &&
                                option.value !== undefined
                            )
                            .map((option) => (
                              <SelectItem
                                key={option.value.toString()}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );

                case "combobox":
                  const comboboxValue = fieldValue as string;
                  return (
                    <div key={field.key} className={cn("min-w-[200px] space-y-1.5", field.className)}>
                      <Label htmlFor={field.key} className="text-xs font-medium text-muted-foreground">
                        {field.label}
                      </Label>
                      <Combobox
                        key={`${field.key}-${comboboxValue || "empty"}`}
                        options={
                          field.options
                            ?.filter(
                              (option): option is FilterFieldOption & { value: string | number } =>
                                option.value !== "" &&
                                option.value !== null &&
                                option.value !== undefined &&
                                typeof option.value !== "boolean"
                            )
                            .map((option) => ({
                              label: option.label,
                              value: option.value,
                            })) || []
                        }
                        value={comboboxValue || undefined}
                        onChange={(value) => {
                          updateFilter(field.key, value, field.type);
                        }}
                        placeholder={field.placeholder || "All"}
                      />
                    </div>
                  );

                case "date-range":
                  const inlineRangeValue = fieldValue as { from: string; to: string };
                  return (
                    <div key={field.key} className={cn("min-w-[250px] space-y-1.5", field.className)}>
                      <Label className="text-xs font-medium text-muted-foreground">
                        {field.label}
                      </Label>
                      <DateRangePicker
                        value={inlineRangeValue}
                        onChange={(value) => updateFilter(field.key, value, field.type)}
                        placeholder={field.placeholder || "Select date range"}
                      />
                    </div>
                  );

                case "date":
                  return (
                    <div key={field.key} className={cn("min-w-[160px] space-y-1.5", field.className)}>
                      <Label htmlFor={field.key} className="text-xs font-medium text-muted-foreground">
                        {field.label}
                      </Label>
                      <div className="relative">
                        <Input
                          id={field.key}
                          type="date"
                          value={fieldValue as string}
                          onChange={(e) => updateFilter(field.key, e.target.value, field.type)}
                          className="h-9 pr-8"
                        />
                        {fieldValue && (
                          <button
                            type="button"
                            onClick={() => clearFilter(field.key, field.type)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </div>
          {showClearButton && hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="shrink-0 h-9 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/10"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Expandable variant - collapsible with a toggle button
  return (
    <div className={cn("space-y-4 bg-white rounded-sm border p-4", className)}>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          <Search className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {showClearButton && hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {fields.map(renderField)}
          </div>
        </div>
      )}
    </div>
  );
}
