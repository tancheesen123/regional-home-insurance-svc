"use client"

import { useSessionGuard } from "@/hooks/use-session-guard"

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  useSessionGuard("/")
  return <>{children}</>
}
