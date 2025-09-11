import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Users, CheckCircle, Clock } from "lucide-react"

const stats = [
  {
    title: "Total Chats Exchanged",
    value: "12,847",
    change: "+12.5% from last month",
    icon: MessageSquare,
    trend: "up",
  },
  {
    title: "Total Interactions",
    value: "45,892",
    change: "+8.3% from last month",
    icon: Users,
    trend: "up",
  },
  {
    title: "Closed Cases",
    value: "8,543",
    change: "-2.1% from last month",
    icon: CheckCircle,
    trend: "down",
  },
  {
    title: "Average Response Time",
    value: "2.4m",
    change: "-15.2% from last month",
    icon: Clock,
    trend: "down",
  },
]

export function AnalyticsStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <stat.icon className="h-5 w-5 text-slate-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"} flex items-center mt-1`}>
              <span className="mr-1">{stat.trend === "up" ? "↗" : "↘"}</span>
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
