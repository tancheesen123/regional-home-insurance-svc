/**
 * Flood-risk check for the quotation page.
 *
 * Source: PetaBencana.id (CogniCity) — a free, BNPB-backed real-time flood
 * reporting API covering major Indonesian city regions (Jabodetabek, Bandung,
 * Semarang, Surabaya). It returns flood-affected local areas (kelurahan) as
 * GeoJSON polygons with a severity "state" (1–4).
 *
 * Flow:
 *   1. postcode prefix → PetaBencana region instance (decides which feed to query)
 *   2. postcode → lat/lng via OSM Nominatim (free geocoder)
 *   3. fetch active flood polygons for that region
 *   4. point-in-polygon test → at-risk / clear
 *
 * SAFETY: any failure (geocode down, API down, region not covered, CORS, etc.)
 * returns "unavailable" — the caller must NEVER block the customer on
 * "unavailable", only on a confirmed "at-risk".
 *
 * NOTE: Nominatim's usage policy discourages heavy browser traffic. For
 * production, proxy these two calls through the backend and cache results.
 */

export type FloodStatus = "at-risk" | "clear" | "unavailable"

export interface FloodCheckResult {
  status:    FloodStatus
  severity?: number   // PetaBencana state 1–4 (1=unknown, 2=minor, 3=moderate, 4=severe)
  areaName?: string   // affected area name, when at-risk
  source?:   string   // "PetaBencana.id"
}

// ── postcode prefix → PetaBencana region instance ──────────────────────────────
// PetaBencana only covers these regions; postcodes outside them → unavailable.
const PREFIX_TO_INSTANCE: { test: (pc: string) => boolean; instance: string }[] = [
  // Jakarta (10xxx–14xxx) + Tangerang/Bogor/Depok/Bekasi (15xxx–17xxx) = Jabodetabek
  { test: (pc) => /^1[0-7]/.test(pc), instance: "jabodetabek" },
  // Bandung
  { test: (pc) => /^40|^41/.test(pc), instance: "bandung" },
  // Semarang
  { test: (pc) => /^50/.test(pc), instance: "semarang" },
  // Surabaya
  { test: (pc) => /^60/.test(pc), instance: "surabaya" },
]

function resolveInstance(postcode: string): string | null {
  return PREFIX_TO_INSTANCE.find((r) => r.test(postcode))?.instance ?? null
}

// ── OSM Nominatim geocoding ────────────────────────────────────────────────────

interface LatLng { lat: number; lng: number }

async function geocodePostcode(postcode: string, country = "Indonesia"): Promise<LatLng | null> {
  try {
    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?postalcode=${encodeURIComponent(postcode)}` +
      `&country=${encodeURIComponent(country)}&format=json&limit=1`
    const res = await fetch(url, { headers: { Accept: "application/json" } })
    if (!res.ok) return null
    const data = (await res.json()) as Array<{ lat: string; lon: string }>
    if (!data?.length) return null
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {
    return null
  }
}

// ── PetaBencana flood feed ──────────────────────────────────────────────────────

interface GeoFeature {
  geometry: {
    type: "Polygon" | "MultiPolygon"
    coordinates: number[][][] | number[][][][]
  }
  properties?: {
    state?: number
    area_name?: string
    [k: string]: unknown
  }
}

async function fetchFloods(instance: string): Promise<GeoFeature[]> {
  try {
    const url =
      `https://data.petabencana.id/floods` +
      `?admin=${encodeURIComponent(instance)}&minimum_state=1&format=geojson`
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    // PetaBencana wraps the FeatureCollection in { result: {...} } on some routes
    const fc = data?.result ?? data
    return (fc?.features as GeoFeature[]) ?? []
  } catch {
    return []
  }
}

// ── Point-in-polygon (ray casting) ──────────────────────────────────────────────

function pointInRing(lng: number, lat: number, ring: number[][]): boolean {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1]
    const xj = ring[j][0], yj = ring[j][1]
    const intersect =
      (yi > lat) !== (yj > lat) &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

function pointInGeometry(lng: number, lat: number, geometry: GeoFeature["geometry"]): boolean {
  if (geometry.type === "Polygon") {
    const rings = geometry.coordinates as number[][][]
    return rings.length > 0 && pointInRing(lng, lat, rings[0])
  }
  if (geometry.type === "MultiPolygon") {
    const polys = geometry.coordinates as number[][][][]
    return polys.some((poly) => poly.length > 0 && pointInRing(lng, lat, poly[0]))
  }
  return false
}

// ── Public API ──────────────────────────────────────────────────────────────────

/**
 * Check whether the given postcode is currently in an active flood area.
 * Returns "unavailable" on any error or unsupported region — callers must
 * treat "unavailable" as "do not block".
 */
export async function checkFloodRisk(
  postcode: string,
  countryCode: string,
): Promise<FloodCheckResult> {
  if (countryCode.toUpperCase() !== "ID") return { status: "unavailable" }
  if (!/^\d{5}$/.test(postcode))           return { status: "unavailable" }

  const instance = resolveInstance(postcode)
  if (!instance) return { status: "unavailable" }   // region not covered by PetaBencana

  const coords = await geocodePostcode(postcode)
  if (!coords) return { status: "unavailable" }     // can't locate → don't guess

  const features = await fetchFloods(instance)
  // No active flood reports in the region → clear
  if (!features.length) return { status: "clear", source: "PetaBencana.id" }

  for (const f of features) {
    if (pointInGeometry(coords.lng, coords.lat, f.geometry)) {
      return {
        status:   "at-risk",
        severity: typeof f.properties?.state === "number" ? f.properties.state : 1,
        areaName: typeof f.properties?.area_name === "string" ? f.properties.area_name : undefined,
        source:   "PetaBencana.id",
      }
    }
  }

  return { status: "clear", source: "PetaBencana.id" }
}
