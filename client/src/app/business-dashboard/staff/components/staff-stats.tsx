"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Check, X, AlertTriangle } from "lucide-react";

const staff = [
  { id: 1, name: "Sarah Johnson", role: "Barista", status: "Available" },
  { id: 2, name: "Mike Chen", role: "Cashier", status: "Absent" },
  { id: 3, name: "Emma Davis", role: "Delivery", status: "Available" },
  { id: 4, name: "Alex Rodriguez", role: "Barista", status: "Absent" },
  { id: 5, name: "Lisa Park", role: "Cashier", status: "Available" },
];

export function StaffStats() {
  const availableStaff = staff.filter(
    (member) => member.status === "Available"
  ).length;
  const absentStaff = staff.filter(
    (member) => member.status === "Absent"
  ).length;

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Total Staff Available Today:
              </p>
              <p className="text-xl font-bold text-gray-900">
                {availableStaff}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <X className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Absent:</p>
              <p className="text-xl font-bold text-gray-900">{absentStaff}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Critical Gaps:</p>
              <p className="text-xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
