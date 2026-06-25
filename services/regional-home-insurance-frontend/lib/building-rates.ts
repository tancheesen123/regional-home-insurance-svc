import type { BuildingConfigResponse } from "@/lib/api/rate-config"


export type PropertyTypeId =
  | "bungalow"
  | "semiDetached"
  | "terrace"
  | "condo"
  | "apartment"
  | "flat"

export type ConstructionId = "fullBrick" | "partialBrick"
export type LocationId     = "prime" | "urban" | "rural"


export function toApiPropertyType(id: PropertyTypeId): string {
  if (id === "semiDetached") return "semi-detached"
  return id
}

export function toApiConstructionType(id: ConstructionId): string {
  if (id === "fullBrick")    return "full-brick"
  if (id === "partialBrick") return "partial-brick"
  return id
}


export function inferLocationTier(
  provinceName: string,
  locationTiers: BuildingConfigResponse["locationTiers"],
): LocationId {
  const n = provinceName.toLowerCase()
  for (const tier of ["prime", "urban"] as const) {
    if (locationTiers[tier].keywords.some((kw) => n.includes(kw.toLowerCase()))) return tier
  }
  return "rural"
}


export const SQM_PER_SQFT = 0.092_903
export const sqftToSqm = (sqft: number) => sqft * SQM_PER_SQFT
export const sqmToSqft = (sqm: number)  => sqm  / SQM_PER_SQFT


export const PROPERTY_TYPE_IDS: PropertyTypeId[] = [
  "bungalow", "semiDetached", "terrace", "condo", "apartment", "flat",
]

export const PROPERTY_TYPE_EMOJI: Record<PropertyTypeId, string> = {
  bungalow:     "🏡",
  semiDetached: "🏘️",
  terrace:      "🏠",
  condo:        "🏢",
  apartment:    "🏬",
  flat:         "🏗️",
}
