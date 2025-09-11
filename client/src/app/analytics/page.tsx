import { AdminSidebar } from "@/shared/components/admin-sidebar"
import { AnalyticsContainer } from "./containers/analytics-container"

export default function AdminAnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1">
        <AnalyticsContainer />
      </main>
    </div>
  )
}
