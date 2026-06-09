"use client"

/**
 * Country-aware cascading address selector.
 *
 * MY  → plain text inputs (no external API)
 * PH  → Province → City/Municipality (psgc.cloud, auto-fills postcode)
 * ID  → Province → Kab/Kota → Kecamatan → Kelurahan (alamat.thecloudalert.com, auto-fills postcode)
 * KH  → Province → District → Commune (pumi static data)
 */

import { useState, useEffect, useCallback, useRef } from "react"
import { Loader2 } from "lucide-react"
import { Input }  from "@/components/ui/input"
import { Label }  from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  fetchPhProvinces,  fetchPhCities,
  fetchIdProvinces,  fetchIdCities, fetchIdDistricts, fetchIdVillages, fetchIdPostcodeByDistrict,
  fetchKhProvinces,  fetchKhDistricts, fetchKhCommunes,
  type PhProvince,   type PhCityMuni,
  type IdOption,
  type KhEntry,
} from "@/lib/address-api"

// ── Shared value shape ────────────────────────────────────────────────────────

export interface AddressValues {
  city:      string
  postcode:  string
  state:     string
  country:   string
  district?: string   // Kecamatan (ID only)
  village?:  string   // Kelurahan/Desa (ID), Commune (KH)
}

interface Props {
  countryCode:  string
  values:       AddressValues
  onChange:     (partial: Partial<AddressValues>) => void
  disabled?:    boolean
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function SelectRow({
  label, id, value, options, placeholder, loading, onChange, disabled,
}: {
  label: string
  id: string
  value: string
  options: { value: string; label: string }[]
  placeholder: string
  loading?: boolean
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Select value={value} onValueChange={onChange} disabled={disabled || loading}>
          <SelectTrigger id={id} className={loading ? "text-[#9E9E9E]" : ""}>
            <SelectValue placeholder={loading ? "Loading…" : placeholder} />
          </SelectTrigger>
          <SelectContent className="max-h-72 overflow-y-auto">
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {loading && (
          <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-[#9E9E9E] pointer-events-none" />
        )}
      </div>
    </div>
  )
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} readOnly className="bg-gray-100" />
    </div>
  )
}

// ── Philippines component ─────────────────────────────────────────────────────

function PhAddressSelect({ values, onChange, disabled }: Omit<Props, "countryCode">) {
  const [provinces, setProvinces] = useState<PhProvince[]>([])
  const [cities,    setCities]    = useState<PhCityMuni[]>([])
  const [selProv,   setSelProv]   = useState("")
  const [selCity,   setSelCity]   = useState("")
  const [loadProv,  setLoadProv]  = useState(true)
  const [loadCity,  setLoadCity]  = useState(false)

  // Load provinces once
  useEffect(() => {
    fetchPhProvinces().then((data) => {
      setProvinces(data)
      setLoadProv(false)
    })
  }, [])

  const handleProvince = useCallback(async (code: string) => {
    const prov = provinces.find((p) => p.code === code)
    setSelProv(code)
    setSelCity("")
    setCities([])
    onChange({ state: prov?.name ?? "", city: "", postcode: "", district: "", village: "" })
    setLoadCity(true)
    const list = await fetchPhCities(code)
    setCities(list)
    setLoadCity(false)
  }, [provinces, onChange])

  const handleCity = useCallback((code: string) => {
    const c = cities.find((x) => x.code === code)
    setSelCity(code)
    onChange({
      city:     c?.name     ?? "",
      postcode: c?.zip_code ?? "",
    })
  }, [cities, onChange])

  return (
    <>
      <SelectRow
        label="Province"
        id="ph-province"
        value={selProv}
        options={provinces.map((p) => ({ value: p.code, label: p.name }))}
        placeholder="Select province"
        loading={loadProv}
        onChange={handleProvince}
        disabled={disabled}
      />
      <SelectRow
        label="City / Municipality"
        id="ph-city"
        value={selCity}
        options={cities.map((c) => ({ value: c.code, label: `${c.name} (${c.type})` }))}
        placeholder={selProv ? "Select city / municipality" : "Select province first"}
        loading={loadCity}
        onChange={handleCity}
        disabled={disabled || !selProv}
      />
      <div className="grid grid-cols-2 gap-4">
        <ReadonlyField label="Postal Code" value={values.postcode} />
        <ReadonlyField label="Country"     value={values.country}  />
      </div>
    </>
  )
}

