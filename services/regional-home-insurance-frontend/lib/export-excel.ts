/**
 * Client-side Excel export for sales reports.
 * Uses SheetJS (xlsx) to generate a .xlsx file in the browser.
 *
 * NOTE: For large datasets or scheduled exports, use the backend API instead:
 *   POST /api/sales/ExportExcel  →  returns application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
 */

import * as XLSX from "xlsx"
import { format } from "date-fns"
import type { SalesRecord, SalesSummary } from "@/lib/api/sales"
import { formatAmount } from "@/lib/currency"

// ─── Records sheet ────────────────────────────────────────────────────────────

interface RecordsRow {
  "No."             : number
  "Policy Number"   : string
  "Customer Name"   : string
  "Customer Email"  : string
  "Product"         : string
  "Coverage Type"   : string
  "Premium"         : string
  "Commission"      : string
  "Sale Date"       : string
  "Effective Date"  : string
  "Renewal Date"    : string
  "Status"          : string
  "Payment Method"  : string
  "Region"          : string
  "Agent"           : string
  "Agent ID"        : string
}

function buildRecordsSheet(records: SalesRecord[]): XLSX.WorkSheet {
  const rows: RecordsRow[] = records.map((r, i) => ({
    "No."            : i + 1,
    "Policy Number"  : r.policyNumber,
    "Customer Name"  : r.customerName,
    "Customer Email" : r.customerEmail,
    "Product"        : r.productType,
    "Coverage Type"  : r.coverageType,
    "Premium"        : formatAmount(r.premium,    r.region),
    "Commission"     : formatAmount(r.commission, r.region),
    "Sale Date"      : safeFormat(r.saleDate),
    "Effective Date" : safeFormat(r.effectiveDate),
    "Renewal Date"   : safeFormat(r.renewalDate),
    "Status"         : r.status,
    "Payment Method" : r.paymentMethod,
    "Region"         : r.region,
    "Agent"          : r.agentName,
    "Agent ID"       : r.agentId,
  }))

  const ws = XLSX.utils.json_to_sheet(rows)

  // Column widths
  ws["!cols"] = [
    { wch: 5  },  // No.
    { wch: 20 },  // Policy Number
    { wch: 22 },  // Customer Name
    { wch: 28 },  // Customer Email
    { wch: 18 },  // Product
    { wch: 22 },  // Coverage Type
    { wch: 14 },  // Premium
    { wch: 14 },  // Commission
    { wch: 14 },  // Sale Date
    { wch: 14 },  // Effective Date
    { wch: 14 },  // Renewal Date
    { wch: 12 },  // Status
    { wch: 16 },  // Payment Method
    { wch: 14 },  // Region
    { wch: 20 },  // Agent
    { wch: 12 },  // Agent ID
  ]

  return ws
}

// ─── Summary sheet ────────────────────────────────────────────────────────────

function buildSummarySheet(
  summary: SalesSummary,
  countryCurrency: string,
  dateFrom: string,
  dateTo: string,
): XLSX.WorkSheet {
  const rows = [
    ["Sales Report Summary"],
    [],
    ["Period",           `${dateFrom} → ${dateTo}`],
    [],
    ["Total Sales",      summary.totalSales],
    ["Active Policies",  summary.activePolicies],
    ["Pending Policies", summary.pendingPolicies],
    [],
    ["Total Premium",    formatAmount(summary.totalPremium,    countryCurrency, true)],
    ["Total Commission", formatAmount(summary.totalCommission, countryCurrency, true)],
    ["Average Premium",  formatAmount(summary.averagePremium,  countryCurrency, true)],
    [],
    ["Conversion Rate",  `${summary.conversionRate.toFixed(1)}%`],
    ["Premium Growth",   `${summary.premiumGrowthPct >= 0 ? "+" : ""}${summary.premiumGrowthPct.toFixed(1)}%`],
    [],
    ["Generated on",     format(new Date(), "dd MMM yyyy, hh:mm a")],
  ]

  const ws = XLSX.utils.aoa_to_sheet(rows)
  ws["!cols"] = [{ wch: 20 }, { wch: 28 }]

  return ws
}

// ─── Public export function ───────────────────────────────────────────────────

export function exportSalesReportToExcel(options: {
  records       : SalesRecord[]
  summary       : SalesSummary
  countryCurrency: string     // session countryCode, e.g. "PH"
  dateFrom      : string
  dateTo        : string
}): void {
  const { records, summary, countryCurrency, dateFrom, dateTo } = options

  const wb = XLSX.utils.book_new()

  // Sheet 1 — Records
  XLSX.utils.book_append_sheet(wb, buildRecordsSheet(records), "Sales Records")

  // Sheet 2 — Summary
  XLSX.utils.book_append_sheet(
    wb,
    buildSummarySheet(summary, countryCurrency, dateFrom, dateTo),
    "Summary",
  )

  // Filename: SalesReport_PH_2025-01-01_2025-01-31.xlsx
  const filename = `SalesReport_${countryCurrency}_${dateFrom}_${dateTo}.xlsx`

  XLSX.writeFile(wb, filename)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeFormat(dateStr: string): string {
  try { return format(new Date(dateStr), "dd MMM yyyy") } catch { return dateStr }
}
