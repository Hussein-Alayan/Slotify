import { BusinessCard } from "./business-card"

const mockBusinesses = [
  {
    id: 1,
    name: "Tech Solutions Inc.",
    category: "Software Development",
    status: "Active" as const,
  },
  {
    id: 2,
    name: "Creative Studio",
    category: "Design & Marketing",
    status: "Active" as const,
  },
  {
    id: 3,
    name: "Consulting Pro",
    category: "Business Consulting",
    status: "Pending" as const,
  },
]

export function MyBusinesses() {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">My Businesses</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBusinesses.map((business) => (
          <BusinessCard key={business.id} name={business.name} category={business.category} status={business.status} />
        ))}
      </div>
    </div>
  )
}
