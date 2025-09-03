"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const weekDays = [
  { day: "Mon 13", date: "2025-01-13" },
  { day: "Tue 14", date: "2025-01-14" },
  { day: "Wed 15", date: "2025-01-15" },
  { day: "Thu 16", date: "2025-01-16" },
  { day: "Fri 17", date: "2025-01-17" },
  { day: "Sat 18", date: "2025-01-18" },
  { day: "Sun 19", date: "2025-01-19" },
];

const timeSlots = [
  { time: "9 AM", slot: "morning" },
  { time: "1 PM", slot: "afternoon" },
  { time: "5 PM", slot: "evening" },
];

const schedule: {
  [date: string]: { [slot: string]: string };
} = {
  "2025-01-13": {
    evening: "Lisa P.",
  },
  "2025-01-14": {
    morning: "Mike C.",
    afternoon: "Sarah J.",
    evening: "Pending",
  },
  "2025-01-15": {
    morning: "Absent",
    afternoon: "Lisa P.",
    evening: "Alex R.",
  },
  "2025-01-16": {
    morning: "Emma D.",
    afternoon: "Absent",
    evening: "Sarah J.",
  },
  "2025-01-17": {
    morning: "Pending",
    afternoon: "Emma D.",
    evening: "Emma D.",
  },
  "2025-01-18": {
    morning: "Lisa P.",
    afternoon: "Mike C.",
    evening: "Absent",
  },
  "2025-01-19": {
    morning: "Closed",
    afternoon: "Closed",
    evening: "Closed",
  },
};

export function WeeklySchedule() {
  const getShiftStatus = (assignment: string) => {
    if (assignment === "Absent") return "absent";
    if (assignment === "Pending") return "pending";
    if (assignment === "Closed") return "closed";
    return "assigned";
  };

  const getShiftColor = (status: string) => {
    switch (status) {
      case "absent":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      case "closed":
        return "text-gray-400";
      default:
        return "text-gray-900";
    }
  };

  return (
    <div className="lg:col-span-2">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Weekly Shift Calendar
        </h2>
      </div>
      <div className="overflow-x-auto">
        <Card>
          <CardContent className="p-6 min-w-[700px]">
            {/* Calendar Header */}
            <div className="grid grid-cols-8 gap-4 mb-4">
              <div></div>
              {weekDays.map((day) => (
                <div key={day.date} className="text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {day.day}
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot.time} className="grid grid-cols-8 gap-4 mb-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600">
                    {timeSlot.time}
                  </span>
                </div>
                {weekDays.map((day) => {
                  const assignment =
                    schedule[day.date]?.[timeSlot.slot] || "Unassigned";
                  const status = getShiftStatus(assignment);
                  const colorClass = getShiftColor(status);

                  return (
                    <div
                      key={`${day.date}-${timeSlot.slot}`}
                      className={cn(
                        "p-2 text-center text-sm rounded border border-gray-200 bg-gray-50 flex items-center justify-center min-h-[40px]",
                        assignment === "Unassigned" && "text-gray-400"
                      )}
                    >
                      <span className={cn("font-medium", colorClass)}>
                        {assignment}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-900 rounded"></div>
                  <span>Assigned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded"></div>
                  <span>Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-600 rounded"></div>
                  <span>Pending Replacement</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
