"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ErrorPage({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  const isProd = process.env.NODE_ENV === "production";
  const message = isProd ? "An unexpected error occurred. Please try again." : error.message;
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
      <Card className="ring-0 w-full max-w-md">
        <CardHeader className="space-y-6 pb-6">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="bg-destructive/10 rounded-full p-4">
              <AlertCircle className="size-8 text-destructive" />
            </div>
            <div className="flex flex-col gap-2">
              <CardTitle className="text-xl font-semibold">Something went wrong</CardTitle>
              <CardDescription className="text-base">
                {message ? message : "An unexpected error occurred. Please try again."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-center">
            <Button onClick={reset} variant="default" size="default">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
