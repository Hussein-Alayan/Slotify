"use client";

import { Card, CardContent } from "@/components/ui/card";

export function ClientStats() {
  return (
    <Card className="bg-slate-900 text-white">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Total Clients</span>
            <span className="text-xl font-bold">247</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Active This Month</span>
            <span className="text-xl font-bold">189</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">New Clients</span>
            <span className="text-xl font-bold text-green-400">+12</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">No-show Rate</span>
            <span className="text-xl font-bold">8.2%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
