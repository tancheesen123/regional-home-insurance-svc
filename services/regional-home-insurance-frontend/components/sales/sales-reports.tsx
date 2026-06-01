"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, Eye, Calendar, TrendingUp, DollarSign, Users, FileText, BarChart3, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays, format } from "date-fns"
import type { DateRange } from "react-day-picker"

interface SalesRecord {
  id: string
  policyNumber: string
  customerName: string
  customerEmail: string
  productType: string
  coverageType: string
  premium: number
  commission: number
  saleDate: string
  effectiveDate: string
  status: "Active" | "Pending" | "Cancelled" | "Expired"
  paymentMethod: string
  region: string
  agentName: string
  agentId: string
  renewalDate: string
}

const mockSalesData: SalesRecord[] = [
  {
    id: "SR-2025-001",
    policyNumber: "HI-2025-001234",
    customerName: "Maria Santos",
    customerEmail: "maria.santos@email.com",
    productType: "Home Insurance",
    coverageType: "Building + Contents",
    premium: 1333.76,
    commission: 133.38,
    saleDate: "2025-01-06",
    effectiveDate: "2025-01-12",
    status: "Active",
    paymentMethod: "Credit Card",
    region: "Philippines",
    agentName: "Juan Dela Cruz",
    agentId: "AGT-001",
    renewalDate: "2026-01-12",
  },
  {
    id: "SR-2025-002",
    policyNumber: "HI-2025-001235",
    customerName: "Sok Dara",
    customerEmail: "sok.dara@email.com",
    productType: "Home Insurance",
    coverageType: "Contents Only",
    premium: 890.5,
    commission: 89.05,
    saleDate: "2025-01-05",
    effectiveDate: "2025-01-11",
    status: "Active",
    paymentMethod: "Bank Transfer",
    region: "Cambodia",
    agentName: "Chea Samnang",
    agentId: "AGT-002",
    renewalDate: "2026-01-11",
  },
  {
    id: "SR-2025-003",
    policyNumber: "HI-2025-001236",
    customerName: "Budi Santoso",
    customerEmail: "budi.santoso@email.com",
    productType: "Home Insurance",
    coverageType: "Building Only",
    premium: 1150.25,
    commission: 115.03,
    saleDate: "2025-01-04",
    effectiveDate: "2025-01-10",
    status: "Pending",
    paymentMethod: "Digital Wallet",
    region: "Indonesia",
    agentName: "Sari Dewi",
    agentId: "AGT-003",
    renewalDate: "2026-01-10",
  },
  {
    id: "SR-2025-004",
    policyNumber: "HI-2025-001237",
    customerName: "Nguyen Van Minh",
    customerEmail: "nguyen.minh@email.com",
    productType: "Home Insurance",
    coverageType: "Building + Contents",
    premium: 1450.0,
    commission: 145.0,
    saleDate: "2025-01-03",
    effectiveDate: "2025-01-09",
    status: "Active",
    paymentMethod: "Online Banking",
    region: "Vietnam",
    agentName: "Tran Thi Lan",
    agentId: "AGT-004",
    renewalDate: "2026-01-09",
  },
  {
    id: "SR-2025-005",
    policyNumber: "HI-2025-001238",
    customerName: "Lim Wei Ming",
    customerEmail: "lim.weiming@email.com",
    productType: "Home Insurance",
    coverageType: "Contents Only",
    premium: 750.8,
    commission: 75.08,
    saleDate: "2025-01-02",
    effectiveDate: "2025-01-08",
    status: "Cancelled",
    paymentMethod: "Credit Card",
    region: "Malaysia",
    agentName: "Ahmad Rahman",
    agentId: "AGT-005",
    renewalDate: "2026-01-08",
  },
  {
    id: "SR-2025-006",
    policyNumber: "CI-2025-001239",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.johnson@email.com",
    productType: "Car Insurance",
    coverageType: "Comprehensive",
    premium: 2100.0,
    commission: 210.0,
    saleDate: "2025-01-01",
    effectiveDate: "2025-01-07",
    status: "Active",
    paymentMethod: "Credit Card",
    region: "Philippines",
    agentName: "Juan Dela Cruz",
    agentId: "AGT-001",
    renewalDate: "2026-01-07",
  },
  {
    id: "SR-2025-007",
    policyNumber: "TI-2025-001240",
    customerName: "Chen Wei",
    customerEmail: "chen.wei@email.com",
    productType: "Travel Insurance",
    coverageType: "International",
    premium: 450.0,
    commission: 45.0,
    saleDate: "2024-12-31",
    effectiveDate: "2025-01-06",
    status: "Active",
    paymentMethod: "Digital Wallet",
    region: "Malaysia",
    agentName: "Ahmad Rahman",
    agentId: "AGT-005",
    renewalDate: "2026-01-06",
  },
  {
    id: "SR-2025-008",
    policyNumber: "HI-2025-001241",
    customerName: "Preap Sovann",
    customerEmail: "preap.sovann@email.com",
    productType: "Home Insurance",
    coverageType: "Building + Contents",
    premium: 1275.5,
    commission: 127.55,
    saleDate: "2024-12-30",
    effectiveDate: "2025-01-05",
    status: "Pending",
    paymentMethod: "Bank Transfer",
    region: "Cambodia",
    agentName: "Chea Samnang",
    agentId: "AGT-002",
    renewalDate: "2026-01-05",
  },
  {
    id: "SR-2025-009",
    policyNumber: "CI-2025-001242",
    customerName: "Indira Sari",
    customerEmail: "indira.sari@email.com",
    productType: "Car Insurance",
    coverageType: "Third Party",
    premium: 850.0,
    commission: 85.0,
    saleDate: "2024-12-29",
    effectiveDate: "2025-01-04",
    status: "Active",
    paymentMethod: "Online Banking",
    region: "Indonesia",
    agentName: "Sari Dewi",
    agentId: "AGT-003",
    renewalDate: "2026-01-04",
  },
  {
    id: "SR-2025-010",
    policyNumber: "HI-2025-001243",
    customerName: "Le Thi Mai",
    customerEmail: "le.mai@email.com",
    productType: "Home Insurance",
    coverageType: "Contents Only",
    premium: 680.25,
    commission: 68.03,
    saleDate: "2024-12-28",
    effectiveDate: "2025-01-03",
    status: "Expired",
    paymentMethod: "Credit Card",
    region: "Vietnam",
    agentName: "Tran Thi Lan",
    agentId: "AGT-004",
    renewalDate: "2026-01-03",
  },
  {
    id: "SR-2025-011",
    policyNumber: "TI-2025-001244",
    customerName: "Rajesh Kumar",
    customerEmail: "rajesh.kumar@email.com",
    productType: "Travel Insurance",
    coverageType: "Domestic",
    premium: 280.0,
    commission: 28.0,
    saleDate: "2024-12-27",
    effectiveDate: "2025-01-02",
    status: "Active",
    paymentMethod: "Digital Wallet",
    region: "Malaysia",
    agentName: "Priya Sharma",
    agentId: "AGT-006",
    renewalDate: "2026-01-02",
  },
  {
    id: "SR-2025-012",
    policyNumber: "HI-2025-001245",
    customerName: "Jose Rizal",
    customerEmail: "jose.rizal@email.com",
    productType: "Home Insurance",
    coverageType: "Building Only",
    premium: 1050.0,
    commission: 105.0,
    saleDate: "2024-12-26",
    effectiveDate: "2025-01-01",
    status: "Active",
    paymentMethod: "Bank Transfer",
    region: "Philippines",
    agentName: "Maria Garcia",
    agentId: "AGT-007",
    renewalDate: "2026-01-01",
  },
  {
    id: "SR-2025-013",
    policyNumber: "CI-2025-001246",
    customerName: "Vanna Sophea",
    customerEmail: "vanna.sophea@email.com",
    productType: "Car Insurance",
    coverageType: "Comprehensive",
    premium: 1950.0,
    commission: 195.0,
    saleDate: "2024-12-25",
    effectiveDate: "2024-12-31",
    status: "Cancelled",
    paymentMethod: "Credit Card",
    region: "Cambodia",
    agentName: "Chea Samnang",
    agentId: "AGT-002",
    renewalDate: "2025-12-31",
  },
  {
    id: "SR-2025-014",
    policyNumber: "HI-2025-001247",
    customerName: "Dewi Kartika",
    customerEmail: "dewi.kartika@email.com",
    productType: "Home Insurance",
    coverageType: "Building + Contents",
    premium: 1425.75,
    commission: 142.58,
    saleDate: "2024-12-24",
    effectiveDate: "2024-12-30",
    status: "Active",
    paymentMethod: "Online Banking",
    region: "Indonesia",
    agentName: "Andi Wijaya",
    agentId: "AGT-008",
    renewalDate: "2025-12-30",
  },
  {
    id: "SR-2025-015",
    policyNumber: "TI-2025-001248",
    customerName: "Pham Van Duc",
    customerEmail: "pham.duc@email.com",
    productType: "Travel Insurance",
    coverageType: "International",
    premium: 520.0,
    commission: 52.0,
    saleDate: "2024-12-23",
    effectiveDate: "2024-12-29",
    status: "Active",
    paymentMethod: "Digital Wallet",
    region: "Vietnam",
    agentName: "Tran Thi Lan",
    agentId: "AGT-004",
    renewalDate: "2025-12-29",
  },
  {
    id: "SR-2024-016",
    policyNumber: "HI-2024-001249",
    customerName: "Tan Ah Kow",
    customerEmail: "tan.ahkow@email.com",
    productType: "Home Insurance",
    coverageType: "Contents Only",
    premium: 795.0,
    commission: 79.5,
    saleDate: "2024-12-22",
    effectiveDate: "2024-12-28",
    status: "Active",
    paymentMethod: "Credit Card",
    region: "Malaysia",
    agentName: "Priya Sharma",
    agentId: "AGT-006",
    renewalDate: "2025-12-28",
  },
  {
    id: "SR-2024-017",
    policyNumber: "CI-2024-001250",
    customerName: "Anna Reyes",
    customerEmail: "anna.reyes@email.com",
    productType: "Car Insurance",
    coverageType: "Third Party",
    premium: 720.0,
    commission: 72.0,
    saleDate: "2024-12-21",
    effectiveDate: "2024-12-27",
    status: "Pending",
    paymentMethod: "Bank Transfer",
    region: "Philippines",
    agentName: "Maria Garcia",
    agentId: "AGT-007",
    renewalDate: "2025-12-27",
  },
  {
    id: "SR-2024-018",
    policyNumber: "HI-2024-001251",
    customerName: "Kosal Meas",
    customerEmail: "kosal.meas@email.com",
    productType: "Home Insurance",
    coverageType: "Building Only",
    premium: 980.0,
    commission: 98.0,
    saleDate: "2024-12-20",
    effectiveDate: "2024-12-26",
    status: "Active",
    paymentMethod: "Online Banking",
    region: "Cambodia",
    agentName: "Sophea Kem",
    agentId: "AGT-009",
    renewalDate: "2025-12-26",
  },
  {
    id: "SR-2024-019",
    policyNumber: "TI-2024-001252",
    customerName: "Rini Susanti",
    customerEmail: "rini.susanti@email.com",
    productType: "Travel Insurance",
    coverageType: "Domestic",
    premium: 320.0,
    commission: 32.0,
    saleDate: "2024-12-19",
    effectiveDate: "2024-12-25",
    status: "Expired",
    paymentMethod: "Digital Wallet",
    region: "Indonesia",
    agentName: "Andi Wijaya",
    agentId: "AGT-008",
    renewalDate: "2025-12-25",
  },
  {
    id: "SR-2024-020",
    policyNumber: "HI-2024-001253",
    customerName: "Hoang Thi Linh",
    customerEmail: "hoang.linh@email.com",
    productType: "Home Insurance",
    coverageType: "Building + Contents",
    premium: 1380.0,
    commission: 138.0,
    saleDate: "2024-12-18",
    effectiveDate: "2024-12-24",
    status: "Active",
    paymentMethod: "Credit Card",
    region: "Vietnam",
    agentName: "Nguyen Van Duc",
    agentId: "AGT-010",
    renewalDate: "2025-12-24",
  },
  {
    id: "SR-2024-021",
    policyNumber: "CI-2024-001254",
    customerName: "Siti Nurhaliza",
    customerEmail: "siti.nurhaliza@email.com",
    productType: "Car Insurance",
    coverageType: "Comprehensive",
    premium: 2250.0,
    commission: 225.0,
    saleDate: "2024-12-17",
    effectiveDate: "2024-12-23",
    status: "Active",
    paymentMethod: "Bank Transfer",
    region: "Malaysia",
    agentName: "Ahmad Rahman",
    agentId: "AGT-005",
    renewalDate: "2025-12-23",
  },
  {
    id: "SR-2024-022",
    policyNumber: "TI-2024-001255",
    customerName: "Roberto Santos",
    customerEmail: "roberto.santos@email.com",
    productType: "Travel Insurance",
    coverageType: "International",
    premium: 480.0,
    commission: 48.0,
    saleDate: "2024-12-16",
    effectiveDate: "2024-12-22",
    status: "Cancelled",
    paymentMethod: "Online Banking",
    region: "Philippines",
    agentName: "Juan Dela Cruz",
    agentId: "AGT-001",
    renewalDate: "2025-12-22",
  },
  {
    id: "SR-2024-023",
    policyNumber: "HI-2024-001256",
    customerName: "Pisach Roth",
    customerEmail: "pisach.roth@email.com",
    productType: "Home Insurance",
    coverageType: "Contents Only",
    premium: 650.0,
    commission: 65.0,
    saleDate: "2024-12-15",
    effectiveDate: "2024-12-21",
    status: "Active",
    paymentMethod: "Digital Wallet",
    region: "Cambodia",
    agentName: "Sophea Kem",
    agentId: "AGT-009",
    renewalDate: "2025-12-21",
  },
  {
    id: "SR-2024-024",
    policyNumber: "CI-2024-001257",
    customerName: "Bambang Sutrisno",
    customerEmail: "bambang.sutrisno@email.com",
    productType: "Car Insurance",
    coverageType: "Third Party",
    premium: 890.0,
    commission: 89.0,
    saleDate: "2024-12-14",
    effectiveDate: "2024-12-20",
    status: "Pending",
    paymentMethod: "Credit Card",
    region: "Indonesia",
    agentName: "Sari Dewi",
    agentId: "AGT-003",
    renewalDate: "2025-12-20",
  },
  {
    id: "SR-2024-025",
    policyNumber: "HI-2024-001258",
    customerName: "Vo Thi Hoa",
    customerEmail: "vo.hoa@email.com",
    productType: "Home Insurance",
    coverageType: "Building Only",
    premium: 1125.0,
    commission: 112.5,
    saleDate: "2024-12-13",
    effectiveDate: "2024-12-19",
    status: "Active",
    paymentMethod: "Bank Transfer",
    region: "Vietnam",
    agentName: "Nguyen Van Duc",
    agentId: "AGT-010",
    renewalDate: "2025-12-19",
  },
]

