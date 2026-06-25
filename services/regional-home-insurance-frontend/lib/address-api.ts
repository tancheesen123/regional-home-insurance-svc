

const ID_BASE = "https://alamat.thecloudalert.com/api"

export interface IdOption { id: string; text: string }

interface IdApiResponse { result?: IdOption[] }

async function idGet(path: string): Promise<IdOption[]> {
  try {
    const res = await fetch(`${ID_BASE}${path}`)
    const data: IdApiResponse = await res.json()
    return data.result ?? []
  } catch {
    return []
  }
}

export const fetchIdProvinces  = ()                     => idGet("/provinsi/get/")
export const fetchIdCities     = (provinsiId: string)   => idGet(`/kabkota/get/?d_provinsi_id=${provinsiId}`)
export const fetchIdDistricts  = (kabkotaId: string)    => idGet(`/kecamatan/get/?d_kabkota_id=${kabkotaId}`)
export const fetchIdVillages   = (kecamatanId: string)  => idGet(`/kelurahan/get/?d_kecamatan_id=${kecamatanId}`)

/**
 * Fetch postal code by Kabupaten/Kota ID + Kecamatan ID.
 * /api/kodepos/get/?d_kabkota_id=<id>&d_kecamatan_id=<id>
 * Returns the first matching kodepos text, or "" if not found.
 */
export async function fetchIdPostcodeByDistrict(
  kabkotaId:   string,
  kecamatanId: string,
): Promise<string> {
  try {
    const res  = await fetch(
      `${ID_BASE}/kodepos/get/?d_kabkota_id=${kabkotaId}&d_kecamatan_id=${kecamatanId}`,
    )
    const data = await res.json()
    return (data.result as IdOption[] | undefined)?.[0]?.text ?? ""
  } catch {
    return ""
  }
}

/** @deprecated — use fetchIdPostcodeByDistrict instead */
export async function fetchIdPostalCode(kelurahanId: string): Promise<string> {
  try {
    const res  = await fetch(`${ID_BASE}/kodepos/get/?d_kelurahan_id=${kelurahanId}`)
    const data = await res.json()
    return (data.result as IdOption[] | undefined)?.[0]?.text ?? ""
  } catch {
    return ""
  }
}

/** @deprecated — use fetchIdPostcodeByDistrict instead */
export async function fetchIdPostcodeByVillageName(villageName: string): Promise<string> {
  try {
    const res  = await fetch(
      `${ID_BASE}/cari/index/?keyword=${encodeURIComponent(villageName)}`,
    )
    const data = await res.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.result as any[])?.[0]?.kodepos ?? ""
  } catch {
    return ""
  }
}

// ── Philippines ───────────────────────────────────────────────────────────────

const PH_BASE = "https://psgc.cloud/api"

export interface PhProvince { code: string; name: string }
export interface PhCityMuni {
  code:      string
  name:      string
  type:      string   // "City" | "Mun"
  zip_code:  string
  district:  string
}

export async function fetchPhProvinces(): Promise<PhProvince[]> {
  try {
    const res = await fetch(`${PH_BASE}/provinces`)
    return res.json()
  } catch {
    return []
  }
}

export async function fetchPhCities(provinceCode: string): Promise<PhCityMuni[]> {
  try {
    const res = await fetch(`${PH_BASE}/provinces/${provinceCode}/cities-municipalities`)
    return res.json()
  } catch {
    return []
  }
}

// ── Cambodia (pumi — static bundled data, no HTTP) ────────────────────────────

export interface KhUnit {
  km:    string
  latin: string
  en:    string
}

export interface KhEntry {
  id:     string
  name:   { km: string; latin: string }
  unit:   KhUnit
  parent?: string
}

// Lazy-loaded so it doesn't bloat the initial bundle
let _khProvinces: KhEntry[] | null = null
let _khDistricts: KhEntry[] | null = null
let _khCommunes:  KhEntry[] | null = null

async function loadKhData() {
  if (!_khProvinces) {
    const { provinces, districts, communes } = await import("pumi")
    _khProvinces = provinces as unknown as KhEntry[]
    _khDistricts = districts as unknown as KhEntry[]
    _khCommunes  = communes  as unknown as KhEntry[]
  }
}

export async function fetchKhProvinces(): Promise<KhEntry[]> {
  await loadKhData()
  return _khProvinces!
}

export async function fetchKhDistricts(provinceId: string): Promise<KhEntry[]> {
  await loadKhData()
  return _khDistricts!.filter((d) => d.parent === provinceId)
}

export async function fetchKhCommunes(districtId: string): Promise<KhEntry[]> {
  await loadKhData()
  return _khCommunes!.filter((c) => c.parent === districtId)
}
