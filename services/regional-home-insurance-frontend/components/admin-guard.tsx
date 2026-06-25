"use client"


import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { getSession } from "@/lib/session"

interface Props {
  children: React.ReactNode
}

export default function AdminGuard({ children }: Props) {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const session = getSession()

    if (!session) {
      router.replace("/")
      return
    }

    if (session.role !== "Admin") {
      router.replace("/dashboard")
      return
    }

    setAllowed(true)
  }, [router])

  if (!allowed) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return <>{children}</>
}
