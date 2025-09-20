"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

type DayOfWeek = (typeof weekDays)[number];
type StaffSchedule = Partial<Record<DayOfWeek, string[]>>;

const mockScheduleData: Record<string, StaffSchedule> = {
  "Sarah Johnson": {
    Mon: ["9AM", "10AM", "2PM", "3PM"],
    Tue: ["9AM", "11AM", "1PM", "4PM"],
    Wed: ["10AM", "11AM", "2PM", "5PM"],
    Thu: ["9AM", "12PM", "1PM", "3PM"],
    Fri: ["10AM", "11AM", "2PM", "4PM"],
  },
  "Mike Chen": {
    Mon: ["6AM", "7AM", "5PM", "6PM"],
    Tue: ["6AM", "8AM", "4PM", "7PM"],
    Wed: ["7AM", "9AM", "5PM", "6PM"],
    Thu: ["6AM", "8AM", "4PM", "7PM"],
    Fri: ["7AM", "9AM", "5PM", "6PM"],
    Sat: ["8AM", "9AM", "10AM", "11AM"],
  },
  "Dr. Emily Rodriguez": {
    Tue: ["8AM", "10AM", "2PM", "4PM"],
    Wed: ["9AM", "11AM", "1PM", "5PM"],
    Thu: ["8AM", "10AM", "3PM", "5PM"],
  },
};

export function StaffCalendar() {
  const staffMembers = Object.keys(mockScheduleData);

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header with days */}
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="font-semibold text-gray-900 p-2">Staff Member</div>
            {weekDays.map((day) => (
              <div
                key={day}
                className="font-semibold text-gray-900 p-2 text-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Staff rows */}
          {staffMembers.map((staffName) => (
            <div
              key={staffName}
              className="grid grid-cols-8 gap-2 mb-3 border-b border-gray-100 pb-3"
            >
              <div className="p-2 font-medium text-gray-900 flex items-center">
                {staffName}
              </div>
              {weekDays.map((day) => (
                <div key={day} className="p-2 min-h-[80px] bg-gray-50 rounded">
                  <div className="space-y-1">
                    {mockScheduleData[staffName]?.[day]?.map(
                      (time: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-blue-100 text-blue-800"
                        >
                          {time}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
