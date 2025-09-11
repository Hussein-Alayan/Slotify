import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { AnalyticsStats } from "../components/analytics-stats"
import { ChatsChart } from "../components/chats-chart"
import { CaseStatusChart } from "../components/case-status-chart"
import { AgentsPerformance } from "../components/agents-performance"

export function AnalyticsContainer() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Panel</h1>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <AnalyticsStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ChatsChart />
        <CaseStatusChart />
      </div>

      <AgentsPerformance />
    </div>
  )
}
