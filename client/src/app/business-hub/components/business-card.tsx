import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface BusinessCardProps {
  name: string
  category: string
  status: "Active" | "Inactive" | "Pending"
  logoUrl?: string
}

export function BusinessCard({ name, category, status, logoUrl }: BusinessCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 hover:bg-green-100"
      case "Inactive":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100"
      case "Pending":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100"
    }
  }

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Business Logo Placeholder */}
        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
          {logoUrl ? (
            <img
              src={logoUrl || "/placeholder.svg"}
              alt={`${name} logo`}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-gray-500 text-sm">Business Logo</span>
          )}
        </div>

        {/* Business Info */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{category}</p>

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className={getStatusColor(status)}>
              {status}
            </Badge>

            <Button size="sm" className="bg-slate-800 text-white hover:bg-slate-700">
              View Dashboard
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
