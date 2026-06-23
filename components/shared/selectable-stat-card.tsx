"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Mirrors `StatCard` icon chip treatment for visual consistency. */
const variantStyles = {
  default: {
    icon: "bg-primary/10 text-primary",
  },
  success: {
    icon: "bg-green-500/10 text-green-600",
  },
  warning: {
    icon: "bg-red-500/10 text-red-600",
  },
  info: {
    icon: "bg-blue-500/10 text-blue-600",
  },
} as const;

export type SelectableStatCardVariant = keyof typeof variantStyles;

export interface SelectableStatCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: SelectableStatCardVariant;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * Stat-card–styled button for toggling sections (e.g. report types, filters).
 * Selected state uses the app green accent.
 */
export function SelectableStatCard({
  title,
  description,
  icon: Icon,
  variant = "default",
  selected,
  onClick,
  className,
}: SelectableStatCardProps) {
  const styles = variantStyles[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group w-full text-left rounded-sm transition-all",
        "ring-foreground/10 bg-card ring-1",
        "flex flex-row items-start justify-between gap-3 p-4",
        "hover:shadow-md",
        selected &&
          "ring-2 ring-[#26a246]/50 bg-[#ecfdf5]/70 shadow-sm",
        className
      )}
    >
      <div className="flex min-w-0 flex-col gap-1 pr-2">
        <span
          className={cn(
            "text-sm font-semibold leading-snug tracking-tight",
            selected ? "text-[#047857]" : "text-foreground"
          )}
        >
          {title}
        </span>
        <span className="text-xs leading-snug text-muted-foreground">
          {description}
        </span>
      </div>
      <div className={cn("shrink-0 rounded-lg p-2", styles.icon)}>
        <Icon className="size-4" aria-hidden />
      </div>
    </button>
  );
}
