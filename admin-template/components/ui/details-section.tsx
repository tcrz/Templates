import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface DetailItem {
  label: string;
  value?: string | number | null | React.ReactNode;
}

interface DetailsSectionProps {
  heading: string;
  subtitle?: string;
  items: DetailItem[];
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  headerAction?: React.ReactNode;
}

const columnClasses = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

function renderValue(value: DetailItem["value"]) {
  if (value === null || value === undefined) {
    return "-";
  }

  if (React.isValidElement(value)) {
    return value;
  }

  return String(value);
}

export function DetailsSection({
  heading,
  subtitle,
  items,
  className,
  columns = 2,
  headerAction,
}: DetailsSectionProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle>{heading}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </div>
        {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
      </CardHeader>
      <CardContent>
        <div className={cn("grid grid-cols-1 gap-4", columnClasses[columns])}>
          {items.map((item, index) => (
            <div key={index} className="flex flex-col gap-1">
              <div className="text-sm font-medium text-muted-foreground">
                {item.label}
              </div>
              <div className="text-sm text-foreground">
                {renderValue(item.value)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
