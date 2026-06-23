"use client";

import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
  iconClassName?: string;
}

export default function LoadingState({
  message = "Loading…",
  className = "flex flex-col items-center justify-center h-full w-full py-20",
  iconClassName = "h-10 w-10 text-primary animate-spin mb-4",
}: LoadingStateProps) {
  return (
    <div className={className}>
      <Loader2 className={iconClassName} />
      <div className="text-muted-foreground text-sm">{message}</div>
    </div>
  );
}

