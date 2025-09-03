"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CalendarDays, Clock, TrendingUp } from "lucide-react";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 bg-transparent"
          >
            <Users className="w-6 h-6" />
            <span>Add Client</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 bg-transparent"
          >
            <CalendarDays className="w-6 h-6" />
            <span>New Booking</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 bg-transparent"
          >
            <Clock className="w-6 h-6" />
            <span>View Schedule</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 bg-transparent"
          >
            <TrendingUp className="w-6 h-6" />
            <span>Analytics</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
