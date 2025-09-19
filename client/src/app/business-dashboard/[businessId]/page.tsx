"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardContainer } from "./dashboard/containers/dashboard-container";
import { getTotalClients, getTotalBookings } from "@/lib/business-dashboardAPI";

// Component that fetches and displays business dashboard
function BusinessDashboard({ businessId }: { businessId: number }) {
  const [stats, setStats] = useState({ totalClients: 0, totalBookings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use API utilities instead of raw fetch
    Promise.all([getTotalClients(businessId), getTotalBookings(businessId)])
      .then(([totalClients, totalBookings]) => {
        setStats({
          totalClients,
          totalBookings,
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [businessId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardContainer
      totalClients={stats.totalClients}
      totalBookings={stats.totalBookings}
    />
  );
}

export default function BusinessDashboardPage() {
  const params = useParams();
  const businessId = parseInt(params.businessId as string, 10);

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

  return (
    <ProtectedRoute>
      <BusinessProvider businessId={businessId}>
        <BusinessDashboard businessId={businessId} />
      </BusinessProvider>
    </ProtectedRoute>
  );
}