export default function SalesReports() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -60),
    to: new Date(),
  })
  const [activeTab, setActiveTab] = useState("overview")

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return mockSalesData.filter((record) => {
      const matchesSearch =
        record.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRegion = selectedRegion === "all" || record.region === selectedRegion
      const matchesStatus = selectedStatus === "all" || record.status === selectedStatus
      const matchesProduct = selectedProduct === "all" || record.productType === selectedProduct

      const saleDate = new Date(record.saleDate)
      const matchesDateRange =
        !dateRange?.from || !dateRange?.to || (saleDate >= dateRange.from && saleDate <= dateRange.to)

      return matchesSearch && matchesRegion && matchesStatus && matchesProduct && matchesDateRange
    })
  }, [searchTerm, selectedRegion, selectedStatus, selectedProduct, dateRange])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalSales = filteredData.length
    const totalPremium = filteredData.reduce((sum, record) => sum + record.premium, 0)
    const totalCommission = filteredData.reduce((sum, record) => sum + record.commission, 0)
    const activePolicies = filteredData.filter((record) => record.status === "Active").length
    const pendingPolicies = filteredData.filter((record) => record.status === "Pending").length

    return {
      totalSales,
      totalPremium,
      totalCommission,
      activePolicies,
      pendingPolicies,
      averagePremium: totalSales > 0 ? totalPremium / totalSales : 0,
    }
  }, [filteredData])

  const handleViewReport = (reportId: string) => {
    router.push(`/dashboard/sales/${reportId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      case "Expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Sales Reports</h1>
          <p className="text-gray-600">Monitor and analyze insurance sales performance</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold">{summaryStats.totalSales}</p>
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
                <p className="text-2xl font-bold">${summaryStats.totalPremium.toLocaleString()}</p>
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
                <p className="text-2xl font-bold">{summaryStats.activePolicies}</p>
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
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="Philippines">Philippines</SelectItem>
                  <SelectItem value="Cambodia">Cambodia</SelectItem>
                  <SelectItem value="Indonesia">Indonesia</SelectItem>
                  <SelectItem value="Vietnam">Vietnam</SelectItem>
                  <SelectItem value="Malaysia">Malaysia</SelectItem>
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
                  <SelectItem value="Car Insurance">Car Insurance</SelectItem>
                  <SelectItem value="Travel Insurance">Travel Insurance</SelectItem>
                </SelectContent>
              </Select>

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

        <TabsContent value="overview" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summaryStats.averagePremium.toFixed(2)}</div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12% from last month
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryStats.pendingPolicies}</div>
                <div className="flex items-center text-sm text-yellow-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  Requires attention
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.5%</div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5% from last month
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredData.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
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
                      <p className="font-medium">${record.premium.toLocaleString()}</p>
                      <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {/* Sales Table */}
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
                    {filteredData.map((record) => (
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
                            <p className="font-medium">${record.premium.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">{record.paymentMethod}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-green-600">${record.commission.toLocaleString()}</p>
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

              {filteredData.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No sales records found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Analytics placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sales by Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Philippines", "Cambodia", "Indonesia", "Vietnam", "Malaysia"].map((region) => {
                    const regionSales = filteredData.filter((record) => record.region === region).length
                    const percentage = filteredData.length > 0 ? (regionSales / filteredData.length) * 100 : 0
                    return (
                      <div key={region} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{region}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className="text-sm text-gray-600">{regionSales}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
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
                  {["Active", "Pending", "Cancelled", "Expired"].map((status) => {
                    const statusSales = filteredData.filter((record) => record.status === status).length
                    const percentage = filteredData.length > 0 ? (statusSales / filteredData.length) * 100 : 0
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{status}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
