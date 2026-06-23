import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { Loader2, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-lg border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-[3px] aria-invalid:ring-[3px] [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:brightness-[0.95] dark:hover:brightness-[1.05]",
        outline: "border-primary text-primary bg-background hover:bg-primary hover:text-primary-foreground dark:border-primary/50 dark:hover:bg-primary/90 dark:hover:text-primary-foreground aria-expanded:bg-primary aria-expanded:text-primary-foreground",
        secondary: "bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30 aria-expanded:bg-primary/20 dark:aria-expanded:bg-primary/30 aria-expanded:text-primary dark:aria-expanded:text-primary-foreground",
        ghost: "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive: "bg-red-600 hover:bg-red-700 text-white focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 focus-visible:border-destructive/40 dark:hover:bg-destructive/30",
        warning: "bg-orange-400 hover:bg-orange-500 text-white border-orange-300 focus-visible:ring-orange-200 dark:focus-visible:ring-orange-400",
        "warning-outline": "border-orange-400 text-orange-400 bg-orange-50 hover:bg-orange-400 hover:text-white dark:border-orange-400 dark:hover:bg-orange-400 dark:hover:text-white focus-visible:ring-orange-200 dark:focus-visible:ring-orange-400",
        info: "bg-blue-400 hover:bg-blue-500 text-white border-blue-300 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-400",
        "info-outline": "border-blue-400 text-blue-400 bg-background hover:bg-blue-400 hover:text-white dark:border-blue-400 dark:hover:bg-blue-400 dark:hover:text-white focus-visible:ring-blue-200 dark:focus-visible:ring-blue-400",
        "info-alt": "bg-blue-100 text-blue-600 hover:bg-blue-200/90 border-transparent focus-visible:ring-blue-200 dark:bg-blue-900/25 dark:text-blue-400 dark:hover:bg-blue-800/30 [&_svg]:text-blue-600 dark:[&_svg]:text-blue-400",
        purple: "bg-purple-400 hover:bg-purple-500 text-white border-purple-300 focus-visible:ring-purple-200 dark:focus-visible:ring-purple-400",
        "purple-outline": "border-purple-400 text-purple-400 bg-background hover:bg-purple-400 hover:text-white dark:border-purple-400 dark:hover:bg-purple-400 dark:hover:text-white focus-visible:ring-purple-200 dark:focus-visible:ring-purple-400",
        success: "bg-green-600 hover:bg-green-700 text-white border-green-500 focus-visible:ring-green-200 dark:focus-visible:ring-green-400",
        slate: "bg-slate-400 hover:bg-slate-500 text-white border-slate-300 focus-visible:ring-slate-200 dark:focus-visible:ring-slate-400",
        "slate-outline": "border-slate-400 text-slate-400 bg-background hover:bg-slate-400 hover:text-white dark:border-slate-400 dark:hover:bg-slate-400 dark:hover:text-white focus-visible:ring-slate-200 dark:focus-visible:ring-slate-400",
        indigo: "bg-indigo-400 hover:bg-indigo-500 text-white border-indigo-300 focus-visible:ring-indigo-200 dark:focus-visible:ring-indigo-400",
        "indigo-outline": "border-indigo-400 text-indigo-400 bg-background hover:bg-indigo-400 hover:text-white dark:border-indigo-400 dark:hover:bg-indigo-400 dark:hover:text-white focus-visible:ring-indigo-200 dark:focus-visible:ring-indigo-400",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-7 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-1.5 px-3.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9",
        "icon-xs": "size-7 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  icon,
  iconPosition = "start",
  children,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
    icon?: LucideIcon
    iconPosition?: "start" | "end"
  }) {
  const Comp = asChild ? Slot.Root : "button"

  const renderIcon = () => {
    if (loading) {
      return (
        <Loader2
          className="animate-spin [&_svg]:pointer-events-auto"
        />
      )
    }
    if (icon) {
      const Icon = icon
      return (
        <Icon />
      )
    }
    return null
  }

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {iconPosition === "start" && renderIcon()}
      {children}
      {iconPosition === "end" && renderIcon()}
    </Comp>
  )
}

export { Button, buttonVariants }
