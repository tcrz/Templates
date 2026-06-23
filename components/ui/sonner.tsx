"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckCircle2, Info, AlertTriangle, XCircle, Loader2 } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      className="toaster group"
      visibleToasts={1}
      icons={{
        success: (
          <CheckCircle2 className="size-4" />
        ),
        info: (
          <Info className="size-4" />
        ),
        warning: (
          <AlertTriangle className="size-4" />
        ),
        error: (
          <XCircle className="size-4" />
        ),
        loading: (
          <Loader2 className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast group",
          error: "!border-destructive !bg-red-50 !text-destructive dark:!bg-red-950",
          success: "!border-green-500 !bg-green-50 !text-green-600 dark:!bg-green-950 dark:!text-green-400",
          warning: "!border-yellow-500 !bg-yellow-50 !text-yellow-600 dark:!bg-yellow-950 dark:!text-yellow-400",
          info: "!border-blue-500 !bg-blue-50 !text-blue-600 dark:!bg-blue-950 dark:!text-blue-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
