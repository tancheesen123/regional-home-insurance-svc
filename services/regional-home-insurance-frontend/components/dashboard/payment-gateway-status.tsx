import { CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function PaymentGatewayStatus() {
  const gateways = [
    {
      name: "Paynamics",
      country: "Philippines",
      status: "operational",
      lastChecked: "5 minutes ago",
      transactions: "1,245",
      successRate: "99.8%",
    },
    {
      name: "iPay88",
      country: "Cambodia",
      status: "operational",
      lastChecked: "3 minutes ago",
      transactions: "892",
      successRate: "99.5%",
    },
    {
      name: "DOKU",
      country: "Indonesia",
      status: "degraded",
      lastChecked: "2 minutes ago",
      transactions: "1,056",
      successRate: "97.2%",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {gateways.map((gateway) => (
        <Card key={gateway.name}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>{gateway.name}</CardTitle>
              {gateway.status === "operational" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : gateway.status === "degraded" ? (
                <Clock className="h-5 w-5 text-amber-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <CardDescription>{gateway.country}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Status:</div>
              <div
                className={
                  gateway.status === "operational"
                    ? "text-green-500 font-medium"
                    : gateway.status === "degraded"
                      ? "text-amber-500 font-medium"
                      : "text-red-500 font-medium"
                }
              >
                {gateway.status === "operational" ? "Operational" : gateway.status === "degraded" ? "Degraded" : "Down"}
              </div>

              <div className="text-muted-foreground">Last checked:</div>
              <div>{gateway.lastChecked}</div>

              <div className="text-muted-foreground">Transactions:</div>
              <div>{gateway.transactions}</div>

              <div className="text-muted-foreground">Success rate:</div>
              <div>{gateway.successRate}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
