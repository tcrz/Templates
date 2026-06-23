"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const stepNumber = index + 1;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex items-center justify-center size-8 rounded-full text-sm font-medium transition-colors",
                  isActive && "bg-primary text-white",
                  isCompleted && "bg-primary text-white",
                  !isActive && !isCompleted && "bg-muted text-muted-foreground border border-border"
                )}
              >
                {stepNumber}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  isActive && "text-foreground",
                  isCompleted && "text-foreground",
                  !isActive && !isCompleted && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-[2px] mx-3 -mt-6",
                  index < currentStep ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
