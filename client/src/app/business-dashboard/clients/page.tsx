import { Sidebar } from "@/shared/components/sidebar"
import { ClientContainer } from "./containers/client-container"

export default function ClientsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <ClientContainer />
      </main>
    </div>
  )
}
