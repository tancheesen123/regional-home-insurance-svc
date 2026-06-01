import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const recentPolicies = [
  {
    id: "POL-1234",
    customer: "Maria Santos",
    country: "Philippines",
    type: "Home Building",
    premium: "$450.00",
    status: "Active",
    date: "2025-05-24",
  },
  {
    id: "POL-1235",
    customer: "Sok Dara",
    country: "Cambodia",
    type: "Home Contents",
    premium: "$320.00",
    status: "Active",
    date: "2025-05-23",
  },
  {
    id: "POL-1236",
    customer: "Budi Santoso",
    country: "Indonesia",
    type: "Home Building & Contents",
    premium: "$680.00",
    status: "Pending",
    date: "2025-05-22",
  },
  {
    id: "POL-1237",
    customer: "Juan Dela Cruz",
    country: "Philippines",
    type: "Home Building",
    premium: "$520.00",
    status: "Active",
    date: "2025-05-21",
  },
  {
    id: "POL-1238",
    customer: "Chea Samnang",
    country: "Cambodia",
    type: "Home Contents",
    premium: "$290.00",
    status: "Expired",
    date: "2025-05-20",
  },
]

export function RecentPoliciesTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Policy ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Premium</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentPolicies.map((policy) => (
            <TableRow key={policy.id}>
              <TableCell className="font-medium">{policy.id}</TableCell>
              <TableCell>{policy.customer}</TableCell>
              <TableCell>{policy.country}</TableCell>
              <TableCell>{policy.type}</TableCell>
              <TableCell>{policy.premium}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    policy.status === "Active" ? "default" : policy.status === "Pending" ? "outline" : "destructive"
                  }
                >
                  {policy.status}
                </Badge>
              </TableCell>
              <TableCell>{policy.date}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
