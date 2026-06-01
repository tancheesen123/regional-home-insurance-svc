import { request, APIResponse } from "./client"

export interface CustomerAddress {
  addressLine1: string
  addressLine2: string
  city: string
  postcode: string
  state: string
  country: string
}

export interface CustomerData {
  customerId: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  nationality: string
  idType: string
  idNumber: string
  contact: string
  email: string
  region: string
  userId: string
  profilePictureUrl: string | null
  address: CustomerAddress | null
}

export interface UpdateCustomerRequest {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  nationality: string
  idType: string
  idNumber: string
  contact: string
  address: CustomerAddress
}

export async function getCustomerByUserId(
  userId: string
): Promise<APIResponse<CustomerData>> {
  return request<CustomerData>("/Customer/GetCustomerByUserId", {
    method: "POST",
    body: JSON.stringify({ userId }),
  })
}

export async function updateCustomerData(
  userId: string,
  requestBody: UpdateCustomerRequest,
  countryCode: string
): Promise<APIResponse<null>> {
  return request<null>("/customer/UpdateCustomerData", {
    method: "POST",
    headers: { "X-Country-Code": countryCode },
    body: JSON.stringify({ userId, request: requestBody }),
  })
}
