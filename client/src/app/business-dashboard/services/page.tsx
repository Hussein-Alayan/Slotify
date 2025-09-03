import { Sidebar } from "@/components/shared/sidebar";
import { ServicesContainer } from "./containers/services-container";

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <ServicesContainer />
      </main>
    </div>
  );
}
