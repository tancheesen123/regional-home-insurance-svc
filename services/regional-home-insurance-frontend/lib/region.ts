export interface RegionConfig {
  symbol:              string
  buildingMin:         number
  buildingMax:         number
  contentMin:          number
  contentMax:          number
  /** Default sum insured for Building + Contents plan */
  defaultBuilding:     number
  defaultContent:      number
  /** Default sum insured when plan = Building Only */
  defaultBuildingOnly: number
  /** Default sum insured when plan = Content Only */
  defaultContentOnly:  number
  /** Snap inputs to the nearest multiple of this unit (e.g. 1_000 for MYR) */
  roundingUnit:        number
  /** If set, the "Get estimate" button for building opens this URL in a new tab */
  buildingEstimateUrl?: string
  /** Per-item value range and total coverage cap for declared valuables */
  valuableMinItem:     number
  valuableMaxItem:     number
  valuableMaxTotal:    number
}

export const REGION_CONFIG: Record<string, RegionConfig> = {
  MY: {
    symbol: "RM",
    buildingMin:         67_000,       buildingMax:  5_000_000,
    contentMin:          18_000,       contentMax:   1_000_000,
    defaultBuilding:    500_000,       defaultContent:      60_000,
    defaultBuildingOnly: 400_000,      defaultContentOnly:  90_000,
    roundingUnit:        1_000,
    buildingEstimateUrl: "https://bcc.piam.org.my/",
    valuableMinItem:     3_000,
    valuableMaxItem:     20_000,
    valuableMaxTotal:    60_000,
  },
  PH: {
    symbol: "₱",
    buildingMin:  1_011_210.90,    buildingMax:  75_463_500,
    contentMin:     271_668.60,    contentMax:   15_092_700,
    defaultBuilding:  7_500_000,   defaultContent:      900_000,
    defaultBuildingOnly: 6_000_000, defaultContentOnly: 1_350_000,
    roundingUnit:        1_000,
    valuableMinItem:     50_000,
    valuableMaxItem:     300_000,
    valuableMaxTotal:    900_000,
  },
  ID: {
    symbol: "Rp",
    buildingMin:    290_585_700,   buildingMax:  521_685_500_000,
    contentMin:      78_067_800,   contentMax:   554_337_100_000,
    defaultBuilding: 1_456_900_000, defaultContent:  208_266_600,
    defaultBuildingOnly: 1_165_520_000, defaultContentOnly: 312_400_000,
    roundingUnit:        1_000_000,
    valuableMinItem:     15_000_000,
    valuableMaxItem:     85_000_000,
    valuableMaxTotal:    260_000_000,
  },
  KH: {
    symbol: "$",
    buildingMin:  16_953,          buildingMax:  1_265_200,
    contentMin:    4_554,          contentMax:     253_040,
    defaultBuilding: 126_520,      defaultContent:   15_182,
    defaultBuildingOnly: 101_200,  defaultContentOnly: 22_800,
    roundingUnit:        100,
    valuableMinItem:     750,
    valuableMaxItem:     5_000,
    valuableMaxTotal:    15_000,
  },
}

export const DEFAULT_REGION: RegionConfig = REGION_CONFIG.MY

export function getRegionConfig(countryCode: string): RegionConfig {
  return REGION_CONFIG[countryCode?.toUpperCase()] ?? DEFAULT_REGION
}

/** Round n to the nearest multiple of unit (e.g. nearest 1,000). */
export function roundToUnit(n: number, unit: number): number {
  if (unit <= 0) return n
  return Math.round(n / unit) * unit
}

/** Clamp value between min and max, then round to the region's rounding unit. */
export function clampAndRound(
  value: number,
  min: number,
  max: number,
  unit: number,
): number {
  return roundToUnit(Math.max(min, Math.min(value, max)), unit)
}

/** Format with commas; shows decimals only when the value has a fractional part. */
export function fmtAmount(n: number): string {
  return n % 1 !== 0
    ? n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : n.toLocaleString("en")
}
