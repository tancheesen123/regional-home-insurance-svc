import { getSession, clearSession } from "@/lib/session"

const BASE_URL = "https://localhost:44337/api"

export interface APIResponse<T = unknown> {
  succeeded: boolean
  data: T
  message: string | null
}

interface RequestOptions extends RequestInit {
  withAuth?: boolean
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<APIResponse<T>> {
  const { withAuth = true, headers: extraHeaders, ...rest } = options

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string>),
  }

  if (withAuth) {
    const session = getSession()
    if (!session) {
      clearSession()
      if (typeof window !== "undefined") window.location.href = "/"
      throw new Error("Session expired")
    }
    headers["Authorization"] = `Bearer ${session.token}`
    headers["X-Country-Code"] = session.countryCode
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    headers,
  })

  // Only force-logout on 401 for authenticated requests.
  // Public endpoints (e.g. login) return 401 for bad credentials — let the caller handle it.
  if (res.status === 401 && withAuth) {
    clearSession()
    if (typeof window !== "undefined") window.location.href = "/"
    throw new Error("Unauthorized")
  }

  const data: APIResponse<T> = await res.json()
  return data
}
