"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isSessionValid, getTimeUntilExpiry, clearSession } from "@/lib/session"

export function useSessionGuard(loginPath = "/") {
  const router = useRouter()

  useEffect(() => {
    if (!isSessionValid()) {
      router.replace(loginPath)
      return
    }

    const msLeft = getTimeUntilExpiry()
    const timer = setTimeout(() => {
      clearSession()
      router.replace(loginPath)
    }, msLeft)

    return () => clearTimeout(timer)
  }, [router, loginPath])
}