// ── Indonesia component ───────────────────────────────────────────────────────

// Normalise a name for fuzzy matching: lowercase, strip "kabupaten"/"kota" prefix
function normName(s: string) {
  return s.toLowerCase().replace(/^(kabupaten|kota)\s+/i, "").trim()
}

function IdAddressSelect({ values, onChange, disabled }: Omit<Props, "countryCode">) {
  const [provinces,  setProvinces]  = useState<IdOption[]>([])
  const [cities,     setCities]     = useState<IdOption[]>([])
  const [districts,  setDistricts]  = useState<IdOption[]>([])
  const [villages,   setVillages]   = useState<IdOption[]>([])

  const [selProv, setSelProv] = useState("")
  const [selCity, setSelCity] = useState("")
  const [selDist, setSelDist] = useState("")
  const [selVill, setSelVill] = useState("")

  const [loading, setLoading] = useState({ prov: true, city: false, dist: false, vill: false, post: false })

  // Track auto-fill attempts so we don't retry after a failed match
  const autoFilled = useRef({ prov: false, city: false, dist: false, vill: false })

  useEffect(() => {
    fetchIdProvinces().then((data) => {
      setProvinces(data)
      setLoading((p) => ({ ...p, prov: false }))
    })
  }, [])

  // Auto-match province from OCR value (values.state)
  useEffect(() => {
    if (autoFilled.current.prov || selProv || !values.state || provinces.length === 0) return
    const target = normName(values.state)
    const match = provinces.find((p) => normName(p.text) === target)
    if (!match) return
    autoFilled.current.prov = true
    setSelProv(match.id)
    setLoading((p) => ({ ...p, city: true }))
    fetchIdCities(match.id).then((list) => {
      setCities(list)
      setLoading((p) => ({ ...p, city: false }))
    })
  }, [provinces, selProv, values.state])

  // Auto-match city/kabupaten from OCR value (values.city)
  useEffect(() => {
    if (autoFilled.current.city || selCity || !values.city || cities.length === 0) return
    const target = normName(values.city)
    const match = cities.find((c) => normName(c.text) === target)
    if (!match) return
    autoFilled.current.city = true
    setSelCity(match.id)
    setLoading((p) => ({ ...p, dist: true }))
    fetchIdDistricts(match.id).then((list) => {
      setDistricts(list)
      setLoading((p) => ({ ...p, dist: false }))
    })
  }, [cities, selCity, values.city])

  // Auto-match kecamatan from OCR value (values.district)
  useEffect(() => {
    if (autoFilled.current.dist || selDist || !values.district || districts.length === 0 || !selCity) return
    const target = normName(values.district)
    const match = districts.find((d) => normName(d.text) === target)
    if (!match) return
    autoFilled.current.dist = true
    setSelDist(match.id)
    setLoading((p) => ({ ...p, vill: true, post: true }))
    Promise.all([
      fetchIdVillages(match.id),
      fetchIdPostcodeByDistrict(selCity, match.id),
    ]).then(([list, postcode]) => {
      setVillages(list)
      setLoading((p) => ({ ...p, vill: false, post: false }))
      onChange({ postcode })
    })
  }, [districts, selDist, selCity, values.district, onChange])

  // Auto-match kelurahan from OCR value (values.village)
  useEffect(() => {
    if (autoFilled.current.vill || selVill || !values.village || villages.length === 0) return
    const target = normName(values.village)
    const match = villages.find((v) => normName(v.text) === target)
    if (!match) return
    autoFilled.current.vill = true
    setSelVill(match.id)
  }, [villages, selVill, values.village])

  const handleProvince = useCallback(async (id: string) => {
    const prov = provinces.find((p) => p.id === id)
    setSelProv(id); setSelCity(""); setSelDist(""); setSelVill("")
    setCities([]); setDistricts([]); setVillages([])
    onChange({ state: prov?.text ?? "", city: "", postcode: "", district: "", village: "" })
    setLoading((p) => ({ ...p, city: true }))
    const list = await fetchIdCities(id)
    setCities(list)
    setLoading((p) => ({ ...p, city: false }))
  }, [provinces, onChange])

  const handleCity = useCallback(async (id: string) => {
    const city = cities.find((c) => c.id === id)
    setSelCity(id); setSelDist(""); setSelVill("")
    setDistricts([]); setVillages([])
    onChange({ city: city?.text ?? "", postcode: "", district: "", village: "" })
    setLoading((p) => ({ ...p, dist: true }))
    const list = await fetchIdDistricts(id)
    setDistricts(list)
    setLoading((p) => ({ ...p, dist: false }))
  }, [cities, onChange])

  const handleDistrict = useCallback(async (id: string) => {
    const dist = districts.find((d) => d.id === id)
    setSelDist(id); setSelVill("")
    setVillages([])
    onChange({ district: dist?.text ?? "", village: "", postcode: "" }) // clear while fetching
    // Fetch villages + postcode in parallel (postcode needs city + district IDs)
    setLoading((p) => ({ ...p, vill: true, post: true }))
    const [list, postcode] = await Promise.all([
      fetchIdVillages(id),
      fetchIdPostcodeByDistrict(selCity, id),
    ])
    setVillages(list)
    setLoading((p) => ({ ...p, vill: false, post: false }))
    onChange({ postcode })
  }, [districts, selCity, onChange])

  const handleVillage = useCallback((id: string) => {
    const vill = villages.find((v) => v.id === id)
    setSelVill(id)
    onChange({ village: vill?.text ?? "" })   // postcode already set at district level
  }, [villages, onChange])

  return (
    <>
      <SelectRow
        label="Provinsi"
        id="id-province"
        value={selProv}
        options={provinces.map((p) => ({ value: p.id, label: p.text }))}
        placeholder="Pilih provinsi"
        loading={loading.prov}
        onChange={handleProvince}
        disabled={disabled}
      />
      <SelectRow
        label="Kabupaten / Kota"
        id="id-city"
        value={selCity}
        options={cities.map((c) => ({ value: c.id, label: c.text }))}
        placeholder={selProv ? "Pilih kabupaten / kota" : "Pilih provinsi dulu"}
        loading={loading.city}
        onChange={handleCity}
        disabled={disabled || !selProv}
      />
      <SelectRow
        label="Kecamatan"
        id="id-district"
        value={selDist}
        options={districts.map((d) => ({ value: d.id, label: d.text }))}
        placeholder={
          selCity
            ? "Pilih kecamatan"
            : values.district && !selDist
              ? `${values.district} — pilih provinsi dulu`
              : "Pilih kab/kota dulu"
        }
        loading={loading.dist}
        onChange={handleDistrict}
        disabled={disabled || !selCity}
      />
      <SelectRow
        label="Kelurahan / Desa"
        id="id-village"
        value={selVill}
        options={villages.map((v) => ({ value: v.id, label: v.text }))}
        placeholder={
          selDist
            ? "Pilih kelurahan / desa"
            : values.village && !selVill
              ? `${values.village} — pilih kecamatan dulu`
              : "Pilih kecamatan dulu"
        }
        loading={loading.vill}
        onChange={handleVillage}
        disabled={disabled || !selDist}
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="id-postcode">Kode Pos</Label>
          <div className="relative">
            <Input
              id="id-postcode"
              value={values.postcode}
              onChange={(e) => onChange({ postcode: e.target.value })}
              placeholder={loading.post ? "Mencari…" : "e.g. 12345"}
              disabled={disabled || loading.post}
            />
            {loading.post && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-[#9E9E9E] pointer-events-none" />
            )}
          </div>
        </div>
        <ReadonlyField label="Negara" value={values.country} />
      </div>
    </>
  )
}

