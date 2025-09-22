import { getTotalClients, getTotalBookings } from "@/lib/business-dashboardAPI";
import { DashboardContainer } from "./containers/dashboard-container";

// Default business ID (can be overridden by dynamic routes)
const DEFAULT_BUSINESS_ID = 3;

interface PageProps {
  params: Promise<{
    businessId: string;
  }>;
}

export default async function DashboardPage({ params }: PageProps) {
  const resolvedParams = await params;
  const businessId = resolvedParams?.businessId
    ? parseInt(resolvedParams.businessId)
    : DEFAULT_BUSINESS_ID;

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
