"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarDays } from "lucide-react";

type StatsGridProps = {
  totalClients: number;
};

export function StatsGrid({ totalClients }: StatsGridProps) {
  const stats = [
    {
      title: "Total Clients",
      value: totalClients.toString(),
      change: "",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Today's Bookings",
      value: "18",
      change: "3 pending confirmations",
      icon: CalendarDays,
      color: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
