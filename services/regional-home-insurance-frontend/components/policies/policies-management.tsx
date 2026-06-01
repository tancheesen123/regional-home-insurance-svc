"use client"

import { useState, useMemo } from "react"
import axios from "axios"
import {
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { log } from "console"

interface Policy {
  id: string
  policyNumber: string
  type: string
  status: "Active" | "Expired" | "Pending" | "Cancelled"
  premium: number
  startDate: string
  endDate: string
  coverageType: string
  buildingAmount?: number
  contentAmount?: number
  country: string
  paymentFrequency: "Annual" | "Monthly"
  nextPayment?: string
  claimsCount: number
}

const mockPolicies: Policy[] = [
  {
    id: "1",
    policyNumber: "HI-2025-001234",
    type: "Home Insurance",
    status: "Active",
    premium: 1333.76,
    startDate: "2025-01-21",
    endDate: "2026-01-20",
    coverageType: "Building + Contents",
    buildingAmount: 500000,
    contentAmount: 60000,
    country: "Malaysia",
    paymentFrequency: "Annual",
    nextPayment: "2026-01-21",
    claimsCount: 0,
  },
  {
    id: "2",
    policyNumber: "HI-2024-001235",
    type: "Home Insurance",
    status: "Expired",
    premium: 1250.0,
    startDate: "2024-01-21",
    endDate: "2025-01-20",
    coverageType: "Building Only",
    buildingAmount: 450000,
    country: "Malaysia",
    paymentFrequency: "Annual",
    claimsCount: 1,
  },
  {
    id: "3",
    policyNumber: "HI-2025-001236",
    type: "Home Insurance",
    status: "Active",
    premium: 156.25,
    startDate: "2025-01-15",
    endDate: "2026-01-14",
    coverageType: "Contents Only",
    contentAmount: 40000,
    country: "Philippines",
    paymentFrequency: "Monthly",
    nextPayment: "2025-02-15",
    claimsCount: 0,
  },
  {
    id: "4",
    policyNumber: "HI-2024-001237",
    type: "Home Insurance",
    status: "Cancelled",
    premium: 980.5,
    startDate: "2024-06-01",
    endDate: "2025-05-31",
    coverageType: "Building + Contents",
    buildingAmount: 300000,
    contentAmount: 35000,
    country: "Indonesia",
    paymentFrequency: "Annual",
    claimsCount: 2,
  },
  {
    id: "5",
    policyNumber: "HI-2025-001238",
    type: "Home Insurance",
    status: "Pending",
    premium: 1450.0,
    startDate: "2025-02-01",
    endDate: "2026-01-31",
    coverageType: "Building + Contents",
    buildingAmount: 600000,
    contentAmount: 80000,
    country: "Malaysia",
    paymentFrequency: "Annual",
    claimsCount: 0,
  },
]

interface FilterState {
  search: string
  status: string[]
  coverageType: string[]
  country: string[]
  paymentFrequency: string[]
  dateRange: string
}

export default function PoliciesManagement() {
  const [activeTab, setActiveTab] = useState("all")
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: [],
    coverageType: [],
    country: [],
    paymentFrequency: [],
    dateRange: "",
  })
  const [terminatingPolicy, setTerminatingPolicy] = useState<string | null>(null)

  const statusOptions = ["Active", "Expired", "Pending", "Cancelled"]
  const coverageOptions = ["Building + Contents", "Building Only", "Contents Only"]
  const countryOptions = ["Malaysia", "Philippines", "Indonesia"]
  const paymentOptions = ["Annual", "Monthly"]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Expired":
        return <Clock className="h-4 w-4 text-gray-600" />
      case "Pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "Cancelled":
        return <X className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Expired":
        return "bg-gray-100 text-gray-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredPolicies = useMemo(() => {
    let filtered = mockPolicies

    // Filter by tab
    if (activeTab === "active") {
      filtered = filtered.filter((policy) => policy.status === "Active")
    } else if (activeTab === "expired") {
      filtered = filtered.filter((policy) => policy.status === "Expired")
    }

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(
        (policy) =>
          policy.policyNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
          policy.type.toLowerCase().includes(filters.search.toLowerCase()) ||
          policy.coverageType.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter((policy) => filters.status.includes(policy.status))
    }

    // Apply coverage type filter
    if (filters.coverageType.length > 0) {
      filtered = filtered.filter((policy) => filters.coverageType.includes(policy.coverageType))
    }

    // Apply country filter
    if (filters.country.length > 0) {
      filtered = filtered.filter((policy) => filters.country.includes(policy.country))
    }

    // Apply payment frequency filter
    if (filters.paymentFrequency.length > 0) {
      filtered = filtered.filter((policy) => filters.paymentFrequency.includes(policy.paymentFrequency))
    }

    return filtered
  }, [mockPolicies, activeTab, filters])

  const handleFilterChange = (key: keyof FilterState, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleCheckboxFilter = (key: keyof FilterState, value: string, checked: boolean) => {
    setFilters((prev) => {
      const currentValues = prev[key] as string[]
      if (checked) {
        return { ...prev, [key]: [...currentValues, value] }
      } else {
        return { ...prev, [key]: currentValues.filter((v) => v !== value) }
      }
    })
  }

  const testFetchData = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/application`,
      {
        headers: {
          "X-Country-Code": "PH"
        }
      }
    )
    console.log("Success:", response.data)
  } catch (error) {
    console.error("Failed:", error)
  }
}
  const clearAllFilters = () => {
    setFilters({
      search: "",
      status: [],
      coverageType: [],
      country: [],
      paymentFrequency: [],
      dateRange: "",
    })
  }

  const handleTerminatePolicy = (policyId: string) => {
    // In a real app, this would make an API call to terminate the policy
    console.log(`Terminating policy: ${policyId}`)

    // Update the policy status to "Cancelled"
    const updatedPolicies = mockPolicies.map((policy) =>
      policy.id === policyId ? { ...policy, status: "Cancelled" as const } : policy,
    )

    // In a real app, you would update the state or refetch data
    // For now, we'll just log the action
    setTerminatingPolicy(null)

    // You could add a toast notification here
    console.log("Policy terminated successfully")
  }

  const activeFiltersCount = Object.values(filters).reduce((count, filter) => {
    if (Array.isArray(filter)) {
      return count + filter.length
    }
    return count + (filter ? 1 : 0)
  }, 0)

  const activePolicies = mockPolicies.filter((p) => p.status === "Active").length
  const expiredPolicies = mockPolicies.filter((p) => p.status === "Expired").length
  const totalPremium = mockPolicies.filter((p) => p.status === "Active").reduce((sum, p) => sum + p.premium, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Policies</h1>
          <p className="text-gray-600">Manage and view all your insurance policies</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Policy
          </Button>
           <Button onClick={testFetchData}>
            <FileText className="h-4 w-4 mr-2" />
            test
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Policies</p>
                <p className="text-2xl font-bold">{activePolicies}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Expired Policies</p>
                <p className="text-2xl font-bold">{expiredPolicies}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Coverage</p>
                <p className="text-2xl font-bold">RM {totalPremium.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Next Renewal</p>
                <p className="text-lg font-bold">Jan 21, 2026</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search policies by number, type, or coverage..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Status Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="relative bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Status
                    {filters.status.length > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                        {filters.status.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="space-y-2">
                    <h4 className="font-medium">Filter by Status</h4>
                    {statusOptions.map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={filters.status.includes(status)}
                          onCheckedChange={(checked) => handleCheckboxFilter("status", status, checked as boolean)}
                        />
                        <Label htmlFor={`status-${status}`} className="flex items-center space-x-2">
                          {getStatusIcon(status)}
                          <span>{status}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Coverage Type Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="relative bg-transparent">
                    <Shield className="h-4 w-4 mr-2" />
                    Coverage
                    {filters.coverageType.length > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                        {filters.coverageType.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="space-y-2">
                    <h4 className="font-medium">Filter by Coverage</h4>
                    {coverageOptions.map((coverage) => (
                      <div key={coverage} className="flex items-center space-x-2">
                        <Checkbox
                          id={`coverage-${coverage}`}
                          checked={filters.coverageType.includes(coverage)}
                          onCheckedChange={(checked) =>
                            handleCheckboxFilter("coverageType", coverage, checked as boolean)
                          }
                        />
                        <Label htmlFor={`coverage-${coverage}`}>{coverage}</Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Country Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="relative bg-transparent">
                    Country
                    {filters.country.length > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                        {filters.country.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="space-y-2">
                    <h4 className="font-medium">Filter by Country</h4>
                    {countryOptions.map((country) => (
                      <div key={country} className="flex items-center space-x-2">
                        <Checkbox
                          id={`country-${country}`}
                          checked={filters.country.includes(country)}
                          onCheckedChange={(checked) => handleCheckboxFilter("country", country, checked as boolean)}
                        />
                        <Label htmlFor={`country-${country}`}>{country}</Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Payment Frequency Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="relative bg-transparent">
                    Payment
                    {filters.paymentFrequency.length > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                        {filters.paymentFrequency.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="space-y-2">
                    <h4 className="font-medium">Filter by Payment</h4>
                    {paymentOptions.map((payment) => (
                      <div key={payment} className="flex items-center space-x-2">
                        <Checkbox
                          id={`payment-${payment}`}
                          checked={filters.paymentFrequency.includes(payment)}
                          onCheckedChange={(checked) =>
                            handleCheckboxFilter("paymentFrequency", payment, checked as boolean)
                          }
                        />
                        <Label htmlFor={`payment-${payment}`}>{payment}</Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" onClick={clearAllFilters} className="text-red-600">
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
            <CardTitle>Policies ({filteredPolicies.length})</CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Policies</TabsTrigger>
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
                  <TableHead>Premium</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Claims</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{policy.policyNumber}</p>
                        <p className="text-sm text-gray-600">{policy.type}</p>
                        <p className="text-xs text-gray-500">{policy.country}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{policy.coverageType}</p>
                        {policy.buildingAmount && (
                          <p className="text-xs text-gray-600">Building: RM {policy.buildingAmount.toLocaleString()}</p>
                        )}
                        {policy.contentAmount && (
                          <p className="text-xs text-gray-600">Contents: RM {policy.contentAmount.toLocaleString()}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">RM {policy.premium.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">{policy.paymentFrequency}</p>
                        {policy.nextPayment && <p className="text-xs text-blue-600">Next: {policy.nextPayment}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{policy.startDate}</p>
                        <p className="text-sm">to {policy.endDate}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(policy.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(policy.status)}
                          <span>{policy.status}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <p className="font-medium">{policy.claimsCount}</p>
                        <p className="text-xs text-gray-600">claims</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {policy.status === "Active" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Terminate Policy</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to terminate policy {policy.policyNumber}? This action cannot be
                                  undone and will immediately cancel the policy.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleTerminatePolicy(policy.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Terminate Policy
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPolicies.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
