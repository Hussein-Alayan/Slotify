import { Building2, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function WelcomeSection() {
  return (
    <div className="bg-white rounded-lg border p-6 mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome back, Hussein!</h2>
          <p className="text-gray-600 mb-4">Ready to manage your businesses? Here's your dashboard overview.</p>

          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-green-600" />
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
              3 Active Businesses
            </Badge>
          </div>
        </div>

        <Button variant="outline" size="sm" className="bg-slate-800 text-white hover:bg-slate-700 border-slate-800">
          <User className="w-4 h-4 mr-2" />
          Profile
        </Button>
      </div>
    </div>
  )
}
