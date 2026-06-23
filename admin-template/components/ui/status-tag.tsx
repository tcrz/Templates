"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

interface StatusTagProps {
  status: string;
  variant: "default" | "success" | "warning" | "error" | "info" | "secondary" | "purple" | "orange";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusTag({
  status,
  variant,
  size = "md",
  className,
}: StatusTagProps) {

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  };

  const variantClasses = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    secondary: "bg-gray-50 text-gray-600 border-gray-300",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
  };

  return (
    <Badge
      className={cn(
        variantClasses[variant ?? "default"],
        className
      )}
      style={{ textTransform: "capitalize" }}
    >
      {status ?? "Not Available"}
    </Badge>
  );
}

