const SESSION_KEY = "etiqa_session"

export type UserRole = "User" | "Admin"

export interface Session {
  email: string
  userId: string
  customerId: string
  country: string
  countryCode: string
  role: UserRole
  token: string
  loginAt: number
  expiresAt: number
  rememberMe: boolean
}

export function setSession(
  data: {
    email: string
    userId: string
    customerId: string
    country: string
    countryCode: string
    role: UserRole
    token: string
    expiresAt: string
  },
  rememberMe: boolean
): void {
  const session: Session = {
    email: data.email,
    userId: data.userId,
    customerId: data.customerId,
    country: data.country,
    countryCode: data.countryCode,
    role: data.role,
    token: data.token,
    loginAt: Date.now(),
    expiresAt: new Date(data.expiresAt).getTime(),
    rememberMe,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null

  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null

  try {
    const session: Session = JSON.parse(raw)
    if (Date.now() > session.expiresAt) {
      clearSession()
      return null
    }
    return session
  } catch {
    clearSession()
    return null
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(SESSION_KEY)
}

export function isSessionValid(): boolean {
  return getSession() !== null
}

export function getTimeUntilExpiry(): number {
  const session = getSession()
  if (!session) return 0
  return Math.max(0, session.expiresAt - Date.now())
}
