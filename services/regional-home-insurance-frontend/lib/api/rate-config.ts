import { getSession, clearSession } from "@/lib/session"

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:44337"}/api`

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * One row from the building_rates table.
 * Backend fields: id, region, propertySubType, constructionType ("full-brick"|"partial-brick"), ratePerUnit, isActive
 */
export interface BuildingRateRow {
  id: string
  region: string                    // e.g. "MY" | "ID" | "PH" | "KH"
  propertySubType: string           // "bungalow" | "semi-detached" | "terrace" | "condo" | "apartment" | "flat"
  constructionType: string          // "full-brick" | "partial-brick"
  ratePerUnit: number
  isActive: boolean
}

/**
 * Region config — singular object (not array) in the GET /configs response.
 * Backend fields: id, region, areaUnit, areaMin, areaMax, storeyIncrementPct,
 *                 maxStoreys, professionalFeeRate, benchmarkYear, isActive
 */
export interface RegionConfigRow {
  id: string
  region: string
  areaUnit: string                  // "sqft" | "sqm"
  areaMin: number
  areaMax: number
  storeyIncrementPct: number        // e.g. 0.05 = 5 %
  maxStoreys: number
  professionalFeeRate: number       // e.g. 0.10 = 10 %
  benchmarkYear: number
  buildingRate: number               // premium rate per RM/unit of building sum insured
  contentRate: number                // premium rate per RM/unit of content sum insured
  isActive: boolean
}

/**
 * One row from the location_tiers table.
 * Backend fields: id, region, tier, multiplier, label, keywords, isActive
 */
export interface LocationTierRow {
  id: string
  region: string
  tier: "prime" | "urban" | "rural"
  multiplier: number
  label: string
  keywords: string[]
  isActive: boolean
}

/**
 * One row from the risk_multipliers table.
 * Backend fields: id, region, factorKey, multiplier, description, isActive
 */
export interface RiskMultiplierRow {
  id: string
  region: string
  factorKey: string                 // machine key e.g. "risk.flooding", "construction.partial-brick"
  multiplier: number
  description: string
  isActive: boolean
}

/**
 * Shape of GET /api/rateconfig/configs response (per-country).
 * Note: regionConfig is a single object, not an array.
 */
export interface RateConfigsResponse {
  buildingRates:   BuildingRateRow[]
  regionConfig:    RegionConfigRow        // singular object
  locationTiers:   LocationTierRow[]
  riskMultipliers: RiskMultiplierRow[]
}

// ─── Audit / History types ────────────────────────────────────────────────────

/** One field-level change recorded inside a snapshot */
export interface ChangeLogEntry {
  id: string
  tableName: string   // e.g. "BuildingConstructionRates"
  recordId: string
  fieldName: string   // e.g. "single-detached / full-brick → RatePerUnit"
  oldValue: string
  newValue: string
  changedBy: string
  changedAt: string   // ISO-8601
}

/** Row returned by GET /api/rateconfig/snapshots (changeLogs is always empty here) */
export interface SnapshotListItem {
  id: string
  region: string
  label: string
  snapshotType: "auto" | "manual" | "restored"
  createdBy: string
  createdAt: string   // ISO-8601
  changeLogs: []
}

/** Full snapshot with diff detail — returned by GET /api/rateconfig/snapshots/{id} */
export interface SnapshotDetail extends Omit<SnapshotListItem, "changeLogs"> {
  changeLogs: ChangeLogEntry[]
}

