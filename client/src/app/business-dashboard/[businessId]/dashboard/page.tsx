import { getTotalClients, getTotalBookings } from "@/lib/business-dashboardAPI";
import { DashboardContainer } from "./containers/dashboard-container";

// Default business ID (can be overridden by dynamic routes)
const DEFAULT_BUSINESS_ID = 3;

export default async function DashboardPage({
  businessId = DEFAULT_BUSINESS_ID,
}: {
  businessId?: number;
} = {}) {
  const [totalClients, totalBookings] = await Promise.all([
    getTotalClients(businessId),
    getTotalBookings(businessId),
  ]);
  return (
    <DashboardContainer
      totalClients={totalClients}
      totalBookings={totalBookings}
    />
  );
}
