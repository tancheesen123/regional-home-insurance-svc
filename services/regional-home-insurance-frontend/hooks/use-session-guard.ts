"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isSessionValid, getTimeUntilExpiry, clearSession } from "@/lib/session"

/**
 * Redirects to login if no valid session exists.
 * Also sets a timer to auto-redirect when the session expires.
 */
export function useSessionGuard(loginPath = "/") {
  const router = useRouter()

  useEffect(() => {
    // Immediate check on mount
    if (!isSessionValid()) {
      router.replace(loginPath)
      return
    }

    // Schedule auto-logout when session expires
    const msLeft = getTimeUntilExpiry()
    const timer = setTimeout(() => {
      clearSession()
      router.replace(loginPath)
    }, msLeft)

    return () => clearTimeout(timer)
  }, [router, loginPath])
}
