"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const recentActivity = [
  {
    client: "Sarah Johnson",
    action: "booked appointment",
    time: "2 hours ago",
    service: "Haircut & Styling",
  },
  {
    client: "Mark Wilson",
    action: "cancelled appointment",
    time: "4 hours ago",
    service: "Beard Trim",
  },
  {
    client: "Emma Davis",
    action: "completed appointment",
    time: "6 hours ago",
    service: "Hair Color",
  },
  {
    client: "New client",
    action: "registered",
    time: "8 hours ago",
    service: "Account created",
  },
];

export function ActivityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.client}</span>{" "}
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500">{activity.service}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
