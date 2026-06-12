"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Filter,
  Download,
  FileText,
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  fetchCustomerProposals,
  type CustomerProposal,
} from "@/lib/api"
import { downloadPolicyDocuments, DocumentDownloadError } from "@/lib/api"
import { getSession } from "@/lib/session"
import { getRegionConfig } from "@/lib/region"

// ── Helpers ───────────────────────────────────────────────────────────────────

const REGION_COUNTRY: Record<string, string> = {
  MY: "Malaysia",
  PH: "Philippines",
  ID: "Indonesia",
  KH: "Cambodia",
}

function formatPlanType(planType: string): string {
  switch (planType.toLowerCase()) {
    case "building-contents": return "Building + Contents"
    case "building":          return "Building Only"
    case "contents":          return "Contents Only"
    default:
      return planType.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" + ")
  }
}

function deriveStatus(endDate: string): "Active" | "Expired" {
  return new Date(endDate) >= new Date() ? "Active" : "Expired"
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  })
}

function fmtAmount(region: string, amount: number): string {
  const cfg = getRegionConfig(region)
  const symbol = cfg?.symbol ?? ""
  return `${symbol} ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

// ── Internal display shape ────────────────────────────────────────────────────
// Only proposals with a non-null policy are shown as "policies".

interface Policy {
  proposalId:      string
  policyId:        string
  policyNumber:    string
  coverageType:    string
  status:          "Active" | "Expired"
  region:          string
  country:         string
  coverageAmount:  number
  startDate:       string
  endDate:         string
  endDateRaw:      Date
  issuedAt:        string
  issuedAtRaw:     Date
  isDocumentReady: boolean
}

function mapProposal(p: CustomerProposal): Policy {
  const pol = p.policy!                             // only called when policy !== null
  return {
    proposalId:      p.proposalId,
    policyId:        pol.policyId,
    policyNumber:    pol.policyNumber,
    coverageType:    formatPlanType(p.planType),
    status:          deriveStatus(pol.endDate),
    region:          p.region.toUpperCase(),
    country:         REGION_COUNTRY[p.region.toUpperCase()] ?? p.region,
    coverageAmount:  pol.coverageAmount,
    startDate:       fmtDate(pol.startDate),
    endDate:         fmtDate(pol.endDate),
    endDateRaw:      new Date(pol.endDate),
    issuedAt:        fmtDate(pol.issuedAt),
    issuedAtRaw:     new Date(pol.issuedAt),
    isDocumentReady: pol.isDocumentReady,
  }
}

// ── Filter state ──────────────────────────────────────────────────────────────

interface FilterState {
  search:       string
  status:       string[]
  coverageType: string[]
  country:      string[]
  issuedFrom:   string
  issuedTo:     string
}

// ── Status helpers ────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "Active":  return <CheckCircle className="h-4 w-4 text-green-600" />
    case "Expired": return <Clock       className="h-4 w-4 text-gray-500"  />
    default:        return <AlertCircle className="h-4 w-4 text-yellow-600" />
  }
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case "Active":  return "bg-green-100 text-green-800"
    case "Expired": return "bg-gray-100  text-gray-700"
    default:        return "bg-gray-100  text-gray-700"
  }
}

// ── Row skeleton ──────────────────────────────────────────────────────────────

function TableRowSkeleton() {
  return (
    <TableRow>
      {[...Array(5)].map((_, i) => (
        <TableCell key={i}>
          <div className="space-y-1.5">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
            <div className="h-2.5 bg-gray-200 rounded animate-pulse w-20" />
          </div>
        </TableCell>
      ))}
    </TableRow>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PoliciesManagement() {
  const [policies,      setPolicies]      = useState<Policy[]>([])
  const [isLoading,     setIsLoading]     = useState(true)
  const [loadError,     setLoadError]     = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [activeTab,     setActiveTab]     = useState("all")
  const [filters,       setFilters]       = useState<FilterState>({
    search: "", status: [], coverageType: [], country: [], issuedFrom: "", issuedTo: "",
  })

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const load = () => {
    const session = getSession()
    if (!session?.customerId) {
      setLoadError("Session expired. Please log in again.")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadError(null)

    fetchCustomerProposals(session.customerId)
      .then((proposals) => {
        // Only surface proposals that have an issued policy
        const withPolicy = proposals
          .filter((p) => p.policy !== null)
          .map(mapProposal)
        setPolicies(withPolicy)
      })
      .catch((err: Error) => setLoadError(err.message))
      .finally(() => setIsLoading(false))
  }

  useEffect(load, [])

  // ── Download ──────────────────────────────────────────────────────────────

  const handleDownload = async (policy: Policy) => {
    setDownloadError(null)
    setDownloadingId(policy.proposalId)
    try {
      await downloadPolicyDocuments(policy.proposalId, policy.policyNumber)
    } catch (err) {
      setDownloadError(
        err instanceof DocumentDownloadError ? err.message : "Download failed. Please try again.",
      )
    } finally {
      setDownloadingId(null)
    }
  }

  // ── Filter options derived from real data ─────────────────────────────────

  const coverageTypeOptions = useMemo(
    () => [...new Set(policies.map((p) => p.coverageType))].sort(),
    [policies],
  )
  const countryOptions = useMemo(
    () => [...new Set(policies.map((p) => p.country))].sort(),
    [policies],
  )

  // ── Filtered list ─────────────────────────────────────────────────────────

  const filteredPolicies = useMemo(() => {
    let list = policies

    if (activeTab === "active")  list = list.filter((p) => p.status === "Active")
    if (activeTab === "expired") list = list.filter((p) => p.status === "Expired")

    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(
        (p) =>
          p.policyNumber.toLowerCase().includes(q) ||
          p.coverageType.toLowerCase().includes(q)  ||
          p.country.toLowerCase().includes(q),
      )
    }
    if (filters.status.length)       list = list.filter((p) => filters.status.includes(p.status))
    if (filters.coverageType.length) list = list.filter((p) => filters.coverageType.includes(p.coverageType))
    if (filters.country.length)      list = list.filter((p) => filters.country.includes(p.country))
    if (filters.issuedFrom) {
      const from = new Date(filters.issuedFrom)
      list = list.filter((p) => p.issuedAtRaw >= from)
    }
    if (filters.issuedTo) {
      const to = new Date(filters.issuedTo)
      to.setHours(23, 59, 59, 999)
      list = list.filter((p) => p.issuedAtRaw <= to)
    }

    return list
  }, [policies, activeTab, filters])

  // ── Summary values ────────────────────────────────────────────────────────

  const activePolicies = policies.filter((p) => p.status === "Active")
  const expiredCount   = policies.filter((p) => p.status === "Expired").length
  const nextRenewal    = activePolicies
    .map((p) => p.endDateRaw)
    .sort((a, b) => a.getTime() - b.getTime())[0]
  const nextRenewalStr = nextRenewal
    ? nextRenewal.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—"

  // ── Filter helpers ────────────────────────────────────────────────────────

  const toggleFilter = (key: keyof FilterState, value: string, checked: boolean) => {
    setFilters((prev) => {
      const arr = prev[key] as string[]
      return { ...prev, [key]: checked ? [...arr, value] : arr.filter((v) => v !== value) }
    })
  }

  const clearFilters = () =>
    setFilters({ search: "", status: [], coverageType: [], country: [], issuedFrom: "", issuedTo: "" })

  const activeFiltersCount =
    filters.status.length + filters.coverageType.length + filters.country.length +
    (filters.search ? 1 : 0) +
    (filters.issuedFrom ? 1 : 0) + (filters.issuedTo ? 1 : 0)

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Policies</h1>
          <p className="text-gray-600">Manage and view all your insurance policies</p>
        </div>
        <Button variant="outline" onClick={load} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Alerts */}
      {loadError && (
        <Alert variant="destructive">
          <AlertDescription>{loadError}</AlertDescription>
        </Alert>
      )}
      {downloadError && (
        <Alert variant="destructive">
          <AlertDescription>{downloadError}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            icon: <CheckCircle className="h-5 w-5 text-green-600" />,
            label: "Active Policies",
            value: isLoading ? null : activePolicies.length,
          },
          {
            icon: <Clock className="h-5 w-5 text-gray-600" />,
            label: "Expired Policies",
            value: isLoading ? null : expiredCount,
          },
          {
            icon: <Shield className="h-5 w-5 text-blue-600" />,
            label: "Total Policies",
            value: isLoading ? null : policies.length,
          },
          {
            icon: <Calendar className="h-5 w-5 text-purple-600" />,
            label: "Next Renewal",
            value: isLoading ? null : nextRenewalStr,
            wide: true,
          },
        ].map(({ icon, label, value, wide }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                {icon}
                <div>
                  <p className="text-sm text-gray-600">{label}</p>
                  {value === null ? (
                    <div className="h-7 w-16 bg-gray-200 rounded animate-pulse mt-0.5" />
                  ) : (
                    <p className={`font-bold ${wide ? "text-lg" : "text-2xl"}`}>{value}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by policy number, coverage type or country…"
                value={filters.search}
                onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Status filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Status
                    {filters.status.length > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                        {filters.status.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-44">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Filter by Status</h4>
                    {["Active", "Expired"].map((s) => (
                      <div key={s} className="flex items-center gap-2">
                        <Checkbox
                          id={`status-${s}`}
                          checked={filters.status.includes(s)}
                          onCheckedChange={(c) => toggleFilter("status", s, c as boolean)}
                        />
                        <Label htmlFor={`status-${s}`} className="flex items-center gap-1.5 cursor-pointer">
                          <StatusIcon status={s} /> {s}
                        </Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Coverage filter */}
              {coverageTypeOptions.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="bg-transparent">
                      <Shield className="h-4 w-4 mr-2" />
                      Coverage
                      {filters.coverageType.length > 0 && (
                        <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                          {filters.coverageType.length}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-52">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Filter by Coverage</h4>
                      {coverageTypeOptions.map((c) => (
                        <div key={c} className="flex items-center gap-2">
                          <Checkbox
                            id={`cov-${c}`}
                            checked={filters.coverageType.includes(c)}
                            onCheckedChange={(chk) => toggleFilter("coverageType", c, chk as boolean)}
                          />
                          <Label htmlFor={`cov-${c}`} className="cursor-pointer">{c}</Label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {/* Country filter */}
              {countryOptions.length > 1 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="bg-transparent">
                      Country
                      {filters.country.length > 0 && (
                        <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                          {filters.country.length}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-44">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Filter by Country</h4>
                      {countryOptions.map((c) => (
                        <div key={c} className="flex items-center gap-2">
                          <Checkbox
                            id={`country-${c}`}
                            checked={filters.country.includes(c)}
                            onCheckedChange={(chk) => toggleFilter("country", c, chk as boolean)}
                          />
                          <Label htmlFor={`country-${c}`} className="cursor-pointer">{c}</Label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {/* Issued date filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Issued Date
                    {(filters.issuedFrom || filters.issuedTo) && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                        {(filters.issuedFrom ? 1 : 0) + (filters.issuedTo ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Filter by Issued Date</h4>
                    <div className="space-y-1.5">
                      <Label htmlFor="issued-from" className="text-xs text-gray-500">From</Label>
                      <Input
                        id="issued-from"
                        type="date"
                        value={filters.issuedFrom}
                        onChange={(e) => setFilters((p) => ({ ...p, issuedFrom: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="issued-to" className="text-xs text-gray-500">To</Label>
                      <Input
                        id="issued-to"
                        type="date"
                        value={filters.issuedTo}
                        onChange={(e) => setFilters((p) => ({ ...p, issuedTo: e.target.value }))}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" onClick={clearFilters} className="text-red-600">
                  Clear All ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policies Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Policies ({isLoading ? "…" : filteredPolicies.length})</CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy Details</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Sum Insured</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && [...Array(3)].map((_, i) => <TableRowSkeleton key={i} />)}

                {!isLoading && filteredPolicies.map((policy) => (
                  <TableRow key={policy.policyId}>
                    <TableCell>
                      <p className="font-medium">{policy.policyNumber}</p>
                      <p className="text-sm text-gray-500">Home Insurance</p>
                      <p className="text-xs text-gray-400">{policy.country} · Issued {policy.issuedAt}</p>
                    </TableCell>

                    <TableCell>
                      <p className="font-medium">{policy.coverageType}</p>
                    </TableCell>

                    <TableCell>
                      <p className="font-medium tabular-nums">
                        {fmtAmount(policy.region, policy.coverageAmount)}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm">{policy.startDate}</p>
                      <p className="text-sm text-gray-500">to {policy.endDate}</p>
                    </TableCell>

                    <TableCell>
                      <Badge className={statusBadgeClass(policy.status)}>
                        <span className="flex items-center gap-1">
                          <StatusIcon status={policy.status} />
                          {policy.status}
                        </span>
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        {/* Download — enabled only when isDocumentReady */}
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={!policy.isDocumentReady || downloadingId === policy.proposalId}
                          title={policy.isDocumentReady ? "Download policy documents (ZIP)" : "Documents not ready yet"}
                          onClick={() => handleDownload(policy)}
                        >
                          {downloadingId === policy.proposalId
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Download className="h-4 w-4" />
                          }
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {!isLoading && filteredPolicies.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="font-medium text-gray-700">No policies found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {activeFiltersCount > 0
                          ? "Try adjusting your filters or search terms."
                          : "You have no issued policies yet."}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
