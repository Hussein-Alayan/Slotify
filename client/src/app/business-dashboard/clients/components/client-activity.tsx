"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Download } from "lucide-react";

const recentActivity = [
  { text: "Sarah Johnson booked appointment", time: "2 hours ago" },
  { text: "Mark Wilson cancelled appointment", time: "4 hours ago" },
  { text: "New client registration", time: "6 hours ago" },
];

export function ClientActivity() {
  return (
    <div className="space-y-6">
      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="text-sm text-gray-900">{activity.text}</div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
            >
              <User className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Send Bulk Message
            </Button>
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Client Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
