"use client";

import { useState } from "react";
import { StaffHeader } from "../components/staff-header";
import StaffTable from "../components/staff-table";
import { StaffCalendar } from "../components/staff-calendar";
import { AddStaffModal } from "../components/add-staff-modal";
import { useBusinessContext } from "@/contexts/BusinessContext";

export function StaffContainer() {
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { businessId } = useBusinessContext();

  const handleStaffAdded = () => {
    // Trigger staff table refresh by updating key
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="p-6">
      <StaffHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddStaff={() => setIsAddStaffModalOpen(true)}
      />

      {viewMode === "table" ? (
        <StaffTable key={refreshKey} />
      ) : (
        <StaffCalendar />
      )}

      <AddStaffModal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        businessId={businessId}
        onStaffUpdated={handleStaffAdded}
      />
    </div>
  );
}
