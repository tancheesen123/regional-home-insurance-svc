import { request, APIResponse } from "./client"

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginData {
  token: string
  userId: string
  email: string
  expiresAt: string
}

export async function login(
  payload: LoginPayload,
  countryCode: string
): Promise<APIResponse<LoginData>> {
  return request<LoginData>("/auth/Login", {
    method: "POST",
    withAuth: false,  // login endpoint doesn't require token
    headers: {
      "X-Country-Code": countryCode,
    },
    body: JSON.stringify(payload),
  })
}