/** Response from POST /api/rateconfig/restore/{id} */
export interface RestoreResult {
  restoredSnapshotId: string
  fieldsReverted: number
  message: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAdminHeaders(countryCode?: string): Record<string, string> {
  const session = getSession()
  if (!session) {
    clearSession()
    if (typeof window !== "undefined") window.location.href = "/"
    throw new Error("Session expired")
  }
  return {
    "Content-Type":  "application/json",
    Authorization:   `Bearer ${session.token}`,
    "X-Country-Code": countryCode ?? session.countryCode,
  }
}

function handle401(): never {
  clearSession()
  if (typeof window !== "undefined") window.location.href = "/"
  throw new Error("Unauthorized")
}

// ─── API calls ────────────────────────────────────────────────────────────────

/**
 * GET /api/rateconfig/configs
 * Returns config for ONE country (filtered by X-Country-Code header).
 * Call once per country to get all regions.
 */
export async function fetchRateConfigs(countryCode: string): Promise<RateConfigsResponse> {
  const headers = getAdminHeaders(countryCode)
  const res = await fetch(`${BASE_URL}/rateconfig/configs`, { headers })
  if (res.status === 401) handle401()
  if (!res.ok) throw new Error(`Failed to fetch rate configs for ${countryCode} (${res.status})`)
  return res.json()
}

/**
 * Fetch configs for all supported countries in parallel.
 * Returns a map of countryCode → RateConfigsResponse (nulls are omitted).
 */
export async function fetchAllRateConfigs(
  countries: string[],
): Promise<Record<string, RateConfigsResponse>> {
  const results = await Promise.allSettled(
    countries.map(async (cc) => ({ cc, data: await fetchRateConfigs(cc) })),
  )
  const map: Record<string, RateConfigsResponse> = {}
  for (const r of results) {
    if (r.status === "fulfilled") {
      map[r.value.cc] = r.value.data
    }
    // silently skip countries that 404 / haven't been seeded yet
  }
  return map
}

/**
 * PUT /api/rateconfig/building-rates
 * Batch update — send one or all rows in a single call.
 * Entire batch is rejected if any entry has an invalid id or ratePerUnit ≤ 0.
 */
export async function updateBuildingRates(
  rates: { id: string; ratePerUnit: number }[],
  countryCode: string,
): Promise<{ updatedCount: number; updated: BuildingRateRow[]; errors: string[] }> {
  const headers = getAdminHeaders(countryCode)
  const res = await fetch(`${BASE_URL}/rateconfig/building-rates`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ rates }),
  })
  if (res.status === 401) handle401()
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = (err.errors as string[] | undefined)?.join(" · ")
      ?? err.message
      ?? `Failed to update building rates (${res.status})`
    throw new Error(msg)
  }
  return res.json()
}

/** PUT /api/rateconfig/region-config/{id} */
export async function updateRegionConfig(
  id: string,
  data: {
    areaMin?: number
    areaMax?: number
    storeyIncrementPct?: number
    maxStoreys?: number
    professionalFeeRate?: number
    benchmarkYear?: number
    buildingRate?: number
    contentRate?: number
  },
  countryCode: string,
): Promise<void> {
  const headers = getAdminHeaders(countryCode)
  const res = await fetch(`${BASE_URL}/rateconfig/region-config/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  })
  if (res.status === 401) handle401()
  if (res.status === 404) throw new Error("not_found")
  if (!res.ok) throw new Error(`Failed to update region config (${res.status})`)
}

/** PUT /api/rateconfig/location-tiers/{id} — single row */
export async function updateLocationTier(
  id: string,
  data: {
    multiplier?: number
    label?: string
    keywords?: string[]
  },
  countryCode: string,
): Promise<void> {
  const headers = getAdminHeaders(countryCode)
  const res = await fetch(`${BASE_URL}/rateconfig/location-tiers/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  })
  if (res.status === 401) handle401()
  if (res.status === 404) throw new Error("not_found")
  if (!res.ok) throw new Error(`Failed to update location tier (${res.status})`)
}

/**
 * PUT /api/rateconfig/location-tiers
 * Batch update — send all changed tiers in a single request so the backend
 * creates exactly ONE snapshot for the entire "Save All" operation.
 * All three fields (multiplier, label, keywords) are optional per row;
 * omitting a field leaves that column unchanged.
 * Entire batch is rejected (400 + errors[]) if any id is invalid.
 */
export async function updateLocationTiersBatch(
  tiers: { id: string; multiplier?: number; label?: string; keywords?: string[] }[],
  countryCode: string,
): Promise<{ updatedCount: number; updated: LocationTierRow[]; errors: string[] }> {
  const headers = getAdminHeaders(countryCode)
  const res = await fetch(`${BASE_URL}/rateconfig/location-tiers`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ tiers }),
  })
  if (res.status === 401) handle401()
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = (err.errors as string[] | undefined)?.join(" · ")
      ?? (err as { message?: string }).message
      ?? `Failed to update location tiers (${res.status})`
    throw new Error(msg)
  }
  return res.json()
}