// ── Cambodia component ────────────────────────────────────────────────────────

function KhAddressSelect({ values, onChange, disabled }: Omit<Props, "countryCode">) {
  const [provinces,  setProvinces]  = useState<KhEntry[]>([])
  const [districts,  setDistricts]  = useState<KhEntry[]>([])
  const [communes,   setCommunes]   = useState<KhEntry[]>([])

  const [selProv, setSelProv] = useState("")
  const [selDist, setSelDist] = useState("")
  const [selComm, setSelComm] = useState("")
  const [loadProv, setLoadProv] = useState(true)
  const [loadDist, setLoadDist] = useState(false)
  const [loadComm, setLoadComm] = useState(false)

  useEffect(() => {
    fetchKhProvinces().then((data) => {
      setProvinces(data)
      setLoadProv(false)
    })
  }, [])

  const handleProvince = useCallback(async (id: string) => {
    const prov = provinces.find((p) => p.id === id)
    setSelProv(id); setSelDist(""); setSelComm("")
    setDistricts([]); setCommunes([])
    onChange({ state: prov?.name.latin ?? "", city: "", village: "" })
    setLoadDist(true)
    const list = await fetchKhDistricts(id)
    setDistricts(list)
    setLoadDist(false)
  }, [provinces, onChange])

  const handleDistrict = useCallback(async (id: string) => {
    const dist = districts.find((d) => d.id === id)
    setSelDist(id); setSelComm("")
    setCommunes([])
    onChange({ city: dist?.name.latin ?? "", village: "" })
    setLoadComm(true)
    const list = await fetchKhCommunes(id)
    setCommunes(list)
    setLoadComm(false)
  }, [districts, onChange])

  const handleCommune = useCallback((id: string) => {
    const comm = communes.find((c) => c.id === id)
    setSelComm(id)
    onChange({ village: comm?.name.latin ?? "" })
  }, [communes, onChange])

  return (
    <>
      <SelectRow
        label="Province"
        id="kh-province"
        value={selProv}
        options={provinces.map((p) => ({ value: p.id, label: p.name.latin }))}
        placeholder="Select province"
        loading={loadProv}
        onChange={handleProvince}
        disabled={disabled}
      />
      <SelectRow
        label="District"
        id="kh-district"
        value={selDist}
        options={districts.map((d) => ({ value: d.id, label: d.name.latin }))}
        placeholder={selProv ? "Select district" : "Select province first"}
        loading={loadDist}
        onChange={handleDistrict}
        disabled={disabled || !selProv}
      />
      <SelectRow
        label="Commune"
        id="kh-commune"
        value={selComm}
        options={communes.map((c) => ({ value: c.id, label: c.name.latin }))}
        placeholder={selDist ? "Select commune" : "Select district first"}
        loading={loadComm}
        onChange={handleCommune}
        disabled={disabled || !selDist}
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="kh-postcode">Postal Code</Label>
          <Input
            id="kh-postcode"
            value={values.postcode}
            onChange={(e) => onChange({ postcode: e.target.value })}
            placeholder="e.g. 12000"
            disabled={disabled}
          />
        </div>
        <ReadonlyField label="Country" value={values.country} />
      </div>
    </>
  )
}

