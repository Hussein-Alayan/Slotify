"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Edit, Trash2, User } from "lucide-react";

const clients = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    totalBookings: 24,
    noShows: 2,
    lastVisit: "Jan 15, 2025",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@company.com",
    phone: "+1 (555) 987-6543",
    totalBookings: 18,
    noShows: 0,
    lastVisit: "Jan 12, 2025",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    email: "emma.r@email.com",
    phone: "+1 (555) 456-7890",
    totalBookings: 31,
    noShows: 1,
    lastVisit: "Jan 18, 2025",
  },
];

export function ClientList() {
  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="border-b px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
              <div className="col-span-4">Client List</div>
              <div className="col-span-2 text-center">Bookings</div>
              <div className="col-span-2 text-center">No-shows</div>
              <div className="col-span-2 text-center">Last visit</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>
          </div>

          {clients.map((client) => (
            <div
              key={client.id}
              className="border-b last:border-b-0 px-6 py-4 hover:bg-gray-50"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {client.name}
                    </div>
                    <div className="text-sm text-gray-500">{client.email}</div>
                    <div className="text-sm text-gray-500">{client.phone}</div>
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <div className="text-lg font-semibold">
                    {client.totalBookings}
                  </div>
                  <div className="text-xs text-gray-500">Total Bookings</div>
                </div>
                <div className="col-span-2 text-center">
                  <div className="text-lg font-semibold">{client.noShows}</div>
                  <div className="text-xs text-gray-500">No-shows</div>
                </div>
                <div className="col-span-2 text-center">
                  <div className="text-sm">Last visit:</div>
                  <div className="text-sm font-medium">{client.lastVisit}</div>
                </div>
                <div className="col-span-2 flex items-center justify-center gap-2">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Showing 1 to 6 of 24 results
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button size="sm" className="bg-slate-900 text-white">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
