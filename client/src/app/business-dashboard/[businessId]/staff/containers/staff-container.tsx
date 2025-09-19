"use client";

import { useState } from "react";
import { StaffHeader } from "../components/staff-header";
import StaffTable from "../components/staff-table";
import { StaffCalendar } from "../components/staff-calendar";
import { AddStaffModal } from "../components/add-staff-modal";

export function StaffContainer() {
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);

  return (
    <div className="p-6">
      <StaffHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddStaff={() => setIsAddStaffModalOpen(true)}
      />

      {viewMode === "table" ? <StaffTable /> : <StaffCalendar />}

      <AddStaffModal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
      />
    </div>
  );
}
