"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Check, X } from "lucide-react";

const staff = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Barista",
    status: "Available",
    avatar: null,
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Cashier",
    status: "Absent",
    avatar: null,
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Delivery",
    status: "Available",
    avatar: null,
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    role: "Barista",
    status: "Absent",
    avatar: null,
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "Cashier",
    status: "Available",
    avatar: null,
  },
];

export function StaffList() {
  return (
    <div className="lg:col-span-1">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Staff List</h2>
      </div>

      <div className="space-y-4">
        {staff.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  {member.status === "Available" ? (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Available
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-red-100 text-red-800"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Absent
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
