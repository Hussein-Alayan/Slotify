"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

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

export function ScheduleCard() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Today&#39;s Schedule
        </CardTitle>
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
                  <div className="font-medium text-gray-900">
                    {appointment.client}
                  </div>
                  <div className="text-sm text-gray-600">
                    {appointment.service}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {appointment.duration}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
