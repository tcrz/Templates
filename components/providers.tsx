"use client"

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

import { useEffect } from "react"
import { SessionProvider, useSession } from "next-auth/react"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/query-client"
import { USER_STORAGE_KEY } from "@/constants"

function SessionSync() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session.user))
    }
    if (status === "unauthenticated") {
      localStorage.removeItem(USER_STORAGE_KEY)
    }
  }, [status])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider refetchInterval={60*60}>
        <SessionSync />
        {children}
      </SessionProvider>
    </QueryClientProvider>
  )
}

