import { ServicesContainer } from "./containers/services-container";
import {
  getTotalServices,
  getActiveServices,
} from "@/lib/business-dashboardAPI";

const BUSINESS_ID = 3;

export default async function ServicesPage() {
  const [totalServices, activeServices] = await Promise.all([
    getTotalServices(BUSINESS_ID),
    getActiveServices(BUSINESS_ID),
  ]);
  return (
    <ServicesContainer
      totalServices={totalServices}
      activeServices={activeServices}
    />
  );
}