/** PUT /api/rateconfig/risk-multipliers/{id} — single row */
export async function updateRiskMultiplier(
  id: string,
  data: { multiplier: number; description?: string },
  countryCode: string,
): Promise<void> {
  const headers = getAdminHeaders(countryCode)
  const res = await fetch(`${BASE_URL}/rateconfig/risk-multipliers/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  })
  if (res.status === 401) handle401()
  if (res.status === 404) throw new Error("not_found")
  if (!res.ok) throw new Error(`Failed to update risk multiplier (${res.status})`)
}

/**
 * PUT /api/rateconfig/risk-multipliers
 * Batch update — send all changed multipliers in a single request so the backend
 * creates exactly ONE snapshot for the entire "Save All" operation.
 * multiplier must be > 0; description is optional (omitting leaves it unchanged).
 * Entire batch is rejected (400 + errors[]) if any id is invalid or multiplier ≤ 0.
 */
export async function updateRiskMultipliersBatch(
  multipliers: { id: string; multiplier: number; description?: string }[],
  countryCode: string,
): Promise<{ updatedCount: number; updated: RiskMultiplierRow[]; errors: string[] }> {
  const headers = getAdminHeaders(countryCode)
  const res = await fetch(`${BASE_URL}/rateconfig/risk-multipliers`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ multipliers }),
  })
  if (res.status === 401) handle401()
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = (err.errors as string[] | undefined)?.join(" · ")
      ?? (err as { message?: string }).message
      ?? `Failed to update risk multipliers (${res.status})`
    throw new Error(msg)
  }
  return res.json()
}

/**
 * POST /api/rateconfig/seed
 * Seeds initial values for the given country (idempotent — safe to call multiple times).
 * Returns { seeded: boolean, message: string }
 */
export async function seedRateConfig(
  countryCode: string,
): Promise<{ seeded: boolean; message: string }> {
  const session = getSession()
  if (!session) { clearSession(); throw new Error("Session expired") }
  const res = await fetch(`${BASE_URL}/rateconfig/seed`, {
    method: "POST",
    headers: {
      "Content-Type":   "application/json",
      Authorization:    `Bearer ${session.token}`,
      "X-Country-Code": countryCode,
    },
  })
  if (res.status === 401) handle401()
  if (!res.ok) throw new Error(`Seed failed for ${countryCode} (${res.status})`)
  return res.json()
}

// ─── Audit / History API ──────────────────────────────────────────────────────

/** GET /api/rateconfig/snapshots — all snapshots for the region, newest first */
export async function fetchSnapshots(countryCode: string): Promise<SnapshotListItem[]> {
  const headers = getAdminHeaders(countryCode)
  const res = await fetch(`${BASE_URL}/rateconfig/snapshots`, { headers })
  if (res.status === 401) handle401()
  if (!res.ok) throw new Error(`Failed to fetch snapshots (${res.status})`)
  return res.json()
}

/** GET /api/rateconfig/snapshots/{id} — single snapshot with full change-log detail */
export async function fetchSnapshot(snapshotId: string, countryCode: string): Promise<SnapshotDetail> {
  const headers = getAdminHeaders(countryCode)
  const res = await fetch(`${BASE_URL}/rateconfig/snapshots/${encodeURIComponent(snapshotId)}`, { headers })
  if (res.status === 401) handle401()
  if (res.status === 404) throw new Error("Snapshot not found")
  if (!res.ok) throw new Error(`Failed to fetch snapshot (${res.status})`)
  return res.json()
}

/**
 * GET /api/rateconfig/change-logs?page=1&pageSize=50
 * Paginated field-level audit trail, newest first. Max pageSize = 200.
 */
export async function fetchChangeLogs(
  countryCode: string,
  page = 1,
  pageSize = 50,
): Promise<ChangeLogEntry[]> {
  const headers = getAdminHeaders(countryCode)
  const res = await fetch(
    `${BASE_URL}/rateconfig/change-logs?page=${page}&pageSize=${pageSize}`,
    { headers },
  )
  if (res.status === 401) handle401()
  if (!res.ok) throw new Error(`Failed to fetch change logs (${res.status})`)
  return res.json()
}

// ─── Building Config + BCC (public — any logged-in user) ─────────────────────

export interface BuildingConfigTier {
  multiplier: number
  label: string
  keywords: string[]
}

/**
 * Shape of GET /api/rateconfig/building-config
 * One country at a time (filtered by X-Country-Code header).
 * rates keys: "bungalow" | "semi-detached" | "terrace" | "condo" | "apartment" | "flat"
 * rates[key]: { fullBrick: number; partialBrick: number }  (API returns camelCase rate keys)
 */
export interface BuildingConfigResponse {
  countryCode: string
  areaUnit: string              // "sqm" | "sqft"
  areaMin: number
  areaMax: number
  storeyIncrementPct: number    // e.g. 0.05 = 5 %
  maxStoreys: number
  professionalFeeRate: number   // e.g. 0.10 = 10 %
  benchmarkYear: number
  locationTiers: {
    prime: BuildingConfigTier
    urban: BuildingConfigTier
    rural: BuildingConfigTier
  }
  rates: Record<string, { fullBrick: number; partialBrick: number }>
}

export interface BccRequest {
  propertySubType:  string   // kebab-case: "semi-detached" | "bungalow" | …
  constructionType: string   // "full-brick" | "partial-brick"
  floorArea:        number
  numberOfStoreys:  number
  province:         string   // free text — backend does keyword matching
  // Classification (all optional — defaults shown)
  ageOfBuilding?:   "1to10" | "11to20" | "21to30" | "30plus"   // default "1to10"
  quality?:         "low" | "standard" | "high"                 // default "standard"
  topography?:      "flat" | "slope"                            // default "flat"
  siteSurrounding?: "normal" | "confined" | "city-centre"       // default "normal"
  // Cost add-ons (all optional, default 0)
  furnitureCost?:       number
  featuresCost?:        number   // lifts + AC combined
  externalRenovation?:  number
  internalRenovation?:  number
  improvedFinishes?:    number
}

export interface BccResponse {
  propertySubType:      string
  constructionType:     string
  floorArea:            number
  areaUnit:             string
  benchmarkYear:        number
  baseRatePerUnit:      number
  rawConstructionCost:  number
  // Classification adjustments
  ageOfBuilding:        string
  ageFactor:            number
  quality:              string
  qualityMultiplier:    number
  topography:           string
  topographyFactor:     number
  siteSurrounding:      string
  siteFactor:           number
  classifiedCost:       number
  // Storey
  numberOfStoreys:      number
  storeyIncrementPct:   number
  storeyLoading:        number
  storeyAdjustedCost:   number
  // Location
  detectedLocationTier: string
  locationMultiplier:   number
  locationAdjustedCost: number
  // Fees
  professionalFeeRate:  number
  professionalFee:      number
  // Add-ons
  furnitureCost:        number
  featuresCost:         number
  externalRenovation:   number
  internalRenovation:   number
  improvedFinishes:     number
  totalAddOns:          number
  // Final
  totalRebuildingCost:  number
}

/**
 * GET /api/rateconfig/building-config
 * Public — any logged-in user (not admin-only).
 * Returns live rates + tier config for one country. Call on page load.
 */
export async function fetchBuildingConfig(countryCode: string): Promise<BuildingConfigResponse> {
  const session = getSession()
  if (!session) {
    clearSession()
    if (typeof window !== "undefined") window.location.href = "/"
    throw new Error("Session expired")
  }
  const res = await fetch(`${BASE_URL}/rateconfig/building-config`, {
    headers: {
      Authorization:    `Bearer ${session.token}`,
      "X-Country-Code": countryCode,
    },
  })
  if (res.status === 401) handle401()
  if (!res.ok) throw new Error(`Failed to fetch building config (${res.status})`)
  return res.json()
}

/**
 * POST /api/rateconfig/calculate-building-cost
 * Public — any logged-in user (not admin-only).
 * Returns a server-authoritative full cost breakdown.
 * Pass totalRebuildingCost to onConfirm() to pre-fill BuildingSum in CustomizePlan.
 */
export async function calculateBuildingCost(
  countryCode: string,
  params: BccRequest,
): Promise<BccResponse> {
  const session = getSession()
  if (!session) {
    clearSession()
    if (typeof window !== "undefined") window.location.href = "/"
    throw new Error("Session expired")
  }
  const res = await fetch(`${BASE_URL}/rateconfig/calculate-building-cost`, {
    method: "POST",
    headers: {
      "Content-Type":   "application/json",
      Authorization:    `Bearer ${session.token}`,
      "X-Country-Code": countryCode,
    },
    body: JSON.stringify(params),
  })
  if (res.status === 401) handle401()
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      (err as { message?: string }).message ?? `Calculation failed (${res.status})`,
    )
  }
  return res.json()
}

/**
 * POST /api/rateconfig/restore/{snapshotId}
 * Immediately overwrites live config with snapshot values.
 * Backend auto-creates a new "restored" snapshot for audit trail.
 */
export async function restoreSnapshot(
  snapshotId: string,
  note: string | undefined,
  countryCode: string,
): Promise<RestoreResult> {
  const headers = getAdminHeaders(countryCode)
  const res = await fetch(`${BASE_URL}/rateconfig/restore/${encodeURIComponent(snapshotId)}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ note: note ?? "" }),
  })
  if (res.status === 401) handle401()
  if (res.status === 404) throw new Error("Snapshot not found")
  if (!res.ok) throw new Error(`Restore failed (${res.status})`)
  return res.json()
}
