import { BusinessHubHeader } from "../components/business-hub-header"
import { WelcomeSection } from "../components/welcome-section"
import { QuickActions } from "../components/quick-actions"
import { MyBusinesses } from "../components/my-businesses"

export function BusinessHubContainer() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BusinessHubHeader />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <WelcomeSection />
        <QuickActions />
        <MyBusinesses />
      </div>
    </div>
  )
}
