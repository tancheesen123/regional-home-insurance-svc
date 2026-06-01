import type { BuildingConfigResponse } from "@/lib/api/rate-config"

// ── Types ─────────────────────────────────────────────────────────────────────

export type PropertyTypeId =
  | "bungalow"
  | "semiDetached"
  | "terrace"
  | "condo"
  | "apartment"
  | "flat"

export type ConstructionId = "fullBrick" | "partialBrick"
export type LocationId     = "prime" | "urban" | "rural"

// ── API key mapping ───────────────────────────────────────────────────────────

/**
 * Map frontend camelCase property type → API kebab-case.
 * Used when calling POST /api/rateconfig/calculate-building-cost.
 */
export function toApiPropertyType(id: PropertyTypeId): string {
  if (id === "semiDetached") return "semi-detached"
  return id
}

/**
 * Map frontend camelCase construction type → API kebab-case.
 * Used when calling POST /api/rateconfig/calculate-building-cost.
 */
export function toApiConstructionType(id: ConstructionId): string {
  if (id === "fullBrick")    return "full-brick"
  if (id === "partialBrick") return "partial-brick"
  return id
}

// ── Location tier inference (client-side, instant badge update) ───────────────

/**
 * Infer prime / urban / rural tier from a province or city name.
 *
 * Purpose: update the tier badge instantly as the user picks a province
 * from the dropdown — no round-trip needed.
 * Keywords come from GET /building-config (same DB source as the backend),
 * so client and server always agree.
 *
 * NOTE: the server's detectedLocationTier in the BCC response is the
 * authoritative value used in the actual calculation.
 */
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

// ── Unit conversion helpers ───────────────────────────────────────────────────

export const SQM_PER_SQFT = 0.092_903
export const sqftToSqm = (sqft: number) => sqft * SQM_PER_SQFT
export const sqmToSqft = (sqm: number)  => sqm  / SQM_PER_SQFT

// ── Display data ──────────────────────────────────────────────────────────────

/** All property type IDs in display order */
export const PROPERTY_TYPE_IDS: PropertyTypeId[] = [
  "bungalow", "semiDetached", "terrace", "condo", "apartment", "flat",
]

/** Emoji per property type */
export const PROPERTY_TYPE_EMOJI: Record<PropertyTypeId, string> = {
  bungalow:     "🏡",
  semiDetached: "🏘️",
  terrace:      "🏠",
  condo:        "🏢",
  apartment:    "🏬",
  flat:         "🏗️",
}
