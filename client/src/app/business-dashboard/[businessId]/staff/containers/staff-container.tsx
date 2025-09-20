"use client";

import { useState } from "react";
import { StaffHeader } from "../components/staff-header";
import StaffTable from "../components/staff-table";
import { AbsenceManagement } from "../components/absence-management";
import { AddStaffModal } from "../components/add-staff-modal";
import { useBusinessContext } from "@/contexts/BusinessContext";

export function StaffContainer() {
  const [viewMode, setViewMode] = useState<"table" | "absence">("table");
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const { businessId } = useBusinessContext();

  return (
    <div className="p-6">
      <StaffHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddStaff={() => setIsAddStaffModalOpen(true)}
      />

      {viewMode === "table" ? <StaffTable /> : <AbsenceManagement />}

      <AddStaffModal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        businessId={businessId}
      />
    </div>
  );
}
