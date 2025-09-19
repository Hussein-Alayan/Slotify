"use client";

import { Button } from "@/components/ui/button";
import { Plus, Calendar, List } from "lucide-react";

interface StaffHeaderProps {
  viewMode: "table" | "calendar";
  onViewModeChange: (mode: "table" | "calendar") => void;
  onAddStaff: () => void;
}

export function StaffHeader({
  viewMode,
  onViewModeChange,
  onAddStaff,
}: StaffHeaderProps) {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Manage Your Team & Resources
        </h1>
        <p className="text-gray-600">
          Keep your staff schedules and resources organized in one place.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("table")}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            Table View
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("calendar")}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Calendar View
          </Button>
        </div>

        <Button
          variant="default"
          size="sm"
          onClick={onAddStaff}
          className="flex items-center gap-2 font-bold"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>
    </div>
  );
}
