"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps {
  options: { label: string; value: string | number }[];
  value?: string | number;
  onChange: (value: string | number | undefined) => void;
  placeholder?: string;
  className?: string;
  allowClear?: boolean;
  disabled?: boolean;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  className,
  allowClear = true,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const selectedOption = options.find((option) => {
    return String(option.value) === String(value);
  });

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onChange(undefined);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (disabled) return;
        setOpen(next);
      }}
      modal={true}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("text-black w-full justify-between h-9 border-input hover:bg-transparent hover:text-black dark:hover:text-white dark:border-input aria-expanded:bg-transparent aria-expanded:text-black dark:aria-expanded:text-white", className)}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            {allowClear && selectedOption && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleClear(e as unknown as React.MouseEvent);
                  }
                }}
                className="opacity-50 hover:opacity-100 cursor-pointer"
                onMouseDown={(e) => e.preventDefault()}
              >
                <X className="h-4 w-4" />
              </span>
            )}
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
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = String(value) === String(option.value);
                return (
                  <CommandItem
                    key={String(option.value)}
                    value={`${option.label} ${option.value}`}
                    onSelect={() => {
                      const newValue = isSelected ? undefined : option.value;
                      onChange(newValue);
                      setOpen(false);
                    }}
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
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
