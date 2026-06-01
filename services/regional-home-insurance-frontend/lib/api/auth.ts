import { request, APIResponse } from "./client"

// ── Login ────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginData {
  token: string
  userId: string
  email: string
  role: string
  expiresAt: string
}

export async function login(
  payload: LoginPayload,
  countryCode: string
): Promise<APIResponse<LoginData>> {
  return request<LoginData>("/auth/Login", {
    method: "POST",
    withAuth: false,
    headers: { "X-Country-Code": countryCode },
    body: JSON.stringify(payload),
  })
}

// ── Register ─────────────────────────────────────────────────────────────────

export interface RegisterAddress {
  addressLine1: string
  addressLine2: string
  city: string
  postcode: string
  state: string
  country: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  dateOfBirth: string
  gender: string
  nationality: string
  idType: string
  idNumber: string
  contact: string
  region: string
  address: RegisterAddress
}

export interface RegisterData {
  userId: string
  email: string
  message: string
}

export async function register(
  payload: RegisterPayload,
  countryCode: string
): Promise<APIResponse<RegisterData>> {
  return request<RegisterData>("/auth/Register", {
    method: "POST",
    withAuth: false,
    headers: { "X-Country-Code": countryCode },
    body: JSON.stringify(payload),
  })
}
