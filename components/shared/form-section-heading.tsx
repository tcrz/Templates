import { cn } from "@/lib/utils"

interface FormSectionHeadingProps {
  children: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
}

export function FormSectionHeading({ 
  children, 
  className,
  size = "md"
}: FormSectionHeadingProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-md",
    lg: "text-lg",
  }

  return (
    <h3 className={cn(
      "font-semibold pb-2 border-b-2 border-border",
      sizeClasses[size],
      className
    )}>
      {children}
    </h3>
  )
}
