"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const upcomingAppointments = [
  {
    time: "9:00 AM",
    client: "Sarah Johnson",
    service: "Haircut & Styling",
    duration: "60 min",
  },
  {
    time: "11:30 AM",
    client: "Mike Chen",
    service: "Beard Trim",
    duration: "30 min",
  },
  {
    time: "2:00 PM",
    client: "Emma Davis",
    service: "Hair Color",
    duration: "90 min",
  },
  {
    time: "4:30 PM",
    client: "Alex Rodriguez",
    service: "Haircut",
    duration: "45 min",
  },
];

const FILTER_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "Last Week", value: "week" },
  { label: "Last Month", value: "month" },
  { label: "All Time", value: "all" },
];

export function ScheduleCard() {
  const [filter, setFilter] = useState("today");
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Today&#39;s Schedule
          </CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              {FILTER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingAppointments.map((appointment, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium text-blue-600 min-w-[60px]">
                  {appointment.time}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {appointment.client}
                  </div>
                  <div className="text-xs text-gray-500">
                    {appointment.service}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400 font-medium">
                {appointment.duration}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