// ── Malaysia / fallback (plain inputs) ────────────────────────────────────────

function DefaultAddressSelect({ values, onChange, disabled }: Omit<Props, "countryCode">) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="def-postcode">Postcode</Label>
        <Input
          id="def-postcode"
          value={values.postcode}
          readOnly
          className="bg-gray-100"
          disabled={disabled}
        />
      </div>
      <div>
        <Label htmlFor="def-state">State</Label>
        <Input
          id="def-state"
          value={values.state}
          readOnly
          className="bg-gray-100"
          disabled={disabled}
        />
      </div>
      <div>
        <Label htmlFor="def-country">Country</Label>
        <Input
          id="def-country"
          value={values.country}
          readOnly
          className="bg-gray-100"
          disabled={disabled}
        />
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function AddressSelect({ countryCode, values, onChange, disabled }: Props) {
  const cc = countryCode.toUpperCase()

  if (cc === "PH") return <PhAddressSelect values={values} onChange={onChange} disabled={disabled} />
  if (cc === "ID") return <IdAddressSelect values={values} onChange={onChange} disabled={disabled} />
  if (cc === "KH") return <KhAddressSelect values={values} onChange={onChange} disabled={disabled} />
  return           <DefaultAddressSelect  values={values} onChange={onChange} disabled={disabled} />
}
