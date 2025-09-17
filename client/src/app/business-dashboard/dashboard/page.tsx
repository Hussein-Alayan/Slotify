import { getTotalClients } from "@/lib/business-dashboardAPI";
import { DashboardContainer } from "./containers/dashboard-container";

// Replace with your actual business ID
const BUSINESS_ID = 1;

export default async function DashboardPage() {
  const totalClients = await getTotalClients(BUSINESS_ID);
  return <DashboardContainer totalClients={totalClients} />;
}
