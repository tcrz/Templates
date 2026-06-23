import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs"

import { User } from "next-auth"
import { USER_STORAGE_KEY } from "@/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null, {includeTime = false}: {includeTime?: boolean} = {}): string {
  if (!date) return "-"
  return dayjs(date).format(includeTime ? "DD MMM YYYY HH:mm" : "DD MMM YYYY")
}

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined || value === "") {
    return true
  }
  return false
}

export function parseMetadata<T>(metadata: string): T | null {
  if (typeof metadata === "string") {
    try {
      return JSON.parse(metadata) as T
    } catch {
      return null
    }
  }
  return metadata
}

export function formatNumber(value: number | string| undefined): string {
  if (value === undefined || value === null || isNaN(Number(value))) return "0"
  return Number(value).toLocaleString('en-US')
}

export function formatAsAmount(value: number | string| undefined): string {
  if (value === undefined || value === null || isNaN(Number(value))) return "-"
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value))
}

export function formatPercentage(value: number | undefined): string {
  if (value === undefined || value === null) return "0%"
  return `${value.toFixed(2)}%`
}

export function getUserFromStorage(): User | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem(USER_STORAGE_KEY)
  return user ? JSON.parse(user) : null
}

const PREVIEWABLE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".bmp",
  ".pdf",
];

export function getFileExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const ext = pathname.substring(pathname.lastIndexOf(".")).toLowerCase();
    return ext;
  } catch {
    const ext = url.substring(url.lastIndexOf(".")).toLowerCase();
    return ext;
  }
}

export function isPreviewable(url: string): boolean {
  const ext = getFileExtension(url);
  return PREVIEWABLE_EXTENSIONS.includes(ext);
}

export function isImage(url: string): boolean {
  const ext = getFileExtension(url);
  return [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"].includes(ext);
}

export function isPdf(url: string): boolean {
  const ext = getFileExtension(url);
  return ext === ".pdf";
}