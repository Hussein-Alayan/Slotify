"use client";

import { DashboardHeader } from "../components/dashboard-header";
import { StatsGrid } from "../components/stats-grid";
import { ScheduleCard } from "../components/schedule-card";
import { ActivityCard } from "../components/activity-card";
import AddClientModal from "../../clients/components/add-client-modal";
import { useState } from "react";
import { useParams } from "next/navigation";

export function DashboardContainer({
  totalClients,
  totalBookings,
}: {
  totalClients: number;
  totalBookings: number;
}) {
  const params = useParams();
  const businessId = Number(params.businessId);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  return (
    <div className="p-6 space-y-6">
      <DashboardHeader onAddClient={() => setIsAddClientModalOpen(true)} />
      <StatsGrid totalClients={totalClients} totalBookings={totalBookings} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ScheduleCard />
        <ActivityCard />
      </div>
    
      <AddClientModal
        open={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        businessId={businessId}
      />
    </div>
  );
}
