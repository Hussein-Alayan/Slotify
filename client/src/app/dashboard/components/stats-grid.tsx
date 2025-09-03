"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarDays, DollarSign, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Total Clients",
    value: "247",
    change: "+12 from last month",
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
  {
    title: "Monthly Revenue",
    value: "$12,450",
    change: "+8.2% from last month",
    icon: DollarSign,
    color: "text-emerald-600",
  },
  {
    title: "No-show Rate",
    value: "8.2%",
    change: "-2.1% from last month",
    icon: TrendingUp,
    color: "text-orange-600",
  },
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
