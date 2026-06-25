
interface CurrencyInfo {
  symbol: string
  code:   string
  locale: string
}

const REGION_CURRENCY: Record<string, CurrencyInfo> = {
  Philippines: { symbol: "₱",  code: "PHP", locale: "en-PH" },
  Cambodia:    { symbol: "$",   code: "USD", locale: "en-US" },
  Indonesia:   { symbol: "Rp", code: "IDR", locale: "id-ID" },
  Malaysia:    { symbol: "RM", code: "MYR", locale: "ms-MY" },
  Vietnam:     { symbol: "₫",  code: "VND", locale: "vi-VN" },
}

const COUNTRY_CODE_CURRENCY: Record<string, CurrencyInfo> = {
  PH: REGION_CURRENCY["Philippines"],
  KH: REGION_CURRENCY["Cambodia"],
  ID: REGION_CURRENCY["Indonesia"],
  MY: REGION_CURRENCY["Malaysia"],
}

const FALLBACK: CurrencyInfo = { symbol: "$", code: "USD", locale: "en-US" }

export function getCurrencyByRegion(region: string): CurrencyInfo {
  return REGION_CURRENCY[region] ?? FALLBACK
}

export function getCurrencyByCountryCode(countryCode: string): CurrencyInfo {
  return COUNTRY_CODE_CURRENCY[countryCode?.toUpperCase()] ?? FALLBACK
}

export function formatAmount(amount: number, regionOrCode: string, byCountryCode = false): string {
  const info = byCountryCode
    ? getCurrencyByCountryCode(regionOrCode)
    : getCurrencyByRegion(regionOrCode)

  const noDecimals = info.code === "IDR" || info.code === "VND"

  const formatted = new Intl.NumberFormat(info.locale, {
    minimumFractionDigits: noDecimals ? 0 : 2,
    maximumFractionDigits: noDecimals ? 0 : 2,
  }).format(amount)

  if (info.code === "VND") return `${formatted}${info.symbol}`
  return `${info.symbol}${formatted}`
}
