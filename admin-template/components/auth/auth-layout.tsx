"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { APP_BRAND } from "@/constants/branding";

interface AuthLayoutProps {
  title?: string;
  children: React.ReactNode;
  contentClassName?: string;
  /** Override the left panel background with an image. Falls back to the brand gradient when omitted. */
  bgImage?: string;
}

export function AuthLayout({ title=APP_BRAND.description, children, contentClassName, bgImage }: AuthLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Panel - Hero Section */}
      <div
        className={cn(
          "hidden lg:flex lg:w-1/2 relative overflow-hidden",
          !bgImage && "bg-gradient-to-br from-[#1f9e39] from-40% to-[#94c01f]"
        )}
      >
        {bgImage && (
          <Image
            src={bgImage}
            alt=""
            fill
            priority
            className="object-cover"
          />
        )}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Top Section */}
          <div className="space-y-8">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 text-sm text-white shadow-lg animate-fade-in-up"
              style={{ animationDelay: "0ms" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
              </span>
              Enterprise Operations Platform
            </div>

            {/* Heading */}
            <div className="space-y-5 max-w-lg">
              <h1
                className="text-5xl font-bold text-white tracking-tight leading-tight animate-fade-in-up"
                style={{ animationDelay: "100ms" }}
              >
                {title}
              </h1>
              <p
                className="text-white/90 text-lg leading-relaxed animate-fade-in-up"
                style={{ animationDelay: "200ms" }}
              >
                Manage your operations with institutional-grade precision.
                Available for authorized backend administrators.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex flex-col bg-background overflow-y-auto">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className={cn("w-full max-w-md", contentClassName)}>{children}</div>
        </div>

        {/* Footer */}
        <footer className="p-6 text-center border-t border-border">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <span>•</span>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              href="/security"
              className="hover:text-foreground transition-colors"
            >
              Security
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
