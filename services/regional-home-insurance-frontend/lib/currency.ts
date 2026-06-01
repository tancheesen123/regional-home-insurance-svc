/**
 * Currency helpers for multi-country support.
 * Covers all regions/country-codes used in the platform.
 */

interface CurrencyInfo {
  symbol: string   // prefix symbol, e.g. "₱"
  code:   string   // ISO 4217, e.g. "PHP"
  locale: string   // for Intl.NumberFormat
}

// Map from region display name → currency
const REGION_CURRENCY: Record<string, CurrencyInfo> = {
  Philippines: { symbol: "₱",  code: "PHP", locale: "en-PH" },
  Cambodia:    { symbol: "$",   code: "USD", locale: "en-US" }, // KH insurance uses USD
  Indonesia:   { symbol: "Rp", code: "IDR", locale: "id-ID" },
  Malaysia:    { symbol: "RM", code: "MYR", locale: "ms-MY" },
  Vietnam:     { symbol: "₫",  code: "VND", locale: "vi-VN" },
}

// Map from session countryCode → currency
const COUNTRY_CODE_CURRENCY: Record<string, CurrencyInfo> = {
  PH: REGION_CURRENCY["Philippines"],
  KH: REGION_CURRENCY["Cambodia"],
  ID: REGION_CURRENCY["Indonesia"],
  MY: REGION_CURRENCY["Malaysia"],
}

const FALLBACK: CurrencyInfo = { symbol: "$", code: "USD", locale: "en-US" }

/** Resolve currency from a region display name (e.g. "Philippines") */
export function getCurrencyByRegion(region: string): CurrencyInfo {
  return REGION_CURRENCY[region] ?? FALLBACK
}

/** Resolve currency from a session countryCode (e.g. "PH", "ID", "KH") */
export function getCurrencyByCountryCode(countryCode: string): CurrencyInfo {
  return COUNTRY_CODE_CURRENCY[countryCode?.toUpperCase()] ?? FALLBACK
}

/**
 * Format an amount with the correct currency symbol and locale separators.
 *
 * Examples:
 *   formatAmount(1333.76, "Philippines")  → "₱1,333.76"
 *   formatAmount(1500000, "Indonesia")    → "Rp1,500,000"
 *   formatAmount(1333.76, "Cambodia")     → "$1,333.76"
 */
export function formatAmount(amount: number, regionOrCode: string, byCountryCode = false): string {
  const info = byCountryCode
    ? getCurrencyByCountryCode(regionOrCode)
    : getCurrencyByRegion(regionOrCode)

  // IDR and VND have no decimal places in practice
  const noDecimals = info.code === "IDR" || info.code === "VND"

  const formatted = new Intl.NumberFormat(info.locale, {
    minimumFractionDigits: noDecimals ? 0 : 2,
    maximumFractionDigits: noDecimals ? 0 : 2,
  }).format(amount)

  // Some symbols go before (₱, $, RM, Rp), VND goes after
  if (info.code === "VND") return `${formatted}${info.symbol}`
  return `${info.symbol}${formatted}`
}
