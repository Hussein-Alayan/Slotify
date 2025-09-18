"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export function ServicesStats({
  totalServices,
  activeServices,
}: {
  totalServices: number;
  activeServices: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {totalServices}
              </h3>
              <p className="text-gray-600">Total Services</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {activeServices}
              </h3>
              <p className="text-gray-600">Active Services</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
