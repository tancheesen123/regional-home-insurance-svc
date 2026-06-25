"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Eye,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  BarChart3,
  PieChart,
  RefreshCw,
  AlertCircle,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { addDays, format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { fetchSalesRecords, exportSalesExcel, type SalesRecord, type SalesSummary } from "@/lib/api/sales"
import { getSession } from "@/lib/session"
import { formatAmount, getCurrencyByCountryCode } from "@/lib/currency"


function getStatusColor(status: string) {
  switch (status) {
    case "Active":    return "bg-green-100 text-green-800"
    case "Pending":   return "bg-yellow-100 text-yellow-800"
    case "Cancelled": return "bg-red-100 text-red-800"
    case "Expired":   return "bg-gray-100 text-gray-800"
    default:          return "bg-gray-100 text-gray-800"
  }
}

function formatGrowth(pct: number) {
  const sign = pct >= 0 ? "+" : ""
  return `${sign}${pct.toFixed(1)}%`
}

const DEFAULT_SUMMARY: SalesSummary = {
  totalSales: 0,
  totalPremium: 0,
  totalCommission: 0,
  activePolicies: 0,
  pendingPolicies: 0,
  averagePremium: 0,
  conversionRate: 0,
  premiumGrowthPct: 0,
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SalesReports() {
  const router = useRouter()

  // Currency for summary totals — driven by the session's country (all API records are country-scoped)
  const sessionCountryCode = getSession()?.countryCode ?? "PH"
  const summaryCurrency = getCurrencyByCountryCode(sessionCountryCode)

  // ── Server-side filter state (triggers refetch)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -60),
    to: new Date(),
  })

  // ── Client-side filter state (applied on already-fetched records)
  const [searchTerm,      setSearchTerm]      = useState("")
  const [selectedRegion,  setSelectedRegion]  = useState("all")
  const [selectedStatus,  setSelectedStatus]  = useState("all")
  const [selectedProduct, setSelectedProduct] = useState("all")

  // ── Data state
  const [records,  setRecords]  = useState<SalesRecord[]>([])
  const [summary,  setSummary]  = useState<SalesSummary>(DEFAULT_SUMMARY)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  const [recentSalesPage, setRecentSalesPage] = useState(1)
  const RECENT_SALES_PAGE_SIZE = 10

  const [detailedPage, setDetailedPage] = useState(1)
  const DETAILED_PAGE_SIZE = 10

  const [activeTab,   setActiveTab]   = useState("overview")
  const [exporting,   setExporting]   = useState(false)
  const [exportNote,  setExportNote]  = useState<string | null>(null) // feedback after export

  // ── Fetch (only dateFrom/dateTo go to the server; other filters are client-side)
  const loadRecords = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const filter: { dateFrom?: string; dateTo?: string } = {}
      if (dateRange?.from) filter.dateFrom = dateRange.from.toISOString()
      if (dateRange?.to)   filter.dateTo   = dateRange.to.toISOString()

      const data = await fetchSalesRecords(filter)
      setRecords(data.records ?? [])
      setSummary(data.summary ?? DEFAULT_SUMMARY)
    } catch (err) {
      console.error("[SalesReports] fetch error", err)
      setError("Failed to load sales records. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    loadRecords()
  }, [loadRecords])

  // ── Derive available regions from fetched data
  const regions = useMemo(() => {
    const set = new Set(records.map((r) => r.region).filter(Boolean))
    return Array.from(set).sort()
  }, [records])

  // ── Client-side filtering
  const filteredData = useMemo(() => {
    return records.filter((record) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch =
        !q ||
        record.customerName.toLowerCase().includes(q) ||
        record.policyNumber.toLowerCase().includes(q) ||
        record.customerEmail.toLowerCase().includes(q)

      const matchesRegion  = selectedRegion  === "all" || record.region      === selectedRegion
      const matchesStatus  = selectedStatus  === "all" || record.status      === selectedStatus
      const matchesProduct = selectedProduct === "all" || record.productType === selectedProduct

      return matchesSearch && matchesRegion && matchesStatus && matchesProduct
    })
  }, [records, searchTerm, selectedRegion, selectedStatus, selectedProduct])

  // ── Recent Sales pagination — reset to page 1 whenever the filtered set changes
  const recentSalesTotalPages = Math.max(1, Math.ceil(filteredData.length / RECENT_SALES_PAGE_SIZE))
  useEffect(() => {
    setRecentSalesPage(1)
  }, [filteredData])
  const pagedRecentSales = useMemo(() => {
    const start = (recentSalesPage - 1) * RECENT_SALES_PAGE_SIZE
    return filteredData.slice(start, start + RECENT_SALES_PAGE_SIZE)
  }, [filteredData, recentSalesPage])

  // ── Detailed Reports pagination — reset to page 1 whenever the filtered set changes
  const detailedTotalPages = Math.max(1, Math.ceil(filteredData.length / DETAILED_PAGE_SIZE))
  useEffect(() => {
    setDetailedPage(1)
  }, [filteredData])
  const pagedDetailedData = useMemo(() => {
    const start = (detailedPage - 1) * DETAILED_PAGE_SIZE
    return filteredData.slice(start, start + DETAILED_PAGE_SIZE)
  }, [filteredData, detailedPage])

  // ── Premium trend — daily totals from the filtered records, sorted chronologically
  const premiumTrend = useMemo(() => {
    const byDay = new Map<string, number>()
    for (const record of filteredData) {
      const day = record.saleDate.slice(0, 10) // YYYY-MM-DD
      byDay.set(day, (byDay.get(day) ?? 0) + record.premium)
    }
    return Array.from(byDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, total]) => ({
        date: format(new Date(day), "MMM d"),
        premium: total,
      }))
  }, [filteredData])

  // ── Summary always comes from API (not recomputed from filtered records)

  // ── Handlers
  const handleViewReport = (recordId: string) => {
    router.push(`/dashboard/sales/${recordId}`)
  }

  const handleExport = async () => {
    setExporting(true)
    setExportNote(null)
    try {
      // Send the same server-supported filters the admin has active.
      // Region is client-side only — the backend doesn't have a region filter yet.
      const filter: Parameters<typeof exportSalesExcel>[0] = {}
      if (dateRange?.from)           filter.dateFrom    = dateRange.from.toISOString()
      if (dateRange?.to)             filter.dateTo      = dateRange.to.toISOString()
      if (selectedStatus  !== "all") filter.status      = selectedStatus
      if (selectedProduct !== "all") filter.productType = selectedProduct
      if (searchTerm.trim())         filter.search      = searchTerm.trim()

      const result = await exportSalesExcel(filter)

      if (result.type === "empty") {
        setExportNote("No records matched the current filters. Nothing was exported.")
      } else {
        setExportNote(`Downloaded: ${result.filename}`)
        // Auto-clear success note after 5 s
        setTimeout(() => setExportNote(null), 5000)
      }
    } catch (err) {
      console.error("[SalesReports] export error", err)
      setExportNote("Export failed. Please try again.")
    } finally {
      setExporting(false)
    }
  }

  // ── Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-4 space-y-3">
            {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Sales Reports</h1>
          <p className="text-gray-600">Monitor and analyze insurance sales performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadRecords} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={loading || exporting || filteredData.length === 0}
          >
            <Download className={`h-4 w-4 mr-2 ${exporting ? "animate-bounce" : ""}`} />
            {exporting ? "Exporting…" : "Export Excel"}
          </Button>
        </div>
      </div>

      {/* Fetch error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button variant="ghost" size="sm" onClick={loadRecords}>Retry</Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Export feedback (success / empty / error) */}
      {exportNote && (
        <Alert
          variant={exportNote.startsWith("Downloaded") ? "default" : "destructive"}
          className={exportNote.startsWith("Downloaded") ? "border-green-200 bg-green-50 text-green-800" : undefined}
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {exportNote}
            <Button variant="ghost" size="sm" onClick={() => setExportNote(null)}>✕</Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold">{summary.totalSales}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Premium</p>
                <p className="text-2xl font-bold">{formatAmount(summary.totalPremium, sessionCountryCode, true)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Active Policies</p>
                <p className="text-2xl font-bold">{summary.activePolicies}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by customer name, policy number, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Region — derived from actual data */}
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="Home Insurance">Home Insurance</SelectItem>
                </SelectContent>
              </Select>

              {/* Date range — triggers refetch */}
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* ── Overview ── */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatAmount(summary.averagePremium, sessionCountryCode, true)}</div>
                <div className={`flex items-center text-sm ${summary.premiumGrowthPct >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {summary.premiumGrowthPct >= 0
                    ? <TrendingUp className="h-4 w-4 mr-1" />
                    : <TrendingDown className="h-4 w-4 mr-1" />}
                  {formatGrowth(summary.premiumGrowthPct)} from last month
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.conversionRate.toFixed(1)}%</div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Based on selected period
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Premium Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Premium Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {premiumTrend.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No records match the current filters.</p>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={premiumTrend} margin={{ top: 5, right: 16, left: 8, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v) => formatAmount(v, sessionCountryCode, true)}
                        width={80}
                      />
                      <Tooltip formatter={(v: number) => formatAmount(v, sessionCountryCode, true)} />
                      <Line type="monotone" dataKey="premium" stroke="#2563eb" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredData.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No records match the current filters.</p>
              ) : (
                <>
                  <div className="space-y-3">
                    {pagedRecentSales.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => handleViewReport(record.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{record.customerName}</p>
                            <p className="text-sm text-gray-600">{record.policyNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatAmount(record.premium, record.region)}</p>
                          <p className="text-sm text-gray-500">{format(new Date(record.saleDate), "MMM dd, yyyy")}</p>
                          <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {recentSalesTotalPages > 1 && (
                    <Pagination className="mt-4">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setRecentSalesPage((p) => Math.max(1, p - 1))
                            }}
                            className={recentSalesPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        {Array.from({ length: recentSalesTotalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              isActive={page === recentSalesPage}
                              onClick={(e) => {
                                e.preventDefault()
                                setRecentSalesPage(page)
                              }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setRecentSalesPage((p) => Math.min(recentSalesTotalPages, p + 1))
                            }}
                            className={recentSalesPage === recentSalesTotalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Detailed Reports ── */}
        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Records ({filteredData.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Policy Details</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Premium</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Sale Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedDetailedData.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.policyNumber}</p>
                            <p className="text-sm text-gray-600">{record.coverageType}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.customerName}</p>
                            <p className="text-sm text-gray-600">{record.customerEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>{record.productType}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{formatAmount(record.premium, record.region)}</p>
                            <p className="text-sm text-gray-600">{record.paymentMethod}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-green-600">{formatAmount(record.commission, record.region)}</p>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{format(new Date(record.saleDate), "MMM dd, yyyy")}</p>
                            <p className="text-sm text-gray-600">
                              Effective: {format(new Date(record.effectiveDate), "MMM dd")}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{record.region}</p>
                            <p className="text-sm text-gray-600">{record.agentName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewReport(record.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredData.length === 0 && !error && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No sales records found</h3>
                  <p className="text-gray-600">Try adjusting your filters or date range.</p>
                </div>
              )}

              {detailedTotalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setDetailedPage((p) => Math.max(1, p - 1))
                        }}
                        className={detailedPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: detailedTotalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === detailedPage}
                          onClick={(e) => {
                            e.preventDefault()
                            setDetailedPage(page)
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setDetailedPage((p) => Math.min(detailedTotalPages, p + 1))
                        }}
                        className={detailedPage === detailedTotalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Analytics ── */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sales by Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                {regions.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No data available.</p>
                ) : (
                  <div className="space-y-3">
                    {regions.map((region) => {
                      const regionSales = filteredData.filter((r) => r.region === region).length
                      const percentage = filteredData.length > 0 ? (regionSales / filteredData.length) * 100 : 0
                      return (
                        <div key={region} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{region}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-sm text-gray-600">{regionSales}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Sales by Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(["Active", "Pending", "Cancelled", "Expired"] as const).map((status) => {
                    const statusSales = filteredData.filter((r) => r.status === status).length
                    const percentage = filteredData.length > 0 ? (statusSales / filteredData.length) * 100 : 0
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{status}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-sm text-gray-600">{statusSales}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Commission summary from API */}
          <Card>
            <CardHeader>
              <CardTitle>Commission Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Total Commission</p>
                  <p className="text-2xl font-bold text-green-600">{formatAmount(summary.totalCommission, sessionCountryCode, true)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Commission / Sale</p>
                  <p className="text-2xl font-bold">
                    {formatAmount(
                      summary.totalSales > 0 ? summary.totalCommission / summary.totalSales : 0,
                      sessionCountryCode,
                      true
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold">{summary.conversionRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
