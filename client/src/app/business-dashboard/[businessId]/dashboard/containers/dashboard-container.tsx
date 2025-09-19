"use client";

import { DashboardHeader } from "../components/dashboard-header";
import { StatsGrid } from "../components/stats-grid";
import { AppointmentsTable } from "../components/appointments-table";
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

      {/* Appointments Table */}
      <AppointmentsTable />

      {/* Main Content Grid */}
      <AddClientModal
        open={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        businessId={businessId}
      />
    </div>
  );
}
