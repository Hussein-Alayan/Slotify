"use client";

import { Button } from "@/components/ui/button";
import { Menu, Plus } from "lucide-react";
import { StaffList } from "../components/staff-list";
import { WeeklySchedule } from "../components/weekly-schedule";
import { StaffStats } from "../components/staff-stats";

export function StaffContainer() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Menu className="h-6 w-6 text-gray-600" />
          <h1 className="text-2xl font-semibold text-gray-900">
            Staff & Resource Management
          </h1>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StaffList />
        <WeeklySchedule />
      </div>

      <StaffStats />
    </div>
  );
}
