"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { ServicesContainer } from "./containers/services-container";
import {
  getTotalServices,
  getActiveServices,
} from "@/lib/business-dashboardAPI";

export default function ServicesPage() {
  const params = useParams();
  const businessId = parseInt(params.businessId as string, 10);
  const [stats, setStats] = useState({ totalServices: 0, activeServices: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId || isNaN(businessId)) return;
    Promise.all([getTotalServices(businessId), getActiveServices(businessId)])
      .then(([totalServices, activeServices]) => {
        setStats({ totalServices, activeServices });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [businessId]);

  if (isNaN(businessId)) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold text-red-600">
          Invalid Business ID
        </h1>
        <p className="text-gray-600">Please check the URL and try again.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6">Loading services stats...</div>;
  }

  return (
    <BusinessProvider businessId={businessId}>
      <ServicesContainer
        totalServices={stats.totalServices}
        activeServices={stats.activeServices}
      />
    </BusinessProvider>
  );
}
