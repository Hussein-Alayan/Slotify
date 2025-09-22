"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { ServicesContainer } from "./containers/services-container";
import {
  getTotalServices,
  getActiveServices,
} from "@/lib/business-dashboardAPI";
import { Skeleton } from "@/components/ui/skeleton";

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
    return (
      <div className="p-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        {/* Filters skeleton */}
        <Skeleton className="h-10 w-full mb-6" />
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
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
