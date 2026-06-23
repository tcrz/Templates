"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn, formatAsAmount } from "@/lib/utils";

export type AmountCardTheme = "emerald" | "sky" | "red";

const themeClasses: Record<
  AmountCardTheme,
  {
    border: string;
    /** Diagonal gradient from top-left toward bottom-right */
    gradient: string;
    iconBox: string;
    amount: string;
    footerBorder: string;
  }
> = {
  emerald: {
    border: "border-emerald-200/80",
    gradient:
      "bg-gradient-to-br from-emerald-100/70 from-0% via-emerald-50/35 via-45% to-white to-100%",
    iconBox: "bg-emerald-600 text-white shadow-sm",
    amount: "text-emerald-700",
    footerBorder: "border-emerald-100/80",
  },
  sky: {
    border: "border-sky-200/80",
    gradient:
      "bg-gradient-to-br from-sky-100/70 from-0% via-sky-50/35 via-45% to-white to-100%",
    iconBox: "bg-sky-600 text-white shadow-sm",
    amount: "text-sky-700",
    footerBorder: "border-sky-100/80",
  },
  red: {
    border: "border-red-200/80",
    gradient:
      "bg-gradient-to-br from-red-100/70 from-0% via-red-50/35 via-45% to-white to-100%",
    iconBox: "bg-red-600 text-white shadow-sm",
    amount: "text-red-700",
    footerBorder: "border-red-100/80",
  },
};

export interface AmountCardProps {
  title: string;
  description: string;
  amount: number;
  footer?: ReactNode;
  theme?: AmountCardTheme;
  icon: LucideIcon;
  className?: string;
}

export function AmountCard({
  title,
  description,
  amount,
  footer,
  theme = "emerald",
  icon: Icon,
  className,
}: AmountCardProps) {
  const t = themeClasses[theme];

  return (
    <div
      className={cn(
        "rounded-lg border p-5 shadow-sm flex flex-col gap-4 min-w-0 w-full max-w-[390px] min-h-[150px]",
        t.border,
        t.gradient,
        className
      )}
    >
      <div className="flex gap-3.5 items-start">
        <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-md", t.iconBox)}>
          <Icon className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-foreground leading-tight">
            {title}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {description}
          </p>
        </div>
      </div>

      <p className={cn("text-2xl font-bold tracking-tight", t.amount)}>
        {formatAsAmount(amount)}
      </p>

      {footer && (
        <div className={cn("border-t pt-3.5 text-sm", t.footerBorder)}>
          {footer}
        </div>
      )}
    </div>
  );
}
